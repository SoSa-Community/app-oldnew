import AsyncStorage from '@react-native-community/async-storage';

export default class LocalStorage {
	static retrieve(key, isObject = false) {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(key).then((value) => {
				let obj = null;

				if (!isObject) obj = value;
				else if (typeof value === 'string') {
					try {
						obj = JSON.parse(value);
					} catch (e) {
						obj = null;
					}
				}

				if (obj === null) reject(new Error('not_found'));
				else resolve(obj);
			});
		});
	}

	static save(key, value) {
		return new Promise((resolve, reject) => {
			if (!key) reject('invalid_key');

			const setValue =
				typeof value === 'object' ? JSON.stringify(value) : value;

			AsyncStorage.setItem(key, setValue)
				.then(() => resolve())
				.catch((error) => reject(error));
		});
	}
}
