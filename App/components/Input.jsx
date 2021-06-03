import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Styles = StyleSheet.create({
	input: { padding: 0, color: '#fff' },

	inputIcon: {
		color: '#ccc',
		marginHorizontal: 4,
	},

	multiline: {
		minHeight: 180,
		width: '100%',
		textAlignVertical: 'top',
		borderRadius: 8,
	},

	lengthIndicator: {
		alignSelf: 'center',
		paddingRight: 12,
	},

	lengthIndicatorWarning: {
		color: '#f0ad4e',
	},

	lengthIndicatorDanger: {
		color: '#dc3545',
	},

	lengthIndicatorNeutral: {
		color: '#ccc',
	},
});

const Input = forwardRef(
	(
		{
			placeholder,
			value,
			initialValue,
			onChangeText,
			validateInput,
			error,
			errorBorderOnly,
			enabled,
			allowClear,
			alwaysShowClear,
			multiline,
			minLength,
			maxLength,
			selection,
			onSelectionChange,
			onBlur,
			onKeyPress,
			autoCorrect,
			lengthIndicatorShowPercentage,
			lengthWarningPercentage,
			lengthDangerPercentage,
			setIsValid,
			label,
			labelStyle,
			containerStyle,
			outerContainerStyle,
			innerContainerStyle,
			inputStyle,
			showSaveButtons,
			editable,
			textStyle,
			placeholderColour,
			textValue,
			form,
			name,
		},
		ref,
	) => {
		const [inputValue, setInputValue] = useState(initialValue || '');
		const [lengthPercentage, setLengthPercentage] = useState(0);

		const clear = () => setInputValue('');

		const handleChange = (data) => {
			let otherData = null;

			if (data !== undefined) {
				setInputValue(data);
				if (typeof onChangeText === 'function')
					onChangeText(data, otherData);
			}
		};

		const reset = () => {
			if (initialValue !== null) {
				handleChange(initialValue);
			} else handleChange(value);
		};

		const renderTextField = () => {
			let styles = [Styles.input];
			if (multiline) styles.push(Styles.multiline);
			styles.push(inputStyle);
			console.debug(inputStyle);

			const renderLengthWarning = () => {
				let lengthIndicatorStyles = [Styles.lengthIndicator];
				if (inputValue.length >= minLength) {
					if (lengthPercentage >= lengthDangerPercentage) {
						lengthIndicatorStyles.push(
							Styles.lengthIndicatorDanger,
						);
					} else if (lengthPercentage >= lengthWarningPercentage) {
						lengthIndicatorStyles.push(
							Styles.lengthIndicatorWarning,
						);
					}
					if (lengthPercentage >= lengthIndicatorShowPercentage) {
						return (
							<Text
								style={[
									lengthIndicatorStyles,
								]}>{`${inputValue.length}/${maxLength}`}</Text>
						);
					}
				} else {
					lengthIndicatorStyles.push(Styles.lengthIndicatorNeutral);
					return (
						<Text style={[lengthIndicatorStyles]}>
							{!inputValue.length ? 'at-least ' : ''}
							{`${minLength - inputValue.length}`}
							{!inputValue.length ? ' thingies ' : ''}
						</Text>
					);
				}
			};

			return (
				<>
					<TextInput
						selection={selection}
						onSelectionChange={onSelectionChange}
						multiline={multiline}
						placeholder={placeholder}
						placeholderTextColor={placeholderColour}
						value={inputValue}
						style={styles}
						onChangeText={(data) => {
							handleChange(data);
							if (form) {
								const { register } = form;
								if (register && name)
									register(name).onChange(data);
							}
						}}
						editable={enabled}
						onBlur={onBlur}
						onKeyPress={onKeyPress}
						autoCorrect={autoCorrect}
						maxLength={maxLength ? maxLength : null}
					/>
					{renderLengthWarning()}
				</>
			);
		};

		const renderField = () => {
			if (!editable) {
				const styles = [{ color: '#121111' }];

				let text = inputValue;
				if (textValue) text = textValue;

				return <Text style={[styles, textStyle]}>{text}</Text>;
			}
			return renderTextField();
		};

		useEffect(() => {
			if (maxLength || minLength) {
				if (maxLength > 0) {
					if (typeof inputValue === 'string') {
						setLengthPercentage(
							Math.floor((inputValue.length / maxLength) * 100),
						);
					} else {
						setLengthPercentage(0);
					}
				}
			}
		}, [inputValue]);

		useEffect(() => {
			if (value !== null) setInputValue(value);
		}, [value]);

		useImperativeHandle(ref, () => ({
			value: inputValue,
			clear,
			reset,
			set: handleChange,
		}));

		return renderField();
	},
);

Input.propTypes = {
	placeholder: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChangeText: PropTypes.func,
	validateInput: PropTypes.bool,
	error: PropTypes.string,
	errorBorderOnly: PropTypes.bool,
	enabled: PropTypes.bool,
	allowClear: PropTypes.bool,
	alwaysShowClear: PropTypes.bool,
	multiline: PropTypes.bool,
	minLength: PropTypes.number,
	maxLength: PropTypes.number,
	selection: PropTypes.shape({
		start: PropTypes.number,
		end: PropTypes.number,
	}),
	onSelectionChange: PropTypes.func,
	onBlur: PropTypes.func,
	onKeyPress: PropTypes.func,
	autoCorrect: PropTypes.bool,
	setIsValid: PropTypes.func,
	label: PropTypes.string,
	labelStyle: PropTypes.object,
	containerStyle: PropTypes.object,
	outerContainerStyle: PropTypes.object,
	innerContainerStyle: PropTypes.object,
	inputStyle: PropTypes.object,
	lengthIndicatorShowPercentage: PropTypes.number,
	lengthWarningPercentage: PropTypes.number,
	lengthDangerPercentage: PropTypes.number,
	editable: PropTypes.bool,
	placeholderColour: PropTypes.string,
};

Input.defaultProps = {
	placeholder: '',
	value: '',
	initialValue: null,
	onChangeText: null,
	validateInput: false,
	error: null,
	errorBorderOnly: false,
	enabled: true,
	allowClear: false,
	alwaysShowClear: false,
	multiline: false,
	pickerOptions: [],
	minLength: 0,
	maxLength: 255,
	selection: null,
	onSelectionChange: null,
	onBlur: null,
	onKeyPress: null,
	autoCorrect: true,
	setIsValid: null,
	label: '',
	labelStyle: null,
	containerStyle: null,
	outerContainerStyle: null,
	innerContainerStyle: null,
	inputStyle: null,
	lengthIndicatorShowPercentage: 80,
	lengthWarningPercentage: 90,
	lengthDangerPercentage: 95,
	editable: true,
	placeholderColour: '#757575d',
};

export default Input;
