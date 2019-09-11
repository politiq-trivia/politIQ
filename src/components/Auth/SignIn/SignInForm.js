import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { compose } from 'recompose';

// UI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { trackEvent } from '../../../utils/googleAnalytics';
import { auth, db, withFirebase } from '../../../firebase';
import * as routes from '../../../constants/routes';
import '../Auth.css';


const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  isSignedIn: false,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  isAdmin = async (uid) => {
    const { history } = this.props;
    await db.checkAdmin(uid)
      .then((response) => {
        const { isAdmin } = response.val();
        if (isAdmin) {
          this.props.checkAdmin();
          history.push(routes.ADMIN_DASHBOARD);
        } else {
          this.setState({ ...INITIAL_STATE });
          history.push(routes.HOME);
        }
      });
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      scoreObject,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        const userID = authUser.user.uid;
        const date = moment().format('YYYY-MM-DD');
        this.props.getSignedInUser(userID);
        db.lastActive(userID, date);
        this.props.history.push(routes.HOME);

        if (scoreObject) {
          db.setScore(authUser.user.uid, scoreObject.date, scoreObject.score)
            .catch((error) => console.log(error)); // eslint-disable-line no-console
        }

        trackEvent('Account', 'Sign In', 'SIGN_IN');
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid = password === ''
      || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          margin="normal"
          fullWidth
          value={email}
          onChange={(event) => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        /><br />
        <TextField
          margin="normal"
          fullWidth
          value={password}
          onChange={(event) => this.setState(byPropKey('password', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <Button disabled={isInvalid} type="submit" variant="contained" color="primary" style={{ marginTop: '2vh' }}>
          Sign In
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

SignInFormBase.propTypes = {
  checkAdmin: PropTypes.func.isRequired,
  scoreObject: PropTypes.object,
  getSignedInUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);


export default SignInForm;
