import React, {Component} from 'react';
import Styles from "../screens/styles/login";
import {TextInput, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export default class SecureTextInput extends Component {

    state = {
        hideInput: true
    }

    displaySuccess = (errorString) => {
        if(errorString === null){
            return null;
        }else if(errorString.length === 0){
            return <FontAwesomeIcon icon={['fas', 'check']}  style={Styles.inputIcon} size={18} color='#28a745' />
        }else{
            return <FontAwesomeIcon icon={['fas', 'info-circle']}  style={Styles.inputIcon} size={18} color='#dc3545' onPress={() => {console.log(errorString);}} />
        }
    };

    displayViewInput = () => {
        let icon = 'eye-slash';
        let color = '#ccc';

        if(!this.state.hideInput){
            icon = 'eye';
            color = '#000';
        }
        return <FontAwesomeIcon icon={['fal', icon]}  style={[Styles.inputIcon, Styles.viewPasswordIcon]} size={22} color={color} onPress={() => {this.setState({hideInput: !this.state.hideInput});}} />
    };

    render() {
        return (
            <View style={Styles.inputParentContainer}>
                <View style={Styles.inputContainer}>
                    { this.props.icon ? <FontAwesomeIcon icon={this.props.icon}  style={Styles.inputIcon} size={18}/> : null }
                    <TextInput placeholder={this.props.placeholder} placeholderTextColor="#ccc" style={Styles.input} secureTextEntry={this.state.hideInput} onChangeText={this.props.onChangeText} value={this.props.value}/>
                    { this.props.validateInput ? this.displaySuccess(this.props.validateInput()) : null }
                    { this.displayViewInput() }
                </View>
            </View>
        );
    }

}