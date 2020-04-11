import React, { useState } from "react";
import { db } from "../../firebase";
import { Helmet } from "react-helmet";
import { withRouter, NavLink } from "react-router-dom";
import LoadingGif from '../../6.gif';
import "../../css/customStyles.css";
import Paper from "@material-ui/core/Paper";

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton
} from "react-share";

import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon
} from "react-share";

import UserScoreboard from "../Leaderboard/UserScoreboard";
import PublicProfilePhoto from "./PublicProfilePhoto";

import "./profile.css";


const PublicProfile = (props) => {
  const authUser = props.signedInUser
  const uid = window.location.href.split('profile/')[1]
  const [userInfo, setUserInfo] = useState(null)



  const fetchUserInfo = async () => {  // get user info
    db.getOneUser(uid).then(response => {
      return (response.val());
    }).then(userData => {
      setUserInfo({ ...userData, uid: uid })
    })
  }
  if (userInfo === null) { // if there isn't user info yet
    fetchUserInfo()
  }

  if (userInfo) {
    if (userInfo.uid !== uid) { // if user info needs to be updated to the window url
      fetchUserInfo()
    }
  }

  let content = <center style={{ marginTop: "100px" }}><img src={LoadingGif} alt="loading" style={{ maxWidth: '100%' }} /></center>


  if (userInfo !== null) {
    content = <div>
      <Helmet>
        <title>{userInfo.displayName} Profile | politIQ trivia</title>
      </Helmet>
      <div className="public-profile">
        <div className="public-profile-top">
          <h1 className="displayNameBox">{userInfo.displayName}</h1>

          {authUser.uid === userInfo.uid ? (  // user is on their own profile
            <NavLink style={{ textDecoration: "none", color: "white" }} to="/profile">
              <button

                className="customButton"
              >
                Edit My Profile
              </button>
            </NavLink>
          ) :
            null}
        </div>

        <PublicProfilePhoto uid={userInfo.uid} />


        {<center>
          <div className="bioContainer">
            <p className="bio">{userInfo.bio}</p>
          </div>
        </center>}

        <UserScoreboard
          uid={userInfo.uid}
          authUser={authUser}
          public="true"
          name={userInfo.displayName}
        />
        <div className="socials">
          <div className="social">
            <FacebookShareButton
              url={window.location.href.toString()}
              // className="shareable"
              quote={
                authUser.uid === uid
                  ? `Check out my profile on politIQ! Click here to see how you rank up!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ! Click here to see how you rank up!`
              }
            >
              <FacebookIcon round={true} size={32} />
            </FacebookShareButton>
          </div>{" "}
          <div className="social">
            <LinkedinShareButton
              url={window.location.href.toString()}
              // className=""
              description={
                authUser.uid === uid
                  ? `Check out my profile on politIQ! Click here to see how you rank up!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ! Click here to see how you rank up!`
              }
            >
              <LinkedinIcon round={true} size={32} />
            </LinkedinShareButton>
          </div>
          <div className="social">
            <TwitterShareButton
              url={window.location.href.toString()}
              title={
                authUser.uid === uid
                  ? `Check out my profile on politIQ! Click here to see how you rank up!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ! Click here to see how you rank up!`
              }
            >
              <TwitterIcon round={true} size={32} />
            </TwitterShareButton>
          </div>
          <div className="social">
            <WhatsappShareButton
              url={window.location.href.toString()}
              title={
                authUser.uid === uid
                  ? `Check out my profile on politIQ! Click here to see how you rank up!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ! Click here to see how you rank up!`
              }
            >
              <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>
          </div>
          <div className="social">
            <EmailShareButton
              url={window.location.href.toString()}
              subject={
                authUser.uid === uid
                  ? `Check out my proflie on politIQ!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ!`
              }
              body={
                authUser.uid === uid
                  ? `Click here to see how you rank up!`
                  : `Click here to see how you rank up!`
              }
            >
              <EmailIcon round={true} size={32} />
            </EmailShareButton>
          </div>
        </div>

      </div>
    </div>
  }
  return (
    <Paper className="profile"> {content} </Paper>
  )


}


export default withRouter(PublicProfile);
