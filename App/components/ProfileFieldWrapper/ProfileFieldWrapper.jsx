import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Icon from '../Icon';
import IconButton from '../IconButton';

import PropTypes from 'prop-types';

const Styles = StyleSheet.create({
	container: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
	icon: { color: '#FFF', marginRight: 12 },
	label: {
		color: '#BCBCBC',
		fontSize: 16,
		textTransform: 'uppercase',
		marginRight: 14,
	},
	value: { color: '#FFF', fontSize: 16 },
	editingContainer: {
		backgroundColor: '#191B1C',
		width: '100%',
		paddingHorizontal: 12,
		paddingVertical: 10,
		height: 50,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#191B1C',
	},

	editingContainerWithError: { borderColor: '#E20000' },

	editingLabel: {
		color: '#fff',
		fontWeight: '600',
		marginBottom: 8,
		fontSize: 16,
	},

	errorTextColor: { color: '#E20000' },
	errorText: { color: '#E20000', fontSize: 14 },

	editingValue: {
		color: '#fff',
		fontSize: 16,
	},
	privacyButton: {
		borderWidth: 2,
		borderColor: '#F96854',
		backgroundColor: 'rgba(249, 104, 84, 0.21)',
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 0,
	},
	privacyButtonIcon: { color: '#FFF' },
});

const ProfileFieldWrapper = ({
	icon,
	label,
	value,
	privacy,
	containerStyle,
	labelStyle,
	valueStyle,
	editingMode,
	children,
	error,
}) => {
	if (editingMode) {
		const containerStyles = [Styles.container, Styles.editingContainer];
		const iconStyles = [Styles.icon];
		const labelStyles = [Styles.editingLabel];

		if (error && error.length) {
			labelStyles.push(Styles.errorTextColor);
			containerStyles.push(Styles.editingContainerWithError);
			iconStyles.push(Styles.errorTextColor);
		}

		return (
			<View style={{ width: '100%', marginVertical: 8 }}>
				{label ? <Text style={labelStyles}>{label}</Text> : <></>}
				<View style={containerStyles}>
					{icon ? (
						<Icon icon={icon} size={26} style={iconStyles} />
					) : (
						<></>
					)}
					<View style={{ flex: 1, alignContent: 'flex-start' }}>
						{children}
					</View>
					<View style={{ alignItems: 'flex-end' }}>
						<IconButton
							icon={['fad', 'globe-europe']}
							size={16}
							style={Styles.privacyButtonIcon}
							containerStyle={Styles.privacyButton}
							onPress={() => {}}
						/>
					</View>
				</View>
				{error && error.length ? (
					<Text style={Styles.errorText}>{error}</Text>
				) : (
					<></>
				)}
			</View>
		);
	}

	return (
		<View style={[Styles.container, containerStyle]}>
			{Array.isArray(icon) && (
				<Icon icon={icon} size={26} style={Styles.icon} />
			)}
			{label && <Text style={[Styles.label, labelStyle]}>{label}</Text>}
			<Text style={[Styles.value, valueStyle]}>{value}</Text>
		</View>
	);
};

ProfileFieldWrapper.propTypes = {
	icon: PropTypes.array,
	label: PropTypes.string,
	value: PropTypes.any,
	privacy: PropTypes.string,
	containerStyle: PropTypes.object,
	labelStyle: PropTypes.object,
	valueStyle: PropTypes.object,
	type: PropTypes.string,
	labelForEditing: PropTypes.string,
	valueForEditing: PropTypes.any,
	editingLabelPlaceHolderOnly: PropTypes.string,
	editingMode: PropTypes.bool,
	options: PropTypes.object,
	placeholder: PropTypes.string,
};

ProfileFieldWrapper.defaultProps = {
	icon: null,
	label: '',
	value: '',
	privacy: null,
	type: 'text',
	containerStyle: null,
	labelStyle: null,
	valueStyle: null,
	labelForEditing: '',
	valueForEditing: null,
	editingLabelPlaceHolderOnly: '',
	editingMode: false,
	options: {},
	placeholder: '',
};

export default ProfileFieldWrapper;
