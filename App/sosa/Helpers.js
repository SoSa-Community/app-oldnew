import {Alert} from 'react-native';
import {SoSaConfig} from "./config";
import Device from "./Device";
import Session from "./Session";
import jwt from "react-native-pure-jwt";
import APIError from "./APIError";

export default class Helpers {

	static authCheck = (callback) => {
		Device.getInstance().init(device => {
			Session.getInstance().init(session => {
				Helpers.validateSession((error, user) => {
					callback(error, device, session, user);
				});
			});
		});
	};

	static fetchWithTimeout = (url, options, timeout) => {
		if(typeof(timeout) === "undefined") timeout = 10000;

		let fetchPromise = fetch(url, options);
		return new Promise((resolve, reject) => {
			if(timeout !== null)    setTimeout(() => reject('Network Timed Out'), timeout);
			fetchPromise.then(resolve, reject);
		});
	};

	static request = (namespace, data, post=true) => {
		let session = Session.getInstance();

		let uri = `${SoSaConfig.auth.server}/${namespace}`;
		console.debug('Request URI', uri);
		console.debug('Request Data', data);

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

			console.debug('Request Headers', headers);
			return Helpers.fetchWithTimeout(uri, headers).then((response) => {
				console.debug('Response', response);
				try {
					return response.json();
				}catch (e) {
					console.debug('Response Error', e);
				}
			}).then((json) => {
				console.debug('JSON', json);
				if(json.session)    session.fromJSON(json.session);

				return json;
			})
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
		let user, session;

		Helpers.request('validate', {}, false)
			.then((json) => {
				if(json.error){
					error = new APIError('Invalid session');
				}else{
					const {response} = json;
					if(response){
						user = response?.user;
						session = response?.session;

						if(session) sessionInstance.fromJSON(session);
						if(user){
							const {username, nickname} = user;
							sessionInstance.username = username;
							sessionInstance.nickname = nickname;
						}
					}
				}
			})
			.catch((e) => {
				error = e;
			})
			.finally(() => {
				callback(error, user, session);
			});
	}

	static logout(callback){
		let error = null;

		Helpers.request('logout', {}, false)
			.then((json) => {
				if(json.error){error = new APIError(json.error.message);}
			})
			.catch((e) => {
				error = e;
			})
			.finally(() => {
				callback(error);
			});
	}

	static handleLogin(username, password, setIsLoading, callback){
		this.handleLoginRegister(username, password, null, setIsLoading, callback);
	}

	static handleRegister(username, password, email, setIsLoading, callback){
		this.handleLoginRegister(username, password, email, setIsLoading, callback);
	}

	static handleLoginRegister(username, password, email, loadingCallback, callback){
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

			this.handleAuthRequest(namespace, data, loadingCallback, callback);

		}catch(e){
			loadingCallback(false);
			callback(e, null);
		}
	};

	static deviceLogin(deviceId, loadingCallback, callback){
		let deviceInstance = Device.getInstance();

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
					this.handleAuthRequest(namespace, data, loadingCallback, callback);

				}) // token as the only argument
				.catch((e) => {
					console.debug('Device JWT Error', e);
					callback(new APIError(e));
				}); // possible errors
		}catch(e){
			loadingCallback(false);
			callback(e);
		}
	};

	static linkPreauth(preauthId, linkToken, loadingCallback, callback){
		let deviceInstance = Device.getInstance();
		loadingCallback(true);

		try{
			let namespace = 'login/link';
			let errorResponse = null;
			let jsonResponse = null;

			jwt
				.sign({link_token: linkToken}, deviceInstance.getSecret(), {alg: "HS256"})
				.then((token) => {
					Helpers.request(namespace, { preauth_id: preauthId, token: token })
						.then((json) => {
							if (json.error) errorResponse = new APIError(json.error.message);
							jsonResponse = json;
						})
						.catch((e) => {
							errorResponse = new APIError(e);
						})
						.finally(() => {
							loadingCallback(false);
							callback(errorResponse, jsonResponse);
						});
				});
		}catch(e){
			loadingCallback(false);
			callback(e);
		}
	};

	static handleAuthRequest(namespace, data, loadingCallback, callback){
		let deviceInstance = Device.getInstance();
		let sessionInstance = Session.getInstance();

		let errorResponse = null;
		let jsonResponse = null;

		Helpers.request(namespace, data)
			.then((json) => {
				console.debug('Device login', json);

				if(json.error) errorResponse = new APIError(json.error.message);
				else{
					jsonResponse = json;

					const {response: {device_id, session, user: {username, nickname}} } = json;

					deviceInstance.setId(device_id);
					deviceInstance.save();

					sessionInstance.fromJSON(session);
					sessionInstance.username = username;
					sessionInstance.nickname = nickname;
				}
			})
			.catch((e) => {
				console.debug('Device Login Error', e);
				errorResponse = new APIError(e);
			})
			.finally(() => {
				loadingCallback(false);
				callback(errorResponse, jsonResponse);
			});
	}

	static handlePreauth(loadingCallback, callback){
		let deviceInstance = Device.getInstance();

		loadingCallback(true);
		try{
			let namespace = 'preauth/create';

			let data = {
				device_secret: deviceInstance.getSecret(),
				device_name: deviceInstance.getName(),
				device_platform: deviceInstance.getPlatform()
			};

			let errorResponse = null;
			let jsonResponse = null;

			Helpers.request(namespace, data)
				.then((json) => {
					if(json.error){
						errorResponse = new APIError(json.error.message);
					}
					else{
						jsonResponse = json;
					}
				})
				.catch((e) => {
					console.debug('Preauth Error', e);
					errorResponse = new APIError(e);
				})
				.finally(() => {
					loadingCallback(false);
					callback(errorResponse, jsonResponse);
				});

		}catch(e){
			loadingCallback(false);
		}
	};

	static confirmWelcome(callback, username, email){
		let errors = null;
		let jsonResponse = null;
		let sessionInstance = Session.getInstance();

		Helpers.request('login/welcome', {username, email}, true)
			.then((json) => {
				jsonResponse = json;
				if(Array.isArray(json?.errors)){
					errors = [];
					json?.errors.forEach((error) => errors.push(APIError.fromJSON(error)));
				}else{
					const {response: {user: {username, nickname}} } = json;

					sessionInstance.username = username;
					sessionInstance.nickname = nickname;
				}
			})
			.catch((e) => {
				console.debug('Welcome Error', e);
				errors = [e];
			})
			.finally(() => {
				callback(errors, jsonResponse);
			});
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
