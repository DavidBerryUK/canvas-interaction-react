import './Style.scss';
import React, { useRef, useEffect } from 'react';
import type ICanvasDocumentViewerSceneProvider from './interfaces/ICanvasDocumentViewerSceneProvider';
import UIInstructions from './sections/instructions/UIInstructions';
import useCanvasDocumentState from './hooks/UseCanvasDocumentState';
import useCanvasNavigation from './hooks/UseCanvasNavigation';
import useDrawCanvas from './hooks/UseDrawCanvas';
import useEventHandlersKeyboard from './hooks/UseEventHandlersKeyboard';
import useEventHandlersMouse from './hooks/UseEventHandlersMouse';
import useHandleCanvasResize from './hooks/UseHandleCanvasResize';
import useHandleTouchEvents from './hooks/UseHandleTouchEvents';

interface IProperties {
	sceneProvider: ICanvasDocumentViewerSceneProvider;
}

const UICanvasDocumentViewer: React.FC<IProperties> = ({ sceneProvider }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const { canvasState } = useCanvasDocumentState();
	const { render } = useDrawCanvas(canvasState, canvasRef, sceneProvider);
	const { mouseEvents } = useEventHandlersMouse(canvasState, canvasRef);
	const { keyboardEvents } = useEventHandlersKeyboard(canvasState, sceneProvider, canvasRef);
	const { touchEvents } = useHandleTouchEvents(canvasState, canvasRef);
	const { navigate } = useCanvasNavigation(canvasRef, canvasState, sceneProvider);

	const firstResizeRef = useRef(true);

	const handleCanvasResized = () => {
		if (!firstResizeRef.current) return;
		firstResizeRef.current = false;
		navigate.zoomToFit(false);
	};

	useHandleCanvasResize(canvasRef, handleCanvasResized);

	// Ensure canvas re-renders if the provider changes
	useEffect(() => {
		render();
	}, [render, sceneProvider]);

	// Attach event listeners with up-to-date refs
	useEffect(() => {
		const canvas = canvasRef.current!;
		const handleMouseDown = (e: MouseEvent) => mouseEvents.handleMouseDownEvent(e);
		const handleMouseMove = (e: MouseEvent) => mouseEvents.handleMouseMouseEvent(e);
		const handleMouseUp = () => mouseEvents.handleMouseUpEvent();
		const handleWheel = (e: WheelEvent) => mouseEvents.handleWheelEvent(e);
		const handleTouchStart = (e: TouchEvent) => touchEvents.handleTouchStartEvent(e);
		const handleTouchMove = (e: TouchEvent) => touchEvents.handleTouchMoveEvent(e);
		const handleKeyDown = (e: KeyboardEvent) => keyboardEvents.handleKeyDownEvent(e);

		canvas.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('wheel', handleWheel, { passive: false });
		canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
		canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('wheel', handleWheel);
			canvas.removeEventListener('touchstart', handleTouchStart);
			canvas.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [mouseEvents, touchEvents, keyboardEvents]); // reattach if handlers change

	return (
		<div className="ui-canvas-document-viewer">
			<canvas ref={canvasRef} />
			<UIInstructions state={canvasState} />
		</div>
	);
};

export default UICanvasDocumentViewer;
