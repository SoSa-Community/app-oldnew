import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/login'
import {TouchableWithoutFeedback, ActivityIndicator, Button, Text, TextInput, View} from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Helpers from "../../sosa/Helpers";


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
        newPasswordInput:'',
        repeatPasswordInput:''
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;

        if(props.route && props.route.params && props.route.params.email && props.route.params.email.length > 0){
            this.state.emailInput = props.route.params.email;
            this.state.emailProvided = true;
        }
    }

    componentDidMount() {}

    setLoading = (isLoading) => {
        this.setState({checking: isLoading});
    };

    setError = (field, error) => {
        let obj = {};
        obj[field] = error;

        this.setState(obj);
    };

    displayError = (errorField) => {
        if(this.state[errorField] && this.state[errorField] !== null && this.state[errorField].length > 0){
            return <Text style={Styles.error}>{this.state[errorField]}</Text>;
        }
    };

    displaySuccess = (errorString) => {
        if(errorString === null){
            return null;
        }else if(errorString.length === 0){
            return <FontAwesomeIcon icon={['fas', 'check']}  style={Styles.inputIcon} size={18} color='#28a745' />
        }else{
            return <FontAwesomeIcon icon={['fas', 'info-circle']}  style={Styles.inputIcon} size={18} color='#dc3545' onPress={() => {console.log(errorString);}} />
        }
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

    validatePassword = (inputFieldName) => {
        let field = this.state[inputFieldName];
        let passwordRules = 'The password must be 8 characters, include one letter, one number and one symbol';

        if(field.length >= 8){
            if(inputFieldName === 'repeatPasswordInput'){
                if(field !== this.state.newPasswordInput)   return 'Passwords need to match';

            }
            return '';
        }else if(field.length > 0){
            return 'Password must be at-least 5 characters';
        }
        return null;
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
            password: this.state.repeatPasswordInput
        }, 'passwordError', (error, json) => {
                if(error.length === 0){
                    this.navigation.replace('Login', {email: this.state.emailInput, password: this.state.repeatPasswordInput, passwordReset: true});
                }
        });
    };

    formIsValid = () => {
        let code = this.validateTextField('codeInput', 'code', this.codeLength);
        let email = this.validateTextField('emailInput', 'email', null);
        let newPassword = this.validatePassword('newPasswordInput');
        let repeatPassword = this.validatePassword('repeatPasswordInput');

        return (
            this.state.checkError.length === 0 &&
            this.state.passwordError.length === 0 &&
            (code !== null && code.length === 0) &&
            (email !== null && email.length === 0) &&
            (newPassword !== null && newPassword.length === 0) &&
            (repeatPassword !== null && repeatPassword.length === 0)
        );
    };

    displayChangePasswordButton = (showActivity=false) => {
        if(showActivity){
            return  <TouchableWithoutFeedback>
                        <View style={[Styles.letMeIn_button, Styles.letMeIn_button_pressed]}>
                            <Text style={Styles.letMeIn_text}>Change My Password!</Text>
                            <ActivityIndicator size="small" style={this.state.loggingIn ? Styles.letMeIn_activity: null}/>
                        </View>
                    </TouchableWithoutFeedback>;
        }else{
            if(this.formIsValid()){
                return  <TouchableWithoutFeedback onPress={this.validateCodePassword} style={Styles.letMeIn_button}>
                    <View style={[Styles.letMeIn_button]}>
                        <Text style={Styles.letMeIn_text}>Change My Password!</Text>
                    </View>
                </TouchableWithoutFeedback>;
            }else{
                return  <TouchableWithoutFeedback>
                    <View style={[Styles.letMeIn_button, Styles.letMeIn_button_pressed]}>
                        <Text style={Styles.letMeIn_text}>Change My Password!</Text>
                    </View>
                </TouchableWithoutFeedback>;
            }
        }
    };

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{paddingHorizontal:30, justifyContent:'center'}}>
                    <Text style={Styles.header}>Check your e-mail</Text>
                    <Text style={Styles.subheader}>You should have received an e-mail with a 6 digit code</Text>

                    <View style={Styles.content_container}>

                        {this.displayError('checkError')}

                        {this.state.emailProvided ? null : <View style={Styles.inputParentContainer}>
                            <View style={Styles.inputContainer}>
                                <TextInput placeholder="Your E-mail" placeholderTextColor="#ccc" style={Styles.input} onChangeText={data => this.setState({ emailInput: data})} />
                                { this.displaySuccess(this.validateTextField('emailInput', 'E-mail', null)) }
                            </View>
                        </View>}

                        <View style={Styles.inputParentContainer}>
                          <View style={Styles.inputContainer}>
                                <TextInput placeholder={`Your ${this.codeLength}-Character Code`} placeholderTextColor="#ccc" style={Styles.input} onChangeText={data => this.setState({ codeInput: data})} />
                                { this.displaySuccess(this.validateTextField('codeInput', 'code', this.codeLength)) }
                          </View>
                        </View>

                        {this.displayError('passwordError')}
                        <View style={Styles.inputParentContainer}>
                            <View style={Styles.inputContainer}>
                                <TextInput placeholder="New Password" placeholderTextColor="#ccc" style={Styles.input} onChangeText={data => this.setState({ newPasswordInput: data})} secureTextEntry={true} />
                                { this.displaySuccess(this.validatePassword('newPasswordInput')) }
                            </View>
                        </View>
                        <View style={Styles.inputParentContainer}>
                            <View style={Styles.inputContainer}>
                                <TextInput placeholder="Retype Your New Password" placeholderTextColor="#ccc" style={Styles.input} onChangeText={data => this.setState({ repeatPasswordInput: data})} secureTextEntry={true} />
                                { this.displaySuccess(this.validatePassword('repeatPasswordInput')) }
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', height:40}}>
                            <View style={{flex: 4}}>
                                <TouchableWithoutFeedback onPress={this.resetPassword} style={Styles.secondary_button}>
                                    <View style={[Styles.secondary_button]}>
                                        <Text style={Styles.letMeIn_text}>Re-request</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{flex: 6}} >
                                {this.displayChangePasswordButton(this.state.checking)}
                            </View>
                        </View>
                    </View>
                </View>
            </View>


        );
  }
}
