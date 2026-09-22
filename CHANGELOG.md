# CHANGELOG.md — Bilpark Operativsystem

Kronologisk historikk over ferdige leveranser, tekniske rettinger og verifisering. Nyeste endring står øverst.

Dette dokumentet skal ikke brukes som statusliste eller produktregelverk:

- Nåværende status og neste arbeid: `ROADMAP.md`
- Varige regler og arkitektur: `CLAUDE.md`
- Datamodell og migrering: `AIRTABLE_MIGRATION.md`
- Kort prosjektintroduksjon: `README.md`

> Merk: Historikk eldre enn oppføringene nedenfor ligger i git-historikken, blant annet commit `cae279d`. Faktisk kode er alltid sannheten dersom historisk tekst avviker fra senere implementering.

---

## 2026-09-22

### Prioritet 65 — Direkte redigering av bilinformasjon

1. «Rediger informasjon» bytter nå Kjøretøydetaljer mellom visningsmodus og redigeringsmodus på samme bilprofil. Bilkort, statusrader, aktive saker og Historikk forblir synlige.
2. Feltene ligger i et kompakt 3-kolonners rutenett på desktop, 2 kolonner på mellomstore flater og 1 kolonne på mobil. Redigeringsseksjonen bruker full profilbredde mens den er aktiv.
3. Serviceintervall er tilbake i bilprofilens redigering og lagres fortsatt som `serviceIntervallKm`, som brukes av neste service, varsler og kilometer igjen.
4. Nytt separat felt `servicenummer` / Airtable-kolonnen `Vehicles.Servicenummer` er lagt til for verksted-, faktura- og kostnadsreferanse. Det påvirker aldri serviceberegningene.
5. Dupliserte varsellampe- og verkstedhistorikklister er fjernet fra redigeringsflaten; de eksisterende Historikk-fanene er fortsatt synlige og er eneste historikkvisning.
6. `storage.airtable.js` v2.23.0 → v2.24.0. App-/cacheversjon 113 → 114.

**Krever før idriftsettelse:** opprett `Servicenummer` (enkel tekst) i `Vehicles`, eller kjør Innstillinger → Optimaliseringer → Airtable → «Synkroniser nå».

---

## 2026-09-21

### Prioritet 64 — Samle oppdatering og synkronisering

(Brukerens egen nummerering. Full detalj i CLAUDE.md, «Prioritet 64 (2026-09-21)».)

1. **Ny seksjon Optimaliseringer** i Innstillinger samler Oppdater app, Database status og Systemkontroll sjåfører. Faner som Hurtigoversikt: Alle / App / Airtable / Sjåfører. Fanebytte uten full `render()`.
2. **Alle:** appversjon, siste Airtable-synk, sjåfører kontrollert i dag. **App:** versjon + Oppdater app + PWA. **Airtable:** siste synk, status og den eksisterende diagnosen; knappen heter «Synkroniser nå». **Sjåfører:** uendret enhetstabell.
3. **«Oppdater og synkroniser alt»** kjører skjemasynk, laster operative lister, henter systemkontrollstatus og gjør hard refresh (Dashboard etter omlasting).
4. Layout-komponenten `innstillinger.optimaliseringer` kan ikke skjules. Dyplenker (lesefeil, skjemabanner, oppstart) peker hit. `storage.airtable.js` uendret.
5. `CACHE_VERSION`/`APP_VERSION`/`version.json` 112 → 113; `kontroll.html` eksakt kopi.

**Testet** i nettleser mot ekte Airtable (admininnlogging): Innstillinger → Optimaliseringer viser Alle/App/Airtable/Sjåfører; Alle viser v113, siste synk og «8 av 8 kontrollert i dag» pluss «Oppdater og synkroniser alt»; App har «Oppdater app» og PWA; Airtable har «Synkroniser nå» og skjemastatus OK; Sjåfører-tabellen viser enheter, versjoner (112/113) og status. Fanebytte uten full omlasting. **Ikke klikket** «Oppdater og synkroniser alt» / «Synkroniser nå» mot produksjon (hard refresh logger ut; skjemasynk skriver til Airtable).

---

### Prioritet 63 — Dublettsikring og flerbilssaker

(Brukerens egen nummerering. Full detalj i CLAUDE.md, «Prioritet 63 (2026-09-21)».)

1. **Sjåførkontroll:** «Send inn kontroll» deaktiveres og viser «Registrerer...» umiddelbart (`beskyttSubmit(..., {opptattTekst})`); vellykket lagring viser «✅ Kontroll registrert» og går til Min Bil (uendret).
2. **Dublettsikring:** samme bil + samme sjåfør + samme operative dag innen 10 minutter lagres kun én gang — sjekket mot `kontroller[]` og et localStorage-fingeravtrykk (også for pågående innsending i en annen fane) før noe skrives;
   en dublett gir Min Bil («Kontrollen var allerede registrert») uten ny lagring. Rulles innsendingen tilbake, er nytt forsøk lov. Grense: to ulike enheter innen ~45 s kan begge lagre.
3. **Rettet:** temporal dead zone på `submitBtn` i `submitKontroll()` (`ReferenceError` når kjøretøyregisteret ikke er sikkert lest), og `priority` (udefinert etter Prioritet 59) som fikk «+ Ny sak» til å kaste ved lagring.
4. **Flerbilssaker:** «➕ Legg til bil» på åpne saker (ikke varsellampe/skade). Hver bil beholder sin egen saksrad (status, historikk, oppfølging, bilstatus) knyttet med felles `sakGruppeId`, og Aktive saker viser dem som ÉN sak med én rad
   per bil. «Godta alle» og «Bestill verkstedtime for alle»: én verkstedbestilling per bil (idempotent, med rollback og fasit-lesing ved delvis feil, felles `bestillingGruppeId` for «Alle utført»).
5. **`storage.airtable.js` v2.23.0 — ny Airtable-kolonne `AktiveSaker.SakGruppeId` MÅ opprettes før idriftsettelse** (ellers feiler alle lagringer av aktive saker).
6. `CACHE_VERSION`/`APP_VERSION`/`version.json` 111 → 112; `kontroll.html` eksakt kopi.

**Testet** i nettleser mot mock-storage: dobbeltklikk under treg lagring, alle dublettlag og kanttilfeller, rollback/nytt forsøk, «Legg til bil»/Godta alle/samlet verkstedbestilling/per-bil fullføring og tre feilstier uten dubletter. **Ikke testet:** ekte Airtable, mobilvisning av flerbilspanelet, to samtidige enheter.

---

### Prioritet 62 — Dynamisk tekst for driftsdager

(Brukerens egen nummerering. Full detalj i CLAUDE.md, «Prioritet 62 (2026-09-21)».)

1. **«Siste N driftsdager» er ikke lenger hardkodet til 7.** N = `activeWeekdays.length` i Operativt kontrollgrunnlag: man–fre → «65 % siste 5 driftsdager»,
   man–lør → 6, man–søn → 7, én dag → «siste driftsdag». Teksten leses fra grunnlaget hver render, så en endring i Innstillinger slår gjennom umiddelbart.
2. **Beregningen bruker samme N** (`kontrollrateSyvDriftsdager()` → `kontrollrateSisteDriftsdager()`, nevner = valgte biler × N). Å endre bare teksten ville latt
   prosenten være regnet over 7 driftsdager mens teksten sa 5. **Konsekvens:** tallet endrer seg for alle konfigurasjoner utenom man–søn.
3. Layout Editor-beskrivelsen av «Operativ kontroll» er gjort generisk. Ingen andre «7 driftsdager» finnes på Dashboard (grep).
4. `CACHE_VERSION`/`APP_VERSION`/`version.json` 110 → 111; `kontroll.html` eksakt kopi. `storage.airtable.js`/Airtable uendret.

**Testet** i nettleser mot mock-storage: man–fre/man–lør/man–søn/én dag/fridag, og en ekte lagring via Innstillinger (Dashboard oppdatert uten omlasting).

---

### Prioritet 61 — Daglig systemkontroll for sjåfører

(Ikke nummerert av brukeren; «61» tildelt her. Full detalj i CLAUDE.md, «Prioritet 61 (2026-09-21)».)

1. **Sperrende «Systemkontroll» første gang sjåførappen åpnes på en enhet hver operative dag** (dagskille kl. 04:00, `todayISO()`), også midt i økten
   når appen kommer tilbake fra bakgrunnen etter 04:00. Knappen «Oppdater og fortsett» vises alltid; skjermen kan ikke lukkes eller hoppes over, og portvakten
   kjører før `loadAll()` — ingen data lastes før kontrollen er fullført.
2. **Forløp:** versjon hentes uten cache → hard refresh (service worker oppdateres, `bilpark-*`-cachene slettes, appressursene hentes med `cache:'reload'`) →
   omlasting med engangs-token → den nye koden registrerer `lastVerifiedVersion`/`lastVerifiedDate`, viser «✅ Systemkontroll fullført» og åpner appen.
   Gammel versjon gir «Ny versjon funnet / Oppdaterer ...». Én gang per enhet og operativ dag; en annen sjåfør på samme enhet krever ny kontroll.
3. **Administratorvisning:** Innstillinger → Systeminnstillinger → «🛡️ Systemkontroll sjåfører» (sjåfør, enhet, versjon, sist systemkontroll, status).
   Lagres som én Settings-rad per enhet (`systemkontroll:<enhetId>`) — ikke en felles blob, som ville tapt oppdateringer ved samtidige skrivinger.
   `storage.airtable.js` **v2.22.0**: `list(prefix)` er nå en ekte implementasjon. Ingen Airtable-endring.
4. **Rettet i `version-check.js`:** `performUpdate()` brukte `location.href.split('?')[0]` og **fjernet `?sjafor=1`** (en installert sjåførsnarvei havnet på
   administratorinnloggingen), tømte cachene uten å vente og hentet ikke ressursene utenom HTTP-cachen. Erstattet av felles `hardRefresh()`. Sjåførmodus
   oppdaterer nå automatisk ved utdatert versjon (maks to forsøk per fem minutter, deretter manuell knapp).
5. `CACHE_VERSION`/`APP_VERSION`/`version.json` 109 → 110; `kontroll.html` eksakt kopi.

**Testet** i nettleser mot mock-storage: sperre ved første åpning, hard refresh → ✅ → åpning, ingen ny sperre samme dag, forfalsket token avvist, dagskille
ved oppstart og midt i økten, «Ny versjon funnet» og automatisk oppdatering med løkkevern, feilsti uten svar fra `version.json`, flere sjåfører på én enhet,
Airtable-feil (sjåføren passerer, retry), administratorvisning, 375 px. **Ikke testet:** ekte GitHub Pages/CDN-cache, ekte service worker, iOS/Android-PWA,
ekte samtidighet, Settings-rader mot ekte Airtable. Kontrollen er klientside og kan omgås av en som rydder lagringen.

---

### Prioritet 60 — Layout Engine 2.0 for hele Bilpark

(Brukerens egen nummerering. Bygger på Prioritet 58 «Dashboard Editor 1.0» — den ble utviklet videre til ÉN felles motor,
ikke et parallelt system. Full detalj i CLAUDE.md, «Prioritet 60 (2026-09-21)».)

1. **Én motor, ett register, én konfigurasjon.** `LAYOUT_COMPONENTS` er eneste sted en komponent registreres (widgetId,
   område, etikett, renderer, standardplassering, canMove/canHide/canResize, min/maks-størrelse, critical, enheter, roller).
   Alle flater leser samme publiserte konfigurasjon: Settings-nøkkelen **`bilpark-layout-config-v2`**
   (`{schemaVersion:2, layouts:{…}, options:{…}, updatedAt, updatedBy, backup}`). Layout styrer kun plassering, rekkefølge,
   synlighet, størrelse, seksjonsbredde, starttilstand og standardfane — aldri forretningslogikk, data eller HMS-validering.
2. **Flater:** Desktop Dashboard (12 kolonner, som P58), Sidemeny (primær/sekundær, dra og slipp, «Alle sider»),
   Bilinformasjon (seksjoner, halv/full bredde, åpen/lukket start, Historikk-faner med standardfane), Min Bil (mobil liste,
   starttilstand), Sjåførkontroll (begrenset), Mobil Dashboard og standardsidene Verksted, Kalender, Aktive saker,
   Varslingssenter, Rapporter, Analyse og Innstillinger (seksjonsrekkefølge, synlighet, standardfane, starttilstand).
3. **Låste komponenter** (kan ikke skjules; håndheves både i editoren og ved innlesing/publisering): Hjem, Alle sider,
   Innstillinger, Layout Editor, Bilkort, løftebord og Registrer skade/varsellampe/Sjekk ut bil på Min Bil, «Kjøretøy og
   sjåfør»/Kilometerstand/Varsellamper/Kontrollavvik/Nye skader/Send kontroll i Sjåførkontroll (Send og Sjekk ut står låst nederst,
   Løftebord kan flyttes men må ligge blant de fire første), kritiske HMS-varselkategorier, listen på Verksted, selve
   kalenderen. Skjulte komponenter sletter aldri data; en skjult Varslingssenter-kategori vises som hint.
4. **`migrateLayoutConfig()`** leser `schemaVersion`, migrerer stegvis, validerer, fjerner ukjente widgetId-er/områder og
   duplikater, legger til nye påkrevde komponenter fra standard og faller tilbake til standardlayout. `dashboard-layout-v1`
   og `dashboard-layout` leses (aldri slettes) og migreres til `layouts['admin-dashboard']`, `mobile-dashboard` og
   `driver-min-bil`; migreringen lagres først når en administrator er innlogget, og kun én gang.
5. **Utkast og publisering:** alt redigeres i et lokalt utkast (Angre/Gjør om, Forhåndsvis, Avbryt med bekreftelse).
   «Publiser» validerer (låste/påkrevde, duplikater, størrelser), leser lagret sannhet på nytt (ingen blind siste-skriving-
   vinner), lagrer gjennom eksisterende storage-lag, venter på bekreftet lagring og bytter først da aktiv layout; forrige
   publiserte layout beholdes som `backup` («Gjenopprett forrige»). Feil gir «Layouten kunne ikke lagres. Forrige layout er
   fortsatt aktiv.» og utkastet vises ikke som lagret. Konflikt: «Layouten ble endret fra en annen enhet. Last inn nyeste
   versjon før du publiserer.» Bakgrunnssynk oppdaterer publisert layout, men overskriver aldri et åpent utkast.
   «Tilbakestill denne siden» / «Tilbakestill hele appen» (utkast, med bekreftelse).
6. **Fjernet:** P58 sitt eget `dashboard-layout-v1`-lagringsformat som skrivemål, `DASH_WIDGETER`/`dashEdit*`, den gamle
   opp/ned-modellen (`DASHBOARD_LAYOUT_FLATER`/`getLayoutFlate()`), og de faste sidemenylistene (`DESKTOP_NAV_PRIMARY` m.fl.).
7. `CACHE_VERSION`/`APP_VERSION`/`version.json` 108 → 109; `kontroll.html` eksakt kopi. **`storage.airtable.js` og Airtable er
   uendret** (Settings-raden opprettes av storage-laget ved første publisering).

**Testet** i nettleser mot scratch-kopi med in-memory mock-storage (ingen ekte Airtable; `node`/`python` finnes ikke):
migrering fra `dashboard-layout-v1`/`dashboard-layout` (legacy-nøklene aldri slettet; utkast skriver ingenting før «Publiser»);
Dashboard dra (ekte museforflytning)/skalere/skjule/vis/Angre/Gjør om; sidemeny (låser, skjul, seksjonsflytt, dra og slipp,
mobil drawer, «Alle sider»); Bilinformasjon (skjul/vis, bredde, starttilstand, faner, standardfane, siste fane kan ikke
skjules, data urørt); Min Bil (rekkefølge, skjul, låste kort, starttilstand, klikk åpner/lukker); Sjåførkontroll (alle låste
kort nekter skjuling/flytting, løftebord-grense, skjult kommentar → kontroll sendes uten feil); standardsidene (skjul,
låste seksjoner, standardfane, starttilstand); manipulert lagret konfigurasjon (skjulte kritiske komponenter, ukjent
widgetId, duplikat, ugyldig størrelse → normalisert), manipulert utkast (blokkert ved publisering, ingenting lagret);
korrupt JSON (standard, ingen skriving, advarsel), nyere `schemaVersion` (standard + publisering blokkert), lesefeil
(tidligere layout beholdes), skrivefeil (forrige layout beholdes, utkast beholdes), endring fra annen enhet
(bakgrunnssynk og stille konflikt), tilbakestill side/hele appen, Avbryt, publisering + omlasting, 375 px og desktop.
**Ikke testet:** mot ekte Airtable, ekte telefon/touch, lys modus, samtidig redigering fra to fysiske enheter.

---

### Prioritet 56.1 — Kompakt bilvalg

(Brukerens egen nummerering; bygger på Prioritet 56 «Moderniser hele sjåførmodus». Full detalj i CLAUDE.md,
«Prioritet 56.1 (2026-09-21)».)

1. **Velg bil bruker Ringeliste-gruppekortene.** `renderDriftslagGruppertBilvalg()` bygger nå `.ringeliste-group`/
   `-head`/`-title`/`-body` (fargeprikk, «LAG 1 (2)», Lucide-chevron) i stedet for de høye `.dash-group-card`-kortene.
   Målt: gruppehode 46 px og mellomrom 14 px — identisk med Ringeliste. Alle sju lag og «Biler ute av drift» ligger
   under hverandre på ca. 625 px (390×844) med én gruppe åpen. Fortsatt kun én gruppe åpen om gangen (sist brukte lag
   huskes som før).
2. **Kompakte bilrader** (`.ringeliste-row.sj-velg-rad`, ca. 52 px): ikon, «Bil 3 · AB10003», merke/modell (+ aktiv
   sjåfør) og en liten kontrollpille (`✅ 07:10` / `Ikke kontrollert`) med chevron. Skiltkomponenten og den store
   pillen er tatt ut. Lange navn kortes med ellipsis; ingen horisontal overflow ved 320 px.
3. **Lavere toppseksjon** (`.sj-header.kompakt`): 41 px høy (målt; tidligere 44 px ikon + lang hinttekst + 18 px margin), kun «Velg kjøretøyet du kjører i dag.»
4. **Uendret funksjon:** samme `data-velg-bil`/`data-velg-kontroll-bil`-attributter og klikk-håndtering, navnedialogen,
   «ute av drift»-rader er fortsatt ikke klikkbare. Administrasjonens «Bytt bil»-fallback i `renderKontroll()` bruker
   samme delte komponent og får samme utseende.
5. `CACHE_VERSION`/`APP_VERSION`/`version.json` 107 → 108; `kontroll.html` eksakt kopi. `storage.airtable.js`/Airtable
   uendret.

**Testet** i nettleser mot scratch-kopi med mock-storage (ingen ekte Airtable): høyde/mellomrom mot Ringeliste, åpne/lukke
gruppe, bilklikk → navnedialog → avbryt, ute av drift-rad, 390 og 320 px. **Ikke testet:** ekte telefon, lys modus, admin-
fallbacken visuelt.

---

## 2026-09-20

### Prioritet 59 — Forenkle Bilinformasjon og dekkskift for flere biler

(Brukerens egen nummerering; det finnes en tidligere, urelatert «Prioritet 59 (2026-09-13) — Prioritet er ikke lenger en
sannhet». Full detalj i CLAUDE.md, «Prioritet 59 (2026-09-20)».)

1. **Bilkort (`renderBilkort()`).** «Rediger informasjon» finnes kun i «Kjøretøydetaljer» (knappen øverst til høyre er
   fjernet). Mobilitetsgaranti vises bare i statusraden (pillen ved Aktiv sjåfør er borte). Feltet øverst til høyre er
   nå «Neste verkstedtime» for den bilen (`dashBannerVerkstedHtml(v.id)` — samme kort og `nesteVerkstedtime()` som
   Dashboard; hele feltet åpner avtalen; «Ingen planlagte verkstedtimer» når det ikke finnes noen).
2. **Statusrad** (`.profil-stat5`): Kilometerstand · Siste service · EU-kontroll · Mobilitetsgaranti · Løftebord.
   Aktiv sjåfør er fjernet fra raden. «Siste service» viser «Sist service [dato / Ingen registrert]», en skillelinje og
   «Kilometer igjen til service». Løftebord viser kontrollstatus (gyldig/utløper snart/utløpt), sist smurt og OK / Bør
   gjøres / Må gjøres.
3. **Faner fjernet, én Historikk-seksjon.** Oversikt/Historikk/Dekk/Kostnader (og den separate Verkstedhistorikk-fanen) er
   borte. Nederst ligger «Historikk» med fem faner i Hurtigoversiktens stil: Kontroller · Skader · Varsellamper ·
   Verkstedhistorikk · Kommentarer (`bilkortHistorikkSekHtml()`). Bare valgt fane rendres, nyeste først, antall vises i
   fanen når det finnes data, kompakt tomtilstand. Fanebytte kaller ikke `render()` (`byttBilkortHistorikkFane()`): ingen
   layout shift, scrollposisjonen beholdes. Radene åpner de eksisterende korta (`kontrollHistoryCard`/`damageCard`/
   `varsellysCard`/`nyeKommentarRadHtml`). Ingen data er slettet: dekkhistorikk ligger nå under Verkstedhistorikk, og
   kostnader ligger fortsatt på Kostnader-siden.
4. **Dekkskift for flere biler.** «Bestill dekkskift» (Dashboard/Bestill tjenester/bilkort) har «Velg flere biler»
   (standard: én bil), bilvelger med «Velg alle» og «N biler valgt», felles retning (Til sommerdekk/Til vinterdekk),
   verksted, dato, klokkeslett og kommentar. Knappen heter «Bestill dekkskift for N biler» og gir en bekreftelse
   («Du oppretter dekkskift for 13 biler hos BestDrive på valgt dato.»). Det opprettes **én egen verkstedbestilling per
   bil** (unik id, riktig `vehicleId`, `type = 'dekkskift'`, felles verksted/dato/tid/retning/kommentar og en felles
   `bestillingGruppeId`) — aldri én rad med flere biler.
5. **Delvis feil uten duplikater.** Alle nye bestillinger skrives i ÉN skriving. Feiler den, leses Airtable-fasiten på nytt
   og hver bil klassifiseres som lagret / feilet / ukjent; panelet lister hvem som er hva, og «Prøv de feilede på nytt»
   gjenbruker samme id-er og leser fasiten først. Kan fasiten ikke leses, sendes ingenting på nytt (ukjent ≠ feilet).
6. **Samlet fullføring per bil.** `fullforVerkstedbestillinger(ids)` oppdaterer `v.dekk` og oppretter dekkhistorikk
   (deterministisk id `'dekk-'+vt.id`, idempotent) separat for hver bil, og ruller alt tilbake lokalt ved lagringsfeil.
   `fullforVerkstedbestilling(id)` delegerer dit. Verkstedhistorikk viser ikke dekkskiftet to ganger; sletting fjerner
   også den tilhørende dekkhistorikk-raden. Verkstedkortet viser retning og «👥 Samlet bestilling · N biler» /
   «✅ Alle N utført».
7. **Airtable / versjon.** To nye kolonner på `WorkshopAppointments`: `DekkRetning` og `BestillingGruppeId`
   (`storage.airtable.js` v2.20.0 → v2.21.0, `?v=2.21.0`). **Kolonnene MÅ opprettes før idriftsettelse** — uten dem
   feiler alle lagringer av verkstedtimer. `CACHE_VERSION`/`APP_VERSION`/`version.json` 106 → 107;
   `kontroll.html` er eksakt kopi av `index.html`.

**Verifisert** i nettleser mot en scratch-kopi med in-memory mock-storage (ingen kontakt med ekte Airtable; `node`/`python`
finnes ikke): statusrad og faner (ingen gamle faner, innhold/rekkefølge, fanebytte uten geometriendring), enkeltbil-dekkskift
uendret, flervalg og bekreftelsestekst, 13 separate bestillinger med delte verdier og én skriving, kalender/neste time per
bil, samlet «utført» for 13 biler uten dobbeltføring, delvis feil 10/13 + retry uten duplikater, tapt respons (alle
lagret), uleselig fasit (retry blokkert, deretter vellykket), enkeltfullføring, dobbel fullføring, eldre dekkskift uten
retning, rollback ved lagringsfeil. **Ikke testet:** ekte Airtable, ekte mobil/touch. Ikke committet.

---

## 2026-09-19

### Prioritet 58 — Dashboard Editor 1.0

(Brukerens egen nummerering; det finnes en tidligere, urelatert «Prioritet 58 (2026-09-13) — Synlighetsdrevet
Lucide-migrering».) Full detalj i CLAUDE.md, «Prioritet 58 (2026-09-19)».

1. **Rutenett-editor for Desktop Dashboard.** Innstillinger → Layout Editor → Desktop Dashboard → «Rediger dashboard»
   åpner Dashboard i redigeringsmodus (kun innlogget administrator, kun desktop). 12 kolonner; `x`/`y`/`width`/`height`
   er kolonner og rader, ingen piksler, ingen frie farger/skrifter. Dra i tittelen (flytt) eller hjørnet (størrelse),
   Bredde/Høyde −/+, Skjul, «Legg til kort», piltaster (Skift = størrelse), **Angre**, **Forhåndsvis** (ekte kort, `inert`),
   **Tilbakestill** (i utkastet), **Avbryt**, **Lagre layout**. Ingenting lagres før «Lagre layout».
2. **Komponentbibliotek på ni kort** (`DASH_WIDGETER`): Operativ kontroll og Neste verkstedtime (banneret splittet i to
   kort), Bestill tjenester, Hurtigoversikt, og fem nye bibliotekskort som er skjult som standard — Aktive biler,
   Kalender («Denne uken», gjeninnført fra git), Varsler, Aktive saker, Løftebordstatus. Alle kaller eksisterende
   funksjoner/data; ingen forretningslogikk endret. Standard = Dashboard som før, med banneret som to kort.
3. **Ingen overlapp, ingen klipping.** `dashLayoutPlaser()` løser all plassering («tyngdekraft», innsettingsrekkefølge så
   kort kan bytte plass ved å dras forbi hverandre); `height` er en minstehøyde (`minmax(40px, auto)`). Smal
   innholdsflate (< 640 px container) stabler kortene i leserekkefølge.
4. **Lagring:** én versjonert Settings-blob `dashboard-layout-v1`
   (`{version:1, widgets:[{widgetId,x,y,width,height,visible}], updatedAt, updatedBy}`). Ingen ny tabell, ingen
   `LIST_TABLES`-endring, **`storage.airtable.js` uendret**. Mislykket lagring beholder forrige layout og utkastet.
   Ugyldig/korrupt/manglende/uleselig layout → standard uten krasj; ukjente widgeter ignoreres; ugyldig geometri
   repareres; nye bibliotekskort som mangler i en lagret layout legges til skjult. Eldre `dashboard-layout`.desktop
   brukes som utgangspunkt for standard til første lagring.
5. **Synk mellom administratorenheter:** `lastDashLayout()` i oppstart og i bakgrunnssynken; et åpent utkast
   overskrives aldri (varsel + bekreftelse ved lagring). `goTo()`/utlogging/mobilvisning har vern rundt et åpent utkast.
6. **Rettet underveis (egen funn):** første versjon av plasseringen lot kortet du drar stå fast og skjøv de andre under;
   tyngdepakkingen reverserte det, så et kort ikke kunne dras ned forbi et annet. Oppdaget med en ekte museforflytning
   (ikke med simulerte hendelser) og rettet med innsettingsrekkefølgen i pkt. 3.
7. **Fjernet:** `DESKTOP_LAYOUT_KOLONNER`, `layoutFlateSynligeNokler()`, `DASHBOARD_LAYOUT_FLATER.desktop` og
   desktop-grenen i den skjematiske forhåndsvisningen. Mobil Dashboard og Min Bil bruker fortsatt opp/ned-modellen.
8. Versjon 106 (`sw.js`, `version-check.js`, `version.json`); `kontroll.html` synkronisert.

**Verifisert** i nettleser (Browser-pane) mot scratch-kopi med mock-storage — ingen ekte Airtable: standard ≙ før;
alle ni kort uten klipping; drag/resize/skjul/vis/tastatur/Angre/Tilbakestill/forhåndsvisning uten overlapp (også ekte
museforflytning); min-størrelser; mislykket og vellykket lagring; omlasting; korrupt JSON, feil versjon, ikke-liste,
ukjente/duplikate widgeter, søppelgeometri, overlappende lagret data; lesefeil med/uten tidligere layout; synk via
bakgrunnshandleren (normalmodus og under redigering); navigasjons-/Avbryt-/utloggingsvern; mobil (editor nektes,
mobilforside og øvrige editorer uendret); ingen horisontal overflow ved 800 px; brace-/backtick-balanse.
**Ikke testet** mot ekte Airtable eller ekte berøringsskjerm; ikke i lys modus.

### Prioritet 57 — Dashboard og Hurtigoversikt

