// ================= Bilpark Service Worker =================
// Enkel "app shell"-cache slik at appen kan åpnes offline etter første besøk.
// Selve DATAEN (biler, kontroller, skader osv.) lagres nå sentralt i Airtable
// (se storage.airtable.js i index.html) — denne service workeren cacher kun
// selve applikasjonsfilene (HTML/JSON/ikoner), ikke data. Fetch-lytteren under
// er bevisst begrenset til forespørsler til EGEN side (samme opprinnelse) —
// den skal aldri forsøke å mellomlagre eller gripe inn i Airtables egen
// nettverkstrafikk (api.airtable.com).
//
// VIKTIG VED OPPDATERING: øk CACHE_VERSION når index.html eller andre filer i
// APP_SHELL endres, ellers kan brukere sitte fast på en gammel, cachet versjon.
const CACHE_VERSION = 'bilpark-v21';
const APP_SHELL = [
  './',
  './index.html',
  './kontroll.html',
  './manifest.json',
  './manifest-sjafor.json',
  './airtable-config.js',
  './storage.airtable.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Nettverk FØRST for app-shell-filene (med cache som fallback når man er offline)
// — men KUN for forespørsler til egen side. Forespørsler til api.airtable.com
// slipper helt forbi service workeren og går rett til nettverket, uendret.
//
// VIKTIG (rettet feil): dette var tidligere "cache-first" (vis cachet kopi med
// det samme, oppdater cachen stille i bakgrunnen for NESTE besøk). Det er
// nettopp derfor nye endringer (som mobiltilpasningene) så ut til "ikke slå
// inn" — den cachede, gamle siden ble alltid vist først, og den ferske
// versjonen lå og ventet til et besøk nummer to som sjelden skjedde av seg
// selv. Nettverk-først løser dette: er man online, hentes alltid nyeste
// versjon direkte — cachen brukes kun som reserve når enheten er offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
