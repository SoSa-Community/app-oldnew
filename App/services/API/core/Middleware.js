import { Client } from "../Client.js";

export class Middleware {

    client = Client;
    middleware = [];

    /**
     * Creates a new Listeners Object
     *
     * @param {Client} client - Listeners class initiating the class
     */
    constructor(client) {
        this.client = client;
        this.clear();
    }

    /***
     * Adds middleware to a specified event
     *
     * @param namespace
     * @param {string|object} event - What event will the middleware trigger for
     * @param {function(data, client, event)|undefined} middleware - Middleware code to run
     * @param {string} signature - Not required, but useful if you need to remove this middleware independently
     */
    add(namespace='', event, middleware, signature=''){
        if(!namespace.length) namespace = 'general';
        
        let add = (event, middleware, signature) => {
            if(!signature || signature.length === 0) signature = this.client.generateUUID();
            
            if(!this.middleware[namespace]) this.middleware[namespace] = {};
            if(!this.middleware[namespace][event]) this.middleware[namespace][event] = {};
            this.middleware[namespace][event][signature] = middleware;
        };
    
        console.info('Client::Middleware::add', event, signature);
        
        if(typeof(event) === 'string'){
            add(event, middleware, signature);
        }else{
            event.forEach((middleware, event) => {
                 add(event, middleware);
            });
        }
    }

    clear(namespace){
        this.middleware[namespace] = [];
    }

    /**
     * Searches
     *
     * @param {string} event - event triggered
     * @param {object} data - sent from the triggering command
     * @param {function(data, client)} callback - Callback after all middleware has run
     */
    trigger(event, data){
        return new Promise((resolve, reject) => {
            if(event){
                let callbacks = [];
                console.debug('Client::Middleware::trigger::namespace', event, this.middleware);
                for(const namespace in this.middleware){
                    if(this.middleware[namespace].hasOwnProperty(event)){
                        callbacks = [...callbacks, ...Object.values(this.middleware[namespace][event]).map((middleware) =>
                            new Promise((resolve1, reject1) => {
                                middleware(data, this.client, event);
                                resolve1();
                            }).catch((error) => {
                                console.debug('Client::Middleware::trigger::error', event, error);
                            })
                        )];
                    }
                }
                Promise.all(callbacks).then(() => resolve(data));
            }else{
                resolve(data);
            }
        });
    }
}
