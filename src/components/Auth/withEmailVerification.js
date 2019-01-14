import React from 'react';

import AuthUserContext from './AuthUserContext';
import { withFirebase, auth } from '../../firebase';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import bg from '../StaticPages/politiq-bg.jpg';


const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      auth
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <Paper className="home-holder">
                <h1>Almost There!</h1>
                {this.state.isSent ? (
                  <p style={{ width: '85vw', marginLeft: 'auto', marginRight: 'auto' }}>
                    Email confirmation sent! <br/><br/> Check your email (spam
                    folder included) for a confirmation email.
                    Refresh this page once you confirmed your email to continue to PolitIQ.
                  </p>
                ) : (
                  <p style={{ width: '85vw', marginLeft: 'auto', marginRight: 'auto' }}>
                    We need to verify your email to make sure you're a real person, not a robot. <br/><br/>
                    Check your email (spam folder
                    included) for a confirmation email or send
                    a new one.
                  </p>
                )}

                <Button
                  type="button"
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                  style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto'}}
                >
                  Resend confirmation Email
                </Button>
                <img src={bg} id="bg-image" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '10vh', marginTop: '5.5vh', height: '35vh', display: 'block' }} alt="democrats and republicans face off" />

              </Paper>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;