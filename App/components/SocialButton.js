import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';

import Styles from "../screens/styles/onboarding";

export default class SocialButton extends Component {

    render() {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={this.props.onPress}  style={Styles.socialButton}>
                <Image source={this.props.icon} style={Styles.socialButtonIcon} />
            </TouchableOpacity>
        )
    }

}