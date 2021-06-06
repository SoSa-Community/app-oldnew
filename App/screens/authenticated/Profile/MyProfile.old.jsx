import React, { useState, useEffect, useRef } from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableHighlight,
	ImageBackground,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import { useAPI } from '../../../context/APIContext';
import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';

import ProfilePicture from '../../../components/ProfilePicture/ProfilePicture';
import TextField from '../../../components/TextField';
import Picker from '../../../components/Picker/Picker';
import DateTimePicker from '../../../components/DateTimePicker/DateTimePicker';

const Styles = StyleSheet.create({
	topContainer: {
		flex: 0,
		alignItems: 'center',
		marginVertical: '5%',
	},

	username: {
		fontSize: 22,
		marginTop: 6,
	},

	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.80)',
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 1,
		height: '200%',
		width: '100%',
	},

	nicknameContainer: {
		paddingHorizontal: 42,
		marginVertical: 8,
	},

	tagContainer: {
		paddingHorizontal: 42,
	},

	nickname: {
		color: '#fff',
		fontSize: 26,
		textAlign: 'center',
		flexShrink: 1,
	},

	tag: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
		flexShrink: 1,
	},

	label: {
		color: '#f96854',
		fontWeight: '600',
		marginBottom: 8,
		fontSize: 18,
	},

	demographicsValue: {
		fontSize: 18,
		color: '#fff',
		fontWeight: '600',
	},

	changeCoverButton: {
		borderWidth: 1,
		borderColor: '#fff',
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 8,
		position: 'absolute',
		top: -15,
		right: 10,
	},

	changeCoverButtonText: {
		color: '#fff',
		fontSize: 12,
	},
});

