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

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

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