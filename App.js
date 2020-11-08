import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppState, StatusBar, View, Linking, Alert} from "react-native";

import SplashScreen from "./App/screens/Splash";
import LoginScreen from './App/screens/authentication/login';
import RegistrationScreen from "./App/screens/authentication/register";
import ForgotPassword from './App/screens/authentication/forgot_password';
import ForgotPasswordCode from './App/screens/authentication/forgot_password_code';
import MembersArea from "./App/screens/MembersDrawerWrapper";
import SettingsScreen from "./App/screens/Settings";


import BaseStyles from './App/screens/styles/base';
import Helpers from "./App/sosa/Helpers";

import { AppContext } from "./App/screens/context/AppContext";
import WelcomeScreen from "./App/screens/Welcome";
import Session from "./App/sosa/Session";
import { Client } from "sosa-chat-client";
import {SoSaConfig} from "./App/sosa/config";
import io from "socket.io-client";
import jwt from "react-native-pure-jwt";
import Device from "./App/sosa/Device";
import {parseString as parseXMLString} from "react-native-xml2js";

const Stack = createStackNavigator();

export default class SoSa extends Component {
	coldBoot = true;
	appNavigation = null;

	session = Session.getInstance();
	device = Device.getInstance();
    deepLinkingListeners = {};
	
	client = new Client(
		{providers: SoSaConfig.providers},
		io,
        (response) => new Promise((resolve, reject) => {
                parseXMLString(response, function (err, result) {
                    if(err) reject(err);
                    else{ resolve(result); }
                });
            }
        ),
		{
			getDevice: () => this.device.init(),
            updateDevice: (device) => new Promise((resolve, reject) => {
                    console.info('App::updateDevice', this.device, device);
                    
                    this.device = device;
                    device.save();
                    resolve(device);
            }),
			getSession: () => new Promise((resolve => {
                this.session.init().finally(() => resolve(this.session));
            })),
            updateSession: (session) => new Promise((resolve, reject) => {
                this.session = session;
                session.save();
                resolve(session);
            }),
			generateJWT: (packet) => {
			    if(!this.device.secret) throw new Error('Device not initialized');
			    return jwt.sign(packet, this.device.secret, {alg: "HS256"});
			},
			reauth: () => this.validateSession(),
			authFailed: () => {this.logout(true)}
		}
	);

	state = {
		initializing: false,
		defaultScreen: 'Splash',
		appState: AppState.currentState
	};

	constructor() {
		super();

		this.appNavigation = React.createRef();
		Linking.getInitialURL().then((result) => this.handleDeepLink({url: result}, true));
	}

	componentWillUnmount(){
		this.client.middleware.clear('app');
        AppState.removeEventListener("change", this._handleAppStateChange);
        Linking.removeEventListener('url', this.handleDeepLink);
	}
    
    componentDidMount() {
        AppState.addEventListener("change", this._handleAppStateChange);
        Linking.addEventListener('url', this.handleDeepLink);
        
        this.validateSession()
            .then(({user}) => {
                if(user?.welcome){
                    this.resetRoot('Welcome', {user, welcome: user.welcome});
                }else{
                    this.resetRoot('MembersArea', {user});
                }
            })
            .catch(() => this.resetRoot('Login', {}));
        this.coldBoot = false;
    }

	resetRoot = (name, params) => {
		this.appNavigation?.current?.resetRoot({ index: 0, routes: [{ name, params }] });
	};

	logout = (sessionAutoExpired) => {
        const { client: { services: { auth: authService } } } = this;
        
		let clearSession = () => {
			let session = Session.getInstance();
			session.logout(() => this.resetRoot('Login', {logout: true}));
		};

		if(sessionAutoExpired === true){
			clearSession();
			Alert.alert("Oooof", "Sorry you were logged out, please login again!",
				[{text: "Sure!",style: "cancel"}],
				{ cancelable: true }
			);
		}
		else{
			Alert.alert("Are you sure?", "Are you sure you want to logout?",
				[
					{ text: "Cancel", style: "cancel" },
					{ text: "OK", onPress: () => {
					    authService.logout()
                            .catch((error) => console.debug('App::logout', error))
                            .finally(() => clearSession())
                    } }
				],
				{ cancelable: true }
			);
		}
	};
	
