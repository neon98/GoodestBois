import React from 'react';
import Popup from 'reactjs-popup';

import '../stylesheets/FormModals.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class SignUpForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
    }

    get initialState() {
        return {
            username: '',
            email: '',
            password: '',
            isValidUsername: false,
            errorMessage: ''
        };
    }

    handleInputChange(event) {
        var elem = document.getElementById('signupButton');
        elem.removeAttribute("disabled");
        elem.classList.remove("disabled");
        
        this.setState({
            [event.target.id]: event.target.value,
            errorMessage: ''
        });
        if (event.target.id === "username") {
            this.verifyusername(event.target.value);
        }
    }

    handleSignup(event) {
        event.preventDefault();

        var elem = document.getElementById('signupButton');
        elem.setAttribute("disabled", "disabled");
        elem.classList.add("disabled");

        this.props.firebase.auth().createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
        ).then(data => {
            var userid = data.user.uid;
            this.props.firebase.firestore().collection('users').doc(userid).set({
                username: this.state.username,
                bio: '',
                breedname: '',
                posts: [],
                email : this.state.email
            }).then(() => {
                localStorage.setItem('doggositeuser', userid);
                this.setState(this.initialState);
                document.getElementById('signUpForm').reset();
                this.props.setUserId(userid);
                this.props.onClose();
            }).catch(function (error) {
                console.log(error)
            });
        }).catch((error) => {
            if(error.code === 'auth/invalid-email'){
                this.setState({
                    errorMessage : 'The email address is badly formatted'
                });
            } else if(error.code === 'auth/weak-password'){
                this.setState({
                    errorMessage : 'Password should be at least 6 characters'
                });
            } else if(error.code === 'auth/email-already-in-use'){
                this.setState({
                    errorMessage : 'The email address is already in use'
                });
            }
        });
    }

    verifyusername(username) {
        var usersRef = this.props.firebase.firestore().collection('users');
        usersRef.where('username', '==', username).get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    this.setState({
                        isValidUsername: false
                    })
                } else {
                    this.setState({
                        isValidUsername: true
                    })
                }
            })
    }

    render() {
        var contentStyle = {
            width: '300px',
            marginTop: '100px',
            padding: '0',
            borderRadius: '4px',
            boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)'
        }
        return (
            <Popup
                contentStyle={contentStyle}
                open={this.props.isOpen}
                onClose={this.props.onClose}
                modal
            >
                <div className="modal">
                    <button className="close" onClick={this.props.onClose}> &times; </button>
                    <div className="header"> Signup</div>
                    {
                        this.state.errorMessage !== '' ?
                            <div>
                                <p className="error">{this.state.errorMessage}</p>
                            </div>
                            : null
                    }
                    <div className="content">
                        <form id="signUpForm">
                            <div className="input_field">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" onChange={this.handleInputChange} />
                                {
                                    this.state.username === '' ? null
                                        : this.state.isValidUsername
                                            ? <p style={{ color: "green" }}><FontAwesomeIcon icon="check" /> Valid username</p>
                                            : <p style={{ color: "red" }}> <FontAwesomeIcon icon="exclamation-circle" /> Username is already taken</p>
                                }
                            </div>
                            <div className="input_field">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" onChange={this.handleInputChange} />
                            </div>
                            <div className="input_field">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" onChange={this.handleInputChange} />
                            </div>
                        </form>
                    </div>
                    <div className="actions">
                        <button
                            id="signupButton"
                            className="button"
                            disabled={
                                !this.state.isValidUsername ||
                                !this.state.username ||
                                !this.state.email ||
                                !this.state.password
                            }
                            onClick={this.handleSignup}
                        >
                            Signup
                        </button>
                    </div>
                </div>
            </Popup>
        );
    }
}