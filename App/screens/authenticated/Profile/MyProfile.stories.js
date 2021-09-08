import { storiesOf } from '@storybook/react-native';

import React from 'react';
import { mockGenders, mockProfile } from '../../../Mocks/MyProfile.mock';
import ProfileForm from './ProfileForm';

storiesOf('Screens/MyProfile', module)
	.addDecorator((getStory) => getStory())
	.add('Form - Own', () => {
		return (
			<ProfileForm
				mock
				genders={mockGenders}
				profile={mockProfile}
				isMine
			/>
		);
	})
	.add('Form - Editing', () => {
		return (
			<ProfileForm
				mock
				genders={mockGenders}
				profile={mockProfile}
				isMine
				isEditable
			/>
		);
	})
	.add('Form - Other', () => {
		return <ProfileForm mock genders={mockGenders} profile={mockProfile} />;
	});
