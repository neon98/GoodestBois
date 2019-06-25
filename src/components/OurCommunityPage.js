import React from 'react';
import Media from 'react-media';

import BreedCard from './BreedCard';
import Loader from './Loader';

import '../stylesheets/OurCommunityPage.css'

export default class OurCommunityPage extends React.Component {
    mounted = false;
    constructor() {
        super();
        this.state = {
            breeds: [],
        }
    }
    componentDidMount() {
        this.mounted = true;

        fetch(`https://api.thedogapi.com/v1/breeds`)
            .then(response => response.json())
            .then(result => {
                if (this.mounted) {
                    this.setState({
                        breeds: result
                    })
                }
            })

    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        let breedCards = this.state.breeds.map(breed => <BreedCard key={breed.id} breed={breed} />)

        return (
            <div className="community_page_container" >
                <Media
                    query="(max-width: 650px)"
                    onChange={
                        matches =>
                            matches
                                ? this.setState({ mobileUI: true })
                                : this.setState({ mobileUI: false })
                    }
                />
                {breedCards.length ? breedCards : <Loader/>}
            </div>

        );
    }
}