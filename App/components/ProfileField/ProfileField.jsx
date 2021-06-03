import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Icon from '../Icon';
import IconButton from '../IconButton';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import Picker from '../Picker/Picker';
import Input from '../Input';

const Styles = StyleSheet.create({
	container: { flexDirection: 'row', alignItems: 'center' },
	icon: { color: '#FFF', marginRight: 8 },
	label: {
		color: '#BCBCBC',
		fontSize: 14,
		textTransform: 'uppercase',
		marginRight: 12,
	},
	value: { color: '#FFF', fontSize: 14 },
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
	errorText: { color: '#E20000', fontSize: 12, marginTop: 8 },

	editingValue: {
		color: '#fff',
		fontSize: 18,
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

const ProfileField = ({
	icon,
	label,
	value,
	privacy,
	type,
	labelForEditing,
	valueForEditing,
	editingMode,
	options,
}) => {
	const [error, setError] = useState('');

	if (editingMode) {
		const editingComponent = () => {
			if (type === 'dateofbirth') {
				return (
					<DateTimePicker
						icon={['fal', 'calendar-star']}
						placeholder="Date Of Birth"
						initialValue={valueForEditing}
						value={valueForEditing}
						enabled
						editable
						textStyle={Styles.editingValue}
						textValue={value}
						{...options}
					/>
				);
			} else if (type === 'picker') {
				return (
					<Picker
						placeholder={labelForEditing}
						enabled
						initialValue={valueForEditing}
						value={valueForEditing}
						type="picker"
						editable
						textStyle={Styles.editingValue}
						{...options}
					/>
				);
			} else if (type === 'text') {
				return (
					<Input
						placeholder={labelForEditing}
						value={valueForEditing}
						onChangeText={(data) => {}}
						enabled
						{...options}
					/>
				);
			}
		};

		const containerStyles = [Styles.container, Styles.editingContainer];
		const iconStyles = [Styles.icon];
		const labelStyles = [Styles.editingLabel];

		if (error && error.length) {
			labelStyles.push(Styles.errorTextColor);
			containerStyles.push(Styles.editingContainerWithError);
			iconStyles.push(Styles.errorTextColor);
		}

		return (
			<View style={{ width: '100%' }}>
				<Text style={labelStyles}>{labelForEditing}</Text>
				<View style={containerStyles}>
					{icon ? (
						<Icon icon={icon} size={26} style={iconStyles} />
					) : (
						<></>
					)}
					<View style={{ flex: 1, alignContent: 'flex-start' }}>
						{editingComponent()}
					</View>
					<View style={{ alignItems: 'flex-end' }}>
						<IconButton
							icon={['fad', 'globe-europe']}
							size={16}
							style={Styles.privacyButtonIcon}
							containerStyle={Styles.privacyButton}
						/>
					</View>
				</View>
				{error && error.length ? ( <Text style={Styles.errorText}>{error}</Text> ) : (<></>)}
			</View>
		);
	}

	return (
		<View style={Styles.container}>
			<Icon icon={icon} size={24} style={Styles.icon} />
			<Text style={Styles.label}>{label}</Text>
			<Text style={Styles.value}>{value}</Text>
		</View>
	);
};

ProfileField.propTypes = {};

ProfileField.defaultProps = {};

export default ProfileField;
