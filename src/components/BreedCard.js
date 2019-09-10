import React from 'react';
import { breedsConfig } from '../config';

import lifespanIcon from '../assets/lifespan.png';
import heightIcon from '../assets/height.png';
import weightIcon from '../assets/weight.png';

import '../stylesheets/BreedCard.css';

var options = {
    headers: breedsConfig
}

export default class BreedCard extends React.Component {
    render() {
        var breed = this.props.breed;

        return (
            <div className="card">
                <div className="card_header">
                    <div>
                        <p className="breed_name_title">{breed.name}</p>
                        {
                            breed.breed_group ? <p className="breed_group_label">{breed.breed_group}</p> : null
                        }

                    </div>
                    {
                        breed.temperament ? <p className="card_subtitle">{breed.temperament}</p> : null
                    }

                </div>
                <div className="card_image_wrapper">
                    <BreedCardImage id={this.props.breed.id} />
                </div>
                <div className="card_content">
                    {
                        (breed.bred_for || breed.origin) ?
                            <div className="card_content_information_div">
                                {
                                    breed.bred_for ?
                                        <div>
                                            <p className="bred_for_title">Bred for</p>
                                            <p className="bred_for_value">{breed.bred_for}</p>
                                        </div>
                                        : null
                                }
                                {
                                    breed.origin ?
                                        <div>
                                            <p className="bred_for_title">Origin</p>
                                            <p className="bred_for_value">{breed.origin}</p>
                                        </div>
                                        : null
                                }
                            </div>
                            : null
                    }

                    <ul className="card_content_information_list">
                        {
                            breed.life_span ?
                                <li>
                                    <div className="card_content_information_list_item">
                                        <img src={lifespanIcon} className="card_content_icon" alt="" />
                                        <p>{breed.life_span}</p>
                                    </div>
                                </li> : null
                        }
                        {
                            breed.height ?
                                <li>
                                    <div className="card_content_information_list_item" >
                                        <img src={heightIcon} className="card_content_icon" alt="" />
                                        <p>{breed.height.metric} cm</p>
                                    </div>
                                </li>
                                : null
                        }
                        {
                            breed.weight ?
                                <li>
                                    <div className="card_content_information_list_item">
                                        <img src={weightIcon} className="card_content_icon" alt="" />
                                        <p style={{ paddingLeft: '5px' }}>{breed.weight.metric} kg</p>
                                    </div>
                                </li>
                                : null
                        }
                    </ul>

                </div>
            </div>
        );
    }
}

class BreedCardImage extends React.Component {
    constructor() {
        super();
        this.mounted = false;
        this.state = {
            imageUrl: ''
        }
    }
    componentDidMount() {
        this.mounted = true;
        if (this.mounted) {
            fetch(`https://api.TheDogAPI.com/v1/images/search?breed_id=` + this.props.id, options)
                .then(response => response.json())
                .then(result => {
                    if (result[0]) {
                        if(this.mounted){
                            this.setState({
                                imageUrl: result[0].url
                            })
                        } 
                    }
                })
        }
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        return (
            this.state.imageUrl.length ?
                <img src={this.state.imageUrl} className="card_image" alt="doggoimage"></img>
                :
                null
        );
    }
}