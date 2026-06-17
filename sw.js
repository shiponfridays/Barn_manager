const CACHE_NAME = 'barn-manager-cache-v26';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/images/favicon.png',
  './assets/images/favicon-32.png',
  './assets/images/favicon-192.png',
  './assets/images/favicon-512.png',
  './assets/images/apple-touch-icon.png',
  './assets/js/pages/login.js',
  './assets/js/pages/dashboard.js',
  './assets/js/pages/flock-info.js',
  './assets/js/pages/barn-setup.js',
  './assets/js/pages/brooding.js',
  './assets/js/pages/walkthrough.js',
  './assets/js/pages/weights.js',
  './assets/js/pages/repairs.js',
  './assets/js/pages/reminders.js',
  './pages/dashboard.html',
  './pages/flock-info.html',
  './pages/barn-setup.html',
  './pages/brooding.html',
  './pages/walkthrough.html',
  './pages/weights.html',
  './pages/repairs.html',
  './pages/reminders.html',
  './assets/images/farm-bg.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
