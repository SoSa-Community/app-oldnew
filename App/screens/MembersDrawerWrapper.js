import React, {Component} from 'react';
import {View, Alert, Platform, Text, ScrollView} from 'react-native';

import { NavigationContainer} from '@react-navigation/native';
import { DrawerNavigationContext } from './context/DrawerNavigationContext';

import MembersNavigator from './MembersNavigator';

import {createDrawerNavigator, DrawerContentScrollView} from '@react-navigation/drawer';
import withAppContext from "./hoc/withAppContext";

const DrawerL = createDrawerNavigator();
const DrawerR = createDrawerNavigator();

class MembersDrawerWrapper extends Component {
    appNavigation = null;
    appContext = null;
    
    state = {
        leftDrawerItems:[],
        rightDrawerItems:[],
        headerIcons: [],
        allowLeftSwipe: true,
        allowRightSwipe: true,
    };

    constructor(props) {
        super();
        this.appNavigation = props.navigation;
        this.appContext = props.appContext;
    }
    
    allowLeftSwipe = (allowLeftSwipe) => {
        this.setState({allowLeftSwipe});
    };
    
    allowRightSwipe = (allowRightSwipe) => {
        this.setState({allowRightSwipe});
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
            <TagName {...props} style={{flex: 1, backgroundColor: '#444442',paddingTop:(Platform.OS === 'ios' ? 32 : 0)}}>
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
                <DrawerR.Navigator drawerContent={props => this.CustomDrawerContent(props, this.state.rightDrawerItems, true)} drawerPosition="right" drawerType="slide" edgeWidth={38} screenOptions={{gestureEnabled: this.state.allowRightSwipe}}>
                    <DrawerR.Screen name="LoggedInNavigationWrapper" component={MembersNavigator}/>
                </DrawerR.Navigator>
            </View>
        );
    }

    render() {

        return (
            <DrawerNavigationContext.Provider value={{
                appNavigation: this.appNavigation,
                appContext: this.appContext,
                allowLeftSwipe: this.allowLeftSwipe,
                allowRightSwipe: this.allowRightSwipe,
                addDrawerItem: this.addDrawerItem,
                updateDrawerItem: this.updateDrawerItem,
                removeDrawerItem: this.removeDrawerItem,
            }}
            >
                <NavigationContainer independent={true} >
                    <DrawerL.Navigator drawerContent={props => this.CustomDrawerContent(props, this.state.leftDrawerItems, false)} drawerPosition="left" drawerType="slide" edgeWidth={38} screenOptions={{gestureEnabled: this.state.allowLeftSwipe}} >
                        <DrawerL.Screen name="RightDrawer" component={this.RightDrawer} />
                    </DrawerL.Navigator>
                </NavigationContainer>
            </DrawerNavigationContext.Provider>
        );
  }
}

const MembersArea = withAppContext(MembersDrawerWrapper);
export default MembersArea;

