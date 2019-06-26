import React, { Component } from 'react';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

import { db } from '../../firebase';

class GameSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            soundsOn: "",
            saved: false,
            invisibleScore: "",
        }
    }

    componentDidMount = () => {
        // get the user info to see if the user already has a sound preference
        const userInfo = JSON.parse(localStorage.getItem('authUser'))
        // if they do, then let's use it

        let soundsOn;
        let invisibleScore;
        if (userInfo.soundsOn) {
            soundsOn = userInfo.soundsOn;
        } else {
            soundsOn = true;
        }
        if (userInfo.invisibleScore) {
            invisibleScore = userInfo.invisibleScore;
        } else {
            invisibleScore = false;
        }
        this.setState({
            userInfo,
            soundsOn,
            invisibleScore,
            loaded: true,
        })
        // if (userInfo.soundsOn) {
        //     this.setState({
        //         userInfo,
        //         soundsOn: userInfo.soundsOn,
        //         loaded: true,
        //     })
        // } else {
        // // store the user info for later 
        //     this.setState({
        //         userInfo,
        //         loaded: true
        //     })
        // }
    }

    componentWillUnmount = () => {
        clearInterval(this.flashInterval);
    }

    handleChange = (event) => {
        const name = event.target.name
        console.log(name, 'this is name in handle change')
        this.setState({
            [name]: !this.state[name]
        })
    }

    handleSubmit = async () => {
        const userInfo = this.state.userInfo
        // when the user clicks save changes, update the userInfo object in localStorage/cache to reflect their settings
        userInfo.soundsOn = this.state.soundsOn
        userInfo.invisibleScore = this.state.invisibleScore
        localStorage.setItem('authUser', JSON.stringify(userInfo))

        // also make a db call to update the user object, so that next time they log in, their preferences
        // will be loaded automatically. 
        const uid = userInfo.uid
        await db.soundSettings(uid, this.state.soundsOn);
        await db.scoreVisibility(uid, this.state.invisibleScore);

        // once the data has been saved, update the UI to let the user know that it was successful
        this.setState({
            saved: true
        })
        // display the message for 10 seconds and then have it disappear
        this.flashInterval = setInterval(() => {
            this.setState({
                saved: false,
            })
        }, 10000)
    }

    render() {
        console.log(this.state, 'state')
        return (
            <div style={{ marginBottom: '10vh' }}>
                <h1 id="settings-heading">Game Settings</h1>
                <h3 className="settings-subheading">Sounds</h3>
                {this.state.loaded 
                    ? <FormGroup row className="notification-settings">
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={this.state.soundsOn} 
                                    color={"primary"} 
                                    onChange={(event) => this.handleChange(event)}
                                    value={this.state.soundsOn}
                                    name="soundsOn"
                                    inputProps={{ 'aria-label': 'Sounds On'}}
                                />
                            }
                            label="Game sounds on"
                        />
                    </FormGroup>
                    : null
                }

                
                <h3 className="settings-subheading">Score Visibility</h3>
                <FormGroup row className="notification-settings">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.invisibleScore}
                                color="primary"
                                name="invisibleScore"
                                value={this.state.invisibleScore}
                                onChange={(event) => this.handleChange(event)}
                            />
                        }
                        label="Hide my scores from the monthly and weekly leaderboards"
                    />
                </FormGroup>
                <Button color="primary" style={{ marginTop: '3vh' }} onClick={this.handleSubmit}>Save Changes</Button>
                {this.state.saved ? <p>Your preferences have been updated successfully!</p> : null}
            </div>
        )
    }
}

export default GameSettings;