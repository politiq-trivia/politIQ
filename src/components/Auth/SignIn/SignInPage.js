import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';

import { Paper } from '@material-ui/core';

import SignUpLink from '../SignUp/SignUpLink';
import { PasswordForgetLink } from '../PasswordForget';
import FacebookAuth from '../FacebookAuth';
import SignInForm from './SignInForm';


class SignInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  fbError = () => {
    this.setState({
      error: true,
    });
  }

  render() {
    const {
      history,
      getSignedInUser,
      scoreObject,
      checkAdmin,
    } = this.props;

    return (
      <Paper className="authCard signIn">
        <Helmet>
          <title>Sign In | politIQ trivia</title>
        </Helmet>
        <h1>Sign In</h1>
        <SignInForm
          history={history}
          getSignedInUser={getSignedInUser}
          scoreObject={scoreObject} checkAdmin={checkAdmin}
        />
        <FacebookAuth
          getSignedInUser={getSignedInUser}
          scoreObject={scoreObject}
          fbError={this.fbError}
        />
        <PasswordForgetLink />
        <SignUpLink />
      </Paper>
    );
  }
}

SignInPage.propTypes = {
  history: PropTypes.object.isRequired,
  getSignedInUser: PropTypes.func.isRequired,
  checkAdmin: PropTypes.func.isRequired,
  scoreObject: PropTypes.object,
};

export default withRouter(SignInPage);
