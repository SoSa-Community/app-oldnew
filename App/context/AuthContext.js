import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';
import {Alert, Linking} from 'react-native';

import { useAPI } from './APIContext';
import Session from '../sosa/Session';
import {useApp} from './AppContext';


const AuthContext = createContext();

const AuthProvider = (props) => {
    const { appInitialized, middleware } = useApp();
    const { validateSession, client } = useAPI();
    const { services: { auth: authService } } = client;
    
    const [ authenticated, setAuthenticated ] = useState(false);
    const [ user, setUser ] = useState(null)
    
    let preauthID = null;
    
    const logout = (sessionAutoExpired) => {
        const { services: { auth: authService } } = client;
        
        let clearSession = () => {
            let session = Session.getInstance();
            session.logout().then(() => setUser(null));
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
                            authService.logout()
                                .catch((error) => console.debug('App::logout', error))
                        } }
                ],
                { cancelable: true }
            );
        }
    };
    
    
    const completeLogin = (json) => {
        const { user } = json;
        setUser(user);
    }
    
    const deviceLogin = (device_id) => {
        return new Promise((resolve, reject) => {
            authService.deviceLogin(device_id)
                .then(json => {
                    completeLogin(json);
                    resolve(json);
                })
                .catch(error => reject(error));
        });
    };
    
    const linkPreauth = (linkToken) => {
        console.debug(linkToken);
        return new Promise((resolve, reject) => {
            authService.linkPreauth(preauthID, linkToken)
                .then(json => {
                    completeLogin(json);
                    resolve(json);
                })
                .catch(error => reject(error));
        });
    }
    
    const socialLogin = (type, network) => {
        return authService.createPreauth()
            .then(id => {
                preauthID = id;
                Linking.openURL(authService.getPreauthURI(type, network, id));
                return id;
            })
    }
    
    useEffect(() => {
        if(user) setAuthenticated(true);
        else setAuthenticated(false);
    }, [user])
    
    useEffect(() => {
        setUser(null);
    
        if(appInitialized) {
            validateSession()
                .then((json) => completeLogin(json))
                .catch(() => setUser(null));
    
            middleware.add('app', {
                'logout': (message) => {
                    return new Promise((resolve) => {
                        logout(message === 'authentication_failed');
                        resolve(message);
                    });
                }
            });
            return () => middleware.clear('app')
        }
        
    }, [appInitialized]);
    
    return (
        <AuthContext.Provider value={{ socialLogin, authenticated, user, linkPreauth, deviceLogin, logout }} {...props} />
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
