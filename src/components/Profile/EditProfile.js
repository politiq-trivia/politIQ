import React, { Component } from 'react';
import { db, auth } from '../../firebase';
import firebase from 'firebase/app';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      email: '',
      bio: '',
    }
  }

  componentDidMount = () => {
    this.setState({
      displayName: this.props.displayName,
      email: this.props.email,
      bio: this.props.bio,
      uid: this.props.uid,
    })
  }

  handleChange = (propertyName, value) => {
    this.setState({
      [propertyName]: value,
    })
  }

  handleSave = async () => {
    const updates = {
      displayName: this.state.displayName,
      email: this.state.email,
      bio: this.state.bio,
    }
    await db.editUser(this.props.uid, updates)

    if (this.props.email !== this.state.email) {
      const user = firebase.auth().currentUser
      await user.updateEmail(this.state.email).then(function() {
        console.log("success")
      }).catch(function(error){
        console.error(error)
      })
    }
    this.props.toggleEditProfile()
  }

  handleSaveAndView = () => {
    // function to save info to db
    // function to toggle public profile
    console.log('handlesaveandview called')
  }

  render() {
    return (
      <div>
        <form>
            <TextField
              margin="normal"
              label="Display Name"
              value={this.state.displayName}
              onChange={event => this.handleChange('displayName', event.target.value)}
              fullWidth
            />
            <TextField
              margin="normal"
              value={this.state.email}
              onChange={event => this.handleChange('email', event.target.value)}
              fullWidth
              label="Email Address"
            />
            <TextField
              margin="normal"
              multiline
              fullWidth
              label="Bio"
              value={this.state.bio}
              onChange={event => this.handleChange('bio', event.target.value)}
            />
        </form>
        <div className="profile-button-holder">
          <Button color="primary" onClick={this.props.toggleEditProfile}>Cancel</Button>
          <Button color="primary" onClick={this.handleSave}>Save</Button>
          <Button color="primary" onClick={this.handleSaveAndView}>Save & View Public Profile</Button>
        </div>
      </div>
    )
  }
}

export default EditProfile;
