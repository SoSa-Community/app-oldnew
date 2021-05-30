export class Room {

    _client;

    id = 0;
    name = '';
    title = '';
    topic = '';
    description = '';
    community_id = '';
    creator_uid = '';
    created_datetime = new Date();
    modified_datetime = new Date();
    password = '';

    constructor(client, jsonData){
        this._client = client;
    }

    /**
     * Joins the room
     *
     * @param {function(err, Room)} callback
     * @param password
     */
    join(callback, password) {
        if(!password && this.password) password = this.password;
        this._client.rooms().join(callback, this.community_id, this.name, password, this);
    }

    /**
     * Creates a new Room instance from JSON data
     *
     * @param {ChatClient} client - instance of ChatClient
     * @param {Object} jsonData - JSON represented as an object
     * @returns {Room}
     */
    static fromJSON(client, jsonData){
        let instance = new this(client);
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
