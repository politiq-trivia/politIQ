console.log('this file is running')

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported')
    navigator.serviceWorker.register('service-worker.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
        if (Notification.permission == 'default') {
          // ask permissions to send notifications
          askPermission()
        }
        swRegistration = registration;
      })
      .catch(function(err) {
        console.error('Service Worker registration failed: ', err)
      });
  } else if ('serviceWorker' in navigator) {
    console.warn('Push messaging is not supported');
    // pushButton.textContent = 'Push Not Supported';
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('service-worker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.error('ServiceWorker registration failed: ', err);
      }).catch(function(err) {
        console.log(err)
      });
    });
  } else {
    console.warn('service worker and push messaging are not supported');
  }

  const CACHE_NAME = 'politIQ-cache-v1';
  const urlsToCache = [
    '/',
    '/scripts/build.js',
  ];
  
  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          // open a cache and cache our files 
          return cache.addAll(urlsToCache);
        })
    )
  });

  self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    )
  })

  function askPermission() {
    return new Promise(function (resolve,reject) {
      const permissionResult = Notification.requestPermission(function(result) {
        resolve(result);
        if (result === 'granted') {
          subscribeUser();
        }
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function(permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('Not granted permission for push notifications')
      }
    })
  }

  function subscribeUser() {
    const applicationServerKey = urlBase64ToUint8Array('BPDJiG_LBy1OmhPwA1N2APrliu8vD2ERB5VEsSAM46m7aQMFbiiyfqfPW0BCEgpy3aLpz6rKyOgvjj2_CJXlTqU');
    // console.log(process.env.REACT_APP_MESSAGING_KEY);
    const options = {
      userVisibleOnly: true,
      applicationServerKey,
    }
    console.log('subscribe user is being called')
    return swRegistration.pushManager.subscribe(options)
      .then(function(subscription) {
        console.log(subscription)
        // sendSubscriptionToBackEnd(subscription)
      }).catch(function(err) {
        console.log('Failed to subscribe user: ', err);
      });
  }

  function urlBase64ToUint8Array(base64string) {
    const padding = '='.repeat((4-base64string.length % 4) % 4);
    const base64 = (base64string + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }