import React from 'react';
import Loader from './Loader';

import '../stylesheets/Homepage.css'

export default class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        
        return (
            <div className="container">
                <p>Hello from Homepage!</p>
            </div>
        );
    }
}

