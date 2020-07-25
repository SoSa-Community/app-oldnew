import React, {Component} from 'react';
import {Button, View} from 'react-native';

import BaseStyles from "./styles/base";

import withDrawerNavigationContext from './hoc/withDrawerNavigationContext';
import {MembersNavigationContext} from "./context/MembersNavigationContext";


import MembersAreaNavigationHeader from "../components/MembersAreaNavigationHeader";
import ChatScreen from "./chat";

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

class WrapperComponent extends Component {
    appNavigation = null;
    drawerNavigation = null;
    navigationContext = {};
    topBar = null;

    state = {
        headerIcons: []
    }

    constructor(props) {
        super();
        this.drawerNavigation = props.navigation;
        this.navigationContext = props.navigationContext;
        this.appNavigation = this.navigationContext.appNavigation;
        this.topBar = React.createRef();
    }

    showSettings = () => {
        this.appNavigation.navigate('Settings');
        setTimeout(() => {
            this.drawerNavigation.dangerouslyGetParent().closeDrawer();
        },1000);
    };

    componentDidMount(): void {
        this.navigationContext.updateDrawerItem('logout', (<View style={{justifyContent: 'flex-end', flexDirection:'row'}} key={'logout'}>
            <Button color='#dc3545' title='Settings' onPress={this.showSettings} style={{flex:1}}/>
            <Button color='#dc3545' title='Logout' onPress={this.navigationContext.logout}  style={{flex:1}}/>
        </View>),false, true);
    }

    addHeaderIcon = (id, icon, onPress) => {this.topBar.current.addHeaderIcon(id, icon, onPress);};

    render() {

        return (
            <MembersNavigationContext.Provider value={{
                addHeaderIcon: this.addHeaderIcon,
                drawerNavigation: this.drawerNavigation,
                drawerNavigationContext: this.navigationContext
            }}
            >
                <View style={BaseStyles.container} >
                    <MembersAreaNavigationHeader drawerNavigation={this.drawerNavigation} icons={this.state.headerIcons} ref={this.topBar}/>
                    <NavigationContainer independent={true}>
                        <Stack.Navigator>
                            <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }}/>
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </MembersNavigationContext.Provider>
        );
  }
}

const MembersNavigator = withDrawerNavigationContext(WrapperComponent);
export default MembersNavigator;
