import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

import { auth, withFirebase } from '../../firebase';
import * as routes from '../../constants/routes';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const PasswordForgetPage = () =>
  <div>
    <h1>Password Forget</h1>
    <PasswordForgetForm />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });
    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
      <Paper style={{ padding: '5vh', marginBottom: '40vh', marginTop: '10vh', width: '80vw', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
        <Helmet>
          <title>Reset Password | politIQ trivia</title>
        </Helmet>
        <h2>Forgot Your Password?</h2>
        <form onSubmit={this.onSubmit}>
          <TextField
            value={this.state.email}
            onChange={event => this.setState(byPropKey('email', event.target.value ))}
            type="text"
            placeholder="Email Address"
            style={{ width: '30vw'}}
            color="primary"
          />
          <Button disabled={isInvalid} type="submit" color="primary">
            Reset My Password
          </Button>

          { error && <p>{error.message}</p> }
        </form>
      </Paper>
    )
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export {
  PasswordForgetForm,
  PasswordForgetLink,
}
