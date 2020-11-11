// Open up the cache to store file for offline use.
const CACHE_NAME = 'new-cache';

const urlsToCache = [
  './index.html',
  './public/css/animation.css',
  './public/css/fonts.css',
  './public/css/main.css',
  './public/css/media.css',
  './public/css/pages.css',
  './public/js/main.js',
  './public/js/app.js',
  './public/js/board.js',
  './public/js/util.js',
];

// Once the install event is fired cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Match fetch requests with cached resources to avoid
// the need for network usage (incase the user is offline).
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) return response;
        return fetch(event.request);
      }
    )
  );
});


// Remove old caches so we always use new resources
// when we have access to the network (this allows for updates
// without needing to unregister the service worker).
self.addEventListener('activate', function(event) {

  const cacheWhitelist = [CACHE_NAME];

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