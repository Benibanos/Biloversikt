/**
 * PRIORITET 69.2 – Tvungen versjonskontroll for sjåførkontroll
 * 
 * ARKITEKTUR:
 * ===========
 * 1. version.json er serververdien
 * 2. APP_VERSION er bundet til klientkoden
 * 3. Klienten krever at verdiene er identiske
 * 4. Hele Bilpark er SPERRET inntil versjonene er verifisert
 * 
 * DEPLOY-PROSESS:
 * ===============
 * 1. Når du deployer ny kode, oppdater APP_VERSION og version.json til samme verdi
 * 2. Hvis verdiene avviker, vises VERSION_MISMATCH og normal drift blokkeres
 * 
 * SIKKERHET:
 * ==========
 * - Sjåførkontroll er BLOKKERT inntil versjonsjekk er ferdig
 * - Hvis versjonsjekk feiler: kontroll FORBLIR sperret (fail-secure)
 * - HTML-knappene disabled=true ved oppstart, aktiveres først etter OK
 */

(function() {
  'use strict';

  // Må oppdateres samtidig med version.json. En klient som kjører en annen
  // versjon skal aldri få starte normal drift.
  const APP_VERSION = 80;

  const VERSION_CHECK = {
    // Appens versjon er bundet til koden, ikke hentet fra serveren.
    APP_VERSION,
    
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
      let panel = document.getElementById('version-update-panel');
      const app = document.getElementById('app');
      
      console.error('[VERSION_CHECK] VERSION_MISMATCH: Client version', clientVersion, 'does not match server version:', serverVersion);

      if (!document.body) {
        document.addEventListener('DOMContentLoaded', () => this.showUpdatePanel(serverVersion, clientVersion), {once: true});
        return;
      }

      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'version-update-panel';
        panel.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:#080C0B;color:#E9F0EC;font:16px system-ui,sans-serif;text-align:center;';
        panel.innerHTML = '<div style="width:min(100%,460px);padding:28px;text-align:left;border:1px solid #F0554F;border-radius:14px;background:#101614;box-shadow:0 18px 50px rgba(0,0,0,.35)"><div style="font-size:24px;font-weight:700;color:#F0554F;margin-bottom:16px">⚠️ Oppdatering kreves</div><p>Denne enheten kjører en eldre versjon av Bilpark.</p><p>For å sikre at kilometerstander, kontroller, skader og aktive saker behandles korrekt må sjåførkontrollen oppdateres før den kan brukes.</p><h2 style="font-size:16px;margin:20px 0 8px">Versjonsstatus</h2><p id="version-info" style="margin:0 0 18px;color:#C3CFC8"></p><p>Du kan ikke registrere:</p><ul><li>Sjåførkontroller</li><li>Skader</li><li>Varsellamper</li><li>Avvik</li><li>Kommentarer</li></ul><p>før oppdateringen er fullført.</p><p>Trykk på knappen under for å laste ned siste versjon av Bilpark.</p><button id="version-update-btn" type="button" style="padding:10px 16px;border:0;border-radius:9px;background:#19A66B;color:#08100C;font-weight:700;cursor:pointer">🔄 Oppdater sjåførkontrollen</button><p style="margin:20px 0 0;color:#C3CFC8;font-size:13px">Hvis problemet vedvarer, kontakt driftskoordinator.</p></div>';
        document.body.appendChild(panel);
        const updateButton = document.getElementById('version-update-btn');
        if (updateButton) updateButton.addEventListener('click', () => this.performUpdate());
      }
      
      // Oppdater versjonsnumre i panelet
      const versionInfo = document.getElementById('version-info');
      if (versionInfo) {
        versionInfo.innerHTML = `APP_VERSION: <strong>${clientVersion}</strong> | version.json: <strong>${serverVersion}</strong>`;
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
      
      console.error('[VERSION_CHECK] APPLICATION BLOCKED: VERSION_MISMATCH');
    },

    showVerificationError: function() {
      let panel = document.getElementById('version-update-panel');
      const app = document.getElementById('app');

      console.error('[VERSION_CHECK] APPLICATION BLOCKED: VERSION_CHECK_FAILED');

      if (!document.body) {
        document.addEventListener('DOMContentLoaded', () => this.showVerificationError(), {once: true});
        return;
      }

      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'version-update-panel';
        panel.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:#080C0B;color:#E9F0EC;font:16px system-ui,sans-serif;text-align:center;';
        panel.innerHTML = '<div style="width:min(100%,460px);padding:28px;text-align:left;border:1px solid #F0554F;border-radius:14px;background:#101614;box-shadow:0 18px 50px rgba(0,0,0,.35)"><div style="font-size:24px;font-weight:700;color:#F0554F;margin-bottom:16px">⚠️ Kunne ikke verifisere versjon</div><p>Bilpark fikk ikke bekreftet at denne enheten kjører siste godkjente versjon.</p><p>For å beskytte kjøretøydata og kontrollhistorikk er sjåførkontrollen midlertidig sperret.</p><p>Kontroller internettilkoblingen og prøv igjen.</p><button id="version-update-btn" type="button" style="padding:10px 16px;border:0;border-radius:9px;background:#19A66B;color:#08100C;font-weight:700;cursor:pointer">🔄 Prøv igjen</button><p style="margin:20px 0 0;color:#C3CFC8;font-size:13px">Hvis problemet vedvarer, kontakt driftskoordinator.</p></div>';
        document.body.appendChild(panel);
        const retryButton = document.getElementById('version-update-btn');
        if (retryButton) retryButton.addEventListener('click', () => this.performUpdate());
      }

      panel.style.display = 'flex';
      if (app) app.style.display = 'none';
      this.blockAllInteraction();
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
        if (el.id && el.id.startsWith('version-')) return;
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
      
      // Hent serverversjonen som APP_VERSION skal samsvare med
      const serverVersion = await this.fetchServerVersion();
      
      if (serverVersion === null) {
        // KRITISK: Kunne ikke nå server eller lese version.json
        // SIKKERHET: Sjåførkontroll FORBLIR SPERRET (fail-secure)
        console.error('[VERSION_CHECK] CRITICAL: Could not fetch version.json from server!');
        console.error('[VERSION_CHECK] Sjåførkontroll remains BLOCKED for security');
        this.versionCheckComplete = true;
        this.versionCheckOk = false;
        this.showVerificationError();
        return;
      }

      console.log('[VERSION_CHECK] Client version:', this.APP_VERSION, 'Server version:', serverVersion);

      if (this.APP_VERSION === serverVersion) {
        // Versjonene matcher — normal drift
        console.log('[VERSION_CHECK] ✓ Version check OK');
        this.versionCheckComplete = true;
        this.versionCheckOk = true;
        this.hideUpdatePanel();
      } else {
        // Både gammel og nyere klient er ugyldig: de to filene må være identiske.
        console.error('[VERSION_CHECK] ✗ VERSION_MISMATCH');
        this.versionCheckComplete = true;
        this.versionCheckOk = false;
        this.showUpdatePanel(serverVersion, this.APP_VERSION);
      }
    }
  };

  // Eksponér globalt
  window.APP_VERSION = APP_VERSION;
  window.VERSION_CHECK = VERSION_CHECK;
  // Hovedappen venter på denne Promise-en før loadAll() får starte.
  window.VERSION_CHECK_READY = VERSION_CHECK.init();
})();
