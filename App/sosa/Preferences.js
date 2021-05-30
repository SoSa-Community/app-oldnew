import AsyncStorage from '@react-native-community/async-storage';

export const Preferences = {
	set: (settingName, value) => {
		const settingKey = `setting:${settingName}`;
		try {
			AsyncStorage.setItem(settingKey, JSON.stringify(value));
		} catch (e) {
			console.log('Error Saving Session', e);
		}
	},

	get: (settingName, callback) => {
		try {
			const settingKey = `setting:${settingName}`;
			AsyncStorage.getItem(settingKey)
				.then((value) => {
					let parsedValue = null;
					if (typeof value === 'string') {
						parsedValue = JSON.parse(value);
					}
					callback && callback(parsedValue);
				})
				.catch((e) => {
					console.debug('ouch2', e);
				});
		} catch (e) {
			console.debug('ouch', e);
		}
	},

	getAll: (callback) => {
		AsyncStorage.getAllKeys().then((keys, error) => {
			if (!error && Array.isArray(keys)) {
				let mappedKeys = [];

				keys.forEach((key) => {
					if (key.startsWith('setting:')) mappedKeys.push(key);
				});

				if (mappedKeys.length > 0) {
					AsyncStorage.multiGet(mappedKeys, (err, stores) => {
						let preferences = {};
						stores.forEach(([key, value]) => {
							let parsedValue = null;
							if (typeof value === 'string') {
								parsedValue = JSON.parse(value);
							}
							preferences[
								key.replace('setting:', '')
							] = parsedValue;
						});
						callback(preferences);
					});
				} else {
					callback({});
				}
			} else {
				callback({});
			}
		});
	},
};
