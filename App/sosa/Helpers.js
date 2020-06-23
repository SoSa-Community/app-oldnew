import {Alert} from 'react-native';
import {SoSaConfig} from "./config";
import Device from "./Device";
import Session from "./Session";
import jwt from "react-native-pure-jwt";

export default class Helpers {

    static authCheck = (callback) => {
        Device.getInstance().init(device => {
            Session.getInstance().init(session => {
                Helpers.validateSession((error) => {
                    callback(device, session, error);
                });
            });
        });
    };

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
        console.log('Request URI', uri);
        console.log('Request Data', data);
        let headers = {
            method: post?'POST':'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };


        let doRequest = () => {

            if(data){
                if(post){
                    headers.body = JSON.stringify(data);
                }else{
                    let keyValues = [];
                    data.forEach((value, key) => keyValues.push(`${key}=${value}`));
                    uri += `?${keyValues.join('&')}`;
                }
            }

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

        if(['login'].indexOf(namespace) === -1){
            let device = Device.getInstance();

            if(session.getId() !== null && session.getId().length > 0){
                headers.headers['session-id'] = session.getId();
                if(session.hasExpired())    headers.headers['refresh-token'] = session.getRefreshToken();
            }

            if(device.getId().length > 0){
                return jwt.sign({device_id: device.getId()}, device.getSecret(), {alg: "HS256"})
                    .then((token) => {
                        headers.headers['token'] = token;
                        return doRequest();
                    });
            }else{
                return doRequest();
            }
        }else{
            return doRequest();
        }
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
        let sessionInstance = Session.getInstance();

        Helpers.request('validate', {}, false)
        .then((json) => {
            if(json.error){
                error = new Error('Invalid session');
            }else{
                if(json.response.session){
                    sessionInstance.fromJSON(json.response.session);
                }
                if(json.response.user){
                    sessionInstance.username = json.response.user.username;
                    sessionInstance.nickname = json.response.user.nickname;
                }
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
                        sessionInstance.username = json.response.user.username;
                        sessionInstance.nickname = json.response.user.nickname;

                        onSuccessCallback(json);
                    }
                })
                .catch((e) => {
                    console.log(e);
                    onErrorCallback(e.message);
                })
                .finally(() => {
                    loadingCallback(false);
                });

        }catch(e){
            loadingCallback(false);
        }
    };

    static handlePreauth(loadingCallback, onErrorCallback, onSuccessCallback){
        let deviceInstance = Device.getInstance();

        loadingCallback(true);
        try{
            let namespace = 'preauth/create';

            let data = {
                device_secret: deviceInstance.getSecret(),
                device_name: deviceInstance.getName(),
                device_platform: deviceInstance.getPlatform()
            };

            Helpers.request(namespace, data)
                .then((json) => {
                    let error = '';
                    if(json.error){
                        error = json.error.message;
                        onErrorCallback(error);
                    }
                    else{
                        onSuccessCallback(json);
                    }
                })
                .catch((e) => {
                    console.log(e);
                    onErrorCallback(e.message);
                })
                .finally(() => {
                    loadingCallback(false);
                });

        }catch(e){
            loadingCallback(false);
        }
    };

    static deviceLogin(deviceId, loadingCallback, onErrorCallback, onSuccessCallback){
        let deviceInstance = Device.getInstance();
        let sessionInstance = Session.getInstance();

        loadingCallback(true);
        try{
            let namespace = 'device/login';

            jwt
                .sign({device_id: deviceId}, deviceInstance.getSecret(), {alg: "HS256"})
                .then((token) => {
                    let data = {
                        device_id: deviceId,
                        token: token
                    };
                    console.log(data);

                    Helpers.request(namespace, data)
                        .then((json) => {
                            console.log(json);
                            let error = '';
                            if(json.error){
                                error = json.error.message;
                                onErrorCallback(error);
                            }
                            else{
                                deviceInstance.setId(deviceId);
                                deviceInstance.save();

                                sessionInstance.fromJSON(json.response.session);
                                sessionInstance.username = json.response.user.username;
                                sessionInstance.nickname = json.response.user.nickname;
                                onSuccessCallback(json);
                            }
                        })
                        .catch((e) => {
                            console.log(e);
                            onErrorCallback(e.message);
                        })
                        .finally(() => {
                            loadingCallback(false);
                        });
                }) // token as the only argument
                .catch(console.error); // possible errors
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

    static base64Decode(input) {
        let keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = null;
        let chr1, chr2, chr3 = "";
        let enc1, enc2, enc3, enc4 = "";
        let i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        let base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (!base64test.exec(input)) {
            output = "";
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);
        }
        return output;
    }
};
