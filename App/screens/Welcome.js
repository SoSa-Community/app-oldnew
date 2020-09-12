import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Switch, KeyboardAvoidingView} from 'react-native';

import {IconInput} from "../components/IconInput";
import {ActivityButton} from "../components/ActivityButton";
import withAppContext from "./hoc/withAppContext";
import {InfoBox} from "../components/InfoBox";
import Helpers from "../sosa/Helpers";
import {FormError} from "../components/FormError";


class Welcome extends Component {
	appContext = null;

	navigation = null;
	navigationContext = {};

	haveEmail = false;

	state = {
		usernameInput: '',
		emailInput: '',
		fieldErrors: {
			username: '',
			email: '',
		},
		saving: false
	};

	constructor(props) {
		super();
		const {appContext, navigationContext, navigation, route: {params}} = props;

		this.appContext = appContext;
		this.navigation = navigation;
		this.navigationContext = navigationContext;

		if(params){
			const {user: {username, welcome: {haveEmail}}} = params;

			if(username) this.state.usernameInput = username;
			if(haveEmail) this.haveEmail = haveEmail;
		}
	}

	render() {
		const {usernameInput, emailInput, fieldErrors} = this.state;

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
							<View>
								<Text style={{marginBottom: 8}}>Your username</Text>
								<IconInput icon={['fal', 'user']} placeholder="Username" value={usernameInput} onChangeText={data => this.setState({ usernameInput: data})} enabled={!this.state.saving}/>
								<FormError errorState={fieldErrors.username} />
							</View>
							{ !this.haveEmail &&
							<View style={{marginTop: 12}}>
								<Text style={{marginBottom: 8}}>Your e-mail</Text>
								<IconInput icon={['fal', 'envelope']} placeholder="E-mail" value={emailInput} onChangeText={data => this.setState({ emailInput: data})} enabled={!this.state.saving}/>
								<FormError errorState={fieldErrors.email} />
								<InfoBox
									title="Why do you need my e-mail address?"
									text1="E-mail addresses are just one way we protect our community from spam and bots."
									text2="After you have confirmed your e-mail address, we'll scramble (hash) so not even we know what it is!"
								/>
							</View> }
						</View>
					</View>
					<View style={{justifyContent:'flex-end', flex:1}}>
						<View style={{flexDirection: 'row', height:40}}>
							<View style={{flex: 1, paddingHorizontal: 4}}>
								<TouchableOpacity onPress={this.appContext.logout}>
									<View style={{paddingVertical: 8, borderRadius: 4, flex: 0, justifyContent: 'center', alignItems:'center', backgroundColor: '#dc3545'}}>
										<Text style={{color:'#fff', fontSize: 16}}>Logout</Text>
									</View>
								</TouchableOpacity>
							</View>
							<View style={{flex: 2, paddingHorizontal: 4}} >
								<ActivityButton showActivity={this.state.saving} onPress={() => {
									this.setState({fieldErrors: {username: '', email: ''}});
									Helpers.confirmWelcome((errors) => {
										let fieldErrors = Object.assign({}, this.state.fieldErrors);
										if(Array.isArray(errors)){
											errors.forEach((error) => {
												const {code, message, field} = error;
												if(field) fieldErrors[field] = message;
											});
											console.log('Field Errors', fieldErrors);
											this.setState({fieldErrors});
										}else{
											this.navigation.replace('MembersArea');
										}
									}, this.state.usernameInput, this.state.emailInput)
								}} text="Confirm"/>
							</View>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		);
  	}
}

const WelcomeScreen = withAppContext(Welcome);
export default WelcomeScreen;
