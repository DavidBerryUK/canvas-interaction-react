import type CanvasContext from '../models/CanvasContext';
// Graph-paper theme colors

const BACKGROUND_COLOR = '#DCEEFF'; // pale, icy blue
const MINOR_LINE_COLOR = '#A0C4E8'; // lighter blue for minor lines
const MAJOR_LINE_COLOR = '#719FCC'; // stronger blue for major lines
const CROSS_MARK_COLOR = '#3F5C7A'; // '#567A99'; // darker, soft blue for cross marks
const LABEL_COLOR = '#3F5C7A'; // dark blue for labels

const useDrawGrid = () => {
	const alphaCache = new Map<string, number>();

	const drawGrid = (context: React.RefObject<CanvasContext>, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		// Fill background
		// Fill background
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = BACKGROUND_COLOR;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();

		const zoom = context.current.scale;
		const minPixels = 50;
		const baseSpacing = 50;
		const niceFactors = [1, 2, 5];

		let spacing = baseSpacing;
		while (spacing * zoom < minPixels) spacing *= 2;
		while (spacing * zoom > minPixels * 4) spacing /= 2;

		const exponent = Math.floor(Math.log10(spacing));
		const factor = spacing / Math.pow(10, exponent);
		const niceFactor = niceFactors.find((f) => factor <= f) ?? 10;

		const minorSpacing = niceFactor * Math.pow(10, exponent);
		const majorSpacing = minorSpacing * 4;

		const invScale = 1 / zoom;
		const left = -context.current.offset.x * invScale;
		const top = -context.current.offset.y * invScale;
		const right = left + canvas.width * invScale;
		const bottom = top + canvas.height * invScale;

		const centerX = left + (right - left) / 2;
		const centerY = top + (bottom - top) / 2;
		const fadeDist = Math.max(right - left, bottom - top) / 2;

		const getTargetAlpha = (x: number, y: number, baseAlpha: number) => {
			const dx = Math.abs(x - centerX);
			const dy = Math.abs(y - centerY);
			const d = Math.sqrt(dx * dx + dy * dy);
			return Math.max(0.1, baseAlpha * (1 - d / fadeDist));
		};

		const interpolateAlpha = (key: string, target: number, factor = 0.15) => {
			const prev = alphaCache.get(key) ?? target;
			const next = prev + (target - prev) * factor;
			alphaCache.set(key, next);
			return next;
		};

		// Minor grid lines
		if (zoom >= 0.2) {
			for (let x = Math.floor(left / minorSpacing) * minorSpacing; x <= right; x += minorSpacing) {
				const key = `mx_${x}`;
				const alpha = interpolateAlpha(key, getTargetAlpha(x, centerY, 0.3));
				ctx.strokeStyle = `${MINOR_LINE_COLOR}${Math.floor(alpha * 255)
					.toString(16)
					.padStart(2, '0')}`;
				ctx.lineWidth = 1 / zoom;
				ctx.beginPath();
				ctx.moveTo(x, top);
				ctx.lineTo(x, bottom);
				ctx.stroke();
			}
			for (let y = Math.floor(top / minorSpacing) * minorSpacing; y <= bottom; y += minorSpacing) {
				const key = `my_${y}`;
				const alpha = interpolateAlpha(key, getTargetAlpha(centerX, y, 0.3));
				ctx.strokeStyle = `${MINOR_LINE_COLOR}${Math.floor(alpha * 255)
					.toString(16)
					.padStart(2, '0')}`;
				ctx.lineWidth = 1 / zoom;
				ctx.beginPath();
				ctx.moveTo(left, y);
				ctx.lineTo(right, y);
				ctx.stroke();
			}
		}

		// Major grid lines
		for (let x = Math.floor(left / majorSpacing) * majorSpacing; x <= right; x += majorSpacing) {
			const key = `Mx_${x}`;
			const alpha = interpolateAlpha(key, getTargetAlpha(x, centerY, 0.6));
			ctx.strokeStyle = `${MAJOR_LINE_COLOR}${Math.floor(alpha * 255)
				.toString(16)
				.padStart(2, '0')}`;
			ctx.lineWidth = 2 / zoom;
			ctx.beginPath();
			ctx.moveTo(x, top);
			ctx.lineTo(x, bottom);
			ctx.stroke();
		}
		for (let y = Math.floor(top / majorSpacing) * majorSpacing; y <= bottom; y += majorSpacing) {
			const key = `My_${y}`;
			const alpha = interpolateAlpha(key, getTargetAlpha(centerX, y, 0.6));
			ctx.strokeStyle = `${MAJOR_LINE_COLOR}${Math.floor(alpha * 255)
				.toString(16)
				.padStart(2, '0')}`;
			ctx.lineWidth = 2 / zoom;
			ctx.beginPath();
			ctx.moveTo(left, y);
			ctx.lineTo(right, y);
			ctx.stroke();
		}

		// Cross marks
		if (zoom >= 0.4) {
			const crossSize = 5 / zoom;
			for (let x = Math.floor(left / majorSpacing) * majorSpacing; x <= right; x += majorSpacing) {
				for (let y = Math.floor(top / majorSpacing) * majorSpacing; y <= bottom; y += majorSpacing) {
					const key = `cross_${x}_${y}`;
					const alpha = interpolateAlpha(key, getTargetAlpha(x, y, 0.6));
					ctx.strokeStyle = `${CROSS_MARK_COLOR}${Math.floor(alpha * 255)
						.toString(16)
						.padStart(2, '0')}`;
					ctx.lineWidth = 1 / zoom;
					ctx.beginPath();
					ctx.moveTo(x - crossSize, y);
					ctx.lineTo(x + crossSize, y);
					ctx.moveTo(x, y - crossSize);
					ctx.lineTo(x, y + crossSize);
					ctx.stroke();
				}
			}
		}

		// Labels
		if (zoom >= 0.4) {
			// --- Major grid labels ---
			ctx.save();

			// Place labels in **screen-space** so they don't scale with zoom
			ctx.setTransform(1, 0, 0, 1, 0, 0);

			ctx.fillStyle = LABEL_COLOR;
			ctx.font = '12px sans-serif';
			ctx.textBaseline = 'top';
			const labelOffset = 2;

			for (let x = Math.floor(left / majorSpacing) * majorSpacing; x <= right; x += majorSpacing) {
				const screenX = x * zoom + context.current.offset.x; // transform world → screen
				if (screenX >= 0 && screenX <= canvas.width) {
					ctx.fillText(`${Math.round(x)}`, screenX + labelOffset, 0 + labelOffset);
				}
			}

			for (let y = Math.floor(top / majorSpacing) * majorSpacing; y <= bottom; y += majorSpacing) {
				const screenY = y * zoom + context.current.offset.y;
				if (screenY >= 0 && screenY <= canvas.height) {
					ctx.fillText(`${Math.round(y)}`, 0 + labelOffset, screenY + labelOffset);
				}
			}

			ctx.restore();
		}
	};
	return { drawGrid };
};

export default useDrawGrid;
