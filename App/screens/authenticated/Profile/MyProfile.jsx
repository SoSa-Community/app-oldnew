import React, { useState } from 'react';
import {
	View,
	StyleSheet
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useAPI } from '../../../context/APIContext';
import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';

import ProfileForm from './ProfileForm';
import Helpers from '../../../sosa/Helpers';
import { useApp } from '../../../context/AppContext';

const Styles = StyleSheet.create({});

const MyProfileScreen = ({ navigation }) => {
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

	const updateProfileState = (fields) => {
		const copiedEntity = Object.assign(
			Object.create(Object.getPrototypeOf(profile)),
			profile,
			fields,
		);
		setProfile(copiedEntity);
	};

	const refreshProfile = () => {
		setGenders([]);

		profileService
			.mine(true)
			.then(({ profile, options, widgets }) => {
				if (options) {
					const { genders } = options;
					if (Array.isArray(genders) && genders.length) {
						const newOptions = genders.map(({ id, name }) => ({
							label: name,
							value: id,
						}));
						setGenders(newOptions);
					}
				}
				console.debug(profile);
				setProfile(profile);
			})
			.catch((error) => console.debug(error));
	};

	const saveProfile = async (data, dirty) => {
		if (Object.keys(dirty).length) {
			const updatedProfile = await profileService.save(dirty);
			setProfile(updatedProfile);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			let isActive = true;
			if (isActive) {
				setEditingMode(false);
				setMenuOptions({ leftMode: 'back', title: 'My Profile' });
				refreshProfile();
			}

			return () => {
				if (removeHeaderIcon) {
					removeHeaderIcon('refresh_profile');
					removeHeaderIcon('edit_profile');
				}
				isActive = false;
			};
		}, []),
	);

	const uploadImage = async (field) => {
		const { uris, tag, uuid } = await Helpers.uploadFile(
			modals?.create,
			generalService,
			'sosa',
			(uploading) => {},
			(response) => new Promise((resolve) => resolve()),
		);

		console.debug(uris, tag, uuid);
		if (Array.isArray(uris)) {
			const toSave = { [field]: uris.pop() };
			await saveProfile(toSave, toSave);
		}
	};

	return (
		<View style={{ backgroundColor: '#2D2F30', flex: 1 }}>
			<ProfileForm
				mock
				genders={genders}
				profile={profile}
				isMine
				loading={isLoading}
				onSave={saveProfile}
				changeProfilePicture={() => uploadImage('picture')}
				changeCoverPicture={() => uploadImage('cover_picture')}
			/>
		</View>
	);
};

export default MyProfileScreen;
