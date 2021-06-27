import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
		try {
			const options = {
				handleUpload: (file) => {
					setIsLoading(true);
					return generalService.handleUpload('sosa', file);
				},
				cropperToolbarTitle: 'Crop your picture',
				cropping: true,
				croppingHeight: field === 'picture' ? 600 : 1080,
				croppingWidth: field === 'picture' ? 600 : 1920,
			};

			const { uris, tag, uuid } = await Helpers.uploadFile(options);

			if (Array.isArray(uris)) {
				const toSave = { [field]: uris.pop() };
				await saveProfile(toSave, toSave);
			}
		} catch (e) {
			const message = Array.isArray(e) ? e.pop()?.message : e?.message;
			if (message !== 'user_cancelled') {
				modals?.create('Error uploading image', message);
			}
		} finally {
			setIsLoading(false);
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
