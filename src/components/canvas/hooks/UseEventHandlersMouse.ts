import PointModel from '../../../models/geometry/PointModel';
import type CanvanContext from '../models/canvasContext';

const useEventHandlersMouse = (context: CanvanContext, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	const handleMouseDownEvent = (e: MouseEvent) => {
		context.isDragging = true;
		context.last = new PointModel(e.clientX, e.clientY);
	};

	const handleMouseMouseEvent = (e: MouseEvent) => {
		// Track last mouse position for keyboard zoom
		const rect = canvasRef.current!.getBoundingClientRect();
		context.lastMouse = new PointModel(e.clientX - rect.left, e.clientY - rect.top);

		if (context.isDragging) {
			const delta = new PointModel(e.clientX - context.last.x, e.clientY - context.last.y);
			context.target = context.target.cloneWithAdd(delta);
			context.last = new PointModel(e.clientX, e.clientY);
		}
	};

	const handleMouseUpEvent = () => {
		context.isDragging = false;
	};

	const handleWheelEvent = (e: WheelEvent) => {
		e.preventDefault();

		const rect = canvasRef.current!.getBoundingClientRect();
		const cursor = new PointModel(e.clientX - rect.left, e.clientY - rect.top);

		// Convert cursor to world coords before zoom
		const world = new PointModel((cursor.x - context.target.x) / context.targetScale, (cursor.y - context.target.y) / context.targetScale);

		// Apply zoom
		const zoomIntensity = 0.0015;
		const zoom = 1 - e.deltaY * zoomIntensity;
		context.targetScale *= zoom;

		// Adjust offset so cursor stays fixed
		context.target = new PointModel(cursor.x - world.x * context.targetScale, cursor.y - world.y * context.targetScale);
	};

	return {
		handleMouseDownEvent,
		handleMouseMouseEvent,
		handleMouseUpEvent,
		handleWheelEvent,
	};
};

export default useEventHandlersMouse;
