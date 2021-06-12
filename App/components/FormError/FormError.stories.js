import { storiesOf } from '@storybook/react-native';

import React from 'react';

import CenterView from '../../../storybook/stories/CenterView/index';
import FormError from './FormError';

storiesOf('Components/FormError', module)
	.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
	.add('Default', () => {
		return <FormError errors={[new Error('Some error')]} />;
	})
	.add('Blank', () => {
		return <FormError errors={[]} />;
	});
