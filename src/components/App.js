
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import logo from './logo.png';
import './App.css';

import Navigation from './Navigation';
import LandingPage from './Landing';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import HomePage from './HomePage';
import ProfilePage from './Profile';

import * as routes from '../constants/routes';

// const Page = ({ title }) => (
//     <div className="App">
//       <div className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <h2>{title}</h2>
//       </div>
//       <p className="App-intro">
//         This is the {title} page.
//       </p>
//       {/* <p>
//         <Link to="/">Home</Link>
//       </p>
//       <p>
//         <Link to="/about">About</Link>
//       </p>
//       <p>
//         <Link to="/profile">Profile</Link>
//       </p>
//       <p>
//         <Link to="/play">Play Game</Link>
//       </p>
//       <p>
//         <Link to="/quiz-archive">Quiz Archive</Link>
//       </p>
//       <p>
//         <Link to="/submit-question">Submit Question</Link>
//       </p>
//       <p>
//         <Link to="/leaderboard">Leaderboard</Link>
//       </p> */}
//     </div>
// );


// components in this section will later become their own files
// const Home = (props) => (
//   <Page title="Home"/>
// );
//
// const About = (props) => (
//   <Page title="About"/>
// );
//
// const Profile = (props) => (
//   <Page title="Profile"/>
// );
//
// const SubmitQuestion = (props) => {
//   return (
//     <Page title="Submit Question" />
//   )
// }
//
// const Leaderboard = (props) => {
//   return (
//     <Page title="Leaderboard" />
//   )
// }
//
// const Play = (props) => {
//   return (
//     <Page title="Play Game" />
//   )
// }
//
// const QuizArchive = (props) => {
//   return (
//     <Page title="Quiz Archive" />
//   )
// }

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <hr/>

          <Route
            exact path={routes.LANDING}
            component={LandingPage}
          />
          <Route
            exact path={routes.SIGN_UP}
            component={SignUpPage}
          />
          <Route
            exact path={routes.SIGN_IN}
            component={SignInPage}
          />
          <Route
            exact path={routes.PASSWORD_FORGET}
            component={PasswordForgetPage}
          />
          <Route
            exact path={routes.PROFILE}
            component={ProfilePage}
          />
          <Route
            exact path={routes.HOME}
            component={HomePage}
          />
        </div>
      </Router>
    );
  }
}

export default App;
