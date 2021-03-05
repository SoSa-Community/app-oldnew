import React from 'react';
import UserItem from "./UserItem";
import {View} from "react-native";

export const UserList = ({onPress, onLongPress, slim, userList}) => {
    return userList.map((user) => {
        return <View key={user.user_id}>
            <UserItem onPress={() => onPress(user)} onLongPress={() => onLongPress(user)} user={user} slim={slim} />
        </View>
    });
};
