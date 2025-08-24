import Point from '../Point';
import Rectangle from '../Rectangle';
import Size from '../Size';
import { describe, it, expect } from 'vitest';

describe('Rectangle Location Testers', () => {
	//
	// LEFT
	//
	it('is Left Of - simple positive result', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(100, 100), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(300, 100), new Size(50, 50));

		// Act
		const result = rectangleA.isLeftOf(rectangleB);

		// Assert
		expect(result).toBeTruthy();
	});

	it('is Left Of - simple false result', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(500, 100), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(300, 100), new Size(50, 50));

		// Act
		const result = rectangleA.isLeftOf(rectangleB);

		// Assert
		expect(result).toBeFalsy();
	});

	it('is Left Of - overlap fail', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(100, 100), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(120, 100), new Size(50, 50));

		// Act
		const result = rectangleA.isLeftOf(rectangleB);

		// Assert
		expect(result).toBeFalsy();
	});

	//
	// RIGHT
	//
	it('is Right Of - simple positive result', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(300, 100), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(100, 100), new Size(50, 50));

		// Act
		const result = rectangleA.isRightOf(rectangleB);

		// Assert
		expect(result).toBeTruthy();
	});

	it('is Right Of - simple false result', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(300, 100), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(800, 100), new Size(50, 50));

		// Act
		const result = rectangleA.isRightOf(rectangleB);

		// Assert
		expect(result).toBeFalsy();
	});

	it('is Right Of - overlap fail', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(300, 100), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(290, 100), new Size(50, 50));

		// Act
		const result = rectangleA.isRightOf(rectangleB);

		// Assert
		expect(result).toBeFalsy();
	});

	//
	// ABOVE
	//

	it('is Above - simple positive result', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(100, 100), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(100, 300), new Size(50, 50));

		// Act
		const result = rectangleA.isAbove(rectangleB);

		// Assert
		expect(result).toBeTruthy();
	});

	it('is Above - simple false result', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(100, 500), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(100, 300), new Size(50, 50));

		// Act
		const result = rectangleA.isAbove(rectangleB);

		// Assert
		expect(result).toBeFalsy();
	});

	it('is Above - overlap fail', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(100, 100), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(100, 120), new Size(50, 50));

		// Act
		const result = rectangleA.isLeftOf(rectangleB);

		// Assert
		expect(result).toBeFalsy();
	});

	//
	// Below
	//

	it('is Below - simple positive result', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(100, 300), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(100, 100), new Size(50, 50));

		// Act
		const result = rectangleA.isBelow(rectangleB);

		// Assert
		expect(result).toBeTruthy();
	});

	it('is Below - simple false result', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(100, 300), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(100, 500), new Size(50, 50));

		// Act
		const result = rectangleA.isBelow(rectangleB);

		// Assert
		expect(result).toBeFalsy();
	});

	it('is Below - overlap fail', () => {
		// Arrange
		const rectangleA = new Rectangle(new Point(100, 120), new Size(50, 50));
		const rectangleB = new Rectangle(new Point(100, 100), new Size(50, 50));

		// Act
		const result = rectangleA.isBelow(rectangleB);

		// Assert
		expect(result).toBeFalsy();
	});
});
