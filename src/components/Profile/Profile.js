import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

import ProfilePhoto from './ProfilePhoto';
import MediaQuery from 'react-responsive';

import Button from '@material-ui/core/Button';
import './profile.css';

import AuthUserContext from '../Auth/AuthUserContext';
import PasswordChangeForm from '../Auth/PasswordChange';
import withAuthorization from '../Auth/withAuthorization';
import EditProfile from './EditProfile';
import UserScoreboard from '../Leaderboard/UserScoreboard';

import Paper from '@material-ui/core/Paper';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      editingProfile: false,
      showPasswordReset: false,
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
          uid: this.props.signedInUser,
          userInfo: userInfo,
        })
      })
  }

  toggleEditProfile = () => {
    if (this.state.editingProfile) {
      this.getUserInfo()
    }
    this.setState({
      editingProfile: !this.state.editingProfile,
    })
  }

  toggleResetPassword = () => {
    this.setState({
      showPasswordReset: !this.state.showPasswordReset,
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
                <div>
                  <Button onClick={this.toggleResetPassword} variant="contained" color="primary" style={{ width: '230px', float: 'right'}}>Reset Your Password</Button>
                  <h1>Your Profile</h1>
                </div>
                <MediaQuery maxWidth={415}>
                  <ProfilePhoto authUser={authUser}/>
                </MediaQuery>
                {this.state.editingProfile
                  ? <EditProfile
                      toggleEditProfile={this.toggleEditProfile}
                      displayName={this.state.userInfo.displayName}
                      email={authUser.email}
                      bio={this.state.userInfo.bio}
                      affiliation={this.state.userInfo.affiliation}
                      uid={this.state.uid}
                    />
                  : <div>
                      <p> <span style={{ fontWeight: 'bold'}}>Display Name:</span> {this.state.userInfo.displayName}</p>
                      <p> <span style={{ fontWeight: 'bold'}}>Email Address:</span> {authUser.email}</p>
                      <p> <span style={{ fontWeight: 'bold'}}>Affiliation:</span> {this.state.userInfo.affiliation} </p>
                      <p> <span style={{ fontWeight: 'bold'}}>Bio:</span> {this.state.userInfo.bio} </p>
                      <UserScoreboard uid={authUser.uid}/>

                      <div className="profile-button-holder">
                        <Button color="primary" onClick={this.toggleEditProfile}>Edit Information</Button>
                        <Link to={`/profile/${authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center'}}>
                          <Button color="primary">View Public Profile</Button>
                        </Link>
                      </div>
                      <br/>
                    </div>
                }

                {this.state.showPasswordReset
                  ? <div>
                      <p> <span style={{ fontWeight: 'bold'}}>Reset Your Password:</span> </p>
                      <PasswordChangeForm toggleResetPassword={this.toggleResetPassword}/>
                    </div>
                  : null
                }
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
