import React, {Component} from 'react';
import {
    FlatList,
    View,
    Button,
} from 'react-native';

import withMembersNavigationContext from "../hoc/withMembersNavigationContext";
import {MeetupItem} from "../../components/meetups/MeetupItem";
import { useFocusEffect } from '@react-navigation/native';


function FocusComponent({addHeaderIcon, removeHeaderIcon}) {
    useFocusEffect(
        React.useCallback(() => {
            addHeaderIcon('create_meetup', ['fal', 'plus'], () => this.navigation.navigate('CreateMeetup'));
            
            return () => removeHeaderIcon('create_meetup');
        }, [])
    );
    return null;
}

export class Meetups extends Component {
    drawerNavigationContext = {};
    navigationContext = {};

    navigation = {};
    drawerNavigation = {};
    
    apiClient = null;

    state = {
        meetups: []
    };

    constructor(props) {
        super();

        this.navigation = props.navigation;
        this.navigationContext = props.navigationContext;
        this.drawerNavigation = this.navigationContext.drawerNavigation;
        this.drawerNavigationContext = props.navigationContext.drawerNavigationContext;
    
        const {appContext} = this.drawerNavigationContext;
        const {apiClient} = appContext;
        this.apiClient = apiClient;
    }
    
    componentDidMount(){
        const { apiClient: { services: { meetups } } } = this;
        meetups.search('sosa').then((meetups) => {
            this.setState({meetups});
        }).catch((errors) => {
            console.debug(errors);
        })
    }
    
    render() {

        return (
            <View style={{flex:1}}>
                <FocusComponent addHeaderIcon={this.navigationContext.addHeaderIcon} removeHeaderIcon={this.navigationContext.removeHeaderIcon} />
                <FlatList
                    data={this.state.meetups}
                    extraData={this.state.meetups}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={
                        ({item, index}) => {
                            return <MeetupItem key={item.id} meetup={item} onChange={(meetup) => {
                                let meetups = this.state.meetups;
                                meetups[index] = meetup;
                                this.setState({meetups: meetups});
                            }} onTellMeMorePress={() => this.navigation.navigate('Meetup', {id: item.id})} />;
                        }
                    }
                    style={{flex: 1, backgroundColor: '#121111'}}
                />
            </View>
        );
    }
}

const MeetupsScreen = withMembersNavigationContext(Meetups);
export default MeetupsScreen;
