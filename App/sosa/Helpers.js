import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import APIError from './APIError';
import AppConfig from '../config';

export default class Helpers {
	static generateRand = () => {
		return (
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)
		);
	};

	static generateId = () => {
		return `${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}`;
	};

	static showAlert = (title, message) => {
		if (typeof message !== 'string') {
			message = '';
		}
		Alert.alert(
			title,
			message,
			[{ text: 'OK', onPress: () => console.log('OK Pressed') }],
			{ cancelable: true },
		);
	};

	static validatePassword(password) {
		if (typeof password === 'string') {
			if (password.length >= 8) {
				return true;
			} else if (password.length === 0) {
				return false;
			}
		}
		throw new APIError('Password must be at-least 5 characters');
	}

	static base64Decode(input) {
		if (typeof atob !== 'function') {
			let keyStr =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
			let output = null;
			let chr1,
				chr2,
				chr3 = '';
			let enc1,
				enc2,
				enc3,
				enc4 = '';
			let i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			let base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (!base64test.exec(input)) {
				output = '';
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

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

					chr1 = chr2 = chr3 = '';
					enc1 = enc2 = enc3 = enc4 = '';
				} while (i < input.length);
			}
			return output;
		}
		// eslint-disable-next-line no-undef
		return atob(input.replace(/[^A-Za-z0-9\+\/\=]/g, ''));
	}

	static uploadFile = (
		createModal,
		generalService,
		communityId,
		isUploading,
		beforeUpload,
	) => {
		return new Promise((resolve, reject) => {
			if (typeof isUploading !== 'function') isUploading = () => {};

			const fileTooBigError = () => {
				isUploading(false);
				const title = "Ooops! that's a bit too big!";
				const message = 'The max image size is 10mb';
				createModal(title, message);
			};

			const { maxFileSize } = AppConfig;

			const doUpload = async (file) => {
				isUploading(true);

				try {
					const response = await generalService.handleUpload(
						communityId,
						file,
					);
					resolve(response);
				} catch (errors) {
					console.info('App::UploadFile::error', errors);

					const code = errors?.message?.Code;
					let title = 'Error uploading image';
					let message = '';

					if (Array.isArray(code)) {
						if (code[0] === 'EntityTooLarge') {
							return fileTooBigError();
						} else {
							message = 'Invalid image';
						}
					} else {
						message = errors?.message;
					}

					if (message.length && message !== 'user_cancelled')
						createModal(title, message);

					reject(errors);
				} finally {
					isUploading(false);
				}
			};

			let options = {
				title: 'Upload',
				takePhotoButtonTitle: 'Take a Photo',
				chooseFromLibraryButtonTitle: 'Select From Gallery',
				storageOptions: {
					skipBackup: true,
				},
			};

			ImagePicker.showImagePicker(options, async (response) => {
				if (response.didCancel)
					return reject(new Error('user_cancelled'));
				if (response.error) return reject(response.error);
				if (response.customButton)
					return reject(new Error('custom_button'));

				if (Math.floor(response?.fileSize / 1024) > maxFileSize)
					return fileTooBigError();

				try {
					if (beforeUpload) await beforeUpload(response);

					let {
						uri,
						fileName,
						fileSize,
						type,
						data,
						height,
						width,
						originalRotation,
					} = response;

					if (!fileName) {
						const uriSplit = uri.split('/');
						fileName = uriSplit[uriSplit.length - 1];
					}

					try {
						const file = { uri, type, name: fileName };
						await doUpload(file);
					} catch (e) {
						reject(e);
					}
				} catch (e) {
					console.debug(e);
				}
			});
		});
	};

	static dateToString(date, type) {
		if (type === 'date') {
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (month < 10) month = `0${month}`;
			if (day < 10) day = `0${day}`;

			return `${date.getFullYear()}-${month}-${day}`;
		} else {
			let hour = date.getHours();
			let minute = date.getMinutes();

			if (hour < 10) hour = `0${hour}`;
			if (minute < 10) minute = `0${minute}`;

			return `${hour}:${minute}`;
		}
	}

	static dateToLongForm(dateTime) {
		const nth = function (d) {
			if (d > 3 && d < 21) return 'th';
			switch (d % 10) {
				case 1:
					return 'st';
				case 2:
					return 'nd';
				case 3:
					return 'rd';
				default:
					return 'th';
			}
		};

		const wd = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(
			dateTime,
		);
		const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
			dateTime,
		);
		const mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(
			dateTime,
		);
		const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(
			dateTime,
		);

		return `${wd}, ${da}${nth(da)} ${mo} ${ye}`;
	}
}
