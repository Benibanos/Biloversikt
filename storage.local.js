/*
 * storage.local.js — standard-lagring for Kjøretøyoversikt utenfor Claude.ai.
 *
 * Appen ble opprinnelig bygget som et Claude-artifakt, der window.storage er et
 * innebygd API som Claude.ai leverer automatisk (med ekte deling mellom kolleger
 * i bakgrunnen). Det API-et finnes IKKE i en vanlig nettleser — så for at appen
 * skal kunne installeres og kjøres som en frittstående PWA, leverer denne filen
 * et eget window.storage med nøyaktig samme funksjoner (get/set/delete/list),
 * slik at resten av appkoden ikke trenger å endres i det hele tatt.
 *
 * VIKTIG Å VITE:
 * Denne standardversjonen lagrer alt i nettleserens localStorage på ENHETEN.
 * Det betyr:
 *   - Data overlever lukking av appen, omstart av telefon/PC osv. (ekte offline-lagring)
 *   - Data deles IKKE automatisk mellom kolleger eller mellom flere enheter —
 *     "shared"-flagget fungerer altså som lokal lagring her, ikke som ekte
 *     sanntidsdeling slik det gjorde inne i Claude.ai.
 *
 * Ønsker dere ekte deling mellom alle ansatte (som i Claude-versjonen), bytt ut
 * denne filen med storage.firebase.js — se README.md for fremgangsmåte. Resten
 * av appen trenger ingen endring, siden begge filene leverer samme grensesnitt.
 */
(function () {
  const NS = 'kjoretoy:';

  function fullKey(key, shared) {
    return NS + (shared ? 'shared:' : 'me:') + key;
  }

  async function get(key, shared) {
    const raw = window.localStorage.getItem(fullKey(key, shared));
    if (raw === null) return null;
    return { key, value: raw, shared: !!shared };
  }

  async function set(key, value, shared) {
    window.localStorage.setItem(fullKey(key, shared), value);
    return { key, value, shared: !!shared };
  }

  async function del(key, shared) {
    const k = fullKey(key, shared);
    const existed = window.localStorage.getItem(k) !== null;
    window.localStorage.removeItem(k);
    return { key, deleted: existed, shared: !!shared };
  }

  async function list(prefix, shared) {
    const p = fullKey(prefix || '', shared);
    const nsPrefix = NS + (shared ? 'shared:' : 'me:');
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const lk = window.localStorage.key(i);
      if (lk && lk.startsWith(p)) keys.push(lk.slice(nsPrefix.length));
    }
    return { keys, prefix, shared: !!shared };
  }

  window.storage = { get, set, delete: del, list };
})();
