import React, { Component } from 'react';
import { db } from '../../firebase';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Auth/index';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from 'react-share';

import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';

import loadingGif from '../../loadingGif.gif';
import UserScoreboard from '../Leaderboard/UserScoreboard';
import PublicProfilePhoto from './PublicProfilePhoto';
import CommentWidget from './Comment/CommentWidget';
import './profile.css';

const getHref = () => {
  return (window.location.href).toString();
}

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      showingComments: false,
      userData: {}
    }
  }
  
  componentDidMount = () => {
    const uid = window.location.href.split('/')[4]
    this.getUserInfo(uid)
    const loggedInUser = JSON.parse(localStorage.getItem('authUser')).uid
    let match;
    if (uid === loggedInUser) {
      match = true; 
    } else {
      match = false;
    }
    this.setState({
      uid,
      match,
    })
  }

  componentWillReceiveProps(nextProps) {
    const uid = nextProps.location.pathname.split('/')[2]
    this.setState({
      uid,
    })
    this.getUserInfo(uid)
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

  toggleComments = () => {
    this.setState({
      showingComments: !this.state.showingComments
    })
  }

  editProfile = () => {
    this.props.history.push('/profile')
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
        let displayName2;
        if (this.state.userData.displayName !== undefined) {
          displayName2 = this.state.userData.displayName.split(' ')[0]
        } else {
          displayName2 = ''
        }
        return (
          <div>
            <Helmet>
              <title>{displayName} Profile | politIQ trivia</title>
            </Helmet>
            <div className="public-profile">
              <div className="public-profile-top">
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                  <Button className="back-button" onClick={this.props.history.goBack}>Back</Button>
                  {this.state.match 
                  ?
                    // ? <Link to={PROFILE} style={{ textDecoration: 'none', alignSelf: 'flex-end', width: '16vw', display: 'inline-flex' }}>
                        <Button className="back-button" onClick={this.editProfile}>Edit My Profile</Button>
                      // </Link>
                    : null
                  }
                </div>
                <PublicProfilePhoto uid={this.state.uid}/>




              </div>
              <h1>{this.state.userData.displayName}</h1>

              <div className="socials">
                  <FacebookShareButton 
                    url={ getHref() } 
                    // className="shareable" 
                    quote={ this.state.match
                      ? `Check out my profile on politIQ! Click here to see how you rank up!`
                      : `Check out ${displayName}'s profile on politIQ! Click here to see how you rank up!`
                    }
                  >
                    <FacebookIcon round={true} size={32} />
                  </FacebookShareButton>
                  <LinkedinShareButton 
                    url={ getHref() }
                    // className=""
                    description={this.state.match
                      ? `Check out my profile on politIQ! Click here to see how you rank up!`
                      : `Check out ${displayName}'s profile on politIQ! Click here to see how you rank up!`
                    }
                  >
                    <LinkedinIcon round={true} size={32} />
                  </LinkedinShareButton>
                  <TwitterShareButton
                    url={ getHref() }
                    title= { this.state.match 
                      ? `Check out my profile on politIQ! Click here to see how you rank up!`  
                      : `Check out ${displayName}'s profile on politIQ! Click here to see how you rank up!`
                    }
                  >
                    <TwitterIcon round={true} size={32} />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={ getHref ()}
                    title={ this.state.match 
                      ? `Check out my profile on politIQ! Click here to see how you rank up!`
                      : `Check out ${displayName}'s profile on politIQ! Click here to see how you rank up!`
                    }
                  >
                    <WhatsappIcon round={true} size={32} />
                  </WhatsappShareButton>
                  <EmailShareButton
                    url={ getHref() }
                    subject={this.state.match
                      ? `Check out my proflie on politIQ!`
                      : `Check out ${displayName}'s profile on politIQ!`
                    }
                    body={this.state.match
                      ? `Click here to see how you rank up!`
                      : `Click here to see how you rank up!`
                    }
                  >
                      <EmailIcon round={true} size={32} />
                  </EmailShareButton>
              </div>

              <h3>About {displayName2}</h3>
              <p>{this.state.userData.bio}</p>
              <UserScoreboard uid={this.state.uid} public="true" name={displayName2} moneyWon={this.state.userData.moneyWon}/>

              {this.state.showingComments 
                ? <div>
                    <Button color="primary" onClick={this.toggleComments}>Hide Comments</Button>
                    <h3 className="comment-heading">Comments: </h3>
                    <CommentWidget userName={this.state.userData.displayName} profileID={this.state.uid} authUserName={this.props.displayName} isAdmin={this.props.isAdmin}/>
                  </div>
                : <Button color="primary" onClick={this.toggleComments}>Show Comments</Button>
              }
              

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

const condition = authUser => !!authUser;

export default compose(
  // withEmailVerification,
  withRouter,
  withAuthorization(condition)
)(PublicProfile);