	validateSession(){
        const { client: { services: { auth } } } = this;
        
        return auth.validateSession().catch((error) => {
                console.debug('error', error);
                if(this.session.id.length > 0){
                    return auth.deviceLogin(this.device.id);
                }else{
                    throw error;
                }
            });
    }

	handleDeepLink = ({url}, coldBoot = false) => {
		if(url !== null){
			url = url.replace('sosa://','').split('/');
			

			if(url.length > 0){
				const [namespace, method, encoded] = url;
				const decoded = Helpers.base64Decode(encoded);
				
				let data = {status: 'failure', error:'system_error'};
				try{
				    data = JSON.parse(decoded);
                }catch (e) {
                    console.debug('App::handleDeepLink::invalid_payload', e);
                } finally {
                    console.info('App::handleDeepLink', coldBoot, namespace, method, encoded, decoded, data);
                }
				this.fireDeeplinkListener(namespace, method, data);
			}
		}
	};

	_handleAppStateChange = nextAppState => {
	    this.setState({ appState: nextAppState });
	};

	addDeeplinkListener = (namespace='', method='', callback, onlyOneAllowed=false) => {
	    let { deepLinkingListeners } = this;
		
	    if(!deepLinkingListeners[namespace]) this.deepLinkingListeners[namespace] = {};
		if(!deepLinkingListeners[namespace][method]) this.deepLinkingListeners[namespace][method] = [];

		if(onlyOneAllowed){
			deepLinkingListeners[namespace][method] = [callback];
		}else{
			deepLinkingListeners[namespace][method].push(callback);
		}
	};

	removeDeeplinkListener = (namespace='', method='') => {
        let { deepLinkingListeners } = this;
        
		if(deepLinkingListeners[namespace] && deepLinkingListeners[namespace][method]){
			delete deepLinkingListeners[namespace][method];
		}
	};

	fireDeeplinkListener = (namespace='', method='', data) => {
        let { deepLinkingListeners } = this;
        
		if(deepLinkingListeners[namespace] && deepLinkingListeners[namespace][method]){
		    const triggers = deepLinkingListeners[namespace][method];
			triggers.forEach((listener) => {
				try{
					listener(data);
				}catch (e) {
					console.log(e);
				}
			})
		}
	};

	render() {
        return (
            <View style={BaseStyles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#121211"/>
                <View style={{flex:1}}>
                    <AppContext.Provider value={{client: this.client, addDeeplinkListener: this.addDeeplinkListener, removeDeeplinkListener: this.removeDeeplinkListener, logout: this.logout}}>
                        <NavigationContainer ref={this.appNavigation}>
                            <Stack.Navigator initialRouteName={this.state.defaultScreen} screenOptions={{headerStyle: BaseStyles.header, headerTitleStyle: BaseStyles.headerTitle, headerTintColor: 'white', headerTitleContainerStyle: { left: 10 }}} >
                                <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>
                                <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login To SoSa' }}/>
                                <Stack.Screen name="Register" component={RegistrationScreen} options={{ title: 'Join SoSa' }} />
                                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgotten Password' }} />
                                <Stack.Screen name="ForgotPasswordCode" component={ForgotPasswordCode} options={{title: 'Check your e-mail'}}/>
                                <Stack.Screen name="MembersArea" component={MembersArea} options={{title:'', headerShown:false}}/>
                                <Stack.Screen name="Settings" component={SettingsScreen} options={{title: 'Settings'}}/>
                                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{title: 'Welcome To SoSa!'}}/>
                            </Stack.Navigator>
                        </NavigationContainer>
                    </AppContext.Provider>
                </View>
            </View>
        );
	}
}



