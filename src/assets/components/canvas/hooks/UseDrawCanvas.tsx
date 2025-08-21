import type CanvanContext from '../models/canvasContext';

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
		drawGrid();
		drawScene();

		ctx.restore();

		// Smooth transition
		context.scale += (context.targetScale - context.scale) * 0.15;
		context.offset.x += (context.target.x - context.offset.x) * 0.15;
		context.offset.y += (context.target.y - context.offset.y) * 0.15;

		requestAnimationFrame(render);
	};

	const drawGrid = () => {
		if (!ctx || !canvas) return;

		// Grid spacing in world coordinates
		const gridSize = 50;

		// Convert canvas corners into world coordinates
		const invScale = 1 / context.scale;
		const left = -context.offset.x * invScale;
		const top = -context.offset.y * invScale;
		const right = left + canvas.width * invScale;
		const bottom = top + canvas.height * invScale;

		// Snap start positions to nearest grid line
		const startX = Math.floor(left / gridSize) * gridSize;
		const endX = Math.ceil(right / gridSize) * gridSize;
		const startY = Math.floor(top / gridSize) * gridSize;
		const endY = Math.ceil(bottom / gridSize) * gridSize;

		ctx.beginPath();
		ctx.strokeStyle = '#ddd';
		ctx.lineWidth = 1 / context.scale; // keep grid thin at any zoom

		// Vertical lines
		for (let x = startX; x <= endX; x += gridSize) {
			ctx.moveTo(x, top);
			ctx.lineTo(x, bottom);
		}

		// Horizontal lines
		for (let y = startY; y <= endY; y += gridSize) {
			ctx.moveTo(left, y);
			ctx.lineTo(right, y);
		}

		ctx.stroke();
	};

	const drawScene = () => {
		if (!ctx) return;

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

		ctx.restore();

		// --- Instructions overlay (not affected by zoom/pan) ---
		ctx.fillStyle = 'rgba(0,0,0,0.6)';
		ctx.fillRect(10, 10, 280, 180);
		ctx.fillStyle = 'white';
		ctx.font = '14px sans-serif';
		ctx.textBaseline = 'top';
		const instructions = [
			'Controls:',
			'🖱️ Drag: Pan',
			'🖱️ Wheel: Zoom at cursor',
			'⌨️ +/-: Zoom in/out',
			'⌨️ 0: zoom 100%',
			'⌨️ f: Fit to screen',
			'⌨️ 1-4: Zoom to region',
			'📱 Pinch: Zoom on mobile',
			'📱 Drag: Pan on mobile',
		];

		instructions.forEach((line, i) => {
			ctx.fillText(line, 20, 20 + i * 18);
		});
	};

	return { render };
};

export default useDrawCanvas;
