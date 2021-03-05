import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';
import { Client } from 'sosa-chat-client';
import AppConfig from '../config';
import io from 'socket.io-client';
import { parseString as parseXMLString} from 'react-native-xml2js';
import jwt from 'react-native-pure-jwt';
import { useApp } from './AppContext';

const APIContext = createContext();

class StaticClient {
    static instance = null;
    static getInstance(session, device, setSession, setDevice, validateSession, middleware) {
        if (StaticClient.instance == null) {
            StaticClient.instance = new Client(
                {errors: AppConfig.errors, providers: AppConfig.providers},
                io,
                (response) => new Promise((resolve, reject) => {
                        parseXMLString(response, function (err, result) {
                            if(err) reject(err);
                            else{ resolve(result); }
                        });
                    }
                ),
                {
                    getDevice: () =>  new Promise(resolve => resolve(device)),
                    updateDevice: (updatedDevice) => new Promise((resolve, reject) => {
                        console.info('App::updateDevice', device, updatedDevice);
                        setDevice(updatedDevice);
                        resolve(updatedDevice);
                    }),
                    getSession: () => new Promise(resolve => resolve(session)),
                    updateSession: (updatedSession) => new Promise((resolve, reject) => {
                        setSession(updatedSession);
                        resolve(updatedSession);
                    }),
                    generateJWT: (packet) => {
                        if(!device?.secret) throw new Error('Device not initialized');
                        return jwt.sign(packet, device.secret, {alg: "HS256"});
                    },
                    reauth: () => validateSession(),
                    authFailed: () => {
                        middleware.trigger('logout', 'authentication_failed')
                            .finally(() => resolve('authentication_failed'));
                    }
                }
            );
        }
        
        return this.instance;
    }
}


const APIProvider = (props) => {
    
    const { middleware, session, device, setSession, setDevice } = useApp();
    
    const [ client, setClient ] = useState(StaticClient.getInstance(session, device, setSession, setDevice, validateSession, middleware));
    
    const validateSession = () => {
        const { services: { auth } } = client;
        
        return auth.validateSession().catch((error) => {
            console.debug('error', error);
            if(session.id.length > 0){
                return auth.deviceLogin(device.id);
            }else{
                throw error;
            }
        });
    }
    
    useEffect(() => {
        console.debug('Re-rendering API Context');
        client.middleware.clear('api');
        client.middleware.add('api', {
            'event': (packet) => {
                return new Promise((resolve) => {
                    middleware.trigger('api_event', packet)
                        .finally(() => resolve(packet));
                });
            },
            'authentication_successful': (authData) => {
                return new Promise((resolve) => {
                    middleware.trigger('api_authenticated', authData)
                        .finally(() => resolve(authData));
                });
            },
            'disconnected': (message) => {
                return new Promise((resolve) => {
                    middleware.trigger('api_disconnected', message)
                        .finally(() => resolve(message));
                });
            }
        });
        return () => middleware.clear('app');
    }, []);
    
    if(!client) return <></>;
    return (
        <APIContext.Provider value={{ validateSession, ...client }} {...props}/>
    );
};

const useAPI = () => useContext(APIContext);

export { APIProvider, useAPI };
