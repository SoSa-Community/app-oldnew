/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TextInput, View, Button} from 'react-native';
import io from "socket.io-client";
import { SoSaConfig } from "./sosa/config";

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
    }
});

export default class SoSa extends Component {

    constructor(props) {
        super();

        this.userId = 0;
        this.username = 'TheBritishAreComing';
        this.room = 'general';

        this.messages = [];

        this.state = {
            messages: [],
            messageInput: ''
        }
    }

    sendMessage = () => {
        this.socket.emit('message', {room: this.room, msg: this.state.messageInput});
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

    componentDidMount() {
        this.setState({ messages: [...this.messages] });
        console.log('Mounted', this.generateRand());
    }

    connect = () => {
        let component = this;

        this.socket = io(SoSaConfig.chat.server, {
            'reconnection': false,
            'transports': ['websocket'],
            'pingTimeout': 30000
        });

        this.socket.on('error', (error) => {
            console.log('error', error);
        });

        this.socket.on('connect_error', (error) => {
            console.log('connect_error', error);
        });

        this.socket.on('connect_timeout', (error) => {
            console.log('connect_timeout', error);
        });

        this.socket.on('connect', () => {
            console.log('connected');

            this.addMessage(this.generateId(), 'Connected to server', '', 'status');
            this.socket.emit('join', {room:this.room});
        });

        this.socket.on('disconnect', (msg) => {
            this.addMessage(this.generateId(), 'Disconnected from server', '', 'status');
            console.log(msg);
        })

        this.socket.on("message", msg => {
            console.log('message received');
            console.log(msg);

            component.addMessage(component.generateId(), msg, this.username);
        });
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
            <View style={{flexDirection: 'row'}}>
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
