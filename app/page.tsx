'use client'

import dynamic from 'next/dynamic'
import '@tldraw/tldraw/tldraw.css'
import { TldrawLogo } from './components/TldrawLogo'
import { RiskyButCoolAPIKeyInput } from './components/RiskyButCoolAPIKeyInput'
import { MakeRealButton } from './components/MakeRealButton'
import { PreviewShapeUtil } from './PreviewShape/PreviewShape'

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
									editor.setCurrentTool('make-real')
								},
							},
						}
					},
					tools: (editor, tools) => {
						return {
							...tools,
							'make-real': {
								id: 'make-real',
								icon: 'tool',
								label: 'Make Real',
								onSelect: () => {
									// Implement your Make Real functionality here
									console.log('Make Real tool selected')
									// You can call your makeReal function here
								},
								onDeselect: () => {
									editor.setCurrentTool('select')
								},
							},
						}
					},
				}}
			>
				<TldrawLogo />
				<RiskyButCoolAPIKeyInput />
			</Tldraw>
		</div>
	)
}
