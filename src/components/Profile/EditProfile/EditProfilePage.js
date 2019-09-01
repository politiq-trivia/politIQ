import React from 'react';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Help from '@material-ui/icons/Help';

import EditProfileForm from './EditProfileForm';
import ProfilePhoto from '../ProfilePhoto';
import AuthUserContext from '../../Auth/AuthUserContext';

const affiliationText = `
  Party ID is required in order to contribute to your political party team competition aspect of the site and help prove that your party knows the news and has the highest political IQ.
`

const EditProfilePage = (props) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <>
        <MediaQuery minWidth={416}>
          <Link to={`/profile/${authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', float: 'right'}}>
            <Button className="back-button" onClick={() => props.toPublicProfile(authUser.uid)} style={{ marginRight: '1vw !important' }}>View Public Profile</Button>
          </Link>
        </MediaQuery>

        <h1 id="settings-heading">Edit Profile</h1>

        <MediaQuery maxWidth={415}>
          <Link to={`/profile/${authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
            <Button className="back-button" onClick={() => props.toPublicProfile(authUser.uid)} style={{ marginRight: '1vw !important' }}>View Public Profile</Button>
          </Link>
        </MediaQuery>

        {localStorage.hasOwnProperty('fbAuth')
          ? <div className="fbAuthBox">
              <h3>Welcome to PolitIQ!</h3>
              <div style={{ display: 'flex', justifyContent: "center", width: '85%', marginLeft: 'auto', marginRight: 'auto', marginTop: '2vh', marginBottom: '2vh'}}>
                <p style={{ display: 'inline', margin: '0' }}>Please add a political affiliation to complete your registration.</p>
                <Tooltip title={affiliationText} placement="right-start">
                  <Help color="primary" style={{ height: '15'}}/>
                </Tooltip>
              </div>
            </div>
          : null
        }

        <div className="edit-holder">
          <EditProfileForm
            displayName={authUser.displayName}
            email={authUser.email}
            bio={authUser.bio}
            affiliation={authUser.affiliation}
            uid={authUser.uid}
            initialSignUpMessage={props.initialSignUpMessage}
            setFBAuth={props.setFBAuth}
            getUserInfo={props.getUserInfo}
            authUser={authUser}
          />

          <MediaQuery minWidth={416}>
            <ProfilePhoto authUser={authUser} />
          </MediaQuery>
        </div>
      </>
    )}
  </AuthUserContext.Consumer>
);

export default EditProfilePage;