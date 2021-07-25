import React from 'react';

import { Controller } from 'react-hook-form';
import Picker from '../../Picker/Picker';

const FormPicker = ({ name, control, defaultValue, rules, ...props }) => {
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
				return <Picker onChange={onChange} value={value} {...props} />;
			}}
		/>
	);
};

FormPicker.propTypes = {};

FormPicker.defaultProps = {};

export default FormPicker;
