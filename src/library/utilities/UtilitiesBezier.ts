import Point from '../models/geometry/Point';

export default class UtilitiesBezier {
	/**
	 *
	 * @param start
	 * @param end
	 * @returns
	 */
	static getBezierControlPoints(start: Point, end: Point): Array<Point> {
		const dx = (end.x - start.x) * 0.5;
		const c1 = new Point(start.x + dx, start.y);
		const c2 = new Point(end.x - dx, end.y);
		return [start, c1, c2, end];
	}

	/**
	 *
	 * @param t
	 * @param p0
	 * @param p1
	 * @param p2
	 * @param p3
	 * @returns
	 */
	static cubicBezierPoint(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
		const u = 1 - t;
		const tt = t * t;
		const uu = u * u;
		const uuu = uu * u;
		const ttt = tt * t;

		return new Point(uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x, uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y);
	}
}
