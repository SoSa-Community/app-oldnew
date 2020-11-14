import React, {Component} from 'react';

import Styles from '../styles/onboarding'

import {Text, View, Linking, TouchableHighlight, KeyboardAvoidingView, Alert} from 'react-native';

import {ActivityButton} from "../../components/ActivityButton";
import {IconInput} from "../../components/IconInput";
import SecureTextInput from "../../components/SecureTextInput";
import {FormError} from "../../components/FormError";

import {SoSaConfig} from "../../sosa/config";
import {SocialButton} from "../../components/SocialButton";
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

    CredentialInput = () => {
        const {screenType, navigation, state: {usernameInput, passwordInput, processing, error, passwordError, emailInput}} = this;
        const { forgotPassword, credentials } = SoSaConfig.features[screenType];
        
        const forLogin = screenType === 'login';
        
        const doTheThing = () => {
            
            this.setState({processing: true});
            const complete = (error, response) => this.complete(error, response, 'error');
            
            if(!forLogin && (!usernameInput.length || !passwordInput.length || !emailInput.length)) {
                complete(new Error('Please provide a username, e-mail address and password'));
            }else {
                const { apiClient: { services: { auth: authService } } } = this;
                const promise = (forLogin ? authService.login(usernameInput, passwordInput) : authService.register(usernameInput, passwordInput, emailInput));
    
                promise.then((response) => {
                    complete(null, response);
                }).catch((error) => {
                    complete(error);
                }).finally(() => {
                    this.setState({processing: false});
                });
            }
        };
    
        let buttonContainer = null;
        
        const letmeinButton = <ActivityButton showActivity={processing} onPress={doTheThing} text="Let me in!"/>
        const forgotButton = <View>
           <Text style={Styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}>Forgotten Password</Text>
        </View>;

        if(forgotPassword){
            buttonContainer =
                <View style={{flexDirection: 'row', height:40}}>
                    <View style={{flex: 5}}>
                        {forgotButton}
                    </View>
                    <View style={{flex: 6}} >
                        {letmeinButton}
                    </View>
                </View>;
        }else{
            buttonContainer = <View>{letmeinButton}</View>;
        }
        
        if(credentials){
            if(forLogin){
                return <View>
                    <FormError errorState={error} />
                    <IconInput icon={['fal', 'user']} placeholder="Username or e-mail address" value={usernameInput} onChangeText={data => this.setState({ usernameInput: data})} enabled={!processing} />
                    <SecureTextInput icon={['fal', 'key']} placeholder="Password" onChangeText={data => this.setState({ passwordInput: data})} value={passwordInput} enabled={!processing} />
                    { buttonContainer }
                </View>;
            }else{
                return <View>
                    <FormError errorState={error} />
                    <IconInput icon={['fal', 'user']} placeholder="Username" value={usernameInput} onChangeText={data => this.setState({ usernameInput: data})} enabled={!processing} />
                    <SecureTextInput icon={['fal', 'key']} placeholder="Password" onChangeText={data => this.setState({ passwordInput: data})} validateInput={() => this.validatePassword()} enabled={!processing} />
                    <IconInput icon={['fal', 'envelope']} placeholder="E-mail" value={emailInput} onChangeText={data => this.setState({ emailInput: data})} enabled={!processing} />
                    <FormError errorState={passwordError} />
                    { buttonContainer }
                </View>;
            }
        }
        
        return null;
    };

    SocialButtons = () => {
        const {social: {imgur, reddit, google, twitter, facebook}} = SoSaConfig.features[this.screenType];
        const onboardingPath = '../../assets/onboarding/';
        
        let login = (network) => {
            const { apiClient: { services: { auth: authService } } } = this;
            
            this.setState({error: '', socialMediaError: '', processing: true});
            let state = {};
            
            // Protects against state getting out of sync
            setTimeout(() => this.setState({processing: false}),1000);
            
            authService.createPreauth()
                .then(preauthId => {
                    this.preauthId = preauthId;
                    Linking.openURL(authService.getPreauthURI(this.screenType, network, preauthId));
                })
                .catch((error) => {
                    console.debug(error);
                    state.socialMediaError = error.message;
                })
                .finally(() => this.setState({processing: false, ...state}));
        };

        const createSocialButton = (network, icon) => {
            return <SocialButton onPress={() => login(network)} icon={icon} enabled={!this.state.processing} />;
        };
        
        return <View>
            <FormError errorState={this.state.socialMediaError} />
            <View style={{marginTop: 20, flexDirection:'row', justifyContent: 'center'}}>
                {imgur ? createSocialButton('imgur', require(`${onboardingPath}imgur_icon.png`)) : null}
                {reddit ? createSocialButton('reddit', require(`${onboardingPath}reddit_icon.png`)) : null}
                {google ? createSocialButton('google', require(`${onboardingPath}google_icon.png`)) : null}
                {twitter ? createSocialButton('twitter', require(`${onboardingPath}twitter_icon.png`)) : null}
                {facebook ? createSocialButton('facebook', require(`${onboardingPath}facebook_icon.png`)) : null}
            </View>
        </View>
    };
}
