import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { Platform, View } from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';

const DrawerMenu = forwardRef(({ scrollable, ...props }, ref) => {
    const [ drawerItems, setDrawerItems ] = useState([]);
    
    useImperativeHandle(ref, () => ({
        update(id, view, bottom, mode){
            const items = drawerItems;
            
            let update = false;
            let found = false;
            
            items.forEach((item, index) => {
                if(item.id === id){
                    found = true;
                    if(mode === 'remove') {
                        delete items[index];
                        update = true;
                    }else if(mode !== 'add'){
                        item.view = view;
                        update = true;
                    }
                }
            });
            
            const updateState = () => setDrawerItems(items)
            
            if(!found && mode !== 'remove') {
                items.push({id: id, view: view, bottom: bottom});
                update = true;
            }
            if(update) updateState();
        },
        add(id, view, bottom){
            this.update(id, view, bottom, 'add');
        },
        remove(id, bottom){
            this.update(id, null, bottom,'remove');
        }
    }))
    
    
    let items = [];
    let bottomItems = [];
    
    drawerItems.forEach((item) => {
        if(item.view !== null) {
            if(item.bottom) bottomItems.push(item.view);
            else items.push(item.view);
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
});

export default DrawerMenu;
