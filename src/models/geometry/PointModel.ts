export default class PointModel {
	x: number;
	y: number;

	static get zero(): PointModel {
		return new PointModel(0, 0);
	}

	static get infinite(): PointModel {
		return new PointModel(Infinity, Infinity);
	}

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	cloneWithX(value: number): PointModel {
		return new PointModel(value, this.y);
	}

	cloneWithY(value: number): PointModel {
		return new PointModel(this.x, value);
	}

	toString(): string {
		return `(${this.x}, ${this.y})`;
	}
}
