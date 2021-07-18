import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAPI } from '../../../context/APIContext';
import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';
import { useApp } from '../../../context/AppContext';

import ProfileForm from './ProfileForm';

import { refreshProfile, saveProfile, uploadImage } from './MyProfileHelpers';
import { useProfile } from '../../../context/ProfileContext';

const Styles = StyleSheet.create({
	container: { backgroundColor: '#2D2F30', flex: 1 },
});

const MyProfileScreen = ({ navigation }) => {
	const { setHeaderIcons, removeHeaderIcon, setMenuOptions } =
		useAuthenticatedNavigation();

	const { modals } = useApp();
	const { updateProfile } = useProfile();
	const {
		services: { general: generalService, profiles: profileService },
	} = useAPI();

	const [genders, setGenders] = useState([]);
	const [profile, setProfile] = useState(null);

	const [editingMode, setEditingMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useFocusEffect(
		React.useCallback(() => {
			setMenuOptions({ leftMode: 'back', title: 'My Profile' });
			refreshProfile(profileService, setGenders, setProfile);

			return () => {};
		}, []),
	);

	useEffect(() => {
		if (profile) {
			updateProfile(profile, true);
		}
	}, [profile]);

	useEffect(() => {
		setEditingMode(false);
	}, []);

	return (
		<View style={Styles.container}>
			<ProfileForm
				mock
				genders={genders}
				profile={profile}
				isMine
				loading={isLoading}
				onSave={(data, dirty) => {
					console.debug('hello');
					saveProfile(
						data,
						dirty,
						profileService,
						profile,
						setProfile,
					)
						.then(() => setEditingMode(false))
						.catch((error) => console.debug(error));
				}}
				changeProfilePicture={() =>
					uploadImage(
						'picture',
						setIsLoading,
						generalService,
						profileService,
						profile,
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
						profile,
						setProfile,
						modals,
					)
				}
			/>
		</View>
	);
};

export default MyProfileScreen;
