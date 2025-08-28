import type React from 'react';
import './Style.scss';
import { useEffect, useState } from 'react';
import OptionModel from '../../models/OptionModel';
import FactorySceneOptions from '../../factories/FactorySceneOptions';
import type EnumDemoScenes from '../../enums/EnumDemoScenes';
import { getEnumDemoScene } from '../../enums/EnumDemoScenes';

interface IProperties {
	onChangeScene: (scene: EnumDemoScenes) => void;
}

const UIToolBar: React.FC<IProperties> = (props) => {
	const [option, setOption] = useState<OptionModel>(new OptionModel('', ''));
	const [options, setOptions] = useState<Array<OptionModel>>(new Array<OptionModel>());

	useEffect(() => {
		const options = FactorySceneOptions.get();
		setOption(options[0]);
		setOptions(options);
	}, []);

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		var option = options.find((item) => item.id == event.target.value)!;
		setOption(option);
		props.onChangeScene(getEnumDemoScene(option.id)!);
	};

	return (
		<div className="ui-toolbar frosted-background">
			<h2>Scenes</h2>
			<ul>
				{options.map((item) => (
					<li>
						<label>
							<input type="radio" value={item.id} checked={item.id === option.id} onChange={handleOnChange} />
							{item.text}
						</label>
					</li>
				))}
			</ul>
		</div>
	);
};

export default UIToolBar;
