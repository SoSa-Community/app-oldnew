import React from 'react';
import {Image, Linking, Text, TouchableOpacity, View} from "react-native";

import {StyleSheet} from 'react-native';
import HTML from 'react-native-render-html';

const Styles = StyleSheet.create({
    container: {
        marginTop:10
    },

    containerWithMention: {
        backgroundColor: '#000000'
    },

    inner: {
        flexDirection: 'row',
        padding: 10
    },

    message: {
        color: '#ffffff',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 10
    },

    username: {
        color: '#ffffff',
        paddingBottom: 3,
        fontWeight: 'bold'
    },

    picture: {width: 48, height: 48, borderRadius: 48/2}
});

export const MessageItem = ({message, onFacePress, onLongFacePress, onUsernamePress}) =>{

    let containerStyles = [Styles.container];
    if(message.mentions.length > 0 && message.mentions.indexOf(this.nickname) !== -1){
        containerStyles.push(Styles.containerWithMention);
    }

    if(!message.picture || message.picture.length === 0){
        message.picture = 'https://picsum.photos/seed/picsum/300/300';
    }

    return  <View style={containerStyles}>
        <View style={Styles.inner}>
            <View style={{marginRight: 10}}>
                <TouchableOpacity onPress={onFacePress} onLongPress={onLongFacePress}>
                    <Image source={{uri : message.picture}} style={Styles.picture} />
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity onPress={onUsernamePress}>
                    <Text style={Styles.username}>{message.nickname}</Text>
                </TouchableOpacity>
                <HTML html={message.parsed_content}
                      tagsStyles={{ a: { color: '#7ac256' }}}
                      baseFontStyle={{color: "#fff"}}
                      onLinkPress={(evt, href) => Linking.openURL(href)}
                      renderers={{
                          spoiler: {
                              wrapper: 'Text',
                              renderer: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                                  <Text> {children} </Text>
                              )
                          }
                      }}/>
            </View>
        </View>
    </View>

}
