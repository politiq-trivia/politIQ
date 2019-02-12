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


workbox.precaching.precacheAndRoute(self.__precacheManifest || [])