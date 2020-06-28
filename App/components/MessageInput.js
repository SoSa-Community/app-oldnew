import React, {Component} from 'react';

import {TextInput, View, TouchableOpacity, Dimensions, Text, StyleSheet} from "react-native";
import Icon from "./Icon";

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#121211',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 4,
        paddingVertical: 6
    },

    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#444442',
        borderRadius: 22,
        marginRight: 6
    },

    textInput: {
        alignContent:'center',
        maxHeight: 100,
        flex:1,
        color: '#fff',
        paddingHorizontal:12,
        paddingTop:12,
        paddingBottom:12,
        alignSelf:'center'
    },

    lengthIndicator: {
        alignSelf:'center',
        paddingRight:12
    },

    lengthIndicatorWarning: {
        color: '#f0ad4e'
    },

    lengthIndicatorDanger: {
        color: '#dc3545'
    },

    icon: {color: '#fff'}
})

export default class MessageInput extends Component {
    fucking = false;
    buttonLeft: 0;
    text = '';
    maxLength = 1000;

    render() {
        let buttonBackgroundColor = this.props.canSend ? '#7ac256' : '#ccc';
        let buttonStyles = {alignSelf:'center', backgroundColor:buttonBackgroundColor, height:42, width:42, borderRadius: 24, alignItems: 'center', justifyContent: 'center'};

        if(this.props.fuckWith){
            buttonStyles.position = 'absolute';

            if(!this.fucking){
                this.fucking = true;
                this.buttonLeft = Math.floor(Math.random() * ((Math.round(Dimensions.get('window').width) - 42) + 1));
            }
            buttonStyles.left = this.buttonLeft;
        }

        let onPress = () => {
            this.props.sendAction();
            this.fucking = false;
        };

        if(this.props.maxLength) this.maxLength = this.props.maxLength;

        let lengthIndicatorShowPercentage = (this.props.lengthIndicatorShowPercentage ? this.props.lengthIndicatorShowPercentage : 80);
        let lengthWarningPercentage = (this.props.lengthWarningPercentage ? this.props.lengthWarningPercentage : 90);
        let lengthDangerPercentage = (this.props.lengthDangerPercentage ? this.props.lengthDangerPercentage : 95);


        let lengthIndicatorStyles = [Styles.lengthIndicator];
        let lengthPercentage = ((this.text.length / this.maxLength) * 100);

        if(lengthPercentage >= lengthDangerPercentage){
            lengthIndicatorStyles.push(Styles.lengthIndicatorDanger);
        }
        else if(lengthPercentage >= lengthWarningPercentage){
            lengthIndicatorStyles.push(Styles.lengthIndicatorWarning);
        }

        return (
            <View style={Styles.container}>
                <View style={Styles.innerContainer}>
                    <TextInput
                        selection={this.props.selection}
                        style={Styles.textInput}
                        placeholderTextColor = "#ccc"
                        placeholder="Enter your message"
                        onChangeText={(data) => {
                            this.text = data;
                            if(this.props.onChangeText) this.props.onChangeText(data);
                        }}
                        value={this.props.value}
                        onSelectionChange={this.props.onSelectionChange}
                        multiline={true}
                        onBlur={this.props.onBlur}
                        onKeyPress={this.props.onKeyPress}
                        autoCorrect={this.props.autoCorrect}
                        maxLength={this.maxLength}
                    />
                    { (lengthPercentage >= lengthIndicatorShowPercentage ? <Text style={[lengthIndicatorStyles]}>{`${this.text.length}/${this.maxLength}`}</Text> : null) }
                </View>
                <TouchableOpacity onPress={onPress} style={buttonStyles}>
                    <Icon icon={['fal','paper-plane']}  style={Styles.icon} size={18}  />
                </TouchableOpacity>
            </View>
        )
    }

}
