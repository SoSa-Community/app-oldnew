export class Comment {
	id = '';
	community_id = null;
	parent_id = '';
	user_id = 0;
	entity_type = 'meetup';
	entity_id = '';
	content = '';

	parsed_content = '';
	nsfw = false;
	spoilers = false;
	anonymous = false;
	restricted_visibility = false;
	embeds = [];
	mentions = [];
	links = [];
	tags = [];
	level = 1;
	referer = '';

	user = {
		user_id: '',
		nickname: 'anonymous',
		picture: 'https://picsum.photos/seed/picsum/300/300',
	};

	created = new Date();
	modified = new Date();
	deleted = null;

	constructor(content = '', communityID = '') {
		if (content) this.content = content;
		if (communityID) this.community_id = communityID;
	}

	/**
	 * Creates a new Room instance from JSON data
	 *
	 * @param {Object} jsonData - JSON represented as an object
	 * @returns {Meetup}
	 */
	static fromJSON(jsonData) {
		let instance = new this();
		instance.parseJSON(jsonData);
		return instance;
	}

	/**
	 * Parses JSON Data to fill out the object parameters
	 *
	 * @param {Object} jsonData - JSON represented as an object
	 */
	parseJSON(jsonData) {
		jsonData.forEach((value, key) => {
			if (this.hasOwnProperty(key)) this[key] = value;
		});
	}
}
