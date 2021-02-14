import React, { useState, useEffect } from 'react';
import {Text, View, TouchableHighlight, KeyboardAvoidingView, Alert} from 'react-native';

import BaseStyles from '../styles/base'
import AppConfig from "../../config";

import Styles from '../styles/onboarding'
import CredentialInput from '../../components/auth/CredentialInput';
import SocialButtons from '../../components/auth/SocialButtons';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
    const { middleware } = useApp();
    const { linkPreauth, deviceLogin } = useAuth();
    
    const [ error, setError ] = useState('');
    const [ socialMediaError, setSocialMediaError ] = useState('');
    const [ processing, setProcessing ] = useState(false);
    
    const RegisterButton = () => {
        if(!AppConfig.features.general.canRegister) return <View style={Styles.buttonBottom}></View>;
        
        return <View style={Styles.buttonBottom}>
            <TouchableHighlight onPress={() => this.navigation.navigate('Register', {})} style={Styles.newToSoSaButton}>
                <View>
                    <Text style={Styles.newToSoSaButtonText}>New to SoSa?</Text>
                </View>
            </TouchableHighlight>
        </View>;
    }
    
    useEffect(() => {
        middleware.clear('login');
        middleware.add('login', `login/preauth`, (data) => {
            const {status, link_token, device_id, unregistered, error} = data;
            console.info('App::AuthComponent::preauth_trigger', data);
        
            if(status === 'success'){
                if(unregistered){
                    Alert.alert("You're not registered!","Would you like us to create an account for you?",
                        [{text: "No", style: "cancel"},
                            {
                                text: "Sure! let's do it!",
                                onPress: () => {
                                    linkPreauth(link_token)
                                        .catch((error) => setSocialMediaError(error));
                                }
                            }],
                        { cancelable: true }
                    );
                }else{
                    deviceLogin(device_id)
                        .catch((error) => setSocialMediaError(error));
                }
            }
            else {
                setSocialMediaError(error);
            }
        }, true);
    }, []);
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >
            <View style={BaseStyles.container}>
                <View style={{marginTop: 20, paddingHorizontal:20, flex: 1}}>
                    <View style={[Styles.content_container]}>
                        <CredentialInput screenType="login" {...{ error, setError, setSocialMediaError, processing, setProcessing} } />
                        <SocialButtons screenType="login" {...{ setError, socialMediaError, setSocialMediaError, processing, setProcessing} } />
                    </View>
                    <RegisterButton />
                </View>
            </View>
        </KeyboardAvoidingView>

    );
}

export default LoginScreen;
