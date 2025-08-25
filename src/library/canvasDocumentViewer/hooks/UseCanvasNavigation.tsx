import Point from '../../geometry/Point';
import Size from '../../geometry/Size';
import type CanvasContext from '../models/CanvasContext';
import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import type Rectangle from '../../geometry/Rectangle';

const useCanvasNavigation = (canvasRef: React.RefObject<HTMLCanvasElement | null>, context: CanvasContext, provider: ICanvasDocumentViewerSceneProvider) => {
	/**
	 * Zoom in / out around the cursor a specified amount
	 * @param cursor - the current location of the mouse cursor
	 * @param zoomFactor - the amount to zoom in/out
	 */
	const zoomAt = (cursor: Point, zoomFactor: number, withAnimation: boolean = true) => {
		console.log(`zoom at point ${cursor.toString()}`);

		// Convert cursor to world coords before zoom
		const world = new Point((cursor.x - context.target.x) / context.targetScale, (cursor.y - context.target.y) / context.targetScale);

		const zoom = context.targetScale * zoomFactor;
		const point = new Point(cursor.x - world.x * zoom, (context.target.y = cursor.y - world.y * zoom));

		context.setPoint(withAnimation, point);
		context.setScale(withAnimation, zoom);
	};

	/**-=0000
	 *
	 * @param withAnimation
	 */
	const centerDocument = (withAnimation: boolean = true) => {
		const contentRect = provider.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
		const scaledSize = new Size(contentRect.width * context.targetScale, contentRect.height * context.targetScale);

		const point = new Point((canvasSize.width - scaledSize.width) / 2 - contentRect.x * context.targetScale, (canvasSize.height - scaledSize.height) / 2 - contentRect.y * context.targetScale);

		context.setPoint(withAnimation, point);
	};

	/**
	 * select placement and zoom level to fit all the elements on screen
	 * @param withAnimation
	 */
	const zoomToFit = (withAnimation: boolean = true) => {
		const contentSize = provider.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
		const point = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
		context.setPoint(withAnimation, point);
		context.setScale(withAnimation, Math.min(point.x, point.y));

		centerDocument(withAnimation);
	};

	/**
	 *
	 */
	const zoomToWidth = (withAnimation: boolean = true) => {
		const contentWidth = provider.getBoundingRect().width;
		const canvasWidth = canvasRef.current!.width;
		context.setScale(withAnimation, canvasWidth / contentWidth);
		centerDocument(withAnimation);
	};

	/**
	 *
	 */
	const zoomToHeight = (withAnimation: boolean = true) => {
		const contentHeight = provider.getBoundingRect().height;
		const canvasHeight = canvasRef.current!.height;
		context.setScale(withAnimation, canvasHeight / contentHeight);
		centerDocument(withAnimation);
	};

	/**
	 * select placement and zoom level to fill the screen, even if some are off screen
	 */
	const zoomToFill = (withAnimation: boolean = true) => {
		const contentSize = provider.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
		const scalePoint = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
		context.setScale(withAnimation, Math.max(scalePoint.x, scalePoint.y));
		centerDocument(withAnimation);
	};

	/**
	 *
	 * @param rectangle
	 */
	const zoomToRectangle = (rectangle: Rectangle, withAnimation: boolean = true) => {
		const scalePoints = new Point(canvasRef.current!.width / rectangle.width, canvasRef.current!.height / rectangle.height);
		var scale = Math.min(scalePoints.x, scalePoints.y) * 0.85;
		var point = new Point((canvasRef.current!.width - rectangle.width * scale) / 2 - rectangle.x * scale, (canvasRef.current!.height - rectangle.height * scale) / 2 - rectangle.y * scale);

		context.setScale(withAnimation, scale);
		context.setPoint(withAnimation, point);
	};

	/**
	 *
	 */
	const resetView = (withAnimation: boolean = true) => {
		const rectangle = provider.getBoundingRect();

		context.setScale(withAnimation, 1);
		context.setPoint(withAnimation, new Point((canvasRef.current!.width - rectangle.width) / 2 - rectangle.x, (canvasRef.current!.height - rectangle.height) / 2 - rectangle.y));
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
