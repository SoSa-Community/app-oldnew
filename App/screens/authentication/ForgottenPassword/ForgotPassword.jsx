import React, { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import BaseStyles from '../../styles/base';
import Helpers from '../../../sosa/Helpers';

import ActivityButton from '../../../components/ActivityButton/ActivityButton';

import FieldWrapper from '../../../components/FieldWrapper/FieldWrapper';
import FormTextField from '../../../components/Forms/TextField/FormTextField';
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
	header: {
		fontSize: 24,
		color: '#fff',
		textAlign: 'center',
		marginBottom: 5,
	}
});

const ForgotPassword = ({ navigation }) => {
	const [processing, setProcessing] = useState(false);

	const { handleSubmit, control, formState, setError } = useForm({
		mode: 'onSubmit',
	});

	const { errors } = formState;

	const handleForget = () => {
		setProcessing(true);
		console.debug('hello3', errors);

		const isValid = async (data) => {
			const { email } = data;
			try {
				const response = await Helpers.request('forgot', { email });
				const { error } = response;

				if (error) throw error;
				navigation.navigate('ForgotPasswordCode', { email });
			} catch (error) {
				console.debug(error);
				setError('email', error);
			}
			setProcessing(false);
		};

		const isErrored = (data) => {
			console.debug('dadas', errors);
			setProcessing(false);
		};
		handleSubmit(isValid, isErrored)();
	};

	return (
		<View style={Styles.container}>
			<View style={Styles.inner}>
				<Text style={Styles.header}>What's your e-mail?</Text>

				<View style={Styles.formContainer}>
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
					<ActivityButton
						showActivity={processing}
						onPress={() => {
							console.debug('hello2');
							handleForget()
						}}
						text="Reset My Password!"
					/>
				</View>
			</View>
		</View>
	);
};

export default ForgotPassword;
