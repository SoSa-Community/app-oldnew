import React, {Component} from 'react';
import Styles from "../screens/styles/onboarding";
import {ActivityIndicator, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export default class ActivityButton extends Component {

    render() {
        if(this.props.showActivity){

            return  <TouchableWithoutFeedback>
                <View style={[Styles.letMeIn_button, Styles.letMeIn_button_pressed]}>
                    <Text style={Styles.letMeIn_text}>{this.props.text}</Text>
                    <ActivityIndicator size="small" style={Styles.letMeIn_activity}/>
                </View>
            </TouchableWithoutFeedback>;

        }else{
            if(!this.props.validateInput || this.props.validateInput()) {

                return <TouchableWithoutFeedback onPress={this.props.onPress}>
                    <View style={[Styles.letMeIn_button]}>
                        <Text style={Styles.letMeIn_text}>{this.props.text}</Text>
                    </View>
                </TouchableWithoutFeedback>;

            }else{

                return <TouchableWithoutFeedback>
                    <View style={[Styles.letMeIn_button, Styles.letMeIn_button_pressed]}>
                        <Text style={Styles.letMeIn_text}>{this.props.text}</Text>
                    </View>
                </TouchableWithoutFeedback>;

            }
        }
    }

}