import React from 'react';
import { Text } from "react-native";

import PropTypes from 'prop-types';
import Styles from "../screens/styles/onboarding";

const FormError = ({message}) => {
    if(message && message.length > 0){
        return <Text style={Styles.error}>{message}</Text>;
    }
    return null;
}

FormError.propTypes = {
    message: PropTypes.string.isRequired
}

export default FormError;

