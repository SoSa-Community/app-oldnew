import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
    message_list: {
        marginBottom: 10
    },

    messageContainer: {
        marginTop:10
    },

    messageContainerWithMention: {
        backgroundColor: '#000000'
    },

    messageContainerInner: {
        flexDirection: 'row',
        padding: 10
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
        paddingVertical: 4,
        paddingLeft: 10
    },

    currentRoom: {
        textAlign: 'center',
        backgroundColor: 'red'
    },

    status: {
        color: '#a6a6a6',
        paddingVertical: 10,
        textAlign: 'center'
    },

    footer: {
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
    },

    slowDownNotifier: {
        opacity:0.75,
        paddingVertical: 8,
        flex: 1,
        flexDirection: 'row',
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
        marginBottom:8,
        justifyContent:'center',
        backgroundColor: '#ccc', borderRadius:8
    }
});

export default Styles;
