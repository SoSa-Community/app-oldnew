import {SoSaConfig} from "../../sosa/config";

import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {Linking, Text, View} from 'react-native';
import Helpers from "../../sosa/Helpers";

import SecureTextInput from "../../components/SecureTextInput";
import {IconInput} from "../../components/IconInput";
import {ActivityButton} from "../../components/ActivityButton";
import {FormError} from "../../components/FormError";

import {SocialButton} from "../../components/SocialButton";
import withAppContext from "../hoc/withAppContext";

class Register extends Component {
    navigation = null;

    state = {
        usernameInput:'',
        passwordInput:'',
        emailInput:'',
        registering: false,
        registerError:'',
        passwordError: '',
        socialMediaError: ''
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;

        if(props.appContext){
            this.addDeeplinkListener = props.appContext.addDeeplinkListener;
            this.removeDeeplinkListener = props.appContext.removeDeeplinkListener;
        }
    }

    componentDidMount() {
        this.addDeeplinkListener('register', 'preauth', (data) => {
            if(data.status === 'success'){
                Helpers.deviceLogin(data.device_id, () => {},
                    (error, json) => {
                        this.completeLogin(error, json, 'socialMediaError');
                    }
                );
            }else{
                this.setState({registering:false, socialMediaError: data.error});
            }
        }, true);
    }

    completeLogin = (error, json, errorField) => {
        let state = {registering: false};
        if(error){
            state[errorField] = error.message;
            this.setState(state);
        }else{
            this.setState(state);
            const {navigation} = this;

            const {response: {user}} = json;
            const {welcome} = user;

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

    CredentialRegister = () => {

        if(SoSaConfig.features.register.credentials){
            let register = () => {
                if(!this.state.usernameInput.length || !this.state.passwordInput.length || !this.state.emailInput.length){
                    this.setState({registerError: 'Please provide a username, e-mail address and password', registering: false});
                }else{
                    Helpers.handleRegister(
                        this.state.usernameInput,
                        this.state.passwordInput,
                        this.state.emailInput,
                        (isLoading) => this.setState({registering: isLoading}),
                        (error, json) => {
                            this.completeLogin(error, json, 'registerError');
                        }
                    );
                }
            };

            return <View>
                <FormError errorState={this.state.registerError} />

                <IconInput icon={['fal', 'user']} placeholder="Username" value={this.state.usernameInput} onChangeText={data => this.setState({ usernameInput: data})} enabled={!this.state.registering}/>
                <IconInput icon={['fal', 'envelope']} placeholder="E-mail" value={this.state.emailInput} onChangeText={data => this.setState({ emailInput: data})} enabled={!this.state.registering}/>

                <FormError errorState={this.state.passwordError} />
                <SecureTextInput placeholder="Choose a password" onChangeText={data => this.setState({ passwordInput: data})} validateInput={() => this.validatePassword()} enabled={!this.state.registering} />

                <View style={{height:40}}>
                    <ActivityButton showActivity={this.state.registering} onPress={register} text="Let me in!" />
                </View>
            </View>
        }

        return null;
    };

    SocialRegister = () => {

        if(SoSaConfig.features.register.social.imgur || SoSaConfig.features.register.social.reddit){
            let register = (network) => {
                this.setState({socialMediaError: '', registering: true});

                Helpers.handlePreauth(
               () => {},
               (error, json) => {
                    let state = {registering: false};
                    if(error){
                        state.socialMediaError = error.message;
                    }else{
                        Linking.openURL(`${SoSaConfig.auth.server}/${network}/register?app=1&preauth=${json.response}`);
                        setTimeout(() => {
                            this.setState({registering: false});
                        },5000);
                    }
                    this.setState(state);
                })
            };

            let onboardingPath = '../../assets/onboarding/';

            let imgurButton = <SocialButton onPress={() => register('imgur')} icon={require(`${onboardingPath}imgur_icon.png`)} enabled={!this.state.registering}/>;
            let redditButton = <SocialButton onPress={() => register('reddit')} icon={require(`${onboardingPath}reddit_icon.png`)} enabled={!this.state.registering}/>
            let twitterButton = <SocialButton onPress={() => register('twitter')} icon={require(`${onboardingPath}twitter_icon.png`)} enabled={!this.state.registering}/>
            let facebookButton = <SocialButton onPress={() => register('facebook')} icon={require(`${onboardingPath}facebook_icon.png`)} enabled={!this.state.registering}/>
            let googleButton = <SocialButton onPress={() => register('google')} icon={require(`${onboardingPath}google_icon.png`)} enabled={!this.state.registering}/>

            return <View>
                <Text style={[Styles.subheader, {marginTop: 40}]}>Join using another platform</Text>
                <FormError errorState={this.state.socialMediaError} />
                <View style={{marginTop: 20, flexDirection:'row', justifyContent: 'center'}}>
                    {SoSaConfig.features.register.social.imgur ? imgurButton : null}
                    {SoSaConfig.features.register.social.reddit ? redditButton : null}
                    {SoSaConfig.features.register.social.google ? googleButton : null}
                    {SoSaConfig.features.register.social.twitter ? twitterButton : null}
                    {SoSaConfig.features.register.social.facebook ? facebookButton : null}
                </View>
            </View>;
        }
        return null;
    };

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{paddingHorizontal:30, justifyContent:'center'}}>
                    <View style={Styles.content_container}>
                        <this.CredentialRegister />
                        <this.SocialRegister />
                    </View>

                </View>
            </View>
        );
  }
}


const RegistrationScreen = withAppContext(Register);
export default RegistrationScreen;
