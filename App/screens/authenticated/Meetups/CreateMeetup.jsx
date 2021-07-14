import React, { useState, useEffect } from 'react';
import {
	Dimensions,
	Text,
	View,
	ImageBackground,
	StyleSheet,
	ScrollView,
	Platform,
	ActivityIndicator,
	KeyboardAvoidingView,
} from 'react-native';
import { useForm } from 'react-hook-form';

import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';
import { useApp } from '../../../context/AppContext';
import { useAPI } from '../../../context/APIContext';

import ActivityButton from '../../../components/ActivityButton/ActivityButton';
import FormTextField from '../../../components/Forms/TextField/FormTextField';
import FieldWrapper from '../../../components/FieldWrapper/FieldWrapper';
import FormDateTimePicker from '../../../components/Forms/DateTimePicker/FormDateTimePicker';
import FormPicker from '../../../components/Forms/Picker/FormPicker';

import Helpers from '../../../sosa/Helpers';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;
const communityId = 'sosa';

const Styles = StyleSheet.create({
	innerContainer: { flex: 1, margin: 16 },

	keyboardView: { flex: 1, backgroundColor: '#2D2F30' },

	container: {
		backgroundColor: '#2D2F30',
		flex: 1,
	},

	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 4,
		paddingBottom: Platform.OS === 'ios' ? 32 : 24,
		marginTop: 8,
	},

	viewButtonContainer: {
		flex: 1,
		justifyContent: 'flex-start',
	},

	viewButtonText: { textAlign: 'center', color: '#fff' },

	imageOverlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.30)',
		position: 'absolute',
		top: 0,
		left: 0,
		height: imageHeight,
		width: imageWidth,
	},

	imageContainer: { height: imageHeight, width: imageWidth },

	imageBottomContainer: {
		flex: 1,
		justifyContent: 'flex-end',
	},

	imageBottomInnerContainer: {
		margin: 4,
		marginRight: 10,
		height: 40,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},

	image: {
		height: imageHeight,
		width: imageWidth,
		flex: 1,
	},

	dash: {
		flex: 0,
		color: '#fff',
		fontSize: 24,
		textAlignVertical: 'center',
		marginHorizontal: 8,
	},

	resetButton: {
		backgroundColor: 'rgba(125, 125, 200, 0.70)',
		paddingHorizontal: 24,
		borderRadius: 16,
		marginRight: 8,
	},

	changeButton: {
		backgroundColor: 'rgba(0, 0, 0, 0.70)',
		paddingHorizontal: 28,
		borderRadius: 16,
	},

	uploadingIndicator: {
		alignSelf: 'center',
		flex: 1,
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		width: '100%',
	},

	fieldsContainer: { flex: 1, paddingHorizontal: 8, marginTop: 8 },
});

const Wrapper = ({ children }) => {
	if (Platform.OS !== 'ios') return <>{children}</>;

	return (
		<KeyboardAvoidingView
			style={Styles.keyboardView}
			behavior="padding"
			keyboardVerticalOffset={Math.floor((dimensions.height / 100) * 9)}>
			{children}
		</KeyboardAvoidingView>
	);
};

