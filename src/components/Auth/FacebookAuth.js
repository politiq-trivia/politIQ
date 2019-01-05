import React, { Component } from 'react';
import { app, provider } from '../../firebase';
import { Toaster, Intent } from '@blueprintjs/core';

import { FacebookIcon } from 'react-share';
import Button from '@material-ui/core/Button';

class FacebookAuth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
    }
  }

  promptUserForPassword = () => {
    const password = prompt("You've already registered an account using a different sign-in method. Please enter your password to continue.")
    return password;
  }

  authWithFacebook() {
  app.auth().signInWithPopup(provider)
    .then((result, error) => {
      if (error.code === "auth/account-exists-with-different-credential") {
        // user's email already exists
        // the pending facebook credential
        const pendingCred = error.credential;
        // the provider account's email address
        const email = error.email;
        app.auth.fetchSignInMethodsForEmail(email).then(function(methods) {
          // if the user has several sign in methods
          let password;
          // const password = promptUserForPassword() // does not exist - TODO 
          app.auth.signInWithEmailAndPassword(email, password).then(function(user) {
            return user.link(pendingCred);
          }).then(function() {
            // facebook account successfully linked to existing firebase user
            console.log('success')
            // goToApp()
          });
          return;
        })
      } else {
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user)
        // something else here probably
      }

      // I want to take all of this data that i get back and store it (including the user's profile photo) in the db and then redirect that user to the home page.
    }).catch(function(error) {

      // if the user has already signed up using their email, prompt them to do that.

      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different provider.')
      } else {
        console.error(error)
      }
    })
}

  render() {
    return (
      <div style={{ marginTop: '10px'}}>
        <Toaster ref={(element) => { this.toaster = element }} />
        <Button onClick={() => {this.authWithFacebook()}}><FacebookIcon round={true} size={32}/> <span style={{ marginLeft: '5px'}}>Continue With Facebook</span></Button>
      </div>
    )
  }
}

export default FacebookAuth;
