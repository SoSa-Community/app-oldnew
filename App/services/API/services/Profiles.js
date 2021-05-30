import { Client } from '../Client.js';
import { SoSaError } from '../entities/SoSaError';
import { Request } from '../core/Request';

import { Profile } from '../entities/Profile.js';

export class ProfileService {
	/** @type {Client} */
	client = null;
	provider = null;

	constructor(client) {
		this.client = client;
		this.provider = client.getProvider('profiles');
	}

	get(id) {
		return new Request(this.provider, 'profiles', 'get', { id })
			.run()
			.then(({ data }) => {
				const { profile } = data;
				return Profile.fromJSON(profile);
			});
	}

	save(data) {
		return new Request(this.provider, 'profiles', 'save', data)
			.run()
			.then(({ data }) => {
				const parsedProfile = Profile.fromJSON(data);
				return parsedProfile;
			});
	}

	mine(forEditing = false) {
		return new Request(this.provider, 'profiles', 'mine', {
			forEditing: Boolean(forEditing),
		})
			.run()
			.then(({ data }) => {
				const { profile, options, widgets } = data;
				const parsedProfile = Profile.fromJSON(profile);

				if (!forEditing) return parsedProfile;
				else {
					return { options, widgets, profile: parsedProfile };
				}
			});
	}
}
