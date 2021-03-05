import React from 'react';
import { ActivityIndicator, TextInput, View, TouchableOpacity, Dimensions, Text, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import Icon from './Icon';
import AppConfig from "../config";


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

const MessageInput = ({canSend, sendAction, maxLength, lengthIndicatorShowPercentage, lengthWarningPercentage,
    lengthDangerPercentage, onChangeText, selection, value, onSelectionChange, onBlur, onKeyPress, autoCorrect,
    fuckWith, uploadComplete, uploadAction, uploading, placeholder}) =>
{
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
                AppConfig.features.general.canUpload && uploadAction &&
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
                    placeholder={placeholder}
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

MessageInput.propTypes = {
    canSend: PropTypes.bool,
    sendAction: PropTypes.func.isRequired,
    maxLength: PropTypes.number,
    lengthIndicatorShowPercentage: PropTypes.number,
    lengthWarningPercentage: PropTypes.number,
    lengthDangerPercentage: PropTypes.number,
    onChangeText: PropTypes.func,
    selection: PropTypes.shape({start: PropTypes.number, end: PropTypes.number}),
    value: PropTypes.string,
    onSelectionChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyPress: PropTypes.func,
    autoCorrect: PropTypes.bool,
    fuckWith: PropTypes.bool,
    uploadComplete: PropTypes.func,
    uploadAction: PropTypes.func,
    uploading: PropTypes.bool,
    placeholder: PropTypes.string
};

MessageInput.defaultTypes = {
    canSend: true,
    maxLength: 1000,
    lengthIndicatorShowPercentage: 80,
    lengthWarningPercentage: 90,
    lengthDangerPercentage: 95,
    onChangeText: null,
    selection: null,
    value: '',
    onSelectionChange: null,
    onBlur: null,
    onKeyPress: null,
    autoCorrect: true,
    fuckWith: false,
    uploadComplete: null,
    uploadAction: null,
    uploading: false,
    placeholder: ''
}

export default MessageInput;
