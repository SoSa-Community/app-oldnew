import React, {Component} from 'react';
import Styles from './styles/chat'
import {Image, FlatList, Text, TextInput, View, Button, Modal, InteractionManager} from 'react-native';
import io from "socket.io-client";

import { SoSaConfig } from "../sosa/config";
import {ChatClient, Message, MessageParser} from 'sosa-chat-client';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


import HTML from 'react-native-render-html';
import Helpers from '../sosa/Helpers';

export class Chat extends Component {
    navigationContext = {};
    homeContext = {};
    navigation = {};

    state = {
        joinRoomModalVisible: false,
        roomListModalVisible: false,
        userListModalVisible: false,
        userList: [],
        messages: [],
        messageInput: '',
        rooms: []
    };

    username = '';
    currentRoom = null;

    client = new ChatClient({
        host: SoSaConfig.chat.server,
        api_key: SoSaConfig.chat.api_key
    }, io);

    constructor(props) {
        super();

        this.navigation = props.navigation;
        this.homeContext = props.homeContext;
        this.navigationContext = props.navigationContext;
    }

    componentDidMount() {
        this.setupConnectButton();
        this.connect();
    }

    setupConnectButton = (disconnect:false) => {
        let color = '#28a745';
        let text = 'Connect';
        let func = () => {
            this.connect();
            this.navigation.closeDrawer();
        };

        if(disconnect){
            color = '#dc3545';
            text = 'Disconnect';
            func = () => {
                this.disconnect();
                this.navigation.closeDrawer();
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

    sendMessage = () => {
        if(this.state.messageInput.length > 0){
            let message = this.state.messageInput;

            if(message === 'lorem'){
                message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac gravida libero. Pellentesque placerat ex neque, sed viverra sapien pretium in. Donec consectetur erat ac eros tincidunt tristique. Curabitur enim quam, porttitor eu augue ut, rhoncus euismod purus. Vivamus pulvinar sollicitudin justo, vitae ornare ligula porta a. Ut urna dui, aliquam et orci nec, fringilla accumsan orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
            }

            this.client.rooms().send(() => {}, this.currentRoom.community_id, this.currentRoom.name, message);
            this.setState({ messageInput: '' });
        }
    };

    addStatus = (message) => {
        this.addMessage({id: Helpers.generateId(), message: message});
    };

    addMessage = (item) => {
        let messages = this.state.messages;
        messages.unshift(item);
        this.setState({ messages: messages});
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
                                <FontAwesomeIcon icon={['fas', 'campfire']} size={20} style={{flex: 1, marginRight:15, justifyContent: 'center'}}  onPress={onPress} />
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
            if(err){
                Helpers.showAlert('Can\'t Join Room', err.message);

            }else{
                this.currentRoom = room;
                this.addStatus(`Joined room ${room.name}`);

                this.homeContext.addHeaderIcon('whos_online',['fal', 'users'], this.displayUserList);
            }

        }, communityID, roomID);
    };

    closeUserList = () => this.setState({userListModalVisible:false});
    displayUserList = () => {
        if(this.currentRoom !== null){
            this.client.rooms().online((err, data) => {

                if(!err){
                    this.setState({userList: data, userListModalVisible: true});
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
                this.addStatus(`Connected to server with username: ${authData.sessionData.nickname}`);

                this.setupConnectButton(true);

                this.updateRoomList();

                if(this.currentRoom !== null){
                    this.joinRoom(this.currentRoom.community_id, this.currentRoom.name);
                }else{
                    this.joinRoom('sosa', 'general');
                }
                return authData;
            },
            'disconnect': (message, client) => {
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

    render() {
        return (
          <View style={{flex: 1}}>
            <View style={{flex: 1, padding: 10, backgroundColor: '#444442'}}>
                <FlatList
                    inverted
                    data={this.state.messages}
                    extraData={this.state.messages}
                    keyExtractor={(item) => { return (item.id ? item.id.toString() : item._id); }}
                    renderItem={
                                ({item}) => {
                                    if(item instanceof Message){
                                        return  <View style={{flexDirection: 'row', marginTop:10}}>
                                            <View style={{marginRight: 10}}>
                                                <Image source={{uri : item.picture}}
                                                       style={{width: 32, height: 32, borderRadius: 32/2}} />
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
            </View>
            <View style={Styles.footer}>
                <TextInput style={{height: 40, backgroundColor: '#ffffff', flex:1}}
                           placeholder="Enter your message"
                           onChangeText={data => this.setState({ messageInput: data})}
                           value={this.state.messageInput}
               />
                <Button
                    title="Send"
                    onPress={this.sendMessage}
                />
            </View>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.userListModalVisible}>
              <View style={{flex: 1, paddingTop: 10}}>
                  <View>
                      <Text style={{textAlign: 'center', fontSize:24, paddingBottom: 10}}>Online</Text>
                  </View>
                  <View style={{flex:1}}>
                      <FlatList
                          data={this.state.userList}
                          extraData={this.state.userList}
                          keyExtractor={(item) => { return `${item.user_id}`; }}
                          renderItem={
                              ({item}) => {
                                  return <Text style={Styles.user}>{item.nickname}</Text>
                              }
                          }
                      />
                  </View>
                  <View>
                      <Button
                          title="Close"
                          onPress={this.closeUserList}
                      />
                  </View>
              </View>
            </Modal>

          </View>
        );
  }
}
