import React from 'react';

import ProfilePhoto from './ProfilePhoto';

import AuthUserContext from './AuthUserContext';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from './withAuthorization';

import Paper from '@material-ui/core/Paper';

// displayName doesn't work yet

const ProfilePage = () => {
  return (
    <AuthUserContext.Consumer>
      {authUser =>
        <Paper className="page-style profile">
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
