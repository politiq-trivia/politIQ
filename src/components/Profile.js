import React, { Component } from 'react';

import { storage } from '../firebase';
import FileUploader from 'react-firebase-file-uploader';

import AuthUserContext from './AuthUserContext';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from './withAuthorization';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// import './Profile.css';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      avatar: '',
      isUploading: false,
      progress: 0,
      avatarURL: '',
    }
  }

  componentDidMount = () => {

  }

  handleUploadStart = () => {
    this.setState({
      isUploading: true,
      progress: 0,
    });
  }

  handleProgress = (progress) => {
    this.setState({progress});
  }

  handleUploadError = (error) => {
    this.setState({
      isUploading: false
    });
    console.error(error);
  }

  handleUploadSuccess = (filename) => {
    console.log('handleUploadSuccess called')
    this.setState({
      avatar: filename,
      progress: 100,
      isUploading: false,
    });

    storage.imageRef.child(filename).getDownloadURL()
      .then(url => this.setState({avatarURL: url}));
  }

  render() {
    console.log(storage.imageRef, 'this is storage.imageRef')
    console.log(storage)

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <Paper className="page-style">
            <div className="profile-header">

              <form>
                { this.state.avatarURL ?
                  <img src={this.state.avatarURL} alt="user avatar" className="profile-photo"/>
                 :
                  <Button
                    color="primary"
                    variant="contained"
                  >
                    <FileUploader
                      accept="image/*"
                      name="avatar"
                      filename={file => authUser.uid}
                      storageRef={storage.imageRef}
                      onUploadStart={this.handleUploadStart}
                      onUploadError={this.handleUploadError}
                      onUploadSuccess={this.handleUploadSuccess}
                      onProgress={this.handleProgress}
                    />
                  </Button>

                }

                {this.state.isUploading &&
                  <p>Progress: {this.state.progress}</p>
                }
              </form>

              <div className="profile-info">
                <h1> User Information</h1>
                <p> Display Name: </p>
                <p> Email Address: {authUser.email}</p>
              </div>
            </div>
            {/* <PasswordForgetForm /> */}
            <PasswordChangeForm />
          </Paper>
        }
      </AuthUserContext.Consumer>
    )
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ProfilePage);
