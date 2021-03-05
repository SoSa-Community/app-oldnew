import React, { useState, useEffect } from 'react';
import {Text, View, TouchableOpacity, StyleSheet, KeyboardAvoidingView} from 'react-native';

import Input from "../../components/Input";
import ActivityButton from "../../components/ActivityButton";

import InfoBox from "../../components/InfoBox";
import FormError from "../../components/FormError";

import { useAPI } from '../../context/APIContext';
import { useAuth } from '../../context/AuthContext';
import {useAuthenticatedNavigation} from '../../context/AuthenticatedNavigationContext';

const Styles = StyleSheet.create({
    container: {
        flex: 1
    },
    
    infoContainer: {
        paddingTop: 32,
        paddingHorizontal: '5%'
    },
    
    header: {
        alignItems:'center'
    },
    
    headerText: {
        alignItems:'center'
    },
    
    headerSubText: {
        fontSize: 18,
        textAlign:'center',
        marginTop: 8
    },
    
    inputs: {
        marginTop:32
    },
    
    label: {
        marginBottom: 8
    },
    
    emailContainer: {
        marginTop: 12
    },
    
    buttons: {
        justifyContent:'flex-end',
        flex:1,
        marginBottom: Platform.OS === 'ios' ? 16 : 6
    },
    
    buttonsInner: {
        flexDirection: 'row',
        height:40,
        marginHorizontal:8
    },
    
    logoutButtonContainer: {
        flex: 1,
        paddingHorizontal: 4
    },
    
    logoutButton: {
        paddingVertical: 8,
        borderRadius: 4,
        flex: 0,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: '#dc3545'
    },
    
    logoutButtonText: {
        color:'#fff',
        fontSize: 16
    },
    
    confirmButton: {
        flex: 2,
        paddingHorizontal: 4
    }
    
});

const WelcomeScreen = ( {navigation, route: { params } } ) => {
    
    const { services: { auth: authService } } = useAPI();
    const { setMenuOptions } = useAuthenticatedNavigation();
    const { logout } = useAuth();
    
    const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ haveEmail, setHaveEmail ] = useState(false);
    const [ fieldErrors, setFieldErrors ] = useState({
        username: '',
        email: '',
    });
    
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if(params){
            const {user: { username, welcome: { haveEmail } } } = params;
        
            if(username) setUsername(username);
            if(haveEmail) setHaveEmail(haveEmail);
        }
    
        
        setMenuOptions({
            showLeft: true,
            showRight: false,
            leftMode: 'back',
            title: 'Welcome',
            leftIcon: ['fal', 'sign-out-alt'],
            onBack: () => {
                return new Promise((resolve) => {
                    logout();
                    resolve();
                })
            },
            backIgnoreStack: true
        });
        
    }, []);
		
    const confirmWelcome = () => {
        setSaving(true);
        setFieldErrors({username: '', email: ''});
    
        authService.confirmWelcome(username, email)
            .then(() => navigation.replace('Chat'))
            .catch(errors => {
                let existingFieldErrors = {...fieldErrors};
                
                if(Array.isArray(errors)){
                    errors.forEach((error) => {
                        const {message, field} = error;
                        if(field) existingFieldErrors[field] = message;
                    });
                    setFieldErrors(fieldErrors);
                } else {
                    console.debug(errors);
                }
                setSaving(false);
            });
    };
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >
            <View style={Styles.container}>
                <View style={Styles.infoContainer}>
                    <View style={Styles.header}>
                        <Text style={Styles.headerText}>You're almost in!</Text>
                        <Text style={Styles.headerSubText}>Before I can let you in, I need just a little bit more information</Text>
                    </View>
                    <View style={Styles.inputs}>
                        <View>
                            <Text style={Styles.label}>Your username</Text>
                            <Input icon={['fal', 'user']} placeholder="Username" value={username} onChangeText={data => setUsername(data)} enabled={!saving}/>
                            <FormError errors={fieldErrors?.username} />
                        </View>
                        { !haveEmail &&
                        <View style={Styles.emailContainer}>
                            <Text style={Styles.label}>Your e-mail</Text>
                            <Input icon={['fal', 'envelope']} placeholder="E-mail" value={email} onChangeText={data => setEmail(data)} enabled={!saving}/>
                            <FormError errors={fieldErrors?.email} />
                            <InfoBox
                                title="Why do you need my e-mail address?"
                                text1="E-mail addresses are just one way we protect our community from spam and bots."
                                text2="After you have confirmed your e-mail address, we'll scramble (hash) so not even we know what it is!"
                            />
                        </View> }
                    </View>
                </View>
                <View style={Styles.buttons}>
                    <View style={Styles.buttonsInner}>
                        <View style={Styles.logoutButtonContainer}>
                            <TouchableOpacity onPress={logout}>
                                <View style={Styles.logoutButton}>
                                    <Text style={Styles.logoutButtonText}>Logout</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.confirmButton} >
                            <ActivityButton showActivity={saving} onPress={confirmWelcome} text="Confirm"/>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

export default WelcomeScreen;
