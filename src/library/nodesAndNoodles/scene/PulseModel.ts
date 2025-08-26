import type Point from '../../geometry/Point';
import PulseTrailModel from './PulseTrailModel';

const PULSE_DURATION = 2000; // ms for fade

export default class PulseModel {
	startTime: number;
	duration: number;
	pathStart: Point;
	pathEnd: Point;
	trail: Array<PulseTrailModel>;

	constructor(pathStart: Point, pathEnd: Point) {
		this.startTime = performance.now();
		this.duration = PULSE_DURATION;
		this.pathStart = pathStart;
		this.pathEnd = pathEnd;
		this.trail = new Array<PulseTrailModel>();
	}
}
