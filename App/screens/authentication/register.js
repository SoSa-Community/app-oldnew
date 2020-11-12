import React from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {View} from 'react-native';

import withAppContext from "../hoc/withAppContext";
import AuthComponent from "./AuthComponent";

class Register extends AuthComponent {
    
    screenType = 'register';
    
    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{paddingHorizontal: 30, justifyContent: 'center'}}>
                    <View style={Styles.content_container}>
                        <this.CredentialInput/>
                        <this.SocialButtons/>
                    </View>
            
                </View>
            </View>
        );
    }
}


const RegistrationScreen = withAppContext(Register);
export default RegistrationScreen;
