import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';

import { Paper } from '@material-ui/core';

import FacebookAuth from '../FacebookAuth';
import GoogleAuth from '../GoogleAuth';
import SignUpForm from './SignUpForm';
import SignInLink from '../SignIn/SignInLink';


class SignUpPage extends Component {
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
  };

  render() {
    const { history, getSignedInUser, scoreObject } = this.props;
    return (
        <Paper className="authCard signUp">
        <Helmet>
          <title>Sign Up | politIQ trivia</title>
        </Helmet>
        <h1>Sign Up</h1>
        <GoogleAuth
            getSignedInUser={getSignedInUser}
            history={history}
            scoreObject={scoreObject}
            fbError={this.fbError}
        />
        <FacebookAuth
            getSignedInUser={getSignedInUser}
            history={history}
            scoreObject={scoreObject}
            fbError={this.fbError}
        />
        {this.state.error
          ? <p style={{ color: 'red' }}>An error occurred during the Facebook authentication. Please try a different authentication method.</p>
          : null
        }
        <SignUpForm history={history} getSignedInUser={getSignedInUser} scoreObject={scoreObject}/>
     
        <SignInLink />
      </Paper>
    );
  }
}

SignUpPage.propTypes = {
  history: PropTypes.object.isRequired,
  scoreObject: PropTypes.object,
  getSignedInUser: PropTypes.func.isRequired,
};

export default withRouter(SignUpPage);
