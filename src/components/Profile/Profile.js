import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import ProfilePhoto from './ProfilePhoto';
import PoliticalIQ from '../Leaderboard/PoliticalIQ';

import Button from '@material-ui/core/Button';
import './profile.css';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Auth/index';
import PasswordChangeForm from '../Auth/PasswordChange';
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
    const userInfo = JSON.parse(localStorage.getItem('authUser'))
    this.setState({
      userInfo,
    })
  }
  
  getUserInfo = async (uid) => {
    if (uid === "") {return;}
    await db.getOneUser(uid)
      .then(response => {
        const userInfo = response.val()
        this.setState({
          uid,
          userInfo,
        })
      })
  }

  toggleEditProfile = () => {
    if (this.state.editingProfile) {
      this.getUserInfo(this.state.userInfo.uid)
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
          <Paper className="profile">
            <Helmet>
              <title>Profile | politIQ</title>
            </Helmet>
            <div className="public-profile-top">
              <ProfilePhoto authUser={authUser} />
            </div>
              <div>
                <div>
                  <h1>Your Profile</h1>
                </div>
                {this.state.editingProfile
                  ? <EditProfile
                      toggleEditProfile={this.toggleEditProfile}
                      displayName={this.state.userInfo.displayName}
                      email={authUser.email}
                      bio={this.state.userInfo.bio}
                      affiliation={this.state.userInfo.affiliation}
                      uid={this.state.userInfo.uid}
                    />
                  : <div>
                      <div className="profile-info">
                        <p> <span style={{ fontWeight: 'bold'}}>Display Name:</span> {this.state.userInfo.displayName}</p>
                        <p> <span style={{ fontWeight: 'bold'}}>Email Address:</span> {authUser.email}</p>
                        <p> <span style={{ fontWeight: 'bold'}}>Affiliation:</span> {this.state.userInfo.affiliation} </p>
                        <p> <span style={{ fontWeight: 'bold', marginBottom: '5vh'}}>Bio:</span> {this.state.userInfo.bio} </p>
                      </div>
                      <PoliticalIQ />
                      <UserScoreboard uid={authUser.uid}/>

                      <div className="profile-button-holder">
                        <Button color="primary" onClick={this.toggleEditProfile}>Edit Information</Button>
                        <Link to={`/profile/${authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center'}}>
                          <Button color="primary">View Public Profile</Button>
                        </Link>
                        <Button onClick={this.toggleResetPassword}>Reset Password</Button>
                        <Button><span style={{color: 'red'}}>Delete Account</span></Button>
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
          </Paper>
        }
      </AuthUserContext.Consumer>
    )
  }
}


const authCondition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(authCondition)
)(ProfilePage);
