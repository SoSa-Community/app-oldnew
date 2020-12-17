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

    smallheader: {
        fontSize: 14,
        color:'#fff',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20
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

    inputParentContainer: {height: 45, zIndex: 1},
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    
    inputContainerHasError: {
        borderColor: '#dc3545',
        borderWidth: 2,
    },

    input:{
        flex: 1,
        color: '#121111',
        height:42
    },

    inputIcon:{color: '#ccc', marginHorizontal:4},
    
    multiline: {
        minHeight: 180,
        width: '100%',
        textAlignVertical: 'top',
        borderRadius: 8,
    },
    
    lengthIndicator: {
        alignSelf:'center',
        paddingRight:12
    },
    
    lengthIndicatorWarning: {
        color: '#f0ad4e'
    },
    
    lengthIndicatorDanger: {
        color: '#dc3545'
    },
    
    lengthIndicatorNeutral: {
        color: '#ccc'
    },
    
    viewPasswordIcon: {

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
    },

    separatorLine: {
        marginVertical: 20,
        backgroundColor: '#000',
        height: 1,
    },

    socialButton: {
        marginHorizontal: 5,
    },

    socialButtonIcon: {
        borderRadius: 32,
        width: 64,
        height:64
    },

    buttonBottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: Platform.OS === 'ios' ? 68 : 36
    },

    newToSoSaButton: {
        alignItems:'center',
        borderRadius: 16,
        borderColor: '#f0ad4e',
        borderWidth: 1,
        paddingVertical: 10
    },

    newToSoSaButtonText: {color: '#fff'}
});

export default Styles;
