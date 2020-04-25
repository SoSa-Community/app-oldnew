import React, {Component} from 'react';
import Styles from "../screens/styles/login";
import {TextInput, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export default class IconTextInput extends Component {

    render() {
        return (
            <View style={Styles.inputParentContainer}>
                <View style={Styles.inputContainer}>
                    <FontAwesomeIcon icon={this.props.icon}  style={Styles.inputIcon} size={18}/>
                    <TextInput placeholder={this.props.placeholder} placeholderTextColor="#ccc" value={this.props.value} style={Styles.input} onChangeText={this.props.onChangeText}/>
                </View>
            </View>
        );
    }

}