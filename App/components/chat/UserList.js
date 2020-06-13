import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableHighlight} from "react-native";

const Styles = StyleSheet.create({
    itemText: {
        textAlign: 'left',
        color: '#FFF'
    },
});

export default class UserList extends Component {

    render() {
        let onPress = this.props.onPress;
        let users = this.props.userList.map((item, i) => {
            return (
                <View style={{flex: 1}} key={item.user_id} >
                    <TouchableHighlight onPress={() => onPress(item)}>
                        <View style={{flexDirection:'row', alignItems: 'center', paddingLeft: 12, paddingVertical: 12}}>
                            <Image source={{uri : 'https://picsum.photos/seed/picsum/300/300'}} style={{marginRight: 12, width: 32, height: 32, borderRadius: 32/2}} />
                            <Text style={Styles.itemText}>{item.nickname}</Text>
                        </View>
                    </TouchableHighlight>
                </View>);
        });
        return users;
    }

}
