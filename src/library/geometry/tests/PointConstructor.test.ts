import Point from '../Point';
import { describe, it, expect } from 'vitest';

describe('Point Constructors', () => {
	it('constructor', () => {
		// Act
		const origin = new Point(100, 250);

		// Assert
		expect(origin.x).toBe(100);
		expect(origin.y).toBe(250);
	});

	it('zero', () => {
		// Act
		const origin = Point.zero;

		// Assert
		expect(origin.x).toBe(0);
		expect(origin.y).toBe(0);
	});
});
