import AsyncStorage from '@react-native-community/async-storage';

export default class Session {
	id = '';
	expiry = '';
	refresh_token = '';
	username = '';
	nickname = '';

	static init() {
		return new Promise((resolve, reject) => {
			let session = new Session();

			Session.retrieve((obj) => {
				console.info('App::Session::init', obj);
				if (obj !== null)
					obj.forEach((value, key) => (session[key] = value));
				resolve(session);
			});
		});
	}

	getExpiry() {
		return this.expiry;
	}

	setExpiry(expiry) {
		this.expiry = expiry;
	}

	getParsedExpiry() {
		let date = new Date(Date.parse(this.getExpiry().replace(/-/g, '/')));
		if (isNaN(date)) {
			date = null;
		}

		return date;
	}

	hasExpired() {
		let parsedExpiry = this.getParsedExpiry();
		return (
			parsedExpiry === null ||
			parsedExpiry.getTime() >= new Date().getUTCMilliseconds()
		);
	}

	logout() {
		return new Promise((resolve) => {
			this.expiry = null;
			this.id = null;
			this.refresh_token = null;
			this.username = null;
			this.nickname = null;
			this.save(() => {
				resolve();
			});
		});
	}

	static retrieve(callback) {
		try {
			AsyncStorage.getItem('current_session').then((value) => {
				let obj = null;
				if (typeof value === 'string') obj = JSON.parse(value);
				callback(obj);

				console.info('App::Session::retrieve', obj);
			});
		} catch (e) {
			console.error('App::Session::retrieve', e);
		}
	}

	save(callback) {
		try {
			console.info('App::Session::save', this);
			AsyncStorage.setItem(
				'current_session',
				JSON.stringify(this),
				callback,
			);
		} catch (e) {
			console.error('App::Session::retrieve', e);
		}
	}

	parseJSON(jsonData) {
		jsonData.forEach((value, key) => {
			if (this.hasOwnProperty(key)) this[key] = value;
		});
		this.save();
	}
}
