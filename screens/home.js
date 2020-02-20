import React, {Component, useContext} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Chat } from './chat'
import { NavigationContext } from '../context/NavigationContext';
import withNavigationContext from '../hoc/withNavigationContext';

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#121211',
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 24 : 0
    }
});

class Home extends Component {
    navigation = null;
    addDrawerItem = (id, item) => {};

    state = {
        headerIcons: []
    };

    constructor(props) {
        super();
        this.navigation = props.navigation;
        this.addDrawerItem = props.navigationContext.addDrawerItem;
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
          <View style={styles.header}>
            <View>
                <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                    <View style={{verticalAlign:'center', paddingLeft: 10, paddingRight: 5}}>
                        <FontAwesomeIcon icon={['fal', 'bars']} style={{color: '#ffffff'}} size={18} onPress={() => {this.navigation.openDrawer()}}/>
                    </View>
                    <Text style={{textAlign: 'left', color: '#fff', fontSize: 26, padding: 10, flex: 1}}>SoSa</Text>
                    { icons }
                </View>
            </View>

            <Chat addHeaderIcon={this.addHeaderIcon} addDrawerItem={this.addDrawerItem} />

          </View>
        );
  }
}

const HomeScreen = withNavigationContext(Home);
export default HomeScreen;
