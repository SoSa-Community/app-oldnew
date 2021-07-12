import { Platform, StyleSheet } from 'react-native';

const backgroundColour1 = '#2D2F30';
const headerTextColour = '#fff';

const BaseStyles = StyleSheet.create({
	header: {
		backgroundColor: backgroundColour1,
		elevation: 0,
		shadowOpacity: 0,
		borderBottomWidth: 0,
	},

	headerPadding: {
		marginVertical: 5,
		paddingTop: Platform.OS === 'ios' ? 24 : 0,
	},

	headerTitle: {
		color: headerTextColour,
		fontSize: 18,
		flex: 1,
		marginLeft: 8,
	},

	container: {
		backgroundColor: backgroundColour1,
		flex: 1,
	},
});

export default BaseStyles;
