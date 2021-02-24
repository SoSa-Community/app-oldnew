import React, { useState, useEffect } from 'react';
import {Text, View, TouchableOpacity, Switch, KeyboardAvoidingView} from 'react-native';

import Input from "../../components/Input";
import ActivityButton from "../../components/ActivityButton";

import InfoBox from "../../components/InfoBox";
import FormError from "../../components/FormError";

import { useAPI } from '../../context/APIContext';
import {useApp} from '../../context/AppContext';
import {useAuth} from '../../context/AuthContext';

const WelcomeScreen = ( {navigation, route: { params } } ) => {
    
    const { services: { auth: authService } } = useAPI();
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
            <View style={{flex: 1}}>
                <View style={{paddingTop: 32, paddingHorizontal: '5%'}}>
                    <View style={{alignItems:'center'}}>
                        <Text style={{fontSize: 24}}>You're almost in!</Text>
                        <Text style={{fontSize: 18, textAlign:'center', marginTop: 8}}>Before I can let you in, I need just a little bit more information</Text>
                    </View>
                    <View style={{marginTop:32}}>
                        <View>
                            <Text style={{marginBottom: 8}}>Your username</Text>
                            <Input icon={['fal', 'user']} placeholder="Username" value={username} onChangeText={data => setUsername(data)} enabled={!saving}/>
                            <FormError errors={fieldErrors?.username} />
                        </View>
                        { !haveEmail &&
                        <View style={{marginTop: 12}}>
                            <Text style={{marginBottom: 8}}>Your e-mail</Text>
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
                <View style={{justifyContent:'flex-end', flex:1, marginBottom: Platform.OS === 'ios' ? 16 : 6}}>
                    <View style={{flexDirection: 'row', height:40, marginHorizontal:8}}>
                        <View style={{flex: 1, paddingHorizontal: 4}}>
                            <TouchableOpacity onPress={logout}>
                                <View style={{paddingVertical: 8, borderRadius: 4, flex: 0, justifyContent: 'center', alignItems:'center', backgroundColor: '#dc3545'}}>
                                    <Text style={{color:'#fff', fontSize: 16}}>Logout</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 2, paddingHorizontal: 4}} >
                            <ActivityButton showActivity={saving} onPress={confirmWelcome} text="Confirm"/>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

export default WelcomeScreen;
