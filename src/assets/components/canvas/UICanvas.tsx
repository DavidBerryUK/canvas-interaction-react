import React, { useRef, useEffect } from 'react';

const CanvasViewer: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current!;
		const ctx = canvas.getContext('2d')!;

		// Viewport state
		let scale = 1;
		let targetScale = 1;
		let offsetX = 0;
		let offsetY = 0;
		let targetX = 0;
		let targetY = 0;

		// Dragging state
		let isDragging = false;
		let lastX = 0,
			lastY = 0;

		// Scene bounds for fit-to-content
		let minX = Infinity,
			minY = Infinity,
			maxX = -Infinity,
			maxY = -Infinity;

		function updateBounds(x: number, y: number, w: number, h: number) {
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x + w);
			maxY = Math.max(maxY, y + h);
		}

		// Predefined zoom regions
		const regions: Record<string, { x: number; y: number; width: number; height: number }> = {
			'1': { x: 40, y: 40, width: 240, height: 240 },
			'2': { x: 300, y: 200, width: 200, height: 200 },
			'3': { x: 580, y: 80, width: 200, height: 200 },
			'4': { x: 200, y: 400, width: 250, height: 200 },
		};

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		function clearScene() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		function drawScene() {
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
		}

		function render() {
			clearScene();
			ctx.save();
			ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
			drawScene();
			ctx.restore();

			// Smooth transition
			scale += (targetScale - scale) * 0.15;
			offsetX += (targetX - offsetX) * 0.15;
			offsetY += (targetY - offsetY) * 0.15;

			requestAnimationFrame(render);
		}

		// Fit-to-content logic
		function fitToContent() {
			const contentWidth = maxX - minX;
			const contentHeight = maxY - minY;
			const scaleX = canvas.width / contentWidth;
			const scaleY = canvas.height / contentHeight;
			targetScale = Math.min(scaleX, scaleY) * 0.9;
			targetX = (canvas.width - contentWidth * targetScale) / 2 - minX * targetScale;
			targetY = (canvas.height - contentHeight * targetScale) / 2 - minY * targetScale;
		}

		// Zoom-to-region
		function zoomToRegion(regionKey: string) {
			const r = regions[regionKey];
			if (!r) return;
			const scaleX = canvas.width / r.width;
			const scaleY = canvas.height / r.height;
			targetScale = Math.min(scaleX, scaleY) * 0.85;
			targetX = (canvas.width - r.width * targetScale) / 2 - r.x * targetScale;
			targetY = (canvas.height - r.height * targetScale) / 2 - r.y * targetScale;
		}

		// Reset view
		function resetView() {
			targetScale = 1;
			targetX = 0;
			targetY = 0;
		}

		// Mouse + touch handlers
		canvas.addEventListener('mousedown', (e) => {
			isDragging = true;
			lastX = e.clientX;
			lastY = e.clientY;
		});

		canvas.addEventListener('mousemove', (e) => {
			if (isDragging) {
				const dx = e.clientX - lastX;
				const dy = e.clientY - lastY;
				targetX += dx;
				targetY += dy;
				lastX = e.clientX;
				lastY = e.clientY;
			}
		});

		window.addEventListener('mouseup', () => {
			isDragging = false;
		});

		canvas.addEventListener(
			'wheel',
			(e) => {
				e.preventDefault();

				const rect = canvas.getBoundingClientRect();
				const cursorX = e.clientX - rect.left;
				const cursorY = e.clientY - rect.top;

				// Convert cursor to world coords before zoom
				const worldX = (cursorX - targetX) / targetScale;
				const worldY = (cursorY - targetY) / targetScale;

				// Apply zoom
				const zoomIntensity = 0.0015;
				const zoom = 1 - e.deltaY * zoomIntensity;
				targetScale *= zoom;

				// Adjust offset so cursor stays fixed
				targetX = cursorX - worldX * targetScale;
				targetY = cursorY - worldY * targetScale;
			},
			{ passive: false }
		);

		// Pinch zoom
		let lastDist = 0;
		let pinchMidX = 0;
		let pinchMidY = 0;
		canvas.addEventListener('touchstart', (e) => {
			if (e.touches.length === 2) {
				const dx = e.touches[0].clientX - e.touches[1].clientX;
				const dy = e.touches[0].clientY - e.touches[1].clientY;
				lastDist = Math.hypot(dx, dy);

				// Midpoint in screen coords
				pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
				pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
			}
		});

		canvas.addEventListener(
			'touchmove',
			(e) => {
				if (e.touches.length === 2) {
					e.preventDefault();

					const dx = e.touches[0].clientX - e.touches[1].clientX;
					const dy = e.touches[0].clientY - e.touches[1].clientY;
					const dist = Math.hypot(dx, dy);
					const zoom = dist / lastDist;

					// Convert midpoint to world coords before zoom
					const rect = canvas.getBoundingClientRect();
					const cursorX = pinchMidX - rect.left;
					const cursorY = pinchMidY - rect.top;
					const worldX = (cursorX - targetX) / targetScale;
					const worldY = (cursorY - targetY) / targetScale;

					targetScale *= zoom;

					// Adjust offset so pinch midpoint stays fixed
					targetX = cursorX - worldX * targetScale;
					targetY = cursorY - worldY * targetScale;

					lastDist = dist;
				}
			},
			{ passive: false }
		);
		// Keyboard shortcuts
		window.addEventListener('keydown', (e) => {
			if (e.key === '+') targetScale *= 1.2;
			if (e.key === '-') targetScale /= 1.2;
			if (e.key === '0') resetView();
			if (e.key === 'f') fitToContent();
			if (regions[e.key]) zoomToRegion(e.key);
		});

		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();
		render();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	return (
		<div>
			<canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
		</div>
	);
};

export default CanvasViewer;
