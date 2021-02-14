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

const CredentialInput = ({screenType, error, setError, socialMediaError, setSocialMediaError, processing, setProcessing}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    const { forgotPassword, credentials } = AppConfig.features[screenType];
    
    const forLogin = screenType === 'login';
    
    const complete = (error, json) => {
        console.log(error, json);
        setProcessing(false);
        
        if(error){
            if(Array.isArray(error)) error = error.pop();
            setError(error.message || error.code);
        }else{
            const {navigation} = this;
            
            const { user } = json;
            const { welcome } = user;
            
            if(welcome){
                navigation.replace('Welcome', {user, welcome});
            }else{
                navigation.replace('MembersArea', {login: true});
            }
        }
    };
    
    const validatePassword = () => {
        try{
            if(Helpers.validatePassword(password) === false){
                return null;
            }
        }catch (e) {
            return e.message;
        }
        return '';
    };
    
    const doTheThing = () => {
        
        this.setState({processing: true});
        
        if(!forLogin && (!username.length || !password.length || !email.length)) {
            complete(new Error('Please provide a username, e-mail address and password'));
        }else {
            const { apiClient: { services: { auth: authService } } } = this;
            const promise = (forLogin ? authService.login(username, password) : authService.register(username, password, email));
            
            promise
                .then((response) => complete(null, response))
                .catch((error) => complete(error))
                .finally(() => setProcessing(false));
        }
    };
    
    let buttonContainer = null;
    
    const letmeinButton = <ActivityButton showActivity={processing} onPress={doTheThing} text="Let me in!"/>
    const forgotButton = <View>
        <Text style={Styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}>Forgotten Password</Text>
    </View>;
    
    if(forgotPassword){
        buttonContainer =
            <View style={{flexDirection: 'row', height:40}}>
                <View style={{flex: 5}}>
                    {forgotButton}
                </View>
                <View style={{flex: 6}} >
                    {letmeinButton}
                </View>
            </View>;
    }else{
        buttonContainer = <View>{letmeinButton}</View>;
    }
    
    if(credentials){
        if(forLogin){
            return <View>
                <FormError errors={error} />
                <Input
                    containerStyle={{marginBottom: 4}}
                    icon={['fal', 'user']}
                    placeholder="Username or e-mail address"
                    value={username}
                    onChangeText={data => setUsername(data)}
                    enabled={!processing}
                />
                <SecureTextInput icon={['fal', 'key']} placeholder="Password" onChangeText={data => setPassword(data)} value={password} enabled={!processing} />
                <View style={{marginTop: 4}}>
                    { buttonContainer }
                </View>
            </View>;
        }else{
            return <View>
                <Input containerStyle={{marginBottom: 4}} icon={['fal', 'user']} placeholder="Username" value={username} onChangeText={data => setUsername(data)} enabled={!processing} />
                <SecureTextInput icon={['fal', 'key']} placeholder="Password" onChangeText={data => setPassword(data)} validateInput={() => validatePassword()} enabled={!processing} />
                <Input containerStyle={{marginTop: 4}} icon={['fal', 'envelope']} placeholder="E-mail" value={email} onChangeText={data => setEmail(data)} enabled={!processing} />
                <FormError errors={error} />
                <View style={{marginTop: 4}}>
                    { buttonContainer }
                </View>
            </View>;
        }
    }
    
    return null;
};

export default CredentialInput;
