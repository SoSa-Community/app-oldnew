import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/login'

import {Text, View} from 'react-native';
import Helpers from "../../sosa/Helpers";

import SecureTextInput from "../../components/SecureTextInput";
import IconTextInput from "../../components/IconTextInput";
import ActivityButton from "../../components/ActivityButton";
import FormError from "../../components/FormError";

export default class Register extends Component {
    navigation = null;

    state = {
        usernameInput:'',
        passwordInput:'',
        emailInput:'',
        registering: false,
        registerError:'',
        passwordError: ''
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;
    }

    setLoading = (isLoading) => {
        this.setState({registering: isLoading});
    };

    doRegister = () => {
        Helpers.handleRegister(
            this.state.usernameInput,
            this.state.passwordInput,
            this.state.emailInput,
            (isLoading) => this.setState({registering: isLoading}),
            (error) => this.setState({registerError: error}),
            (json) => {
                console.log('success');
            }
        );
    }

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

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{paddingHorizontal:30, justifyContent:'center'}}>
                    <Text style={Styles.header}>Join SoSa</Text>
                    <Text style={Styles.subheader}>With username and password</Text>

                    <View style={Styles.content_container}>
                        <FormError errorState={this.state.registerError} />

                        <IconTextInput icon={['fal', 'user']} placeholder="Username" value={this.state.usernameInput} onChangeText={data => this.setState({ usernameInput: data})} />
                        <IconTextInput icon={['fal', 'envelope']} placeholder="E-mail" value={this.state.emailInput} onChangeText={data => this.setState({ emailInput: data})} />

                        <FormError errorState={this.state.passwordError} />
                        <SecureTextInput placeholder="New Password" onChangeText={data => this.setState({ passwordInput: data})} validateInput={() => this.validatePassword()} />

                        <View style={{height:40}}>
                            {
                                <ActivityButton showActivity={this.state.registering} onPress={this.doRegister} text="Let me in!"/>
                            }
                        </View>
                    </View>

                </View>
            </View>


        );
  }
}
