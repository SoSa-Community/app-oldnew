import React, {Component} from 'react';
import HomeScreen from './home';
import {Button, View, Alert} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { NavigationContext } from './context/NavigationContext';

import {
    createDrawerNavigator,
    DrawerContentScrollView
} from '@react-navigation/drawer';
import Session from "../sosa/Session";
import Helpers from "../sosa/Helpers";

const DrawerL = createDrawerNavigator();
const DrawerR = createDrawerNavigator();

export default class MembersWrapper extends Component {

    topNavigation = null;
    state = {
        leftDrawerItems:[],
        rightDrawerItems:[]
    };

    constructor(props) {
        super();
        this.topNavigation = props.navigation;
    }

    componentDidMount(): void {

        this.updateDrawerItem('logout', (<View style={{flex:1}} key={'logout'}>
            <Button
                color='#dc3545'
                title='Logout'
                onPress={() => {
                    Alert.alert(
                        "Are you sure?",
                        "Are you sure you want to logout?",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "OK",
                                onPress: () => {
                                    Helpers.logout(() => {
                                        let session = Session.getInstance();
                                        session.logout(() => {
                                            this.topNavigation.replace('Login', {logout: true})
                                        });

                                    });
                                }
                            }
                        ],
                        { cancelable: true }
                    );
                }}
                style={{justifyContent:'flex-end'}}
            />
        </View>));
    }

    CustomDrawerContent = (props, state) => {
        let items = state.map((item) => {
            if(item.view !== null){
                return (item.view);
            }
        });

        return (
            <DrawerContentScrollView {...props}>
                <View style={{flex:1}}>
                    { items }
                </View>
            </DrawerContentScrollView>
        );
    };

    updateDrawerItem = (id, view, right, remove) => {
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
            items.push({id: id, view: view});
        }

        this.setState({state: items});
    };

    addDrawerItem = (id, view, right) => {
        this.updateDrawerItem(id, view, right);
    }

    removeDrawerItem = (id, right) => {
        this.updateDrawerItem(id, null, right, true);
    }

    RightDrawer = () => {
        return (
            <DrawerR.Navigator drawerContent={props => this.CustomDrawerContent(props, this.state.rightDrawerItems)} drawerPosition="right">
                <DrawerR.Screen name="Home" component={HomeScreen}/>
            </DrawerR.Navigator>
        );
    }

    render() {

        return (
            <NavigationContext.Provider value={{
                addDrawerItem: this.addDrawerItem,
                removeDrawerItem: this.removeDrawerItem
            }}
            >
                <NavigationContainer independent={true}>
                    <DrawerL.Navigator drawerContent={props => this.CustomDrawerContent(props, this.state.leftDrawerItems)} drawerPosition="left">
                        <DrawerL.Screen name="RightDrawer" component={this.RightDrawer}/>
                    </DrawerL.Navigator>
                </NavigationContainer>
            </NavigationContext.Provider>
        );
  }



}
