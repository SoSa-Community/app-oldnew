import React from 'react';
import {Image, Linking, Text, TouchableOpacity, View, Dimensions} from "react-native";

import {StyleSheet} from 'react-native';
import HTML from 'react-native-render-html';

const Styles = StyleSheet.create({
    container: {
        paddingVertical:12,
    },

    containerSeparator: {
        borderTopColor: '#444442',
        borderTopWidth: 0.5
    },

    containerSlim: {
        paddingVertical: 6,
    },

    containerWithMention: {
        backgroundColor: '#000000'
    },

    inner: {
        flexDirection: 'row',
        paddingHorizontal: 4
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

    picture: {width: 42, height: 42, borderRadius: 48/2}
});

export const MessageItem = ({message, onFacePress, onLongFacePress, onUsernamePress, myNickname, showSeparator, showSlim}) =>{

    let containerStyles = [Styles.container];
    if(message.mentions.length > 0 && message.mentions.indexOf(myNickname) !== -1){
        containerStyles.push(Styles.containerWithMention);
    }

    if(!message.picture || message.picture.length === 0){
        message.picture = `https://picsum.photos/300/300?seed=${Math.random()}`;
    }

    if(showSlim) containerStyles.push(Styles.containerSlim);
    if(showSeparator)  containerStyles.push(Styles.containerSeparator);

    const renderMessage = () => {
        if(typeof(message.parsed_content) === 'string' && message.parsed_content.length > 0){
            return <HTML html={message.parsed_content}
                         tagsStyles={{ a: { color: '#7ac256' }}}
                         baseFontStyle={{color: "#fff"}}
                         onLinkPress={(evt, href) => Linking.openURL(href)}
                         imagesMaxWidth={Dimensions.get('window').width / 4}
                         ignoredStyles={['height', 'width']}
                         renderers={{
                             spoiler: {
                                 wrapper: 'Text',
                                 renderer: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                                       <Text> {children} </Text>
                                 )
                             }
                         }}/>
        }else{
            return <></>;
        }
    };

    const renderEmbeds = () => {
        let embeds = message.embeds.map((embed) => {
            if(embed.image && embed.image.length){
                return <View style={{height:100, flexDirection: 'row', justifyContent:'flex-start'}}>
                            <TouchableOpacity onPress={() => Linking.openURL(embed.image)}>
                                <Image source={{uri : embed.image}} style={{width:100, aspectRatio: 1/1}} resizeMethod="resize" resizeMode="stretch"/>
                            </TouchableOpacity>
                </View>
            }
        });
        return embeds;
    };

    return  <View style={containerStyles}>
        <View style={Styles.inner}>
            <View style={{marginRight: 10}}>
                <TouchableOpacity onPress={onFacePress} onLongPress={onLongFacePress} style={{backgroundColor: '#444442', padding: 4, borderRadius: 100/2}}>
                    <Image source={{uri : message.picture}} style={Styles.picture} />
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity onPress={onUsernamePress}>
                    <Text style={Styles.username}>{message.nickname}</Text>
                </TouchableOpacity>
                <View>
                    {renderMessage()}
                    <View style={{flexDirection: 'row', marginTop: 8}}>
                        {renderEmbeds()}
                    </View>
                </View>
            </View>
        </View>
    </View>

}
