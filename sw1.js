const CACHE_NAME = 'pdv-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'icon-192.png',
  'icon-512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];
const SUPABASE_API_HOST = 'eymchtbskyhqghjwclkb.supabase.co';

// 1. Instalação: Salva os arquivos principais no cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. Ativação: Limpa caches antigos se houver.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch: Decide se busca um arquivo do cache ou da internet.
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Se for uma chamada para a API do Supabase, vá sempre para a rede.
  if (requestUrl.hostname === SUPABASE_API_HOST) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Para todos os outros arquivos, tente o cache primeiro.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o arquivo estiver no cache, retorna ele.
        if (response) {
          return response;
        }
        // Se não, busca na internet.
        return fetch(event.request);
      })
  );
});