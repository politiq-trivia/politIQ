import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { auth, withFirebase } from '../../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
    // this.props.toggleResetPassword()
  }

  render() {
    const {
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid = passwordOne !== passwordTwo
      || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit} className="password-change-form">
        <TextField
          fullWidth
          value={passwordOne}
          onChange={(event) => this.setState(byPropKey('passwordOne', event.target.value))}
          type="password"
          placeholder="New Password"
          margin="normal"
        />
        <TextField
          fullWidth
          value={passwordTwo}
          onChange={(event) => this.setState(byPropKey('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm New Password"
          margin="normal"
        />
        <Button color="primary" variant="contained" disabled={isInvalid} type="submit" style={{ marginTop: '3vh' }}>
          Reset My Password
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}


export default withFirebase(PasswordChangeForm);
