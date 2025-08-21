import type { CanvanContext } from '../UICanvas';

const useEventHandlersMouse = (context: CanvanContext, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	const handleMouseDownEvent = (e: MouseEvent) => {
		context.isDragging = true;
		context.lastX = e.clientX;
		context.lastY = e.clientY;
	};

	const handleMouseMouseEvent = (e: MouseEvent) => {
		// Track last mouse position for keyboard zoom
		const rect = canvasRef.current!.getBoundingClientRect();
		context.lastMouseX = e.clientX - rect.left;
		context.lastMouseY = e.clientY - rect.top;

		if (context.isDragging) {
			const dx = e.clientX - context.lastX;
			const dy = e.clientY - context.lastY;
			context.targetX += dx;
			context.targetY += dy;
			context.lastX = e.clientX;
			context.lastY = e.clientY;
		}
	};

	const handleMouseUpEvent = () => {
		context.isDragging = false;
	};

	const handleWheelEvent = (e: WheelEvent) => {
		e.preventDefault();

		const rect = canvasRef.current!.getBoundingClientRect();
		const cursorX = e.clientX - rect.left;
		const cursorY = e.clientY - rect.top;

		// Convert cursor to world coords before zoom
		const worldX = (cursorX - context.targetX) / context.targetScale;
		const worldY = (cursorY - context.targetY) / context.targetScale;

		// Apply zoom
		const zoomIntensity = 0.0015;
		const zoom = 1 - e.deltaY * zoomIntensity;
		context.targetScale *= zoom;

		// Adjust offset so cursor stays fixed
		context.targetX = cursorX - worldX * context.targetScale;
		context.targetY = cursorY - worldY * context.targetScale;
	};

	return {
		handleMouseDownEvent,
		handleMouseMouseEvent,
		handleMouseUpEvent,
		handleWheelEvent,
	};
};

export default useEventHandlersMouse;
