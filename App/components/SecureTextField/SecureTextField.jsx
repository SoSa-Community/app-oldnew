import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../Icon';

const Styles = StyleSheet.create({
	container: { flexDirection: 'row', flex: 1 },
	inner: { flex: 1 },
	input: { padding: 0, color: '#fff' },
});

const SecureTextField = ({
	placeholder,
	onChange,
	value,
	enabled,
	style,
	placeholderColour,
}) => {
	const [hideInput, setHideInput] = useState(true);

	const displayViewInput = () => {
		let icon = 'eye-slash';
		let color = placeholderColour;

		if (!hideInput) {
			icon = 'eye';
			color = '#fff';
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
		<View style={Styles.container}>
			<View style={Styles.inner}>
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={placeholderColour}
					style={[Styles.input, style]}
					secureTextEntry={hideInput}
					onChangeText={onChange}
					value={value}
					editable={enabled}
				/>
			</View>
			{displayViewInput()}
		</View>
	);
};

SecureTextField.propTypes = {
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.string,
	enabled: PropTypes.bool,
	placeholderColour: PropTypes.string,
};

SecureTextField.defaultProps = {
	placeholder: '',
	onChange: null,
	value: '',
	enabled: true,
	placeholderColour: '#8a8a8a',
};

export default SecureTextField;
