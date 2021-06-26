import React, { useRef, useState, useEffect } from 'react';
import {
	Text,
	View,
	TouchableHighlight,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Keyboard,
	ImageBackground,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native';

import { useApp } from '../../../context/AppContext';
import { useAuthenticatedNavigation } from '../../../context/AuthenticatedNavigationContext';
import { useAPI } from '../../../context/APIContext';

import Helpers from '../../../sosa/Helpers';

import MessageInput from '../../../components/MessageInput';
import { UserList } from '../../../components/chat/UserList';
import RoomItem from '../../../components/chat/RoomItem';
import ProfileModal from '../../../components/ProfileModal';
import UploadPreview from '../../../components/UploadPreview';
import MessageList from '../../../components/MessageList';

import Styles from '../../styles/chat';

let settingUp = false;
let coolDown = false;
let coolDownTimer = null;
let slowDownCounter = 0;
let slowDownTimer = null;

let tagPosition = { start: 0, end: 0 };
let messageInputPosition = { start: 0, end: 0 };

let messageInput = ''; //We use this as well as state because setState doesn't update immediately and can create a race condition

let selectedProfile = null;
let componentMounted = false;

let community = 'sosa';

const ChatScreen = ({ navigation, showMemberProfile }) => {
	const { middleware, modals, session } = useApp();
	const {
		services: { chat: chatService, general: generalService },
	} = useAPI();

	const {
		update: updateDrawerItem,
		closeDrawers,
		addHeaderIcon,
		openRightDrawer,
	} = useAuthenticatedNavigation();

	const messageList = useRef();

	const [userList, setUserList] = useState([]);

	const [tagSearchData, setTagSearchData] = useState([]);
	const [messageState, setMessageState] = useState('');
	const [previewEmbed, setPreviewEmbed] = useState(null);
	const [uploadedImages, setUploadedImages] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [scrolling, setScrolling] = useState(true);
	const [newMessagesNotificationVisible, setNewMessagesNotificationVisible] =
		useState(false);
	const [slowDownNotifierVisible, setSlowDownNotifierVisible] =
		useState(false);

	const [currentRoom, setCurrentRoom] = useState(null);
	const [canSend, setCanSend] = useState(true);
	const [fuckWith, setCanFuckWith] = useState(false);
	const [uploading, setUploading] = useState(false);

	const [preferences, setPreferences] = useState({
		touch_face_for_profile: false,
		show_separators: false,
		show_slim: false,
	});

	const setMessageInput = (data) => {
		messageInput = data;
		setMessageState(data);
		if (Platform.OS === 'ios') {
			checkForTags();
		}
	};

	const addMessage = (message, forceUpdate) => {
		const { addMessage } = messageList?.current;
		return addMessage(message, forceUpdate);
	};

	const addStatus = (message) => {
		return addMessage({ id: Helpers.generateId(), message }, true);
	};

	const setupChat = () => {
		if (!settingUp) {
			settingUp = true;
			messageList?.current?.setupBufferRenderTimer();

			updateRoomList().finally(() => {
				if (currentRoom) {
					joinRoom(currentRoom?.community_id, currentRoom?.name);
				}
				settingUp = false;
			});
		}
	};

	const updateUserList = () => {
		updateDrawerItem(
			'user_list',
			<View style={{ flex: 1 }} key={'user_list'}>
				<UserList
					userList={userList}
					onPress={({ nickname }) => {
						closeDrawers();
						addTag(nickname);
					}}
					onLongPress={({ user_id }) => showMemberProfile(user_id)}
				/>
			</View>,
			true,
		);
	};

	const preferencesChanged = (newPreferences) => {
		let stateChanges = { ...preferences };
		let updateState = false;

		for (let key in newPreferences) {
			if (newPreferences.hasOwnProperty(key)) {
				let value = newPreferences[key];
				if (key.startsWith('chat:')) {
					key = key.replace('chat:', '');
					if (
						!stateChanges.hasOwnProperty(key) ||
						value !== stateChanges[key]
					) {
						updateState = true;
						stateChanges[key] = value;
					}
				}
			}
		}
		if (updateState) {
			setPreferences(stateChanges);
		}
	};

	const sendMessage = (messageToSend) => {
		const { community_id, name } = currentRoom;

		if (!coolDown && slowDownCounter < 3) {
			let message = (messageToSend || messageState).trim();

			if (uploadedImages.length) {
				const mappedImageURLs = uploadedImages
					.map(({ uri }) => uri)
					.join(' ');

				message = `${message} ${mappedImageURLs}`;
			}

			if (message.length > 0) {
				coolDown = true;

				clearTimeout(coolDownTimer);
				clearTimeout(slowDownTimer);

				coolDownTimer = setTimeout(
					() => (coolDown = false),
					slowDownCounter * 200,
				);
				slowDownTimer = setTimeout(() => {
					slowDownCounter = 0;
					setCanSend(true);
					setCanFuckWith(false);
					setSlowDownNotifierVisible(false);
				}, 5000);
				slowDownCounter++;

				chatService.rooms
					.send(community_id, name, message)
					.then((message) => addMessage(message))
					.catch((error) => console.debug(error));

				setUploadedImages([]);
				setMessageInput('');
				messageList?.current?.scrollToBottom();
			}
		} else {
			slowDownCounter++;
			if (slowDownCounter > 3) {
				setSlowDownNotifierVisible(true);
				setCanSend(false);
				setCanFuckWith(slowDownCounter > 4);
			}
		}
	};

	const renderRoomList = (updatedRoomList) => {
		if (!updatedRoomList) {
			updatedRoomList = [...rooms];
		}

		let roomViews = updatedRoomList.map((room) => {
			return (
				<RoomItem
					key={room.id}
					onPress={() => {
						if (!currentRoom || currentRoom?.name !== room.name) {
							joinRoom(community, room.name);
						}
						navigation?.navigate('Chat');
						closeDrawers();
					}}
					room={room}
					active={currentRoom && room.id === currentRoom?.id}
				/>
			);
		});

		updateDrawerItem(
			'room_list',
			<View style={{ flex: 1 }} key={'room_list'}>
				<View style={{ margin: 8 }}>
					<Text style={{ fontSize: 16, color: '#fff' }}>Rooms</Text>
				</View>
				<ScrollView style={{ flex: 1 }}>{roomViews}</ScrollView>
			</View>,
		);
	};

	const updateRoomList = () => {
		return chatService.rooms
			.list(community)
			.then((rooms) => {
				setRooms(rooms);
				return rooms;
			})
			.catch((error) => {
				console.info('App::updateRoomList::error', error);
				modals?.create('Error getting room list', error);
				throw error;
			});
	};

	const joinRoom = (communityID, roomID) => {
		chatService.rooms
			.join(communityID, roomID)
			.then(({ room, userList, history }) => {
				sortUserList(userList);
				setUserList(userList);
				messageList?.current?.setMessages([...history]);
				messageList?.current?.resetBuffer();

				setCurrentRoom(room);
			})
			.catch((error) => modals?.create("Can't Join Room", error));
	};

	const sortUserList = (userList) => {
		userList.sort((a, b) =>
			a.nickname.localeCompare(b.nickname, [], {
				numeric: true,
				ignorePunctuation: true,
			}),
		);
	};

	const disconnect = () => this.apiClient.disconnect();

	const addTag = (username, usingTagList) => {
		let text = messageInput;
		let tag = `@${username}`;

		if (text.length === 0) {
			text = `${tag} `;
		} else {
			let textLength = text.length;
			let caretStart = messageInputPosition.start;
			let caretEnd = messageInputPosition.end;

			if (usingTagList && tagPosition?.end > 0) {
				caretStart = tagPosition?.start;
				caretEnd = tagPosition?.end;
				tag += ' ';
			}

			let part1 = '';
			let part2 = '';

			if (caretStart === caretEnd) {
				part1 = text.substr(0, caretEnd);
				part2 = text.substr(caretEnd, textLength);

				if (part1.length >= 0 && caretEnd !== 0) {
					if (!/(.*)\s+$/.test(part1)) {
						part1 += ' ';
					}
				}

				if (part2.length >= 1) {
					if (!/^\s+(.*)$/.test(part2)) {
						part2 = ` ${part2}`;
					}
				} else {
					tag += ' ';
				}
			} else {
				part1 = text.substr(0, caretStart);
				part2 = text.substr(caretEnd, textLength);
			}
			text = `${part1}${tag}${part2}`;
		}
		setMessageInput(text);
	};

	const buildWrapper = (component) => {
		if (Platform.OS === 'ios') {
			return (
				<KeyboardAvoidingView
					style={{ flex: 1, backgroundColor: '#121111' }}
					behavior="padding"
					keyboardVerticalOffset="62">
					{component}
				</KeyboardAvoidingView>
			);
		} else {
			return (
				<View style={{ flex: 1 }} behavior="padding">
					{component}
				</View>
			);
		}
	};

	const messageInputSelectionChange = (event) => {
		messageInputPosition = event?.nativeEvent?.selection;
	};

	const checkForTags = () => {
		let { end } = messageInputPosition;
		let atIndex = messageInput.lastIndexOf('@', end);
		let matches = [];

		tagPosition = { start: 0, end: 0 };

		if (atIndex !== -1) {
			let space = messageInput.indexOf(' ', atIndex);
			if (space === -1) {
				space = messageInput.length;
			}

			if (space >= end) {
				let part = messageInput
					.substring(atIndex + 1, space)
					.trim()
					.toLowerCase();
				let searchArray = [...userList];
				searchArray.forEach((user) => {
					if (
						matches.length < 3 &&
						user.nickname.toLowerCase().includes(part)
					) {
						matches.push(user);
					}
				});
				tagPosition = { start: atIndex, end: space };
			}
		}
		setTagSearchData(matches);
	};

	const onFacePress = (message) => {
		const { touch_face_for_profile } = preferences;
		!touch_face_for_profile
			? addTag(message?.user?.nickname)
			: onLongFacePress(message);
	};

	const onLongFacePress = (message) => {
		showMemberProfile(message?.user?.user_id);
	};

	const addListeners = () => {
		middleware.clear('chat');
		middleware.add('chat', {
			settings_update: preferencesChanged,
			api_event: (packet) => {
				const { type, data } = packet;

				return new Promise((resolve, reject) => {
					if (type === 'chat/message') {
						return addMessage(data);
					}

					if (type === 'chat/rooms/join') {
						if (currentRoom) {
							return addStatus(`${data.nickname} joined`).then(
								() => {
									let userList = [...userList];
									let add = true;
									userList.forEach((user, index) => {
										if (user.nickname === data.nickname) {
											add = false;
										}
									});
									if (add) {
										userList.push(data);
										sortUserList(userList);
										setUserList(userList);
									}
								},
							);
						} else {
							resolve();
						}
					} else if (type === 'chat/rooms/leave') {
						if (currentRoom) {
							return addStatus(`${data.nickname} left`).then(
								() => {
									let userList = [...userList];

									userList.forEach((user, index) => {
										if (user.nickname === data.nickname) {
											delete userList[index];
										}
									});

									sortUserList(userList);
									setUserList(userList);
									resolve();
								},
							);
						} else {
							resolve();
						}
					}
				}).finally(() => packet);
			},
			api_disconnected: (reason) => {
				return new Promise((resolve, reject) => {
					messageList?.current?.cancelBufferRenderTimer();

					addStatus('Disconnected from server').finally(() =>
						resolve(reason),
					);
				});
			},
			api_authenticated: () => {
				return new Promise((resolve) => {
					setupChat();
					resolve();
				});
			},
		});
	};

	const renderImageList = () => {
		const images = uploadedImages.map((imageData, index) => {
			if (imageData) {
				const { image, uri, percentage } = imageData;
				if (!image) {
					return;
				}

				const deleteImage = () => {
					let images = [...uploadedImages];
					images.splice(index, 1);
					setUploadedImages(images);
				};

				const defaultSize = 64;

				let width = defaultSize;
				if (percentage < 100) {
					width =
						Math.floor((percentage / 100) * width - defaultSize) *
						-1;
				}

				return (
					<TouchableOpacity
						key={index}
						style={{
							margin: 2,
							borderRadius: defaultSize / 2,
							overflow: 'hidden',
						}}
						onPress={() => {
							uri && setPreviewEmbed(imageData);
						}}
						onLongPress={() => {
							uri && deleteImage(index);
						}}>
						<ImageBackground
							source={{ uri: image }}
							style={{
								height: defaultSize,
								width: defaultSize,
								resizeMode: 'contain',
							}}
							imageStyle={{ borderRadius: defaultSize / 2 }}>
							<View
								style={[
									{
										backgroundColor: 'rgba(0, 0, 0, 0.30)',
										position: 'absolute',
										top: 0,
										right: 0,
									},
									{ height: defaultSize, width },
								]}
							/>
							{percentage < 100 && (
								<ActivityIndicator
									color="#fff"
									size="large"
									style={{
										alignSelf: 'center',
										flex: 1,
										position: 'absolute',
										top: 0,
										left: 0,
										height: '100%',
										width: '100%',
									}}
								/>
							)}
						</ImageBackground>
					</TouchableOpacity>
				);
			}
		});
		return (
			<View style={{ flexDirection: 'row', paddingBottom: 2 }}>
				{images}
			</View>
		);
	};

	const handleUpload = () => {
		let image = {
			id: Helpers.generateId(),
			uri: '',
			image: '',
			percentage: 0,
		};

		const updateState = () => {
			let images = [...uploadedImages];
			let indx = images.length;

			images.forEach((item, index) => {
				if (item.id === image.id) {
					indx = index;
				}
			});

			images[indx] = image;
			setUploadedImages(images);
		};

		Helpers.uploadFile(
			modals.create,
			generalService,
			community,
			(uploading) => setUploading(uploading),
			({ uri, fileName, type, data }) =>
				new Promise((resolve) => {
					image.image = `data:${type};base64,${data}`;
					updateState();
					resolve();
				}),
		)
			.then(({ uris, tag, uuid }) => {
				image.uri = uris[0];
				image.percentage = 100;
				updateState();
			})
			.catch((error) => {
				const index = uploadedImages.indexOf(image);
				if (index !== -1) {
					const images = [...uploadedImages];
					images.splice(index, 1);
					setUploadedImages(images);
				}
			})
			.finally(() => setUploading(false));
	};

	useEffect(() => {
		addListeners();
		setupChat();
	}, []);

	useEffect(() => updateUserList(), [userList]);
	useEffect(() => {
		if (currentRoom) {
			const displayUserList = () => {
				if (currentRoom !== null) {
					Keyboard.dismiss();
					openRightDrawer();
				} else {
					modals?.create(
						"You're not in a room",
						'Please join a room first!',
					);
				}
			};

			addStatus(`Joined room ${currentRoom?.name}`).finally(() => {
				addHeaderIcon({
					id: 'whos_online',
					icon: ['fal', 'users'],
					onPress: displayUserList,
				});
			});
		}
	}, [currentRoom]);

	useEffect(() => {
		if (Array.isArray(rooms) && rooms.length) {
			if (!currentRoom) {
				const [room] = rooms;
				const { community_id, name } = room;
				joinRoom(community_id, name);
			}
			renderRoomList(rooms);
		}
	}, [rooms]);

	return buildWrapper(
		<View style={Styles.container}>
			<UploadPreview
				embed={previewEmbed}
				images={uploadedImages}
				onClose={() => setPreviewEmbed(null)}
				handleDelete={(index) => {
					const images = [...uploadedImages];
					images.splice(index, 1);
					setUploadedImages(images);
				}}
			/>
			<View style={Styles.messageListContainer}>
				<MessageList
					ref={messageList}
					onMessageAdded={(isScrolled, item) => {
						setNewMessagesNotificationVisible(
							isScrolled && !newMessagesNotificationVisible,
						);
					}}
					{...{
						onFacePress,
						onLongFacePress,
						addTag,
						uploadedImages,
						setUploadedImages,
						setPreviewEmbed,
						preferences,
					}}
				/>

				{uploadedImages.length ? renderImageList() : null}

				{newMessagesNotificationVisible && (
					<TouchableHighlight
						onPress={messageList?.current?.scrollToBottom}
						style={Styles.newMessageScrollNotifier}>
						<Text style={Styles.white}>
							You have new messages waiting
						</Text>
					</TouchableHighlight>
				)}

				{slowDownNotifierVisible && (
					<TouchableHighlight
						onPress={() => setSlowDownNotifierVisible(false)}
						style={Styles.slowDownNotifier}>
						<Text style={Styles.black}>Whoa slow down buddy!</Text>
					</TouchableHighlight>
				)}
			</View>
			<UserList
				userList={tagSearchData}
				onPress={({ nickname }) => addTag(nickname, true)}
				onLongPress={({ user_id }) => showMemberProfile(user_id)}
				slim
			/>
			<View style={Styles.footer}>
				<MessageInput
					onChangeText={(data) => setMessageInput(data)}
					sendAction={sendMessage}
					placeholder="Enter your message"
					value={messageState}
					onSelectionChange={(event) => {
						messageInputSelectionChange(event);
						if (Platform.OS === 'android') {
							checkForTags();
						}
					}}
					fuckWith={fuckWith}
					canSend={canSend}
					uploading={uploading}
					uploadAction={() => handleUpload()}
				/>
			</View>
		</View>,
	);
};

export default ChatScreen;
