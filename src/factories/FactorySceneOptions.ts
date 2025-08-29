import EnumDemoScenes from '../enums/EnumDemoScenes';
import OptionModel from '../models/OptionModel';

/**
 * Allow the user to choose which predefined scene they wish to view
 */
export default class FactorySceneOptions {
	static get(): Array<OptionModel> {
		return [new OptionModel(EnumDemoScenes.RandomShapes, 'Random Shapes'), new OptionModel(EnumDemoScenes.BurgerBarNodesAndNoodles, 'Burger Bar Nodes and Noodles')];
	}
}
