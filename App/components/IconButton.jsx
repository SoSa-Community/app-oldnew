import React from 'react';
import { TouchableHighlight } from 'react-native';

import PropTypes from 'prop-types';
import Icon from './Icon';

const IconButton = ({ onPress, icon, style, containerStyle, size }) => {
	return (
		<TouchableHighlight
			onPress={onPress}
			style={[{ paddingVertical: 8 }, containerStyle]}>
			<Icon icon={icon} style={style} size={size} />
		</TouchableHighlight>
	);
};

IconButton.propTypes = {
	onPress: PropTypes.func.isRequired,
	icon: PropTypes.array.isRequired,
	style: PropTypes.object,
	size: PropTypes.number,
};

IconButton.defaultProps = {
	style: null,
	size: 18,
};

export default IconButton;
