import React, {Component} from 'react';
import {
    FlatList,
    Text,
    View,
    TouchableHighlight,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    Modal, ImageBackground, ActivityIndicator, TouchableOpacity, Linking
} from 'react-native';

import FastImage from "react-native-fast-image";
import {Message} from 'sosa-chat-client';

import Session from "../sosa/Session";

import Helpers from '../sosa/Helpers';
import MessageInput from "../components/MessageInput";
import {UserList} from "../components/chat/UserList";

import RoomItem from "../components/chat/RoomItem";

import withMembersNavigationContext from "./hoc/withMembersNavigationContext";

import ProfileModal from "../components/ProfileModal";
import MessageItem from "../components/chat/MessageItem";
import Styles from './styles/chat'


export class Chat extends Component {
	drawerNavigationContext = {};
	membersNavigationContext = {};

	navigation = {};
	drawerNavigation = {};

	scrollOffset = {y:0, x:0};
	scrollView = null;
	
	messageBuffer = [];
	
	coolDown = false;
	coolDownTimer = null;
	slowDownCounter = 0;
	slowDownTimer = null;
	tagPosition = {start:0, end:0};
	messageInputPosition = {start:0, end:0};

	messageInput = ''; //We use this as well as state because setState doesn't update immediately and can create a race condition

	apiMiddleware;
	apiClient;
	chatService;
	session;

	bufferRenderTimer = null;
	bufferRenderRunning = false;

	selectedProfile = null;
	componentMounted = false;
	
	community = 'sosa';

	state = {
		userList: [],
		messages: [],
		tagSearchData: [],
		messageInput: '',
        previewEmbed: null,
        imageInput: [],
		rooms: [],
		scrolling: true,
		newMessagesNotificationVisible: false,
		slowDownNotifierVisible: false,
		currentRoom: null,
		canSend: true,
		fuckWith: false,
		profileModalVisible: false,
		uploading:false,
		preferences: {
			touch_face_for_profile: false,
			show_separators: false,
			show_slim: false
		},
	};
	
	settingUp = false;

	constructor(props) {
		super();

		const {navigation, navigationContext} = props;
		const {drawerNavigation, drawerNavigationContext} = navigationContext;
		const {appContext} = drawerNavigationContext;
		const {addMiddleware} = appContext;
		const {apiClient} = appContext;
		const {middleware: apiMiddleware, services: { chat: chatService } } = apiClient;
		
		this.navigation = navigation;
		this.drawerNavigation = drawerNavigation;

		this.membersNavigationContext = navigationContext;
		this.drawerNavigationContext = drawerNavigationContext;

		this.appContext = appContext;
		this.apiClient = apiClient;
		this.apiMiddleware = apiMiddleware;
		this.chatService = chatService;
	}

	componentDidMount() {
	    this.session = Session.getInstance();
	    
	    this.componentMounted = true;
		this.updateUserList();
		this.preferencesChanged(this.membersNavigationContext.preferences);
        this.addListeners();
		this.setupChat();
	}

	addListeners = () => {
	    this.appContext.clearMiddlewareNamespace('chat');
	    
	    this.appContext.addMiddleware('chat', {
            'settings_update': this.preferencesChanged,
            'api_event': ( packet ) => {
                const { type, data } = packet;
                
                return new Promise((resolve, reject) => {
                    if(type === 'chat/message') return this.addMessage(data);
                
                    if (type === 'chat/rooms/join') {
                        if (this.state.currentRoom) {
                            return this.addStatus(`${data.nickname} joined`).then(() => {
                                let userList = this.state.userList;
                                let add = true;
                                userList.forEach((user, index) => {
                                    if (user.nickname === data.nickname) add = false;
                                });
                                if (add) {
                                    userList.push(data);
                                    this.sortUserList(userList);
                                    this.setState({userList: userList});
                                }
                            });
                        }else{
                            resolve();
                        }
                    }
                    else if (type === 'chat/rooms/leave') {
                        if(this.state.currentRoom){
                            return this.addStatus(`${data.nickname} left`).then(() => {
                                let userList = this.state.userList;
                            
                                userList.forEach((user, index) => {
                                    if(user.nickname === data.nickname) delete userList[index];
                                });
                                this.sortUserList(userList);
                                this.setState({userList: userList});
                                resolve();
                            });
                        }else{
                            resolve();
                        }
                    }
                }).finally(() => packet);
            },
            'api_disconnected': (reason) => {
                return new Promise((resolve, reject) => {
                    clearTimeout(this.bufferRenderTimer);
                    this.addStatus('Disconnected from server');
                    resolve(reason);
                });
            },
            'api_authenticated': () => {
                return new Promise((resolve => {
                    this.setupChat();
                    resolve();
                }))
            }
        });
	};

