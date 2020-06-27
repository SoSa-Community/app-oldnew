import React, {Component} from 'react';
import Styles from './styles/chat'
import {Image, FlatList, Text, View, Button, TouchableHighlight, TouchableOpacity, Linking, KeyboardAvoidingView, Platform, ScrollView, Keyboard} from 'react-native';
import io from "socket.io-client";

import { SoSaConfig } from "../sosa/config";
import {ChatClient, Message} from 'sosa-chat-client';

import Session from "../sosa/Session";
import Device from "../sosa/Device";

import HTML from 'react-native-render-html';
import Helpers from '../sosa/Helpers';
import MessageInput from "../components/MessageInput";
import UserList from "../components/chat/UserList";

import jwt from "react-native-pure-jwt";
import RoomItem from "../components/chat/RoomItem";


export class Chat extends Component {
    navigationContext = {};
    homeContext = {};
    navigation = {};
    scrollOffset = {y:0, x:0};
    scrollView = null;
    username = '';
    messageBuffer = [];
    nickname = '';
    coolDown = false;
    coolDownTimer = null;
    slowDownCounter = 0;
    slowDownTimer = null;
    tagPosition = {start:0, end:0};
    messageInputPosition = {start:0, end:0};

    messageInput = ''; //We use this as well as state because setState doesn't update immediately and can create a race condition

    client;
    session;

    bufferRenderTimer = null;
    bufferRenderRunning = false;

    state = {
        userList: [],
        messages: [],
        tagSearchData: [],
        messageInput: '',
        rooms: [],
        scrolling: true,
        newMessagesNotificationVisible: false,
        slowDownNotifierVisible: false,
        currentRoom: null,
        canSend: true,
        fuckWith: false
    };

    constructor(props) {
        super();

        this.session = Session.getInstance()

        this.navigation = props.navigation;
        this.homeContext = props.homeContext;
        this.navigationContext = props.navigationContext;
    }

    componentDidMount() {
        this.setupConnectButton();
        this.updateUserList();

        let device = Device.getInstance();

        this.client = new ChatClient(
            {
                host: SoSaConfig.chat.server,
                api_key: SoSaConfig.chat.api_key
            },
            io,
            {
                get: (callback) => {
                    let packet = {id: this.session.getId(), refresh_token: this.session.getRefreshToken()};
                    jwt.sign(packet, device.getSecret(), {alg: "HS256"}).then((token) => {
                        callback(token, device.getId(), false);
                    });
                },
                reauth: (callback) => {
                    Helpers.authCheck((device, session, error) => {
                        callback(error);
                    });
                },
                authFailed: () => this.navigationContext.logout(true)
            }
        );
        this.connect();
    }

    componentWillUnmount(): void {
        this.disconnect();
        this.client.middleware.clear();
    }

    setupConnectButton = (disconnect: false) => {
        let color = '#28a745';
        let text = 'Connect';
        let func = () => {
            this.connect();
            this.navigation.dangerouslyGetParent().closeDrawer();
        };

        if(disconnect){
            color = '#dc3545';
            text = 'Disconnect';
            func = () => {
                this.disconnect();
                this.navigation.dangerouslyGetParent().closeDrawer();
                this.navigationContext.removeDrawerItem('user_list', true);
                this.navigationContext.removeDrawerItem('room_list');
            };
        }

        this.navigationContext.addDrawerItem('connect', (<View key={'connect'}>
            <Button
                color={color}
                title={text}
                onPress={func}
            />
        </View>), false, true);
    };

    updateUserList = () => {
        const navigation = this.navigation;
        this.navigationContext.addDrawerItem('user_list', (
            <View style={{flex:1}} key={'user_list'}>
                <UserList userList={this.state.userList} onPress={
                    (user) => {
                        navigation.closeDrawer();
                        this.addTag(user.nickname);
                    }} />
            </View>
        ), true);
    }

