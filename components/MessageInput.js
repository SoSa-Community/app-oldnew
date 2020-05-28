import React, {Component} from 'react';

import {TextInput, View} from "react-native";
import IconButton from "./IconButton";

export default class MessageInput extends Component {

    render() {
        return (
            <View style={{backgroundColor: '#ffffff', flex: 1, flexDirection: 'row', paddingLeft: 10}}>
                <TextInput
                    style={{height: 40, flex:1}}
                    placeholder="Enter your message"
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    onSubmitEditing={this.props.sendAction}
                />
                <IconButton icon={['fal','paper-plane']}  style={{color: '#000', marginHorizontal:4, marginRight: 10, marginTop: 8}} size={22} onPress={this.props.sendAction} />
            </View>
        )
    }

}