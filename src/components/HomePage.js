import React from 'react';

import Postcard from './PostCard';
import Loader from './Loader';

import treat from '../assets/treat.png'
import pat from '../assets/pat.png'
import boop from '../assets/dog.png'
import bulb from '../assets/light-bulb-on.png'

import '../stylesheets/Homepage.css'

export default class HomePage extends React.Component {
    mounted = false;
    constructor(props) {
        super(props);
        this.postCardStyles = {
            post_container: {
                borderRadius: '4px',
                marginBottom: '20px',
                marginRight: '20px',
                border: '1px solid rgb(234, 234, 234)',
                wordWrap: 'break-word',
                width: '100%',
                background: 'white'
            },
            post_username: {
                fontWeight: '500',
                padding: '10px',
                margin: '0',
                fontSize: '20px',
                cursor: 'pointer'
            },
            post_image: {
                width: '100%',
                height: '100%',
                borderRadius: '2px 2px 0px 0px'
            },
            post_caption: {
                padding: '5px 10px 10px 10px',
                margin: '0',
                fontSize: '15px',
                wordBreak: 'break-all'
            },
            pat_treat_boop: {
                display: 'flex',
                justifyContent: 'flex-start',
                margin: '0',
                padding: '0px 10px 10px 0px'
            },
            pat_treat_boop_div: {
                display: 'flex',
                flexWrap: 'wrap',
                margin: '0px 3px',
                padding: '3px 0 3px 7px',
                cursor: 'pointer',
                borderRadius: '4px'
            },
            pat_treat_boop_icon: {
                height: '20px',
                width: '20px'
            },
            pat_treat_boop_text: {
                fontSize: '15px',
                margin: '0 5px'
            }
        }
        this.state = {
            postsArray: [],
            loggedinUserId: '',
            fact: '',
            highestPatsUser: {},
            hightstTreatsUser: {},
            highestBoopsUser: {}
        }
        this.handleOpenProfilePage = this.handleOpenProfilePage.bind(this);
        this.fetchPosts = this.fetchPosts.bind(this);
        this.fetchFact = this.fetchFact.bind(this);
        this.fetchHighestPTBUsers = this.fetchHighestPTBUsers.bind(this);
    }

    handleOpenProfilePage(profileOwnerId) {
        this.props.handleOpenProfilePage(profileOwnerId);
    }

    componentDidMount() {
        this.mounted = true;
        this.setState({
            loggedinUserId: this.props.loggedinUserId
        })
        this.fetchPosts();
        this.fetchFact();
        this.fetchHighestPTBUsers();

    }

