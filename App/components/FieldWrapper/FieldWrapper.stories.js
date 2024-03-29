import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import React from 'react';

import CenterView from '../../../storybook/stories/CenterView/index';
import FieldWrapper from './FieldWrapper';

storiesOf('Components/ProfileField', module)
	.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
	.add('Default', () => {
		return <FieldWrapper icon={['fal', 'gift']} label="Age" value="35" />;
	})
	.add('DateOfBirth', () => {
		return (
			<FieldWrapper
				icon={['fal', 'gift']}
				label="Age"
				value="35"
				editingMode
				type="dateofbirth"
				labelForEditing="When were you born?"
				valueForEditing="1986-01-30"
			/>
		);
	})
	.add('Picker', () => {
		const genders = [
			{ value: '', label: 'Unknown' },
			{
				value: '8cbe98d3-7c5d-44ea-a973-d6e12962889e',
				label: 'Attack Helicopter',
			},
			{
				value: '938d34ad-dadb-4814-821e-3cac89f2ce62',
				label: 'Female',
			},
			{
				value: '34fcc69c-cfd1-4ae1-8e41-8c22e6d828cc',
				label: 'Male',
			},
			{
				value: '3df7618c-af45-4e83-a1fd-420b49173b37',
				label: 'Bear',
			},
		];

		return (
			<FieldWrapper
				icon={['fal', 'genderless']}
				label="Gender"
				value="Attack Helicopter"
				editingMode
				type="picker"
				labelForEditing="How do you identify?"
				valueForEditing="8cbe98d3-7c5d-44ea-a973-d6e12962889e"
				options={{ options: genders }}
			/>
		);
	})
	.add('Text', () => {
		return (
			<FieldWrapper
				icon={['fal', 'compass']}
				label="From"
				value=""
				editingMode
				type="text"
				labelForEditing="Where were you born?"
				valueForEditing=""
			/>
		);
	})
	.add('Text Styled', () => {
		return (
			<FieldWrapper
				value="Froggity Froggirl"
				editingMode
				type="text"
				labelForEditing=""
				valueForEditing="Froggity Froggirl"
				options={{ inputStyle: { fontSize: 26, textAlign: 'center' } }}
			/>
		);
	});
