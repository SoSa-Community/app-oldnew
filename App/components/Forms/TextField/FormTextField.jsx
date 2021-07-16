import React, { forwardRef } from 'react';

import { Controller } from 'react-hook-form';
import TextField from '../../TextField/TextField';

const FormTextField = forwardRef(
	(
		{ name, control, defaultValue, rules, onSetRef, onChange, ...props },
		ref,
	) => {
		return (
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				rules={rules}
				render={({
					field: { onChange: formOnChange, onBlur, value, name },
					fieldState: { invalid, isTouched, isDirty, error },
					formState,
				}) => {
					return (
						<TextField
							ref={ref}
							onChange={(value) => {
								formOnChange(value);
								if (typeof onChange === 'function')
									onChange(value);
							}}
							value={value}
							{...props}
						/>
					);
				}}
			/>
		);
	},
);

FormTextField.propTypes = {};

FormTextField.defaultProps = {};

export default FormTextField;
