import React from 'react';
import {UserItem} from "./UserItem";
import {View} from "react-native";

export const UserList = ({onPress, slim, userList}) => {
    return userList.map((user) => {
        return <View key={user.user_id}><UserItem onPress={() => onPress(user)} user={user} slim={slim} /></View>
    });
};
