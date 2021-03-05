import React from 'react';

import {Linking, Modal, Text, TouchableHighlight, View} from 'react-native';
import FastImage from 'react-native-fast-image';

const UploadPreview = ({embed, images, onClose, handleDelete}) => {
    
    return (
        <Modal visible={(!!embed)} transparent={true} onRequestClose={onClose}>
            <View style={{backgroundColor:'rgba(0,0,0,0.75)', paddingTop: '15%', paddingBottom:'35%'}}>
                <View style={{backgroundColor:'#fff', height:'100%', borderRadius:12, alignItems:'center', overflow:'hidden', paddingHorizontal:'2%'}}>
                    <TouchableHighlight onPress={() => Linking.openURL(embed?.uri)}>
                        <FastImage source={{uri: embed?.image}} style={{width:'100%', marginTop:'2%', aspectRatio: 1/1, borderRadius: 12}}/>
                    </TouchableHighlight>
                    <View style={{flex:1, width:'100%', flexDirection: 'row', justifyContent:'flex-end', alignItems:'flex-end', marginBottom: 16}}>
                        <TouchableHighlight onPress={() => {
                            const index = images.indexOf(embed);
                            if(index !== -1) handleDelete(index)
                            onClose();
                        }} style={{alignItems:'center',
                            borderRadius: 8,
                            borderColor: '#dc3545',
                            borderWidth: 1,
                            backgroundColor: '#dc3545',
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            marginRight: 12
                        }}>
                            <Text style={{color:'#fff'}}>Remove</Text>
                        </TouchableHighlight>
                        
                        <TouchableHighlight
                            onPress={() => onClose()}
                            style={{
                                alignItems:'center',
                                borderRadius: 8,
                                borderColor: '#f0ad4e',
                                borderWidth: 1,
                                paddingVertical: 10,
                                paddingHorizontal: 24
                            }}
                        >
                            <Text>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal> )
}

export default UploadPreview;
