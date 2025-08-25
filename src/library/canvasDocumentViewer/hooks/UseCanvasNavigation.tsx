import Point from '../../geometry/Point';
import Size from '../../geometry/Size';
import type CanvasContext from '../models/CanvasContext';
import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import type Rectangle from '../../geometry/Rectangle';

const useCanvasNavigation = (
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	context: CanvasContext,
	provider: ICanvasDocumentViewerSceneProvider
) => {
	const zoomAt = (cursor: Point, zoomFactor: number, animate?: boolean = true) => {
		// Convert cursor to world coords before zoom
		const world = new Point((cursor.x - context.target.x) / context.targetScale, (cursor.y - context.target.y) / context.targetScale);
		// Apply zoom
		context.targetScale *= zoomFactor;
		// Adjust offset so cursor stays fixed
		context.target = new Point(cursor.x - world.x * context.targetScale, (context.target.y = cursor.y - world.y * context.targetScale));
	};

	const centerDocument = (withAnimation: boolean = true) => {
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

	// select placement and zoom level to fit all the elements on screen
	const zoomToFit = (withAnimation: boolean = true) => {
		const contentSize = provider.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);

		//const scalePoint = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
		//context.targetScale = Math.min(scalePoint.x, scalePoint.y);

		const point = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
		context.setPoint(withAnimation, point);
		context.setScale(withAnimation, Math.min(point.x, point.y));

		centerDocument(withAnimation);
	};

	const zoomToWidth = (animate?: boolean = true) => {
		const contentWidth = provider.getBoundingRect().width;
		const canvasWidth = canvasRef.current!.width;
		context.targetScale = canvasWidth / contentWidth;
		centerDocument();
	};

	const zoomToHeight = (animate?: boolean = true) => {
		const contentHeight = provider.getBoundingRect().height;
		const canvasHeight = canvasRef.current!.height;
		context.targetScale = canvasHeight / contentHeight;
		centerDocument();
	};

	// select placement and zoom level to fill the screen, even if some are off screen
	const zoomToFill = (animate?: boolean = true) => {
		const contentSize = provider.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
		const scalePoint = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
		context.targetScale = Math.max(scalePoint.x, scalePoint.y);
		centerDocument();
	};

	const zoomToRectangle = (rectangle: Rectangle, animate?: boolean = true) => {
		const scale = new Point(canvasRef.current!.width / rectangle.width, canvasRef.current!.height / rectangle.height);
		context.targetScale = Math.min(scale.x, scale.y) * 0.85;
		context.target = new Point(
			(canvasRef.current!.width - rectangle.width * context.targetScale) / 2 - rectangle.x * context.targetScale,
			(canvasRef.current!.height - rectangle.height * context.targetScale) / 2 - rectangle.y * context.targetScale
		);
	};

	const resetView = (animate?: boolean = true) => {
		const rectangle = provider.getBoundingRect();
		context.targetScale = 1;
		context.target = new Point(
			(canvasRef.current!.width - rectangle.width) / 2 - rectangle.x,
			(canvasRef.current!.height - rectangle.height) / 2 - rectangle.y
		);
	};

	return {
		navigate: {
			resetView,
			centerDocument,
			zoomAt,
			zoomToFill,
			zoomToFit,
			zoomToHeight,
			zoomToWidth,
			zoomToRectangle,
		},
	};
};

export default useCanvasNavigation;
