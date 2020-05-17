import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
    message_list: {
        marginBottom: 10
    },

    message: {
        color: '#ffffff',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 10
    },

    message_username: {
        color: '#ffffff',
        paddingBottom: 3,
        fontWeight: 'bold'
    },

    room: {
        textAlign: 'center',
        color: '#000000',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingLeft: 10
    },

    currentRoom: {
        textAlign: 'center',
        backgroundColor: 'red'
    },

    user: {
        textAlign: 'center',
        color: '#000000',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingVertical: 10
    },

    status: {
        color: '#a6a6a6',
        paddingVertical: 10,
        textAlign: 'center'
    },

    footer: {
        paddingBottom: Platform.OS === 'ios' ? 24 : 0,
        flexDirection: 'row'
    },

    newMessageScrollNotifier: {
        opacity:0.95,
        paddingVertical: 8,
        flex: 1,
        flexDirection: 'row',
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
        marginBottom:8,
        justifyContent:'center',
        backgroundColor: '#f0ad4e', borderRadius:8
    }
});

export default Styles;
