import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import type CanvasContext from '../models/CanvasContext';
import useCanvasNavigation from './UseCanvasNavigation';

const useEventHandlersKeyboard = (context: CanvasContext, provider: ICanvasDocumentViewerSceneProvider, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	const { navigate } = useCanvasNavigation(canvasRef, context, provider);

	// Reset view

	// Zoom-to-region
	const zoomToRegion = (regionKey: string) => {
		const region = provider.getRegions().find((region) => region.id === regionKey);
		if (!region) {
			return;
		}
		navigate.zoomToRectangle(region.rectangle, context.animated);
	};

	// --- Keyboard zoom helpers ---

	const handleKeyboardZoomIn = (withAnimation: boolean = true) => {
		navigate.zoomAt(context.lastMouseCanvasPosition, 1.2, withAnimation);
	};

	const handleKeyboardZoomOut = (withAnimation: boolean = true) => {
		navigate.zoomAt(context.lastMouseCanvasPosition, 1 / 1.2, withAnimation);
	};

	const handleKeyDownEvent = (e: KeyboardEvent) => {
		const key = e.key.toLowerCase(); // convert all keys to lowercase

		const actions: Record<string, () => void> = {
			'+': () => handleKeyboardZoomIn(context.animated),
			'-': () => handleKeyboardZoomOut(context.animated),
			'0': () => navigate.resetView(context.animated),
			f: () => navigate.zoomToFit(context.animated),
			x: () => navigate.zoomToFill(context.animated),
			w: () => navigate.zoomToWidth(context.animated),
			h: () => navigate.zoomToHeight(context.animated),
			c: () => navigate.centerDocument(context.animated),
		};

		if (actions[key]) {
			e.preventDefault();
			actions[key]();
			return;
		}

		if (key >= '1' && key <= '9') {
			e.preventDefault();
			zoomToRegion(key);
		}
	};

	return {
		keyboardEvents: {
			handleKeyDownEvent,
		},
	};
};

export default useEventHandlersKeyboard;
