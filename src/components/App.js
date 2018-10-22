
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
import Footer from './Footer';
import AdminDashboard from './AdminDashboard';

import * as routes from '../constants/routes';
import { firebase } from '../firebase';
import withAuthentication from './withAuthentication';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#a54ee8'
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
      <Router>
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
            <Route exact path={routes.SIGN_IN} component={SignInPage} />
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

            <Footer />
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withAuthentication(App);