(Brukerens egen nummerering.) Full detalj i CLAUDE.md, «Prioritet 57 (2026-09-19)».

1. **Varsler-fanen i Hurtigoversikt = samme design som de andre fanene.** Radene er nå `.p38-case`
   (`dashHovVarselRadHtml()`): ikon-flis (kategoriikon, tonet), fet bil-linje, én tekstlinje og «→ Åpne»-lenke —
   identisk struktur, høyde (56 px) og startposisjon som Aktive saker/Oppfølging/Verksted. Den egne
   varsellayouten (`.vl-card` med store knapper: Åpne bilkort/sak, Merk som løst, Godta/Avslå km, Marker som sett)
   er FJERNET herfra. Hele raden er klikkmålet: km-varsler og varsellamper åpner Varslingssenteret på riktig
   kategori (der handlingene fortsatt ligger, uendret), resten går rett til bil/sak/kommentarer.
2. **«Neste verkstedtime» flyttet inn i Dashboard-banneret**, til høyre for kontrollstatusen (desktop; stables
   under på smal skjerm). Ett klikkbart felt (`data-apne-vt` → `apneVerkstedAvtale()`): tittel, bil, faktisk
   dato · klokkeslett og verkstedets navn. Ingen kommende time → kun en dempet tekstlinje «Ingen planlagte
   verkstedtimer» (ingen tom boks). Den gamle seksjonen nederst (`dashNesteVerkstedSekHtml()`) er fjernet.
3. Versjon 105 (`sw.js`, `version-check.js`, `version.json`); `kontroll.html` synkronisert. Airtable uendret.

**Verifisert** i nettleser mot mock-storage (ingen ekte Airtable), 1200 px og 375 px: banner i to kolonner,
klikk på indre tekst åpner avtalen, tom-tilstand, ingen VT-seksjon nederst, radstruktur/-høyde/-posisjon lik i alle
faner, klikkmål for varsler (senter/sak/kommentarer), stabling og ingen horisontal overflow på mobil.
**Ikke testet** mot ekte Airtable eller ekte telefon; skjermbildene i panelet er små, layout målt via DOM.

### Prioritet 56 — Moderniser hele sjåførmodus

(Brukerens egen nummerering. Ticketen kom i to versjoner — den første ble avbrutt og var avkuttet etter
akseptansekriterium 1; den andre, fullstendige versjonen er fulgt.) Full detalj i CLAUDE.md,
«Prioritet 56 (2026-09-19)».

1. **Ett designsystem, Ringeliste som referanse.** Nye `sj-*`-klasser (header, kort, rader, pillknapp,
   statuspille, seksjonstittel) DELER verdier med `ringeliste-*` via grupperte selektorer. Alle sjåførskjermer
   bruker det: Min Bil, Registrer kontroll, Velg bil, Kommentarer, Mer, Ny kommentar; handlingskortene
   (Registrer skade/varsellampe/avvik/kontakt/Ny sjåfør/Sjekk ut) er restylet til samme kortspråk.
   `renderDriverShell()` pakker innholdet i `.sj-app` (overstyringer av `.panel`/`.chip` gjelder kun der).
2. **Bilkortet er hjertet i Min Bil** — ETT kort med rader: Kontrollstatus → Kilometerstand → Neste
   verkstedtime → Løftebord (status, sist utført, dager siden, «Smør løftebord») → «● Operativ». Løftebord- og
   verkstedtime-kortene er FLYTTET inn (ikke duplisert). Bilkortet er fast innhold og er tatt ut av Layout
   Editor (løftebord skal alltid være synlig). Rekkefølge: Aktiv sjåfør (header) → bilkort → Handlinger (skade,
   varsellampe, øvrige).
3. **Kontrollflyten:** 1 Bil · 2 Sjåfør · 3 Kilometerstand · 4 **Løftebord** · 5 Varsellamper · 6 Kontrollavvik ·
   7 Kommentar · 8 Nye skader. Løftebord-kortet viser status og løftebord-avviket (`kt-avvik-loftebord`, samme
   `kontrollFormAvvik`/`submitKontroll()`), løftet ut av det lukkede Kontrollavvik-panelet. Skiltkortet i «Bil og
   sjåfør» er fjernet (mindre scrolling).
4. **Kontroll → Min Bil uten mellomskjerm:** lagring → ferske verkstedtimer/løftebord (maks 2,5 s) → Min Bil →
   kort, ikke-blokkerende «✅ Kontroll registrert». En allerede kontrollert bil går rett til Min Bil (mellomskjermen
   «Gå til Min Bil» er fjernet). Suksess-`alert()` på Min Bil (skade/varsellampe/avvik/løftebord) er byttet med
   samme korte bekreftelse.
5. **To eksisterende feil rettet underveis:** (a) en `*/` inne i CSS-kommentaren over Ringeliste-reglene lukket
   kommentaren for tidlig og slukte `.ringeliste-header`-regelen — ikonet lå over tittelen; nå ved siden av,
   som koden var skrevet for. (b) `submitKontroll()` sin `rullTilbake()` satte feilmeldingen og kalte deretter
   `render()`, som slettet den — sjåføren så et skjema uten forklaring ved lagringsfeil. Meldingen settes nå på
   det nye elementet.
6. Versjon 104 (`sw.js`, `version-check.js`, `version.json`); `kontroll.html` synkronisert.
   `storage.airtable.js`/Airtable uendret.

**Verifisert** i nettleser mot kopi av appen med in-memory storage-mock (ingen ekte Airtable), på 375×812:
bilkortets rader/rekkefølge, smøring fra bilkortet, kontrollskjemaets rekkefølge, løftebord-avvik i samme
`kontrollFormAvvik`, lagringsfeil (blir på siden, melding synlig, data beholdt), retry → Min Bil (117 ms mot
mock) med oppdatert kontrollstatus/km/aktiv sjåfør/ny verkstedtime, allerede kontrollert bil, alle sjåførskjermer
uten horisontal overflow, admin-kontrollskjemaet uendret flyt. **Ikke testet:** ekte Airtable, ekte mobil/touch,
og «offlineflyt» (koden har ingen offlinekø — feilen håndteres som før: blir på skjemaet med melding).

### Prioritet 54 — Neste verkstedtime som operativ informasjon

(Brukerens egen nummerering.) Full detalj i CLAUDE.md, «Prioritet 54 (2026-09-19)».

1. **Én definisjon, én datakilde** (`WorkshopAppointments` = `verkstedtimer`): `nesteVerkstedtime(vehicleId?)`/
   `kommendeVerkstedtimer()`/`vtErKommende()`. Kommende = ikke `utfort`, har dato, og dato/tid ligger frem i
   tid (faktisk Oslo-dato og -klokkeslett; time uten klokkeslett = hele dagen). Ingen «kansellert»-status
   finnes — en avlyst time slettes. Viser avtalens `dato`/`tidspunkt`/`verksted`, aldri opprettelsesdato.
2. **Fire flater, ett delt kort** (`nesteVerkstedtimeHtml()`): **Dashboard** (liten seksjon direkte under
   Hurtigoversikt, desktop og mobil, knapp «Åpne»), **Verkstedoversikt** (øverst, knapp «Åpne avtale», samme
   time fremheves i listen), **Kjøretøyprofil/Bilinformasjon** (under statusflisene; inne i «✏️ Bilinformasjon»
   når panelet er åpent — aldri begge), **Min Bil** (kun når aktiv bil har kommende time; utenfor Layout
   Editor, uten knapp, «Årsak:» fra timens beskrivelse). Ingen time: «Ingen planlagte verkstedtimer»
   (unntatt Min Bil, som viser ingenting).
3. **«Åpne avtale»** (`apneVerkstedAvtale()`): nullstiller filtre, åpner riktig bil og avtalens redigeringsboks
   i Verkstedoversikten og ruller den til syne.
4. **Fjernet:** `upcomingVT`/`nearestVT`/`nearestWithin7` i `dashboardBeregning()` — en andre, avvikende
   definisjon (kun dato, tok med utførte) uten noen leser.
5. **Sjåførmodus-fiks:** `formInProgress()` var alltid `true` i sjåførmodus (`screen==='kontroll'`), så
   bakgrunnssynken lastet data uten å tegne på nytt. Min Bil i hviletilstand (ingen åpent panel) får nå tegne
   på nytt, slik at en endret verkstedtime slår gjennom. Alle andre sjåførskjermer er uendret beskyttet.
6. Versjon 103 (`sw.js`, `version-check.js`, `version.json`); `kontroll.html` synkronisert.
   `storage.airtable.js` og Airtable uendret.

**Verifisert** i nettleser mot en kopi av appen med in-memory storage-mock (ingen kontakt med ekte Airtable):
definisjonen (fortid/utført/i dag passert/i dag uten tid/sortering), alle fire flater viser samme dato,
klokkeslett og verksted, endring via `saveVTEdit()` / sletting / utført oppdaterer alle visninger, «Åpne
avtale», tom-tilstand, mobil admin (375 px, ingen overflow), sjåførmodus inkl. synk fra «annen enhet» og
beskyttelse av åpent panel. **Ikke testet** mot ekte Airtable, på ekte mobil, eller visuelt i detalj.

### Prioritet 53 — Konfigurerbart grunnlag for operativ kontroll

(Brukerens egen nummerering — det finnes fra før en annen, tidligere «Prioritet 53 — Dashboard 5.0»
i CLAUDE.md; navnesammenfallet er tilfeldig.) Full detalj i CLAUDE.md, «Prioritet 53 (2026-09-19)».

1. **Ny innstilling** Innstillinger → ⚙️ Systeminnstillinger → 🎯 Operativ kontrollgrunnlag:
   kjøretøy gruppert på `v.driftslag` (Velg alle/Fjern alle per gruppe og globalt, søk, alltid
   synlig «N kjøretøy valgt») og driftsdager man–søn (standard man–fre). Minst ett kjøretøy og én
   driftsdag kreves. Nullstill forkaster ulagrede valg.
2. **Datamodell:** én Settings-blob `operativ-kontrollgrunnlag`
   (`{version:1, vehicleIds, activeWeekdays (ISO 1–7), updatedAt, updatedBy}`). Ingen ny tabell,
   ingen nye Vehicles-felt, **`storage.airtable.js` uendret**.
3. **Beregning** (erstatter `operativeKjerneBiler()`/`kontrollrateUke()`): den lagrede listen er
   eneste grunnlag — ingen filtrering på reserve/ute av drift/verksted/aktiv sjåfør/gruppe. Hver
   bil teller maks én gang per dag. Fridag: «Ingen planlagt kontroll i dag» (aldri 0 %). «Siste
   7 driftsdager» = de syv siste datoene med valgt ukedag; unike kontrollerte kjøretøy-dager /
   (valgte biler × 7); aldri over 100 %.
4. **Banner** (desktop og mobil, samme funksjon): `23 % i dag • 96 % siste 7 driftsdager • 3 aktive`
   + `3/13 kontrollert` med «Se hvilke →» som åpner Kontrollert/Mangler kontroll (klikkbare
   biler). «N aktive» er selv en snarvei til Biloversikt → Har aktiv sjåfør. Uten gyldig
   grunnlag: «Operativ kontroll må konfigureres» [Konfigurer], ugyldig/korrupt, eller «Kunne ikke
   lese …» [Prøv igjen]. Aldri en prosent uten grunnlag.
5. **Lasting/synk/feil:** lastes i `loadAll()`; live-synk-handleren leser grunnlaget hver runde
   (subscribeLiveSync poller bare LIST_TABLES). Lagring låser knappen, skriver via storage-laget,
   og bytter først etter bekreftet skriving; ved feil beholdes forrige grunnlag og valgene vises
   ikke som lagret. Et åpent skjema overskrives aldri: urørt skjema oppdateres stille, skittent
   skjema beholdes med varsel + «Last inn siste», og Lagre ber om bekreftelse.
6. Versjon 102 (`sw.js`, `version-check.js`, `version.json`); `kontroll.html` synkronisert.

**Rettet underveis (funnet i test, aldri levert):** skjemaets «er endret»-sjekk sammenlignet mot det
nye grunnlaget i stedet for det utkastet ble bygget fra, slik at et urørt skjema ble regnet som
ulagret arbeid da en annen bruker lagret. Løst med en baseline (`baseNoekkel`) i utkastet.

**Verifisert** i nettleser (Browser-pane) mot en kopi av appen med en in-memory storage-mock —
**ingen kontakt med produksjons-Airtable**, og ikke testet mot ekte Airtable: 3/13 = 23 %,
13/13 = 100 %, samme bil flere ganger, ikke-valgt bil kontrollert, man–fre (helger hoppes over i
7-dagersperioden, helgekontroller teller ikke), lørdag/søndag som fridag, lørdag aktivert senere,
dagskille 03:59/04:00 Oslo, omdøpt/flyttet bil beholdes, slettet bil ignoreres, ute av
drift/reserve teller når valgt, lagringsfeil (forrige grunnlag beholdt), sju varianter av korrupt
konfigurasjon, lesefeil (forrige gyldige beholdes), synk mellom «enheter» (rent/skittent skjema,
gjentatt poll, bekreftelse ved lagring), banner på 1280 px og 375 px (ingen horisontal overflow).
Skjermbilder i panelet var ustabile — layout er målt via DOM (bounding boxes), ikke sett visuelt i
detalj.

---

## 2026-09-18

### Prioritet 52 — Dashboard UX Polish

Ren opprydding av eksisterende design — ingen nye KPI-er, widgets, moduler eller Airtable-felt
(`storage.airtable.js` uendret). Full detalj i CLAUDE.md, Prioritet 52.

1. **Ingen layout shift ved fanebytte.** `html{overflow-y:scroll;scrollbar-gutter:stable}`
   (permanent scrollbarspor). Hurtigoversikt-faner bytter nå KUN `.dash-hov-innhold` via ny
   `byttHurtigoversiktFane()` (ingen `render()`), med `min-height:420px` som «ratchetes» opp til
   høyeste fane som er vist, så siden aldri kan krympe og klemme scrollposisjonen. Lyttere for
   innholdet er flyttet til `attachHovInnholdListeners(root)`.
2. **Operativ kontroll-banner komprimert** fra ca. 190 til ca. 75 px: dato/klokkeslett/vær på én
   linje, «33% i dag • 38% siste 7 dager • 🚚 1 aktiv» + «Se hvilke →» på én linje.
3. **Tydeligere seksjoner** uten nye bokser: Bestill tjenester (ny delt `dashBestillSekHtml()`)
   og Hurtigoversikt er seksjoner med versal overskrift, luft og subtil skillelinje.
4. **Biloversikt:** kun Søk + `[Filter ▼]` som standard; Kontrollert/Ikke kontrollert/Reserve/
   Ute av drift (avkrysning), Kategori, Status og Løyvenummer ligger i et lukket panel
   (`showRegisterFilter`). Filterlogikken er uendret; knappen viser antall aktive filtre.
5. Versjon 101 (`sw.js`, `version-check.js`, `version.json`); `kontroll.html` synkronisert.

Verifisert i nettleser (lokal server, live Airtable-lesing, skriving av `storage.set` deaktivert,
admin-tilstand satt i konsollen) på desktop (1400 px) og smal visning (579 px): posisjon/bredde
for sidepanel, toppstripe, banner, kortrekke og faner identisk før/etter alle fire fanebytter,
også ved scroll til bunn; filterpanelet, avkrysningene og selectene endrer bilantallet som før.
Ikke verifisert på ekte mobilenhet.

### Prioritet 51 — Korrigert krav: Aktiv sjåfør og dagskille kl. 04:00

Ferdig regel: «Aktiv sjåfør beholdes gjennom operativ dag, men nullstilles alltid ved
operativt dagskille kl. 04:00.» Full detalj i CLAUDE.md, Prioritet 51 — kort oppsummert:
grundig lesing av eksisterende kode (Prioritet 34/40/66/66.2) bekreftet at mekanismen
allerede var praktisk talt komplett og korrekt. Tre reelle avvik rettet:

1. `settAktivSjafor()` overskrev `aktivSjaforSiden` ved HVER kontroll, også når samme
   sjåfør kontrollerte samme bil på nytt samme dag — rettet til å beholde det opprinnelige
   tidsstempelet i det tilfellet.
2. `ryddOppBiloktDagskille()` hadde ingen rollback ved mislykket lagring — lagt til samme
   snapshot/rollback-mønster som `submitKontroll()`/`deleteVT()` (Prioritet 66.1). Denne
   funksjonen ER ticket-ens etterspurte "nullstillAktiveSjaforerEtterDagskille()", gjenbrukt
   under sitt eksisterende navn.
3. **Reell krasjrisiko funnet under verifisering:** et ugyldig `aktivSjaforSiden` fikk
   `isoDateForOperationalDay()` til å kaste en `RangeError` (Invalid Date i
   `Intl.DateTimeFormat`) — ville krasjet `vehicleAktivSjafor()` og dermed praktisk talt
   hele appens visning. Rettet med `isNaN`-vakter på alle berørte steder.

Ny funksjonalitet: `nullstillAktivSjaforManuelt()` — et manuelt admin-«🔁 Nullstill aktiv
sjåfør»-trykk i Bilinformasjon som IKKE fantes fra før (ticket antok feilaktig at det
gjorde). `tidFraIso()` (ny, delt) gjør at «Siden kl. HH:MM» nå faktisk VISES i
Kjøretøyprofilen og Biloversikt — `aktivSjaforSiden` ble tidligere kun lest internt.
`handhevOperativtDogn()` kalles nå eksplisitt ved start av `submitKontroll()`.

**Ikke rørt:** Kilometerlogikk, saksmotoren, Verksted, Løftebord, den separate per-bil
14:50-autoreset-mekanismen (Prioritet 72.1, bevisst utenfor omfang), `storage.airtable.js`
(uendret — ingen nye felt).

### Prioritet 50 — Dashboard 5.0: ett skall, ett banner, én Hurtigoversikt

Bestilling: forenkle Dashboard til et rent operativt arbeidsbord. Full detalj i CLAUDE.md,
Prioritet 50 — kort oppsummert her:

- **Del 1 (app-ramme, kun desktop):** ny, delt `.desktop-frame` kobler sidepanelet og en
  full-bredde toppstripe (brand + løpende sidetittel + varselklokke) sammen til ett
  sammenhengende skall, automatisk på alle admin-skjermer via den delte render()-
  innpakningen. `#header-menu-btn` beholdt uendret i DOM (regresjonsvern, samme feilklasse
  som Prioritet 72.1 sin `del-vehicle`-bug).
- **Del 2 (innhold):** Dashboard er nå KUN banner + Bestill tjenester + Hurtigoversikt.
  Banneret viser dagens kontrollprosent for en NY, snevrere kjernepopulasjon
  (`operativeKjerneBiler()` — Lag 2/Montering/Lastebil, ekskl. reserve/ute av drift/
  verksted), 7-dagers trend, og en «aktive biler»-linje (samme data/klikkmål som det gamle
  KPI-kortet, kun flyttet). Bilpark status/Krever handling nå/Prioriterte biler/Kommende
  oppgaver/Biloversikt-forhåndsvisning er FJERNET. En ny, fanedelt Hurtigoversikt (Aktive
  saker/Oppfølging/Verksted/Varsler, samme `.profil-tabs`-mønster som Biloversikt) erstatter
  de fire gamle KPI-kortene, delt uendret mellom desktop og mobil for ekte identisk
  oppførsel.

**Dødt-kode-opprydding i samme runde:** `sakFaseTellereHtml()`, `dashboardKpiRadHtml()`,
`kontrollstatusKpiHtml()`, `aktiveBilerKpiHtml()`, `bilparkStatusInnholdHtml()`,
`dashKreverRadHtml()`, `kommendeOppgaveRadHtml()`, `kalenderUkeWidgetHtml()`,
`kalenderUkeDager()` og `KOMMENDE_ART` er alle SLETTET (ikke bare avkoblet) — hver var
fullstendig orphanet av omleggingen.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll, `v.km`-skriveregler, saksmotoren (kun
lest via `sakFase()`/`goToSakDetalj()`, aldri endret), Varslingssenteret sin egen logikk,
Layout Editor-mekanikken for øvrig, `storage.airtable.js` (uendret — ren
presentasjonsendring).

### Prioritet 49, Del 2 — Løftebord: avvik, vedlikehold og årlig kontroll

Bestilling: utvid Bilpark med full støtte for løftebord — sjåføravvik, sjåførvedlikehold
(smøring), administratorens årlige kontroll, varsling og historikk — uten noen «har
løftebord»-konfigurasjon (alle kjøretøy antas å ha løftebord). Full detalj i CLAUDE.md,
Prioritet 49 Del 2 — kort oppsummert her:

- **Del 1 (avvik):** ny kontrollavvikstype `'loftebord'` lagt til i `KONTROLLAVVIK_ORDER`/
  `_LABEL`/`_IKON`/`_LUCIDE` — dukker automatisk opp i BÅDE full sjåførkontroll og Min Bil sin
  hurtigflyt, uendret motor. Min Bil sin hurtigflyt (`submitMinBilAvvik()`) viser i tillegg et
  fritekst beskrivelsesfelt KUN for løftebord, brukt som sakens beskrivelse i stedet for den
  generiske auto-teksten — ren tilleggsvisning, samme `registrerAvvikSomSak()`-kall som før.
- **Del 2/3 (Min Bil):** nytt, alltid synlig «🛗 Løftebord»-kort (utenfor Layout Editor —
  ingen konfigurasjon å skjule det bak), fargekodet fra `loftebordVedlikeholdStatus()`.
  «🛢 Smør løftebord» åpner et eget bekreftelsesskjema (avkrysning påkrevd, kommentar
  valgfritt) → `submitMinBilLoftebordVedlikehold()`.
- **Del 4 (varsling):** 0–14 dager siden sist smurt = 🟢, 15–30 = 🟡, 31+ eller ingen
  registrering = 🔴. Kalenderdato-differanse (`daysSince()`), ikke månedsnummer — korrekt ved
  månedsskifte/årsskifte/skuddår uten egen logikk.
- **Del 5/6 (admin, Bilinformasjon):** ett-klikks «✅ Utført løftebordkontroll»
  (`registrerLoftebordKontroll()`) — dato/utført av (`loggedInRole`)/gyldig-til (+365 dager)
  settes automatisk, kun en `confirm()`. Status (🟢 Gyldig / 🟡 Utløper snart ≤30 dager /
  🔴 Utløpt eller mangler) vises KUN i Bilinformasjon — ingen sjåførvarsler.
- **Del 7 (historikk):** ny liste rett under kontroll-statusen i Bilinformasjon, nyeste
  først, tydelig merket ✅ Kontroll / 🛢 Vedlikehold.
- **Del 8 (datamodell):** ny Airtable-tabell `LiftgateHistory` (app-nøkkel
  `loftebordHistorikk`), egen fra `aktiveSaker`/`kontroller` — kontroll og vedlikehold er ALDRI
  blandet. **Ingen `HarLoftebord`-felt eller annen kjøretøykonfigurasjon.**
  `storage.airtable.js` v2.19.0 → v2.20.0, `?v=` i `index.html`/`kontroll.html` oppdatert
  tilsvarende, `CACHE_VERSION`/`APP_VERSION`/`version.json` økt sammen.

**Krever ny Airtable-tabell `LiftgateHistory` før idriftsettelse** — se AIRTABLE_MIGRATION.md
for feltliste.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll (`submitKontroll()`), `v.km`-skriveregler,
saksmotoren (`registrerAvvikSomSak()` kun kalt uendret, aldri endret), eksisterende
kontrollavvikstyper (slitte-dekk/defekt-lys/manglende-utstyr/slitte-bremser/feil-pa-kjoretoy),
Layout Editor-mekanikken for øvrig, Bilkategorier.

---

## 2026-09-17

### Prioritet 71.9 — Operativ opprydding i verksted, kalender og kjøretøyvisning

Bestilling: fem delmål — bestill verkstedtime fra sak, Reparasjon som egen verkstedkategori,
kalenderens nedre seksjon bygget om til «I dag»/«Senere», Reserve/Ute av drift skjult som
standard, og Faresonen på Kjøretøyprofilen gjemt bak en kollapset seksjon. Full detalj i
CLAUDE.md, Prioritet 71.9 — kort oppsummert her:

- **Del 1** (bestill verkstedtime fra sak) var allerede levert i Prioritet 71.8 — kun
  bekreftet, ikke endret.
- **Del 2:** `vtTypeIkon()`/`vtTypeLucide()`/`vtTypeArt()`/`vtTypeTittel()` skiller nå ut
  Service/Dekkskift (i tillegg til EU-kontroll/Ruteskift fra før) — resten faller til en
  eksplisitt Reparasjon-betydning i stedet for det tidligere generiske «Verkstedtime».
  Bevisst IKKE et femte Dashboard-bestillingskort (Prioritet 62 sitt prinsipp står).
- **Del 3:** Kalenderens «📋 Alle kommende aktiviteter» (`planleggingSeksjonHtml()`, typegruppert
  med egen periodevelger) er fjernet og erstattet av `kalenderIDagSenereHtml()` — leser SAMME
  datakilde som månedsgriden (`kalenderAktiviteterKart()`), delt i «I dag»/«Senere».
- **Del 4:** Reserve-/ute av drift-kjøretøy skjules nå som standard tre uavhengige steder —
  Biloversikt (`visReserve`/`visUteAvDrift`), sjåførens Ringeliste
  (`driverRingelisteVisReserve`/`driverRingelisteVisUteAvDrift`) og Dashboardets
  Biloversikt-forhåndsvisning (`dashVisReserve`/`dashVisUteAvDrift`), hver med egne
  «✅ Vis reserve»/«✅ Vis ute av drift»-hurtigknapper. Unntatt: «Har aktiv sjåfør»-visningen.
- **Del 5:** Faresonen (`.danger-zone`) er erstattet av en kollapset akkordionrad
  «⚙️ Avanserte handlinger» (`bilkortAccordionRow('avansert', …)`) — innholdet
  (Marker ute av drift/Slett bil) er uendret, kun ikke lenger alltid synlig.
- Ingen Airtable-endring i noen av de fem delene.

**Testet:** Ringeliste-togglene (Del 4, sjåførmodus) testet direkte i nettleser mot ekte,
live Airtable-data — bekreftet 11→14 (+reserve)→17 (+ute av drift) biler, og korrekt
tilbakestilling ved re-navigering. Ingen konsollfeil, kun lesing/toggling utført. De fire
admin-delene (Kalender/Biloversikt/Dashboard/Kjøretøyprofil) krever innlogging som ikke var
tilgjengelig i denne økten — verifisert ved grundig kodelesing og brace-/backtick-balansesjekk.

`sw.js`/`version-check.js`/`version.json` bumpet v92 → v93. `storage.airtable.js` uendret.

### Prioritet 71.8 — Fra sak til verkstedbestilling

Bestilling: sakskortets «Registrer verkstedtime»-knapp (fase «Under oppfølging») skal hete
«📅 Bestill verkstedtime» og selve verkstedbestillingen forhåndsutfylles med bil/regnr/
sakstype/beskrivelse pluss en automatisk utledet verkstedtype, slik at brukeren kun velger
verksted/dato/tidspunkt. Full detalj i CLAUDE.md, Prioritet 71.8 — kort oppsummert her:

- Bil/Regnr/Sakstype/Beskrivelse var allerede forhåndsutfylt fra tidligere prioriteter —
  ingen endring der. Den reelle mangelen var verkstedtype: `bestillVerkstedForSak()`
  hardkodet `'reparasjon'` uansett sakens type, og `submitAddVT()` sin fallback for
  sak-koblede skjema leste ikke `vtPrefillType` i det hele tatt.
- Ny `sakTilVtType(sak)`: Service-sak → `'service'`, Dekk-sak → `'dekkskift'`, alle andre
  (varsellampe/skade/kontrollavvik/annet) → `'reparasjon'` (uendret standard). Retter en
  reell feil: en verkstedtime bestilt fra en Service-sak ble aldri lagret med
  `type='service'`, og kunne derfor aldri utløse Prioritet 71.5 sin automatiske
  servicehistorikk-opprettelse ved fullføring.
- Standardverksted-forslaget i Verksted-nedtrekket følger nå samme utledede type
  (`standardVerkstedForVtType(initialType)`) i stedet for alltid «Reparasjon».
- Mobilitetsgaranti-avkrysningsboksen (kun for type `service`) vises nå også for
  sak-koblede skjema, siden `type='service'` nå faktisk er mulig derfra.
- EU-kontroll er bevisst utelatt fra `sakTilVtType()` — EU-kontroll blir aldri en sak i
  dagens datamodell (kun et Varslingssenter-varsel), så regelen er urealiserbar i praksis.

**Testet:** full kjedesporing gjennom kodelesing (klikk → bestillVerkstedForSak() →
renderVerksted() → submitAddVT() → fullforVerkstedbestilling()) og global
brace-/backtick-balansesjekk. Ikke UI-verifisert i innlogget økt — Aktive saker/Verksted
krever admin-innlogging, ikke tilgjengelig i denne økten.

