import { STORYBOOK_MODE } from '@env';
import StoryBook from './storybook';
import React from 'react';
import SoSa from './App/SoSa';

import { APIProvider } from './App/context/APIContext';
import { AppProvider } from './App/context/AppContext';
import { AuthProvider } from './App/context/AuthContext';

const App = () => {
	if (STORYBOOK_MODE) return <StoryBook />;
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
