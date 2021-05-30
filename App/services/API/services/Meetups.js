import { Client } from '../Client.js';
import { SoSaError } from '../entities/SoSaError';
import { Request } from '../core/Request';
import { Meetup } from '../entities/Meetup.js';

export class MeetupService {
	/** @type {Client} */
	client = null;
	provider = null;

	constructor(client) {
		this.client = client;
		this.provider = client.getProvider('meetups');
	}

	create(communityId, title, description, type, start, end, optional = {}) {
		let data = {
			community_id: communityId,
			title,
			description,
			type,
			start,
			end,
			...optional,
		};

		return new Request(this.provider, 'meetups', 'create', data)
			.run()
			.then(({ data }) => {
				const { meetup } = data;
				return Meetup.fromJSON(meetup);
			});
	}

	search(communityId) {
		return new Request(this.provider, 'meetups', 'search', {
			community_id: communityId,
		})
			.run()
			.then(({ data }) => {
				const { records } = data;
				return records.map((meetup) => Meetup.fromJSON(meetup));
			});
	}

	get(id) {
		return new Request(this.provider, 'meetups', 'get', { id })
			.run()
			.then(({ data }) => {
				const { meetup } = data;
				return Meetup.fromJSON(meetup);
			});
	}
}
