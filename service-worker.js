self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('samo-store').then(cache => {
      return cache.addAll(['./',
        './index.html',
        './style.css',
        './script.js',
        './manifest.json',
        './shopping-icon.webp']);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});

