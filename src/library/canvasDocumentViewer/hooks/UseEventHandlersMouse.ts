import Point from '../../../library/geometry/Point';
import Rectangle from '../../../library/geometry/Rectangle';
import type CanvasContext from '../models/CanvasContext';

const useEventHandlersMouse = (context: React.RefObject<CanvasContext>, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	const handleMouseDownEvent = (e: MouseEvent) => {
		context.current.isDragging = true;

		const rect = Rectangle.createFromDomRect(canvasRef.current!.getBoundingClientRect());
		const mousePoint = Point.createfromMouseEvent(e);
		context.current.lastMouseCanvasPosition = mousePoint.cloneWithSubtract(rect.origin);
	};

	const handleMouseMouseEvent = (event: MouseEvent) => {
		// Track last mouse position for keyboard zoom
		const rect = Rectangle.createFromDomRect(canvasRef.current!.getBoundingClientRect());
		const mousePoint = Point.createfromMouseEvent(event);

		const mouseCanvasPosition = mousePoint.cloneWithSubtract(rect.origin);

		if (context.current.isDragging) {
			const delta = mouseCanvasPosition.cloneWithSubtract(context.current.lastMouseCanvasPosition);
			context.current.target = context.current.target.cloneWithAdd(delta);
		}

		context.current.lastMouseCanvasPosition = mouseCanvasPosition;
	};

	const handleMouseUpEvent = () => {
		context.current.isDragging = false;
	};

	const handleWheelEvent = (event: WheelEvent) => {
		event.preventDefault();

		const rect = Rectangle.createFromDomRect(canvasRef.current!.getBoundingClientRect());
		const mousePoint = Point.createfromMouseEvent(event);
		const cursor = mousePoint.cloneWithSubtract(rect.origin);

		// Convert cursor to world coords before zoom
		const world = new Point((cursor.x - context.current.target.x) / context.current.targetScale, (cursor.y - context.current.target.y) / context.current.targetScale);

		// Apply zoom
		const zoomIntensity = 0.0015;
		const zoom = 1 - event.deltaY * zoomIntensity;
		context.current.targetScale *= zoom;

		// Adjust offset so cursor stays fixed
		context.current.target = new Point(cursor.x - world.x * context.current.targetScale, cursor.y - world.y * context.current.targetScale);
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
