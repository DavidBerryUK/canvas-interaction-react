import './Style.scss';
import type { ReactNode } from 'react';

interface IProperties {
	children: ReactNode;
	className?: string;
}

const UIfrostedBackground: React.FC<IProperties> = ({ children, className }) => {
	return <div className={`ui-frosted-background ${className ?? ''}`}>{children}</div>;
};

export default UIfrostedBackground;
