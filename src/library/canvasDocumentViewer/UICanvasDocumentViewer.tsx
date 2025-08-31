import './Style.scss';
import CanvasContext from './models/CanvasContext';
import React, { useRef, useEffect } from 'react';
import type ICanvasDocumentViewerSceneProvider from './interfaces/ICanvasDocumentViewerSceneProvider';
import UIInstructions from './sections/instructions/UIInstructions';
import useCanvasNavigation from './hooks/UseCanvasNavigation';
import useDrawCanvas from './hooks/UseDrawCanvas';
import useHandleCanvasResize from './hooks/UseHandleCanvasResize';
import useRegisterKeyboardEvents from './hooks/UseRegisterKeyboardEvents';

interface IProperties {
	sceneProvider: React.RefObject<ICanvasDocumentViewerSceneProvider>;
}

// 👇 Exposed ref type
export interface UICanvasDocumentViewerRef {
	navigate: ReturnType<typeof useCanvasNavigation>['navigate'];
}

const UICanvasDocumentViewer = React.forwardRef<UICanvasDocumentViewerRef, IProperties>(({ sceneProvider }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvasState = useRef<CanvasContext>(new CanvasContext());

	const { render } = useDrawCanvas(canvasState, canvasRef, sceneProvider);
	const { navigate } = useCanvasNavigation(canvasRef, canvasState, sceneProvider);
	useRegisterKeyboardEvents(canvasState, canvasRef, sceneProvider);

	const firstResizeRef = useRef(true);

	const handleCanvasResized = () => {
		if (!firstResizeRef.current) return;
		firstResizeRef.current = false;
		navigate.zoomToFit(false);
	};

	useHandleCanvasResize(canvasRef, handleCanvasResized);

	useEffect(() => {
		render();
		navigate.zoomToFit(false);
	}, []);

	// 👇 Expose `navigate` back to parent via ref
	React.useImperativeHandle(ref, () => ({
		navigate,
	}));

	return (
		<div className="ui-canvas-document-viewer">
			<canvas ref={canvasRef} />
			<UIInstructions state={canvasState} />
		</div>
	);
});

export default UICanvasDocumentViewer;
