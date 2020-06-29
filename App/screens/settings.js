import React, {Component} from 'react';
import {Text, View} from 'react-native';


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
            <Text>Hello I am the settings screen</Text>
          </View>
        );
  }
}

export default SettingsScreen;
