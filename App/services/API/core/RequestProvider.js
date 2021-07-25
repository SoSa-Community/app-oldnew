import { Client } from '../Client.js';

export class RequestProvider {
	config = {};

	/** @type {Client} */
	client = null;

	constructor(client, config) {
		this.client = client;
		this.config = config;
	}

	getAuthEntities = (requireAuth, forSocket) => {
		const {
			client: {
				sessionHandler: { getDevice, getSession, generateJWT },
			},
		} = this;

		return new Promise(async (resolve, reject) => {
			if (!requireAuth) resolve({});
			else {
				let device,
					session,
					jwt = null;

				try {
					device = await getDevice();
					session = await getSession();
				} catch (e) {
					console.debug(e);
				}

				let payload = {};
				const { id, isBot, botId } = device;

				if (isBot) payload = { id: botId };
				else if (forSocket) {
					payload = {
						id: session.id,
						refresh_token: session.refresh_token,
					};
				} else {
					payload = { device_id: id };
				}

				try {
					jwt = await generateJWT(payload);
				} catch (e) {
					console.debug(e);
				}

				resolve({
					device,
					session,
					jwt,
				});
			}
		});
	};

	request = (request) => {
		return new Promise(async (resolve, reject) => {
			const { namespace, call, payload, method, requireAuth } = request;

			try {
				const { device, session, jwt } = await this.getAuthEntities(
					requireAuth,
				);

				let uriParts = [];

				if (namespace) uriParts.push(namespace);
				if (call) uriParts.push(call);
				let uri = uriParts.join('/');

				let body;
				const headers = {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				};

				if (jwt && jwt.length) headers.token = jwt;
				if (session) {
					let { id: sessionID, expiry, refresh_token } = session;
					console.log(session);

					if (typeof sessionID === 'string' && sessionID.length) {
						headers['session-id'] = sessionID;

						let parsedExpiry = new Date(
							Date.parse(expiry.replace(/-/g, '/')),
						);
						if (isNaN(parsedExpiry)) {
							parsedExpiry = null;
						}

						if (
							parsedExpiry !== null &&
							parsedExpiry.getTime() <
								new Date().getUTCMilliseconds()
						)
							headers['refresh-token'] = refresh_token;
					}
				}

				if (payload) {
					if (method === 'POST') body = JSON.stringify(payload);
					else {
						let keyValues = [];

						payload.forEach((value, key) =>
							keyValues.push(`${key}=${value}`),
						);
						if (keyValues.length) uri += `?${keyValues.join('&')}`;
					}
				}

				const endpoint = `${this.config.host}/${uri}`;
				const timeout = 10000;

				console.info('Client::RequestProvider::Request', endpoint, {
					method,
					body,
					headers,
				});

				let timeoutTimer = setTimeout(
					() => reject(new Error('network_timeout')),
					timeout,
				);

				const response = await fetch(endpoint, {
					method,
					body,
					headers,
				});

				clearTimeout(timeoutTimer);
				let json = '';

				try {
					json = await response.json();
					if (json?.session) {
						const {
							client: { sessionHandler },
						} = this;
						session.parseJSON(json.session);
						await sessionHandler.updateSession(session);
					}
					console.info(
						'Client::RequestProvider::Request::Response::JSON',
						json,
					);
					resolve(json);
				} catch (e) {
					console.info(
						'Client::RequestProvider::Request::Response',
						json,
					);
					reject(e);
				}
			} catch (e) {
				reject(e);
			}
		});
	};
}
