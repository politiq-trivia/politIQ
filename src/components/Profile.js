import React from 'react';

import AuthUserContext from './AuthUserContext';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from './withAuthorization';

import Paper from '@material-ui/core/Paper';
// import './Profile.css';

const ProfilePage = () =>
  <AuthUserContext.Consumer>
    {authUser =>
      <Paper className="page-style">
        <div className="profile-header">
          <img src="https://via.placeholder.com/150x150" alt="placeholder image"/>
          <div className="profile-info">
            <h1> User Information</h1>
            <p> Display Name: </p>
            <p> Email Address: {authUser.email}</p>
            { console.log(authUser)}
          </div>
        </div>
        {/* <PasswordForgetForm /> */}
        <PasswordChangeForm />
      </Paper>
    }
  </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ProfilePage);
