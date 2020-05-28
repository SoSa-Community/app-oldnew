import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {Text, View, Linking, TouchableOpacity, TouchableHighlight, Image} from 'react-native';
import Helpers from "../../sosa/Helpers";

import ActivityButton from "../../components/ActivityButton";
import IconTextInput from "../../components/IconTextInput";
import SecureTextInput from "../../components/SecureTextInput";
import FormError from "../../components/FormError";

import {SoSaConfig} from "../../sosa/config";

import withAppContext from '../hoc/withAppContext';

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
        }
    }

    componentDidMount(): void {
        const login = this;
        this.addDeeplinkListener('login','preauth', (data) => {
            if(data.status === 'success'){
                Helpers.deviceLogin(data.device_id, () => {},
                    (error) => {
                        this.setState({'socialMediaError': error});
                    },
                    (json) => {
                        this.setState({'socialMediaError': ''});
                        console.log(login);
                        login.navigation.replace('MembersWrapper', {login: true});
                    }
                );
            }else{
                this.setState({'socialMediaError': data.error});
            }
        })
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
            }
        }
    };

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{marginTop: 20, paddingHorizontal:20, justifyContent:'center', flex: 1}}>
                    <Text style={Styles.header}>Login</Text>
                    <Text style={Styles.subheader}>With username and password</Text>

                    <View style={[Styles.content_container]}>
                        <FormError errorState={this.state.loginError} />
                        <IconTextInput icon={['fal', 'user']} placeholder="Username or e-mail address" value={this.state.usernameInput} onChangeText={data => this.setState({ usernameInput: data})} />
                        <SecureTextInput icon={['fal', 'key']} placeholder="New Password" onChangeText={data => this.setState({ passwordInput: data})} value={this.state.passwordInput} />

                        <View style={{flexDirection: 'row', height:40}}>
                            <View style={{flex: 5}}>
                                <View>
                                    <Text style={Styles.forgotButton} onPress={() => this.navigation.navigate('ForgotPassword', {})}>Forgotten Password</Text>
                                </View>
                            </View>
                            <View style={{flex: 6}} >
                                <ActivityButton showActivity={this.state.loggingIn} onPress={this.doLogin().withUsernameAndPassword} text="Let me in!"/>
                            </View>
                        </View>

                        <FormError errorState={this.state.socialMediaError} />
                        <View style={{marginTop: 20, flexDirection:'row', justifyContent: 'center'}}>
                            <TouchableOpacity activeOpacity={0.5} onPress={this.doLogin().withImgur} style={Styles.socialButton}>
                                <Image source={require('../../assets/login/imgur_icon.png')} style={Styles.socialButtonIcon}/>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} onPress={this.doLogin().withReddit}  style={Styles.socialButton}>
                                <Image source={require('../../assets/login/reddit_icon.png')} style={Styles.socialButtonIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={Styles.buttonBottom}>
                        <TouchableHighlight onPress={() => this.navigation.navigate('Register', {})} style={Styles.newToSoSaButton}>
                            <View>
                                <Text style={Styles.newToSoSaButtonText}>New to SoSa?</Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                </View>
            </View>


        );
  }
}

const LoginScreen = withAppContext(Login);
export default LoginScreen;