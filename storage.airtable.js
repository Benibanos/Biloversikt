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

  // ================= Prioritet 31: Timeout på nettverkskall (regresjonsfiks) =================
  // KRITISK FEIL (Prioritet 31 — regresjon introdusert av Prioritet 29 sin skrivekø,
  // _koKjor under): fetch() hadde ingen timeout. På en ustabil mobilforbindelse (typisk
  // situasjon for en sjåfør i en bil) kunne én enkelt hengende forespørsel aldri avgjøres
  // (verken lykkes eller feile). Før Prioritet 29 påvirket dette kun DEN ene handlingen.
  // Etter Prioritet 29 kjeder _koKjor alle set()/delete()-kall mot SAMME ressurs (f.eks.
  // Vehicles/DriverChecks) bak hverandre med .then() — og en .then()-kjede venter for
  // alltid på en forgjenger som aldri avgjøres. Resultatet var at ÉN hengende skriving
  // (f.eks. fra dårlig dekning ved en tidligere kontroll) låste ALLE senere sjåførkontroller
  // for samme bil/tabell i samme åpne fane, uten feilmelding, uten bekreftelse, uten
  // lagring — se CLAUDE.md/ROADMAP.md for full beskrivelse av regresjonen. Løsning: enhver
  // forespørsel som ikke har fått svar innen TIMEOUT_MS avbrytes eksplisitt (AbortController)
  // og forkastes med en tydelig feil, slik at den alltid AVGJØRES — og _koKjor sin kø dermed
  // alltid kan fortsette til neste operasjon, uansett hvor dårlig forbindelsen er.
  const AIRTABLE_TIMEOUT_MS = 20000;
  async function airtableFetch(path, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT_MS);
    let res;
    try {
      res = await fetch(API_BASE + path, Object.assign({ headers: HEADERS, signal: controller.signal }, options || {}));
    } catch (e) {
      if (e && e.name === 'AbortError') {
        throw new Error('Ingen svar fra Airtable innen ' + (AIRTABLE_TIMEOUT_MS / 1000) + ' sekunder (' + path + '). Sjekk nettforbindelsen og prøv igjen.');
      }
      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
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
      km: ['KM', 'num'], loyvenummer: ['Løyvenummer'], hasPhoto: ['HasPhoto', 'bool'],
      sommerdekkDot: ['SommerdekkDot'], sommerdekkKommentar: ['SommerdekkKommentar'],
      vinterdekkDot: ['VinterdekkDot'], vinterdekkKommentar: ['VinterdekkKommentar'],
      // Lagt til — disse feltene fantes på kjøretøy-objektet i index.html, men var ALDRI
      // registrert her, og ble derfor stille forkastet ved hver lagring/henting (se
      // toAirtableFields()/fromAirtableFields(), som kun håndterer felt listet i denne
      // konfigurasjonen). Årsaken til at Serviceintervall/EU-kontroll ikke persisterte —
      // og samme rotårsak rammet trolig også Ute av drift og Aktiv sjåfør uten at det var
      // oppdaget ennå.
      serviceIntervallKm: ['ServiceIntervallKm', 'num'],
      euGodkjentTil: ['EuGodkjentTil'],
      aktivSjafor: ['AktivSjafor'],
      aktivSjaforSiden: ['AktivSjaforSiden'],
      uteAvDrift: ['UteAvDrift', 'bool'],
      uteAvDriftArsak: ['UteAvDriftArsak'],
      uteAvDriftDato: ['UteAvDriftDato'],
      uteAvDriftKommentar: ['UteAvDriftKommentar'],
      statusHistorikk: ['StatusHistorikk', 'json'],
      // Prioritet 27.1 (Driftslag i Sjåførkontroll) — fritekstfelt, styrer kun gruppering
      // av bilvalg på Kontroll-skjermen, ingen annen betydning i appen for øvrig.
      driftslag: ['Driftslag'],
      // PRIORITET 37 (Dashboard 4.0 / Kjøretøyprofil 4.0) — to nye felt på kjøretøyet,
      // registrert her SAMTIDIG som de tas i bruk i index.html (FELTREGELEN i CLAUDE.md).
      // Uten denne registreringen ville begge forsvunnet stille ved neste henting fra
      // Airtable — nøyaktig samme feil som rammet ServiceIntervallKm/EuGodkjentTil/
      // AktivSjafor/Driftslag tidligere.
      //   drivstoff        — fast verdiliste i appen (diesel/bensin/elektrisk/hybrid/hvo/annet),
      //                      lagret som ren tekst her slik at Airtable-feltet kan være
      //                      singleLineText (opprettes automatisk av Database status).
      //   mobilitetsgaranti — fritekst, brukes operativt ved havari/veihjelp.
      drivstoff: ['Drivstoff'],
      mobilitetsgaranti: ['Mobilitetsgaranti'],
      // PRIORITET 45 (📞 Ringeliste, Innstillinger → 👤 Sjåførside) — fritekst telefonnummer
      // registrert på kjøretøyet, brukt av Min Bil sin «📞 Ringeliste» hos sjåførene
      // (tel:-lenke). Registrert her SAMTIDIG som feltet tas i bruk i index.html
      // (FELTREGELEN i CLAUDE.md) — uten dette ville det forsvunnet stille ved neste
      // Airtable-henting, nøyaktig samme feilmønster som rammet feltene over historisk.
      telefon: ['Telefon']
    }},
    damages: { table: 'Damages', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], dato: ['Dato'], beskrivelse: ['Beskrivelse'],
      alvorlighet: ['Alvorlighet'], kommentar: ['Kommentar'], status: ['Status'], registrertAv: ['RegistrertAv'],
      hasPhoto: ['HasPhoto', 'bool'], createdByControlId: ['CreatedByControlId'], estimertKostnad: ['EstimertKostnad', 'num']
    }},
    verkstedtimer: { table: 'WorkshopAppointments', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], verksted: ['Verksted'], dato: ['Dato'], tidspunkt: ['Tidspunkt'],
      beskrivelse: ['Beskrivelse'], notater: ['Notater'], pris: ['Pris', 'num'],
      sakId: ['SakId'], caseId: ['CaseId'], kontaktperson: ['Kontaktperson'], telefon: ['Telefon'],
      // Lagt til i Prioritet 26.7 — samme lærdom som ServiceIntervallKm/EuGodkjentTil
      // tidligere: et nytt JS-felt som IKKE registreres her forsvinner stille ved neste
      // henting fra Airtable. RETTELSE (Prioritet 29, Del 10): planlagt service lagres
      // IKKE som en verkstedtime med type='service' — det er en helt separat array/
      // Settings-nøkkel (planlagteServicer, se index.html). Dette 'type'-feltet er derfor
      // ikke i aktiv bruk i dagens kode (ingen kallested setter eller leser det), men
      // beholdes urørt i skjemaet siden felt ikke fjernes uten eksplisitt instruks.
      type: ['Type']
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
    dekkhistorikk: { table: 'TireChanges', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], dato: ['Dato'], retning: ['Retning'], kommentar: ['Kommentar']
    }},
    dekkkostnader: { table: 'TireCosts', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], dato: ['Dato'], kostnad: ['Kostnad', 'num'], kommentar: ['Kommentar']
    }},
    aktiveSaker: { table: 'AktiveSaker', fields: {
      id: ['AppId'], caseId: ['CaseId'], vehicleId: ['VehicleId'], registrationNumber: ['RegistrationNumber'],
      caseType: ['CaseType'], title: ['Title'], description: ['Description'], status: ['Status'],
      priority: ['Priority'], sourceType: ['SourceType'], sourceId: ['SourceId'], reportedBy: ['ReportedBy'],
      reportedAt: ['ReportedAt'], assignedTo: ['AssignedTo'], nextAction: ['NextAction'],
      followUpDate: ['FollowUpDate'], resolvedAt: ['ResolvedAt'], resolvedBy: ['ResolvedBy'],
      resolutionNote: ['ResolutionNote'], createdAt: ['CreatedAt'], updatedAt: ['UpdatedAt'],
      reportCount: ['ReportCount', 'num'], lastReportedAt: ['LastReportedAt'], historikk: ['Historikk', 'json'],
      linkedVtId: ['LinkedVtId'], verkstedResultat: ['VerkstedResultat'], completedAt: ['CompletedAt'],
      estimatedCost: ['EstimatedCost', 'num'], actualCost: ['ActualCost', 'num'],
      requiresProvision: ['RequiresProvision', 'bool'], provisionAmount: ['ProvisionAmount', 'num'],
      provisionMonth: ['ProvisionMonth']
    }},
  };
  // Enkeltverdier (ikke lister) lagres som én rad hver i Settings-tabellen, med
  // Key = nøkkelnavnet og Value = selve verdien (tekst) — dette gjelder
  // theme-preference, verksteder, servicehistorikk og planlagteservicer (se
  // get()/set()/del() under: alt som ikke er en LIST_TABLES-nøkkel eller har
  // "photo:"-prefiks, går automatisk til denne Settings-tabellen).

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

  // ================= Prioritet 29: Serialisert skrivekø per ressurs =================
  // Løser race condition rundt reconcileList()/recordIdCache (se "BILPARK – FULL
  // TEKNISK REVISJON", Kritisk feil 3): to samtidige set()/delete()-kall mot SAMME
  // underliggende Airtable-tabell (eller samme Settings/Photos-nøkkel) kunne før lese
  // og skrive den delte recordIdCache-en samtidig — med fare for dupliserte rader
  // eller en tapt oppdatering (siste skriving vinner uten varsel). Løsningen er en
  // enkel, liten per-ressurs-kø: hvert kall kjeder seg bak forrige kall for SAMME
  // ressursnøkkel, mens ulike tabeller/nøkler fortsatt kjører uavhengig av hverandre.
  // En feil i én operasjon stopper ALDRI køen for senere operasjoner for samme nøkkel
  // (se .catch(()=>{}) i _koKjor under) — permanent låsing etter én feilet skriving
  // er eksplisitt uønsket.
  //
  // PRIORITET 43 (2026-09-09) — UTVIDET til også å serialisere get() (regresjonsfiks,
  // km fulgte ikke alltid siste sjåførkontroll): frem til nå gikk KUN set()/delete()
  // gjennom denne køen — get() leste Airtable direkte, helt UAVHENGIG av om en
  // set()/delete() mot SAMME ressurs allerede sto og ventet i køen eller pågikk. Se
  // CLAUDE.md "Prioritet 43" og PRIORITET_43_ANALYSE.md for full rotårsaksanalyse —
  // kort fortalt: window.subscribeLiveSync() sin bakgrunnspoll (index.html,
  // reloadOne()) kaller get('vehicles') hvert 45. sekund, HELT uavhengig av om
  // submitKontroll() (eller saveVehicleForm()/resetFleetData()/
  // performKontrollDeletion()) akkurat da står midt i en IKKE FERDIG set('vehicles').
  // Vant pollens get() denne racen (dvs. Airtable-svaret på GET kom tilbake FØR den
  // pågående PATCH-en faktisk var forpliktet), fikk index.html sin
  // reloadOne('vehicles') en GAMMEL kilometerstand tilbake og erstattet HELE det
  // lokale `vehicles`-arrayet med den (ubetinget `vehicles = parsed`) — inkludert på
  // det kjøretøyet en sjåfør akkurat hadde registrert ny km på. Den faktiske
  // Airtable-raden ble likevel korrekt til slutt (selve PATCH-en var uberørt av
  // dette — den var allerede underveis med riktig verdi), men det lokale, viste
  // bildet i appen (Kjøretøyprofil/Dashboard/Min bil) sto igjen med feil tall helt
  // til NESTE pollrunde (opptil 45 sekunder senere) tilfeldigvis traff etter at
  // skrivingen var ferdig. Løsning: get() sendes nå gjennom SAMME _koKjor()-kø, med
  // SAMME ressursnøkkel (_ressursNokkelForKey()), som set()/delete() allerede brukte.
  // Dermed kan en lesing mot en gitt tabell/Settings-rad ALDRI lenger starte midt i en
  // ikke-fullført skriving mot akkurat den ressursen — den kjøres enten helt FØR
  // skrivingen starter, eller helt ETTER den er ferdig (og dermed alltid med riktig,
  // ferdig committed data). Andre, ubeslektede tabeller/nøkler er fortsatt helt
  // uavhengige køer, akkurat som før — denne endringen påvirker kun rekkefølgen
  // INNENFOR samme ressurs, ikke mellom ulike ressurser.
  const _skriveKoer = {}; // { [ressursNokkel]: Promise }
  function _ressursNokkelForKey(key) {
    if (LIST_TABLES[key]) return 'table:' + LIST_TABLES[key].table;
    if (key.startsWith('photo:')) return 'settingsrad:Photos:' + key;
    return 'settingsrad:Settings:' + key;
  }
  function _koKjor(ressursNokkel, oppgave) {
    const forrige = _skriveKoer[ressursNokkel] || Promise.resolve();
    // .catch(()=>{}) er bevisst på LENKEN (ikke på verdien vi returnerer til kalleren)
    // — den hindrer kun at en tidligere feilet operasjon stopper NESTE operasjon i
    // køen. Selve feilen forplanter seg fortsatt korrekt til kalleren av denne
    // oppgaven via .then(oppgave), se under.
    const naaverende = forrige.catch(() => {}).then(oppgave);
    _skriveKoer[ressursNokkel] = naaverende.catch(() => {});
    return naaverende;
  }

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

  // ---- Offentlig grensesnitt: get/set/delete/list (uendret utad — samme kall,
  // samme returverdier — kun get() sin INTERNE synkronisering er endret, se Prioritet
  // 43-kommentaren ved _koKjor over) ----
  async function get(key, shared) {
    // PRIORITET 43: get() serialiseres nå gjennom SAMME per-ressurs-kø som set()/
    // delete() (se _koKjor over) — en lesing kan dermed aldri lenger starte midt i en
    // ikke-fullført skriving mot akkurat denne tabellen/Settings-raden, og leser derfor
    // alltid enten helt FØR eller helt ETTER en pågående skriving, aldri et tilstand
    // midt i mellom.
    return _koKjor(_ressursNokkelForKey(key), async () => {
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
    });
  }
  async function set(key, value, shared) {
    // Prioritet 29: serialisert per ressurs (tabell/Settings-rad), se _koKjor over —
    // hindrer at to samtidige set()-kall mot SAMME tabell/rad kan krysse hverandre.
    // Prioritet 43: samme kø brukes nå også av get() over, slik at lesing og skriving
    // mot samme ressurs aldri lenger kan overlappe.
    return _koKjor(_ressursNokkelForKey(key), async () => {
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
    });
  }
  async function del(key, shared) {
    // Prioritet 29: samme serialisering som set() — se _koKjor over.
    return _koKjor(_ressursNokkelForKey(key), async () => {
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
    });
  }
  async function list(prefix, shared) {
    // Brukes ikke aktivt av appen i dag — holdt for grensesnittkompatibilitet.
    return { keys: [], prefix, shared: !!shared };
  }

  window.storage = { get, set, delete: del, list };
  // Versjonsmarkør — gjør det mulig å bekrefte DIREKTE I APPEN (Innstillinger →
  // Database status) om filen som faktisk kjører er den oppdaterte versjonen, i stedet
  // for å måtte gjette om en opplasting/service worker-cache faktisk slo gjennom. VIKTIG:
  // øk STORAGE_AIRTABLE_VERSION ved HVER fremtidige endring i denne filen (også i
  // script-taggens ?v=-parameter i index.html, se <head>) — det er selve
  // versjonsøkningen, ikke datoen alene, som tvinger nettlesere/service workers til å
  // hente en fersk kopi i stedet for en cachet, gammel en.
  window.storageAirtableInfo = {
    versjon: 'v2.11.0',
    bygget: '10.09.2026 06:00',
    vehiclesFelt: Object.keys(LIST_TABLES.vehicles.fields)
  };

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
  // PRIORITET 43: get()-kallene denne funksjonen trigger (via index.html sin
  // reloadOne()) går nå gjennom samme per-ressurs-kø som skrivinger (se _koKjor
  // over) — pollen kan derfor aldri lenger lese en tabell midt i en ikke-fullført
  // skriving mot akkurat den tabellen.
  const POLL_INTERVAL_MS = 45000;
  window.subscribeLiveSync = function (onRemoteChange) {
    setInterval(() => {
      if (document.hidden) return; // ikke poll når fanen ikke er aktiv
      Object.keys(LIST_TABLES).forEach((key) => {
        onRemoteChange(key);
      });
    }, POLL_INTERVAL_MS);
  };

  // ================= Database status: skjemavalidering mot Airtable =================
  // Bruker Airtables METADATA-API (et helt annet API-endepunkt enn resten av
  // denne filen — https://api.airtable.com/v0/meta/... i stedet for /v0/...),
  // som kan lese OG endre selve tabell-/feltstrukturen i basen, ikke bare
  // radene. Krever at Personal Access Token har scopene "schema.bases:read"
  // (for å sjekke) og "schema.bases:write" (for å opprette manglende
  // tabeller/felt automatisk) — se AIRTABLE_MIGRATION.md. Uten disse scopene
  // vil sjekken fortsatt fungere for LESING dersom kun schema.bases:read er
  // gitt, men "Synkroniser"-knappen vil feile med en tydelig feilmelding.
  const META_BASE = 'https://api.airtable.com/v0/meta/bases/' + AIRTABLE_CONFIG.baseId;
  async function metaFetch(path, options) {
    const res = await fetch(META_BASE + path, Object.assign({ headers: HEADERS }, options || {}));
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const err = new Error('Airtable metadata-API-feil ' + res.status + ' på ' + path + ': ' + body);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  // Forventet skjema — utledet direkte fra LIST_TABLES over, pluss Settings/
  // Photos (som ikke følger AppId-mønsteret, men lagrer nøkkel/verdi-rader).
  // Dette er bevisst ÉN kilde til sannhet: legger du et nytt felt i
  // LIST_TABLES for en fremtidig funksjon, plukkes det automatisk opp her.
  const EXPECTED_SCHEMA = {};
  Object.keys(LIST_TABLES).forEach((key) => {
    const cfg = LIST_TABLES[key];
    EXPECTED_SCHEMA[cfg.table] = Object.keys(cfg.fields).map((f) => {
      const [atName, kind] = cfg.fields[f];
      return { name: atName, kind: kind || 'text' };
    });
  });
  EXPECTED_SCHEMA['Settings'] = [{ name: 'Key', kind: 'text' }, { name: 'Value', kind: 'json' }];
  EXPECTED_SCHEMA['Photos'] = [{ name: 'Key', kind: 'text' }, { name: 'Value', kind: 'json' }];

  function airtableFieldType(kind) {
    if (kind === 'bool') return { type: 'checkbox', options: { icon: 'check', color: 'greenBright' } };
    if (kind === 'num') return { type: 'number', options: { precision: 0 } };
    if (kind === 'json') return { type: 'multilineText' };
    return { type: 'singleLineText' };
  }

  // Sammenligner forventet skjema mot det som faktisk finnes i Airtable akkurat
  // nå. Endrer INGENTING selv — kun lesing. Kalles automatisk ved oppstart
  // (se index.html) og på nytt av "🔄 Synkroniser Airtable"-knappen.
  window.checkAirtableSchema = async function () {
    let actualTables;
    try {
      const data = await metaFetch('/tables');
      actualTables = data.tables;
    } catch (e) {
      return {
        ok: false,
        error: (e.status === 401 || e.status === 403)
          ? 'Tokenet mangler tilgang til å lese databasestrukturen. Legg til scopet «schema.bases:read» (og «schema.bases:write» for automatisk oppretting) på Personal Access Token i Airtable — se AIRTABLE_MIGRATION.md.'
          : 'Kunne ikke hente databasestrukturen fra Airtable: ' + e.message,
        tables: []
      };
    }
    const byName = {};
    actualTables.forEach((t) => { byName[t.name] = t; });
    const report = { ok: true, error: null, checkedAt: Date.now(), tables: [] };
    Object.keys(EXPECTED_SCHEMA).forEach((tableName) => {
      const expectedFields = EXPECTED_SCHEMA[tableName];
      const actual = byName[tableName];
      if (!actual) {
        report.tables.push({ name: tableName, exists: false, missingFields: expectedFields.map((f) => f.name), airtableTableId: null });
        return;
      }
      const actualFieldNames = new Set(actual.fields.map((f) => f.name));
      const missingFields = expectedFields.filter((f) => !actualFieldNames.has(f.name)).map((f) => f.name);
      report.tables.push({ name: tableName, exists: true, missingFields, airtableTableId: actual.id });
    });
    return report;
  };

  // Oppretter manglende tabeller/felt automatisk der Airtables metadata-API
  // tillater det (krever schema.bases:write). Endrer den gitte rapporten i
  // stedet (fjerner det som ble fikset), og returnerer en logg over hva som
  // skjedde — inkludert eventuelle feil per tabell/felt, slik at ett mislykket
  // felt ikke stopper resten.
  window.autoFixAirtableSchema = async function (report) {
    const results = [];
    for (const t of report.tables) {
      if (!t.exists) {
        const fields = EXPECTED_SCHEMA[t.name].map((f) => Object.assign({ name: f.name }, airtableFieldType(f.kind)));
        try {
          const created = await metaFetch('/tables', { method: 'POST', body: JSON.stringify({ name: t.name, fields }) });
          results.push({ table: t.name, action: 'created-table', ok: true });
          t.exists = true; t.missingFields = []; t.airtableTableId = created.id;
        } catch (e) {
          results.push({ table: t.name, action: 'created-table', ok: false, error: e.message });
        }
        continue;
      }
      for (const fieldName of t.missingFields.slice()) {
        const spec = EXPECTED_SCHEMA[t.name].find((f) => f.name === fieldName);
        try {
          await metaFetch('/tables/' + t.airtableTableId + '/fields', {
            method: 'POST',
            body: JSON.stringify(Object.assign({ name: fieldName }, airtableFieldType(spec.kind)))
          });
          results.push({ table: t.name, field: fieldName, action: 'created-field', ok: true });
          t.missingFields = t.missingFields.filter((f) => f !== fieldName);
        } catch (e) {
          results.push({ table: t.name, field: fieldName, action: 'created-field', ok: false, error: e.message });
        }
      }
    }
    return results;
  };
})();
