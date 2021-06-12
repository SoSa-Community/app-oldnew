import React, { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';

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
		backgroundColor: '#121211',
		flex: 1,
	},
	inner: { paddingHorizontal: 30, justifyContent: 'center' },
	formContainer: {
		marginTop: 15,
	},
	error: { marginTop: 2 },
	buttons: { flexDirection: 'row', marginTop: 4 },
});

const RegistrationScreen = () => {
	const [error, setError] = useState('');
	const [socialMediaError, setSocialMediaError] = useState('');
	const [processing, setProcessing] = useState(false);

	const { register } = useAuth();
	const { handleSubmit, control, formState } = useForm({
		mode: 'onSubmit',
	});

	const { errors } = formState;

	const handleRegister = () => {
		setProcessing(true);

		const isValid = async (data) => {
			const { username, password, email } = data;
			try {
				await register(username, password, email);
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
		<View style={Styles.container}>
			<View style={Styles.inner}>
				<View style={Styles.formContainer}>
					<FieldWrapper
						error={errors?.username?.message}
						editingMode
						icon={['fal', 'user']}>
						<FormTextField
							name="username"
							placeholder="Username"
							control={control}
							enabled={!processing}
						/>
					</FieldWrapper>
					<FieldWrapper
						error={errors?.password?.message}
						editingMode
						icon={['fal', 'key']}>
						<FormSecureTextField
							name="password"
							placeholder="Password"
							control={control}
							enabled={!processing}
						/>
					</FieldWrapper>
					<FieldWrapper
						error={errors?.email?.message}
						editingMode
						icon={['fal', 'envelope']}>
						<FormTextField
							name="email"
							placeholder="E-mail"
							control={control}
							enabled={!processing}
						/>
					</FieldWrapper>
					<FormError errors={error} />

					<ActivityButton
						showActivity={processing}
						onPress={handleRegister}
						text="Let me in!"
					/>
					
					<Text style={{textAlign:'center', paddingTop: 16, color:'#8a8a8a', fontSize: 16}}>OR</Text>
					<Text style={{textAlign:'center', color:'#fff', fontSize: 16}}>Register with another account</Text>

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
