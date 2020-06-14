import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {Text, View, Linking, TouchableHighlight} from 'react-native';
import Helpers from "../../sosa/Helpers";

import ActivityButton from "../../components/ActivityButton";
import IconTextInput from "../../components/IconTextInput";
import SecureTextInput from "../../components/SecureTextInput";
import FormError from "../../components/FormError";

import {SoSaConfig} from "../../sosa/config";

import withAppContext from '../hoc/withAppContext';
import SocialButton from "../../components/SocialButton";

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

        this.navigation = props.navigation;

        if(props.route && props.route.params){
            if(props.route.params.email){
                this.state.usernameInput = props.route.params.email;
            }
            if(props.route.params.password){
                this.state.passwordInput = props.route.params.password;
            }
        }

        if(props.appContext){
            this.addDeeplinkListener = props.appContext.addDeeplinkListener;
            this.removeDeeplinkListener = props.appContext.removeDeeplinkListener;
        }
    }

    componentDidMount(): void {
        this.addDeeplinkListener('login', 'preauth', (data) => {

            if(data.status === 'success'){
                Helpers.deviceLogin(data.device_id, () => {},
                    (error) => {
                        this.setState({'socialMediaError': error});
                    },
                    (json) => {
                        this.setState({'socialMediaError': ''});
                        this.navigation.replace('MembersWrapper', {login: true});
                    }
                );
            }else{
                this.setState({'socialMediaError': data.error});
            }
        }, true);
    }

    doLogin = () => {
        return {
            withUsernameAndPassword: () => {
                Helpers.handleLogin(
                    this.state.usernameInput,
                    this.state.passwordInput,
                    (isLoading) => this.setState({loggingIn: isLoading}),
                    (error) => this.setState({loginError: error}),
                    (json) => {
                        this.navigation.replace('MembersWrapper', {login: true});
                    }
                );
            },
            withImgur: () => {
                this.setState({'socialMediaError': ''});
                Helpers.handlePreauth(() => {}, () => {}, (json) => {
                    console.log(json);
                    Linking.openURL(`${SoSaConfig.auth.server}/imgur/login?app=1&preauth=${json.response}`);
                })
            },
            withReddit: () => {
                this.setState({'socialMediaError': ''});
                Helpers.handlePreauth(() => {}, () => {}, (json) => {
                    console.log(json);
                    Linking.openURL(`${SoSaConfig.auth.server}/reddit/login?app=1&preauth=${json.response}`);
                })
            },
            withTwitter: () => {
                this.setState({'socialMediaError': ''});
                Helpers.handlePreauth(() => {}, () => {}, (json) => {
                    console.log(json);
                    Linking.openURL(`${SoSaConfig.auth.server}/twitter/login?app=1&preauth=${json.response}`);
                })
            }
        }
    };

    CredentialLogin = () => {

        let loginButton = <ActivityButton showActivity={this.state.loggingIn} onPress={this.doLogin().withUsernameAndPassword} text="Let me in!"/>
        let forgotButton = <View>
            <Text style={Styles.forgotButton} onPress={() => this.navigation.navigate('ForgotPassword', {})}>Forgotten Password</Text>
        </View>;

        let buttonContainer = null;
        if(SoSaConfig.features.login.forgotPassword){
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

        if(SoSaConfig.features.login.credentials){
            return <View>
                <FormError errorState={this.state.loginError} />
                <IconTextInput icon={['fal', 'user']} placeholder="Username or e-mail address" value={this.state.usernameInput} onChangeText={data => this.setState({ usernameInput: data})} />
                <SecureTextInput icon={['fal', 'key']} placeholder="New Password" onChangeText={data => this.setState({ passwordInput: data})} value={this.state.passwordInput} />
                {buttonContainer}
            </View>
        }

        return null;
    };

    SocialLogin = () => {

        let imgurButton = <SocialButton onPress={this.doLogin().withImgur} icon={require('../../assets/onboarding/imgur_icon.png')} />;
        let redditButton = <SocialButton onPress={this.doLogin().withReddit} icon={require('../../assets/onboarding/reddit_icon.png')} />
        let twitterButton = <SocialButton onPress={this.doLogin().withTwitter} icon={require('../../assets/onboarding/twitter_icon.png')} />

        return <View>
            <FormError errorState={this.state.socialMediaError} />
            <View style={{marginTop: 20, flexDirection:'row', justifyContent: 'center'}}>
                {SoSaConfig.features.login.imgur ? imgurButton : null}
                {SoSaConfig.features.login.reddit ? redditButton : null}
                {SoSaConfig.features.login.twitter ? twitterButton : null}
            </View>
        </View>
    };

    RegisterButton = () => {
        if(!SoSaConfig.features.general.canRegister){
            return <View style={Styles.buttonBottom}></View>;
        }

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
            <View style={BaseStyles.container}>
                <View style={{marginTop: 20, paddingHorizontal:20, justifyContent:'center', flex: 1}}>
                    <Text style={Styles.header}>Login</Text>

                    <View style={[Styles.content_container]}>
                        <this.CredentialLogin />
                        <this.SocialLogin />
                    </View>
                    <this.RegisterButton />
                </View>
            </View>


        );
  }
}

const LoginScreen = withAppContext(Login);
export default LoginScreen;
