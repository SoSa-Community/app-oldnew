import React, {Component} from 'react';

import BaseStyles from '../styles/base'
import Styles from '../styles/login'

import {TouchableWithoutFeedback, ActivityIndicator, Image, FlatList, Text, TextInput, View} from 'react-native';
import Helpers from "../../sosa/Helpers";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import Device from "../../sosa/Device";
import Session from "../../sosa/Session";

export default class Login extends Component {
    navigation = null;

    state = {
        usernameInput:'',
        passwordInput:'',
        loggingIn: false,
        loginError:''
    };

    constructor(props) {
        super();

        console.log(props);
        this.navigation = props.navigation;


        if(props.route && props.route.params){
            if(props.route.params.email){
                this.state.usernameInput = props.route.params.email;
            }
            if(props.route.params.password){
                this.state.passwordInput = props.route.params.password;
            }
        }
    }

    componentDidMount() {

    }

    doLogin = () => {
        let deviceInstance = Device.getInstance();
        let sessionInstance = Session.getInstance();

        this.setState({loggingIn: true});
        try{

            Helpers.request('login', {
                username: this.state.usernameInput,
                password: this.state.passwordInput,
                device_secret: deviceInstance.getSecret(),
                device_name: deviceInstance.getName(),
                device_platform: deviceInstance.getPlatform()
            })
            .then((json) => {
                let error = '';
                if(json.error){error = json.error.message;}
                else{
                    deviceInstance.setId(json.response.device_id);
                    deviceInstance.save();

                    sessionInstance.fromJSON(json.response.session);
                    this.navigation.replace('MembersWrapper', {});
                }
                this.setState({loginError: error});
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                this.setState({loggingIn: false});
            });

        }catch(e){
            this.setState({loggingIn: false});
        }
    };

    loginError = () => {
        return <Text style={Styles.error}>{this.state.loginError}</Text>;
    };

    loginButton = (showActivity=false) => {
        if(showActivity){
            return  <TouchableWithoutFeedback>
                        <View style={[Styles.letMeIn_button, Styles.letMeIn_button_pressed]}>
                            <Text style={Styles.letMeIn_text}>Let me in!</Text>
                            <ActivityIndicator size="small" style={this.state.loggingIn ? Styles.letMeIn_activity: null}/>
                        </View>
                    </TouchableWithoutFeedback>;
        }else{
            return  <TouchableWithoutFeedback onPress={this.doLogin} style={Styles.letMeIn_button}>
                        <View style={[Styles.letMeIn_button]}>
                            <Text style={Styles.letMeIn_text}>Let me in!</Text>
                        </View>
                    </TouchableWithoutFeedback>;
        }
    };

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{paddingHorizontal:30, justifyContent:'center'}}>
                    <Text style={Styles.header}>Login to SoSa</Text>

                    <View style={Styles.content_container}>
                        {this.state.loginError ? this.loginError() : null}
                        <View style={Styles.inputParentContainer}>
                          <View style={Styles.inputContainer}>
                                <FontAwesomeIcon icon={['fal', 'user']}  style={Styles.inputIcon} size={18}/>
                                <TextInput placeholder="Username or e-mail address" placeholderTextColor="#ccc" value={this.state.usernameInput} style={Styles.input} onChangeText={data => this.setState({ usernameInput: data})}/>
                          </View>
                        </View>
                        <View style={Styles.inputParentContainer}>
                          <View style={Styles.inputContainer}>
                                <FontAwesomeIcon icon={['fal', 'key']}  style={Styles.inputIcon} size={18}/>
                                <TextInput placeholder={'Password'} secureTextEntry={true} placeholderTextColor="#ccc" value={this.state.passwordInput} style={Styles.input} onChangeText={data => this.setState({ passwordInput: data})}/>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', height:40}}>
                            <View style={{flex: 5}}>
                                <View>
                                    <Text style={Styles.forgotButton} onPress={() => this.navigation.navigate('ForgotPassword', {})}>Forgotten Password</Text>
                                </View>
                            </View>
                            <View style={{flex: 6}} >
                                {this.state.loggingIn ? this.loginButton(true) : this.loginButton()}
                            </View>
                        </View>
                    </View>
                </View>
            </View>


        );
  }
}
