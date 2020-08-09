import React, {Component} from 'react';
import {View, Alert, Platform} from 'react-native';

import { NavigationContainer} from '@react-navigation/native';
import { DrawerNavigationContext } from './context/DrawerNavigationContext';

import MembersNavigator from './MembersNavigator';

import {createDrawerNavigator, DrawerContentScrollView} from '@react-navigation/drawer';
import Session from "../sosa/Session";
import Helpers from "../sosa/Helpers";

const DrawerL = createDrawerNavigator();
const DrawerR = createDrawerNavigator();

export default class MembersDrawerWrapper extends Component {
    topBar = null;
    appNavigation = null;

    state = {
        leftDrawerItems:[],
        rightDrawerItems:[],
        headerIcons: [],
    };

    constructor(props) {
        super();
        this.appNavigation = props.navigation;
        this.topBar = React.createRef();
    }

    logout = (sessionAutoExpired) => {
        let clearSession = () => {
            let session = Session.getInstance();
            session.logout(() => {
                this.appNavigation.replace('Login', {logout: true})
            });
        }


        if(sessionAutoExpired === true){
            clearSession();
            Alert.alert("Oooof", "Sorry you were logged out, please login again!",
                [{text: "Sure!",style: "cancel"}],
                { cancelable: true }
            );
        }
        else{
            Alert.alert("Are you sure?", "Are you sure you want to logout?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            Helpers.logout(clearSession);
                        }
                    }
                ],
                { cancelable: true }
            );
        }
    };

    CustomDrawerContent = (props, state, scrollable) => {
        let items = [];
        let bottomItems = [];

        state.forEach((item) => {
            if(item.view !== null) {
                if(item.bottom){
                    bottomItems.push(item.view);
                }else{
                    items.push(item.view);
                }
            }
        });

        const TagName = (!scrollable ? View : DrawerContentScrollView);

        return (
            <TagName {...props} style={{flex: 1, backgroundColor: '#222540'}}>
                    { items }
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom:(Platform.OS === 'ios' ? 24 : 0), alignItems:'center'}}>
                        { bottomItems }
                    </View>
            </TagName>
        );
    };

    updateDrawerItem = (id, view, right, bottom, remove) => {
        let state = 'leftDrawerItems';
        if(right) state = 'rightDrawerItems';

        let items = this.state[state];
        let found = false;
        items.forEach((item, index) => {
            if(item.id === id){
                found = true;
                if(remove) {
                    delete items[index];
                }else{
                    item.view = view;
                }
            }
        });

        if(!found && !remove) {
            items.push({id: id, view: view, bottom: bottom});
        }


        this.setState({state: items});
    };

    addDrawerItem = (id, view, right, bottom) => {
        this.updateDrawerItem(id, view, right, bottom);
    };

    removeDrawerItem = (id, right, bottom) => {
        this.updateDrawerItem(id, null, right, bottom,true);
    };

    RightDrawer = () => {
        return (
            <View style={{flex:1}}>
                <DrawerR.Navigator drawerContent={props => this.CustomDrawerContent(props, this.state.rightDrawerItems, true)} drawerPosition="right" drawerType="slide" edgeWidth={38} ref={this.rightDrawer}>
                    <DrawerR.Screen name="LoggedInNavigationWrapper" component={MembersNavigator}/>
                </DrawerR.Navigator>
            </View>
        );
    }

    render() {

        return (
            <DrawerNavigationContext.Provider value={{
                appNavigation: this.appNavigation,
                addDrawerItem: this.addDrawerItem,
                updateDrawerItem: this.updateDrawerItem,
                removeDrawerItem: this.removeDrawerItem,
                logout: this.logout,
            }}
            >
                <NavigationContainer independent={true} >
                    <DrawerL.Navigator drawerContent={props => this.CustomDrawerContent(props, this.state.leftDrawerItems, false)} drawerPosition="left" drawerType="slide" edgeWidth={38} ref={this.leftDrawer} >
                        <DrawerL.Screen name="RightDrawer" component={this.RightDrawer} />
                    </DrawerL.Navigator>
                </NavigationContainer>
            </DrawerNavigationContext.Provider>
        );
  }



}
