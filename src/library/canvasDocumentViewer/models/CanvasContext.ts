import Point from '../../geometry/Point';

export default class CanvanContext {
	scale = 1;
	targetScale = 1;
	isDragging = false;
	lastDist = 0;
	offset: Point = Point.zero;
	target: Point = Point.zero;
	last: Point = Point.zero;
	lastMouse: Point = Point.zero;
	pinchMid: Point = Point.zero;

	minX = Infinity;
	minY = Infinity;
	maxX = -Infinity;
	maxY = -Infinity;
}
