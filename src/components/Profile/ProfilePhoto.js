import React, { Component } from "react";

import { storage } from "../../firebase";
import FileUploader from "react-firebase-file-uploader";

import Button from "@material-ui/core/Button";
import "../../css/customStyles.css";

const placeHolderImg =
  "//style.anu.edu.au/_anu/4/images/placeholders/person_6x8.png";
class ProfilePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      avatar: "",
      isUploading: false,
      progress: 0,
      avatarURL: "",
      userID: "",
      loading: true
    };
  }

  componentDidMount = () => {
    const set = () => {
      this.setState({
        loading: false,
        userID: this.props.authUser.uid
      });
    };
    if (this.props.authUser.uid !== "") {
      // this gives an error in the console if the user has not uploaded a photo.
      const imgName = this.props.authUser.uid + ".jpg";
      storage.imageRef
        .child(imgName)
        .getDownloadURL()
        .then(url => {
          this.setState({
            avatarURL: url,
            userID: this.props.authUser.uid,
            loading: false
          });
        })
        .catch(function(error) {
          switch (error.code) {
            case "storage/object-not-found":
              console.log("Object does not exist");
              console.log(error);
              set();
              break;
            case "storage/unauthorized":
              set();
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              set();
              // User canceled the upload
              break;
            case "storage/unknown":
              set();
              // Unknown error occurred, inspect the server response
              break;
            default:
              break;
          }
        });
    } else {
      this.setState({
        userID: this.props.authUser.uid,
        loading: false
      });
    }
  };

  handleUploadStart = () => {
    this.setState({
      isUploading: true,
      progress: 0
    });
  };

  handleProgress = progress => {
    this.setState({ progress });
  };

  handleUploadError = error => {
    this.setState({
      isUploading: false
    });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({
      avatar: filename,
      progress: 100,
      isUploading: false
    });

    storage.imageRef
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  };

  handleRemovePhoto = e => {
    e.preventDefault();
    this.setState({ avatarURL: "" });

    storage.imageRef
      .child(this.props.authUser.uid + ".jpg")
      .delete()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  render() {
    console.log(this.state);
    return (
      <form>
        {this.state.avatarURL ? (
          <div>
            <div>
              <img
                src={this.state.avatarURL}
                alt="user avatar"
                className="profile-photo"
              />
            </div>
            <div>
              <Button color="primary" onClick={this.handleRemovePhoto}>
                Remove Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="upload-holder">
            <Button
              color="primary"
              variant="contained"
              className="upload-button"
            >
              <FileUploader
                accept="image/*"
                name="avatar"
                filename={this.state.userID + ".jpg"} //make pictures all end in jpg
                storageRef={storage.imageRef}
                onUploadStart={this.handleUploadStart}
                onUploadError={this.handleUploadError}
                onUploadSuccess={this.handleUploadSuccess}
                onProgress={this.handleProgress}
              />
            </Button>
            <img
              src={placeHolderImg}
              alt="placeholder"
              className="profile-photo"
              style={{ marginTop: "2vh" }}
            />
          </div>
        )}
        {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
      </form>
    );
  }
}

export default ProfilePhoto;
