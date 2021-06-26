import React, { createContext, useContext, useState, useEffect } from 'react';

import LocalStorage from '../LocalStorage';
import { useAuth } from './AuthContext';
import { useAPI } from './APIContext';

const ProfileContext = createContext();

const ProfileProvider = (props) => {
	const { user } = useAuth();
	const {
		services: { profiles: profileService },
	} = useAPI();
	const [profile, setProfile] = useState(null);

	const updateProfile = (profile, save = true) => {
		setProfile(profile);
		if (save) {
			LocalStorage.save('profile', profile);
		}
	};

	useEffect(() => {
		(async () => {
			if (user) {
				let retrievedProfile;
				let save = true;

				try {
					retrievedProfile = await LocalStorage.retrieve(
						'profile',
						true,
					);
					save = false;
				} catch (e) {
					console.debug('e', e);
				}

				if (!retrievedProfile) {
					try {
						retrievedProfile = await profileService.mine();
					} catch (error) {
						console.debug('err', e);
					}
				}

				updateProfile(retrievedProfile, save);
			}
		})();
	}, [user]);

	return <ProfileContext.Provider value={{ profile }} {...props} />;
};

const useProfile = () => useContext(ProfileContext);
export { ProfileProvider, useProfile };
