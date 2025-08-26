export default class UtilitiesEasing {
	static easeInQuad(x: number): number {
		return x * x;
	}

	static easeOutQuad(x: number): number {
		return 1 - (1 - x) * (1 - x);
	}

	static easeInSine(x: number): number {
		return 1 - Math.cos((x * Math.PI) / 2);
	}

	static easeOutSine(x: number): number {
		return Math.sin((x * Math.PI) / 2);
	}

	static easeInCubic(x: number): number {
		return x * x * x;
	}

	static easeOutCubic(x: number): number {
		return 1 - Math.pow(1 - x, 3);
	}
}
