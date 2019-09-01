import React, { Component } from 'react';
import axios from 'axios';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';


class NotificationSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dailyChecked: false,
            weeklyChecked: false,
            dailyChanged: false,
            weeklyChanged: false,
        }
    }

    componentDidMount = () => {
        const userInfo = this.props.authUser;
        if (userInfo.mailchimpId) {
          const mailchimpId = userInfo.mailchimpId.daily

          // check if the user is subscribed to the mailchimp lists and then use that to set the state
          // make an API call to the backend
          this.checkMailchimpStatus(userInfo.mailchimpId.daily, "weekly")
          this.checkMailchimpStatus(userInfo.mailchimpId.daily, "daily")
  
          this.setState({
              mailchimpId
          })
        }
    }

    // make an api call to the backend to see which lists the user is subscribed to. 
    checkMailchimpStatus = (mailchimpId, freq) => {
        axios(`https://politiq.herokuapp.com/get-email-subscription-${freq}/${mailchimpId}`)
        // axios.get(`http://localhost:3001/get-email-subscription-${freq}/${mailchimpId}`)
        .then(response => {
            const status = response.data.mailchimpStatus
            const statusHolder = freq + "Checked"
            // if status is subscribed, set state to true 
            if (status === "subscribed") {
            this.setState({
                [statusHolder]: true,
            })
            } else {
            this.setState({
                [statusHolder]: false,
            })
            }
        })
    }

    updateNotificationChecks = (e) => {
        const name = e.target.value
        const checked = name + "Checked"
        const changed = name + "Changed"
        this.setState({
          [checked]: !this.state[checked],
          [changed]: true,
        })
      }
    
      saveNotificationChanges = () => {
        if (this.state.dailyChanged) {
          this.unsubscribe("daily", this.state.mailchimpId)
        }
        if (this.state.weeklyChanged) {
          this.unsubscribe("weekly", this.state.mailchimpId)
        }
        // this.props.toggleShowNotifications()
      }
    
      unsubscribe = (freq, mailchimpId) => {
        const statusHolder = freq + "Checked"
        const status = this.state[statusHolder]
        let action;
        if (status === true) {
          action = "subscribed"
        } else {
          action = "unsubscribed"
        }
        // make an axios call to the back end which will hit the patch request for mailchimp 
        axios.patch(`http://politiq.herokuapp.com/update-email-subscription-${freq}/${mailchimpId}`, {
        // axios.patch(`http://localhost:3001/update-email-subscription-${freq}/${mailchimpId}`, {
          status: action
        })
      }

    render() {
        return (
            <div className="notification-settings">
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.weeklyChecked}
                              onChange={this.updateNotificationChecks}
                              value={"weekly"}
                            />
                          }
                          label="Receive weekly updates about the latest quizzes and events from PolitIQ"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.dailyChecked}
                              onChange={this.updateNotificationChecks}
                              value={"daily"}
                            />
                          }
                          label="Receive daily updates from PolitIQ to keep up-to-date with the latest quizzes."
                        />
                      </FormGroup>
                      <Button color="primary" onClick={this.saveNotificationChanges}>Save Changes</Button>
                    </div>
        )
    }
}

export default NotificationSettings;