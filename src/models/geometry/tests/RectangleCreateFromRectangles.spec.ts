import Point from '../Point';
import Rectangle from '../Rectangle';
import Size from '../Size';
import { describe, it, expect } from 'vitest';

describe('Create Rectangle to encapsulate array of rectangles', () => {
	it('undefined', () => {
		// Arrange

		// Act
		const rectangle = Rectangle.createEncapsulatingRectangle(null);

		// Assert

		// test - not the same objects
		expect(rectangle).toEqual(Rectangle.zero);
	});

	it('null', () => {
		// Arrange

		// Act
		const rectangle = Rectangle.createEncapsulatingRectangle(null);

		// Assert

		// test - not the same objects
		expect(rectangle).toEqual(Rectangle.zero);
	});

	it('empty array', () => {
		// Arrange

		// Act
		const rectangle = Rectangle.createEncapsulatingRectangle([]);

		// Assert

		// test - not the same objects
		expect(rectangle).toEqual(Rectangle.zero);
	});

	it('single rectangle', () => {
		// Arrange
		const r1 = new Rectangle(new Point(100, 50), new Size(200, 300));

		// Act
		const rectangle = Rectangle.createEncapsulatingRectangle([r1]);

		// Assert

		// test - not the same objects
		expect(rectangle).toEqual(r1);
	});

	it('two rectangle', () => {
		// Arrange
		const r1 = new Rectangle(new Point(100, 50), new Size(200, 300));
		const r2 = new Rectangle(new Point(450, 10), new Size(10, 10));

		// Act
		const rectangle = Rectangle.createEncapsulatingRectangle([r1, r2]);

		// Assert

		// test - not the same objects
		expect(rectangle.left).toEqual(100);
		expect(rectangle.right).toEqual(460);
		expect(rectangle.top).toEqual(10);
		expect(rectangle.bottom).toEqual(350);
	});

	it('returns a rectangle containing all the rectangles in the array', () => {
		const rect1 = new Rectangle(new Point(10, 10), new Size(20, 20));
		const rect2 = new Rectangle(new Point(30, 30), new Size(40, 40));
		const rect3 = new Rectangle(new Point(15, 15), new Size(25, 25));
		const rect4 = new Rectangle(new Point(5, 5), new Size(30, 30));
		const result = Rectangle.createEncapsulatingRectangle([rect1, rect2, rect3, rect4]);
		expect(result.x).toBe(5);
		expect(result.y).toBe(5);
		expect(result.width).toBe(65);
		expect(result.height).toBe(65);
	});

	it('returns a rectangle with correct dimensions when rectangles overlap', () => {
		const rect1 = new Rectangle(new Point(10, 10), new Size(30, 30));
		const rect2 = new Rectangle(new Point(20, 20), new Size(30, 30));
		const result = Rectangle.createEncapsulatingRectangle([rect1, rect2]);
		expect(result.x).toBe(10);
		expect(result.y).toBe(10);
		expect(result.width).toBe(40);
		expect(result.height).toBe(40);
	});
});