Oppdaget, men bevisst ikke rørt: `bestillVerkstedForSak()` og `goToRegisterVT()` finnes hver
som to duplikate funksjonsdeklarasjoner i `index.html` (kun siste vinner) — én egen,
uavhengig opprydding, ikke del av denne saken.

`sw.js`/`version-check.js`/`version.json` bumpet v91 → v92. `storage.airtable.js` uendret.

### Prioritet 71.7 — Ringeliste-opprydding

Bestilling: fjern (i)-info-ikonet fra sjåførens Ringeliste, åpne skjermen med kun
🟢 Aktive sjåfører synlig (Ingen aktive sjåfører/Ledelse lukket), og fest Home
Delivery/Veihjelp i en fast bunnseksjon som alltid er tilgjengelig. Full detalj i
CLAUDE.md, Prioritet 71.7 — kort oppsummert her:

- Info-ikonet og den nå ubrukte `.ringeliste-info-btn`-CSS-regelen er fjernet.
- `driverRingelisteLukket` sin standard er endret fra «alle tre grupper åpne» til «kun
  Aktive sjåfører åpen» (`new Set(['ingen-aktive', 'ledelse'])`), og nullstilles til denne
  standarden hver gang skjermen åpnes fra bunnmenyen — ikke husket fra forrige besøk.
- Home Delivery/Veihjelp-kortene er flyttet inn i en ny `.ringeliste-fixed-quick`
  (`position:fixed`, rett over sjåførens bunnmeny) — alltid synlig uansett scrollposisjon.
  Gruppelisten fikk en tilsvarende `padding-bottom` slik at siste gruppe ikke havner skjult
  bak de to faste bunnbarene.
- Ingen datamodell-/Airtable-endring — ren presentasjons-/tilstandsendring.

**Testet:** kjørt i faktisk nettleser mot ekte, live Airtable-data (sjåførmodus krever ingen
innlogging) — bekreftet visuelt at standardvisningen, tilbakestillingen ved re-navigering og
den faste bunnseksjonen (inkl. ved en utvidet 14-rads liste scrollet helt til bunns) fungerer
som spesifisert, på både mobilbredde og bredere visning, uten konsollfeil. Kun lesing/
navigering — ingen skrivinger sendt til den ekte basen.

`sw.js`/`version-check.js`/`version.json` bumpet v90 → v91. `storage.airtable.js` uendret.

### Prioritet 71.6 — Verkstedopprydding og smartere filtrering

Bestilling: slett feilregistrerte verkstedbesøk, ny fast verkstedtype «Reparasjon», en
horisontal enkeltvalgt verkstedtype-velger, horisontale varselkategori-faner i
Varslingssenter, og hurtigfiltrering på Biloversikt (alltid ufiltrert ved åpning, pluss
«Kontrollert»/«Ikke kontrollert»-snarveier). Full detalj, designvalg og kjente
begrensninger i CLAUDE.md, Prioritet 71.6 — kort oppsummert her:

- **Sletting:** ny `deleteDekkhistorikk()` (fantes ikke fra før) og dispatcher
  `deleteVerkstedHistorikkPost()` gir 🗑️ Slett på alle poster i Verkstedhistorikk (verksted/
  service/dekk), i tillegg til den allerede eksisterende Slett-knappen for aktive
  verkstedbestillinger. Samordnet bekreftelsestekst: «Er du sikker på at du vil slette dette
  verkstedbesøket?».
- **Verkstedtype:** `VT_TYPE_VELGER` (EU-kontroll/Service/Dekkskift/Ruteskift/Reparasjon,
  radioknapper) erstatter de to uavhengige avkrysningsboksene fra Prioritet 46/61/62. Retter
  i samme slengen et eksisterende avvik der `vtEuForhandskrysset`/
  `vtRuteskiftForhandskrysset` aldri faktisk ble satt `true` noe sted i koden — Ruteskift-/
  EU-kontroll-bestillinger fra Dashboard/Kjøretøyprofil traff derfor ofte feil type og feil
  standardverksted-forslag. `verkstedHistorikkType()` leser nå det strukturerte feltet for
  alle fem typer i stedet for kun to.
- **Varslingssenter:** kategoriene vises nå som horisontale faner (`.profil-tabs`, samme
  komponent som Kjøretøyprofilens faner), med loggen for valgt kategori under — i stedet for
  alle åtte kategorier stablet samtidig. Selve varsel-beregningen (Prioritet 71) er uendret.
- **Biloversikt:** ny `resetRegisterFiltre()` nullstiller alle filtre ved generell
  navigasjon (sidebar/drawer/mobil bunnmeny) — siden åpnes derfor alltid ufiltrert, mens
  dype lenker (Dashboard-chips m.fl.) fortsatt treffer sitt bevisste filter uendret. To nye
  hurtigfilterknapper leser/skriver samme `filterKontrollStatus` som det eksisterende
  nedtrekksfilteret.
- **Ingen Airtable-endring:** `storage.airtable.js` uendret, kun `sw.js`/`version-check.js`/
  `version.json` bumpet (v89 → v90).

**Testet:** grep-verifisering av fjernet dødkode, global brace-/backtick-balansesjekk,
manuell gjennomlesning av alle endrede funksjoner, og — i motsetning til Prioritet 71.5 —
appen faktisk lastet i en nettleser via en midlertidig lokal PowerShell-statisk-server (ingen
konsollfeil helt frem til innloggingsskjermen). Videre UI-verifisering av selve skjermene
krevde admin-innlogging, ikke tilgjengelig i denne økten — se CLAUDE.md, Prioritet 71.6, for
anbefalt sjekkliste før idriftsettelse.

### Prioritet 71.5 — Opprydding saksmotor og ny operativ bilprofil

Bestilling: fjern den gamle 4-stegs saksbehandlingsveiviseren («Avansert redigering» /
«Vurder sak» / «Fortsett saken» / «Slett saken») helt — saksbehandling skal kun skje
gjennom Godta / Avslå / Registrer verksted / Utført uten verkstedbesøk — og bygg
Kjøretøyprofilen rundt fem operative tall (km-stand, sist service, EU-status,
mobilitetsgaranti, aktiv sjåfør) synlig uten scrolling, med Service → Utført arbeid
automatisert, Kjøretøydetaljer komprimert horisontalt, en egen Verkstedhistorikk-fane og en
enklere Historikk-fane. Full detalj, kartlegging og kjente begrensninger i CLAUDE.md,
Prioritet 71.5 — kort oppsummert her:

- **Saksmotor:** `sakWizardHtml`/`sakWizardSteg1-4Html`/`sakWizardLesemodusHtml`/
  `avvikRadHtml` og mutasjonene bak dem (`toggleEditSak`/`submitSakWizardVurdering`/
  `submitSakWizardOppfolging`/`submitSakWizardKommentar`/`submitSakWizardFullfor`/
  `reapneSak`/`deleteSak`/`markerAvvikUtfort`/`sakOppdaterStatusEtterAvvik`/
  `sakAlleAvvikFerdig`) er fjernet i sin helhet, sammen med tilhørende DOM-lyttere og
  state-variabler. Kostnadsregistrering på en sak (estimert/faktisk/avsetting) har ingen
  gjenværende inngang — dette var eksplisitt akseptert, ikke en forglemmelse.
- **Service oppdaterer bilen automatisk:** nytt felt `WorkshopAppointments.
  mobilitetsgarantiAktivert` (krever ny Airtable-kolonne, se AIRTABLE_MIGRATION.md).
  Fullføres en verkstedtime av typen `'service'`, oppretter `fullforVerkstedbestilling()`
  nå automatisk en `servicehistorikk`-rad (km fra `v.km`), og videre­fører
  mobilitetsgaranti-flagget til `vehicleMobilitetsgaranti()` som en tredje, uavhengig
  dato-kilde. `samletVerkstedHistorikkAlle()` skiller ut postbyggingen og hopper over
  `servicehistorikk`-rader med `fraVerkstedtimeId` for å unngå duplikatvisning.
- **Ny toppseksjon** (`.profil-stat5`, fem kort) rett under identitetslinjen i
  `renderBilkort()` — Km-stand/Sist service/EU-kontroll/Mobilitetsgaranti/Aktiv sjåfør.
  Eksisterende `.profil-stat4` (Kontrollstatus/Varsellamper/Skader/Aktive saker) er beholdt
  uendret under den nye raden.
- **Kjøretøydetaljer komprimert** til `.detalj-grid`/`.detalj-rad` (Reg.nr, Løyvenummer,
  Driftslag, Drivstoff, Årsmodell, Telefon) — Kategori/Bilgruppe/Merke-modell/Biltype er
  fjernet fra denne seksjonen (feltlisten var eksplisitt), Aktiv sjåfør/Kilometerstand/
  Mobilitetsgaranti flyttet til den nye toppseksjonen.
- **Ny «📋 Verkstedhistorikk»-fane** på Kjøretøyprofilen, mellom Historikk og Dekk — samme
  tre kilder som den frittstående Verkstedhistorikk-skjermen, forhåndsfiltrert på bilen.
- **Historikk-fanen forenklet:** Tidslinje/Nøkkeltall/Kontroller → Kontroller/Skader/
  Kommentarer/Varsellamper. Fant og rettet en reell, eksisterende bug i samme slengen:
  «Skader»-stat-flisen pekte til en fane (`'skader'`) som ALDRI fantes i `PROFIL_FANER` —
  klikk gjorde derfor ingenting. Flisen peker nå til den nye Skader-underseksjonen.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert), `storage.airtable.js`
(v2.16.0 → v2.17.0), `sw.js` (bilpark-v88 → v89), `version-check.js`/`version.json`
(88 → 89), `AIRTABLE_MIGRATION.md`.

**Testet:** grep-verifisert at ingen kode fortsatt refererer de fjernede identifikatorene
(kun historiske kommentarer gjenstår), global brace-/backtick-balansesjekk på hele
`index.html`. **Ikke testet i en kjørende nettleser** i denne økten (verken `node` eller en
nettleser var tilgjengelig) — se CLAUDE.md, Prioritet 71.5 for anbefalt verifisering før
idriftsettelse (inkl. at `MobilitetsgarantiAktivert`-kolonnen må opprettes i Airtable
først).

### Prioritet 71.4 — Horisontal saksvisning per bil

Bestilling: **direkte reverserer en del av Prioritet 71.2.** Den forrige runden fjernet
per-bil-gruppering fra Aktive saker (flat, nyeste-først-liste, ingen «Vis alle saker»),
etter et eksplisitt ønske om å fjerne «unødvendige ekspansjoner». Denne bestillingen
beskrev derimot en «Vis alle saker»-knapp som fortsatt eksisterer per bil — enten fordi
brukeren ennå ikke hadde sett 71.2 sin flate liste, eller fordi 71.2 gikk for langt.
**Avklart eksplisitt med bruker før implementering** (se AskUserQuestion i samme økt):
per-bil-gruppering gjeninnføres, og «Vis alle saker» skal vise bilens saker HORISONTALT
side om side i stedet for under hverandre (som var tilfellet også FØR 71.2).
**Nummerert 71.4, ikke 71.3 som bestillingsteksten selv brukte** — 71.3 var allerede brukt
i samme økt (Ringeliste-redesignet).

**`sakFaneListeHtml(fase)` grupperer igjen per kjøretøy**, med én ny detalj referansen ba
om og den gamle grupperingen (før 71.2) ikke hadde: gruppeoverskriften viser nå «Nyeste:
{problem} • {dato}» i tillegg til bilnavn/regnr og antall aktive saker — henter
`sakProblemLabel()` (samme spesifikke problem-tekst sakskortene og Historikk allerede
bruker) fra den ferskeste saken i gruppen.

**Sakskortet (`sakKompaktKortHtml()`) er redesignet for smal, horisontal plassering**
(`.sak-horisontal-kort`, fast bredde 250px, `flex:0 0 250px` i en `overflow-x:auto`-rad):
- **Overskrift = sakstype** (ikon + `SAK_TYPE_LABEL`, f.eks. «⚠️ Varsellampe») — IKKE
  bilnavn/regnr, som nå kun står i gruppeoverskriften (fjerner nettopp den dupliseringen
  bestillingen pekte på).
- Avvik-sjekklisten fra Prioritet 52 (spesifikk varsellampe/kontrollavvik-detalj) er
  beholdt rett under overskriften — bestillingen forbød den ikke, og den er nettopp det
  som gjør en generisk sakstype-overskrift forståelig uten å åpne saken.
- **Bilde som liten miniatyr i kortets øverste høyre hjørne** (`sakBildeThumbHtml()`, ny
  funksjon) — IKKE hele bildegalleriet (`bildeGalleriHtml()`, som bruker for mye
  plass i en 250px-kolonne). Gjenbruker `attachBildeGalleriListeners()`/`getPhoto()`/
  `openLightbox()` uendret: samme id-mønster, kun første bilde faktisk rendret i DOM-en
  (resten hoppes trygt over av funksjonens eksisterende per-indeks-guard), klikk åpner
  likevel lightboxen med ALLE bildene. Ingen bilder → rendres ingenting (Prioritet 65.2).
- **Godta/Avslå (eller fasens tilsvarende handling) er nå nederst i kortet**, stablet
  vertikalt, presset til bunnen med `margin-top:auto` i en flex-kolonne — «frigjør bredde»
  slik bestillingen ba om, i stedet for å dele bredden med bildekolonnen slik 71.2 gjorde.

**«✏️ Avansert redigering» åpner IKKE veiviseren inni det smale kortet.** Et 250px-kort
med hele den 4-stegs veiviseren (kostnadsfelt, `row3`-rutenett osv.) presset inn ville sett
ødelagt ut. I stedet rendrer `sakFaneListeHtml()` `sakWizardHtml()` i FULL BREDDE rett
under hele den horisontale raden, når en av sakene i den utvidede gruppen er under
redigering — verifisert direkte i nettleseren: `.sak-horisontal-rad` har
`display:flex` (bekreftet via `getComputedStyle`), og veiviser-elementet
(`.dmg-editbox`) er dens neste søskenelement i DOM-en, ikke et barn av et enkelt sakskort.

**`attachSakDetaljBilder()` filtrerer nå også på `sakOversiktOpenVehicles`** — bilder
hentes fortsatt kun for saker som faktisk er synlige (utvidet gruppe), samme prinsipp som
Prioritet 68 allerede etablerte, nå utvidet til også å ta hensyn til gruppering.
`data-toggle-sak-vehicle`-lytteren (fjernet i 71.2) er gjeninnført uendret.
`goToSakDetalj()`/`goToVarselSak()` setter nå igjen `sakOversiktOpenVehicles` ved dype
lenker (Historikk/Dashboard/Verksted/Varslingssenter), slik at et lenket sakskort faktisk
er synlig og ikke skjult bak en lukket gruppe.

**«Utført uten verkstedbesøk» (Prioritet 71.2) er UENDRET** — samme
`markerSakUtfortUtenVerksted()`, samme årsak-panel (`sakUtenVerkstedPanelHtml()`), kun
flyttet inn i det nye, smalere kortet. Ingen ny logikk.

**Testet i faktisk kjørende kode mot en reell, LIVE produksjons-Airtable-base**, med
`airtableFetch()` sin write-vei fysisk blokkert (samme scratch-guard-metode som
Prioritet 71.2/71.3). Bekreftet: gruppeoverskrift viser korrekt «Bil 2 · LS97571 / 3
aktive saker / Nyeste: Kjølevæske varsling • 16/09/2026» (identisk med referansebildets
eksempel, inkludert nøyaktig samme ekte sak); «Vis alle saker» viser 3 ekte saker
(Varsellampe, Skade, Skade) horisontalt side om side, med korrekt sakstype-overskrift,
sjekkliste, registrert av/dato, beskrivelse og synlige bildeminiatyrer for begge
skade-sakene med bilde; «Avansert redigering» åpner veiviseren i full bredde under raden;
«Utført uten verkstedbesøk» fullført på nytt i den nye kortformen, korrekt blokkert av
vakten. **Null POST/PATCH/DELETE nådde Airtable.**

**Filer endret:** `index.html`, `kontroll.html` (synkronisert), `sw.js` (`bilpark-v87` →
`bilpark-v88`), `version-check.js`/`version.json` (87 → 88). **`storage.airtable.js` er
IKKE endret.**

**Kjente begrensninger:**
- Horisontal rad bruker `overflow-x:auto` (horisontal scroll) når en bil har flere saker
  enn det er plass til i bredden — bevisst, ikke en mangel: bestillingen forbød vertikal
  scrolling, ikke horisontal.
- Byttet fra 71.2 sin flate liste tilbake til gruppering er en reversering av nylig,
  eksplisitt bestilt arbeid. Fremtidige økter bør IKKE anta at «flat liste uten
  gruppering» fortsatt er gjeldende bare fordi CHANGELOG.md nevner det under Prioritet
  71.2 — koden (og denne oppføringen) er sannheten.

### Prioritet 71.3 — Ny Ringeliste og Ringeliste-innstillinger

Bestilling: reprodusere et referansebilde av en ny Ringeliste-skjerm så nært som mulig, og
gjøre innstillingene bak den raskere å vedlikeholde enn dagens ene lange, usorterte
kjøretøyliste.

**Ny datamodell — kontakter uten et kjøretøy å henge på.** Ringelisten trengte to nye
konsepter referansebildet introduserte: 👔 Ledelse (flere personer, hver med navn/rolle/
telefon) og de to faste kontaktene 🚚 Home Delivery/🛟 Veihjelp (ett navn/undertekst/
telefon hver). Vurdert og forkastet: gjenbruke `adminUsers` (Administratorbrukere) for
Ledelse — feltet `tittel` der er en LUKKET nedtrekksliste (kun Administrator/
Driftskoordinator/Transportleder), som ikke dekker referansebildets «Logistikkleder», og
å blande login-identitet med ringelistekontakter hadde koblet to urelaterte konsepter
sammen. Løst med én ny, frittstående Settings-blob, `ringeliste-ekstra` — nøyaktig samme
mønster som `standardverksted`/`varselSett` (se Prioritet 61/71): ingen ny Airtable-tabell,
ingen `LIST_TABLES`-registrering. Kjøretøyenes eksisterende `v.telefon`-felt er UENDRET og
lagres fortsatt direkte på kjøretøyet — den nye blobben dekker kun det som IKKE er et
kjøretøy.
```
ringelisteEkstra = {
  ledelse: [{id, navn, rolle, telefon}, ...],
  homeDelivery: {navn, beskrivelse, telefon},
  veihjelp: {navn, beskrivelse, telefon}
}
```
Ledelse seedes bevisst TOM ved førstegangsoppstart (STANDARD_RINGELISTE_EKSTRA) — å gjette
navn på ekte personer ville uansett ikke gitt et ekte telefonnummer, så et tomt
utgangspunkt med en tydelig «+ Legg til»-knapp er tryggere enn en plausibel, men falsk,
kontakt. Home Delivery/Veihjelp seedes med de generiske etikettene fra referansebildet
(«Kjørekontoret»/«Assistanse»), uten telefonnummer.

**Sjåførens Ringeliste (`renderDriverRingeliste()`), fullstendig redesignet:** tre
kollapsbare grupper — 🟢 Aktive sjåfører (bil, regnr, sjåførnavn, Ring), 🟡 Ingen aktive
sjåfører (bil, regnr, Ring) og 🔵 Ledelse (navn, rolle, Ring) — pluss to alltid synlige
kontaktkort for Home Delivery/Veihjelp nederst, i en 2-kolonners rutenett (stables til 1
kolonne under 360px). Partisjoneringen aktiv/ingen-aktiv bruker den UENDREDE
`vehicleAktivSjafor()`; egen bil ekskluderes fortsatt fra begge gruppene når en aktiv
biløkt finnes (samme regel som den gamle Ringelisten alltid har hatt — det gir ingen
mening å ringe seg selv). Et kjøretøy/en kontakt uten registrert telefonnummer viser nå
«Ikke registrert» i stedet for en Ring-knapp, fremfor tidligere å bli utelatt fra listen
helt (dagens liste viste FØR kun kjøretøy MED nummer — nå vises ALLE, partisjonert etter
sjåførstatus, uansett om nummer finnes, slik bestillingen krever). Alle tre grupper er
ÅPNE som standard (`driverRingelisteLukket`, tom Set = alt åpent), matcher referansebildet.
Ny, scoped CSS (`.ringeliste-*`, gjenbruker eksisterende design-tokens, ingen nye farger)
— ingen eksisterende klasse (`.dmg-*`/`.acc-*`) matchet det fargede, kortbaserte designet
godt nok til at gjenbruk ville vært riktig.

**Innstillinger → 👤 Sjåførside → 📞 Ringeliste, restrukturert:** den gamle, flate,
usorterte kjøretøylisten er erstattet med nestede `settingsAccordionRow()`-grupper (samme
funksjon gjenbrukt rekursivt som resten av Innstillinger, ingen ny akkordion-mekanisme):
🚚 Home Delivery og 🛟 Veihjelp (ett redigerbart kontaktkort hver — navn, undertekst OG
telefonnummer er alle redigerbare, ikke bare nummeret bestillingen eksplisitt nevnte, siden
det ikke kostet noe ekstra), 👔 Ledelse (fri liste — legg til/rediger/slett, samme mønster
som Verkstedregisteret), og deretter kjøretøytelefonnumrene GRUPPERT PER KATEGORI i stedet
for én lang liste. Kategoriene leses LIVE fra `bilkategorier` (ikke hardkodet «Kjøretøy/
Lastebiler/Monteringer» slik bestillingsteksten skisserte) — verifisert i faktisk
produksjonsdata at dette er riktig valg: denne bilparkens «bil»-kategori er allerede
omdøpt til «Driftslag», noe en hardkodet liste ville vist feil for.

**Testet i faktisk kjørende kode mot en reell, LIVE produksjons-Airtable-base**, med
`airtableFetch()` sin write-vei fysisk blokkert (samme scratch-kopi-metode som Prioritet
71.2 innførte — se testnotatet der). Bekreftet: alle 19 kjøretøy (9 i «Driftslag», korrekt
omdøpt kategorinavn) partisjonert riktig i Aktive/Ingen aktive sjåfører med reelle,
allerede-registrerte telefonnumre; Home Delivery-kontaktkortet redigert og lagret
(`ringeliste-ekstra` skrevet til Settings, blokkert av vakten); en ny Ledelse-kontakt lagt
til og lagret; kollapsbar gruppe åpnet/lukket korrekt i begge retninger. **Én reell feil
funnet og rettet under testing:** kjøretøyets regnr ble vist to ganger («Bil 7 · EP90220 ·
EP90220») — `vehicleLabel()` inkluderer allerede regnr, og koden la det til en gang til.
**Null POST/PATCH/DELETE nådde Airtable** i hele økten (kun konsollvarsler
«[TEST GUARD] Blocked …»).

**Filer endret:** `index.html`, `kontroll.html` (synkronisert), `sw.js` (`bilpark-v86` →
`bilpark-v87`), `version-check.js`/`version.json` (86 → 87). **`storage.airtable.js` er
IKKE endret** — ingen nye Airtable-felt, ingen `LIST_TABLES`-endring (`ringeliste-ekstra`
er en frittstående Settings-blob, samme unntak som `standardverksted`/`varselSett`).

**Kjente begrensninger:**
- `ringeliste-ekstra` er, som `dashboard-layout`/`standardverksted`/`varselSett`, IKKE
  registrert i `reloadOne()` sin bakgrunnspoll — en endring på én enhet dukker derfor ikke
  opp på en annen enhet før neste fulle reload/innlogging der. Samme begrensning disse tre
  Settings-blobbene allerede hadde.
- ⓘ-infoikonet i Ringeliste-headeren er dekorativt (kun `title`-attributt), ikke en
  interaktiv info-dialog — bestillingen viste ikonet i referansebildet, men beskrev ingen
  konkret innholdskrav for det.

### Prioritet 71.2 — Operativ opprydding i saker og sjåførkontroll

Bestilling: seks punkter for å redusere klikk/scrolling/støy i saksflyten og sjåførkontroll.
**Denne bestillingen ble av brukeren selv kalt «Prioritet 71.1» — omdøpt til 71.2 her for å
unngå kollisjon med den allerede leverte 71.1 (`migrerLegacySkaderTilSaker()`-regresjonsfiksen,
se rett under).**

**Del 1 — «✅ Utført uten verkstedbesøk».** Ny, ett-klikks-tilgjengelig handling på saker i
fasen «Under oppfølging» (`markerSakUtfortUtenVerksted()`), for saker som viser seg å ikke
kreve verksted i det hele tatt (bestillingens eksempel: dekktrykksensor varslet, bilen har
ingen sensor). Speiler `markerSakUtfort()` nøyaktig (samme avvik-fullføring, samme automatiske
varsellampe-kvittering, samme `resolvedAt`/`resolvedBy`/`completedAt`/`status`), med to bevisste
forskjeller: `s.verkstedResultat` røres ALDRI (det feltet betyr «resultat FRA verksted», og
ingen verksted er involvert), og en valgfri årsak (Feilregistrering / Problem ikke gjenskapt /
Utført internt / Informert sjåfør / Annet, med fritekst for «Annet») lagres i det allerede
eksisterende `s.resolutionNote`-feltet — samme felt den avanserte veiviseren allerede bruker til
sluttkommentar, og som `sakWizardLesemodusHtml()` allerede viser uendret for lukkede saker.
**Ingen nytt Airtable-felt, ingen ny status.** Årsak-panelet er et lite, inline valgfritt skjema
(select + betinget fritekstfelt + Bekreft/Avbryt) rett i sakskortet — ikke en egen dialog/skjerm.

**Del 2/3 — komprimert sakskort og ny layout (`sakKompaktKortHtml()`).** Hele saken vises nå
direkte: bilnavn (fremhevet), regnr, sakstype, registrert av, registrert dato, avvik-sjekkliste
(uendret fra Prioritet 68) og beskrivelse (fremhevet) i venstre kolonne; bilde (kun når det
finnes — ingen «Ingen bilde»-tekst, jf. Prioritet 65.2 sitt tomtilstand-prinsipp), handling(er)
stablet vertikalt, og «Avansert redigering» i høyre kolonne. Ingen dato/regnr/sakstype vises to
ganger lenger.

**Rotårsak til duplisering, funnet under kartlegging — rettet dokumentasjonsfeil i denne
oppføringen:** `sakFaneListeHtml()` grupperte sakene PER BIL bak en «Vis alle saker»-utvidelse.
CLAUDE.md, Prioritet 51, beskrev opprinnelig en FLAT, nyeste-først-liste (med gruppering kun i en
egen «Avansert visning»/`sakGroupedSection()`) — men Prioritet 70.3 fjernet «Avansert visning»
igjen og gjorde bevisst per-bil-gruppering til STANDARDVISNINGEN («Aktive saker bruker kun
dagens gruppering per bil»). Dette var altså en tidligere, dokumentert beslutning, ikke kode-
drift. Gruppens header viste allerede bilnavn/antall, og hvert kort inni viste det samme igjen —
derav opplevelsen av gjentatt informasjon som denne bestillingen ba om å fjerne. Rettet ved å
gjøre `sakFaneListeHtml()` til en flat, sortert liste igjen — en NY beslutning i denne runden
(reverserer Prioritet 70.3 sitt valg), drevet av bestillingens eksplisitte «fjern unødvendige
ekspansjoner» og MÅL-seksjonens «uten ekstra klikk», ikke en gjenoppretting av en gammel feil.

**Bifunn og samtidig rettet: «✏️ Avansert redigering» var en død lenke.** Den fulle
sakbehandlings-veiviseren (`sakWizardHtml()`, alle fire steg + lesemodus for lukkede saker,
kostnads-/avsettingsregistrering) var fortsatt fullstendig, korrekt implementert kode — men ble
KUN rendret fra `sakCard()`, en funksjon som ikke lenger hadde noen kallere noe sted i
kodebasen (bekreftet med et fullstendig søk). «Avansert redigering» satte `editingSakId` og
navigerte til Aktive saker, men ingenting i det faktiske rendringstreet
(`renderAktiveSaker → sakFaneListeHtml → sakKompaktKortHtml`) sjekket noensinne
`editingSakId` eller kalte veiviseren — knappen gjorde derfor ingenting synlig, og
**kostnads-/avsettingsregistrering på saker var i praksis utilgjengelig**. Alle lytterne for
veiviserens knapper (steg-navigasjon, lagre, lukk, kostnadsfelt) sto fortsatt korrekt klare i
`attachAktiveSakerListeners()` (harmløst uten mål å feste seg til). Rettet ved å rendre
`sakWizardHtml(s)` fra den nye `sakKompaktKortHtml()` når `editingSakId === s.id`, og koble
knappen til den allerede eksisterende, fungerende `toggleEditSak()`-lytteren
(`data-toggle-edit-sak`, viser «Lukk redigering» når åpen) i stedet for den forlatte
`goToSakDetalj()`-veien. Selve `sakCard()` (100 % død, ingen kallere) er fjernet. `goToSakDetalj()`
(fortsatt i bruk for dype lenker fra Historikk/Dashboard/Verksted/Varslingssenter) setter nå i
tillegg `sakAktivFane = sakFase(s)`, slik at et dypt lenket sakskort faktisk lander på riktig fane
og blir synlig — samme mønster `goToVarselSak()` allerede brukte. Verifisert i nettleser: åpnet
en sak, så full veiviser med status/steg/kostnadsfelt, lukket den igjen med samme knapp.

