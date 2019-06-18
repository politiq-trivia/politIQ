import React from 'react';

import Button from '@material-ui/core/Button';
import PasswordChangeForm from '../Auth/PasswordChange';

const SecuritySettings = () => {
    return (
        <>
            <h1 id="settings-heading">Security Settings</h1>
            <h3 className="settings-subheading">Reset Your Password</h3>
            <PasswordChangeForm />
            <Button id="delete-account-button"><span style={{ color: 'red' }}>Delete Account</span></Button>
        </>
    )
}

export default SecuritySettings;