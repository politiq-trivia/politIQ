import React from 'react';

import EmailNotificationSettings from './EmailNotificationSettings';
// import PushNotificationSettings from './PushNotificationSettings';
import AuthUserContext from '../../Auth/AuthUserContext';


const NotificationSettingsPage = () => {
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <>
                    <h1 id="settings-heading">Notification Settings</h1>
                    <h3 className="settings-subheading">Email Notifications</h3>
                    <EmailNotificationSettings authUser={authUser}/>
                    {/* <hr />
                    <h3 className="settings-subheading">Push Notifications</h3>
                    <PushNotificationSettings /> */}
                </>
            )}
        </AuthUserContext.Consumer>
    )
}

export default NotificationSettingsPage;