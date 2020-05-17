import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
    content_container: {
        marginTop: 15
    },

    formContainer: {
        paddingHorizontal:30
    },

    header: {
        fontSize: 24,
        color:'#fff',
        textAlign: 'center',
        marginBottom: 5
    },

    subheader: {
        fontSize: 18,
        color:'#fff',
        textAlign: 'center'
    },

    error: {
        backgroundColor:'#dc3545',
        color:'#fff',
        textAlign:'center',
        padding:8,
        borderRadius: 8,
        marginBottom: 4
    },

    inputParentContainer: {height: 45},
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 4,
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 4
    },

    input:{
        flex: 1
    },

    inputIcon:{color: '#ccc', marginHorizontal:4, marginTop: 11},
    viewPasswordIcon: {
        marginTop: 10
    },

    forgotButton: {color: '#7ac256', padding:8, textAlign:'center'},

    secondary_button: {
        borderRadius: 4,
        flex: 0,
        flexDirection: 'row',
        backgroundColor: '#ffc107',
        paddingVertical: 8,
        marginRight:5,
        justifyContent: 'center'
    },

    letMeIn_button: {
            borderRadius: 4,
            flex: 0,
            flexDirection: 'row',
            backgroundColor: '#5cb85c',
            paddingVertical: 8,
            justifyContent: 'center'
    },
    letMeIn_button_pressed: {
        backgroundColor: '#ccc'
    },
    letMeIn_activity: {
        marginLeft:8
    },
    letMeIn_text: {
        color:'#fff',
        fontSize: 16
    },

    validatedInputContainer: {
        marginBottom: 4,
        flex: 1,
        flexDirection: 'row'
    },

    validatedInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        flex:1
    },

    buttonRow: {
        flexDirection: 'row',
        height: 40
    }
});

export default Styles;