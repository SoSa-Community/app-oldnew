import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from 'react';
import {
	TouchableOpacity,
	Text,
	Keyboard,
	Platform,
	View,
	StyleSheet,
} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import PropTypes from 'prop-types';

import Helpers from '../../sosa/Helpers';
import PickerModal from '../Picker/PickerModal';

const Styles = StyleSheet.create({
	placeholderButton: {
		marginHorizontal: 4,
		flex: 1,
		height: '100%',
		justifyContent: 'center',
	},
	placeholder: {
		color: '#fff',
		fontSize: 16,
	},
	label: {
		color: '#fff',
		fontSize: 16,
	},
});

const DateTimePicker = forwardRef(
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
			placeholderStyle,
			onSave,
			onCancel,
			editable,
			onChange,
			placeholder,
			initialValue,
			value,
			forTime,
			textValue,
		},
		ref,
	) => {
		const [showPicker, setShowPicker] = useState(false);
		const [tempPickerValue, setTempPickerValue] = useState(new Date());
		const [selectedDate, setSelectedDate] = useState(initialValue);
		const formattedDate = !selectedDate
			? ''
			: moment(selectedDate).format(forTime ? 'hh:mm' : 'DD/MM/YYYY');

		const getType = () => (forTime ? 'time' : 'date');

		const doChange = (data) => {
			setShowPicker(false);

			if (data) {
				setSelectedDate(data);
				const otherData = new Date(data.getTime());

				if (typeof onChange === 'function') {
					onChange(Helpers.dateToString(data, getType()), otherData);
				}
			}
		};

		const reset = () => {
			if (initialValue !== null) doChange(initialValue);
			else doChange(value);
		};

		const renderFieldLabel = () => {
			const textValue = moment(selectedDate).format(
				forTime ? 'hh:mm' : 'DD/MM/YYYY',
			);

			return (
				<TouchableOpacity
					onPress={() => {
						Keyboard.dismiss();
						setShowPicker(true);
					}}
					style={Styles.placeholderButton}>
					{textValue.length > 0 && (
						<Text style={[Styles.label, textStyle]}>
							{textValue}
						</Text>
					)}
					{textValue.length === 0 && (
						<Text style={[Styles.placeholder, placeholderStyle]}>
							{placeholder}
						</Text>
					)}
				</TouchableOpacity>
			);
		};

		const renderPicker = () => {
			if (!showPicker) return <></>;
			return (
				<RNDateTimePicker
					testID="dateTimePicker"
					value={
						Platform.OS === 'ios' && tempPickerValue
							? tempPickerValue
							: selectedDate
					}
					mode={getType()}
					display={Platform.OS === 'ios' ? 'spinner' : 'default'}
					onChange={(event, selectedDate) => {
						if (Platform.OS === 'ios') {
							setTempPickerValue(selectedDate);
						} else {
							doChange(selectedDate);
						}
					}}
				/>
			);
		};

		useEffect(() => {
			if (value) {
				let date = new Date(value);
				if (
					Object.prototype.toString.call(date) !== '[object Date]' ||
					isNaN(date.getTime())
				) {
					date = new Date();
				}

				if (forTime) {
					const [hour, minutes] = value.split(':');
					date.setHours(hour);
					date.setMinutes(minutes);
				}
				doChange(date);
			}
		}, [value]);

		useImperativeHandle(ref, () => ({
			value: selectedDate,
			reset,
			set: doChange,
		}));

		if (Platform.OS !== 'ios') {
			return (
				<View style={{ flex: 1 }}>
					{renderFieldLabel()}
					{renderPicker()}
				</View>
			);
		} else {
			return (
				<PickerModal
					setVisible={setShowPicker}
					visible={showPicker}
					value={formattedDate}
					label={formattedDate}
					placeholder={placeholder}
					onCancel={() => setShowPicker(false)}
					onConfirm={() => doChange(tempPickerValue)}
					textStyle={[Styles.label, textStyle]}>
					{renderPicker()}
				</PickerModal>
			);
		}
	},
);

DateTimePicker.propTypes = {
	placeholder: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	forTime: PropTypes.bool,
	textStyle: PropTypes.object,
};

DateTimePicker.defaultProps = {
	placeholder: '',
	value: '',
	onChange: null,
	forTime: false,
	textStyle: null,
};

export default DateTimePicker;
