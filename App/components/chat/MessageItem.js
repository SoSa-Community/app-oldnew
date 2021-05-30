import React from 'react';

import {
	Linking,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
	StyleSheet,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import HTML from 'react-native-render-html';

const Styles = StyleSheet.create({
	container: {
		paddingVertical: 12,
	},

	containerSeparator: {
		borderTopColor: '#444442',
		borderTopWidth: 0.5,
	},

	containerSlim: {
		paddingVertical: 6,
	},

	containerWithMention: {
		backgroundColor: '#000000',
	},

	inner: {
		flexDirection: 'row',
		paddingHorizontal: 4,
	},

	pictureContainer: {
		marginRight: 10,
	},

	message: {
		color: '#ffffff',
		borderBottomColor: '#cccccc',
		borderBottomWidth: 1,
		paddingBottom: 10,
	},

	username: {
		color: '#ffffff',
		paddingBottom: 3,
		fontWeight: 'bold',
	},

	pictureButton: {
		backgroundColor: '#444442',
		padding: 4,
		borderRadius: 100 / 2,
	},

	picture: {
		width: 42,
		height: 42,
		borderRadius: 48 / 2,
	},

	messageContainer: {
		flex: 1,
	},

	embedView: {
		marginTop: 8,
	},
});

const MessageItem = ({
	message,
	onFacePress,
	onLongFacePress,
	onUsernamePress,
	myNickname,
	showSeparator,
	showSlim,
}) => {
	let containerStyles = [Styles.container];
	if (
		message.mentions.length > 0 &&
		message.mentions.indexOf(myNickname) !== -1
	) {
		containerStyles.push(Styles.containerWithMention);
	}

	if (!message?.user?.picture) {
		message.user.picture = `https://picsum.photos/300/300?seed=${Math.random()}`;
	}

	if (showSlim) {
		containerStyles.push(Styles.containerSlim);
	}
	if (showSeparator) {
		containerStyles.push(Styles.containerSeparator);
	}

	const renderMessage = () => {
		if (
			typeof message.parsed_content === 'string' &&
			message.parsed_content.length > 0
		) {
			return (
				<HTML
					html={message.parsed_content}
					tagsStyles={{ a: { color: '#7ac256' } }}
					baseFontStyle={{ color: '#fff' }}
					onLinkPress={(evt, href) => Linking.openURL(href)}
					imagesMaxWidth={Dimensions.get('window').width / 4}
					ignoredStyles={['height', 'width']}
					renderers={{
						spoiler: {
							wrapper: 'Text',
							renderer: (
								htmlAttribs,
								children,
								convertedCSSStyles,
								passProps,
							) => <Text> {children} </Text>,
						},
					}}
				/>
			);
		} else {
			return <></>;
		}
	};

	const renderEmbeds = () => {
		let e = [...message.embeds];
		return e.map((embed, index) => {
			if (embed.image && embed.image.length) {
				return (
					<View
						style={{
							flex: 1,
							justifyContent: 'flex-start',
							flexWrap: 'wrap',
							marginBottom: 10,
						}}
						key={index}>
						<TouchableOpacity
							onPress={() => Linking.openURL(embed.image)}>
							<FastImage
								source={{ uri: embed.image }}
								style={{ width: 250, aspectRatio: 1 }}
								resizeMethod="resize"
								resizeMode="stretch"
							/>
						</TouchableOpacity>
					</View>
				);
			}
		});
	};

	return (
		<View style={containerStyles}>
			<View style={Styles.inner}>
				<View style={Styles.pictureContainer}>
					<TouchableOpacity
						onPress={onFacePress}
						onLongPress={onLongFacePress}
						style={Styles.pictureButton}
						delayLongPress={100}>
						<FastImage
							source={{ uri: message?.user?.picture }}
							style={Styles.picture}
						/>
					</TouchableOpacity>
				</View>
				<View style={Styles.messageContainer}>
					<TouchableOpacity
						onPress={onUsernamePress}
						onLongPress={onLongFacePress}>
						<Text style={Styles.username}>
							{message?.user?.nickname}
						</Text>
					</TouchableOpacity>
					<View>
						{renderMessage()}
						<View style={Styles.embedView}>{renderEmbeds()}</View>
					</View>
				</View>
			</View>
		</View>
	);
};

MessageItem.propTypes = {
	message: PropTypes.shape({
		user: PropTypes.shape({
			nickname: PropTypes.string.isRequired,
			picture: PropTypes.string,
		}),
		parsed_content: PropTypes.string,
		mentions: PropTypes.array,
	}),
	onFacePress: PropTypes.func,
	onLongFacePress: PropTypes.func,
	onUsernamePress: PropTypes.func,
	myNickname: PropTypes.string,
	showSeparator: PropTypes.bool,
	showSlim: PropTypes.bool,
};

MessageItem.defaultProps = {
	onFacePress: null,
	onLongFacePress: null,
	onUsernamePress: null,
	myNickname: '',
	showSeparator: false,
	showSlim: false,
};

export default MessageItem;
