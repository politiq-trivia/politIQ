import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import { compose } from 'recompose';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import '../Auth.css';

import { auth, db, withFirebase } from '../../../firebase';

import * as routes from '../../../constants/routes';
import * as roles from '../../../constants/roles';

import { trackEvent } from '../../../utils/googleAnalytics';

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
  consent: true,
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
`;

const emailText = `
  Email address is required so that we can contact you if you win the politIQ jackpot - we do not send spam. 
`;

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
      emailSubscribe,
    } = this.state;

    const rolesArray = [];

    if (isAdmin) {
      rolesArray.push(roles.ADMIN);
    }
    const {
      history,
      scoreObject,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // this one creates the user in the firebase database and is where I'll
        // add in the additional information (to the state in this component)
        db.doCreateUser(authUser.user.uid, username, email, affiliation, isAdmin, bio, rolesArray)
          .then(() => {
            const date = moment().format('YYYY-MM-DD');
            db.lastActive(authUser.user.uid, date);
            this.props.getSignedInUser(authUser.user.uid);
            this.setState({ ...INITIAL_STATE });
            if (emailSubscribe) {
              this.subscribeToEmailUpdates(email, username, authUser.user.uid, 'weekly');
              this.subscribeToEmailUpdates(email, username, authUser.user.uid, 'daily');
            }
            trackEvent('account', 'Sign up with email and password', 'SIGN_UP');
            history.push(routes.HOME);
          })
          .catch((error) => {
            this.setState(byPropKey('error', error));
            if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
              error.message = ERROR_MSG_ACCOUNT_EXISTS; // eslint-disable-line no-param-reassign
            }
          });


        if (scoreObject) {
          db.setScore(authUser.user.uid, scoreObject.date, scoreObject.score)
            .catch((error) => console.log(error)); // eslint-disable-line no-console
        }
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  handleCheck = () => {
    this.setState({
      consent: !this.state.consent,
    });
  }

  handleEmailCheck = () => {
    this.setState({
      emailSubscribe: !this.state.emailSubscribe,
    });
  }

  handleTooltip1Open = () => {
    this.setState({
      tooltip1Open: true,
    });
  }

  handleTooltip1Close = () => {
    this.setState({
      tooltip1Open: false,
    });
  }

  handleTooltip2Open = () => {
    this.setState({
      tooltip2Open: true,
    });
  }

  handleTooltip2Close = () => {
    this.setState({
      tooltip2Open: false,
    });
  }

  // writing this one to be reuseable - subscribe user to a weekly and daily email update
  // and then save the mailchimp id of each user on each list in the user object in the firebase db.
  // this is necessary to be able to unsubscribe the user in the future.
  subscribeToEmailUpdates = (email, displayName, uid, freq) => {
    axios.post(`https://politiq.herokuapp.com/email-subscribe-${freq}`, {
      // axios.post(`http://localhost:3001/email-subscribe-${freq}`, {
      email,
      displayName,
    }).then((response) => {
      db.addMailchimpId(uid, response.data.mailchimpId, freq);
    });
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
      passwordOne === ''
      || email === ''
      || username === ''
      || affiliation === ''
      || consent === false;

    return (
      <form onSubmit={this.onSubmit}>
        <p style={{ fontSize: '12px', textAlign: 'left' }}>* indicates a required field</p>

        <TextField
          margin="normal"
          fullWidth
          required
          id="standard-required"
          value={username}
          onChange={(event) => this.setState(byPropKey('username', event.target.value))}
          type="text"
          label="Username"
          style={{ marginTop: '0' }}
        />
        <TextField
          margin="normal"
          fullWidth
          required
          value={email}
          onChange={(event) => this.setState(byPropKey('email', event.target.value))}
          type="email"
          label="Email Address"
        />
        <FormHelperText>Your email will not be sold, rented, or shared with anyone.</FormHelperText>

        <ClickAwayListener onClickAway={this.handleTooltip1Close}>
          <Tooltip title={emailText} placement="left-start" onClose={this.handleTooltip1Close} open={this.state.tooltip1Open} disableFocusListener disableHoverListener disableTouchListener>
            <FormHelperText style={{ marginTop: '0', float: 'right', width: '0.6em' }}><Help onClick={this.handleTooltip1Open} color='primary' /></FormHelperText>
          </Tooltip>
        </ClickAwayListener>
        <TextField
          margin="normal"
          fullWidth
          required
          value={passwordOne}
          onChange={(event) => this.setState(byPropKey('passwordOne', event.target.value))}
          type="password"
          label="Password"
          style={{ marginTop: '0' }}
        />

        <TextField
          select
          required
          label="Political Affiliation"
          value={this.state.affiliation}
          onChange={(event) => this.setState(byPropKey('affiliation', event.target.value))}
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
          <MenuItem key="none" value="none">
            I choose not to disclose
          </MenuItem>

        </TextField>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormHelperText>Affiliation will not be shared publicly or privately.</FormHelperText>
          <ClickAwayListener onClickAway={this.handleTooltip2Close}>
            <Tooltip title={affiliationText} placement="left-start" onClose={this.handleTooltip2Close} open={this.state.tooltip2Open} disableFocusListener disableHoverListener disableTouchListener>
              <FormHelperText style={{ marginTop: '0', float: 'right', width: '0.6em' }}><Help onClick={this.handleTooltip2Open} color='primary' /></FormHelperText>
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
          <p style={{ textAlign: 'left' }}>I would like to receive email notifications from politIQ when new quizzes are posted (no spam).</p>
        </div>

        <FormHelperText>By registering an account I confirm I have read and agree to the <a href="https://www.whatsmypolitiq.com/privacy-policy">PolitIQ Privacy Policy and Terms of Service</a> </FormHelperText>

        <Button disabled={isInvalid} type="submit" variant="contained" color="primary" style={{ marginTop: '4vh' }}>
          Sign Up
        </Button>


        {error && <p>{error.message}</p>}
      </form >
    );
  }
}

SignUpFormBase.propTypes = {
  scoreObject: PropTypes.object.isRequired,
  getSignedInUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpForm;
