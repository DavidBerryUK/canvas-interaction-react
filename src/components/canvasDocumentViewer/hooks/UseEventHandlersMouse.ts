import Point from '../../../models/geometry/Point';
import Rectangle from '../../../models/geometry/Rectangle';
import type CanvanContext from '../models/canvasContext';

const useEventHandlersMouse = (context: CanvanContext, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	const handleMouseDownEvent = (e: MouseEvent) => {
		context.isDragging = true;
		context.last = Point.createfromMouseEvent(e);
	};

	const handleMouseMouseEvent = (event: MouseEvent) => {
		// Track last mouse position for keyboard zoom
		const rect = Rectangle.createFromDomRect(canvasRef.current!.getBoundingClientRect());
		const mousePoint = Point.createfromMouseEvent(event);
		context.lastMouse = mousePoint.cloneWithSubtract(rect.origin);

		if (context.isDragging) {
			const delta = new Point(event.clientX - context.last.x, event.clientY - context.last.y);
			context.target = context.target.cloneWithAdd(delta);
			context.last = new Point(event.clientX, event.clientY);
		}
	};

	const handleMouseUpEvent = () => {
		context.isDragging = false;
	};

	const handleWheelEvent = (event: WheelEvent) => {
		event.preventDefault();

		const rect = Rectangle.createFromDomRect(canvasRef.current!.getBoundingClientRect());
		const mousePoint = Point.createfromMouseEvent(event);
		const cursor = mousePoint.cloneWithSubtract(rect.origin);

		// Convert cursor to world coords before zoom
		const world = new Point((cursor.x - context.target.x) / context.targetScale, (cursor.y - context.target.y) / context.targetScale);

		// Apply zoom
		const zoomIntensity = 0.0015;
		const zoom = 1 - event.deltaY * zoomIntensity;
		context.targetScale *= zoom;

		// Adjust offset so cursor stays fixed
		context.target = new Point(cursor.x - world.x * context.targetScale, cursor.y - world.y * context.targetScale);
	};

	return {
		mouseEvents: {
			handleMouseDownEvent,
			handleMouseMouseEvent,
			handleMouseUpEvent,
			handleWheelEvent,
		},
	};
};

export default useEventHandlersMouse;
