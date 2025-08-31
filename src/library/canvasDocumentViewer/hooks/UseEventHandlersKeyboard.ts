import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import type CanvasContext from '../models/CanvasContext';
import useCanvasNavigation from './UseCanvasNavigation';

const useEventHandlersKeyboard = (context: React.RefObject<CanvasContext>, sceneProvider: React.RefObject<ICanvasDocumentViewerSceneProvider>, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	const { navigate } = useCanvasNavigation(canvasRef, context, sceneProvider);

	// --- Keyboard zoom helpers ---

	const zoomToRegion = (regionKey: string) => {
		const region = sceneProvider.current.getRegions().find((region) => region.id === regionKey);
		if (!region) {
			return;
		}
		navigate.zoomToRectangle(region.rectangle, context.current.animated);
	};

	const handleKeyboardZoomIn = (withAnimation: boolean = true) => {
		navigate.zoomAt(context.current.lastMouseCanvasPosition, 1.2, withAnimation);
	};

	const handleKeyboardZoomOut = (withAnimation: boolean = true) => {
		navigate.zoomAt(context.current.lastMouseCanvasPosition, 1 / 1.2, withAnimation);
	};

	const handleKeyDownEvent = (e: KeyboardEvent) => {
		console.log(`keydown event for provider:${sceneProvider.current.name}`);

		const key = e.key.toLowerCase(); // normalize key

		const actions: Record<string, () => void> = {
			'+': () => handleKeyboardZoomIn(context.current.animated),
			'-': () => handleKeyboardZoomOut(context.current.animated),
			'0': () => navigate.resetView(context.current.animated),
			f: () => navigate.zoomToFit(context.current.animated),
			x: () => navigate.zoomToFill(context.current.animated),
			w: () => navigate.zoomToWidth(context.current.animated),
			h: () => navigate.zoomToHeight(context.current.animated),
			c: () => navigate.centerDocument(context.current.animated),
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
