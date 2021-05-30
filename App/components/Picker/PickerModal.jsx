import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Keyboard, Platform, Modal, Button } from "react-native";
import PropTypes from 'prop-types';


const PickerModal = ({ value, setVisible, visible, onConfirm, onCancel, placeholder, label, children }) => {
    
    return (<>
            <TouchableOpacity onPress={() => { Keyboard.dismiss(); setVisible(true) }} style={{marginHorizontal: 4, flex: 1, height: '100%', justifyContent:'center'}}>
                { value.length > 0 && <Text style={{color: '#121111'}}>{ label }</Text> }
                { value.length === 0 && <Text style={{color: '#ccc'}}>{ placeholder }</Text> }
            </TouchableOpacity>
            <Modal visible={visible} transparent={true} onRequestClose={() => onCancel()}>
                <View style={{flex:1, justifyContent:'center', backgroundColor:'rgba(0,0,0,0.75)'}}>
                    <View style={{backgroundColor:'#fff', height:300, borderRadius:12, marginHorizontal: 24, justifyContent:'center'}}>
                        { children }
                        <View style={{flex:1, flexDirection: 'row', justifyContent:'center', alignItems:'flex-end', marginBottom: 16}}>
                            <Button title="Cancel" style={{flex:1}} onPress={() => onCancel()}/>
                            <Button title="Confirm" style={{flex:1}} onPress={() => onConfirm()}/>
                        </View>
                    </View>
                </View>
            </Modal>
        </>);
}

PickerModal.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    setVisible: PropTypes.func,
    visible: PropTypes.bool,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    children: PropTypes.any
};

PickerModal.defaultProps = {
    value: '',
    setVisible: () => {},
    visible: false,
    onConfirm: () => {},
    onCancel: () => {},
    label: '',
    placeholder: '',
};

export default PickerModal;
