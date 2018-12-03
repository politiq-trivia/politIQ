import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { auth, db } from '../../firebase';
import { SignInLink } from './SignIn';

import * as routes from '../../constants/routes';

//UI
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import './Auth.css';

import FacebookAuth from './FacebookAuth'

const SignUpPage = ({ history, getSignedInUser }) =>
  <Paper className="authCard signUp">
    <Helmet>
      <title>Sign Up | politIQ</title>
    </Helmet>
    <h1>Sign Up</h1>
    <SignUpForm history={history} getSignedInUser={getSignedInUser}/>
    <FacebookAuth />
    <SignInLink />
  </Paper>

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  affiliation: '',
  isAdmin: false,
  bio: '',
  error: null
};

const affiliations = [
  {
    value: 'Democrat',
  },
  {
    value: 'Republican',
  },
  {
    value: 'Independent',
  },
];

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
      affiliation,
      isAdmin,
      bio,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // this one creates the user in the firebase database and is where I'll
        // add in the additional information (to the state in this component)
        db.doCreateUser(authUser.user.uid, username, email, affiliation, isAdmin, bio)
          .then(() => {
            const date = moment().format('YYYY-MM-DD')
            db.lastActive(authUser.user.uid, date)
            this.props.getSignedInUser(authUser.user.uid)
            this.setState({ ...INITIAL_STATE });
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });

      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

      event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      affiliation,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      affiliation === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          margin="normal"
          fullWidth
          value={username}
          onChange={event => this.setState(byPropKey('username', event.target.value ))}
          type="text"
          placeholder = "Display Name"
        />
        <TextField
          margin="normal"
          fullWidth
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value ))}
          type="text"
          placeholder = "Email Address"
        />
        <TextField
          margin="normal"
          fullWidth
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value ))}
          type="password"
          placeholder = "Password"
        />
        <TextField
          margin="normal"
          fullWidth
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value ))}
          type="password"
          placeholder = "Confirm Password"
        />
        <TextField
          select
          label="Political Affiliation"
          value={this.state.affiliation}
          onChange={event => this.setState(byPropKey('affiliation', event.target.value))}
          margin="normal"
          fullWidth
        >
          {affiliations.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
        <FormHelperText>Affiliation will not be shared publicly.</FormHelperText>
        <TextField
          id="standard-multiline-flexible"
          label="Add a short bio (optional)"
          multiline
          rowsMax="4"
          value={this.state.bio}
          onChange={event => this.setState(byPropKey('bio', event.target.value))}
          margin="normal"
          fullWidth
        />
        <FormHelperText>This will be visible to other PolitIQ users.</FormHelperText>

        <Button disabled={isInvalid} type="submit" variant="contained" color="primary" style={{ marginTop: '4vh'}}>
          Sign Up
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
}
