import type OptionModel from '../../models/OptionModel';
import './Style.scss';
import UIRadioListItem from './UIRadioListItem';

interface IProperties {
	options: Array<OptionModel>;
	value: OptionModel;
	onChange: (value: OptionModel) => void;
}

const UIRadioList: React.FC<IProperties> = ({ options, value, onChange }) => {
	const handleOnItemClickedEvent = (value: OptionModel) => {
		onChange(value);
	};

	return (
		<ul className="ui-radio-list">
			{options.map((item) => (
				<UIRadioListItem key={item.id} option={item} isSelected={item.id === value.id} onClicked={handleOnItemClickedEvent} />
			))}
		</ul>
	);
};

export default UIRadioList;
