import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, Alert } from "react-native";

import {AuthenticatedNavigationProvider} from '../context/AuthenticatedNavigationContext';
import MembersNavigator from './MembersNavigator';
import BaseStyles from '../screens/styles/base';

const Stack = createStackNavigator();

const SoSa = () => {
    let appNavigation = React.createRef();
    const [ defaultScreen, setDefaultScreen ] = useState('MembersArea');
    
    return (
        <View style={BaseStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#121211"/>
            <View style={{flex:1}}>
                <AuthenticatedNavigationProvider navigator={MembersNavigator} />
            </View>
        </View>
    );
}
export default SoSa;
