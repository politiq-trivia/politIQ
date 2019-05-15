import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { db, withFirebase } from '../../firebase';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import MediaQuery from 'react-responsive';
import axios from 'axios';

import ProfilePhoto from './ProfilePhoto';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Help from '@material-ui/icons/Help';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import './profile.css';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Auth/index';
import PasswordChangeForm from '../Auth/PasswordChange';
import EditProfile from './EditProfile';
import UserScoreboard from '../Leaderboard/UserScoreboard';

import Paper from '@material-ui/core/Paper';
import { FormControlLabel } from '@material-ui/core';

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
      showNotifications: false,
      weeklyChecked: true,
      dailyChecked: true,
      dailyChanged: false,
      weeklyChanged: false
    }
  }

  componentDidMount = () => {
    const userInfo = JSON.parse(localStorage.getItem('authUser'))
    // check if the user is subscribed to the mailchimp lists and then use that to set the state
    // make an API call to the backend
    this.checkMailchimpStatus(userInfo.mailchimpId.daily, "weekly")
    this.checkMailchimpStatus(userInfo.mailchimpId.daily, "daily")
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
      editingProfile: !this.state.editingProfile,
    })
  }

  toggleResetPassword = () => {
    this.setState({
      showPasswordReset: !this.state.showPasswordReset,
    })
  }

  // make an api call to the backend to see which lists the user is subscribed to. 
  checkMailchimpStatus = (mailchimpId, freq) => {
    axios(`https://politiq.herokuapp.com/get-email-subscription-${freq}/${mailchimpId}`)
    // axios.get(`http://localhost:3001/get-email-subscription-${freq}/${mailchimpId}`)
      .then(response => {
        const status = response.data.mailchimpStatus
        const statusHolder = freq + "Checked"
        // if status is subscribed, set state to true 
        if (status === "subscribed") {
          this.setState({
            [statusHolder]: true,
          })
        } else {
          this.setState({
            [statusHolder]: false,
          })
        }
      })
  }

  toggleShowNotifications = () => {
    this.setState({
      showNotifications: !this.state.showNotifications
    })
  }

  updateNotificationChecks = (e) => {
    const name = e.target.value
    const checked = name + "Checked"
    const changed = name + "Changed"
    this.setState({
      [checked]: !this.state[checked],
      [changed]: true,
    })
  }

  saveNotificationChanges = () => {
    if (this.state.dailyChanged) {
      this.unsubscribe("daily", this.state.userInfo.mailchimpId.weekly)
    }
    if (this.state.weeklyChanged) {
      this.unsubscribe("weekly", this.state.userInfo.mailchimpId.weekly)
    }
    this.toggleShowNotifications()
  }

  unsubscribe = (freq, mailchimpId) => {
    const statusHolder = freq + "Checked"
    const status = this.state[statusHolder]
    let action;
    if (status === true) {
      action = "subscribed"
    } else {
      action = "unsubscribed"
    }
    // make an axios call to the back end which will hit the patch request for mailchimp 
    axios.patch(`http://politiq.herokuapp.com/update-email-subscription-${freq}/${mailchimpId}`, {
    // axios.patch(`http://localhost:3001/update-email-subscription-${freq}/${mailchimpId}`, {
      status: action
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
          <Paper className="profile">
            <Helmet>
              <title>Profile | politIQ</title>
            </Helmet>
            <div className="public-profile-top">
              <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: '3vh'}}>
                <Button className="back-button" onClick={this.props.history.goBack}>Back</Button>
                {/* <Link to={`/profile/${authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center'}}> */}
                  <Button className="back-button" onClick={this.toPublicProfile} style={{ marginRight: '1vw !important' }}>View Public Profile</Button>
                {/* </Link> */}
              </div>

              <ProfilePhoto authUser={authUser} />
            </div>
              <div>
                <div>
                  <MediaQuery minWidth={416}>
                    <Button color="primary" onClick={this.toggleEditProfile} style={{ float: 'right', marginRight: '1vw !important' }}>Edit Information</Button>
                  </MediaQuery>
                  <h1 id="profile-heading">Your Profile</h1>
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
                      <UserScoreboard uid={authUser.uid} moneyWon={this.state.userInfo.moneyWon}/>

                      <div className="profile-button-holder">
                        <MediaQuery maxWidth={415}>
                          <Button color="primary" onClick={this.toggleEditProfile} style={{ float: 'right' }}>Edit Information</Button>
                        </MediaQuery>
                        <Link to={`/profile/${authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center'}}>
                          <Button color="primary">View Public Profile</Button>
                        </Link>
                        <Button onClick={this.toggleShowNotifications}>Notification Settings</Button>
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

                {this.state.showNotifications
                  ? <div className="notification-settings">
                      <FormGroup row>
                        <FormControlLabel
                          className
                          control={
                            <Checkbox
                              checked={this.state.weeklyChecked}
                              onChange={this.updateNotificationChecks}
                              value={"weekly"}
                            />
                          }
                          label="Receive weekly updates about the latest quizzes and events from PolitIQ"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.dailyChecked}
                              onChange={this.updateNotificationChecks}
                              value={"daily"}
                            />
                          }
                          label="Receive daily updates from PolitIQ to keep up-to-date with the latest quizzes."
                        />
                      </FormGroup>
                      <Button color="primary" onClick={this.saveNotificationChanges}>Save Changes</Button>
                    </div>
                  : null
                }

                {/* <Button onClick={this.unsubscribe}>Turn Off Push Notifications</Button> */}

          
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
