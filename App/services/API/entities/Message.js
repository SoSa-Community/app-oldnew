export class Message {

    _id = '';
    id = '';
    uuid = '';
    community_id = '';
    room_id = '';
    content = '';
    parsed_content = '';
    sent_datetime = '';
    user_id = '';

    username = '';
    picture = '';

    nsfw = false;
    spoilers = false;

    restricted_visibility = false;
    embeds = [];
    mentions = [];
    links = [];
    tags = [];
    
    user = {
        user_id: '',
        nickname: 'anonymous',
        picture: 'https://picsum.photos/seed/picsum/300/300'
    }

    constructor(content='', communityID='', roomID='') {
        if(content) this.content = content;
        if(communityID) this.community_id = communityID;
        if(roomID) this.room_id = roomID;
    }

    /**
     * Creates a new Room instance from JSON data
     *
     * @param {Object} jsonData - JSON represented as an object
     * @returns {Message}
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

    render(){
        console.debug('Message rendered: ', this.message);
    }
}
