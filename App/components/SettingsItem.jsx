import React, { useState, useEffect } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { Preferences } from '../sosa/Preferences';

const Styles = StyleSheet.create({
	itemContainer: {
		flexDirection: 'row',
		padding: 14,
	},

	itemDescriptionContainer: {
		flex: 4,
	},

	title: { fontSize: 18 },
	description: { fontSize: 12 },

	switchContainer: {
		flex: 1,
		justifyContent: 'center',
	},
});

const SettingsItem = ({ name, title, description, onChange }) => {
	const [getValue, setValue] = useState(false);

	useEffect(() => {
		try {
			Preferences.get(name, (value) => {
				setValue(value);
			});
		} catch (e) {
			console.debug('ouch', e);
		}
	}, []);

	return (
		<View style={Styles.itemContainer}>
			<View style={Styles.itemDescriptionContainer}>
				<Text style={Styles.title}>{title}</Text>
				<Text style={Styles.description}>{description}</Text>
			</View>
			<View style={Styles.switchContainer}>
				<Switch
					trackColor={{ true: '#28a745', false: '#767577' }}
					thumbColor={getValue ? '#fff' : '#f4f3f4'}
					onValueChange={(value) => {
						Preferences.set(name, value);
						setValue(value);
						if (onChange) {
							onChange(value);
						}
					}}
					value={getValue}
				/>
			</View>
		</View>
	);
};

SettingsItem.propTypes = {
	name: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	onChange: PropTypes.func,
};

SettingsItem.defaultProps = {
	description: '',
	onChange: null,
};

export default SettingsItem;
