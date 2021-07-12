import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAPI } from '../../../context/APIContext';
import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';

import ActivityButton from '../../../components/ActivityButton/ActivityButton';
import WelcomeForm from './WelcomeForm';

import {
	refreshProfile,
	saveProfile,
	updateProfileState,
	uploadImage,
} from './MyProfileHelpers';
import {useProfile} from '../../../context/ProfileContext';

const Styles = StyleSheet.create({
	container: { backgroundColor: '#2D2F30', flex: 1 },
	scrollView: { flex: 1 },
	text: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
	},
	header: {
		fontSize: 28,
		marginTop: 16,
		marginBottom: 16,
	},
	form: {
		marginTop: 24,
		marginBottom: Platform.OS === 'ios' ? 62 : 62,
	},
	buttons: {
		flexDirection: 'row',
		marginVertical: 4,
		flex: 1,
		marginHorizontal: 8,
	},
	buttonBottom: {
		backgroundColor: '#2D2F30',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		flex: 1,
		justifyContent: 'center',
		paddingVertical: 8,
	},
	logoutButton: {
		color: '#7ac256',
		padding: 8,
		textAlign: 'center',
		flex: 2,
	},
	loginButton: { flex: 3 },
});

const WelcomeProfileScreen = ({ navigation }) => {
	const { setTopbarVisible } = useAuthenticatedNavigation();

	const { modals } = useApp();
	const { logout } = useAuth();
	const { updateProfile } = useProfile();

	const {
		services: { general: generalService, profiles: profileService },
	} = useAPI();

	const [genders, setGenders] = useState([]);
	const [profile, setProfile] = useState(null);
	const profileFormRef = useRef(null);

	const [editingMode, setEditingMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const completeProfile = async () => {
		try {
			const updatedProfile = await profileFormRef?.current?.handleSave();
			updateProfile(updatedProfile, true);
			
			navigation.replace('Chat');
		} catch (e) {
		
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			let isActive = true;
			if (isActive) {
				setTopbarVisible(false);
				setEditingMode(false);
				refreshProfile(profileService, setGenders, setProfile);
			}

			return () => {
				setTopbarVisible(true);
				isActive = false;
			};
		}, []),
	);

	return (
		<View style={Styles.container}>
			<ScrollView style={Styles.scrollView}>
				<Text style={[Styles.text, Styles.header]}>...A bit more</Text>
				<Text style={Styles.text}>Tell us a bit about yourself</Text>
				<Text style={Styles.text}>
					to help you connect with the community
				</Text>

				<View
					style={Styles.form}>
					<WelcomeForm
						ref={profileFormRef}
						mock
						genders={genders}
						profile={profile}
						isMine
						loading={isLoading}
						onSave={(data, dirty) =>
							saveProfile(data, dirty, profileService, setProfile)
						}
						changeProfilePicture={() =>
							uploadImage(
								'picture',
								setIsLoading,
								generalService,
								profileService,
								setProfile,
								modals,
							)
						}
						changeCoverPicture={() =>
							uploadImage(
								'cover_picture',
								setIsLoading,
								generalService,
								profileService,
								setProfile,
								modals,
							)
						}
						isEditable
					/>
				</View>
			</ScrollView>

			<View style={Styles.buttonBottom}>
				<View style={Styles.buttons}>
					<Text style={Styles.logoutButton} onPress={() => logout()}>
						Logout
					</Text>
					<ActivityButton
						showActivity={isLoading}
						onPress={() => completeProfile()}
						text="Let me in!"
						style={[Styles.loginButton]}
					/>
				</View>
			</View>
		</View>
	);
};

export default WelcomeProfileScreen;
