import React, { createContext, useContext, useState, useEffect } from 'react';

import LocalStorage from '../LocalStorage';
import { useAuth } from './AuthContext';
import { useAPI } from './APIContext';
import { View, Text, ActivityIndicator } from 'react-native';

const ProfileContext = createContext();

const ProfileProvider = ({ children, ...props }) => {
	const { user } = useAuth();
	const {
		services: { profiles: profileService },
	} = useAPI();
	const [profile, setProfile] = useState(null);
	const [isFetchingProfile, setIsFetchingProfile] = useState(true);

	const updateProfile = async (profile, save = true) => {
		if (save) {
			await LocalStorage.save('profile', profile);
		}
		setProfile(profile);
	};

	const loadProfile = async (force) => {
		if (user) {
			let retrievedProfile;
			let save = true;

			if (!force) {
				try {
					retrievedProfile = await LocalStorage.retrieve(
						'profile',
						true,
					);
					save = false;
				} catch (e) {
					console.debug('e', e);
				}
			}

			if (!retrievedProfile) {
				try {
					retrievedProfile = await profileService.mine();
				} catch (error) {
					console.debug('err', error);
				}
			}
			await updateProfile(retrievedProfile, save);
		}
		setIsFetchingProfile(false);
	};

	useEffect(() => {
		(async () => {
			if (user) {
				setIsFetchingProfile(true);
				await loadProfile(true);
			} else {
				await updateProfile(null, true);
			}
		})();
	}, [user]);

	const LoadingScreen = () => {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#2D2F30',
				}}>
				<ActivityIndicator color="#fff" size="large" />
				<Text style={{ fontSize: 28, color: '#fff' }}>
					Doing some bits and bobs
				</Text>
			</View>
		);
	};

	return (
		<ProfileContext.Provider
			value={{ profile, loadProfile, updateProfile, isFetchingProfile }}
			{...props}>
			{isFetchingProfile ? <LoadingScreen /> : children}
		</ProfileContext.Provider>
	);
};

const useProfile = () => useContext(ProfileContext);
export { ProfileProvider, useProfile };
