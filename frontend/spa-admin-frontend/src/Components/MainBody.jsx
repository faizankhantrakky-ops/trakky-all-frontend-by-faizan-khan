import Sidebar from './Sidebar';
import React from 'react'
import search from "../svgs/search.svg"
import hamburger from "../svgs/hamburger.svg"
import profile from "../svgs/profile_icon.svg"
import down_arrow from "../svgs/down_arrow.svg"
import './mainbody.css'

const MainBody = () => {
    const [hamburger_state,change_hamburger_state]=React.useState(false);
    const [profile_dropdown,change_profile_dropdown]=React.useState(false);

    return (
            <div id="main_root" className="">
                <div id="main" className="  ">
                    <div id="sidebar" className={` ${hamburger_state ? 'sidebar_open ' : ''} `}  >
                        <Sidebar />
                    </div>
                    <div id="body_div" className="">
                        <div id="header_div" className="  ">
                            <div id="searchbar_div">
                                <img id="search_icon" src={search} alt="hamburger_icon" ></img>
                                <input id="searchbar" type="text" placeholder="Search for something...  "></input>
                            </div>

                            <div
                                id="profile_div"
                                className="  "
                                onClick={() => { change_profile_dropdown(!profile_dropdown); }}
                            >
                                <img id="profile_img" src={profile} alt="profile" ></img>
                                <a id="profile_dropdown" href=".." className="  ">
                                    <span>SHIKHAR</span>
                                    <img id="down_arrow" src={down_arrow} alt="down_arrow"></img>
                                </a>
                                {profile_dropdown &&
                                    <div className="dropdown"  >
                                        <div>
                                            <div>Profile</div>
                                            <div>Settings</div>
                                            <div>Logout</div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div id="hamburger_div" className="  ">
                                <button onClick={() => {
                                    change_hamburger_state(!hamburger_state);
                                }} >
                                    <img id="hamburger_icon" src={hamburger} alt="hamburger_icon" ></img>
                                </button>
                            </div>
                        </div>
                        <div id="route_body_div" className="  "></div>
                    </div>
                </div>
            </div>
    )
}

export default MainBody