import React from 'react';
import Media from 'react-media';
import * as firebase from 'firebase';
import { firebaseConfig } from './config';
import fontawesome from '@fortawesome/fontawesome'
import { faCheck, faExclamationCircle, faPencilAlt } from '@fortawesome/fontawesome-free-solid'

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
fontawesome.library.add(faCheck, faExclamationCircle, faPencilAlt);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedinUserId: '',
      profileOwnerId: '',
      currentPage: 'Home',
      showLoginModal: false,
      showSignUpModal: false,
      mobileUI: false
    }

    this.setUserId = this.setUserId.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.setprofileOwnerId = this.setprofileOwnerId.bind(this)
    this.resetprofileOwnerId = this.resetprofileOwnerId.bind(this)

    this.setPage = this.setPage.bind(this);

    this.handleOpenLoginModal = this.handleOpenLoginModal.bind(this);
    this.handleCloseLoginModal = this.handleCloseLoginModal.bind(this);
    this.handleOpenSignUpModal = this.handleOpenSignUpModal.bind(this);
    this.handleCloseSignUpModal = this.handleCloseSignUpModal.bind(this);
    this.handleOpenProfilePage = this.handleOpenProfilePage.bind(this);
  }
  setUserId(loggedinUserId) {
    this.setState({
      loggedinUserId: loggedinUserId,
      profileOwnerId: loggedinUserId,
    });
  }
  resetUser() {
    firebase.auth().signOut().then(() => {
      localStorage.removeItem('doggositeuser');
      this.setState({
        loggedinUserId: '',
        profileOwnerId: ''
      });
    }).catch(error => {
      console.log(error)
    });
  }
  setprofileOwnerId(profileOwnerId) {
    this.setState({
      profileOwnerId: profileOwnerId
    });
  }
  resetprofileOwnerId() {
    this.setState({
      profileOwnerId: this.state.loggedinUserId
    });
  }
  setPage(page) {
    this.setState({
      currentPage: page
    })
    if (page !== 'Profile') {
      this.resetprofileOwnerId()
    }
  }
  handleOpenLoginModal() {
    this.setState({
      showLoginModal: true
    })
  }
  handleCloseLoginModal() {
    this.setState({
      showLoginModal: false
    })
  }
  handleOpenSignUpModal() {
    this.setState({
      showSignUpModal: true
    })
  }
  handleCloseSignUpModal() {
    this.setState({
      showSignUpModal: false
    })
  }
  handleOpenProfilePage(profileOwnerId) {
    this.setprofileOwnerId(profileOwnerId);
    this.setPage("Profile");
  }
  componentDidMount() {
    var loggedinUserId = localStorage.getItem('doggositeuser');
    if (loggedinUserId) {
      this.setUserId(loggedinUserId)
    }
  }
  render() {
    var currentPage;
    switch (this.state.currentPage) {
      case "Home":
        currentPage =
          <HomePage
            firebase={firebase}
            setPage={this.setPage}
            handleOpenProfilePage={this.handleOpenProfilePage}
            loggedinUserId={this.state.loggedinUserId}
          />
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
            loggedinUserId={this.state.loggedinUserId}
            handleOpenLoginModal={this.handleOpenLoginModal}
            handleOpenSignUpModal={this.handleOpenSignUpModal}
            mobileUI={this.state.mobileUI}
            setPage={this.setPage}
            resetUser={this.resetUser}
          />
          {
            this.state.showLoginModal ?
              <LoginForm
                firebase={firebase}
                setUserId={this.setUserId}
                isOpen={this.state.showLoginModal}
                onClose={this.handleCloseLoginModal}
              /> : null
          }
          {
            this.state.showSignUpModal ?
              <SignUpForm
                firebase={firebase}
                setUserId={this.setUserId}
                isOpen={this.state.showSignUpModal}
                onClose={this.handleCloseSignUpModal}
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
