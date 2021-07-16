import React, { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useAPI } from '../../../context/APIContext';

import ActivityButton from '../../../components/ActivityButton/ActivityButton';
import FieldWrapper from '../../../components/FieldWrapper/FieldWrapper';
import FormTextField from '../../../components/Forms/TextField/FormTextField';
import Styles from './ForgotPasswordStyles';


const ForgotPassword = ({ navigation }) => {
	
	const [processing, setProcessing] = useState(false);
	const {
		services: { auth: authService },
	} = useAPI();

	const { handleSubmit, control, formState, setError } = useForm({
		mode: 'onSubmit',
	});

	const { errors } = formState;

	const handleForget = () => {
		setProcessing(true);

		const isValid = async (data) => {
			const { email } = data;
			try {
				const response = await authService?.forgotPassword(email);
				const { error } = response;

				if (error) throw error;
				navigation.navigate('ForgotPasswordCode', { email });
			} catch (error) {
				console.debug(error);
				setError('email', error[0]);
			}
			setProcessing(false);
		};

		const isErrored = (data) => setProcessing(false);
		handleSubmit(isValid, isErrored)();
	};

	return (
		<View style={Styles.container}>
			<View style={Styles.formContainer}>
				<Text style={Styles.header}>Forgot password?</Text>
				<FieldWrapper
					error={errors?.email?.message}
					editingMode
					icon={['fal', 'envelope']}>
					<FormTextField
						name="email"
						placeholder="Enter your email address"
						control={control}
						enabled={!processing}
					/>
				</FieldWrapper>
				<Text style={Styles.subheader}>
					Enter your email address and we'll send you a reset code
				</Text>
			</View>
			<View style={Styles.buttonBottom}>
				<ActivityButton
					showActivity={processing}
					onPress={handleForget}
					text="Send code"
					style={Styles.button}
					textStyle={Styles.buttonText}
				/>
			</View>
		</View>
	);
};

export default ForgotPassword;
