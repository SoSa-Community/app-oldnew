import React from 'react';

import { Controller } from 'react-hook-form';
import SecureTextField from '../../SecureTextField/SecureTextField';

const FormSecureTextField = ({ name, control, defaultValue, rules, ...props }) => {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={rules}
			render={({
				field: { onChange, onBlur, value, name, ref },
				fieldState: { invalid, isTouched, isDirty, error },
				formState,
			}) => {
				return (
					<SecureTextField
						onChange={onChange}
						value={value}
						{...props}
					/>
				);
			}}
		/>
	);
};

FormSecureTextField.propTypes = {};

FormSecureTextField.defaultProps = {};

export default FormSecureTextField;
