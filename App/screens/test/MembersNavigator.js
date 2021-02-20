import React, { useState, useRef, useEffect } from 'react';
import {Button, Text, View, TouchableHighlight} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import ImagePicker from 'react-native-image-picker';
import BaseStyles from '../styles/base';
import {pre} from 'react-native-render-html/src/HTMLRenderers';

const Stack = createStackNavigator();

const MembersNavigator = () => {
    useEffect(() => {
            console.debug('Re-rendering members navigator');
    }, []);
    
    return (
        <View style={BaseStyles.container} >
            <Button title={"hello"} onPress={() => {
                let options = {
                    title: 'Upload',
                    takePhotoButtonTitle: 'Take a Photo',
                    chooseFromLibraryButtonTitle: 'Select From Gallery',
                    storageOptions: {
                        skipBackup: true
                    },
                };
        
                ImagePicker.launchImageLibrary(options, (response) => {
                    console.debug(response);
                });
            }} />
        </View>
    );
}

export default React.memo(MembersNavigator, () => (true));
