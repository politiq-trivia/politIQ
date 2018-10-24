import React, { Component } from 'react';

import { storage } from '../firebase';
import FileUploader from 'react-firebase-file-uploader';

import Button from '@material-ui/core/Button';

class ProfilePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      avatar: '',
      isUploading: false,
      progress: 0,
      avatarURL: '',
      userID: "",
    }
  }

  componentDidMount = () => {
    if (this.props.authUser.uid != "") {
      // this gives an error in the console if the user has not uploaded a photo.
      // does not show an error to the user, so it's fine for now.
      const imgName = this.props.authUser.uid + ".jpg"
      storage.imageRef.child(imgName).getDownloadURL()
        .then(url => {
          this.setState({
            avatarURL: url,
            userID: this.props.authUser.uid,
          })
        });
    } else {
      this.setState({
        userID: this.props.authUser.uid,
      })
    }
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
    return (
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
              filename={this.state.userID}
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
    )
  }

}

export default ProfilePhoto;
