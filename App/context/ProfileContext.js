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
		if (user) {
			LocalStorage.retrieve('profile', true)
				.then((retrievedProfile) =>
					updateProfile(retrievedProfile, false),
				)
				.catch((e) => {
					profileService
						.mine()
						.then((retrievedProfile) =>
							updateProfile(retrievedProfile),
						);
				});
		}
	}, [user]);

	return <ProfileContext.Provider value={{ profile }} {...props} />;
};

const useProfile = () => useContext(ProfileContext);
export { ProfileProvider, useProfile };
