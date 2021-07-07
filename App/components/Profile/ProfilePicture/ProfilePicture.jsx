import React from 'react';
import {
	TouchableHighlight,
	StyleSheet,
	View,
	Image,
	ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import FloatingIconButton from '../../FloatingCameraButton/FloatingIconButton';

const createImageStyle = (size) => {
	return { width: size, height: size, borderRadius: size / 2 };
};

const Styles = StyleSheet.create({
	container: { position: 'relative' },
	base: createImageStyle(32),
	small: createImageStyle(48),
	med: createImageStyle(64),
	large: createImageStyle(96),
	larger: createImageStyle(124),
	verylarge: createImageStyle(144),
	loader: { zIndex: 2 },
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.50)',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		zIndex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const ProfilePicture = ({
	picture,
	onPress,
	size,
	style,
	containerStyle,
	button,
	loading,
}) => {
	const imageComponent = () => {
		const image = () => {
			let processedPicture = require('../../../assets/profiles/default.jpg');

			if (picture) {
				if (typeof picture !== 'string' || !picture.length) {
					processedPicture = picture;
				} else {
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
			}

			return (
				<Image
					style={[Styles[size], !onPress ? style : null]}
					source={processedPicture}
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
		<View style={[Styles.container, containerStyle]}>
			{imageComponent()}
			{button && !loading && (
				<FloatingIconButton
					size={button?.size}
					onPress={button?.onPress}
					style={[{ color: '#fff' }, button?.style]}
					icon={button?.icon}
				/>
			)}
			{loading && (
				<>
					<View style={[Styles.overlay, Styles[size] || {}]}>
						<ActivityIndicator
							size={
								['large', 'larger', 'verylarge'].includes(size)
									? 'large'
									: 'small'
							}
							style={Styles.loader}
							color="#fff"
						/>
					</View>
				</>
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
		]),
		onPress: PropTypes.func,
	}),
	containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ProfilePicture.defaultProps = {
	size: 'base',
	onPress: null,
	picture: require('../../../assets/profiles/default.jpg'),
	containerStyle: null,
	style: null,
};

export default ProfilePicture;
