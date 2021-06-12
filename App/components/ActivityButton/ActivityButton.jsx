import React from 'react';
import {
	ActivityIndicator,
	Text,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const Styles = StyleSheet.create({
	button: {
		borderRadius: 4,
		flex: 0,
		flexDirection: 'row',
		backgroundColor: '#5cb85c',
		paddingVertical: 8,
		justifyContent: 'center',
	},

	pressed: {
		backgroundColor: '#ccc',
	},
	disabled: {
		backgroundColor: '#ccc',
	},
	text: {
		color: '#fff',
		fontSize: 16,
	},
	spinner: {
		marginLeft: 8,
	},
});

const ActivityButton = ({
	showActivity,
	onPress,
	text,
	style,
	textStyle,
	disabled,
}) => {
	const styles = [Styles.button];
	if (showActivity) styles.push(Styles.pressed);
	if (disabled) styles.push(Styles.disabled)
	styles.push(style);

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles}>
				<Text style={[Styles.text, textStyle]}>{text}</Text>
				{showActivity && !disabled && (
					<ActivityIndicator
						size="small"
						style={Styles.spinner}
						color="#fff"
					/>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

ActivityButton.propTypes = {
	showActivity: PropTypes.bool,
	onPress: PropTypes.func,
	text: PropTypes.string.isRequired,
	style: PropTypes.object,
	disabled: PropTypes.bool,
};

ActivityButton.defaultProps = {
	showActivity: false,
	onPress: null,
	style: null,
	disabled: false,
};

export default ActivityButton;
