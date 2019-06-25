import React from 'react';
import Media from 'react-media';
import * as firebase from 'firebase';
import { firebaseConfig } from './config';

import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import OurCommunityPage from './components/OurCommunityPage';
import LilOnesPage from './components/LilOnesPage';
import TweetsPage from './components/TweetsPage';

import './App.css';

firebase.initializeApp(firebaseConfig);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userID: '',
      profileOwnerID: '',
      currentPage: 'Home',
      openLoginModal: false,
      openSignUpModal: false,
      mobileUI: false
    }

    this.setUser = this.setUser.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.setProfileOwnerID = this.setProfileOwnerID.bind(this)
    this.resetProfileOwnerID = this.resetProfileOwnerID.bind(this)

    this.setPage = this.setPage.bind(this);

    this.openLoginModal = this.openLoginModal.bind(this);
    this.closeLoginModal = this.closeLoginModal.bind(this);
    this.openSignUpModal = this.openSignUpModal.bind(this);
    this.closeSignUpModal = this.closeSignUpModal.bind(this);
    this.openProfilePage = this.openProfilePage.bind(this);
  }
  setUser(userID) {
    this.setState({
      userID: userID,
      profileOwnerID: userID,
    });
  }
  resetUser() {
    localStorage.removeItem('doggositeuser');
    this.setState({
      userID: '',
      profileOwnerID: ''
    });
  }
  setProfileOwnerID(profileOwnerID) {
    this.setState({
      profileOwnerID: profileOwnerID
    });
  }
  resetProfileOwnerID() {
    this.setState({
      profileOwnerID: this.state.userID
    });
  }
  setPage(page) {
    this.setState({
      currentPage: page
    })
    if (page !== 'Profile') {
      this.resetProfileOwnerID()
    }
  }
  openLoginModal() {
    this.setState({
      openLoginModal: true
    })
  }
  closeLoginModal() {
    this.setState({
      openLoginModal: false
    })
  }
  openSignUpModal() {
    this.setState({
      openSignUpModal: true
    })
  }
  closeSignUpModal() {
    this.setState({
      openSignUpModal: false
    })
  }
  openProfilePage(profileOwnerID) {
    this.setProfileOwnerID(profileOwnerID);
    this.setPage("Profile");
  }
  componentDidMount() {
    var userID = localStorage.getItem('doggositeuser');
    if (userID) {
      this.setUser(userID)
    }
  }
  render() {
    var currentPage;
    switch (this.state.currentPage) {
      case "Home":
        currentPage = <HomePage />
        break;
      case "Our Community":
        currentPage = <OurCommunityPage />
        break;
      case "Lil Ones":
        currentPage = <LilOnesPage />
        break;
      case "Tweets":
        currentPage = <TweetsPage />
        break;
      case "Profile":
        currentPage = <ProfilePage />
        break;
      default:
        currentPage = <HomePage />
        break;
    }
    return (
      <div>
        <Media
          query="(max-width: 900px)"
          onChange={
            matches =>
              matches
                ? this.setState({ mobileUI: true })
                : this.setState({ mobileUI: false })
          }
        />
        <div className="header">
          <Navbar
            userID={this.state.userID}
            openLoginModal={this.openLoginModal}
            openSignUpModal={this.openSignUpModal}
            mobileUI={this.state.mobileUI}
            setPage={this.setPage}
            resetUser={this.resetUser}
          />
          {
            this.state.openLoginModal ?
              <LoginForm
                firebase={firebase}
                setUser={this.setUser}
                open={this.state.openLoginModal}
                close={this.closeLoginModal}
              /> : null
          }
          {
            this.state.openSignUpModal ?
              <SignUpForm
                firebase={firebase}
                setUser={this.setUser}
                open={this.state.openSignUpModal}
                close={this.closeSignUpModal}
              /> : null
          }
        </div>
        <div className="content">
          {
            currentPage
          }
        </div>
      </div>);
  };
}

export default App;
