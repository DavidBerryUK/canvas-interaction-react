import './Style.scss';
import { getEnumDemoScene } from '../../enums/EnumDemoScenes';
import { useEffect, useState } from 'react';
import FactorySceneOptions from '../../factories/FactorySceneOptions';
import OptionModel from '../../models/OptionModel';
import type EnumDemoScenes from '../../enums/EnumDemoScenes';
import type React from 'react';
import UIfrostedBackground from '../frostedBackground/UIfrostedBackground';
import UIRadioList from '../radioList/UIRadioList';

interface IProperties {
	sceneId: EnumDemoScenes;
	onChangeScene: (sceneId: EnumDemoScenes) => void;
}

const UIToolBar: React.FC<IProperties> = (props) => {
	const [options, setOptions] = useState<Array<OptionModel>>(new Array<OptionModel>());

	useEffect(() => {
		const options = FactorySceneOptions.get();
		setOptions(options);
	}, []);

	const handleOnChange = (value: OptionModel) => {
		props.onChangeScene(getEnumDemoScene(value.id)!);
	};

	let option = options.find((opt) => opt.id === props.sceneId)!;

	return (
		<UIfrostedBackground className="ui-toolbar">
			<h2>Scenes</h2>
			<UIRadioList options={options} value={option} onChange={handleOnChange} />
		</UIfrostedBackground>
	);
};

export default UIToolBar;
