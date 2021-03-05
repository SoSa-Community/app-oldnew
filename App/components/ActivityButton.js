import React from 'react';
import { ActivityIndicator, Text, TouchableWithoutFeedback, View } from "react-native";

import PropTypes from 'prop-types'
import Styles from "../screens/styles/onboarding";


const ActivityButton = ({showActivity, validateInput, onPress, text, style, disabled}) => {

    if(showActivity && !disabled){
        return  <TouchableWithoutFeedback>
            <View style={[Styles.letMeIn_button, Styles.letMeIn_button_pressed, style]}>
                <Text style={Styles.letMeIn_text}>{text}</Text>
                <ActivityIndicator size="small" style={Styles.letMeIn_activity} color="#fff"/>
            </View>
        </TouchableWithoutFeedback>;

    }else{
        if((!validateInput || validateInput()) && !disabled) {

            return <TouchableWithoutFeedback onPress={onPress}>
                <View style={[Styles.letMeIn_button, style]}>
                    <Text style={Styles.letMeIn_text}>{text}</Text>
                </View>
            </TouchableWithoutFeedback>;

        }else{

            return <TouchableWithoutFeedback>
                <View style={[Styles.letMeIn_button, Styles.letMeIn_button_pressed, style]}>
                    <Text style={Styles.letMeIn_text}>{text}</Text>
                </View>
            </TouchableWithoutFeedback>;

        }
    }
}

ActivityButton.propTypes = {
    showActivity: PropTypes.bool,
    validateInput: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    style: PropTypes.object,
    disabled: PropTypes.bool,
}

ActivityButton.defaultProps = {
    showActivity: false,
    validateInput: false,
    style: null,
    disabled: false
}

export default ActivityButton;
