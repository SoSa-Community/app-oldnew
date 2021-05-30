import {Client} from "../Client.js";
import { SoSaError } from "../entities/SoSaError.js";
import {Request} from "../core/Request.js";

export class AuthService {

	/** @type {Client} */
	client = null;
    provider = null;
    
    constructor(client) {
        this.client = client;
        this.provider = client.getProvider('auth');
    }

    handleAuthRequest = (namespace, call, data) => {
        const { client : { sessionHandler: { getDevice, updateDevice } } } = this;
        
        return new Request(this.provider, namespace, call, data, call === 'validate' ? 'GET' : 'POST', true)
            .run()
            .then((json) => {
                const { response: { device_id } } = json;
                if(typeof(device_id) === 'string'){
                    return getDevice().then(deviceInstance => {
                        deviceInstance.id = device_id;
                        return updateDevice(deviceInstance).then(() => json);
                    }).then(({response})=> response);
                }else{
                    return json.response;
                }
            });
    };

	login = (username, password) => {
		return this.handleLoginRegister(username, password);
	};
    
    logout = () => {
        const { client : { middleware, sessionHandler: { updateSession } } } = this;
        
        return new Request(this.provider, '', 'logout', false, 'POST', true)
            .run()
            .catch((error) => {
                console.debug('Client::Auth::logout::error', error);
            })
            .then(() => middleware.trigger('logout'))
            .finally(() => {
                return true;
            })
    };
	

	register = (username, password, email) => {
        return new Promise((resolve, reject) => {
            if (!email) throw new SoSaError('provide_email');
            return resolve(this.handleLoginRegister(username, password, email));
        });
	};

	handleLoginRegister = (username, password, email) => {
        const { client : { sessionHandler: { getDevice } } } = this;
        
        return new Promise((resolve, reject) => {
            if(!username) throw new SoSaError('provide_username');
            if(!password) throw new SoSaError('provide_password');
            
            getDevice().then(deviceInstance => {
                let call = 'login';
                
                let data = {
                    username: username,
                    password: password,
                    device_secret: deviceInstance.secret,
                    device_name: deviceInstance.name,
                    device_platform: deviceInstance.platform
                };
                
                if(email){
                    call = 'register';
                    data.email = email;
                    data.login = true;
                }
                
                resolve(this.handleAuthRequest('', call, data));
            });
        });
	};

	deviceLogin = (deviceId) => {
        const { client : { sessionHandler: { generateJWT } } } = this;
	    let data = {device_id: deviceId};
	    
        return generateJWT(data).then(token => {
            return this.handleAuthRequest('device', 'login', {token, ...data});
        })
	};
    
    validateSession = () => {
        return this.handleAuthRequest( '', 'validate', {});
    };
    
    

	createPreauth = () => {
        const { client : { sessionHandler: { getDevice } } } = this;
        
        return getDevice().then(deviceInstance => {
            let data = {
                device_secret: deviceInstance.secret,
                device_name: deviceInstance.name,
                device_platform: deviceInstance.platform
            };
            return new Request(this.provider, 'preauth', 'create', data)
                .run()
                .then(({response}) => response);
        });
	};
    
    linkPreauth = (preauthId, linkToken) => {
        const { client : { sessionHandler: { generateJWT } } } = this;
        
        return generateJWT({link_token: linkToken}).then(token => {
            return new Request(this.provider, 'login', 'link', { preauth_id: preauthId, token: token })
                .run()
                .then(({response}) => response);
        });
    };
    
    getPreauthURI = (type, network, preauthId) => {
        const { provider: { config: { host } } } = this;
        return `${host}/${network}/${type}?app=1&preauth=${preauthId}`
    };

	confirmWelcome = (username, email) => {
        
        return new Request(this.provider, 'login', 'welcome', {username, email}, 'POST', true)
            .run()
            .then(({response}) => response);
	}
}
