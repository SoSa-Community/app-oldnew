import React, { useState, useRef, useEffect, memo } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';

import { useAuth } from '../context/AuthContext';
import { useAuthenticatedNavigation } from '../context/AuthenticatedNavigationContext';
import { useProfile } from '../context/ProfileContext';

import Icon from '../components/Icon';
import MeetupsScreen from './authenticated/Meetups/Meetups';
import MeetupScreen from './authenticated/Meetups/Meetup';

import ChatScreen from './authenticated/Chat/Chat';
import CreateMeetupScreen from './authenticated/Meetups/CreateMeetup';
import MyProfileScreen from './authenticated/Profile/MyProfile';
import WelcomeScreen from './authenticated/Welcome/Welcome';
import SettingsScreen from './authenticated/Settings/Settings';

import ProfileModal from '../components/ProfileModal';

import BaseStyles from './styles/base';
import ProfilePicture from '../components/Profile/ProfilePicture/ProfilePicture';
import WelcomeProfileScreen from './authenticated/Profile/WelcomeProfileScreen';
const Stack = createStackNavigator();

const Styles = StyleSheet.create({
	menuItem: {
		textAlign: 'center',
		color: '#000000',
		paddingVertical: 12,
		paddingLeft: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	menuItemText: {
		flex: 1,
		fontSize: 16,
		color: '#fff',
	},

	menuItemIcon: {
		marginRight: 14,
		color: '#fff',
	},

	menuFooterIcon: {
		color: '#fff',
		alignSelf: 'center',
	},

	menuFooterButtons: {
		justifyContent: 'flex-end',
		flexDirection: 'row',
		marginBottom: 16,
	},

	menuFooterButton: {
		paddingHorizontal: 8,
	},

	pictureButton: {
		backgroundColor: '#444442',
		paddingHorizontal: 14,
		borderRadius: 100 / 2,
	},

	picture: {
		width: 28,
		height: 28,
		borderRadius: 48 / 2,
	},
});

const FooterButton = ({ icon, onPress }) => {
	return (
		<TouchableHighlight onPress={onPress} style={Styles.menuFooterButton}>
			<Icon icon={icon} size={28} style={Styles.menuFooterIcon} />
		</TouchableHighlight>
	);
};

const MembersNavigator = ({
	navigation: drawerNavigation,
	setStackNavigation,
	setDrawerNavigation,
}) => {
	const {
		add: addDrawerItem,
		update: updateDrawerItem,
		closeLeftDrawer,
		closeRightDrawer,
		setTopbarVisible,
	} = useAuthenticatedNavigation();

	const { logout } = useAuth();
	const { profile, isFetchingProfile } = useProfile();

	const stackNavigation = useRef();

	const [isLoading, setIsLoading] = useState(false);
	const [firstRun, setFirstRun] = useState(true);
	const [selectedProfileId, setSelectedProfileId] = useState(null);

	const showMemberProfile = (id) => {
		setSelectedProfileId(id);
	};

	const showSettings = () => {
		closeLeftDrawer();
		stackNavigation?.current?.navigate('Settings');
	};

	const showMyProfile = () => {
		drawerNavigation.dangerouslyGetParent().closeDrawer();
		stackNavigation?.current?.navigate('MyProfile');
		closeLeftDrawer();
	};

	const showMeetups = () => {
		drawerNavigation.dangerouslyGetParent().closeDrawer();
		stackNavigation?.current?.navigate('Meetups');
		closeLeftDrawer();
	};

	useEffect(() => {
		if (firstRun) {
			setStackNavigation(stackNavigation);
			setDrawerNavigation(drawerNavigation);
			console.debug('Re-rendering members navigator', firstRun);
			setFirstRun(false);

			addDrawerItem(
				'community',
				<View style={{ marginBottom: 16 }} key={'community'}>
					<TouchableHighlight onPress={showMeetups}>
						<View style={Styles.menuItem}>
							<Icon
								icon={['fal', 'calendar-star']}
								size={18}
								style={Styles.menuItemIcon}
							/>
							<Text style={Styles.menuItemText}>Meetups</Text>
						</View>
					</TouchableHighlight>
				</View>,
			);
		}
		//
	}, [firstRun]);

	useEffect(() => {
		updateDrawerItem(
			'options',
			<View style={Styles.menuFooterButtons} key={'options'}>
				<ProfilePicture
					picture={profile?.picture}
					onPress={showMyProfile}
					containerStyle={Styles.menuFooterButton}
				/>
				<FooterButton onPress={showSettings} icon={['fal', 'cogs']} />
			</View>,
			false,
			true,
		);
	}, [profile]);

	if (isLoading || isFetchingProfile) {
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);
	}

	return (
		<View style={BaseStyles.container}>
			<NavigationContainer
				independent={true}
				ref={stackNavigation}
				onStateChange={(state) => {
					if (!state) return;
				}}>
				<Stack.Navigator
					initialRouteName={!profile ? 'WelcomeProfile' : 'Chat'}>

					<Stack.Screen name="Chat" options={{ headerShown: false }}>
						{(props) => (
							<ChatScreen
								{...props}
								showMemberProfile={showMemberProfile}
							/>
						)}
					</Stack.Screen>
					<Stack.Screen
						name="Meetups"
						options={{ headerShown: false }}
						component={MeetupsScreen}
					/>
					<Stack.Screen
						name="Meetup"
						options={{ headerShown: false }}>
						{(props) => (
							<MeetupScreen
								{...props}
								showMemberProfile={showMemberProfile}
							/>
						)}
					</Stack.Screen>
					<Stack.Screen
						name="CreateMeetup"
						options={{ headerShown: false }}
						component={CreateMeetupScreen}
					/>
					<Stack.Screen
						name="MyProfile"
						options={{ headerShown: false }}
						component={MyProfileScreen}
					/>
					<Stack.Screen
						name="WelcomeProfile"
						options={{ headerShown: false }}
						component={WelcomeProfileScreen}
					/>
					<Stack.Screen
						name="Settings"
						options={{ headerShown: false }}
						component={SettingsScreen}
					/>
					<Stack.Screen
						name="Welcome"
						component={WelcomeScreen}
						options={{ title: 'Welcome To SoSa!' }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
			<ProfileModal
				profileId={selectedProfileId}
				onDismiss={() => setSelectedProfileId(null)}
			/>
		</View>
	);
};

export default memo(MembersNavigator, () => true);
