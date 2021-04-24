import React, { useEffect } from 'react';
import { View, TouchableOpacity, TouchableHighlight, Text } from "react-native";
import PropTypes from 'prop-types';

import Icon from '../Icon';

import Styles from "../../screens/styles/onboarding";

const InputWrapper = ({
    icon,
    value,
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
    showSaveButtons,
    onSave,
    onCancel,
    onClear,
    editable,
    children
}) => {
    
    let outerContainerStyles = [];
    let innerContainerStyles = [];
    
    const showClear = () => !!((value && value.length) || alwaysShowClear);
    
    const renderError = () => {
        if(!error || errorBorderOnly) return null;
        return (<Text style={{zIndex: 0, marginTop: -6, backgroundColor: '#444442', color:'#dc3545', paddingTop: 10, paddingBottom: 8, borderBottomRightRadius: 4, borderBottomLeftRadius: 4,  paddingHorizontal: 6, marginBottom: 4}}>{error}</Text>);
    }
    
    const validateLength = () => {
        if(typeof(setIsValid) === 'function'){
            if((!maxLength || value.length <= maxLength) && value.length >= minLength) setIsValid(true);
            else  setIsValid(false);
        }
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
                <TouchableOpacity onPress={onClear} key="clear_button">
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
    
    const displaySuccess = (errorString) => {
        if(errorString === null){
            return null;
        }else if(errorString.length === 0){
            return <Icon icon={['fas', 'check']}  style={Styles.inputIcon} size={18} color='#28a745' />
        }else{
            return <Icon icon={['fas', 'info-circle']}  style={Styles.inputIcon} size={18} color='#dc3545' onPress={() => {console.log(errorString);}} />
        }
    };
    
    useEffect( () => {
        if(maxLength || minLength) validateLength();
    }, [value] );
    
    if(!editable) {
        outerContainerStyles = [];
        innerContainerStyles = [];
    } else {
        outerContainerStyles.push(Styles.inputParentContainer);
        innerContainerStyles.push(Styles.inputContainer);
        if(error) innerContainerStyles.push(Styles.inputContainerHasError);
    }
    
    return (
        <View style={[containerStyle]}>
            { renderLabel() }
            <View style={[outerContainerStyles, outerContainerStyle]}>
                <View style={[innerContainerStyles, innerContainerStyle]}>
                    { renderFieldIcon() }
                    { children }
                    { editable && validateInput && displaySuccess(validateInput()) }
                    { renderButtons() }
                </View>
            </View>
            { editable && renderError() }
        </View>
    );
};

InputWrapper.propTypes = {
    icon: PropTypes.array,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    validateInput: PropTypes.bool,
    error: PropTypes.string,
    errorBorderOnly: PropTypes.bool,
    allowClear: PropTypes.bool,
    alwaysShowClear: PropTypes.bool,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    setIsValid: PropTypes.func,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    outerContainerStyle: PropTypes.object,
    innerContainerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    editable: PropTypes.bool
};

InputWrapper.defaultProps = {
    icon: null,
    value: '',
    validateInput: false,
    error: null,
    errorBorderOnly: false,
    allowClear: false,
    alwaysShowClear: false,
    minLength: 0,
    maxLength: 255,
    setIsValid: null,
    label: '',
    labelStyle: null,
    containerStyle: null,
    outerContainerStyle: null,
    innerContainerStyle: null,
    editable: true
};

export default InputWrapper;
