import {Alert} from 'react-native';

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
};
