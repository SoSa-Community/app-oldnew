/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TextInput, View, Button, Alert, TouchableHighlight, Modal} from 'react-native';
import io from "socket.io-client";
import { SoSaConfig } from "./sosa/config";
import { ChatClient } from './sosa/chat-client/module';

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#121211',
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 24 : 0
    },

    message: {
        color: '#ffffff',
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

export default class SoSa extends Component {

    userId = 0;
    username = '';
    messages = [];

    client = new ChatClient({
        host: SoSaConfig.chat.server,
        api_key: SoSaConfig.chat.api_key
    }, io);

    state = {
        joinRoomModalVisible: false,
        messages: [],
        messageInput: ''
    };

    constructor(props) {
        super();

    }

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

    showJoinRoomDialog = () => {
        this.setState({joinRoomModalVisible: true});
    };

    joinRoom = (communityID, roomID, callback) => {
        this.client.rooms().join((err, room) => {
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
                console.log('Room', room.name);
                this.addMessage(this.generateId(), `Joined room ${room.name}`, '', 'status');
            }

        }, communityID, roomID);
    };

    componentDidMount() {
        this.setState({ messages: [...this.messages] });
        console.log('Mounted', this.generateRand());
    }

    connect = () => {
        let client = this.client;
        let middleware = this.client.middleware;

        middleware.add('receive_message', (message, client) => {
            this.addMessage(this.generateId(), message.parsed_content, message.nickname);
            return message;
        },'some_signature');

        middleware.add('after_authenticated', (authData, client) => {
            this.addMessage(this.generateId(), 'Connected to server', '', 'status');
            return authData;

        });

        middleware.add('disconnected', (message, client) => {
            this.addMessage(this.generateId(), 'Disconnected from server', '', 'status');
            console.log(msg);
            return message;
        });

        client.connect();
    };

    render() {
        return (
          <View style={styles.header}>
            <View>
                <Text style={{textAlign: 'left', color: '#fff', fontSize: 32, padding: 10}}>SoSa</Text>
                <Button
                    title="Connect"
                    onPress={this.connect}
                />
                <Button
                    title='Join General Chat'
                    onPress={() => {this.joinRoom('sosa','general')}}
                />
            </View>

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
                                        return <Text style={styles.message}>{item.message}</Text>
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
                    style={{flex:1}}
                />
            </View>

          </View>
        );
  }
}
