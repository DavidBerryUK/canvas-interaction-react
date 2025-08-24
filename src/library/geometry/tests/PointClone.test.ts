import Point from '../Point';
import { describe, it, expect } from 'vitest';

describe('Point Cloning', () => {
	it('basic clone', () => {
		//  Arrange
		const originalClone = new Point(200, 500);

		// Act
		const origin = originalClone.clone();

		// Assert
		expect(origin.x).toBe(200);
		expect(origin.y).toBe(500);
		expect(origin === originalClone).toBeFalsy();
	});

	it('clone with x', () => {
		//  Arrange
		const originalClone = new Point(200, 500);

		// Act
		const origin = originalClone.cloneWithX(950);

		// Assert
		expect(origin.x).toBe(950);
		expect(origin.y).toBe(500);
		expect(origin === originalClone).toBeFalsy();
	});

	it('clone with y', () => {
		//  Arrange
		const originalClone = new Point(200, 500);

		// Act
		const origin = originalClone.cloneWithY(10250);

		// Assert
		expect(origin.x).toBe(200);
		expect(origin.y).toBe(10250);
		expect(origin === originalClone).toBeFalsy();
	});
});
