/**
 * This code mostly follows the service worker spec outlined by Google at:
 * https://developers.google.com/web/fundamentals/primers/service-workers/
 * 
 */

const CACHE_NAME = 'my-site-cache-v5';
const urlsToCache = [
  './index.html',
  './restaurant.html',
  './css/images/marker-icon-2x.png',
  './css/images/marker-icon.png',
  './css/images/marker1-shadow.png',
  './css/leaflet.css',
  './css/styles.css',
  './data/restaurants.json',
  './js/polyfills/cache.js',
  './js/dbhelper.js',
  './js/leaflet.js',
  './js/main.js',
  './js/restaurant_info.js',
  './js/sw.register.js',
  './js/util.js',
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/6.jpg',
  './img/7.jpg',
  './img/8.jpg',
  './img/9.jpg',
  './img/10.jpg',
];

/**
 * Here we install the service worker
 */
self.addEventListener('install', function(event) {
  self.skipWaiting();
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

/**
 * Here we set the fetch logic for the service worker
 */
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if(url.pathname === '/restaurantReviews'){
          console.log('index served');
          return fetch('./index.html');
        }
        if(url.pathname === '/restaurantReviews/restaurant.html'){
          console.log('restaurant served');
          return fetch('./restaurant.html');
        }

        if (response) {
          //console.log(response);
          return response;
        }
        
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              
              return response;
            } else {

              console.log(`no response for request:`);
              console.log(url);
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});