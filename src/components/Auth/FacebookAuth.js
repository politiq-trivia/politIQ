import React, { Component } from 'react';
import { app, provider, db } from '../../firebase';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { compose } from 'recompose';

import { HOME } from '../../constants/routes';

import { FacebookIcon } from 'react-share';
import Button from '@material-ui/core/Button';

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead.
`;

class FacebookAuth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
    }
  }
  
  componentWillUnmount = () => {
    // this.listener();
  }

  promptUserForPassword = () => {
    const userPassword = prompt("You've already registered an account using a different sign-in method. Please enter your password to continue.")
    return userPassword;
  }

  redirect = () => {
    this.props.history.push(HOME)
  }

  doSignInWithFacebook = () => {
    app.auth().signInWithPopup(provider)
    .then((result, error) => {
      if (error && error.code === "auth/account-exists-with-different-credential") {
        console.log('accoutn already exists')
      } else {
        // The signed-in user info.
        var user = result.user;
        const uid = user.uid;
        db.getOneUser(uid)
          .then(response => {
            const data = response.val()
            // if we're creating a new account, the response will be null
            if (data === null) {
              db.doCreateUser(uid, user.displayName, result.additionalUserInfo.profile.email, "", false, "", [])
                .then(() => {
                  const date = moment().format('YYYY-MM-DD')
                  db.lastActive(uid, date)
                  this.props.getSignedInUser(uid)
                  window.location.replace('/home');
                })
                // this.listener();
                if (localStorage.authUser) {
                  const authUser = JSON.parse(localStorage.authUser)
                  this.setState({
                    signedInUser: authUser.uid,
                    isAdmin: true
                  })
                }
            } else { // if the user already has an account
              const date = moment().format('YYYY-MM-DD')
              db.lastActive(uid, date)
              this.props.getSignedInUser(uid)
              this.props.history.push(HOME)

              if(this.props.scoreObject && this.props.scoreObject === {}) {
                db.setScore(uid, this.props.scoreObject.date, this.props.scoreObject.score)
                  .catch(error => console.log(error))
              }
            }
          })
      }
      this.redirect();

    }).catch(error => {
      const errorCode = error.code;
      if (errorCode === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
        console.error(error.message)
        this.setState({ error })
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

export default compose(
  withRouter,
)(FacebookAuth);
