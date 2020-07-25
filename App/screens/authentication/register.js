import {SoSaConfig} from "../../sosa/config";

import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/onboarding'

import {Linking, Text, View} from 'react-native';
import Helpers from "../../sosa/Helpers";

import SecureTextInput from "../../components/SecureTextInput";
import {IconTextInput} from "../../components/IconTextInput";
import {ActivityButton} from "../../components/ActivityButton";
import {FormError} from "../../components/FormError";

import {SocialButton} from "../../components/SocialButton";
import withAppContext from "../hoc/withAppContext";

class Register extends Component {
    navigation = null;

    state = {
        usernameInput:'',
        passwordInput:'',
        emailInput:'',
        registering: false,
        registerError:'',
        passwordError: '',
        socialMediaError: ''
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;

        if(props.appContext){
            this.addDeeplinkListener = props.appContext.addDeeplinkListener;
            this.removeDeeplinkListener = props.appContext.removeDeeplinkListener;
        }
    }

    componentDidMount(): void {
        this.addDeeplinkListener('login', 'preauth', (data) => {
            if(data.status === 'success'){
                Helpers.deviceLogin(data.device_id, () => {},
                    (error) => {
                        this.setState({'socialMediaError': error});
                    },
                    (json) => {
                        this.setState({'socialMediaError': ''});
                        this.navigation.replace('MembersArea', {login: true});
                    }
                );
            }else{
                this.setState({'socialMediaError': data.error});
            }
        }, true);
    }


    setLoading = (isLoading) => {
        this.setState({registering: isLoading});
    };

    validatePassword = () => {
        try{
            if(Helpers.validatePassword(this.state.passwordInput) === false){
                return null;
            }
        }catch (e) {
            return e.message;
        }
        return '';
    };

    CredentialRegister = () => {

        if(SoSaConfig.features.register.credentials){
            let register = () => {
                if(!this.state.usernameInput.length || !this.state.passwordInput.length || !this.state.emailInput.length){
                    this.setState({registerError: 'Please provide a username, e-mail address and password', registering: false});
                }else{
                    Helpers.handleRegister(
                        this.state.usernameInput,
                        this.state.passwordInput,
                        this.state.emailInput,
                        (isLoading) => this.setState({registering: isLoading}),
                        (error) => this.setState({registerError: error}),
                        (json) => {
                            this.navigation.replace('MembersArea', {register: true});
                        }
                    );
                }
            };

            return <View>
                <FormError errorState={this.state.registerError} />

                <IconTextInput icon={['fal', 'user']} placeholder="Username" value={this.state.usernameInput} onChangeText={data => this.setState({ usernameInput: data})} />
                <IconTextInput icon={['fal', 'envelope']} placeholder="E-mail" value={this.state.emailInput} onChangeText={data => this.setState({ emailInput: data})} />

                <FormError errorState={this.state.passwordError} />
                <SecureTextInput placeholder="Choose a password" onChangeText={data => this.setState({ passwordInput: data})} validateInput={() => this.validatePassword()} />

                <View style={{height:40}}>
                    <ActivityButton showActivity={this.state.registering} onPress={register} text="Let me in!" />
                </View>
            </View>
        }

        return null;
    };

    SocialRegister = () => {

        if(SoSaConfig.features.register.imgur || SoSaConfig.features.register.reddit){
            let register = (network) => {
                this.setState({'socialMediaError': ''});
                Helpers.handlePreauth(() => {
                }, () => {
                }, (json) => {
                    Linking.openURL(`${SoSaConfig.auth.server}/${network}/register?app=1&preauth=${json.response}`);
                })
            };

            let onboardingPath = '../../assets/onboarding/';

            let imgurButton = <SocialButton onPress={() => register('imgur')} icon={require(`${onboardingPath}imgur_icon.png`)} />;
            let redditButton = <SocialButton onPress={() => register('reddit')} icon={require(`${onboardingPath}reddit_icon.png`)} />
            let twitterButton = <SocialButton onPress={() => register('twitter')} icon={require(`${onboardingPath}twitter_icon.png`)} />
            let facebookButton = <SocialButton onPress={() => register('facebook')} icon={require(`${onboardingPath}facebook_icon.png`)} />

            return <View>
                <Text style={[Styles.subheader, {marginTop: 40}]}>Join using another platform</Text>
                <FormError errorState={this.state.socialMediaError} />
                <View style={{marginTop: 20, flexDirection:'row', justifyContent: 'center'}}>
                    {SoSaConfig.features.register.imgur ? imgurButton : null}
                    {SoSaConfig.features.register.reddit ? redditButton : null}
                    {SoSaConfig.features.register.twitter ? twitterButton : null}
                    {SoSaConfig.features.register.facebook ? facebookButton : null}
                </View>
            </View>;
        }
        return null;
    };

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{paddingHorizontal:30, justifyContent:'center'}}>
                    <View style={Styles.content_container}>
                        <this.CredentialRegister />
                        <this.SocialRegister />
                    </View>

                </View>
            </View>
        );
  }
}


const RegistrationScreen = withAppContext(Register);
export default RegistrationScreen;
