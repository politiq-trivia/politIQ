workbox.skipWaiting();
workbox.clientsClaim();

self.addEventListener('install', event => {
    const asyncInstall = new Promise(resolve => {
        console.log('Waiting to resolve...')
        setTimeout(resolve, 5000)
    })
    event.waitUntil(asyncInstall)
})

self.addEventListener('activate', event => {
    console.log('activate')
})

// caches all assets from CDN 
workbox.routing.registerRoute(
    new RegExp('https:.*min\.(css|js)'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'cdn-cache'
    })
)

// caches fonts
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
)

// wait for push notification
self.addEventListener('push', event => {
    event.waitUntil(self.registration.showNotification('Todo List', {
        icon: './components/StaticPages/logo.png',
        body: event.data.text()
    }))
})

// on push notification click
self.addEventListener('notificationclick', event => {
    console.log('notification clicked')
    console.log({event})
    const notification = event.notification;
    console.log({notification})
    const primaryKey = notification.data.primaryKey;
    console.log({primaryKey})
    if (primaryKey !== null) {
        const url = 'quiz/' + primaryKey;
        console.log(url, 'this is url')
        notification.close(); // Android needs explicit close.
        // event.waitUntil(
        //     clients.matchAll({type: 'window'}).then( windowClients => {
        //         // Check if there is already a window/tab open with the target URL
        //         for (var i = 0; i < windowClients.length; i++) {
        //             var client = windowClients[i];
        //             // If so, just focus it.
        //             if (client.url === url && 'focus' in client) {
        //                 client.navigate('http://localhost:5000/' + url)
        //                 return client.focus();
        //             }
        //         }
        //         // If not, then open the target URL in a new window/tab.
        //         if (clients.openWindow) {
        //             return clients.openWindow(url);
        //         }
        //     })
        // );
        // if (clients.url.includes('localhost')) {
        //     clients.navigate('http://localhost:5000/' + url)
        // } else {
            return clients.openWindow(url);
        // }    
    }

})


workbox.precaching.precacheAndRoute(self.__precacheManifest || [])