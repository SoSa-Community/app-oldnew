import { storiesOf } from '@storybook/react-native';

import React from 'react';

import CenterView from '../../../storybook/stories/CenterView/index';
import FloatingIconButton from './FloatingIconButton';

storiesOf('FloatingIconButton', module)
	.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
	.add('Default', () => {
		return <FloatingIconButton containerStyle={{ position: 'relative' }} />;
	});
