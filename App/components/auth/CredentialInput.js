import { useState } from 'react';
import AppConfig from '../../config';
import ActivityButton from '../ActivityButton';
import {Text, View} from 'react-native';
import Styles from '../../screens/styles/onboarding';
import FormError from '../FormError';
import Input from '../Input';
import SecureTextInput from '../SecureTextInput';
import React from 'react';
import Helpers from '../../sosa/Helpers';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const CredentialInput = ({forLogin, error, setError, processing, setProcessing}) => {
    const navigation = useNavigation();
    
    const { login, register } = useAuth();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    const { forgotPassword, credentials } = AppConfig.features[forLogin ? 'login' : 'register'];
    
    const validatePassword = () => {
        try{
            if(Helpers.validatePassword(password) === false){
                return null;
            }
        }
        catch (e) { return e?.message; }
        return '';
    };
    
    const Buttons = () => {
        const handleAuth = () => {
            setProcessing(true);
            const promise = (forLogin ? login(username, password) : register(username, password, email));
            promise
                .catch((error) => setError(error))
                .finally(() => setProcessing(false));
        };
        
        const letmeinButton = <ActivityButton showActivity={processing} onPress={handleAuth} text="Let me in!"/>
        const forgotButton = <View>
            <Text style={Styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}>Forgotten Password</Text>
        </View>;
    
        if(forgotPassword){
            return (
                <View style={{marginTop: 4}}>
                    <View style={{flexDirection: 'row', height:40}}>
                        <View style={{flex: 5}}>
                            {forgotButton}
                        </View>
                        <View style={{flex: 6}} >
                            {letmeinButton}
                        </View>
                    </View>
                </View>)
        }
        return <View style={{marginTop: 4}}>{letmeinButton}</View>;
    }
    
    if(credentials){
        if(forLogin){
            return <View>
                
                <Input
                    containerStyle={{marginBottom: 4}}
                    icon={['fal', 'user']}
                    placeholder="Username or e-mail address"
                    value={username}
                    onChangeText={data => setUsername(data)}
                    enabled={!processing}
                />
                <SecureTextInput icon={['fal', 'key']} placeholder="Password" onChangeText={data => setPassword(data)} value={password} enabled={!processing} />
                <View style={{marginTop: 2}}>
                    <FormError errors={error} />
                </View>
                <Buttons />
            </View>;
        }else{
            return <View>
                <Input containerStyle={{marginBottom: 4}} icon={['fal', 'user']} placeholder="Username" value={username} onChangeText={data => setUsername(data)} enabled={!processing} />
                <SecureTextInput icon={['fal', 'key']} placeholder="Password" onChangeText={data => setPassword(data)} validateInput={() => validatePassword()} enabled={!processing} />
                <Input containerStyle={{marginTop: 4}} icon={['fal', 'envelope']} placeholder="E-mail" value={email} onChangeText={data => setEmail(data)} enabled={!processing} />
                <FormError errors={error} />
                <Buttons />
            </View>;
        }
    }
    
    return null;
};

export default CredentialInput;
