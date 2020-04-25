import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/login'

import {TouchableWithoutFeedback, ActivityIndicator, Image, FlatList, Text, TextInput, View, Button} from 'react-native';
import Helpers from "../../sosa/Helpers";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export default class Register extends Component {
    navigation = null;

    state = {
        usernameInput:'',
        passwordInput:'',
        emailInput:'',
        registering: false,
        registerError:'',
        passwordError: '',
        hidePassword: true
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;
    }

    setError = (field, error) => {
        let obj = {};
        obj[field] = error;

        this.setState(obj);
    };

    setLoading = (isLoading) => {
        this.setState({registering: isLoading});
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

    displayViewPassword = () => {
        let icon = 'eye-slash';
        let color = '#ccc';

        if(!this.state.hidePassword){
            icon = 'eye';
            color = '#000';
        }
        return <FontAwesomeIcon icon={['fal', icon]}  style={[Styles.inputIcon, Styles.viewPasswordIcon]} size={22} color={color} onPress={() => {this.setState({hidePassword: !this.state.hidePassword});}} />
    };

    doRegister = () => {
        Helpers.handleRegister(
            this.state.usernameInput,
            this.state.passwordInput,
            this.state.emailInput,
            this.setLoading,
            (error) => this.setError('registerError', error),
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

    registerError = () => {
        return <Text style={Styles.error}>{this.state.registerError}</Text>;
    };

    registerButton = (showActivity=false) => {
        if(showActivity){
            return  <TouchableWithoutFeedback>
                        <View style={[Styles.letMeIn_button, Styles.letMeIn_button_pressed]}>
                            <Text style={Styles.letMeIn_text}>Let me in!</Text>
                            <ActivityIndicator size="small" style={this.state.loggingIn ? Styles.letMeIn_activity: null}/>
                        </View>
                    </TouchableWithoutFeedback>;
        }else{
            return  <TouchableWithoutFeedback onPress={this.doRegister} style={[Styles.letMeIn_button]}>
                        <View style={[Styles.letMeIn_button]}>
                            <Text style={Styles.letMeIn_text}>Let me in!</Text>
                        </View>
                    </TouchableWithoutFeedback>;
        }
    };

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{paddingHorizontal:30, justifyContent:'center'}}>
                    <Text style={Styles.header}>Join SoSa</Text>
                    <Text style={Styles.subheader}>With username and password</Text>

                    <View style={Styles.content_container}>
                        {this.state.registerError ? this.registerError() : null}
                        <View style={Styles.inputParentContainer}>
                            <View style={Styles.inputContainer}>
                                <FontAwesomeIcon icon={['fal', 'user']}  style={Styles.inputIcon} size={18}/>
                                <TextInput placeholder="Username" placeholderTextColor="#ccc" value={this.state.usernameInput} style={Styles.input} onChangeText={data => this.setState({ usernameInput: data})}/>
                            </View>
                        </View>
                        <View style={Styles.inputParentContainer}>
                            <View style={Styles.inputContainer}>
                                <FontAwesomeIcon icon={['fal', 'envelope']}  style={Styles.inputIcon} size={18}/>
                                <TextInput placeholder="E-mail" placeholderTextColor="#ccc" value={this.state.emailInput} style={Styles.input} onChangeText={data => this.setState({ emailInput: data})}/>
                            </View>
                        </View>
                        {this.displayError('passwordError')}
                        <View style={Styles.inputParentContainer}>
                            <View style={Styles.inputContainer}>
                                <TextInput placeholder="New Password" placeholderTextColor="#ccc" style={Styles.input} onChangeText={data => this.setState({ passwordInput: data})} secureTextEntry={this.state.hidePassword} />
                                { this.displaySuccess(this.validatePassword()) }
                                { this.displayViewPassword() }
                            </View>
                        </View>
                        <View style={{height:40}}>
                            {this.state.registering ? this.registerButton(true) : this.registerButton()}
                        </View>
                    </View>

                </View>
            </View>


        );
  }
}
