import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { db, withFirebase } from '../../firebase';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import ProfilePhoto from './ProfilePhoto';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Help from '@material-ui/icons/Help';
import './profile.css';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Auth/index';
import PasswordChangeForm from '../Auth/PasswordChange';
import EditProfile from './EditProfile';
import UserScoreboard from '../Leaderboard/UserScoreboard';

import Paper from '@material-ui/core/Paper';

const affiliationText = `
  Party ID is required in order to contribute to your political party team competition aspect of the site and help prove that your party knows the news and has the highest political IQ.
`

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

  unsubscribe = () => {
    navigator.serviceWorker.ready.then(registration => {
      // find the registered push subscription in the service worker
      registration.pushManager  
        .getSubscription()
        .then(subscription => {
          if (!subscription) {
            return;
            // if there's no subscription, there's nothing to do.
          }

          subscription
            .unsubscribe()
            .then(() => {
              // delete the user from the db 
              console.log({subscription})
              console.log({registration})
              console.log('delete user from db')
            })
            .catch(err => console.error(err))
        })
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
                {localStorage.hasOwnProperty('fbAuth')
                  ? <div style={{ border: '2px solid #a54ee8', width: '80%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '2vh', paddingBottom: '1vh'}}>
                    <h3>Welcome to PolitIQ!</h3>
                    <div style={{ display: 'flex', justifyContent: "center", width: '85%', marginLeft: 'auto', marginRight: 'auto', marginTop: '2vh', marginBottom: '2vh'}}>
                      <p style={{ display: 'inline', margin: '0' }}>Please add a political affiliation to complete your registration.</p>
                      <Tooltip title={affiliationText} placement="right-start">
                        <Help color="primary" style={{ height: '15'}}/>
                      </Tooltip>
                    </div>
                    <Button color="primary" onClick={this.toggleEditProfile}>Edit Information</Button>
                  </div>
                  : null
                }
                {this.state.editingProfile
                  ? <EditProfile
                      toggleEditProfile={this.toggleEditProfile}
                      displayName={this.state.userInfo.displayName}
                      email={authUser.email}
                      bio={this.state.userInfo.bio}
                      affiliation={this.state.userInfo.affiliation}
                      uid={this.state.userInfo.uid}
                      initialSignUpMessage={this.props.initialSignUpMessage}
                      setFBAuth={this.props.setFBAuth}
                      getUserInfo={this.getUserInfo}
                    />
                  : <div>
                      <div className="profile-info">
                        <p> <span style={{ fontWeight: 'bold'}}>Display Name:</span> {this.state.userInfo.displayName}</p>
                        <p> <span style={{ fontWeight: 'bold'}}>Email Address:</span> {authUser.email}</p>
                        <p> <span style={{ fontWeight: 'bold'}}>Affiliation:</span> {this.state.userInfo.affiliation} </p>
                        <p> <span style={{ fontWeight: 'bold', marginBottom: '5vh'}}>Bio:</span> {this.state.userInfo.bio} </p>
                      </div>
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

                <Button onClick={this.unsubscribe}>Turn Off Push Notifications</Button>

          
              </div>
          </Paper>
        }
      </AuthUserContext.Consumer>
    )
  }
}


const authCondition = (authUser) => !!authUser;

export default compose(
  // withEmailVerification,
  withAuthorization(authCondition),
  withFirebase
)(ProfilePage);
