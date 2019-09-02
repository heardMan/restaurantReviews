const version = "0.6.12r";
const cacheName = `restaurantReviews-${version}`;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/restaurant.html`,
        `/css/imgs/marker-icon-2x.png`,
        `/css/imgs/marker-icon.png`,
        `/css/imgs/marker1-shadow.png`,
        `/css/leaflet.css`,
        `/css/styles.css`,
        `/data/restaurants.json`,
        `/js/polyfills/cache.js`,
        `/js/dbhelper.js`,
        `/js/leaflet.js`,
        `/js/main.js`,
        `/js/restaurant_info.js`,
        `/js/sw.register.js`,
        `/js/sw.util.js`,
        `sw.js`

      ])
          .then(() => self.skipWaiting())
          .catch(err=>console.log(err))
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  console.log(event);
  event.respondWith(
    caches.open(cacheName)
      .then(cache => {
        
        cache.match(event.request, {ignoreSearch: true})
      })
      .then(response => {
      return response || fetch(event.request);
    })
  );
});