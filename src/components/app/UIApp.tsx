import DemoSceneProvider from './demoSceneProviders/demo/DemoSceneProvider';
import type EnumDemoScenes from '../../enums/EnumDemoScenes';
import type React from 'react';
import UICanvasDocumentViewer from '../../library/canvasDocumentViewer/UICanvasDocumentViewer';
import UIToolBar from '../toolBar/UIToolBar';

const UIApp: React.FC = () => {
	const sceneProvider = new DemoSceneProvider();

	const handleOnSceneChangedEvent = (scene: EnumDemoScenes) => {
		console.log(scene);
	};

	return (
		<div>
			<UICanvasDocumentViewer sceneProvider={sceneProvider} />
			<UIToolBar onChangeScene={handleOnSceneChangedEvent} />
		</div>
	);
};

export default UIApp;
