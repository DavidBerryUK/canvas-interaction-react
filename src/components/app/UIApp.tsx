import { useState } from 'react';
import EnumDemoScenes from '../../enums/EnumDemoScenes';
import FactorySceneProvider from '../../factories/FactorySceneProvider';
import type ICanvasDocumentViewerSceneProvider from '../../library/canvasDocumentViewer/interfaces/ICanvasDocumentViewerSceneProvider';
import type React from 'react';
import UICanvasDocumentViewer from '../../library/canvasDocumentViewer/UICanvasDocumentViewer';
import UIToolBar from '../toolBar/UIToolBar';

const UIApp: React.FC = () => {
	const [sceneProvider, setSceneProvider] = useState<ICanvasDocumentViewerSceneProvider>(FactorySceneProvider.get(EnumDemoScenes.BurgerBarNodesAndNoodles));

	const handleOnSceneChangedEvent = (scene: EnumDemoScenes) => {
		const provider = FactorySceneProvider.get(scene);
		setSceneProvider(provider);
		console.log(provider);
	};

	return (
		<div>
			<UICanvasDocumentViewer sceneProvider={sceneProvider} />
			<UIToolBar onChangeScene={handleOnSceneChangedEvent} />
		</div>
	);
};

export default UIApp;
