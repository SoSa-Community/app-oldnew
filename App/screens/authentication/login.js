import React, { useState, useEffect } from 'react';
import {Text, View, TouchableHighlight, KeyboardAvoidingView, Alert} from 'react-native';

import BaseStyles from '../styles/base'
import AppConfig from "../../config";

import Styles from '../styles/onboarding'
import CredentialInput from '../../components/auth/CredentialInput';
import SocialButtons from '../../components/auth/SocialButtons';

const LoginScreen = ({navigation}) => {
    const [ error, setError ] = useState('');
    const [ socialMediaError, setSocialMediaError ] = useState('');
    const [ processing, setProcessing ] = useState(false);
    
    const RegisterButton = () => {
        if(!AppConfig.features.general.canRegister) return <View style={Styles.buttonBottom}></View>;
        
        return <View style={Styles.buttonBottom}>
            <TouchableHighlight onPress={() => navigation.navigate('Register', {})} style={Styles.newToSoSaButton}>
                <View>
                    <Text style={Styles.newToSoSaButtonText}>New to SoSa?</Text>
                </View>
            </TouchableHighlight>
        </View>;
    }
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >
            <View style={BaseStyles.container}>
                <View style={{marginTop: 20, paddingHorizontal:20, flex: 1}}>
                    <View style={[Styles.content_container]}>
                        <CredentialInput forLogin {...{ error, setError, setSocialMediaError, processing, setProcessing} } />
                        <SocialButtons forLogin {...{ setError, socialMediaError, setSocialMediaError, processing, setProcessing} } />
                    </View>
                    <RegisterButton />
                </View>
            </View>
        </KeyboardAvoidingView>

    );
}

export default LoginScreen;
