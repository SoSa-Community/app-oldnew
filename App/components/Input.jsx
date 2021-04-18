import React, { useState, useEffect } from 'react';
import { TextInput, View, TouchableOpacity, TouchableHighlight, Text } from "react-native";
import PropTypes from 'prop-types';

import Icon from './Icon';
import DateTimePicker from './DateTimePicker/DateTimePicker';
import Picker from './Picker/Picker';

import Styles from "../screens/styles/onboarding";

const Input = ({
    icon,
    placeholder,
    value,
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
}) => {
 
	const [ inputValue, setInputValue ] = useState('');
	const [ lengthPercentage, setLengthPercentage ] = useState(0);
    
    let outerContainerStyles = [];
    let innerContainerStyles = [];

	const displaySuccess = (errorString) => {
		if(errorString === null){
			return null;
		}else if(errorString.length === 0){
			return <Icon icon={['fas', 'check']}  style={Styles.inputIcon} size={18} color='#28a745' />
		}else{
			return <Icon icon={['fas', 'info-circle']}  style={Styles.inputIcon} size={18} color='#dc3545' onPress={() => {console.log(errorString);}} />
		}
	};

	const showClear = () => !!((inputValue && inputValue.length) || alwaysShowClear);
	const clearInput = () => setInputValue('');

	const handleChange = (data) => {
		let otherData = null;
		
	    if(data !== undefined){
			setInputValue(data);
			if(typeof(onChangeText) === 'function') onChangeText(data, otherData);
		}
	};

	const renderError = () => {
	    if(!error || errorBorderOnly) return null;
	    return (<Text style={{zIndex: 0, marginTop: -6, backgroundColor: '#444442', color:'#dc3545', paddingTop: 10, paddingBottom: 8, borderBottomRightRadius: 4, borderBottomLeftRadius: 4,  paddingHorizontal: 6, marginBottom: 4}}>{error}</Text>);
    }
    
    const validateLength = () => {
        if(typeof(setIsValid) === 'function'){
            if((!maxLength || inputValue.length <= maxLength) && inputValue.length >= minLength) setIsValid(true);
            else  setIsValid(false);
        }
    }
    
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
    
    const renderFieldIcon = () => editable && icon && <Icon icon={icon}  style={Styles.inputIcon} size={18} />;
    const renderButtons = () => {
        if(!editable) return <></>;
        
        const buttonsToRender = [];
        if(showSaveButtons) {
            buttonsToRender.push(
                <TouchableOpacity onPress={onSave} key="save_button">
                    <Icon icon={['fas', 'check']}  style={Styles.inputIcon} size={18} color='#28a745' />
                </TouchableOpacity>
            );
            
            buttonsToRender.push(
                <TouchableHighlight onPress={onCancel} key="cancel_button">
                    <Text style={Styles.inputIcon} >Cancel</Text>
                </TouchableHighlight>
            );
        }
        
        if(allowClear && showClear()){
            buttonsToRender.push(
                <TouchableOpacity onPress={clearInput} key="clear_button">
                    <Icon icon={['fas', 'times-circle']}  style={Styles.inputIcon} size={18} color='#bababa' />
                </TouchableOpacity>
            );
        }
        return buttonsToRender;
    }
    
    const renderLabel = () => {
        return label && label.length ?
            <Text style={[{color: '#fff', marginTop: 8, marginBottom: 4, fontSize:16}, labelStyle]}>{label}</Text> :
            null
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
        
        if(type === 'picker') return <Picker onChange={ handleChange } {...{ placeholder, value, options: pickerOptions } } /> ;
        if(type === 'date' || type === 'time') return <DateTimePicker onChange={ handleChange } {...{ placeholder, value, forTime: type === 'time' } } />;
        return renderTextField();
    };
    
    useEffect( () => {
        if(maxLength || minLength) {
            if (maxLength > 0) {
                setLengthPercentage(Math.floor((inputValue.length / maxLength) * 100));
            }
            validateLength();
        }
    }, [inputValue] );
    
    
    useEffect(() => setInputValue(value), [value]);
    
    if(!editable) {
        outerContainerStyles = [];
        innerContainerStyles = [];
    } else {
        if(type !== 'multiline') outerContainerStyles.push(Styles.inputParentContainer);
    
        innerContainerStyles.push(Styles.inputContainer);
        if(error) innerContainerStyles.push(Styles.inputContainerHasError);
    }
    
    return (
        <View style={[containerStyle]}>
            { renderLabel() }
            <View style={[outerContainerStyles, outerContainerStyle]}>
                <View style={[innerContainerStyles, innerContainerStyle]}>
                    { renderFieldIcon() }
                    { renderField() }
                    { editable && validateInput && displaySuccess(validateInput()) }
                    { renderButtons() }
                </View>
            </View>
            { editable && renderError() }
        </View>
	);
}

Input.propTypes = {
    icon: PropTypes.array,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
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
