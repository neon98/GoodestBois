import React from 'react';
import Popup from 'reactjs-popup';

import '../stylesheets/FormModals.css';

export default class LogInForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    get initialState() {
        return {
            email: '',
            password: '',
            errorMessage: ''
        };
    }

    handleInputChange(event) {
        this.setState({
            [event.target.id]: event.target.value,
            errorMessage: ''
        });
    }

    handleLogin(event) {
        event.preventDefault();

        var elem = document.getElementById('loginButton');
        elem.setAttribute("disabled", "disabled");
        elem.classList.add("disabled");

        this.props.firebase.auth().signInWithEmailAndPassword(
            this.state.email,
            this.state.password
        ).then(data => {
            let userId = data.user.uid;
            localStorage.setItem('doggositeuser', userId);
            document.getElementById('loginForm').reset();
            this.setState(this.initialState);
            this.props.setUserId(userId);
            this.props.onClose();
        }).catch(error => {
            if(error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found'){
                this.setState({
                    errorMessage: 'Invalid email ID'
                })
            } else if (error.code === 'auth/wrong-password') {
                this.setState({
                    errorMessage: 'Invalid Password'
                })
            } else {
                this.setState({
                    errorMessage: 'Error'
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
                    <div className="header">Login </div>
                    {
                        this.state.errorMessage !== '' ?
                            <div>
                                <p className="error">{this.state.errorMessage}</p>
                            </div>
                            : null
                    }
                    <div className="content">
                        <form id="loginForm">
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
                            id="loginButton"
                            className="button"
                            onClick={this.handleLogin}
                            disabled={this.state.email === '' || this.state.password === ''}
                        >
                            Login
                        </button>
                    </div>
                    

                </div>
            </Popup>
        );
    }
}