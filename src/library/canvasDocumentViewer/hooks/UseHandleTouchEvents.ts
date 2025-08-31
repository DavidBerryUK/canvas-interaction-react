import Point from '../../../library/geometry/Point';
import type CanvasContext from '../models/CanvasContext';

const useHandleTouchEvents = (context: React.RefObject<CanvasContext>, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	const handleTouchStartEvent = (e: TouchEvent) => {
		if (e.touches.length === 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			context.current.touchGestureLastDist = Math.hypot(dx, dy);

			// Midpoint in screen coords
			context.current.touchGesturePinchMid = new Point((e.touches[0].clientX + e.touches[1].clientX) / 2, (e.touches[0].clientY + e.touches[1].clientY) / 2);
		}
	};

	const handleTouchMoveEvent = (e: TouchEvent) => {
		if (e.touches.length === 2) {
			e.preventDefault();

			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const dist = Math.hypot(dx, dy);
			const zoom = dist / context.current.touchGestureLastDist;

			// Convert midpoint to world coords before zoom
			const rect = canvasRef.current!.getBoundingClientRect();
			const cursorX = context.current.touchGesturePinchMid.x - rect.left;
			const cursorY = context.current.touchGesturePinchMid.y - rect.top;
			const worldX = (cursorX - context.current.target.x) / context.current.targetScale;
			const worldY = (cursorY - context.current.target.y) / context.current.targetScale;

			context.current.targetScale *= zoom;

			// Adjust offset so pinch midpoint stays fixed
			context.current.target = new Point(cursorX - worldX * context.current.targetScale, cursorY - worldY * context.current.targetScale);

			context.current.touchGestureLastDist = dist;
		}
	};

	return {
		touchEvents: {
			handleTouchMoveEvent,
			handleTouchStartEvent,
		},
	};
};

export default useHandleTouchEvents;
