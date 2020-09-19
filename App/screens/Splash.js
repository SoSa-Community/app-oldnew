import React, {Component} from 'react';
import {View, StatusBar, ImageBackground, Image} from 'react-native';
import BaseStyles from "./styles/base";

export default class SplashScreen extends Component {
	navigation = null;
	navigationContext = {};

	constructor(props) {
		super();
		this.navigation = props.navigation;
		this.navigationContext = props.navigationContext;
	}

	render() {

		return (
			<View style={BaseStyles.container}>
				<StatusBar barStyle="light-content" backgroundColor="#121211" />
				<ImageBackground source={require('../assets/splash.jpg')} style={{width: '100%', height: '100%', flex:1,justifyContent: 'center', alignItems: 'center'}}>
					<Image source={require('../assets/splash_logo.png')} style={{width: '40%', resizeMode: 'contain'}} />
				</ImageBackground>
			</View>
		);
	}
}


