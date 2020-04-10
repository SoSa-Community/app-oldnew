import {Alert} from 'react-native';
import {SoSaConfig} from "./config";

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

        let uri = `${SoSaConfig.auth.server}/${namespace}`;
        let headers = {
            method: post?'POST':'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };
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
};
