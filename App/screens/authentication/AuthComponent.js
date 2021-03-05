import React, {Component} from 'react';

import Styles from '../styles/onboarding'

import {Text, View, Linking, TouchableHighlight, KeyboardAvoidingView, Alert} from 'react-native';

import ActivityButton from "../../components/ActivityButton";
import Input from "../../components/Input";
import SecureTextInput from "../../components/SecureTextInput";
import FormError from "../../components/FormError";

import AppConfig from "../../config";
import SocialButton from "../../components/SocialButton";
import Helpers from "../../sosa/Helpers";


export default class AuthComponent extends Component {
    screenType = '';
    
    navigation = null;
    preauthId = null;
    
    apiClient = null;
    apiMiddleware = null;

    state = {
        usernameInput:'',
        emailInput: '',
        passwordInput:'',
        processing: false,
        error:'',
        socialMediaError: '',
        forLogin: true
    };

    constructor(props) {
        super();

        const {appContext, navigation, route: {params}} = props;
        this.navigation = navigation;
        
        this.appContext = appContext;
        
        const { apiClient } = appContext;
        this.apiClient = apiClient;
        
        if(params){
            const {email, password} = params;
            if(email) this.state.usernameInput = email;
            if(password) this.state.passwordInput = password;
        }
    }

    componentDidMount() {
        this.appContext.clearMiddlewareNamespace('login');
        this.appContext.addMiddleware('login', `${this.screenType}/preauth`, (data) => {
            const { apiClient: { services: { auth: authService } } } = this;
            const {status, link_token, device_id, unregistered} = data;
            
            console.info('App::AuthComponent::preauth_trigger', data);
    
            const complete = (error, response) => {
                this.setState({processing:false, socialMediaError: error});
                this.complete(error, response, 'socialMediaError');
            };

            const deviceLogin = (device_id) => {
                authService.deviceLogin(device_id)
                    .then(json => complete(null, json))
                    .catch(error => complete(error));
            };

            if(status === 'success'){
                if(unregistered){
                    Alert.alert("You're not registered!","Would you like us to create an account for you?",
                          [{text: "No", style: "cancel"},
                                {
                                    text: "Sure! let's do it!",
                                    onPress: () => {
                                        authService.linkPreauth(this.preauthId, link_token)
                                            .then((json) => complete(null, json))
                                            .catch((error) => complete(error));
                                    }
                                }],
                          { cancelable: true }
                    );
                }else{
                    deviceLogin(device_id);
                }
            }else{
                complete(data?.error);
            }
        }, true);
    }

    complete = (error, json, errorField) => {
        console.log(error, json, errorField);
        let state = {processing: false};
        
        if(error){
            if(Array.isArray(error)) error = error.pop();
            
            state[errorField] = error.message || error.code;
            this.setState(state);
        }else{
            this.setState(state);
            const {navigation} = this;

            const { user } = json;
            const { welcome } = user;

            if(welcome){
                navigation.replace('Welcome', {user, welcome});
            }else{
                navigation.replace('MembersArea', {login: true});
            }
        }
    };
    
    validatePassword = () => {
        try{
            if(Helpers.validatePassword(this.state.passwordInput) === false){
                return null;
            }
        }catch (e) {
            return e.message;
        }
        return '';
    };

    

    
}
