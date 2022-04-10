import React from 'react';
import SidebarLink from './SidebarLink';

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'recent',
            selectedChat: null
        }
    }

    get activeTab() {
        return this.state.activeTab;
    }

    set activeTab(value) {
        this.setState({
            activeTab: value,
            selectedChat: null
        });
    }

    get selectedChat() {
        return this.state.selectedChat;
    }

    set selectedChat(value) {
        this.setState({
            selectedChat: value
        });
    }

    getChatListFromTab(activeTab) {
        switch (activeTab) {
            case 'recent':
                return this.props.personal;
            case 'unread':
                return this.props.personal.filter(chat => chat.isRead);
            case 'cohorts':
                return this.props.group;
            default:
                return [];
        }
    }

    selectChat(index, uid) {
        this.selectedChat = index;
        this.props.setActiveChatId(uid);
    }

    render() {
        return (
            <section className="sidebar block text-white py-2 px-3 h-screen">
                <input type="text" className="rounded p-3 w-full" placeholder="Find people and conversations" />
                <div className="tab-pills-group">
                    <div className={"tab-pill " + (this.state.activeTab === 'recent' ? 'active' : '')} onClick={() => { this.activeTab = 'recent' }}>Recent</div>
                    <div className={"tab-pill " + (this.state.activeTab === 'unread' ? 'active' : '')} onClick={() => { this.activeTab = 'unread' }}>Unread</div>
                    <div className={"tab-pill " + (this.state.activeTab === 'cohorts' ? 'active' : '')} onClick={() => { this.activeTab = 'cohorts' }}>Cohorts</div>
                </div>
                <div className="link-group py-3">
                    {
                        this.getChatListFromTab(this.activeTab).map((chat, index) => {
                            return <SidebarLink key={index} active={index === this.selectedChat} {...this.getChatListFromTab(this.activeTab)[index]} onClick={() => { this.selectChat(index, chat.uid) }} />;
                        })
                    }
                </div>
            </section>
        )
    }
}