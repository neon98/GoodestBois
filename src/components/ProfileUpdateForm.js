import React from 'react';
import Popup from 'reactjs-popup';
import Dropzone from 'react-dropzone';

import uploadphoto from '../assets/uploadphoto.png'

import '../stylesheets/FormModals.css';

export default class ProfileUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            breedname: '',
            bio: '',
            remainingCharCount: 100,
            imageFile: [],
            imageUrl: uploadphoto
        }
        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    }

    handleOnDrop(file) {
        this.setState({
            imageUrl: file[0].preview,
            imageFile: file
        })
    }
    handleInputChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        })
        if (event.target.id === 'bio') {
            this.setState({
                remainingCharCount: 100 - event.target.value.length
            })
        }
    }

    handleUpdateProfile() {
        var docRef = this.props.firebase.firestore()
            .collection('users').doc(this.props.userId);
        if (this.state.imageFile.length > 0) {
            var storageRef = this.props.firebase.storage().ref().child('profilePictures');
            var imageRef = storageRef.child(this.state.userid + '.jpg')
            imageRef.put(this.state.imageFile[0]).then(snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
                    docRef.update({
                        bio: this.state.bio,
                        breedname: this.state.breedname,
                        profilePictureUrl: url
                    }).then(()=>{
                        this.props.onClose()
                    })
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
            });

        } else {
            docRef.update({
                bio: this.state.bio,
                breedname: this.state.breedname,
            }).then(()=>{
                this.props.onClose()
            })
        }
        this.props.onClose();
    }

    componentDidMount() {
        this.setState({
            userid: this.props.userId,
            breedname: this.props.breedname,
            bio: this.props.bio,
            remainingCharCount: this.props.bio ? 100 - this.props.bio.length : 100
        })
    }

    render() {
        var contentStyle = {
            width: '300px',
            marginTop: '100px',
            padding: '0',
            borderRadius: '4px',
            boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)'
        }
        return (
            <Popup
                contentStyle={contentStyle}
                open={this.props.isOpen}
                onClose={this.props.onClose}
                modal
            >
                <div className="modal">
                    <button className="close" onClick={this.props.onClose}> &times; </button>
                    <div className="header">Update Profile</div>
                    <div className="content">

                        <form id="updateProfileForm">
                            <div className="update_image_div">
                                <Dropzone
                                    style={{ position: 'unset', cursor: 'pointer' }}
                                    onDrop={file => { this.handleOnDrop(file) }}
                                    multiple={false}
                                    accept='image/jpeg'
                                >
                                    <img className="updated_image" src={this.state.imageUrl} alt="" />
                                </Dropzone>
                            </div>

                            <div className="input_field">
                                <label htmlFor="breedname">Breedname</label>
                                <input type="text" id="breedname" onChange={this.handleInputChange} value={this.state.breedname} />
                            </div>
                            <div className="input_field">
                                <label>Bio</label>
                                <textarea rows="3" maxLength="100" id="bio" onChange={this.handleInputChange} value={this.state.bio} />
                                <p>{this.state.remainingCharCount} characters left</p>
                            </div>
                        </form>

                    </div>
                    <div className="actions">
                        <button
                            className="button"
                            onClick={this.handleUpdateProfile}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </Popup>
        );
    }
}