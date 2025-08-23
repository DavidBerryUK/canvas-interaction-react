import type React from 'react';

const UIInstructions: React.FC = () => {
	return (
		<div className="instructions">
			<p>
				<strong>Controls:</strong>
			</p>
			<ul>
				<li>🖱️ Drag: Pan</li>
				<li>🖱️ Wheel: Zoom at cursor</li>
				<li>⌨️ +/-: Zoom in/out</li>
				<li>⌨️ 0: Zoom 100%</li>
				<li>⌨️ f: Zoom to Fit</li>
				<li>⌨️ x: Zoom to Fill </li>
				<li>⌨️ w: Zoom to width </li>
				<li>⌨️ h: Zoom to height </li>
				<li>⌨️ c: Center document </li>
				<li>⌨️ 1-4: Zoom to region</li>
				<li>📱 Pinch: Zoom on mobile</li>
				<li>📱 Drag: Pan on mobile</li>
			</ul>
		</div>
	);
};

export default UIInstructions;
