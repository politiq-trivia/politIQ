import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { compose } from 'recompose';
import { FacebookIcon } from 'react-share';
import Button from '@material-ui/core/Button';

import { app, googleProvider, db } from '../../firebase';
import { HOME } from '../../constants/routes';
import { trackEvent } from '../../utils/googleAnalytics';

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead.
`;

class GoogleAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  componentWillUnmount = () => {
    // this.listener();
  }

  promptUserForPassword = () => {
    const userPassword = prompt("You've already registered an account using a different sign-in method. Please enter your password to continue."); // eslint-disable-line
    return userPassword;
  }

  redirect = () => {
    this.props.history.push(HOME);
  }

  doSignInWithGoogle = () => {
    app.auth().signInWithPopup(googleProvider)
      .then((result, error) => {
        if (error && error.code === 'auth/account-exists-with-different-credential') {
          console.log('account already exists'); // eslint-disable-line no-console
        } else {
        // The signed-in user info.
          const { user } = result;
          const { uid } = user;
          db.getOneUser(uid)
            .then((response) => {
              const data = response.val();
              // if we're creating a new account, the response will be null
              if (data === null) {
                db.doCreateUser(uid, user.displayName, result.additionalUserInfo.profile.email, '', false, '', [])
                  .then(() => {
                    const date = moment().format('YYYY-MM-DD');
                    db.lastActive(uid, date);
                    this.props.getSignedInUser(uid);
                    localStorage.setItem('googAuth', 'true'); // eslint-disable-line no-undef
                    window.location.replace('/profile'); // eslint-disable-line no-undef
                  });
                // this.listener();
                if (localStorage.authUser) { // eslint-disable-line no-undef
                  const authUser = JSON.parse(localStorage.authUser);// eslint-disable-line no-undef
                  this.setState({
                    signedInUser: authUser.uid,
                    isAdmin: true,
                  });
                }
                trackEvent('Account', 'Sign up with Google', 'SIGN_UP');
              } else { // if the user already has an account
                const date = moment().format('YYYY-MM-DD');
                db.lastActive(uid, date);
                this.props.getSignedInUser(uid);
                this.props.history.push(HOME);

                if (this.props.scoreObject && this.props.scoreObject === {}) {
                  db.setScore(uid, this.props.scoreObject.date, this.props.scoreObject.score)
                    .catch((error) => console.log(error)); // eslint-disable-line
                }
              }
            });
        }
        this.redirect();
      }).catch((error) => {
        const errorCode = error.code;
        if (errorCode === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS; // eslint-disable-line no-param-reassign
          console.error(error.message); // eslint-disable-line no-console
          this.setState({ error });
        }
        this.props.fbError();
      });
  }

  setError = (error) => {
    this.setState({ error });
  }

  onSubmit = (event) => {
    this.doSignInWithGoogle()
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });
    event.preventDefault();
  }

  render() {
    const { error } = this.state;
    return (
      <div style={{ marginTop: '10px' }}>
        <Button onClick={() => this.doSignInWithGoogle()}>
          <img style = {{ height: "35px", margin: "5px"}}src={require("../../googleIcon.png")}/>
          <span style={{ marginLeft: '5px' }}>Continue With Google</span>
        </Button>
        {error && <p>{error.message}</p>}
      </div>
    );
  }
}

GoogleAuth.propTypes = {
  history: PropTypes.object.isRequired,
  getSignedInUser: PropTypes.func.isRequired,
  scoreObject: PropTypes.object,
  fbError: PropTypes.func,
};

export default compose(
  withRouter,
)(GoogleAuth);
