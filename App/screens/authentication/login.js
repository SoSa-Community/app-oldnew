import React from 'react';
import AuthComponent from './AuthComponent';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {Text, View, Linking, TouchableHighlight, KeyboardAvoidingView, Alert} from 'react-native';

import withAppContext from '../hoc/withAppContext';
import {SoSaConfig} from "../../sosa/config";

class Login extends AuthComponent {
    
    screenType = 'login';
    
    RegisterButton = () => {
        if(!SoSaConfig.features.general.canRegister) return <View style={Styles.buttonBottom}></View>;
        
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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
            >
                <View style={BaseStyles.container}>
                    <View style={{marginTop: 20, paddingHorizontal:20, flex: 1}}>
                        <View style={[Styles.content_container]}>
                            <this.CredentialInput />
                            <this.SocialButtons />
                        </View>
                        <this.RegisterButton />
                    </View>
                </View>
            </KeyboardAvoidingView>

        );
  }
}

const LoginScreen = withAppContext(Login);
export default LoginScreen;