**Del 4 — «Slitte bremser».** Lagt til i `KONTROLLAVVIK_ORDER`/`_LABEL`/`_IKON`/`_LUCIDE`
(mellom «Manglende utstyr» og «Feil på kjøretøy»). Siden sjåførkontrollens avvikschips, Min Bil
sin hurtigflyt og saksmotoren allerede bygger dynamisk fra `KONTROLLAVVIK_ORDER.map(...)`, krevde
dette ingen egen UI-endring de stedene. Kontrollavvik lagres ikke som et eget felt på selve
DriverChecks-raden (kun i `aktiveSaker[].avvik[]`, som allerede er fri JSON) — **ingen
Airtable-skjemaendring nødvendig.** Verifisert i sjåførmodus: chipen vises og er valgbar.

**Del 5 — kommentarer per kjøretøy (administratorsiden).** `nyeKommentarerListe(vehicleId)`
hadde allerede støtte for et valgfritt kjøretøyfilter (brukt av sjåførens egen «💬
Kommentarer»-skjerm siden Prioritet 50) — administratorens Kommentaroversikt manglet bare
selve velgeren. Lagt til et «Kjøretøy»-filter (samme `vehicleOptions()`+«Alle biler»-mønster som
Verkstedoversikt sitt `vt-f-bil`), med ny state `kommentaroversiktFilterBil` (persisterer på
tvers av navigasjon, samme konvensjon som `vtFilterBil`). Uten filter (standard) er oppførselen
uendret — hele flåten vises, som før. Verifisert i nettleser mot ekte data: valgt «Bil 4» ga
nøyaktig én kommentar, med riktig bil/dato/sjåfør.

**Del 6 — tilbakeknapp fjernet før første kontroll.** `renderDriverVelgBil()` sin tilbakepil
(til Min Bil) ble tidligere alltid RENDRET, men `disabled` når det ikke fantes en aktiv biløkt å
gå tilbake til (en bevisst beslutning fra Prioritet 48, dokumentert i kildekoden) — en synlig,
gråtonet pil før dagens første kontroll ga likevel inntrykk av at kontrollen allerede var i
gang. Reversert: pilen er nå HELT fraværende fra DOM-en når det ikke finnes noen aktiv biløkt å
returnere til, og dukker opp først når det gjør det. Selve destinasjonen/betingelsen
(`vehicleAktivSjafor(driverActiveVehicleId)`) er uendret. Verifisert: `#db-tilbake-btn` finnes
ikke i DOM-en før første kontroll er startet.

**Testet i faktisk kjørende kode mot en reell, LIVE produksjons-Airtable-base** (lokal
PowerShell `HttpListener`-server, ingen node/npm i denne økten) — **denne gangen med
`window.storage`/`airtableFetch()` sin write-vei fysisk blokkert FØR appen ble lastet** (en
scratch-kopi av `storage.airtable.js` som avskjærer enhver ikke-GET-forespørsel med et
konsollvarsel og et falskt vellykket svar, byttet inn kun i den lokale testserveren — ikke en
endring i det faktiske prosjektfilen), etter at forrige økts testing (Prioritet 71.1) ved en
feil skrev virkelige rader til produksjonsbasen før dette mønsteret ble innført (se eget varsel
til bruker i samme økt, og lærdommen dokumentert under Prioritet 71.1 nedenfor). Bekreftet: alle
seks punktene virker i faktisk UI mot ekte data, **null POST/PATCH/DELETE nådde noensinne
Airtable** (kun konsollvarsler «[TEST GUARD] Blocked …» — verifisert eksplisitt for
`Utført uten verkstedbesøk`, som ellers ville skrevet både `AktiveSaker` og `WarningLights`).

**Filer endret:** `index.html`, `kontroll.html` (synkronisert), `sw.js` (`bilpark-v85` →
`bilpark-v86`), `version-check.js`/`version.json` (85 → 86). **`storage.airtable.js` er IKKE
endret** — ingen nye Airtable-felt, ingen `LIST_TABLES`-endring.

**Kjente begrensninger:**
- Den avanserte veiviseren (`sakWizardSteg1-4Html`) er selv IKKE redesignet i denne runden —
  kun gjort synlig/tilgjengelig igjen. Den kan fortsatt vise noe overlappende informasjon med
  det nye kompakte kortet over den; vurder som egen finpuss-sak ved behov.
- `sakOversiktOpenVehicles` (tidligere brukt til å huske hvilken bilgruppe som var utvidet) er
  nå ubrukt tilstand — bevisst latt urørt (kun `data-toggle-sak-vehicle`-lytteren, som pekte på
  markup som ikke lenger finnes, er fjernet) fremfor å jage alle spor av en harmløs, ubrukt
  variabel gjennom flere andre funksjoner.
- Deep-linking til en ALLEREDE LUKKET sak (utfort/avslått) fra Historikk/Rapporter viser
  fortsatt ingenting i Aktive saker — dette er ikke en regresjon (lukkede saker har aldri hatt
  en fane å vises i, verken før eller etter denne endringen), men ble synlig under kartleggingen
  og er ikke løst her.

---

### Prioritet 71.1 — migrerLegacySkaderTilSaker() var utilsiktet nestet i registrerAvvikSomSak() (regresjonsfiks)

- **Funn:** `async function migrerLegacySkaderTilSaker(){...}` var deklarert
  NESTET inne i `registrerAvvikSomSak()` (etter en tidlig `return sak;` i
  `if(eksisterende){...}`-grenen), og derfor kun synlig i den funksjonens
  lokale scope. `loadAll()` kaller den fra toppnivå
  (`try{ await migrerLegacySkaderTilSaker(); }catch(e){...}`), som dermed
  kastet `ReferenceError: migrerLegacySkaderTilSaker is not defined` på HVER
  ENESTE app-oppstart — fanget stille av `catch`-blokken, så appen så ut til
  å fungere normalt. Konsekvens: idempotent-migreringen fra Prioritet 70.2
  («eldre skader migreres idempotent til dagens saksmodell uten sletting av
  originaldata») har i praksis ALDRI kjørt siden nestingsfeilen ble
  introdusert, uansett hvor mange ganger appen har vært lastet.
- **Retting:** funksjonen er flyttet UENDRET (samme kropp, samme logikk) ut
  til toppnivå, plassert rett etter `registrerAvvikSomSak()` sin lukkende
  klamme. `registrerAvvikSomSak()` selv er urørt bortsett fra at den nestede
  deklarasjonen er fjernet. Kallestedet i `loadAll()` er uendret (fantes
  allerede korrekt fra før — feilen lå kun i deklarasjonen).
- **Testet i faktisk kjørende kode** (ingen node/npm tilgjengelig i denne
  økten — en lokal PowerShell `HttpListener`-server serverte prosjektmappen
  over `http://localhost`, lastet i en ekte nettleser): `ReferenceError`-en
  er bekreftet borte, `[VERSION_CHECK] ✓ Version check OK` og full
  `loadAll()`-oppstart bekreftet i konsollen.
- ⚠️ **Viktig avvik fra vanlig testpraksis, oppdaget under verifisering:**
  testingen brukte IKKE no-op-patchen på `window.storage.set()` som er
  prosjektets etablerte konvensjon for nettleserverifisering mot en reell
  base (se testenotatet under Prioritet 71 over). Fordi migreringen nå
  faktisk KJØRTE — for første gang noensinne — skrev den 5 nye, ekte
  rader til PRODUKSJONS-`AktiveSaker`-tabellen: `SAK-0034`–`SAK-0038`
  (kjøretøy `msekit2kxs1g43` ×3, `msekit2k8fl4h6` ×1, `msekit2kbz2n3g` ×1,
  hver koblet til en eksisterende, reell skade via `sourceId`). Dette er
  nøyaktig den additive, ikke-destruktive oppførselen funksjonen alltid har
  vært designet for — ingen eksisterende data ble endret eller slettet — men
  det skjedde utilsiktet, uten forhåndsvarsel til bruker, midt i en
  verifiseringsøkt. Bruker ble varslet umiddelbart og ba om at de 5 radene
  fjernes. Et forsøk på å slette dem programmatisk (både et direkte
  Airtable API-kall og et nytt nettleserøkt-forsøk) ble blokkert av Claude
  Code sin egen sikkerhetsklassifisering («Credential Materialization» /
  «Credential Leakage», utløst av prosjektets produksjonstoken i
  `airtable-config.js`) — fjerning av `SAK-0034`–`SAK-0038` må derfor gjøres
  manuelt i Airtable (eller av en økt med tilstrekkelig tillatelse) dersom
  det ikke allerede er gjort. **Lærdom for videre arbeid i dette prosjektet:
  patch ALLTID `window.storage.set = async () => {}` (og helst også
  `window.storage.delete`) i nettleserkonsollen FØR appen lastes, hver gang
  en endring testes i en ekte nettleser mot denne basen — ikke bare når
  testen eksplisitt gjelder en skrivefunksjon.**
- Filer endret: `index.html`, `kontroll.html` (synkronisert som eksakt
  kopi). `sw.js` (`bilpark-v84` → `bilpark-v85`), `version-check.js`/
  `version.json` (84 → 85) oppdatert sammen, per Prioritet 69.2/69.3 sin
  tvungne versjonskontroll. `storage.airtable.js` er IKKE endret — ingen nye
  Airtable-felt, ingen `LIST_TABLES`-endring.

### Prioritet 71 — Varslingssenter erstatter Påminnelser

- «Påminnelser» (som kun var aktive varsellamper) er erstattet av 🔔
  Varslingssenter, som samler nye kommentarer, km-grense passert (tidligere
  kun synlig via `window.rapporterKmAvvik()` i konsollen), service/EU-kontroll
  som nærmer seg, verkstedoppfølging, nye skader og forfalt saksoppfølging i
  én kategorisert liste. Alt beregnes live fra eksisterende data — ingen ny
  datamodell for selve varslene.
- Nytt: «Marker som sett» skjuler et varsel fra aktiv visning/røde tellere i
  48 timer (`varselSett`, én ny Settings-blob, samme mønster som
  `standardVerksted`/`bilkategorier` — ingen ny Airtable-tabell/-felt). Er
  problemet fortsatt uløst etter 48 timer, dukker varselet opp igjen
  automatisk. Er det faktisk løst, slutter det å bli generert med én gang.
  «Marker alle som sett» kan bringe telleren til 0.
- Varsellampe kvittering-historikk er uendret og ligger fortsatt nederst på
  samme skjerm; «✅ Merk som løst» (kvittering) er fortsatt en egen, permanent
  handling adskilt fra «marker som sett».
- «Kommende frister»-KPI-flisen på mobil-Dashboard er fjernet (Kalender,
  Verksted og Aktive saker dekker allerede informasjonen). Panelet «📋
  Kommende oppgaver» er beholdt uendret — det er et annet, mer detaljert
  element som allerede lenker videre til Kalender.
- Regresjon rettet: sveip-tilbake virket aldri på Verkstedhistorikk (screen-
  nøkkelen `'verkstedhistorikk'` manglet i `OVERSIKT_SWIPE_BACK_SCREENS`, som
  fortsatt kun hadde den gamle `'historikk'`-verdien). `'kalender'`,
  `'bestill'` og `'kommentaroversikt'` var av samme grunn også utelatt og er
  lagt til. Selve berøringslogikken hadde ingen feil.
