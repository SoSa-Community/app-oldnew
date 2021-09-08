import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import React from 'react';
import { View } from 'react-native';

import PrivacyPicker from './PrivacyPicker';

storiesOf('Components/PrivacyPicker', module)
	.addDecorator((getStory) => {
		return (
			<View
				style={{
					backgroundColor: '#2D2F30',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
				}}>
				{getStory()}
			</View>
		);
	})
	.add('Hidden', () => {
		return <PrivacyPicker />;
	})
	.add('Visible - Default Selection', () => {
		return <PrivacyPicker visible />;
	})
	.add('Visible - Has selection', () => {
		return <PrivacyPicker visible selectedId="friends" />;
	})
	.add('Visible - OnChange', () => {
		return (
			<PrivacyPicker
				visible
				onChange={(newSelection) => {
					action('Selection changed');
				}}
			/>
		);
	});
