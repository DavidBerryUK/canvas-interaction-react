import NodeModel from './NodeModel';
import PulseModel from './PulseModel';
import PulseTrailModel from './PulseTrailModel';
import UtilitiesBezier from '../../utilities/UtilitiesBezier';
import UtilitiesEasing from '../../utilities/UtilitiesEasing';
import AppConst from '../../../configurations/AppConst';
import type ConnectionSocketModel from './ConnectionSocketModel';

export default class ConnectionNoodleModel {
	from: NodeModel;
	to: NodeModel;
	fromSocket: ConnectionSocketModel;
	toSocket: ConnectionSocketModel;

	pulses: Array<PulseModel> = new Array<PulseModel>();

	constructor(from: NodeModel, to: NodeModel, fromSocket: ConnectionSocketModel, toSocket: ConnectionSocketModel) {
		this.from = from;
		this.to = to;
		this.fromSocket = fromSocket;
		this.toSocket = toSocket;
	}

	otherNode(node: NodeModel): NodeModel {
		if (node.id === this.from.id) {
			return this.to;
		}

		return this.from;
	}

	draw(ctx: CanvasRenderingContext2D) {
		//const start = new Point(this.from.rectangle.right, this.from.rectangle.centerY);
		//const end = new Point(this.to.rectangle.left, this.to.rectangle.centerY);

		const start = this.fromSocket.point.cloneWithAdd(this.from.rectangle.origin);
		const end = this.toSocket.point.cloneWithAdd(this.to.rectangle.origin);

		const [p0, p1, p2, p3] = UtilitiesBezier.getBezierControlPoints(start, end);

		ctx.strokeStyle = AppConst.noodle.COLOR;
		ctx.lineWidth = AppConst.noodle.WIDTH;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(p0.x, p0.y);
		ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		ctx.stroke();

		this.drawPulses(ctx);
	}

	private drawPulses(ctx: CanvasRenderingContext2D) {
		const now = performance.now();

		ctx.fillStyle = AppConst.pulse.COLOR;
		ctx.beginPath();

		this.pulses = this.pulses.filter((pulse) => {
			const elapsed = now - pulse.startTime;
			const appearEnd = AppConst.pulse.APPEAR_DURATION;
			const travelEnd = appearEnd + AppConst.pulse.TRAVEL_DURATION;
			const endTime = travelEnd + AppConst.pulse.FADE_DURATION;

			let point;
			let radius = AppConst.pulse.RADIUS;

			// Pulse appearance
			if (elapsed < appearEnd) {
				const local = elapsed / appearEnd;
				radius = UtilitiesEasing.easeOutSine(local) * AppConst.pulse.RADIUS;
				point = pulse.pathStart;
			}
			// Pulse traveling along the path
			else if (elapsed < travelEnd) {
				const travelT = (elapsed - appearEnd) / AppConst.pulse.TRAVEL_DURATION;
				const [p0, p1, p2, p3] = UtilitiesBezier.getBezierControlPoints(pulse.pathStart, pulse.pathEnd);
				point = UtilitiesBezier.cubicBezierPoint(travelT, p0, p1, p2, p3);
				pulse.trail.push(new PulseTrailModel(point));
			}
			// Pulse fading out
			else {
				const fadeT = (elapsed - travelEnd) / AppConst.pulse.FADE_DURATION;
				radius = UtilitiesEasing.easeOutSine(1 - fadeT) * AppConst.pulse.RADIUS;
				point = pulse.pathEnd;
			}

			// Clean up old trail points
			pulse.trail = pulse.trail.filter((h) => h.age <= AppConst.pulse.TRAIL_DURATION);

			// Draw trail points
			pulse.trail.forEach((h) => {
				const trailScale = Math.max(1 - h.age / AppConst.pulse.TRAIL_DURATION, 0);
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
