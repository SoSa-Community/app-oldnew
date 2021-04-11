import React, { useState, useEffect } from 'react';
import { TextInput, View, TouchableOpacity, TouchableHighlight, Text, Keyboard, Platform, Modal, Button } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-community/picker';
import PropTypes from 'prop-types';

import Helpers from "../sosa/Helpers";
import Icon from './Icon';

import Styles from "../screens/styles/onboarding";

const Input = (
    {
        icon, placeholder, value, onChangeText, validateInput, error,
        errorBorderOnly, enabled, allowClear, alwaysShowClear, type, pickerOptions=[],
        minLength, maxLength, selection, onSelectionChange, onBlur, onKeyPress, autoCorrect,
        lengthIndicatorShowPercentage, lengthWarningPercentage, lengthDangerPercentage, setIsValid,
        label, labelStyle, containerStyle, outerContainerStyle, innerContainerStyle, inputStyle,
        showSaveButtons, onSave, onCancel, buttons,
}) => {
    
    if(enabled !== true && enabled !== false) enabled = true;
    let dateValue = value;
 
	const [inputValue, setInputValue] = useState('');
	const [dateInputValue, setDateInputValue] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);
	const [tempPickerValue, setTempPickerValue] = useState((type === 'date' || type === 'time') ? new Date() : '');
	const [lengthPercentage, setLengthPercentage] = useState(0);
 

	const displaySuccess = (errorString) => {
		if(errorString === null){
			return null;
		}else if(errorString.length === 0){
			return <Icon icon={['fas', 'check']}  style={Styles.inputIcon} size={18} color='#28a745' />
		}else{
			return <Icon icon={['fas', 'info-circle']}  style={Styles.inputIcon} size={18} color='#dc3545' onPress={() => {console.log(errorString);}} />
		}
	};

	const showClear = () => {
		return !!((inputValue && inputValue.length) || alwaysShowClear);
	};

	const clearInput = () => {setInputValue('');};

	const handleChange = (data) => {
		let otherData = null;
		
	    if(data !== undefined){
			if(type === 'date' || type === 'time'){
				setDateInputValue(data);
				otherData = new Date(data.getTime());
				data = Helpers.dateToString(data, type);
			}

			setInputValue(data);
			if(typeof(onChangeText) === 'function') onChangeText(data, otherData);
		}
	};

	const renderDateTimePicker = () => {
		const doChange = (selectedDate) => {
			setShowPicker(false);
			handleChange(selectedDate);
		}

		const FieldLabel = () => (<TouchableOpacity onPress={() => {Keyboard.dismiss(); setShowPicker(true)}} style={{marginHorizontal: 4, flex: 1, height: '100%', justifyContent:'center'}}>
			{ inputValue.length > 0 && <Text style={{color: '#121111'}}>{inputValue}</Text>}
			{ inputValue.length === 0 && <Text style={{color: '#ccc'}}>{placeholder}</Text>}
		</TouchableOpacity>);

		const Picker = () => showPicker && (
				<DateTimePicker
					testID="dateTimePicker"
					value={Platform.OS === 'ios' && tempPickerValue ? tempPickerValue : dateInputValue}
					mode={type}
					display={Platform.OS === 'ios' ? "spinner" : "default"}
					onChange={(event, selectedDate) => {
						if(Platform.OS === 'ios'){
							setTempPickerValue(selectedDate);
						}else{
							doChange(selectedDate);
						}
					}}
				/>);


		if(Platform.OS === 'ios'){
			return (
				<>
				<FieldLabel />
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
		}else{
			return (
				<>
					<FieldLabel />
					<Picker />
				</>
			);
		}
	}

	const renderPicker = () => {
		const doChange = (selectedValue) => {
			setShowPicker(false);
			handleChange(selectedValue)
		}

		let labelIndex = {}

		const picker = (
			<Picker
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
				{ pickerOptions.map(({label, value}) => {
					labelIndex[value] = label;
					return <Picker.Item label={label} value={value} key={value}/>
				}) }
			</Picker>
		);

		if(Platform.OS === 'ios'){

			return (
			<>
				<TouchableOpacity onPress={() => {Keyboard.dismiss(); setShowPicker(true)}} style={{marginHorizontal: 4, flex: 1, height: '100%', justifyContent:'center'}}>
					{ inputValue.length > 0 && <Text style={{color: '#121111'}}>{labelIndex.hasOwnProperty(inputValue) ? labelIndex[inputValue] : inputValue}</Text>}
					{ inputValue.length === 0 && <Text style={{color: '#ccc'}}>{placeholder}</Text>}
				</TouchableOpacity>
				<Modal visible={showPicker} transparent={true} onRequestClose={() => setShowPicker(false)}>
					<View style={{flex:1, justifyContent:'center', backgroundColor:'rgba(0,0,0,0.75)'}}>
						<View style={{backgroundColor:'#fff', height:300, borderRadius:12, marginHorizontal: 24, justifyContent:'center'}}>
							{picker}
							<View style={{flex:1, flexDirection: 'row', justifyContent:'center', alignItems:'flex-end', marginBottom: 16}}>
								<Button title="Cancel" style={{flex:1}} onPress={() => setShowPicker(false)}/>
								<Button title="Confirm" style={{flex:1}} onPress={() => doChange(tempPickerValue)}/>
							</View>
						</View>
					</View>
				</Modal>
			</>);
		}else{
			return picker;
		}
	}

	const renderError = () => {
	    if(!error || errorBorderOnly) return null;
	    return (<Text style={{zIndex: 0, marginTop: -6, backgroundColor: '#444442', color:'#dc3545', paddingTop: 10, paddingBottom: 8, borderBottomRightRadius: 4, borderBottomLeftRadius: 4,  paddingHorizontal: 6, marginBottom: 4}}>{error}</Text>);
    }
    
    let outerContainerStyles = [];
    let innerContainerStyles = [];
    
    
    const renderField = () => {
        if(type === 'picker') return renderPicker();
        if(type === 'date' || type === 'time') return renderDateTimePicker();

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
                            onChangeText={handleChange}
                            editable={enabled}
                            onBlur={onBlur}
                            onKeyPress={onKeyPress}
                            autoCorrect={autoCorrect}
                            maxLength={maxLength ? maxLength : null}
                />
                { renderLengthWarning() }
            </>);
    };
    
    if(type !== 'multiline') outerContainerStyles.push(Styles.inputParentContainer);
    
    innerContainerStyles.push(Styles.inputContainer);
    if(error) innerContainerStyles.push(Styles.inputContainerHasError);
    
    const renderIcon = () => {
        return icon && <Icon icon={icon}  style={Styles.inputIcon} size={18}/>
    };
    
    const validateLength = () => {
        if(typeof(setIsValid) === 'function'){
            if((!maxLength || inputValue.length <= maxLength) && inputValue.length >= minLength) setIsValid(true);
            else  setIsValid(false);
        }
    }
    
    const renderButtons = () => {
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
    
    
    useEffect( () => {
        if(maxLength || minLength) {
            if (maxLength > 0) {
                setLengthPercentage(Math.floor((inputValue.length / maxLength) * 100));
            }
            validateLength();
        }
    }, [inputValue] );
    
    
    useEffect(() => {
        if(type === 'date' || type === 'time'){
            let date = (new Date(dateValue));
            if(Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
                date = new Date();
            }
            if(type === 'time'){
                const [hour, minutes] = dateValue.split(':');
                
                date.setHours(hour);
                date.setMinutes(minutes);
            }
            
            value = Helpers.dateToString(date, type);
            
            dateValue = date;
        }
        setInputValue(value);
        setDateInputValue(dateValue);
    }, [value]);
    
    return (
        <View style={[containerStyle]}>
            {   label && label.length ?
                <Text style={[{color: '#fff', marginTop: 8, marginBottom: 4, fontSize:16}, labelStyle]}>{label}</Text> :
                null
            }
            <View style={[outerContainerStyles, outerContainerStyle]}>
                <View style={[innerContainerStyles, innerContainerStyle]}>
                    { renderIcon() }
                    { renderField() }
                    { validateInput && displaySuccess(validateInput()) }
                    { renderButtons() }
                </View>
            </View>
            { renderError() }
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
};

export default Input;
