import React, {Component} from 'react';
import {Text, View, Switch} from 'react-native';
import {SettingsItem} from "../components/SettingsItem";

class SettingsScreen extends Component {
    navigation = null;
    navigationContext = {};

    constructor(props) {
        super();
        this.navigation = props.navigation;
        this.navigationContext = props.navigationContext;
    }

    render() {

        return (
          <View>
                <SettingsItem title="Show Profile On Touch" description="Pressing a members face in chat will show their profile instead of tagging them " settingName="chat:touch_face_for_profile" />
          </View>
        );
  }
}

export default SettingsScreen;
