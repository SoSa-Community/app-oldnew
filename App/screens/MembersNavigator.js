import React, {Component} from 'react';
import {Button, Text, View, TouchableHighlight} from 'react-native';

import BaseStyles from "./styles/base";

import withDrawerNavigationContext from './hoc/withDrawerNavigationContext';
import {MembersNavigationContext} from "./context/MembersNavigationContext";


import MembersAreaNavigationHeader from "../components/MembersAreaNavigationHeader";
import ChatScreen from "./chat";

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from "../components/Icon";
import MeetupsScreen from "./Meetups";
import MeetupScreen from "./Meetup";
import {Preferences} from "../sosa/Preferences";


const Stack = createStackNavigator();

class WrapperComponent extends Component {
    appNavigation = null;
    drawerNavigation = null;
    drawerNavigationContext = {};
    topBar = null;
    stackNavigation = null;

    state = {
        headerIcons: [],
        preferences: {}
    };

    eventListeners = {};

    constructor(props) {
        super();
        this.drawerNavigation = props.navigation;
        this.drawerNavigationContext = props.navigationContext;
        this.appNavigation = this.drawerNavigationContext.appNavigation;
        this.topBar = React.createRef();
        this.stackNavigation = React.createRef();

        Preferences.getAll((preferences) => {
            this.setState({preferences});
            this.triggerListener('settings_update', preferences);
        });
    }

    showSettings = () => {
        this.appNavigation.navigate('Settings');

        const unsubscribe = this.appNavigation.addListener('focus', () => {
            Preferences.getAll((preferences) => {
                this.triggerListener('settings_update', preferences);
            });
            unsubscribe();
        });
    };

    addListener = (event, callback) => {
        if(!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(callback);
    };

    triggerListener = (event, data) => {
        if(this.eventListeners[event]){
            this.eventListeners[event].forEach((callback) => {
                try{
                    callback(data);
                }catch (e) {
                    console.debug('Callback error', e);
                }
            })
        }
    };

    showMeetups = () => {
        this.drawerNavigation.dangerouslyGetParent().closeDrawer();
        this.stackNavigation.current.navigate('Meetups');
    };

    componentDidMount(): void {

        this.drawerNavigationContext.addDrawerItem('community', (
            <View style={{marginBottom: 16}} key={'community'}>
                <TouchableHighlight style={{}} onPress={this.showMeetups}>
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

        this.drawerNavigationContext.updateDrawerItem('options', (<View style={{justifyContent: 'flex-end', flexDirection:'row', marginBottom: 16}} key={'options'}>
            <TouchableHighlight onPress={this.showSettings}>
                    <Icon icon={['fal', 'cogs']} size={28} style={{marginRight:14, color:'#fff', alignSelf:'center'}}/>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.drawerNavigationContext.logout}>
                <Icon icon={['fal', 'sign-out-alt']} size={28} style={{marginRight:14, color:'#fff', alignSelf:'center'}}/>
            </TouchableHighlight>
        </View>),false, true);
    }

    addHeaderIcon = (id, icon, onPress) => {this.topBar.current.addHeaderIcon(id, icon, onPress);};

    render() {

        return (
            <MembersNavigationContext.Provider value={{
                addHeaderIcon: this.addHeaderIcon,
                drawerNavigation: this.drawerNavigation,
                drawerNavigationContext: this.drawerNavigationContext,
                navigate: this.navigate,
                addListener: this.addListener,
                preferences: this.state.preferences
            }}
            >
                <View style={BaseStyles.container} >
                    <MembersAreaNavigationHeader drawerNavigation={this.drawerNavigation} icons={this.state.headerIcons} ref={this.topBar}/>
                    <NavigationContainer independent={true} ref={this.stackNavigation}>
                        <Stack.Navigator>
                            <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }}/>
                            <Stack.Screen name="Meetups" component={MeetupsScreen} options={{ headerShown: false}}/>
                            <Stack.Screen name="Meetup" component={MeetupScreen} options={{ headerShown: false }}/>
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </MembersNavigationContext.Provider>
        );
  }
}

const MembersNavigator = withDrawerNavigationContext(WrapperComponent);
export default MembersNavigator;
