import React, {Component} from 'react';
import Styles from "../screens/styles/onboarding";
import {TextInput, View} from "react-native";
import {Icon} from './Icon';

export default class SecureTextInput extends Component {

    state = {
        hideInput: true
    }

    displaySuccess = (errorString) => {
        if(errorString === null){
            return null;
        }else if(errorString.length === 0){
            return <Icon icon={['fas', 'check']}  style={Styles.inputIcon} size={18} color='#28a745' />
        }else{
            return <Icon icon={['fas', 'info-circle']}  style={Styles.inputIcon} size={18} color='#dc3545' onPress={() => {console.log(errorString);}} />
        }
    };

    displayViewInput = () => {
        let icon = 'eye-slash';
        let color = '#ccc';

        if(!this.state.hideInput){
            icon = 'eye';
            color = '#000';
        }
        return <Icon icon={['fal', icon]}  style={[Styles.inputIcon, Styles.viewPasswordIcon]} size={22} color={color} onPress={() => {this.setState({hideInput: !this.state.hideInput});}} />
    };

    render() {
        let {icon, placeholder, onChangeText, value, enabled, validateInput} = this.props;

        if(enabled !== true && enabled !== false) enabled = true;

        return (
            <View style={Styles.inputParentContainer}>
                <View style={Styles.inputContainer}>
                    { icon && <Icon icon={icon}  style={Styles.inputIcon} size={18}/> }
                    <TextInput placeholder={placeholder} placeholderTextColor="#ccc" style={Styles.input} secureTextEntry={this.state.hideInput} onChangeText={onChangeText} value={value} editable={enabled}/>
                    { validateInput && this.displaySuccess(validateInput())}
                    { this.displayViewInput() }
                </View>
            </View>
        );
    }

}
