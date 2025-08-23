import Point from '../../../models/geometry/Point';
import Size from '../../../models/geometry/Size';
import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import type CanvanContext from '../models/canvasContext';

const useEventHandlersKeyboard = (
	context: CanvanContext,
	provider: ICanvasDocumentViewerSceneProvider,
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	regions: Record<string, { x: number; y: number; width: number; height: number }>
) => {
	// Reset view
	const resetView = () => {
		context.targetScale = 1;
		context.target = Point.zero;
	};

	// Zoom-to-region
	const zoomToRegion = (regionKey: string) => {
		const r = regions[regionKey];
		if (!r) {
			return;
		}
		const scale = new Point(canvasRef.current!.width / r.width, canvasRef.current!.height / r.height);
		context.targetScale = Math.min(scale.x, scale.y) * 0.85;
		context.target = new Point(
			(canvasRef.current!.width - r.width * context.targetScale) / 2 - r.x * context.targetScale,
			(canvasRef.current!.height - r.height * context.targetScale) / 2 - r.y * context.targetScale
		);
	};

	// --- Keyboard zoom helpers ---
	const zoomAt = (cursor: Point, zoomFactor: number) => {
		// Convert cursor to world coords before zoom
		const world = new Point((cursor.x - context.target.x) / context.targetScale, (cursor.y - context.target.y) / context.targetScale);
		// Apply zoom
		context.targetScale *= zoomFactor;
		// Adjust offset so cursor stays fixed
		context.target = new Point(cursor.x - world.x * context.targetScale, (context.target.y = cursor.y - world.y * context.targetScale));
	};

	const handleKeyboardZoomIn = () => {
		zoomAt(context.lastMouse, 1.2);
	};

	const handleKeyboardZoomOut = () => {
		zoomAt(context.lastMouse, 1 / 1.2);
	};

	// select placement and zoom level to fit all the elements on screen
	const zoomToFit = () => {
		const contentSize = provider.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
		const scalePoint = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
		context.targetScale = Math.min(scalePoint.x, scalePoint.y);
		centerDocument();
	};

	const zoomToWidth = () => {
		const contentWidth = provider.getBoundingRect().width;
		const canvasWidth = canvasRef.current!.width;
		context.targetScale = canvasWidth / contentWidth;
		centerDocument();
	};

	const zoomToHeight = () => {
		const contentHeight = provider.getBoundingRect().height;
		const canvasHeight = canvasRef.current!.height;
		context.targetScale = canvasHeight / contentHeight;
		centerDocument();
	};

	// select placement and zoom level to fill the screen, even if some are off screen
	const zoomToFill = () => {
		const contentSize = provider.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
		const scalePoint = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
		context.targetScale = Math.max(scalePoint.x, scalePoint.y);
		centerDocument();
	};

	const centerDocument = () => {
		const contentRect = provider.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);

		// Total drawn size at current zoom
		const scaledSize = new Size(contentRect.width * context.targetScale, contentRect.height * context.targetScale);

		// Center offsets
		context.target = new Point(
			(canvasSize.width - scaledSize.width) / 2 - contentRect.x * context.targetScale,
			(canvasSize.height - scaledSize.height) / 2 - contentRect.y * context.targetScale
		);
	};

	const handleKeyDownEvent = (e: KeyboardEvent) => {
		const actions: Record<string, () => void> = {
			'+': handleKeyboardZoomIn,
			'-': handleKeyboardZoomOut,
			'0': resetView,
			F: zoomToFit,
			f: zoomToFit,
			X: zoomToFill,
			x: zoomToFill,
			w: zoomToWidth,
			W: zoomToWidth,
			h: zoomToHeight,
			H: zoomToHeight,
			c: centerDocument,
			C: centerDocument,
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
		keyboardEvents: {
			handleKeyDownEvent,
		},
	};
};

export default useEventHandlersKeyboard;
