import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Styles = StyleSheet.create({
	button: {
		borderRadius: 8,
		flex: 0,
		flexDirection: 'row',
		paddingVertical: 8,
		justifyContent: 'center',
		paddingHorizontal: 16,
	},

	disabled: {
		backgroundColor: '#ccc',
	},

	text: {
		color: '#fff',
		fontSize: 16,
	},
});

const Button = ({
	onPress,
	text,
	backgroundColor,
	style,
	textStyle,
	disabled,
}) => {
	const styles = [Styles.button];
	styles.push({ backgroundColor });

	if (disabled) styles.push(Styles.disabled);
	styles.push(style);

	return (
		<TouchableHighlight onPress={!disabled ? onPress : null} style={styles}>
			<Text style={[Styles.text, textStyle]}>{text}</Text>
		</TouchableHighlight>
	);
};

Button.propTypes = {
	onPress: PropTypes.func,
	text: PropTypes.string.isRequired,
	style: PropTypes.object,
	disabled: PropTypes.bool,
	backgroundColor: PropTypes.string,
};

Button.defaultProps = {
	onPress: null,
	style: null,
	disabled: false,
	backgroundColor: '#5cb85c',
};

export default Button;
