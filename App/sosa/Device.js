import {getDeviceName, getSystemName, getBrand, getModel} from 'react-native-device-info';
import AsyncStorage from "@react-native-community/async-storage";

export default class Device {

    static instance = null;
    
    initialized = false;
    id = '';
    secret = '';
    name = '';
    platform = 'other';
    pushService = 'other';

    init(){
        return new Promise((resolve, reject) => {
            let device = this;
            if(this.initialized) {
                resolve(device);
            }else{
                let fullInit = () => {
                    let platform = 'other';
                    let pushService = 'other';
        
                    switch(getSystemName()){
                        case 'Android':
                            pushService = platform = 'android';
                            break;
                        case 'iOS':
                        case 'iPhone IS':
                            pushService = platform = 'ios';
                
                            break;
                    }
        
                    this.setPlatform(platform);
                    this.setPushService(pushService);
                    this.setSecret(this.generateSecret());
        
                    getDeviceName().then(deviceName => {
                        let name = [];
                        let brand = getBrand();
                        let model = getModel();
            
                        if(brand) name.push(brand);
                        if(model) name.push(model);
            
                        let fullName = `${name.join(' ')}`;
            
                        if(deviceName)  fullName = `${deviceName} (${fullName})`;
            
                        this.setName(fullName);
                        this.save();
                        this.initialized = true;
                    }).finally(() => resolve(device));
                };
    
                Device.retrieve((obj) => {
                    console.info('App::Device::init', obj);
                    
                    if(obj === null){
                        fullInit();
                    }else{
                        obj.forEach((value, key) => device[key] = value);
                        this.initialized = true;
                        resolve(device);
                    }
                });
            }
        });
        
    }

    /**
     * @returns {Device}
     */
    static getInstance() {
        if (Device.instance == null)    Device.instance = new Device();
        return this.instance;
    }

    getId = () => {
        return this.id;
    }

    setId = (id) => {
        this.id = id;
    }

    getSecret(){
        return this.secret;
    }

    setSecret(secret){
        this.secret = secret;
    }

    generateSecret(){
        let secret = [...Array(64)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
        return 'sausage';
    }

    getName(){
        return this.name;
    }

    setName = (name) => {
        this.name = name;
    }

    getPlatform(){
        return this.platform;
    }

    setPlatform(platform){
        this.platform = platform;
    }

    getPushService(){
        return this.pushService;
    }

    setPushService(pushService){
        this.pushService = pushService;
    }

    static retrieve(callback){
        try {
            AsyncStorage.getItem('current_device').then(value => {
                let obj = null;
                if(typeof(value) === "string")  obj = JSON.parse(value);
                callback(obj);
    
                console.info('App::Device::retrieve', obj);
            });
        } catch(e) {
            console.error('App::Device::retrieve', e);
        }
    }

    save(){
        try {
            console.info('App::Device::save', this);
            AsyncStorage.setItem('current_device', JSON.stringify(this));
        } catch (e) {
            console.error('App::Device::save', e);
        }
    }
    
    parseJSON(jsonData){
        jsonData.forEach((value, key) => {
            if(this.hasOwnProperty(key)) this[key] = value;
        });
        this.save();
    }


}
