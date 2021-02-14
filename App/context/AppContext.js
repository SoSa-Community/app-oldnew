import React, {
    createContext,
    useContext,
    useState,
    useEffect
} from 'react';
import {AppState, Linking, Modal, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import Session from '../sosa/Session';
import Device from '../sosa/Device';
import SplashScreen from '../screens/Splash';
import Helpers from '../sosa/Helpers';

const AppContext = createContext();
const middleware = {};

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

const AppProvider = ({children, ...props}) => {
    const [session, setSession] = useState(null);
    const [device, setDevice] = useState(null);
    
    const [appInitialized, setAppInitialized] = useState(false);
    const [ appState, setAppState ] = useState(AppState.currentState);
    const [ modals, setModals ] = useState([]);
    
    const triggerMiddleware = (event, data) => {
        return new Promise((resolve, reject) => {
            if(event){
                let callbacks = [];
                console.debug('App::Middleware::trigger::namespace', event, middleware);
                
                for(const namespace in middleware){
                    if(middleware[namespace].hasOwnProperty(event)){
                        callbacks = [...callbacks, ...Object.values(middleware[namespace][event]).map((middleware) =>
                            new Promise((resolve1, reject1) => {
                                middleware(data, event);
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
    
    const addMiddleware = (namespace, event, callback, onlyOneAllowed=false) => {
        if(!namespace.length) namespace = 'global';
        
        let add = (event, callback) => {
            if(!middleware[event] || onlyOneAllowed) middleware[event] = [];
            
            if(!middleware[namespace]) middleware[namespace] = {};
            if(!middleware[namespace][event]) middleware[namespace][event] = [];
            middleware[namespace][event].push(callback);
        };
        
        if(typeof(event) === 'string'){
            add(event, callback);
        }else{
            event.forEach((callback, event) => add(event, callback));
        }
    };
    
    const clearMiddleware = (namespace) => middleware[namespace] = {};
    
    const setAndSaveSession = (session) => {
        session.save();
        setSession(session);
    };
    
    const setAndSaveDevice = (device) => {
        device.save();
        setDevice(device);
    };
    
    const handleDeepLink = ({url}, coldBoot = false) => {
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
                
                triggerMiddleware(`${namespace}/${method}`, data);
            }
        }
    };
    
    const _handleAppStateChange = nextAppState => setAppState(nextAppState);
    Linking.getInitialURL().then((result) => handleDeepLink({url: result}, true));
    
    const createModal = (title, description, onClose) => {
        let existingModals = [...modals];
        existingModals.push({title, description, onClose});
        setModals(existingModals);
    };
    
    const renderModals = () => {
        modals.map((modal, index) => {
            const {title, description} = modal;
            
            const closeModal = () => {
                let existingModals = [...modals];
                existingModals.splice(index, 1);
                setModals(existingModals);
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
    }
    
    useEffect(() => {
        setAppInitialized(false);
        
        Device.init()
                .then(device => {
                    setAndSaveDevice(device);
                    return Session.init()
                        .then(session => {
                            console.debug('returned', session);
                            setAndSaveSession(session)
                        });
                })
    }, []);
    
    useEffect(() => {
        if(appInitialized) {
            AppState.addEventListener("change", _handleAppStateChange);
            Linking.addEventListener('url', handleDeepLink);
    
            return () => {
                AppState.removeEventListener("change", _handleAppStateChange);
                Linking.removeEventListener('url', handleDeepLink);
            }
        }
    }, [appInitialized])
    
    useEffect(() => {
        console.debug(session, device);
        if(session && device && device.secret) {
            setAppInitialized(true);
        }
    }, [session, device])
    
    if(!appInitialized) return <SplashScreen />;
    
    return (
        <AppContext.Provider value={{
            session,
            device,
            setSession: setAndSaveSession,
            setDevice: setAndSaveDevice,
            middleware: {
                add: addMiddleware,
                trigger: triggerMiddleware,
                clear: clearMiddleware
            },
            modals: {
                create: createModal
            },
            appInitialized
        }}
        {...props}
        >
            { renderModals() }
            { children }
        </AppContext.Provider>
    );
};

const useApp = () => useContext(AppContext);

export { AppProvider, useApp };
