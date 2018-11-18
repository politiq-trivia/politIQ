import React from 'react';
import { Helmet } from 'react-helmet';

import ProfilePhoto from './ProfilePhoto';

import AuthUserContext from '../Auth/AuthUserContext';
import PasswordChangeForm from '../Auth/PasswordChange';
import withAuthorization from '../Auth/withAuthorization';

import Paper from '@material-ui/core/Paper';

// displayName doesn't work yet

const ProfilePage = () => {
  return (
    <AuthUserContext.Consumer>
      {authUser =>
        <Paper className="page-style profile">
          <Helmet>
            <title>Profile | politIQ</title>
          </Helmet>
          <div className="profile-header">
            <ProfilePhoto authUser={authUser} />
            <div className="profile-info">
              <h1> User Information</h1>
              <p> Display Name: {authUser.displayName}</p>
              <p> Email Address: {authUser.email}</p><br/>
              <p> Reset Your Password: </p>
              <PasswordChangeForm />
            </div>
          </div>


        </Paper>
      }
    </AuthUserContext.Consumer>
  )
}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ProfilePage);
