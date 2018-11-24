import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { db } from '../../firebase';

import ProfilePhoto from './ProfilePhoto';
import MediaQuery from 'react-responsive';

import Button from '@material-ui/core/Button';

import AuthUserContext from '../Auth/AuthUserContext';
import PasswordChangeForm from '../Auth/PasswordChange';
import withAuthorization from '../Auth/withAuthorization';

import Paper from '@material-ui/core/Paper';

// displayName doesn't work yet

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {}
    }
  }

  componentDidMount = () => {
    this.getUserInfo()
  }

  getUserInfo = async () => {
    await db.getOneUser(this.props.signedInUser)
      .then(response => {
        const userInfo = response.val()
        this.setState({
          userInfo: userInfo,
        })
      })
  }

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <Paper className="page-style profile">
            <Helmet>
              <title>Profile | politIQ</title>
            </Helmet>
            <div className="profile-header">
              <MediaQuery minWidth={416}>
                <ProfilePhoto authUser={authUser} />
              </MediaQuery>
              <div className="profile-info">
                <h1> User Information</h1>
                <MediaQuery maxWidth={415}>
                  <ProfilePhoto authUser={authUser}/>
                </MediaQuery>
                <p> <span style={{ fontWeight: 'bold'}}>Display Name:</span> {this.state.userInfo.displayName}</p>
                <p> <span style={{ fontWeight: 'bold'}}>Email Address:</span> {authUser.email}</p>
                <p> <span style={{ fontWeight: 'bold'}}>Bio:</span> {this.state.userInfo.bio} </p>
                <div className="profile-button-holder">
                  <Button color="primary">Edit Information</Button>
                  <Button color="primary">Preview Public Profile</Button>
                </div>
                <br/>

                <p> <span style={{ fontWeight: 'bold'}}>Reset Your Password:</span> </p>
                <PasswordChangeForm />
              </div>
            </div>
          </Paper>
        }
      </AuthUserContext.Consumer>
    )
  }
}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ProfilePage);
