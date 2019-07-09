
import React, { Component } from 'react';
import {
  Route, Switch
} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import moment from 'moment';

import './App.css';
import { db, withFirebase } from '../firebase';
import { getLastMonthScores, getUserScores, getAllScores } from '../utils/storeScoreData';
import { storeQuizzes } from '../utils/storeQuizzes';

import Navigation from './Navigation/Navigation';
import LandingPage from './StaticPages/Landing';
import SignUpPage from './Auth/SignUp';
import SignInPage from './Auth/SignIn';
import PasswordForgetPage from './Auth/PasswordForget';
import HomePage from './StaticPages/HomePage';
import ProfilePage from './Profile/Profile';
import Footer from './Footer';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import QuizArchive from './QuizEngine/QuizArchive';
import ArchivedQuiz from './QuizEngine/ArchivedQuiz';
import Quiz from './QuizEngine/Quiz';
import Leaderboard from './Leaderboard/Leaderboard';
import Leaderboardv2 from './Leaderboard/Leaderboard-v2';
import About from './StaticPages/About';
import QuestionSubmitForm from './QuestionSubmit/QuestionSubmitForm';
import ReviewQuestions from './AdminDashboard/ReviewQuestions';
import ReviewContestedQuestions from './AdminDashboard/ReviewContestedQuestions';
import PublicProfile from './Profile/PublicProfile';
import PrivacyPolicy from './StaticPages/PrivacyPolicy';
import AddToHomescreen from './StaticPages/AddToHomescreen';
import QuizRedirect from './QuizEngine/QuizRedirect';
import ProfileToQuizRedirect from './QuizEngine/ProfileToQuizRedirect';
import NoMatch from './StaticPages/NoMatch';
import FAQ from './StaticPages/FAQ';

import * as routes from '../constants/routes';
import { firebase } from '../firebase';
import withAuthentication from './Auth/withAuthentication';


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
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
      }
    }
  }
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
    // sets the auth user in app state
    this.listener = firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.initializeApp(authUser)
        : this.setState({ authUser: null });
    })
    // checks local storage for auth user - maybe there was a user from a 
    // previous session
    if (localStorage.authUser) {
      const authUser = JSON.parse(localStorage.authUser)
      this.setState({
        signedInUser: authUser.uid,
        isAdmin: true
      })
    }

    storeQuizzes()
  }

  componentWillUnmount() {
    this.listener();
  }

  initializeApp = (authUser) => {
    // get all the user's scores (all time)
    getUserScores(authUser.uid)
  
    // check if lastMonthScores are present 
    if (!localStorage.hasOwnProperty('lastMonthScores')) {
      getLastMonthScores()
    } else {
      // check if lastMonthScores have been updated since the start of a new month. 
      // if not, update them.
      const lastMonthScores = JSON.parse(localStorage.getItem('lastMonthScores'))
      if (lastMonthScores.lastUpdated < moment().startOf('month').format('YYYY-MM-DDTHH:mm')) {
        getLastMonthScores()
      }
    }

    // check if allScore data is present
    if (!localStorage.hasOwnProperty('allScores')) {
      getAllScores()
    } else {
      const allScores = JSON.parse(localStorage.getItem('allScores'))
      // update score data if the score data is older than one hour
      if (allScores.lastUpdated < moment().subtract(1, 'hour').format('YYYY-MM-DDTHH:mm')) {
        getAllScores()
      }
    }
    this.setState({ authUser})
  }

  getSignedInUser = async (uid) => {
    const userData = await db.getDisplayNames(uid)
    userData.displayName.then((displayName) => {
      this.setState({
        signedInUser: uid,
        displayName,
      })
    })
      // .then(response => {
      //   const data = response.val()
      //   const displayName = data.displayName;

      // })    
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
      // <Router history
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

                {/* Admin Dashboard Routes */}
                <Route 
                  exact path={routes.CREATE_NEW_QUIZ}
                  render={(props) => <AdminDashboard {...props} renderPage={"Create New Quiz"} />}
                />
                <Route 
                  exact path={routes.MANAGE_QUIZZES}
                  render={(props) => <AdminDashboard {...props} renderPage={"Manage Quizzes"}/>}
                />
                <Route 
                  exact path={routes.MANAGE_USERS}
                  render={(props) => <AdminDashboard {...props} renderPage={"Manage Users"} />}
                />
                <Route
                  exact path={routes.ADMIN_LEADERBOARD}
                  render={(props) => <AdminDashboard {...props} renderPage={"Leaderboard"}/>}
                />
                <Route
                  exact path={routes.ADMIN_DASHBOARD}
                  render={(props) => <AdminDashboard {...props} renderPage={""}/>}
                />


                {/* Quiz Routes */}
                <Route
                  exact path={routes.QUIZ_ARCHIVE}
                  render={(props) => <QuizArchive {...props} signedInUser={this.state.signedInUser} />}
                />
                <Route
                  exact path={routes.QUIZ}
                  render={(props) => <Quiz {...props} storeScore={this.storeScore} signedInUser={this.state.signedInUser}/>}
                />
                <Route
                  exact path={routes.QUIZ_REDIRECT}
                  component={QuizRedirect}
                />
                <Route
                  exact path={routes.RSS_REDIRECT}
                  component={QuizRedirect}
                />
                <Route
                  exact path={routes.PROFILE_TO_QUIZ_REDIRECT}
                  component={ProfileToQuizRedirect}
                />
                <Route 
                  exact path={routes.ARCHIVED_QUIZ}
                  render={(props) => <ArchivedQuiz {...props} />}
                />
                <Route
                  exact path={routes.LEADERBOARD}
                  component={Leaderboard}
                />
                <Route
                  exact path={routes.LEADERBOARDV2}
                  component={Leaderboardv2}
                />
                <Route
                  exact path={routes.ABOUT}
                  component={About}
                />
                <Route 
                  exact path={routes.FAQ}
                  component={FAQ}
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
