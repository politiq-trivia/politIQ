import React, { Component } from 'react';
import { app, provider, db} from '../../firebase';
import { withRouter } from 'react-router-dom';

import { HOME } from '../../constants/routes';

import { FacebookIcon } from 'react-share';
import Button from '@material-ui/core/Button';

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class FacebookAuth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
    }
  }

  promptUserForPassword = () => {
    const userPassword = prompt("You've already registered an account using a different sign-in method. Please enter your password to continue.")
    return userPassword;
  }

  redirect = () => {
    this.props.history.push(HOME)
  }

  doSignInWithFacebook = () => {
    // console.log()
    app.auth().signInWithPopup(provider)
    .then((result, error) => {
      if (error && error.code === "auth/account-exists-with-different-credential") {
        console.log('accoutn already exists')
      } else {
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        const uid = user.uid;
        db.doCreateUser(uid, user.displayName, result.additionalUserInfo.profile.email, "", false, "")
        this.props.getSignedInUser(uid)
        // something else here probably
        // console.log(this.props.history, 'history from insize the auth func')
      }
      // console.log(result, 'this is the result')
      this.redirect();


      // I want to take all of this data that i get back and store it (including the user's profile photo) in the db and then redirect that user to the home page.
    }).catch(function(error) {

      // if the user has already signed up using their email, prompt them to do that.

      // Handle Errors here.
      var errorCode = error.code;
      if (errorCode === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
        console.error(error.message)
        // console.log(this.state, 'state in facebook auth')
        // this.setState({ error })
      }
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        // I don't want to use an alert here, I want to trigger a modal. 

        alert('You have already signed up with a different provider.')
        // user's email already exists
        // the pending facebook credential
        const pendingCred = error.credential;
        // the provider account's email address
        const email = error.email;
      //   app.auth.fetchSignInMethodsForEmail(email).then(function(methods) {
      //     // if the user has several sign in methods
      //     const password = this.promptUserForPassword() // does not exist - TODO 
      //     app.auth.signInWithEmailAndPassword(email, password).then(function(user) {
      //       return user.link(pendingCred);
      //     }).then(function() {
      //       // facebook account successfully linked to existing firebase user
      //       console.log('success')
      //       // goToApp()
      //     });
      //     return;
      //   })
      // } else {
      //   console.error(error)
      }
    })
  }

  setError = (error) => {
    this.setState({ error })
  }

  onSubmit = event => {
    this.doSignInWithFacebook()
    .then(socialAuthUser => {
      this.setState({ error: null });
      this.props.history.push(HOME);
    })
    .catch(error => {
      this.setState({ error });
    });
    event.preventDefault()
  }

  render() {
    const { error } = this.state; 
    return (
      <div style={{ marginTop: '10px'}}>
        <Button onClick={() => this.doSignInWithFacebook()}><FacebookIcon round={true} size={32}/> <span style={{ marginLeft: '5px'}}>Continue With Facebook</span></Button>
        {error && <p>{error.message}</p>}
      </div>
    )
  }
}

export default withRouter(FacebookAuth);
