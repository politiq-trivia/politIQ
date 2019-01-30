import React, { Component } from 'react';
import { db } from '../../firebase';
import firebase from 'firebase/app';
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { FormHelperText } from '@material-ui/core';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      email: '',
      affiliation: '',
      bio: '',
      uid: '',
    }
  }

  componentDidMount = () => {
    this.setState({
      displayName: this.props.displayName,
      email: this.props.email,
      bio: this.props.bio,
      uid: this.props.uid,
      affiliation: this.props.affiliation,
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
      affiliation: this.state.affiliation,
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

    this.props.getUserInfo(this.props.uid)

    if(localStorage.hasOwnProperty('fbAuth')) {
      localStorage.removeItem('fbAuth')
    }
    this.props.toggleEditProfile()
  }

  handleSaveAndView = async () => {
    const updates = {
      displayName: this.state.displayName,
      email: this.state.email,
      affiliation: this.state.affiliation,
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

    this.props.getUserInfo(this.props.uid)

    if(localStorage.hasOwnProperty('fbAuth')) {
      localStorage.removeItem('fbAuth')
    }

    this.props.history.push(`/profile/${this.state.uid}`)
  }

  render() {
    return (
      <div className="edit-profile">
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
            <FormHelperText>Affiliation</FormHelperText>
            <Select
              native
              fullWidth
              value={this.state.affiliation}
              label="Affiliation"
              onChange={event => this.handleChange('affiliation', event.target.value)}
              inputProps={{
                name: 'affiliation'
              }}
            >
              <option value="" />
              <option value="Democrat">Democrat</option>
              <option value="Republican">Republican</option>
              <option value="Independent">Independent</option>
            </Select>
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

export default withRouter(EditProfile);
