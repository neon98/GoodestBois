import React from 'react';
import Loader from './Loader';

import '../stylesheets/OurCommunityPage.css'

export default class OurCommunityPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        
        return (
            <div className="community_page_container">
                <p>Hello from OurCommunityPage!</p>
            </div>
        );
    }
}

