import DemoSceneProvider from './demoSceneProviders/demo/DemoSceneProvider';
import type React from 'react';
import UICanvasDocumentViewer from '../../library/canvasDocumentViewer/UICanvasDocumentViewer';

const App: React.FC = () => {
	const sceneProvider = new DemoSceneProvider();
	return <UICanvasDocumentViewer sceneProvider={sceneProvider} />;
};

export default App;
