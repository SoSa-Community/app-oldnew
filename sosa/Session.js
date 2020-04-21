import AsyncStorage from "@react-native-community/async-storage";

export default class Session {

    static instance = null;
    id = '';
    expiry = '';
    refreshToken = '';

    /**
     * @returns {Session}
     */
    static getInstance() {
        if (Session.instance == null)   Session.instance = new Session();
        return this.instance;
    }

    init(callback){
        let session = this;

        Session.retrieve((obj) => {
            if(obj !== null){
                console.log('retrieved');
                obj.forEach((value, key) => session[key] = value);
            }
            callback(session);
        });
    }

    getId = () => {
        return this.id;
    }

    setId = (id) => {
        this.id = id;
    }

    getExpiry(){
        return this.expiry;
    }

    setExpiry(expiry){
        this.expiry = expiry;
    }

    getRefreshToken(){
        return this.refreshToken;
    }

    setRefreshToken = (refreshToken) => {
        this.refreshToken = refreshToken;
    }

    getParsedExpiry(){
        let date = new Date(Date.parse(this.getExpiry().replace(/-/g, '/')));
        if(date === NaN){date = null;}

        return date;
    }

    hasExpired(){
        let parsedExpiry = this.getParsedExpiry();
        if(parsedExpiry !== null && parsedExpiry.getTime() > (new Date()).getUTCMilliseconds()){
            return false;
        }
        return true;

    }

    static retrieve(callback){
        try {
            AsyncStorage.getItem('current_session').then(value => {
                let obj = null;
                if(typeof(value) === "string")  obj = JSON.parse(value);

                callback(obj);
            });
        } catch(e) {
            console.log('Error Retrieving Session', e);
        }
    }

    save(){
        console.log(this);
        try {
            AsyncStorage.setItem('current_session', JSON.stringify(this));
        } catch (e) {
            console.log('Error Saving Session', e);
        }
    }

    fromJSON(jsonObject={}){
        console.log('blah', jsonObject);
        if(jsonObject.id)   this.setId(jsonObject.id);
        if(jsonObject.expiry) this.setExpiry(jsonObject.expiry);
        if(jsonObject.refresh_token) this.setRefreshToken(jsonObject.refresh_token);

        this.save();
    }


}