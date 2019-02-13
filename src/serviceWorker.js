// import ab2str from 'arraybuffer-to-string'; 
import moment from 'moment';
import { db } from './firebase';


const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      console.log(swUrl)
      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then((registration) => {
          let swRegistration = registration;

          // check for push notification compatibility && existing subscription
          if ('PushManager' in window) {
            swRegistration.pushManager.getSubscription().then(function(sub) {
              if (sub === null) {
                requestPushNotifications(swRegistration);
              } else {
                // We have a subscription, update the database
                console.log('Subscription object: ', sub);
              }
            })
          }

          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit http://bit.ly/CRA-PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope)
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See http://bit.ly/CRA-PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        console.log('no service worker found')
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}

// push notifications ---------------------------------------------------

// this function will only run if the browser is compatible with push notifications
function requestPushNotifications(swRegistration) {
  if(Notification.permission === 'default') {
    // ask permission to send notifications 
    askPermission(swRegistration);

  }
} 

function askPermission(swRegistration) {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
      if (result === 'granted') {
        subscribeUser(swRegistration)
          .then(pushSubscription => {

            // get the keys, convert them to strings, and store them in firebase
            const p256dhAB = pushSubscription.getKey('p256dh')
            function ab2str(buf) {
              return String.fromCharCode.apply(null, new Int8Array(buf));
            }
            const p256dhStr = ab2str(p256dhAB)
            function ab2str2(buf) {
              return String.fromCharCode.apply(null, new Uint8Array(buf));
            }
            const auth = pushSubscription.getKey('auth');
            const authStr = ab2str2(auth)


            const subscriptionObject = {
              endpoint: pushSubscription.endpoint,
              keys: {
                p256dh: p256dhStr,
                auth: authStr,
              }
            }
            db.subscribeUser(subscriptionObject);
            const time = moment().add(30, 'seconds');
            const options = {
              body: 'Play now to boost your score!',
              icon: "/logo-192.png",
              // vibrate: [100, 50, 100],
              data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
              },
              actions: [
                {action: 'play', title: "Take Today's Quiz!", icon: '/logo-192.png'}
              ]
            }


            swRegistration.showNotification("Thanks for playing!", options)


            console.log({pushSubscription})
            console.log({swRegistration})
          })
      }
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('Not granted permission for push notifications');
    }
  })
}

function subscribeUser(swRegistration) {
  const applicationServerKey = urlBase64ToUint8Array(process.env.REACT_APP_MESSAGING_KEY)
  const options = {
    userVisibleOnly: true,
    applicationServerKey,
  }
  return swRegistration.pushManager.subscribe(options)
}

function urlBase64ToUint8Array(base64string) {
  const padding = '='.repeat((4-base64string.length % 4) % 4);
  const base64 = (base64string + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}


