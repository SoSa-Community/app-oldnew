import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {Text, View, Button} from 'react-native';
import Helpers from "../../sosa/Helpers";

import ActivityButton from "../../components/ActivityButton";
import IconTextInput from "../../components/IconTextInput";
import SecureTextInput from "../../components/SecureTextInput";
import FormError from "../../components/FormError";

export default class Login extends Component {
    navigation = null;

    state = {
        usernameInput:'',
        passwordInput:'',
        loggingIn: false,
        loginError:''
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
    }

    doLogin = () => {
        Helpers.handleLogin(
            this.state.usernameInput,
            this.state.passwordInput,
            (isLoading) => this.setState({loggingIn: isLoading}),
            (error) => this.setState({loginError: error}),
            (json) => {
                this.navigation.replace('MembersWrapper', {login: true});
            }
        );
    };

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{paddingHorizontal:30, justifyContent:'center'}}>
                    <Text style={Styles.header}>Login</Text>
                    <Text style={Styles.subheader}>With username and password</Text>

                    <View style={[Styles.content_container, {marginBottom: 50}]}>
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
                                <ActivityButton showActivity={this.state.loggingIn} onPress={this.doLogin} text="Let me in!"/>
                            </View>
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
