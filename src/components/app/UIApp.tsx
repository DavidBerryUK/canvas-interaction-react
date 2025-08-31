import { useRef } from 'react';
import EnumDemoScenes from '../../enums/EnumDemoScenes';
import FactorySceneProvider from '../../factories/FactorySceneProvider';
import type ICanvasDocumentViewerSceneProvider from '../../library/canvasDocumentViewer/interfaces/ICanvasDocumentViewerSceneProvider';
import type React from 'react';
import UICanvasDocumentViewer, { type UICanvasDocumentViewerRef } from '../../library/canvasDocumentViewer/UICanvasDocumentViewer';
import UIToolBar from '../toolBar/UIToolBar';

const UIApp: React.FC = () => {
	const viewerRef = useRef<UICanvasDocumentViewerRef>(null);

	const sceneProvider = useRef<ICanvasDocumentViewerSceneProvider>(FactorySceneProvider.get(EnumDemoScenes.BurgerBarNodesAndNoodles));

	const handleOnSceneChangedEvent = (scene: EnumDemoScenes) => {
		const provider = FactorySceneProvider.get(scene);
		sceneProvider.current = provider;
		viewerRef.current?.navigate.centerDocument(false);
		console.log(provider);
	};

	return (
		<div>
			<UICanvasDocumentViewer sceneProvider={sceneProvider} ref={viewerRef} />
			<UIToolBar onChangeScene={handleOnSceneChangedEvent} />
		</div>
	);
};

export default UIApp;
