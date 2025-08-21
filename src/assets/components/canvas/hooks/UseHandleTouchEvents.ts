import type { CanvanContext } from '../UICanvas';

const useHandleTouchEvents = (context: CanvanContext, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
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
			const rect = canvasRef.current!.getBoundingClientRect();
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

	return {
		handleTouchMoveEvent,
		handleTouchStartEvent,
	};
};

export default useHandleTouchEvents;
