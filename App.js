import React from 'react';

import SoSa from './App/SoSa';

import { APIProvider } from './App/context/APIContext';
import { AppProvider } from './App/context/AppContext';
import { AuthProvider } from './App/context/AuthContext';


const App = () => {
    return (
        <AppProvider>
            <APIProvider>
                <AuthProvider>
                    <SoSa />
                </AuthProvider>
            </APIProvider>
        </AppProvider>
    );
}
export default App;
