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
  const APP_VERSION = 122;

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

    // Er dette sjåførmodus (?sjafor=1 eller kontroll.html)? Samme regel som detectDriverMode()
    // i index.html — dupliseres her fordi denne filen kjører FØR hovedscriptet.
    erSjaforModus: function() {
      try {
        const params = new URLSearchParams(window.location.search);
        return params.get('sjafor') === '1' || /\/kontroll\.html$/i.test(window.location.pathname || '');
      } catch (e) { return false; }
    },

    // PRIORITET 61 — ÉN felles «hard refresh», brukt av både tvungen versjonsoppdatering og
    // sjåførens daglige systemkontroll. Den gamle performUpdate() tømte cachene uten å vente på
    // dem og navigerte etter 500 ms — uten å hente ressursene på nytt utenom nettleserens
    // HTTP-cache (GitHub Pages har max-age på 10 minutter), og med `location.href.split('?')[0]`
    // som FJERNET ?sjafor=1 fra en installert sjåførsnarvei (index.html?sjafor=1) slik at
    // sjåføren havnet på administratorinnloggingen. Rekkefølge nå:
    //   1. service worker: be om oppdatering
    //   2. slett Bilpark-cachene (kun `bilpark-*` — GitHub Pages deler opprinnelse med andre repoer)
    //   3. last appressursene på nytt med cache:'reload' (oppdaterer også HTTP-cachen)
    //   4. naviger til samme adresse (søkeparametre bevart) med ny `_v`-parameter
    // Hvert steg er best effort: feiler ett, navigerer vi likevel — versjonskontrollen ved
    // oppstart er fortsatt fail-secure og sperrer hvis filene ikke ble fornyet.
    hardRefresh: async function(opts) {
      opts = opts || {};
      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(r => r.update().catch(() => {})));
        }
      } catch (e) { console.warn('[VERSION_CHECK] SW update failed:', e); }
      try {
        if ('caches' in window) {
          const names = await caches.keys();
          await Promise.all(names.filter(n => n.indexOf('bilpark-') === 0).map(n => caches.delete(n)));
        }
      } catch (e) { console.warn('[VERSION_CHECK] Cache clear failed:', e); }
      try {
        const base = new URL('.', window.location.href);
        const urler = new Set([
          window.location.href,
          new URL('version.json', base).href,
          new URL('version-check.js', base).href,
          new URL('index.html', base).href,
          new URL('kontroll.html', base).href
        ]);
        document.querySelectorAll('script[src], link[rel="manifest"], link[rel="icon"], link[rel="apple-touch-icon"]').forEach(el => {
          const href = el.src || el.href;
          if (href && href.indexOf(window.location.origin) === 0) urler.add(href);
        });
        const hent = Array.from(urler).map(u => fetch(u, { cache: 'reload' }).catch(() => null));
        await Promise.race([Promise.all(hent), new Promise(r => setTimeout(r, 8000))]);
      } catch (e) { console.warn('[VERSION_CHECK] Resource refetch failed:', e); }
      const url = new URL(window.location.href);
      url.searchParams.set('_v', String(Date.now()));
      Object.keys(opts.param || {}).forEach(k => url.searchParams.set(k, opts.param[k]));
      window.location.replace(url.toString());
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
        panel.innerHTML = '<div style="width:min(100%,460px);padding:28px;text-align:center;border:1px solid #F0554F;border-radius:14px;background:#101614;box-shadow:0 18px 50px rgba(0,0,0,.35)"><img src="icons/bilpark-icon-192-v63.png" alt="Bilpark" style="width:72px;height:72px;display:block;margin:0 auto 20px;border-radius:16px"><div id="version-title" style="font-size:24px;font-weight:700;color:#F0554F;margin-bottom:16px">⚠️ Oppdatering kreves</div><p>Denne enheten kjører en eldre versjon av Bilpark.</p><p>For å sikre at kilometerstander, kontroller, skader og aktive saker behandles korrekt må sjåførkontrollen oppdateres før den kan brukes.</p><h2 style="font-size:16px;margin:20px 0 8px">Versjonsstatus</h2><p id="version-info" style="margin:0 0 18px;color:#C3CFC8"></p><p>Du kan ikke registrere:</p><ul style="display:inline-block;text-align:left"><li>Sjåførkontroller</li><li>Skader</li><li>Varsellamper</li><li>Avvik</li><li>Kommentarer</li></ul><p>før oppdateringen er fullført.</p><p>Trykk på knappen under for å laste ned siste versjon av Bilpark.</p><button id="version-update-btn" type="button" style="padding:10px 16px;border:0;border-radius:9px;background:#19A66B;color:#08100C;font-weight:700;cursor:pointer">🔄 Oppdater sjåførkontrollen</button><p style="margin:20px 0 0;color:#C3CFC8;font-size:13px">Hvis problemet vedvarer, kontakt driftskoordinator.</p></div>';
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

      // Prioritet 61: sjåførmodus oppdaterer seg selv.
      if (this.erSjaforModus() && this.tillatAutoOppdatering()) {
        const tittel = document.getElementById('version-title');
        if (tittel) tittel.textContent = 'Ny versjon funnet';
        const knapp = document.getElementById('version-update-btn');
        if (knapp) { knapp.textContent = 'Oppdaterer ...'; knapp.disabled = true; knapp.style.opacity = '.6'; }
        setTimeout(() => this.performUpdate(), 400);
      }
      
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
        panel.innerHTML = '<div style="width:min(100%,460px);padding:28px;text-align:center;border:1px solid #F0554F;border-radius:14px;background:#101614;box-shadow:0 18px 50px rgba(0,0,0,.35)"><img src="icons/bilpark-icon-192-v63.png" alt="Bilpark" style="width:72px;height:72px;display:block;margin:0 auto 20px;border-radius:16px"><div style="font-size:24px;font-weight:700;color:#F0554F;margin-bottom:16px">⚠️ Kunne ikke verifisere versjon</div><p>Bilpark fikk ikke bekreftet at denne enheten kjører siste godkjente versjon.</p><p>For å beskytte kjøretøydata og kontrollhistorikk er sjåførkontrollen midlertidig sperret.</p><p>Kontroller internettilkoblingen og prøv igjen.</p><button id="version-update-btn" type="button" style="padding:10px 16px;border:0;border-radius:9px;background:#19A66B;color:#08100C;font-weight:700;cursor:pointer">🔄 Prøv igjen</button><p style="margin:20px 0 0;color:#C3CFC8;font-size:13px">Hvis problemet vedvarer, kontakt driftskoordinator.</p></div>';
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

    // Utfør oppdatering ved trykk på knapp (Prioritet 61: felles hardRefresh(), bevarer ?sjafor=1)
    performUpdate: function() {
      console.log('[VERSION_CHECK] Update started...');
      const knapp = document.getElementById('version-update-btn');
      if (knapp) { knapp.disabled = true; knapp.style.opacity = '.6'; }
      return this.hardRefresh();
    },

    // Sjåførmodus: en utdatert klient oppdateres AUTOMATISK («Ny versjon funnet — Oppdaterer …»),
    // uten at sjåføren må finne og trykke en knapp. Maks to automatiske forsøk per fem minutter
    // (sessionStorage) — ellers kunne en CDN som midlertidig serverer version.json og index.html
    // i utakt gi en evig omlastingsløkke. Da står den manuelle knappen igjen.
    tillatAutoOppdatering: function() {
      try {
        const nå = Date.now();
        const s = JSON.parse(sessionStorage.getItem('bilpark_vc_auto') || 'null');
        const n = (s && nå - s.t < 5 * 60 * 1000) ? s.n : 0;
        if (n >= 2) return false;
        sessionStorage.setItem('bilpark_vc_auto', JSON.stringify({ n: n + 1, t: (s && n > 0) ? s.t : nå }));
        return true;
      } catch (e) { return false; }
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
