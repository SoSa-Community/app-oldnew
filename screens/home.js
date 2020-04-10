import React, {Component, useContext} from 'react';
import {Text, View} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import withNavigationContext from './hoc/withNavigationContext';
import { Chat } from './chat';

import BaseStyles from "./styles/base";

class Home extends Component {
    navigation = null;
    navigationContext = {};

    state = {
        headerIcons: [],
        loginURL: '',
        loginModalVisible: false
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;
        this.navigationContext = props.navigationContext;
    }

    addHeaderIcon = (id, icon, onPress) => {
        let icons = this.state.headerIcons;
        let found = false;

        icons.forEach((item, index) => {
            if(item.id === id){
                found = true;
                item.icon = icon;
                item.onPress = onPress;
            }
        });

        if(!found){
            icons.push({
                id: id,
                icon: icon,
                onPress: onPress
            });
        }

        this.setState({headerIcons: icons});
    };


    render() {

        let icons = this.state.headerIcons.map((item, i) => {
           return (<View style={{verticalAlign:'center', padding: 10}} key={item.id}>
                       <FontAwesomeIcon icon={item.icon} style={{color: '#ffffff'}} size={34} onPress={item.onPress}/>
                   </View>);
        });

        return (
          <View style={BaseStyles.container}>
            <View style={{paddingVertical:5}}>
                <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                    <View style={{verticalAlign:'center', paddingLeft: 10, paddingRight: 5}}>
                        <FontAwesomeIcon icon={['fal', 'bars']} style={{color: '#ffffff'}} size={18} onPress={() => {this.navigation.openDrawer()}}/>
                    </View>
                    <Text style={BaseStyles.headerTitle}>SoSa</Text>
                    { icons }
                </View>
            </View>
            <Chat homeContext={this} navigationContext={this.navigationContext} navigation={this.navigation}/>
          </View>
        );
  }
}

const HomeScreen = withNavigationContext(Home);
export default HomeScreen;
