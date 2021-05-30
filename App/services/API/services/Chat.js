import {Client} from "../Client.js";
import {Message} from "../entities/Message.js";
import {Room} from "../entities/Room.js";
import {MessageParsers} from "./Chat/MessageParsers.js";
import {Request} from "../core/Request.js";

export class ChatService {

    /** @type {Client} */
    client = null;
    parsers = new MessageParsers(this);

    provider = null;

    constructor(client) {
        this.client = client;
        this.provider = client.getProvider('chat');
        
        const { client: { middleware } } = this;
        middleware.clear('chat');
        middleware.add('chat',{
            'event': ( packet ) => {
                const { type, data } = packet;
                return new Promise((resolve, reject) => {
                    if (type === 'chat/message') {
                        packet.data = Message.fromJSON(data);
                    }
                    resolve(packet);
                });
            }
        });
    }

    setupListeners() {
    
    };
    
    isConnected = () => {
        return this.provider.connected;
    };
    
    isAuthenticated = () => {
        return this.provider.authenticated;
    };

    rooms = {
            /**
             * Retrieves the list of rooms for the specified community
             * @param {function(err, data, request, socket, client)} callback - what to do when we get the list back
             * @param communityID - Community ID that you want to get the rooms for
             */
            list: (communityID) => {
                return new Request(this.provider, 'rooms', 'list', {community_id: communityID})
                    .run()
                    .then(({data: { rooms } }) => rooms.map((room) => Room.fromJSON(this.client, room)));
            },

            /**
             * Joins a room, on success / failure server will emit back to the callback
             *
             * @param {string} communityID - Community ID you want to join a room in
             * @param {string} roomID - Room ID you want to join
             * @param {string} password - password required to join the room
             * @param {Room} room - Room object
             */
            join: (communityID, roomID, password='', room= null) => {

                let data = {community_id: communityID, room_id:roomID};
                if(password && password.length) data.password = password;

                return new Request(this.provider, 'rooms', 'join', data)
                    .run()
                    .then(({ data }) => {
                          const { user_list, room: responseRoom, history } = data;
                          
                          if(!room) room = new Room(this);
                          room.parseJSON(responseRoom);
                          
                          let parsedHistory = history.map((message) => Message.fromJSON(message));
                          
                          return {room, userList: user_list, history: parsedHistory};
                    }
                );
            },

            /**
             * leaves a room, on success / failure server will emit back to the callback
             *
             * @param {string} communityID - Community ID you want to leave a room in
             * @param {string} roomID - Room ID you want to leave
             */
            leave: (communityID, roomID) => {
                return new Request(this.provider, 'rooms','leave', {community_id: communityID, room_id:roomID}).run();
            },

            /**
             * Get's the online users
             *
             * @param {string} communityID - Community ID you want to join a room in
             * @param {string} roomID - Room ID you want to join
             */
            online: (communityID, roomID) => {
                return new Request(this.provider, 'rooms','online', {community_id: communityID, room_id:roomID})
                    .run()
                    .then(({data: { user_list }}) => user_list);
            },

            /**
             * Send a message to the specified room, on success server will emit back to the callback
             * this can be used along side a timer to validate message success
             *
             * @param {string} communityID - Community ID you want to send a message to
             * @param {string} roomID - Room ID you want to send a message to
             * @param {string} message - Message you wish to send
             * @param {string} uuid - a unique ID if you'd like to trace this message
             */
            send: (communityID='', roomID='', message='', uuid='') => {
                const { provider: { client: { generateUUID } } } = this;

                if(!uuid) uuid = generateUUID();

                return new Request(this.provider,'rooms', 'message', {community_id: communityID, room_id:roomID, message:message, uuid:uuid})
                    .run()
                    .then(({data: message, request}) => {
                        if(message !== null && typeof(message) === 'object'){
                            message._id = request.id;
                            return Message.fromJSON(message);
                        }
                    });
            }
    };
}
