import React from 'react';
import Sidebar from './Sidebar';
import Chatbox from './Chatbox';
import SocketClient from 'socket.io-client';

import Axios from 'axios';


import './messaging.css';
import endpoints from '../../config/endpoints';

const apiEndpoint = endpoints.ws;

const token = localStorage.getItem('id_token');

export default class Messaging extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: 'Shubham',
                uid: window.location.pathname.substr(1)
            },
            users: [],
            activeChatId: null,
            personal: [
                {
                    name: 'Abhay',
                    uid: 'u-2',
                    isRead: false,
                    preview: 'This message will be shown...',
                    avatar: 'https://randomuser.me/api/portraits/men/' + Math.ceil(Math.random() * 20) + '.jpg',
                    time: '31 Dec',
                    messages: [
                        { uid: 'u-2', isSeen: true, message: "New Message", time: '06:45 AM' },
                        { uid: 'u-1', isSeen: true, message: "My New Message", time: '06:46 AM' }
                    ]
                },
                {
                    name: 'Sonu',
                    uid: 'u-3',
                    isRead: true,
                    preview: 'This message will be shown...',
                    avatar: 'https://randomuser.me/api/portraits/men/' + Math.ceil(Math.random() * 20) + '.jpg',
                    time: '31 Dec'
                },
                {
                    name: 'Sutej',
                    uid: 'u-4',
                    isRead: true,
                    preview: 'This message will be shown...',
                    avatar: 'https://randomuser.me/api/portraits/men/' + Math.ceil(Math.random() * 20) + '.jpg',
                    time: '31 Dec'
                },
                {
                    name: 'Rohan',
                    uid: 'u-5',
                    isRead: false,
                    preview: 'This message will be shown...',
                    avatar: 'https://randomuser.me/api/portraits/men/' + Math.ceil(Math.random() * 20) + '.jpg',
                    time: '31 Dec'
                }
            ],
            group: [

                {
                    name: 'Rohan, Abhay, Bhaia G',
                    uid: 'g-1',
                    preview: 'This message will be shown...',
                    avatar: 'https://randomuser.me/api/portraits/men/' + Math.ceil(Math.random() * 20) + '.jpg',
                    time: '31 Dec'
                }
            ]
        }

        // bindings
        this.setActiveChatId = this.setActiveChatId.bind(this);
        this.getUserName = this.getUserName.bind(this);
    }

    get userId() {
        return this.state.user.uid;
    }

    get activeChatId() {
        return this.state.activeChatId;
    }

    get activeChat() {
        if (this.activeChatId) {
            let chat = this.state.personal.find(c => c.uid === this.activeChatId);
            if (chat) {
                return chat;
            }
            chat = this.state.group.find(c => c.uid === this.activeChatId);
            return chat;
        } else return null;
    }

    setActiveChatId(uid, isGroup = false) {
        this.setState({
            activeChatId: uid
        });
    }

    joinRoom(uid) {
        this.socket.emit('join-room', { userId: this.userId, chatId: uid });
    }

    receiveMessage(message) {
        const newMessage = {
            isSeen: false,
        };

        newMessage.uid = message.userId;
        newMessage.time = message.time;
        newMessage.message = message.message;

        let otherPerson = message.userId;

        if (this.state.personal.find(p => p.uid === message.chatId)) {
            if (message.userId === this.state.user.uid) {
                otherPerson = message.chatId;
            }
            // its a user

            const chat = this.state.personal.find(c => c.uid === this.state.activeChatId);
            if (!chat.messages) {
                chat.messages = [];
            }
            chat.messages.push(newMessage);
            const personal = this.state.personal;
            personal.splice(this.state.personal.findIndex(c => c.uid === otherPerson), 1, chat);
            this.setState({
                personal: personal
            });
        } else {
            newMessage.uid = message.userId;
            // its a group
            const chat = this.state.group.find(c => c.uid === message.chatId);
            if (!chat.messages) {
                chat.messages = [];
            }
            chat.messages.push(newMessage);
            const group = this.state.group;
            group.splice(this.state.group.findIndex(c => c.uid === message.chatId), 1, chat);
            this.setState({
                group: group
            });
            try {

                window.$('.message-box')
                    .animate({
                        scrollTop: window.$('.message-box')
                            .children()
                            .map((i, e) => e.offsetHeight)
                            .toArray()
                            .reduce((a, e) => a + e)
                    });
            } catch (err) { }
        }
    }

    getUserName(uid) {
        let user = this.state.users.find(user => user.uid === uid);
        return user ? user.name : null;
    }

    componentDidMount() {
        // Axios.get(apiEndpoint + '/users')
        // .then(response => {
        //   console.log(response.data);
        // })
        Axios.get(apiEndpoint + '/chats', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

            .then(response => {
                const groups = response.data.groups.map(chat => {
                    chat.uid = chat.id;
                    chat.preview = '';
                    chat.avatar = '/images/icons/icon_module_' + chat.moduleNo + '.svg';
                    chat.time = chat.updatedAt;
                    chat.messages = chat.messages.map(message => {
                        const newMessage = {
                            isSeen: false,
                        };

                        newMessage.uid = message.userId;
                        newMessage.time = message.time;
                        newMessage.message = message.message;
                        return newMessage;
                    });
                    return chat;
                });


                const chats = response.data.chats.map(chat => {
                    chat.uid = chat.id;
                    chat.preview = '';
                    chat.avatar = '/images/icons/icon_module_' + chat.moduleNo + '.svg';
                    chat.time = chat.updatedAt;
                    chat.messages = chat.messages.map(message => {
                        const newMessage = {
                            isSeen: false,
                        };

                        newMessage.uid = message.userId;
                        newMessage.time = message.time;
                        newMessage.message = message.message;
                        return newMessage;
                    });
                    return chat;
                });


                this.socket = SocketClient(apiEndpoint);
                // this.socket = SocketClient('http://localhost:3001');
                this.socket.on('connect', () => {
                    // connect to all the personal chat rooms
                    this.state.personal.forEach(chat => {
                        this.joinRoom(chat.uid);
                    });
                    // connect to all the group chat rooms
                    this.state.group.forEach(chat => {
                        this.joinRoom(chat.uid);
                    });
                })
                this.socket.on('message', message => {
                    this.receiveMessage(message);
                });

                this.socket.emit('test', { data: 'new data' });

                this.socket.on('test', test => {
                    console.log(test);
                });

                this.socket.on('user-updates', users => {
                    const newUserList = [...this.state.users];
                    users.map(user => {
                        const stateUser = newUserList.find(u => user.userId === u.uid);
                        if (user.online !== stateUser.online) {
                            stateUser.online = user.online;
                        }
                        newUserList.splice(newUserList.findIndex(u => user.userId === u.uid), 1, stateUser);
                    });
                    this.setState({
                        users: newUserList
                    });
                });

                // set state
                this.setState({
                    personal: chats,
                    group: groups,
                    user: response.data.user
                })
            });

        // get user list
        Axios.get(apiEndpoint + '/users')
            .then(response => {
                this.setState({
                    users: response.data.map(user => { user.online = false; return user; })
                });
            })
    }

    render() {
        return (
            <main className="position-relative flex-grow">
                <Sidebar {...this.state} setActiveChatId={this.setActiveChatId} />
                {
                    this.activeChatId
                        ?
                        <Chatbox
                            socket={this.socket}
                            user={this.state.user}
                            chatId={this.activeChatId}
                            chat={this.activeChat}
                            users={this.activeChat.users.map(u => {
                                return this.state.users.find(user => user.id === u.id);
                            })}
                            getUserName={this.getUserName}
                        />
                        :
                        <div className="chat-box flex justify-center items-center h-screen">
                            No Chat Selected
            </div>
                }
            </main>
        )
    }
}