import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { useForm } from 'react-hook-form';

import ProfileHeader from '../../../components/ProfileHeader/ProfileHeader';
import FieldWrapper from '../../../components/FieldWrapper/FieldWrapper';
import FormDateTimePicker from '../../../components/Forms/DateTimePicker/FormDateTimePicker';
import FormPicker from '../../../components/Forms/Picker/FormPicker';
import FormTextField from '../../../components/Forms/TextField/FormTextField';

import PropTypes from 'prop-types';
import IconButton from '../../../components/IconButton';

const Styles = StyleSheet.create({
	nicknameTaglineContainer: { justifyContent: 'center', marginBottom: 12 },
	nickname: { fontSize: 22, textAlign: 'center' },
	tagline: { fontSize: 18, textAlign: 'center' },
	fieldContainerStyle: { marginBottom: 12 },
	privacyButton: {
		borderWidth: 2,
		borderColor: '#F96854',
		backgroundColor: 'rgba(249, 104, 84, 0.21)',
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 0,
	},
	privacyButtonIcon: { color: '#FFF' },
});

const ProfileForm = ({ genders, profile, loading, performSave, isMine }) => {
	const [editingMode, setEditingMode] = useState(false);
	const [resetValues, setResetValues] = useState({});
	const [formValues, setFormValues] = useState({
		nickname: '',
		tagline: '',
		age: '',
		gender: { name: '' },
		date_of_birth: '',
		gender_id: '',
		from_location: '',
		current_location: '',
		name: '',
	});

	const { handleSubmit, control, formState, watch, reset } = useForm({
		mode: 'onSubmit',
	});

	const { errors } = formState;

	const updateFromEntity = (entity) => {
		const keys = Object.keys(formValues);
		const newFormValues = {};

		keys.forEach((key) => {
			newFormValues[key] = Object.hasOwnProperty.call(entity, key)
				? entity[key]
				: formValues[key];
		});

		setFormValues(newFormValues);
	};

	const handleEdit = () => {
		setEditingMode(true);
		setResetValues(watch());
	};

	const handleCancel = () => {
		setEditingMode(false);
		reset(resetValues);
		console.debug(resetValues);
	};

	const handleSave = () => {
		return new Promise((resolve, reject) => {
			const isValid = async (data) => {
				console.debug(data);
				setEditingMode(false);
				await performSave(data);

				updateFromEntity(data);
				resolve(data);
			};

			const isErrored = (data) => {
				reject();
			};

			handleSubmit(isValid, isErrored)();
		});
	};

	const getGenderName = () => {
		let name = '-';

		if (formValues?.gender?.id === formValues?.gender_id)
			name = formValues?.gender?.name;
		else if (Array.isArray(genders)) {
			const found = genders.find(
				({ value }) => value === formValues?.gender_id,
			);
			if (found) name = found?.label;
		}
		return name;
	};

	const fieldButtons = () => {
		return [
			<IconButton
				icon={['fad', 'globe-europe']}
				size={16}
				style={Styles.privacyButtonIcon}
				containerStyle={Styles.privacyButton}
				onPress={() => {}}
			/>,
		];
	};

	useEffect(() => {
		if (profile) updateFromEntity(profile);
		setEditingMode(false);
	}, [profile]);

	return (
		<ScrollView style={{ flex: 1 }}>
			<ProfileHeader
				isEditable={isMine}
				editingMode={editingMode}
				coverPicture={profile?.cover_picture}
				profilePicture={profile?.picture}
				onCancel={handleCancel}
				onEdit={handleEdit}
				onSave={handleSave}
			/>

			<View style={{ paddingHorizontal: 14, marginTop: 12 }}>
				<FieldWrapper
					value={formValues?.nickname}
					editingMode={editingMode}
					containerStyle={Styles.nicknameTaglineContainer}
					valueStyle={Styles.nickname}
					error={errors?.nickname?.message}>
					<FormTextField
						name="nickname"
						control={control}
						rules={{
							required: {
								value: true,
								message:
									"You need a nickname, they're important",
							},
							minLength: {
								value: 4,
								message: 'What is this? a nickname for ants?',
							},
							maxLength: {
								value: 32,
								message:
									'A little bit smaller, like a baby hippo',
							},
						}}
						placeholder="We need a nickname, make it sexy."
						defaultValue={profile?.nickname}
						value={formValues?.nickname}
						enabled
						style={Styles.nickname}
					/>
				</FieldWrapper>
				<FieldWrapper
					editingMode={editingMode}
					containerStyle={Styles.nicknameTaglineContainer}
					value={formValues?.tagline || '-'}
					valueStyle={Styles.tagline}>
					<FormTextField
						name="tagline"
						control={control}
						placeholder="How about a tagline?"
						value={formValues?.tagline}
						defaultValue={profile?.tagline}
						enabled
						style={Styles.tagline}
					/>
				</FieldWrapper>
				<FieldWrapper
					icon={['fal', 'gift']}
					label={editingMode ? 'When were you born?' : 'Age'}
					value={formValues?.age}
					containerStyle={Styles.fieldContainerStyle}
					editingMode={editingMode}
					buttons={fieldButtons('age')}>
					<FormDateTimePicker
						name="date_of_birth"
						control={control}
						icon={['fal', 'calendar-star']}
						placeholder="I need a date of birth"
						initialValue={profile?.date_of_birth}
						value={formValues?.date_of_birth}
						enabled
						editable
						textValue={profile?.age}
					/>
				</FieldWrapper>
				<FieldWrapper
					icon={['fal', 'genderless']}
					label={editingMode ? 'How do you identify?' : 'Gender'}
					value={getGenderName()}
					containerStyle={Styles.fieldContainerStyle}
					editingMode={editingMode}
					buttons={fieldButtons('gender')}>
					<FormPicker
						name="gender_id"
						control={control}
						placeholder="How do you identify?"
						enabled
						defaultValue={profile?.gender_id}
						value={formValues?.gender_id}
						editable
						options={genders}
					/>
				</FieldWrapper>
				<FieldWrapper
					icon={['fal', 'compass']}
					label={editingMode ? 'Where were you born?' : 'From'}
					value={formValues?.from_location || '-'}
					containerStyle={Styles.fieldContainerStyle}
					editingMode={editingMode}
					buttons={fieldButtons('from_location')}>
					<FormTextField
						name="from_location"
						control={control}
						value={formValues?.from_location}
						defaultValue={profile?.from_location}
						placeholder="Where did you come from?"
						enabled
					/>
				</FieldWrapper>
				<FieldWrapper
					icon={['fal', 'map-marker-alt']}
					label={editingMode ? 'Where do you exist?' : 'Based in'}
					value={formValues?.current_location || '-'}
					containerStyle={Styles.fieldContainerStyle}
					editingMode={editingMode}
					buttons={fieldButtons('current_location')}>
					<FormTextField
						placeholder="Where did you go?"
						name="current_location"
						control={control}
						value={formValues?.current_location}
						defaultValue={profile?.current_location}
						enabled
					/>
				</FieldWrapper>
				<FieldWrapper
					icon={['fal', 'user-check']}
					label={editingMode ? 'What should we call you?' : 'Call me'}
					value={formValues?.name || '-'}
					containerStyle={Styles.fieldContainerStyle}
					editingMode={editingMode}
					buttons={fieldButtons('name')}>
					<FormTextField
						placeholder="Cotton eyed joe?"
						name="name"
						control={control}
						value={formValues?.name}
						defaultValue={profile?.name}
						enabled
					/>
				</FieldWrapper>
			</View>
		</ScrollView>
	);
};

ProfileForm.propTypes = {
	genders: PropTypes.array,
	profile: PropTypes.object,
	loading: PropTypes.bool,
	performSave: PropTypes.func,
	isMine: PropTypes.bool,
};

ProfileForm.defaultProps = {
	genders: [],
	profile: {},
	loading: false,
	performSave: () => {},
	isMine: false,
};

export default ProfileForm;
