/*
 * storage.airtable.js — sentral lagring for Bilpark via Airtable.
 *
 * Erstatter storage.firebase.js. Leverer samme grensesnitt (get/set/delete/
 * list) som appen alt bruker, slik at resten av index.html — bilregister,
 * skader, verkstedtimer, sjåførkontroller osv. — ikke trenger å endres.
 *
 * VIKTIG FORSKJELL FRA localStorage/Firebase-versjonen: hvert "datasett"
 * (vehicles, damages, kontroller, varsellys, verkstedtimer, admin-users)
 * lagres nå som ÉN RAD PER OPPFØRING i en ekte Airtable-tabell (ikke én stor
 * JSON-blob), slik at dere kan bla i, filtrere og sortere dataene direkte i
 * Airtable slik dere er vant til. Se AIRTABLE_MIGRATION.md for tabelloversikt.
 *
 * "set(key, arrayJson)" fungerer ved AVSTEMMING (reconciliation): appen sender
 * fortsatt inn HELE listen som JSON (uendret fra før), og denne filen
 * sammenligner den mot det som faktisk ligger i Airtable, og oppretter/
 * oppdaterer/sletter kun radene som faktisk er endret. Dette krever et ekstra
 * "AppId"-felt i hver tabell (appens egen id, forskjellig fra Airtables eget
 * radId "rec...") — se feltoversikten i AIRTABLE_MIGRATION.md.
 *
 * Krever at airtable-config.js er lastet FØR denne filen.
 */
