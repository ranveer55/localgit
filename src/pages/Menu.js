import React, { Component, useState } from "react";
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
                            <a className={pathName === '/students' ? 'menu_link current' : 'menu_link'} href="/students">
                                <i className="menu_link_icon">
                                    <img src="/images/icons/icon2.svg" alt="" />
                                    <img src="/images/icons/icon2hover.svg" alt="" />
                                </i>
                                <span>Students</span>
                            </a>
                        </li>

                        <ItemWithSubMenu label="Reports" subItems={[
                            { title: "Other Reports", url: "/reports" },
                            { title: "Student Registrations", url: "/registration-report-by-company" },
                            { title: "Student RegActs", url: "/regact-report-by-company" },
                            { title: "Cohorts", url: "/company-cohorts" },
                            { title: "Cohort Mistakes", url: "/company-cohorts/mistakes" },
                        ]} />

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
                        <li className="menu_item">
                            <a className={pathName === '/program' ? 'menu_link current' : 'menu_link'} href="/program">
                                <i className="menu_link_icon">
                                    <img src="/images/icons/icon4.svg" alt="" />
                                    <img src="/images/icons/icon4hover.svg" alt="" />
                                </i>
                                <span>Programs</span>
                            </a>
                        </li>
                    </menu>
                </nav>
            </aside>

        );
    }
}

function ItemWithSubMenu({ label = "Link", subItems = [] }) {

    const [open, setOpen] = useState(false);

    return (
        <li className="menu_item submenu-holder">
            <span className={open ? 'menu_link current' : 'menu_link'} href="/leaderboard" onClick={() => {
                setOpen(!open);
            }}>
                <i className="menu_link_icon">
                    <img src="/images/icons/icon3.svg" alt="" />
                    <img src="/images/icons/icon3hover.svg" alt="" />
                </i>
                <span>{label}</span>
            </span>
            {
                open ? (
                    <span className="submenu">
                        {
                            subItems.map(item => (
                                <a style={{
                                    margin: "4px 0"
                                }} className={pathName === item.url ? 'menu_link current-item' : 'menu_link'} href={item.url}>
                                    <span>{item.title}</span>
                                </a>
                            ))
                        }
                    </span>
                ) : <></>
            }
        </li>
    );
}

export default Menu;
