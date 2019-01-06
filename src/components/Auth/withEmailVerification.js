import React from 'react';

import AuthUserContext from './AuthUserContext';
import { withFirebase, auth } from '../../firebase';

const needsEmailVerification = authUser =>
    authUser &&
    !authUser.emailVerified &&
    authUser.providerData 
        .map(provider => provider.profiderId)
        .includes('password')

const withEmailVerification = Component => {
    class WithEmailVerification extends React.Component {
        constructor(props) {
            super(props);
            this.state = { 
                isSent: false,
            }
        }
        onSendEmailVerification = () => {
            auth.doSendEmailVerification()
            .then(() => this.setState({ isSent: true }));
        }
        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser => 
                        needsEmailVerification(authUser) ? (
                            <div>
                                {this.state.isSent ? (
                                    <p>Email confirmation sent: Check your email (spam folder included) for a confirmation email. Refresh this page once you have confirmed your email.</p>
                                ) : (
                                <p>
                                    Verify your email: Check your email (spam folder included) for a confirmation email or send another confirmation email.
                                </p>
                                )}
                                <button 
                                    type="button"
                                    onClick={this.onSendEmailVerification}
                                    disabled={this.state.isSent}
                                >
                                    Send confirmation email
                                </button>
                            </div>
                        ) : (
                            <Component {...this.props} />
                        )
                    }
                </AuthUserContext.Consumer>
            )
        }
    }

    return withFirebase(WithEmailVerification);
}

export default withEmailVerification;