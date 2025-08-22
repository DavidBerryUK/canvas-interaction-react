import Point from '../../../models/geometry/Point';
import type CanvanContext from '../models/canvasContext';

const useHandleTouchEvents = (context: CanvanContext, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	const handleTouchStartEvent = (e: TouchEvent) => {
		if (e.touches.length === 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			context.lastDist = Math.hypot(dx, dy);

			// Midpoint in screen coords
			context.pinchMid = new Point((e.touches[0].clientX + e.touches[1].clientX) / 2, (e.touches[0].clientY + e.touches[1].clientY) / 2);
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
			const cursorX = context.pinchMid.x - rect.left;
			const cursorY = context.pinchMid.y - rect.top;
			const worldX = (cursorX - context.target.x) / context.targetScale;
			const worldY = (cursorY - context.target.y) / context.targetScale;

			context.targetScale *= zoom;

			// Adjust offset so pinch midpoint stays fixed
			context.target = new Point(cursorX - worldX * context.targetScale, cursorY - worldY * context.targetScale);

			context.lastDist = dist;
		}
	};

	return {
		handleTouchMoveEvent,
		handleTouchStartEvent,
	};
};

export default useHandleTouchEvents;
