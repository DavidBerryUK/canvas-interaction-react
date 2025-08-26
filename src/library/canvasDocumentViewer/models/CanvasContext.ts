import Point from '../../geometry/Point';

export default class CanvasContext {
	animated: boolean = true; // are transistions (move/zoom) animated
	scale: number = 1; // canvas zoom factor
	targetScale: number = 1; // animation target zoom level
	offset: Point = Point.zero; // actual canvas offset
	target: Point = Point.zero; // animation target position
	isDragging = false; // is the cursor dragging, (mouse button is down)
	lastMouseCanvasPosition: Point = Point.zero; // last recorded position of the mouse
	touchGesturePinchMid: Point = Point.zero; // for touch gesture handling
	touchGestureLastDist: number = 0;

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
