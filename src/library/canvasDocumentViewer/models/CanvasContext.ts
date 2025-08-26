import Point from '../../geometry/Point';

/**
 * Represents the current state and interaction context of the canvas.
 *
 * The `CanvasContext` class manages zoom, pan, animation states, and
 * interaction flags used when rendering or manipulating a canvas.
 * It serves as a state container that UI components and rendering logic
 * can read from and update.
 */
export default class CanvasContext {
	/**
	 * Indicates whether canvas transitions (move/zoom) are animated.
	 * Defaults to `true`.
	 */
	animated: boolean = true;

	/**
	 * Current canvas zoom factor.
	 */
	scale: number = 1;

	/**
	 * Target zoom level for animated transitions.
	 */
	targetScale: number = 1;

	/**
	 * Current canvas offset (panning position).
	 */
	offset: Point = Point.zero;

	/**
	 * Target canvas position for animated transitions.
	 */
	target: Point = Point.zero;

	/**
	 * Indicates whether the mouse is currently dragging (mouse button held down).
	 */
	isDragging = false;

	/**
	 * Last recorded position of the mouse in canvas coordinates.
	 */
	lastMouseCanvasPosition: Point = Point.zero;

	/**
	 * Midpoint of a pinch gesture (for touch gesture handling).
	 */
	touchGesturePinchMid: Point = Point.zero;

	/**
	 * Last recorded distance between fingers during a pinch gesture.
	 */
	touchGestureLastDist: number = 0;

	/**
	 * Retrieves the current canvas point (position).
	 *
	 * @param withAnimation - If `true`, returns the animated target position;
	 *                        otherwise, returns the immediate offset.
	 * @returns The current or target position as a `Point`.
	 */
	getPoint = (withAnimation: boolean): Point => {
		return withAnimation ? this.target : this.offset;
	};

	/**
	 * Sets the canvas position (offset).
	 *
	 * @param withAnimation - If `true`, updates the target position only (to be interpolated later).
	 *                        If `false`, updates both the target and immediate offset.
	 * @param value - The new position as a `Point`.
	 */
	setPoint = (withAnimation: boolean, value: Point): void => {
		this.target = value;
		if (!withAnimation) {
			this.offset = value;
		}
	};

	/**
	 * Sets the canvas zoom scale.
	 *
	 * @param withAnimation - If `true`, updates the target scale only (to be interpolated later).
	 *                        If `false`, updates both the target and immediate scale.
	 * @param value - The new zoom scale factor.
	 */
	setScale = (withAnimation: boolean, value: number): void => {
		this.targetScale = value;
		if (!withAnimation) {
			this.scale = value;
		}
	};
}
