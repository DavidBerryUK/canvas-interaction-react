import PointModel from './PointModel';
import SizeModel from './SizeModel';

export default class RectangleModel {
	origin: PointModel;
	size: SizeModel;

	static fromDomRect(rect: DOMRect): RectangleModel {
		return new RectangleModel(new PointModel(rect.x, rect.y), new SizeModel(rect.width, rect.height));
	}

	static get zero(): RectangleModel {
		return new RectangleModel(PointModel.zero, SizeModel.zero);
	}

	static get infinite(): RectangleModel {
		return new RectangleModel(PointModel.infinite, SizeModel.infinite);
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
		return this.size.width / 2;
	}

	get heightHalf(): number {
		return this.size.height / 2;
	}

	get xCenter(): number {
		return this.origin.x + this.widthHalf;
	}

	get yCenter(): number {
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

	constructor(origin: PointModel, size: SizeModel) {
		this.origin = origin;
		this.size = size;
	}

	toString(): string {
		return `${this.origin} ${this.size}`;
	}

	cloneWithOrigin(value: PointModel): RectangleModel {
		return new RectangleModel(value, this.size);
	}

	cloneWithSize(value: SizeModel): RectangleModel {
		return new RectangleModel(this.origin, value);
	}

	cloneWithX(value: number): RectangleModel {
		return new RectangleModel(this.origin.cloneWithX(value), this.size);
	}

	cloneWithY(value: number): RectangleModel {
		return new RectangleModel(this.origin.cloneWithY(value), this.size);
	}

	cloneWithWidth(value: number): RectangleModel {
		return new RectangleModel(this.origin, this.size.cloneWithWidth(value));
	}

	cloneWithHeight(value: number): RectangleModel {
		return new RectangleModel(this.origin, this.size.cloneWithHeight(value));
	}

	//
	// testers
	//
	isLeftOf(target: RectangleModel): boolean {
		return this.right < target.left;
	}

	isRightOf(target: RectangleModel): boolean {
		return this.left > target.right;
	}

	isAbove(target: RectangleModel): boolean {
		return this.bottom < target.top;
	}

	isBelow(target: RectangleModel): boolean {
		return this.top > target.bottom;
	}

	// determine if rectangle is inside another rectangle
	//
	isFullyContainedByRect(container: RectangleModel): boolean {
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

	isPartiallyOrFullyContainedByRect(container: RectangleModel): boolean {
		return !(this.left > container.right || this.right < container.left || this.top > container.bottom || this.bottom < container.top);
	}

	hitTest(origin: PointModel): boolean {
		return this.left <= origin.x && this.right >= origin.x && this.top <= origin.y && this.bottom >= origin.y;
	}
}
