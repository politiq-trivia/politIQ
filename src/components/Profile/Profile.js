import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { withFirebase } from '../../firebase';
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
      showEditProfile: true,
      showStatsPage: false,
      showNotificationSettings: false,
      showSecurity: false,
      showPasswordReset: false,
      showNotifications: false,
      showGameSettings: false
    }
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

  toPublicProfile = (uid) => {
    this.props.history.push(`/profile/${uid}`)
  }

  // ! what if I take auth user context out of this component?
  // ! since I can just call it in the child components?

  // TODO: remove context here because it's not necessary anymore
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
                ? <EditProfilePage toPublicProfile={this.toPublicProfile} />
                : null
              }
              {this.state.showStatsPage
                ? <StatsPage />
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
