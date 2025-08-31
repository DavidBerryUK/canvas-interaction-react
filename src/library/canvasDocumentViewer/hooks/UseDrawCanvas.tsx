import Point from '../../../library/geometry/Point';
import Rectangle from '../../../library/geometry/Rectangle';
import Size from '../../../library/geometry/Size';
import type CanvasContext from '../models/CanvasContext';
import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import useDrawGrid from './UseDrawGrid';
import useDrawPrimitiveShapes from './UseDrawPrimitiveShapes';

const useDrawCanvas = (context: React.RefObject<CanvasContext>, canvasRef: React.RefObject<HTMLCanvasElement | null>, sceneProvider: React.RefObject<ICanvasDocumentViewerSceneProvider>) => {
	const drawPrimitiveShapes = useDrawPrimitiveShapes();

	let canvas: HTMLCanvasElement | null;
	let ctx: CanvasRenderingContext2D | null;

	const { drawGrid } = useDrawGrid();

	const clearScene = () => {
		if (!canvas || !ctx) return;
		ctx.clearRect(0, 0, canvas!.width, canvas!.height);
	};

	const render = () => {
		canvas = canvasRef.current!;
		ctx = canvasRef.current?.getContext('2d')!;

		if (!canvasRef.current || !ctx) return;

		clearScene();
		ctx.save();
		ctx.setTransform(context.current.scale, 0, 0, context.current.scale, context.current.offset.x, context.current.offset.y);
		//
		// draw the grid
		//
		drawGrid(context, canvas, ctx);

		if (sceneProvider) {
			//
			// draw document broundry
			//
			drawPrimitiveShapes.shapes.roundedRect(ctx, { rect: sceneProvider.current.getBoundingRect(), lineWidth: 2, strokeColor: '#719FCC', radius: 8 });

			// invert the transform to get scene coordinates
			const visibleSceneArea = new Rectangle(new Point(-context.current.offset.x / context.current.scale, -context.current.offset.y / context.current.scale), new Size(canvas.width / context.current.scale, canvas.height / context.current.scale));

			//
			// draw scene using provider
			//
			sceneProvider.current.render(ctx, visibleSceneArea);

			//
			// draw regions
			//
			var regions = sceneProvider.current.getRegions();

			regions.forEach((region) => {
				if (region.rectangle.intersects(visibleSceneArea)) {
					drawPrimitiveShapes.shapes.roundedRect(ctx!, { rect: region.rectangle, lineWidth: 2, strokeColor: '#9FCC71', radius: 4 });
				}
			});
		}
		ctx.restore();

		// Smooth transition
		context.current.scale += (context.current.targetScale - context.current.scale) * 0.15;
		context.current.offset.x += (context.current.target.x - context.current.offset.x) * 0.15;
		context.current.offset.y += (context.current.target.y - context.current.offset.y) * 0.15;

		requestAnimationFrame(render);
	};

	return { render };
};

export default useDrawCanvas;
