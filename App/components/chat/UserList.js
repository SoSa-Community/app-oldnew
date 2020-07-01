import React from 'react';
import {UserItem} from "./UserItem";

export const UserList = ({onPress, slim, userList}) => {
    return userList.map((user) => (<UserItem key={user.user_id.toString()} onPress={() => onPress(user)} user={user} slim={slim}/>));
};
