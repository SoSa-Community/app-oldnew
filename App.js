import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppState, ImageBackground, Image, StatusBar, View, Linking} from "react-native";

import LoginScreen from './App/screens/authentication/login';
import ForgotPassword from './App/screens/authentication/forgot_password';
import ForgotPasswordCode from './App/screens/authentication/forgot_password_code';
import RegistrationScreen from "./App/screens/authentication/register";
import MembersWrapper from "./App/screens/members_wrapper";

import BaseStyles from './App/screens/styles/base';
import Device from "./App/sosa/Device";
import Session from "./App/sosa/Session";
import Helpers from "./App/sosa/Helpers";

import { AppContext } from "./App/screens/context/AppContext";

const Stack = createStackNavigator();


export default class SoSa extends Component {
    navigation = React.createRef();
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

        Helpers.authCheck((device, session, error) => {
            let state = {initializing: false};
            if(error === null) state.defaultScreen = 'MembersWrapper';
            setTimeout(() => this.setState(state), 3000);
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

    addDeeplinkListener = (namespace='', method='', callback, onlyOneAllowed=false) => {
        if(!this.deepLinkingListeners[namespace]) this.deepLinkingListeners[namespace] = {};
        if(!this.deepLinkingListeners[namespace][method]) this.deepLinkingListeners[namespace][method] = [];

        if(onlyOneAllowed){
            this.deepLinkingListeners[namespace][method] = [callback];
        }else{
            this.deepLinkingListeners[namespace][method].push(callback);
        }

    }

    removeDeeplinkListener = (namespace='', method='') => {
        if(this.deepLinkingListeners[namespace] && this.deepLinkingListeners[namespace][method]){
               delete this.deepLinkingListeners[namespace][method];
        }
    };

    fireDeeplinkListener = (namespace='', method='', data) => {
        if(this.deepLinkingListeners[namespace] && this.deepLinkingListeners[namespace][method]){
            this.deepLinkingListeners[namespace][method].forEach((listener) => {
                try{
                    listener(data);
                }catch (e) {
                    console.log(e);
                }
            })
        }
    }



    renderDisplay = (initializing) => {
        if(initializing){
            return (
                <View style={BaseStyles.container}>
                    <StatusBar barStyle="light-content" backgroundColor="#121211" />
                    <ImageBackground source={require('./App/assets/splash.jpg')} style={{width: '100%', height: '100%', flex:1,justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('./App/assets/splash_logo.png')} style={{width: '40%', resizeMode: 'contain'}} />
                    </ImageBackground>

                </View>);
        }else{
            return (
                <View style={BaseStyles.container}>
                    <View style={{flex:1}}>
                        <StatusBar barStyle="light-content" backgroundColor="#121211"/>
                        <AppContext.Provider value={{addDeeplinkListener: this.addDeeplinkListener, removeDeeplinkListener: this.removeDeeplinkListener}}>
                            <NavigationContainer reg={this.navigation}>
                                <Stack.Navigator initialRouteName={this.state.defaultScreen} screenOptions={{headerStyle: BaseStyles.header, headerTitleStyle: BaseStyles.headerTitle, headerTintColor: 'white', headerTitleContainerStyle: { left: 10 }}} >
                                    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Welcome to SoSa' }}/>
                                    <Stack.Screen name="Register" component={RegistrationScreen} options={{ title: 'Join SoSa' }} />
                                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgotten Password' }} />
                                    <Stack.Screen name="ForgotPasswordCode" component={ForgotPasswordCode} options={{title: 'Check your e-mail'}}/>
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



