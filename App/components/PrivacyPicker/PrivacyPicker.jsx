import React, { useState } from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	View,
	ScrollView,
	Text,
	Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import Icon from '../Icon';

const Styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		backgroundColor: '#191B1C',
		width: '70%',
		borderColor: '#191B1C',
		borderWidth: 1,

		shadowColor: '#fff',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.32,
		shadowRadius: 5.46,

		elevation: 9,
	},
	innerContainer: {},
	headerContainer: {
		alignItems: 'center',
		paddingVertical: 14,
		borderBottomWidth: 0.5,
		borderBottomColor: '#8A8A8A',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	headerText: {
		color: '#fff',
		fontSize: 18,
		flex: 3,
		textAlign: 'center',
		marginLeft: 12,
	},
	closeButton: {
		marginRight: 12,
	},
	closeIcon: { color: '#F96854' },
	itemsContainer: { paddingVertical: 14, paddingHorizontal: 14 },
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	iconContainer: {
		backgroundColor: '#383a3a',
		alignItems: 'center',
		justifyContent: 'center',
		width: 32,
		height: 32,
		borderRadius: 16,
		borderWidth: 2,
		borderColor: '#8A8A8A',
		marginRight: 16,
		marginLeft: 12,
	},
	icon: { color: '#fff' },
	itemText: { fontSize: 18, color: '#8A8A8A' },
	footerContainer: {
		backgroundColor: '#2D2F30',
		paddingVertical: 14,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	footerText: { color: '#fff', fontSize: 18, marginRight: 8 },
	iconContainerSelected: {
		borderColor: '#F96854',
		backgroundColor: '#473735',
	},
	itemTextSelected: {
		color: '#F96854',
	},
	customizeButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	customizeIcon: {
		color: '#fff',
		marginRight: 6,
	},
});

const PrivacyPicker = ({ visible, onChange, selectedId }) => {
	const defaultOptions = [
		{
			id: 'anyone',
			icon: ['fad', 'globe-europe'],
			title: 'Anyone',
		},
		{
			id: 'friends',
			icon: ['fas', 'people-carry'],
			title: 'Friends',
		},
		{
			id: 'me',
			icon: ['fal', 'lock-alt'],
			title: 'Only me',
		},
	];

	let navigation;
	try {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		navigation = useNavigation();
	} catch (e) {
		console.debug(e);
	}

	const [options, setOptions] = useState([...defaultOptions]);
	const [isVisible, setIsVisible] = useState(visible);
	const [selected, setSelected] = useState(selectedId || 'anyone');

	const hide = () => setIsVisible(false);
	const onSelect = (id) => {
		setSelected(id);
		if (typeof onChange === 'function') {
			onChange(id);
		}
	};

	const customize = () => {
		if (navigation) navigation.navigate('Privacy');
		else {
			Alert.alert(
				'Not inside a navigator',
				"This can't be used outside of a navigator",
				[{ text: 'OK' }],
				{ cancelable: true },
			);
		}
	};

	if (!isVisible) return <></>;

	return (
		<View style={Styles.container}>
			<View style={Styles.innerContainer}>
				<View style={Styles.headerContainer}>
					<Text style={Styles.headerText}>Who can see this?</Text>
					<TouchableOpacity style={Styles.closeButton} onPress={hide}>
						<Icon
							icon={['fal', 'times']}
							style={Styles.closeIcon}
							size={24}
						/>
					</TouchableOpacity>
				</View>
				<ScrollView style={Styles.itemsContainer}>
					{options.map(({ id, icon, title }) => {
						const iconContainerStyles = [Styles.iconContainer];
						const textStyles = [Styles.itemText];

						if (id === selected) {
							iconContainerStyles.push(
								Styles.iconContainerSelected,
							);
							textStyles.push(Styles.itemTextSelected);
						}

						return (
							<TouchableOpacity
								style={Styles.itemContainer}
								onPress={() => onSelect(id)}
								key={id}>
								<View style={iconContainerStyles}>
									<Icon icon={icon} style={Styles.icon} />
								</View>
								<Text style={textStyles}>{title}</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
				<View style={Styles.footerContainer}>
					<TouchableOpacity
						onPress={customize}
						style={Styles.customizeButton}>
						<Icon
							icon={['fas', 'cog']}
							size={22}
							style={Styles.customizeIcon}
						/>
						<Text style={Styles.footerText}>Customize</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

PrivacyPicker.propTypes = {
	visible: PropTypes.bool,
	onChange: PropTypes.func,
	selectedId: PropTypes.string,
};

PrivacyPicker.defaultProps = {
	visible: false,
	onChange: () => {},
	selectedId: 'anyone',
};

export default PrivacyPicker;
