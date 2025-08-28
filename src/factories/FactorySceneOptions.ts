import EnumDemoScenes from '../enums/EnumDemoScenes';
import OptionModel from '../models/OptionModel';

export default class FactorySceneOptions {
	static get(): Array<OptionModel> {
		return [new OptionModel(EnumDemoScenes.RandomShapes, 'Random Shapes'), new OptionModel(EnumDemoScenes.BurgerBarNodesAndNoodles, 'Burger Bar Nodes and Noodles')];
	}
}