    sendMessage = () => {
        if(!this.coolDown && this.slowDownCounter < 3){
            let message = this.messageInput.trim();
            if(message.length > 0){
                this.coolDown = true;

                clearTimeout(this.coolDownTimer);
                this.coolDownTimer = setTimeout(() => {
                    this.coolDown = false;
                }, this.slowDownCounter * 200);

                clearTimeout(this.slowDownTimer);
                this.slowDownTimer = setTimeout(() => {
                    this.slowDownCounter = 0;
                    this.setState({slowDownNotifierVisible: false, canSend: true, fuckWith: false});
                },5000);

                this.slowDownCounter++;

                this.client.rooms().send((err, message) => {
                        if(!err){
                            this.addMessage(message);
                        }
                    },
                    this.state.currentRoom.community_id,
                    this.state.currentRoom.name,
                    message
                );

                this.setState({ messageInput: '' });
                this.scrollToBottom();
            }
        }else{
            this.slowDownCounter++;

            if(this.slowDownCounter > 3){
                let data = {slowDownNotifierVisible: true, canSend: false};
                if(this.slowDownCounter > 4) data.fuckWith = true;

                this.setState(data);
            }
        }
    };

    addStatus = (message) => {
        this.addMessage({id: Helpers.generateId(), message: message});
    };

    addMessage = (item) => {
        if(!item.id){
            if(item.uuid){item.id = item.uuid;}
            else if(item._id){
                item.id = item._id;
            }else{
                item.id = Helpers.generateId();
            }
        }
        this.messageBuffer.push(item);

        if(this.isScrolled()){
            this.setState({newMessagesNotificationVisible: true});
        }
    };

    renderRoomList = (rooms) => {
        if(!rooms){ rooms = this.state.rooms; }

        let roomViews = rooms.map((room) => {
            return <RoomItem key={room.id}
                             onPress={() => {
                                 this.joinRoom('sosa', room.name);
                                 this.navigation.closeDrawer();
                             }}
                             room={room}
                             roomActive={(this.state.currentRoom !== null && room.id === this.state.currentRoom.id)}
            />
        });

        this.navigationContext.addDrawerItem('room_list', (
            <View style={{flex: 1}} key={'room_list'}>
                <View style={{justifyContent:'center', alignItems:'center', marginVertical: 8}}>
                    <Text style={{justifyContent:'center', fontSize:16, color:'#fff'}}>Rooms</Text>
                </View>
                <ScrollView style={{flex:1}}>
                    { roomViews }
                </ScrollView>
            </View>
        ));
    };

    updateRoomList = () => {

        this.client.rooms().list((err, data) => {
            if(!err){
                this.renderRoomList(data.rooms);
                this.setState({rooms: data.rooms});
            }else{
                Helpers.showAlert('Error getting room list', err.message);
            }

        }, 'sosa');
    };

    joinRoom = (communityID, roomID, callback) => {

        this.client.rooms().join((err, room, userList) => {
            this.sortUserList(userList);
            this.setState({userList: userList});

            this.updateUserList();

            if(err){
                Helpers.showAlert('Can\'t Join Room', err.message);

            }else{
                this.setState({currentRoom: room});
                this.addStatus(`Joined room ${room.name}`);

                this.homeContext.addHeaderIcon('whos_online',['fal', 'users'], this.displayUserList);
                this.renderRoomList();
            }

        }, communityID, roomID);
    };

    displayUserList = () => {
        if(this.state.currentRoom !== null){
            Keyboard.dismiss();
            this.navigation.openDrawer();
        }else{
            Helpers.showAlert('You\'re not in a room','Please join a room first!');
        }

    };

    connect = () => {
        let client = this.client;
        let middleware = this.client.middleware;
        let chat = this;

        middleware.clear();

        middleware.add({
            'receive_message': (message, client) => {
                this.addMessage(message);
                return message;
            },
            'authentication_successful': (authData, client) => {
                this.nickname = chat.session.nickname;

                this.addStatus(`Connected to server with nickname: ${chat.session.nickname}`);
                this.setupBufferRenderTimer();

                this.setupConnectButton(true);

                this.updateRoomList();

                if(this.state.currentRoom !== null){
                    this.joinRoom(this.state.currentRoom.community_id, this.state.currentRoom.name);
                }else{
                    this.joinRoom('sosa', 'general');
                }
                return authData;
            },
            'disconnected': (message, client) => {
                this.addStatus('Disconnected from server');
                this.setupConnectButton();

                return message;
            },
            'rooms/join': (userData) => {
                if(this.state.currentRoom){

                    this.addStatus(`${userData.nickname} joined`);

                    let userList = this.state.userList;
                    let add = true;
                    userList.forEach((user, index) => {
                        if(user.nickname === userData.nickname) add = false;
                    });
                    if(add){
                        userList.push(userData);
                        this.sortUserList(userList);
                        this.setState({userList: userList});
                    }
                }
            },
            'rooms/left': (userData) => {
                if(this.state.currentRoom){
                    this.addStatus(`${userData.nickname} left`);
                    let userList = this.state.userList;

                    userList.forEach((user, index) => {
                        if(user.nickname === userData.nickname) delete userList[index];
                    });
                    this.sortUserList(userList);
                    this.setState({userList: userList});
                }
            }
        });

        client.connect();
    };

