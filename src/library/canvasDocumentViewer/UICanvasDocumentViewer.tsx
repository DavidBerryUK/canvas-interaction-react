import React, { useRef, useEffect } from 'react';
import type ICanvasDocumentViewerSceneProvider from './interfaces/ICanvasDocumentViewerSceneProvider';
import UIInstructions from './sections/instructions/UIInstructions';
import useDrawCanvas from './hooks/UseDrawCanvas';
import useEventHandlersKeyboard from './hooks/UseEventHandlersKeyboard';
import useEventHandlersMouse from './hooks/UseEventHandlersMouse';
import useHandleCanvasResize from './hooks/UseHandleCanvasResize';
import useHandleTouchEvents from './hooks/UseHandleTouchEvents';
import useCanvasDocumentState from './hooks/UseCanvasDocumentState';
import useCanvasNavigation from './hooks/UseCanvasNavigation';
import type Size from '../geometry/Size';

interface IProperties {
	sceneProvider: ICanvasDocumentViewerSceneProvider;
}

const UICanvasDocumentViewer: React.FC<IProperties> = (props) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const { canvasState } = useCanvasDocumentState();
	const { render } = useDrawCanvas(canvasState, canvasRef, props.sceneProvider);
	const { mouseEvents } = useEventHandlersMouse(canvasState, canvasRef);
	const { keyboardEvents } = useEventHandlersKeyboard(canvasState, props.sceneProvider, canvasRef);
	const { touchEvents } = useHandleTouchEvents(canvasState, canvasRef);
	const { navigate } = useCanvasNavigation(canvasRef, canvasState, props.sceneProvider);
	let firstResize = true;

	const handleCanvasResized = (_: Size) => {
		if (!firstResize) {
			return;
		}
		firstResize = true;
		navigate.zoomToFit(false);
	};

	useHandleCanvasResize(canvasRef, handleCanvasResized);

	useEffect(() => {
		const canvas = canvasRef.current!;

		// Mouse + touch handlers
		canvas.addEventListener('mousedown', mouseEvents.handleMouseDownEvent);
		window.addEventListener('mousemove', mouseEvents.handleMouseMouseEvent);
		window.addEventListener('mouseup', mouseEvents.handleMouseUpEvent);
		window.addEventListener('wheel', mouseEvents.handleWheelEvent, { passive: false });
		// Pinch zoom
		canvas.addEventListener('touchstart', touchEvents.handleTouchStartEvent, { passive: false });
		canvas.addEventListener('touchmove', touchEvents.handleTouchMoveEvent, { passive: false });
		// Keyboard shortcuts
		window.addEventListener('keydown', keyboardEvents.handleKeyDownEvent);

		// render canvas
		render();

		// Cleanup function to remove listeners
		return () => {
			canvas.removeEventListener('mousedown', mouseEvents.handleMouseDownEvent);
			window.removeEventListener('mousemove', mouseEvents.handleMouseMouseEvent);
			window.removeEventListener('mouseup', mouseEvents.handleMouseUpEvent);
			window.removeEventListener('wheel', mouseEvents.handleWheelEvent);
			canvas.removeEventListener('touchmove', touchEvents.handleTouchMoveEvent);
			canvas.removeEventListener('touchstart', touchEvents.handleTouchStartEvent);

			window.removeEventListener('keydown', keyboardEvents.handleKeyDownEvent);
		};
	}, []);

	return (
		<div className="canvas-container">
			<canvas ref={canvasRef} />
			<UIInstructions state={canvasState} />
		</div>
	);
};

export default UICanvasDocumentViewer;
