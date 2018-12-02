import React, { Component } from 'react';
import { auth, db } from '../../firebase';
import { Helmet } from 'react-helmet';
import MediaQuery from 'react-responsive';

import Paper from '@material-ui/core/Paper';

import loadingGif from '../../loadingGif.gif';
import UserScoreboard from '../Leaderboard/UserScoreboard';
import './profile.css';

const Placeholder = "https://via.placeholder.com/150"

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: ''
    }
  }
  // grab the uid from the query string
  // use that uid to make a db all and get that user's Information
  // display that information on the page
  // if the uid matches the logged in user, also show a button to edit their profile

  componentDidMount = () => {
    const uid = window.location.href.split('/')[4]
    this.getUserInfo(uid)
    this.setState({
      uid,
    })
  }

  getUserInfo = async (uid) => {
    await db.getOneUser(uid)
      .then(response => {
        const data = response.val()
        this.setState({
          userData: data,
        })
      })
  }

  render () {
    // get the username to display correctly in the helmet
    let displayName;
    if (this.state.userData) {
      displayName = this.state.userData.displayName + "'s'"
    } else {
      displayName = "User"
    }

    const isLoading = () => {
      if (this.state.userData) {
        return (
          <div>
            <Helmet>
              <title>{displayName} Profile</title>
            </Helmet>
            <MediaQuery maxWidth={415}>
              <div className="profile-header public-profile">
                <h1>{this.state.userData.displayName}</h1>

                {/* need to write a component that just gets the profile photo without giving the option to upload one */}
                <img src={Placeholder} />

                <div>
                  <p><span style={{ fontWeight: 'bold'}}>Affiliation: </span>{this.state.userData.affiliation}</p>
                  <p>{this.state.userData.bio}</p>
                  <UserScoreboard uid={this.state.uid} />
                </div>

                <h4>Comments: </h4>
                <img src={Placeholder} />
              </div>
            </MediaQuery>
            <MediaQuery minWidth={416}>
              <div>big screen size</div>
            </MediaQuery>
          </div>
        )
      } else {
        return (
          <div className="gifStyle">
            <img src={loadingGif} alt="loading gif"/>
          </div>
        )
      }
    }

    // gotta get a loading gif or something in here
    return (
      <Paper className="page-style profile">
        {isLoading()}
      </Paper>
    )
  }
}

export default PublicProfile;
