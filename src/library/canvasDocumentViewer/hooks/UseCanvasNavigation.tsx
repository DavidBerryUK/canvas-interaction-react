import Point from '../../geometry/Point';
import Size from '../../geometry/Size';
import type CanvasContext from '../models/CanvasContext';
import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import type Rectangle from '../../geometry/Rectangle';

const useCanvasNavigation = (canvasRef: React.RefObject<HTMLCanvasElement | null>, context: React.RefObject<CanvasContext>, sceneProvider: React.RefObject<ICanvasDocumentViewerSceneProvider>) => {
	const zoomAt = (cursor: Point, zoomFactor: number, withAnimation: boolean = true) => {
		console.log(`zoom at point ${cursor.toString()}`);

		// Convert cursor to world coords before zoom
		const world = new Point((cursor.x - context.current.target.x) / context.current.targetScale, (cursor.y - context.current.target.y) / context.current.targetScale);

		const zoom = context.current.targetScale * zoomFactor;
		const point = new Point(cursor.x - world.x * zoom, cursor.y - world.y * zoom);

		context.current.setPoint(withAnimation, point);
		context.current.setScale(withAnimation, zoom);
	};

	const centerDocument = (withAnimation: boolean = true) => {
		console.log(`-------- center document --------`);
		console.log(sceneProvider.current.name);

		const contentRect = sceneProvider.current.getBoundingRect();

		const contentScaledSize = new Size(contentRect.width * context.current.targetScale, contentRect.height * context.current.targetScale);
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);

		console.log(`content rect:${contentRect.toString()}`);
		console.log(`content rect (scaled):${contentScaledSize.toString()}`);
		console.log(`canvas size :${canvasSize.toString()}`);

		const x = (canvasSize.width - contentScaledSize.width) / 2 - contentRect.x * context.current.targetScale;
		const y = (canvasSize.height - contentScaledSize.height) / 2 - contentRect.y * context.current.targetScale;

		const point = new Point(x, y);
		context.current.setPoint(withAnimation, point);
	};

	const zoomToFit = (withAnimation: boolean = true) => {
		const contentSize = sceneProvider.current.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
		const point = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
		context.current.setPoint(withAnimation, point);
		context.current.setScale(withAnimation, Math.min(point.x, point.y));

		centerDocument(withAnimation);
	};

	const zoomToWidth = (withAnimation: boolean = true) => {
		const contentWidth = sceneProvider.current.getBoundingRect().width;
		const canvasWidth = canvasRef.current!.width;
		context.current.setScale(withAnimation, canvasWidth / contentWidth);
		centerDocument(withAnimation);
	};

	const zoomToHeight = (withAnimation: boolean = true) => {
		const contentHeight = sceneProvider.current.getBoundingRect().height;
		const canvasHeight = canvasRef.current!.height;
		context.current.setScale(withAnimation, canvasHeight / contentHeight);
		centerDocument(withAnimation);
	};

	const zoomToFill = (withAnimation: boolean = true) => {
		const contentSize = sceneProvider.current.getBoundingRect();
		const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
		const scalePoint = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
		context.current.setScale(withAnimation, Math.max(scalePoint.x, scalePoint.y));
		centerDocument(withAnimation);
	};

	const zoomToRectangle = (rectangle: Rectangle, withAnimation: boolean = true) => {
		const scalePoints = new Point(canvasRef.current!.width / rectangle.width, canvasRef.current!.height / rectangle.height);
		const scale = Math.min(scalePoints.x, scalePoints.y) * 0.85;
		const point = new Point((canvasRef.current!.width - rectangle.width * scale) / 2 - rectangle.x * scale, (canvasRef.current!.height - rectangle.height * scale) / 2 - rectangle.y * scale);

		context.current.setScale(withAnimation, scale);
		context.current.setPoint(withAnimation, point);
	};

	const resetView = (withAnimation: boolean = true) => {
		const rectangle = sceneProvider.current.getBoundingRect();

		context.current.setScale(withAnimation, 1);
		context.current.setPoint(withAnimation, new Point((canvasRef.current!.width - rectangle.width) / 2 - rectangle.x, (canvasRef.current!.height - rectangle.height) / 2 - rectangle.y));
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
