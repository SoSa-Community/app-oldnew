import { storiesOf } from '@storybook/react-native';

import React from 'react';

import CenterView from '../../../storybook/stories/CenterView/index';

import SecureTextField from './SecureTextField';

storiesOf('Components/SecureTextField', module)
	.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
	.add('Default', () => {
		return <SecureTextField />;
	})
	.add('Disabled', () => {
		return <SecureTextField enabled={false} />;
	});
