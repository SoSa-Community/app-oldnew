import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'
import {TouchableWithoutFeedback, Text, View} from 'react-native';

import Helpers from "../../sosa/Helpers";
import FormError from "../../components/FormError";
import IconTextInput from "../../components/IconTextInput";
import SecureTextInput from "../../components/SecureTextInput";
import ActivityButton from "../../components/ActivityButton";


export default class ForgotPasswordCode extends Component {

    navigation = null;
    codeLength = 6;

    state = {
        emailProvided: false,
        emailInput: '',
        codeInput:'',
        checking: false,
        checkError: '',
        passwordError: '',
        passwordInput:''
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;

        if(props.route && props.route.params && props.route.params.email && props.route.params.email.length > 0){
            this.state.emailInput = props.route.params.email;
            this.state.emailProvided = true;
        }
    }


    setLoading = (isLoading) => {
        this.setState({checking: isLoading});
    };

    setError = (field, error) => {
        let obj = {};
        obj[field] = error;

        this.setState(obj);
    };

    validateTextField = (inputFieldName, label, length) => {
        let field = this.state[inputFieldName];

        if((length === null && field.length > 0) ||  field.length === length){
            return '';
        }
        else if(length === null && field.length === 0){
            return `The ${label} can't be empty`
        }
        else if(field.length > 0){
            return `Your ${label} should be ${length} characters`;
        }
        return null;
    };

    formIsValid = () => {
        let code = this.validateTextField('codeInput', 'code', this.codeLength);
        let email = this.validateTextField('emailInput', 'email', null);
        let password = this.validatePassword();

        return (
            (code !== null && code.length === 0) &&
            (email !== null && email.length === 0) &&
            (password !== null && password.length === 0)
        );
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

    handleRequest = (namespace, data, errorField, callback, post= true) => {
        this.setLoading(true);
        try{
            Helpers.request(namespace, data, post)
                .then((json) => {
                    console.log('JSON',json);

                    let error = '';
                    if(json.error)  error = json.error.message;

                    if(callback){
                        try{
                            callback(error, json);
                        }catch(e){
                            console.log('Callback Error', e);
                        }
                    }
                    this.setError(errorField, error);

                })
                .catch((e) => {
                    console.log(e);
                    this.setError(errorField, e);
                })
                .finally(() => {
                    this.setLoading(false);
                });

        }catch(e){
            console.log(e);
            this.setError(errorField, e.message);
            this.setLoading(false);
        }
    };

    validateCodePassword = () => {
        this.handleRequest('forgot/validate', {
                email: this.state.emailInput,
                pin: this.state.codeInput
            },
            'checkError',
            (error, json) => {
                if(error.length === 0){
                    try{
                        this.resetPassword(json.response.token, json.response.transient);
                    }catch (e) {
                        console.log(e);
                    }
                }
            }, false);
    };

    resetPassword = (token, transient) => {
        this.handleRequest('forgot/reset', {
            token: token,
            transient: transient,
            password: this.state.passwordInput
        }, 'passwordError', (error, json) => {
            if(error.length === 0){
                this.navigation.replace('Login', {email: this.state.emailInput, password: this.state.repeatPasswordInput, passwordReset: true});
            }
        });
    };

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={Styles.formContainer}>
                    <Text style={Styles.header}>Check your e-mail</Text>
                    <Text style={Styles.subheader}>You should have received an e-mail with a 6 digit code</Text>

                    <View style={Styles.content_container}>

                        <FormError errorState={this.state.checkError} />
                        {
                            this.state.emailProvided ?
                                    null :
                                    <IconTextInput
                                        icon={['fal', 'user']}
                                        placeholder="Your E-mail"
                                        value={this.state.emailInput}
                                        onChangeText={data => this.setState({ emailInput: data})}
                                        validateInput={() => this.validateTextField('emailInput', 'E-mail', null)}
                                    />
                        }

                        <IconTextInput
                            icon={['fal', 'user']}
                            placeholder={`Your ${this.codeLength}-Character Code`}
                            value={this.state.codeInput}
                            onChangeText={data => this.setState({ codeInput: data})}
                            validateInput={() => this.validateTextField('codeInput', 'code', this.codeLength)}
                        />

                        <FormError errorState={this.state.passwordError} />
                        <SecureTextInput placeholder="New password" onChangeText={data => this.setState({ passwordInput: data})} validateInput={() => this.validatePassword()} />

                        <View style={Styles.buttonRow}>
                            <View style={{flex: 4}}>
                                <TouchableWithoutFeedback onPress={this.navigation.goBack}>
                                    <View style={[Styles.letMeIn_button, Styles.secondary_button]}>
                                        <Text style={Styles.letMeIn_text}>Re-request</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{flex: 6}} >
                                <ActivityButton showActivity={this.state.checking} onPress={this.validateCodePassword} text="Change My Password!" validateInput={() => this.formIsValid()}/>
                            </View>
                        </View>
                    </View>
                </View>
            </View>


        );
  }
}
