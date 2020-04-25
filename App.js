import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ImageBackground, Image, Text, View} from "react-native";

import Login from './screens/authentication/login';
import ForgotPassword from './screens/authentication/forgot_password';
import ForgotPasswordCode from './screens/authentication/forgot_password_code';
import Register from "./screens/authentication/register";
import MembersWrapper from "./screens/members_wrapper";

import BaseStyles from './screens/styles/base';
import Device from "./sosa/Device";
import Session from "./sosa/Session";
import Helpers from "./sosa/Helpers";


const Stack = createStackNavigator();

export default class SoSa extends Component {

    state = {
        initializing: true
    }

    componentDidMount(): void {
        Device.getInstance().init(device => {
            Session.getInstance().init(session => {
                Helpers.validateSession((error) => {
                    this.setState({initializing: false});
                });
            });
        });
    }

    renderDisplay = (initializing) => {
        if(initializing){
            return (
                <View style={BaseStyles.container}>
                    <ImageBackground source={require('./assets/splash.jpg')} style={{width: '100%', height: '100%', flex:1,justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('./assets/splash_logo.png')} style={{width: '40%', resizeMode: 'contain'}} />
                    </ImageBackground>

                </View>);
        }else{
            return (
                <View style={BaseStyles.container}>
                    <View style={{flex:1}}>
                        <NavigationContainer>
                            <Stack.Navigator screenOptions={{headerTitle: '', headerStyle: BaseStyles.header, headerTitleStyle: BaseStyles.headerTitle}}>
                                <Stack.Screen name="Register" component={Register} />
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                                <Stack.Screen name="ForgotPasswordCode" component={ForgotPasswordCode} />
                                <Stack.Screen name="MembersWrapper" component={MembersWrapper} options={{headerShown:false}}/>
                            </Stack.Navigator>
                        </NavigationContainer>
                    </View>
                </View>
            );
        }
    };

    render() {
        return this.renderDisplay(this.state.initializing);
    }
}
