import React, { useState, useEffect } from 'react';
import {
	Dimensions,
	Text,
	View,
	ImageBackground,
	StyleSheet,
	ScrollView,
	FlatList,
	Platform,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
} from 'react-native';

import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';
import { useApp } from '../../../context/AppContext';
import { useAPI } from '../../../context/APIContext';

import ActivityButton from '../../../components/ActivityButton';
import TextField from '../../../components/TextField';

import Helpers from '../../../sosa/Helpers';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

const Styles = StyleSheet.create({
	container: { flex: 1, margin: 16 },

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

	image: {
		width: '100%',
		height: 175,
		flex: 1,
	},

	imageOverlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.30)',
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		width: '100%',
	},

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
});

const Wrapper = ({ children }) => {
	if (Platform.OS !== 'ios') {
		return <>{children}</>;
	}
	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: '#121111' }}
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

	const [previousImage, setPreviousImage] = useState('');
	const [imageURI, setImageURI] = useState('');
	const [saving, setSaving] = useState(false);
	const [image, setImage] = useState('');
	const [title, setTitle] = useState('This is a test meetup');
	const [date, setDate] = useState(Helpers.dateToString(new Date(), 'date'));
	const [start, setStart] = useState('19:00');
	const [end, setEnd] = useState('21:00');
	const [description, setDescription] = useState(
		'This is a test description to make sure it works',
	);
	const [type, setType] = useState('virtual');
	const [uploading, setUploading] = useState(false);
	const [isValid, setIsValid] = useState({
		title: false,
		date: true,
		description: false,
		type: true,
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		setMenuOptions({
			showLeft: true,
			showRight: false,
			leftMode: 'back',
			title: 'Create Meetup',
		});
	}, []);

	const updateIsValid = (field, valid) => {
		const newIsValid = { ...isValid };
		console.debug(field, newIsValid);
		newIsValid[field] = valid;
		setIsValid(newIsValid);
	};

	const checkIsValid = () => {
		return !Object.values(isValid).includes(false);
	};

	const updateErrors = (field, value) => {
		const errors = { ...errors };
		errors[field] = value;

		setErrors(errors);
	};

	const resetErrors = () =>
		setErrors({ name: '', date: '', description: '', type: '' });

	const save = () => {
		resetErrors();
		setSaving(true);

		meetupService
			.create(
				'sosa',
				title,
				description,
				type,
				new Date(`${date}T${start}`),
				new Date(`${date}T${end}`),
				{ image: imageURI },
			)
			.then((meetup) => {
				popMenuStack();
				debugger;
				navigation?.replace('Meetup', { id: meetup.id });
			})
			.catch((errors) => {
				if (Array.isArray(errors)) {
					errors.forEach(({ code, message, field }) => {
						if (field) {
							if (field === 'start' || field === 'end') {
								field = 'date';
							}
							updateErrors(field, message || code);
						}
					});
				}
				console.debug('errors', errors);
			})
			.finally(() => setSaving(false));
	};

	const uploadPicture = () => {
		Helpers.uploadFile(
			modals?.create,
			generalService,
			'sosa',
			(uploading) => setUploading(uploading),
			({ uri, fileName, type, data }) => {
				setPreviousImage(image);
				setImage(`data:${type};base64,${data}`);
			},
		)
			.then(({ uris, tag, uuid }) => {
				if (Array.isArray(uris)) {
					setImageURI(uris.pop());
				}
			})
			.catch((error) => setImage(previousImage));
	};

	let source = {};
	if (image) {
		source = { uri: image };
	} else {
		source = require('../../../assets/choose_meetup_image_v2.jpg');
	}

	const buttons = () => {
		const resetButton = image ? (
			<ActivityButton
				text="Reset"
				style={{
					backgroundColor: 'rgba(125, 125, 200, 0.70)',
					paddingHorizontal: 24,
					borderRadius: 16,
					marginRight: 8,
				}}
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
							style={{
								backgroundColor: 'rgba(0, 0, 0, 0.70)',
								paddingHorizontal: 28,
								borderRadius: 16,
							}}
							onPress={uploadPicture}
						/>
					</View>
				</View>
			);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#121111' }}>
			<Wrapper>
				<ScrollView
					style={{ flex: 1 }}
					scrollEnabled={true}
					contentContainerStyle={{ flexGrow: 1 }}>
					<View style={{ flex: 0 }}>
						<View
							style={{ height: imageHeight, width: imageWidth }}>
							<ImageBackground
								source={source}
								style={{
									height: imageHeight,
									width: imageWidth,
									flex: 1,
								}}>
								{uploading && (
									<ActivityIndicator
										color="#fff"
										size="large"
										style={{
											alignSelf: 'center',
											flex: 1,
											position: 'absolute',
											top: 0,
											left: 0,
											height: '100%',
											width: '100%',
										}}
									/>
								)}
								<View
									style={[
										Styles.imageOverlay,
										{
											height: imageHeight,
											width: imageWidth,
										},
									]}
								/>
								{buttons()}
							</ImageBackground>
						</View>
					</View>
					<View
						style={{ flex: 1, paddingHorizontal: 4, marginTop: 8 }}>
						<TextField
							error={errors?.title}
							placeholder="What's it called?"
							value={title}
							onChangeText={(data) => setTitle(data)}
							style={{ flex: 1 }}
							minLength={16}
							maxLength={250}
							setIsValid={(isValid) =>
								updateIsValid('title', isValid)
							}
						/>

						<TextField
							label="When is it?"
							icon={['fal', 'calendar-week']}
							error={errors?.date}
							placeholder="Date"
							type="date"
							value={date}
							onChangeText={(data, date) => setDate(data)}
						/>
						<View
							style={{ flexDirection: 'row', marginVertical: 4 }}>
							<View style={{ flex: 1 }}>
								<TextField
									icon={['fal', 'clock']}
									error={errors?.date}
									errorBorderOnly
									placeholder="When does it start?"
									type="time"
									value={start}
									onChangeText={(data, date) =>
										setStart(data)
									}
								/>
							</View>
							<Text
								style={{
									flex: 0,
									color: '#fff',
									fontSize: 24,
									textAlignVertical: 'center',
									marginHorizontal: 8,
								}}>
								-
							</Text>
							<View style={{ flex: 1 }}>
								<TextField
									icon={['fal', 'clock']}
									error={errors?.date}
									errorBorderOnly
									placeholder="When does it end?"
									type="time"
									value={end}
									onChangeText={(data) => setEnd(data)}
								/>
							</View>
						</View>

						<TextField
							label="What's the plan?"
							icon={['fal', 'compass']}
							error={errors.type}
							placeholder="Virtual or IRL?"
							value={type}
							type="picker"
							onChangeText={(value) => setType(value)}
							pickerOptions={[
								{ label: "It's Online!", value: 'virtual' },
								{
									label: "It's out there in the real world",
									value: 'real',
								},
							]}
						/>

						<TextField
							type="multiline"
							placeholder="Description"
							value={description}
							error={errors.description}
							onChangeText={(data) => setDescription(data)}
							multiline={true}
							minLength={16}
							maxLength={0}
							setIsValid={(isValid) =>
								updateIsValid('description', isValid)
							}
							containerStyle={{ marginTop: 8 }}
						/>
					</View>
				</ScrollView>
			</Wrapper>
			<View style={Styles.buttonContainer}>
				<View style={{ flex: 1 }}>
					<ActivityButton
						text="Create"
						style={{}}
						onPress={save}
						showActivity={saving}
						disabled={!checkIsValid()}
					/>
				</View>
			</View>
		</View>
	);
};

export default CreateMeetupScreen;