const CreateMeetupScreen = ({ navigation }) => {
	const { setMenuOptions, popMenuStack } = useAuthenticatedNavigation();
	const {
		services: { meetups: meetupService, general: generalService },
	} = useAPI();
	const { modals } = useApp();

	const [formValues, setFormValues] = useState({});

	const form = useForm({
		mode: 'onChange',
	});

	const { control, formState, watch, reset, handleSubmit } = form;
	const { errors, isValid, dirtyFields } = formState;

	const [previousImage, setPreviousImage] = useState('');
	const [imageURI, setImageURI] = useState('');
	const [saving, setSaving] = useState(false);
	const [image, setImage] = useState('');
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		setMenuOptions({
			showLeft: true,
			showRight: false,
			leftMode: 'back',
			title: 'Create Meetup',
		});
	}, []);

	const handleSave = () => {
		setSaving(true);

		const isValid = async (data) => {
			const { title, description, date, start, end, type } = data;

			try {
				const meetup = await meetupService.create(
					communityId,
					title,
					description,
					type,
					new Date(`${date}T${start}`),
					new Date(`${date}T${end}`),
					{ image: imageURI },
				);
				popMenuStack();
				navigation?.replace('Meetup', { id: meetup.id });
			} catch (e) {
				if (Array.isArray(errors)) {
					errors.forEach(({ code, message, field }) => {
						if (field) {
							if (field === 'start' || field === 'end') {
								field = 'date';
							}
							//updateErrors(field, message || code);
						}
					});
				}
				console.debug('errors', errors);
				setSaving(false);
			}
		};

		const isErrored = (data) => {
			setSaving(false);
		};

		handleSubmit(isValid, isErrored)();
	};

	const uploadPicture = async () => {
		const options = {
			handleUpload: (file) => {
				setUploading(true);
				return generalService.handleUpload(communityId, file);
			},
			beforeUpload: async ({ mime, data }) => {
				setPreviousImage(image);
				setImage(`data:${mime};base64,${data}`);
			},
			cropperToolbarTitle: 'Crop your picture',
			cropping: true,
			croppingHeight: 1080,
			croppingWidth: 1920,
		};

		try {
			const { uris } = await Helpers.uploadFile(options);
			if (Array.isArray(uris)) setImageURI(uris.pop());
		} catch (e) {
			setImage(previousImage);
			const message = Array.isArray(e) ? e.pop()?.message : e?.message;
			if (message !== 'user_cancelled') {
				modals?.create('Error uploading image', message);
			}
		} finally {
			setUploading(false);
		}
	};

	const defaultImage = require('../../../assets/choose_meetup_image_v2.jpg');

	const buttons = () => {
		const resetButton = image ? (
			<ActivityButton
				text="Reset"
				style={Styles.resetButton}
				onPress={() => setImage('')}
			/>
		) : null;
		if (!uploading) {
			return (
				<View style={Styles.imageBottomContainer}>
					<View style={Styles.imageBottomInnerContainer}>
						{resetButton}
						<ActivityButton
							text="Change"
							style={Styles.changeButton}
							onPress={uploadPicture}
						/>
					</View>
				</View>
			);
		}
	};

	return (
		<View style={Styles.container}>
			<Wrapper>
				<ScrollView>
					<View style={Styles.imageContainer}>
						<ImageBackground
							source={image ? { uri: image } : defaultImage}
							style={Styles.image}>
							{uploading && (
								<ActivityIndicator
									color="#fff"
									size="large"
									style={Styles.uploadingIndicator}
								/>
							)}
							<View style={Styles.imageOverlay} />
							{buttons()}
						</ImageBackground>
					</View>

					<View style={Styles.fieldsContainer}>
						<FieldWrapper
							label="What's it called?"
							editingMode
							error={errors?.title?.message}>
							<FormTextField
								name="title"
								control={control}
								value={formValues?.title}
								defaultValue=""
								placeholder="Title"
								enabled
								minLength={16}
								maxLength={250}
								rules={{
									required: { value: true },
									minLength: { value: 16 },
									maxLength: { value: 250 },
								}}
							/>
						</FieldWrapper>

						<FieldWrapper
							icon={['fal', 'calendar-week']}
							label="When is it?"
							editingMode
							error={errors?.date?.message}>
							<FormDateTimePicker
								name="date"
								control={control}
								placeholder="Date"
								initialValue={Helpers.dateToString(
									new Date(),
									'date',
								)}
								value={formValues?.date}
								enabled
								editable
								textValue={formValues?.date}
							/>
						</FieldWrapper>

						<View
							style={{ flexDirection: 'row', marginVertical: 4 }}>
							<View style={{ flex: 1 }}>
								<FieldWrapper
									icon={['fal', 'clock']}
									editingMode>
									<FormDateTimePicker
										name="start"
										control={control}
										placeholder="When does it start?"
										initialValue="19:00"
										value={formValues?.start}
										enabled
										editable
										forTime
										textValue={formValues?.start}
									/>
								</FieldWrapper>
							</View>
							<Text style={Styles.dash}>-</Text>
							<View style={{ flex: 1 }}>
								<FieldWrapper
									icon={['fal', 'clock']}
									editingMode>
									<FormDateTimePicker
										name="end"
										control={control}
										placeholder="When does it end?"
										initialValue="21:00"
										textValue={formValues?.end}
										value={formValues?.end}
										enabled
										editable
										forTime
									/>
								</FieldWrapper>
							</View>
						</View>

						<FieldWrapper
							icon={['fal', 'genderless']}
							label="Where?"
							editingMode
							error={errors?.type?.message}>
							<FormPicker
								name="type"
								control={control}
								placeholder="Virtual or IRL?"
								enabled
								defaultValue="virtual"
								value={formValues?.type}
								editable
								options={[
									{ label: "It's Online!", value: 'virtual' },
									{
										label: "It's out there in the real world",
										value: 'real',
									},
								]}
							/>
						</FieldWrapper>

						<FieldWrapper
							editingMode
							error={errors?.description?.message}>
							<FormTextField
								name="description"
								multiline
								control={control}
								value={formValues?.description}
								defaultValue=""
								placeholder="Tell people a bit more about this meetup"
								enabled
								minLength={16}
								maxLength={0}
								rules={{
									required: { value: true },
									minLength: { value: 16 },
								}}
							/>
						</FieldWrapper>
					</View>
				</ScrollView>
			</Wrapper>
			<View style={Styles.buttonContainer}>
				<ActivityButton
					text="Create"
					style={{ flex: 1 }}
					onPress={handleSave}
					showActivity={saving}
					disabled={!isValid}
				/>
			</View>
		</View>
	);
};

export default CreateMeetupScreen;
