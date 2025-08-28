import './Styles.scss';
import { MousePointerClick, Smartphone, ZoomIn, Fullscreen, ArrowUpDown, ArrowLeftRight, ToggleLeft, ToggleRight, Expand, AlignCenterIcon, CircleDotDashed, Grid3x3, SquareSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import type CanvasContext from '../../models/CanvasContext';
import type React from 'react';
import UIfrostedBackground from '../../../../components/frostedBackground/UIfrostedBackground';

interface IProperties {
	state: CanvasContext;
}

const UIInstructions: React.FC<IProperties> = (props) => {
	const [isAnimated, setIsAnimated] = useState<boolean>(props.state.animated);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'a' || e.key === 'A') {
				// toggle animated state
				props.state.animated = !props.state.animated;
				setIsAnimated(props.state.animated);
				// optionally force a re-render if needed
				// e.g., by using a state hook or parent callback
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [props.state]);

	const animationText = props.state.animated ? (
		<>
			<b>ON</b>
		</>
	) : (
		<>
			<b>OFF</b>
		</>
	);

	const animationIcon = isAnimated ? <ToggleRight /> : <ToggleLeft />;

	const controls = [
		{ icon: <MousePointerClick />, key: 'Drag', desc: 'Pan' },
		{ icon: <CircleDotDashed />, key: 'Wheel', desc: 'Zoom at cursor' },
		{ icon: <ZoomIn />, key: '+/-', desc: 'Zoom in/out' },
		{ icon: <Fullscreen />, key: '0', desc: 'Zoom 100%' },
		{ icon: <Grid3x3 />, key: '1–9', desc: 'Zoom to region' },
		{ icon: <AlignCenterIcon />, key: 'c', desc: 'Center document' },
		{ icon: <SquareSquare />, key: 'f', desc: 'Zoom to Fit' },
		{ icon: <ArrowUpDown />, key: 'h', desc: 'Zoom to height' },
		{ icon: <ArrowLeftRight />, key: 'w', desc: 'Zoom to width' },
		{ icon: <Fullscreen />, key: 'x', desc: 'Zoom to Fill' },
		{ icon: animationIcon, key: 'a', desc: <>Animation {animationText}</> },
		{ icon: <Expand />, key: 'Pinch', desc: 'Zoom on mobile' },
		{ icon: <Smartphone />, key: 'Drag', desc: 'Pan on mobile' },
	];

	return (
		<UIfrostedBackground className="instructions">
			<h2>Controls:</h2>
			<ul className="instructions-list">
				{controls.map((c, idx) => (
					<li key={idx} className="instruction-row">
						<span className="instruction-icon">{c.icon}</span>
						<span className="instruction-key">{c.key}</span>
						<span className="instruction-desc">{c.desc}</span>
					</li>
				))}
			</ul>
		</UIfrostedBackground>
	);
};

export default UIInstructions;
