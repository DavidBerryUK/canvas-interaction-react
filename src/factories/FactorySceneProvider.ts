import EnumDemoScenes from '../enums/EnumDemoScenes';
import DemoSceneProvider from '../library/canvasDocumentViewer/demoSceneProviders/demo/DemoSceneProvider';
import type ICanvasDocumentViewerSceneProvider from '../library/canvasDocumentViewer/interfaces/ICanvasDocumentViewerSceneProvider';
import FactoryScene from '../library/nodesAndNoodles/demo/factories/FactoryScene';
import NodesAndNoodlesSceneRenderer from '../library/nodesAndNoodles/renderers/NodesAndNoodlesSceneRenderer';

export default class FactorySceneProvider {
	static get(scene: EnumDemoScenes): ICanvasDocumentViewerSceneProvider {
		if (scene === EnumDemoScenes.BurgerBarNodesAndNoodles) {
			var burgerBarScene = FactoryScene.get();
			return new NodesAndNoodlesSceneRenderer(burgerBarScene);
		}

		return new DemoSceneProvider();
	}
}
