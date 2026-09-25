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

  // ================= Timeout på nettverkskall =================
  // KRITISK: fetch() hadde ingen timeout. På en ustabil mobilforbindelse (typisk
  // situasjon for en sjåfør i en bil) kunne én enkelt hengende forespørsel aldri avgjøres
  // (verken lykkes eller feile). Isolert påvirket dette kun DEN ene handlingen — men
  // _koKjor (den serialiserte skrivekøen under) kjeder alle set()/delete()-kall mot SAMME
  // ressurs (f.eks. Vehicles/DriverChecks) bak hverandre med .then() — og en .then()-kjede
  // venter for alltid på en forgjenger som aldri avgjøres. Resultatet var at ÉN hengende
  // skriving (f.eks. fra dårlig dekning ved en tidligere kontroll) låste ALLE senere
  // sjåførkontroller for samme bil/tabell i samme åpne fane, uten feilmelding, uten
  // bekreftelse, uten lagring. Løsning: enhver
  // forespørsel som ikke har fått svar innen TIMEOUT_MS avbrytes eksplisitt (AbortController)
  // og forkastes med en tydelig feil, slik at den alltid AVGJØRES — og _koKjor sin kø dermed
  // alltid kan fortsette til neste operasjon, uansett hvor dårlig forbindelsen er.
  const AIRTABLE_TIMEOUT_MS = 20000;
  // ---- Prioritet 66.9 DEL 5: begrenset retry med økende ventetid ----
  // Et enkelt 429 fra Airtable (5 kall/sekund per base) var nok til å utløse
  // datahendelsen i september 2026: get('vehicles') kastet, loadAll() tolket det som
  // «tom tabell», og hele registeret ble re-seedet. Forbigående feil skal derfor
  // forsøkes på nytt et lite, FAST antall ganger før de blir en ekte lesefeil.
  // Retry KUN på det som faktisk er forbigående. 400/401/403/404 og skjemafeil
  // krever korrigering, ikke flere forsøk — de kastes umiddelbart.
  const RETRY_STATUS = [429, 500, 502, 503, 504];
  const RETRY_VENTETID_MS = [400, 1200, 3000];   // 3 nye forsøk etter det første
  const sov = (ms) => new Promise(r => setTimeout(r, ms));
  function retryVentetid(forsok, res) {
    // Respekter Retry-After når Airtable sender den (sekunder eller HTTP-dato).
    const h = res && res.headers && res.headers.get ? res.headers.get('Retry-After') : null;
    if (h) {
      const sek = Number(h);
      if (Number.isFinite(sek) && sek >= 0) return Math.min(sek * 1000, 10000);
      const dato = Date.parse(h);
      if (!Number.isNaN(dato)) return Math.min(Math.max(dato - Date.now(), 0), 10000);
    }
    return RETRY_VENTETID_MS[Math.min(forsok, RETRY_VENTETID_MS.length - 1)];
  }
  async function airtableFetch(path, options) {
    let sisteFeil = null;
    for (let forsok = 0; forsok <= RETRY_VENTETID_MS.length; forsok++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT_MS);
      let res;
      try {
        res = await fetch(API_BASE + path, Object.assign({ headers: HEADERS, signal: controller.signal }, options || {}));
      } catch (e) {
        clearTimeout(timeoutId);
        // Timeout og nettverksfeil er forbigående — forsøk på nytt.
        sisteFeil = (e && e.name === 'AbortError')
          ? new Error('Ingen svar fra Airtable innen ' + (AIRTABLE_TIMEOUT_MS / 1000) + ' sekunder (' + path + '). Sjekk nettforbindelsen og prøv igjen.')
          : e;
        sisteFeil.forbigaende = true;
        if (forsok < RETRY_VENTETID_MS.length) { await sov(retryVentetid(forsok, null)); continue; }
        throw sisteFeil;
      }
      clearTimeout(timeoutId);
      if (res.ok) return res.json();
      const body = await res.text().catch(() => '');
      const feil = new Error('Airtable-feil ' + res.status + ' på ' + path + ': ' + body);
      feil.status = res.status;
      if (RETRY_STATUS.indexOf(res.status) === -1) throw feil;   // 400/401/403/404 m.fl.
      feil.forbigaende = true;
      sisteFeil = feil;
      if (forsok < RETRY_VENTETID_MS.length) { await sov(retryVentetid(forsok, res)); continue; }
      throw feil;
    }
    throw sisteFeil || new Error('Airtable-feil på ' + path);
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
  // 'bool' = checkbox, 'num' = tall, 'select' = single select (verdien er en nøkkel
  // fra statusordboken, lagret som tekst). Uten type = ren tekst.
  //
  // Implementeringsfase 1B (skjemasynk): de 19 godkjente feltene fra AIRTABLE_MIGRATION.md,
  // «Del 1», er registrert med fase1B(). De er PLANLAGTE (aktiv:false): skjemasjekken ser dem
  // og «Opprett manglende Fase 1B-felt» kan opprette kolonnene, men toAirtableFields()/
  // fromAirtableFields() hopper over dem — vanlig lagring og lesing er nøyaktig som før, og
  // ingen raddata skrives. De aktiveres først av migreringskoden i fase 1B (egen godkjenning).
  // Valgene i single select er de lagrede NØKLENE fra statusordboken (beslutning 2026-09-26).
  function fase1B(atNavn, type, valg) {
    return [atNavn, type, { fase: '1B', aktiv: false, valg: valg || null }];
  }
  const FASE1B_VALG = {
    driftsstatus: ['aktiv', 'reserve', 'kan-ikke-brukes', 'utfaset'],
    utfasetArsak: ['solgt', 'vraket', 'leie-avsluttet', 'annet'],
    verkstedStatus: ['planlagt', 'bekreftet', 'pagar', 'utfort', 'avlyst', 'forfalt'],
    avlystArsak: ['ombooket', 'verksted-stengt', 'ikke-behov', 'utfaset', 'duplikat', 'annet'],
    skadetype: ['bulk-riper', 'glass', 'sidespeil', 'lys', 'dekk-felg', 'loftebord', 'bremser', 'styring', 'struktur', 'annet'],
    kanKjores: ['ja', 'usikker', 'nei'],
    alvorlighetKilde: ['sjafor', 'drift'],
    alvorlighet: ['lav', 'middels', 'hoy', 'kritisk'],
    tilgangsrolle: ['flateansvarlig', 'terminalleder', 'verkstedpartner', 'administrator', 'systemadministrator']
  };
  function feltErAktivt(spec) { return !(spec[2] && spec[2].aktiv === false); }
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
      // Driftslag: fritekstfelt, styrer kun gruppering
      // av bilvalg på Kontroll-skjermen, ingen annen betydning i appen for øvrig.
      driftslag: ['Driftslag'],
      // To felt på kjøretøyet, registrert her SAMTIDIG som de tas i bruk i index.html
      // (FELTREGELEN i CLAUDE.md).
      // Uten denne registreringen ville begge forsvunnet stille ved neste henting fra
      // Airtable — nøyaktig samme feil som rammet ServiceIntervallKm/EuGodkjentTil/
      // AktivSjafor/Driftslag tidligere.
      //   drivstoff        — fast verdiliste i appen (diesel/bensin/elektrisk/hybrid/hvo/annet),
      //                      lagret som ren tekst her slik at Airtable-feltet kan være
      //                      singleLineText (opprettes automatisk av Database status).
      //   mobilitetsgaranti — fritekst, brukes operativt ved havari/veihjelp.
      drivstoff: ['Drivstoff'],
      mobilitetsgaranti: ['Mobilitetsgaranti'],
      // 📞 Ringeliste (Innstillinger → 👤 Sjåførside): fritekst telefonnummer
      // registrert på kjøretøyet, brukt av Min Bil sin «📞 Ringeliste» hos sjåførene
      // (tel:-lenke). Registrert her SAMTIDIG som feltet tas i bruk i index.html
      // (FELTREGELEN i CLAUDE.md) — uten dette ville det forsvunnet stille ved neste
      // Airtable-henting, nøyaktig samme feilmønster som rammet feltene over historisk.
      telefon: ['Telefon'],
      // Prioritet 72.1: per-bil-innstilling for daglig, automatisk nullstilling av aktiv
      // sjåfør (se handhevAktivSjaforAutoReset() i index.html). aktivSjaforAutoReset er en
      // boolsk brukervalgt av/på-bryter (standard: kun Mercedes eSprinter er PÅ, alle andre
      // AV — se vehicleErMercedesESprinter()); aktivSjaforAutoResetTid er klokkeslettet
      // (standard "14:50"); aktivSjaforAutoResetSisteDato er en intern sporingsverdi (ISO-
      // dato for operativt døgn) som hindrer at samme bil nullstilles flere ganger samme
      // dag. Registrert her SAMTIDIG som feltene tas i bruk i index.html (FELTREGELEN).
      aktivSjaforAutoReset: ['AktivSjaforAutoReset', 'bool'],
      aktivSjaforAutoResetTid: ['AktivSjaforAutoResetTid'],
      aktivSjaforAutoResetSisteDato: ['AktivSjaforAutoResetSisteDato'],
      // Prioritet 67: servicenummer er verksted-/faktura-referanse — ikke serviceintervall.
      servicenummer: ['Servicenummer'],
      // Fase 1B (planlagt, se fase1B() over): driftsstatus etter statusordboken §1.
      driftsstatus: fase1B('Driftsstatus', 'select', FASE1B_VALG.driftsstatus),
      driftsstatusFra: fase1B('DriftsstatusFra', 'text'),
      utfasetDato: fase1B('UtfasetDato', 'text'),
      utfasetArsak: fase1B('UtfasetArsak', 'select', FASE1B_VALG.utfasetArsak)
    }},
    damages: { table: 'Damages', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], dato: ['Dato'], beskrivelse: ['Beskrivelse'],
      alvorlighet: ['Alvorlighet'], kommentar: ['Kommentar'], status: ['Status'], registrertAv: ['RegistrertAv'],
      hasPhoto: ['HasPhoto', 'bool'], createdByControlId: ['CreatedByControlId'], estimertKostnad: ['EstimertKostnad', 'num'],
      // Fase 1B (planlagt): skadetype, sjåførens svar og kilde for alvorlighet (damage-severity-framework.md).
      skadetype: fase1B('Skadetype', 'select', FASE1B_VALG.skadetype),
      kanKjores: fase1B('KanKjores', 'select', FASE1B_VALG.kanKjores),
      alvorlighetKilde: fase1B('AlvorlighetKilde', 'select', FASE1B_VALG.alvorlighetKilde),
      statusHistorikk: fase1B('StatusHistorikk', 'json')
    }},
    verkstedtimer: { table: 'WorkshopAppointments', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], verksted: ['Verksted'], dato: ['Dato'], tidspunkt: ['Tidspunkt'],
      beskrivelse: ['Beskrivelse'], notater: ['Notater'], pris: ['Pris', 'num'],
      sakId: ['SakId'], caseId: ['CaseId'], kontaktperson: ['Kontaktperson'], telefon: ['Telefon'],
      type: ['Type'],
      utfort: ['Utfort', 'bool'], utfortDato: ['UtfortDato'],
      // Prioritet 71.5: krysses av på en verkstedtime av typen 'service' — sier at DENNE
      // servicen skal forlenge kjøretøyets mobilitetsgaranti automatisk ved fullføring (se
      // fullforVerkstedbestilling()/vehicleMobilitetsgaranti() i index.html). Uavhengig av
      // det eldre, navnebaserte Mekonomen-signalet, som fortsatt gjelder som før.
      mobilitetsgarantiAktivert: ['MobilitetsgarantiAktivert', 'bool'],
      // Prioritet 59: dekkskift-bestillinger. `dekkRetning` er samme verdisett som
      // TireChanges.Retning ('sommer-vinter' = til vinterdekk, 'vinter-sommer' = til sommerdekk) og
      // leses ved fullføring (fullforVerkstedbestillinger()) for å oppdatere dekkstatus og dekkhistorikk
      // per bil. `bestillingGruppeId` er felles for bestillingene som ble opprettet samlet for flere
      // biler i ÉN handling («Velg flere biler») — ÉN rad per bil, aldri én rad med flere VehicleId —
      // og lar «Alle utført» fullføre dem samlet. Tom for alle vanlige enkeltbestillinger.
      dekkRetning: ['DekkRetning'], bestillingGruppeId: ['BestillingGruppeId'],
      // Fase 1B (planlagt): verkstedstatus og livsløp etter workshop-state-model.md.
      status: fase1B('Status', 'select', FASE1B_VALG.verkstedStatus),
      statusHistorikk: fase1B('StatusHistorikk', 'json'),
      bekreftetDato: fase1B('BekreftetDato', 'text'),
      bekreftetAv: fase1B('BekreftetAv', 'text'),
      levertDato: fase1B('LevertDato', 'text'),
      avlystDato: fase1B('AvlystDato', 'text'),
      avlystArsak: fase1B('AvlystArsak', 'select', FASE1B_VALG.avlystArsak),
      ombooketFraId: fase1B('OmbooketFraId', 'text'),
      akutt: fase1B('Akutt', 'bool')
    }},
    kontroller: { table: 'DriverChecks', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], dato: ['Dato'], tidspunkt: ['Tidspunkt'], sjafor: ['Sjafor'],
      km: ['KM', 'num'], varsellamper: ['Varsellamper', 'json'], annetTekst: ['AnnetTekst'],
      harNyeSkader: ['HarNyeSkader', 'bool'], skadeBeskrivelse: ['SkadeBeskrivelse'],
      skadeBilderCount: ['SkadeBilderCount', 'num'], kommentar: ['Kommentar'], linkedDamageId: ['LinkedDamageId'],
      // Les-status for kommentarfeltet over. Administrativt
      // felt, påvirker aldri Kontrollflyt/kilometerlogikk/bilstatus. Se markerKommentarSomLest().
      kommentarLest: ['KommentarLest', 'bool'],
      // Prioritet 71.10: resultat av driftskoordinatorens Godta/Avslå-behandling av et
      // bekreftet stort kilometerhopp (>= 1 000 km over km-gulvet). '' | 'godkjent' |
      // 'avvist'. Et 'avvist' hopp ekskluderes fra kontrollKmGulv() fremover, slik at en
      // feilregistrering ikke permanent blokkerer senere, korrekte kontroller. Se
      // godtaKmEndring()/avslaKmEndring() i index.html.
      kmGodkjenningStatus: ['KmGodkjenningStatus'],
      kmGodkjenningInfo: ['KmGodkjenningInfo']
    }},
    varsellys: { table: 'WarningLights', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], type: ['Type'], annetTekst: ['AnnetTekst'], status: ['Status'],
      registrertDato: ['RegistrertDato'], registrertAv: ['RegistrertAv'], kvittertDato: ['KvittertDato'],
      kvittertAv: ['KvittertAv'], createdByControlId: ['CreatedByControlId']
    }},
    'admin-users': { table: 'Users', fields: {
      id: ['AppId'], rolle: ['Rolle'], tittel: ['Tittel'], brukernavn: ['Brukernavn'], passord: ['Passord'],
      // Fase 1B (planlagt): tilgangsrolle (access-control-model.md). Tas i bruk i Sprint 2.
      tilgangsrolle: fase1B('Tilgangsrolle', 'select', FASE1B_VALG.tilgangsrolle)
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
      // Prioritet 59: `priority` er fjernet fra feltkartet. Airtable-kolonnen
      // AktiveSaker.Priority er BEVISST IKKE slettet — den står igjen som historisk
      // data, men leses og skrives ikke lenger av appen.
      sourceType: ['SourceType'], sourceId: ['SourceId'], reportedBy: ['ReportedBy'],
      reportedAt: ['ReportedAt'], assignedTo: ['AssignedTo'], nextAction: ['NextAction'],
      followUpDate: ['FollowUpDate'], resolvedAt: ['ResolvedAt'], resolvedBy: ['ResolvedBy'],
      resolutionNote: ['ResolutionNote'], createdAt: ['CreatedAt'], updatedAt: ['UpdatedAt'],
      reportCount: ['ReportCount', 'num'], lastReportedAt: ['LastReportedAt'], historikk: ['Historikk', 'json'],
      linkedVtId: ['LinkedVtId'], verkstedResultat: ['VerkstedResultat'], completedAt: ['CompletedAt'],
      estimatedCost: ['EstimatedCost', 'num'], actualCost: ['ActualCost', 'num'],
      requiresProvision: ['RequiresProvision', 'bool'], provisionAmount: ['ProvisionAmount', 'num'],
      provisionMonth: ['ProvisionMonth'],
      // KRITISK FELTRETTING (funnet ved verifisering av «Del 1/Del 2»): sak.avvik[] — selve
      // kjernedataen for flerpunkts-saker (hvert enkelt varsellampe-/
      // kontrollavvik-element i en sak, brukt av sakAvvikListe/sakAvvikAktive/
      // sakOppdaterStatusEtterAvvik/markerSakUtfort/sakAvvikChecklistHtml m.fl.) har ALDRI
      // vært registrert her. Følge: feltet ble stille droppet av toAirtableFields() ved
      // HVER lagring, og aldri gjenopprettet av fromAirtableFields() ved neste innlasting —
      // nøyaktig FELTREGEL-bruddet ("data forsvinner stille ved neste Airtable-synk").
      // Rettes nå. KREVER en ny kolonne "Avvik" (type: long text) i AktiveSaker-tabellen i
      // Airtable FØR denne filen tas i bruk — se leveransenotatet.
      avvik: ['Avvik', 'json'],
      // Prioritet 63: flerbilssak — saker som er ÉN sak for flere biler (én saksrad per bil, egen status/historikk/oppfølging
      // per kjøretøy) deler samme verdi her; tom for vanlige saker. KREVER en ny kolonne «SakGruppeId» (enkel tekst) i AktiveSaker
      // FØR denne filen tas i bruk — Database status → Synkroniser Airtable kan opprette den.
      sakGruppeId: ['SakGruppeId'],
      // Fase 1B (planlagt): sakens alvorlighet (høyeste av kildene, sakAlvorlighet() i index.html).
      alvorlighet: fase1B('Alvorlighet', 'select', FASE1B_VALG.alvorlighet)
    }},
    // Prioritet 49, Del 2: løftebordvedlikehold (smøring, sjåfør) og løftebordkontroll
    // (årlig, admin) — egen tabell, ALDRI blandet med aktiveSaker/kontroller. Ingen
    // "HarLoftebord"-felt på Vehicles: alle kjøretøy antas å ha løftebord (se CLAUDE.md,
    // Prioritet 49 Del 8). type er ENTEN 'kontroll' ELLER 'vedlikehold'.
    loftebordHistorikk: { table: 'LiftgateHistory', fields: {
      id: ['AppId'], vehicleId: ['VehicleId'], dato: ['Dato'], tidspunkt: ['Tidspunkt'],
      type: ['Type'], utfortAv: ['UtfortAv'], kommentar: ['Kommentar'],
      registreringskanal: ['Registreringskanal']
    }},
  };
  // Enkeltverdier (ikke lister) lagres som én rad hver i Settings-tabellen, med
  // Key = nøkkelnavnet og Value = selve verdien (tekst) — dette gjelder
  // theme-preference, verksteder, servicehistorikk og planlagteservicer (se
  // get()/set()/del() under: alt som ikke er en LIST_TABLES-nøkkel eller har
  // "photo:"-prefiks, går automatisk til denne Settings-tabellen).

  // Planlagte (ikke aktiverte) fase 1B-felt skrives og leses IKKE — se fase1B() over.
  function toAirtableFields(config, obj) {
    const out = {};
    Object.keys(config.fields).forEach(appField => {
      if (!feltErAktivt(config.fields[appField])) return;
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
      if (!feltErAktivt(config.fields[appField])) return;
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

  // ================= Serialisert skrivekø per ressurs =================
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
  // UTVIDET til også å serialisere get() (regresjonsfiks,
  // km fulgte ikke alltid siste sjåførkontroll): frem til nå gikk KUN set()/delete()
  // gjennom denne køen — get() leste Airtable direkte, helt UAVHENGIG av om en
  // set()/delete() mot SAMME ressurs allerede sto og ventet i køen eller pågikk. Se
  // se CLAUDE.md for full rotårsaksanalyse —
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

  // ---- Prioritet 66.9 DEL 4/9/11: masseslettingssperre for Vehicles ----
  // reconcileList() sletter enhver Airtable-rad hvis AppId ikke finnes i den innkommende
  // listen. Det er nøyaktig mekanismen som slettet hele kjøretøyregisteret i september
  // 2026. Terskler nedenfor gjelder BEVISST kun 'vehicles' — andre tabeller har andre
  // livssykluser og skal ikke få samme terskel uten egen analyse.
  const MASSESLETT_VAKT = {
    vehicles: {
      maksSlettinger: 3,        // 3 eller flere slettinger blokkeres
      maksSlettAndel: 0.20,     // 20 % eller mer av eksisterende rader blokkeres
      blokkerIdBytte: true      // flertallet av AppId-ene erstattet med nye blokkeres
    }
  };
  const vaktLogg = [];          // vises i Innstillinger → Database status
  window.storageVaktLogg = vaktLogg;
  function vurderReconcile(key, plan) {
    const regler = MASSESLETT_VAKT[key];
    if (!regler) return null;
    const { eksisterende, slettes, opprettes, oppdateres } = plan;
    const andel = eksisterende > 0 ? slettes / eksisterende : 0;
    if (slettes >= regler.maksSlettinger) {
      return 'Skrivingen ville slettet ' + slettes + ' av ' + eksisterende + ' kjøretøyrader (grense: ' + regler.maksSlettinger + ').';
    }
    if (eksisterende > 0 && andel >= regler.maksSlettAndel && slettes > 0) {
      return 'Skrivingen ville slettet ' + slettes + ' av ' + eksisterende + ' kjøretøyrader — ' + Math.round(andel * 100) + ' % (grense: ' + Math.round(regler.maksSlettAndel * 100) + ' %).';
    }
    // Flertallet av AppId-ene erstattet med nye — re-seedingens signatur, selv når
    // radantallet er omtrent uendret.
    if (regler.blokkerIdBytte && eksisterende > 0 && opprettes > 0 && oppdateres < eksisterende / 2) {
      return 'Skrivingen ville erstattet flertallet av AppId-ene (' + opprettes + ' nye, kun ' + oppdateres + ' av ' + eksisterende + ' gjenkjent). Dette er mønsteret fra re-seedingen.';
    }
    return null;
  }

  async function reconcileList(key, arr) {
    const config = LIST_TABLES[key];
    const cache = cacheFor(config.table);
    const vakt = MASSESLETT_VAKT[key];
    if (Object.keys(cache).length === 0) {
      // Første gang denne tabellen brukes i denne siden — hent hva som faktisk finnes.
      const existing = await listAll(config.table);
      existing.forEach(r => { if (r.fields['AppId']) cache[r.fields['AppId']] = r.id; });
    } else if (vakt) {
      // DEL 9: cachen kan være bygget FØR eksterne endringer (f.eks. en gjenoppretting
      // fra Airtable Trash mens appen sto åpen). En destruktiv operasjon skal aldri
      // bygge på en utdatert cache — hent fasit på nytt før vi regner ut konsekvensen.
      const ferske = await listAll(config.table);
      Object.keys(cache).forEach(k => delete cache[k]);
      ferske.forEach(r => { if (r.fields['AppId']) cache[r.fields['AppId']] = r.id; });
    }
    const incomingIds = new Set(arr.map(x => x.id));
    const toCreate = [], toUpdate = [], toDeleteIds = [];
    arr.forEach(item => {
      const fields = toAirtableFields(config, item);
      if (cache[item.id]) toUpdate.push([cache[item.id], fields]);
      else toCreate.push({ item, fields });
    });
    Object.keys(cache).forEach(appId => { if (!incomingIds.has(appId)) toDeleteIds.push(cache[appId]); });

    // Konsekvensen beregnes og vurderes FØR første PATCH, POST eller DELETE.
    const plan = {
      eksisterende: Object.keys(cache).length, innkommende: arr.length,
      opprettes: toCreate.length, oppdateres: toUpdate.length, slettes: toDeleteIds.length
    };
    const blokkering = vurderReconcile(key, plan);
    if (blokkering) {
      const oppf = {
        tidspunkt: new Date().toISOString(), ressurs: key, plan: plan, arsak: blokkering
      };
      vaktLogg.unshift(oppf);
      if (vaktLogg.length > 20) vaktLogg.length = 20;
      const feil = new Error('BLOKKERT av masseslettingssperren: ' + blokkering +
        ' Ingenting er skrevet eller slettet. Last siden på nytt og kontroller Airtable før du prøver igjen.');
      feil.blokkertAvVakt = true; feil.plan = plan;
      throw feil;   // kastes før enhver skriving
    }

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
  // samme returverdier — kun get() sin INTERNE synkronisering er endret, se
  // 43-kommentaren ved _koKjor over) ----
  async function get(key, shared) {
    // get() serialiseres nå gjennom SAMME per-ressurs-kø som set()/
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
    // Serialisert per ressurs (tabell/Settings-rad), se _koKjor over —
    // hindrer at to samtidige set()-kall mot SAMME tabell/rad kan krysse hverandre.
    // Samme kø brukes nå også av get() over, slik at lesing og skriving
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
    // Samme serialisering som set() — se _koKjor over.
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
    // Prioritet 61: leser alle Settings-rader hvis nøkkel starter med prefikset — i ÉN paginert
    // lesing, med verdiene (`items`), slik at administrator kan vise systemkontrollen til alle
    // sjåførenheter (én Settings-rad per enhet, `systemkontroll:<enhetId>`) uten ett kall per rad.
    // Kun lesing; røres ikke av skrivekøen. `keys` beholdes for bakoverkompatibilitet.
    const p = String(prefix || '');
    const rader = await listAll('Settings');
    const items = rader
      .filter(r => typeof r.fields['Key'] === 'string' && r.fields['Key'].indexOf(p) === 0)
      .map(r => ({ key: r.fields['Key'], value: r.fields['Value'] === undefined ? '' : r.fields['Value'] }));
    return { keys: items.map(i => i.key), items, prefix: p, shared: !!shared };
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
    versjon: 'v2.25.0',
    bygget: '26.09.2026 00:00',
    // v2.25.0 (Fase 1B skjemasynk): 19 planlagte fase 1B-felt i LIST_TABLES (skrives/leses ikke),
    // type 'select', skjemarapport med fase 1B/utsatte felt/typeavvik, oppretting kun med bekreftelse.
    // Prioritet 66.9: retry/backoff på forbigående Airtable-feil, masseslettingssperre
    // for Vehicles, og fersk lesing av cachen før enhver destruktiv Vehicles-reconcile.
    masseslettVakt: MASSESLETT_VAKT,
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
  // get()-kallene denne funksjonen trigger (via index.html sin
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
  // Fase 1B: hvert felt bærer `fase` ('1B' for de planlagte feltene) og `valg` (single select).
  const EXPECTED_SCHEMA = {};
  Object.keys(LIST_TABLES).forEach((key) => {
    const cfg = LIST_TABLES[key];
    EXPECTED_SCHEMA[cfg.table] = Object.keys(cfg.fields).map((f) => {
      const [atName, kind, opts] = cfg.fields[f];
      return { name: atName, kind: kind || 'text', fase: (opts && opts.fase) || null, valg: (opts && opts.valg) || null };
    });
  });
  EXPECTED_SCHEMA['Settings'] = [{ name: 'Key', kind: 'text', fase: null, valg: null }, { name: 'Value', kind: 'json', fase: null, valg: null }];
  EXPECTED_SCHEMA['Photos'] = [{ name: 'Key', kind: 'text', fase: null, valg: null }, { name: 'Value', kind: 'json', fase: null, valg: null }];

  // Utsatte felt (AIRTABLE_MIGRATION.md, «Del 2»). KUN for rapportering: de er ikke i
  // LIST_TABLES, telles aldri som manglende og opprettes aldri av skjemasynken.
  const UTSATTE_FELT = {
    'DriverChecks': ['Avvik', 'Enhet', 'OpprettetLokalt'],
    'Damages': ['Enhet', 'OpprettetLokalt', 'BildeAntall', 'BildeStatus'],
    'WorkshopAppointments': ['ForventetFerdig', 'WorkshopId'],
    'Vehicles': ['GarantiTil', 'GarantiMerke', 'Hjemmebase']
  };
  const UTSATTE_TABELLER = ['Workshops'];

  // Airtable-felttype per type i LIST_TABLES (brukes kun ved oppretting av felt). Datoer er
  // bevisst tekst (ISO-streng), som alle eksisterende datofelt i basen (beslutning 2026-09-26).
  function airtableFieldType(kindEllerSpec) {
    const kind = typeof kindEllerSpec === 'string' ? kindEllerSpec : (kindEllerSpec && kindEllerSpec.kind);
    if (kind === 'bool') return { type: 'checkbox', options: { icon: 'check', color: 'greenBright' } };
    if (kind === 'num') return { type: 'number', options: { precision: 0 } };
    if (kind === 'json') return { type: 'multilineText' };
    if (kind === 'select') {
      const valg = (kindEllerSpec && kindEllerSpec.valg) || [];
      return { type: 'singleSelect', options: { choices: valg.map((n) => ({ name: n })) } };
    }
    return { type: 'singleLineText' };
  }
  // Hvilke faktiske Airtable-typer som er forenlige med hver type i LIST_TABLES (for
  // rapportering av typeavvik — endres aldri automatisk).
  const FORENLIGE_TYPER = {
    text: ['singleLineText', 'multilineText', 'richText', 'email', 'url', 'phoneNumber'],
    json: ['multilineText', 'richText'],
    bool: ['checkbox'],
    num: ['number', 'currency', 'percent'],
    select: ['singleSelect']
  };

  // Logg over ALLE forsøk på skjemaendring i denne økten (vises i Database status).
  const skjemaLogg = [];
  window.storageSkjemaLogg = skjemaLogg;
  window.storageSkjemaInfo = {
    fase1B: Object.keys(EXPECTED_SCHEMA).reduce((liste, tabell) => liste.concat(
      EXPECTED_SCHEMA[tabell].filter((f) => f.fase === '1B').map((f) => ({ table: tabell, name: f.name, kind: f.kind, airtableType: airtableFieldType(f).type, valg: f.valg }))), []),
    utsatteFelt: UTSATTE_FELT,
    utsatteTabeller: UTSATTE_TABELLER,
    // Kopi (ikke referanse) av forventet skjema — kun til visning og test.
    forventet: JSON.parse(JSON.stringify(EXPECTED_SCHEMA))
  };

  // Sammenligner forventet skjema mot det som faktisk finnes i Airtable akkurat
  // nå. Endrer INGENTING selv — kun lesing (metadata-API, GET). Kalles i bakgrunnen
  // ved oppstart og av «Synkroniser nå» (som nå kun sjekker og viser forhåndsvisning).
  // Rapporten skiller (per tabell):
  //   existingFields   — forventede felt som finnes
  //   missingFields    — manglende EKSISTERENDE (ikke fase 1B) felt; opprettes ikke automatisk
  //   missingFase1B    — manglende fase 1B-felt {name, kind, airtableType, valg}; kan opprettes
  //   typeMismatches   — {field, expected, actual, detail}; kun rapport
  //   deferredFields   — utsatte Del 2-felt {name, exists}; aldri manglende, aldri opprettet
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
    const report = { ok: true, error: null, checkedAt: Date.now(), tables: [], deferredTables: [] };
    const fase1BSpec = (f) => ({ name: f.name, kind: f.kind, airtableType: airtableFieldType(f).type, valg: f.valg });
    Object.keys(EXPECTED_SCHEMA).forEach((tableName) => {
      const expectedFields = EXPECTED_SCHEMA[tableName];
      const actual = byName[tableName];
      const utsatte = UTSATTE_FELT[tableName] || [];
      if (!actual) {
        report.tables.push({
          name: tableName, exists: false, airtableTableId: null, existingFields: [],
          missingFields: expectedFields.filter((f) => f.fase !== '1B').map((f) => f.name),
          missingFase1B: expectedFields.filter((f) => f.fase === '1B').map(fase1BSpec),
          typeMismatches: [], deferredFields: utsatte.map((n) => ({ name: n, exists: false }))
        });
        return;
      }
      const actualByName = {};
      actual.fields.forEach((f) => { actualByName[f.name] = f; });
      const existingFields = [], missingFields = [], missingFase1B = [], typeMismatches = [];
      expectedFields.forEach((f) => {
        const a = actualByName[f.name];
        if (!a) {
          if (f.fase === '1B') missingFase1B.push(fase1BSpec(f));
          else missingFields.push(f.name);
          return;
        }
        existingFields.push(f.name);
        const forenlige = FORENLIGE_TYPER[f.kind] || FORENLIGE_TYPER.text;
        if (forenlige.indexOf(a.type) === -1) {
          typeMismatches.push({ field: f.name, expected: airtableFieldType(f).type, actual: a.type, detail: '' });
        } else if (f.kind === 'select' && f.valg) {
          const finnes = new Set(((a.options && a.options.choices) || []).map((c) => c.name));
          const mangler = f.valg.filter((v) => !finnes.has(v));
          if (mangler.length) typeMismatches.push({ field: f.name, expected: 'singleSelect', actual: a.type, detail: 'Mangler valg: ' + mangler.join(', ') });
        }
      });
      report.tables.push({
        name: tableName, exists: true, airtableTableId: actual.id,
        existingFields, missingFields, missingFase1B, typeMismatches,
        deferredFields: utsatte.map((n) => ({ name: n, exists: !!actualByName[n] }))
      });
    });
    UTSATTE_TABELLER.forEach((n) => report.deferredTables.push({ name: n, exists: !!byName[n] }));
    return report;
  };

  // Oppretter KUN manglende fase 1B-felt fra rapporten (report.tables[].missingFase1B), og
  // KUN når kalleren sender { bekreftet: true } etter at administrator har sett forhånds-
  // visningen og trykket «Opprett manglende Fase 1B-felt». Sikkerhetsregler:
  //   • bare POST mot metadata-API-ets /tables/{tabellId}/fields — aldri tabell-oppretting,
  //     aldri sletting, aldri omdøping, aldri typeendring, aldri rad-API (ingen raddata røres)
  //   • hvert forsøk logges (storageSkjemaLogg + konsoll); ett feilet felt stopper ikke resten
  //   • ingen automatisk nytt forsøk; en ny kjøring oppretter bare det som fortsatt mangler
  // Manglende EKSISTERENDE felt (report.tables[].missingFields) opprettes ikke herfra lenger.
  // Returnerer en liste {table, field, action:'created-field', ok, error, airtableType}.
  window.autoFixAirtableSchema = async function (report, valg) {
    if (!valg || valg.bekreftet !== true) {
      console.warn('[autoFixAirtableSchema] Avbrutt: mangler eksplisitt bekreftelse. Ingenting er endret.');
      return [];
    }
    const results = [];
    if (!report || !report.ok || !Array.isArray(report.tables)) return results;
    const logg = (r) => {
      skjemaLogg.unshift(Object.assign({ tidspunkt: new Date().toISOString() }, r));
      if (skjemaLogg.length > 100) skjemaLogg.length = 100;
      console.log('[autoFixAirtableSchema]', r.ok ? 'Opprettet' : 'FEILET', r.table + '.' + r.field, r.airtableType || '', r.error || '');
    };
    for (const t of report.tables) {
      const plan = Array.isArray(t.missingFase1B) ? t.missingFase1B.slice() : [];
      if (!plan.length) continue;
      if (!t.exists || !t.airtableTableId) {
        plan.forEach((f) => {
          const r = { table: t.name, field: f.name, action: 'created-field', ok: false, airtableType: f.airtableType,
            error: 'Tabellen finnes ikke i Airtable — skjemasynken oppretter ikke tabeller.' };
          results.push(r); logg(r);
        });
        continue;
      }
      for (const f of plan) {
        const spec = EXPECTED_SCHEMA[t.name].find((x) => x.name === f.name && x.fase === '1B');
        if (!spec) continue; // kun felt som faktisk er registrert som fase 1B
        const body = Object.assign({ name: spec.name }, airtableFieldType(spec));
        let r;
        try {
          await metaFetch('/tables/' + t.airtableTableId + '/fields', { method: 'POST', body: JSON.stringify(body) });
          r = { table: t.name, field: spec.name, action: 'created-field', ok: true, airtableType: body.type };
          t.missingFase1B = t.missingFase1B.filter((x) => x.name !== spec.name);
        } catch (e) {
          r = { table: t.name, field: spec.name, action: 'created-field', ok: false, airtableType: body.type, error: e.message };
        }
        results.push(r); logg(r);
      }
    }
    return results;
  };
})();
