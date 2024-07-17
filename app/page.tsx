'use client'

import dynamic from 'next/dynamic'
import '@tldraw/tldraw/tldraw.css'
import { MakeRealButton } from './components/MakeRealButton'
import { TldrawLogo } from './components/TldrawLogo'
import { RiskyButCoolAPIKeyInput } from './components/RiskyButCoolAPIKeyInput'
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
									editor.setCurrentTool('select')
									editor.addDialog({
										component: MakeRealButton,
										onClose: () => {
											editor.deleteDialog('make-real')
										},
									})
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
