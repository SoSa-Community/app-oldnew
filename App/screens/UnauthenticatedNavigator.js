import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {  StatusBar, View } from "react-native";

import LoginScreen from '../screens/authentication/login';
import RegistrationScreen from "../screens/authentication/register";
import ForgotPassword from '../screens/authentication/forgot_password';
import ForgotPasswordCode from '../screens/authentication/forgot_password_code';

import BaseStyles from '../screens/styles/base';

const Stack = createStackNavigator();

const SoSa = () => {
    let appNavigation = React.createRef();
    
    const [ defaultScreen, setDefaultScreen ] = useState('Login');
    
    return (
        <View style={BaseStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#121211"/>
            <View style={{flex:1}}>
                    <NavigationContainer ref={appNavigation}>
                        <Stack.Navigator initialRouteName={defaultScreen} screenOptions={{headerStyle: BaseStyles.header, headerTitleStyle: BaseStyles.headerTitle, headerTintColor: 'white', headerTitleContainerStyle: { left: 10 }}} >
                            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login To SoSa' }}/>
                            <Stack.Screen name="Register" component={RegistrationScreen} options={{ title: 'Join SoSa' }} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgotten Password' }} />
                            <Stack.Screen name="ForgotPasswordCode" component={ForgotPasswordCode} options={{title: 'Check your e-mail'}}/>
                        </Stack.Navigator>
                    </NavigationContainer>
            </View>
        </View>
    );
}
export default SoSa;
