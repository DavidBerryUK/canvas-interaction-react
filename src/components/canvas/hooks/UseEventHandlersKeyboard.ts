import PointModel from '../../../models/geometry/PointModel';
import SizeModel from '../../../models/geometry/SizeModel';
import type CanvanContext from '../models/canvasContext';

const useEventHandlersKeyboard = (
	context: CanvanContext,
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	regions: Record<string, { x: number; y: number; width: number; height: number }>
) => {
	// Reset view
	const resetView = () => {
		context.targetScale = 1;
		context.target = PointModel.zero;
	};
	// Fit-to-content logic
	const fitToContent = () => {
		const contentSize = new SizeModel(context.maxX - context.minX, context.maxY - context.minY);
		const scale = new PointModel(canvasRef.current!.width / contentSize.width, canvasRef.current!.height / contentSize.height);
		context.targetScale = Math.min(scale.x, scale.y) * 0.9;
		context.target = new PointModel(
			(canvasRef.current!.width - contentSize.width * context.targetScale) / 2 - context.minX * context.targetScale,
			(canvasRef.current!.height - contentSize.height * context.targetScale) / 2 - context.minY * context.targetScale
		);
	};

	// Zoom-to-region
	const zoomToRegion = (regionKey: string) => {
		const r = regions[regionKey];
		if (!r) return;
		const scale = new PointModel(canvasRef.current!.width / r.width, canvasRef.current!.height / r.height);
		context.targetScale = Math.min(scale.x, scale.y) * 0.85;
		context.target = new PointModel(
			(canvasRef.current!.width - r.width * context.targetScale) / 2 - r.x * context.targetScale,
			(canvasRef.current!.height - r.height * context.targetScale) / 2 - r.y * context.targetScale
		);
	};

	// --- Keyboard zoom helpers ---
	const zoomAt = (cursor: PointModel, zoomFactor: number) => {
		// Convert cursor to world coords before zoom
		const world = new PointModel((cursor.x - context.target.x) / context.targetScale, (cursor.y - context.target.y) / context.targetScale);
		// Apply zoom
		context.targetScale *= zoomFactor;
		// Adjust offset so cursor stays fixed
		context.target = new PointModel(cursor.x - world.x * context.targetScale, (context.target.y = cursor.y - world.y * context.targetScale));
	};

	const handleKeyboardZoomIn = () => {
		zoomAt(context.lastMouse, 1.2);
	};

	const handleKeyboardZoomOut = () => {
		zoomAt(context.lastMouse, 1 / 1.2);
	};

	const handleKeyDownEvent = (e: KeyboardEvent) => {
		const actions: Record<string, () => void> = {
			'+': handleKeyboardZoomIn,
			'-': handleKeyboardZoomOut,
			'0': resetView,
			f: fitToContent,
		};

		if (actions[e.key]) {
			e.preventDefault();
			actions[e.key]();
			return;
		}

		if (regions[e.key]) {
			e.preventDefault();
			zoomToRegion(e.key);
		}
	};

	return {
		handleKeyDownEvent,
	};
};

export default useEventHandlersKeyboard;
