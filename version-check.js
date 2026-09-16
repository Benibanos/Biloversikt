/**
 * PRIORITET 69.2 – Tvungen versjonskontroll for sjåførkontroll
 * 
 * VIKTIG: APP_VERSION er hardkodet i klienten og må oppdateres ved hver deploy.
 * Denne er sannhetskilden for hvilken kode som kjører.
 * 
 * Flyt:
 * 1. Hent version.json fra server (no-cache)
 * 2. Sammenlign serverVersion mot APP_VERSION (hardkodet)
 * 3. Hvis serverVersion > APP_VERSION:
 *    - Vis tvungen oppdateringspanel
 *    - Skjul sjåførkontrollen og skjemaet
 *    - Blokkér ALL innsending av kontroller
 * 4. Hvis serverVersion === APP_VERSION:
 *    - Normal drift, fullstendig tilgang
 */

(function() {
  'use strict';

  // ============ VERSJONSKONSTANT — OPPDATER VED HVER DEPLOY ============
  // Dette er den eneste kilden til hva som er "siste versjon" på klienten.
  // Må matche version.json på serveren etter at du har deployet nye endringer.
  const APP_VERSION = 79;
  // ======================================================================

  const VERSION_CHECK = {
    // Oppdater service worker hvis den finnes
    updateServiceWorker: function() {
      if ('serviceWorker' in navigator) {
        // Send skip-waiting signal til service worker
        navigator.serviceWorker.controller?.postMessage({type: 'SKIP_WAITING'});
        
        navigator.serviceWorker.ready.then((reg) => {
          reg.update().catch(e => console.warn('[VERSION_CHECK] SW update failed:', e));
        }).catch(e => console.warn('[VERSION_CHECK] SW ready failed:', e));
      }
    },

    // Tøm ALL cache — tvungen refresh av alle ressurser
    clearAllCache: function() {
      if ('caches' in window) {
        caches.keys().then((names) => {
          Promise.all(names.map(name => caches.delete(name)))
            .catch(e => console.warn('[VERSION_CHECK] Cache clear failed:', e));
        });
      }
    },

    // Hent serverversjon fra version.json (NO-CACHE)
    fetchServerVersion: async function() {
      try {
        const url = 'version.json?_cache_bust=' + Date.now();
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          console.error('[VERSION_CHECK] version.json HTTP error:', response.status);
          return null;
        }
        
        const data = await response.json();
        const serverVersion = parseInt(data.version, 10);
        
        if (isNaN(serverVersion)) {
          console.error('[VERSION_CHECK] version.json invalid format:', data);
          return null;
        }
        
        console.log('[VERSION_CHECK] Server version:', serverVersion, '| App version:', APP_VERSION);
        return serverVersion;
      } catch (e) {
        console.error('[VERSION_CHECK] Fetch error:', e);
        return null;
      }
    },

    // VIS oppdateringspanelet (BLOKKERER ALLE FUNKSJONER)
    showUpdatePanel: function(serverVersion) {
      const panel = document.getElementById('version-update-panel');
      const app = document.getElementById('app');
      
      console.warn('[VERSION_CHECK] BLOCKING: Server version', serverVersion, 'is newer than app version', APP_VERSION);
      
      // Oppdater versjonsnumre i panelet
      const versionInfo = document.getElementById('version-info');
      if (versionInfo) {
        versionInfo.innerHTML = `Din versjon: <strong>${APP_VERSION}</strong> | Serverversjon: <strong>${serverVersion}</strong>`;
      }
      
      // VIS panelet
      if (panel) {
        panel.style.display = 'flex';
      }
      
      // SKJUL appen
      if (app) {
        app.style.display = 'none';
      }
      
      // Blokkér ALL interaksjon i dokumentet (sikkerhet)
      document.querySelectorAll('button, input, textarea, select, form').forEach(el => {
        el.disabled = true;
        el.style.pointerEvents = 'none';
        el.style.opacity = '0.4';
      });
      
      console.warn('[VERSION_CHECK] APPLICATION BLOCKED: Update required');
    },

    // SKJUL oppdateringspanelet, VIS appen
    hideUpdatePanel: function() {
      const panel = document.getElementById('version-update-panel');
      const app = document.getElementById('app');
      
      if (panel) {
        panel.style.display = 'none';
      }
      if (app) {
        app.style.display = 'block';
      }
      
      // Re-aktiver alle elementer
      document.querySelectorAll('button, input, textarea, select, form').forEach(el => {
        el.disabled = false;
        el.style.pointerEvents = 'auto';
        el.style.opacity = '1';
      });
      
      console.log('[VERSION_CHECK] Application READY');
    },

    // Oppdater klienten ved trykk på knappen
    performUpdate: function() {
      console.log('[VERSION_CHECK] Update initiated by user...');
      
      // 1. Oppdater service worker
      this.updateServiceWorker();
      
      // 2. Tøm ALL cache
      this.clearAllCache();
      
      // 3. Hard refresh etter 500ms (gir tid for cache-sletting)
      setTimeout(() => {
        console.log('[VERSION_CHECK] Hard refresh...');
        window.location.href = window.location.href.split('?')[0] + '?_v=' + Date.now();
      }, 500);
    },

    // Initialiser versjonskontroll ved startup
    init: async function() {
      console.log('[VERSION_CHECK] Initializing... App version:', APP_VERSION);
      
      // Hent serverversjon
      const serverVersion = await this.fetchServerVersion();
      
      if (serverVersion === null) {
        // Kunne ikke nå server — tillat fortsetting (offline/nettverksfeil)
        console.warn('[VERSION_CHECK] Could not fetch server version. Allowing offline mode.');
        this.hideUpdatePanel();
        return;
      }

      // Sammenlign versioner
      if (serverVersion > APP_VERSION) {
        // NY VERSJON TILGJENGELIG — STOPP APPLIKASJONEN
        console.error('[VERSION_CHECK] OUTDATED CLIENT! Server:', serverVersion, 'App:', APP_VERSION);
        this.showUpdatePanel(serverVersion);
      } else if (serverVersion === APP_VERSION) {
        // Samme versjon — normal drift
        console.log('[VERSION_CHECK] Version match. Proceeding with normal operation.');
        this.hideUpdatePanel();
      } else {
        // Lokal versjon er høyere enn server (unlikely i produksjon, men tillatt)
        console.warn('[VERSION_CHECK] Local version is NEWER than server. This is unusual.');
        this.hideUpdatePanel();
      }
    }
  };

  // Eksponér globalt slik at HTML-knappen kan kalle den
  window.VERSION_CHECK = VERSION_CHECK;

  // Kjør versjonskontroll når DOM er klar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VERSION_CHECK.init());
  } else {
    VERSION_CHECK.init();
  }
})();
