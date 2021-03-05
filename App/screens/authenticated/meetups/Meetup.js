import React, {useState, useEffect, createRef} from 'react';
import {
    Keyboard,
    Text,
    View,
    ImageBackground, StyleSheet, Image, FlatList, Platform, KeyboardAvoidingView, Dimensions
} from 'react-native';
import Helpers from "../../../sosa/Helpers";

import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';
import { useAPI } from '../../../context/APIContext';

import ActivityButton from "../../../components/ActivityButton";
import Icon from "../../../components/Icon";
import CommentItem from "../../../components/comments/CommentItem";
import MessageInput from "../../../components/MessageInput";

const dimensions = Dimensions.get('window');

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
        width:'100%'
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
        alignItems:'center',
        paddingVertical: 4,
        backgroundColor: '#444442'
    },

    viewButtonContainer: {
        flex: 1,
        justifyContent:'flex-start',
    },

    viewButtonText: {textAlign:'center', color:'#fff'},
    
    footer: {
        flexDirection: 'row',
        paddingBottom: Platform.OS === 'ios' ? 24 : 4,
    },
});

const Comments = ({comments, showMemberProfile}) => {
    if(Array.isArray(comments) && comments.length){
        return comments.map((item, index) => (<CommentItem comment={item} key={item.id} onFacePress={() => showMemberProfile(item?.user?.user_id)}/>));
    }
}

const Attendees = ({attendees}) => {
    if(Array.isArray(attendees) && attendees.length){
        return (
            <View style={Styles.attendeesContainer}>
                {
                    attendees.map((attendee) => (
                        <View style={Styles.attendeeImageContainer} key={attendee?.id}>
                            <Image source={{uri : attendee.picture}} style={Styles.attendeeImage}  />
                        </View>
                    ))
                }
            </View>
        );
    }
    return <></>;
}

const AttendingButton = ({meetup, attendees, toggleGoing, saving}) => {
    const buttonText = meetup?.going ? 'Not Going' : (attendees.length ? 'Going' : 'Be the first to go!');
    return <ActivityButton text={buttonText} style={{backgroundColor: meetup?.going ? '#dc3545' : '#28a745'}} onPress={toggleGoing} showActivity={saving} />;
}

const MeetupImage = ({meetup, children}) => {
    let imageSource = {};
    if(meetup?.image) imageSource = {uri : meetup.image};
    else imageSource = require('../../../assets/choose_meetup_image_v2.jpg');
    
    return <ImageBackground source={imageSource} style={Styles.image}>{children}</ImageBackground>;
}

