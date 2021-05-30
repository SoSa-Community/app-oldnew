import { Client } from "../Client.js";

export class RequestProvider {

    config = {};

    /** @type {Client} */
    client = null;

    constructor(client, config) {
        this.client = client;
        this.config = config;
    }

    getAuthEntities = (requireAuth, forSocket) => {
        const {client: { sessionHandler: { getDevice, getSession, generateJWT } } } = this;
        
        return new Promise((resolve, reject) => {
            if(!requireAuth){
                resolve({});
            }else{
                let _device, _session, _jwt = null;

                getDevice().then(device => _device = device)
                    .then(() => getSession())
                    .then(session => _session = session)
                    .catch((error) => console.debug(error))
                    .then(() => {
                        let payload = {};
                        const { id, isBot, botId } = _device;
                        
                        if(isBot){
                            payload = {id: botId};
                        }
                        else if(forSocket){
                            payload = {id: _session.id, refresh_token: _session.refresh_token};
                        }else{
                            payload = {device_id: id};
                        }
                        return generateJWT(payload);
                    })
                    .then(jwt => _jwt = jwt)
                    .catch((error) => console.debug(error))
                    .finally(() => {
                        resolve({device: _device, session: _session, jwt: _jwt});
                    });
            }
        });
    };

    request = (request) => {
        const { namespace, call, payload, method, requireAuth } = request;
        
        return this.getAuthEntities(requireAuth).then(({device, session, jwt}) => {
            let uriParts = [];
            if(namespace) uriParts.push(namespace);
            if(call) uriParts.push(call);
            let uri = uriParts.join('/');

            let request = {
                method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            };

            if(jwt && jwt.length) request.headers['token'] = jwt;
            if(session){
                let {id: sessionID, expiry, refresh_token } = session;
                console.log(session);
                if(typeof(sessionID) === 'string' && sessionID.length){
                    request.headers['session-id'] = sessionID;
                    
                    let parsedExpiry = new Date(Date.parse(expiry.replace(/-/g, '/')));
                    if(isNaN(parsedExpiry)){parsedExpiry = null;}
                    
                    if(parsedExpiry !== null && parsedExpiry.getTime() < (new Date()).getUTCMilliseconds())    request.headers['refresh-token'] = refresh_token;
                }
            }
    
            if(payload){
                if(method === 'POST'){
                    request.body = JSON.stringify(payload);
                }else{
                    let keyValues = [];
                    
                    payload.forEach((value, key) => keyValues.push(`${key}=${value}`));
                    if(keyValues.length) uri += `?${keyValues.join('&')}`;
                }
            }
            
            const endpoint = `${this.config.host}/${uri}`;
            const timeout = 10000;
    
            console.info('Client::RequestProvider::Request', uri, request);
            return new Promise((resolve, reject) => {
                let timeoutTimer = setTimeout(() => reject('Network Timed Out'), timeout);
                
                fetch(endpoint, request)
                    .then((response) => {
                        clearTimeout(timeoutTimer);
                        response.json().then((json) => {
                            console.info('Client::RequestProvider::Request::Response', json);
                            if(json && json.session) {
                                const { client: { sessionHandler } } = this;
                                session.parseJSON(json.session);
    
                                sessionHandler.updateSession(session).then(() => {
                                    resolve(json);
                                })
                            }else{
                                resolve(json);
                            }
                        }).catch((error) => {
                            reject(error);
                        });
                    })
            })
        });
    }

}
