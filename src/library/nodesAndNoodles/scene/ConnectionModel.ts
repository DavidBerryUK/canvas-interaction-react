import NodeModel from './NodeModel';
import Point from '../../geometry/Point';
import PulseTrailModel from './PulseTrailModel';
import type PulseModel from './PulseModel';
import UtilitiesBezier from '../../utilities/UtilitiesBezier';
import UtilitiesEasing from '../../utilities/UtilitiesEasing';

// Group all constants into a single structure
const ConnectionConstants = {
	PULSE_RADIUS: 8, // Default radius in pixels
	PULSE_APPEAR_DURATION: 200, // miliseconds to grow in before moving
	PULSE_FADE_DURATION: 200, // miliseconds to shrink after arriving
	PULSE_TRAVEL_DURATION: 1600, // miliseconds to move along path
	PULSE_TRAIL_DURATION: 300, // miliseconds for fade of trail points
	PULSE_COLOR: 'rgba(176, 196, 220, 0.8)', // Color of the pulse
	CONNECTION_COLOR: 'steelblue', // Color of the connection line
	CONNECTION_WIDTH: 4, // Width of the connection line in pixels
} as const;

export default class ConnectionModel {
	from: NodeModel;
	to: NodeModel;
	pulses: Array<PulseModel> = new Array<PulseModel>();

	constructor(from: NodeModel, to: NodeModel) {
		this.from = from;
		this.to = to;
	}

	draw(ctx: CanvasRenderingContext2D) {
		const start = new Point(this.from.rectangle.right, this.from.rectangle.centerY);
		const end = new Point(this.to.rectangle.left, this.to.rectangle.centerY);
		const [p0, p1, p2, p3] = UtilitiesBezier.getBezierControlPoints(start, end);

		ctx.strokeStyle = ConnectionConstants.CONNECTION_COLOR;
		ctx.lineWidth = ConnectionConstants.CONNECTION_WIDTH;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(p0.x, p0.y);
		ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		ctx.stroke();

		this.drawPulses(ctx);
	}

	private drawPulses(ctx: CanvasRenderingContext2D) {
		const now = performance.now();

		ctx.fillStyle = ConnectionConstants.PULSE_COLOR;
		ctx.beginPath();

		this.pulses = this.pulses.filter((pulse) => {
			const elapsed = now - pulse.startTime;
			const appearEnd = ConnectionConstants.PULSE_APPEAR_DURATION;
			const travelEnd = appearEnd + ConnectionConstants.PULSE_TRAVEL_DURATION;
			const endTime = travelEnd + ConnectionConstants.PULSE_FADE_DURATION;

			let point;
			let radius = ConnectionConstants.PULSE_RADIUS;

			// Pulse appearance
			if (elapsed < appearEnd) {
				const local = elapsed / appearEnd;
				radius = UtilitiesEasing.easeOutSine(local) * ConnectionConstants.PULSE_RADIUS;
				point = pulse.pathStart;
			}
			// Pulse traveling along the path
			else if (elapsed < travelEnd) {
				const travelT = (elapsed - appearEnd) / ConnectionConstants.PULSE_TRAVEL_DURATION;
				const [p0, p1, p2, p3] = UtilitiesBezier.getBezierControlPoints(pulse.pathStart, pulse.pathEnd);
				point = UtilitiesBezier.cubicBezierPoint(travelT, p0, p1, p2, p3);
				pulse.trail.push(new PulseTrailModel(point));
			}
			// Pulse fading out
			else {
				const fadeT = (elapsed - travelEnd) / ConnectionConstants.PULSE_FADE_DURATION;
				radius = UtilitiesEasing.easeOutSine(1 - fadeT) * ConnectionConstants.PULSE_RADIUS;
				point = pulse.pathEnd;
			}

			// Clean up old trail points
			pulse.trail = pulse.trail.filter((h) => h.age <= ConnectionConstants.PULSE_TRAIL_DURATION);

			// Draw trail points
			pulse.trail.forEach((h) => {
				const trailScale = Math.max(1 - h.age / ConnectionConstants.PULSE_TRAIL_DURATION, 0);
				const r = radius * trailScale; // scaled with pulse radius
				if (r > 0) {
					ctx.moveTo(h.point.x + r, h.point.y);
					ctx.arc(h.point.x, h.point.y, r, 0, Math.PI * 2);
				}
			});

			// Draw main pulse
			if (radius > 0) {
				ctx.moveTo(point.x + radius, point.y);
				ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
			}

			// Keep pulse if it or its trail is still active
			return elapsed < endTime || pulse.trail.length > 0;
		});

		ctx.fill();
	}
}
