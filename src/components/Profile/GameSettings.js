import React from 'react';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

const GameSettings = () => {
    return (
        <>
            <h1 id="settings-heading">Game Settings</h1>
            <h3 className="settings-subheading">Sounds</h3>
            <FormGroup row className="notification-settings">
                <FormControlLabel
                    control={
                        <Switch checked={true} color={"primary"} />
                    }
                    label="Game sounds on"
                />
            </FormGroup>
            
            <h3 className="settings-subheading">Score Visibility</h3>
            <FormGroup row className="notification-settings">
                <FormControlLabel
                    control={
                        <Switch
                            checked={false}
                            color="primary"
                        />
                    }
                    label="Hide my scores from the monthly and weekly leaderboards"
                />
            </FormGroup>
            <Button color="primary" style={{ marginTop: '3vh' }}>Save Changes</Button>
        </>
    )
}

export default GameSettings;