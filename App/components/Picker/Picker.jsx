import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Keyboard, Platform, Modal, Button } from "react-native";
import { Picker as RNPicker } from '@react-native-community/picker';
import PropTypes from 'prop-types';
import PickerModal from './PickerModal';

const Picker = ({ onChange, placeholder, value, options }) => {
    
    const [ selectedValue, setSelectedValue ] = useState('');
	const [ showPicker, setShowPicker ] = useState(false);
	const [ tempPickerValue, setTempPickerValue ] = useState('');
	
 
    const doChange = (selectedValue) => {
        setSelectedValue(selectedValue);
        setShowPicker(false);
        onChange(selectedValue)
    }
    
    const getLabel = () => {
        const found = options.filter(({ value }) => value === selectedValue).pop();
        
        if(found) return found.label;
        return selectedValue;
    }
    
    const Picker = () => {
        const items = options.map(({label, value}) => {
            return <RNPicker.Item label={label} value={value} key={value} />
        });
        
        return (
            <RNPicker
                selectedValue={Platform.OS === 'ios' && tempPickerValue ? tempPickerValue : selectedValue}
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
    
    useEffect(() => setSelectedValue(value), [value]);
    
    if(Platform.OS !== 'ios') return <Picker />;
    else {
        return (
            <PickerModal
                setVisible={setShowPicker}
                visible={showPicker}
                value={ selectedValue }
                label={ getLabel() }
                placeholder={ placeholder }
                onCancel={() => setShowPicker(false)}
                onConfirm={() => doChange(tempPickerValue)}
            >
                <Picker />
            </PickerModal>
        );
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
