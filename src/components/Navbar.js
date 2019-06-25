import React from 'react';
import Loader from './Loader';

import '../stylesheets/Navbar.css'

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        
        return (
            <div className="navbar_wrapper">
                <p>Hello from Navbar!</p>
            </div>
        );
    }
}

