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
    mainView: {
        backgroundColor: '#121211',
        flex: 1
    },
    item: {
        color: '#ffffff',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingVertical: 10
    }
});

export default class SoSa extends Component {

    constructor(props) {
        super();

        this.userId = 0;
        this.username = 'TheBritishAreComing';
        this.room = 'general';

        this.messages = [
            {
                id: this.generateId(),
                message:'hows life dan',
                username: 'ShitTierBrit'
            },
            {
                id: this.generateId(),
                message:'not too bad, today is an interesting day so far',
                username: 'Danda'
            },
            {
                id: this.generateId(),
                message: 'I think you can get laird too',
                username: 'omikone'
            }
        ];

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
        return `${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}-${this.generateRand()}`;
    };

    componentDidMount() {
        this.setState({ messages: [...this.messages] });
        console.log('Mounted', this.generateRand());
    }

    connect = () => {
        console.log(SoSaConfig);
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
            this.socket.emit('join', {room:this.room});
        });

        this.socket.on('disconnect', (msg) => {
            console.log(msg);
        })

        this.socket.on("message", msg => {
            console.log('message received');
            console.log(msg);
            this.messages.push({
                id: this.generateId(),
                message : msg,
                username: this.username
            });

            this.setState({ messages: [...this.messages]});
        });
    };

    render() {
        return (
          <View style={styles.mainView}>
            <View>
              <Text style={{textAlign: 'left', color: '#fff', fontSize: 32, padding: 10}}>SoSa</Text>
            </View>
            <View style={{flex: 1, padding: 10, backgroundColor: '#444442'}}>
                <FlatList
                    data={this.state.messages}
                    extraData={this.state.messages}
                    keyExtractor={(item) => { item.id }}
                    renderItem={({item}) => <Text style={styles.item}>{item.message}</Text>}
                />
            </View>
            <View>
                <TextInput style={{height: 40, backgroundColor: '#ffffff'}}
                           placeholder="Enter your message"
                           onChangeText={data => this.setState({ messageInput: data})}
                           value={this.state.messageInput}
               />
                <Button
                    title="Send"
                    onPress={this.sendMessage}
                />

                <Button
                    title="Connect"
                    onPress={this.connect}
                />
            </View>

          </View>
        );
  }
}
