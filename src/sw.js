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


workbox.precaching.precacheAndRoute(self.__precacheManifest || [])