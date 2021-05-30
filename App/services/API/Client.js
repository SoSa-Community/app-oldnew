import {Middleware} from "./core/Middleware.js";
import {GeneralService} from "./services/General.js";
import {ChatService} from "./services/Chat.js";
import {GeneralProvider} from "./providers/General.js";
import {AuthService} from "./services/Auth.js";
import {AuthProvider} from "./providers/Auth.js";
import {MeetupService} from "./services/Meetups.js";
import {ProfileService} from "./services/Profiles.js";
import {CommentService} from "./services/Comments.js";

/**
 * Object.prototype.forEach() polyfill
 * Refactored from https://gomakethings.com/looping-through-objects-with-es6/
 * @author Chris Ferdinandi
 * @author James Mahy
 * @license MIT
 */

if (!Object.prototype.forEach) {
    Object.defineProperty(Object.prototype, 'forEach', {
        value: function (callback, thisArg) {
            if (this == null) throw new TypeError('Not an object');

            for (let key in this) {
                if (this.hasOwnProperty(key)) callback.call(thisArg, this[key], key, this);
            }
        },
        writable: true
    });
}

export class Client {

    config = {
        host: '',
        api_key: ''
    };

    socketIO = null;
    xmlParser = null;

    middleware = new Middleware(this);

    services = {};
    providers = {};

    sessionHandler = {
        getDevice: () => { throw new Error('Session handler not implemented') },
        /**
         * @return {Promise<Session|Error>}
         */
        getSession: () => { throw new Error('Session handler not implemented') },
        updateSession: (session) => { throw new Error('Session handler not implemented') },
        generateJWT: (packet) => { throw new Error('Session handler not implemented') },
        reauth: () => { throw new Error('Session handler not implemented') },
        authFailed: () => { throw new Error('Session handler not implemented') }
    };

    constructor(config, socketIO, xmlParser, sessionHandler){

        this.config = config;
        this.socketIO = socketIO;
        this.xmlParser = xmlParser;

        if(typeof(sessionHandler) === 'object'){
            this.sessionHandler = sessionHandler;
        }

        this.initProviders();
        this.initServices();
    }

    initServices() {
        this.services = {
            auth: new AuthService(this),
            general: new GeneralService(this),
            chat: new ChatService(this),
            meetups: new MeetupService(this),
            profiles: new ProfileService(this),
            comments: new CommentService(this)
        }
    }

    initProviders() {
        const { config: { providers : { auth, general } } } = this;
        
        this.providers.auth = new AuthProvider(this, auth);
        this.providers.general = new GeneralProvider(this, general);
    }

    getProvider(providerName) {
        if(providerName === 'auth') return this.providers.auth;
        return this.providers.general;
    }

    generateUUID() {
        let d = new Date().getTime();//Timestamp
        let d2 = (typeof(performance) === 'object' && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    
    translateErrorCode(code){
        const {config: { errors } } = this;
        if(errors.hasOwnProperty(code)) return errors[code];
        return code;
    }

}

