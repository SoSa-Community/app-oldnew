import React, {useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableHighlight} from "react-native";
import {Icon} from "./Icon";

const Styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,.125)',
		marginTop: 4,
		marginBottom: 8,
		padding: 8
	},
	title: {
		flexDirection: 'row',
		alignItems:'center'
	},
	titleText: {
		color:'#444442',
		marginLeft: 8
	}
});

export const InfoBox = ({title, text1, text2, text3, type}) => {

	const [show, setShowing] = useState(false);

	let titleStyles = {};
	if(show){
		titleStyles = {paddingBottom: 6, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,.125)'};
	}

	return (
		<TouchableHighlight onPress={() => {console.log(show); setShowing(!show)}}>
			<View style={Styles.container}>
				<View style={[Styles.title, titleStyles]}>
					<Icon icon={['fas', 'info-circle']} style={{opacity: 0.95}} size={24} color='#cccccc' />
					<Text style={Styles.titleText}>{title}</Text>
				</View>
				{show && <View style={{marginTop: 8}}>
					<Text style={{marginBottom: 4, color:'#444442'}}>{text1}</Text>
					<Text style={{color:'#444442'}}>{text2}</Text>
				</View> }
			</View>
		</TouchableHighlight>
	);
}