    sortUserList = (userList) => {
        userList.sort((a,b) => a.nickname.localeCompare(b.nickname, [], {numeric: true, ignorePunctuation: true}));
    }

    disconnect = () => this.client.disconnect();

    addTag = (username, usingTagList) => {
        let text = this.state.messageInput;
        let tag = `@${username}`;

        if(text.length === 0){
            text = tag;
        }else{
            let textLength = text.length;
            let caretStart = this.messageInputPosition.start;
            let caretEnd = this.messageInputPosition.end;

            if(usingTagList && this.tagPosition.end > 0){
                caretStart = this.tagPosition.start;
                caretEnd = this.tagPosition.end;
                tag += ' ';
            }

            let part1 = '';
            let part2 = '';

            if(caretStart === caretEnd){
                part1 = text.substr(0, caretEnd);
                part2 = text.substr(caretEnd, textLength);

                if(part1.length >= 0 && caretEnd !== 0){
                    if(!/(.*)\s+$/.test(part1)) part1 += ' ';
                }

                if(part2.length >= 1) {
                    if (!/^\s+(.*)$/.test(part2)) part2 = ` ${part2}`;
                }
            }else{
                part1 = text.substr(0, caretStart);
                part2 = text.substr(caretEnd, textLength);
            }
            text = `${part1}${tag}${part2}`;
        }
        this.setState({messageInput: text});

    };

    isScrolled = () => {
        if(this.scrollOffset.y > 35) return true;
        return false;
    }

    chatMessagesOnScroll = (event) => {
        this.scrollOffset = event.nativeEvent.contentOffset;
        if(!this.isScrolled()){
            this.setState({newMessagesNotificationVisible: false});
        }
    };

    setupBufferRenderTimer = () => {
        this.bufferRenderTimer = setTimeout(this.bufferRender, 500);
    };

    bufferRender = () => {
        clearTimeout(this.bufferRenderTimer);
        if(!this.bufferRenderRunning){
            this.bufferRenderRunning = true;
            if(this.scrollOffset.y < 35){
                let messages = this.state.messages;
                let bufferState = this.messageBuffer.splice(0);

                bufferState.forEach((message, index) => {
                    messages.unshift(message);
                    delete this.messageBuffer[index];
                });

                if(messages.length > 100) messages.splice(50, messages.length - 1);

                this.setState({ messages: messages});
            }
            this.bufferRenderRunning = false;
            this.setupBufferRenderTimer();
        }else{
            this.setupBufferRenderTimer();
        }
    };

    scrollToBottom = () => {
        this.setState({newMessagesNotificationVisible: false});
        this.scrollView.scrollToIndex({index:0, animated: true});
    }

    buildWrapper = (component) => {
        if(Platform.OS === 'ios'){
            return  (<KeyboardAvoidingView style={{flex: 1}} behavior="padding">{component}</KeyboardAvoidingView>);
        }else {
            return (<View style={{flex: 1}} behavior="padding">{component}</View>);
        }
    }

    messageInputSelectionChange = (event) => {
        this.messageInputPosition = event.nativeEvent.selection;
        console.log('Selection Change', this.messageInputPosition);
    }

