import React, {useState} from 'react';
import {Image, ImageBackground, Text, View, TouchableHighlight} from "react-native";

import {StyleSheet} from 'react-native';
import {ActivityButton} from "../ActivityButton";

const Styles = StyleSheet.create({

});

export const MeetupItem = ({meetup, onChange}) =>{

    let hasAttendees = false;
    if(meetup.attendees && meetup.attendees.length) hasAttendees = true;

    const [getSaving, setSaving] = useState(false);

    const toggleGoing = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            meetup.going = !meetup.going;

            if(meetup.going && !hasAttendees){
                meetup.attendees = [ {picture: 'https://picsum.photos/seed/picsum/300/300'} ];
            }

            if(!meetup.going && hasAttendees && meetup.attendees.length === 1){
                meetup.attendees = [];
            }

            if(onChange){
                onChange(meetup);
            }

        }, 500);
    };

    const nth = function(d) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    }

    const dateTime = new Date(meetup.start_timestamp * 1000);
    const wd = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(dateTime);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dateTime);
    const mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(dateTime);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dateTime);

    const attendees = meetup.attendees.map((attendee) => {
        return <View style={{justifyContent:'center'}}><Image source={{uri : attendee.picture}} style={{width: 36, height: 36, borderRadius: 36/2, borderWidth: 0.25, borderColor:'#121111'}}  /></View>
    });

    return  <View style={{flex:1, margin:16}}>
        <ImageBackground source={{uri : meetup.picture}} style={{width: '100%', height: 175, flex:1}} imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <View style={{backgroundColor: 'rgba(0,0,0,0.7)', position:'absolute', top:0, left: 0, height:175, width:'100%', borderTopLeftRadius: 8, borderTopRightRadius: 8}} />
            <View style={{flex: 1, justifyContent:'flex-start'}}>
                <View style={{marginTop: 8, marginHorizontal: 8}}>
                    <Text style={{color:'#fff', fontSize: 22, fontWeight:'bold'}}>{meetup.title}</Text>
                    <Text style={{color:'#ccc', textAlignVertical:'center', fontWeight:'bold'}}>{`${wd}, ${da}${nth(da)} ${mo} ${ye}` }</Text>
                </View>
            </View>
            <View style={{flex: 1, justifyContent:'flex-end'}}>
                { hasAttendees &&
                <View style={{flexDirection:'row', marginBottom: 16, marginHorizontal: 8}}>
                    { attendees }
                </View>}
            </View>

        </ImageBackground>
        <View style={{flexDirection:'row', paddingVertical:8}}>
            <View style={{flex: 1, justifyContent:'center'}}>
                <TouchableHighlight>
                    <Text style={{textAlign:'center', color:'#fff'}}>Tell me more</Text>
                </TouchableHighlight>
            </View>
            <View style={{flex:1}}>
                <ActivityButton text={meetup.going ? 'Not Going' : (hasAttendees ? 'Going' : 'Be the first to go!')} style={{flex:1}} showActivity={getSaving} onPress={toggleGoing} style={meetup.going ? {backgroundColor:'red'} : {}}/>
            </View>
        </View>
    </View>

}
