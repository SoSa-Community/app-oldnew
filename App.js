import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppState, StatusBar, View, Linking, Alert, Text, TouchableHighlight, Modal, StyleSheet} from "react-native";

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

const ModalStyles = StyleSheet.create({
    container: {
        backgroundColor:'rgba(0,0,0,0.5)',
        flex:1,
        justifyContent:'center'
    },
    
    innerContainer: {
        flex:1,
        maxHeight:200,
        backgroundColor:'#444442',
        borderRadius:12,
        overflow:'hidden',
        paddingHorizontal: 20,
        marginHorizontal: 20
    },
    
    bodyContainer: {
        flex:1,
        paddingVertical: '5%'
    },
    
    title: {fontSize: 20, marginBottom:5, color:'#fff'},
    description: {fontSize: 16, color:'#fff'},
    buttonContainer: {width:'100%', flexDirection: 'row', justifyContent:'flex-end', alignItems:'flex-end', marginBottom: 16},
    okButton: {
        alignItems:'center',
        borderRadius: 8,
        borderColor: '#f0ad4e',
    
        borderWidth: 1,
        flex:1,
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    
    okButtonText: {
        color: '#fff'
    }
    
});

export default class SoSa extends Component {
	coldBoot = true;
	appNavigation = null;

	session = Session.getInstance();
	device = Device.getInstance();
    middleware = {};
	
	apiClient = new Client(
		{errors: SoSaConfig.errors, providers: SoSaConfig.providers},
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
		appState: AppState.currentState,
        modals: []
	};

	constructor() {
		super();

		this.appNavigation = React.createRef();
		Linking.getInitialURL().then((result) => this.handleDeepLink({url: result}, true));
	}

	componentWillUnmount(){
		this.apiClient.middleware.clear('app');
        AppState.removeEventListener("change", this._handleAppStateChange);
        Linking.removeEventListener('url', this.handleDeepLink);
	}
    
    componentDidMount() {
	    AppState.addEventListener("change", this._handleAppStateChange);
        Linking.addEventListener('url', this.handleDeepLink);
    
        const {apiClient} = this;
        const {middleware} = apiClient;
    
        middleware.clear('app');
        middleware.add('app', {
            'event': (packet) => {
                return new Promise((resolve) => {
                    this.triggerMiddleware('api_event', packet);
                    resolve(packet);
                });
            },
            'authentication_successful': (authData) => {
                return new Promise((resolve) => {
                    this.setState({loading:false});
                    this.triggerMiddleware('api_authenticated', authData);
                    resolve(authData);
                });
            },
            'disconnected': (message) => {
                return new Promise((resolve) => {
                    this.triggerMiddleware('api_disconnected', message);
                    resolve(message);
                });
            }
        });
        
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
        const { apiClient: { services: { auth: authService } } } = this;
        
		let clearSession = () => {
			let session = Session.getInstance();
			session.logout().then(() => this.resetRoot('Login', {logout: true}));
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
						clearSession();
					    authService.logout().catch((error) => console.debug('App::logout', error))
                    } }
				],
				{ cancelable: true }
			);
		}
	};
	
	validateSession(){
        const { apiClient: { services: { auth } } } = this;
        
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
                this.triggerMiddleware(`${namespace}/${method}`, data);
			}
		}
	};

	_handleAppStateChange = nextAppState => {
	    this.setState({ appState: nextAppState });
	};
	   
    addMiddleware = (namespace, event, middleware, onlyOneAllowed=false) => {
        if(!namespace.length) namespace = 'global';
        
        let add = (event, middleware) => {
            if(!this.middleware[event] || onlyOneAllowed) this.middleware[event] = [];
            
            if(!this.middleware[namespace]) this.middleware[namespace] = {};
            if(!this.middleware[namespace][event]) this.middleware[namespace][event] = [];
            this.middleware[namespace][event].push(middleware);
        };
        
        if(typeof(event) === 'string'){
            add(event, middleware);
        }else{
            event.forEach((middleware, event) => add(event, middleware));
        }
    };
    
    clearMiddlewareNamespace = (namespace) => {
        this.middleware[namespace] = {};
    };
    
    triggerMiddleware = (event, data) => {
        return new Promise((resolve, reject) => {
            if(event){
                let callbacks = [];
                console.debug('App::Middleware::trigger::namespace', event, this.middleware);
                
                for(const namespace in this.middleware){
                    if(this.middleware[namespace].hasOwnProperty(event)){
                        callbacks = [...callbacks, ...Object.values(this.middleware[namespace][event]).map((middleware) =>
                            new Promise((resolve1, reject1) => {
                                middleware(data, this.client, event);
                                resolve1();
                            }).catch((error) => {
                                console.debug('App::Middleware::trigger::error', event, error);
                            })
                        )];
                    }
                }
                Promise.all(callbacks).then(() => resolve(data));
            }else{
                resolve(data);
            }
        });
    };
    
    createModal = (title, description, onClose) => {
        let modals = [...this.state.modals];
        modals.push({title, description, onClose});
        this.setState({modals});
    };

	render() {
        const modals = this.state.modals.map((modal, index) => {
            const {title, description} = modal;
            
            const closeModal = () => {
                let modals = [...this.state.modals];
                console.debug(index, modals);
                modals.splice(index, 1);
                this.setState({modals});
            };
            
            return (<Modal visible={true} transparent={true} key={index}>
                <View style={ModalStyles.container}>
                    <View style={ModalStyles.innerContainer}>
                        <View style={ModalStyles.bodyContainer}>
                            <Text style={ModalStyles.title}>{title}</Text>
                            <Text style={ModalStyles.description}>{description}</Text>
                        </View>
                        <View style={ModalStyles.buttonContainer}>
                            <TouchableHighlight onPress={() => { console.debug('hello',index); closeModal() }} style={ModalStyles.okButton}>
                                <Text style={ModalStyles.okButtonText}>OK</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>)
        });
        
        return (
            <View style={BaseStyles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#121211"/>
                <View style={{flex:1}}>
                    {modals}
                    <AppContext.Provider value={{apiClient: this.apiClient, clearMiddlewareNamespace: this.clearMiddlewareNamespace, addMiddleware: this.addMiddleware, triggerMiddleware: this.triggerMiddleware, logout: this.logout, createModal: this.createModal}}>
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



