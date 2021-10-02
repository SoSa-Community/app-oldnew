import { storiesOf } from '@storybook/react-native';

import React from 'react';
import { mockGenders, mockProfile } from '../../../Mocks/MyProfile.mock';
import ProfileForm from './ProfileForm';
import { ScrollView } from '../../../components/ScrollView/ScrollView';

storiesOf('Screens/MyProfile', module)
	.addDecorator((getStory) => getStory())
	.add('Form - Own', () => {
		return (
			<ScrollView>
				<ProfileForm
					mock
					genders={mockGenders}
					profile={mockProfile}
					isMine
				/>
			</ScrollView>
		);
	})
	.add('Form - Editing', () => {
		return (
			<ScrollView>
				<ProfileForm
					mock
					genders={mockGenders}
					profile={mockProfile}
					isMine
					isEditable
				/>
			</ScrollView>
		);
	})
	.add('Form - Other', () => {
		return <ProfileForm mock genders={mockGenders} profile={mockProfile} />;
	});
