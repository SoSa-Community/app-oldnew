import {Alert} from 'react-native';
import APIError from "./APIError";

export default class Helpers {

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

	static validatePassword(password){
		if(typeof(password) === 'string') {
			if (password.length >= 8) {
				return true;
			}else if(password.length === 0){
				return false;
			}
		}
		throw new APIError('Password must be at-least 5 characters');
	};

	static base64Decode(input) {
        return atob(input.replace(/[^A-Za-z0-9\+\/\=]/g, ""));
	}
};
