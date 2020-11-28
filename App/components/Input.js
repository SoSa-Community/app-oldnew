import React from 'react';

import {TextInput, View, StyleSheet} from "react-native";

const Styles = StyleSheet.create({
    textInput: {
        flex:1,
        backgroundColor:'#fff',
        color: '#000',
        width: '100%',
        textAlignVertical: 'top',
        borderRadius: 8,
    },
    multiline: {
        minHeight: 180
    }
});

let text = '';
export const Input = ({maxLength, onChangeText, selection, value, onSelectionChange, onBlur, onKeyPress, autoCorrect, multiline, placeholder}) => {
    if(!maxLength) maxLength = 1000;
    
    let styles = [Styles.textInput];
    if(multiline) styles.push(Styles.multiline);
    
    return (
            <TextInput
                selection={selection}
                style={styles}
                placeholderTextColor = "#ccc"
                placeholder={placeholder}
                onChangeText={(data) => {
                    text = data;
                    if(onChangeText) onChangeText(data);
                }}
                value={value}
                onSelectionChange={onSelectionChange}
                multiline={multiline}
                onBlur={onBlur}
                onKeyPress={onKeyPress}
                autoCorrect={autoCorrect}
                maxLength={maxLength}
            />
    )
}
