import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {MembersNavigationContext} from '../../context/MembersNavigationContext';

import ProfilePicture from '../../components/ProfilePicture';

const Styles = StyleSheet.create({
    topContainer: {
        flex: 0,
        alignItems: 'center',
        marginVertical: '5%'
    },
    
    username: {
        fontSize: 22,
        marginTop: 6,
    }
})

const nickname = '';
const MyProfileScreen = ({navigation}) => {
    
    return (
        <View style={{flex: 1}}>
            <View style={Styles.topContainer}>
                <ProfilePicture picture="https://picsum.photos/300/300?seed=${Math.random()}" size="verylarge" />
                <Text style={Styles.username}>{nickname}</Text>
            </View>
        </View>
    );
}

export default MyProfileScreen;
