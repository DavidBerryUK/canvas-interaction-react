import CanvanContext from './models/canvasContext';
import DemoSceneProvider from '../../sceneProviders/demo/DemoSceneProvider';
import React, { useRef, useEffect } from 'react';
import useDrawCanvas from './hooks/UseDrawCanvas';
import useEventHandlersKeyboard from './hooks/UseEventHandlersKeyboard';
import useEventHandlersMouse from './hooks/UseEventHandlersMouse';
import useHandleCanvasResize from './hooks/UseHandleCanvasResize';
import useHandleTouchEvents from './hooks/UseHandleTouchEvents';

// Predefined zoom regions
const regions: Record<string, { x: number; y: number; width: number; height: number }> = {
	'1': { x: 40, y: 40, width: 240, height: 240 },
	'2': { x: 300, y: 200, width: 200, height: 200 },
	'3': { x: 580, y: 80, width: 200, height: 200 },
	'4': { x: 200, y: 400, width: 250, height: 200 },
};

const CanvasViewer: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const context = new CanvanContext();
	const sceneProvider = new DemoSceneProvider();
	const { render } = useDrawCanvas(context, canvasRef, sceneProvider);
	const { mouseEvents } = useEventHandlersMouse(context, canvasRef);
	const { keyboardEvents } = useEventHandlersKeyboard(context, canvasRef, regions);
	const { touchEvents } = useHandleTouchEvents(context, canvasRef);

	useHandleCanvasResize(canvasRef);

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
		</div>
	);
};

export default CanvasViewer;
