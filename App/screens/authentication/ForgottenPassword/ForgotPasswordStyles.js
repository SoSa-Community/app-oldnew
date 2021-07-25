import { Platform, StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
	keyboardView: { flex: 1 },
	container: {
		backgroundColor: '#2D2F30',
		flex: 1,
		paddingHorizontal: 22,
	},

	formContainer: {},
	header: {
		fontSize: 32,
		color: '#fff',
		textAlign: 'center',
		marginBottom: 30,
		fontWeight: 'bold',
	},
	subheader: {
		fontSize: 18,
		color: '#8A8A8A',
		textAlign: 'center',
		marginTop: 24,
		paddingHorizontal: 16
	},
	subheaderButton: {
		color: '#F96854',
		fontSize: 18,
	},
	buttonBottom: {
		flex: 1,
		justifyContent: 'flex-end',
		marginBottom: Platform.OS === 'ios' ? 68 : 24,
	},

	buttonRow: {
		flexDirection: 'row',
	},
	
	button: { backgroundColor: '#F96854' },
	buttonText: { textTransform: 'uppercase', fontWeight: 'bold' },
	secondary_button: {
		borderRadius: 8,
		flex: 0,
		flexDirection: 'row',
		backgroundColor: '#ffc107',
		paddingVertical: 8,
		marginRight: 5,
		justifyContent: 'center',
	},
	text: {
		fontSize: 16,
		color: '#fff',
	},
});

export default Styles;
