import React from 'react';
import Styles from "../screens/styles/onboarding";
import {Text} from "react-native";

export const FormError = ({errorState}) => {
    if(errorState && errorState.length > 0){
        return <Text style={Styles.error}>{errorState}</Text>;
    }
    return null;
}
