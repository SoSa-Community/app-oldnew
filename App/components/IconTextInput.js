import React from 'react';
import Styles from "../screens/styles/onboarding";
import {TextInput, View} from "react-native";
import {Icon} from './Icon';

export const IconTextInput = ({icon, placeholder, value, onChangeText, validateInput}) => {

    const displaySuccess = (errorString) => {
        if(errorString === null){
            return null;
        }else if(errorString.length === 0){
            return <Icon icon={['fas', 'check']}  style={Styles.inputIcon} size={18} color='#28a745' />
        }else{
            return <Icon icon={['fas', 'info-circle']}  style={Styles.inputIcon} size={18} color='#dc3545' onPress={() => {console.log(errorString);}} />
        }
    };

    return (
        <View style={Styles.inputParentContainer}>
            <View style={Styles.inputContainer}>
                <Icon icon={icon}  style={Styles.inputIcon} size={18}/>
                <TextInput placeholder={placeholder} placeholderTextColor="#ccc" value={value} style={Styles.input} onChangeText={onChangeText}/>
                { validateInput && displaySuccess(validateInput()) }
            </View>
        </View>
    );
}
