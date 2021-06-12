import React, { useState } from 'react';

import BaseStyles from '../../styles/base';
import Styles from '../../styles/onboarding';

import { View } from 'react-native';

import CredentialInput from '../../../components/auth/CredentialInput';
import SocialButtons from '../../../components/SocialButtons/SocialButtons';

const RegistrationScreen = () => {
	const [error, setError] = useState('');
	const [socialMediaError, setSocialMediaError] = useState('');
	const [processing, setProcessing] = useState(false);

	return (
		<View style={BaseStyles.container}>
			<View style={{ paddingHorizontal: 30, justifyContent: 'center' }}>
				<View style={Styles.content_container}>
					<CredentialInput
						{...{
							error,
							setError,
							setSocialMediaError,
							processing,
							setProcessing,
						}}
					/>
					<SocialButtons
						{...{
							setError,
							socialMediaError,
							setSocialMediaError,
							processing,
							setProcessing,
						}}
					/>
				</View>
			</View>
		</View>
	);
};

export default RegistrationScreen;
