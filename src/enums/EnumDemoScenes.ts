enum EnumDemoScenes {
	RandomShapes = 'R',
	BurgerBarNodesAndNoodles = 'B',
}

export default EnumDemoScenes;

export function getEnumDemoScene(value: string): EnumDemoScenes | undefined {
	return Object.values(EnumDemoScenes).includes(value as EnumDemoScenes) ? (value as EnumDemoScenes) : undefined;
}
