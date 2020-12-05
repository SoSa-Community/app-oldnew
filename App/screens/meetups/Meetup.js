import React, {Component, createRef} from 'react';
import {
    Keyboard,
    Text,
    View,
    ImageBackground, StyleSheet, Image, FlatList, Platform
} from 'react-native';

import withMembersNavigationContext from "../hoc/withMembersNavigationContext";
import {ActivityButton} from "../../components/ActivityButton";
import {Icon} from "../../components/Icon";
import {CommentItem} from "../../components/comments/CommentItem";
import Helpers from "../../sosa/Helpers";
import {MessageInput} from "../../components/MessageInput";

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

export class Meetup extends Component {
    id = null;
    
    flatListRef = createRef();
    
    drawerNavigationContext = {};
    navigationContext = {};

    navigation = {};
    drawerNavigation = {};

    state = {
        saving: false,
        sending: false,
        items: [
            {type:'description'},
            {type:'comments'}
        ],
        meetup: {},
        comments: [],
        commentInput: ''
    };

    constructor({navigation, navigationContext, route: { params }}) {
        super();

        const { id } = params;
        this.id = id;
        
        this.navigation = navigation;
        this.navigationContext = navigationContext;
        this.drawerNavigation = this.navigationContext.drawerNavigation;
        this.drawerNavigationContext = this.navigationContext.drawerNavigationContext;
        
        const {appContext} = this.drawerNavigationContext;
        const {apiClient} = appContext;
        this.apiClient = apiClient;
    
        this.navigationContext.setMenuOptions({showLeft:true, showRight: false, leftMode: 'back', title: ''});
    }
    
    componentDidMount(){
        const { apiClient: { services: { meetups } } } = this;
        
        meetups.get(this.id).then((meetup) => {
            meetup.attendees = [
                {id:1, picture: `https://botface.io/generate?seed=${Math.random()}`},
                {id:2, picture: `https://botface.io/generate?seed=${Math.random()}`},
                {id:3, picture: `https://botface.io/generate?seed=${Math.random()}`},
                {id:4, picture: `https://botface.io/generate?seed=${Math.random()}`},
                {id:5, picture: `https://botface.io/generate?seed=${Math.random()}`},
            ];
            meetup.going = false;
            
            this.setState({meetup, comments: meetup.comments});
            this.navigationContext.setMenuOptions({title: meetup.title}, true);
        }).catch((errors) => {
            console.debug(errors);
        })
    }
    
    sendComment = () => {
        this.setState({sending: true});
        
        Keyboard.dismiss();
        this.apiClient.services.comments.create('sosa', this.state.commentInput,'meetup', this.id)
            .then(comment => {
                let comments = [...this.state.comments];
                comments.unshift(comment);
                this.setState({comments});
                this.flatListRef.scrollToIndex({animated: true, index: 1});
                
                
            }).finally(() => {
                this.setState({sending: false});
            });
    }
    

    render() {
        let {meetup, comments} = this.state;
        let hasAttendees = false;
        let attendees = null;
        
        const renderComments = () => {
            if(Array.isArray(comments) && comments.length){
                return comments.map((item, index) => (<CommentItem comment={item} key={item.id} />));
            }
        }
        
        
        if(Array.isArray(meetup.attendees)){
            if(meetup.attendees.length) hasAttendees = true;
            attendees = meetup.attendees.map((attendee) => {
                return <View style={Styles.attendeeImageContainer} key={attendee.id}><Image source={{uri : attendee.picture}} style={Styles.attendeeImage}  /></View>
            });
        }
        
        
        
        const buttonText = meetup.going ? 'Not Going' : (hasAttendees ? 'Going' : 'Be the first to go!');
    
        let imageSource = {};
        if(meetup.image) imageSource = {uri : meetup.image};
        else imageSource = require('../../assets/choose_meetup_image_v2.jpg');
    
        const toggleGoing = () => {
            this.setState({saving: true});
            setTimeout(() => {
                let currentMeetup = Object.assign({}, meetup);
    
                currentMeetup.going = !currentMeetup.going;
            
                if(currentMeetup.going && !hasAttendees) currentMeetup.attendees = [ {picture: `https://botface.io/generate?seed=${Math.random()}`} ];
                if(currentMeetup.going && hasAttendees) currentMeetup.attendees.push({picture: `https://botface.io/generate?seed=${Math.random()}`});
                if(!currentMeetup.going) meetup.attendees.pop();
    
                this.setState({saving: false, meetup:currentMeetup});
            }, 100);
        };

        return (
            <View style={{flex:1, backgroundColor: '#121111'}}>
                <View style={{flex:0}}>
                    <View style={{height:175}}>
                        <ImageBackground source={imageSource} style={Styles.image}>
                            <View style={Styles.imageOverlay} />
                            <View style={Styles.imageTitleContainer}>
                                <View style={Styles.imageTitleInnerContainer}>
                                    <Text style={Styles.title}>{meetup.title}</Text>
                                    <Text style={Styles.meetupDate}>{ Helpers.dateToLongForm(meetup.start_datetime) }</Text>
                                </View>
                            </View>
                            <View style={Styles.imageBottomContainer}>
                                <View style={Styles.imageBottomInnerContainer}>
                                    <View style={Styles.infoIconContainer}>
                                        <Icon icon={meetup.type === 'virtual' ? ['fas', 'trees'] : ['far', 'wifi']} style={{opacity: 0.95}} size={28} color='#cccccc' />
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
                <View style={Styles.buttonContainer}>
                    <View style={Styles.viewButtonContainer}>
                        { hasAttendees &&
                        <View style={Styles.attendeesContainer}>
                            { attendees }
                        </View>}
                    </View>
                    <View style={{flex:1}}>
                        <ActivityButton text={buttonText} style={{backgroundColor: meetup.going ? '#dc3545' : '#28a745'}} onPress={toggleGoing} showActivity={this.state.saving} />
                    </View>
                </View>
                <View style={{flex:1, alignItems:'flex-start'}}>
                    <FlatList
                        ref={(ref) => { this.flatListRef = ref; }}
                        data={this.state.items}
                        extraData={this.state.items}
                        keyExtractor={(item) => item.type}
                        renderItem={
                            ({item, index}) => {
                                const {type} = item;
                                if(type === 'description'){
                                    return <View style={{flex:1, marginTop: 16}}>
                                        <Text style={{color:'#fff'}}>{this.state.meetup.description}</Text>
                                    </View>
                                }else{
                                    if(comments.length){
                                        return <View style={{flex:1}}>
                                            <Text style={{fontSize:18, color:'#fff', marginLeft:4, marginTop: 16, marginBottom:8}}>Comments</Text>
                                            {renderComments()}
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
                        onChangeText={data => this.setState({commentInput: data})}
                        sendAction={this.sendComment}
                        value={this.state.commentInput}
                        placeholder="Leave a comment"
                        canSend={!this.state.sending}
                    />
                </View>
                
            </View>
        );
    }
}

const MeetupScreen = withMembersNavigationContext(Meetup);
export default MeetupScreen;
