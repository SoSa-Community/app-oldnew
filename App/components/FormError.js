import React from 'react';
import { Text } from "react-native";
import PropTypes from 'prop-types';


import Styles from "../screens/styles/onboarding";

const FormError = ({errors}) => {
    
    const renderError = (error, index) => {
        if(error?.message?.length > 0){
            return <Text style={Styles.error} key={index}>{error.message}</Text>;
        }
    }
    
    if(errors) {
        if(!Array.isArray(errors)) return renderError(errors, 0);
        else {
            return <>
                { errors.map(renderError) }
            </>
        }
    }
    
    return <></>;
}

FormError.propTypes = {

}

export default FormError;

