const CACHE_NAME = 'sui-calendar-v1';

const ASSETS_TO_CACHE = [
  './',
  './css/main.css',
  './js/app.js',
  './js/calendar.js',
  './js/dialog.js',
  './sounds/click.mp3',
  './sounds/save.mp3',
  './sounds/open.mp3',
  './sui/suibk.jpg',
  './sui/suieyes.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});