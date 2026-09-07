# ROADMAP.md — Bilpark Operativsystem

Sist konsolidert: 2026-09-07 (Prioritet 34 — Aktiv sjåfør følger turnus,
uansett registreringskanal), basert på faktisk kjørende kode i
`Benibanos/Biloversikt`.
Status er verifisert mot koden i `index.html`/`storage.airtable.js`, ikke
antatt fra tidligere bestilling. Den fulle, kronologiske historikken over
alle tidligere "Prioritet N"/"Optimalisering N"-runder er ikke lenger
bevart som egen fil i produksjonsprosjektet — den ligger i git-commit
`cae279d` (prosjektets tilstand før den første store konsolideringen).

Statuser: ✅ Implementert og verifisert · 🟡 Delvis implementert ·
🔧 Må feilrettes · 📋 Planlagt

**Prosjektet er rendyrket til GitHub Pages + Airtable.** Ingen
Android/APK/TWA/Bubblewrap/Play Store og ingen Netlify/Vercel-rester finnes
i prosjektet.

**Prioritet 29 — Kritisk datasikkerhet og stabilisering (2026-09-07):**
Lukket de kritiske datatap-/samtidighetsrisikoene som ble avdekket i
Prioritet 28-revisjonen: felles dobbel-innsendingsbeskyttelse for alle
kritiske skjemaer/knapper, en serialisert per-ressurs skrivekø i
`storage.airtable.js` (fjerner race conditions i `reconcileList()`/
`recordIdCache`), trygg rollback-på-feil for kritiske mutasjoner (service,
planlagt service, aktive saker, verkstedtimer), korrupt-JSON-beskyttelse
for Settings-blobene `servicehistorikk`/`planlagteservicer` (blokkerer
lagring i stedet for å stille nullstille til tomt array), opprydding av
gjensidige referanser mellom `AktiveSaker` og `WorkshopAppointments` ved
sletting, fjernet en km-overskrivingsvei i `saveVehicleForm()` og en
duplikat `saveVehicles()`-kalling, batchet bakgrunnspoll-rendering til én
`render()` per synkroniseringssyklus, samt full livssyklus (rediger/
fullfør/slett) for planlagte servicer. Se CLAUDE.md for full detalj og
testkrav kjørt etter endringen, og `PRIORITET_29_SLUTTRAPPORT.md` for
komplett leveranserapport.

**Prioritet 31 — Akutt regresjonsfiks: sjåførkontroll kunne henge for alltid
uten feilmelding (2026-09-07):** ✅ Implementert og verifisert. Root cause:
Prioritet 29 sin serialiserte skrivekø (`_koKjor()`) kjeder alle
`set()`/`del()`-kall mot samme Airtable-ressurs bak hverandre, og
`airtableFetch()` hadde ingen timeout — én hengende forespørsel (typisk ved
dårlig mobildekning i en bil) ble da ALDRI avgjort, og blokkerte permanent
alle senere skrivinger mot samme tabell (f.eks. `Vehicles`/`DriverChecks`)
i samme åpne fane, uten feilmelding, uten bekreftelse, uten lagring.
Reprodusert dynamisk (ikke bare lest i koden) og rettet ved å gi
`airtableFetch()` en 20-sekunders timeout (`AbortController`) slik at
enhver forespørsel alltid avgjøres. Se CLAUDE.md "Dataintegritet" for
detalj.

