import { useBreakpoint } from '@tldraw/tldraw'
import { ChangeEvent, useCallback } from 'react'

export function RiskyButCoolAPIKeyInput() {
	const breakpoint = useBreakpoint()

	// Store the API key locally, but ONLY in development mode
	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		localStorage.setItem('openrouter_key', e.target.value)
	}, [])

	const handleQuestionMessage = useCallback(() => {
		window.alert(
			`If you have an OpenRouter.ai API key, you can put it in this input and it will be used when making requests.\n\nSee https://openrouter.ai/keys to get a key.\n\nPutting API keys into boxes is generally a bad idea! If you have any concerns, create an API key and then revoke it after using this site.`
		)
	}, [])

	return (
		<div className={`your-own-api-key ${breakpoint < 5 ? 'your-own-api-key__mobile' : ''}`}>
			<div className="your-own-api-key__inner">
				<div className="input__wrapper">
					<input
						id="openrouter_key_risky_but_cool"
						defaultValue={
							localStorage.getItem('openrouter_key') ?? process.env.OPENROUTER_API_KEY ?? ''
						}
						onChange={handleChange}
						spellCheck={false}
						autoCapitalize="off"
						placeholder="Your OpenRouter API Key (risky but cool)"
					/>
				</div>
				<button className="question__button" onClick={handleQuestionMessage}>
					?
				</button>
			</div>
		</div>
	)
}
