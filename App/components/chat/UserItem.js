import React from 'react';
import {Text, View, StyleSheet, Image, TouchableHighlight} from "react-native";

const Styles = StyleSheet.create({
    itemText: {
        textAlign: 'left',
        color: '#FFF'
    },

    userContainer: {
        flexDirection:'row',
        alignItems: 'center',
        paddingLeft: 12,
        paddingVertical: 12,
        borderTopColor: '#444442',
        backgroundColor: '#121211',
        borderTopWidth: 0.15
    },

    image: {
        marginRight: 12,
        width: 32,
        height: 32,
        borderRadius: 32/2
    },

    slimUserContainer: {
        paddingLeft: 10,
        paddingVertical: 8
    },

    slimImage: {
        marginRight: 10,
        width: 24,
        height: 24,
        borderRadius: 24/2
    },
});

export const UserItem = ({onPress, user, slim}) => {

    let userContainerStyle = [Styles.userContainer];
    let imageStyle = [Styles.image];

    if(slim){
        userContainerStyle.push(Styles.slimUserContainer);
        imageStyle.push(Styles.slimImage);
    }

    return (
        <TouchableHighlight onPress={onPress}>
            <View style={userContainerStyle}>
                <Image source={{uri : 'https://picsum.photos/seed/picsum/300/300'}} style={imageStyle} />
                <Text style={Styles.itemText}>{user.nickname}</Text>
            </View>
        </TouchableHighlight>
    );
}
