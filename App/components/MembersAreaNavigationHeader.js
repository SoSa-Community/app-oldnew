import React, {Component} from 'react';
import {Keyboard, Text, View} from "react-native";

import {StyleSheet} from 'react-native';
import {IconButton} from "./IconButton";
import BaseStyles from "../screens/styles/base";

const Styles = StyleSheet.create({
    menuTop: {
        backgroundColor: '#121211',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        paddingTop: Platform.OS === 'ios' ? 32 : 0
    },
    menuTopLeft: {paddingLeft: 7, paddingRight: 5},
    menuTopRight: {paddingRight: 10}
});

export default class MembersAreaNavigationHeader extends Component {
    state = {
        headerIcons: []
    };

    constructor(props) {
        super();
        this.state.headerIcons = props.icons;
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

        let leftMenu = null;
        let rightMenu = null;

        if(this.props.showLeftMenu){
            let menuIcon = null;
            if(this.props.leftMenuMode === 'back'){
                menuIcon = <IconButton icon={['fal', 'chevron-left']} style={{color: '#CCC'}} size={22} onPress={() => {
                    if(typeof(this.props.onBack) === 'function') {
                        try {
                            this.props.onBack();
                        } catch (e) {
                            console.debug('Go Back Went Wrong', e);
                        }
                    }
                    this.props.membersNavigation?.current?.goBack();
                }}/>
            }else{
                menuIcon = <IconButton icon={['fal', 'bars']} style={{color: '#CCC'}} size={22} onPress={() => {
                    Keyboard.dismiss();
                    this.props.drawerNavigation.dangerouslyGetParent().openDrawer()
                }}/>;
            }
            leftMenu = <View style={Styles.menuTopLeft}>{menuIcon}</View>;
        }

        if(this.props.showRightMenu) {
            let icons = this.state.headerIcons.map((item, i) => {
                return (<View style={{verticalAlign:'center'}} key={item.id}>
                    <IconButton icon={item.icon} style={{color: '#CCC'}} activeStyle={{color: '#444442'}} size={30} onPress={item.onPress}/>
                </View>);
            });
            rightMenu = <View style={Styles.menuTopRight}>{icons}</View>;
        }


        return  <View style={Styles.menuTop}>
                    {leftMenu}
                    <Text style={BaseStyles.headerTitle}>{this.props.title}</Text>
                    {rightMenu}
                </View>
    }
}
