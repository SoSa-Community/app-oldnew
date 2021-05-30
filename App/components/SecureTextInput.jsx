import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from './Icon';
import Styles from '../screens/styles/onboarding';

const SecureTextInput = ({
	icon,
	placeholder,
	onChangeText,
	value,
	enabled,
	validateInput,
}) => {
	const [hideInput, setHideInput] = useState(true);

	const displaySuccess = (errorString) => {
		if (errorString === null) {
			return null;
		} else if (errorString.length === 0) {
			return (
				<Icon
					icon={['fas', 'check']}
					style={Styles.inputIcon}
					size={18}
					color="#28a745"
				/>
			);
		} else {
			return (
				<Icon
					icon={['fas', 'info-circle']}
					style={Styles.inputIcon}
					size={18}
					color="#dc3545"
					onPress={() => {
						console.log(errorString);
					}}
				/>
			);
		}
	};

	const displayViewInput = () => {
		let icon = 'eye-slash';
		let color = '#ccc';

		if (!hideInput) {
			icon = 'eye';
			color = '#000';
		}
		return (
			<Icon
				icon={['fal', icon]}
				style={[Styles.inputIcon, Styles.viewPasswordIcon]}
				size={22}
				color={color}
				onPress={() => setHideInput(!hideInput)}
			/>
		);
	};

	return (
		<View style={Styles.inputParentContainer}>
			<View style={Styles.inputContainer}>
				{icon && (
					<Icon icon={icon} style={Styles.inputIcon} size={18} />
				)}
				<TextInput
					placeholder={placeholder}
					placeholderTextColor="#ccc"
					style={Styles.input}
					secureTextEntry={hideInput}
					onChangeText={onChangeText}
					value={value}
					editable={enabled}
				/>
				{validateInput && displaySuccess(validateInput())}
				{displayViewInput()}
			</View>
		</View>
	);
};

SecureTextInput.propTypes = {
	icon: PropTypes.array,
	placeholder: PropTypes.string,
	onChangeText: PropTypes.func,
	value: PropTypes.string,
	enabled: PropTypes.bool,
	validateInput: PropTypes.func,
};

SecureTextInput.defaultProps = {
	icon: null,
	placeholder: '',
	onChangeText: null,
	value: '',
	enabled: true,
	validateInput: null,
};

export default SecureTextInput;
