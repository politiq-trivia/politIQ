import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import moment from "moment";

import "./App.css";
import {
  getLastMonthScores,
  getUserScores,
  getAllScores
} from "../utils/storeScoreData";

import Sponsor from "./StaticPages/sponsor"
import Navigation from "./Navigation/Navigation";
import LandingPage from "./StaticPages/Landing";
import SignUpPage from "./Auth/SignUp/SignUpPage";
import SignInPage from "./Auth/SignIn/SignInPage";
import PasswordForgetPage from "./Auth/PasswordForget";
import HomePage from "./StaticPages/HomePage";
import ProfilePage from "./Profile/Profile";
import Footer from "./Footer";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import QuizArchive from "./QuizEngine/QuizArchive";
import ArchivedQuiz from "./QuizEngine/ArchivedQuiz";
import Quiz from "./QuizEngine/Quiz";
import Leaderboard from "./Leaderboard2/Leaderboard";
import About from "./StaticPages/About";
import QuestionSubmitForm from "./QuestionSubmit/QuestionSubmitForm";
import ReviewQuestions from "./AdminDashboard/SubmittedQuestions/ReviewQuestions";
import ReviewContestedQuestions from "./AdminDashboard/ReviewContestedQuestions";
import PublicProfile from "./Profile/PublicProfile";
import PrivacyPolicy from "./StaticPages/PrivacyPolicy";
import AddToHomescreen from "./StaticPages/AddToHomescreen";
import QuizRedirect from "./QuizEngine/QuizRedirect";
import ProfileToQuizRedirect from "./QuizEngine/ProfileToQuizRedirect";
import LatestQuizRedirect from "./QuizEngine/LatestQuizRedirect";
import NoMatch from "./StaticPages/NoMatch";
import FAQ from "./StaticPages/FAQ";

import QuizContext from "./context/quizContext";
import ScoreContext from "./context/scoreContext";

