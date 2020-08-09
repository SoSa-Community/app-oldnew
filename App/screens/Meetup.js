import React, {Component} from 'react';
import {
    Text,
    View,
    ImageBackground, StyleSheet, Image, FlatList, Platform
} from 'react-native';

import withMembersNavigationContext from "./hoc/withMembersNavigationContext";
import {ActivityButton} from "../components/ActivityButton";
import {Icon} from "../components/Icon";
import {CommentItem} from "../components/comments/CommentItem";

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
        alignItems:'center'
    },

    viewButtonContainer: {
        flex: 1,
        justifyContent:'center',
    },

    viewButtonText: {textAlign:'center', color:'#fff'}
});

export class Meetup extends Component {
    drawerNavigationContext = {};
    navigationContext = {};

    navigation = {};
    drawerNavigation = {};

    state = {
        items: [
            {type:'description'},
            {type:'comments'}
        ],
        meetup: {
                id: 2,
                picture: 'https://i.ytimg.com/vi/N7ZafWA2jd8/maxresdefault.jpg',
                title: 'Team Fortress 2',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies mollis quam, quis sagittis sapien tempus egestas. Mauris rutrum et justo vitae volutpat. Maecenas ut augue eu lorem varius accumsan sit amet non erat. Ut placerat ipsum quis dolor iaculis efficitur. Nunc ut urna imperdiet, pretium elit id, congue libero. Integer nec varius nisl. Ut suscipit quam leo, nec suscipit massa iaculis ut. Mauris a libero turpis.',
                virtual: true,
                start_timestamp: 1595863949,
                going: false,
                attendees: [
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                    {picture: `https://picsum.photos/300/300?seed=${Math.random()}`},
                ],
                comments: [
                    {depth: 1, entity:2, context:'meetup', id: 1, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.'},
                    {depth: 20, entity:2, context:'meetup', id: 2, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.'},
                    {depth: 2, entity:2, context:'meetup', id: 3, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.'},
                    {depth: 3, entity:2, context:'meetup', id: 4, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.'},
                    {depth: 4, entity:2, context:'meetup', id: 5, picture: `https://picsum.photos/300/300?seed=${Math.random()}`, nickname: 'Bot1', content:'Bacon ipsum dolor amet chicken alcatra salami drumstick, meatloaf beef ribeye picanha jerky tongue cow pig. Shankle shank frankfurter ham pork belly, cupim beef turducken swine bresaola leberkas pancetta beef ribs filet mignon brisket. Meatloaf boudin ham pastrami tenderloin cupim tongue short ribs short loin chislic bacon strip steak kevin. Ham capicola corned beef leberkas chislic. Frankfurter tri-tip beef ribs pork belly venison fatback. Tenderloin pastrami prosciutto, swine drumstick cupim chuck ham hock corned beef kevin buffalo venison sausage. Rump kevin frankfurter ham. Pork loin kielbasa pork bacon, meatloaf ham salami beef ribeye tongue bresaola. Pork picanha rump, tongue ball tip tenderloin short ribs pig andouille ham kevin. Porchetta pastrami meatball pork chop, brisket ground round turducken rump prosciutto hamburger strip steak beef andouille pork loin. Chislic chicken t-bone tenderloin.'}
                ]
        }
    };

    constructor(props) {
        super();

        this.navigation = props.navigation;
        this.navigationContext = props.navigationContext;
        //this.drawerNavigation = this.navigationContext.drawerNavigation;
        //this.drawerNavigationContext = props.navigationContext.drawerNavigationContext;
    }

    render() {
        let {meetup} = this.state;
        let hasAttendees = false;
        if(meetup.attendees && meetup.attendees.length) hasAttendees = true;

        const nth = function(d) {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1:  return "st";
                case 2:  return "nd";
                case 3:  return "rd";
                default: return "th";
            }
        };

        const dateTime = new Date(meetup.start_timestamp * 1000);
        const wd = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(dateTime);
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dateTime);
        const mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(dateTime);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dateTime);

        const attendees = meetup.attendees.map((attendee) => {
            return <View style={Styles.attendeeImageContainer}><Image source={{uri : attendee.picture}} style={Styles.attendeeImage}  /></View>
        });

        return (
            <View style={{flex:1, backgroundColor: '#121111'}}>
                <View style={{flex:0}}>
                    <View style={{height:175}}>
                        <ImageBackground source={{uri : meetup.picture}} style={Styles.image}>
                            <View style={Styles.imageOverlay} />
                            <View style={Styles.imageTitleContainer}>
                                <View style={Styles.imageTitleInnerContainer}>
                                    <Text style={Styles.title}>{meetup.title}</Text>
                                    <Text style={Styles.meetupDate}>{`${wd}, ${da}${nth(da)} ${mo} ${ye}` }</Text>
                                </View>
                            </View>
                            <View style={Styles.imageBottomContainer}>
                                <View style={Styles.imageBottomInnerContainer}>
                                    <View style={Styles.infoIconContainer}>
                                        <Icon icon={meetup.virtual ? ['fas', 'trees'] : ['far', 'wifi']} style={{opacity: 0.95}} size={28} color='#cccccc' />
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
                                    const comments = this.state.meetup.comments.map((item, index) => {
                                        return <CommentItem comment={item} />
                                    });
                                    return <View style={{flex:1}}>
                                        <Text style={{fontSize:18, color:'#fff', marginLeft:4, marginTop: 16, marginBottom:8}}>Comments</Text>
                                        {comments}
                                    </View>

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
                        <ActivityButton text={meetup.going ? 'Not Going' : (hasAttendees ? 'Going' : 'Be the first to go!')} style={{flex:1}} style={meetup.going ? {backgroundColor:'red'} : {}}/>
                    </View>
                </View>
            </View>
        );
    }
}

const MeetupScreen = withMembersNavigationContext(Meetup);
export default MeetupScreen;
