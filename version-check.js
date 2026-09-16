/**
 * PRIORITET 69.2 – Tvungen versjonskontroll for sjåførkontroll
 * 
 * Sikrer at sjåfører ALLTID kjører siste deployede versjon før de kan registrere kontroll.
 * version.json er sannhetskilde, ikke localStorage.
 * 
 * Flyt:
 * 1. Hent version.json fra server (no-cache)
 * 2. Sammenlign med sessionStorage lokal versjon
 * 3. Hvis serverversjon > lokal: STOPP, vis oppdateringspanel, skjul alle funksjoner
 * 4. Krev oppdatering før kontrollregistrering er mulig
 */

(function() {
  'use strict';

  const VERSION_CHECK = {
    // Forsøk å oppdatere service worker
    updateServiceWorker: function() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.controller?.postMessage({type: 'SKIP_WAITING'});
        navigator.serviceWorker.ready.then((reg) => {
          reg.update().catch(e => console.warn('SW update failed:', e));
        }).catch(e => console.warn('SW ready failed:', e));
      }
    },

    // Tøm ALL cache — tvingen refresh
    clearAllCache: function() {
      if ('caches' in window) {
        caches.keys().then((names) => {
          Promise.all(names.map(name => caches.delete(name)))
            .catch(e => console.warn('Cache clear failed:', e));
        });
      }
    },

    // Hent serverversjon fra version.json (no-cache)
    fetchServerVersion: async function() {
      try {
        const url = 'version.json?_cache_bust=' + Date.now();
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {'Cache-Control': 'no-cache, no-store, must-revalidate'}
        });
        
        if (!response.ok) {
          console.error('version.json HTTP error:', response.status);
          return null;
        }
        
        const data = await response.json();
        const serverVersion = parseInt(data.version, 10);
        
        if (isNaN(serverVersion)) {
          console.error('version.json invalid format:', data);
          return null;
        }
        
        console.log('Server version:', serverVersion);
        return serverVersion;
      } catch (e) {
        console.error('version.json fetch error:', e);
        return null;
      }
    },

    // Les lokal versjon fra sessionStorage
    getLocalVersion: function() {
      const stored = sessionStorage.getItem('bilpark_version_checked');
      return stored ? parseInt(stored, 10) : null;
    },

    // Lagre lokal versjon i sessionStorage (denne sesjonen)
    setLocalVersion: function(version) {
      sessionStorage.setItem('bilpark_version_checked', version.toString());
    },

    // VIS oppdateringspanelet (BLOKKERER ALT ANNET)
    showUpdatePanel: function(serverVersion, localVersion) {
      const panel = document.getElementById('version-update-panel');
      const app = document.getElementById('app');
      
      console.log('Showing update panel. Local:', localVersion, 'Server:', serverVersion);
      
      // Oppdater teksten med versjonsnumre
      const versionText = document.getElementById('version-numbers');
      if (versionText) {
        versionText.textContent = 
          'Din versjon: ' + (localVersion || 'ukjent') + 
          ' | Ny versjon: ' + serverVersion;
      }
      
      if (panel) {
        panel.style.display = 'flex';
      }
      if (app) {
        app.style.display = 'none';
      }
      
      // Deaktiver alle skjemaer og knapper i dokumentet (sikkerhet)
      document.querySelectorAll('form, button, input, textarea, select').forEach(el => {
        if (el.id !== 'version-update-button' && !el.id.startsWith('version-')) {
          el.disabled = true;
          el.style.opacity = '0.5';
        }
      });
    },

    // SKJUL oppdateringspanelet, VIS app
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
      document.querySelectorAll('form, button, input, textarea, select').forEach(el => {
        if (el.id !== 'version-update-button') {
          el.disabled = false;
          el.style.opacity = '1';
        }
      });
    },

    // Oppdater appen ved klikk på knappen
    performUpdate: function() {
      console.log('Update initiated...');
      
      // 1. Oppdater service worker
      this.updateServiceWorker();
      
      // 2. Tøm ALL cache
      this.clearAllCache();
      
      // 3. Hard refresh
      setTimeout(() => {
        window.location.href = window.location.href.split('?')[0] + '?_v=' + Date.now();
      }, 300);
    },

    // Initialiser versjonskontroll ved startup
    init: async function() {
      console.log('VERSION CHECK: Initializing...');
      
      // Hent serverversjon
      const serverVersion = await this.fetchServerVersion();
      
      if (serverVersion === null) {
        // Kunne ikke nå server — tillat fortsetting (offline mode)
        console.warn('VERSION CHECK: Could not fetch server version. Allowing offline mode.');
        this.hideUpdatePanel();
        return;
      }

      // Hent lokal versjon
      const localVersion = this.getLocalVersion();

      // Første gang: lagre serverversion
      if (localVersion === null) {
        console.log('VERSION CHECK: First time. Setting local version to', serverVersion);
        this.setLocalVersion(serverVersion);
        this.hideUpdatePanel();
        return;
      }

      // Sammenlign
      if (serverVersion > localVersion) {
        console.warn('VERSION CHECK: Update needed!', {local: localVersion, server: serverVersion});
        this.showUpdatePanel(serverVersion, localVersion);
      } else {
        console.log('VERSION CHECK: Up to date.');
        this.setLocalVersion(serverVersion);
        this.hideUpdatePanel();
      }
    }
  };

  // Eksponér globalt
  window.VERSION_CHECK = VERSION_CHECK;

  // Kjør kontroll når DOM er klar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VERSION_CHECK.init());
  } else {
    VERSION_CHECK.init();
  }
})();
