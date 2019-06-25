import React from 'react';
import Loader from './Loader';

import '../stylesheets/LilOnesPage.css'

export default class LilOnesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        
        return (
            <div className="gridContainer">
                <p>Hello from LilOnesPage!</p>
            </div>
        );
    }
}

