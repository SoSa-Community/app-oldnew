import {
	getDeviceName,
	getSystemName,
	getBrand,
	getModel,
} from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';

export default class Device {
	initialized = false;
	id = '';
	secret = '';
	name = '';
	platform = 'other';
	pushService = 'other';

	static init() {
		return new Promise((resolve, reject) => {
			let device = new Device();

			Device.retrieve((obj) => {
				console.info('App::Device::init', obj);

				if (obj !== null && obj?.secret) {
					obj.forEach((value, key) => (device[key] = value));
					device.initialized = true;
					resolve(device);
				} else {
					let platform = 'other';
					let pushService = 'other';

					switch (getSystemName()) {
						case 'Android':
							pushService = platform = 'android';
							break;
						case 'iOS':
						case 'iPhone IS':
							pushService = platform = 'ios';

							break;
					}

					device.setPlatform(platform);
					device.setPushService(pushService);
					device.setSecret(device.generateSecret());

					getDeviceName()
						.then((deviceName) => {
							let name = [];
							let brand = getBrand();
							let model = getModel();

							if (brand) name.push(brand);
							if (model) name.push(model);

							let fullName = `${name.join(' ')}`;

							if (deviceName)
								fullName = `${deviceName} (${fullName})`;

							device.setName(fullName);
							device.save();
							device.initialized = true;
						})
						.finally(() => resolve(device));
				}
			});
		});
	}

	getId = () => {
		return this.id;
	};

	setId = (id) => {
		this.id = id;
	};

	getSecret() {
		return this.secret;
	}

	setSecret(secret) {
		this.secret = secret;
	}

	generateSecret() {
		return 'sausage';
		return [...Array(64)]
			.map((i) => (~~(Math.random() * 36)).toString(36))
			.join('');
	}

	getName() {
		return this.name;
	}

	setName = (name) => {
		this.name = name;
	};

	getPlatform() {
		return this.platform;
	}

	setPlatform(platform) {
		this.platform = platform;
	}

	getPushService() {
		return this.pushService;
	}

	setPushService(pushService) {
		this.pushService = pushService;
	}

	static retrieve(callback) {
		try {
			AsyncStorage.getItem('current_device').then((value) => {
				let obj = null;
				if (typeof value === 'string') obj = JSON.parse(value);
				callback(obj);

				console.info('App::Device::retrieve', obj);
			});
		} catch (e) {
			console.error('App::Device::retrieve', e);
		}
	}

	save() {
		try {
			console.info('App::Device::save', this);
			AsyncStorage.setItem('current_device', JSON.stringify(this));
		} catch (e) {
			console.error('App::Device::save', e);
		}
	}

	parseJSON(jsonData) {
		jsonData.forEach((value, key) => {
			if (this.hasOwnProperty(key)) this[key] = value;
		});
		this.save();
	}
}
