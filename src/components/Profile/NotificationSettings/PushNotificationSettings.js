import React from 'react';
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const PushNotificationSettings = () => {
    return (
        <div className="notification-settings">
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={false}
                        />
                    }
                    label="Receive push notification reminders to stay up-to-date on the latest quizzes"
                />
            </FormGroup>
            <Button color="primary">Save Changes</Button>
        </div>
    )
}

export default PushNotificationSettings;