const MyProfileScreen = ({ navigation }) => {
	const nicknameRef = useRef();
	const taglineRef = useRef();
	const genderPickerRef = useRef();

	const {
		setHeaderIcons,
		removeHeaderIcon,
		setMenuOptions,
	} = useAuthenticatedNavigation();

	const {
		services: { profiles: profileService },
	} = useAPI();

	const [genders, setGenders] = useState([]);
	const [profile, setProfile] = useState(null);

	const [dateOfBirth, setDateOfBirth] = useState('');

	const [editingMode, setEditingMode] = useState(false);

	const refreshProfile = () => {
		setGenders([]);

		profileService
			.mine(true)
			.then(({ profile, options, widgets }) => {
				if (options) {
					const { genders } = options;
					if (Array.isArray(genders) && genders.length) {
						const newOptions = genders.map(({ id, name }) => ({
							label: name,
							value: id,
						}));
						setGenders(newOptions);
					}
				}
				console.debug(profile);
				setProfile(profile);
			})
			.catch((error) => console.debug(error));
	};

	function saveProfile() {
		const params = {};
		const nickname = nicknameRef?.current?.value;
		const tagline = taglineRef?.current?.value;
		const selectedGenderId = genderPickerRef?.current?.value;

		if (nickname !== profile?.nickname) {
			params.nickname = nickname;
		}
		if (tagline !== profile?.tagline) {
			params.tagline = tagline;
		}

		if (dateOfBirth !== profile?.date_of_birth) {
			params.date_of_birth = dateOfBirth;
		}
		if (selectedGenderId !== profile?.gender_id) {
			params.gender_id = selectedGenderId;
		}

		console.debug(params);
		if (Object.keys(params).length) {
			profileService.save(params).then((updatedProfile) => {
				setProfile(updatedProfile);
			});
		}
	}

	const reset = () => {
		console.debug('reset');
		if (profile) {
			const { nickname, tagline, gender, date_of_birth } = profile;

			genderPickerRef?.current?.reset();
			nicknameRef?.current?.reset();
			taglineRef?.current?.reset();

			const date = new Date(Date.parse(date_of_birth));
			if (
				Object.prototype.toString.call(date) === '[object Date]' &&
				!isNaN(date.getTime())
			) {
				setDateOfBirth(`${moment(date).format('YYYY-MM-DD')}`);
			}
		}
		setEditingMode(false);
	};

	useFocusEffect(
		React.useCallback(() => {
			let isActive = true;
			if (isActive) {
				setEditingMode(false);
				setMenuOptions({ leftMode: 'back', title: 'My Profile' });
				refreshProfile();
			}

			return () => {
				if (removeHeaderIcon) {
					removeHeaderIcon('refresh_profile');
					removeHeaderIcon('edit_profile');
				}
				isActive = false;
			};
		}, []),
	);

	useEffect(() => reset(), [profile]);

	useEffect(() => {
		if (!editingMode) {
			setHeaderIcons([
				{
					id: 'edit_profile',
					icon: ['fal', 'pencil'],
					onPress: () => setEditingMode(true),
				},
				{
					id: 'refresh_profile',
					icon: ['fal', 'sync-alt'],
					onPress: refreshProfile,
				},
			]);
		} else {
			setHeaderIcons([
				{
					id: 'save_edit_profile',
					text: 'Save',
					onPress: function () {
						saveProfile();
					},
				},
				{
					id: 'cancel_edit_profile',
					text: 'Cancel',
					onPress: () => reset(),
				},
			]);
		}
	}, [editingMode]);

	const top = () => {
		const content = () => (
			<View style={{ zIndex: 100 }}>
				{editingMode && (
					<TouchableHighlight style={Styles.changeCoverButton}>
						<Text style={Styles.changeCoverButtonText}>
							Change Cover
						</Text>
					</TouchableHighlight>
				)}
				<View style={{ alignItems: 'center' }}>
					<View style={{ marginBottom: 10 }}>
						<ProfilePicture
							picture={profile?.picture}
							size="larger"
							editable={editingMode}
						/>
					</View>
				</View>

				<View style={Styles.nicknameContainer}>
					<TextField
						ref={nicknameRef}
						placeholder="Nickname"
						initialValue={profile?.nickname}
						value={profile?.nickname}
						editable={editingMode}
						textStyle={Styles.nickname}
					/>
				</View>

				<View style={Styles.tagContainer}>
					<TextField
						ref={taglineRef}
						placeholder="Tagline"
						initialValue={profile?.tagline}
						value={profile?.tagline}
						editable={editingMode}
						textStyle={Styles.tag}
					/>
				</View>
			</View>
		);

		if (profile?.cover_picture) {
			return (
				<ImageBackground
					source={{ uri: profile?.cover_picture }}
					style={{
						overflow: 'hidden',
						resizeMode: 'contain',
						paddingVertical: 24,
					}}>
					{content()}
					<View style={Styles.overlay} />
				</ImageBackground>
			);
		} else {
			return (
				<View style={{ alignItems: 'center', marginVertical: 24 }}>
					{content()}
				</View>
			);
		}
	};

	const gender = () => {
		return (
			<View style={{ marginBottom: 8 }}>
				<Picker
					ref={genderPickerRef}
					label="How do you identify?"
					labelStyle={Styles.label}
					icon={['fal', 'genderless']}
					placeholder="Gender Identity"
					enabled
					options={genders}
					initialValue={profile?.gender?.id}
					value={profile?.gender?.id}
					type="picker"
					editable={editingMode}
					textStyle={{ color: '#fff', fontSize: 16 }}
				/>
			</View>
		);
	};

	const age = () => {
		return (
			<View>
				<DateTimePicker
					label="How old are you?"
					labelStyle={Styles.label}
					icon={['fal', 'calendar-star']}
					placeholder="Date Of Birth"
					initialValue={dateOfBirth}
					value={dateOfBirth}
					enabled
					editable={editingMode}
					textStyle={{ color: '#fff', fontSize: 16 }}
					textValue={profile?.age}
				/>
			</View>
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#444442' }}>
			{top()}
			<View style={{ padding: 16, flex: 1 }}>
				{gender()}
				{age()}
			</View>
		</View>
	);
};

export default MyProfileScreen;
