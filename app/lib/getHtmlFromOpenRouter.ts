import { PreviewShape } from '../PreviewShape/PreviewShape'
import {
	OPEN_ROUTER_SYSTEM_PROMPT,
	OPENROUTER_USER_PROMPT,
	OPENROUTER_USER_PROMPT_WITH_PREVIOUS_DESIGN,
} from '../prompt'

export async function getHtmlFromOpenRouter({
																							image,
																							apiKey,
																							text,
																							grid,
																							theme = 'light',
																							previousPreviews = [],
																						}: {
	image: string
	apiKey: string
	text: string
	theme?: string
	grid?: {
		color: string
		size: number
		labels: boolean
	}
	previousPreviews?: PreviewShape[]
	prompt: string | undefined
}) {
	if (!apiKey) throw Error('You need to provide an OpenRouter API key (sorry)')

	const messages: Sonnet35CompletionRequest['messages'] = [
		{
			role: 'system',
			content: OPEN_ROUTER_SYSTEM_PROMPT,
		},
		{
			role: 'user',
			content: [],
		},
	]

	const userContent = messages[1].content as Exclude<MessageContent, string>

	// Add the prompt into
	userContent.push({
		type: 'text',
		text:
			previousPreviews?.length > 0 ? OPENROUTER_USER_PROMPT_WITH_PREVIOUS_DESIGN : OPENROUTER_USER_PROMPT,
	})

	// Add the image
	userContent.push({
		type: 'image_url',
		image_url: {
			url: image,
			detail: 'high',
		},
	})

	// Add the strings of text
	if (text) {
		userContent.push({
			type: 'text',
			text: `Here's a list of text that we found in the design:\n${text}`,
		})
	}

	if (grid) {
		userContent.push({
			type: 'text',
			text: `The designs have a ${grid.color} grid overlaid on top. Each cell of the grid is ${grid.size}x${grid.size}px.`,
		})
	}

	// Add the previous previews as HTML
	for (let i = 0; i < previousPreviews.length; i++) {
		const preview = previousPreviews[i]
		userContent.push(
			{
				type: 'text',
				text: `The designs also included one of your previous result. Here's the image that you used as its source:`,
			},
			{
				type: 'text',
				text: `And here's the HTML you came up with for it: ${preview.props.html}`,
			},
		)
	}

	// Add the additional prompt if provided
	if (prompt) {
		userContent.push({
			type: 'text',
			text: `Additional instructions: ${prompt}`,
		})
	}

	// Prompt the theme
	userContent.push({
		type: 'text',
		text: `Please make your result use the ${theme} theme.`,
	})

	const body: Sonnet35CompletionRequest = {
		model: 'anthropic/claude-3.5-sonnet:beta',
		messages,
	}

	let json = null

	try {
		const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`,
				'HTTP-Referer': 'https://your-site-url.com', // Replace with your actual site URL
				'X-Title': 'Make Real Starter', // Replace with your app's name
			},
			body: JSON.stringify(body),
		})
		json = await resp.json()
	} catch (e: any) {
		throw Error(`Could not contact OpenRouter: ${e.message}`)
	}

	return json
}

type MessageContent =
	| string
	| (
	| string
	| {
	type: 'image_url'
	image_url:
		| string
		| {
		url: string
		detail: 'low' | 'high' | 'auto'
	}
}
	| {
	type: 'text'
	text: string
}
	)[]

export type Sonnet35CompletionRequest = {
	model: string
	messages: {
		role: 'system' | 'user' | 'assistant'
		content: MessageContent
	}[]
	temperature?: number | undefined
	top_p?: number | undefined
	max_tokens?: number | undefined
	n?: number | undefined
	best_of?: number | undefined
	frequency_penalty?: number | undefined
	presence_penalty?: number | undefined
	seed?: number | undefined
	logit_bias?:
		| {
		[x: string]: number
	}
		| undefined
	stop?: (string[] | string) | undefined
}
