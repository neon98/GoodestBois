import React from 'react';
import Loader from './Loader';

import '../stylesheets/LilOnesPage.css';

export default class LilOnesPage extends React.Component {
    mounted = false;

    constructor() {
        super();
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.mounted = true;
        if (this.mounted) {
            const subreddits = ['puppies', 'PuppySmiles', 'rarepuppers']
            const rand = Math.round(Math.random() * (subreddits.length-1)); 
            const limit = 100;
            fetch('http://api.reddit.com/r/' + subreddits[rand] + '/new.json?limit=' + limit)
                .then(response => {
                    return response.json()
                })
                .then(data =>{
                    if(this.mounted){
                        this.setState({ data: data.data.children })
                    }
                } );
        }

    }

    componentWillUnmount(){
        this.mounted = false;
    }

    render() {
        if (this.state.data.length > 0) {
            var images = this.state.data.map(data => {
                return (
                    data.data.url.includes('.jpg' || 'png' || 'jpeg') ?
                        <img key={data.data.url} src={data.data.url} className='gridItemImage' alt="" />
                        : null
                )
            })
        }
        return (
            <div className="gridContainer">
                {
                    this.state.data.length ? images : <Loader />
                }
            </div>
        );
    }
}