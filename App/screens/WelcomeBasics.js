import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Switch, KeyboardAvoidingView} from 'react-native';

import {IconInput} from "../components/IconInput";
import {ActivityButton} from "../components/ActivityButton";
import {Preferences} from "../sosa/Preferences";


class WelcomeBasicsScreen extends Component {
	navigation = null;
	navigationContext = {};

	state = {
		dateOfBirthInput: '',
		locationInput: '',
		genderInput: '',
		saving: false
	};

	constructor(props) {
		super();
		this.navigation = props.navigation;
		this.navigationContext = props.navigationContext;
	}

	render() {
		const {dateOfBirthInput, locationInput, genderInput} = this.state;

		return (
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : null}
				style={{ flex: 1 }}
			>
				<View style={{flex: 1}}>
					<View style={{paddingTop: 32, paddingHorizontal: '5%'}}>
						<View style={{alignItems:'center'}}>
						    <Text style={{fontSize: 24}}>You're almost in!</Text>
						    <Text style={{fontSize: 18, textAlign:'center', marginTop: 8}}>Before I can let you in, I need just a little bit more information</Text>
						</View>
						<View style={{marginTop:32}}>
							<View style={{marginTop: 12}}>
								<Text style={{marginBottom: 8}}>When were you born?</Text>
								<IconInput icon={['fal', 'calendar-star']} placeholder="Date Of Birth" value={dateOfBirthInput} onChangeText={data => this.setState({ dateOfBirthInput: data})} enabled={!this.state.saving} type="date" allowClear={true}/>
							</View>
							<View style={{marginTop: 12}}>
								<Text style={{marginBottom: 8}}>Where do you live?</Text>
								<IconInput icon={['fal', 'map-marker-smile']} placeholder="Location" value={locationInput} onChangeText={data => this.setState({ locationInput: data})} enabled={!this.state.saving} allowClear={true} alwaysShowClear={false}/>
							</View>
							<View style={{marginTop: 12}}>
								<Text style={{marginBottom: 8}}>How do you identify?</Text>
								<IconInput icon={['fal', 'genderless']} placeholder="Gender Identity" value={genderInput} onChangeText={data => this.setState({ genderInput: data})} enabled={!this.state.saving} type="picker"/>
							</View>
						</View>
					</View>
					<View style={{justifyContent:'flex-end', flex:1}}>
						<View style={{flexDirection: 'row', height:40}}>
							<View style={{flex: 1, paddingHorizontal: 4}}>
								<TouchableOpacity>
									<View style={{paddingVertical: 8, borderRadius: 4, flex: 0, justifyContent: 'center', alignItems:'center', backgroundColor: '#dc3545'}}>
										<Text style={{color:'#fff', fontSize: 16}}>Logout</Text>
									</View>
								</TouchableOpacity>
							</View>
							<View style={{flex: 1, paddingHorizontal: 4}} >
								<ActivityButton showActivity={this.state.saving} onPress={() => {}} text="Let me in!"/>
							</View>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		);
  	}
}

export default WelcomeScreen;
