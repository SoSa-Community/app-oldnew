import { SoSaError } from '../entities/SoSaError.js';

export class Request {
	namespace = '';
	call = '';
	method = 'POST';
	payload = null;
	response = null;

	requireAuth = false;
	provider = '';

	constructor(
		provider,
		namespace,
		call,
		payload,
		method = 'POST',
		requireAuth,
	) {
		this.provider = provider;

		this.id = provider.client.generateUUID();

		this.namespace = namespace;
		this.call = call;
		this.payload = payload;
		this.method = method;
		this.requireAuth = requireAuth;
	}

	run = () => {
		return new Promise(async (resolve, reject) => {
			const {
				provider: {
					client: {
						sessionHandler: { getSession, updateSession },
					},
					request: handleRequest,
				},
			} = this;

			try {
				const json = await handleRequest(this);
				this.response = json;

				if (json) {
					if (json?.response) {
						const { response } = json;
						const { session, user } = response || {};
						const { username, nickname } = user || {};

						if (session || username || nickname) {
							try {
								const sessionInstance = await getSession();

								if (session) sessionInstance.parseJSON(session);
								if (username)
									sessionInstance.username = username;
								if (nickname)
									sessionInstance.nickname = nickname;

								await updateSession(sessionInstance);
							} catch (e) {
								console.debug(e);
							}
						}
					}

					let errors = [];

					if (Array.isArray(json.errors) && json.errors.length)
						errors = json.errors;
					else if (json.error) errors.push(errors);

					if (errors.length)
						reject(
							errors.map((error) => SoSaError.fromJSON(error)),
						);
					else {
						resolve(json);
					}
				}
			} catch (e) {
				console.debug(e);
				reject(e);
			}
		});
	};
}
