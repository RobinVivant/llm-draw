import { createShapeId, Editor, getSvgAsImage } from '@tldraw/tldraw'
import { getSelectionAsText } from './lib/getSelectionAsText'
import { getHtmlFromOpenRouter } from './lib/getHtmlFromOpenRouter'
import { blobToBase64 } from './lib/blobToBase64'
import { addGridToSvg } from './lib/addGridToSvg'
import { PreviewShape } from './PreviewShape/PreviewShape'

export async function makeReal(editor: Editor, apiKey: string, prompt: string) {
	// Get the selected shapes (we need at least one)
	const selectedShapes = editor.getSelectedShapes()

	if (selectedShapes.length === 0) throw Error('First select something to make real.')

	// Create the preview shape
	const { maxX, midY } = editor.getSelectionPageBounds()!
	const newShapeId = createShapeId()
	editor.createShape<PreviewShape>({
		id: newShapeId,
		type: 'response',
		x: maxX + 60, // to the right of the selection
		y: midY - (540 * 2) / 3 / 2, // half the height of the preview's initial shape
		props: { html: '' },
	})

	// Remove deleted shapes from persistent storage
	const allShapes = editor.getShapesInPage()
	const persistedShapes = allShapes.filter(shape => !shape.isDeleted)
	editor.store.put(persistedShapes)

	// Get an SVG based on the selected shapes
	const mappedShapes = selectedShapes.map((shape) => shape.id)
	const svgElement = await editor.getSvgElement(
		mappedShapes,
		{
			scale: 1,
			background: true,
		})

	const svgElementString = await editor.getSvgString(
		mappedShapes,
		{
			scale: 1,
			background: true,
		})

	if (!svgElement) {
		throw Error('Could not get the SVG element.')
	}

	// Add the grid lines to the SVG
	const grid = { color: 'red', size: 100, labels: true }

	addGridToSvg(editor, { svg: svgElement.svg, width: svgElement.width, height: svgElement.height }, grid)

	// Turn the SVG into a DataUrl
	const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
	const blob = await getSvgAsImage(editor, svgElementString?.svg ?? '', {
		type: 'png',
		quality: 0.8,
		scale: 1,
		width: svgElement.width,
		height: svgElement.height,
	})
	const dataUrl = await blobToBase64(blob!)
	// downloadDataURLAsFile(dataUrl, 'tldraw.png')

	// Get any previous previews among the selected shapes
	const previousPreviews = selectedShapes.filter((shape) => {
		return shape.type === 'response'
	}) as PreviewShape[]

	// Send everything to OpenAI and get some HTML back
	try {
		const json = await getHtmlFromOpenRouter({
			image: dataUrl,
			apiKey,
			text: getSelectionAsText(editor),
			previousPreviews,
			grid,
			theme: editor.user.getUserPreferences().isDarkMode ? 'dark' : 'light',
			prompt: prompt || undefined,
		})

		if (!json) {
			throw Error('Could not contact OpenRouter.')
		}

		if (json?.error) {
			throw Error(`${json.error.message?.slice(0, 128)}...`)
		}

		// Extract the HTML from the response
		const message = json.choices[0].message.content
		const start = message.indexOf('<!DOCTYPE html>')
		const end = message.indexOf('</html>')
		const html = message.slice(start, end + '</html>'.length)

		// No HTML? Something went wrong
		if (html.length < 100) {
			console.warn(message)
			throw Error('Could not generate a design from those wireframes.')
		}

		// Update the shape with the new props
		editor.updateShape<PreviewShape>({
			id: newShapeId,
			type: 'response',
			props: {
				html,
			},
		})

		console.log(`Prompt: ${prompt}`)
		console.log(`Response: ${message}`)
	} catch (e) {
		// If anything went wrong, delete the shape.
		editor.deleteShape(newShapeId)
		throw e
	}
}
