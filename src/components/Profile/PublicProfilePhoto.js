import React, { Component } from 'react';

import { storage } from '../../firebase';
import loadingGif from '../../loadingGif.gif';

const Placeholder = "https://via.placeholder.com/250x150"


class PublicProfilePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarUrl: "",
      uid: '',
      loading: true,
    }
  }

  componentDidMount = () => {
    this.getPhoto()
  }

  getPhoto = () => {
    const set = () => {
      this.setState({
        loading: false,
        avatarUrl: `${Placeholder}`
      })
    }
    if (this.props.uid !== "") {
      const imgName = this.props.uid + ".jpg"
      storage.imageRef.child(imgName).getDownloadURL()
        .then(url => {
          this.setState({
            avatarUrl: url,
            uid: this.props.uid,
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
            default:
              break;
          }
        })
    }
  }

  render () {
    console.log(this.state, 'state')
    return (
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
        <img src={this.state.avatarUrl} alt="Profile Photo" className="public-photo"/>
      </div>
    )
  }

}

export default PublicProfilePhoto;
