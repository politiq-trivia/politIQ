import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { compose } from 'recompose';

import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth, db, withFirebase } from '../../firebase';
import * as routes from '../../constants/routes';

// UI
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Auth.css';
import FacebookAuth from './FacebookAuth';


const SignInPage = ({ history, getSignedInUser, scoreObject, checkAdmin }) => {
  return (
    <Paper className="authCard signIn">
      <Helmet>
        <title>Sign In | politIQ</title>
      </Helmet>
      <h1>Sign In</h1>
      <SignInForm  history={history} getSignedInUser={getSignedInUser} scoreObject={scoreObject} checkAdmin={checkAdmin}/>
      <FacebookAuth getSignedInUser={getSignedInUser}/>
      <PasswordForgetLink />
      <SignUpLink />
    </Paper>
  )
}

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  isSignedIn: false,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  isAdmin = async (uid) => {
    console.log('isAdmin in signIn file called')
    const { history } = this.props;
    await db.checkAdmin(uid)
      .then(response => {
        const isAdmin = response.val().isAdmin;
        console.log(response.val(), 'this is the response from isAdmin')
        if (isAdmin) {
          console.log(isAdmin, 'this is is admin')
          this.props.checkAdmin()
          history.push(routes.ADMIN_DASHBOARD)
        } else {
          console.log('user is not admin')
          this.setState({ ...INITIAL_STATE });
          history.push(routes.HOME)
        }
      })
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      scoreObject
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        const userID = authUser.user.uid;
        const date = moment().format('YYYY-MM-DD')
        this.props.getSignedInUser(userID)
        db.lastActive(userID, date)
        this.props.history.push(routes.HOME)

        if (scoreObject) {
          db.setScore(authUser.user.uid, scoreObject.date, scoreObject.score)
            .catch(error => console.log(error))
        }
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          margin="normal"
          fullWidth
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        /><br />
        <TextField
          margin="normal"
          fullWidth
          value={password}
          onChange={event => this.setState(byPropKey('password', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <Button disabled={isInvalid} type="submit" variant="contained" color="primary" style={{ marginTop: '2vh'}}>
          Sign In
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInLink = () =>
  <p>
    Already have an account?
    {' '}
    <Link to={routes.SIGN_IN}>Log in here.</Link>
  </p>

export default withRouter(SignInPage);

export {
  SignInForm,
  SignInLink
};
