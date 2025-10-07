self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  event.waitUntil(caches.open('pdv-cache-v1').then(cache => cache.addAll(['/'])));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
