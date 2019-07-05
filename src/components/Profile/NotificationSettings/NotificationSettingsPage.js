import React from 'react';

import EmailNotificationSettings from './EmailNotificationSettings';
// import PushNotificationSettings from './PushNotificationSettings';

const NotificationSettingsPage = () => {
    return (
        <>
            <h1 id="settings-heading">Notification Settings</h1>
            <h3 className="settings-subheading">Email Notifications</h3>
            <EmailNotificationSettings />
            {/* <hr />
            <h3 className="settings-subheading">Push Notifications</h3>
            <PushNotificationSettings /> */}
        </>
    )
}

export default NotificationSettingsPage;