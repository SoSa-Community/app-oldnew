import React, {useState, useEffect} from 'react';
import Styles from "../screens/styles/onboarding";
import {TextInput, View, TouchableOpacity, Text, Keyboard, Platform, Modal, Button} from "react-native";
import {Icon} from './Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import Helpers from "../sosa/Helpers";

export const IconInput = ({icon, placeholder, value, onChangeText, validateInput, enabled, allowClear, alwaysShowClear, type, pickerOptions=[]}) => {
	if(typeof(value) !== 'string') value = '';
	if(!['text','date', 'time', 'picker'].includes(type)) type = 'text';

	const [inputValue, setInputValue] = useState('');
	const [dateInputValue, setDateInputValue] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);
	const [tempPickerValue, setTempPickerValue] = useState((type === 'date' || type === 'time') ? new Date() : '');


	useEffect(() => {
		let dateValue = value;

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


	const displaySuccess = (errorString) => {
		if(errorString === null){
			return null;
		}else if(errorString.length === 0){
			return <Icon icon={['fas', 'check']}  style={Styles.inputIcon} size={18} color='#28a745' />
		}else{
			return <Icon icon={['fas', 'info-circle']}  style={Styles.inputIcon} size={18} color='#dc3545' onPress={() => {console.log(errorString);}} />
		}
	};

	if(enabled !== true && enabled !== false) enabled = true;


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
				<Modal visible={showPicker} transparent={true}>
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
				<Modal visible={showPicker} transparent={true}>
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

	return (

		<View style={Styles.inputParentContainer}>
			<View style={Styles.inputContainer}>
				<Icon icon={icon}  style={Styles.inputIcon} size={18}/>

				{type === 'text' && <TextInput placeholder={placeholder} placeholderTextColor="#ccc" value={inputValue} style={Styles.input} onChangeText={handleChange} editable={enabled}/>}
				{type === 'picker' && renderPicker() }


				{ validateInput && displaySuccess(validateInput()) }
				{ allowClear && showClear() &&
				<TouchableOpacity onPress={clearInput}>
					<Icon icon={['fas', 'times-circle']}  style={Styles.inputIcon} size={16} color='#bababa' />
				</TouchableOpacity> }
				{(type === 'date' || type === 'time') && (
					renderDateTimePicker()
				)}

			</View>
		</View>
	);
}
