import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import React from 'react';
import { View } from 'react-native';

import ProfileHeader from './ProfileHeader';

storiesOf('ProfileHeader', module)
	.addDecorator((getStory) => {
		return (<View style={{backgroundColor:'#2D2F30'}}>{getStory()}</View>);
	})
	.add('Base', () => {
		return <ProfileHeader />;
	})
	.add('Editable', () => {
		return <ProfileHeader isEditable={true} />;
	});
