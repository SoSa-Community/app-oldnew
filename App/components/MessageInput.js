import React from 'react';

import {ActivityIndicator, TextInput, View, TouchableOpacity, Dimensions, Text, StyleSheet} from "react-native";
import {Icon} from './Icon';
import {SoSaConfig} from "../sosa/config";


const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#121211',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 4,
        paddingTop: 6
    },

    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#444442',
        borderRadius: 22,
        marginRight: 6
    },

    textInput: {
        alignContent:'center',
        maxHeight: 100,
        flex:1,
        color: '#fff',
        paddingHorizontal:12,
        paddingTop:12,
        paddingBottom:12,
        alignSelf:'center'
    },

    lengthIndicator: {
        alignSelf:'center',
        paddingRight:12
    },

    lengthIndicatorWarning: {
        color: '#f0ad4e'
    },

    lengthIndicatorDanger: {
        color: '#dc3545'
    },

    icon: {color: '#fff'}
});

let fucking = false;
let buttonLeft = 0;
let text = '';

export const MessageInput = ({canSend, sendAction, maxLength, lengthIndicatorShowPercentage, lengthWarningPercentage,
    lengthDangerPercentage, onChangeText, selection, value, onSelectionChange, onBlur, onKeyPress, autoCorrect, fuckWith, uploadComplete, uploadAction, uploading}) => {

    if(!maxLength) maxLength = 1000;

    if(uploading) canSend = false;

    const buttonBackgroundColor = canSend ? '#7ac256' : '#ccc';
    let buttonStyles = {alignSelf:'center', backgroundColor:buttonBackgroundColor, height:42, width:42, borderRadius: 24, alignItems: 'center', justifyContent: 'center'};

    if(fuckWith){
        buttonStyles.position = 'absolute';

        if(!fucking){
            fucking = true;
            buttonLeft = Math.floor(Math.random() * ((Math.round(Dimensions.get('window').width) - 42) + 1));
        }
        buttonStyles.left = buttonLeft;
    }

    let onPress = () => {
        sendAction();
        fucking = false;
    };

    if(!lengthIndicatorShowPercentage) lengthIndicatorShowPercentage = 80;
    if(!lengthWarningPercentage) lengthWarningPercentage = 90;
    if(!lengthDangerPercentage) lengthDangerPercentage = 95;

    let lengthIndicatorStyles = [Styles.lengthIndicator];
    const lengthPercentage = ((text.length / maxLength) * 100);

    if(lengthPercentage >= lengthDangerPercentage){
        lengthIndicatorStyles.push(Styles.lengthIndicatorDanger);
    }
    else if(lengthPercentage >= lengthWarningPercentage){
        lengthIndicatorStyles.push(Styles.lengthIndicatorWarning);
    }

    return (
        <View style={Styles.container}>
            {
                SoSaConfig.features.general.canUpload &&
                <TouchableOpacity onPress={() => uploadAction(uploadComplete)} style={{alignSelf:'center', backgroundColor: '#444442', height:38, width:38, borderRadius:24, alignItems: 'center', justifyContent: 'center', marginRight: 8}}>
                    <Icon icon={['fal','image']}  style={Styles.icon} size={24}  />
                </TouchableOpacity>
            }
            <View style={Styles.innerContainer}>
                {uploading && <>
                    <ActivityIndicator color="#121211" size="large" style={{marginLeft: 10}}/>
                    <Text style={Styles.textInput}>Uploading...</Text>
                </>}
                {!uploading &&
                <TextInput
                    selection={selection}
                    style={Styles.textInput}
                    placeholderTextColor = "#ccc"
                    placeholder="Enter your message"
                    onChangeText={(data) => {
                        text = data;
                        if(onChangeText) onChangeText(data);
                    }}
                    value={value}
                    onSelectionChange={onSelectionChange}
                    multiline={true}
                    onBlur={onBlur}
                    onKeyPress={onKeyPress}
                    autoCorrect={autoCorrect}
                    maxLength={maxLength}
                />}
                { (lengthPercentage >= lengthIndicatorShowPercentage ? <Text style={[lengthIndicatorStyles]}>{`${text.length}/${maxLength}`}</Text> : null) }
            </View>
            <TouchableOpacity onPress={onPress} style={buttonStyles}>
                <Icon icon={['fal','paper-plane']}  style={Styles.icon} size={18}  />
            </TouchableOpacity>
        </View>
    )
}
