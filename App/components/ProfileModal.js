import React from 'react';

import {TextInput, View, TouchableOpacity, Dimensions, Text, StyleSheet, Image, Modal} from "react-native";
import {Icon} from './Icon';

const Styles = StyleSheet.create({
    container: {flex:1, justifyContent:'flex-end', marginTop:48},
    fade: {backgroundColor:'#2b2b2b', opacity:0.8, flex:3},
    body: {backgroundColor:'#121211', flex:1, padding:16, flexDirection:'row', alignItems:'center'},
    pictureContainer: {flex:1},
    textContainer: {flex:1},
    text: {color:'#fff', fontSize:36, textAlign:'left'},
    picture: {width: 128, height: 128, borderRadius: 128/2}
});

export const ProfileModal = ({visible, profile, dismissTouch}) => {

    return (
        <Modal animationType="slide" visible={visible} transparent={true} hardwareAccelerated={true}>
            {visible &&
                <View style={Styles.container}>
                    <TouchableOpacity style={Styles.fade} onPress={dismissTouch}>

                    </TouchableOpacity>
                    <View style={Styles.body}>
                        <View style={Styles.pictureContainer}>
                            <Image source={{uri : profile.picture}} style={Styles.picture} />
                        </View>
                        <View style={Styles.textContainer}>
                            <Text style={Styles.text}>{profile.nickname}</Text>
                        </View>
                    </View>
                </View>
            }
        </Modal>
    )
}
