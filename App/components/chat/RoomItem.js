import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import Icon from '../Icon';

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
    
    text: {
        flex: 1,
        fontSize: 16
    }
});

const RoomItem = ({room, active, onPress}) =>{
        let color =  '#ccc';
        if(active) color = '#fff';
        const {title, name} = room

        return  <TouchableHighlight onPress={onPress}>
            <View style={Styles.room}>
                <Icon icon={['fal', 'campfire']} size={18} style={{marginRight:14, color}}/>
                <Text style={{...Styles.text, color}}>{title || name}</Text>
            </View>
        </TouchableHighlight>
}

RoomItem.propTypes = {
    room: PropTypes.shape({
        title: PropTypes.string,
        name: PropTypes.string
    }).isRequired,
    active: PropTypes.bool,
    onPress: PropTypes.func
};

RoomItem.defaultProps = {
    active: false,
    onPress: null
}

export default RoomItem;
