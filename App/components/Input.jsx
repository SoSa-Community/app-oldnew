import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import { TextInput, View, TouchableOpacity, TouchableHighlight, Text } from "react-native";
import PropTypes from 'prop-types';

import Icon from './Icon';
import DateTimePicker from './DateTimePicker/DateTimePicker';
import Picker from './Picker/Picker';

import Styles from "../screens/styles/onboarding";
import InputWrapper from './InputWrapper/InputWrapper';

const Input = forwardRef(({
    icon,
    placeholder,
    value,
    initialValue,
    onChangeText,
    validateInput,
    error,
    errorBorderOnly,
    enabled,
    allowClear,
    alwaysShowClear,
    type,
    pickerOptions=[],
    minLength,
    maxLength,
    selection,
    onSelectionChange,
    onBlur,
    onKeyPress,
    autoCorrect,
    lengthIndicatorShowPercentage,
    lengthWarningPercentage,
    lengthDangerPercentage,
    setIsValid,
    label,
    labelStyle,
    containerStyle,
    outerContainerStyle,
    innerContainerStyle,
    inputStyle,
    showSaveButtons,
    onSave,
    onCancel,
    editable,
    textStyle,
    textValue,
    form,
    name
}, ref) => {
 
	const [ inputValue, setInputValue ] = useState(initialValue || '');
	const [ lengthPercentage, setLengthPercentage ] = useState(0);
 
	const clear = () => setInputValue('');

	const handleChange = (data) => {
		let otherData = null;
		
	    if(data !== undefined){
			setInputValue(data);
			if(typeof(onChangeText) === 'function') onChangeText(data, otherData);
		}
	};
	
	const reset = () => {
	    if(initialValue !== null) {
	        handleChange(initialValue);
        }
	    else handleChange(value);
    };
    
    
	const renderTextField = () => {
        let styles = [Styles.input];
        if(type === 'multiline') styles.push(Styles.multiline);
        styles.push(inputStyle);
    
        const renderLengthWarning = () => {
        
            let lengthIndicatorStyles = [Styles.lengthIndicator];
            if(inputValue.length >= minLength){
                if(lengthPercentage >= lengthDangerPercentage){
                    lengthIndicatorStyles.push(Styles.lengthIndicatorDanger);
                }
                else if(lengthPercentage >= lengthWarningPercentage){
                    lengthIndicatorStyles.push(Styles.lengthIndicatorWarning);
                }
                if(lengthPercentage >= lengthIndicatorShowPercentage) return (<Text style={[lengthIndicatorStyles]}>{`${inputValue.length}/${maxLength}`}</Text>);
            }else{
                lengthIndicatorStyles.push(Styles.lengthIndicatorNeutral);
                return (<Text style={[lengthIndicatorStyles]}>{!inputValue.length ? 'at-least ' : ''}{`${minLength - inputValue.length}`}{!inputValue.length ? ' thingies ' : ''}</Text>);
            }
        };
    
        return (
            <>
                <TextInput
                    selection={selection}
                    onSelectionChange={onSelectionChange}
                    multiline={(type === 'multiline')}
                    placeholder={placeholder}
                    placeholderTextColor="#ccc"
                    value={inputValue}
                    style={styles}
                    onChangeText={
                        (data) => {
                            handleChange(data);
                            if( form ) {
                                const { register } = form;
                                if(register && name) register(name).onChange(data);
                            }
                        }
                    }
                    editable={enabled}
                    onBlur={onBlur}
                    onKeyPress={onKeyPress}
                    autoCorrect={autoCorrect}
                    maxLength={maxLength ? maxLength : null}
                />
                { renderLengthWarning() }
            </>
        );
    }
    
    const renderField = () => {
        if(!editable) {
            const styles = [{ color: '#121111' }];
            
            let text = inputValue;
            
            if(textValue) text = textValue
            else if(type === 'picker' && Array.isArray(pickerOptions)) {
                const found = pickerOptions.filter(({value}) => value === inputValue).pop();
                if(found) text = found?.label;
            }
            return <Text style={[styles, textStyle]}>{ text }</Text>
        }
        
        if(type === 'picker') return <Picker onChange={ handleChange } {...{ placeholder, value, options: pickerOptions, initialValue, ref } } /> ;
        if(type === 'date' || type === 'time') return <DateTimePicker onChange={ handleChange } {...{ placeholder, value, forTime: type === 'time' } } />;
        return renderTextField();
    };
    
    useEffect( () => {
        if(maxLength || minLength) {
            if (maxLength > 0) {
                if(typeof(inputValue) === 'string'){
                    setLengthPercentage(Math.floor((inputValue.length / maxLength) * 100));
                } else {
                    setLengthPercentage(0);
                }
            }
        }
    }, [inputValue] );
    
    
    useEffect(() => {
        if(value !== null) setInputValue(value)
    }, [value]);
    
    useImperativeHandle(ref, () => ({ value: inputValue, clear, reset, set: handleChange }));
    
    return (
        <InputWrapper {...{
            icon,
            value: inputValue,
            validateInput,
            error,
            errorBorderOnly,
            allowClear,
            alwaysShowClear,
            minLength,
            maxLength,
            setIsValid,
            label,
            labelStyle,
            containerStyle,
            outerContainerStyle,
            innerContainerStyle,
            onSave,
            onCancel,
            onClear: clear,
            editable
        } }
        >
            { renderField() }
        </InputWrapper>
    )
});

Input.propTypes = {
    icon: PropTypes.array,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    initialValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChangeText: PropTypes.func,
    validateInput: PropTypes.bool,
    error: PropTypes.string,
    errorBorderOnly: PropTypes.bool,
    enabled: PropTypes.bool,
    allowClear: PropTypes.bool,
    alwaysShowClear: PropTypes.bool,
    type: PropTypes.oneOf(['text','date', 'time', 'picker', 'multiline']),
    pickerOptions: PropTypes.array,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    selection: PropTypes.shape({start: PropTypes.number, end: PropTypes.number}),
    onSelectionChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyPress: PropTypes.func,
    autoCorrect: PropTypes.bool,
    setIsValid: PropTypes.func,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    outerContainerStyle: PropTypes.object,
    innerContainerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    lengthIndicatorShowPercentage: PropTypes.number,
    lengthWarningPercentage: PropTypes.number,
    lengthDangerPercentage: PropTypes.number,
    editable: PropTypes.bool
};

Input.defaultProps = {
    icon: null,
    placeholder: '',
    value: '',
    initialValue: null,
    onChangeText: null,
    validateInput: false,
    error: null,
    errorBorderOnly: false,
    enabled: true,
    allowClear: false,
    alwaysShowClear: false,
    type: 'text',
    pickerOptions: [],
    minLength: 0,
    maxLength: 255,
    selection: null,
    onSelectionChange: null,
    onBlur: null,
    onKeyPress: null,
    autoCorrect: true,
    setIsValid: null,
    label: '',
    labelStyle: null,
    containerStyle: null,
    outerContainerStyle: null,
    innerContainerStyle: null,
    inputStyle: null,
    lengthIndicatorShowPercentage: 80,
    lengthWarningPercentage: 90,
    lengthDangerPercentage: 95,
    editable: true
};

export default Input;
