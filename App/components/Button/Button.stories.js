import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import React from 'react';

import CenterView from '../../../storybook/stories/CenterView/index';

import Button from './Button';

storiesOf('Components/Button', module)
	.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
	.add('Default', () => {
		return (
			<Button
				text="Button"
				showActivity={false}
				onPress={() => action('Button pressed')}
			/>
		);
	})
	.add('Disabled', () => {
		return (
			<Button
				text="Button"
				showActivity={false}
				onPress={() => {}}
				disabled
			/>
		);
	})
;
