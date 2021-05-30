import { Platform, StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
	message_list: {
		marginBottom: 10,
	},

	room: {
		textAlign: 'center',
		color: '#000000',
		borderBottomColor: '#cccccc',
		borderBottomWidth: 1,
		paddingVertical: 4,
		paddingLeft: 10,
	},

	currentRoom: {
		textAlign: 'center',
		backgroundColor: 'red',
	},

	status: {
		color: '#a6a6a6',
		paddingVertical: 10,
		textAlign: 'center',
	},

	footer: {
		flexDirection: 'row',
		paddingBottom: Platform.OS === 'ios' ? 24 : 4,
		backgroundColor: '#121211',
	},

	newMessageScrollNotifier: {
		opacity: 0.95,
		paddingVertical: 8,
		flex: 1,
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		marginBottom: 8,
		justifyContent: 'center',
		backgroundColor: '#f0ad4e',
		borderRadius: 8,
	},

	slowDownNotifier: {
		opacity: 0.75,
		paddingVertical: 8,
		flex: 1,
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		marginBottom: 8,
		justifyContent: 'center',
		backgroundColor: '#ccc',
		borderRadius: 8,
	},

	white: { color: '#ffffff' },
	black: { color: '#000' },
	container: { flex: 1, marginBottom: Platform.OS === 'ios' ? 0 : 0 },
	messageListContainer: { flex: 1, backgroundColor: '#2b2b2b', zIndex: 1000 },
});

export default Styles;
