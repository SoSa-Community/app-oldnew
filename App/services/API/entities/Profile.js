export class Profile {

    _id = '';
    
    user_id = 0;
    nickname = '';
    name = '';
    tagline = '';
    picture = '';
    cover_picture = '';
    about = '';
    date_of_birth = '';
    
    from_location = '';
    current_location = '';
    
    status = null;
    gender = null;
    age = 0;
    
    activity = new Date();
    created = new Date();
    modified = new Date();

    constructor(content='', communityID='') {
        if(content) this.content = content;
        if(communityID) this.community_id = communityID;
    }

    /**
     * Creates a new Room instance from JSON data
     *
     * @param {Object} jsonData - JSON represented as an object
     * @returns {Meetup}
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
            if(['activity', 'created','modified'].includes(key)) value = new Date(value);
            if(this.hasOwnProperty(key)) this[key] = value;
        })
    }
}
