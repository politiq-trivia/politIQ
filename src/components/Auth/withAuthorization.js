import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import withAuthentication from "./withAuthentication";
import AuthUserContext from "./AuthUserContext";
import { withFirebase, auth } from "../../firebase";
import * as routes from "../../constants/routes";

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = auth.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            console.log("condition not met");
            this.props.history.push(routes.SIGN_IN);
          }
        },
        () => {
          this.props.history.push(routes.SIGN_IN);
        }
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;
