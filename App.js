import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppState, ImageBackground, Image, Text, View, Linking} from "react-native";

import LoginScreen from './screens/authentication/login';
import ForgotPassword from './screens/authentication/forgot_password';
import ForgotPasswordCode from './screens/authentication/forgot_password_code';
import Register from "./screens/authentication/register";
import MembersWrapper from "./screens/members_wrapper";

import BaseStyles from './screens/styles/base';
import Device from "./sosa/Device";
import Session from "./sosa/Session";
import Helpers from "./sosa/Helpers";

import { AppContext } from "./screens/context/AppContext";

const Stack = createStackNavigator();


export default class SoSa extends Component {

    coldBoot = true;
    state = {
        initializing: true,
        defaultScreen: 'Login',
        appState: AppState.currentState
    }

    constructor() {
        super();
        Linking.getInitialURL().then((result) => {
            this.handleDeepLink({url: result}, true);
        });
    }


    componentDidMount(): void {
        AppState.addEventListener("change", this._handleAppStateChange);
        Linking.addEventListener('url', this.handleDeepLink);


        Device.getInstance().init(device => {
            Session.getInstance().init(session => {
                Helpers.validateSession((error) => {
                    let state = {initializing: false};
                    if(error === null) state.defaultScreen = 'MembersWrapper';
                    this.setState(state);

                });
            });
        });

        this.coldBoot = false;
    }

    componentWillUnmount(): void {
        AppState.removeEventListener("change", this._handleAppStateChange);
        Linking.removeEventListener('url', this.handleDeepLink);
    }

    handleDeepLink = ({url}, coldBoot = false) => {
        if(url !== null){
            url = url.replace('sosa://','').split('/');
            console.log('Deep link', url, coldBoot);

            if(url.length > 0){
                let namespace = url[0];
                let method = url[1];
                let data = JSON.parse(Helpers.base64Decode(url[2]));

                this.fireDeeplinkListener(namespace, method, data);
            }
        }

    };

    _handleAppStateChange = nextAppState => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("App has come to the foreground!");
        }
        this.setState({ appState: nextAppState });
    };

    deepLinkingListeners = {};

    addDeeplinkListener = (namespace='', method='', callback) => {
        if(!this.deepLinkingListeners[namespace]) this.deepLinkingListeners[namespace] = {};
        if(!this.deepLinkingListeners[namespace][method]) this.deepLinkingListeners[namespace][method] = [];

        this.deepLinkingListeners[namespace][method].push(callback);
    }

    fireDeeplinkListener = (namespace='', method='', data) => {
        if(this.deepLinkingListeners[namespace] && this.deepLinkingListeners[namespace][method]){
            this.deepLinkingListeners[namespace][method].forEach((listener) => {
                listener(data);
            })
        }
    }



    renderDisplay = (initializing) => {
        if(initializing){
            return (
                <View style={BaseStyles.container}>
                    <ImageBackground source={require('./assets/splash.jpg')} style={{width: '100%', height: '100%', flex:1,justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('./assets/splash_logo.png')} style={{width: '40%', resizeMode: 'contain'}} />
                    </ImageBackground>

                </View>);
        }else{
            return (
                <View style={BaseStyles.container}>
                    <View style={{flex:1}}>
                        <AppContext.Provider value={{addDeeplinkListener: this.addDeeplinkListener}}>
                            <NavigationContainer>
                                <Stack.Navigator initialRouteName={this.state.defaultScreen} screenOptions={{headerTitle: 'SoSa', headerStyle: BaseStyles.header, headerTitleStyle: BaseStyles.headerTitle}}>
                                    <Stack.Screen name="Login" component={LoginScreen} />
                                    <Stack.Screen name="Register" component={Register} />
                                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                                    <Stack.Screen name="ForgotPasswordCode" component={ForgotPasswordCode} />
                                    <Stack.Screen name="MembersWrapper" component={MembersWrapper} options={{headerShown:false}}/>
                                </Stack.Navigator>
                            </NavigationContainer>
                        </AppContext.Provider>
                    </View>
                </View>
            );
        }
    };

    render() {
        return this.renderDisplay(this.state.initializing);
    }
}



