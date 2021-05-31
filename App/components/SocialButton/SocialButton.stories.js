import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import React from 'react';

import CenterView from '../../../storybook/stories/CenterView/index';
import SocialButton from './SocialButton';

storiesOf('SocialButton', module)
	.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
	.add('imgur', () => (
		<SocialButton
			icon={require(`../../assets/onboarding/imgur_icon.png`)}
			enabled
			onPress={action('Login to Imgur')}
		/>
	))
	.add('reddit', () => (
		<SocialButton
			icon={require(`../../assets/onboarding/reddit_icon.png`)}
			enabled
			onPress={action('Login to Reddit')}
		/>
	))
	.add('facebook', () => (
		<SocialButton
			icon={require(`../../assets/onboarding/facebook_icon.png`)}
			enabled
			onPress={action('Login to Facebook')}
		/>
	))
	.add('google', () => (
		<SocialButton
			icon={require(`../../assets/onboarding/google_icon.png`)}
			enabled
			onPress={action('Login to Google')}
		/>
	))
	.add('twitter', () => (
		<SocialButton
			icon={require(`../../assets/onboarding/twitter_icon.png`)}
			enabled
			onPress={action('Login to twitter')}
		/>
	))
;
