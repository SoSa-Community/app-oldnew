import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Switch, KeyboardAvoidingView} from 'react-native';

import Input from "../components/Input";
import ActivityButton from "../components/ActivityButton";
import withAppContext from "./hoc/withAppContext";
import InfoBox from "../components/InfoBox";
import FormError from "../components/FormError";



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
        
        const { apiClient } = appContext;
        this.apiClient = apiClient;

		if(params){
			const {user: {username, welcome: {haveEmail}}} = params;

			if(username) this.state.usernameInput = username;
			if(haveEmail) this.haveEmail = haveEmail;
		}
	}

	render() {
		const {navigation, apiClient: { services: { auth: authService } }, state: { usernameInput, emailInput, fieldErrors } } = this;
		
		const confirmWelcome = () => {
            this.setState({fieldErrors: {username: '', email: ''}});
        
            authService.confirmWelcome(usernameInput, emailInput)
                .then(() => navigation.replace('MembersArea'))
                .catch(errors => {
                    let fieldErrors = Object.assign({}, this.state.fieldErrors);
                    console.log(fieldErrors);
                    if(Array.isArray(errors)){
                        errors.forEach((error) => {
                            const {message, field} = error;
                            if(field) fieldErrors[field] = message;
                        });
                        this.setState({fieldErrors});
                    }else {
                        console.debug(errors);
                    }
                });
        };

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
								<Input icon={['fal', 'user']} placeholder="Username" value={usernameInput} onChangeText={data => this.setState({ usernameInput: data})} enabled={!this.state.saving}/>
								<FormError message={fieldErrors.username} />
							</View>
							{ !this.haveEmail &&
							<View style={{marginTop: 12}}>
								<Text style={{marginBottom: 8}}>Your e-mail</Text>
								<Input icon={['fal', 'envelope']} placeholder="E-mail" value={emailInput} onChangeText={data => this.setState({ emailInput: data})} enabled={!this.state.saving}/>
								<FormError message={fieldErrors.email} />
								<InfoBox
									title="Why do you need my e-mail address?"
									text1="E-mail addresses are just one way we protect our community from spam and bots."
									text2="After you have confirmed your e-mail address, we'll scramble (hash) so not even we know what it is!"
								/>
							</View> }
						</View>
					</View>
					<View style={{justifyContent:'flex-end', flex:1, marginBottom: Platform.OS === 'ios' ? 16 : 6}}>
						<View style={{flexDirection: 'row', height:40, marginHorizontal:8}}>
							<View style={{flex: 1, paddingHorizontal: 4}}>
								<TouchableOpacity onPress={this.appContext.logout}>
									<View style={{paddingVertical: 8, borderRadius: 4, flex: 0, justifyContent: 'center', alignItems:'center', backgroundColor: '#dc3545'}}>
										<Text style={{color:'#fff', fontSize: 16}}>Logout</Text>
									</View>
								</TouchableOpacity>
							</View>
							<View style={{flex: 2, paddingHorizontal: 4}} >
								<ActivityButton showActivity={this.state.saving} onPress={confirmWelcome} text="Confirm"/>
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
