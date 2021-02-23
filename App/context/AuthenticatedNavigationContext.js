import React, {
    createContext,
    useContext,
    useState,
    useRef,
    forwardRef,
    useImperativeHandle
} from 'react';
import { View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from '../components/DrawerMenu';
import NavigationHeader from '../components/NavigationHeader';

const AuthenticatedNavigationContext = createContext();
const DrawerL = createDrawerNavigator();
const DrawerR = createDrawerNavigator();

const Drawer = forwardRef(({navigator: Navigator, children, ...props }, ref) => {
    const [canSwipe, setCanSwipe] = useState(true);
    
    useImperativeHandle(ref, () => ({ setCanSwipe }))
    return <Navigator {...props} screenOptions={{gestureEnabled: canSwipe}}>{children}</Navigator>;
});

let stackNavigation = null;
let drawerNavigation = null;

const AuthenticatedNavigationProvider = ({navigator: Navigator, ...props}) => {
   
    const leftDrawer = useRef();
    const rightDrawer = useRef();
    const leftDrawerMenu = useRef();
    const rightDrawerMenu = useRef();
    
    const topBar = useRef();
    
    const setDrawerNavigation = (navigation) => drawerNavigation = navigation;
    const setStackNavigation = (navigation) => stackNavigation = navigation;
    
    const closeLeftDrawer = () => {
        if(drawerNavigation) {
            try{
                drawerNavigation.dangerouslyGetParent().closeDrawer();
            }catch (e) {
                console.debug('Couldn\'t close left drawer');
            }
        }
    }
    
    const closeRightDrawer = () => {
        if(drawerNavigation) {
            try{
                drawerNavigation.closeDrawer();
            }catch (e) {
                console.debug('Couldn\'t close right drawer');
            }
        }
    }
    
    const openLeftDrawer = () => {
        if(drawerNavigation) {
            try{
                drawerNavigation.dangerouslyGetParent().openDrawer();
            }catch (e) {
                console.debug('Couldn\'t close left drawer');
            }
        }
    }
    
    const openRightDrawer = () => {
        if(drawerNavigation) {
            try{
                drawerNavigation.openDrawer();
            }catch (e) {
                console.debug('Couldn\'t close right drawer');
            }
        }
    }
    
    const addHeaderIcon = (id, icon, onPress) => { topBar?.current.addHeaderIcon(id, icon, onPress); };
    const removeHeaderIcon = (id) => { topBar?.current.removeHeaderIcon(id); }
    const setMenuOptions = (options, justUpdate, resetOnBack) => {
        topBar?.current?.setMenuOptions(options, justUpdate, resetOnBack);
    };
    const popMenuStack = () => { topBar?.current.popMenuStack(); }
    
    return (
        <AuthenticatedNavigationContext.Provider value={{
            add: (id, view, right, bottom) => {
                const ref = right ? rightDrawerMenu : leftDrawerMenu;
                ref?.current?.add(id, view, bottom);
            },
            update: (id, view, right, bottom, mode) => {
                const ref = right ? rightDrawerMenu : leftDrawerMenu;
                ref?.current?.update(id, view, bottom, mode);
            },
            remove: (id, view, right, bottom) => {
                const ref = right ? rightDrawerMenu : leftDrawerMenu;
                ref?.current?.remove(id, bottom);
            },
            toggleSwipe: (canSwipe, right) => {
                const ref = right ? rightDrawer : leftDrawer;
                ref?.current?.setCanSwipe(canSwipe);
            },
            openLeftDrawer,
            openRightDrawer,
            closeLeftDrawer,
            closeRightDrawer,
            closeDrawers: () => {
                closeLeftDrawer();
                closeRightDrawer();
            },
            addHeaderIcon,
            removeHeaderIcon,
            popMenuStack,
            setMenuOptions,
            getStackNavigator: () => stackNavigation,
        }}
                                    {...props}
        >
            <NavigationContainer independent={true} >
                <Drawer
                    navigator={DrawerL.Navigator}
                    drawerContent={props => <DrawerMenu {...props} scrollable={false} ref={leftDrawerMenu}/> }
                    drawerPosition="left"
                    drawerType="slide"
                    edgeWidth={38}
                    ref={leftDrawer}
                >
                    <DrawerL.Screen name="RightDrawer">
                        {() =>
                            <View style={{flex:1}}>
                                <Drawer
                                    navigator={DrawerR.Navigator}
                                    drawerContent={props => <DrawerMenu {...props} scrollable ref={rightDrawerMenu} /> }
                                    drawerPosition="right"
                                    drawerType="slide"
                                    edgeWidth={38}
                                    ref={rightDrawer}
                                >
                                    <DrawerR.Screen name="Navigator">
                                        { (props) => {
                                            return <>
                                                <NavigationHeader ref={topBar} />
                                                <Navigator {...props} {...{setStackNavigation, setDrawerNavigation}} />
                                            </>
                                        } }
                                    </DrawerR.Screen>
                                </Drawer>
                            </View>
                       }
                    </DrawerL.Screen>
                </Drawer>
            </NavigationContainer>
        </AuthenticatedNavigationContext.Provider>
    );
};

const useAuthenticatedNavigation = () => useContext(AuthenticatedNavigationContext);

export { AuthenticatedNavigationProvider, useAuthenticatedNavigation };
