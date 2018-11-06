
import React, { Component } from 'react';
import {
  Route
} from 'react-router-dom';
// import logo from './logo.png';
import './App.css';

import Navigation from './Navigation';
import LandingPage from './Landing';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import HomePage from './HomePage';
import ProfilePage from './Profile';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import QuizArchive from './QuizArchive';
import Quiz from './Quiz';
import Leaderboard from './Leaderboard/Leaderboard';
import About from './About';

import * as routes from '../constants/routes';
import { firebase } from '../firebase';
import withAuthentication from './withAuthentication';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#a54ee8',
      light: '#C790F1',
    },
    secondary: {
      main:'#000000'
    },
  },
});


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    })
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>

          <div>
            <Navigation authUser={this.state.authUser} />

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
            <Route
              exact path={routes.ADMIN_DASHBOARD}
              component={AdminDashboard}
            />
            <Route
              exact path={routes.QUIZ_ARCHIVE}
              component={QuizArchive}
            />
            <Route
              exact path={routes.QUIZ}
              component={Quiz}
            />
            <Route
              exact path={routes.LEADERBOARD}
              component={Leaderboard}
            />
            <Route
              exact path={routes.ABOUT}
              component={About}
            />

            <Footer />
          </div>
      </MuiThemeProvider>

    );
  }
}

export default withAuthentication(App);
