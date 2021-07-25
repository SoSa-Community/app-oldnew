import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { View, StyleSheet } from 'react-native';

import { useForm } from 'react-hook-form';

import ProfileHeader from '../../../components/Profile/ProfileHeader/ProfileHeader';
import FieldWrapper from '../../../components/FieldWrapper/FieldWrapper';

import FormPicker from '../../../components/Forms/Picker/FormPicker';
import FormTextField from '../../../components/Forms/TextField/FormTextField';

import PropTypes from 'prop-types';
import IconButton from '../../../components/IconButton';
import { handleSave, updateFromEntity } from './MyProfileHelpers';

const Styles = StyleSheet.create({
	tagline: { fontSize: 18, textAlign: 'center' },
	fieldContainerStyle: {},
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

const WelcomeForm = forwardRef(
	(
		{
			genders,
			profile,
			loading,
			onSave,
			onCancel,
			changeProfilePicture,
			changeCoverPicture,
			isEditable,
		},
		ref,
	) => {
		const [editingMode, setEditingMode] = useState(isEditable);
		const [resetValues, setResetValues] = useState({});
		const [formValues, setFormValues] = useState({
			nickname: '',
			gender_id: '',
			current_location: '',
		});

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

		const fieldButtons = () => {
			return [];
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
			if (profile)
				updateFromEntity(profile, formValues, setFormValues, reset);
		}, [profile]);

		useEffect(() => {
			setEditingMode(isEditable);
		}, [isEditable]);

		return (
			<View style={{ flex: 1 }}>
				<ProfileHeader
					isEditable
					editingMode={editingMode}
					coverPicture={profile?.cover_picture}
					profilePicture={profile?.picture}
					onCancel={handleCancel}
					onEdit={handleEdit}
					onSave={() => {}}
					changeCoverPicture={changeCoverPicture}
					changeProfilePicture={changeProfilePicture}
					hideSaveCancel={true}
				/>

				<View style={{ paddingHorizontal: 14, marginTop: 12 }}>
					<FieldWrapper
						icon={['fal', 'mask']}
						value={formValues?.nickname}
						editingMode={editingMode}
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

					<FieldWrapper
						icon={['fal', 'envelope']}
						containerStyle={Styles.fieldContainerStyle}
						editingMode={editingMode}
						buttons={fieldButtons('current_location')}>
						<FormTextField
							placeholder="Email"
							name="email"
							control={control}
							value={formValues?.email}
							defaultValue={profile?.email}
							enabled
						/>
					</FieldWrapper>

					<FieldWrapper
						icon={['fal', 'map-marker-alt']}
						containerStyle={Styles.fieldContainerStyle}
						editingMode={editingMode}
						buttons={fieldButtons('current_location')}>
						<FormTextField
							placeholder="Where are you?"
							name="current_location"
							control={control}
							value={formValues?.current_location}
							defaultValue={profile?.current_location}
							enabled
						/>
					</FieldWrapper>

					<FieldWrapper
						icon={['fal', 'genderless']}
						label={editingMode ? 'How do you identify?' : 'Gender'}
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
				</View>
			</View>
		);
	},
);

WelcomeForm.propTypes = {
	genders: PropTypes.array,
	profile: PropTypes.object,
	loading: PropTypes.bool,
	onSave: PropTypes.func,
	onCancel: PropTypes.func,
};

WelcomeForm.defaultProps = {
	genders: [],
	profile: {},
	loading: false,
	onSave: () => {},
	onCancel: () => {},
};

export default WelcomeForm;
