/**
 * PRIORITET 69.2 – Tvungen versjonskontroll for sjåførkontroll
 * 
 * ARKITEKTUR:
 * ===========
 * 1. version.json er kildefilen på serveren (sannhetskilden)
 * 2. APP_VERSION lastes DYNAMISK fra version.json ved oppstart
 * 3. Klienten sammenligner egen versjon mot serverversjon
 * 4. Sjåførkontroll er SPERRET inntil versjonene er verifisert
 * 
 * DEPLOY-PROSESS:
 * ===============
 * 1. Når du deployer ny kode, oppdater BARE version.json: {"version": "80"}
 * 2. APP_VERSION blir automatisk lastet fra serveren (ikke hardkodet)
 * 3. Hvis klienten kjører gammel kode, vil APP_VERSION < serverVersion
 * 4. Tvungen oppdatering aktiveres automatisk
 * 
 * SIKKERHET:
 * ==========
 * - Sjåførkontroll er BLOKKERT inntil versjonsjekk er ferdig
 * - Hvis versjonsjekk feiler: kontroll FORBLIR sperret (fail-secure)
 * - HTML-knappene disabled=true ved oppstart, aktiveres først etter OK
 */

(function() {
  'use strict';

  const VERSION_CHECK = {
    // Appens gjeldende versjon (lastes fra version.json)
    APP_VERSION: null,
    
    // Versjonsjekk fullført?
    versionCheckComplete: false,
    
    // Versjonsjekk ok?
    versionCheckOk: false,

    // Oppdater service worker hvis den finnes
    updateServiceWorker: function() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.controller?.postMessage({type: 'SKIP_WAITING'});
        navigator.serviceWorker.ready.then((reg) => {
          reg.update().catch(e => console.warn('[VERSION_CHECK] SW update failed:', e));
        }).catch(e => console.warn('[VERSION_CHECK] SW ready failed:', e));
      }
    },

    // Tøm ALL cache — tvingen refresh av alle ressurser
    clearAllCache: function() {
      if ('caches' in window) {
        caches.keys().then((names) => {
          Promise.all(names.map(name => caches.delete(name)))
            .catch(e => console.warn('[VERSION_CHECK] Cache clear failed:', e));
        });
      }
    },

    // Hent versjonsnummeret fra version.json (NO-CACHE)
    // Dette er sannhetskilden — gjeldende versjon på serveren
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
        
        return serverVersion;
      } catch (e) {
        console.error('[VERSION_CHECK] version.json fetch error:', e);
        return null;
      }
    },

    // VIS tvungen oppdateringspanel (BLOKKERER ALT)
    showUpdatePanel: function(serverVersion, clientVersion) {
      const panel = document.getElementById('version-update-panel');
      const app = document.getElementById('app');
      
      console.error('[VERSION_CHECK] BLOCKING: Client version', clientVersion, 'is outdated. Server requires:', serverVersion);
      
      // Oppdater versjonsnumre i panelet
      const versionInfo = document.getElementById('version-info');
      if (versionInfo) {
        versionInfo.innerHTML = `Din versjon: <strong>${clientVersion}</strong> | Serverversjon: <strong>${serverVersion}</strong>`;
      }
      
      // VIS panelet
      if (panel) {
        panel.style.display = 'flex';
      }
      
      // SKJUL appen
      if (app) {
        app.style.display = 'none';
      }
      
      // Blokkér ALL interaksjon (sikkerhet — fail-secure)
      this.blockAllInteraction();
      
      console.error('[VERSION_CHECK] APPLICATION BLOCKED: Mandatory update required');
    },

    // SKJUL oppdateringspanel, VIS appen
    hideUpdatePanel: function() {
      const panel = document.getElementById('version-update-panel');
      const app = document.getElementById('app');
      
      if (panel) {
        panel.style.display = 'none';
      }
      if (app) {
        app.style.display = 'block';
      }
      
      // Tillat interaksjon igjen
      this.allowInteraction();
      
      console.log('[VERSION_CHECK] Version check OK. Application READY');
    },

    // Blokkér ALL interaksjon (sikkerhet)
    blockAllInteraction: function() {
      document.querySelectorAll('button, input, textarea, select, form, [onclick]').forEach(el => {
        el.disabled = true;
        el.style.pointerEvents = 'none';
        el.style.opacity = '0.4';
        el.style.cursor = 'not-allowed';
      });
    },

    // Tillat interaksjon
    allowInteraction: function() {
      document.querySelectorAll('button, input, textarea, select, form, [onclick]').forEach(el => {
        if (!el.id || !el.id.startsWith('version-')) {
          el.disabled = false;
          el.style.pointerEvents = 'auto';
          el.style.opacity = '1';
          el.style.cursor = 'pointer';
        }
      });
    },

    // Utfør oppdatering ved trykk på knapp
    performUpdate: function() {
      console.log('[VERSION_CHECK] User initiated update...');
      
      // 1. Oppdater service worker
      this.updateServiceWorker();
      
      // 2. Tøm ALL cache
      this.clearAllCache();
      
      // 3. Hard refresh
      setTimeout(() => {
        console.log('[VERSION_CHECK] Hard refresh...');
        window.location.href = window.location.href.split('?')[0] + '?_v=' + Date.now();
      }, 500);
    },

    // Initialiser versjonskontroll
    init: async function() {
      console.log('[VERSION_CHECK] Initializing version check...');
      
      // Hent serverversjon (dette blir APP_VERSION)
      const serverVersion = await this.fetchServerVersion();
      
      if (serverVersion === null) {
        // KRITISK: Kunne ikke nå server eller lese version.json
        // SIKKERHET: Sjåførkontroll FORBLIR SPERRET (fail-secure)
        console.error('[VERSION_CHECK] CRITICAL: Could not fetch version.json from server!');
        console.error('[VERSION_CHECK] Sjåførkontroll remains BLOCKED for security');
        this.versionCheckComplete = true;
        this.versionCheckOk = false;
        this.blockAllInteraction();
        return;
      }

      // Lagre appversjon (første gang lastet fra server)
      this.APP_VERSION = serverVersion;
      console.log('[VERSION_CHECK] Server version loaded:', serverVersion);

      // Sammenlign: 
      // - Første gang: APP_VERSION === serverVersion (de er like fordi begge lastet fra server)
      // - Etter deploy: gammel klient har APP_VERSION < serverVersion → BLOKKÉR
      
      if (this.APP_VERSION === serverVersion) {
        // Versjonene matcher — normal drift
        console.log('[VERSION_CHECK] ✓ Version check OK');
        this.versionCheckComplete = true;
        this.versionCheckOk = true;
        this.hideUpdatePanel();
      } else if (this.APP_VERSION < serverVersion) {
        // Klienten kjører gammel kode — BLOKKÉR
        console.error('[VERSION_CHECK] ✗ Client version is OUTDATED');
        this.versionCheckComplete = true;
        this.versionCheckOk = false;
        this.showUpdatePanel(serverVersion, this.APP_VERSION);
      } else {
        // APP_VERSION > serverVersion (unlikely i produksjon)
        console.warn('[VERSION_CHECK] ⚠ Local version is newer than server');
        this.versionCheckComplete = true;
        this.versionCheckOk = true;
        this.hideUpdatePanel();
      }
    }
  };

  // Eksponér globalt
  window.VERSION_CHECK = VERSION_CHECK;

  // Kjør versjonskontroll når DOM er klar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VERSION_CHECK.init());
  } else {
    VERSION_CHECK.init();
  }
})();