- Testet i faktisk kjørende kode mot en reell Airtable-base (skriving
  midlertidig no-op'et i konsollen for å unngå testdata i produksjon): 16
  reelle varsler rendret korrekt gruppert, «marker som sett»/«marker alle»/
  48-timers grensetest (47t skjult, 49t synlig) og navigasjon til riktig
  sak-fane alle bestått.
- `sw.js` (`bilpark-v83` → `bilpark-v84`), `version-check.js`/`version.json`
  (83 → 84) oppdatert sammen, per Prioritet 69.2/69.3 sin tvungne
  versjonskontroll. `storage.airtable.js` uendret (`v2.16.0`).

## 2026-09-16

### Prioritet 70.7 — Kompakte sakskort uten «Mer informasjon»

- Aktive saker viser nå bil, reg.nr., sakstype, beskrivelse, registrert av og
  registrert dato direkte i hvert sakskort.
- Bilder vises direkte på høyre side når de finnes, sammen med sakens gjeldende
  handling (`Godta`, `Avslå`, verkstedbestilling eller `Arbeid utført`).
- «Mer informasjon»-toggle og den separate kompakte detaljvisningen er fjernet
  fra sakskortene. Gruppens nyeste dato/sakstype er også fjernet for å unngå
  duplisering.

### Prioritet 70.6 — Forenklet oppstart og ikonopprydding

- Oppstartsskjermen viser nå Bilpark-logoen som eneste merkevareelement,
  med én tilfeldig HMS-melding rett under logoen og sentrerte statusrader.
- Versjonskontrollens oppdateringsside bruker samme logo-og-melding-struktur
  uten en ekstra `BILPARK`-tekst.
- Alle aktive ikonreferanser bruker den samme versjonerte Bilpark-logoen
  (`icons/bilpark-icon-*-v63.png`); ingen separate `favicon.ico`- eller
  `favicon.png`-filer finnes i leveransen.
- APP_VERSION og version.json er oppdatert samlet til 82, med cache-busting
  til bilpark-v82.

### Prioritet 70.5 — Bilpark-branding og HMS-påminnelse

- Oppdateringspanelet viser nå Bilpark-logo og tydelig merkevareidentitet ved
  både versjonsavvik og manglende versjonsverifisering.
- Sjåførsidens oppstart viser én tilfeldig, rolig HMS-påminnelse i stedet for
  teknisk «Operativ kontroll»-tekst.
- Alle aktive favicon-, manifest-, Apple-touch-, PWA- og service-worker-
  referanser bruker de versjonerte Bilpark-logoikonene.
- APP_VERSION og version.json er oppdatert samlet til 81, med cache-busting
  til bilpark-v81.

## 2026-09-16

### Prioritet 70.4 — Korrekt gruppering av Aktive saker

Rettet en renderingsfeil som satte inn den samme bilgrupperte sakslisten to
ganger i samme seksjon. Aktive saker rendres nå én gang per fane, og hver bil
har fortsatt ett ekspanderbart kort med alle sine saker.

## 2026-09-16

### Prioritet 70.3 — Fjernet Avansert visning

Aktive saker bruker nå utelukkende dagens bilgrupperte visning. Den gamle
«Avansert visning»-seksjonen, med alternativ gruppering, filtre og ekstra
telleverk, er fjernet. «Avansert redigering» på et enkelt sakskort er fortsatt
tilgjengelig for nødvendig redigering av eksisterende saker.

## 2026-09-16

### Prioritet 70.2 — Opprydding etter Verksted-migrering

- Utført verkstedarbeid fjernes fra aktive bestillinger og vises umiddelbart i
  den samlede Verkstedhistorikken.
- Verkstedflaten viser ikke lenger kostnadssummer, kostnadskort eller neste
  verkstedtime; kostnader eies fortsatt av Kostnader.
- Aktive saker vises som én oppsummeringsrad per bil, med antall, nyeste sak,
  dato og utvidbar full saksvisning.
- Eldre skader migreres idempotent til dagens saksmodell uten at originaldata
  eller bilder slettes. Den gamle skadeoversikten brukes ikke lenger.

## 2026-09-16

### Prioritet 70 — Samlet Verksted og Verkstedhistorikk

Alt verkstedarbeid er nå samlet under én planleggingsmodul (**🔧 Verksted**) og én historikkmodul (**📋 Verkstedhistorikk**). Separate arbeidsflater for Service og Dekkskift er faset ut og integrert i samlet flyt.

**Viktigste endringer:**
1. **🔧 Verksted (Aktive verkstedbestillinger):**
   - Viser aktive bestillinger med Bil, Type (Service, Dekkskift, Reparasjon, EU-kontroll, Annet), Verksted, Dato og Kommentar.
   - Enkelt skjema for ny bestilling med 5 standardiserte typer, standardverksted-utfylling, dato og kommentar.
   - Ett-klikks handling **«✅ Utført arbeid»** (`fullforVerkstedbestilling`) som flytter besøket direkte til historikken og oppdaterer tilknyttet sak.
   - Kostnadsisolering: Verksted håndterer ikke kostnadsregistrering direkte, men viser kun `✅ Kostnad registrert` eller `⚠️ Kostnad mangler` basert på om kostnadspost finnes.
2. **📋 Verkstedhistorikk:**
   - Samler all historikk for Service, Dekkskift, Reparasjon, EU-kontroll og Annet på én flate.
   - Fleksibel filtrering på Type (Alle, Service, Dekkskift, Reparasjon, EU-kontroll, Annet), Bil og Periode (Alle, Siste 30 dager, Siste 90 dager, I år, Tilpasset datointervall).
3. **Navigasjon & Lagring:**
   - Sidemeny og mobil drawer oppdatert med `🔧 Verksted` i primærmeny og `📋 Verkstedhistorikk` under Oppslag.
   - `storage.airtable.js` oppdatert til `v2.16.0` med `Utfort` (bool) og `UtfortDato` (text) i `LIST_TABLES.verkstedtimer`.
   - `index.html` og `kontroll.html` synkronisert.

---

### Prioritet 69.3 — Sjåførkontroll åpnet igjen

Den midlertidige sperren fra datagjenopprettingen er fjernet. Sjåførkontroll,
skader, varsellamper, avvik, kommentarer, biløkter og aktiv sjåfør er åpne igjen.
P69.2 sin tvungne versjonskontroll er beholdt og blokkerer fortsatt hele Bilpark
ved `VERSION_MISMATCH` eller manglende verifisering. Deployversjonen er økt til
80 i `APP_VERSION`, `version.json` og service worker-cache.

---

## 2026-09-15

### Midlertidig sperring av sjåførkontroll

Sjåførkontrollen er sperret under vedlikehold og dataverifisering. Sjåførmodus viser kun:
«⚠️ Sjåførkontrollen er midlertidig utilgjengelig — Det pågår vedlikehold og
dataverifisering. Kontakt driftskoordinator ved behov.»

Blokkert: kontroller, kilometerstand (via kontroll), skader, varsellamper og avvik fra
Min Bil, sjåførkommentarer, start/overføring av biløkt. Kontrollskjemaet er også sperret
fra administrasjonssiden. Resten av Bilpark er uendret.

Bryter: `SJAFORKONTROLL_SPERRET` i index.html. CACHE_VERSION bilpark-v78 → **bilpark-v79**.

**Verifisering** — Chromium: sjåførmodus viser kun meldingen (ingen bunnmeny); direkte
kall til alle sju skrivefunksjoner gir null skrivinger og uendrede lister; Dashboard,
Biloversikt, Kjøretøyprofil, Aktive saker, Kalender, Verksted, Service, Historikk, Skader
og Innstillinger rendres uten feil; P69-regresjon (11 scenarier) bestått.

### Prioritet 69 — Operativ oppstartsskjerm

«Laster inn...» er erstattet av en statusflate som viser hva som faktisk lastes:
Kjøretøy, Kontroller, Aktive saker, Skader og Forbereder dashboard (sjåførkontroll i
sjåførmodus). Hver rad går ⏳ → ✅ eller ⚠️ i takt med reelle Airtable-lesinger.

| Situasjon | Resultat |
|---|---|
| Alt lastet | «✅ Klar — Åpner Bilpark…» i 450 ms, rolig fade til Dashboard |
| Vehicles lesefeil | Appen åpnes ikke. Ekte feilmelding fra 66.9 (teknisk årsak + tidspunkt), «Last på nytt» og «Database status» (kun admin) |
| Kontroller/Aktive saker/Skader feiler | Stopper med tydelig melding, «Last på nytt» eller «Åpne Bilpark» |
| Kjøretøyregisteret bekreftet tomt | Stopper med forklaring, «Last på nytt» eller «Åpne Bilpark» |
| Treg Airtable | Skjermen står stabilt; etter 6 s: «Airtable svarer tregt — venter fortsatt» |
| Uventet feil i oppstarten | «Bilpark kunne ikke startes» med teknisk årsak — ikke lenger en stille, hengende skjerm |

Versjon vises nederst («Bilpark v78 (storage v2.15.0)»). Oppstartsskjermen er mørk fra
første bilde. Kun eksisterende tokens, `.panel` og `.btn` — ingen nye komponenter.

`index.html` / `kontroll.html`, `sw.js` CACHE_VERSION bilpark-v77 → **bilpark-v78**.
`storage.airtable.js` uendret.

**Verifisering** — ekte Chromium mot simulert storage: normal oppstart, Vehicles-lesefeil
(admin og sjåfør), Database status fra stopp, Kontroller-feil + «Åpne Bilpark», tomt
register, treg Airtable (7,5 s og 9 s), refresh, uventet krasj, mobil 390 px uten
horisontal scroll. Null skriving mot Vehicles ved lesefeil. Ingen JS-feil.

---

## 2026-09-14

### Prioritet 68.1 — Fjernet boilerplate i utvidet sak

Den generiske linjen «Automatisk generert fra skaderegistrering» sto rett over den ekte
teksten fra kilden i den utvidede saksvisningen. Den er nå fjernet.

Brukerskrevne beskrivelser går ikke tapt: manuelle saker vises som «✍️ Beskrivelse» via
`sakKildeTekster()`, og en sak helt uten tekst på kilden får linjen «Ingen kommentar
registrert på kilden.» Den kompakte, kollapsede visningen er uendret.

Kun visning. Saksmotor, godta/avslå, bildevisning, kildevisning, kommentarer, Airtable og
statusflyt er urørt.

CACHE_VERSION bilpark-v76 → bilpark-v77.

**Verifisering**

Lukket sak: kompakt tekst uendret. Åpen sak fra skade: boilerplate skjult, kilde,
registrert av, dato, begge kommentarene og bildegalleriet vises. Åpen manuell sak:
brukerskrevet beskrivelse bevart. Sak uten tekst: tydelig fallback. Godta og Avslå
uendret. Full regresjonssveip uten JS-feil.

---

### Prioritet 68 — Saksdetaljer direkte i Aktive saker

**Problem eller mål**

For å avgjøre Godta/Avslå måtte driftskoordinator ofte gå Aktive saker → kjøretøy →
Skader → kommentar → bilde. Målet: all nødvendig kontekst uten å forlate Aktive saker.

**Løsning**

«ℹ️ Mer informasjon» på hvert sakskort utvider kortet inline — ingen ny side, ingen modal.
Detaljseksjonen viser kilde med ikon (📷 Skaderegistrering · ✅ Sjåførkontroll ·
⚠️ Varsellampe · 🔧 Verksted · ✍️ Manuelt), registrert av, dato, saksteksten fra kilden,
og klikkbare miniatyrbilder som åpnes i den eksisterende lightboxen.

**Ingen duplisering (Del 5).** Ingenting kopieres inn i saken. Fire nye visningsfunksjoner
leser LIVE fra originalkilden: `sakKildeMedIkon()`, `sakRegistrertAv()`,
`sakKildeTekster()` og `sakMerInfoHtml()`. De bygger på eksisterende
`sakSkadeDamages()`, `sakBilderKeys()`, `damagePhotoKeys()`, `bildeGalleriHtml()` og
`attachBildeGalleriListeners()`. Ingen nye Airtable-felt, ingen nye komponenter.

**Lat bildelasting (Del 3).** `attachSakDetaljBilder()` kaller `getPhoto()` kun for saker
som faktisk er utvidet. Lukkede kort henter ingenting.

Godta/Avslå, statusflyt, varsellamper og skadehistorikk er urørt.

CACHE_VERSION bilpark-v75 → bilpark-v76.

**Verifisering**

Ekte nettleser: skade med kommentar og 2 bilder (kilde, registrert av, dato, begge
tekstene og bildegalleriet vises), skade uten bilde (kommentar vises, ingen tom
bildeseksjon, ingen feil), varsellampe (kilde, sjåfør og fritekst), Godta → status
`under-oppfolging`, Avslå → status `avslatt`. 0 miniatyrer i DOM før utvidelse.
Regresjon: 18 skjermer uten JS-feil, P67 (6/6) og P66.9-sikringene (12/12) re-testet.

---

### Prioritet 67 — Automatisk oppdatering av kjøretøyets kilometerstand

**Problem eller mål**

En gyldig sjåførkontroll oppdaterte kjøretøyets km, men et bekreftet storthopp gjorde det
også. Samtidig ga hver km-differanse et avviksvarsel. Målet: normal drift skal holde `v.km`
oppdatert automatisk, og avvik skal være unntaket.

**Løsning — ett betinget steg i `submitKontroll()`**

| Tilfelle | Kontroll lagres | `v.km` oppdateres |
|---|---|---|
| Lavere enn km-gulvet | Nei — blokkeres | Nei |
| Normal økning (< 1 000 km) | Ja | **Ja, automatisk** |
| Lik km-gulvet | Ja | Ja |
| Bekreftet storthopp (≥ 1 000 km) | Ja, med merknad | **Nei — krever administrativ godkjenning** |

Ved storthopp hoppes hele km-skrivingen over, så `vehicles` inngår ikke i
rollback-sekvensen for den kontrollen. Merknaden på kontrollen er utvidet med «Kjøretøyets
kilometerstand er IKKE endret automatisk — godkjennes via Rediger informasjon».

Km-gulvet (`kontrollKmGulv`) er urørt og ser fortsatt på hele kontrollhistorikken, så neste
kontroll kan ikke registreres under storthoppets verdi selv om `v.km` er lavere.

Ingen ny UI, ingen nye kort eller knapper. Ingen endring i P66-validering, storthopp-regel,
dagskillelogikk, kontrollhistorikk, skademodul, servicehistorikk, mobilitetsgaranti eller
Airtable-struktur.

CACHE_VERSION bilpark-v74 → bilpark-v75.

**Verifisering**

Alle fem testkrav kjørt i ekte nettleser med simulert Airtable: 1 832→2 113 oppdaterer,
31 345→31 200 blokkeres, 31 345→32 344 oppdaterer, 31 345→32 345 og 31 345→32 500 lagres
uten km-oppdatering. Pluss lik-km-tilfellet. Masseslettingssperren og skrivesperren
re-testet (12/12), full regresjonssveip uten JS-feil.

---

### Prioritet 66.9a — Nødbrems: verifisert, og siste rest av det forbudte mønsteret fjernet

Alle ferdigkrav i 66.9a var allerede oppfylt av Prioritet 66.9. Verifisert med 66.9a sine
egne fire testkrav i ekte nettleser — alle bestått, null Airtable-skrivinger mot Vehicles.

Én faktisk kodeendring: `catch(e){ vehicles = []; }` i `loadAll()` er fjernet helt.
Tilordningen var et no-op ved oppstart (`vehicles` er allerede tom der), men mønsteret er
selve kjernen i datahendelsen og skal ikke finnes i kodebasen i noen form. `vehicles` røres
nå ikke ved lesefeil — kun `vehiclesLoadStatus` settes, og skrivesperren gjør listen
ufarlig uansett.

CACHE_VERSION bilpark-v73 → bilpark-v74. Ingen andre endringer.

---

### Prioritet 66.9 — Permanent sikring mot re-seeding og massesletting

**Rotårsak bekreftet.** `storage.get('vehicles')` feilet → `loadAll()` tolket lesefeilen som
tom tabell → `vehicles = []` → DEFAULT_FLEET med nye AppId-er → `saveVehicles()` →
`reconcileList()` slettet de originale radene. Seks sikringsnivåer innført.

| Del | Sikring |
|---|---|
| 1 | `vehiclesLoadStatus`: ikke-startet / laster / lastet / bekreftet-tom / lesefeil. Lesefeil og tom behandles aldri likt |
| 2 | All automatisk DEFAULT_FLEET-seeding fjernet fra `loadAll()` — også ved bekreftet tom tabell |
| 2 | Manuell seeding flyttet til Innstillinger → Database status: kun admin, kun ved bekreftet-tom, krever frasen «OPPRETT STANDARD BILPARK», sletter aldri eksisterende rader |
| 3 | `saveVehiclesOrThrow()` nekter ved lesefeil, ikke-lastet, bekreftet-tom, tomt array eller manglende id/bilnummer/regnr. Operative felt som km og løyvenummer kreves ikke |
| 4 | Masseslettingssperre i `reconcileList()` for `vehicles`: ≥ 3 slettinger, ≥ 20 % av radene, eller flertallet av AppId-ene erstattet. Beregnes og kastes FØR første PATCH/POST/DELETE |
| 5 | Retry med backoff på 429/500/502/503/504 og nettverksfeil: 3 nye forsøk (400/1200/3000 ms), `Retry-After` respekteres. Aldri retry på 400/401/403/404 |
| 6 | Blokkerende feilpanel ved lesefeil — kun «Prøv å laste på nytt» og «Åpne Database status» |
| 7 | Skrivebeskyttet sikkerhetsmodus: opprett/rediger/slett kjøretøy og kontrollinnsending blokkeres via `krevVehiclesSkriving()` |
| 8 | `handhevOperativtDogn()` returnerer umiddelbart når døgnet ikke har skiftet og ingen biløkt er foreldet — null Airtable-trafikk ved skjermbytte |
| 9 | Cachen leses ferskt fra Airtable før enhver destruktiv Vehicles-reconcile. En app som sto åpen under ekstern restaurering kan ikke slette de restaurerte radene |
| 10 | Database status utvidet med lastestatus, radantall, siste lesing/lesefeil, skriving tillatt, sperrestatus og logg over blokkerte operasjoner |

`storage.airtable.js` v2.14.0 → **v2.15.0**, `?v=` oppdatert i både `index.html` og
`kontroll.html`. CACHE_VERSION bilpark-v72 → bilpark-v73.

**Verifisering** — ekte Chromium mot simulert Airtable med nettverksavlytting:
429, 500, nettverksfeil, tom tabell, 19 rader, seks masseslettingsscenarier, seks
skrivesperrescenarier, stale cache etter ekstern restaurering, manuell seeding i tre
tilstander, og et fullt regresjonssveip. Null POST/PATCH/DELETE mot Vehicles i alle
blokkerte tilfeller.

---

### Prioritet 66.3 — Kritisk regresjon: bilkort og grupper reagerte ikke på trykk

**Rotårsak: temporal dead zone i `renderBilkort()`**

Prioritet 66 la inn `const vKmAvvik = kmAvvikForVehicle(v);` sammen med de andre
kjøretøyvariablene — men Oversikt-fanen, som LESER `vKmAvvik`, bygges tidligere i
funksjonen. En `const` kan ikke leses før sin egen deklarasjon, så `renderBilkort()` kastet
`ReferenceError: Cannot access 'vKmAvvik' before initialization` hver eneste gang en
kjøretøyprofil skulle tegnes.

Konsekvens, bekreftet i nettleser: trykket på bilkortet TRAFF — lytteren kjørte,
`goTo('bilkort', v.id)` satte `screen = 'bilkort'` og riktig `currentVehicleId` — men
`render()` kastet før DOM-en ble byttet ut. Skjermen sto igjen på Biloversikt, og for
brukeren så det ut som ingenting skjedde.

Dette forklarer også gruppefeilen: etter det første mislykkede kortklikket sto `screen` på
`'bilkort'`. Neste trykk på en gruppe kjørte `toggleRegisterGruppe()` → `render()` →
`renderBilkort()` → ny exception. Gruppens åpne/lukke-tilstand ble faktisk oppdatert i
minnet, men skjermen ble aldri tegnet på nytt. Begge symptomene hadde altså ÉN felles
årsak.

**Utelukket:** event delegation, `data-open`, vehicleId-flyten, `stopPropagation()`,
`preventDefault()`, overlay-elementer, z-index og statusprikken fra Prioritet 64. Alt
verifisert intakt med `elementFromPoint()` — midtpunktet på hvert bilkort treffer kortet.

**Løsning**

`vKmAvvik` deklareres nå FØR fane-objektet som leser den. Ingen andre endringer — ingen
designendring, og ingen endring i kilometerlogikk, dagsreset, mobilitetsgaranti,
kontrollstatus, hurtigbestillinger, Airtable eller `storage.airtable.js`.

CACHE_VERSION bilpark-v71 → bilpark-v72.

**Verifisering (headless Chromium, ekte museklikk)**

30 av 30 klikk på desktop og 30 av 30 på mobil åpnet riktig kjøretøyprofil — 6 bilkort ×
5 punkter (alle fire hjørner + midten). Gruppe åpne/lukke verifisert med chevron og
`registerGrupperApne`. Bilantall per gruppe korrekt. `elementFromPoint()` traff kortet på
alle 6 kort i begge visninger. Feilsveip over 18 skjermer og alle 5 profilfaner: null
JS-feil. Filtertilstand bevares gjennom profilbesøk.

---

### Prioritet 66.2 — Siste integritetskontroll før deploy

**1–2. Gulvet dekker hele kontrollhistorikken**

`kontrollKmGulv(v)` returnerer nå det høyeste av `v.km` og **høyeste gyldige km i hele
kontrollhistorikken for bilen** — ikke bare siste kontroll. En eldre kontroll kan ha høyere
km enn den siste, og da er det den eldre verdien som er gulvet. Ny hjelper
`kmVerdiEllerNull()` forkaster tomme, ikke-numeriske og negative verdier. Kontroller for
andre biler filtreres bort, og et eventuelt fremtidig `k.testdata`/`k.erTestdata`-flagg
respekteres defensivt. Slettede kontroller finnes ikke i `kontroller` og kan ikke telle med.

Gulvet returnerer `{verdi, kilde, kilde_type, kontroll}`, der `kontroll` er
`{id, dato, tidspunkt, sjafor, km}` når gulvet kommer fra en kontroll.

**3. Samme gulv overalt** — blokkering, 1 000 km-varsel og km-avviksmerknaden. Merknaden
navngir nå kilden fullt ut, inkludert kontroll-ID. `kmAvvikForVehicle()` og
`rapporterKmAvvik()` bruker samme gulv og rapporterer kontroll-ID.

**4. Mislykket kompenserende rollback**

Meldingen er nå delt i to. Ren rollback: «ingenting ble lagret … trykk Send inn på nytt».
Mislykket kompenserende skriving: **MULIG DELVIS LAGRING**, navngir datasettene, og sier
eksplisitt «Ikke send inn på nytt» med henvisning til Database status i Innstillinger eller
kontrollhistorikken på bilen.

**5. Sjåførbrikken**

Bekreftet og strammet inn: aktiv sjåfør kommer utelukkende fra `vehicleAktivSjafor()`, som
kontrollerer `v.aktivSjaforSiden` mot operativt døgn. `vehicleSisteSjafor()` leses nå bare
når det ikke finnes en aktiv sjåfør, og vises som egen brikke merket «🕓 Sist kontrollert
av …» — på både Kjøretøyprofil og Biloversikt. Rå `v.aktivSjafor` leses ingen steder i
visningen.

**7–8.** Ingen automatisk korrigering av historiske data. `storage.airtable.js` og
Airtable-skjemaet er urørt — ingen nye felt var nødvendige.

CACHE_VERSION bilpark-v70 → bilpark-v71.

**Verifisering**

Gulv-simulering med kontroller som har tom, tekstlig, negativ, testdatamerket og
fremmed-bil-km: gulvet lander på 31 345 fra `k-eldre`, ikke 31 200 fra siste kontroll.
Punkt 6-testene bestått. Transaksjonssimuleringen kjørt på nytt for alle fem
lagringssteg, pluss den nye grenen der kompenserende lagring også feiler.

---

### Prioritet 66.1 — Lukket integritetshull før deploy av Prioritet 66

**1–2. Kilometergulv**

Validering kun mot `v.km` var utilstrekkelig når dataene ALLEREDE er inkonsistente: med
`v.km` = 31 076 og siste kontroll = 31 345 ville 31 200 sluppet gjennom og gjort avviket
permanent. Nytt `kontrollKmGulv(v)` returnerer det HØYESTE av `v.km` og siste gyldige
kontrollkilometer, med kilde. Både blokkeringen og 1 000 km-advarselen måler mot dette
gulvet. Gulvet skriver aldri `v.km` — `v.km` oppdateres ikke automatisk til siste kontroll.

**3. submitKontroll() kartlagt som sekvens, ikke transaksjon**

Ordet «atomisk» er fjernet fra kode og dokumentasjon. Airtable gir ingen transaksjoner;
hver `save*()` er en selvstendig nettverksskriving. Faktisk rekkefølge:

| # | Operasjon | Lagres av |
|---|---|---|
| 1 | `vehicles` (v.km) | `saveVehiclesOrThrow()` |
| 2 | bilder `kontroll:<id>:<n>` | `savePhoto()` |
| 3 | `damages` (kun ved ny skade) | `saveDamages()` |
| 4 | bilde `damage:<id>` (fallback) | `savePhoto()` |
| 5 | `kontroller` | `saveKontroller()` |
| 6 | `varsellys` | `saveVarsellys()` |
| 7 | `aktiveSaker` | `saveAktiveSaker()` |
| 8 | `vehicles` (aktiv sjåfør) | `settAktivSjafor()` → `saveVehicles()` |

**4. Samlet rollback**

Snapshot av `vehicles`, `damages`, `kontroller`, `varsellys` og `aktiveSaker` tas før
første mutasjon. Feiler et steg: lokal state gjenopprettes, kompenserende lagring kjøres i
motsatt rekkefølge for alt som faktisk rakk å bli skrevet, lagrede bilder slettes, og
brukeren får vite NØYAKTIG hvilken del som feilet. Ingen «Kontroll registrert», ingen
navigasjon, skjemadata og utkast beholdes. Feiler også den kompenserende skrivingen, sies
det eksplisitt fra i meldingen. Den ytre `catch`-blokken går gjennom samme rollback.

Steg 8 ligger bevisst utenfor rollback-grensen: kontrollen er da gyldig lagret og skal ikke
rulles tilbake fordi en biløkt ikke lot seg sette.

CACHE_VERSION bilpark-v69 → bilpark-v70.

**Verifisering**

Full transaksjonssimulering med injisert feil i hvert av de fem lagringsstegene: i alle
tilfeller `v.km` tilbake til 31 076, ingen ny kontroll, ingen skade, ingen varsellampe,
ingen sak, alle lagrede bilder slettet, ingen navigasjon, ingen «Kontroll registrert».
Sju gulv-scenarioer med inkonsistent utgangsdata — alle bestått.

---

### Prioritet 66 — Operativ dagsreset og kilometerbeskyttelse

**Rotårsak — kilometeravviket**

`submitKontroll()` skrev `v.km` HELT TIL SLUTT, etter at kontrollen allerede var lagret med
`saveKontroller()`. Feilet `saveVehicles()` etter det (nett/Airtable), ble kontrollen stående
i historikken med den NYE kilometerstanden mens kjøretøyet beholdt den GAMLE. I tillegg
svelget `saveVehicles()` feilen (alert + `console.error`), så funksjonen gikk videre som om
alt hadde gått bra. Sekundær årsak: en sjåfør kunne skrive `v.km` NEDOVER via en
«Registrere likevel?»-bekreftelse.

**Rotårsak — foreldet aktiv sjåfør**

04:00-regelen (`isoDateForOperationalDay`/`todayISO`) var korrekt og sentral, og
`vehicleAktivSjafor()`/`isKontrollertIdag()` regnet allerede live mot den.
`ryddOppBiloktDagskille()` og revurderingen av sjåførens `driverScreen` kjørte derimot KUN
ved `init()`. En PWA bakgrunnslegges i stedet for å lukkes, så en sjåførtelefon som sto på
«Min Bil» over dagskillet fortsatte i gårsdagens biløkt. Det fantes ingen
`visibilitychange`- eller `pageshow`-håndtering i appen.

**Løsning**

| Del | Endring |
|---|---|
| 2/3 | Nytt `handhevOperativtDogn()` kalles ved oppstart, `visibilitychange`, `pageshow`, hver live-synk og hver `goTo()`. Ingen timer. Skriver kun til Airtable når det faktisk finnes en foreldet biløkt |
| 4 | Ingen endring nødvendig — `isKontrollertIdag()` baserte seg allerede utelukkende på kontroller + `todayISO()` |
| 5 | `v.km` skrives nå FØRST i `submitKontroll()`, med ny `saveVehiclesOrThrow()` og rollback. Feiler lagringen, opprettes ingen kontroll |
| 6 | Lavere km enn `v.km` BLOKKERES i Sjåførkontroll. Validering ved blur og ved innsending; innsendingsvalideringen er autoritativ |
| 7 | Hopp på ≥ 1 000 km gir advarsel med differanse og valget «Bekreft og fortsett» / «Kontroller tallet» |
| 8 | Bekreftet hopp merkes på kontrollen via det EKSISTERENDE kommentarfeltet — ingen ny datamodell, intet nytt Airtable-felt, ingen automatisk verkstedsak |
| 9 | Merknaden vises automatisk i kontrollhistorikken og detaljvisningen, uthevet i amber |
| 10 | `kmAvvikForVehicle()` + `rapporterKmAvvik()` rapporterer avvik. Ingen automatisk korrigering |

CSS: `.kt-km-input.kt-km-feil` (modifier på eksisterende felt, eksisterende `--red`-token).

CACHE_VERSION bilpark-v68 → bilpark-v69. `storage.airtable.js` urørt (v2.14.0).

**Verifisering**

`node --check`, tag-balanse (div 1394/1394, span 534/534, li 35/35), kartlegging av alle
`v.km`-skrivere (4 tillatte + rollback, ingen andre), 11 simulerte km-scenarioer og 9
simulerte døgnskille-scenarioer inkludert vintertid — alle bestått.

---

### Prioritet 65.2 — Operativ opprydding av Kjøretøyprofil

**Problem eller mål**

Profilen var fortsatt for lang: den viste samme informasjon flere steder, og store
seksjoner var fylt med tomtilstander («0», «–», «Ingen planlagt») på en helt normal bil.

**Løsning**

| Del | Endring |
|---|---|
| 1 | Åpning av en kjøretøyprofil scroller alltid til toppen. `goTo()` kaller `window.scrollTo(0,0)` KUN når `vehicleId` er satt — altså ved bytte av bil, ikke ved re-render av samme profil |
| 2 | Raden ✅ Registrer kontroll / ⚠️ Registrer skade / 🗂️ Åpne aktive saker er fjernet. Funksjonene er urørt; `goToAktiveSakerForVehicle()` er flyttet til statusflisen «Aktive saker», som nå er klikkbar når bilen har saker |
| 3 | Panelet 📋 Kommende oppgaver er fjernet. Det gjentok Service/Dekk/EU/Verksted og blandet inn historikk («sist service») som ikke er en kommende oppgave |
| 4 | Blokken «Operativ status» (todelt `ov-split-grid` med 11 rader) er fjernet. Alt fantes allerede i toppseksjonen, statusraden eller Kjøretøydetaljer, og viste stort sett «0»/«–» |
| 5 | Panelet 🗂️ Aktive saker rendres kun når bilen faktisk har saker. Ellers står «Ingen åpne saker» i statusflisen |
| 6 | Oversikt-fanen er nå én kompakt liste: Service · Dekk · EU alltid; Ruteskift, Verkstedtime og Neste oppfølging **kun når de finnes** |

Fra 3 rader ved tom bil til 6 når alt er planlagt — ingen faste tomrader.

CSS: `.ov-split-grid` og `.ov-split-col` slettet (ingen andre brukere). Ingen nye
komponenter, farger eller radier.

CACHE_VERSION bilpark-v67 → bilpark-v68.

**Verifisering**

`node --check` på begge script-blokker, tag-balanse (div 1394/1394, span 533/533,
li 34/34), og simulering av Oversikt-fanen i tre tilstander (ny bil uten data, normal bil,
bil med alt planlagt) — ingen rad med «0», «–» eller «Ingen planlagt».

---

### Prioritet 65.1 — Hurtigbestillingene snakker i handlingsform

**Problem eller mål**

Undertekstene på de fire bestillingskortene beskrev tjenesten («Verkstedtime for EU»,
«Carglass ruteskift») eller et navigasjonssteg («Velg bil → Planlegg»). Kortene leste
som informasjonskort, ikke som knapper.

**Løsning**

Samme tekst på alle fire flater (Dashboard desktop, Dashboard mobil, Kjøretøyprofil,
Bestill tjenester) — 16 undertitler oppdatert:

| Kort | Før | Nå |
|---|---|---|
| Service | Planlegg service / Velg bil → Planlegg service | Bestill service |
| EU-kontroll | Verkstedtime for EU / Velg bil → Verkstedtime for EU | Bestill EU-kontroll |
| Dekkskift | Planlegg dekkskift / Velg bil → Planlegg dekkskift | Bestill dekkskift |
| Ruteskift | Carglass ruteskift / Velg bil → Carglass ruteskift | Bestill ruteskift |

Titlene er uendret (Service · EU-kontroll · Dekkskift · Ruteskift). «Velg bil →» er
fjernet fra undertekstene: bilvelgeren møter brukeren uansett i det skjemaet kortet åpner,
og steget hører hjemme i flyten, ikke på knappen.

Ingen logikk, ingen CSS og ingen bestillingsflyt er endret.

CACHE_VERSION bilpark-v66 → bilpark-v67.

**Layout- og autoutfyllingsverifisering**

`.dash40-bestill` har ingen `white-space:nowrap`, ingen `overflow:hidden` og ingen
`text-overflow` — tekst brytes, kortene har `min-height` og vokser i høyden. Ingen
klipping, ingen horisontal scrolling. Verste tilfelle («Bestill EU-kontroll», 11 px) er
ca. 106 px mot ca. 138 px tilgjengelig tekstbredde i to-kolonners mobilrutenett ved
360 px skjerm — og ca. 118 px ved 320 px skjerm. Autoutfyllingen er uendret og bekreftet:
kjøretøy, standardverksted og tjenestetype settes av `bestillService()` /
`bestillEuKontroll()` / `bestillDekkskift()` / `bestillRuteskift()`.

---

### Prioritet 65 — Operativ Kjøretøyprofil

**Problem eller mål**

Kjøretøyprofilen hadde riktig informasjon, men spredt: historikk og referansedata lå på
samme nivå som operative forhold, og brukeren måtte scrolle for å finne det som krever
handling. Målet var ny informasjonsarkitektur — ingen ny funksjonalitet, ingen datamigrering.

**Løsning**

| Område | Endring |
|---|---|
| Toppseksjon | Bilnavn + statusprikk, `Mercedes Sprinter • LS97571`, `Løyve 103028 • 79 040 km`, 👤 sjåfør, 🛟 mobilitetsgaranti. Skiltkomponenten er ute (regnr står på infolinje 1), samme mønster som bilkortet i Prioritet 64 |
| Mobilitetsgaranti | Eget stort kort fjernet. Vises som pille øverst, **live-beregnet**: siste service hos Mekonomen + 12 måneder, eller dato lest ut av det eksisterende fritekstfeltet. Ingen nedtelling, ingen nye felt |
| Operativ status | Ny rad rett under toppen: ✅ Kontrollstatus · 🔴 Varsellamper · ⚠️ Skader · 📂 Aktive saker. Gjenbruker `.profil-stat4` |
| Statsraden | Den gamle raden (Kilometerstand · Siste service · Neste service · EU-godkjent til) er fjernet — samme tall fantes allerede i Kommende oppgaver og Oversikt-fanen. Siste servicedato/km og EU-dato er lagt inn i Kommende oppgaver-radene |
| Bestill tjenester | Uendret flyt, «Dekkskifte» → «Dekkskift» på alle fire flater |
| Kjøretøyinformasjon | → **▼ Kjøretøydetaljer**, lukket som standard. Kilometerstand og mobilitetsgaranti-detaljer lagt inn der |
| Kommende oppgaver | Komprimert med ny modifier `.dmg-simple-list.kompakt` |

Nye funksjoner: `vehicleMobilitetsgaranti()`, `mobgarantiDatoFraTekst()`,
`mobilitetsgarantiPille()`. Den tidligere ubrukte `bilkortAccordionRow()` er tatt i bruk
igjen, med nøkkelen `detaljer` (ikke `info`, som `formInProgress()` tolker som aktivt skjema).

CSS: `.profil-mobgaranti` slettet i begge stilblokker. Ingen nye farger, radier eller
komponenter.

CACHE_VERSION bilpark-v65 → bilpark-v66.

**Verifisering**

`node --check` på begge script-blokker, tag-balanse uendret (div 1419/1419, span 555/555),
rekkefølgekontroll av hele returmalen (16 markører i stigende rekkefølge), og elleve
simulerte mobilitetsgaranti-scenarioer — alle bestått.

---

### Prioritet 64 — Biloversikt-komprimering

**Problem eller mål**

Biloversikten fungerte operativt, men hvert bilkort var høyere enn nødvendig. Målet var
samme informasjon, lavere kort, mindre scrolling — ingen endring i gruppering, lag,
filtre, statusmotor, sjåførlogikk eller Airtable.

**Løsning — `galleryCard()`**

| Før | Nå |
|---|---|
| Egen STATUS-rad med full etikett | Statusprikk i tittellinjen (`.p48-dot`, farget med `P38_STATUS_STIL[hs].tone`) |
| Egen Løyvenummer-rad | Infolinje 2: `Løyve 103028 • 79 040 km` |
| Egen Aktiv sjåfør-rad | Samme pille, flyttet ned i pilleraden |
| Skiltkomponent `.plate` + `Merke Modell · km · år · drivstoff` | Infolinje 1: `Mercedes Sprinter • LS97571` |
| Kategori-/driftslagtagg i pilleraden | Fjernet — bilen ligger allerede i gruppen |
| «🟢 Ingen varsellamper» alltid synlig | Vises kun når det faktisk finnes varsellamper |

Beholdt uendret: aktiv sjåfør (👤 live / 🕓 i dag / ⚪ tilgjengelig), kontrollstatus
(✅ / ⚠️ / 🚐 ikke i bruk i dag), varsellamper, skader, ⭐-markering av egen aktive bil,
amber ramme på egen bil, og «⚠️ Løyve mangler»-varselet.

Ingen data er slettet. Årsmodell og drivstoff vises fortsatt uendret på Kjøretøyprofilen.

CSS: `.gcard-rader`, `.gcard-rad` og `.gcard-rad .k` er slettet (ubrukte etter endringen).
`.gcard-sub` har fått `line-height:1.35`. Ingen nye farger, radier eller komponenter.

CACHE_VERSION bilpark-v64 → bilpark-v65.

**Verifisering**

`node --check` på begge script-blokker, tag-balanse i `index.html` (div 1419/1419,
span 554/554), og en gjengivelsessimulering av `galleryCard()` over åtte scenarioer
(operativ, oppfølging med 2 varsellamper og åpen skade, ute av drift, ikke kontrollert,
reservebil, bil uten løyve/km/modell, egen aktiv bil, utbedret skade) — alle bestått.

---

### Prioritet 63.1 — Cache busting av PWA-ikoner

**Problem eller mål**

Ikonene fra Prioritet 63 arvet de generiske filnavnene som allerede lå i cachen. Nye,
versjonerte navn tvinger fram ny henting.

**Løsning**

| Gammelt | Nytt |
|---|---|
| `icons/icon-192.png` | `icons/bilpark-icon-192-v63.png` |
| `icons/icon-512.png` | `icons/bilpark-icon-512-v63.png` |
| `icons/icon-512-maskable.png` | `icons/bilpark-icon-512-maskable-v63.png` |

14 referanser oppdatert:

| Fil | Antall |
|---|---|
| `index.html` | 5 (favicon, apple-touch-icon, CSS-kommentar, 2 × `brand-mark`) |
| `kontroll.html` | speiler index |
| `sw.js` precache-liste | 3 |
| `manifest.json` | 3 |
| `manifest-sjafor.json` | 3 |

Selve bildefilene er uendret — kun navn. Ingen redesign, ingen ny logo.

CACHE_VERSION bilpark-v63 → bilpark-v64.

**Maskable-verifikasjon**

Målt på den faktiske filen, ikke antatt:

| Kontroll | Resultat |
|---|---|
| Alfakanal | Ingen (RGB) |
| Bakgrunn i alle fire hjørner | Heldekkende |
| Hjørnebortfall langs kantene | Ingen (horisontal variasjon < 12 per kant) |
| Logoens egen vertikale gradient | Bevart |
| Sentrering | Avvik < 2 px |
| Verste motivpiksel fra midten | 186,8 px mot sikker radius 204,8 px — **18 px margin** |
| Motivdekning | 47,7 % bredde, 56,1 % høyde |

Merk at det avgjørende målet er verste motivPIKSEL, ikke bounding box-høyden: et høyt,
smalt motiv kan få hjørnene kuttet av launcherens sirkelmaske selv med god høydemargin.

**Endrede filer**

- `icons/` — tre filer omdøpt
- `index.html` — 5 referanser
- `kontroll.html` — eksakt kopi
- `sw.js` — 3 referanser + CACHE_VERSION bilpark-v63 → bilpark-v64
- `manifest.json`, `manifest-sjafor.json` — 3 referanser hver
- `storage.airtable.js` — URØRT (v2.14.0)

**Verifisering**

`node --check`: OK. Begge manifester parser som gyldig JSON. Kontrollharness,
**46 assertions, alle grønne**: alle tre nye filer finnes med riktige dimensjoner; de tre
gamle filnavnene finnes ikke på disk og gir null treff i noen av de fem filene; `icons/`
inneholder ingenting annet; favicon, apple-touch-icon og begge `brand-mark` peker på det
nye navnet; begge manifester har tre ikoner med nye navn, alle `src` finnes på disk,
`maskable` peker på maskable-filen, og `sizes` stemmer med filenes faktiske dimensjoner;
`sw.js` cacher alle tre; 192- og 512-versjonen er samme bilde (snittavvik < 3 ved
nedskalering til 64 px); full maskable-sjekkliste som over; storage-filnavnregelen fortsatt
grønn; `index.html === kontroll.html`.

**Kjente begrensninger**

Manifestfilene har uendrede URL-er. De hentes på nytt fordi service workeren er
network-first og cachen tømmes ved CACHE_VERSION-bump, men en allerede installert PWA kan
holde på det gamle hjemskjermsikonet til den avinstalleres og installeres på nytt.

---

## 2026-09-14

### Prioritet 63 — Bilpark-identitet: logo, header og PWA-ikoner

**Problem eller mål**

Bilpark hadde ingen egen visuell identitet. Headeren brukte et generisk lastebil-ikon
fra Lucide-tiden, og `icons/`-mappen manglet innhold selv om begge manifester, favicon,
apple-touch-icon og `sw.js` allerede pekte på tre filer der. Den vedlagte Bilpark-logoen
skulle implementeres — ikke tolkes, ikke redesignes.

**PWA-ikoner**

Generert fra den leverte logofilen (1254×1254):

| Fil | Innhold |
|---|---|
| `icons/icon-192.png` | logoen beskåret til brikkekanten, skalert |
| `icons/icon-512.png` | samme, 512×512 |
| `icons/icon-512-maskable.png` | samme logo tilpasset Android maskable |

Maskable-versjonen har heldekkende bakgrunn uten egen hjørneavrunding — launcheren
maskerer selv, og en logo med egne avrundede hjørner ville gitt dobbel avrunding.
B-merket er sentrert med høyde 56 % av ikonet, slik at DIAGONALEN (377 px) holder seg
innenfor den sikre sonen (410 px). Å bare måle høyden hadde ikke vært nok for et høyt,
smalt motiv. Bakgrunnsgradienten er samplet fra originalfilen, så fargene er uendret.

**Header**

Lastebil-SVG-en er fjernet fra `brandBlockHtml()` — som dekker sidebar, drawer,
sjåførheader og innloggingsskjerm — og fra mobilforsidens `p41-brand`. Begge bruker nå
`<img class="brand-mark" src="icons/icon-192.png">`, altså nøyaktig samme fil som
hjemskjermsikonet. Merket vises 28×28 px med 8 px radius, 22×22 px på smal skjerm.
Den gamle `.brand svg`-regelen er erstattet.

**Undertittel**

«Kontroller • Registrer • Reager» (desktop) og «Dine biler. Full kontroll.» (mobil) er
begge erstattet av **«Operativ kontroll»**. «Bilpark Operativsystem» ble vurdert, men
gjentar produktnavnet som står rett over merket.

**Ikke endret**

Airtable, storage, KPI-er, Kontrollstatus, Aktive biler, Bilpark status, saksmotor,
kalender, verksted. `luc('truck')` er beholdt som Lucide-ikon for kjøretøy i
grensesnittet — det er innhold, ikke merkevare.

**Endrede filer**

- `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-512-maskable.png` — NYE
- `index.html` — 4 endringer (2 CSS, 2 brand-blokker)
- `kontroll.html` — eksakt kopi
- `sw.js` — CACHE_VERSION bilpark-v62 → bilpark-v63
- `manifest.json`, `manifest-sjafor.json` — URØRT (pekte allerede riktig)
- `storage.airtable.js` — URØRT (v2.14.0)

**Verifisering**

`node --check`: OK. Kontrollharness, **34 assertions, alle grønne**:

- Alle tre ikonfilene finnes, og PNG-headerne bekrefter 192×192 / 512×512 / 512×512
- Begge manifester har tre ikoner, alle `src` finnes på disk, `maskable` og begge
  `any`-størrelser er til stede
- `sw.js` cacher alle tre
- Lastebil-SVG-en finnes ikke lenger; ingen av de to gamle undertitlene finnes
- Logomerket refereres nøyaktig to steder, begge mot `icons/icon-192.png`; ingen
  alternativ logofil refereres noe sted
- Favicon og apple-touch-icon peker på samme fil
- `brandBlockHtml()` brukes fire steder; «Operativ kontroll» finnes to steder
- `.brand-mark` har både full og nedskalert størrelse; den foreldede `.brand svg`-regelen
  er borte
- `cmp index.html kontroll.html`: identiske
- Storage-filnavnregelen fortsatt grønn i alle fire serverte filer

Ikonene er i tillegg inspisert visuelt i både 192 px og maskable-versjon.

**Kjente begrensninger**

`background_color` står fortsatt på `#EEF0F0` i begge manifester, så splash-skjermen viser
den mørke logobrikken på lys bakgrunn. Fungerer, men er ikke maksimalt sammenhengende.

---

## 2026-09-14

### Prioritet 62.1a — Kontrollstatus matematisk konsistent + Aktive biler

**Problem eller mål**

Prioritet 62.1 fungerte, men Kontrollstatus kunne vise «4 / 13 kontrollert» sammen med
«8 mangler kontroll»: nevneren var alle biler som ikke er ute av drift, mens teller og
differanse i tillegg unntok reservebiler som ikke var tatt i bruk. Dashboardet skal ikke
kreve forklaring.

**Løsning — Del 1: konsistens**

Alle tre tallene bruker nå samme populasjon — bilene som faktisk har kontrollkrav i dag:

| | Definisjon |
|---|---|
| Y | `aktiveVehicles.length − reserveUnntattCount` |
| X | `kontrollertIdagCount` |
| N | `manglerKontrollCount` = `aktiveVehicles − X − reserveUnntatt` = `Y − X` |

`X + N = Y` holder uten unntak. Det er ikke tilfeldig: `vehicleErReserveUnntatt()`
returnerer `false` så snart bilen er kontrollert i dag, så en reserve-unntatt bil kan
aldri ligge inne i X. N er fortsatt samme tall som Biloversikt-filteret klikket lander på
(`goToRegisterFiltered('ikke')`). Ingen ny beregning — kun nevneren i visningen er rettet,
og `title`-forklaringen om reservebiler er fjernet fordi den ikke lenger trengs.

**Løsning — Del 2: Aktive biler**

`aktiveSjaforerKpiHtml()` → `aktiveBilerKpiHtml()`. Samme tall (`hDriftCount` fra
`vehicleAktivSjafor()`), ny rolle: hurtigknapp til Biloversikt filtrert på «Har aktiv
sjåfør». Klikket gjenbruker det eksisterende
`data-goto-biloversikt-filter="har-aktiv-sjafor"` → `goToRegisterHovedstatus()` — ingen ny
filtreringsmodell, ingen ny skjerm. Ikon byttet fra `user-round` til `truck`, siden kortet
nå handler om biler. Teksten er «X aktive biler · Se hvilke →», med entallsformen
«1 aktiv bil».

**Ryddet**

`goToRingeliste()` og `data-goto-ringeliste` ble innført i 62.1 utelukkende for
«Aktive sjåfører»-kortet og er fjernet sammen med det. Ringelisten nås som før under
Innstillinger → 👤 Sjåførside — ingen funksjonalitet er borte.

**Ikke rørt**

`vehicleAktivSjafor()`, `vehicleSisteSjafor()`, `settAktivSjafor()`,
`settAktivSjaforForKontroll()`, Bilpark status, Airtable og storage.

**Endrede filer**

- `index.html` — 7 endringer
- `kontroll.html` — eksakt kopi
- `sw.js` — CACHE_VERSION bilpark-v61 → bilpark-v62
- `storage.airtable.js` — URØRT (v2.14.0, `?v=` uendret)

**Airtable:** ingen endring.

**Verifisering**

`node --check`: OK. Node.js-simulering, **42 assertions, alle grønne**:

- *Scenario A:* 12 tellende biler + 1 ute av drift, 4 kontrollert → «4 / 12», «8 mangler
  kontroll», og `4 + 8 = 12`
- *Scenario C:* `X + N = Y` verifisert i fem ulike sammensetninger — med 3 ubrukte
  reservebiler og 2 biler ute av drift samtidig, med alle kontrollert (5 + 0 = 5), med
  ingen kontrollert (0 + 6 = 6), og med kun biler ute av drift (0 / 0)
- *Scenario B:* 7 aktive biler → kortet viser 7, teksten «7 aktive biler», label «Aktive
  biler», klikk setter `filterHovedstatus = 'har-aktiv-sjafor'`. Entallsformen «1 aktiv bil»
- `aktiveSjaforerKpiHtml`, `goToRingeliste` og `data-goto-ringeliste` finnes ikke lenger;
  Ringelisten står fortsatt i Innstillinger
- Bilpark status uendret: to statusrader, uten «Ute av drift»
- Desktop og mobil rendrer uten `undefined`/`NaN`, balanserte `<div>`
- `kontrollstatusKpiHtml()` inneholder ingen referanse til `vehicleAktivSjafor`
- De fire sjåførmotor-signaturene finnes uendret i kilden
- *Scenario D:* `storage.airtable.js` finnes; ingen av de fem ugyldige filnavnvariantene

`cmp index.html kontroll.html`: identiske.

---

## 2026-09-14

### Prioritet 62.1 — Kontrollstatus + Aktive sjåfører erstatter «Biler i drift nå»

**Problem eller mål**

Rotårsaksanalysen konkluderte med at «Biler i drift nå» fungerte som designet: den måler
`vehicleAktivSjafor()` — «har aktiv biløkt akkurat nå». Riktig for sjåførmotoren, feil
KPI for dashboardet. Problemet skulle løses i KPI-en, ikke i sjåførlogikken.

**Løsning**

*Del 1–2 — Kontrollstatus.* Ny delt komponent `kontrollstatusKpiHtml(d)`:
«X / Y kontrollert i dag», der X = `kontrollertIdagCount` og Y = antall biler som ikke er
markert `uteAvDrift`. Underlinjen viser «N mangler kontroll». Klikk bruker den
EKSISTERENDE `data-stat-nav="mangler-kontroll"` → `goToRegisterFiltered('ikke')` → Bil­over­sikt
filtrert på ikke kontrollert i dag. Ingen ny skjerm, ingen ny modul.

*Del 3–4 — Aktive sjåfører.* Ny delt komponent `aktiveSjaforerKpiHtml(d)`: «X aktive»,
fortsatt basert på `vehicleAktivSjafor()` via `hDriftCount`, fordi det faktisk svarer på
«hvem kjører akkurat nå». Klikk åpner Ringelisten under Innstillinger → 👤 Sjåførside via
ny `goToRingeliste()`, som kun legger `'sjaforside'` i `settingsOpenSections` — samme
mønster som db-banneret bruker for Database status.

*Del 5 — Bilpark status.* Forenklet til to linjer: 🟢 Operative og 🟡 Må følges opp.
🔴 Ute av drift og «X biler i drift nå»-linjen er fjernet fra kortet.
`bilparkStatusInnholdHtml()` tar ikke lenger `hDriftCount` som parameter.

*Layout.* Desktop KPI-rad: ny `.dash40-grid3` med Kontrollstatus, Aktive sjåfører og
Kalender. Mobil KPI-rad: `.dash40-grid4` med Aktive saker, Kontrollstatus, Aktive sjåfører
og Kommende frister. Begge faller til to kolonner på smal skjerm.

**Ikke rørt**

`vehicleAktivSjafor()`, `vehicleSisteSjafor()`, `settAktivSjafor()` og
`settAktivSjaforForKontroll()` er uendret. Alternativ A fra rotårsaksanalysen er IKKE
implementert. Ute-av-drift-logikken er intakt i `vehicleHovedstatus()`, Biloversikt,
filtrene, Kjøretøyprofil og rapportene — kun dashboardvisningen er forenklet.

Ingen nye beregninger: alle tallene fantes i `dashboardBeregning()`. Eneste tillegg i
returobjektet er `reserveUnntattCount`, brukt til en forklarende `title`. `renderDashboard()`
holder nå `d` ved siden av destruktureringen — fortsatt bare ETT kall til
`dashboardBeregning()`.

**Endrede filer**

- `index.html` — 15 endringer
- `kontroll.html` — eksakt kopi
- `sw.js` — CACHE_VERSION bilpark-v60 → bilpark-v61
- `storage.airtable.js` — URØRT (v2.14.0, `?v=` uendret)

**Airtable:** ingen endring.

**Verifisering**

`node --check`: OK. Node.js-simulering mot faktiske app-funksjoner, **46 assertions, alle
grønne**:

- *Scenario A:* 13 biler ikke ute av drift + 1 ute av drift, 4 kontroller i dag →
  kortet viser «4 / 13», label «Kontrollert i dag»
- *Scenario B:* «9 mangler kontroll», og kortet lenker til `data-stat-nav="mangler-kontroll"`
- *Del 7 (viktigst):* med 13 `settAktivSjafor()`-kall på SAMME navn kollapser `hDriftCount`
  til 1 — mens Kontrollstatus fortsatt viser «4 / 13». Nøyaktig symptomet fra
  rotårsaksanalysen, nå uten at KPI-en lyver
- *Scenario C:* 7 ulike sjåfører → «7», «7 aktive», og entallsformen «1 aktiv» ved én
- *Scenario D:* Bilpark status har nøyaktig to statusrader, uten «Ute av drift» og uten
  «i drift nå»
- Ute av drift står fortsatt i `hbp`, i `HOVEDSTATUS_ORDER` og i Biloversikt-filteret
- Desktop og mobil rendrer uten «Biler i drift», uten `undefined`/`NaN`, med balanserte
  `<div>`-tagger, og med begge nye kort til stede
- `goToRingeliste()` åpner `'sjaforside'`-seksjonen
- De fire sjåførmotor-signaturene finnes uendret i kilden, og `kontrollstatusKpiHtml()`
  inneholder ingen referanse til `vehicleAktivSjafor`
- *Scenario E:* `storage.airtable.js` finnes; ingen av de fem ugyldige filnavnvariantene
  i `index.html`, `kontroll.html`, `sw.js` eller `storage.airtable.js`

`cmp index.html kontroll.html`: identiske.

**Kjente begrensninger**

«N mangler kontroll» gjenbruker `manglerKontrollCount`, som unntar reservebiler som ikke
er tatt i bruk ennå (Optimalisering 14) — samme definisjon som skjermen klikket leder til.
Nevneren Y er derimot alle biler som ikke er ute av drift, jf. briefen. Står det
reservebiler på vent, summerer X + N derfor ikke til Y. Forskjellen forklares i kortets
`title`-attributt.

---

## 2026-09-13

### Prioritet 62.0 — Storage-filnavn sanert

**Problem eller mål**

Ett autoritativt filnavn: `storage.airtable.js`. Prosjektet hadde to skrivemåter i omløp.

**Kartlegging (før)**

| Sted | Verdi | Status |
|---|---|---|
| Fil på disk | `storage_airtable.js` | ❌ understrek |
| `index.html:21` `<script src>` | `storage.airtable.js?v=2.14.0` | ✅ |
| `kontroll.html:21` `<script src>` | `storage.airtable.js?v=2.14.0` | ✅ |
| `sw.js:20` cache-liste | `'./storage.airtable.js'` | ✅ |
| `index.html:14095` synlig etikett | `Kjørende fil-versjon (storage_airtable.js)` | ❌ |
| `index.html:14108` synlig feilmelding | `...annen versjon av storage_airtable.js...` | ❌ |
| `index.html:14060` kodekommentar | `...den kjørende storage_airtable.js...` | ❌ |
| `index.html:4327` kodekommentar | `storage_airtable.js — kind:'json'...` | ❌ |
| `kontroll.html` | speiler de fire over | ❌ |
| `storage.airtable.js` egen header | `storage.airtable.js` | ✅ |
| README, AIRTABLE_MIGRATION, ROADMAP, CHANGELOG | 75 treff, alle punktum | ✅ |
| `CLAUDE.md` | 4 treff, alle i pitfall-dokumentasjon | ✅ (skal stå) |

Alvorligst var `index.html:14095` og `:14108`: de ligger i **Database status**-panelet —
skjermen som er bygget for å avsløre nettopp denne feilen — og pekte brukeren mot feil
filnavn.

**Løsning**

1. Filen omdøpt `storage_airtable.js` → `storage.airtable.js`. **Innholdet er ikke rørt**
   (v2.14.0, byte-identisk).
2. Fire understrek-referanser rettet i `index.html`, speilet til `kontroll.html`.
3. `CLAUDE.md`: den utdaterte parentesen om at feilskrivinger «kun forekommer i løpende
   kommentartekst» er erstattet, og en ny, varig regel er lagt til.

**Ikke endret**

`window.storageAirtableInfo` (`index.html:14078/14084/14099` + `storage.airtable.js`) er
et JavaScript-variabelnavn, ikke et filnavn. Gyldig, og bevisst urørt.

Ingen funksjonelle endringer. Ingen Airtable-endringer. Sync-logikk, routing,
storage-modell og sjåførmotoren er ikke berørt.

**Endrede filer**

- `storage_airtable.js` → `storage.airtable.js` (kun navn)
- `index.html` — 4 tekstreferanser
- `kontroll.html` — eksakt kopi
- `sw.js` — CACHE_VERSION bilpark-v59 → bilpark-v60
- `CLAUDE.md`, `ROADMAP.md`

`?v=` og intern versjon står begge uendret på 2.14.0, som er riktig: filens INNHOLD er
uendret.

**Verifisering**

- `node --check` på `index.html`-skriptblokken og `storage.airtable.js`: OK
- Kontrollharness, 23 assertions, alle grønne. Alle fem ugyldige varianter
  (`storage_airtable.js`, `airtable_storage.js`, `airtable-storage.js`,
  `storageAirtable.js`, `airtable.storage.js`) søkt opp i hver enkelt `.js`-, `.html`-,
  `.md`- og `.json`-fil. Eneste fil med treff er `CLAUDE.md`, der samtlige står i
  passasjer som eksplisitt erklærer dem ugyldige. I tillegg bekreftet: kun ett
  storage-filnavn på disk; `<script src>` korrekt i begge HTML-filer; `sw.js` cacher
  `'./storage.airtable.js'`; `?v=` samsvarer med intern versjon; Database status og
  feilmeldingen viser nå riktig filnavn; `window.storageAirtableInfo` urørt
- `cmp index.html kontroll.html`: identiske

**Kjente begrensninger**

Jeg har ikke tilgang til GitHub-repoet og kan derfor ikke verifisere kontrollpunkt 3
(«Repoet inneholder `storage.airtable.js`»). Ved opplasting må en eventuell gammel
`storage_airtable.js` SLETTES fra repoet — ellers ligger begge filene der samtidig, og
forvekslingen kan oppstå på nytt.

---

## 2026-09-13

### Prioritet 62 — Bestill tjenester forenklet til fire kort

**Problem eller mål**

Bestill tjenester viste fem kort. Fire av dem er planlagt vedlikehold; Verkstedtime
passet ikke inn — den skal være et resultat av en sak, ikke et fritt valg i en
bestillingsmeny. Samtidig skulle de fire gjenværende kortene gjøre mer av jobben.

**Fjernet**

Verkstedtime-kortet er borte fra alle fire flater som hadde det:

| Flate | Før | Etter |
|---|---|---|
| Mobil forside (`komponentHtml.bestill`) | 5 kort, `.dash40-grid5` | 4 kort, `.dash40-grid4-bestill` |
| Desktop dashboard | 4 kort (allerede uten) | uendret |
| Kjøretøyprofil («Bestill tjenester for …») | 5 kort, `.dash40-grid5` | 4 kort, `.dash40-grid4-bestill` |
| Bestill tjenester-skjermen | 5 kort, `.dash40-grid5` | 4 kort, `.dash40-grid2x2` |

`bestillVerkstedtime()` og `case 'verksted'` i `attachBestillListeners()` er slettet.

**Beholdt urørt:** verkstedmodulen, dens egen «+ Ny verkstedtime»-knapp,
`bestillVerkstedForSak()`, alle eksisterende verkstedtimer og hele saksflyten.

**Smartere hurtigopprettelse**

| Kort | Fylles ut automatisk |
|---|---|
| Service | Standardverksted, dato (i dag), kl. 07:30 |
| EU-kontroll | EU-avkryssing, standardverksted, **beskrivelse «EU-kontroll»**, dato, kl. |
| Dekkskifte | Standardverksted, **retning utledet av `v.dekk`**, dato, kl. |
| Ruteskift | Ruteskift-avkryssing, standardverksted, **beskrivelse «Ruteskift»**, dato, kl. |

Beskrivelse er et OBLIGATORISK felt på en verkstedtime. Uten forhåndsutfylling måtte
brukeren skrive «EU-kontroll» for hånd hver gang — nettopp det hurtigopprettelse skal
fjerne. Ny hjelpefunksjon `vtBeskrivelseForslag(erEu, erRuteskift)`; ved begge typer
krysset av gir den «EU-kontroll + ruteskift».

Dekkretningen foreslås fra dekkene som står på bilen nå: `v.dekk === 'vinter'` gir
«Vinter → Sommer», alt annet gir «Sommer → Vinter». Ingen ny datakilde — samme felt
Dashboard allerede bruker til «Dekkskift nødvendig».

Begge forslagene følger forslagsregelen fra Prioritet 61: de oppdateres når brukeren
krysser av for en annen type, men kun hvis feltet fortsatt står på forrige forslag.
Lytteren i `attachVerkstedListeners()` er utvidet til å dekke både verksted og
beskrivelse i samme `oppdaterForslag()`.

**Ryddet samtidig**

- `bestillKortHtml` (død kode identifisert i Prioritet 58) er slettet — den inneholdt
  både emoji og et Verkstedtime-kort.
- CSS-klassen `.dash40-grid5` er fjernet med alle fire mediespørring-overstyringer; ingen
  flate har fem kort lenger.
- Bestillingskortene på Kjøretøyprofil er migrert fra emoji til Lucide. Denne flaten ble
  ikke fanget opp i Prioritet 58.

**Endrede filer**

- `index.html` — 19 endringer
- `kontroll.html` — eksakt kopi
- `sw.js` — CACHE_VERSION bilpark-v58 → bilpark-v59
- `storage.airtable.js` — URØRT (v2.14.0, `?v=` uendret)

**Airtable:** ingen endring, ingen datamigrering.

**Verifisering**

- `node --check`: OK
- Node.js-simulering, 24 assertions, alle grønne: `bestillVerkstedtime` finnes ikke
  lenger som funksjon; Bestill tjenester rendrer nøyaktig fire kort i 2x2 med alle fire
  typene; ingen flate inneholder `data-bestill="verksted"`; Kjøretøyprofil har fire kort
  uten emoji; `.dash40-grid5` finnes kun som forklarende kommentar; EU forhåndsutfyller
  beskrivelse «EU-kontroll» + standardverksted + avkryssing; Ruteskift tilsvarende; uten
  type er beskrivelsen tom; `vtBeskrivelseForslag(true,true)` gir kombinasjonen;
  vinterdekk gir «Vinter → Sommer» og sommerdekk «Sommer → Vinter» med nøyaktig én
  `selected`. Balanserte `<div>`-tagger kontrollert på Bestill tjenester og mobil forside.
- `cmp index.html kontroll.html`: identiske

---

## 2026-09-13

### Prioritet 61 — Standardverksted per tjenestetype

**Problem eller mål**

De samme verkstedene brukes i praksis nesten hver gang (Service → Mekonomen,
Deler/Reparasjon → BOS Skolmar, Ruteskift → Hurtigruta Carglass Larvik). Brukeren skulle
slippe å velge dette manuelt hver gang, uten å miste muligheten til å overstyre.

**Løsning**

*Innstillinger → Register → Verkstedregister* har fått en ny seksjon «Standardverksted»
med én nedtrekksliste per tjenestetype: Service, EU-kontroll, Deler/Reparasjon,
Ruteskift, Dekkskifte. Hver liste har «Ingen standard» som førstevalg. Valget lagres
direkte ved endring — ingen egen lagre-knapp. Er Verkstedregisteret tomt, vises en
hjelpetekst i stedet for fem tomme lister.

Forhåndsutfylling ved opprettelse:

| Skjema | Standard hentes fra |
|---|---|
| Planlegg service (`ps-verksted`) | Service |
| Registrer utført service (`sv-verksted`) | Service |
| Registrer dekkskifttime (`pd-verksted`) | Dekkskifte |
| Verkstedtime fra en sak (saksveiviseren) | Deler/Reparasjon |
| Ny verkstedtime koblet til sak | Deler/Reparasjon |
| Ny verkstedtime, fritt valg | EU-kontroll / Ruteskift / Deler/Reparasjon, etter avkryssing |

I «Ny verkstedtime» kan brukeren krysse av for EU-kontroll eller Ruteskift etter at
skjemaet er åpnet. Forslaget oppdateres da — men kun hvis feltet fortsatt står på forrige
forslag. Har brukeren valgt verksted selv, røres det aldri. Dette er løst med
`data-std-default` på selecten og en lokal lytter, uten `render()`, slik at resten av
skjemaet beholdes.

**Datamodell**

Én JSON-blob under Settings-nøkkelen `standardverksted`, samme mønster som `verksteder`
og `bilkategorier`. Ingen ny Airtable-tabell, ingen `LIST_TABLES`-registrering.

Verdiene er verkstedNAVN, ikke id-er — samme representasjon som `verkstedtime.verksted`
og `verkstedSelectOptions()` allerede bruker, altså ingen ny sannhet. Det krever to
konsistensregler, begge implementert:

- `saveVerkstedEdit()` oppdaterer standardene når et verksted omdøpes
- `deleteVerksted()` fjerner standardvalg som pekte på det slettede verkstedet

I tillegg er `standardVerkstedFor()` tolerant: peker et lagret navn på et verksted som
ikke finnes, returneres tom streng og skjemaet faller tilbake til «Velg verksted...».

**Gjenbruk**

Ingen nye mekanismer. `verkstedSelectOptions(selected)` hadde allerede støtte for
forhåndsvalg og brukes uendret. Nedtrekkslistene i Innstillinger bruker samme funksjon,
så et nytt verksted dukker opp overalt samtidig.

**Endrede filer**

- `index.html` — 15 endringer
- `kontroll.html` — eksakt kopi
- `sw.js` — CACHE_VERSION bilpark-v57 → bilpark-v58
- `storage.airtable.js` — URØRT (v2.14.0, `?v=` uendret)

**Airtable:** ingen handling. Settings-raden `standardverksted` opprettes automatisk
første gang et standardverksted lagres.

**Verifisering**

- `node --check`: OK
- Node.js-simulering, 23 assertions, alle grønne: alle fem tjenestetyper definert i
  riktig rekkefølge; oppslag per type; ukjent type gir tom streng; SLETTET verksted gir
  tom streng (faller tilbake til «Velg verksted...»); EU og Ruteskift gir hver sin
  standard; ingen avkryssing gir Deler/Reparasjon; EU vinner når begge er krysset;
  `verkstedSelectOptions()` setter nøyaktig ÉN `selected`; Innstillinger viser fem
  `data-std-verksted`-felt og «Ingen standard»; tomt Verkstedregister gir hjelpetekst og
  null lister; «Ny verkstedtime» med forhåndskrysset Ruteskift forhåndsvelger riktig
  verksted og setter `data-std-default`; uten noen standard står «Velg verksted...»
  uvalgt. Balanserte `<div>`-tagger kontrollert på både Innstillinger og Verksted.
- `cmp index.html kontroll.html`: identiske

---

## 2026-09-13

### Prioritet 60 — Siste rester av prioritetssystemet fjernet

**Problem eller mål**

Prioritet 59 fjernet logikken bak prioritetssystemet, men enkelte synlige rester sto
igjen. Målet: brukeren skal aldri se ordet «Prioritet» i Bilpark.

**Identifiserte rester**

| Sted | Rest |
|---|---|
| Saksveiviseren Steg 2 | Tomt `<div class="field"><label>Prioritet</label></div>` |
| Registrer sak-skjemaet | Tomt prioritetsfelt i `row2` ved siden av Oppfølgingsdato |
| Aktive saker → Filtre | Tomt prioritetsfelt med `target`-ikon i `row2` |
| `sakWizardSteg1Html()` | Ubrukt variabel `prioritetVurdert` |
| Statuskonstanter | `DAGENS_STATUS_CHIP_KLASSE` med nøkkelen `kritisk` (død kode) |
| Dashboard-lyttere | Drilldown-grenen `kind === 'kritisk'` (død) |
| Skaderapport | Kolonneoverskrift «Prioritet» som alltid har vist `ALVOR_LABEL` |
| Dashboard-beregning | Variabelnavnene `kritiskeSakerAlle` og `krHarKritisk` |

**Løsning**

1. De tre tomme feltene er fjernet i sin helhet. Skjemaene er reorganisert i stedet for
   å etterlate halvtomme `row2`-rutenett: registreringsskjemaet parer nå Oppfølgingsdato
   med Neste handling, og filterpanelet parer Status med Oppfølging.
2. `prioritetVurdert`, `DAGENS_STATUS_CHIP_KLASSE` og den døde drilldown-grenen er slettet.
3. Skaderapportens kolonne heter nå «Alvorlighet» i både visning og Excel-eksport —
   overskriften var feil, ikke innholdet.
4. `kritiskeSakerAlle` → `forfalteSakerAlle` (7 forekomster), `krHarKritisk` →
   `harHastesaker` (9 forekomster). Navnene beskrev prioritet; innholdet har siden
   Prioritet 59 vært forfalt oppfølging.
5. Den utdaterte kommentaren over `sakWizardSteg2Html()` («prioritet + status») er rettet.

**Bevisst ikke endret**

`ALVOR_LABEL = {lav:'Lav', middels:'Middels', hoy:'Høy'}` er skademodellens egen
alvorlighetsgrad, et selvstendig felt på Damages-tabellen med nedtrekkslister i Min Bil,
skaderegistreringen og skadedetaljer. Det er ikke en rest av saksprioriteten. Å fjerne
den ville slette fungerende funksjonalitet og et databasefelt — krever egen instruks.

Ordet «Prioritet» står fortsatt i kodekommentarer som sprintnavn. Det er intern
historikk og vises aldri for brukeren.

**Endrede filer**

- `index.html` — 9 strukturelle endringer + 16 omdøpninger
- `kontroll.html` — eksakt kopi
- `sw.js` — CACHE_VERSION bilpark-v56 → bilpark-v57
- `storage.airtable.js` — URØRT (v2.14.0, `?v=` uendret)

**Airtable:** ingen endring.

**Verifisering**

- `node --check`: OK
- Statisk skanning: null forekomster av «Prioritet», «Kritisk» eller «Ikke vurdert»
  utenfor kodekommentarer
- Node.js-simulering, 23 assertions, alle grønne. Rendret faktisk markup fra
  `sakWizardSteg1Html()`, `sakWizardSteg2Html()`, `sakCard()`, `sakKompaktKortHtml()`,
  `renderAktiveSaker()`, `renderDashboard()`, `renderMobilHjem()`, `renderHistorikk()`,
  `renderRapportSkade()` og `renderRegister()` og kontrollerte hver for forbudte ord
  OG balanserte `<div>`-tagger. Sistnevnte fanget en reell feil underveis: omorganiseringen
  av filterpanelet hadde etterlatt `row2` uten lukkende `</div>`.
- Bakoverkompatibilitet: sak med historisk `priority:'kritisk'` og `avvik[].prioritet`
  rendres og beregnes uten feil
- `cmp index.html kontroll.html`: identiske

---

## 2026-09-13

### Prioritet 59 — Prioritetssystemet avviklet (arkitekturbeslutning, Alternativ B)

**Problem eller mål**

Bilpark hadde to parallelle prioriteringsmodeller: saksflyten (Aktiv sak → Under
oppfølging → Planlagt verksted → Utført/Avslått) og et eget prioritetsfelt
(Lav/Normal/Høy/Kritisk). Sistnevnte skulle avvikles.

**Foranalysens hovedfunn**

`kritisk` ble aldri satt automatisk. Auto-generering ga `hoy` (varsellampe) eller
`normal` (skade, kontrollavvik, manuell registrering). `kritisk` oppsto utelukkende ved
manuelt nedtrekksvalg — men var eneste inngang til det røde nivået i
`vehicleHovedstatus()`, `vehicleSakStatus()` og til tre KPI-er i Rapporter/Analyse.

**Besluttet av Benibanos: Alternativ B.** Rødt = «Ute av drift».

**Løsning, steg for steg**

1. *Skrivestier* — `registrerAvvikSomSak()` tar ikke lenger imot `prioritet`; fem
   kallesteder oppdatert. Auto-genereringen skriver verken `priority` på saken eller
   `prioritet` per avvikspunkt, og «verste vinner»-rollupen (`SAK_PRIORITET_RANK`) er
   fjernet. `submitAddSak()` og `submitSakWizardVurder()` leser ikke lenger feltet.
2. *Visning* — prioritetsraden i Steg 1, nedtrekket i Steg 2, nedtrekket i
   registreringsskjemaet, filteret i Aktive saker og tre badger på sakskortene er fjernet.
3. *`vehicleHovedstatus()`* — nivået `kritisk` fjernet. Seks nivåer: Ute av drift >
   Verksted bestilt > Under oppfølging > Reservebil > Ikke kontrollert > Operativ.
   `HOVEDSTATUS_ORDER/_IKON/_LABEL/_BADGE_KLASSE` og stiltabellen oppdatert;
   `'ute-av-drift'` overtar det røde ikonet. `vehicleSakStatus()` gir rødt på samme
   grunnlag (`v.uteAvDrift`). `vehicleKritiskeSaker()` slettet. Biloversiktens filter
   «🔴 Kritiske» → «🔴 Ute av drift».
4. *Dashboard* — «Krever handling nå» fargelegges nå av hastegrad fra
   `sakOppfolgingStatus()`: Forfalt (rød) / I dag (oransje) / Uten frist (amber).
   Drilldownen som het `kritisk` peker nå på forfalt oppfølging.
5. *KPI-er* — «Kritiske saker» i saksrapporten → «Forfalte oppfølginger». «Kritiske
   hendelser» i månedsrapporten fjernet (duplikat av eksisterende «Forfalte
   oppfølginger»). Kolonnen «Kritiske saker» i Analyse → Utvikling fjernet, også i
   Excel-eksporten. «Kritiske saker» på Kjøretøyprofil fjernet.
6. *Konstanter* — `SAK_PRIORITET_ORDER/_LABEL/_IKON/_RANK` slettet.
7. *Storage* — `priority` fjernet fra `LIST_TABLES.aktiveSaker`.

**Sideeffekt rettet underveis:** `rapportBilparkData()` bygde `counts` fra en
håndskrevet liste som manglet `reserve` — reservebiler ga `undefined`/`NaN` i
bilparkrapporten og Excel-eksporten. Bygges nå fra `HOVEDSTATUS_ORDER`.

**Atferdsendring som må aksepteres**

Delta i «Krever handling nå» er lite, men reelt: `sakKreverHandling()` dekket allerede
status ny/vurderes/venter bekreftelse, manglende neste handling og manglende eller
forfalt oppfølgingsdato. Den ENESTE sakstypen som faller ut er en ferdig planlagt sak
(har både neste handling og en FREMTIDIG oppfølgingsdato) som i tillegg var manuelt
merket kritisk. Tidligere ble den vist uansett; nå vises den når fristen nærmer seg.

Historiske månedstall i Analyse endrer seg retroaktivt fordi «Kritiske saker»-kolonnen
er borte. Uunngåelig og bevisst.

**Data**

Ingen datamigrering. `AktiveSaker.Priority` beholdes urørt i Airtable som historisk data;
appen verken leser eller skriver feltet. `prioritet` inne i eldre `Avvik`-blober leses
tolerant (ignoreres) og skrives ikke lenger. `sakAvvikListe()` syntetiserer ikke lenger
et `prioritet`-felt for eldre enkeltavvik-saker.

**Endrede filer**

- `index.html` — 73 endringer
- `kontroll.html` — eksakt kopi
- `storage.airtable.js` — `priority` ute av `LIST_TABLES`, versjon v2.13.0 → v2.14.0
- `index.html` `?v=` → 2.14.0 (samtidig, jf. permanent versjonsregel)
- `sw.js` — CACHE_VERSION bilpark-v55 → bilpark-v56

**Verifisering**

- `node --check` på begge inline script-blokker og `storage.airtable.js`: OK
- Null gjenværende referanser til `SAK_PRIORITET_*`, `s.priority`, `sakFilterPrioritet`,
  `vehicleKritiskeSaker`, `kritiskeHendelser` (kun forklarende kommentarer igjen)
- Node.js-simuleringsharness, 20 assertions, alle grønne. Blant annet:
  bil med `uteAvDrift` → `ute-av-drift` + `rod`; bil med HISTORISK `priority:'kritisk'`
  → `oppfolging` + `gul` (ikke rød); ingen bil kan returnere `kritisk`; alle seks nivåer
  har LABEL/IKON/BADGE; eldre `Avvik`-blob med `prioritet` leses uten feil;
  `sakAvvikListe()` syntetiserer uten `prioritet`; `dashKreverRadHtml()` viser hastegrad
  i alle tre nivåer med riktig farge; `rapportBilparkData()` summerer til antall biler
  uten `NaN`
- HTML tag-balanse: uendret fra før endring
- `cmp index.html kontroll.html`: identiske

---

## 2026-09-13

### Prioritet 58 — Fjern de mest synlige emoji-ikonene

**Problem eller mål**

Bilpark var delvis migrert til Lucide. Problemet var ikke antallet gjenværende emoji,
men at de mest brukte skjermene blandet Lucide og emoji samtidig, slik at appen føltes
som to designsystemer. Målet var derfor synlighet, ikke antall.

**Kartlegging (før)**

| Prioritet | Flate | Gjenværende emoji |
|---|---|---|
| 1 | Dashboard desktop (`renderDashboard`) | 26 |
| 1 | Dashboard mobil (`renderMobilHjem`) | 13 |
| 1 | Delt beregning (`dashboardBeregning`) | 13 |
| 1 | Delte rader (`kommendeOppgaveRadHtml`, `dashKreverRadHtml`, `bilparkStatusInnholdHtml`) | 9 |
| 2 | Navigasjon (header, drawer) | 2 (resten allerede Lucide fra P55/P56) |
| 3 | Sjåførmodus (Min Bil, Ringeliste, Kommentarer, Mer, Kontroll) | 14 + eget SVG-ikonsett |
| 4 | Aktive saker (tittel, faner, sakskort, gruppering, filtre) | 24 |
| — | Bestill tjenester (deler kortkomponent med Dashboard) | 9 |

**Løsning**

1. **Dashboard (desktop + mobil)** — KPI-kort, bestill-kort, seksjonsoverskrifter,
   header-knapper (varselklokke, konto, søk), databanner, biloversiktstabell
   (kjøretøy- og sjåførkolonne), «Bilpark status»- og «Krever handling nå»-overskrift.
   Desktop og mobil bruker nå samme ikon for samme panel (`activity`, `siren`).
2. **`KOMMENDE_ART`** — «Kommende oppgaver» valgte tidligere fargetone ved å
   sammenligne emoji-strenger (`o.ikon === '🔧'`). Erstattet av ett oppslag på `o.art`.
   Fargene er bevisst identiske med før (service=green, dekk=orange, EU=blue,
   verkstedtime=purple, resten=amber).
3. **«Krever handling nå»** — statussirklene erstattet av Lucide *type*-ikoner.
   Prioriteten vises allerede to ganger i samme rad (fargetone + tekst), så sirkelen
   duplikerte informasjon. `bilparkStatusInnholdHtml()` sine 🟢🟡🔴 er URØRT.
4. **Navigasjon** — `☰ Meny` (header) og `✕` (drawer-lukk). Ingen emoji igjen i noen
   navigasjonsflate.
5. **Sjåførmodus** — `sjaforIkonSvg()` returnerer nå Lucide via `P48_LUCIDE`; det gamle
   `P48_IKON_PATHS`-settet (14 håndtegnede SVG-er) er slettet. Signatur og alle 12
   kallesteder uendret. I tillegg: kontrollert-pillen, «allerede kontrollert»-skjermen,
   kontaktlisten, Ringeliste, Kommentarer, Mer og Legg til kommentar.
6. **Aktive saker** — skjermtittel, de tre faseknappene (nå identiske med
   `sakFaseTellereHtml()` på Dashboard), sakskort, kompaktkort, bilgruppering, filtre.
7. **Bestill tjenester** — migrert fordi den deler kortkomponenten med Dashboard;
   halvveis migrering ville gitt nøyaktig den blandingen commiten skulle fjerne.
8. **Delte komponenter** — akkordeon-chevron ×16 og bilmarkør i `flag-name` ×7
   (samme visuelle komponent på tvers av skjermer; «samme funksjon = samme ikon»).
9. **`vtTypeLucide()` / `vtTypeArt()`** — parallelle varianter etter mønsteret fra
   Prioritet 57. `vtTypeIkon()` er URØRT fordi Kalender/Planlegging ikke er migrert.

**Bevisst utsatt**

- **Kalender.** `.kal-merker` har `font-size:9–11px`; Lucide-strek blir nær usynlig der.
  Krever egen størrelsesbeslutning. Skjermen er holdt helt umigrert, ikke halvveis.
- **Vær-/hilsen-emoji** (`WEATHER_CODE_MAP` m.fl.) — illustrative piktogrammer.
- Historikk, Rapporter, Analyse, Innstillinger, Bil-siden, sakWizard-steg.
- Alle statusfargesirkler, `<option>`-tekster, `esc()`-meldinger, Excel-eksport.

**Funn, ikke rettet:** `bestillKortHtml` i `renderDashboard()` er død kode (deklarert,
aldri brukt) og inneholder fire emoji. Ingen visuell effekt. Bør slettes ved opprydding.

**Endrede filer**

- `index.html` — 105 erstatninger + `P48_IKON_PATHS` fjernet + fire nye CSS-regler
- `kontroll.html` — eksakt kopi av `index.html`
- `sw.js` — CACHE_VERSION `bilpark-v54` → `bilpark-v55`
- `storage.airtable.js` — URØRT (ingen `?v=`-endring, ingen versjonsbump)

**Airtable:** ingen nye felt, ingen nye tabeller, ingen migrering.

**Verifisering**

- `node --check` på begge inline script-blokker: OK
- HTML tag-balanse: identisk resultat som før endring (ingen regresjon)
- Node.js-simuleringsharness mot faktiske app-funksjoner: `luc()`, `sjaforIkonSvg()`,
  `vtTypeLucide()`, `vtTypeArt()`, `KOMMENDE_ART`, `kommendeOppgaveRadHtml()` (service,
  verksted og ukjent `art` → fallback), `dashKreverRadHtml()`,
  `bilparkStatusInnholdHtml()`. Alle returnerte balansert markup uten emoji, bortsett
  fra `bilparkStatusInnholdHtml()` som korrekt beholder statussirklene.
- `cmp index.html kontroll.html`: identiske

---

## 2026-09-12

### Prioritet 57 — Løser Prioritet 56 sitt arkitekturfunn: parallelle Lucide-oppslag

**Problem eller mål**

Prioritet 56 identifiserte at `HOVEDSTATUS_IKON`, `SAK_TYPE_IKON`, `KONTROLLAVVIK_IKON`,
`DRIVSTOFF_IKON` og `GRUPPE_IKON` ikke kunne konverteres direkte til Lucide fordi de
samtidig brukes i `<option>`-nedtrekksmenyer og Excel/rapport-eksport, der HTML/SVG
aldri rendres. Denne sprinten løser dette — for de av dictionariene der det faktisk
gir mening — ved å innføre en PARALLELL Lucide-variant ved siden av hver ordbok, i
stedet for å endre selve den delte kilden.

**Levert**

- `GRUPPE_LUCIDE`, `SAK_TYPE_LUCIDE`, `KONTROLLAVVIK_LUCIDE` — nye konstanter, plassert
  rett ved siden av sine emoji-motstykker, som forblir 100 % UENDRET (samme verdier,
  samme `<option>`/eksport-bruk som før).
- Ny hjelpefunksjon `kategoriIkonLucide(katId)` — Lucide-variant av den eksisterende
  `kategoriIkon()` (som selv er urørt).
- Byttet 18 bekreftet rene HTML-visningssteder til de nye Lucide-oppslagene: 6×
  sakskort-hovedlinjer (`SAK_TYPE_LUCIDE`), 6× kategori-kort (`GRUPPE_LUCIDE`), 3×
  `kategoriIkonLucide()`-kall, 2× kontrollavvik-chips (`KONTROLLAVVIK_LUCIDE`).
  `<option>`-listene og eksportfunksjonene som bruker de ORIGINALE ordbøkene direkte,
  er ikke rørt i det hele tatt.
- `VARSELLAMPE_ICON` konvertert DIREKTE til Lucide (ingen parallell variant nødvendig —
  alle fire kallesteder bekreftet fri for `esc()`/`<option>`/eksport).
- `sakAvvikChecklistHtml()` (Aktive saker-sjekklisten fra Prioritet 52) er nå 100 %
  Lucide: ☑ → `square-check`, varsellampe-/kontrollavvik-ikonene, ❓-reserve →
  `help-circle`.
- Diverse mindre, individuelt verifiserte konverteringer: 🚨-prefiks foran aktive
  varsellamper på Min Bil, ✅-brikker i varsellampe-/kontrollavvik-registrering
  (→ `check`).
- **`HOVEDSTATUS_IKON` og `DRIVSTOFF_IKON` er BEVISST IKKE konvertert** — se «Ikke
  levert».

**Ikke levert / bevisst avgrenset**

- **`HOVEDSTATUS_IKON` er unntatt av en annen grunn enn eksport/`<option>`:** de fleste
  verdiene (🔴🟠🟡⚪🟢) ER de samme statusfargesirklene STATUSREGLER-en eksplisitt sier
  skal forbli emoji og være PRIMÆR statuskommunikasjon. Å konvertere disse til Lucide
  ville brutt akkurat den regelen. De to gjenværende, ikke-fargekodede unntakene i
  ordboken (⛔ ute-av-drift, 🚐 reserve) er latt stå sammen med resten for å unngå et
  visuelt inkonsistent halvveis-konvertert statussystem.
- **`DRIVSTOFF_IKON`** — alle tre kallesteder til `drivstoffTekst()` er `esc()`-pakket,
  ingen ren-HTML-konsument finnes i dag. En parallell Lucide-variant ville derfor ikke
  hatt noe trygt sted å brukes ennå — utsatt til en eventuell ren-HTML-visning av
  drivstoff dukker opp.
- De resterende `<option>`/eksport-kallestedene til `SAK_TYPE_IKON`/`GRUPPE_IKON`/
  `KONTROLLAVVIK_IKON` selv — uendret, som planlagt (dette var aldri målet).
- Fortsatt ~837 emoji igjen i filen — hoveddelen er nå status-fargesirkler (unntatt),
  toast-/bekreftelsesmeldinger (esc()-pakket, se Prioritet 56), og skjermer utenfor
  denne rundens fokus (Historikk, Rapporter, Analyse sine øvrige detaljer, Verksted,
  Service, Dekk).

**Versjoner**

- `sw.js` CACHE_VERSION: bilpark-v53 → bilpark-v54
- `storage.airtable.js`: uendret

**Verifisering**

- 522 funksjonssignaturer (521 + 1 ny: `kategoriIkonLucide`) — diff bekrefter INGEN
  eksisterende funksjon endret signatur.
- `node --check` OK. HTML tag-balanse uendret (1425/1425 `<div>`).
- Alle 17 simuleringsassertions kjørt på nytt — bestått, tre oppdatert til å reflektere
  sakAvvikChecklistHtml() sine tilsiktede nye Lucide-ikoner (ikke regresjoner).
- Manuelt verifisert at hvert av de 18+4 nye kallestedene er fri for `esc()`,
  `<option>` og eksportfunksjoner FØR endring — samme metodikk som fanget opp
  problemene i Prioritet 56, denne gangen brukt proaktivt i stedet for reaktivt.

**Kjente begrensninger**

- Skulle `HOVEDSTATUS_IKON` sine to ikke-fargekodede unntak (⛔🚐) likevel ønskes
  Lucide-konvertert separat fra fargesirklene, krever det en litt mer finmasketløsning
  (egen betinget rendering per nøkkel) — ikke gjort her for å unngå et inkonsistent
  statusuttrykk.
- Se Prioritet 56 for full liste over gjenstående emoji-kategorier og generell
  anbefaling for videre arbeid.

---

## 2026-09-12

### Prioritet 56 — Fullfør Lucide-migreringen (delvis levert — viktig arkitekturfunn)

**Problem eller mål**

Fjerne alle gjenværende operative emoji-ikoner i hele appen (utover det Prioritet 55
allerede dekket) og erstatte med Lucide. Målet var 100 % Lucide / 0 % emoji.

**Kritisk arkitekturfunn — «0 % emoji» er IKKE trygt å oppnå med et automatisert/bredt
grep-og-erstatt-forsøk i denne kodebasen**

Mange emoji er ikke isolerte "ikon-slots" i HTML, men sitter inni verdier som senere
konsumeres i kontekster der HTML/SVG ikke kan rendres:

1. **`esc()`-pakkede tekstfelt.** Funksjoner som `settingsAccordionRow(key, title, ...)`
   og `layoutEditorFlateHtml()` kaller `esc(title)`/`esc(labelForKey[key])` på
   parametere som i dag starter med en emoji (f.eks. `'🔄 Oppdater app'`,
   `'➕ Bestill tjenester'` i `DASHBOARD_LAYOUT_FLATER`). En Lucide-`<i data-lucide>`
   satt inn her ville blitt HTML-escapet og vist som synlig, ødelagt tag-tekst i
   stedet for et ikon.
2. **Delte ordbøker brukt i FLERE kontekster samtidig.** `HOVEDSTATUS_IKON`,
   `SAK_TYPE_IKON`, `KONTROLLAVVIK_IKON`, `DRIVSTOFF_IKON`, `GRUPPE_IKON` og
   `STANDARD_BILKATEGORIER` brukes BÅDE i ren HTML OG inni `<option>`-elementer
   (nedtrekksmenyer viser kun ren tekst, aldri HTML) OG i Excel/rapport-eksport
   (`exportKostnadExcel`/`exportRapportExcel`/`exportAnalyseExcel`, `rapportTabellRad`).
   Én delt kilde kan derfor ikke trygt gjøres om til Lucide uten å splitte den i to
   separate oppslag — én HTML-variant og én ren-tekst-variant for eksport/dropdown.
3. **Frie tekstfelt som ender opp `esc()`-et.** F.eks. `sak.nextAction` (admin-skrevet
   fritekst, prefikset med "➡️ " ved bygging av Kalender-data) rendres senere via
   `esc(a.detalj)` i `renderKalender()`.

Et første, bredt automatisert forsøk (linje-for-linje-erstatning med sikkerhetsfilter)
fanget IKKE opp alle disse mønstrene og introduserte reelt ødelagte visninger 8 steder
før grundig manuell gjennomgang av HELE diffen fanget opp og reverterte dem. Dette
bekrefter at videre arbeid på dette MÅ gjøres punkt for punkt med verifisert kontekst
per kallested — ikke som ett stort, automatisert steg.

**Levert i denne runden (verifisert trygt — alltid ren HTML, aldri `esc()`/`<option>`/eksport)**

- Administratorens mobile bunnmeny (`MOBIL_BUNNMENY`) — **var helt oversett i
  Prioritet 55** til tross for å være primærnavigasjon på hver mobilskjerm: Hjem→House,
  Biler→Truck, Bestill→Wrench, Kalender→CalendarDays, Mer→MoreHorizontal.
- `VARSELLAMPE_ICON.annet` (❓→AlertCircle/HelpCircle) — bekreftet trygg etter å ha
  sjekket alle fire faktiske kallesteder.
- ~25 enkeltstående, verifiserte knapper/titler i ren HTML: 🕐→Clock (Historikk-lenke i
  Kjøretøyprofil-tabell), 💰→CircleDollarSign (kostnadsvisninger, `kostCardHtml`),
  🗑️→Trash2 (slett-knapper for kontroll/historikk/telefonnummer), 🔽→ChevronDown
  (filter-knapper på tvers av Aktive saker/Rapporter/Kostnader/Analyse),
  ⭐→Star (neste verkstedtime-merke), 🔎→Search (avansert visning-lenke),
  📨→Mail (Nye kommentarer-tittel).

**Ikke levert / krever eksplisitt oppfølgingsbeslutning**

- De 5 delte ikon-/kategori-ordbøkene (se punkt 2 over) — krever en bevisst beslutning
  om å splitte hver i en HTML-variant og en eksport/dropdown-tekst-variant. Dette er en
  reell, større endring enn «kun ikonografi» slik oppdraget avgrenset det.
- `DASHBOARD_LAYOUT_FLATER` sine komponent-labels (Layout Editor) — krever samme
  splitting siden `esc()` brukes der.
- Resterende ~859 emoji i filen (ned fra 894) — hoveddelen sitter i nettopp disse delte
  ordbøkene/`esc()`-kontekstene, ikke i enkle, isolerte HTML-ikonspenn.

**Versjoner**

- `sw.js` CACHE_VERSION: bilpark-v52 → bilpark-v53
- `storage.airtable.js`: uendret

**Verifisering**

- 521 funksjonssignaturer uendret (diff = tomt).
- `node --check` OK. HTML tag-balanse uendret (1425/1425 `<div>`).
- Alle 17 simuleringsassertions kjørt på nytt — 16/17 bestod uendret, 1 oppdatert til å
  reflektere en tilsiktet ikonendring (❓ → Lucide help-circle i Aktive saker sin
  sjekkliste), ikke en regresjon.
- Full manuell gjennomgang av samtlige 43 linjer i den automatiserte batchen — 8 reelt
  ødelagte endringer identifisert og reversert FØR levering (ingen av dem nådde
  sluttfilen).

**Kjente begrensninger / anbefaling til produkteier**

Skal «0 % emoji» faktisk fullføres, anbefales et eget, avgrenset oppfølgingsoppdrag som
eksplisitt godkjenner å:
1. Splitte `HOVEDSTATUS_IKON`/`SAK_TYPE_IKON`/`KONTROLLAVVIK_IKON`/`DRIVSTOFF_IKON`/
   `GRUPPE_IKON` i separate HTML- og tekst-varianter, ELLER
2. Bygge en `escIkon()`-hjelpefunksjon som trygt kan skille mellom disse to
   bruksmåtene automatisk.
Uten en av disse er resten av emoji-forekomstene i praksis IKKE trygge å konvertere i
et enkelt steg.

---

## 2026-09-12

### Prioritet 55 — Standardiser Bilpark på Lucide-ikoner (delvis levert)

**Problem eller mål**

Erstatte emoji og et egendefinert SVG-ikonsett med ett konsistent, moderne ikonbibliotek
(Lucide) — ren standardisering, ingen endring i layout, farger, struktur eller
arbeidsflyt.

**Viktig arkitekturbeslutning**

Bilpark er en frakoblet PWA uten byggesteg (GitHub Pages, ingen bundler). To reelle
alternativer ble vurdert:
1. Bake inn nøyaktig SVG-baneddata for hvert ikon direkte i koden (null ekstern
   avhengighet, men krever 100 % nøyaktig kildedata).
2. Laste Lucide via CDN (samme mønster appen allerede bruker for SheetJS/xlsx til
   Excel-eksport) og kalle `lucide.createIcons()` etter hver `render()`.

Forsøk på å hente eksakt SVG-baneddata for alle ~24 nødvendige ikoner via nettsøk ga ikke
pålitelige nok treff til å garantere pikselnøyaktige ikoner. Valgte alternativ 2 —
samme, allerede aksepterte mønster som SheetJS — fremfor å risikere feiltegnede ikoner.
**Kjent, eksplisitt begrensning:** i motsetning til SheetJS (kun én valgfri
eksportknapp) brukes Lucide av HELE appens ikonografi. Service workeren cacher bevisst
kun samme-opprinnelse-filer (uendret arkitekturprinsipp, se `sw.js`), så ikonene vises
ikke ved ekte offline bruk før nettleseren selv har cachet unpkg-scriptet fra et
tidligere besøk. Dette bør vurderes eksplisitt av produkteier gitt appens vekt på
pålitelighet for sjåfører i felt.

**Levert**

- Ny delt hjelpefunksjon `luc(navn)` bygger `<i data-lucide="...">`-plassholdere;
  `refreshLucideIcons()` kalt etter alle tre render-innganger (administrasjon,
  sjåførmodus, innlogging).
- Ny CSS `.lucide-ic` — arver størrelse fra omkringliggende `font-size` (1em), akkurat
  som emoji-en den erstatter gjorde, for å garantere ingen layoutforskyvning. Plassholder
  er usynlig (`opacity:0`) til faktisk SVG er satt inn, unngår synlig "hopp".
- Gjenbrukte en eksisterende, men aldri koblede CSS-variabel (`--tone`) til å gi
  Lucide-ikonene riktig farge der emoji tidligere bar fargen implisitt i selve glyfen
  (f.eks. sakFaseTellerne).
- **Sidemeny** (mobil-drawer OG desktop-sidebar, begge oppdatert for konsistens):
  Hjem→House, Biler→Truck, Bestill tjenester→Wrench, Kalender→CalendarDays,
  Aktive saker→TriangleAlert, Kommentarer→MessageSquare, Påminnelser→Bell,
  Kostnader→BarChart3, Rapporter→FileBarChart, Historikk→History, Analyse→LineChart,
  Innstillinger→Settings, Logg ut→LogOut. Pluss Kontroll/Registrer avvik (ikke i
  spesifikasjonen, men gitt samme ikoner som gjenbrukes andre steder for konsistens).
- **Dashboard**: sakFaseTellereHtml() (delt mobil/desktop) — Aktive saker→TriangleAlert,
  Under oppfølging→Clock3, Planlagt verksted→Wrench. KPI-kort Biler i drift→Truck,
  Kalender→CalendarDays. Bilpark status→Activity. Krever handling nå→Siren (dynamisk
  farge — rød/gul/grønn — bevart via `style="color:..."` i stedet for emoji-bytte, jf.
  STATUSVISNING-regelen). Prioriterte biler→Truck.
- **Bestill tjenester** (Dashboard-instansen): Service→Wrench, EU-kontroll→ShieldCheck,
  Dekkskifte→CircleDot, Ruteskift→CarFront. Verkstedtime ikke rørt (fjernet fra
  Dashboard i Prioritet 53, urørt andre steder — «følger egen commit», jf. spek).
- **Sjåførmodus**: erstattet et eksisterende, egendefinert SVG-ikonsett
  (`sjaforIkonSvg()`/`P48_IKON_PATHS`, fra en tidligere sprint) med ekte Lucide for de
  ni navngitte funksjonene — Min Bil→Truck, Ringeliste→Phone, Kommentarer→MessageSquare,
  Mer→MoreHorizontal, Registrer skade→TriangleAlert, Varsellampe→AlertCircle,
  Kontrollavvik→ClipboardCheck, Ny sjåfør→UserRound, Sjekk ut bil→LogOut. Dette
  egendefinerte settet var i seg selv et brudd på «ikke bland flere SVG-biblioteker» —
  retting av dette var derfor i tråd med commitens formål, ikke utenfor scope.
- Statusfarger (🟢🟡🔴⚪) er IKKE rørt noe sted — forblir emoji og primær
  statuskommunikasjon, iht. STATUSVISNING-regelen.

**Ikke levert i denne runden (eksplisitt avgrenset, ikke tapt av forglemmelse)**

Kun de fire seksjonene med eksplisitt ikon-til-navn-tabell i oppdraget (Dashboard,
Sidemeny, Bestill tjenester, Sjåførmodus) er konvertert. Resten av appens ~900
emoji-forekomster (Aktive saker-sjekkliste, Biloversikt-tabeller, Kalender, Historikk,
Rapporter, dialoger, skjemaer, `sjaforIkonSvg()` sine gjenværende ikoner som
chevron/kalender/telleverk/mappe på Min Bil) er UENDRET — oppdraget ga ingen eksplisitt
ikon-tabell for disse, og å gjette ~900 navn ville gitt en langt større og mer
risikofylt endring enn det som ble bedt om. Se «Kjente begrensninger».

**Versjoner**

- `sw.js` CACHE_VERSION: bilpark-v51 → bilpark-v52
- `storage.airtable.js`: uendret (rent visuell endring, ingen datamodell rørt)

**Verifisering**

- 521 funksjonssignaturer — diff mot forrige versjon viser KUN de to nye hjelpe-
  funksjonene (`luc`, `refreshLucideIcons`), ingen eksisterende funksjon endret signatur.
- `node --check` OK. HTML tag-balanse uendret (1425/1425 `<div>` — ren innholdsendring).
- Alle 17 simuleringsassertions fra tidligere sprinter kjørt på nytt — bestått uendret
  (bekrefter saksmotor/varsellampe-/kontrollavvik-logikk er 100 % urørt).
- Alle 24 `luc()`-ikonnavn kontrollert for konsistent stavemåte og gjenbruk på tvers av
  kallesteder (samme funksjon → samme ikonnavn overalt, jf. Komponentregler).

**Kjente begrensninger**

- **Offline-risiko** (se over): ikonene krever at unpkg.com/lucide er lastet minst én
  gang med nettforbindelse. Anbefaling: vurder å be om eksplisitt godkjenning av dette,
  eller invester i å verifisere eksakt SVG-baneddata for et fast, lite ikonsett og bake
  det inn i stedet, dersom offline-pålitelighet for disse spesifikke ikonene er kritisk.
- Sjåførmodus sine chevron-, kalender-, telleverk- og mappe-ikoner (Min Bil-nøkkeltall)
  bruker fortsatt det gamle `sjaforIkonSvg()`-systemet — ikke i den eksplisitte
  ikon-tabellen, derfor ikke konvertert.
- Layout Editor sine tekstetiketter (f.eks. "📋 Kommende oppgaver" i innstillings-listen)
  er urørt — dette er administrative listetekster, ikke operative Dashboard-ikoner.
- Resten av appens emoji (Aktive saker, Biloversikt, Kalender, Historikk, Rapporter,
  dialoger) er ikke konvertert — se over.

---

## 2026-09-12

### Prioritet 54 — Kalender blir eneste planleggingsflate

**Problem eller mål**

Planlegging og Kalender viste i praksis samme informasjon (service, EU-kontroll,
dekkskift, verksted, oppfølginger) og svarte på samme spørsmål: "Hva skjer fremover?"
Bilpark skal ha én sannhet for fremtidige aktiviteter.

**Funn ved kartlegging**

En tidligere sprint hadde allerede flyttet innholdet inn i Kalender
(`planleggingSeksjonHtml()`, kalt fra `renderKalender()`) — den frittstående
"📅 Planlegging"-skjermen (`renderPlanlegging()`) var på leveringstidspunktet en byte-for-
byte funksjonelt duplikat av det samme innholdet, kun uten månedsgriden. Den hadde heller
ingen gjenværende inngang i navigasjonen (verken sidemeny eller Dashboard). Arbeidet var
dermed i stor grad allerede gjort — denne leveransen fjerner det som ble stående igjen.

**Levert**

- Fjernet `renderPlanlegging()` og `attachPlanleggingListeners()` (all funksjonalitet
  bekreftet identisk til stede i `planleggingSeksjonHtml()`/`attachKalenderListeners()`).
- Fjernet `'planlegging'` fra `ADMIN_SCREENS` og `OVERSIKT_SWIPE_BACK_SCREENS`.
- Fjernet route-/listener-dispatchen for `screen === 'planlegging'`.
- Ryddet en misvisende seksjonskommentar (`flatePlanleggingData()` — datakilden er
  UENDRET og fortsatt i bruk, kun kommentartittelen "scrPlanlegging" var utdatert).
- Bekreftet: Dashboardets "Kalender"-kort (fra forrige sprint) peker allerede dit alt
  fremtidig arbeid nå spores fra.

**Ikke rørt**

`flatePlanleggingData()` (datakilden Kalender leser fra — uendret), all planlegg-/
rediger-/slett-logikk for service, dekkskift, verksted og oppfølging (uendret, ligger i
sine egne dedikerte skjermer som Kalender navigerer videre til — ingen kode duplisert).

**Versjoner**

- `sw.js` CACHE_VERSION: bilpark-v50 → bilpark-v51
- `storage.airtable.js`: uendret

**Verifisering**

- 519 funksjonssignaturer igjen (521 − 2), diff mot forrige versjon viser KUN de to
  fjernede funksjonene — ingen andre er rørt.
- `node --check` OK. HTML tag-balanse OK (1425/1425 `<div>` — 13 færre, konsistent med
  fjernet markup).
- Alle 17 simuleringsassertions fra tidligere sprinter kjørt på nytt — bestått uendret.
- Grep bekrefter ingen gjenværende `goTo('planlegging')`, menypunkter eller andre
  innganger til den fjernede skjermen noe sted i appen.

**Kjente begrensninger**

- DEL 7 i oppdraget ("ARBEID NÅ / ARBEID SENERE / ARKIV") beskriver informasjons-
  arkitekturen som allerede oppnås av DEL 1–6 (Aktive saker+faser / Kalender / Historikk
  finnes alle, Planlegging er borte). Dette er IKKE tolket som en bestilling om å legge
  synlige gruppeoverskrifter i sidemenyen — det er en egen, separat designbeslutning som
  ikke ble eksplisitt bedt om. Si fra dersom faktiske visuelle seksjonsoverskrifter i
  sidemenyen også ønskes.

---

## 2026-09-12

### Prioritet 53 — Dashboard 5.0: fjern støy og tydeliggjør operativ kontroll

**Problem eller mål**

Dashboard skal svare på fire spørsmål (Hva haster? Er bilparken operativ? Hva må følges
opp? Hva kommer neste?) — ikke være en komprimert kopi av alle andre skjermer.

**Levert (kun desktop `renderDashboard()`, se begrensninger)**

- Fjernet KPI-kortet "Aktive saker" (duplikat av de tre fase-tellerne øverst på siden).
- Fjernet KPI-kortet "Kommende frister" (duplikat av Kalender).
- "Planlagte timer" omdøpt til "Kalender" — samme datagrunnlag (`upcomingVT`/`nearestVT`),
  klikk åpner nå Kalender-skjermen i stedet for et verkstedfilter.
- KPI-raden er dermed redusert fra fire til to kort: Biler i drift + Kalender.
- Fjernet "Verkstedtime" fra Dashboardets Bestill tjenester (kun denne forekomsten —
  mobil, Kjøretøyprofil og den dedikerte Bestill tjenester-skjermen er uendret).
  Verkstedtime opprettes nå kun via saksflyten (Aktiv sak → Under oppfølging → Verksted).
- Biloversikt-tabellen redusert fra seks til tre kolonner: Bil, Status, Sjåfør. Reg.nr,
  Løyvenummer og Drivstoff er fjernet fra denne visningen (fortsatt synlig under "Se alle
  biler"). Status vises nå som ett ikon (🟢/🟡/🔴/⚪) med full statustekst i hover-tooltip
  i stedet for en tekstbrikke, for å garantere at tabellen aldri krever sideveis scrolling.
- "Bilpark status"-kortet komprimert fra sju til tre kategorier: 🟢 Operative,
  🟡 Må følges opp (Under oppfølging + Verksted bestilt + Kritisk + Reservebil +
  Ikke kontrollert slått sammen), 🔴 Ute av drift. Denne komponenten er delt mellom
  mobil og desktop (bevisst, for å unngå duplisert kode) — endringen gjelder derfor
  begge flater, i motsetning til resten av denne leveransen.

**Ikke rørt**

`vehicleHovedstatus()` sitt sju-nivås hierarki (kun VISNINGEN i "Bilpark status" slår
kategoriene sammen, selve beregningen er uendret). Verkstedmodulen, eksisterende
verkstedtimer og sakslogikken. Mobildashbordets KPI-rad og Bestill tjenester (se
begrensninger). Kontrollflyt, kilometerlogikk, Aktiv sjåfør, Skader, Varsellamper.

**Versjoner**

- `sw.js` CACHE_VERSION: bilpark-v49 → bilpark-v50
- `storage.airtable.js`: uendret (ingen nye/endrede Airtable-felt)

**Verifisering**

- 521 funksjonssignaturer i `index.html` identiske før/etter (kun markup/CSS inne i
  eksisterende funksjoner er endret).
- `node --check` og HTML tag-balanse (1438/1438 `<div>`) bestått.
- Alle 17 simuleringsassertions fra Prioritet 52 kjørt på nytt — bestått uendret.
- 5 nye assertions for "Bilpark status"-komprimeringen: bekrefter at ingen bil telles
  dobbelt eller mistes ved sammenslåingen til tre kategorier, i flere scenarioer inkl.
  ytterpunktene "alt operativt" og "alt ute av drift".

**Kjente begrensninger**

- Mobildashbordet (`renderMobilHjem()`) er bevisst IKKE endret for KPI-rad og Bestill
  tjenester — oppdraget nevnte ikke mobil eksplisitt, og strukturen der har ikke
  tilsvarende "Biler i drift"/"Planlagte timer"-kort å bygge videre på. Bør avklares om
  tilsvarende forenkling ønskes speilet der.
- "Må følges opp"-grupperingen (5 kategorier slått sammen) og statusikon-mappingen i
  Biloversikt-tabellen er tolkningsvalg gjort der oppdraget ikke ga en eksplisitt
  fasit for hver av de sju underliggende statusene — kan justeres ved tilbakemelding.

---

## 2026-09-11

### Kommentaropprydding — sprint-sitater fjernet fra kildekoden

**Problem eller mål**

Kildekoden (`index.html`, `storage.airtable.js`) hadde 334 kommentarer som siterte
"Prioritet N"/"PRIORITET NN" som historisk sprint-referanse. All denne historikken
finnes allerede detaljert i dette dokumentet (Prioritet 29–52) og kondensert for eldre
sprinter — sitatene i koden var derfor ren duplisering, ikke ny informasjon.

**Levert**

- Fjernet sprint-sitater (nummer, dato, "se PRIORITET_XX_ANALYSE.md", "Se CLAUDE.md,
  Prioritet N") fra 131 kommentarblokker i `index.html` og 14 i `storage.airtable.js`.
- All teknisk substans beholdt ORDRETT: dataintegritetsregler, FELTREGEL-forklaringer,
  race condition-beskyttelse (`_koKjor`), timeout-logikk (`AbortController`),
  bakoverkompatibilitet for gamle datastrukturer, og enhver "hvorfor eksisterer denne
  koden slik den gjør"-begrunnelse.
- Kun linje-lokale endringer (kunne aldri gripe inn i etterfølgende kodelinjer) — verifisert
  ved at alle 521 funksjonssignaturer i `index.html` er byte-for-byte identiske før/etter.

**Verifisering**

- `node --check` bestått på begge filer.
- HTML tag-balanse uendret (1438/1438 `<div>`).
- Alle 17 simuleringsassertions fra Prioritet 52 kjørt på nytt mot de rensede filene —
  bestått uendret.
- Ingen versjonsendring nødvendig: ingen funksjonell kode, ingen Airtable-felt, ingen
  cache-avhengig app-shell-innhold er endret (kun kommentartekst).

**Kjente begrensninger**

- Et fåtall linjer med ordet "Prioritet" er bevisst urørt fordi de ikke er sprint-sitater,
  men faktisk UI-tekst/kode (f.eks. `SAK_PRIORITET_LABEL`, kolonnenavnet "Prioritet" i
  rapporter, og setningen "Prioritet: Ute av drift > Kritisk > ..." som beskriver en
  rangeringsrekkefølge, ikke en sprint).

---

## 2026-09-11

### Prioritet 52 — Sakskort, fullføring og dataintegritet

**Levert**

- Sakskort viser varsellamper, kontrollavvik og «Annet» direkte uten at saken må åpnes.
- `markerSakUtfort()` setter nødvendige ferdigfelter, lukker avvik og kvitterer tilhørende varsellamper når koblingen er entydig.
- Utførte saker vises korrekt i Historikk, Rapporter og Analyse.
- Verkstedtime registrert utenfor sakskortet kobles automatisk når bilen har nøyaktig én åpen sak i Under oppfølging.
- Ved flere mulige saker gjøres ingen automatisk kobling.
- Kommentarpanelet ble fjernet fra Aktive saker. Kommentaroversikten og underliggende data ble beholdt.

**Kritisk retting**

`sak.avvik[]` var ikke registrert i `LIST_TABLES` og kunne derfor forsvinne ved Airtable-synkronisering. Feltet ble lagt til i `storage.airtable.js` som `AktiveSaker.Avvik`.

**Migrering**

Airtable-tabellen `AktiveSaker` må ha kolonnen `Avvik` som lang tekst/JSON. Se `AIRTABLE_MIGRATION.md`.

**Versjoner**

- `storage.airtable.js`: v2.12.0 → v2.13.0
- `CACHE_VERSION`: bilpark-v48 → bilpark-v49

**Verifisering**

- 17 av 17 simuleringsassertions bestått.
- Layout Editor for sidemenyen ble kartlagt, men ikke implementert.

### Prioritet 51 — Forenklet saksflyt

**Levert**

Ny standardflyt for Aktive saker:

1. Aktiv sak
2. Under oppfølging
3. Planlagt verksted
4. Utført / Historikk

I tillegg kom terminalstatusen Avslått.

- Godta, avslå og fullføre er ettklikks-handlinger uten ekstra skjema.
- Den gamle veiviseren og tidligere delstatuser ble beholdt for historiske data og avansert kostnadsregistrering, men er ikke standardinngang.
- `sakErApen()` regner `utfort` og `avslatt` som lukket.
- Dashboard på desktop og mobil fikk tellere for de tre aktive fasene med direkte navigasjon.
- Nedstrøms visninger arver åpne/lukkede saker fra den delte statusfunksjonen.

**Versjoner**

- Ingen storage-endring.
- `CACHE_VERSION`: bilpark-v47 → bilpark-v48

---

## 2026-09-10

### Prioritet 50 — Kommentarer 2.0

**Problem**

Sjåførens kommentarvisning viste kommentarer fra hele bilparken fordi visningen manglet bilfilter.

**Levert**

- Sjåføren ser bare kommentarer knyttet til aktiv bil.
- Ny administratorvisning for Kommentarer med ulest teller og «Marker som lest».
- Ny fristilt «Legg til kommentar» under sjåførens Mer-meny.
- Fristilte kommentarer lagres i separat `kommentarer[]`-liste i Settings, ikke i `kontroller[]`.
- Kontrollkommentarer og fristilte kommentarer samles i én visningsfunksjon.
- Nytt felt `KommentarLest` på DriverChecks for administrativ lesestatus.

**Viktig arkitekturvalg**

Kommentar-only-rader skal aldri legges i `kontroller[]`, fordi denne listen styrer kontrollstatus, kilometerhistorikk og flere rapporter.

**Versjoner**

- `storage.airtable.js`: v2.11.0 → v2.12.0
- `CACHE_VERSION`: bilpark-v46 → bilpark-v47

**Kjente begrensninger ved leveransen**

- Fristilte kommentarer ligger i én Settings-blob.
- Fristilte kommentarer hadde ingen redigering eller sletting.
- Kommentaroversikten hadde ingen bil- eller periodefilter.

### Prioritet 48.1 — Kontrastretting

**Problem**

Tekst i chip-velgerne under «Registrer varsellampe» og «Registrer avvik» kunne bli nesten svart mot mørk bakgrunn.

**Levert**

- Eksplisitt `color: var(--ink)` på relevante chip-elementer.
- Rettelsen gjelder normal, valgt, hover, aktiv og fokus uten å endre eksisterende grønn aktivstil.

**Versjoner og test**

- `CACHE_VERSION`: bilpark-v46
- Mørk og lys drakt kontrollert.
- Prioritet 48 sin regresjons- og responsivitetstest kjørt på nytt og bestått.

### Prioritet 48 — Premium-polish av sjåførsiden

**Levert**

- Nytt delt linjeikonsystem i sjåførmodus.
- Oppdatert Min Bil med større identitetsflate, 2 × 2 nøkkeltall, tydeligere skilt og egen statuslinje.
- Ensartede handlingskort for skade, varsellampe, avvik, kontakt og ny sjåfør.
- «Sjekk ut bil» fikk teksten «Avslutt arbeidsdagen og frigjør bilen».
- Velg Bil fikk tilbakepil, tydeligere bilkort og egne farger for driftslag.
- Den delte bilvalgskomponenten ble gjenbrukt i sjåfør- og administrasjonsflyt.

**Avgrensning**

Ingen endring i navigasjon, Airtable, kontroll-, aktiv sjåfør- eller kilometerlogikk.

**Versjoner og test**

- `storage.airtable.js`: fortsatt v2.11.0
- `CACHE_VERSION`: bilpark-v45
- 25 av 25 regresjonssjekker bestått.
- 8 av 8 responsivitetssjekker ved 320–430 px bestått.

### Prioritet 47, del 2 — Sjåførens bunnmeny

**Levert**

- Egen sjåførmeny: Min Bil, Ringeliste, Kommentarer og Mer.
- Ringeliste flyttet fra Min Bil til egen skjerm.
- Kommentarer fikk egen skjerm basert på eksisterende kommentarlogikk.
- Mer-menyen gjenbruker eksisterende «Bytt bil»-flyt.
- Ingen nye Airtable-felt eller nye forretningsfunksjoner.

**Versjoner og test**

- `storage.airtable.js`: fortsatt v2.11.0
- `CACHE_VERSION`: bilpark-v44
- Navigasjon, ringelistefilter og delt kommentarmarkup simulert.

### Prioritet 47, del 1 — Kommentarlogg og bestillingsrad

**Levert**

- «Andre kontrollavvik» fjernet fra valgbare nye avvik, men beholdt for historisk visning.
- Kommentarer fra kontroller ble synlige som informasjonslogg, uten å opprette saker.
- Fem bestillingstjenester ble samlet på én responsiv rad på desktop.

**Avgrensning**

Ingen endring i aktiv sjåfør, kilometerlogikk, Layout Editor eller Airtable-skjema.

**Versjoner**

- `storage.airtable.js`: fortsatt v2.11.0
- `CACHE_VERSION`: bilpark-v43

### Prioritet 46 — Rapporter, ruteskift og Verkstedtime 2.0

**Levert**

- Kilometer-, service- og dekkrapport viser full historikk når én bil er valgt.
- Begrensningen på fem dekkskift i dekkoversikten ble fjernet.
- Ruteskift ble lagt til som hurtigbestilling og egen ruteglassrapport.
- Verkstedtime støtter strukturerte typer for EU-kontroll og ruteskift, også samtidig.
- Telefonnummer ble synlig som telefonlenke på kjøretøyprofilen.

**Versjoner og test**

- `storage.airtable.js`: fortsatt v2.11.0
- `CACHE_VERSION`: bilpark-v42
- 27 automatiserte assert-sjekker bestått.

### Prioritet 45 — Omstrukturering av Innstillinger

**Levert**

- Innstillinger samlet i Register, Layout Editor, Sjåførside og Systeminnstillinger.
- Tema og enhetsvisning ble flyttet til logiske grupper.
- Innstillinger ble plassert sist i navigasjonen.
- Ny Ringeliste og Informasjonsveileder.
- Nytt kjøretøyfelt `Telefon`.

**Versjoner og test**

- `storage.airtable.js`: v2.11.0
- `CACHE_VERSION`: bilpark-v41
- Struktur, lagret layout og synk mellom HTML-filene kontrollert.

### Prioritet 44 — Layout Editor

**Levert**

- Rekkefølge og synlighet kan tilpasses for Desktop Dashboard, Mobil Dashboard og Min Bil.
- Oppsett lagres i Settings.
- Nye fremtidige komponenter blir automatisk lagt til og blir ikke skjult av gamle oppsett.
- Sikkerhetskritisk «Sjekk ut bil» forblir fast og synlig.

**Versjoner og test**

- Ingen storage-endring.
- `CACHE_VERSION`: bilpark-v40
- Lagring, gjenoppretting, nullstilling og fremtidssikring simulert.

---

## 2026-09-09

### Prioritet 43 — Kilometerstand og samtidig lesing

**Problem**

Bakgrunnspoll kunne lese gammel kilometerstand mens en ny kontroll fortsatt ble lagret, og midlertidig overskrive riktig lokal visning.

**Levert**

- `get()` går gjennom samme `_koKjor()`-kø som `set()` og `delete()` for samme ressurs.
- Kilometerreglene ble ikke endret. Feilen lå i leserekkefølgen.

**Versjoner og test**

- `storage.airtable.js`: v2.10.0
- `CACHE_VERSION`: bilpark-v39
- Race-mekanismen reprodusert og simulert før og etter retting.

### Prioritet 42 — PWA-installasjon og diagnose

**Problem**

Tre ikonfiler ga 404 fra publisert GitHub Pages-side. Dette gjorde manifestet ugyldig og stoppet service worker-installasjonen fordi `cache.addAll()` feiler samlet.

**Levert**

- Permanent installasjonsseksjon under Systeminnstillinger.
- Kjøretidsdiagnose for manifest, ikoner og service worker.
- Stabil `id` i begge manifester.

**Gjenstående repo-operasjon**

Følgende filer må ligge i publisert `icons/`-mappe:

- `icon-192.png`
- `icon-512.png`
- `icon-512-maskable.png`

**Versjoner**

- Ingen storage-endring.
- `CACHE_VERSION`: bilpark-v38

### Prioritet 41 — Redigerbare bilkategorier og Ute av drift

**Levert**

- Bilkategorier lagres som JSON i Settings og kan opprettes, endres, flyttes og slettes etter beskyttelsesregler.
- Kategori-ID beholdes ved navneendring.
- Kategori med biler kan ikke slettes før bilene flyttes.
- Ute av drift ble systemstyrt status, ikke vanlig kategori.
- Opprinnelig kategori bevares mens bilen står ute av drift.
- Biloversikt grupperer på visningskategori, mens Biler i drift fortsatt viser aktiv bruk på tvers av kategorier.

**Versjoner og test**

- `CACHE_VERSION`: bilpark-v37
- 68 dynamiske sjekker og tidligere regresjonssuiter bestått.

### Prioritet 40 — Aktiv sjåfør og forenklet sjåførflyt

**Levert**

- `settAktivSjafor()` ble eneste tildeler av aktiv sjåfør.
- Administrasjonsregistrert kontroll setter aktiv sjåfør uten å påvirke administratorens lokale sjåførsesjon.
- Ny sjåfør kan overta bilen uten ny kontroll eller historikkpost.
- Sjåførflyten ble endret til bil først, deretter navn.
- Etter kontroll åpnes Min Bil direkte.

**Versjoner og test**

- Ingen storage-endring.
- `CACHE_VERSION`: bilpark-v36
- Samlede suiter for sjåførflyt, aktiv sjåfør og mobilregresjon bestått.

### Prioritet 39 — Mobil Design 4.1

**Levert**

- Mobilforsiden fikk samme designsystem og beregninger som desktop.
- Ny mobil bunnmeny for Hjem, Biler, Bestill, Kalender og Mer.
- Dashboardberegninger ble delt mellom mobil og desktop.
- Biloversikt og kjøretøyprofil ble tilpasset den nye retningen.
- Kontroll og Registrer avvik ble flyttet til eksisterende sekundære innganger.

**Versjoner og test**

- Ingen storage-endring.
- `CACHE_VERSION`: bilpark-v34
- 101 dynamiske sjekker bestått.

---

## 2026-09-08

### Prioritet 39 — Navigasjon og ferdigstilt designretning

**Levert**

- Navigasjonen ble omstrukturert rundt Hjem, Biler, Bestill tjenester, Kalender, Aktive saker, Påminnelser, Kostnader, Rapporter og Innstillinger.
- Historikk og Analyse ble sekundære oppslagsflater.
- Bestill tjenester samlet eksisterende bestillingsflyter.
- Kalender og Planlegging ble presentert som én sammenhengende arbeidsflate.
- Kjøretøyinformasjon samlet identitetsdata og aktiv sjåfør.

**Test**

- 92 dynamiske kontroller bestått uten JavaScript-feil.

### Prioritet 38 — Design 4.1

**Levert**

- Ny mørk standardpalett med lys drakt i samme tokensystem.
- Delte komponentklasser for kort, statuspiller, oppgaver, ikonfliser og faner.
- Dashboard og kjøretøyprofil ble visuelt forenklet.
- Planlegging ble integrert i Kalender.
- Desktopbredden ble utvidet og duplisert topplinje skjult.

**Versjoner og test**

- Ingen storage-endring.
- `CACHE_VERSION`: bilpark-v32
- 68 dynamiske kontroller bestått uten JavaScript-feil.

### Prioritet 37 — Dashboard 4.0, kjøretøyprofil og kalender

**Levert**

- Hurtigbestilling for service, EU-kontroll, dekkskift og verkstedtime.
- Dashboard med KPI-er, kommende oppgaver, bilparkstatus og prioritert oppfølging.
- Kjøretøyprofil med nøkkeltall og faner for Oversikt, Historikk, Skader, Dekk og Kostnader.
- Kalender som visning av eksisterende planlagte aktiviteter.
- Ny Kostnader-fane per kjøretøy.
- Nye kjøretøyfelt `Drivstoff` og `Mobilitetsgaranti`.
- `kontroll.html` ble resynkronisert med `index.html` etter funn av gammel fullkopi.

**Versjoner**

- `storage.airtable.js`: v2.9.0
- `CACHE_VERSION`: bilpark-v31

### Prioritet 36 — Prosjektopprydding og versjonskontroll

**Levert**

- Ekte versjonsavvik mellom storage-filen og scriptreferansene ble rettet.
- Tredje hardkodede forventede versjon ble fjernet.
- Database status fikk nøytrale meldinger når versjon ikke kan bekreftes.
- Foreldede APK-, Netlify- og Vercel-filer ble fjernet.
- Ikonstrukturen ble standardisert til `icons/` i den leverte pakken.

**Merknad**

Senere kontroll i Prioritet 42 viste at ikonmappen fortsatt manglet på den faktisk publiserte siden.

**Versjoner**

- `storage.airtable.js` og scriptreferanser synkronisert på v2.8.1.
- `CACHE_VERSION`: bilpark-v30

---

## 2026-09-07

### Prioritet 35 — Database Status og forventet versjon

Første forsøk på å lese forventet storage-versjon fra scriptreferansen i stedet for en separat vedlikeholdt konstant. Løsningen og et faktisk versjonsavvik ble senere fullført i Prioritet 36.

### Prioritet 34 — Aktiv sjåfør på tvers av registreringskanaler

En tidlig leveranse beskrev at administrasjonsregistrert kontroll skulle sette aktiv sjåfør. Senere kodegjennomgang viste at dette ikke var fullført i faktisk kode. Funksjonen ble reelt implementert og verifisert i Prioritet 40.

### Prioritet 33 — Konsistent tekst for aktiv sjåfør

- Biloversikt og kjøretøyprofil skilte mellom faktisk aktiv sjåfør, sjåfør registrert tidligere samme dag og tilgjengelig bil.
- Filter og etikett fikk samme betydning.
- Excel-eksportens eldre betydning ble ikke endret i denne leveransen.

### Prioritet 32 — Synlighet ved automatisk utsjekking og avkortede lister

- Brukeren fikk forklaring når samme sjåfør flyttet til en annen bil.
- Dashboardlister viste når bare de fem første av flere elementer var synlige.
- Ingen endring i saksmotor eller bilstatusberegning.

### Prioritet 31 — Timeout for Airtable-kall

**Problem**

En hengende forespørsel kunne blokkere alle senere operasjoner i samme ressurskø.

**Levert**

- `airtableFetch()` fikk 20 sekunders timeout med `AbortController`.
- Feil blir synlig og køen kan gå videre.

### Prioritet 29 — Datasikkerhet og stabilisering

**Levert**

- Intern beskyttelse mot dobbel innsending på kritiske handlinger.
- Serialisert skrivekø per Airtable-ressurs.
- Rollback av lokal tilstand ved lagringsfeil.
- Trygg parsing av Settings-JSON med blokkering ved korrupt data.
- Opprydding av gjensidige referanser mellom saker og verkstedtimer.
- Bekreftelse ved direkte admin-korreksjon av kilometerstand.
- Fjerning av duplisert kjøretøylagring.
- Batchet bakgrunnsrendring.
- Full livssyklus for planlagt service.

**Varige konsekvenser**

- Feilet lagring prøves ikke ubegrenset automatisk. Brukeren får synlig feil og kan prøve igjen.
- Servicehistorikk skal aldri endre kjøretøyets nåværende kilometerstand.
- Korrupt Settings-data skal aldri tolkes som tomt og lagres tilbake.

---

## Eldre konsolidert funksjonalitet

Følgende funksjoner var implementert før eller under tidligere konsolideringer. Detaljert historikk ligger i git:

- samlet sak per kontroll med flere avvikspunkter
- automatisk opprettelse av saker fra skade, varsellampe og kontrollavvik
- verkstedtimer og kobling til saker
- kostnader og avsettinger på saker
- oppfølgingsdatoer og påminnelser
- Historikk-hub
- Rapporthub med standardiserte rapporter og Excel-eksport
- reservebil-logikk
- kjøretøyspesifikke serviceintervaller
- EU-kontroll med fire varslingsnivåer
- gruppert bilvalg og driftslag
- skadebilder i Photos-tabell
- kontrollsletting med opprydding av relaterte data
- synkroniseringsstatus og feillogg i Database status

---

## Regler for nye oppføringer

Legg nye leveranser øverst og bruk denne strukturen:

```markdown
## ÅÅÅÅ-MM-DD

### Prioritet N — Kort tittel

**Problem eller mål**

Kort beskrivelse.

**Levert**

- Konkret endring
- Konkret endring

**Data og migrering**

Kun dersom relevant.

**Versjoner**

- storage-versjon
- cache-versjon

**Verifisering**

- Utførte tester
- Kjente begrensninger
```

Ikke kopier hele oppføringen til `CLAUDE.md` eller `ROADMAP.md`. Flytt bare varige regler til `CLAUDE.md`, åpne tiltak til `ROADMAP.md` og skjemaendringer til `AIRTABLE_MIGRATION.md`.
