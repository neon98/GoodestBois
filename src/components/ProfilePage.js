import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PostCard from './PostCard';
import ProfileUpdateForm from './ProfileUpdateForm';
import AddPostForm from './AddPostForm';

import treat from '../assets/treat.png'
import pat from '../assets/pat.png'
import boop from '../assets/dog.png'

import '../stylesheets/ProfilePage.css';

export default class ProfilePage extends React.Component {
    mounted = false;
    constructor(props) {
        super(props);
        this.state = {
            profileOwner: {},
            loggedinUserId: '',
            showProfileUpdateForm: false,
            showAddNewPostForm: false
        }
        this.postCardStyles = {
            post_container: {
                borderRadius: '2px',
                marginBottom: '20px',
                marginRight: '20px',
                border: '1px solid rgb(234, 234, 234)',
                wordWrap: 'break-word',
                width: '230px',
                background: 'white'
            },
            post_image: {
                width: '100%',
                height: '160px',
                borderRadius: '2px 2px 0px 0px'
            },
            post_caption: {
                padding: '5px 10px',
                margin: '0',
                fontSize: '14px',
                wordBreak: 'break-all'
            },
            pat_treat_boop: {
                display: 'flex',
                margin: '0',
                padding: '5px 10px 5px 0px',
            },
            pat_treat_boop_div: {
                display: 'flex',
                flexWrap: 'wrap',
                margin: '0px 0px 0px 10px',
                padding: '5px 5px 5px 10px',
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
        this.handleOpenProfileUpdateForm = this.handleOpenProfileUpdateForm.bind(this);
        this.handleCloseProfileUpdateForm = this.handleCloseProfileUpdateForm.bind(this);
        this.handleOpenAddNewPostForm = this.handleOpenAddNewPostForm.bind(this);
        this.handleCloseAddNewPostForm = this.handleCloseAddNewPostForm.bind(this);
    }
    componentDidMount() {
        this.mounted = true;
        this.fetchProfile(this.props.profileOwnerId);
        if (this.mounted) {
            this.setState({
                loggedinUserId: this.props.loggedinUserId
            })
        }
    }
    componentDidUpdate() {
        if (this.state.profileOwner.userid !== this.props.profileOwnerId & this.mounted) {
            this.fetchProfile(this.props.profileOwnerId);
        }
        if (this.state.loggedinUserId !== this.props.loggedinUserId & this.mounted) {
            this.setState({
                loggedinUserId: this.props.loggedinUserId
            })
        }
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    handleOpenProfileUpdateForm() {
        this.setState({
            showProfileUpdateForm: true
        })
    }
    handleCloseProfileUpdateForm() {
        this.setState({
            showProfileUpdateForm: false
        })
    }
    handleOpenAddNewPostForm() {
        this.setState({
            showAddNewPostForm: true
        })
    }
    handleCloseAddNewPostForm() {
        this.setState({
            showAddNewPostForm: false
        })
    }
    fetchProfile(userid) {
        if (userid) {
            var dbRef = this.props.firebase.firestore();
            dbRef.collection("users").doc(userid).onSnapshot(doc => {
                var data = doc.data()
                data['userid'] = doc.id;
                if (this.mounted) {
                    this.setState({
                        profileOwner: data
                    })
                }
            });
        }

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

        if (!this.isEmpty(this.state.profileOwner)) {
            var postids = this.state.profileOwner.posts;
            var posts = postids.map(postid =>
                <PostCard
                    key={postid}
                    postid={postid}
                    post={null}
                    postCardStyles={this.postCardStyles}
                    firebase={this.props.firebase}
                    userId={this.state.loggedinUserId}
                />);
        }

        return (
            <div className="profile_page_container">
                {
                    this.state.showProfileUpdateForm ?
                        <ProfileUpdateForm
                            isOpen={this.state.showProfileUpdateForm}
                            onClose={this.handleCloseProfileUpdateForm}
                            profileOwnerId={this.state.profileOwner.userid}
                            username={this.state.profileOwner.username}
                            breedname={this.state.profileOwner.breedname}
                            bio={this.state.profileOwner.bio}
                            firebase={this.props.firebase}
                        />
                        : null
                }
                {
                    this.state.showAddNewPostForm ?
                        <AddPostForm
                            isOpen={this.state.showAddNewPostForm}
                            onClose={this.handleCloseAddNewPostForm}
                            profileOwnerId={this.state.profileOwner.userid}
                            username={this.state.profileOwner.username}
                            firebase={this.props.firebase}
                        /> :
                        null
                }
                <div className="header">
                    <div className="profile_picture_wrapper">
                        <img
                            className={this.state.profileOwner.profilePictureUrl ? "profile_picture" : null}
                            src={this.state.profileOwner.profilePictureUrl} alt=""
                        />
                    </div>
                    <div className="profile_info_wrapper">
                        <div className="profile_info_header">
                            <h1>{this.state.profileOwner.username}</h1>
                            {
                                this.state.profileOwner.breedname ?
                                    <p className="breed_label">{this.state.profileOwner.breedname}</p>
                                    : null
                            }
                            {
                                this.state.loggedinUserId === this.state.profileOwner.userid ?
                                    <p
                                        className="edit_icon"
                                        onClick={this.handleOpenProfileUpdateForm}
                                    ><FontAwesomeIcon icon="pencil-alt" /></p>
                                    : null
                            }
                        </div>
                        <p className="profile_info_bio" >{this.state.profileOwner.bio}</p>
                        <div className="pat_treat_boop">
                            <div className="">
                                <img className="icon" src={pat} alt="" />
                                <p className="text">{this.state.profileOwner.totalpats}</p>
                            </div>
                            <div className="">
                                <img className="icon" src={treat} alt="" />
                                <p className="text">{this.state.profileOwner.totaltreats}</p>
                            </div>
                            <div className="">
                                <img className="icon" src={boop} alt="" />
                                <p className="text">{this.state.profileOwner.totalboops}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile_posts">
                    {
                        this.state.loggedinUserId === this.state.profileOwner.userid ?
                            <div className="add_new_post_card"
                                onClick={this.handleOpenAddNewPostForm}>
                                <div>
                                    <FontAwesomeIcon icon="plus" />
                                </div>
                            </div> :
                            null
                    }
                    {
                        posts
                    }
                </div>
            </div >
        );
    }
}

