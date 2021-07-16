import React, { Component, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';

import ActivityButton from '../../../components/ActivityButton/ActivityButton';
import { useAPI } from '../../../context/APIContext';
import { useForm } from 'react-hook-form';

import FieldWrapper from '../../../components/FieldWrapper/FieldWrapper';
import FormSecureTextField from '../../../components/Forms/SecureTextField/FormSecureTextField';
import Styles from './ForgotPasswordStyles';

let token = '';
let transient = '';

const ForgotPasswordCode = ({ navigation, route }) => {
	const [processing, setProcessing] = useState(false);
	const {
		services: { auth: authService },
	} = useAPI();

	const { handleSubmit, control, formState, setError, setValue } = useForm({
		mode: 'onChange',
	});

	const { errors, isValid } = formState;

	useEffect(() => {
		const { params } = route;
		if (params) {
			if (
				!Object.hasOwnProperty.call(params, 'transient') ||
				!Object.hasOwnProperty.call(params, 'token')
			) {
			} else {
				transient = params?.transient;
				token = params?.token;
			}
		}
	}, []);

	const handleCode = () => {
		setProcessing(true);

		const isValid = async (data) => {
			const { password } = data;
			try {
				const response = await authService?.resetPassword(
					token,
					transient,
					password,
				);

				const { error } = response;
				if (error) throw error;

				navigation.reset({
					routes: [{ name: 'ForgotPasswordSuccessful' }],
				});
			} catch (error) {
				console.debug(error);
				setError('password', error[0]);
			}
			setProcessing(false);
		};

		const isErrored = (data) => {
			console.debug(data);
			setProcessing(false);
		};
		handleSubmit(isValid, isErrored)();
	};

	return (
		<View style={Styles.container}>
			<View style={Styles.formContainer}>
				<Text style={Styles.header}>Reset Password</Text>
				<FieldWrapper
					icon={['fal', 'key']}
					error={errors?.password?.message}
					editingMode>
					<FormSecureTextField
						control={control}
						name="password"
						placeholder="Your New Password"
						enabled={!processing}
					/>
				</FieldWrapper>
				<Text style={Styles.subheader}>Type your new password</Text>
			</View>
			<View style={Styles.buttonBottom}>
				<ActivityButton
					showActivity={processing}
					onPress={handleCode}
					text="Confirm new password"
					style={Styles.button}
					textStyle={Styles.buttonText}
					disabled={!isValid}
				/>
			</View>
		</View>
	);
};

export default ForgotPasswordCode;
