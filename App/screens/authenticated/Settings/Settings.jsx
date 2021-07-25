import React, { useEffect } from 'react';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';

import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';
import SettingsItem from '../../../components/SettingsItem';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/Button/Button';

const Styles = StyleSheet.create({});

const SettingsScreen = () => {
	const { setMenuOptions } = useAuthenticatedNavigation();
	const { logout } = useAuth();

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
				<View style={{ alignItems: 'center', marginTop: 16 }}>
					<Button onPress={() => logout()} text="Logout" />
				</View>
			</View>
		</View>
	);
};

export default SettingsScreen;
