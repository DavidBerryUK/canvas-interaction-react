import Rectangle from '../../../library/geometry/Rectangle';

interface ShapeOptions {
	rect: Rectangle;
	radius?: number; // optional, defaults to 0
	fillColor?: string; // optional
	strokeColor?: string; // optional
	lineWidth?: number; // optional, defaults to 1
}

const useDrawPrimitiveShapes = () => {
	const roundedRect = (ctx: CanvasRenderingContext2D, options: ShapeOptions) => {
		const { rect } = options;
		let radius = options.radius ?? 0;
		const fillColor = options.fillColor;
		const strokeColor = options.strokeColor;
		const lineWidth = options.lineWidth ?? 1;

		// Clamp radius to half of width/height
		radius = Math.min(radius, rect.width / 2, rect.height / 2);

		ctx.beginPath();
		ctx.moveTo(rect.x + radius, rect.y);
		ctx.lineTo(rect.x + rect.width - radius, rect.y);
		ctx.quadraticCurveTo(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + radius);
		ctx.lineTo(rect.x + rect.width, rect.y + rect.height - radius);
		ctx.quadraticCurveTo(rect.x + rect.width, rect.y + rect.height, rect.x + rect.width - radius, rect.y + rect.height);
		ctx.lineTo(rect.x + radius, rect.y + rect.height);
		ctx.quadraticCurveTo(rect.x, rect.y + rect.height, rect.x, rect.y + rect.height - radius);
		ctx.lineTo(rect.x, rect.y + radius);
		ctx.quadraticCurveTo(rect.x, rect.y, rect.x + radius, rect.y);
		ctx.closePath();

		if (fillColor) {
			ctx.fillStyle = fillColor;
			ctx.fill();
		}

		if (strokeColor) {
			ctx.strokeStyle = strokeColor;
			ctx.lineWidth = lineWidth;
			ctx.stroke();
		}
	};

	return {
		shapes: {
			roundedRect,
		},
	};
};

export default useDrawPrimitiveShapes;