**Prioritet 32 — Tydeligere brukerforståelse rundt "forsvinnende" biler på
Dashboard (2026-09-07):** ✅ Implementert og verifisert. Ren
visningsforbedring — ingen endring i `vehicleHovedstatus()`,
`vehicleAktivSjafor()`, `vehicleAktiveSaker()`, saksmotoren, biløkt-reglene
eller Airtable. To tiltak: (1) `startBilokt()` viser nå et synlig varsel
til sjåføren når den automatisk sjekker ut en annen bil samme sjåfør sto
aktiv på ("Ola Hansen var allerede aktiv på Bil 5. Bil 5 ble automatisk
sjekket ut."); (2) Dashboardets "Krever handling nå" og "Prioriterte
biler" — begge kuttet til topp 5 — viser nå "Viser 5 av X — +X flere …"
når listen er avkortet, slik at biler som skyves ut/inn av de synlige 5
ved en endring på en ANNEN bil ikke lenger oppleves som at de
"forsvinner" uten forklaring. Se CLAUDE.md for full detalj.

**Prioritet 33 — "Aktiv sjåfør" betyr nå det samme overalt i UI
(2026-09-07):** ✅ Implementert og verifisert. Rotårsak: Biloversikt-kortet
brukte `vehicleSisteSjafor()` (bredere — aktiv biløkt ELLER bare siste
kontroll i dag) for etiketten "👤 Aktiv sjåfør", mens filteret "🚚 Har aktiv
sjåfør" brukte `vehicleAktivSjafor()` strengt (kun live biløkt nå) — en bil
kunne dermed vise "Aktiv sjåfør" på kortet uten å være med i filteret.
Løst uten å røre `vehicleAktivSjafor()`, `vehicleSisteSjafor()`,
biløktlogikk eller Airtable: kortet og Kjøretøyprofilens "Aktiv
sjåfør"-felt viser nå "👤 Aktiv sjåfør: [navn]" kun når
`vehicleAktivSjafor()` er sann, ellers "🕓 Sjåfør i dag: [navn]" når kun
`vehicleSisteSjafor()` er sann, ellers "⚪ Tilgjengelig". Bekreftet
dynamisk: alle biler i "Har aktiv sjåfør"-filteret viser nå "👤 Aktiv
sjåfør", og ingen andre biler gjør det. Kjent, bevisst gjenstående
inkonsistens: Excel-eksportenes "Aktiv sjåfør"-kolonne er ikke endret. Se
CLAUDE.md for full detalj.

**Prioritet 34 — Aktiv sjåfør følger turnus, uansett registreringskanal
(2026-09-07):** ✅ Implementert og verifisert. Ekte logikkendring (ikke kun
visning): "Aktiv sjåfør" skal bety hvem som disponerer bilen i inneværende
skift, ikke bare hvem som har en teknisk aktiv biløkt. Rotårsak:
`v.aktivSjafor` ble kun satt via `startBilokt()`, som kun ble kalt fra
sjåførmodus — en kontroll registrert via administrasjonens vanlige ✅
Kontroll-ikon satte derfor aldri "Aktiv sjåfør", selv om sjåføren fortsatt
disponerte bilen. Løst ved å skille ut tildelingslogikken i en ny funksjon,
`settAktivSjaforForKontroll()`, som `submitKontroll()` nå kaller fra BEGGE
registreringskanaler (sjåførmodus via uendret `startBilokt()`, og
administrasjonsdelen direkte). `vehicleAktivSjafor()`, `vehicleSisteSjafor()`,
`driverMode`, `driverActiveVehicleId`, `saveDriverLocalSession()` og all
øvrig biløktlogikk er UENDRET — kun når/hvor feltene faktisk blir satt er
endret. Kryss-bil-utsjekkingsvarselet fra Prioritet 32 vises nå identisk
fra begge kanaler. Bekreftet dynamisk: administrasjonens kontroll-
registrering setter nå Aktiv sjåfør korrekt, bilen teller umiddelbart som
"🚚 Biler i drift", og administratorens egen lokale sesjon forblir urørt.
Se CLAUDE.md for full detalj.

---

## Aktive saker

✅ Implementert og verifisert — samlet sak per bil, flere avvikspunkter,
selektiv verkstedbehandling/fullføring, full livssyklus Ny→Vurderes→Tiltak
planlagt→Verksted bestilt→Delvis utført→Utført→Lukket. Kun aktive avvik
påvirker bilstatus.

## Automatisk saksgenerering

✅ Implementert og verifisert — kontrollavvik/varsellamper/skader oppretter
saker automatisk, bekreftet i kodeflyten fra `submitKontroll()`.

## Verkstedflyt

✅ Implementert og verifisert — verkstedtimer (`WorkshopAppointments`),
kobling til saker (`SakId`/`CaseId`), kontaktperson/telefon.

## Kostnader og avsettinger

✅ Implementert og verifisert — `AktiveSaker` har `estimatedCost`,
`actualCost`, `requiresProvision`, `provisionAmount`, `provisionMonth`.
Kostnadsrapport i Rapporthub.

## Operativ kontroll

✅ Implementert og verifisert — Dashboard, Operativ status, "Biler i drift
nå"-telling (kategori-agnostisk, verifisert ved kodegjennomgang).

## Påminnelsesmotor

✅ Implementert og verifisert — oppfølgingsdato på saker (`followUpDate`),
forfalte saker, manglende neste handling, dashboardvarsler.

## Bilstatus og kjøretøyhistorikk

✅ Implementert og verifisert — Historikk-hub samler kontroll-/service-/
dekk-/skadehistorikk per bil.

## Rapportering

✅ Implementert og verifisert — Rapporthub 2.0 med 12 standardiserte
rapporter (se CLAUDE.md), delt Excel-eksportinfrastruktur.

## Analyse

🟡 Delvis implementert — eget menypunkt (📈 Analyse) finnes atskilt fra
Rapporter, men omfanget av selve analysefunksjonaliteten er ikke verifisert
i dybden i denne gjennomgangen (ingen egen "Operativ Belastning"-indikator
funnet — se merknad under Dashboard-optimaliseringer).

## Dashboard-optimaliseringer

✅ Implementert og verifisert — Prioritet 26.2 (Dashboard Nullstilling):
svarer kun på tre spørsmål (hva må gjøres nå / hva kommer snart / hvilken
bil starte med), lesbart på under 5 sekunder.

🔧 **Kjent, dokumentert avvik fra tidligere spesifikasjon:** en tidligere
spesifikasjon forutsatte at service-/kontrollprognoser og en "Operativ
Belastning"-indikator allerede fantes fra "Prioritet 18–24" — dette ble
avkreftet direkte i koden under Prioritet 26.2-arbeidet og er bevisst IKKE
bygget. Ikke marker dette som implementert uten å bygge det først.

## Kontrollsletting og Full Cleanup

✅ Implementert og verifisert — kontrollsletting fjerner relaterte data uten
spøkelsesdata (tidligere en kjent regresjon, nå rettet og verifisert).

## Reservebil-logikk

✅ Implementert og verifisert — Optimalisering 14: reservebiler unntatt fra
daglig kontrollkrav inntil tatt i bruk, automatisk tilbakestilling ved
dagskille.

## Serviceintervaller

✅ Implementert og verifisert — `v.serviceIntervallKm` per bil, registrert i
`LIST_TABLES` (`ServiceIntervallKm`), varslingsgrenser i
`vehicleServiceStatus()`.

## Kontrollstatus etter dager

✅ Implementert og verifisert — datakvalitetsstatus i Kilometerstandsrapport
(`vehicleDatakvalitetStatus()`, fem nivåer basert på dager siden siste
kontroll).

## Kjøretøyprofil-opprydding

✅ Implementert og verifisert — restrukturert til seks seksjoner (Prioritet
26.3), fire faste felt (Registreringsnummer/Kilometerstand/Siste
service/EU-godkjent til).

## Historikk-hub

✅ Implementert og verifisert — samlet inngang for kontroll-/service-/dekk-/
skadehistorikk, Service lagt til (Prioritet 26.10).

## Gruppert bilvalg

✅ Implementert og verifisert — gruppert dropdown i Biloversikt og Kontroll
(delt mønster), samt driftslag-gruppert bilvalg i Sjåførkontroll.

## Planlegging

✅ Implementert og verifisert — planlagt service atskilt fra ordinære
verkstedtimer (`WorkshopAppointments.Type`), EU-kontroll og service vist i
Planlegging.

## Operativ beslutningsstøtte

🟡 Delvis implementert — Dashboard og Operativ status gir et operativt
øyeblikksbilde, men et samlet, navngitt "beslutningsstøtte"-verktøy utover
dette er ikke identifisert som egen, avgrenset funksjon i koden.

## Less is More-audit

✅ Implementert og verifisert — Dashboard Nullstilling (Prioritet 26.2) er
eksplisitt en Less is More-revisjon: alt som ikke svarer på de tre
kjernespørsmålene er flyttet ut av Dashboard.

## Design 2.0 mobil/desktop

✅ Implementert og verifisert (desktop, Prioritet 27: adaptivt layout,
sidebar-navigasjon) — se CLAUDE.md for full struktur.

🟡 Delvis implementert (mobil) — sveipenavigasjon og hovedskjermene er
verifisert i koden. "Manuell overstyring mellom mobil- og desktopvisning"
som eget, eksplisitt brukervalg finnes IKKE i koden (bekreftet ved tre
uavhengige gjennomganger — ingen egen bryter, ingen tilhørende
localStorage-nøkkel). Se "Neste prioriterte arbeid".

## EU-kontroll

✅ Implementert og verifisert — se CLAUDE.md.

## Rapporthub

✅ Implementert og verifisert — Rapporthub 2.0, alle 12 rapporter
standardisert til samme mal.

## Kilometerstandsrapport

✅ Implementert og verifisert — egen datakvalitetsstatus, kun `v.km` som
kilde, dedikert Excel-eksport med frosset overskrift og tusenskilletegn.

## Driftslag

✅ Implementert og verifisert — se CLAUDE.md, "Sjåførkontroll". Feltet er
korrekt registrert i `LIST_TABLES` i nåværende `storage.airtable.js` (v2.7.0)
og bekreftet sendt/lest til/fra Airtable i koden.

## Biler ute av drift skjules fra aktive lister

✅ Implementert og verifisert (2026-09-07) — en bil merket `v.uteAvDrift`
skjules nå fra: driftslag-gruppert bilvalg i Sjåførkontroll (samlet i en
egen, ikke-klikkbar gruppe "🚫 Biler ute av drift" nederst), Dashboard sine
operative tellinger (kontrollstatus, EU-kontroll/service forfalt),
Planleggings status-baserte "kommende"-varsler, og bilvelgeren ved
registrering av ny sak/verkstedtime/dekkkostnad/skade. Forblir uendret
tilgjengelig i Biloversikt/Administrasjon, Kjøretøyprofil, Historikk,
Servicehistorikk, Dekkhistorikk, Rapporter og Analyse. Service-/Dekk-
skjermenes bilvelgere viser fortsatt alle biler (historikk skal alltid være
nåbar) — kun registrer-knappene skjules. `v.driftslag` beholdes uendret i
databasen mens bilen er ute av drift, så den havner automatisk tilbake i
riktig driftslag-gruppe når status settes tilbake til aktiv. Ingen sletting,
arkivering eller endring av registreringsnummer — ren visningsfiltrering.
Se CLAUDE.md, "Sjåførkontroll".

## Sjåførkontroll-dropdown

✅ Implementert og verifisert — akkordion med kun ett lag åpent om gangen
(Prioritet 27.7), delt komponent mellom sjåførens bilvalg og admin sin
"Bytt bil"-fallback.

## Data- og filnavnrettinger

✅ Implementert og verifisert i denne konsolideringen — bekreftet at
`storage.airtable.js` er den ENESTE, autoritative Airtable-storage-filen i
repoet; ingen konkurrerende filnavn-varianter finnes som faktiske filer (kun
som feilskrivinger i løpende kommentartekst, se AIRTABLE_MIGRATION.md).

## Synkroniseringsstatus

✅ Implementert og verifisert — se CLAUDE.md, "Dataintegritet". Viser
🟢/🟡/🔴-status, feilede lagringer, sist synkronisert-tidspunkt i Database
status.

## Skadebilder

✅ Implementert og verifisert — bilder lagres som base64 dataURL i egen
Airtable-tabell `Photos` (Key/Value-mønster, samme som `Settings`), ikke som
Airtable-vedleggsfelt. Både enkeltbilde (`damage:{id}`) og flerbilde-flyt via
sjåførkontroll (`kontroll:{id}:0`, `:1`, …) er implementert, inkludert
fallback-kopiering og lightbox-galleri.

## Serviceavtaler og servicehistorikk

✅ Implementert og verifisert — se CLAUDE.md, "Service". Kritisk
km-overskrivingsfeil er rettet (se AIRTABLE_MIGRATION.md/CLAUDE.md for
detaljer og manuell datakontroll-anbefaling). `servicehistorikk`/
`planlagteservicer` er ikke egne Airtable-tabeller, men én JSON-blob hver i
`Settings` — se AIRTABLE_MIGRATION.md, seksjon 9, for vurdert (men ikke
aktivert, fordi tabellene ikke finnes i produksjonsbasen) fremtidig
radbasert migrering. **Nytt i Prioritet 29:** full livssyklus for planlagte
servicer (rediger/marker utført/slett — `savePlanlagtServiceEdit()`,
`fullforPlanlagtService()`, `deletePlanlagtService()`), samt korrupt-JSON-
beskyttelse og rollback-på-lagringsfeil for begge datasett (se
"Datasikkerhet og samtidighet" under).

## Datasikkerhet og samtidighet (Prioritet 29)

✅ Implementert og verifisert:

- **Dobbel innsending:** `beskyttSubmit()`/`beskyttKlikk()` — delt,
  internt JS-lås (ikke kun `disabled`-attributtet) rundt alle kritiske
  skjemaer/knapper (service, planlagt service, verkstedtime, kontroll, sak,
  kjøretøy, dekk, skade, sletting av sak/verkstedtime, lagring av
  kjøretøyskjema, fullføring av planlagt service).
- **Skrivekø:** `_koKjor()`/`_skriveKoer` i `storage.airtable.js` —
  serialiserer `set()`/`del()` per ressurs (tabell eller Settings-rad), slik
  at to samtidige lagringer til samme tabell/rad aldri lenger kan
  race-conditione `reconcileList()`/`recordIdCache`. Uendret offentlig
  API (`set`/`del`-signatur), ingen kallesteder måtte endres.
- **Rollback ved lagringsfeil:** `mutasjonMedRollback()` i `index.html` —
  deep-clone-snapshot før mutasjon, gjenoppretter og re-rendrer ved feilet
  Airtable-lagring, med tydelig, vedvarende feilmelding som aldri påstår at
  data ble lagret. Brukt av service, planlagt service, aktive saker og
  verkstedtimer sine kritiske mutasjoner.
- **Korrupt Settings-JSON:** `parseJsonTrygt()` — `servicehistorikk`/
  `planlagteservicer` blir aldri stille nullstilt til tomt array ved
  korrupt JSON; datasettet flagges korrupt, lagring til det blokkeres, og
  brukeren varsles både ved oppstart og i Database status.
- **Gjensidige referanser:** `deleteSak()`/`deleteVT()` rydder nå opp i
  hverandres referanser (nullstiller `sakId`/`caseId` på verkstedtiden ved
  slettet sak; nullstiller `linkedVtId` og tilbakestiller sakstatus til
  "Tiltak planlagt" ved slettet verkstedtime) — ingen av delene slettes
  automatisk som følge av den andre.
- **Kilometerstand:** `saveVehicleForm()` krever nå eksplisitt bekreftelse
  før den kan endre `v.km` direkte (kun ved faktisk verdiendring), og
  dupliserte `saveVehicles()`-kallet i samme funksjon er fjernet.
- **Bakgrunnspoll:** `_lagBatchetLiveSyncHandler()` batcher alle endrede
  datasett i én synkroniseringssyklus til maks ett `render()`-kall, i
  stedet for opptil ett per `LIST_TABLES`-nøkkel.

## Gjenstående kjente feil eller mangler

📋 **Eksisterende kilometerdata bør kontrolleres manuelt** for kjøretøy som
kan ha fått `v.km` feilaktig overskrevet av historiske
service-registreringer før km-overskrivingsfeilen ble rettet (se CLAUDE.md).
Ingen automatisk korrigering er gjort.

✅ **Avklart (Prioritet 29, Del 11):** de to Airtable-feltene
(`AktiveSaker.RegistrationNumber`, `AktiveSaker.AssignedTo`) er IKKE
orphaned på datalagnivå — begge leses faktisk tilbake til minnet ved
innlasting (registrert i `LIST_TABLES`). Beslutning: behold begge felt som
bevisst redundans (se AIRTABLE_MIGRATION.md, seksjon 7, for full
begrunnelse) — ingen kodeendring gjort.

📋 **`servicehistorikk`/`planlagteservicer` lagres fortsatt som JSON-blober**
i Settings-tabellen for ALLE kjøretøy over ALLE år — ikke lenger en akutt
datasikkerhetsrisiko (se "Datasikkerhet og samtidighet" over), men fortsatt
en driftsrisiko ved fortsatt vekst (Airtables praktiske feltgrense per
celle). Målmodell for en eventuell fremtidig radbasert migrering er
dokumentert i AIRTABLE_MIGRATION.md, seksjon 9 — IKKE aktivert, siden de
nødvendige Airtable-tabellene bekreftet ikke finnes i produksjonsbasen i
dag. Krever en egen, separat godkjent migreringssak (inkludert manuelt
Airtable-oppsett) dersom dette skal gjennomføres.

## Neste prioriterte arbeid

📋 Vurder en full, visuell UI-gjennomgang (Del 11 i Prioritet
28-oppryddingen ble kun gjort som statisk kodeanalyse, ikke mot en levende
Airtable-base) for å bekrefte at Aktive saker, Operativ status og
Kjøretøyprofil viser nøyaktig feltsettet spesifisert i CLAUDE.md, ikke mer.

📋 Avklar om "manuell overstyring mellom mobil-/desktopvisning" fortsatt er
ønsket — bekreftet ikke-implementert i kode ved tre uavhengige
gjennomganger. Bygg som ny, avgrenset sak dersom fortsatt aktuelt.
