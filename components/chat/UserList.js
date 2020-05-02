import React, {Component} from 'react';
import {Text, View} from "react-native";
import Styles from '../../screens/styles/chat'

export default class UserList extends Component {

    render() {
        let users = this.props.userList.map((item, i) => {
            return (
                <View style={{verticalAlign:'center', padding: 10}} key={item.user_id}>
                    <Text style={Styles.user}>{item.nickname}</Text>
                </View>);
        });
        return users;
    }

}