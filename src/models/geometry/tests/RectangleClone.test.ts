import Point from '../Point';
import Rectangle from '../Rectangle';
import Size from '../Size';
import { describe, it, expect } from 'vitest';

describe('Rectangle Clone', () => {
	it('basic clone', () => {
		// Arrange
		const origin = new Point(100, 250);
		const size = new Size(45, 95);
		const rectangleOriginal = new Rectangle(origin, size);

		// Act
		const rectangle = rectangleOriginal.clone();

		// Assert

		// test - not the same objects
		expect(rectangle === rectangleOriginal).toBeFalsy();
		expect(rectangle.origin === rectangleOriginal.origin).toBeFalsy();
		expect(rectangle.size === rectangleOriginal.size).toBeFalsy();

		// test same values
		expect(rectangle).toEqual(rectangleOriginal);
	});

	it('clone with Size', () => {
		// Arrange
		const originV1 = new Point(100, 250);
		const sizeV1 = new Size(45, 95);
		const rectangleV1 = new Rectangle(originV1, sizeV1);

		// Act
		const sizeV2 = new Size(100, 200);
		const rectangleV2 = rectangleV1.cloneWithSize(sizeV2);

		// Assert

		// test - not the same objects
		expect(rectangleV2 === rectangleV1).toBeFalsy();
		expect(rectangleV2.origin === rectangleV1.origin).toBeTruthy();
		expect(rectangleV2.size === sizeV1).toBeFalsy();

		// test same values
		expect(rectangleV2.origin).toEqual(originV1);
		expect(rectangleV2.size).toEqual(sizeV2);
	});

	it('clone with Origin', () => {
		// Arrange
		const originV1 = new Point(100, 250);
		const sizeV1 = new Size(45, 95);
		const rectangleV1 = new Rectangle(originV1, sizeV1);

		// Act
		const originV2 = new Point(50, 25);
		const rectangleV2 = rectangleV1.cloneWithOrigin(originV2);

		// Assert

		// test - not the same objects
		expect(rectangleV2 === rectangleV1).toBeFalsy();
		expect(rectangleV2.origin === rectangleV1.origin).toBeFalsy();
		expect(rectangleV2.size === sizeV1).toBeTruthy();

		// test same values
		expect(rectangleV2.origin).toEqual(originV2);
		expect(rectangleV2.size).toEqual(sizeV1);
	});

	it('clone with X', () => {
		// Arrange
		const originV1 = new Point(100, 250);
		const sizeV1 = new Size(45, 95);
		const rectangleV1 = new Rectangle(originV1, sizeV1);

		// Act
		const rectangleV2 = rectangleV1.cloneWithX(9);

		// Assert

		// test - not the same objects
		expect(rectangleV2 === rectangleV1).toBeFalsy();
		expect(rectangleV2.origin === rectangleV1.origin).toBeFalsy();

		// test same values
		expect(rectangleV2.size).toEqual(sizeV1);
		expect(rectangleV2.origin.x).toEqual(9);
		expect(rectangleV2.origin.y).toEqual(250);
	});

	it('clone with Y', () => {
		// Arrange
		const originV1 = new Point(100, 250);
		const sizeV1 = new Size(45, 95);
		const rectangleV1 = new Rectangle(originV1, sizeV1);

		// Act
		const rectangleV2 = rectangleV1.cloneWithY(149);

		// Assert

		// test - not the same objects
		expect(rectangleV2 === rectangleV1).toBeFalsy();
		expect(rectangleV2.origin === rectangleV1.origin).toBeFalsy();

		// test same values
		expect(rectangleV2.size).toEqual(sizeV1);
		expect(rectangleV2.origin.x).toEqual(100);
		expect(rectangleV2.origin.y).toEqual(149);
	});

	it('clone with Width', () => {
		// Arrange
		const originV1 = new Point(100, 250);
		const sizeV1 = new Size(45, 95);
		const rectangleV1 = new Rectangle(originV1, sizeV1);

		// Act
		const rectangleV2 = rectangleV1.cloneWithWidth(12345);

		// Assert

		// test - not the same objects
		expect(rectangleV2 === rectangleV1).toBeFalsy();
		expect(rectangleV2.origin === rectangleV1.origin).toBeTruthy();
		expect(rectangleV2.size === rectangleV1.size).toBeFalsy;

		// test same values
		expect(rectangleV2.origin).toEqual(originV1);
		expect(rectangleV2.size.width).toEqual(12345);
		expect(rectangleV2.size.height).toEqual(95);
	});

	it('clone with Height', () => {
		// Arrange
		const originV1 = new Point(100, 250);
		const sizeV1 = new Size(45, 95);
		const rectangleV1 = new Rectangle(originV1, sizeV1);

		// Act
		const rectangleV2 = rectangleV1.cloneWithHeight(5045);

		// Assert

		// test - not the same objects
		expect(rectangleV2 === rectangleV1).toBeFalsy();
		expect(rectangleV2.origin === rectangleV1.origin).toBeTruthy();
		expect(rectangleV2.size === rectangleV1.size).toBeFalsy();

		// test same values
		expect(rectangleV2.origin).toEqual(originV1);
		expect(rectangleV2.size.width).toEqual(45);
		expect(rectangleV2.size.height).toEqual(5045);
	});
});
