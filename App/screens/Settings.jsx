import React, { useEffect } from 'react';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

import { useAuthenticatedNavigation } from '../context/AuthenticatedNavigationContext';
import SettingsItem from '../components/SettingsItem';

const Styles = StyleSheet.create({
	topContainer: {
		flex: 0,
		alignItems: 'center',
		marginVertical: '5%',
	},

	picture: {
		width: 128,
		height: 128,
		borderRadius: 128 / 2,
		borderWidth: 0.25,
		borderColor: '#121111',
		marginRight: 8,
	},

	username: {
		fontSize: 22,
		marginTop: 6,
	},
});

const nickname = '';
const SettingsScreen = () => {
	const { setMenuOptions } = useAuthenticatedNavigation();

	useEffect(() => {
		setMenuOptions({
			showLeft: true,
			showRight: false,
			leftMode: 'back',
			title: 'Settings',
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={Styles.topContainer}>
				<TouchableHighlight>
					<FastImage
						style={Styles.picture}
						source={{
							uri: `https://picsum.photos/300/300?seed=${Math.random()}`,
						}}
						resizeMethod="resize"
						resizeMode="stretch"
					/>
				</TouchableHighlight>
				<Text style={Styles.username}>{nickname}</Text>
			</View>

			<View style={{ flex: 1 }}>
				<SettingsItem
					title="Show Profile On Touch"
					description="Pressing a members face in chat will show their profile instead of tagging them "
					name="chat:touch_face_for_profile"
				/>
				<SettingsItem
					title="Hide Profile Picture on Comments"
					description="Some people prefer this, especially useful on smaller screens"
					name="comments:hide_profile_picture"
				/>
				<SettingsItem
					title="Show Slim Chat Messages"
					description="Are messages too thicc for your screen? this will sort you out!"
					name="chat:show_slim"
				/>
				<SettingsItem
					title="Show separators between chat messages"
					description="Some people like separators, some people don't"
					name="chat:show_separators"
				/>
			</View>
		</View>
	);
};

export default SettingsScreen;
