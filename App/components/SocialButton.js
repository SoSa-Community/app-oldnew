import React from 'react';
import {Image, TouchableHighlight} from 'react-native';

import Styles from "../screens/styles/onboarding";

export const SocialButton = ({onPress, icon, enabled}) => {
    if(enabled !== true && enabled !== false) enabled = true;

    return (
        <TouchableHighlight onPress={onPress} style={[Styles.socialButton, {opacity: enabled ? 1 : 0.5}]} disabled={!enabled} >
            <Image source={icon} style={Styles.socialButtonIcon} />
        </TouchableHighlight>
    )
}
