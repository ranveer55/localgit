import React, { Component } from "react";
import accessLevels from '../config/access_levels';
//import { Link } from 'react-router-dom'
console.log(window.location.pathname);
const pathName = window.location.pathname;

class Menu extends Component {

    render() {
        return (
            <aside className="js-sticky" id="aside">
                <nav className="navigation_menu">
                    <menu className="menu ">
                        <li className="menu_item">
                            <a className={pathName === '/overview' ? 'menu_link current' : 'menu_link'} href="/overview">
                                <i className="menu_link_icon">
                                    <img src="/images/icons/icon1.svg" alt="" />
                                    <img src="/images/icons/icon1hover.svg" alt="" />
                                </i>
                                <span>Overview</span>
                            </a>
                        </li>
                        <li className="menu_item">
                            <a className={pathName === '/employee' ? 'menu_link current' : 'menu_link'} href="/employee">
                                <i className="menu_link_icon">
                                    <img src="/images/icons/icon2.svg" alt="" />
                                    <img src="/images/icons/icon2hover.svg" alt="" />
                                </i>
                                <span>Employees</span>
                            </a>
                        </li>
                        <li className="menu_item">
                            <a className={pathName === '/reports' ? 'menu_link current' : 'menu_link'} href="/reports">
                                <i className="menu_link_icon">
                                    <img src="/images/icons/icon3.svg" alt="" />
                                    <img src="/images/icons/icon3hover.svg" alt="" />
                                </i>
                                <span>Reports</span>
                            </a>
                        </li>
                        <li className="menu_item">
                            <a className={pathName === '/courses' ? 'menu_link current' : 'menu_link'} href="/courses">
                                <i className="menu_link_icon">
                                    <img src="/images/icons/icon4.svg" alt="" />
                                    <img src="/images/icons/icon4hover.svg" alt="" />
                                </i>
                                <span>Courses</span>
                            </a>
                        </li>
                        <li className="menu_item">
                            <a className={pathName === '/leaderboard' ? 'menu_link current' : 'menu_link'} href="/leaderboard">
                                <i className="menu_link_icon">
                                    <img src="/images/icons/icon3.svg" alt="" />
                                    <img src="/images/icons/icon3hover.svg" alt="" />
                                </i>
                                <span>Leaderboard</span>
                            </a>
                        </li>

                        {
                            (typeof localStorage['access_level'] === "string") && parseInt(localStorage['access_level']) !== accessLevels.AUDITOR ?
                                <li className="menu_item">
                                    <a className={pathName === '/campaigns' ? 'menu_link current' : 'menu_link'} href="/campaigns">
                                        <i className="menu_link_icon">
                                            <img src="/images/icons/icon4.svg" alt="" />
                                            <img src="/images/icons/icon4hover.svg" alt="" />
                                        </i>
                                        <span>Campaigns</span>
                                    </a>
                                </li> :
                                ''
                        }
                        <li className="menu_item">
                            <a className={pathName === '/chats' ? 'menu_link current' : 'menu_link'} href="/chats">
                                <i className="menu_link_icon">
                                    <img src="/images/icons/icon4.svg" alt="" />
                                    <img src="/images/icons/icon4hover.svg" alt="" />
                                </i>
                                <span>Messaging</span>
                            </a>
                        </li>
                    </menu>
                </nav>
            </aside>

        );
    }
}

export default Menu;
