import React, { useState, useRef, useEffect, memo } from 'react';
import {Button, Text, View, TouchableHighlight} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import BaseStyles from "./styles/base";

import ChatScreen from "./authenticated/chat";

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from "../components/Icon";
import MeetupsScreen from "./authenticated/meetups/Meetups";
import MeetupScreen from "./authenticated/meetups/Meetup";
import SettingsScreen from './Settings';


import CreateMeetupScreen from "./authenticated/meetups/CreateMeetup";
import MyProfileScreen from './authenticated/MyProfile';
import { useAuthenticatedNavigation } from '../context/AuthenticatedNavigationContext';
import WelcomeScreen from './authenticated/Welcome';
import {useAuth} from '../context/AuthContext';
const Stack = createStackNavigator();

const MembersNavigator = ({navigation: drawerNavigation, setStackNavigation, setDrawerNavigation}) => {
    const { add: addDrawerItem, update: updateDrawerItem, closeLeftDrawer, closeRightDrawer } = useAuthenticatedNavigation();
    const { logout } = useAuth();
    
    const stackNavigation = useRef();
    
    const [ isLoading, setIsLoading ] = useState(false);
    const [ firstRun, setFirstRun ] = useState(true);
    
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
                    <TouchableHighlight style={{}} onPress={showMeetups}>
                        <View style={{
                            textAlign: 'center',
                            color: '#000000',
                            paddingVertical: 12,
                            paddingLeft: 10,
                            flexDirection: 'row',
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                            <Icon icon={['fal', 'calendar-star']} size={18} style={{marginRight:14, color:'#fff'}}/>
                            <Text style={{flex: 1, fontSize: 16, color:'#fff'}}>Meetups</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            ));
    
            updateDrawerItem('options', (<View style={{justifyContent: 'flex-end', flexDirection:'row', marginBottom: 16}} key={'options'}>
                <TouchableHighlight onPress={showSettings} style={{paddingHorizontal:14}}>
                    <Icon icon={['fal', 'cogs']} size={28} style={{color:'#fff', alignSelf:'center'}}/>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => logout()} style={{paddingHorizontal:14}}>
                    <Icon icon={['fal', 'sign-out-alt']} size={28} style={{color:'#fff', alignSelf:'center'}}/>
                </TouchableHighlight>
            </View>),false, true);
        }
        //
    }, [firstRun]);
    
    
    const screenProps = {closeLeftDrawer, closeRightDrawer};
    
    return (
        <View style={BaseStyles.container} >
            <NavigationContainer independent={true} ref={stackNavigation} onStateChange={(state) => {if (!state) return;}}>
                <Stack.Navigator initialRouteName="Meetups">
                    <Stack.Screen name="Chat" options={{ headerShown: false }} component={ChatScreen} />
                    <Stack.Screen name="Meetups" options={{ headerShown: false}} component={MeetupsScreen} />
                    <Stack.Screen name="Meetup" options={{ headerShown: false}} component={MeetupScreen} />
                    <Stack.Screen name="CreateMeetup" options={{ headerShown: false}} component={CreateMeetupScreen} />
                    <Stack.Screen name="MyProfile" options={{ headerShown: false}} component={MyProfileScreen} />
                    <Stack.Screen name="Settings" options={{ headerShown: false}} component={SettingsScreen} />
                    <Stack.Screen name="Welcome" component={ WelcomeScreen } options={{title: 'Welcome To SoSa!'}} />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

export default memo(MembersNavigator, () => true);
