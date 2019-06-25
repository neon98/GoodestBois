import React from 'react';
import Loader from './Loader';

import '../stylesheets/TweetsPage.css'

export default class TweetsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        
        return (
            <div className="tweetsContainer">
                <p>Hello from TweetsPage!</p>
            </div>
        );
    }
}

