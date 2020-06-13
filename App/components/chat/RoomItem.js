import React, {Component} from 'react';
import {Text, View} from "react-native";
import IconButton from "../IconButton";

import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
    room: {
        textAlign: 'center',
        color: '#000000',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingVertical: 4,
        paddingLeft: 10
    },

    currentRoom: {
        textAlign: 'center',
        backgroundColor: 'red'
    },
});

export default class RoomItem extends Component {

    render() {
        let roomStyles = [Styles.room];
        let room = this.props.room;

        roomStyles.push({flexDirection: 'row', justifyContent:'center', alignItems:'center'});
        console.log('Room Active', this.props.roomActive);
        /*if(this.props.roomState !== null && room.id === this.props.roomState.id){
            roomStyles.push(Styles.currentRoom);
        }*/
        return  <View style={roomStyles} onPress={this.props.onPress}>
            <IconButton icon={['fas', 'campfire']} size={18} style={{marginRight:14}}/>
            <Text style={{flex: 1, fontSize: 16}}>{room.title}</Text>
        </View>
    }
}
