import {Client} from "../../Client.js";

export class MessageParsers {

    client = Client;
    parsers = [];
    longRunners = [];

    /**
     * Creates a new MessageParsers Object
     *
     * @param {ChatService} client - Listeners class initiating the class
     */
    constructor(chatService) {
        this.client = chatService.client;
        this.clear();
    }

    /***
     * Adds a message parser
     *
     * @param {MessageParser|array} parser - Either an array of parsers or a parser
     */
    add(parser){

        let add = (parser) => this.parsers.push(parser);

        if(!Array.isArray(parser)){
            add(parser);
        }else{
            parser.forEach((parser) => add(parser));
        }

        this.parsers.sort((a, b) => a.getPriority() - b.getPriority());
    }

    clear(){this.parsers = [];}

    /**
     *
     * @param { Message } message - Instance of Message object
     * @param callback
     */
    parse(message, callback=() => {}) {
        const parserPromise = this.parsers.reduce(
            (promiseChain, parser) => {

                return promiseChain.then(
                    () => new Promise(
                        (resolve) => {
                            try{
                                console.log('parsing', parser.name);
                                let cpuTimeout = setTimeout(() => {
                                        console.debug(`Parser Timeout - ${parser.name} took more than 1 second`);

                                        this.longRunners.push(parser.name);
                                        resolve();

                                },1000);


                                parser.parse(
                                    message,
                                    (parsedMessage) => {
                                        clearTimeout(cpuTimeout);
                                        resolve()
                                    }
                                );




                            }catch(e){
                                console.debug('Parser failed to parse', parser.name, e);
                                resolve();
                            }
                        }
                    )
                );
            }, Promise.resolve()
        );
        parserPromise.then(() => callback(message));
    }

}
