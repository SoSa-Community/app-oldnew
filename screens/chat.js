import React, {Component} from 'react';
import Styles from './styles/chat'
import {Image, FlatList, Text, View, Button, TouchableHighlight} from 'react-native';
import io from "socket.io-client";

import { SoSaConfig } from "../sosa/config";
import {ChatClient, Message} from 'sosa-chat-client';

import HTML from 'react-native-render-html';
import Helpers from '../sosa/Helpers';
import MessageInput from "../components/MessageInput";
import UserList from "../components/chat/UserList";
console.debug = () => {};

export class Chat extends Component {
    navigationContext = {};
    homeContext = {};
    navigation = {};
    scrollOffset = {y:0, x:0};
    scrollView = null;
    username = '';
    currentRoom = null;
    messageBuffer = [];

    client = new ChatClient({
        host: SoSaConfig.chat.server,
        api_key: SoSaConfig.chat.api_key
    }, io);


    bufferRenderTimer = null;
    bufferRenderRunning = false;

    state = {
        joinRoomModalVisible: false,
        roomListModalVisible: false,
        userListModalVisible: false,
        userList: [],
        messages: [],
        messageInput: '',
        rooms: [],
        scrolling: true,
        newMessagesNotificationVisible: false
    };

    constructor(props) {
        super();

        this.navigation = props.navigation;
        this.homeContext = props.homeContext;
        this.navigationContext = props.navigationContext;
    }

    componentDidMount() {
        this.setupConnectButton();
        this.updateUserList();
        this.connect();
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

        this.navigationContext.addDrawerItem('connect', (<View style={{flex:1}} key={'connect'}>
            <Button
                color={color}
                title={text}
                onPress={func}
                style={{justifyContent:'flex-end'}}
            />
        </View>));
    };

    updateUserList = () => {

        this.navigationContext.addDrawerItem('user_list', (
            <View style={{flex:1}} key={'user_list'}>
                <UserList userList={this.state.userList} />
            </View>
        ), true);
    }

    sendMessage = () => {
        if(this.state.messageInput.length > 0){
            let message = this.state.messageInput;

            if(message === 'lorem'){
                message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac gravida libero. Pellentesque placerat ex neque, sed viverra sapien pretium in. Donec consectetur erat ac eros tincidunt tristique. Curabitur enim quam, porttitor eu augue ut, rhoncus euismod purus. Vivamus pulvinar sollicitudin justo, vitae ornare ligula porta a. Ut urna dui, aliquam et orci nec, fringilla accumsan orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
            }

            this.client.rooms().send(() => {}, this.currentRoom.community_id, this.currentRoom.name, message);
            this.setState({ messageInput: '' });
            this.scrollToBottom();
        }
    };

    addStatus = (message) => {
        this.addMessage({id: Helpers.generateId(), message: message});
    };

    addMessage = (item) => {
        this.messageBuffer.push(item);
        if(this.isScrolled()){
            this.setState({newMessagesNotificationVisible: true});
        }
    };

    updateRoomList = () => {

        this.client.rooms().list((err, data) => {
            if(!err){
                let roomViews = data.rooms.map((room) => {
                    let roomStyles = [Styles.room];
                    roomStyles.push({flex:1, flexDirection: 'row'});
                    let onPress = () => {
                        this.joinRoom('sosa', room.name);
                        this.navigation.closeDrawer();
                    };

                    if(this.currentRoom !== null && room.id == this.currentRoom.id){
                        roomStyles.push(Styles.currentRoom);
                        onPress = () => {};
                    }
                    return  <View style={roomStyles} key={room.id} >
                                <Icon icon={['fas', 'campfire']} size={20} style={{flex: 1, marginRight:15, justifyContent: 'center'}}  onPress={onPress} />
                                <Text style={{flex: 1, fontSize: 16}}  onPress={onPress} >
                                     {room.title}
                                </Text>
                            </View>
                });

                this.navigationContext.addDrawerItem('room_list', (
                    <View style={{flex:1}} key={'room_list'}>
                        { roomViews }
                    </View>
                ));

                this.setState({rooms: data.rooms});
            }else{
                Helpers.showAlert('Error getting room list', err.message);
            }

        }, 'sosa');
    };

