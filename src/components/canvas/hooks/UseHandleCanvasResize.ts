import { useEffect } from 'react';

const useHandleCanvasResize = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const { width, height } = entry.contentRect;
				canvas.width = width;
				canvas.height = height;
			}
		});

		// Observe the canvas itself (or you could observe its parent container)
		resizeObserver.observe(canvas);

		return () => resizeObserver.disconnect();
	}, [canvasRef]);
};

export default useHandleCanvasResize;
