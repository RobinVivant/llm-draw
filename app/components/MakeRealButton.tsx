import { useEditor, useToasts } from '@tldraw/tldraw'
import { useCallback } from 'react'
import { makeReal } from '../makeReal'

export function MakeRealButton() {
	const editor = useEditor()
	const { addToast } = useToasts()

	const handleClick = useCallback(async () => {
		console.log('makeReal function:', makeReal) // Add this line to check if makeReal is imported
		try {
			const input = document.getElementById('openrouter_key_risky_but_cool') as HTMLInputElement
			const apiKey = input?.value ?? null
			if (!apiKey) throw Error('Make sure the input includes your API Key!')
			await makeReal(editor, apiKey)
		} catch (e) {
			console.error(e)
			addToast({
				icon: 'cross-2',
				title: 'Something went wrong',
				description: (e as Error).message.slice(0, 100),
			})
		}
	}, [editor, addToast])

	return (
		<button className="makeRealButton" onClick={handleClick}>
			Make Real
		</button>
	)
}
