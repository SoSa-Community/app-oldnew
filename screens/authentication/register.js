import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import Helpers from "../../sosa/Helpers";

import SecureTextInput from "../../components/SecureTextInput";
import IconTextInput from "../../components/IconTextInput";
import ActivityButton from "../../components/ActivityButton";
import FormError from "../../components/FormError";
import {SoSaConfig} from "../../sosa/config";

export default class Register extends Component {
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
    }

    setLoading = (isLoading) => {
        this.setState({registering: isLoading});
    };

    doRegister = () => {
        return {
            withUsernameAndPassword: () => {
                Helpers.handleRegister(
                    this.state.usernameInput,
                    this.state.passwordInput,
                    this.state.emailInput,
                    (isLoading) => this.setState({registering: isLoading}),
                    (error) => this.setState({registerError: error}),
                    (json) => {
                        this.navigation.replace('MembersWrapper', {register: true});
                    }
                );
            },
            withImgur: () => {
                this.setState({'socialMediaError': ''});
                Helpers.handlePreauth(() => {}, () => {}, (json) => {
                    console.log(json);
                    Linking.openURL(`${SoSaConfig.auth.server}/imgur/register?app=1&preauth=${json.response}`);
                })
            },
            withReddit: () => {
                this.setState({'socialMediaError': ''});
                Helpers.handlePreauth(() => {}, () => {}, (json) => {
                    console.log(json);
                    Linking.openURL(`${SoSaConfig.auth.server}/reddit/register?app=1&preauth=${json.response}`);
                })
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
                        <SecureTextInput placeholder="Choose a password" onChangeText={data => this.setState({ passwordInput: data})} validateInput={() => this.validatePassword()} />

                        <View style={{height:40}}>
                            {
                                <ActivityButton showActivity={this.state.registering} onPress={this.doRegister.withUsernameAndPassword} text="Let me in!"/>
                            }
                        </View>

                        <FormError errorState={this.state.socialMediaError} />
                        <View style={{marginTop: 20, flexDirection:'row', justifyContent: 'center'}}>
                            <TouchableOpacity activeOpacity={0.5} onPress={this.doRegister().withImgur} style={Styles.socialButton}>
                                <Image source={require('../../assets/login/imgur_icon.png')} style={Styles.socialButtonIcon}/>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} onPress={this.doRegister().withReddit}  style={Styles.socialButton}>
                                <Image source={require('../../assets/login/reddit_icon.png')} style={Styles.socialButtonIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>


        );
  }
}
