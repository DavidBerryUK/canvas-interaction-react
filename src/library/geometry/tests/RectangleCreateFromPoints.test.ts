import Point from '../Point';
import Rectangle from '../Rectangle';
import { describe, it, expect } from 'vitest';

describe('Create Rectangle from 2 points', () => {
	it('points simple #1', () => {
		// Arrange

		// Act
		const rectangle = Rectangle.createFromPoints(new Point(50, 20), new Point(250, 75));

		// Assert

		// test - not the same objects
		expect(rectangle.left).toEqual(50);
		expect(rectangle.top).toEqual(20);
		expect(rectangle.right).toEqual(250);
		expect(rectangle.bottom).toEqual(75);
	});

	it('points simple #2', () => {
		// Arrange

		// Act
		const rectangle = Rectangle.createFromPoints(new Point(250, 75), new Point(50, 20));

		// Assert

		// test - not the same objects
		expect(rectangle.left).toEqual(50);
		expect(rectangle.top).toEqual(20);
		expect(rectangle.right).toEqual(250);
		expect(rectangle.bottom).toEqual(75);
	});
});
