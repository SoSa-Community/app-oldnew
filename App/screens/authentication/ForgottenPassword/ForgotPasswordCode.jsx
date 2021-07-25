import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';

import ActivityButton from '../../../components/ActivityButton/ActivityButton';
import { useAPI } from '../../../context/APIContext';
import { useForm } from 'react-hook-form';
import FormTextField from '../../../components/Forms/TextField/FormTextField';
import FieldWrapper from '../../../components/FieldWrapper/FieldWrapper';
import FPStyles from './ForgotPasswordStyles';
import FormError from '../../../components/FormError/FormError';

const Styles = StyleSheet.create({
	codeInputWrapper: { flexDirection: 'row', marginBottom: 4 },
	codeInputContainer: { flex: 1, marginHorizontal: 4 },
	codeInputFieldWrapper: { paddingVertical: 20 },
	...FPStyles,
});

const ForgotPasswordCode = ({ navigation, route }) => {
	const [processing, setProcessing] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [errors, setErrors] = useState([]);

	const codeRefs = [
		useRef(),
		useRef(),
		useRef(),
		useRef(),
		useRef(),
		useRef(),
	];

	const {
		services: { auth: authService },
	} = useAPI();

	const { handleSubmit, control, formState, setError, setValue, watch } =
		useForm({
			mode: 'onChange',
		});

	const values = watch();

	const handleCode = () => {
		setProcessing(true);

		const isValid = async (data) => {
			let { email } = data;
			let pin = [];

			for (let x = 0; x <= codeRefs.length; x++) {
				pin.push(data[`pin${x}`]);
			}

			if (!email && route?.params?.email?.length) {
				email = route?.params?.email;
			}

			try {
				const response = await authService?.forgotPasswordValidate(
					email,
					pin.join(''),
				);

				const { error } = response;

				if (error) throw error;

				const {
					response: { token, transient },
				} = response;

				navigation.replace('ForgotPasswordNew', { token, transient });
			} catch (error) {
				setErrors(error);
			}
			setProcessing(false);
		};

		const isErrored = (data) => {
			setProcessing(false);
		};
		handleSubmit(isValid, isErrored)();
	};

	const boxes = () => {
		const arr = [];

		const buildInput = (index) => (
			<View style={Styles.codeInputContainer} key={`${index}`}>
				<FieldWrapper
					error={errors?.pin?.message}
					editingMode
					containerStyle={Styles.codeInputFieldWrapper}>
					<FormTextField
						ref={codeRefs[index]}
						name={`pin${index}`}
						placeholder="-"
						control={control}
						enabled={!processing}
						style={{ textAlign: 'center' }}
						maxLength={1}
						hideLengthIndicator
						selectTextOnFocus
						onChange={(data) => {
							if (data) codeRefs[index + 1]?.current?.focus();
							else {
								codeRefs[index - 1]?.current?.focus();
							}
						}}
					/>
				</FieldWrapper>
			</View>
		);

		for (let x = 0; x < codeRefs.length; x++) {
			arr.push(buildInput(x));
		}
		return arr;
	};

	const text = route?.params?.email?.length
		? 'Please enter the code you received or '
		: 'Please re-enter your e-mail and the code you received at that e-mail address or ';

	useEffect(() => {
		const { params } = route;
		if (params && Object.hasOwnProperty.call(params, 'email')) {
			const { email } = params;
			if (email.length) setValue('email', email);
		}
	}, []);

	useEffect(() => {
		let valid = false;

		if (values?.email) {
			let pin = [];
			for (let x = 0; x <= codeRefs.length; x++) {
				const key = `pin${x}`;
				if (Object.hasOwnProperty.call(values, key) && values[key]) {
					pin.push(values[key]);
				}
			}
			if (pin.length === codeRefs.length) {
				valid = true;
			}
		}
		setIsValid(valid);
	}, [values]);

	return (
		<View style={Styles.container}>
			<View style={Styles.formContainer}>
				<Text style={Styles.header}>Enter code</Text>
				{!route?.params?.email?.length && (
					<FieldWrapper
						error={errors?.email?.message}
						editingMode
						icon={['fal', 'envelope']}>
						<FormTextField
							name="email"
							placeholder="Re-enter your email address"
							control={control}
							enabled={!processing}
						/>
					</FieldWrapper>
				)}
				<View style={Styles.codeInputWrapper}>{boxes()}</View>
				<FormError errors={errors} />
				<Text style={Styles.subheader}>
					{text}{' '}
					<TouchableHighlight
						onPress={() => {
							navigation.goBack();
						}}>
						<Text style={Styles.subheaderButton}>
							use a different email
						</Text>
					</TouchableHighlight>
				</Text>
			</View>
			<View style={Styles.buttonBottom}>
				<ActivityButton
					showActivity={processing}
					onPress={handleCode}
					text="Confirm code"
					style={Styles.button}
					textStyle={Styles.buttonText}
					disabled={!isValid}
				/>
			</View>
		</View>
	);
};

export default ForgotPasswordCode;
