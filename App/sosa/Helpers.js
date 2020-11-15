import {Alert} from 'react-native';
import APIError from "./APIError";
import ImagePicker from "react-native-image-picker";

export default class Helpers {

	static generateRand = () => {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	};

	static generateId = () => {
		return `${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}`;
	};

	static showAlert = (title, message) => {
	    if(typeof(message) !== 'string'){
	        message = '';
        }
		Alert.alert(title, message,[{text: 'OK', onPress: () => console.log('OK Pressed')}],{cancelable: true});
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
    
    static uploadFile = (apiClient, communityId, isUploading) => {
	    return new Promise((resolve, reject) => {
            const { services: { general } } = apiClient;
        
            if(typeof(isUploading) !== 'function') isUploading = () => {};
            
            const doUpload = (file) => {
                isUploading(true);
                general.handleUpload(communityId, file).then(resolve).catch((errors) => {
                    console.info('App::UploadFile::error', errors);
                    reject(errors);
                }).finally(() => {
                    isUploading(false);
                });
            };
        
            let options = {
                title: 'Upload',
                takePhotoButtonTitle: 'Take a Photo',
                chooseFromLibraryButtonTitle: 'Select From Gallery',
                storageOptions: {
                    skipBackup: true
                },
            };
        
            ImagePicker.showImagePicker(options, async (response) => {
                if (response.didCancel) {
                    reject(new Error('user_cancelled'));
                } else if (response.error) {
                    reject(response.error);
                } else if (response.customButton) {
                    reject(new Error('custom_button'));
                } else {
                    let {uri, fileName, type} = response;
                
                    if(!fileName){
                        const uriSplit = uri.split('/');
                        fileName = uriSplit[uriSplit.length - 1];
                    }
                
                    const file = {uri, type, name: fileName};
                    doUpload(file);
                }
            });
        })
        
    };
};
