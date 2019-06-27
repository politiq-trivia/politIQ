var Pushwoosh = Pushwoosh || [];

// TO DO: write code that checks if the user is on safari because safari sux

Pushwoosh.push(['init', {
    logLevel: 'debug',
    applicationCode: '957F6-E387B',
    // safariWebsitePushId: 
    defaultNotificationTitle: 'politIQ',
    defaultNotificationImage: './logo-192.png',
    autoSubscribe: false,
    subscribeWidget: {
        enabled: true,
    }
}])