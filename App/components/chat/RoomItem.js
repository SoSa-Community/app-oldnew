import React from 'react';
import {Text, View, TouchableHighlight} from "react-native";
import {Icon} from '../Icon';

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

export const RoomItem = ({room, roomActive, onPress}) =>{

        let color =  '#ccc';
        if(roomActive) color = '#fff';

        return  <TouchableHighlight onPress={onPress}>
            <View style={Styles.room}>
                <Icon icon={['fal', 'campfire']} size={18} style={{marginRight:14, color}}/>
                <Text style={{flex: 1, fontSize: 16, color}}>{room.title || room.name}</Text>
            </View>
        </TouchableHighlight>

}
