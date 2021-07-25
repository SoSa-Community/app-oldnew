import { Alert } from 'react-native';
import ImageCropPicker, { openCamera } from 'react-native-image-crop-picker';

import APIError from './APIError';
import AppConfig from '../config';
import { SoSaError } from '../services/API/entities/SoSaError';
import BottomSheet from 'react-native-bottomsheet';

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

	static uploadFile = ({
		handleUpload,
		beforeUpload,
		title = 'Crop photo',
		mediaType = 'photo',
		cropping = false,
		croppingHeight = 600,
		croppingWidth = 600,
	}) => {
		return new Promise(async (resolve, reject) => {
			const fileTooBigError = () => {
				reject(
					new SoSaError('file_to_big', 'The max image size is 10mb'),
				);
			};

			const { maxFileSize } = AppConfig;

			const doUpload = async (file) => {
				try {
					const response = await handleUpload(file);
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

					if (message.length && message !== 'user_cancelled') {
						reject(new SoSaError(message, message));
					} else {
						reject(errors);
					}
				}
			};

			try {
				const options = {
					cropperToolbarTitle: title,
					avoidEmptySpaceAroundImage: true,
					mediaType,
					cropping,
					includeBase64: true
				};

				if (cropping) {
					options.width = croppingWidth;
					options.height = croppingHeight;
				}

				BottomSheet.showBottomSheetWithOptions(
					{
						options: ['Camera', 'Phone'],
						title: 'Where from?',
						dark: true,
						cancelButtonIndex: 3,
					},
					async (value) => {
						const response = await ImageCropPicker[
							value ? 'openPicker' : 'openCamera'
						](options);

						if (Math.floor(response?.size / 1024) > maxFileSize)
							return fileTooBigError();

						try {
							if (beforeUpload) await beforeUpload(response);

							let {
								path,
								filename,
								mime,
								data,
								height,
								width,
								exif,
								duration,
							} = response;

							if (!filename) {
								const uriSplit = path.split('/');
								filename = uriSplit[uriSplit.length - 1];
							}

							try {
								const file = {
									uri: path,
									type: mime,
									name: filename,
								};
								await doUpload(file);
							} catch (e) {
								reject(e);
							}
						} catch (e) {
							console.debug(e);
						}
					},
				);
			} catch (e) {
				if (e?.message === 'User cancelled image selection')
					e.message = 'user_cancelled';
				reject(e);
			}
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
