import React from 'react';
import { Text, View } from 'react-native';

import Styles from '../../screens/styles/onboarding';
import PropTypes from 'prop-types';

const FormError = ({ errors, containerStyle, style }) => {
	const renderError = (error, index) => {
		if (error?.message?.length > 0) {
			return (
				<Text style={[Styles.error, style]} key={index}>
					{error.message}
				</Text>
			);
		}
		return <></>;
	};

	if (errors) {
		return (
			<View style={containerStyle}>
				{Array.isArray(errors)
					? errors.map(renderError)
					: renderError(errors, 0)}
			</View>
		);
	}
	return <></>;
};

FormError.propTypes = {
	errors: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	containerStyle: PropTypes.object,
	style: PropTypes.object,
};

FormError.defaultProps = {
	errors: [],
	containerStyle: null,
	style: null,
};

export default FormError;
