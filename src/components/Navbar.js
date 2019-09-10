import React from 'react';

import paw from '../assets/paw.png'
import home from '../assets/home.png'
import tweet from '../assets/tweet.png'
import puppy from '../assets/puppy.png'
import breeds from '../assets/community.png';
import user from "../assets/user.png";
import '../stylesheets/Navbar.css';


export default class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 'Home'
        }
        this.setNavState = this.setNavState.bind(this);
    }

    setNavState(str) {
        this.setState({
            active: str
        })
    }
    render() {
        var highlight = {
            background: 'rgb(240, 240, 240)'
        }
        return (
            <div className="navbar_wrapper">
                <ul className="navbar">
                    <li className="navbar_brand_icon_wrapper">
                        <img
                            src={paw} 
                            alt="paw"
                            className="navbar_brand_icon"
                            onClick={() => {  
                                this.setNavState("Home"); 
                                this.props.setPage("Home") 
                            }}
                        />
                    </li>
                    <li>
                        <div
                            className="navbar_item"
                            onClick={() => { 
                                this.setNavState("Home"); 
                                this.props.setPage("Home") 
                            }}
                            style={this.state.active === 'Home' ? highlight : null}
                        >
                            <img 
                                src={home} 
                                alt="home" 
                                className="navbar_item_icon" 
                            />
                            {
                                this.props.mobileUI ? null :
                                    <p className="navbar_item_text">Home</p>
                            }
                        </div>
                    </li>
                    <li>
                        <div
                            className="navbar_item"
                            onClick={() => { 
                                this.setNavState("Our Community"); 
                                this.props.setPage("Our Community") 
                            }}
                            style={this.state.active === 'Our Community' ? highlight : null}
                        >
                            <img 
                                src={breeds} 
                                alt="breeds" 
                                className="navbar_item_icon" 
                                style={{ height: '25px', width: '30px' }} />
                            {
                                this.props.mobileUI ? null :
                                    <p className="navbar_item_text">Our Community</p>
                            }
                        </div>
                    </li>
                    <li>
                        <div
                            className="navbar_item"
                            onClick={() => { 
                                this.setNavState("Lil Ones"); 
                                this.props.setPage("Lil Ones") 
                            }}
                            style={this.state.active === 'Lil Ones' ? highlight : null}
                        >
                            <img 
                                src={puppy} 
                                alt="puppies" 
                                className="navbar_item_icon" />
                            {
                                this.props.mobileUI ? null :
                                    <p className="navbar_item_text">Lil' Ones</p>
                            }
                        </div>
                    </li>
                    <li>
                        <div
                            className="navbar_item"
                            onClick={() => { 
                                this.setNavState("Tweets"); 
                                this.props.setPage("Tweets") 
                            }}
                            style={this.state.active === 'Tweets' ? highlight : null}
                        >
                            <img 
                                src={tweet} 
                                alt="tweets" 
                                className="navbar_item_icon" 
                            />
                            {
                                this.props.mobileUI ? null :
                                    <p className="navbar_item_text">Tweets</p>
                            }
                        </div>
                    </li>
                    {
                        this.props.loggedinUserId ?
                            <div className="navbar_buttons">
                                <li>
                                    <div
                                        className="navbar_item"
                                        style={this.state.active === 'Profile' ? highlight : null}
                                    >
                                        <button
                                            className="navbar_item_button"
                                            style={{ width: 'auto' }}
                                            onClick={() => { 
                                                this.setNavState("Profile"); 
                                                this.props.setPage("Profile") 
                                            }}
                                        >
                                            <img 
                                                src={user} 
                                                className="navbar_item_icon" 
                                                style={{ margin: '0', marginTop: '5px' }} 
                                                alt="" 
                                            />
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <div className="navbar_item">
                                        <button 
                                            className="navbar_item_button" 
                                            onClick={() => { 
                                                this.props.resetUser() 
                                            }}
                                            > Logout </button>
                                    </div>
                                </li>
                            </div>
                            :
                            <div className="navbar_buttons">
                                <li>
                                    <div
                                        className="navbar_item"
                                    >
                                        <button
                                            className="navbar_item_button"
                                            onClick={() => { 
                                                this.props.handleOpenLoginModal() 
                                            }}
                                        > Login </button>
                                    </div>
                                </li>
                                <li>
                                    <div className="navbar_item">
                                        <button 
                                            className="navbar_item_button" 
                                            onClick={() => { 
                                                this.props.handleOpenSignUpModal() 
                                            }}> Signup </button>
                                    </div>
                                </li>
                            </div>
                    }
                </ul>
            </div>
        );
    }
}