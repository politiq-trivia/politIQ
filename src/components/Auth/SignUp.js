import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { compose } from 'recompose';
import axios from 'axios';


import { auth, db, withFirebase } from '../../firebase';
import { SignInLink } from './SignIn';

import * as routes from '../../constants/routes';
import * as roles from '../../constants/roles';

//UI
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import './Auth.css';

import FacebookAuth from './FacebookAuth'

class SignUpPage extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      error: false,
    }
  }

  fbError = () => {
    this.setState({
      error: true,
    })
  }

  render() {
    const { history, getSignedInUser, scoreObject} = this.props
    return (
      <Paper className="authCard signUp">
      <Helmet>
        <title>Sign Up | politIQ</title>
      </Helmet>
      <h1>Sign Up</h1>
      {this.state.error 
        ? <p style={{ color: 'red' }}>An error occurred during the Facebook authentication. Please try a different authentication method.</p>
        : null
      }
      <SignUpForm history={history} getSignedInUser={getSignedInUser} scoreObject={scoreObject}/>
      <FacebookAuth getSignedInUser={getSignedInUser}history={history} scoreObject={scoreObject} fbError={this.fbError}/>
      <SignInLink />
    </Paper>
    )
  }
}

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  affiliation: '',
  isAdmin: false,
  bio: '',
  error: null, 
  emailSubscribe: true,
  consent: false,
  tooltip1Open: false,
  tooltip2Open: false,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const affiliationText = `
Political ID is required in order to contribute to your political party's average team score, which is represented on the leaderboard page.
It will not be viewable to other users and you may change this on your profile at any time.
`

const emailText = `
  Email address is required so that we can contact you if you win the politIQ jackpot - no spam. 
`

class SignUpFormBase extends Component {
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
      emailSubscribe
    } = this.state;

    const rolesArray = [];

    if (isAdmin) {
      rolesArray.push(roles.ADMIN)
    }
    const {
      history,
      scoreObject
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // this one creates the user in the firebase database and is where I'll
        // add in the additional information (to the state in this component)
        db.doCreateUser(authUser.user.uid, username, email, affiliation, isAdmin, bio, rolesArray)
          // .then(() => {
          //   return auth.doSendEmailVerification();
          // })
          .then(() => {
            const date = moment().format('YYYY-MM-DD')
            db.lastActive(authUser.user.uid, date)
            this.props.getSignedInUser(authUser.user.uid)
            this.setState({ ...INITIAL_STATE });
            if(emailSubscribe) {
              this.subscribeToEmailUpdates(email, username, authUser.user.uid, 'weekly')
              this.subscribeToEmailUpdates(email, username, authUser.user.uid, 'daily')
            }
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
            if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
              error.message = ERROR_MSG_ACCOUNT_EXISTS;
            }
          });


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

  handleCheck = () => {
    this.setState({
      consent: !this.state.consent
    })
  }

  handleEmailCheck = () => {
    this.setState({
      emailSubscribe: !this.state.emailSubscribe
    })
  }

  handleTooltip1Open = () => {
    this.setState({
      tooltip1Open: true,
    })
  }

  handleTooltip1Close = () => {
    this.setState({
      tooltip1Open: false,
    })
  }

  handleTooltip2Open = () => {
    this.setState({
      tooltip2Open: true,
    })
  }

  handleTooltip2Close = () => {
    this.setState({
      tooltip2Open: false,
    })
  }

  // writing this one to be reuseable - subscribe user to a weekly and daily email update
  // and then save the mailchimp id of each user on each list in the user object in the firebase db.
  // this is necessary to be able to unsubscribe the user in the future. 
  subscribeToEmailUpdates = (email, displayName, uid, freq) => {
    axios.post(`https://politiq.herokuapp.com/email-subscribe-${freq}`, {
    // axios.post(`http://localhost:3001/email-subscribe-${freq}`, {
      email: email,
      displayName: displayName
    }).then(response => {
      db.addMailchimpId(uid, response.data.mailchimpId, freq)
    })
  }

  render() {
    const {
      username,
      email,
      affiliation,
      passwordOne,
      passwordTwo,
      error,
      consent,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      affiliation === '' ||
      consent === false;

    return (
      <form onSubmit={this.onSubmit}>
        <p style={{ fontSize: '12px', textAlign: 'left' }}>* indicates a required field</p>

        <TextField
          margin="normal"
          fullWidth
          required
          id="standard-required"
          value={username}
          onChange={event => this.setState(byPropKey('username', event.target.value ))}
          type="text"
          label="Display Name"
          style={{ marginTop: '0' }}
        />
        <TextField
          margin="normal"
          fullWidth
          required
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value ))}
          type="email"
          label="Email Address"
        />
        <ClickAwayListener onClickAway={this.handleTooltip1Close}>
          <Tooltip title={emailText} placement="left-start" onClose={this.handleTooltip1Close} open={this.state.tooltip1Open} disableFocusListener disableHoverListener disableTouchListener>
            <FormHelperText style={{ marginTop: '0', float: 'right'}}><Help onClick={this.handleTooltip1Open} color='primary' style={{ width: '0.6em'}}/></FormHelperText>
          </Tooltip>
        </ClickAwayListener>
        <TextField
          margin="normal"
          fullWidth
          required
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value ))}
          type="password"
          label="Password"
          style={{ marginTop: '0' }}
        />
        <TextField
          margin="normal"
          fullWidth
          required
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value ))}
          type="password"
          label="Confirm Password"
        />
        <TextField
          select
          required
          label="Political Affiliation"
          value={this.state.affiliation}
          onChange={event => this.setState(byPropKey('affiliation', event.target.value))}
          margin="normal"
          fullWidth
        >
          <MenuItem key="Republican" value="Republican">
            Republican
          </MenuItem>
          <MenuItem key="Democrat" value="Democrat">
            Democrat
          </MenuItem>
          <MenuItem key="Independent" value="Independent">
            Independent / Other
          </MenuItem>

        </TextField>
        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
          <FormHelperText>Affiliation will not be shared publicly.</FormHelperText>
          <ClickAwayListener onClickAway={this.handleTooltip2Close}>
            <Tooltip title={affiliationText} placement="left-start" onClose={this.handleTooltip2Close} open={this.state.tooltip2Open} disableFocusListener disableHoverListener disableTouchListener>
              <FormHelperText style={{ marginTop: '0'}}><Help onClick={this.handleTooltip2Open} color='primary' style={{ width: '0.6em'}}/></FormHelperText>
            </Tooltip>
          </ClickAwayListener>

        </div>
        <div style={{ display: 'flex', marginTop: '2vh' }}>
          <Checkbox 
            checked={this.state.emailSubscribe}
            onChange={this.handleEmailCheck}
            value="emailSubscribe"
            color="primary"
            style={{ display: 'inline' }}
          />
          <p style={{ textAlign: 'left' }}>I would like to receive email communications and push notifications from politIQ when new quizzes are posted.</p>
        </div>
        <div style={{ display: 'flex'}}>
          <Checkbox 
            checked={this.state.consent}
            onChange={this.handleCheck}
            value="consent"
            color="primary"
            style={{ display: 'inline'}}
          />
          <p style={{ textAlign: 'left' }}>I have read and agree to the <Link to={'/privacy-policy'} target="_blank">PolitIQ Privacy Policy and Terms of Serivce.</Link> *</p>  
        </div>

        <Button disabled={isInvalid} type="submit" variant="contained" color="primary" style={{ marginTop: '4vh'}}>
          Sign Up
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

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
