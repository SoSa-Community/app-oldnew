export default class APIError extends Error {
	constructor(message = '', field = null, code = 0) {
		super(message);

		this.field = field;
		this.code = code;
	}

	static fromJSON({ message, code, field }) {
		return new APIError(message, field, code);
	}
}
