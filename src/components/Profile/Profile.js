import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { db, withFirebase } from '../../firebase';
import { compose } from 'recompose';

import Paper from '@material-ui/core/Paper';

import './profile.css';

import { AuthUserContext, withAuthorization } from '../Auth/index';
import Drawer from './Drawer';
import StatsPage from './StatsPage/';
import NotificationSettingsPage from './NotificationSettings/NotificationSettingsPage';
import SecuritySettings from './SecuritySettings';
import GameSettings from './GameSettings';
import EditProfilePage from './EditProfile/EditProfilePage';




class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      showEditProfile: true,
      showStatsPage: false,
      showNotificationSettings: false,
      showSecurity: false,
      showPasswordReset: false,
      showNotifications: false,
      showGameSettings: false
    }
  }

  componentDidMount = () => {
    const userInfo = JSON.parse(localStorage.getItem('authUser'))

    this.setState({
      userInfo,
    })
  }
  
  // called when edit loads, but why ?
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
                ? <EditProfilePage authUser={authUser} getUserInfo={this.getUserInfo}/>
                : null
              }
              {this.state.showStatsPage
                ? <StatsPage uid={authUser.uid} userInfo={this.state.userInfo}/>
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
