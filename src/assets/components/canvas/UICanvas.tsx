import React, { useRef, useEffect } from 'react';
import useEventHandlersMouse from './hooks/UseEventHandlersMouse';
import useDrawCanvas from './hooks/UseDrawCanvas';
import useEventHandlersKeyboard from './hooks/UseEventHandlersKeyboard';

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

	useEffect(() => {
		const canvas = canvasRef.current!;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const handleTouchStartEvent = (e: TouchEvent) => {
			if (e.touches.length === 2) {
				const dx = e.touches[0].clientX - e.touches[1].clientX;
				const dy = e.touches[0].clientY - e.touches[1].clientY;
				context.lastDist = Math.hypot(dx, dy);

				// Midpoint in screen coords
				context.pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
				context.pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
			}
		};

		const handleTouchMoveEvent = (e: TouchEvent) => {
			if (e.touches.length === 2) {
				e.preventDefault();

				const dx = e.touches[0].clientX - e.touches[1].clientX;
				const dy = e.touches[0].clientY - e.touches[1].clientY;
				const dist = Math.hypot(dx, dy);
				const zoom = dist / context.lastDist;

				// Convert midpoint to world coords before zoom
				const rect = canvas.getBoundingClientRect();
				const cursorX = context.pinchMidX - rect.left;
				const cursorY = context.pinchMidY - rect.top;
				const worldX = (cursorX - context.targetX) / context.targetScale;
				const worldY = (cursorY - context.targetY) / context.targetScale;

				context.targetScale *= zoom;

				// Adjust offset so pinch midpoint stays fixed
				context.targetX = cursorX - worldX * context.targetScale;
				context.targetY = cursorY - worldY * context.targetScale;

				context.lastDist = dist;
			}
		};

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
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();
		render();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	return (
		<div>
			<canvas ref={canvasRef} />;
		</div>
	);
};

export default CanvasViewer;
