import React from 'react';
import { STORYBOOK_MODE } from '@env';

// temp fix for the promise.finally
// https://github.com/storybookjs/storybook/issues/8371
const fn = Promise.prototype.finally;
//import StoryBook from './storybook';
Promise.prototype.finally = fn;

import { View } from 'react-native';
import SoSa from './App/SoSa';

import { APIProvider } from './App/context/APIContext';
import { AppProvider } from './App/context/AppContext';
import { AuthProvider } from './App/context/AuthContext';

const App = () => {
	if (STORYBOOK_MODE === 'true') {
		return (
			<View style={{ backgroundColor: '#2D2F30', flex: 1 }}>
				<StoryBook />
			</View>
		);
	}
	return (
		<AppProvider>
			<APIProvider>
				<AuthProvider>
					<SoSa />
				</AuthProvider>
			</APIProvider>
		</AppProvider>
	);
};
export default App;
