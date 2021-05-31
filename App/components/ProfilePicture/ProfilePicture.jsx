import React from 'react';
import { TouchableHighlight, StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import FloatingIconButton from '../FloatingCameraButton/FloatingIconButton';

const createImageStyle = (size) => {
	return { width: size, height: size, borderRadius: size / 2 };
};

const Styles = StyleSheet.create({
	base: createImageStyle(32),
	small: createImageStyle(48),
	med: createImageStyle(64),
	large: createImageStyle(96),
	larger: createImageStyle(124),
	verylarge: createImageStyle(144),
});

const ProfilePicture = ({ picture, onPress, size, style, button }) => {
	const imageComponent = () => {
		const image = () => {
			if (typeof picture === 'string' || typeof picture === 'object') {
				return (
					<FastImage
						style={[Styles[size], !onPress ? style : null]}
						source={
							typeof picture === 'string'
								? { uri: picture }
								: picture
						}
					/>
				);
			}

			return (
				<Image
					style={[Styles[size], !onPress ? style : null]}
					source={picture}
				/>
			);
		};

		if (onPress) {
			return (
				<TouchableHighlight {...{ onPress, style }}>
					{image()}
				</TouchableHighlight>
			);
		}

		return image();
	};

	return (
		<View style={{ position: 'relative' }}>
			{imageComponent()}
			{button ? (
				<FloatingIconButton
					size={button?.size}
					onPress={button?.onPress}
					style={[{ color: '#fff' }, button?.style]}
					icon={button?.icon}
				/>
			) : (
				<></>
			)}
		</View>
	);
};

ProfilePicture.propTypes = {
	picture: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object,
		PropTypes.bool,
	]),
	size: PropTypes.oneOf([
		'base',
		'small',
		'med',
		'large',
		'larger',
		'verylarge',
	]),
	onPress: PropTypes.func,
	button: PropTypes.shape({
		icon: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
			PropTypes.bool,
		]).isRequired,
		onPress: PropTypes.func,
	}),
};

ProfilePicture.defaultProps = {
	size: 'base',
	onPress: null,
	picture: require(`../../assets/profiles/default.jpg`),
};

export default ProfilePicture;
