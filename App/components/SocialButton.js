import React from 'react';
import {Image, TouchableOpacity} from 'react-native';

import Styles from "../screens/styles/onboarding";

export const SocialButton = ({onPress, icon}) => {
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}  style={Styles.socialButton}>
            <Image source={icon} style={Styles.socialButtonIcon} />
        </TouchableOpacity>
    )
}
