import React, {Component} from 'react';
import {Text, View} from "react-native";
import Icon from "../Icon";

import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
    room: {
        textAlign: 'center',
        color: '#000000',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 0.2,
        paddingVertical: 12,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
    },
});

export default class RoomItem extends Component {

    render() {
        let room = this.props.room;
        let color =  '#ccc';

        if(this.props.roomActive) color = '#fff';

        return  <View style={Styles.room} onPress={this.props.onPress}>
                    <Icon icon={['fal', 'campfire']} size={18} style={{marginRight:14, color}}/>
                    <Text style={{flex: 1, fontSize: 16, color}}>{room.title}</Text>
                </View>
    }
}
