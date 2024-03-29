import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import React from 'react';

import CenterView from '../../../../storybook/stories/CenterView';
import ProfilePicture from './ProfilePicture';

const defaultPicture = require('../../../assets/profiles/default.jpg');

storiesOf('Components/ProfilePicture', module)
	.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
	.add('Base', () => {
		return <ProfilePicture picture={defaultPicture} size="base" />;
	})
	.add('Small', () => {
		return <ProfilePicture picture={defaultPicture} size="small" />;
	})
	.add('Medium', () => {
		return <ProfilePicture picture={defaultPicture} size="med" />;
	})
	.add('Large', () => {
		return <ProfilePicture picture={defaultPicture} size="large" />;
	})
	.add('Larger', () => {
		return <ProfilePicture picture={defaultPicture} size="larger" />;
	})
	.add('Very Large', () => {
		return <ProfilePicture picture={defaultPicture} size="verylarge" />;
	})
	.add('Loading - Small', () => {
		return <ProfilePicture picture={defaultPicture} size="small" loading />;
	})
	.add('Loading - Very Large', () => {
		return (
			<ProfilePicture picture={defaultPicture} size="verylarge" loading />
		);
	})
	.add('With onPress', () => {
		return (
			<ProfilePicture
				picture={defaultPicture}
				size="verylarge"
				onPress={action('Profile picture pressed')}
			/>
		);
	})
	.add('With icon', () => {
		return (
			<ProfilePicture
				picture={defaultPicture}
				size="verylarge"
				button={{
					icon: ['fal', 'image'],
					style: { color: '#fff' },
					size: 18,
					onPress: action('Button pressed'),
				}}
			/>
		);
	});
