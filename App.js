import React, {Component} from 'react';
import Login from './screens/authentication/login';
import ForgotPassword from './screens/authentication/forgot_password';
import ForgotPasswordCode from './screens/authentication/forgot_password_code';
import MembersWrapper from "./screens/members_wrapper";

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View} from "react-native";

import BaseStyles from './screens/styles/base';

const Stack = createStackNavigator();

export default class SoSa extends Component {

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{flex:1}}>
                    <NavigationContainer>
                        <Stack.Navigator screenOptions={{headerTitle: '', headerStyle: BaseStyles.header, headerTitleStyle: BaseStyles.headerTitle}}>
                            <Stack.Screen name="Login" component={Login}/>
                            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                            <Stack.Screen name="ForgotPasswordCode" component={ForgotPasswordCode} />
                            <Stack.Screen name="MembersWrapper" component={MembersWrapper} options={{headerShown:false}}/>
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </View>

        );
  }
}
