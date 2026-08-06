// Service worker for Kjøretøyoversikt.
// Cacher app-skallet (HTML/CSS/JS/ikoner) slik at appen åpner og fungerer uten nett.
// NB: Google Fonts (importert i <style>) hentes fra nett første gang og caches av
// nettleseren selv; helt uten nett kan fonten falle tilbake til systemfont, men
// appen for øvrig fungerer som normalt.

const CACHE_NAME = 'kjoretoy-cache-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './storage.local.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-48.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first for app-skallet, med nettverk som fallback (og oppdatering av cachen
// i bakgrunnen når nett er tilgjengelig). Alt annet (f.eks. Google Fonts) går rett
// til nettverket og caches av nettleserens egen HTTP-cache.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isCoreAsset = url.origin === self.location.origin;
  if (!isCoreAsset) return; // la eksterne ressurser (fonter) gå som normalt

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
