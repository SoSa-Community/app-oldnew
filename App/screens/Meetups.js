import React, {Component} from 'react';
import {
    Image,
    FlatList,
    Text,
    View,
    Button,
    TouchableHighlight,
    TouchableOpacity,
    Linking,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    Modal,
    ImageBackground
} from 'react-native';
import { SoSaConfig } from "../sosa/config";

import withMembersNavigationContext from "./hoc/withMembersNavigationContext";
import {MeetupItem} from "../components/meetups/MeetupItem";

export class Meetups extends Component {
    drawerNavigationContext = {};
    navigationContext = {};

    navigation = {};
    drawerNavigation = {};

    state = {
        meetups: [
            {
                id: 1,
                picture: 'https://secure.meetupstatic.com/photos/event/5/a/e/e/600_490223278.jpeg',
                title: 'Terraria',
                start_timestamp: 1595863949,
                going: false,
                virtual: false,
                attendees: [
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                ]
            },
            {
                id: 2,
                picture: 'https://i.ytimg.com/vi/N7ZafWA2jd8/maxresdefault.jpg',
                title: 'Team Fortress 2',
                virtual: true,
                start_timestamp: 1595863949,
                going: false,
                attendees: [

                ]
            },
            {
                id: 3,
                picture: 'https://steamcdn-a.akamaihd.net/steam/apps/434170/capsule_616x353.jpg?t=1581354185',
                title: 'Jackbox Party',
                virtual: false,
                start_timestamp: 1595863949,
                going: false,
                attendees: [
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`}
                ]
            },
        ]
    };

    constructor(props) {
        super();

        this.navigation = props.navigation;
        this.navigationContext = props.navigationContext;
        this.drawerNavigation = this.navigationContext.drawerNavigation;
        this.drawerNavigationContext = props.navigationContext.drawerNavigationContext;
    }

    render() {

        return (
            <View style={{flex:1}}>
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
                            }} onTellMeMorePress={() => this.navigation.navigate('Meetup')}/>;
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
