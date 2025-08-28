import type OptionModel from '../../models/OptionModel';

interface IProperties {
	option: OptionModel;
	isSelected: boolean;
	onClicked: (option: OptionModel) => void;
}

const UIRadioListItem: React.FC<IProperties> = ({ option, isSelected, onClicked }) => {
	const handleOnItemClickedEvent = () => {
		onClicked(option);
	};

	return (
		<li>
			<label>
				<input type="radio" value={option.id} checked={isSelected} onChange={handleOnItemClickedEvent} />
				{option.text}
			</label>
		</li>
	);
};

export default UIRadioListItem;
