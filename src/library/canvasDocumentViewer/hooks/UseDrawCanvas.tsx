import Point from '../../../library/geometry/Point';
import Rectangle from '../../../library/geometry/Rectangle';
import Size from '../../../library/geometry/Size';
import type CanvasContext from '../models/CanvasContext';
import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import useDrawGrid from './UseDrawGrid';
import useDrawPrimitiveShapes from './UseDrawPrimitiveShapes';

const useDrawCanvas = (
	context: CanvasContext,
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	sceneProvider: ICanvasDocumentViewerSceneProvider | undefined
) => {
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
		ctx.setTransform(context.scale, 0, 0, context.scale, context.offset.x, context.offset.y);
		//
		// draw the grid
		//
		drawGrid(context, canvas, ctx);

		if (sceneProvider) {
			//
			// draw document broundry
			//
			drawPrimitiveShapes.shapes.roundedRect(ctx, { rect: sceneProvider.getBoundingRect(), lineWidth: 2, strokeColor: '#719FCC', radius: 8 });

			// invert the transform to get scene coordinates
			const visibleSceneArea = new Rectangle(
				new Point(-context.offset.x / context.scale, -context.offset.y / context.scale),
				new Size(canvas.width / context.scale, canvas.height / context.scale)
			);

			//
			// draw scene using provider
			//
			sceneProvider.render(ctx, visibleSceneArea);

			//
			// draw regions
			//
			var regions = sceneProvider.getRegions();

			regions.forEach((region) => {
				if (region.rectangle.intersects(visibleSceneArea)) {
					drawPrimitiveShapes.shapes.roundedRect(ctx!, { rect: region.rectangle, lineWidth: 2, strokeColor: '#9FCC71', radius: 4 });
				}
			});
		}
		ctx.restore();

		// Smooth transition
		context.scale += (context.targetScale - context.scale) * 0.15;
		context.offset.x += (context.target.x - context.offset.x) * 0.15;
		context.offset.y += (context.target.y - context.offset.y) * 0.15;

		requestAnimationFrame(render);
	};

	return { render };
};

export default useDrawCanvas;