	setupChat() {
	    if(!this.settingUp){
            this.settingUp = true;
            this.setupBufferRenderTimer();
            this.updateRoomList().then(() => {
                if(this.state.rooms.length){
                    if(this.state.currentRoom !== null){
                        this.joinRoom(this.state.currentRoom.community_id, this.state.currentRoom.name);
                    }else{
                        const [room] = this.state.rooms;
                        this.joinRoom(room.community_id, room.name);
                    }
                }
            }).finally(() => {
                this.settingUp = false;
            });
        }
        
	}

	preferencesChanged = (preferences) => {
		let stateChanges = this.state.preferences;
		let updateState = false;

		for(let key in preferences){
			if(preferences.hasOwnProperty(key)){
				let value = preferences[key];
				if(key.startsWith('chat:')){
					key = key.replace('chat:','');
					if(!stateChanges.hasOwnProperty(key) || value !== stateChanges[key]){
						updateState = true;
						stateChanges[key] = value;
					}
				}
			}
		}
		if(updateState) this.setState(stateChanges);
	}

	updateUserList = () => {
		this.drawerNavigationContext.addDrawerItem('user_list', (
			<View style={{flex:1}} key={'user_list'}>
				<UserList userList={this.state.userList} onPress={
					(user) => {
						this.drawerNavigation.closeDrawer();
						this.addTag(user.nickname);
					}} />
			</View>
		), true);
	};

