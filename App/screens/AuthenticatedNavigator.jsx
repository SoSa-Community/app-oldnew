import React from 'react';
import { StatusBar, View } from 'react-native';

import { AuthenticatedNavigationProvider } from '../context/AuthenticatedNavigationContext';
import MembersNavigator from './MembersNavigator';
import BaseStyles from '../screens/styles/base';

const SoSa = () => {
	return (
		<View style={BaseStyles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#121211" />
			<View style={{ flex: 1 }}>
				<AuthenticatedNavigationProvider navigator={MembersNavigator} />
			</View>
		</View>
	);
};
export default SoSa;
