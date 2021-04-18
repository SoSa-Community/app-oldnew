import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Keyboard, Platform, Modal, Button } from "react-native";
import { Picker as RNPicker } from '@react-native-community/picker';
import PropTypes from 'prop-types';


const Picker = ({ onChange, placeholder, value, options }) => {
    
    const [ inputValue, setInputValue ] = useState('');
	const [ showPicker, setShowPicker ] = useState(false);
	const [ tempPickerValue, setTempPickerValue ] = useState('');
	
 
    const doChange = (selectedValue) => {
        setShowPicker(false);
        onChange(selectedValue)
    }
    
    const getLabel = () => {
        const found = options.filter(({ value }) => value === inputValue).pop();
        
        if(found) return found.label;
        return inputValue;
    }
    
    const Picker = () => {
        const items = options.map(({label, value}) => {
            return <RNPicker.Item label={label} value={value} key={value} />
        });
        
        return (
            <RNPicker
                selectedValue={Platform.OS === 'ios' && tempPickerValue ? tempPickerValue : inputValue}
                placeholder={placeholder}
                prompt={placeholder}
                style={{flex: 1, color: '#121111'}}
                textStyle={{fontSize: 12, color: '#121111'}}
                size={12}
                onValueChange={(itemValue, itemIndex) => {
                    if(Platform.OS === 'ios'){
                        setTempPickerValue(itemValue);
                    }else {
                        doChange(itemValue)
                    }
                }}
            >
                { items }
            </RNPicker>
        )
    };
    
    useEffect(() => setInputValue(value), [value]);
    
    if(Platform.OS !== 'ios') return <Picker />;
    else {
        return (
            <>
                <TouchableOpacity onPress={() => {Keyboard.dismiss(); setShowPicker(true)}} style={{marginHorizontal: 4, flex: 1, height: '100%', justifyContent:'center'}}>
                    { inputValue.length > 0 && <Text style={{color: '#121111'}}>{ getLabel() }</Text>}
                    { inputValue.length === 0 && <Text style={{color: '#ccc'}}>{ placeholder }</Text>}
                </TouchableOpacity>
                <Modal visible={showPicker} transparent={true} onRequestClose={() => setShowPicker(false)}>
                    <View style={{flex:1, justifyContent:'center', backgroundColor:'rgba(0,0,0,0.75)'}}>
                        <View style={{backgroundColor:'#fff', height:300, borderRadius:12, marginHorizontal: 24, justifyContent:'center'}}>
                            <Picker />
                            <View style={{flex:1, flexDirection: 'row', justifyContent:'center', alignItems:'flex-end', marginBottom: 16}}>
                                <Button title="Cancel" style={{flex:1}} onPress={() => setShowPicker(false)}/>
                                <Button title="Confirm" style={{flex:1}} onPress={() => doChange(tempPickerValue)}/>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>);
    }
}

Picker.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChange: PropTypes.func,
    options: PropTypes.array,
};

Picker.defaultProps = {
    placeholder: '',
    value: '',
    onChange: null,
    options: [],
};

export default Picker;
