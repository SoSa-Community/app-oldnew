import { Platform, StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
	menuTop: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: Platform.OS === 'ios' ? 32 : 0,
	},
	menuTopLeft: { paddingLeft: 7, paddingRight: 5 },
	menuTopRight: { paddingRight: 10 },
});

export default Styles;
