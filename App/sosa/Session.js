import AsyncStorage from "@react-native-community/async-storage";

export default class Session {

    static instance = null;
    
    initialized = false;
    id = '';
    expiry = '';
    refresh_token = '';
    username = '';
    nickname = '';

    /**
     * @returns {Session}
     */
    static getInstance() {
        if (Session.instance == null)   Session.instance = new Session();
        return this.instance;
    }

    init(){
        return new Promise((resolve, reject) => {
            let session = this;
            if(this.initialized) {
                resolve(session);
            }else{
                Session.retrieve((obj) => {
                    console.info('App::Session::init', obj);
                    
                    if(obj !== null){
                        obj.forEach((value, key) => session[key] = value);
                    }
                    resolve(session);
                });
            }
        });
    }

    getExpiry(){
        return this.expiry;
    }

    setExpiry(expiry){
        this.expiry = expiry;
    }

    getParsedExpiry(){
        let date = new Date(Date.parse(this.getExpiry().replace(/-/g, '/')));
        if(isNaN(date)){date = null;}

        return date;
    }

    hasExpired(){
        let parsedExpiry = this.getParsedExpiry();
        if(parsedExpiry !== null && parsedExpiry.getTime() < (new Date()).getUTCMilliseconds()){
            return false;
        }
        return true;
    }

    logout(callback){
        this.expiry = null;
        this.id = null;
        this.refresh_token = null;
        this.save(callback);
    }

    static retrieve(callback){
        try {
            AsyncStorage.getItem('current_session').then(value => {
                let obj = null;
                if(typeof(value) === "string")  obj = JSON.parse(value);
                callback(obj);
    
                console.info('App::Session::retrieve', obj);
            });
        } catch(e) {
            console.error('App::Session::retrieve', e);
        }
    }

    save(callback){
        try {
            console.info('App::Session::save', this);
            AsyncStorage.setItem('current_session', JSON.stringify(this), callback);
        } catch (e) {
            console.error('App::Session::retrieve', e);
        }
    }
    
    parseJSON(jsonData){
        jsonData.forEach((value, key) => {
            if(this.hasOwnProperty(key)) this[key] = value;
        });
        this.save();
    }

}
