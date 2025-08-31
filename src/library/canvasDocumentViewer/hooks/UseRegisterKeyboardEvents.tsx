import { useEffect } from 'react';
import type CanvasContext from '../models/CanvasContext';
import type ICanvasDocumentViewerSceneProvider from '../interfaces/ICanvasDocumentViewerSceneProvider';
import useEventHandlersKeyboard from './UseEventHandlersKeyboard';
import useEventHandlersMouse from './UseEventHandlersMouse';
import useHandleTouchEvents from './UseHandleTouchEvents';

const useRegisterKeyboardEvents = (canvasState: React.RefObject<CanvasContext>, canvasRef: React.RefObject<HTMLCanvasElement | null>, sceneProvider: React.RefObject<ICanvasDocumentViewerSceneProvider>) => {
	const { mouseEvents } = useEventHandlersMouse(canvasState, canvasRef);
	const { keyboardEvents } = useEventHandlersKeyboard(canvasState, sceneProvider, canvasRef);
	const { touchEvents } = useHandleTouchEvents(canvasState, canvasRef);

	useEffect(() => {
		const canvas = canvasRef.current!;
		const handleMouseDown = (e: MouseEvent) => mouseEvents.handleMouseDownEvent(e);
		const handleMouseMove = (e: MouseEvent) => mouseEvents.handleMouseMouseEvent(e);
		const handleMouseUp = () => mouseEvents.handleMouseUpEvent();
		const handleWheel = (e: WheelEvent) => mouseEvents.handleWheelEvent(e);
		const handleTouchStart = (e: TouchEvent) => touchEvents.handleTouchStartEvent(e);
		const handleTouchMove = (e: TouchEvent) => touchEvents.handleTouchMoveEvent(e);
		const handleKeyDown = (e: KeyboardEvent) => keyboardEvents.handleKeyDownEvent(e);

		canvas.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('wheel', handleWheel, { passive: false });
		canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
		canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('wheel', handleWheel);
			canvas.removeEventListener('touchstart', handleTouchStart);
			canvas.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
};

export default useRegisterKeyboardEvents;
