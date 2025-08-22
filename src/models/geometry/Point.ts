export default class Point {
	x: number;
	y: number;

	static get zero(): Point {
		return new Point(0, 0);
	}

	static get infinite(): Point {
		return new Point(Infinity, Infinity);
	}

	static get fromMouseEvent(): (e: MouseEvent) => Point {
		return (e: MouseEvent) => new Point(e.clientX, e.clientY);
	}

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	clone(): Point {
		return new Point(this.x, this.y);
	}

	cloneWithX(value: number): Point {
		return new Point(value, this.y);
	}

	cloneWithY(value: number): Point {
		return new Point(this.x, value);
	}

	cloneWithAdd(o: Point): Point {
		return new Point(this.x + o.x, this.y + o.y);
	}

	cloneWithSubtract(o: Point): Point {
		return new Point(this.x - o.x, this.y - o.y);
	}

	equals(o: Point): boolean {
		return this.x === o.x && this.y === o.y;
	}

	toString(): string {
		return `(${this.x}, ${this.y})`;
	}
}
