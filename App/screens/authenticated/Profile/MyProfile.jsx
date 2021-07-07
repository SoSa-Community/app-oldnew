import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAPI } from '../../../context/APIContext';
import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';
import { useApp } from '../../../context/AppContext';

import ProfileForm from './ProfileForm';

import { refreshProfile, saveProfile, uploadImage } from './MyProfileHelpers';

const Styles = StyleSheet.create({});

const MyProfileScreen = ({ navigation }) => {
	const firstTime = true;

	const { setHeaderIcons, removeHeaderIcon, setMenuOptions } =
		useAuthenticatedNavigation();

	const { modals } = useApp();
	const {
		services: { general: generalService, profiles: profileService },
	} = useAPI();

	const [genders, setGenders] = useState([]);
	const [profile, setProfile] = useState(null);

	const [editingMode, setEditingMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useFocusEffect(
		React.useCallback(() => {
			let isActive = true;
			if (isActive) {
				setEditingMode(false);
				if (!firstTime) {
					setMenuOptions({ leftMode: 'back', title: 'My Profile' });
				} else {
					setMenuOptions({ showLeft: false, title: 'Welcome' });
				}
				refreshProfile(profileService, setGenders, setProfile);
			}

			return () => {
				isActive = false;
			};
		}, []),
	);

	return (
		<View style={{ backgroundColor: '#2D2F30', flex: 1 }}>
			<ProfileForm
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
			/>
		</View>
	);
};

export default MyProfileScreen;
