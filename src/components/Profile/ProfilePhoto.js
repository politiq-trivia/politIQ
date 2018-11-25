import React, { Component } from 'react';

import { storage } from '../../firebase';
import FileUploader from 'react-firebase-file-uploader';

import Button from '@material-ui/core/Button';
import loadingGif from '../../loadingGif.gif';

const placeHolderImg = 'https://via.placeholder.com/270x290.png?text=Profile+Photo'

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
      loading: true,
    }
  }

  componentDidMount = () => {
    const set = () => {
      this.setState({
        loading: false,
      })
    }
    if (this.props.authUser.uid !== "") {
      // this gives an error in the console if the user has not uploaded a photo.
      const imgName = this.props.authUser.uid + ".jpg"
      storage.imageRef.child(imgName).getDownloadURL()
        .then(url => {
          this.setState({
            avatarURL: url,
            userID: this.props.authUser.uid,
            loading: false,
          })
        }).catch(function(error) {
          switch (error.code) {
            case 'storage/object-not-found':
              console.log('Object does not exist')
              set()
              break;
            case 'storage/unauthorized':
              set()
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              set()
              // User canceled the upload
              break;
            case 'storage/unknown':
              set()
              // Unknown error occurred, inspect the server response
              break;
          }
        })

    } else {
      this.setState({
        userID: this.props.authUser.uid,
        loading: false,
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
    const isLoading = () => {
      if (this.state.loading) {
        return (
          <div className="profile-photo">
            <img src={loadingGif} alt="loading" style={{ width: '25vw', marginLeft: '6vw'}}/>
          </div>
        )
      } else {
        return (
          <form>
            { this.state.avatarURL ?
              <img src={this.state.avatarURL} alt="user avatar" className="profile-photo"/>
             : <div>
                <img src={placeHolderImg} alt="placeholder" className="profile-photo" />
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
              </div>
            }
            {this.state.isUploading &&
              <p>Progress: {this.state.progress}</p>
            }
          </form>
        )
      }
    }

    return (
      <div>
        {isLoading()}
      </div>
    )
  }
}

export default ProfilePhoto;
