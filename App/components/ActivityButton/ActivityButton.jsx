import React from 'react';
import {
	ActivityIndicator,
	Text,
	TouchableHighlight,
	View,
	StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const Styles = StyleSheet.create({
	button: {
		borderRadius: 6,
		flex: 0,
		flexDirection: 'row',
		backgroundColor: '#5cb85c',
		paddingVertical: 12,
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

	textContainer: { flex: 1, flexDirection: 'row', alignItems:'center', justifyContent:'center' },
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
	styles.push(style);
	if (disabled) styles.push(Styles.disabled);

	console.debug(showActivity, disabled, styles);

	return (
		<TouchableHighlight disabled={disabled || showActivity} style={styles} onPress={onPress}>
			<View style={Styles.textContainer}>
				<Text style={[Styles.text, textStyle]}>{text}</Text>
				<ActivityIndicator
					size="small"
					style={Styles.spinner}
					color="#fff"
					hidesWhenStopped
					animating={!disabled && showActivity}
				/>
			</View>
		</TouchableHighlight>
	);
};

ActivityButton.propTypes = {
	showActivity: PropTypes.bool,
	onPress: PropTypes.func,
	text: PropTypes.string.isRequired,
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	disabled: PropTypes.bool,
};

ActivityButton.defaultProps = {
	showActivity: false,
	onPress: null,
	style: null,
	disabled: false,
};

export default ActivityButton;
