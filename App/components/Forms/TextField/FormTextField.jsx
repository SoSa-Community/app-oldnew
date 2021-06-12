import React from 'react';

import { Controller } from 'react-hook-form';
import TextField from '../../TextField/TextField';

const FormTextField = ({ name, control, defaultValue, rules, ...props }) => {
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
					<TextField onChange={onChange} value={value} {...props} />
				);
			}}
		/>
	);
};

FormTextField.propTypes = {};

FormTextField.defaultProps = {};

export default FormTextField;