    componentDidUpdate() {
        if (this.state.loggedinUserId !== this.props.loggedinUserId && this.mounted) {
            this.setState({
                loggedinUserId: this.props.loggedinUserId
            })
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    fetchPosts() {
        var postsArray = [];
        this.props.firebase.firestore().collection('posts').get().then(querySnapShot => {
            querySnapShot.forEach(doc => {
                let data = doc.data();
                data['postid'] = doc.id;
                postsArray.push(data);
            });
            if (this.mounted) {
                this.setState({
                    postsArray: postsArray
                })
            }
        }, error => {
            console.log(error);
        });
    }

    fetchFact() {
        var requestOptions = {
            method: 'GET'
        };
        fetch('https://some-random-api.ml/facts/dog', requestOptions)
            .then(response => response.text())
            .then(result => {
                result = JSON.parse(result)
                if (this.mounted) {
                    this.setState({
                        fact: result.fact
                    })
                }
            })
            .catch(error => console.log('error', error));
    }

    fetchHighestPTBUsers() {
        this.props.firebase.firestore().collection('winners').doc('winners').get()
            .then(doc => {
                var data = doc.data();
                if (data.highestPats) {
                    this.props.firebase.firestore().collection('users').doc(data.highestPats).get()
                        .then(userDoc => {
                            let userdata = userDoc.data();
                            userdata['userid'] = userDoc.id;
                            if (this.mounted) {
                                this.setState({
                                    highestPatsUser: userdata
                                });
                            }
                        });
                }
                if (data.highestTreats) {
                    this.props.firebase.firestore().collection('users').doc(data.highestTreats).get()
                        .then(userDoc => {
                            let userdata = userDoc.data();
                            userdata['userid'] = userDoc.id;
                            if (this.mounted) {
                                this.setState({
                                    highestTreatsUser: userdata
                                });
                            }
                        });
                }
                if (data.highestBoops) {
                    this.props.firebase.firestore().collection('users').doc(data.highestBoops).get()
                        .then(userDoc => {
                            let userdata = userDoc.data();
                            userdata['userid'] = userDoc.id;
                            if (this.mounted) {
                                this.setState({
                                    highestBoopsUser: userdata
                                });
                            }
                        });
                }

            }).catch(error => {
                console.log(error)
            })
    }
    isEmpty(obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        if (obj == null) return true;
        for (let key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }
    render() {
        var postsArray = this.state.postsArray.map(post =>
            <Postcard
                key={post.postid}
                postCardStyles={this.postCardStyles}
                post={post}
                handleOpenProfilePage={this.handleOpenProfilePage}
                firebase={this.props.firebase}
                userId={this.state.loggedinUserId}
            />
        )
        return (
            <div className="homepageContainer">
                <div className="leftDiv">
                    {
                        postsArray.length ? postsArray : <Loader />
                    }
                </div>
                <div className="rightDiv">
                    <div className="factContainer">
                        <p><img className="factIcon" src={bulb} alt="" />{
                            this.state.fact
                        }</p>
                    </div>
                    <div className="highestPTBWrapper" >
                        {
                            !this.isEmpty(this.state.highestPatsUser) ?
                                <div>
                                    <p>Yaay! I got the highest pets!</p>
                                    <HightstPTBUserCard
                                        user={this.state.highestPatsUser}
                                        styles={this.postCardStyles}
                                    />
                                </div>
                                : null
                        }
                        {
                            !this.isEmpty(this.state.highestTreatsUser) ?
                                <div>
                                    <p>Yaay! I got the highest treats!</p>
                                    <HightstPTBUserCard
                                        user={this.state.highestTreatsUser}
                                        styles={this.postCardStyles}
                                    />
                                </div>
                                : null
                        }
                        {
                            !this.isEmpty(this.state.highestBoopsUser) ?
                                <div >
                                    <p>Yaay! I got the highest boops!</p>
                                    <HightstPTBUserCard
                                        user={this.state.highestBoopsUser}
                                        styles={this.postCardStyles}
                                    />
                                </div>
                                : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function HightstPTBUserCard(props) {
    var styles = {
        container: {
            background: 'white',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: '',
            padding: '10px 20px 5px 20px'
        },
        image: {
            height: '80px',
            width: '80px',
            borderRadius: '50%',
            border: '1px solid rgb(234, 234, 234)'
        }

    }
    return (
        <div style={styles.container}>
            <div>
                <img
                    src={props.user.profilePictureUrl}
                    style={styles.image} alt=""
                />
            </div>
            <div>
                <p style={{ padding: '0', margin: '10px 0 5px 10px', fontSize: '16px' }}>
                    {props.user.username}
                </p>
                <div style={props.styles.pat_treat_boop}>
                    <div
                        style={props.styles.pat_treat_boop_div}
                        className='defaultCursor'
                    >
                        <img
                            src={pat} alt=""
                            style={props.styles.pat_treat_boop_icon}
                        />
                        <p style={props.styles.pat_treat_boop_text}>{props.user.totalpats}</p>
                    </div>
                    <div
                        style={props.styles.pat_treat_boop_div}
                        className='defaultCursor'
                    >
                        <img
                            src={treat} alt=""
                            style={props.styles.pat_treat_boop_icon}
                        />
                        <p style={props.styles.pat_treat_boop_text}>{props.user.totaltreats}</p>
                    </div>
                    <div
                        style={props.styles.pat_treat_boop_div}
                        className='defaultCursor'
                    >
                        <img
                            src={boop} alt=""
                            style={props.styles.pat_treat_boop_icon}
                        />
                        <p style={props.styles.pat_treat_boop_text}>{props.user.totalboops}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


