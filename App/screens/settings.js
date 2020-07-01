import React, {Component} from 'react';
import {Text, View, Switch} from 'react-native';
import {SettingsItem} from "../components/SettingsItem";

class SettingsScreen extends Component {
    navigation = null;
    navigationContext = {};

    state = {
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;
        this.navigationContext = props.navigationContext;
    }

    render() {

        return (
          <View>
                <SettingsItem title="Fireworks when you send a message" description="Every time you send a message, it will display fireworks" settingName="send_message_fireworks" />
          </View>
        );
  }
}

export default SettingsScreen;
