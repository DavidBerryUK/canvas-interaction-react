import React, { useRef, useEffect } from 'react';

class CanvanContext {
	scale = 1;
	targetScale = 1;
	offsetX = 0;
	offsetY = 0;
	targetX = 0;
	targetY = 0;
	isDragging = false;
	lastX = 0;
	lastY = 0;
	minX = Infinity;
	minY = Infinity;
	maxX = -Infinity;
	maxY = -Infinity;
	lastDist = 0;
	pinchMidX = 0;
	pinchMidY = 0;
	lastMouseX = 0; // track cursor for keyboard zoom
	lastMouseY = 0;
}

const CanvasViewer: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const context = new CanvanContext();

	// Predefined zoom regions
	const regions: Record<string, { x: number; y: number; width: number; height: number }> = {
		'1': { x: 40, y: 40, width: 240, height: 240 },
		'2': { x: 300, y: 200, width: 200, height: 200 },
		'3': { x: 580, y: 80, width: 200, height: 200 },
		'4': { x: 200, y: 400, width: 250, height: 200 },
	};

	useEffect(() => {
		const canvas = canvasRef.current!;
		const ctx = canvas.getContext('2d')!;

		const updateBounds = (x: number, y: number, w: number, h: number) => {
			context.minX = Math.min(context.minX, x);
			context.minY = Math.min(context.minY, y);
			context.maxX = Math.max(context.maxX, x + w);
			context.maxY = Math.max(context.maxY, y + h);
		};

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const clearScene = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		};

		const drawScene = () => {
			ctx.fillStyle = 'red';
			ctx.fillRect(50, 50, 200, 200);
			updateBounds(50, 50, 200, 200);

			ctx.fillStyle = 'blue';
			ctx.beginPath();
			ctx.arc(400, 300, 100, 0, 2 * Math.PI);
			ctx.fill();
			updateBounds(300, 200, 200, 200);

			ctx.fillStyle = 'green';
			ctx.fillRect(600, 100, 150, 150);
			updateBounds(600, 100, 150, 150);

			// Optional: region outlines
			for (const key in regions) {
				const r = regions[key];
				ctx.strokeStyle = 'rgba(0,0,0,0.4)';
				ctx.lineWidth = 2;
				ctx.setLineDash([6, 4]);
				ctx.strokeRect(r.x, r.y, r.width, r.height);
				ctx.setLineDash([]);
				ctx.fillStyle = 'black';
				ctx.font = '16px Arial';
				ctx.fillText(key, r.x + 4, r.y + 16);
			}
		};

		const render = () => {
			clearScene();
			ctx.save();
			ctx.setTransform(context.scale, 0, 0, context.scale, context.offsetX, context.offsetY);
			drawScene();
			ctx.restore();

			// Smooth transition
			context.scale += (context.targetScale - context.scale) * 0.15;
			context.offsetX += (context.targetX - context.offsetX) * 0.15;
			context.offsetY += (context.targetY - context.offsetY) * 0.15;

			requestAnimationFrame(render);
		};

		// Fit-to-content logic
		const fitToContent = () => {
			const contentWidth = context.maxX - context.minX;
			const contentHeight = context.maxY - context.minY;
			const scaleX = canvas.width / contentWidth;
			const scaleY = canvas.height / contentHeight;
			context.targetScale = Math.min(scaleX, scaleY) * 0.9;
			context.targetX = (canvas.width - contentWidth * context.targetScale) / 2 - context.minX * context.targetScale;
			context.targetY = (canvas.height - contentHeight * context.targetScale) / 2 - context.minY * context.targetScale;
		};

		// Zoom-to-region
		const zoomToRegion = (regionKey: string) => {
			const r = regions[regionKey];
			if (!r) return;
			const scaleX = canvas.width / r.width;
			const scaleY = canvas.height / r.height;
			context.targetScale = Math.min(scaleX, scaleY) * 0.85;
			context.targetX = (canvas.width - r.width * context.targetScale) / 2 - r.x * context.targetScale;
			context.targetY = (canvas.height - r.height * context.targetScale) / 2 - r.y * context.targetScale;
		};

		// Reset view
		const resetView = () => {
			context.targetScale = 1;
			context.targetX = 0;
			context.targetY = 0;
		};

		const handleMouseDownEvent = (e: MouseEvent) => {
			context.isDragging = true;
			context.lastX = e.clientX;
			context.lastY = e.clientY;
		};

		const handleMouseMouseEvent = (e: MouseEvent) => {
			// Track last mouse position for keyboard zoom
			const rect = canvas.getBoundingClientRect();
			context.lastMouseX = e.clientX - rect.left;
			context.lastMouseY = e.clientY - rect.top;

			if (context.isDragging) {
				const dx = e.clientX - context.lastX;
				const dy = e.clientY - context.lastY;
				context.targetX += dx;
				context.targetY += dy;
				context.lastX = e.clientX;
				context.lastY = e.clientY;
			}
		};

		const handleMouseUpEvent = () => {
			context.isDragging = false;
		};

		const handleWheelEvent = (e: WheelEvent) => {
			e.preventDefault();

			const rect = canvas.getBoundingClientRect();
			const cursorX = e.clientX - rect.left;
			const cursorY = e.clientY - rect.top;

			// Convert cursor to world coords before zoom
			const worldX = (cursorX - context.targetX) / context.targetScale;
			const worldY = (cursorY - context.targetY) / context.targetScale;

			// Apply zoom
			const zoomIntensity = 0.0015;
			const zoom = 1 - e.deltaY * zoomIntensity;
			context.targetScale *= zoom;

			// Adjust offset so cursor stays fixed
			context.targetX = cursorX - worldX * context.targetScale;
			context.targetY = cursorY - worldY * context.targetScale;
		};

		const handleTouchStartEvent = (e: TouchEvent) => {
			if (e.touches.length === 2) {
				const dx = e.touches[0].clientX - e.touches[1].clientX;
				const dy = e.touches[0].clientY - e.touches[1].clientY;
				context.lastDist = Math.hypot(dx, dy);

				// Midpoint in screen coords
				context.pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
				context.pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
			}
		};

		const handleTouchMoveEvent = (e: TouchEvent) => {
			if (e.touches.length === 2) {
				e.preventDefault();

				const dx = e.touches[0].clientX - e.touches[1].clientX;
				const dy = e.touches[0].clientY - e.touches[1].clientY;
				const dist = Math.hypot(dx, dy);
				const zoom = dist / context.lastDist;

				// Convert midpoint to world coords before zoom
				const rect = canvas.getBoundingClientRect();
				const cursorX = context.pinchMidX - rect.left;
				const cursorY = context.pinchMidY - rect.top;
				const worldX = (cursorX - context.targetX) / context.targetScale;
				const worldY = (cursorY - context.targetY) / context.targetScale;

				context.targetScale *= zoom;

				// Adjust offset so pinch midpoint stays fixed
				context.targetX = cursorX - worldX * context.targetScale;
				context.targetY = cursorY - worldY * context.targetScale;

				context.lastDist = dist;
			}
		};

		// --- Keyboard zoom helpers ---
		const zoomAt = (cursorX: number, cursorY: number, zoomFactor: number) => {
			// Convert cursor to world coords before zoom
			const worldX = (cursorX - context.targetX) / context.targetScale;
			const worldY = (cursorY - context.targetY) / context.targetScale;

			// Apply zoom
			context.targetScale *= zoomFactor;

			// Adjust offset so cursor stays fixed
			context.targetX = cursorX - worldX * context.targetScale;
			context.targetY = cursorY - worldY * context.targetScale;
		};

		const handleKeyboardZoomIn = () => {
			zoomAt(context.lastMouseX, context.lastMouseY, 1.2);
		};

		const handleKeyboardZoomOut = () => {
			zoomAt(context.lastMouseX, context.lastMouseY, 1 / 1.2);
		};

		const handleKeyDownEvent = (e: KeyboardEvent) => {
			if (e.key === '+') {
				handleKeyboardZoomIn();
			}
			if (e.key === '-') {
				handleKeyboardZoomOut();
			}
			if (e.key === '0') {
				resetView();
			}
			if (e.key === 'f') {
				fitToContent();
			}
			if (regions[e.key]) {
				zoomToRegion(e.key);
			}
		};

		// Mouse + touch handlers
		canvas.addEventListener('mousedown', handleMouseDownEvent);
		canvas.addEventListener('mousemove', handleMouseMouseEvent);
		window.addEventListener('mouseup', handleMouseUpEvent);
		canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
		// Pinch zoom
		canvas.addEventListener('touchstart', handleTouchStartEvent, { passive: false });
		canvas.addEventListener('touchmove', handleTouchMoveEvent, { passive: false });
		// Keyboard shortcuts
		window.addEventListener('keydown', handleKeyDownEvent);
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();
		render();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	return (
		<div>
			<canvas ref={canvasRef} />;
		</div>
	);
};

export default CanvasViewer;
