import React from 'react';
import Loader from './Loader';

import '../stylesheets/LilOnesPage.css';

export default class LilOnesPage extends React.Component {
    mounted = false;

    constructor() {
        super();
        this.state = {
            imageArray: []
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
                .then(response =>{
                    if(this.mounted){
                        this.setState({ imageArray: response.data.children })
                    }
                } );
        }

    }

    componentWillUnmount(){
        this.mounted = false;
    }

    render() {
        var images = [];
        if (this.state.imageArray.length > 0) {
            images = this.state.imageArray.map(image => {
                return (
                    image.data.url.includes('.jpg' || 'png' || 'jpeg') ?
                        <img key={image.data.url} src={image.data.url} className='gridItemImage' alt="" />
                        : null
                )
            })
        }
        return (
            <div className="gridContainer">
                {
                    images.length ? images : <Loader />
                }
            </div>
        );
    }
}