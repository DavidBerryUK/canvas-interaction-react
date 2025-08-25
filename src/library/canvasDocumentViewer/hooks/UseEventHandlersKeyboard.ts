import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import type CanvasContext from '../models/CanvasContext';
import useCanvasNavigation from './UseCanvasNavigation';

const useEventHandlersKeyboard = (
	context: CanvasContext,
	provider: ICanvasDocumentViewerSceneProvider,
	canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
	const { navigate } = useCanvasNavigation(canvasRef, context, provider);

	// Reset view

	// Zoom-to-region
	const zoomToRegion = (regionKey: string) => {
		const region = provider.getRegions().find((region) => region.id === regionKey);
		if (!region) {
			return;
		}
		navigate.zoomToRectangle(region.rectangle);
	};

	// --- Keyboard zoom helpers ---

	const handleKeyboardZoomIn = () => {
		navigate.zoomAt(context.lastMouse, 1.2);
	};

	const handleKeyboardZoomOut = () => {
		navigate.zoomAt(context.lastMouse, 1 / 1.2);
	};

	const handleKeyDownEvent = (e: KeyboardEvent) => {
		const actions: Record<string, () => void> = {
			'+': handleKeyboardZoomIn,
			'-': handleKeyboardZoomOut,
			'0': navigate.resetView,
			F: navigate.zoomToFit,
			f: navigate.zoomToFit,
			X: navigate.zoomToFill,
			x: navigate.zoomToFill,
			w: navigate.zoomToWidth,
			W: navigate.zoomToWidth,
			h: navigate.zoomToHeight,
			H: navigate.zoomToHeight,
			c: navigate.centerDocument,
			C: navigate.centerDocument,
		};

		if (actions[e.key]) {
			e.preventDefault();
			actions[e.key]();
			return;
		}

		// if keyboard event is value 1 to 9
		if (e.key >= '1' && e.key <= '9') {
			e.preventDefault();
			zoomToRegion(e.key); // pass as number
		}
	};

	return {
		keyboardEvents: {
			handleKeyDownEvent,
		},
	};
};

export default useEventHandlersKeyboard;
