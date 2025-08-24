import Point from '../Point';
import Rectangle from '../Rectangle';
import Size from '../Size';
import { describe, it, expect } from 'vitest';

describe('Rectangle Calculated Properties', () => {
	it('left, right, top, bottom', () => {
		// Arrange
		const origin = new Point(100, 300);
		const size = new Size(50, 80);
		const rectangle = new Rectangle(origin, size);

		// Assert

		expect(rectangle.left).toBe(100);
		expect(rectangle.right).toBe(100 + 50);
		expect(rectangle.top).toBe(300);
		expect(rectangle.bottom).toBe(300 + 80);
	});

	it('centerX, centerY', () => {
		// Arrange
		const origin = new Point(100, 300);
		const size = new Size(50, 80);
		const rectangle = new Rectangle(origin, size);

		// Assert

		expect(rectangle.centerX).toBe(100 + 50 / 2);
		expect(rectangle.centerY).toBe(300 + 80 / 2);
	});

	it('half height, half width', () => {
		// Arrange
		const origin = new Point(100, 300);
		const size = new Size(50, 80);
		const rectangle = new Rectangle(origin, size);

		// Assert

		expect(rectangle.widthHalf).toBe(50 / 2);
		expect(rectangle.heightHalf).toBe(80 / 2);
	});
});
