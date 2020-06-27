import React, {Component} from 'react';
import UserItem from "./UserItem";

export default class UserList extends Component {

    render() {
        let onPress = this.props.onPress;
        return this.props.userList.map((user) => (<UserItem key={user.user_id.toString()} onPress={() => onPress(user)} user={user} slim={this.props.slim}/>));
    }

}