    checkForTags = () => {
        let message = this.messageInput;
        let end = this.messageInputPosition.end;
        let atIndex = message.lastIndexOf('@', end);

        console.log('Check for tags', message, this.messageInputPosition);

        let matches = [];
        this.tagPosition = {start: 0, end: 0};
        if(atIndex !== -1){
            let space = message.indexOf(' ', atIndex);
            if(space === -1) space = message.length;

            if(space >= end){
                let part = message.substring(atIndex + 1, space).trim().toLowerCase();
                console.log(part);
                let searchArray = this.state.userList;
                searchArray.forEach((user) => {
                    if(matches.length < 3 && user.nickname.toLowerCase().includes(part)){
                        matches.push(user);
                    }
                });
                this.tagPosition = {start: atIndex, end: space};
            }
        }
        this.setState({tagSearchData: matches});
    }

    render() {

        return (
            this.buildWrapper(
                <View style={{flex: 1, marginBottom: Platform.OS === 'ios' ? 24 : 0}}>
                        <View style={{flex: 1, backgroundColor: '#2b2b2b', zIndex:1000}}>

                            <FlatList
                                ref={(ref) => {this.scrollView = ref;}}
                                onScroll={this.chatMessagesOnScroll}
                                keyboardShouldPersistTaps={'handled'}
                                inverted
                                data={this.state.messages}
                                extraData={this.state.messages}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={
                                    ({item}) => {
                                        if(item instanceof Message){

                                            let containerStyles = [Styles.messageContainer];
                                            if(item.mentions.length > 0 && item.mentions.indexOf(this.nickname) !== -1){
                                                containerStyles.push(Styles.messageContainerWithMention);
                                            }

                                            if(!item.picture || item.picture.length === 0){
                                                item.picture = 'https://picsum.photos/seed/picsum/300/300';
                                            }

                                            return  <View style={containerStyles}>
                                                <View style={Styles.messageContainerInner}>
                                                    <View style={{marginRight: 10}}>
                                                        <TouchableOpacity onPress={() => this.addTag(item.nickname)}>
                                                            <Image source={{uri : item.picture}} style={{width: 48, height: 48, borderRadius: 48/2}} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{flex:1}}>
                                                        <TouchableOpacity onPress={() => this.addTag(item.nickname)}>
                                                            <Text style={Styles.message_username}>{item.nickname}</Text>
                                                        </TouchableOpacity>
                                                        <HTML html={item.parsed_content}
                                                              tagsStyles={{ a: { color: '#7ac256' }}}
                                                              baseFontStyle={{color:'#ffffff'}}
                                                              onLinkPress={(evt, href) => {
                                                                  Linking.openURL(href);
                                                              }}
                                                              renderers={{
                                                                  spoiler: {renderer: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                                                                          <Text> {children} </Text>
                                                                      )
                                                                      , wrapper: 'Text'}
                                                              }}/>
                                                    </View>
                                                </View>
                                            </View>
                                        }else{
                                            return <Text style={Styles.status}>{item.message}</Text>
                                        }
                                    }
                                }
                                style={Styles.message_list}
                            />

                            {
                                this.state.newMessagesNotificationVisible &&
                                <TouchableHighlight onPress={this.scrollToBottom} style={Styles.newMessageScrollNotifier}>
                                    <Text style={{color: '#ffffff'}}>You have new messages waiting</Text>
                                </TouchableHighlight>
                            }
                            {
                                this.state.slowDownNotifierVisible &&
                                <TouchableHighlight onPress={() => this.setState({slowDownNotifierVisible: false})} style={Styles.slowDownNotifier}>
                                    <Text style={{color: '#000'}}>Whoa slow down buddy!</Text>
                                </TouchableHighlight>
                            }
                        </View>
                        <UserList userList={this.state.tagSearchData} onPress={(user) => this.addTag(user.nickname, true)} slim={true}/>
                        <View style={Styles.footer}>
                            <MessageInput
                                onChangeText={data => {
                                    this.messageInput = data;
                                    this.setState({ messageInput: data});
                                    if(Platform.OS === 'ios') this.checkForTags();
                                }}
                                sendAction={this.sendMessage}
                                value={this.state.messageInput}
                                onSelectionChange={(event) => {
                                    this.messageInputSelectionChange(event);
                                    if(Platform.OS === 'android') this.checkForTags();
                                }}
                                fuckWith={this.state.fuckWith}
                                canSend={this.state.canSend}
                            />
                        </View>

                </View>
            )
        );
    }
}
