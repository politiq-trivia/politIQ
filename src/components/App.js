
import React, { Component } from 'react';
import {
  Route, Switch
} from 'react-router-dom';
import './App.css';
import { db, withFirebase } from '../firebase';

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
import PrivacyPolicy from './StaticPages/PrivacyPolicy';
import AddToHomescreen from './StaticPages/AddToHomescreen';
import NoMatch from './StaticPages/NoMatch';

import * as routes from '../constants/routes';
import { firebase } from '../firebase';
import withAuthentication from './Auth/withAuthentication';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#b359f8',
      light: '#C790F1',
    },
    secondary: {
      main:'#000000'
    },
    default: {
      main: '#FFDF00'
    }
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      signedInUser: "",
      scoreObject: {},
      displayName: '',
      isAdmin: false,
    };
  }

  componentDidMount() {
    this.listener = firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    })
    if (localStorage.authUser) {
      const authUser = JSON.parse(localStorage.authUser)
      this.setState({
        signedInUser: authUser.uid,
        isAdmin: true
      })
    }
  }

  componentWillUnmount() {
    this.listener();
  }

  getSignedInUser = (uid) => {
    db.getDisplayNames(uid)
      .then(response => {
        const data = response.val()
        const displayName = data.displayName;
        this.setState({
          signedInUser: uid,
          displayName,
        })
      })    
  }

  checkAdmin = () => {
    this.setState({
      isAdmin: true,
    })
    console.log('user is admins')
  }

  // stores the score object for a non-signed in user so that they can save their score by signing up
  storeScore = (scoreObject) => {
    this.setState({
      scoreObject
    })
  }

  clearStateOnSignout = () => {
    this.setState({
      authUser: null,
      signedInUser: "",
      scoreObject: {},
      displayName: '',
      isAdmin: false,
    })
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>

            <Navigation signedInUser={this.state.signedInUser} clearStateOnSignout={this.clearStateOnSignout}/>

              <Switch>
                <Route
                  exact path={routes.LANDING}
                  component={localStorage.hasOwnProperty('authUser') ? HomePage : LandingPage}
                />
                <Route
                  exact path={routes.SIGN_UP}
                  render={(props) => <SignUpPage {...props} getSignedInUser={this.getSignedInUser} scoreObject={this.state.scoreObject}/> }
                />
                <Route
                  exact path={routes.SIGN_IN}
                  render={(props) => <SignInPage {...props} getSignedInUser={this.getSignedInUser} scoreObject={this.state.scoreObject} checkAdmin={this.checkAdmin}/>}
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
                  render={(props) => <HomePage {...props} signedInUser={this.state.signedInUser}/>}
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
                  render={(props) => <Quiz {...props} storeScore={this.storeScore} signedInUser={this.state.signedInUser}/>}
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
                  render={(props) => <PublicProfile {...props} key={window.location.pathName} signedInUser={this.state.signedInUser} displayName={this.state.displayName} isAdmin={this.state.isAdmin}/>}
                />
                <Route 
                  exact path={routes.PRIVACY} 
                  component={PrivacyPolicy}
                />
                <Route
                  exact path={routes.ADD_TO_HOMESCREEN}
                  component={AddToHomescreen}
                />

                <Route path="*" component={NoMatch}/>

              </Switch>



            <Footer signedInUser={this.state.signedInUser}/>
      </MuiThemeProvider>

    );
  }
}

export default withFirebase(withAuthentication(App));
