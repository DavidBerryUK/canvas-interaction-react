import { useCallback, useMemo } from 'react';
import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import type CanvasContext from '../models/CanvasContext';
import useCanvasNavigation from './UseCanvasNavigation';

const useEventHandlersKeyboard = (context: CanvasContext, provider: ICanvasDocumentViewerSceneProvider, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	const { navigate } = useCanvasNavigation(canvasRef, context, provider);

	// --- Keyboard zoom helpers ---

	const zoomToRegion = useCallback(
		(regionKey: string) => {
			const region = provider.getRegions().find((region) => region.id === regionKey);
			if (!region) {
				return;
			}
			navigate.zoomToRectangle(region.rectangle, context.animated);
		},
		[provider, navigate, context.animated]
	);

	const handleKeyboardZoomIn = useCallback(
		(withAnimation: boolean = true) => {
			navigate.zoomAt(context.lastMouseCanvasPosition, 1.2, withAnimation);
		},
		[navigate, context.lastMouseCanvasPosition]
	);

	const handleKeyboardZoomOut = useCallback(
		(withAnimation: boolean = true) => {
			navigate.zoomAt(context.lastMouseCanvasPosition, 1 / 1.2, withAnimation);
		},
		[navigate, context.lastMouseCanvasPosition]
	);

	const handleKeyDownEvent = useCallback(
		(e: KeyboardEvent) => {
			console.log(`keydown event for provider:${provider.name}`);

			const key = e.key.toLowerCase(); // normalize key

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
		},
		[provider, context.animated, handleKeyboardZoomIn, handleKeyboardZoomOut, navigate, zoomToRegion]
	);

	const keyboardEvents = useMemo(
		() => ({
			handleKeyDownEvent,
		}),
		[handleKeyDownEvent]
	);

	return { keyboardEvents };
};

export default useEventHandlersKeyboard;
