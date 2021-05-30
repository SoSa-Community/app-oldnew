export class Device {

    id = '';
    secret = '';
    name = '';
    isBot = false;
    platform = 'other';
    pushService = 'other';

    /**
     * Creates a new Room instance from JSON data
     *
     * @param {Object} jsonData - JSON represented as an object
     * @returns {Device}
     */
    static fromJSON(jsonData){
        let instance = new this();
        instance.parseJSON(jsonData);
        return instance;
    }

    /**
     * Parses JSON Data to fill out the object parameters
     *
     * @param {Object} jsonData - JSON represented as an object
     */
    parseJSON(jsonData){
        jsonData.forEach((value, key) => {
            if(this.hasOwnProperty(key)) this[key] = value;
        })
    }
}
