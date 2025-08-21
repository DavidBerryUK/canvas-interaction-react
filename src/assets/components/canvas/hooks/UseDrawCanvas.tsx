import type { CanvanContext } from '../UICanvas';

const useDrawCanvas = (
	context: CanvanContext,
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	regions: Record<string, { x: number; y: number; width: number; height: number }>
) => {
	let canvas: HTMLCanvasElement | null;
	let ctx: CanvasRenderingContext2D | null;

	const updateBounds = (x: number, y: number, w: number, h: number) => {
		context.minX = Math.min(context.minX, x);
		context.minY = Math.min(context.minY, y);
		context.maxX = Math.max(context.maxX, x + w);
		context.maxY = Math.max(context.maxY, y + h);
	};

	const clearScene = () => {
		ctx.clearRect(0, 0, canvas!.width, canvas!.height);
	};

	const render = () => {
		canvas = canvasRef.current!;
		ctx = canvasRef.current?.getContext('2d')!;

		if (!canvasRef.current || !ctx) return;

		clearScene();
		ctx.save();
		ctx.setTransform(context.scale, 0, 0, context.scale, context.offsetX, context.offsetY);
		drawScene();
		ctx.restore();

		// Smooth transition
		context.scale += (context.targetScale - context.scale) * 0.15;
		context.offsetX += (context.targetX - context.offsetX) * 0.15;
		context.offsetY += (context.targetY - context.offsetY) * 0.15;

		requestAnimationFrame(render);
	};

	const drawScene = () => {
		ctx.fillStyle = 'red';
		ctx.fillRect(50, 50, 200, 200);
		updateBounds(50, 50, 200, 200);

		ctx.fillStyle = 'blue';
		ctx.beginPath();
		ctx.arc(400, 300, 100, 0, 2 * Math.PI);
		ctx.fill();
		updateBounds(300, 200, 200, 200);

		ctx.fillStyle = 'green';
		ctx.fillRect(600, 100, 150, 150);
		updateBounds(600, 100, 150, 150);

		// Optional: region outlines
		for (const key in regions) {
			const r = regions[key];
			ctx.strokeStyle = 'rgba(0,0,0,0.4)';
			ctx.lineWidth = 2;
			ctx.setLineDash([6, 4]);
			ctx.strokeRect(r.x, r.y, r.width, r.height);
			ctx.setLineDash([]);
			ctx.fillStyle = 'black';
			ctx.font = '16px Arial';
			ctx.fillText(key, r.x + 4, r.y + 16);
		}
	};

	return { render };
};

export default useDrawCanvas;
