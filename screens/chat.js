import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TextInput, View, Button, Alert, Modal} from 'react-native';
import io from "socket.io-client";
import { SoSaConfig } from "../sosa/config";
import { ChatClient } from '../sosa/chat-client/module';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


const styles = StyleSheet.create({
    message: {
        color: '#ffffff',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 10
    },

    message_username: {
        color: '#ffffff',
        paddingTop: 10,
        fontWeight: 'bold'
    },

    room: {
        textAlign: 'center',
        color: '#000000',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingLeft: 10
    },

    currentRoom: {
        textAlign: 'center',
        backgroundColor: 'red'
    },

    user: {
        textAlign: 'center',
        color: '#000000',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingVertical: 10
    },

    status: {
        color: '#a6a6a6',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingVertical: 10,
        textAlign: 'center'
    },

    footer: {
        paddingBottom: Platform.OS === 'ios' ? 24 : 0,
        flexDirection: 'row'
    }
});

export class Chat extends Component {

    userId = 0;
    username = '';
    messages = [];
    message = '';
    currentRoom = null;

    client = new ChatClient({
        host: SoSaConfig.chat.server,
        api_key: SoSaConfig.chat.api_key
    }, io);

    state = {
        joinRoomModalVisible: false,
        roomListModalVisible: false,
        userListModalVisible: false,
        userList: [],
        messages: [],
        messageInput: '',
        rooms: [],
        connectButtonText:'connect'
    };

    addHeaderIcon = (id, icon, onPress) => {};
    addDrawerItem = (id, item) => {};

    constructor(props) {
        super();
        console.log(props);

        this.addHeaderIcon = props.addHeaderIcon;
        this.addDrawerItem = props.addDrawerItem;
    }

    componentDidMount() {
        this.setState({ messages: [...this.messages] });

        this.addDrawerItem('room_list', (<View style={{flex:1}} key={'room_list'} />));

        this.setupConnectButton();
        this.connect();
    }

    setupConnectButton = (disconnect:false) => {
        let color = '#28a745';
        let text = 'Connect';
        let func = this.connect;

        if(disconnect){
            color = '#dc3545';
            text = 'Disconnect';
            func = this.disconnect;
        }

        this.addDrawerItem('connect', (<View style={{flex:1}} key={'connect'}>
            <Button
                color={color}
                title={text}
                onPress={func}
                style={{justifyContent:'flex-end'}}
            />
        </View>));
    };

    sendMessage = () => {
        this.client.rooms().send(() => {}, 'sosa', 'general', this.state.messageInput);
        this.setState({ messageInput: '' });
    };

    generateRand = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    generateId = () => {
        let id = `${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}`;
        console.log(id);
        return id;
    };

    addMessage = (id, message, username, type='message') => {
        this.messages.push({
            id: id,
            message : message,
            username: username,
            type: type
        });

        this.setState({ messages: [...this.messages]});
    };

    updateRoomList = () => {

        this.client.rooms().list((err, data) => {
            if(!err){
                let roomViews = data.rooms.map((room) => {
                    let roomStyles = [styles.room];
                    roomStyles.push({flex:1, flexDirection: 'row'});
                    let onPress = () => this.joinRoom('sosa', room.name);

                    if(this.currentRoom !== null && room.id == this.currentRoom.id){
                        roomStyles.push(styles.currentRoom);
                        onPress = () => {};
                    }
                    return  <View style={roomStyles} key={room.id} >
                                <FontAwesomeIcon icon={['fas', 'campfire']} size={20} style={{flex: 1, marginRight:15, justifyContent: 'center'}}  onPress={onPress} />
                                <Text style={{flex: 1, fontSize: 16}}  onPress={onPress} >
                                     {room.title}
                                </Text>
                            </View>
                });

                this.addDrawerItem('room_list', (
                    <View style={{flex:1}} key={'room_list'}>
                        { roomViews }
                    </View>
                ));

                this.setState({rooms: data.rooms});
            }else{
                Alert.alert(
                    'Error getting room list',
                    err.message,
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: true},
                );
            }

        }, 'sosa');
    };

    closeRoomList = () => {
        this.setState({roomListModalVisible:false});
    };

    joinRoom = (communityID, roomID, callback) => {
        this.closeRoomList();
        this.client.rooms().join((err, room, userList) => {
            this.setState({userList: userList});
            if(err){
                Alert.alert(
                    'Can\'t Join Room',
                    err.message,
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: true},
                );
            }else{
                this.currentRoom = room;
                this.addMessage(this.generateId(), `Joined room ${room.name}`, '', 'status');
                this.addHeaderIcon('whos_online',['fal', 'users'], this.displayUserList);
            }

        }, communityID, roomID);
    };

    closeUserList = () => {
        this.setState({userListModalVisible:false});
    };

    displayUserList = () => {
        if(this.currentRoom !== null){
            this.client.rooms().online((err, data) => {
                if(!err){
                    this.setState({userListModalVisible: true, user_list: data});
                }else{
                    Alert.alert(
                        'Error getting users',
                        err.message,
                        [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        {cancelable: true},
                    );
                }

            }, 'sosa', this.currentRoom.name);
        }else{
            Alert.alert(
                'You\'re not in a room',
                'Please join a room first!',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: true},
            );
        }

    };

    connect = () => {
        let client = this.client;
        let middleware = this.client.middleware;

        middleware.clear();

        middleware.add('receive_message', (message, client) => {
            this.addMessage(this.generateId(), message.parsed_content, message.nickname);
            return message;
        },'some_signature');

        middleware.add('receive_message', (message, client) => {
            this.addMessage(this.generateId(), message.parsed_content, message.nickname);
            return message;
        },'some_signature');

        middleware.add('after_authenticated', (authData, client) => {
            this.addMessage(this.generateId(),
                `Connected to server with username: ${authData.sessionData.nickname}`,
                '',
                'status'
            );

            this.setupConnectButton(true);

            this.updateRoomList();

            if(this.currentRoom !== null){
                console.log(this.currentRoom);
                this.joinRoom(this.currentRoom.community_id, this.currentRoom.name);
            }
            return authData;
        });

        middleware.add('disconnected', (message, client) => {
            this.addMessage(this.generateId(), 'Disconnected from server', '', 'status');
            this.setupConnectButton();

            return message;
        });

        client.connect();
    };

    disconnect = () => {
        this.client.disconnect();
    };

    render() {
        return (
          <View style={{flex: 1}}>
            <View style={{flex: 1, padding: 10, backgroundColor: '#444442'}}>
                <FlatList
                    data={this.state.messages}
                    extraData={this.state.messages}
                    keyExtractor={(item) => { return item.id; }}
                    renderItem={
                                ({item}) => {
                                    if(item.type === 'status'){
                                        return <Text style={styles.status}>{item.message}</Text>
                                    }else{
                                        return  <View>
                                                    <Text style={styles.message_username}>{item.username}</Text>
                                                    <Text style={styles.message}>{item.message}</Text>
                                                </View>
                                    }
                                }
                    }
                />
            </View>
            <View style={styles.footer}>
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
                                  return <Text style={styles.user}>{item.nickname}</Text>
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
