import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle, useRef,
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
		position: 'absolute',
		right: 0,
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

const TextField = forwardRef((props, ref) => {
	const {
		placeholder,
		value,
		initialValue,
		onChange,
		enabled,
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
		style,
		placeholderColour,
		hideLengthIndicator,
		selectTextOnFocus,
	} = props;

	const [inputValue, setInputValue] = useState(value || '');
	const [lengthPercentage, setLengthPercentage] = useState(0);
	const inputRef = useRef();

	const clear = () => setInputValue('');

	const handleChange = (data) => {
		setInputValue(data);
		if (typeof onChange === 'function') onChange(data);
	};
	
	const handleOnFocus = () => {
	
	}

	const reset = () => {
		if (initialValue !== null) {
			handleChange(initialValue);
		} else handleChange(value);
	};

	const renderLengthWarning = () => {
		if(!hideLengthIndicator){
			let lengthIndicatorStyles = [Styles.lengthIndicator];
			if (inputValue.length >= minLength) {
				if (lengthPercentage >= lengthDangerPercentage) {
					lengthIndicatorStyles.push(Styles.lengthIndicatorDanger);
				} else if (lengthPercentage >= lengthWarningPercentage) {
					lengthIndicatorStyles.push(Styles.lengthIndicatorWarning);
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
					<View
						style={{
							position: 'absolute',
							right: 0,
							bottom: 0,
							top: 0,
							backgroundColor: 'green',
							justifyContent: 'flex-end',
							flexDirection: 'row',
						}}>
						<Text style={[lengthIndicatorStyles]}>
							{!inputValue.length ? 'at-least ' : ''}
							{`${minLength - inputValue.length}`}
							{!inputValue.length ? ' thingies ' : ''}
						</Text>
					</View>
				);
			}
		}
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
		if (value !== null && value !== inputValue) setInputValue(value);
	}, [value]);

	useImperativeHandle(ref, () => ({
		value: inputValue,
		clear,
		reset,
		set: handleChange,
		focus: () => inputRef?.current?.focus(),
		blur: () => inputRef?.current?.blur(),
		measure: () => inputRef?.current?.measure(),
	}));

	let styles = [Styles.input];
	if (multiline) styles.push(Styles.multiline);
	styles.push(style);

	return (
		<>
			<TextInput
				ref={inputRef}
				selection={selection}
				onSelectionChange={onSelectionChange}
				multiline={multiline}
				placeholder={placeholder}
				placeholderTextColor={placeholderColour}
				value={inputValue}
				style={styles}
				onChangeText={(data) => handleChange(data)}
				editable={enabled}
				onBlur={onBlur}
				onKeyPress={onKeyPress}
				onFocus={handleOnFocus}
				autoCorrect={autoCorrect}
				selectTextOnFocus={selectTextOnFocus}
				maxLength={maxLength ? maxLength : null}
			/>
			{renderLengthWarning()}
		</>
	);
});

TextField.propTypes = {
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
	containerStyle: PropTypes.object,
	outerContainerStyle: PropTypes.object,
	innerContainerStyle: PropTypes.object,
	style: PropTypes.object,
	lengthIndicatorShowPercentage: PropTypes.number,
	lengthWarningPercentage: PropTypes.number,
	lengthDangerPercentage: PropTypes.number,
	editable: PropTypes.bool,
	placeholderColour: PropTypes.string,
	hideLengthIndicator: PropTypes.bool,
	selectTextOnFocus: PropTypes.bool,
};

TextField.defaultProps = {
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
	minLength: 0,
	maxLength: 255,
	selection: null,
	onSelectionChange: null,
	onBlur: null,
	onKeyPress: null,
	autoCorrect: true,
	setIsValid: null,
	containerStyle: null,
	outerContainerStyle: null,
	innerContainerStyle: null,
	style: null,
	lengthIndicatorShowPercentage: 80,
	lengthWarningPercentage: 90,
	lengthDangerPercentage: 95,
	editable: true,
	placeholderColour: '#8a8a8a',
	hideLengthIndicator: false,
	selectTextOnFocus: false
};

export default TextField;
