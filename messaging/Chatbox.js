import React from 'react';

import profilePic from './pp.png';

export default class Chatbox extends React.Component {
    constructor(props) {
        super(props);
        this.socket = this.props.socket;
        this.user = this.props.user;
        this.chatId = this.props.chatId;

        this.state = {
            message: ''
        }
        
        // bindings
        this.updateMessage = this.updateMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        // add socket listeners
        // this.socket.on('message', message => {
        //     console.log(message);
        // })
    }

    updateMessage(event) {
        this.setState({
            message: event.target.value
        });
    }

    sendMessage(event) {
        if (event.key === 'Enter') {
            if (!event.target.value) {
                return;
            }
            this.props.socket.emit('message', this.createPayLoad());
            this.updateMessage({ target: { value: '' } });
        }
    }

    createPayLoad() {
        return {
            message: this.state.message,
            userId: this.props.user.uid,
            chatId: this.props.chatId
        }
    }

    get isGroup() {
        return this.props.chat.isGroup;
    }

    render() {
        return (
            <div className={"chat-box" + (this.isGroup ? " group-chat" : "")}>
                <div className="group-users" >{
                    this.props.users.map((user, index) => {
                        return <div key={index} className={"group-user" + (user.online ? " online" : "")}>
                            <img src={profilePic} alt={user.name} className="rounded-full w-12 h-12 mx-4 bg-white" />
                            {user.name.trim().length > 0 ? user.name : 'John Doe'}
                        </div>;
                    })
                }</div>
                <div className="chatbox-header theme-bg p-2 flex items-center">
                    <img src={this.props.chat.avatar} alt="" className="rounded-full w-12 h-12 mx-4 bg-white" />
                    {this.props.chat.name}
                </div>
                <div className="message-box w-full p-3">
                    {
                        (this.props.chat && typeof this.props.chat === 'object' && 'messages' in this.props.chat)
                            ?
                            this.props.chat.messages.map((message, index) => {
                                return (
                                    <div
                                        className={"message-tile p-3 rounded-lg mb-2 relative " + (message.uid === this.props.user.uid ? 'is-sent' : 'is-received' + (this.isGroup ? ' group-message' : ''))}
                                        key={index}
                                    >
                                        {this.isGroup ? <span className="message-username">{this.props.getUserName(message.uid)}</span> : ''}
                                        {message.message}
                                    </div>
                                )
                            })
                            :
                            <div className="text-center">No messages till now...</div>
                    }
                </div>
                <div className="controls flex items-center bg-blue-200">
                    <input
                        value={this.state.message}
                        onChange={this.updateMessage}
                        onKeyUp={this.sendMessage}
                        className="text-box flex-grow p-1 m-2 input-box px-2"
                        placeholder="Write a reply..."
                    />
                    <div className="send-button px-3 bg-red-300 h-full rounded mx-1">Send</div>
                </div>
            </div>
        );
    }
}