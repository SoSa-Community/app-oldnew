import {Alert} from 'react-native';
import {SoSaConfig} from "./config";
import Device from "./Device";
import Session from "./Session";

export default class Helpers {

    static fetchWithTimeout = (url, options, timeout) => {
        if(typeof(timeout) === "undefined") timeout = 3000;

        let fetchPromise = fetch(url, options);
        return new Promise((resolve, reject) => {
            if(timeout !== null)    setTimeout(() => reject('Network Timed Out'), timeout);
            fetchPromise.then(resolve, reject);
        });
    };

    static request = (namespace, data, post=true) => {
        let session = Session.getInstance();

        let uri = `${SoSaConfig.auth.server}/${namespace}`;
        let headers = {
            method: post?'POST':'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };

        if(['login'].indexOf(namespace) === -1){
            let device = Device.getInstance();

            if(session.getId() !== null && session.getId().length > 0){
                headers.headers['session-id'] = session.getId();
                if(session.hasExpired())    headers.headers['refresh-token'] = session.getRefreshToken();
            }

            if(device.getId().length > 0)   headers.headers['token'] = device.getId();
        }

        console.log('Headers', headers);

        if(data){
            if(post){
                headers.body = JSON.stringify(data);
            }else{
                let keyValues = [];
                console.log(data);
                data.forEach((value, key) => keyValues.push(`${key}=${value}`));
                uri += `?${keyValues.join('&')}`;
            }
        }

        console.log('API Request', namespace, data, uri);

        return Helpers.fetchWithTimeout(uri, headers).then((response) => {
            console.log('Response', response);
            try {
                return response.json();
            }catch (e) {
                console.log(e);
            }
        }).then((json) => {
            console.log('JSON', json);
            if(json.session)    session.fromJSON(json.session);

            return json;
        });
    };

    static generateRand = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    static generateId = () => {
        return `${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}`;
    };

    static showAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: true},
        );
    }

    static validateSession(callback){
        let error = null;

        Helpers.request('validate', {}, false)
        .then((json) => {
            if(json.error){error = new Error(json.error.message);}
            else if(json.response.logged_in === false){
                error = new Error('Invalid session');
            }
        })
        .catch((e) => {
            error = e;
        })
        .finally(() => {
            callback(error);
        });
    }

    static logout(callback){
        let error = null;

        Helpers.request('logout', {}, false)
            .then((json) => {
                if(json.error){error = new Error(json.error.message);}
            })
            .catch((e) => {
                error = e;
            })
            .finally(() => {
                callback(error);
            });
    }

    static handleLogin(username, password, setIsLoading, onErrorCallback, onSuccessCallback){
        this.handleLoginRegister(username, password, null, setIsLoading, onErrorCallback, onSuccessCallback);
    }

    static handleRegister(username, password, email, setIsLoading, onErrorCallback, onSuccessCallback){
        this.handleLoginRegister(username, password, email, setIsLoading, onErrorCallback, onSuccessCallback);
    }

    static handleLoginRegister(username, password, email, loadingCallback, onErrorCallback, onSuccessCallback){
        let deviceInstance = Device.getInstance();
        let sessionInstance = Session.getInstance();

        loadingCallback(true);
        try{
            let namespace = 'login';

            let data = {
                username: username,
                password: password,
                device_secret: deviceInstance.getSecret(),
                device_name: deviceInstance.getName(),
                device_platform: deviceInstance.getPlatform()
            };

            console.log(data);
            console.log(email);
            if(email !== null){
                namespace = 'register';
                data.email = email;
                data.login = true;
            }

            Helpers.request(namespace, data)
                .then((json) => {
                    let error = '';
                    if(json.error){
                        error = json.error.message;
                        onErrorCallback(error);
                    }
                    else{
                        deviceInstance.setId(json.response.device_id);
                        deviceInstance.save();

                        sessionInstance.fromJSON(json.response.session);
                        onSuccessCallback(json);
                    }
                })
                .catch((e) => {
                    console.log(e);
                    onErrorCallback(e.getMessage());
                })
                .finally(() => {
                    loadingCallback(false);
                });

        }catch(e){
            loadingCallback(false);
        }
    };

    static validatePassword(password){
        if(typeof(password) === 'string') {
            if (password.length >= 8) {
                return true;
            }else if(password.length === 0){
                return false;
            }
        }
        throw new Error('Password must be at-least 5 characters');
    };
};
