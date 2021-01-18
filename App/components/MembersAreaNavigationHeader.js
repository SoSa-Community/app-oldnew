import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Keyboard, Text, View, StyleSheet, BackHandler } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import PropTypes from "prop-types";

import IconButton from "./IconButton";
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
    menuTopRight: {paddingRight: 10, flex:0, flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end'}
});

const MembersAreaNavigationHeader = forwardRef((
    { title, onBack, icons, showLeftMenu, leftMenuMode, showRightMenu, membersNavigation, drawerNavigation },
    ref
) =>
{
    let leftMenu = null;
    let rightMenu = null;
    
    const [headerIcons, setHeaderIcons] = useState(icons);
    
    useImperativeHandle(ref, () => ({
        
        addHeaderIcon(id, icon, onPress){
            let icons = [...headerIcons];
            let found = false;
        
            icons.forEach((item, index) => {
                if(item.id === id){
                    found = true;
                    item.icon = icon;
                    item.onPress = onPress;
                }
            });
        
            if(!found){
                icons.unshift({
                    id: id,
                    icon: icon,
                    onPress: onPress
                });
            }
        
            setHeaderIcons(icons);
        },
        removeHeaderIcon(id) {
            setHeaderIcons(headerIcons.filter(item => (item.id !== id)));
        }
    }))
    
    if(showLeftMenu){
        let menuIcon = null;
        if(leftMenuMode === 'back'){
            if(onBack) {
                useFocusEffect(
                    React.useCallback(() => {
                        BackHandler.addEventListener('hardwareBackPress', onBack);
                        return () => BackHandler.removeEventListener('hardwareBackPress', onBack);
                    }, [])
                );
            }
            
            menuIcon = <IconButton icon={['fal', 'chevron-left']} style={{color: '#CCC'}} size={22} onPress={() => {
                if(typeof(onBack) === 'function') {
                    try {
                        onBack();
                    } catch (e) {
                        console.debug('Go Back Went Wrong', e);
                    }
                }
                membersNavigation?.current?.goBack();
            }}/>
        }else{
            menuIcon = <IconButton icon={['fal', 'bars']} style={{color: '#CCC'}} size={22} onPress={() => {
                Keyboard.dismiss();
                drawerNavigation.dangerouslyGetParent().openDrawer()
            }}/>;
        }
        leftMenu = <View style={Styles.menuTopLeft}>{menuIcon}</View>;
    }

    if(showRightMenu) {
        let icons = headerIcons.map((item, i) => {
            return (<View style={{verticalAlign:'center', marginLeft: 10}} key={item.id}>
                <IconButton icon={item.icon} style={{color: '#CCC'}} activeStyle={{color: '#444442'}} size={30} onPress={item.onPress}/>
            </View>);
        });
        rightMenu = <View style={Styles.menuTopRight}>{icons}</View>;
    }

    return  <View style={Styles.menuTop}>
                {leftMenu}
                <Text style={BaseStyles.headerTitle}>{title}</Text>
                {rightMenu}
            </View>
 
});

MembersAreaNavigationHeader.propTypes = {
    title: PropTypes.string,
    onBack: PropTypes.func,
    icons: PropTypes.array,
    showLeftMenu: PropTypes.bool,
    leftMenuMode: PropTypes.oneOf(['back', 'menu']),
    showRightMenu: PropTypes.bool,
    membersNavigation: PropTypes.object,
    drawerNavigation: PropTypes.object
};

MembersAreaNavigationHeader.defaultProps = {
    title: '',
    onBack: null,
    icons: [],
    showLeftMenu: false,
    leftMenuMode: 'menu',
    showRightMenu: false,
    membersNavigation: {},
    drawerNavigation: {}
};

export default MembersAreaNavigationHeader;
