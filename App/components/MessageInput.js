import React, {Component} from 'react';

import {TextInput, View, TouchableOpacity} from "react-native";
import Icon from "./Icon";

export default class MessageInput extends Component {

    render() {
        return (
            <View style={{backgroundColor: '#121211', flex: 1, flexDirection: 'row', paddingHorizontal: 4, paddingVertical: 4}}>
                <TextInput
                    style={{maxHeight: 100, flex:1, backgroundColor: '#444442', borderRadius: 22, color: '#fff', marginRight: 6, paddingHorizontal:12, paddingVertical: 6}}
                    placeholderTextColor = "#ccc"
                    placeholder="Enter your message"
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    onSelectionChange={this.props.onSelectionChange}
                    multiline={true}
                />
                <TouchableOpacity onPress={this.props.sendAction} style={{alignSelf:'center', backgroundColor:'#7ac256', height:42, width:42, borderRadius: 24, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon icon={['fal','paper-plane']}  style={{color: '#fff'}} size={18}  />
                </TouchableOpacity>
            </View>
        )
    }

}
