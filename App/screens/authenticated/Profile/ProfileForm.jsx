import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import ProfileHeader from '../../../components/Profile/ProfileHeader/ProfileHeader';
import FieldWrapper from '../../../components/FieldWrapper/FieldWrapper';
import FormDateTimePicker from '../../../components/Forms/DateTimePicker/FormDateTimePicker';
import FormPicker from '../../../components/Forms/Picker/FormPicker';
import FormTextField from '../../../components/Forms/TextField/FormTextField';

import IconButton from '../../../components/IconButton';
import { handleSave, updateFromEntity } from './MyProfileHelpers';
import PrivacyPicker from '../../../components/PrivacyPicker/PrivacyPicker';

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

const ProfileForm = forwardRef(
	(
		{
			genders,
			profile,
			loading,
			onSave,
			onCancel,
			changeProfilePicture,
			changeCoverPicture,
			isMine,
			isEditable,
			useCustomSaveButton,
			hideFields,
			scrollView,
			...props
		},
		ref,
	) => {
		console.debug(props);
		const [editingMode, setEditingMode] = useState(isEditable);
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

		const [privacyPopup, setPrivacyPopup] = useState(null);
		const [fieldContainerLayout, setFieldContainerLayout] = useState(null);

		const form = useForm({
			mode: 'onSubmit',
		});

		const { control, formState, watch, reset } = form;
		const { errors } = formState;

		const handleEdit = () => {
			setEditingMode(true);
			setResetValues(watch());
		};

		const handleCancel = () => {
			setEditingMode(false);
			reset(resetValues);
			onCancel(resetValues);
		};

		useImperativeHandle(ref, () => ({
			handleSave: () =>
				handleSave(form, onSave, formValues, setFormValues),
		}));

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

		const fieldButtons = (field) => {
			return (ref, layout) => {
				return [
					<IconButton
						icon={['fad', 'globe-europe']}
						size={16}
						style={Styles.privacyButtonIcon}
						containerStyle={Styles.privacyButton}
						onPress={() => {
							const maxHeight =
								fieldContainerLayout?.y +
								fieldContainerLayout?.height;
							let top = Math.floor(
								layout?.height +
									layout?.y +
									fieldContainerLayout?.y,
							);

							if (top + 240 >= maxHeight) top = layout?.y;

							scrollView?.scrollTo({
								y: top - 240,
								x: 0,
								animated: true,
							});

							setPrivacyPopup(
								<TouchableWithoutFeedback
									onPress={() => setPrivacyPopup(null)}>
									<View
										style={{
											position: 'absolute',
											width: '100%',
											top: 0,
											left: 0,
											bottom: 0,
											zIndex: 1,
											backgroundColor:
												'rgba(0, 0, 0, 0.80)',
										}}>
										<View
											style={{
												position: 'absolute',
												width: '100%',
												top,
												left: layout?.width - 276,
											}}>
											<PrivacyPicker visible />
										</View>
									</View>
								</TouchableWithoutFeedback>,
							);
						}}
					/>,
				];
			};
		};

		useEffect(() => {
			if (profile)
				updateFromEntity(profile, formValues, setFormValues, reset);
			if (!useCustomSaveButton) setEditingMode(false);
		}, [profile]);

		useEffect(() => {
			setEditingMode(isEditable);
		}, [isEditable]);

		return (
			<View style={{ flex: 1 }}>
				{privacyPopup}

				<ProfileHeader
					isEditable={isMine}
					editingMode={editingMode}
					coverPicture={profile?.cover_picture}
					profilePicture={profile?.picture}
					onCancel={handleCancel}
					onEdit={handleEdit}
					onSave={async () => {
						const data = await handleSave(
							form,
							onSave,
							formValues,
							setFormValues,
						);
						if (useCustomSaveButton) setEditingMode(false);
						return data;
					}}
					changeCoverPicture={changeCoverPicture}
					changeProfilePicture={changeProfilePicture}
					hideSaveCancel={useCustomSaveButton}
				/>

				<View
					style={{ paddingHorizontal: 14, marginTop: 12 }}
					onLayout={({ nativeEvent }) => {
						setFieldContainerLayout(nativeEvent?.layout);
					}}>
					{!hideFields.includes('nickname') && (
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
										message:
											'What is this? a nickname for ants?',
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
					)}

					{!hideFields.includes('tagline') && (
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
					)}

					{!hideFields.includes('date_of_birth') && (
						<FieldWrapper
							icon={['fal', 'gift']}
							label={editingMode ? 'When were you born?' : 'Age'}
							value={formValues?.age || '-'}
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
								textValue={profile?.age || '-'}
							/>
						</FieldWrapper>
					)}

					{!hideFields.includes('gender') && (
						<FieldWrapper
							icon={['fal', 'genderless']}
							label={
								editingMode ? 'How do you identify?' : 'Gender'
							}
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
					)}

					{!hideFields.includes('from_location') && (
						<FieldWrapper
							icon={['fal', 'compass']}
							label={
								editingMode ? 'Where were you born?' : 'From'
							}
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
					)}

					{!hideFields.includes('current_location') && (
						<FieldWrapper
							icon={['fal', 'map-marker-alt']}
							label={
								editingMode ? 'Where are you now?' : 'Based in'
							}
							value={formValues?.current_location || '-'}
							containerStyle={Styles.fieldContainerStyle}
							editingMode={editingMode}
							buttons={fieldButtons('current_location')}>
							<FormTextField
								placeholder="Where do you live?"
								name="current_location"
								control={control}
								value={formValues?.current_location}
								defaultValue={profile?.current_location}
								enabled
							/>
						</FieldWrapper>
					)}

					{!hideFields.includes('name') && (
						<FieldWrapper
							icon={['fal', 'user-check']}
							label={
								editingMode
									? 'What should we call you?'
									: 'Call me'
							}
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
					)}
				</View>
			</View>
		);
	},
);

ProfileForm.propTypes = {
	genders: PropTypes.array,
	profile: PropTypes.object,
	loading: PropTypes.bool,
	onSave: PropTypes.func,
	onCancel: PropTypes.func,
	isMine: PropTypes.bool,
	useCustomSaveButton: PropTypes.bool,
	hideFields: PropTypes.arrayOf('string'),
};

ProfileForm.defaultProps = {
	genders: [],
	profile: {},
	loading: false,
	onSave: () => {},
	onCancel: () => {},
	isMine: false,
	useCustomSaveButton: false,
	hideFields: [],
};

export default ProfileForm;
