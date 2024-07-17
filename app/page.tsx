'use client'

import dynamic from 'next/dynamic'
import '@tldraw/tldraw/tldraw.css'
import { RiskyButCoolAPIKeyInput } from './components/RiskyButCoolAPIKeyInput'
import { MakeRealButton } from './components/MakeRealButton'
import { PreviewShapeUtil } from './PreviewShape/PreviewShape'
import { makeReal } from './makeReal'

const handleMakeReal = (editor: Editor) => {
  const apiKeyInput = document.getElementById('openrouter_key_risky_but_cool') as HTMLInputElement;
  const apiKey = apiKeyInput?.value ?? '';
  makeReal(editor, apiKey);
};

const Tldraw = dynamic(async () => (await import('@tldraw/tldraw')).Tldraw, {
	ssr: false,
})

const shapeUtils = [PreviewShapeUtil]

export default function App() {
	return (
		<div className="editor">
			<Tldraw
				persistenceKey="make-real"
				shapeUtils={shapeUtils}
				overrides={{
					actions: (editor, actions) => {
						return {
							...actions,
							'make-real': {
								id: 'make-real',
								label: 'Make Real',
								readonlyOk: true,
								onSelect: () => {
									handleMakeReal(editor);
								},
							},
						}
					},
				}}
			>
				<div className="api-key-and-button-container">
					<RiskyButCoolAPIKeyInput />
					<MakeRealButton />
				</div>
			</Tldraw>
		</div>
	)
}
