import { Client } from "../../Client.js";

export class Listeners {

    /** @type {RequestProvider} */
    provider = null;

    /**
     * Creates a new Listeners Object
     *
     * @param {Client} client - Client initiating the class
     */
    constructor(provider) {
        this.provider = provider;
    }

    /**
     * Adds a listener to the socket
     * @param {string|object} event - Socket Event you want to listen for
     * @param {function(err, data, request, client)|null} handler - the code to run when we get an _error or _success
     */
    add = (event, handler=null) => {
        const { provider : { socket } } = this;
        console.info('Client::Listeners::add', event);
        
        let add = (event, handler) => socket.on(event, (data) => handler(data));
        if(typeof(event) !== 'string'){
            event.forEach((handler, event) => add(event, handler));
        }else{
            add(event, handler);
        }
    }
    
    clear = () => {
        const { provider : { socket } } = this;
        console.info('Client::Listeners::clear');
        socket.removeAllListeners()
    }
}
