import React, {Component} from 'react';

import {TextInput, View, TouchableOpacity, Dimensions} from "react-native";
import Icon from "./Icon";

export default class MessageInput extends Component {
    fucking = false;
    buttonLeft: 0;

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

        return (
            <View style={{backgroundColor: '#121211', flex: 1, flexDirection: 'row', paddingHorizontal: 4, paddingVertical: 6}}>
                <TextInput
                    selection={this.props.selection}
                    style={{alignContent:'center', maxHeight: 100, flex:1, backgroundColor: '#444442', borderRadius: 22, color: '#fff', marginRight: 6, paddingHorizontal:12, paddingTop:12, paddingBottom:12, alignSelf:'center' }}
                    placeholderTextColor = "#ccc"
                    placeholder="Enter your message"
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    onSelectionChange={this.props.onSelectionChange}
                    multiline={true}
                    onBlur={this.props.onBlur}
                    onKeyPress={this.props.onKeyPress}
                    autoCorrect={this.props.autoCorrect}
                />
                <TouchableOpacity onPress={onPress} style={buttonStyles}>
                    <Icon icon={['fal','paper-plane']}  style={{color: '#fff'}} size={18}  />
                </TouchableOpacity>
            </View>
        )
    }

}
