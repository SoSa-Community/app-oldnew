import React from 'react';
import { Image, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

import Styles from '../../screens/styles/onboarding';

const SocialButton = ({ onPress, icon, enabled }) => {
	return (
		<TouchableHighlight
			onPress={onPress}
			style={[Styles.socialButton, { opacity: enabled ? 1 : 0.5 }]}
			disabled={!enabled}>
			<Image source={icon} style={Styles.socialButtonIcon} />
		</TouchableHighlight>
	);
};

SocialButton.propTypes = {
	onPress: PropTypes.func.isRequired,
	icon: PropTypes.number.isRequired,
	enabled: PropTypes.bool.isRequired,
};

export default SocialButton;
