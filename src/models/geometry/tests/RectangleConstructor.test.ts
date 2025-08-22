import Point from '../Point';
import Rectangle from '../Rectangle';
import Size from '../Size';
import { describe, it, expect } from 'vitest';

describe('Rectangle Constructors', () => {
	it('constructor', () => {
		// Act
		const origin = new Point(100, 250);
		const size = new Size(45, 95);
		const rectangle = new Rectangle(origin, size);

		// Assert
		expect(rectangle.origin === origin).toBeTruthy();
		expect(rectangle.size === size).toBeTruthy();
	});

	it('zero', () => {
		// Act

		const rectangle = Rectangle.zero;

		// Assert
		expect(rectangle.origin.x).toBe(0);
		expect(rectangle.origin.y).toBe(0);
		expect(rectangle.size.width).toBe(0);
		expect(rectangle.size.height).toBe(0);
	});
});
