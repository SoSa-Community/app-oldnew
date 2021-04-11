import React from 'react';
import { useAuth } from './context/AuthContext';

import AuthenticatedNavigator from './screens/AuthenticatedNavigator';
import UnauthenticatedNavigator from './screens/UnauthenticatedNavigator';

const SoSa = () => {
    const { authenticated } = useAuth();
    if(authenticated) return <AuthenticatedNavigator />
    return <UnauthenticatedNavigator />
}
export default SoSa;
