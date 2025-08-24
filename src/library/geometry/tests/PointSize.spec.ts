import Size from '../Size';
import { describe, it, expect } from 'vitest';

describe('Size Constructors', () => {
	it('basic clone', () => {
		//  Arrange
		const originalClone = new Size(250, 590);

		// Act
		const size = originalClone.clone();

		// Assert
		expect(size.width).toBe(250);
		expect(size.height).toBe(590);
		expect(size === originalClone).toBeFalsy();
	});

	it('clone with width', () => {
		//  Arrange
		const originalClone = new Size(95, 45);

		// Act
		const size = originalClone.cloneWithWidth(950);

		// Assert
		expect(size.width).toBe(950);
		expect(size.height).toBe(45);
		expect(size === originalClone).toBeFalsy();
	});

	it('clone with height', () => {
		//  Arrange
		const originalClone = new Size(90, 180);

		// Act
		const size = originalClone.cloneWithHeight(995);

		// Assert
		expect(size.width).toBe(90);
		expect(size.height).toBe(995);
		expect(size === originalClone).toBeFalsy();
	});
});
