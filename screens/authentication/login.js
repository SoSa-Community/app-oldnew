import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {Text, View, Button, Linking, TouchableOpacity, Image} from 'react-native';
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
        socialMediaError: ''
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
                <View style={{marginTop: 20, paddingHorizontal:20, justifyContent:'center'}}>
                    <Text style={Styles.header}>Login</Text>
                    <Text style={Styles.subheader}>With username and password</Text>

                    <View style={[Styles.content_container, {marginBottom: 50}]}>
                        <FormError errorState={this.state.loginError} />
                        <IconTextInput icon={['fal', 'user']} placeholder="Username or e-mail address" value={this.state.usernameInput} onChangeText={data => this.setState({ usernameInput: data})} />
                        <SecureTextInput icon={['fal', 'key']} placeholder="New Password" onChangeText={data => this.setState({ passwordInput: data})} value={this.state.passwordInput} />

                        <View style={{flexDirection: 'row', height:40, marginBottom: 20}}>
                            <View style={{flex: 5}}>
                                <View>
                                    <Text style={Styles.forgotButton} onPress={() => this.navigation.navigate('ForgotPassword', {})}>Forgotten Password</Text>
                                </View>
                            </View>
                            <View style={{flex: 6}} >
                                <ActivityButton showActivity={this.state.loggingIn} onPress={this.doLogin().withUsernameAndPassword} text="Let me in!"/>
                            </View>
                        </View>

                        <Text style={Styles.smallheader}>or</Text>
                        <Text style={Styles.subheader}>With social media</Text>

                        <FormError errorState={this.state.socialMediaError} />
                        <View style={{marginTop: 20, flexDirection:'row', justifyContent: 'center'}}>
                            <TouchableOpacity activeOpacity={0.5} onPress={this.doLogin().withImgur} style={Styles.socialButton}>
                                <Image source={require('../../assets/login/imgur_icon.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} onPress={this.doLogin().withReddit}  style={Styles.socialButton}>
                                <Image source={require('../../assets/login/reddit_icon.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={Styles.header}>New to SoSa?</Text>
                    <View style={Styles.content_container}>
                        <Button title="Press here to register" onPress={() => this.navigation.navigate('Register', {})} />
                    </View>

                </View>
            </View>


        );
  }
}

const LoginScreen = withAppContext(Login);
export default LoginScreen;