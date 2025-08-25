import Point from '../../geometry/Point';

export default class CanvasContext {
	// are transistions (move/zoom) animated
	animated: boolean = true;

	// canvas zoom
	scale: number = 1;
	targetScale: number = 1; // animation target zoom level

	// canvas offset
	offset: Point = Point.zero;
	target: Point = Point.zero; // animation target position

	isDragging = false;
	lastDist = 0;

	last: Point = Point.zero;
	lastMouse: Point = Point.zero;
	pinchMid: Point = Point.zero;

	minX = Infinity;
	minY = Infinity;
	maxX = -Infinity;
	maxY = -Infinity;

	getPoint = (withAnimation: boolean) => {
		if (withAnimation) {
			return this.target;
		}
		return this.offset;
	};

	setPoint = (withAnimation: boolean, value: Point) => {
		this.target = value;
		if (withAnimation === false) {
			this.offset = value;
		}
	};

	setScale = (withAnimation: boolean, value: number) => {
		this.targetScale = value;
		if (withAnimation === false) {
			this.scale = value;
		}
	};
}