const MeetupScreen = ({navigation, route, showMemberProfile}) => {
    const { setMenuOptions } = useAuthenticatedNavigation();
    const { services: { meetups: meetupService, comments: commentsService } } = useAPI();
    
    const flatListRef = createRef();
    const [saving, setSaving] = useState(false);
    const [sending, setSending] = useState(false);
    const [items, setItems] = useState([
        {type:'description'},
        {type:'comments'}
    ]);
    
    const [meetup, setMeetup] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [attendees, setAttendees] = useState([]);
    
    
    useEffect(() => {
        
        setMenuOptions({showLeft:true, showRight: false, leftMode: 'back', title: ''});
    
        const id = route?.params?.id;
        meetupService.get(id)
            .then(meetup => {
                setAttendees([
                    {id:1, picture: `https://botface.io/generate?seed=${Math.random()}`},
                    {id:2, picture: `https://botface.io/generate?seed=${Math.random()}`},
                    {id:3, picture: `https://botface.io/generate?seed=${Math.random()}`},
                    {id:4, picture: `https://botface.io/generate?seed=${Math.random()}`},
                    {id:5, picture: `https://botface.io/generate?seed=${Math.random()}`},
                ]);
                meetup.going = false;
                setMeetup(meetup);
                setComments(meetup?.comments);
                setMenuOptions({title: meetup?.title}, true);
            })
            .catch((errors) => console.debug(errors))
        
    }, [])
    
    const sendComment = () => {
        Keyboard.dismiss();
        
        setSending(true);
        commentsService.create('sosa', comment,'meetup', meetup?.id)
            .then(comment => {
                let existingComments = [...comments];
                existingComments.unshift(comment);
                
                setComments(existingComments);
                setComment('');
                flatListRef?.current?.scrollToIndex({animated: true, index: 1});
            })
            .catch(error => {
                console.error('Meetup::sendComment', error);
            })
            .finally(() => setSending(false));
    }
    
    const buildWrapper = (children) => {
        if(Platform.OS !== "ios") return <>{children}</>;
        return <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#121111'}} behavior="padding" keyboardVerticalOffset={Math.floor(dimensions.height / 100 * 9)}>{children}</KeyboardAvoidingView>;
    }
    
    
    
    const toggleGoing = () => {
        setSaving(true);
        setTimeout(() => {
            let currentMeetup = {...meetup};
            let currentAttendees = [...attendees];
        
            currentMeetup.going = !currentMeetup.going;
        
            if(currentMeetup.going && !attendees.length) {
                currentAttendees = [ {picture: `https://botface.io/generate?seed=${Math.random()}`} ];
            }
            
            if(currentMeetup.going && attendees.length) {
                currentAttendees.push({picture: `https://botface.io/generate?seed=${Math.random()}`});
            }
            
            if(!currentMeetup.going) currentAttendees.pop();
        
            setSaving(false);
            setMeetup(currentMeetup);
            setAttendees(currentAttendees);
            
        }, 100);
    };
    
    return (
        buildWrapper(
            <View style={{flex:1, backgroundColor: '#121111'}}>
                <View style={{flex:0}}>
                    <View style={{height:175}}>
                        <MeetupImage {...{ meetup } }>
                            <View style={Styles.imageOverlay} />
                            <View style={Styles.imageTitleContainer}>
                                <View style={Styles.imageTitleInnerContainer}>
                                    <Text style={Styles.title}>{meetup?.title}</Text>
                                    <Text style={Styles.meetupDate}>{ Helpers.dateToLongForm(meetup?.start_datetime) }</Text>
                                </View>
                            </View>
                            <View style={Styles.imageBottomContainer}>
                                <View style={Styles.imageBottomInnerContainer}>
                                    <View style={Styles.infoIconContainer}>
                                        <Icon icon={meetup?.type === 'virtual' ? ['fas', 'trees'] : ['far', 'wifi']} style={{opacity: 0.95}} size={28} color='#cccccc' />
                                    </View>
                                </View>
                            </View>
                        </MeetupImage>
                    </View>
                </View>
                <View style={Styles.buttonContainer}>
                    <View style={Styles.viewButtonContainer}>
                        <Attendees {...{ attendees } }/>
                    </View>
                    <View style={{flex:1}}>
                        <AttendingButton {...{ meetup, attendees, toggleGoing, saving } } />
                    </View>
                </View>
                <View style={{flex:1, alignItems:'flex-start'}}>
                    <FlatList
                        ref={ flatListRef }
                        data={items}
                        extraData={items}
                        keyExtractor={(item) => item.type}
                        renderItem={
                            ({item, index}) => {
                                const {type} = item;
                                if(type === 'description'){
                                    return <View style={{flex:1, marginTop: 16}}>
                                        <Text style={{color:'#fff'}}>{meetup?.description}</Text>
                                    </View>
                                }else{
                                    if(comments.length){
                                        return <View style={{flex:1}}>
                                            <Text style={{fontSize:18, color:'#fff', marginLeft:4, marginTop: 16, marginBottom:8}}>Comments</Text>
                                            <Comments {...{ comments, showMemberProfile } } />
                                        </View>
                                    }
                                }
                    
                            }
                        }
                        style={{paddingHorizontal:8, width:'100%'}}
                        contentContainerStyle={{paddingBottom:8}}
                    />
                </View>
                <View style={Styles.footer}>
                    <MessageInput
                        onChangeText={data => setComment(data)}
                        sendAction={sendComment}
                        value={comment}
                        placeholder="Leave a comment"
                        canSend={!sending}
                    />
                </View>
    
            </View>
        )
    )
}

export default MeetupScreen;
