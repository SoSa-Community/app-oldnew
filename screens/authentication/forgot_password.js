import React, {Component} from 'react';
import Styles from '../styles/onboarding'
import {Text, View} from 'react-native';

import BaseStyles from "../styles/base";
import Helpers from "../../sosa/Helpers";
import IconTextInput from "../../components/IconTextInput";
import ActivityButton from "../../components/ActivityButton";
import FormError from "../../components/FormError";

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

    render() {
        return (
            <View style={BaseStyles.container}>
                <View style={Styles.formContainer}>
                    <Text style={Styles.header}>What's your e-mail?</Text>

                    <View style={Styles.content_container}>
                        <FormError errorState={this.state.requestError} />
                        <IconTextInput icon={['fal', 'envelope']} placeholder="Your e-mail address" value={this.state.emailInput} onChangeText={data => this.setState({ emailInput: data})} />
                        <ActivityButton showActivity={this.state.requesting} onPress={this.resetPassword} text="Reset My Password!"/>
                    </View>
                </View>
            </View>


        );
  }
}
