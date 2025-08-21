import type { CanvanContext } from '../UICanvas';

const useEventHandlersKeyboard = (
	context: CanvanContext,
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	regions: Record<string, { x: number; y: number; width: number; height: number }>
) => {
	// Reset view
	const resetView = () => {
		context.targetScale = 1;
		context.targetX = 0;
		context.targetY = 0;
	};
	// Fit-to-content logic
	const fitToContent = () => {
		const contentWidth = context.maxX - context.minX;
		const contentHeight = context.maxY - context.minY;
		const scaleX = canvasRef.current!.width / contentWidth;
		const scaleY = canvasRef.current!.height / contentHeight;
		context.targetScale = Math.min(scaleX, scaleY) * 0.9;
		context.targetX = (canvasRef.current!.width - contentWidth * context.targetScale) / 2 - context.minX * context.targetScale;
		context.targetY = (canvasRef.current!.height - contentHeight * context.targetScale) / 2 - context.minY * context.targetScale;
	};

	// Zoom-to-region
	const zoomToRegion = (regionKey: string) => {
		const r = regions[regionKey];
		if (!r) return;
		const scaleX = canvasRef.current!.width / r.width;
		const scaleY = canvasRef.current!.height / r.height;
		context.targetScale = Math.min(scaleX, scaleY) * 0.85;
		context.targetX = (canvasRef.current!.width - r.width * context.targetScale) / 2 - r.x * context.targetScale;
		context.targetY = (canvasRef.current!.height - r.height * context.targetScale) / 2 - r.y * context.targetScale;
	};

	// --- Keyboard zoom helpers ---
	const zoomAt = (cursorX: number, cursorY: number, zoomFactor: number) => {
		// Convert cursor to world coords before zoom
		const worldX = (cursorX - context.targetX) / context.targetScale;
		const worldY = (cursorY - context.targetY) / context.targetScale;

		// Apply zoom
		context.targetScale *= zoomFactor;

		// Adjust offset so cursor stays fixed
		context.targetX = cursorX - worldX * context.targetScale;
		context.targetY = cursorY - worldY * context.targetScale;
	};

	const handleKeyboardZoomIn = () => {
		zoomAt(context.lastMouseX, context.lastMouseY, 1.2);
	};

	const handleKeyboardZoomOut = () => {
		zoomAt(context.lastMouseX, context.lastMouseY, 1 / 1.2);
	};

	const handleKeyDownEvent = (e: KeyboardEvent) => {
		if (e.key === '+') {
			handleKeyboardZoomIn();
		}
		if (e.key === '-') {
			handleKeyboardZoomOut();
		}
		if (e.key === '0') {
			resetView();
		}
		if (e.key === 'f') {
			fitToContent();
		}
		if (regions[e.key]) {
			zoomToRegion(e.key);
		}
	};

	return {
		handleKeyDownEvent,
	};
};

export default useEventHandlersKeyboard;
