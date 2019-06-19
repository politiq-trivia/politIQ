import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Help from '@material-ui/icons/Help';

import EditProfileForm from './EditProfileForm';
import ProfilePhoto from '../ProfilePhoto';

const affiliationText = `
  Party ID is required in order to contribute to your political party team competition aspect of the site and help prove that your party knows the news and has the highest political IQ.
`

class EditProfilePage extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <>
                <MediaQuery minWidth={416}>
                    <Link to={`/profile/${this.props.authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', float: 'right'}}>
                        <Button className="back-button" onClick={this.toPublicProfile} style={{ marginRight: '1vw !important' }}>View Public Profile</Button>
                    </Link>
                </MediaQuery>

                <h1 id="settings-heading">Edit Profile</h1>

                <MediaQuery maxWidth={415}>
                    <Link to={`/profile/${this.props.authUser.uid}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                        <Button className="back-button" onClick={this.toPublicProfile} style={{ marginRight: '1vw !important' }}>View Public Profile</Button>
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
                        toggleEditProfile={this.toggleEditProfile}
                        displayName={this.props.authUser.displayName}
                        email={this.props.authUser.email}
                        bio={this.props.authUser.bio}
                        affiliation={this.props.authUser.affiliation}
                        uid={this.props.authUser.uid}
                        initialSignUpMessage={this.props.initialSignUpMessage}
                        setFBAuth={this.props.setFBAuth}
                        getUserInfo={this.props.getUserInfo}
                        authUser={this.props.authUser}
                    />

                    <MediaQuery minWidth={416}>
                        <ProfilePhoto authUser={this.props.authUser} />
                    </MediaQuery>
                </div>
            </>
        )
    }
}

export default EditProfilePage;