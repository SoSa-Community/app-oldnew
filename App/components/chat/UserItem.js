import React from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight } from "react-native";
import PropTypes from "prop-types";

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
        borderTopColor: '#121211',
        backgroundColor: '#444442',
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

const UserItem = ({onPress, onLongPress, user, slim}) => {

    let userContainerStyle = [Styles.userContainer];
    let imageStyle = [Styles.image];

    if(slim){
        userContainerStyle.push(Styles.slimUserContainer);
        imageStyle.push(Styles.slimImage);
    }

    return (
        <TouchableHighlight onPress={onPress} onLongPress={onLongPress}>
            <View style={userContainerStyle}>
                <Image source={{uri : 'https://picsum.photos/seed/picsum/300/300'}} style={imageStyle} />
                <Text style={Styles.itemText}>{user.nickname}</Text>
            </View>
        </TouchableHighlight>
    );
}

UserItem.propTypes = {
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    user: PropTypes.shape({
        nickname: PropTypes.string,
        picture: PropTypes.string,
    }).isRequired,
    slim: PropTypes.bool
};

UserItem.defaultProps = {
    onPress: null,
    slim: false
};

export default UserItem