import * as routes from "../constants/routes";
import { firebase, db, withFirebase } from "../firebase";
import withAuthentication from "./Auth/withAuthentication";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#b359f8",
      light: "#C790F1"
    },
    secondary: {
      main: "#000000"
    },
    default: {
      main: "#FFDF00"
    }
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1em"
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
      displayName: "",
      isAdmin: false,
      quizzes: {},
      scores: {}
    };
  }

  componentDidMount() {
    // sets the auth user in app state
    this.listener = firebase.auth.onAuthStateChanged(authUser => {
      authUser // eslint-disable-line no-unused-expressions
        ? this.initializeApp(authUser)
        : this.setState({ authUser: null });
    });
    // checks local storage for auth user - maybe there was a user from a
    // previous session
    /*  if (localStorage.authUser) {
       // eslint-disable-line no-undef
       const authUser = JSON.parse(localStorage.authUser); // eslint-disable-line no-undef
       this.setState({
         signedInUser: authUser.uid,
         isAdmin: true
       });
     } */

    /*     storeQuizzes();   */
    //Instead of storeQuizzes, we will get the quizzes and set them in quizContext provider
    db.getQuizzes()
      .then(response => {
        this.setState({ quizzes: response.val() });
      })
      .catch(err => console.log(err));

    /*     storeScores();   */
    //Instead of storeQuizzes, we will get the quizzes and set them in quizContext provider
    db.getScores()
      .then(response => {
        const data = response.val();
        this.setState({ scores: data })
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    this.listener();
  }

  initializeApp = authUser => {

    // get all the user's scores (all time)
    getUserScores(authUser.uid);

    // check if lastMonthScores are present
    if (!localStorage.hasOwnProperty("lastMonthScores")) {
      // eslint-disable-line
      getLastMonthScores();
    } else {
      // check if lastMonthScores have been updated since the start of a new month.
      // if not, update them.
      const lastMonthScores = JSON.parse(
        localStorage.getItem("lastMonthScores")
      ); // eslint-disable-line no-undef
      if (
        lastMonthScores.lastUpdated <
        moment()
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm")
      ) {
        getLastMonthScores();
      }
    }

    // check if allScore data is present
    if (!localStorage.hasOwnProperty("allScores")) {
      // eslint-disable-line
      getAllScores();
    } else {
      const allScores = JSON.parse(localStorage.getItem("allScores")); // eslint-disable-line no-undef
      // update score data if the score data is older than one hour
      if (
        allScores.lastUpdated <
        moment()
          .subtract(10, "minute")
          .format("YYYY-MM-DDTHH:mm")
      ) {
        getAllScores();
      }
    }
    this.setState({ authUser });
  };

  getSignedInUser = async uid => {
    console.log("get Signed in User runs")
    const userData = await db.getDisplayNames(uid);
    userData.displayName.then(displayName => {
      this.setState({
        signedInUser: uid,
        displayName
      });
    });
  };

  checkAdmin = () => {
    this.setState({
      isAdmin: true
    });
  };

  // stores the score object for a non-signed in user
  // so that they can save their score by signing up
  storeScore = scoreObject => {
    this.setState({
      scoreObject
    });
  };

  clearStateOnSignout = () => {
    this.setState({
      authUser: null,
      signedInUser: "",
      scoreObject: {},
      displayName: "",
      isAdmin: false
    });
  };

  render() {
    return (
      // <Router history
      //Provide quiz value to everything
      <ScoreContext.Provider value={this.state.scores}>
        <QuizContext.Provider value={this.state.quizzes}>
          <MuiThemeProvider theme={theme}>
            <QuizContext.Consumer>
              {quizContext => (
                <Navigation
                  quizContext={quizContext}
                  signedInUser={this.state.signedInUser}
                />
              )}
            </QuizContext.Consumer>

            <Switch>
              <Route
                exact
                path={routes.LANDING}
                render={props =>
                  this.state.authUser ? <Redirect to="/home" /> : <LandingPage />
                }
              />
              <Route exact path={"/home"} component={HomePage} />
              <Route
                exact
                path={routes.SIGN_UP}
                render={props => (
                  <SignUpPage
                    {...props}
                    getSignedInUser={this.getSignedInUser}
                    scoreObject={this.state.scoreObject}
                  />
                )}
              />
              <Route
                exact
                path={routes.SIGN_IN}
                render={props => (
                  <SignInPage
                    {...props}
                    getSignedInUser={this.getSignedInUser}
                    scoreObject={this.state.scoreObject}
                    checkAdmin={this.checkAdmin}
                  />
                )}
              />
              <Route
                exact
                path={"/sponsor"}
                render={Sponsor}
              />
              <Route
                exact
                path={routes.PASSWORD_FORGET}
                component={PasswordForgetPage}
              />
              <Route
                exact
                path={routes.PROFILE}
                render={props => (
                  <ProfilePage
                    {...props}
                    signedInUser={this.state.signedInUser}
                  />
                )}
              />
              <Route
                exact
                path={routes.HOME}
                render={props => (
                  <HomePage {...props} signedInUser={this.state.signedInUser} />
                )}
              />

              {/* Admin Dashboard Routes */}
              <Route
                exact
                path={routes.CREATE_NEW_QUIZ}
                render={props => (
                  <AdminDashboard {...props} renderPage={"Create New Quiz"} />
                )}
              />
              <Route
                exact
                path={routes.MANAGE_QUIZZES}
                render={props => (
                  <AdminDashboard {...props} renderPage={"Manage Quizzes"} />
                )}
              />
              <Route
                exact
                path={routes.MANAGE_USERS}
                render={props => (
                  <AdminDashboard {...props} renderPage={"Manage Users"} />
                )}
              />
              <Route
                exact
                path={routes.ADMIN_LEADERBOARD}
                render={props => (
                  <AdminDashboard {...props} renderPage={"Leaderboard"} />
                )}
              />
              <Route
                exact
                path={routes.ADMIN_DASHBOARD}
                render={props => <AdminDashboard {...props} renderPage={""} />}
              />

              {/* Quiz Routes */}
              <Route
                exact
                path={routes.QUIZ_ARCHIVE}
                render={props => (
                  <QuizArchive
                    {...props}
                    signedInUser={this.state.signedInUser}
                  />
                )}
              />
              <Route
                exact
                path={routes.QUIZ}
                render={props => (
                  <Quiz
                    {...props}
                    storeScore={this.storeScore}
                    signedInUser={this.state.signedInUser}
                  />
                )}
              />
              <Route exact path={routes.QUIZ_REDIRECT} component={QuizRedirect} />
              <Route
                exact
                path={routes.PROFILE_TO_QUIZ_REDIRECT}
                component={ProfileToQuizRedirect}
              />
              <Route
                exact
                path={routes.LATEST_QUIZ}
                component={LatestQuizRedirect}
              />
              <Route
                exact
                path={routes.ARCHIVED_QUIZ}
                render={props => <ArchivedQuiz {...props} />}
              />
              <Route exact path={routes.LEADERBOARD} component={Leaderboard} />
              <Route exact path={routes.ABOUT} component={About} />
              <Route exact path={routes.FAQ} component={FAQ} />
              <Route
                exact
                path={routes.SUBMIT_QUESTION}
                render={props => (
                  <QuestionSubmitForm
                    {...props}
                    signedInUser={this.state.signedInUser}
                  />
                )}
              />
              <Route exact path={routes.REVIEW} component={ReviewQuestions} />
              <Route
                exact
                path={routes.CONTEST}
                component={ReviewContestedQuestions}
              />
              <Route
                exact
                path={routes.USER_PROFILES}
                render={props => (
                  <PublicProfile
                    {...props}
                    key={window.location.pathName} // eslint-disable-line no-undef
                    signedInUser={this.state.signedInUser}
                    displayName={this.state.displayName}
                    isAdmin={this.state.isAdmin}
                  />
                )}
              />
              <Route exact path={routes.PRIVACY} component={PrivacyPolicy} />
              <Route
                exact
                path={routes.ADD_TO_HOMESCREEN}
                component={AddToHomescreen}
              />

              <Route path="*" component={NoMatch} />
            </Switch>
            <Footer signedInUser={this.state.signedInUser} />
          </MuiThemeProvider>
        </QuizContext.Provider>
      </ScoreContext.Provider>
    );
  }
}

export default withFirebase(withAuthentication(App));
