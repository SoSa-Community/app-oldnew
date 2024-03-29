import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

import LoginScreen from './authentication/Login/Login';
import RegistrationScreen from './authentication/Register/Register';
import ForgotPassword from './authentication/ForgottenPassword/ForgotPassword';
import ForgotPasswordCode from './authentication/ForgottenPassword/ForgotPasswordCode';
import ForgotPasswordNew from './authentication/ForgottenPassword/ForgotPasswordNew';
import ForgotPasswordSuccessful from './authentication/ForgottenPassword/ForgotPasswordSuccessful';

import BaseStyles from '../screens/styles/base';
import SplashScreen from './Splash';


const Stack = createStackNavigator();

const SoSa = () => {
	const { appInitialized } = useApp();
	const { validatingLogin } = useAuth();

	let appNavigation = React.createRef();

	const [defaultScreen] = useState('Login');

	if (!appInitialized || validatingLogin) return <SplashScreen />;

	return (
		<View style={BaseStyles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#2D2F30" />
			<View style={{ flex: 1 }}>
				<NavigationContainer ref={appNavigation}>
					<Stack.Navigator
						initialRouteName={defaultScreen}
						screenOptions={{
							headerStyle: BaseStyles.header,
							headerTitleStyle: BaseStyles.headerTitle,
							headerTintColor: 'white',
							headerTitleContainerStyle: { alignItems: 'center' },
						}}>
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							options={{ title: 'Welcome To SoSa' }}
						/>
						<Stack.Screen
							name="Register"
							component={RegistrationScreen}
							options={{ title: 'Join SoSa' }}
						/>
						<Stack.Screen
							name="ForgotPassword"
							component={ForgotPassword}
							options={{ title: '' }}
						/>
						<Stack.Screen
							name="ForgotPasswordCode"
							component={ForgotPasswordCode}
							options={{ title: '' }}
						/>
						<Stack.Screen
							name="ForgotPasswordNew"
							component={ForgotPasswordNew}
							options={{ title: '' }}
						/>
						<Stack.Screen
							name="ForgotPasswordSuccessful"
							component={ForgotPasswordSuccessful}
							options={{ title: '' }}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</View>
		</View>
	);
};
export default SoSa;
