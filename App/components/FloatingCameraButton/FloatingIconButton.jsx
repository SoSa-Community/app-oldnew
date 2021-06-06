import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';

const buttonStyle = (size) => {
	return {
		position: 'absolute',
		bottom: '-2%',
		right: 0,
		backgroundColor: '#444442',
		borderRadius: size + 16 / 2,
		width: size + 16,
		height: size + 16,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#2D2F30',
		borderWidth: 1.5,
	};
};

const FloatingIconButton = ({ icon, onPress, size, style, containerStyle }) => {
	return (
		<View style={[buttonStyle(size), containerStyle]}>
			<IconButton
				icon={icon}
				style={[{ color: '#fff' }, style]}
				size={size}
				onPress={onPress}
			/>
		</View>
	);
};

FloatingIconButton.propTypes = {
	icon: PropTypes.array,
	size: PropTypes.number,
	onPress: PropTypes.func,
	style: PropTypes.object,
	containerStyle: PropTypes.object,
};

FloatingIconButton.defaultProps = {
	icon: ['fal', 'camera'],
	size: 18,
	onPress: null,
	style: null,
};

export default FloatingIconButton;
