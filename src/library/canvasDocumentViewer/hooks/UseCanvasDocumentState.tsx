import { useRef } from 'react';
import CanvasContext from '../models/CanvasContext';

const useCanvasDocumentState = () => {
	const canvasState = useRef<CanvasContext>(new CanvasContext());

	return {
		canvasState: canvasState.current!,
	};
};

export default useCanvasDocumentState;
