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
                <SettingsItem title="Hide Profile Picture on Comments" description="Some people prefer this, especially useful on smaller screens" settingName="comments:hide_profile_picture" />
                <SettingsItem title="Show Slim Chat Messages" description="Are messages too thicc for your screen? this will sort you out!" settingName="chat:show_slim" />
                <SettingsItem title="Show separators between chat messages" description="Some people like separators, some people don't" settingName="chat:show_separators" />

          </View>
        );
  }
}

export default SettingsScreen;
