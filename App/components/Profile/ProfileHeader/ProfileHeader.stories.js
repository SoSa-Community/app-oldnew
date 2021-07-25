import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import React from 'react';
import { View } from 'react-native';

import ProfileHeader from './ProfileHeader';

storiesOf('Components/ProfileHeader', module)
	.addDecorator((getStory) => {
		return <View style={{ backgroundColor: '#2D2F30' }}>{getStory()}</View>;
	})
	.add('Base', () => {
		return <ProfileHeader />;
	})
	.add('Editable - Readonly mode', () => {
		return (
			<ProfileHeader
				isEditable={true}
				onEdit={() => action('Edit button pressed')}
			/>
		);
	})
	.add('Editable - Edit mode', () => {
		return (
			<ProfileHeader
				isEditable={true}
				editingMode
				onSave={() => action('Save button pressed')}
				onCancel={() => action('Save button pressed')}
			/>
		);
	});
