import React from 'react';
import moment from 'moment';

export default function SidebarLink(props) {
    return (
        <div className={"rounded sidebar-link px-3 py-2 flex my-2 " + (props.active ? 'active' : '')} onClick={props.onClick}>
            <img src={props.avatar} alt="" className="rounded-full w-12 h-12 mr-3 bg-white" />
            <div className="flex-grow">
                <div className="">{props.name}</div>
                <div className="text-gray-600 text-sm">{props.preview} <span className="float-right">{moment(new Date(props.time)).format('MMM DD hh:mm A')}</span></div>
            </div>
        </div>
    );
}