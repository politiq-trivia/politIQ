import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { db, withFirebase } from '../../firebase';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import MediaQuery from 'react-responsive';

import ProfilePhoto from './ProfilePhoto';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Help from '@material-ui/icons/Help';
import Paper from '@material-ui/core/Paper';

import './profile.css';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Auth/index';
import PasswordChangeForm from '../Auth/PasswordChange';
import EditProfileForm from './EditProfileForm';
import UserScoreboard from '../Leaderboard/UserScoreboard';
import NotificationSettings from './NotificationSettings/EmailNotificationSettings';
import Drawer from './Drawer';
import StatsPage from './StatsPage';
import NotificationSettingsPage from './NotificationSettings/NotificationSettingsPage';
import SecuritySettings from './SecuritySettings';
import GameSettings from './GameSettings';


const affiliationText = `
  Party ID is required in order to contribute to your political party team competition aspect of the site and help prove that your party knows the news and has the highest political IQ.
`

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      showEditProfile: false,
      showStatsPage: false,
      showNotificationSettings: true,
      showSecurity: false,
      showPasswordReset: false,
      showNotifications: false,
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
    this.setState({
      showEditProfile: true,
      showStatsPage: false,
      showNotificationSettings: false,
      showSecurity: false,
      showGameSettings: false,
    })
  }

  toggleShowStats = () => {
    this.setState({
      showEditProfile: false,
      showStatsPage: true,
      showNotificationSettings: false,
      showSecurity: false,
      showGameSettings: false,
    })
  }

  toggleShowNotifications = () => {
    this.setState({
      showEditProfile: false,
      showStatsPage: false,
      showNotificationSettings: true,
      showSecurity: false,
      showGameSettings: false,
    })
  }

  toggleShowSecurity = () => {
    this.setState({
      showEditProfile: false,
      showStatsPage: false,
      showNotificationSettings: false,
      showSecurity: true,
      showGameSettings: false,
    })
  }

  toggleGameSettings = () => {
    this.setState({
      showEditProfile: false,
      showStatsPage: false,
      showNotificationSettings: false,
      showSecurity: false,
      showGameSettings: true,
    })
  }

  toggleResetPassword = () => {
    this.setState({
      showPasswordReset: !this.state.showPasswordReset,
    })
  }

  // toggleShowNotifications = () => {
  //   this.setState({
  //     showNotifications: !this.state.showNotifications
  //   })
  // }

  // UNSUBSCRIBE FROM PUSH NOTIFICATIONS
  // unsubscribe = () => {
  //   navigator.serviceWorker.ready.then(registration => {
  //     // find the registered push subscription in the service worker
  //     registration.pushManager  
  //       .getSubscription()
  //       .then(subscription => {
  //         if (!subscription) {
  //           return;
  //           // if there's no subscription, there's nothing to do.
  //         }

  //         subscription
  //           .unsubscribe()
  //           .then(() => {
  //             // delete the user from the db 
  //             console.log({subscription})
  //             console.log({registration})
  //             console.log('delete user from db')
  //           })
  //           .catch(err => console.error(err))
  //       })
  //   })
  // }

  toPublicProfile = () => {
    this.props.history.push(`/profile/${this.state.userInfo.uid}`)
  }

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <Paper className="profile settings-page">
            <Helmet>
              <title>Settings | politIQ trivia</title>
            </Helmet>
            <Drawer 
              toggleEditProfile={this.toggleEditProfile} 
              toggleShowStats={this.toggleShowStats} 
              toggleShowNotifications={this.toggleShowNotifications} 
              toggleShowSecurity={this.toggleShowSecurity}
              toggleGameSettings={this.toggleGameSettings}
            />

              {this.state.showEditProfile 
                ? <>
                    <MediaQuery minWidth={416}>
                      <Link to={`/profile/${authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', float: 'right'}}>
                        <Button className="back-button" onClick={this.toPublicProfile} style={{ marginRight: '1vw !important' }}>View Public Profile</Button>
                      </Link>
                    </MediaQuery>

                    <h1 id="settings-heading">Edit Profile</h1>

                    <MediaQuery maxWidth={415}>
                      <Link to={`/profile/${authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                          <Button className="back-button" onClick={this.toPublicProfile} style={{ marginRight: '1vw !important' }}>View Public Profile</Button>
                        </Link>
                    </MediaQuery>

                    <div className="edit-holder">
                      <EditProfileForm
                        toggleEditProfile={this.toggleEditProfile}
                        displayName={this.state.userInfo.displayName}
                        email={authUser.email}
                        bio={this.state.userInfo.bio}
                        affiliation={this.state.userInfo.affiliation}
                        uid={this.state.userInfo.uid}
                        initialSignUpMessage={this.props.initialSignUpMessage}
                        setFBAuth={this.props.setFBAuth}
                        getUserInfo={this.getUserInfo}
                        authUser={authUser}
                      />

                      <MediaQuery minWidth={416}>
                        <ProfilePhoto authUser={authUser} />
                      </MediaQuery>
                    </div>
                  </>
                : null
              }
              {this.state.showStatsPage
                ? <StatsPage uid={authUser.uid} moneyWon={this.state.userInfo.moneyWon}/>
                : null
              }
              {this.state.showNotificationSettings
                ? <NotificationSettingsPage />
                : null
              }
              {this.state.showGameSettings
                ? <GameSettings />
                : null
              }
              {this.state.showSecurity
                ? <SecuritySettings />
                : null
              }







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

// {/* <div className="public-profile-top">


{/* 
</div>
<div> */}
  {/* <div>
    <MediaQuery minWidth={416}>
      <Button color="primary" onClick={this.toggleEditProfile} style={{ float: 'right', marginRight: '1vw !important' }}>Edit Information</Button>
    </MediaQuery>
  </div> */}
  {/* {localStorage.hasOwnProperty('fbAuth')
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
  } */}
  {/* {this.state.editingProfile
    ? 
    : <div>
        <div className="profile-info">
          <p> <span style={{ fontWeight: 'bold'}}>Display Name:</span> {this.state.userInfo.displayName}</p>
          <p> <span style={{ fontWeight: 'bold'}}>Email Address:</span> {authUser.email}</p>
          <p> <span style={{ fontWeight: 'bold'}}>Affiliation:</span> {this.state.userInfo.affiliation} </p>
          <p> <span style={{ fontWeight: 'bold', marginBottom: '5vh'}}>Bio:</span> {this.state.userInfo.bio} </p>
        </div>
        <div className="profile-button-holder">
          <Button onClick={this.toggleShowNotifications}>Notification Settings</Button>
          <Button onClick={this.toggleResetPassword}>Reset Password</Button>
          <Button><span style={{color: 'red'}}>Delete Account</span></Button>
        </div>
        <br/>
      </div>
  } */}

  {/* {this.state.showPasswordReset
    ? <div>
        <p> <span style={{ fontWeight: 'bold'}}>Reset Your Password:</span> </p>
        <PasswordChangeForm toggleResetPassword={this.toggleResetPassword}/>
      </div>
    : null
  } */}

  {/* {this.state.showNotifications
    ? <NotificationSettings toggleShowNotifications={this.toggleShowNotifications}/>
    : null
  } */}

  {/* <Button onClick={this.unsubscribe}>Turn Off Push Notifications</Button> */}


{/* </div> */}
