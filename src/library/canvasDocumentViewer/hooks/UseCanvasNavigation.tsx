import { useCallback, useMemo } from 'react';
import Point from '../../geometry/Point';
import Size from '../../geometry/Size';
import type CanvasContext from '../models/CanvasContext';
import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import type Rectangle from '../../geometry/Rectangle';

const useCanvasNavigation = (canvasRef: React.RefObject<HTMLCanvasElement | null>, context: CanvasContext, provider: ICanvasDocumentViewerSceneProvider) => {
	const zoomAt = useCallback(
		(cursor: Point, zoomFactor: number, withAnimation: boolean = true) => {
			console.log(`zoom at point ${cursor.toString()}`);

			// Convert cursor to world coords before zoom
			const world = new Point((cursor.x - context.target.x) / context.targetScale, (cursor.y - context.target.y) / context.targetScale);

			const zoom = context.targetScale * zoomFactor;
			const point = new Point(cursor.x - world.x * zoom, cursor.y - world.y * zoom);

			context.setPoint(withAnimation, point);
			context.setScale(withAnimation, zoom);
		},
		[context] // depends on context
	);

	const centerDocument = useCallback(
		(withAnimation: boolean = true) => {
			console.log(`-------- center document --------`);
			console.log(provider.name);

			const contentRect = provider.getBoundingRect();

			const contentScaledSize = new Size(contentRect.width * context.targetScale, contentRect.height * context.targetScale);
			const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);

			console.log(`content rect:${contentRect.toString()}`);
			console.log(`content rect (scaled):${contentScaledSize.toString()}`);
			console.log(`canvas size :${canvasSize.toString()}`);

			const x = (canvasSize.width - contentScaledSize.width) / 2 - contentRect.x * context.targetScale;
			const y = (canvasSize.height - contentScaledSize.height) / 2 - contentRect.y * context.targetScale;

			const point = new Point(x, y);
			context.setPoint(withAnimation, point);
		},
		[provider, context, canvasRef]
	);

	const zoomToFit = useCallback(
		(withAnimation: boolean = true) => {
			const contentSize = provider.getBoundingRect();
			const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
			const point = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
			context.setPoint(withAnimation, point);
			context.setScale(withAnimation, Math.min(point.x, point.y));

			centerDocument(withAnimation);
		},
		[provider, context, canvasRef, centerDocument]
	);

	const zoomToWidth = useCallback(
		(withAnimation: boolean = true) => {
			const contentWidth = provider.getBoundingRect().width;
			const canvasWidth = canvasRef.current!.width;
			context.setScale(withAnimation, canvasWidth / contentWidth);
			centerDocument(withAnimation);
		},
		[provider, context, canvasRef, centerDocument]
	);

	const zoomToHeight = useCallback(
		(withAnimation: boolean = true) => {
			const contentHeight = provider.getBoundingRect().height;
			const canvasHeight = canvasRef.current!.height;
			context.setScale(withAnimation, canvasHeight / contentHeight);
			centerDocument(withAnimation);
		},
		[provider, context, canvasRef, centerDocument]
	);

	const zoomToFill = useCallback(
		(withAnimation: boolean = true) => {
			const contentSize = provider.getBoundingRect();
			const canvasSize = new Size(canvasRef.current!.width, canvasRef.current!.height);
			const scalePoint = new Point(canvasSize.width / contentSize.width, canvasSize.height / contentSize.height);
			context.setScale(withAnimation, Math.max(scalePoint.x, scalePoint.y));
			centerDocument(withAnimation);
		},
		[provider, context, canvasRef, centerDocument]
	);

	const zoomToRectangle = useCallback(
		(rectangle: Rectangle, withAnimation: boolean = true) => {
			const scalePoints = new Point(canvasRef.current!.width / rectangle.width, canvasRef.current!.height / rectangle.height);
			const scale = Math.min(scalePoints.x, scalePoints.y) * 0.85;
			const point = new Point((canvasRef.current!.width - rectangle.width * scale) / 2 - rectangle.x * scale, (canvasRef.current!.height - rectangle.height * scale) / 2 - rectangle.y * scale);

			context.setScale(withAnimation, scale);
			context.setPoint(withAnimation, point);
		},
		[context, canvasRef]
	);

	const resetView = useCallback(
		(withAnimation: boolean = true) => {
			const rectangle = provider.getBoundingRect();

			context.setScale(withAnimation, 1);
			context.setPoint(withAnimation, new Point((canvasRef.current!.width - rectangle.width) / 2 - rectangle.x, (canvasRef.current!.height - rectangle.height) / 2 - rectangle.y));
		},
		[provider, context, canvasRef]
	);

	// Memoize the navigation object itself
	const navigate = useMemo(
		() => ({
			resetView,
			centerDocument,
			zoomAt,
			zoomToFill,
			zoomToFit,
			zoomToHeight,
			zoomToWidth,
			zoomToRectangle,
		}),
		[resetView, centerDocument, zoomAt, zoomToFill, zoomToFit, zoomToHeight, zoomToWidth, zoomToRectangle]
	);

	return { navigate };
};

export default useCanvasNavigation;
