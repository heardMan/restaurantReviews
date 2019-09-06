const CACHE_NAME = 'my-site-cache-v5';
const urlsToCache = [
  '/index.html',
  '/restaurant.html',
  '/css/images/marker-icon-2x.png',
  '/css/images/marker-icon.png',
  '/css/images/marker1-shadow.png',
  '/css/leaflet.css',
  '/css/styles.css',
  '/data/restaurants.json',
  '/js/leaflet.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/util.js'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        console.log(cache);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['my-site-cache-v5'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  const requestURL = new URL(event.request.url);
  if(requestURL.pathname === '/'){
    console.log(event.request);
    console.log(new Request('/index.html'));
    console.log('path matched');
    event.respondWith(
      caches.match(new Request('/index.html'))
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
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
      .catch(err=>console.log(err))
    );
    return;
  }
  console.log(requestURL);

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
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
      .catch(err=>console.log(err))
    );
});

// self.addEventListener('message',function(event){
//   if(event.data.action === 'skipWaiting') self.skipWaiting();
  
// });