(function () {
  const API_BASE = 'https://api.airtable.com/v0/' + AIRTABLE_CONFIG.baseId;
  const HEADERS = {
    'Authorization': 'Bearer ' + AIRTABLE_CONFIG.token,
    'Content-Type': 'application/json'
  };

  async function airtableFetch(path, options) {
    const res = await fetch(API_BASE + path, Object.assign({ headers: HEADERS }, options || {}));
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error('Airtable-feil ' + res.status + ' på ' + path + ': ' + body);
    }
    return res.json();
  }

  // Henter ALLE rader i en tabell (håndterer Airtables paginering automatisk).
  async function listAll(table) {
    let records = [];
    let offset = null;
    do {
      const qs = offset ? '?pageSize=100&offset=' + offset : '?pageSize=100';
      const data = await airtableFetch('/' + encodeURIComponent(table) + qs, { method: 'GET' });
      records = records.concat(data.records || []);
      offset = data.offset || null;
    } while (offset);
    return records;
  }

  // Airtables batch-endepunkter tar maks 10 rader per kall.
  function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }
  async function batchCreate(table, recordsFields) {
    for (const part of chunk(recordsFields, 10)) {
      await airtableFetch('/' + encodeURIComponent(table), {
        method: 'POST',
        body: JSON.stringify({ records: part.map(fields => ({ fields })) })
      });
    }
  }
  async function batchUpdate(table, idFieldsPairs) {
    for (const part of chunk(idFieldsPairs, 10)) {
      await airtableFetch('/' + encodeURIComponent(table), {
        method: 'PATCH',
        body: JSON.stringify({ records: part.map(([id, fields]) => ({ id, fields })) })
      });
    }
  }
  async function batchDelete(table, ids) {
    for (const part of chunk(ids, 10)) {
      const qs = part.map(id => 'records[]=' + encodeURIComponent(id)).join('&');
      await airtableFetch('/' + encodeURIComponent(table) + '?' + qs, { method: 'DELETE' });
    }
  }

  // ---- Tabell-/feltoppsett — se AIRTABLE_MIGRATION.md for samme oversikt ----
  // "id" er alltid appens egen AppId-feltnavn. "type" styrer konvertering
  // til/fra Airtables feltverdier: 'json' = lagres som JSON-tekst (array/objekt),
  // 'bool' = checkbox, 'num' = tall. Uten type = ren tekst.
  const LIST_TABLES = {
    vehicles: { table: 'Vehicles', fields: {
      id: ['AppId'], bilnummer: ['Bilnummer'], regnr: ['Regnr'], merke: ['Merke'], modell: ['Modell'],
      arsmodell: ['Årsmodell'], kategori: ['Kategori'], status: ['Status'], dekk: ['Dekk'],
      km: ['KM', 'num'], loyvenummer: ['Løyvenummer'], hasPhoto: ['HasPhoto', 'bool']
    }},
    damages: { table: 'Damages', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], dato: ['Dato'], beskrivelse: ['Beskrivelse'],
      alvorlighet: ['Alvorlighet'], kommentar: ['Kommentar'], status: ['Status'], registrertAv: ['RegistrertAv'],
      hasPhoto: ['HasPhoto', 'bool'], createdByControlId: ['CreatedByControlId']
    }},
    verkstedtimer: { table: 'WorkshopAppointments', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], verksted: ['Verksted'], dato: ['Dato'], tidspunkt: ['Tidspunkt'],
      beskrivelse: ['Beskrivelse'], notater: ['Notater']
    }},
    kontroller: { table: 'DriverChecks', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], dato: ['Dato'], tidspunkt: ['Tidspunkt'], sjafor: ['Sjafor'],
      km: ['KM', 'num'], varsellamper: ['Varsellamper', 'json'], annetTekst: ['AnnetTekst'],
      harNyeSkader: ['HarNyeSkader', 'bool'], skadeBeskrivelse: ['SkadeBeskrivelse'],
      skadeBilderCount: ['SkadeBilderCount', 'num'], kommentar: ['Kommentar'], linkedDamageId: ['LinkedDamageId']
    }},
    varsellys: { table: 'WarningLights', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], type: ['Type'], annetTekst: ['AnnetTekst'], status: ['Status'],
      registrertDato: ['RegistrertDato'], registrertAv: ['RegistrertAv'], kvittertDato: ['KvittertDato'],
      kvittertAv: ['KvittertAv'], createdByControlId: ['CreatedByControlId']
    }},
    'admin-users': { table: 'Users', fields: {
      id: ['AppId'], rolle: ['Rolle'], tittel: ['Tittel'], brukernavn: ['Brukernavn'], passord: ['Passord']
    }},
  };
  // Enkeltverdier (ikke lister) lagres som én rad hver i Settings-tabellen,
  // med Key = nøkkelnavnet og Value = selve verdien (tekst) — dette gjelder
  // theme-preference OG verksteder (en liste, men lagret samlet som én
  // JSON-tekst i én rad, ikke som egne rader — se saveVerksteder() i
  // index.html, som allerede sender inn hele listen som én JSON-streng).
  const SINGLE_SETTINGS_KEYS = ['theme-preference', 'verksteder'];

  function toAirtableFields(config, obj) {
    const out = {};
    Object.keys(config.fields).forEach(appField => {
      const [atField, type] = config.fields[appField];
      let v = obj[appField];
      if (v === undefined || v === null) v = '';
      if (type === 'json') v = JSON.stringify(v || []);
      else if (type === 'bool') v = !!v;
      else if (type === 'num') v = v === '' ? null : Number(v);
      out[atField] = v;
    });
    return out;
  }
  function fromAirtableFields(config, record) {
    const out = { id: record.fields['AppId'] || record.id };
    Object.keys(config.fields).forEach(appField => {
      const [atField, type] = config.fields[appField];
      let v = record.fields[atField];
      if (type === 'json') { try { v = v ? JSON.parse(v) : []; } catch (e) { v = []; } }
      else if (type === 'bool') v = !!v;
      else if (type === 'num') v = (v === undefined || v === null || v === '') ? '' : v;
      else v = v === undefined ? '' : v;
      out[appField] = v;
    });
    out._airtableRecordId = record.id;
    return out;
  }

  // Cacher Airtable sine rad-IDer (rec...) per (tabell, AppId) mellom kall,
  // så vi slipper å hente hele tabellen på nytt for hver eneste lagring.
  const recordIdCache = {}; // { [table]: { [appId]: 'rec...' } }
  function cacheFor(table) { if (!recordIdCache[table]) recordIdCache[table] = {}; return recordIdCache[table]; }

  async function reconcileList(key, arr) {
    const config = LIST_TABLES[key];
    const cache = cacheFor(config.table);
    if (Object.keys(cache).length === 0) {
      // Første gang denne tabellen brukes i denne siden — hent hva som faktisk finnes.
      const existing = await listAll(config.table);
      existing.forEach(r => { if (r.fields['AppId']) cache[r.fields['AppId']] = r.id; });
    }
    const incomingIds = new Set(arr.map(x => x.id));
    const toCreate = [], toUpdate = [], toDeleteIds = [];
    arr.forEach(item => {
      const fields = toAirtableFields(config, item);
      if (cache[item.id]) toUpdate.push([cache[item.id], fields]);
      else toCreate.push({ item, fields });
    });
    Object.keys(cache).forEach(appId => { if (!incomingIds.has(appId)) toDeleteIds.push(cache[appId]); });

    if (toUpdate.length) await batchUpdate(config.table, toUpdate);
    if (toDeleteIds.length) { await batchDelete(config.table, toDeleteIds); Object.keys(cache).forEach(id => { if (toDeleteIds.includes(cache[id])) delete cache[id]; }); }
    if (toCreate.length) {
      // Airtables opprett-svar gir oss de nye rad-IDene i samme rekkefølge tilbake.
      for (const part of chunk(toCreate, 10)) {
        const res = await airtableFetch('/' + encodeURIComponent(config.table), {
          method: 'POST',
          body: JSON.stringify({ records: part.map(p => ({ fields: p.fields })) })
        });
        res.records.forEach((r, i) => { cache[part[i].item.id] = r.id; });
      }
    }
  }

  async function readList(key) {
    const config = LIST_TABLES[key];
    const cache = cacheFor(config.table);
    const records = await listAll(config.table);
    Object.keys(cache).forEach(k => delete cache[k]);
    records.forEach(r => { if (r.fields['AppId']) cache[r.fields['AppId']] = r.id; });
    return records.map(r => fromAirtableFields(config, r));
  }

  // ---- Enkeltverdier og bilder: én rad per nøkkel i Settings/Photos ----
  async function readSettingsRow(table, keyFieldValue) {
    const cache = cacheFor(table);
    if (Object.keys(cache).length === 0) {
      const existing = await listAll(table);
      existing.forEach(r => { if (r.fields['Key']) cache[r.fields['Key']] = r.id; });
    }
    if (!cache[keyFieldValue]) return null;
    const records = await listAll(table);
    const match = records.find(r => r.fields['Key'] === keyFieldValue);
    return match ? match.fields['Value'] : null;
  }
  async function writeSettingsRow(table, keyFieldValue, value) {
    const cache = cacheFor(table);
    if (Object.keys(cache).length === 0) {
      const existing = await listAll(table);
      existing.forEach(r => { if (r.fields['Key']) cache[r.fields['Key']] = r.id; });
    }
    if (cache[keyFieldValue]) {
      await airtableFetch('/' + encodeURIComponent(table) + '/' + cache[keyFieldValue], {
        method: 'PATCH', body: JSON.stringify({ fields: { Value: value } })
      });
    } else {
      const res = await airtableFetch('/' + encodeURIComponent(table), {
        method: 'POST', body: JSON.stringify({ records: [{ fields: { Key: keyFieldValue, Value: value } }] })
      });
      cache[keyFieldValue] = res.records[0].id;
    }
  }
  async function deleteSettingsRow(table, keyFieldValue) {
    const cache = cacheFor(table);
    if (!cache[keyFieldValue]) return false;
    await airtableFetch('/' + encodeURIComponent(table) + '/' + cache[keyFieldValue], { method: 'DELETE' });
    delete cache[keyFieldValue];
    return true;
  }

  // ---- Offentlig grensesnitt: get/set/delete/list (uendret fra før) ----
  async function get(key, shared) {
    try {
      if (LIST_TABLES[key]) {
        const arr = await readList(key);
        return { key, value: JSON.stringify(arr), shared: !!shared };
      }
      if (key.startsWith('photo:')) {
        const v = await readSettingsRow('Photos', key);
        return v === null ? null : { key, value: v, shared: !!shared };
      }
      // theme-preference og andre enkeltnøkler → Settings-tabellen
      const v = await readSettingsRow('Settings', key);
      return v === null ? null : { key, value: v, shared: !!shared };
    } catch (e) {
      console.error('[storage.airtable.get] Feilet for', key, e);
      throw e;
    }
  }
  async function set(key, value, shared) {
    try {
      if (LIST_TABLES[key]) {
        const arr = value ? JSON.parse(value) : [];
        await reconcileList(key, arr);
      } else if (key.startsWith('photo:')) {
        await writeSettingsRow('Photos', key, value);
      } else {
        await writeSettingsRow('Settings', key, value);
      }
      console.log('[storage.airtable.set] OK', { key, byteLength: value ? value.length : 0 });
      return { key, value, shared: !!shared };
    } catch (e) {
      console.error('[storage.airtable.set] KLARTE IKKE Å SKRIVE', { key, error: e && e.message });
      throw e;
    }
  }
  async function del(key, shared) {
    try {
      if (key.startsWith('photo:')) {
        const existed = await deleteSettingsRow('Photos', key);
        return { key, deleted: existed, shared: !!shared };
      }
      const existed = await deleteSettingsRow('Settings', key);
      return { key, deleted: existed, shared: !!shared };
    } catch (e) {
      console.error('[storage.airtable.delete] Feilet for', key, e);
      throw e;
    }
  }
  async function list(prefix, shared) {
    // Brukes ikke aktivt av appen i dag — holdt for grensesnittkompatibilitet.
    return { keys: [], prefix, shared: !!shared };
  }

  window.storage = { get, set, delete: del, list };

  // ---- Tilnærmet sanntidsoppdatering: periodisk oppfrisking ----
  // Airtables vanlige REST-API har INGEN push/sanntids-abonnement slik Firestore
  // hadde (det finnes Airtable Webhooks, men de krever en egen server å motta
  // kall på — utenfor denne appens omfang som en ren, statisk side). Denne
  // funksjonen tilnærmer sanntid ved å friske opp datasettene med jevne
  // mellomrom i stedet — se AIRTABLE_MIGRATION.md for dette forbeholdet i
  // klartekst. Standard: hvert 45. sekund (satt bevisst rolig, ikke aggressivt,
  // siden index.html i tillegg lar være å tegne siden på nytt mens noen fyller
  // ut et skjema — se subscribeLiveSync-kallet i loadAll()). Airtables
  // gratisnivå tillater 5 kall/sekund per base, så ikke sett dette (eller
  // antall åpne faner/enheter) for lavt uten å vurdere antall samtidige brukere.
  const POLL_INTERVAL_MS = 45000;
  window.subscribeLiveSync = function (onRemoteChange) {
    setInterval(() => {
      if (document.hidden) return; // ikke poll når fanen ikke er aktiv
      Object.keys(LIST_TABLES).forEach((key) => {
        onRemoteChange(key);
      });
    }, POLL_INTERVAL_MS);
  };
})();
