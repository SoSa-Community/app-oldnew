import React, {useState, useEffect} from 'react';
import Styles from "../screens/styles/onboarding";
import {TextInput, View, TouchableOpacity, Text, Keyboard} from "react-native";
import {Icon} from './Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';

export const IconInput = ({icon, placeholder, value, onChangeText, validateInput, enabled, allowClear, alwaysShowClear, type}) => {
	if(typeof(value) !== 'string') value = '';
	if(!['text','date', 'picker'].includes(type)) type = 'text';

	const [inputValue, setInputValue] = useState('');
	const [dateInputValue, setDateInputValue] = useState(new Date());
	const [showDate, setShowDate] = useState(false);

	const dateToString = (date) => {
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if(month < 10) month = `0${month}`;
		if(day < 10) day = `0${day}`;

		return `${date.getFullYear()}-${month}-${day}`
	};

	useEffect(() => {
		let dateValue = value;

		if(type === 'date'){
			let date = (new Date(dateValue));
			if(Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())){
				date = new Date();
				date.setFullYear(date.getFullYear() - 16);
			}else{
				value = dateToString(date);
			}
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
		if(data !== undefined){
			if(type === 'date'){
				setDateInputValue(data);
				data = dateToString(data);
			}
			setInputValue(data);
			if(typeof(onChangeText) === 'function') onChangeText(data);
		}
	};

	return (

		<View style={Styles.inputParentContainer}>
			<View style={Styles.inputContainer}>
				<Icon icon={icon}  style={Styles.inputIcon} size={18}/>

				{type === 'text' && <TextInput placeholder={placeholder} placeholderTextColor="#ccc" value={inputValue} style={Styles.input} onChangeText={handleChange} editable={enabled}/>}
				{type === 'date' &&
					<TouchableOpacity onPress={() => {Keyboard.dismiss(); setShowDate(true)}} style={{marginHorizontal: 4, flex: 1, height: '100%', justifyContent:'center'}}>
						{ inputValue.length > 0 && <Text style={{color: '#121111'}}>{inputValue}</Text>}
						{ inputValue.length === 0 && <Text style={{color: '#ccc'}}>{placeholder}</Text>}
					</TouchableOpacity>
				}
				{type === 'picker' && <Picker
					selectedValue={inputValue}
					placeholder={placeholder}
					style={{flex: 1, color: '#121111'}}
					textStyle={{fontSize: 12, color: '#121111'}}
					size={12}
					onValueChange={(itemValue, itemIndex) => handleChange(itemValue)}
				>
					<Picker.Item label="Not Applicable" value="na"/>
					<Picker.Item label="Female" value="female"/>
					<Picker.Item label="Male" value="male" />
				</Picker> }


				{ validateInput && displaySuccess(validateInput()) }
				{ allowClear && showClear() &&
				<TouchableOpacity onPress={clearInput}>
					<Icon icon={['fas', 'times-circle']}  style={Styles.inputIcon} size={16} color='#bababa' />
				</TouchableOpacity> }
				{type === 'date' && showDate && (
					<DateTimePicker
						testID="dateTimePicker"
						value={dateInputValue}
						mode={'date'}
						display="default"
						onChange={(event, selectedDate) => {
							setShowDate(false);
							handleChange(selectedDate);
						}}
					/>
				)}

			</View>
		</View>
	);
}
