import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';
import {Alert, Linking} from 'react-native';

import { useAPI } from './APIContext';
import { useApp } from './AppContext';

let preauthID = null;

const AuthContext = createContext();
const AuthProvider = (props) => {
    const { appInitialized, middleware, session } = useApp();
    const { validateSession, services: { auth: authService } } = useAPI();
    
    const [ authenticated, setAuthenticated ] = useState(false);
    const [ user, setUser ] = useState(null);
    const [ validatingLogin, setValidatingLogin ] = useState(true);
    
    const logout = (sessionAutoExpired) => {
        
        let clearSession = () => {
            session.logout().then(() => setUser(null)).catch(error => {
                console.debug(error);
            });
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
    
    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            if(!username) reject(new Error('provide_username'));
            else if(!password) reject(new Error('provide_password'))
            else {
                authService.login(username, password)
                    .then((response) => {
                        completeLogin(response)
                        resolve(response);
                    })
                    .catch((error) => reject(error))
            }
        })
    };
    
    const register = (username, password, email) => {
        return new Promise((resolve, reject) => {
            if(!username) reject(new Error('provide_username'));
            else if(!password) reject(new Error('provide_password'))
            else if(!email) reject(new Error('provide_email'))
            else {
                authService.register(username, password, email)
                    .then((response) => {
                        completeLogin(response)
                        resolve(response);
                    })
                    .catch((error) => reject(error))
            }
        })
    };
    
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
    
    const socialLogin = (forLogin, network) => {
        return authService.createPreauth()
            .then(id => {
                preauthID = id;
                Linking.openURL(authService.getPreauthURI(forLogin ? 'login' : 'register', network, id));
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
            setValidatingLogin(true);
            
            validateSession()
                .then((json) => completeLogin(json))
                .catch(() => setUser(null))
                .finally(() => {
                    setValidatingLogin(false);
                });
    
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
    
    useEffect(() => {
        console.debug('Re-rendering AUTH Context');
    }, []);
    
    return (
        <AuthContext.Provider value={{ login, register, validatingLogin, socialLogin, authenticated, user, linkPreauth, deviceLogin, logout }} {...props} />
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
