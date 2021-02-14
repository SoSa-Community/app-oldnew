import React, { useState } from 'react';
import {Linking, View} from 'react-native';

import { useAuth } from '../../context/AuthContext';

import AppConfig from '../../config';

import SocialButton from '../SocialButton';
import FormError from '../FormError';

const SocialButtons = ({screenType, setError, socialMediaError, setSocialMediaError, processing, setProcessing}) => {
    
    const { socialLogin } = useAuth();
    
    const {social: {imgur, reddit, google, twitter, facebook}} = AppConfig.features[screenType];
    const onboardingPath = '../../assets/onboarding/';
    
    let login = (network) => {
        setError('')
        setSocialMediaError('');
        setProcessing(true);
        
        // Protects against state getting out of sync
        setTimeout(() => setProcessing(false),1000);
        
        socialLogin(screenType, network)
            .catch(error => {
                console.debug(error);
                setSocialMediaError(error?.message)
            });
    };
    
    const createSocialButton = (network, icon) => {
        return <SocialButton onPress={() => login(network)} icon={icon} enabled={!processing} />;
    };
    
    return <View>
        <FormError errors={socialMediaError} />
        <View style={{marginTop: 20, flexDirection:'row', justifyContent: 'center'}}>
            {imgur ? createSocialButton('imgur', require(`${onboardingPath}imgur_icon.png`)) : null}
            {reddit ? createSocialButton('reddit', require(`${onboardingPath}reddit_icon.png`)) : null}
            {google ? createSocialButton('google', require(`${onboardingPath}google_icon.png`)) : null}
            {twitter ? createSocialButton('twitter', require(`${onboardingPath}twitter_icon.png`)) : null}
            {facebook ? createSocialButton('facebook', require(`${onboardingPath}facebook_icon.png`)) : null}
        </View>
    </View>
};

export default SocialButtons;
