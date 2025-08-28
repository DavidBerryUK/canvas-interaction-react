import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/Index.scss';
import UIApp from './components/app/UIApp.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<UIApp />
	</StrictMode>
);
