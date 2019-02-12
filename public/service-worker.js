console.log('this file is running')

// if ('serviceWorker' in navigator && 'PushManager' in window) {
//     console.log('Service Worker and Push is supported')
//     navigator.serviceWorker.register('service-worker.js')
//       .then(function(registration) {
//         console.log('ServiceWorker registration successful with scope: ', registration.scope)
//         if (Notification.permission == 'default') {
//           // ask permissions to send notifications
//           askPermission()
//         }
//         swRegistration = registration;
//       })
//       .catch(function(err) {
//         console.error('Service Worker registration failed: ', err)
//       });
//   } else if ('serviceWorker' in navigator) {
//     console.warn('Push messaging is not supported');
//     // pushButton.textContent = 'Push Not Supported';
//     window.addEventListener('load', function() {
//       navigator.serviceWorker.register('service-worker.js').then(function(registration) {
//         // Registration was successful
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//       }, function(err) {
//         // registration failed :(
//         console.error('ServiceWorker registration failed: ', err);
//       }).catch(function(err) {
//         console.log(err)
//       });
//     });
//   } else {
//     console.warn('service worker and push messaging are not supported');
//   }

  const CACHE_NAME = 'politIQ-cache-v1';
  const urlsToCache = [
    '/',
    '/scripts/build.js',
  ];
  
  window.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          // open a cache and cache our files 
          return cache.addAll(urlsToCache);
        })
    )
  });

  window.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    )
  })

  // function askPermission() {
  //   return new Promise(function (resolve,reject) {
  //     const permissionResult = Notification.requestPermission(function(result) {
  //       resolve(result);
  //       if (result === 'granted') {
  //         subscribeUser();
  //       }
  //     });

  //     if (permissionResult) {
  //       permissionResult.then(resolve, reject);
  //     }
  //   }).then(function(permissionResult) {
  //     if (permissionResult !== 'granted') {
  //       throw new Error('Not granted permission for push notifications')
  //     }
  //   })
  // }

  // function subscribeUser() {
  //   const applicationServerKey = urlBase64ToUint8Array('BPDJiG_LBy1OmhPwA1N2APrliu8vD2ERB5VEsSAM46m7aQMFbiiyfqfPW0BCEgpy3aLpz6rKyOgvjj2_CJXlTqU');
  //   // console.log(process.env.REACT_APP_MESSAGING_KEY);
  //   const options = {
  //     userVisibleOnly: true,
  //     applicationServerKey,
  //   }
  //   console.log('subscribe user is being called')
  //   return swRegistration.pushManager.subscribe(options)
  //     .then(function(subscription) {
  //       console.log(subscription)
  //       // sendSubscriptionToBackEnd(subscription)
  //     }).catch(function(err) {
  //       console.log('Failed to subscribe user: ', err);
  //     });
  // }

  // function urlBase64ToUint8Array(base64string) {
  //   const padding = '='.repeat((4-base64string.length % 4) % 4);
  //   const base64 = (base64string + padding).replace(/\-/g, '+').replace(/_/g, '/');
  //   const rawData = window.atob(base64);
  //   const outputArray = new Uint8Array(rawData.length);

  //   for (let i = 0; i < rawData.length; i++) {
  //     outputArray[i] = rawData.charCodeAt(i);
  //   }

  //   return outputArray;
  // }

  /*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
self.addEventListener('notificationclose', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;
  const action = event.action;

  if (action === 'close') {
    notification.close();
  } else {
    event.waitUntil(
      clients.matchAll().then(clis => {
        const client = clis.find(c => {
          return c.visibilityState === 'visible';
        });
        if (client !== undefined) {
          client.navigate('samples/page' + primaryKey + '.html');
          client.focus();
        } else {
          // there are no visible windows. Open one.
          clients.openWindow('samples/page' + primaryKey + '.html');
          notification.close();
        }
      })
    );
  }

  self.registration.getNotifications().then(notifications => {
    notifications.forEach(notification => {
      notification.close();
    });
  });
});

self.addEventListener('push', event => {
  let body;

  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Default body';
  }

  const options = {
    body: body,
    icon: 'images/notification-flat.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: 'Go to the site',
        icon: 'images/checkmark.png'},
      {action: 'close', title: 'Close the notification',
        icon: 'images/xmark.png'},
    ]
  };
  event.waitUntil(
    clients.matchAll().then(c => {
      console.log(c);
      if (c.length === 0) {
        // Show notification
        self.registration.showNotification('Push Notification', options);
      } else {
        // Send a message to the page to update the UI
        console.log('Application is already open!');
      }
    })
  );
});
