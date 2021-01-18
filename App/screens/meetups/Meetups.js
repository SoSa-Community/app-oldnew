import React, {useContext, useEffect, useState} from 'react';
import {
    FlatList,
    View,
} from 'react-native';

import {MembersNavigationContext} from "../context/MembersNavigationContext";
import MeetupItem from "../../components/meetups/MeetupItem";
import { useFocusEffect } from '@react-navigation/native';

const MeetupsScreen = ({navigation}) => {
    
    const membersNavigationContext = useContext(MembersNavigationContext);
    
    const { addHeaderIcon, removeHeaderIcon, drawerNavigationContext } = membersNavigationContext;
    const { appContext } = drawerNavigationContext;
    const { apiClient } = appContext;
    
    const [meetups, setMeetups] = useState([]);
    const { services: { meetups: meetupService } } = apiClient;
    
    const { navigate } = navigation;
    
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            
            if(isActive){
                addHeaderIcon('create_meetup', ['fal', 'plus'], () => {
                    navigate('CreateMeetup')
                });
                
                meetupService.search('sosa')
                    .then((records) => {
                        records.sort((meetup1, meetup2) => meetup2.created.getTime() - meetup1.created.getTime());
                        setMeetups(records);
                    })
                    .catch(errors => console.debug(errors));
            }
            return () => {
                removeHeaderIcon('create_meetup');
                isActive = false;
            }
        }, [])
    );
    
    
    return (
        <View style={{flex:1}}>
            <FlatList
                data={meetups}
                extraData={meetups}
                keyExtractor={(item) => item.id.toString()}
                renderItem={
                    ({item, index}) => {
                        return <MeetupItem key={item.id} meetup={item} onChange={(meetup) => {
                            const ogState = [...meetups];
                            ogState[index] = meetup;
                            setMeetups(ogState);
                        }} onTellMeMorePress={() => navigate('Meetup', {id: item.id})} />;
                    }
                }
                style={{flex: 1, backgroundColor: '#121111'}}
            />
        </View>
    );
};

export default MeetupsScreen;
