import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Keyboard, Platform, Modal, Button } from "react-native";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import PropTypes from 'prop-types';

import Helpers from "../../sosa/Helpers";
import PickerModal from '../Picker/PickerModal';

const DateTimePicker = ({ onChange, placeholder, value, forTime }) => {
    
    const [ showPicker, setShowPicker ] = useState(false);
    const [ tempPickerValue, setTempPickerValue ] = useState(new Date());
    const [ selectedDate, setSelectedDate ] = useState(new Date());
    const formattedDate = selectedDate ? moment(selectedDate).format(forTime ? 'hh:mm' : 'DD/MM/YYYY') : '';
    
    const getType = () => forTime ? 'time' : 'date';
    
    const doChange = (data) => {
        setShowPicker(false);
        
        if(data) {
            setSelectedDate(data);
            const otherData = new Date(data.getTime());
            onChange(Helpers.dateToString(data, getType()), otherData);
        }
    }

    const renderFieldLabel = () => {
        const textValue = moment(selectedDate).format(forTime ? 'hh:mm' : 'DD/MM/YYYY');
        
        return (
            <TouchableOpacity
                onPress={() => {
                    Keyboard.dismiss();
                    setShowPicker(true)
                }}
                style={{marginHorizontal: 4, flex: 1, height: '100%', justifyContent: 'center'}}
            >
                {textValue.length > 0 && <Text style={{color: '#121111'}}>{ textValue }</Text>}
                {textValue.length === 0 && <Text style={{color: '#ccc'}}>{ placeholder }</Text>}
            </TouchableOpacity>
        );
    };
    
    const renderPicker = () => {
        if(!showPicker) return <></>;
        return (
            <RNDateTimePicker
                testID="dateTimePicker"
                value={Platform.OS === 'ios' && tempPickerValue ? tempPickerValue : selectedDate}
                mode={ getType() }
                display={Platform.OS === 'ios' ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                    if(Platform.OS === 'ios') {
                        setTempPickerValue(selectedDate);
                    }
                    else {
                        doChange(selectedDate);
                    }
                }}
            />
        );
    }
    
    useEffect(() => {
        if(value) {
            let date = (new Date(value));
            if(Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
                date = new Date();
            }
    
            if(forTime) {
                const [hour, minutes] = value.split(':');
                date.setHours(hour);
                date.setMinutes(minutes);
            }
            doChange(date);
        }
    }, [ value ])
    
    if(Platform.OS === 'ios'){
        return (
            <PickerModal
                setVisible={setShowPicker}
                visible={showPicker}
                value={ formattedDate }
                label={ formattedDate }
                placeholder={ placeholder }
                onCancel={() => setShowPicker(false)}
                onConfirm={() => doChange(tempPickerValue)}
            >
                { renderPicker() }
            </PickerModal>
        )
    }else{
        return (
            <>
                { renderFieldLabel() }
                { renderPicker() }
            </>
        );
    }
}

DateTimePicker.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChange: PropTypes.func,
    forTime: PropTypes.bool,
};

DateTimePicker.defaultProps = {
    placeholder: '',
    value: '',
    onChange: null,
    forTime: false,
};

export default DateTimePicker;
