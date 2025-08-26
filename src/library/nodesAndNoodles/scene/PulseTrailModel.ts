import type Point from '../../geometry/Point';

export default class PulseTrailModel {
	point: Point;
	startTime: number;

	get age(): number {
		return performance.now() - this.startTime;
	}

	constructor(point: Point) {
		this.point = point;
		this.startTime = performance.now();
	}
}
