import React from 'react';

import { Controller } from 'react-hook-form';
import DateTimePicker from '../../DateTimePicker/DateTimePicker';

const FormDateTimePicker = ({
	name,
	control,
	defaultValue,
	rules,
	...props
}) => {
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
					<DateTimePicker
						onChange={onChange}
						value={value}
						{...props}
					/>
				);
			}}
		/>
	);
};

FormDateTimePicker.propTypes = {};

FormDateTimePicker.defaultProps = {};

export default FormDateTimePicker;
