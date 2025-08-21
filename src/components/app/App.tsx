import type React from 'react';
import CanvasViewer from '../canvas/UICanvas';
import UIInstructions from '../instructions/UIInstructions';

const App: React.FC = () => {
	return (
		<>
			<CanvasViewer />
			<UIInstructions />
		</>
	);
};

export default App;
