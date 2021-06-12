import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import React from 'react';

import CenterView from '../../../storybook/stories/CenterView/index';

import ActivityButton from './ActivityButton';

storiesOf('Components/ActivityButton', module)
	.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
	.add('Default', () => {
		return (
			<ActivityButton
				text="Button"
				showActivity={false}
				onPress={() => {}}
			/>
		);
	})
	.add('With Activity', () => {
		return (
			<ActivityButton
				text="Button"
				showActivity
				onPress={() => {}}
			/>
		);
	})
	.add('Disabled', () => {
		return (
			<ActivityButton
				text="Button"
				showActivity={false}
				onPress={() => {}}
				disabled
			/>
		);
	})
;
