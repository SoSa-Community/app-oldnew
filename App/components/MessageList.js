import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';

import { Message } from 'sosa-chat-client';
import MessageItem from './chat/MessageItem';

import Styles from '../screens/styles/chat';
import Helpers from '../sosa/Helpers';
import { useApp } from '../context/AppContext';

let scrollOffset = {y:0, x:0};
let messageBuffer = [];
let bufferRenderTimer = null;
let bufferRenderRunning = false;

const MessageList = forwardRef(({onFacePress, onLongFacePress, onMessageAdded, onScroll, addTag, uploadedImages, setUploadedImages, setPreviewEmbed, preferences}, ref) => {
    
    const { session } = useApp();
    let scrollView = useRef();
    
    const [ messages, setMessages ] = useState([]);
    
    const setupBufferRenderTimer = () => {
        bufferRenderTimer = setTimeout(bufferRender, 500);
    };
    
    const cancelBufferRenderTimer = () => {
        clearTimeout(bufferRenderTimer);
    }
    
    const resetBuffer = () => { messageBuffer = [] };
    
    const bufferRender = () => {
        clearTimeout(bufferRenderTimer);
        
        if(!bufferRenderRunning){
            bufferRenderRunning = true;
            if(scrollOffset.y < 35){
                let originalLength = parseInt(messages.length, 10);
                let bufferState = messageBuffer.splice(0);
                resetBuffer();
                
                let updatedMessages = [...bufferState, ...messages];
                
                if(updatedMessages.length > 100) updatedMessages.splice(50, updatedMessages.length - 1);
                if(updatedMessages.length !== originalLength) setMessages(updatedMessages);
            }
            bufferRenderRunning = false;
            setupBufferRenderTimer();
        }else{
            setupBufferRenderTimer();
        }
    };
    
    const isScrolled = () => scrollOffset.y > 35;
    
    const scrollToBottom = () => {
        try{
            scrollView?.current?.scrollToIndex({index:0, animated: true});
        }
        catch (e) {
        
        }
        
    };
    
    const handleScroll = (event) => {
        scrollOffset = event.nativeEvent.contentOffset;
    };
    
    const renderItem = ({item}) => {
        if(item instanceof Message){
            const { show_separators, show_slim } = preferences;
            
            return <MessageItem
                message={item}
                onFacePress={() => onFacePress(item)}
                onLongFacePress={() => onLongFacePress(item)}
                onUsernamePress={() => addTag(item.nickname)}
                myNickname={session.nickname}
                showSeparator={show_separators}
                showSlim={show_slim}
            />
        }else{
            return <Text style={Styles.status}>{item.message}</Text>
        }
    };
    
    const addMessage = (item, forceUpdate) => {
        console.debug('Message', item);
        return new Promise((resolve, reject) => {
            if (!item.id) {
                if (item.uuid) item.id = item.uuid;
                else if (item._id) item.id = item._id;
                else item.id = Helpers.generateId();
            }
            
            messageBuffer.push(item);
            if (forceUpdate) bufferRender();
            
            onMessageAdded(isScrolled(), item);
            resolve(item);
        });
    };
    
    useImperativeHandle(ref, () => ({
        messages,
        setMessages,
        scrollToBottom,
        addMessage,
        setupBufferRenderTimer,
        cancelBufferRenderTimer,
        resetBuffer,
    }))
    
    return (
        <>
            <FlatList
                ref={scrollView}
                onScroll={handleScroll}
                keyboardShouldPersistTaps={'handled'}
                inverted
                initialNumToRender={10}
                maxToRenderPerBatch={12}
                updateCellsBatchingPeriod={25}
                windowSize={21}
                removeClippedSubviews={true}
                data={messages}
                extraData={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={Styles.message_list}
            />
        </>
    )
});

export default MessageList;
