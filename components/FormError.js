import React, {Component} from 'react';
import Styles from "../screens/styles/login";
import {ActivityIndicator, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export default class FormError extends Component {

    render() {
        if(this.props.errorState && this.props.errorState !== null && this.props.errorState.length > 0){
            return <Text style={Styles.error}>{this.props.errorState}</Text>;
        }
        return null;
    }

}