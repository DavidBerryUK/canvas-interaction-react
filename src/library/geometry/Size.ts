export default class Size {
	width: number;
	height: number;
	readonly halfWidth: number;

	readonly halfHeight: number;

	static get zero(): Size {
		return new Size(0, 0);
	}

	static get infinite(): Size {
		return new Size(Infinity, Infinity);
	}

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.halfWidth = width / 2;
		this.halfHeight = height / 2;
	}

	clone(): Size {
		return new Size(this.width, this.height);
	}

	cloneWithWidth(value: number): Size {
		return new Size(value, this.height);
	}

	cloneWithHeight(value: number): Size {
		return new Size(this.width, value);
	}

	toString(): string {
		return `(${this.width} x ${this.height})`;
	}
}
