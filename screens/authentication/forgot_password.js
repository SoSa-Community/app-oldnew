import React, {Component} from 'react';
import Styles from '../styles/login'
import {TouchableWithoutFeedback, ActivityIndicator, Image, FlatList, Text, TextInput, View} from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import BaseStyles from "../styles/base";
import Helpers from "../../sosa/Helpers";

export default class ForgotPassword extends Component {

    navigation = null;

    state = {
        emailInput:'',
        requesting: false,
        requestError:''
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;
    }

    componentDidMount() {}

    setLoading = (isLoading) => {
        this.setState({requesting: isLoading});
    };

    setError = (error) => {
        this.setState({requestError: error});
    };

    resetPassword = () => {
        this.setLoading(true);
        try{

            Helpers.request('forgot', {
                email: this.state.emailInput
            })
            .then((json) => {
                let error = '';
                console.log(json);
                if(json.error){
                    error = json.error.message;
                    this.setError(error);
                }else{
                    this.navigation.navigate('ForgotPasswordCode', {email: this.state.emailInput});
                }
            })
            .catch((e) => {
                this.setError(e);
            })
            .finally(() => {
                this.setLoading(false);
            });

        }catch(e){
            this.setError(e.message);
            this.setLoading(false);
        }
    };

    displayError = () => {
        return <Text style={Styles.error}>{this.state.requestError}</Text>;
    };

    displayForgotButton = (showActivity=false) => {
        if(showActivity){
            return  <TouchableWithoutFeedback>
                        <View style={[Styles.letMeIn_button, Styles.letMeIn_button_pressed]}>
                            <Text style={Styles.letMeIn_text}>Reset My Password!</Text>
                            <ActivityIndicator size="small" style={this.state.loggingIn ? Styles.letMeIn_activity: null}/>
                        </View>
                    </TouchableWithoutFeedback>;
        }else{
            return  <TouchableWithoutFeedback onPress={this.resetPassword} style={Styles.letMeIn_button}>
                        <View style={[Styles.letMeIn_button]}>
                            <Text style={Styles.letMeIn_text}>Reset My Password!</Text>
                        </View>
                    </TouchableWithoutFeedback>;
        }
    };

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={{paddingHorizontal:30, justifyContent:'center'}}>
                    <Text style={Styles.header}>What's your e-mail?</Text>

                    <View style={Styles.content_container}>
                        {this.state.requestError ? this.displayError() : null}
                        <View style={Styles.inputParentContainer}>
                          <View style={Styles.inputContainer}>
                                <FontAwesomeIcon icon={['fal', 'user']}  style={Styles.inputIcon} size={18}/>
                                <TextInput placeholder="Your e-mail address" placeholderTextColor="#ccc" value={this.state.emailInput} style={Styles.input} onChangeText={data => this.setState({ emailInput: data})}/>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', height:40}}>
                            <View style={{flex: 1}} >
                                {this.state.requesting ? this.displayForgotButton(true) : this.displayForgotButton()}
                            </View>
                        </View>
                    </View>
                </View>
            </View>


        );
  }
}
