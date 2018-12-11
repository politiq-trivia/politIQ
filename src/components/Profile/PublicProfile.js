import React, { Component } from 'react';
import { db } from '../../firebase';
import { Helmet } from 'react-helmet';
import MediaQuery from 'react-responsive';
import { withRouter } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import loadingGif from '../../loadingGif.gif';
import UserScoreboard from '../Leaderboard/UserScoreboard';
import PublicProfilePhoto from './PublicProfilePhoto';
import './profile.css';

const Placeholder = "https://via.placeholder.com/300x150"
const BigPlaceholder = "https://via.placeholder.com/700x200"

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: ''
    }
  }
  
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
            <div className="public-profile">
              <div className="public-profile-top">
                <Button className="back-button" onClick={this.props.history.goBack}>Back</Button>

                <PublicProfilePhoto uid={this.state.uid}/>
              </div>

              <h1>{this.state.userData.displayName}</h1>

              <h3>About {this.state.userData.displayName.split(' ')[0]}</h3>
              <p>{this.state.userData.bio}</p>
              <UserScoreboard uid={this.state.uid} public="true" name={this.state.userData.displayName.split(" ")[0]}/>

              <h3>Comments: </h3>
              <MediaQuery minWidth={416}>
                <img src={BigPlaceholder} alt="CommentPlaceholder"/>
              </MediaQuery>
              <MediaQuery maxWidth={415}>
                <img src={Placeholder} style={{marginTop: '3vh'}} alt="CommentPlaceholder"/>
              </MediaQuery>
            </div>
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
      <Paper className="profile">
        {isLoading()}
      </Paper>
    )
  }
}

export default withRouter(PublicProfile);
