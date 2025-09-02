import { useRef, useState } from 'react';
import EnumDemoScenes from '../../enums/EnumDemoScenes';
import FactorySceneProvider from '../../factories/FactorySceneProvider';
import type ICanvasDocumentViewerSceneProvider from '../../library/canvasDocumentViewer/interfaces/ICanvasDocumentViewerSceneProvider';
import type React from 'react';
import UICanvasDocumentViewer, { type UICanvasDocumentViewerRef } from '../../library/canvasDocumentViewer/UICanvasDocumentViewer';
import UIToolBar from '../toolBar/UIToolBar';

const UIApp: React.FC = () => {
	const viewerRef = useRef<UICanvasDocumentViewerRef>(null);
	const [sceneId, setSceneId] = useState<EnumDemoScenes>(EnumDemoScenes.BurgerBarNodesAndNoodles);
	const sceneProvider = useRef<ICanvasDocumentViewerSceneProvider>(FactorySceneProvider.get(EnumDemoScenes.BurgerBarNodesAndNoodles));

	const handleOnSceneChangedEvent = (sceneId: EnumDemoScenes) => {
		setSceneId(sceneId);
		const provider = FactorySceneProvider.get(sceneId);
		sceneProvider.current = provider;
		viewerRef.current?.navigate.centerDocument(false);
	};

	return (
		<div>
			<UICanvasDocumentViewer sceneProvider={sceneProvider} ref={viewerRef} />
			<UIToolBar sceneId={sceneId} onChangeScene={handleOnSceneChangedEvent} />
		</div>
	);
};

export default UIApp;
