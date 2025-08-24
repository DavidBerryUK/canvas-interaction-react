import Point from './Point';
import Size from './Size';

export default class Rectangle {
	origin: Point;
	size: Size;

	static createFromDomRect(rect: DOMRect): Rectangle {
		return new Rectangle(new Point(rect.x, rect.y), new Size(rect.width, rect.height));
	}

	static get zero(): Rectangle {
		return new Rectangle(Point.zero, Size.zero);
	}

	static get infinite(): Rectangle {
		return new Rectangle(Point.infinite, Size.infinite);
	}

	static createFromPoints(a: Point, b: Point) {
		const minX = Math.min(a.x, b.x);
		const maxX = Math.max(a.x, b.x);
		const w = maxX - minX;
		const minY = Math.min(a.y, b.y);
		const maxY = Math.max(a.y, b.y);
		const h = maxY - minY;
		return new Rectangle(new Point(minX, minY), new Size(w, h));
	}

	//
	// create rectangle that will contain all provided rectangles
	//
	static createEncapsulatingRectangle(rectangles: Array<Rectangle> | undefined | null): Rectangle {
		if (rectangles === undefined || rectangles === null || rectangles.length === 0) {
			return Rectangle.zero;
		}

		let { left: minX, top: minY, right: maxX, bottom: maxY } = rectangles[0];
		const count = rectangles.length;

		for (let i = 1; i < count; i += 1) {
			const rect = rectangles[i];
			minX = Math.min(minX, rect.left);
			minY = Math.min(minY, rect.top);
			maxX = Math.max(maxX, rect.right);
			maxY = Math.max(maxY, rect.bottom);
		}

		return new Rectangle(new Point(minX, minY), new Size(maxX - minX, maxY - minY));
	}

	get x(): number {
		return this.origin.x;
	}

	get y(): number {
		return this.origin.y;
	}

	get width(): number {
		return this.size.width;
	}

	get height(): number {
		return this.size.height;
	}

	get widthHalf(): number {
		return this.size.halfWidth;
	}

	get heightHalf(): number {
		return this.size.halfHeight;
	}

	get centerX(): number {
		return this.origin.x + this.widthHalf;
	}

	get centerY(): number {
		return this.origin.y + this.heightHalf;
	}

	get left(): number {
		return this.origin.x;
	}

	get right(): number {
		return this.origin.x + this.size.width;
	}

	get top(): number {
		return this.origin.y;
	}

	get bottom(): number {
		return this.origin.y + this.size.height;
	}

	constructor(origin: Point, size: Size) {
		this.origin = origin;
		this.size = size;
	}

	toString(): string {
		return `${this.origin} ${this.size}`;
	}

	clone() {
		return new Rectangle(this.origin.clone(), this.size.clone());
	}

	cloneWithOrigin(value: Point): Rectangle {
		return new Rectangle(value, this.size);
	}

	cloneWithSize(value: Size): Rectangle {
		return new Rectangle(this.origin, value);
	}

	cloneWithX(value: number): Rectangle {
		return new Rectangle(this.origin.cloneWithX(value), this.size);
	}

	cloneWithY(value: number): Rectangle {
		return new Rectangle(this.origin.cloneWithY(value), this.size);
	}

	cloneWithWidth(value: number): Rectangle {
		return new Rectangle(this.origin, this.size.cloneWithWidth(value));
	}

	cloneWithHeight(value: number): Rectangle {
		return new Rectangle(this.origin, this.size.cloneWithHeight(value));
	}

	//
	// testers
	//
	isLeftOf(target: Rectangle): boolean {
		return this.right < target.left;
	}

	isRightOf(target: Rectangle): boolean {
		return this.left > target.right;
	}

	isAbove(target: Rectangle): boolean {
		return this.bottom < target.top;
	}

	isBelow(target: Rectangle): boolean {
		return this.top > target.bottom;
	}

	// determine if rectangle is inside another rectangle
	//
	isFullyContainedByRect(container: Rectangle): boolean {
		return (
			this.left >= container.left &&
			this.left <= container.right &&
			this.right >= container.left &&
			this.right <= container.right &&
			this.top >= container.top &&
			this.top <= container.bottom &&
			this.bottom >= container.top &&
			this.bottom <= container.bottom
		);
	}

	/**
	 * Determines whether this rectangle intersects with the target rectangle.
	 * Returns true if any part of the rectangles overlap, including edges or corners.
	 */
	intersects(target: Rectangle): boolean {
		return !(this.left > target.right || this.right < target.left || this.top > target.bottom || this.bottom < target.top);
	}
	hitTest(origin: Point): boolean {
		return this.left <= origin.x && this.right >= origin.x && this.top <= origin.y && this.bottom >= origin.y;
	}
}
