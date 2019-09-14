import React from 'react';

import AuthUserContext from './AuthUserContext';
import { withFirebase, auth } from '../../firebase';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      this.listener = auth.onAuthUserListener(
        (authUser) => {
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem('authUser'); // eslint-disable-line no-undef
          this.setState({ authUser: null });
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
