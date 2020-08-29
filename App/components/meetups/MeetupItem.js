import React, {useState} from 'react';
import {Image, ImageBackground, Text, View, TouchableHighlight} from "react-native";

import {StyleSheet} from 'react-native';
import {ActivityButton} from "../ActivityButton";
import {Icon} from "../Icon";

const Styles = StyleSheet.create({
    container: {flex:1, margin:16},
    attendeeImageContainer: {
        justifyContent:'center',
        marginRight:-18
    },
    attendeeImage: {width: 36, height: 36, borderRadius: 36/2, borderWidth: 0.25, borderColor:'#121111'},

    image: {
        width: '100%',
        height: 175,
        flex:1
    },

    imageOverlay: {
        backgroundColor: 'rgba(27, 27, 26, 0.90)',
        position:'absolute',
        top:0,
        left: 0,
        height:175,
        width:'100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },

    imageTitleContainer: {
        flex: 1,
        justifyContent:'flex-start'
    },

    imageTitleInnerContainer: {
        marginTop: 8,
        marginHorizontal: 8
    },

    title: {
        color:'#fff',
        fontSize: 24,
        fontWeight:'bold'
    },

    meetupDate: {
        color:'#ccc',
        textAlignVertical:'center',
        fontWeight:'bold'
    },

    imageBottomContainer: {
        flex: 1,
        justifyContent:'flex-end'
    },

    imageBottomInnerContainer: {
        flexDirection:'row',
        marginBottom: 4,
        height:40
    },

    attendeesContainer: {
        flex: 1,
        flexDirection:'row',
        marginLeft:8,
        justifyContent:'flex-start',
        alignItems:'center'
    },

    infoIconContainer: {
        flex: 1,
        flexDirection:'row',
        marginRight:8,
        justifyContent:'flex-end',
        alignItems:'center'
    },

    buttonContainer: {
        flexDirection:'row',
        paddingVertical:8
    },

    viewButtonContainer: {
        flex: 1,
        justifyContent:'center'
    },

    viewButtonText: {textAlign:'center', color:'#fff'}
});

export const MeetupItem = ({meetup, onChange, onTellMeMorePress}) =>{

    let hasAttendees = false;
    if(meetup.attendees && meetup.attendees.length) hasAttendees = true;

    const [getSaving, setSaving] = useState(false);

    const toggleGoing = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            meetup.going = !meetup.going;

            if(meetup.going && !hasAttendees) meetup.attendees = [ {picture: `https://picsum.photos/300/300?seed=${Math.random()}`} ];
            if(meetup.going && hasAttendees) meetup.attendees.push({picture: `https://picsum.photos/300/300?seed=${Math.random()}`});
            if(!meetup.going) meetup.attendees.pop();
            if(onChange) onChange(meetup);

        }, 100);
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
        return <View style={Styles.attendeeImageContainer}><Image source={{uri : attendee.picture}} style={Styles.attendeeImage}  /></View>
    });

    return  <View style={Styles.container}>
        <ImageBackground source={{uri : meetup.picture}} style={Styles.image} imageStyle={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <View style={Styles.imageOverlay} />
            <View style={Styles.imageTitleContainer}>
                <View style={Styles.imageTitleInnerContainer}>
                    <Text style={Styles.title}>{meetup.title}</Text>
                    <Text style={Styles.meetupDate}>{`${wd}, ${da}${nth(da)} ${mo} ${ye}` }</Text>
                </View>
            </View>
            <View style={Styles.imageBottomContainer}>
                <View style={Styles.imageBottomInnerContainer}>
                    { hasAttendees &&
                    <View style={Styles.attendeesContainer}>
                        { attendees }
                    </View>}
                    <View style={Styles.infoIconContainer}>
                        <Icon icon={meetup.virtual ? ['fas', 'trees'] : ['far', 'wifi']} style={{opacity: 0.95}} size={28} color='#cccccc' />
                    </View>
                </View>
            </View>

        </ImageBackground>
        <View style={Styles.buttonContainer}>
            <View style={Styles.viewButtonContainer}>
                <TouchableHighlight onPress={onTellMeMorePress}>
                    <Text style={Styles.viewButtonText}>Tell me more</Text>
                </TouchableHighlight>
            </View>
            <View style={{flex:1}}>
                <ActivityButton text={meetup.going ? 'Not Going' : (hasAttendees ? 'Going' : 'Be the first to go!')} style={{flex:1}} showActivity={getSaving} onPress={toggleGoing} style={meetup.going ? {backgroundColor:'red'} : {}}/>
            </View>
        </View>
    </View>

}