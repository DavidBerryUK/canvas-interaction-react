import React, { useRef, useEffect } from 'react';
import useEventHandlersMouse from './hooks/UseEventHandlersMouse';
import useDrawCanvas from './hooks/UseDrawCanvas';
import useEventHandlersKeyboard from './hooks/UseEventHandlersKeyboard';
import useHandleTouchEvents from './hooks/UseHandleTouchEvents';
import useHandleCanvasResize from './hooks/UseHandleCanvasResize';

export class CanvanContext {
	scale = 1;
	targetScale = 1;
	offsetX = 0;
	offsetY = 0;
	targetX = 0;
	targetY = 0;
	isDragging = false;
	lastX = 0;
	lastY = 0;
	minX = Infinity;
	minY = Infinity;
	maxX = -Infinity;
	maxY = -Infinity;
	lastDist = 0;
	pinchMidX = 0;
	pinchMidY = 0;
	lastMouseX = 0; // track cursor for keyboard zoom
	lastMouseY = 0;
}

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

	const { render } = useDrawCanvas(context, canvasRef, regions);
	const { handleMouseDownEvent, handleMouseMouseEvent, handleMouseUpEvent, handleWheelEvent } = useEventHandlersMouse(context, canvasRef);
	const { handleKeyDownEvent } = useEventHandlersKeyboard(context, canvasRef, regions);
	const { handleTouchStartEvent, handleTouchMoveEvent } = useHandleTouchEvents(context, canvasRef);
	useHandleCanvasResize(canvasRef);

	useEffect(() => {
		const canvas = canvasRef.current!;

		// Mouse + touch handlers
		canvas.addEventListener('mousedown', handleMouseDownEvent);
		canvas.addEventListener('mousemove', handleMouseMouseEvent);
		window.addEventListener('mouseup', handleMouseUpEvent);
		canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
		// Pinch zoom
		canvas.addEventListener('touchstart', handleTouchStartEvent, { passive: false });
		canvas.addEventListener('touchmove', handleTouchMoveEvent, { passive: false });
		// Keyboard shortcuts
		window.addEventListener('keydown', handleKeyDownEvent);

		// render canvas
		render();
	}, []);

	return (
		<div className="canvas-container">
			<canvas ref={canvasRef} />
		</div>
	);
};

export default CanvasViewer;
