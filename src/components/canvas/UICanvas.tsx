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
	const { render } = useDrawCanvas(context, canvasRef, sceneProvider, regions);
	const { handleMouseDownEvent, handleMouseMouseEvent, handleMouseUpEvent, handleWheelEvent } = useEventHandlersMouse(context, canvasRef);
	const { handleKeyDownEvent } = useEventHandlersKeyboard(context, canvasRef, regions);
	const { handleTouchStartEvent, handleTouchMoveEvent } = useHandleTouchEvents(context, canvasRef);
	useHandleCanvasResize(canvasRef);

	const cleanUp = () => {
		const canvas = canvasRef.current!;
	};

	useEffect(() => {
		const canvas = canvasRef.current!;

		// Mouse + touch handlers
		canvas.addEventListener('mousedown', handleMouseDownEvent);
		window.addEventListener('mousemove', handleMouseMouseEvent);
		window.addEventListener('mouseup', handleMouseUpEvent);
		window.addEventListener('wheel', handleWheelEvent, { passive: false });
		// Pinch zoom
		canvas.addEventListener('touchstart', handleTouchStartEvent, { passive: false });
		canvas.addEventListener('touchmove', handleTouchMoveEvent, { passive: false });
		// Keyboard shortcuts
		window.addEventListener('keydown', handleKeyDownEvent);

		// render canvas
		render();

		// Cleanup function to remove listeners
		return () => {
			canvas.removeEventListener('mousedown', handleMouseDownEvent);
			window.removeEventListener('mousemove', handleMouseMouseEvent);
			window.removeEventListener('mouseup', handleMouseUpEvent);
			window.removeEventListener('wheel', handleWheelEvent);
			canvas.removeEventListener('touchmove', handleTouchMoveEvent);
			canvas.removeEventListener('touchstart', handleTouchStartEvent);

			window.removeEventListener('keydown', handleKeyDownEvent);
		};
	}, []);

	return (
		<div className="canvas-container">
			<canvas ref={canvasRef} />
		</div>
	);
};

export default CanvasViewer;