	sendMessage = (setMessage) => {
	    let {coolDown, coolDownTimer, slowDownCounter, slowDownTimer, messageInput, state: { imageInput, currentRoom: { community_id, name } } } = this;
	
		if(!coolDown && slowDownCounter < 3){
			let message = (setMessage || messageInput).trim();
			
			if(imageInput.length) {
			    let images = [];
			    images = imageInput.map(({uri}) => uri);
			    
			    if(images.length) message = `${message} ${images.join(' ')}`;
            }
			
			if(message.length > 0){
				this.coolDown = true;
				
				clearTimeout(coolDownTimer);
				clearTimeout(slowDownTimer);

				this.coolDownTimer = setTimeout(() => this.coolDown = false, slowDownCounter * 200);
				this.slowDownTimer = setTimeout(() => {
                    this.slowDownCounter = 0;
					this.setState({slowDownNotifierVisible: false, canSend: true, fuckWith: false});
				},5000);
				this.slowDownCounter++;

				this.chatService.rooms.send(community_id, name, message).then((message) => this.addMessage(message)).catch((error) => {
				    console.debug(error);
                });
				this.setState({imageInput: []});
				this.setMessageInput('');
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
	    return this.addMessage({id: Helpers.generateId(), message: message}, true);
	};

	addMessage = (item, forceUpdate) => {
	    console.debug('Message', item);
	    return new Promise((resolve, reject) => {
            if(this.componentMounted){
                if(!item.id){
                    if(item.uuid){item.id = item.uuid;}
                    else if(item._id){
                        item.id = item._id;
                    }else{
                        item.id = Helpers.generateId();
                    }
                }
                this.messageBuffer.push(item);
                if(forceUpdate) this.bufferRender();
            
                if(this.isScrolled() && !this.state.newMessagesNotificationVisible){
                    this.setState({newMessagesNotificationVisible: true});
                }
                resolve(item);
            }else{
                reject();
            }
        });
		
	};

	renderRoomList = (rooms) => {
		if(!rooms){ rooms = this.state.rooms; }

		let roomViews = rooms.map((room) => {
			return <RoomItem key={room.id}
					     onPress={() => {
						     if(!this.state.currentRoom || this.state.currentRoom.name !== room.name) {
							     this.joinRoom(this.community, room.name);
						     }
						     this.navigation.navigate('Chat');
						     this.drawerNavigation.dangerouslyGetParent().closeDrawer();
					     }}
					     room={room}
					     active={(this.state.currentRoom !== null && room.id === this.state.currentRoom.id)}
			/>
		});

		this.drawerNavigationContext.addDrawerItem('room_list', (
			<View style={{flex: 1}} key={'room_list'}>
				<View style={{margin: 8}}>
					<Text style={{fontSize:16, color:'#fff'}}>Rooms</Text>
				</View>
				<ScrollView style={{flex:1}}>
					{ roomViews }
				</ScrollView>
			</View>
		));
	};

	updateRoomList = () => {
        return this.chatService.rooms.list(this.community).then((rooms) => {
            this.renderRoomList(rooms);
            this.setState({rooms});
		}).catch(error => {
		    console.info('App::updateRoomList::error', error);
            this.appContext.createModal('Error getting room list', error);
            throw error;
        });
	};

	joinRoom = (communityID, roomID) => {
        
        this.chatService.rooms.join(communityID, roomID)
            .then(({room, userList, history}) => {
			    this.sortUserList(userList);
			    
                this.setState({userList, currentRoom: room, messages: Object.assign([], history)});
                this.messageBuffer = [];
			    
                this.updateUserList();
			    this.addStatus(`Joined room ${room.name}`);

				this.membersNavigationContext.addHeaderIcon('whos_online',['fal', 'users'], this.displayUserList);
				this.renderRoomList();
		    }).catch(error => {
                this.appContext.createModal('Can\'t Join Room', error);
            });
	};

	displayUserList = () => {
		if(this.state.currentRoom !== null){
			Keyboard.dismiss();
			this.navigation.openDrawer();
		}else{
            this.appContext.createModal('You\'re not in a room','Please join a room first!');
		}

	};

	sortUserList = (userList) => {
		userList.sort((a,b) => a.nickname.localeCompare(b.nickname, [], {numeric: true, ignorePunctuation: true}));
	};

	disconnect = () => this.apiClient.disconnect();

	addTag = (username, usingTagList) => {
		let text = this.state.messageInput;
		let tag = `@${username}`;

		if(text.length === 0){
			text = `${tag} `;
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
				}else{
					tag += ' ';
				}


			}else{
				part1 = text.substr(0, caretStart);
				part2 = text.substr(caretEnd, textLength);
			}
			text = `${part1}${tag}${part2}`;
		}
		this.setMessageInput(text);
	};

