import React from 'react';
import Loader from './Loader';

import '../stylesheets/ProfilePage.css'

export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        
        return (
            <div className="profile_page_container">
                <p>Hello from ProfilePage!</p>
            </div>
        );
    }
}

