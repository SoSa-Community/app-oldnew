import React, { useState } from 'react';
import {
	Text,
	View,
	TouchableHighlight,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
} from 'react-native';

import AppConfig from '../../../config';

import SocialButtons from '../../../components/SocialButtons/SocialButtons';
import FieldWrapper from '../../../components/FieldWrapper/FieldWrapper';
import FormTextField from '../../../components/Forms/TextField/FormTextField';
import FormSecureTextField from '../../../components/Forms/SecureTextField/FormSecureTextField';
import FormError from '../../../components/FormError/FormError';
import ActivityButton from '../../../components/ActivityButton/ActivityButton';
import { useAuth } from '../../../context/AuthContext';
import { useForm } from 'react-hook-form';

const Styles = StyleSheet.create({
	keyboardView: { flex: 1 },
	container: {
		backgroundColor: '#2D2F30',
		flex: 1,
	},
	inner: { marginTop: 20, paddingHorizontal: 20, flex: 1 },
	formContainer: {
		marginTop: 15,
	},
	error: { marginTop: 2 },
	buttons: { flexDirection: 'row', marginTop: 4 },
	forgotButton: {
		color: '#7ac256',
		padding: 8,
		textAlign: 'center',
		flex: 4,
	},
	buttonBottom: {
		flex: 1,
		justifyContent: 'flex-end',
		marginBottom: Platform.OS === 'ios' ? 68 : 36,
	},
	registerButton: {
		alignItems: 'center',
		borderRadius: 16,
		borderColor: '#f0ad4e',
		borderWidth: 1,
		paddingVertical: 10,
	},
	registerButtonText: { color: '#fff' },
	loginButton: { flex: 1 },
});

const LoginScreen = ({ navigation }) => {
	const [error, setError] = useState('');
	const [socialMediaError, setSocialMediaError] = useState('');
	const [processing, setProcessing] = useState(false);

	const forgotPassword = AppConfig?.features?.login?.forgotPassword;
	const canRegister = AppConfig?.features?.general?.canRegister;

	const { login } = useAuth();
	const { handleSubmit, control, formState } = useForm({
		mode: 'onSubmit',
	});

	const { errors } = formState;

	const handleAuth = () => {
		setProcessing(true);

		const isValid = async (data) => {
			const { username, password } = data;
			try {
				await login(username, password);
			} catch (error) {
				setError(error);
			}
			setProcessing(false);
		};

		const isErrored = (data) => {
			setProcessing(false);
		};

		handleSubmit(isValid, isErrored)();
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : null}
			style={Styles.keyboardView}>
			<View style={Styles.container}>
				<View style={Styles.inner}>
					<View style={[Styles.formContainer]}>
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
						<FormError errors={error} style={Styles.error} />
						<View style={Styles.buttons}>
							{forgotPassword && (
								<Text
									style={Styles.forgotButton}
									onPress={() =>
										navigation.navigate('ForgotPassword')
									}>
									Forgotten Password
								</Text>
							)}
							<ActivityButton
								showActivity={processing}
								onPress={handleAuth}
								text="Let me in!"
								style={[
									Styles.loginButton,
									forgotPassword ? { flex: 5 } : null,
								]}
							/>
						</View>

						<SocialButtons
							forLogin
							{...{
								setError,
								socialMediaError,
								setSocialMediaError,
								processing,
								setProcessing,
							}}
						/>
					</View>
					{canRegister && (
						<View style={Styles.buttonBottom}>
							<TouchableHighlight
								onPress={() =>
									navigation.navigate('Register', {})
								}
								style={Styles.registerButton}>
								<Text style={Styles.registerButtonText}>
									New to SoSa?
								</Text>
							</TouchableHighlight>
						</View>
					)}
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;
