import React, {useState, useEffect} from 'react';
import Styles from "../screens/styles/onboarding";
import {TextInput, View, TouchableOpacity, Text, Keyboard, Platform, Modal, Button} from "react-native";
import {Icon} from './Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import Helpers from "../sosa/Helpers";

export const Input = (
    {
        icon, placeholder, value, onChangeText, validateInput, error,
        errorBorderOnly, enabled, allowClear, alwaysShowClear, type, pickerOptions=[],
        minLength, maxLength, selection, onSelectionChange, onBlur, onKeyPress, autoCorrect,
        lengthIndicatorShowPercentage, lengthWarningPercentage, lengthDangerPercentage, setIsValid,
        label, labelStyle, containerStyle, outerContainerStyle, innerContainerStyle, inputStyle
}) => {
    if(!maxLength) maxLength = 1000;
    if(!minLength) minLength = 0;
    if(enabled !== true && enabled !== false) enabled = true;
    let dateValue = value;
    
    if(!lengthIndicatorShowPercentage) lengthIndicatorShowPercentage = 80;
    if(!lengthWarningPercentage) lengthWarningPercentage = 90;
    if(!lengthDangerPercentage) lengthDangerPercentage = 95;
    
    
	if(typeof(value) !== 'string') value = '';
	if(!['text','date', 'time', 'picker', 'multiline'].includes(type)) type = 'text';
 
	const [inputValue, setInputValue] = useState('');
	const [dateInputValue, setDateInputValue] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);
	const [tempPickerValue, setTempPickerValue] = useState((type === 'date' || type === 'time') ? new Date() : '');
    
    let lengthPercentage = 0;

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
	
	useEffect( () => {
	    lengthPercentage = Math.floor((inputValue.length / maxLength) * 100);
	    if(typeof(setIsValid) === 'function'){
            if(inputValue.length <= maxLength && inputValue.length >= minLength) setIsValid(true);
            else  setIsValid(false);
        }
    }, [inputValue] )


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
					display="default"
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
				selectedValue={Platform.OS === 'ios' && tempPickerValue ? tempPickerValue : dateInputValue}
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
                            maxLength={maxLength}
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
    
	return (
        <View style={[containerStyle]}>
            { label && <Text style={[{color: '#fff', marginTop: 8, marginBottom: 4, fontSize:16}, labelStyle]}>{label}</Text> }
            <View style={[outerContainerStyles, outerContainerStyle]}>
                <View style={[innerContainerStyles, innerContainerStyle]}>
                    { renderIcon() }
                    { renderField() }
                    { validateInput && displaySuccess(validateInput()) }
                    { allowClear && showClear() &&
                    <TouchableOpacity onPress={clearInput}>
                        <Icon icon={['fas', 'times-circle']}  style={Styles.inputIcon} size={16} color='#bababa' />
                    </TouchableOpacity> }
                </View>
            </View>
            { renderError() }
        </View>
	);
}
