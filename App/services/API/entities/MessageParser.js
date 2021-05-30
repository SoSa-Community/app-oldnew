export class MessageParser {
    name='';

    /**
     * Get's the parsers priority (this will be used for sorting)
     * @returns {number}
     */
    getPriority(){
        return 10;
    }
    /**
     *
     * @param {Message} message - The current message to be sent
     * @param next - Callback when you're done
     */
    parse(message, next){
        next(message);
    }

};


