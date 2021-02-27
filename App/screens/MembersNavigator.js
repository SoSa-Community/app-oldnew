import React, { useState, useRef, useEffect, memo } from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BaseStyles from "./styles/base";

import { useAuth } from '../context/AuthContext';
import { useAuthenticatedNavigation } from '../context/AuthenticatedNavigationContext';
import { useAPI } from '../context/APIContext';

import Icon from "../components/Icon";
import MeetupsScreen from "./authenticated/meetups/Meetups";
import MeetupScreen from "./authenticated/meetups/Meetup";
import SettingsScreen from './Settings';

import ChatScreen from "./authenticated/Chat";
import CreateMeetupScreen from "./authenticated/meetups/CreateMeetup";
import MyProfileScreen from './authenticated/MyProfile';
import WelcomeScreen from './authenticated/Welcome';

import ProfileModal from '../components/ProfileModal';
const Stack = createStackNavigator();

const Styles = StyleSheet.create({
    menuItem: {
        textAlign: 'center',
        color: '#000000',
        paddingVertical: 12,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
    },
    
    menuItemText: {
        flex: 1,
        fontSize: 16,
        color:'#fff'
    },
    
    menuItemIcon: {
        marginRight:14,
        color:'#fff'
    },
    
    menuFooterIcon: {
        color:'#fff',
        alignSelf:'center'
    },
    
    menuFooterButtons: {
        justifyContent: 'flex-end',
        flexDirection:'row',
        marginBottom: 16
    },
    
    menuFooterButton: {
        paddingHorizontal:14
    }
    
});

const FooterButton = ({icon, onPress}) => {
    return <TouchableHighlight onPress={onPress} style={Styles.menuFooterButton}>
        <Icon icon={icon} size={28} style={Styles.menuFooterIcon}/>
    </TouchableHighlight>
}

const MembersNavigator = ({navigation: drawerNavigation, setStackNavigation, setDrawerNavigation}) => {
    const { add: addDrawerItem, update: updateDrawerItem, closeLeftDrawer, closeRightDrawer } = useAuthenticatedNavigation();
    const { logout } = useAuth();
    
    const stackNavigation = useRef();
    
    const [ isLoading, setIsLoading ] = useState(false);
    const [ firstRun, setFirstRun ] = useState(true);
    const [ selectedProfileId, setSelectedProfileId ] = useState(null);
    
    const showMemberProfile = (id) => {
        console.debug(id);
        setSelectedProfileId(id);
    }
    
    const showSettings = () => {
        closeLeftDrawer();
        stackNavigation?.current?.navigate('Settings');
    };
    
    const showProfile = () => {
        drawerNavigation.dangerouslyGetParent().closeDrawer();
        stackNavigation?.current?.navigate('MyProfile');
        closeLeftDrawer();
    };
    
    const showMeetups = () => {
        drawerNavigation.dangerouslyGetParent().closeDrawer();
        stackNavigation?.current?.navigate('Meetups');
        closeLeftDrawer();
    };
    
    if(isLoading) return <View><Text>Loading</Text></View>
    
    useEffect(() => {
        if(firstRun) {
            setStackNavigation(stackNavigation);
            setDrawerNavigation(drawerNavigation);
            console.debug('Re-rendering members navigator', firstRun);
            setFirstRun(false);
    
            addDrawerItem('community', (
                <View style={{marginBottom: 16}} key={'community'}>
                    <TouchableHighlight onPress={showMeetups}>
                        <View style={Styles.menuItem}>
                            <Icon icon={['fal', 'calendar-star']} size={18} style={Styles.menuItemIcon}/>
                            <Text style={Styles.menuItemText}>Meetups</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            ));
    
            updateDrawerItem('options', (
                <View style={Styles.menuFooterButtons} key={'options'}>
                    <FooterButton onPress={showSettings} icon={['fal', 'cogs']} />
                    <FooterButton onPress={() => logout()} icon={['fal', 'sign-out-alt']} />
                </View>
            ),false, true);
        }
        //
    }, [firstRun]);
    
    return (
        <View style={BaseStyles.container} >
            <NavigationContainer independent={true} ref={stackNavigation} onStateChange={(state) => {if (!state) return;}}>
                <Stack.Navigator initialRouteName="Chat">
                    <Stack.Screen name="Chat" options={{ headerShown: false }}>
                        { (props) => <ChatScreen {...props} showMemberProfile={showMemberProfile}  /> }
                    </Stack.Screen>
                    <Stack.Screen name="Meetups" options={{ headerShown: false}} component={MeetupsScreen} />
                    <Stack.Screen name="Meetup" options={{ headerShown: false }}>
                        { (props) => <MeetupScreen {...props} showMemberProfile={showMemberProfile}  /> }
                    </Stack.Screen>
                    <Stack.Screen name="CreateMeetup" options={{ headerShown: false}} component={CreateMeetupScreen} />
                    <Stack.Screen name="MyProfile" options={{ headerShown: false}} component={MyProfileScreen} />
                    <Stack.Screen name="Settings" options={{ headerShown: false}} component={SettingsScreen} />
                    <Stack.Screen name="Welcome" component={ WelcomeScreen } options={{title: 'Welcome To SoSa!'}} />
                </Stack.Navigator>
            </NavigationContainer>
            <ProfileModal profileId={selectedProfileId} onDismiss={() => setSelectedProfileId(null)} />
        </View>
    );
}

export default memo(MembersNavigator, () => true);
