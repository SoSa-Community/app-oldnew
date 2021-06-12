import AppConfig from '../../config';

import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';

import ActivityButton from '../ActivityButton/ActivityButton';
import FormError from '../FormError';
import TextField from '../TextField/TextField';
import SecureTextField from '../SecureTextField';

import Helpers from '../../sosa/Helpers';
import Styles from '../../screens/styles/onboarding';
import FieldWrapper from '../FieldWrapper/FieldWrapper';
import FormTextField from '../Forms/TextField/FormTextField';
import { useForm } from 'react-hook-form';
import FormSecureTextField from '../Forms/SecureTextField/FormSecureTextField';

const CredentialInput = ({
	forLogin,
	error,
	setError,
	processing,
	setProcessing,
}) => {
	const navigation = useNavigation();

	const { login, register } = useAuth();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');

	const errors = {};

	const { handleSubmit, control, formState, watch, reset } = useForm({
		mode: 'onSubmit',
	});

	const { forgotPassword, credentials } =
		AppConfig.features[forLogin ? 'login' : 'register'];

	const validatePassword = () => {
		try {
			if (Helpers.validatePassword(password) === false) {
				return null;
			}
		} catch (e) {
			return e?.message;
		}
		return '';
	};

	const handleAuth = () => {
		setProcessing(true);
		return new Promise((resolve, reject) => {
			const isValid = async (data) => {
				const { username, password } = data;
				try {
					const result = (await forLogin)
						? login(username, password)
						: register(username, password, email);
					setProcessing(false);
					resolve(result);
				} catch (error) {
					setError(error);
					reject(error);
				}
			};

			const isErrored = (data) => {
				reject();
			};

			handleSubmit(isValid, isErrored)();
		});
	};

	const Buttons = () => {
		const letmeinButton = (
			<ActivityButton
				showActivity={processing}
				onPress={handleAuth}
				text="Let me in!"
			/>
		);
		const forgotButton = (
			<View>
				<Text
					style={Styles.forgotButton}
					onPress={() => navigation.navigate('ForgotPassword')}>
					Forgotten Password
				</Text>
			</View>
		);

		if (forgotPassword) {
			return (
				<View style={{ marginTop: 4 }}>
					<View style={{ flexDirection: 'row', height: 40 }}>
						<View style={{ flex: 5 }}>{forgotButton}</View>
						<View style={{ flex: 6 }}>{letmeinButton}</View>
					</View>
				</View>
			);
		}
		return <View style={{ marginTop: 4 }}>{letmeinButton}</View>;
	};

	if (credentials) {
		if (forLogin) {
			return (
				<View>
					<FieldWrapper
						error={errors?.username?.message}
						editingMode
						icon={['fal', 'user']}>
						<FormTextField
							control={control}
							name="username"
							placeholder="Username or e-mail address"
							enabled={!processing}
						/>
					</FieldWrapper>
					<FieldWrapper
						icon={['fal', 'key']}
						error={errors?.password?.message}
						editingMode>
						<FormSecureTextField
							control={control}
							name="password"
							placeholder="Password"
							enabled={!processing}
						/>
					</FieldWrapper>
					<View style={{ marginTop: 2 }}>
						<FormError errors={error} />
					</View>
					<Buttons />
				</View>
			);
		} else {
			return (
				<View>
					<TextField
						containerStyle={{ marginBottom: 4 }}
						icon={['fal', 'user']}
						placeholder="Username"
						value={username}
						onChange={(data) => setUsername(data)}
						enabled={!processing}
					/>
					<SecureTextField
						icon={['fal', 'key']}
						placeholder="Password"
						onChange={(data) => setPassword(data)}
						validateInput={() => validatePassword()}
						enabled={!processing}
					/>
					<TextField
						containerStyle={{ marginTop: 4 }}
						icon={['fal', 'envelope']}
						placeholder="E-mail"
						value={email}
						onChange={(data) => setEmail(data)}
						enabled={!processing}
					/>
					<FormError errors={error} />
					<Buttons />
				</View>
			);
		}
	}

	return null;
};

export default CredentialInput;
