export default class SizeModel {
	width: number;
	height: number;

	static get zero(): SizeModel {
		return new SizeModel(0, 0);
	}

	static get infinite(): SizeModel {
		return new SizeModel(Infinity, Infinity);
	}

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	cloneWithWidth(value: number): SizeModel {
		return new SizeModel(value, this.height);
	}

	cloneWithHeight(value: number): SizeModel {
		return new SizeModel(this.width, value);
	}

	toString(): string {
		return `(${this.width} x ${this.height})`;
	}
}
