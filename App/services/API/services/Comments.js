import { Client } from '../Client.js';
import { SoSaError } from '../entities/SoSaError';
import { Request } from '../core/Request';

import { Comment } from '../entities/Comment.js';

export class CommentService {
	/** @type {Client} */
	client = null;
	provider = null;

	constructor(client) {
		this.client = client;
		this.provider = client.getProvider('comments');
	}

	create(
		communityId,
		content = '',
		entityType = 'meetup',
		entityId = '',
		parentId = null,
	) {
		let data = {
			community_id: communityId,
			parent_id: parentId,
			entity_type: entityType,
			entity_id: entityId,
			content,
		};

		return new Request(this.provider, 'comments', 'create', data)
			.run()
			.then(({ data }) => {
				const { comment } = data;
				return Comment.fromJSON(comment);
			});
	}
}
