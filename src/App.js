import React from 'react';
import Media from 'react-media';

import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import OurCommunityPage from './components/OurCommunityPage';
import LilOnesPage from './components/LilOnesPage';
import TweetsPage from './components/TweetsPage';

import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
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
        currentPage = <ProfilePage/>
        break;
      default:
        currentPage = <HomePage/>
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
        <Navbar />
          {
            false ?
              <LoginForm /> : null
          }
          {
            false ?
              <SignUpForm /> : null
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
