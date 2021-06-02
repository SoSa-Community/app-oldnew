import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { Platform, Text } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import PropTypes from 'prop-types';

import PickerModal from './PickerModal';

const Picker = forwardRef(
	(
		{
			icon,
			error,
			errorBorderOnly,
			setIsValid,
			label,
			labelStyle,
			containerStyle,
			outerContainerStyle,
			innerContainerStyle,
			textStyle,
			onSave,
			onCancel,
			editable,
			onChange,
			placeholder,
			initialValue,
			value,
			options,
			textValue,
		},
		ref,
	) => {
		const [selectedValue, setSelectedValue] = useState('');
		const [showPicker, setShowPicker] = useState(false);
		const [tempPickerValue, setTempPickerValue] = useState('');

		const doChange = (selectedValue) => {
			setSelectedValue(selectedValue);
			setShowPicker(false);
			if (typeof onChange === 'function') {
				onChange(selectedValue);
			}
		};

		const reset = () => {
			if (initialValue !== null) doChange(initialValue);
			else doChange(value);
		};

		const getLabel = () => {
			const found = options
				.filter(({ value }) => value === selectedValue)
				.pop();
			return found ? found.label : selectedValue;
		};

		const picker = () => {
			const items = options.map(({ label, value }) => (
				<RNPicker.Item label={label} value={value} key={value} />
			));
			return (
				<RNPicker
					selectedValue={
						Platform.OS === 'ios' && tempPickerValue
							? tempPickerValue
							: selectedValue
					}
					placeholder={placeholder}
					prompt={placeholder}
					style={[textStyle, { flex: 1 }]}
					onValueChange={(itemValue, itemIndex) => {
						if (Platform.OS === 'ios')
							setTempPickerValue(itemValue);
						else doChange(itemValue);
					}}>
					{items}
				</RNPicker>
			);
		};

		useEffect(() => setSelectedValue(value), [value]);

		useImperativeHandle(ref, () => ({
			value: selectedValue,
			reset,
			set: doChange,
		}));

		if (!editable) {
			let text = selectedValue;

			if (textValue) text = textValue;
			else if (Array.isArray(options)) {
				const found = options
					.filter(({ value }) => value === selectedValue)
					.pop();
				if (found) text = found?.label;
			}
			return <Text style={textStyle}>{text}</Text>;
		}

		if (Platform.OS !== 'ios') return picker();
		else {
			return (
				<PickerModal
					setVisible={setShowPicker}
					visible={showPicker}
					value={selectedValue}
					label={getLabel()}
					placeholder={placeholder}
					onCancel={() => setShowPicker(false)}
					onConfirm={() => doChange(tempPickerValue)}
					textStyle={textStyle}>
					{picker()}
				</PickerModal>
			);
		}
	},
);

Picker.propTypes = {
	placeholder: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	options: PropTypes.array,
	textStyle: PropTypes.object,
};

Picker.defaultProps = {
	placeholder: '',
	value: '',
	initialValue: null,
	onChange: null,
	options: [],
	textStyle: null
};

export default Picker;