	isScrolled = () => {
		return this.scrollOffset.y > 35;
	};

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
	};

	buildWrapper = (component) => {
		if(Platform.OS === 'ios'){
			return  (<KeyboardAvoidingView style={{flex: 1, backgroundColor: '#121111'}} behavior="padding" keyboardVerticalOffset="62">{component}</KeyboardAvoidingView>);
		}else {
			return (<View style={{flex: 1}} behavior="padding">{component}</View>);
		}
	}

	messageInputSelectionChange = (event) => {
		this.messageInputPosition = event.nativeEvent.selection;
	}

	checkForTags = () => {
		let message = this.messageInput;
		let end = this.messageInputPosition.end;
		let atIndex = message.lastIndexOf('@', end);

		let matches = [];
		this.tagPosition = {start: 0, end: 0};
		if(atIndex !== -1){
			let space = message.indexOf(' ', atIndex);
			if(space === -1) space = message.length;

			if(space >= end){
				let part = message.substring(atIndex + 1, space).trim().toLowerCase();
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

	setMessageInput(data) {
		this.messageInput = data;
		this.setState({ messageInput: data});
		if(Platform.OS === 'ios') this.checkForTags();
	}

	onFacePress = (message) => {
		!this.state.preferences.touch_face_for_profile ? this.addTag(message.nickname) : this.onLongFacePress(message);
	};

	onLongFacePress = (message) => {
		this.selectedProfile = message;
		this.setState({profileModalVisible: true});
	};

	renderItem = ({item}) => {
		if(item instanceof Message){
			return <MessageItem
				message={item}
				onFacePress={() => this.onFacePress(item)}
				onLongFacePress={() => this.onLongFacePress(item)}
				onUsernamePress={() => this.addTag(item.nickname)}
				myNickname={this.session.nickname}
				showSeparator={this.state.preferences.show_separators}
				showSlim={this.state.preferences.show_slim}
			/>
		}else{
			return <Text style={Styles.status}>{item.message}</Text>
		}
	};
	
	renderImageList = () => {
	    const images = this.state.imageInput.map((imageData, index) => {
	        if(imageData){
                const {image, uri, percentage} = imageData;
                if(!image) return;
        
                const deleteImage = () => {
                    let images = [...this.state.imageInput];
                    images.splice(index, 1);
                    this.setState({imageInput: images});
                };
        
                const defaultSize = 64;
        
                let width = defaultSize;
                if(percentage < 100) {
                    width = Math.floor((percentage / 100) * width - defaultSize) * -1;
                }
        
                return (<TouchableOpacity key={index} style={{margin:2, borderRadius: defaultSize / 2, overflow:'hidden'}} onPress={() => {uri && this.setState({previewEmbed: imageData})}} onLongPress={() => {uri && deleteImage(index)}} >
                    <ImageBackground source={{uri : image}} style={{height:defaultSize, width:defaultSize, resizeMode:'contain'}} imageStyle={{ borderRadius: defaultSize / 2 }}>
                        <View style={[{
                            backgroundColor: 'rgba(0, 0, 0, 0.30)',
                            position:'absolute',
                            top:0,
                            right: 0,
                        }, {height: defaultSize, width}]} />
                        { percentage < 100 && <ActivityIndicator color="#fff" size="large" style={{alignSelf:'center', flex:1, position:'absolute', top:0, left: 0, height:'100%', width:'100%'}}/> }
                    </ImageBackground>
                </TouchableOpacity>);
            }
        });
	    return <View style={{flexDirection: 'row', paddingBottom: 2}}>{images}</View>;
    }

	render() {

		return (
			this.buildWrapper(
				<View style={Styles.container}>
                    <Modal visible={(!!this.state.previewEmbed)} transparent={true} onRequestClose={() => this.setState({previewEmbed: null})}>
                        <View style={{backgroundColor:'rgba(0,0,0,0.75)', paddingTop: '15%', paddingBottom:'35%'}}>
                            <View style={{backgroundColor:'#fff', height:'100%', borderRadius:12, alignItems:'center', overflow:'hidden', paddingHorizontal:'2%'}}>
                                <TouchableHighlight onPress={() => Linking.openURL(this?.state?.previewEmbed?.uri)}>
                                    <FastImage source={{uri: this?.state?.previewEmbed?.image}} style={{width:'100%', marginTop:'2%', aspectRatio: 1/1, borderRadius: 12}}/>
                                </TouchableHighlight>
                                <View style={{flex:1, width:'100%', flexDirection: 'row', justifyContent:'flex-end', alignItems:'flex-end', marginBottom: 16}}>
                                        <TouchableHighlight onPress={() => {
                                            const index = this.state.imageInput.indexOf(this.state.previewEmbed);
                                            let newState = {previewEmbed: null};
                                            
                                            if(index !== -1) {
                                                const images = [...this.state.imageInput];
                                                images.splice(index, 1);
                                                newState.imageInput = images;
                                            }
                                            this.setState(newState);
                                            
                                        }} style={{alignItems:'center',
                                            borderRadius: 8,
                                            borderColor: '#dc3545',
                                            borderWidth: 1,
                                            backgroundColor: '#dc3545',
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            marginRight: 12
                                        }}>
                                            <Text style={{color:'#fff'}}>Remove</Text>
                                        </TouchableHighlight>
                                    
                                        <TouchableHighlight onPress={() => this.setState({previewEmbed: null})} style={{alignItems:'center',
                                            borderRadius: 8,
                                            borderColor: '#f0ad4e',
                                            borderWidth: 1,
                                            paddingVertical: 10,
                                            paddingHorizontal: 24}}>
                                            <Text>Close</Text>
                                        </TouchableHighlight>
                                    
                                </View>
                            </View>
                        </View>
                    </Modal>
					<View style={Styles.messageListContainer}>
						<FlatList
							ref={(ref) => {this.scrollView = ref;}}
							onScroll={this.chatMessagesOnScroll}
							keyboardShouldPersistTaps={'handled'}
							inverted
							initialNumToRender={10}
							maxToRenderPerBatch={12}
                            updateCellsBatchingPeriod={25}
							windowSize={21}
                            removeClippedSubviews={true}
							data={this.state.messages}
							extraData={this.state.messages}
							keyExtractor={(item) => item.id}
							renderItem={this.renderItem}
							style={Styles.message_list}
						/>
                        { this.state.imageInput.length ? this.renderImageList() : null }
						{
							this.state.newMessagesNotificationVisible &&
							<TouchableHighlight onPress={this.scrollToBottom} style={Styles.newMessageScrollNotifier}>
								<Text style={Styles.white}>You have new messages waiting</Text>
							</TouchableHighlight>
						}
						{
							this.state.slowDownNotifierVisible &&
							<TouchableHighlight onPress={() => this.setState({slowDownNotifierVisible: false})} style={Styles.slowDownNotifier}>
								<Text style={Styles.black}>Whoa slow down buddy!</Text>
							</TouchableHighlight>
						}
					</View>
					<UserList userList={this.state.tagSearchData} onPress={(user) => this.addTag(user.nickname, true)} slim={true}/>
					<View style={Styles.footer}>
						<MessageInput
							onChangeText={data => this.setMessageInput(data)}
							sendAction={this.sendMessage}
                            placeholder="Enter your message"
							value={this.state.messageInput}
							onSelectionChange={(event) => {
								this.messageInputSelectionChange(event);
								if(Platform.OS === 'android') this.checkForTags();
							}}
							fuckWith={this.state.fuckWith}
							canSend={this.state.canSend}
							uploading={this.state.uploading}
							uploadAction={() => {
                                let image = {id: Helpers.generateId(), uri:'', image: '', percentage: 0};
                                
                                const updateState = () => {
                                    let images = this.state.imageInput;
                                    let indx = images.length;
                                    
                                    images.forEach((item, index) => {
                                        if(item.id === image.id) indx = index;
                                    });
                                    
                                    images[indx] = image;
                                    this.setState({imageInput: images});
                                };
                                
							    Helpers.uploadFile(
							        this.appContext,
							        this.apiClient,
                                    this.community,
                                    (uploading) => {
							            this.setState({uploading});
							         },
                                     ({uri, fileName, type, data}) => {
							             image.image = `data:${type};base64,${data}`;
                                         updateState();
                                     }
                                )
                                .then(({uris, tag, uuid}) => {
                                    image.uri = uris[0];
                                    image.percentage = 100;
                                    updateState();
                                })
                                .catch((error) => {
                                    const index = this.state.imageInput.indexOf(image);
                                    if(index !== -1) {
                                        const images = [...this.state.imageInput];
                                        images.splice(index, 1);
                                        this.setState({imageInput: images});
                                    }
                                }).finally(() => {
                                    this.setState({uploading: false});
                                });
                            }}
						/>
					</View>
                    {this.state.profileModalVisible && this.selectedProfile && <ProfileModal visible={this.state.profileModalVisible} profile={this.selectedProfile} dismissTouch={() => this.setState({profileModalVisible: false})} />}
				</View>
			)
		);
	}
}

const ChatScreen = withMembersNavigationContext(Chat);
export default ChatScreen;
