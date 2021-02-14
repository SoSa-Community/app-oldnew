import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Keyboard, Text, View, StyleSheet, BackHandler } from "react-native";

import PropTypes from "prop-types";

import IconButton from "./IconButton";
import BaseStyles from "../screens/styles/base";
import {useAuthenticatedNavigation} from '../context/AuthenticatedNavigationContext';

let menuStack = [];

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

const NavigationHeader = forwardRef((
    { onBack, ...props },
    ref
) =>
{
    let leftMenu = null;
    let rightMenu = null;
    
    const menuDefaults = {
        title: 'SoSa',
        leftMode: 'menu',
        showLeft: true,
        showRight: true
    };
    menuStack = [menuDefaults];
    
    const { toggleSwipe, openLeftDrawer, getStackNavigator } = useAuthenticatedNavigation();
    
    const [ headerIcons, setHeaderIcons ] = useState([]);
    const [ preferences, setPreferences ] = useState({});
    const [ showTopBar, setShowTopBar ] = useState(true);
    const [ menu, setMenu ] = useState(menuDefaults);
    
    const popMenuStack = () => {
        let newState = menuDefaults;
        if(menuStack.length > 1){
            menuStack.pop();
            newState = menuStack[menuStack.length - 1];
        }
        if(newState.leftMode === 'back') toggleSwipe(false);
        else toggleSwipe(true);
        
        setMenu(newState);
    };
    
    useEffect(() => {
            BackHandler.addEventListener('hardwareBackPress', popMenuStack);
            return () => BackHandler.removeEventListener('hardwareBackPress', popMenuStack);
    }, [popMenuStack]);
    
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
        },
    
        setMenuOptions(options, justUpdate, resetOnBack) {
            let currentState = {...menu};
            let updateState = false;
            
            for(let key in options){
                let option = options[key];
                if(currentState.hasOwnProperty(key) && currentState[key] !== option){
                    updateState = true;
                    currentState[key] = option;
                }
            }
            if(updateState) setMenu(currentState);
        
            if(currentState.leftMode === 'back') toggleSwipe(false);
            else toggleSwipe(true);
        
            if(!justUpdate) menuStack.push(currentState);
        }
    }))
    
    if(!showTopBar) return <></>;
    
    const {title, leftMode, showLeft, showRight} = menu;
    if(showLeft){
        let menuIcon = null;
        if(leftMode === 'back'){
            menuIcon = <IconButton icon={['fal', 'chevron-left']} style={{color: '#CCC'}} size={22} onPress={() => {
                if(typeof(onBack) === 'function') {
                    try {
                        onBack();
                    } catch (e) {
                        console.debug('Go Back Went Wrong', e);
                    }
                }
                popMenuStack();
                getStackNavigator()?.current?.goBack();
            }}/>
        }else{
            menuIcon = <IconButton icon={['fal', 'bars']} style={{color: '#CCC'}} size={22} onPress={() => {
                Keyboard.dismiss();
                openLeftDrawer();
            }}/>;
        }
        leftMenu = <View style={Styles.menuTopLeft}>{menuIcon}</View>;
    }

    if(showRight) {
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

NavigationHeader.propTypes = {
    onBack: PropTypes.func,
    icons: PropTypes.array,
};

NavigationHeader.defaultProps = {
    onBack: null,
    icons: []
};

export default NavigationHeader;