    joinRoom = (communityID, roomID, callback) => {

        this.client.rooms().join((err, room, userList) => {
            this.setState({userList: userList});
            this.updateUserList();

            if(err){
                Helpers.showAlert('Can\'t Join Room', err.message);

            }else{
                this.currentRoom = room;
                this.addStatus(`Joined room ${room.name}`);

                this.homeContext.addHeaderIcon('whos_online',['fal', 'users'], this.displayUserList);
            }

        }, communityID, roomID);
    };

    displayUserList = () => {
        if(this.currentRoom !== null){
            this.client.rooms().online((err, data) => {

                if(!err){
                    this.setState({userList: data});
                    this.updateUserList();
                    this.navigation.openDrawer();
                }else{
                    Helpers.showAlert('Error getting users',err.message );
                }

            }, 'sosa', this.currentRoom.name);
        }else{
            Helpers.showAlert('You\'re not in a room','Please join a room first!');
        }

    };

    connect = () => {
        let client = this.client;
        let middleware = this.client.middleware;

        middleware.clear();

        middleware.add({
            'receive_message': (message, client) => {
                this.addMessage(message);
                return message;
            },
            'after_authenticated': (authData, client) => {
                this.addStatus(`Connected to server with username: TheBritishAreComing`);
                this.setupBufferRenderTimer();

                this.setupConnectButton(true);

                this.updateRoomList();

                if(this.currentRoom !== null){
                    this.joinRoom(this.currentRoom.community_id, this.currentRoom.name);
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
                if(this.currentRoom && userData.community_id === this.currentRoom.community_id && userData.room_id === this.currentRoom.name){
                    this.addStatus(`${userData.nickname} joined`);
                }
            },
            'rooms/left': (userData) => {
                if(this.currentRoom && userData.community_id === this.currentRoom.community_id && userData.room_id === this.currentRoom.name){
                    this.addStatus(`${userData.nickname} left`);
                }
            }
        });

        client.connect();
    };

    disconnect = () => this.client.disconnect();

    addTag = (username) => {
        let text = this.state.messageInput;
        let tag = `@${username}`;

        if(text.length === 0){
            text = tag;
        }else{
            if(!/(.*)\s+$/.test(text)) {
                tag = ` ${tag}`;
            }
            text = `${text}${tag}`;
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
                let bufferState = this.messageBuffer;

                bufferState.forEach((message, index) => {
                    messages.unshift(message);
                    delete this.messageBuffer[index];
                });

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

    render() {
        return (
          <View style={{flex: 1}}>
            <View style={{flex: 1, padding: 10, backgroundColor: '#444442'}}>

                <FlatList
                    ref={(ref) => {this.scrollView = ref;}}
                    onScroll={this.chatMessagesOnScroll}
                    keyboardShouldPersistTaps={'always'}
                    inverted
                    data={this.state.messages}
                    extraData={this.state.messages}
                    keyExtractor={(item) => { return (item.id ? item.id.toString() : item._id); }}
                    renderItem={
                                ({item}) => {
                                    if(item instanceof Message){
                                        return  <View style={{flexDirection: 'row', marginTop:10}}>
                                            <View style={{marginRight: 10}}>
                                                <TouchableHighlight onPress={() => this.addTag(item.username)}>
                                                    <Image source={{uri : item.picture}}
                                                           style={{width: 32, height: 32, borderRadius: 32/2}}


                                                    />
                                                </TouchableHighlight>
                                            </View>
                                            <View style={{flex:1}}>
                                                <Text style={Styles.message_username}>{item.username}</Text>
                                                <HTML html={item.parsed_content}
                                                      tagsStyles={{ a: { color: '#7ac256' }}}
                                                      baseFontStyle={{color:'#ffffff'}}
                                                      renderers={{
                                                    spoiler: {renderer: (htmlAttribs, children, convertedCSSStyles, passProps) => (
                                                            <Text> {children} </Text>
                                                        )
                                                        , wrapper: 'Text'}
                                                }}/>
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
            </View>
            <View style={Styles.footer}>
                <MessageInput onChangeText={data => this.setState({ messageInput: data})} sendAction={this.sendMessage} value={this.state.messageInput} />
            </View>

          </View>
        );
  }
}
