import React, {Component} from 'react';
import {
    Text,
    View,
    ImageBackground, StyleSheet, Image, FlatList, Platform
} from 'react-native';

import withMembersNavigationContext from "../hoc/withMembersNavigationContext";
import {ActivityButton} from "../../components/ActivityButton";
import {Icon} from "../../components/Icon";
import {CommentItem} from "../../components/comments/CommentItem";
import Helpers from "../../sosa/Helpers";

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
        paddingBottom: Platform.OS === 'ios' ? 32 : 8,
        paddingRight: 14
    },

    viewButtonContainer: {
        flex: 1,
        justifyContent:'flex-start',
    },

    viewButtonText: {textAlign:'center', color:'#fff'}
});

export class Meetup extends Component {
    id = null;
    
    drawerNavigationContext = {};
    navigationContext = {};

    navigation = {};
    drawerNavigation = {};

    state = {
        saving: false,
        items: [
            {type:'description'},
            {type:'comments'}
        ],
        meetup: {},
        meetup2: {
                id: 2,
                picture: 'https://i.ytimg.com/vi/N7ZafWA2jd8/maxresdefault.jpg',
                title: 'Team Fortress 2',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies mollis quam, quis sagittis sapien tempus egestas. Mauris rutrum et justo vitae volutpat. Maecenas ut augue eu lorem varius accumsan sit amet non erat. Ut placerat ipsum quis dolor iaculis efficitur. Nunc ut urna imperdiet, pretium elit id, congue libero. Integer nec varius nisl. Ut suscipit quam leo, nec suscipit massa iaculis ut. Mauris a libero turpis.',
                virtual: true,
                start_timestamp: 1595863949,
                going: false,
                attendees: [
                    {id:1, picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {id:2, picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {id:3, picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {id:4, picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {id:5, picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                ],
                comments: [
                    {entity:2, context:'meetup', id: 1, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.',
                    children:[{entity:2, context:'meetup', id: 2, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.'}]},
                    {entity:2, context:'meetup', id: 3, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.',
                        children: [
                            {
                                entity:2, context:'meetup', id: 4, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.',
                                children:[
                                    {entity:2, context:'meetup', id: 5, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.'},
                                    {
                                        entity:2, context:'meetup', id: 8, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.',
                                        children:[
                                            {
                                                entity:2, context:'meetup', id: 9, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.',
                                                children:[
                                                    {
                                                        entity:2, context:'meetup', id: 10, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.',
                                                        children:[
                                                            {
                                                                entity:2, context:'meetup', id: 11, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.',
                                                                children:[
                                                                    {
                                                                        entity:2, context:'meetup', id: 12, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.'
                                                                    },
                                                                ]
                                                            },
                                                        ]
                                                    },
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            },

                        ]
                    },

                ]
        }
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
            this.setState({meetup});
            this.navigationContext.setMenuOptions({title: meetup.title}, true);
        }).catch((errors) => {
            console.debug(errors);
        })
    }
    

    render() {
        let {meetup} = this.state;
        let hasAttendees = false;
        let attendees = null;
        let comments = null;
        
        if(Array.isArray(meetup.attendees)){
            if(meetup.attendees.length) hasAttendees = true;
            attendees = meetup.attendees.map((attendee) => {
                return <View style={Styles.attendeeImageContainer} key={attendee.id}><Image source={{uri : attendee.picture}} style={Styles.attendeeImage}  /></View>
            });
        }
        
        if(Array.isArray(meetup.comments)){
            comments = meetup.comments.map((item, index) => {
                return <CommentItem comment={item} key={index}/>
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
            
                if(currentMeetup.going && !hasAttendees) currentMeetup.attendees = [ {picture: `https://picsum.photos/300/300?seed=${Math.random()}`} ];
                if(currentMeetup.going && hasAttendees) currentMeetup.attendees.push({picture: `https://picsum.photos/300/300?seed=${Math.random()}`});
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
                <View style={{flex:1, paddingBottom: 8, alignItems:'flex-start'}}>
                    <FlatList
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
                                    if(comments){
                                        return <View style={{flex:1}}>
                                            <Text style={{fontSize:18, color:'#fff', marginLeft:4, marginTop: 16, marginBottom:8}}>Comments</Text>
                                            {comments}
                                        </View>
                                    }
                                }

                            }
                        }
                        style={{flex: 1, backgroundColor: '#121111', paddingHorizontal:8}}
                    />
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
            </View>
        );
    }
}

const MeetupScreen = withMembersNavigationContext(Meetup);
export default MeetupScreen;
