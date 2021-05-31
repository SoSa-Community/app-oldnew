import React from 'react';
import { TouchableHighlight, StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import IconButton from '../IconButton';

const Styles = StyleSheet.create({
	base: { width: 16, height: 16, borderRadius: 16 / 2 },
	small: { width: 32, height: 32, borderRadius: 32 / 2 },
	med: { width: 48, height: 48, borderRadius: 48 / 2 },
	large: { width: 64, height: 64, borderRadius: 64 / 2 },
	larger: { width: 80, height: 80, borderRadius: 80 / 2 },
	verylarge: { width: 128, height: 128, borderRadius: 128 / 2 },
	button: {
		position: 'absolute',
		bottom: '-2%',
		right: '-1%',
		backgroundColor: '#444442',
		borderRadius: 14,
		width: 28,
		height: 28,
		alignItems: 'center',
		justifyContent: 'center',
	},
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

		return <>{image()}</>;
	};

	return (
		<View style={{ position: 'relative' }}>
			{imageComponent()}
			{button && button?.icon ? (
				<View style={Styles.button}>
					<IconButton
						icon={button?.icon}
						style={button?.style || { color: '#fff' }}
						size={button?.size || 18}
						onPress={button?.onPress}
					/>
				</View>
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
	]).isRequired,
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
};

export default ProfilePicture;
