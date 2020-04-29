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

const Drawer = createDrawerNavigator();

export default class MembersWrapper extends Component {

    topNavigation = null;
    state = {
        drawerItems:[]
    };

    constructor(props) {
        super();
        this.topNavigation = props.navigation;
    }

    componentDidMount(): void {

        this.addDrawerItem('logout', (<View style={{flex:1}} key={'logout'}>
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

    CustomDrawerContent = (props) => {
        let items = this.state.drawerItems.map((item) => {
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

    addDrawerItem = (id, view) => {
        let items = this.state.drawerItems;

        let found = false;
        items.forEach((item, index) => {
            if(item.id === id){
                found = true;
                item.view = view;
            }
        });

        if(!found) {
            items.push({id: id, view: view});
        }

        this.setState({drawerItems: items});
    };

    render() {

        return (
            <NavigationContext.Provider value={{
                addDrawerItem: this.addDrawerItem
            }}
            >
                <NavigationContainer independent={true}>
                        <Drawer.Navigator drawerContent={props => this.CustomDrawerContent(props)}>
                            <Drawer.Screen name="Home" component={HomeScreen}/>
                        </Drawer.Navigator>
                </NavigationContainer>
            </NavigationContext.Provider>
        );
  }
}
