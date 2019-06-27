import React from 'react';

import treat from '../assets/treat.png'
import pat from '../assets/pat.png'
import boop from '../assets/dog.png'

import '../stylesheets/PostCard.css'

export default class PostCard extends React.Component {
    mounted = false;
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            post: {},
            isPatted: false,
            hasTreat: false,
            isBooped: false,
        }
        this.handlePTB = this.handlePTB.bind(this)
        this.setPost = this.setPost.bind(this);
    }
    componentDidMount() {
        this.mounted = true;
        if (this.props.post === null) {
            var dbRef = this.props.firebase.firestore().collection('posts')
            dbRef.doc(this.props.postid).get().then(doc => {
                var post = doc.data();
                post['postid'] = doc.id;
                if (this.mounted) {
                    this.setPost(post, this.props.userId);
                }

            })
        } else {
            if (this.mounted) {
                this.setPost(this.props.post, this.props.userId);
            }
        }
    }
    componentDidUpdate() {
        if (this.state.userId !== this.props.userId && this.mounted) {
            this.setState({
                userId: this.props.userId
            });
            this.setPost(this.state.post, this.props.userId);
        }
    }
    componentWillMount() {
        this.mounted = false;
    }

    setPost(post, userId) {
        var isPatted = post.pats_userids ? post.pats_userids.includes(userId) : false;
        var hasTreat = post.treats_userids ? post.treats_userids.includes(userId) : false;
        var isBooped = post.boops_userids ? post.boops_userids.includes(userId) : false;
        this.setState({
            post: post,
            userId: userId,
            isPatted: isPatted,
            hasTreat: hasTreat,
            isBooped: isBooped

        })
    }

    handlePTB(str) {
        if (!this.state.userId) {
            console.log("Please Login / Signup!");
        } else {
            switch (str) {
                case "pats":
                    this.state.isPatted ? this.updatePTBInDB(str, false) : this.updatePTBInDB(str, true);
                    break;
                case "treats":
                    this.state.hasTreat ? this.updatePTBInDB(str, false) : this.updatePTBInDB(str, true);
                    break;
                case "boops":
                    this.state.isBooped ? this.updatePTBInDB(str, false) : this.updatePTBInDB(str, true);
                    break;
                default:
                    break;
            }
        }
    }

    updatePTBInDB(str, shouldIncrement) {
        this.updatePTBInUI(str, shouldIncrement)
        var dbRef = this.props.firebase.firestore();
        dbRef.collection('posts').doc(this.state.post.postid).update({
            [str]: this.props.firebase.firestore.FieldValue.increment(shouldIncrement ? 1 : -1),
            [str + '_userids']: (
                shouldIncrement ? this.props.firebase.firestore.FieldValue.arrayUnion(this.props.userId)
                    : this.props.firebase.firestore.FieldValue.arrayRemove(this.props.userId)
            )
        }).then(() => {
            dbRef.collection('users').doc(this.state.post.userid).update({
                ['total' + str]: this.props.firebase.firestore.FieldValue.increment(shouldIncrement ? 1 : -1)
            }).then(() => {

            }).catch(error => {
                console.log(error);
            });

        }).catch(error => {
            this.updatePTBInUI(str, !shouldIncrement);
            console.log(error);
        });
    }

    updatePTBInUI(str, shouldIncrement) {
        var post = this.state.post;
        post[str] = shouldIncrement ? post[str] + 1 : post[str] - 1;
        switch (str) {
            case 'pats':
                if(this.mounted){
                    this.setState({
                        isPatted: shouldIncrement,
                        post: post
                    })
                }
                break;
            case 'boops':
                if(this.mounted){
                    this.setState({
                        isBooped: shouldIncrement,
                        post: post
                    });
                }
                break;
            case 'treats':
                if(this.mounted){
                    this.setState({
                        hasTreat: shouldIncrement,
                        post: post
                    })
                }
                break;
            default:
                break;
        }
    }

    render() {
        var styles = this.props.postCardStyles;
        return (
            <div style={styles.post_container} >
                {
                    this.props.post !== null ?
                        <p
                            style={styles.post_username}
                            onClick={() => { this.props.handleOpenProfilePage(this.state.post.userid) }}
                        >{this.state.post.username}</p>
                        :
                        null
                }
                <img style={styles.post_image} src={this.state.post.postImageUrl} alt="" />
                <p style={styles.post_caption}>{this.state.post.caption}</p>
                <div style={styles.pat_treat_boop}>
                    <div style={styles.pat_treat_boop_div}
                        onClick={() => { this.handlePTB('pats') }}
                        className={this.state.isPatted ? 'highlight' : null}
                    >
                        <img style={styles.pat_treat_boop_icon} src={pat} alt="" />
                        <p style={styles.pat_treat_boop_text}>{this.state.post.pats}</p>
                    </div>
                    <div style={styles.pat_treat_boop_div}
                        onClick={() => { this.handlePTB('treats') }}
                        className={this.state.treat ? 'highlight' : null}
                    >
                        <img style={styles.pat_treat_boop_icon} src={treat} alt="" />
                        <p style={styles.pat_treat_boop_text}>{this.state.post.treats}</p>
                    </div>
                    <div style={styles.pat_treat_boop_div}
                        onClick={() => { this.handlePTB('boops') }}
                        className={this.state.isBooped ? 'highlight' : null}
                    >
                        <img style={styles.pat_treat_boop_icon} src={boop} alt="" />
                        <p style={styles.pat_treat_boop_text}>{this.state.post.boops}</p>
                    </div>
                </div>
            </div>
        );
    }
}