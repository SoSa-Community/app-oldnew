import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {Text, View, Linking, TouchableHighlight, KeyboardAvoidingView} from 'react-native';
import Helpers from "../../sosa/Helpers";

import {ActivityButton} from "../../components/ActivityButton";
import {IconInput} from "../../components/IconInput";
import SecureTextInput from "../../components/SecureTextInput";
import {FormError} from "../../components/FormError";

import {SoSaConfig} from "../../sosa/config";

import withAppContext from '../hoc/withAppContext';
import {SocialButton} from "../../components/SocialButton";

class Login extends Component {
    navigation = null;

    state = {
        usernameInput:'',
        passwordInput:'',
        loggingIn: false,
        loginError:'',
        socialMediaError: '',
        forLogin: true
    };

    constructor(props) {
        super();

        const {appContext, navigation, route: {params}} = props;
        this.navigation = navigation;

        if(params){
            const {email, password} = params;
            if(email) this.state.usernameInput = email;
            if(password) this.state.passwordInput = password;
        }


        if(appContext){
            const {addDeeplinkListener, removeDeeplinkListener} = appContext;

            this.addDeeplinkListener = addDeeplinkListener;
            this.removeDeeplinkListener = removeDeeplinkListener;
        }
    }

    componentDidMount() {
        this.addDeeplinkListener('login', 'preauth', (data) => {
            console.log('Data', data);
            const {status, device_id} = data;
            if(status === 'success'){
                Helpers.deviceLogin(device_id, () => {},
                    (error, json) => {
                        this.completeLogin(error, json, 'socialMediaError');
                    }
                );
            }else{
                this.setState({loggingIn:false, socialMediaError: data.error});
            }
        }, true);
    }

    completeLogin = (error, json, errorField) => {
        let state = {loggingIn: false};
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

    CredentialLogin = () => {
        const {navigation, state: {usernameInput, passwordInput, loggingIn, loginError}} = this;

        const login = () => {
            Helpers.handleLogin(
                usernameInput,
                passwordInput,
                (isLoading) => this.setState({loggingIn: isLoading}),
                (error, json) => {
                    this.completeLogin(json, 'loginError');
                }
            );
        };

        const loginButton = <ActivityButton showActivity={loggingIn} onPress={login} text="Let me in!"/>
        const forgotButton = <View>
            <Text style={Styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}>Forgotten Password</Text>
        </View>;

        const {forgotPassword, credentials} = SoSaConfig.features.login;

        let buttonContainer = null;
        if(forgotPassword){
            buttonContainer =
                <View style={{flexDirection: 'row', height:40}}>
                    <View style={{flex: 5}}>
                        {forgotButton}
                    </View>
                <View style={{flex: 6}} >
                    {loginButton}
                </View>
            </View>;
        }else{
            buttonContainer = <View>{loginButton}</View>;
        }

        if(credentials){
            return <View>
                <FormError errorState={loginError} />
                <IconInput icon={['fal', 'user']} placeholder="Username or e-mail address" value={usernameInput} onChangeText={data => this.setState({ usernameInput: data})} enabled={!this.state.loggingIn}/>
                <SecureTextInput icon={['fal', 'key']} placeholder="New Password" onChangeText={data => this.setState({ passwordInput: data})} value={passwordInput} enabled={!this.state.loggingIn}/>
                {buttonContainer}
            </View>
        }
        return null;
    };

    SocialLogin = () => {

        let login = (network) => {
            this.setState({loginError: '', socialMediaError: '', loggingIn: true});

            Helpers.handlePreauth(() => {}, (error, json) => {
                let state = {loggingIn: true};
                if(error){
                    state.socialMediaError = error.message;
                }else{
                    Linking.openURL(`${SoSaConfig.auth.server}/${network}/login?app=1&preauth=${json.response}`);
                    setTimeout(() => {
                        this.setState({loggingIn: false});
                    },1000);
                }
                this.setState(state);
            });
        };

        const {social: {imgur, reddit, google, twitter, facebook}} = SoSaConfig.features.login;
        const createSocialButton = (network, icon) => {
            return <SocialButton onPress={() => login(network)} icon={icon} enabled={!this.state.loggingIn} />;
        };

        const onboardingPath = '../../assets/onboarding/';
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

    RegisterButton = () => {
        if(!SoSaConfig.features.general.canRegister) return <View style={Styles.buttonBottom}></View>;

        return <View style={Styles.buttonBottom}>
            <TouchableHighlight onPress={() => this.navigation.navigate('Register', {})} style={Styles.newToSoSaButton}>
                <View>
                    <Text style={Styles.newToSoSaButtonText}>New to SoSa?</Text>
                </View>
            </TouchableHighlight>
        </View>;
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
            >
                <View style={BaseStyles.container}>
                    <View style={{marginTop: 20, paddingHorizontal:20, flex: 1}}>
                        <View style={[Styles.content_container]}>
                            <this.CredentialLogin />
                            <this.SocialLogin />
                        </View>
                        <this.RegisterButton />
                    </View>
                </View>
            </KeyboardAvoidingView>

        );
  }
}

const LoginScreen = withAppContext(Login);
export default LoginScreen;
