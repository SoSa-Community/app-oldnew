import AppConfig from '../../config';

import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

import SocialButton from '../SocialButton/SocialButton';
import FormError from '../FormError/FormError';
import { useApp } from '../../context/AppContext';

const onboardingPath = '../../assets/onboarding/';

const SocialButtons = ({
	forLogin,
	setError,
	socialMediaError,
	setSocialMediaError,
	processing,
	setProcessing,
}) => {
	const { middleware } = useApp();
	const { linkPreauth, deviceLogin } = useAuth();

	const { socialLogin } = useAuth();
	const screenType = forLogin ? 'login' : 'register';

	const {
		social: { imgur, reddit, google, twitter, facebook },
	} = AppConfig.features[screenType];

	let login = (network) => {
		setError('');
		setSocialMediaError('');
		setProcessing(true);

		// Protects against state getting out of sync
		setTimeout(() => setProcessing(false), 1000);

		socialLogin(forLogin, network).catch((error) => {
			console.debug(error);
			setSocialMediaError(error?.message);
		});
	};

	const createSocialButton = (network, icon) => {
		return (
			<SocialButton
				onPress={() => login(network)}
				icon={icon}
				enabled={!processing}
			/>
		);
	};

	useEffect(() => {
		middleware.clear('login');
		middleware.add(
			'login',
			`${screenType}/preauth`,
			(data) => {
				const {
					status,
					link_token,
					device_id,
					unregistered,
					error,
				} = data;
				console.info('App::AuthComponent::preauth_trigger', data);

				if (status === 'success') {
					if (unregistered) {
						Alert.alert(
							"You're not registered!",
							'Would you like us to create an account for you?',
							[
								{ text: 'No', style: 'cancel' },
								{
									text: "Sure! let's do it!",
									onPress: () => {
										linkPreauth(link_token).catch((error) =>
											setSocialMediaError(error),
										);
									},
								},
							],
							{ cancelable: true },
						);
					} else {
						deviceLogin(device_id).catch((error) =>
							setSocialMediaError(error),
						);
					}
				} else {
					setSocialMediaError(error);
				}
			},
			true,
		);
	}, []);

	return (
		<View>
			<FormError errors={socialMediaError} />
			<View
				style={{
					marginTop: 20,
					flexDirection: 'row',
					justifyContent: 'center',
				}}
			>
				{imgur
					? createSocialButton(
							'imgur',
							require(`${onboardingPath}imgur_icon.png`),
					  )
					: null}
				{reddit
					? createSocialButton(
							'reddit',
							require(`${onboardingPath}reddit_icon.png`),
					  )
					: null}
				{google
					? createSocialButton(
							'google',
							require(`${onboardingPath}google_icon.png`),
					  )
					: null}
				{twitter
					? createSocialButton(
							'twitter',
							require(`${onboardingPath}twitter_icon.png`),
					  )
					: null}
				{facebook
					? createSocialButton(
							'facebook',
							require(`${onboardingPath}facebook_icon.png`),
					  )
					: null}
			</View>
		</View>
	);
};

export default SocialButtons;
