
import React, { Component } from 'react';
import {
  Route,
} from 'react-router-dom';
import './App.css';

import Navigation from './Navigation';
import LandingPage from './StaticPages/Landing';
import SignUpPage from './Auth/SignUp';
import SignInPage from './Auth/SignIn';
import PasswordForgetPage from './Auth/PasswordForget';
import HomePage from './StaticPages/HomePage';
import ProfilePage from './Profile/Profile';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import QuizArchive from './QuizEngine/QuizArchive';
import Quiz from './QuizEngine/Quiz';
import Leaderboard from './Leaderboard/Leaderboard';
import About from './StaticPages/About';
import QuestionSubmitForm from './QuestionSubmit/QuestionSubmitForm';
import ReviewQuestions from './AdminDashboard/ReviewQuestions';
import ReviewContestedQuestions from './AdminDashboard/ReviewContestedQuestions';
import PublicProfile from './Profile/PublicProfile';

import * as routes from '../constants/routes';
import { firebase } from '../firebase';
import withAuthentication from './Auth/withAuthentication';

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
      signedInUser: "Wrl9XmpKHdh1xRQFrElTu6G3VbD2",
    };
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    })
  }



  getSignedInUser = (uid) => {
    this.setState({
      signedInUser: uid,
    })
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>

          <div>
            <Navigation authUser={this.state.authUser} signedInUser={this.state.signedInUser}/>

            <Route
              exact path={routes.LANDING}
              component={LandingPage}
            />
            <Route
              exact path={routes.SIGN_UP}
              render={(props) => <SignUpPage {...props} getSignedInUser={this.getSignedInUser} /> }
            />
            <Route
              exact path={routes.SIGN_IN}
              render={(props) => <SignInPage {...props} getSignedInUser={this.getSignedInUser} />}
            />
            <Route
              exact path={routes.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route
              exact path={routes.PROFILE}
              render={(props) => <ProfilePage {...props} signedInUser={this.state.signedInUser} />}
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
              render={(props) => <QuizArchive {...props} signedInUser={this.state.signedInUser} />}
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
            <Route
              exact path={routes.SUBMIT_QUESTION}
              render={(props) => <QuestionSubmitForm {...props} signedInUser={this.state.signedInUser} />}
            />
            <Route
              exact path={routes.REVIEW}
              component={ReviewQuestions}
            />
            <Route 
              exact path={routes.CONTEST}
              component={ReviewContestedQuestions}
            />
            <Route
              exact path={routes.USER_PROFILES}
              component={PublicProfile}
            />

            <Footer />
          </div>
      </MuiThemeProvider>

    );
  }
}

export default withAuthentication(App);
