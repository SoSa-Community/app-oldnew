import React, {
	useEffect,
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { FlatList, Text } from 'react-native';

import { Message } from '../services/API/entities/Message';
import MessageItem from './chat/MessageItem';

import Styles from '../screens/styles/chat';
import Helpers from '../sosa/Helpers';
import { useApp } from '../context/AppContext';

let scrollOffset = { y: 0, x: 0 };
let messageBuffer = [];
let bufferRenderTimer = null;
let bufferRenderRunning = false;

const MessageList = forwardRef(
	(
		{
			onFacePress,
			onLongFacePress,
			onMessageAdded,
			onScroll,
			addTag,
			uploadedImages,
			setUploadedImages,
			setPreviewEmbed,
			preferences,
		},
		ref,
	) => {
		const { session } = useApp();
		let scrollView = useRef();

		const [messages, setMessages] = useState([]);

		const setupBufferRenderTimer = () => {
			//bufferRenderTimer = setTimeout(bufferRender, 1000);
		};

		const cancelBufferRenderTimer = () => {
			clearTimeout(bufferRenderTimer);
		};

		const resetBuffer = () => {
			messageBuffer = [];
		};

		const bufferRender = () => {
			clearTimeout(bufferRenderTimer);
			console.debug('Buffer render', scrollOffset);
			if (!bufferRenderRunning) {
				bufferRenderRunning = true;
				if (scrollOffset.y < 35) {
					let updatedMessages = [];

					let originalLength = parseInt(messages.length, 10);
					let bufferState = messageBuffer.splice(0);
					resetBuffer();

					bufferState.forEach((message) =>
						updatedMessages.push(message),
					);
					messages.forEach((message) =>
						updatedMessages.push(message),
					);

					console.debug(updatedMessages, messages);

					if (updatedMessages.length > 100) {
						updatedMessages.splice(50, updatedMessages.length - 1);
					}
					if (updatedMessages.length !== originalLength) {
						console.debug('setting messages', updatedMessages);
						setMessages(updatedMessages);
					}
				}
				bufferRenderRunning = false;
				setupBufferRenderTimer();
			} else {
				setupBufferRenderTimer();
			}
		};

		const isScrolled = () => scrollOffset.y > 35;

		const scrollToBottom = () => {
			try {
				scrollView?.current?.scrollToIndex({
					index: 0,
					animated: true,
				});
			} catch (e) {}
		};

		const handleScroll = (event) => {
			scrollOffset = event.nativeEvent.contentOffset;
		};

		const renderItem = ({ item }) => {
			if (item instanceof Message) {
				const { show_separators, show_slim } = preferences;

				return (
					<MessageItem
						message={item}
						onFacePress={() => onFacePress(item)}
						onLongFacePress={() => onLongFacePress(item)}
						onUsernamePress={() => addTag(item?.user?.nickname)}
						myNickname={session.nickname}
						showSeparator={show_separators}
						showSlim={show_slim}
					/>
				);
			} else {
				return <Text style={Styles.status}>{item?.message}</Text>;
			}
		};

		const addMessage = (item, forceUpdate) => {
			return new Promise((resolve, reject) => {
				if (!item?.id) {
					if (item?.uuid) {
						item.id = item.uuid;
					} else if (item?._id) {
						item.id = item._id;
					} else {
						item.id = Helpers.generateId();
					}
				}

				const updatedMessages = [...messages];
				updatedMessages.unshift(item);
				setMessages(updatedMessages);

				/*
            messageBuffer.push(item);
            if (forceUpdate) bufferRender();*/

				onMessageAdded(isScrolled(), item);
				resolve(item);
			});
		};

		useEffect(() => {
			console.debug('resetting');
		}, []);

		useImperativeHandle(ref, () => ({
			setMessages,
			scrollToBottom,
			addMessage,
			setupBufferRenderTimer,
			cancelBufferRenderTimer,
			resetBuffer,
		}));

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
					keyExtractor={(item) => item?.id}
					renderItem={renderItem}
					style={Styles.message_list}
				/>
			</>
		);
	},
);

export default MessageList;
