export class Meetup {

    _id = '';
    id = 0;
    type = 'virtual';
    user_id = 0;
    community_id = '';
    
    title = '';
    slug = '';
    description = '';
    start_datetime = new Date();
    end_datetime = new Date();
    timezone = 'UTC';
    address1 = '';
    address2 = '';
    address3 = '';
    city = '';
    county = '';
    postcode = '';
    country = '';
    latitude = 0.0;
    longitude = 0.0;
    privacy = 'public';
    max_users = 0;
    min_age = 0;
    max_age = 0;
    image = '';
    
    attendees = [];
    comments = [];
    
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
            if(['start_datetime','end_datetime', 'created','modified'].includes(key)) value = new Date(value);
            if(this.hasOwnProperty(key)) this[key] = value;
        })
    }
}
