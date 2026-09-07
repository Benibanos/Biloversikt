# CLAUDE.md — Bilpark Operativsystem

Prosjektets kilde til sannhet. Sist konsolidert: 2026-09-07 (Prioritet 32 —
tydeligere brukerforståelse rundt automatisk utsjekking og avkortede
Dashboard-lister). **Ved avvik mellom denne filen og koden er koden alltid
sannheten.**

---

## Prosjektkontekst (kort oppstart for nye Claude-økter)

Bilpark Operativsystem er et operativt styringssystem for bilparken til
Bring Larvik (~16 kjøretøy, ~40 ansatte som bytter bil gjennom turnus —
aldri fast sjåfør på fast bil). Ikke et bilregister — et system som sikrer
at riktig informasjon fører til riktig handling. Driftskoordinator er
primærbruker (oppfølging, verksted, skader, varsellamper, dekk, kostnader);
sjåfører registrerer kontroll/avvik/skader via en egen, innloggingsfri URL.

Arkitektur: **GitHub Pages (frontend) + Airtable (backend)**, PWA-støtte,
ett samlet `index.html`-dokument, autoritativ storage-fil
`storage.airtable.js` (v2.8.1). Mobil = handlingsdrevet. Desktop =
kontrollsenter. Ingen Android/APK/TWA/Netlify/Vercel-distribusjon — se
"Arkitektur" under for full måldefinisjon.

Kritiske regler som aldri skal brytes: et nytt felt MÅ registreres i
`LIST_TABLES` i `storage.airtable.js` samtidig som det tas i bruk i
`index.html`, ellers forsvinner det stille; `v.km` skrives KUN fra
`submitKontroll()` (normal drift), `performKontrollDeletion()`
(rekalkulering ved sletting) eller `resetFleetData()` (eksplisitt
admin-nullstilling) — se "Service" under for full liste over tillatte
skrivepunkter; ingen databasefelt fjernes uten eksplisitt instruks; øk
`?v=` i `index.html` OG `versjon` i `storage.airtable.js` sammen ved enhver
endring i storage-filen.

Kjente, uferdige områder: "manuell overstyring mellom mobil-/
desktopvisning" er bekreftet IKKE implementert i kode (verifisert tre
ganger uavhengig, se ROADMAP.md) — ikke anta at den finnes. Eksisterende
km-data bør kontrolleres manuelt for historiske feil fra en nå rettet
service-km-overskrivingsbug (se "Service" under).

**Prioritet 29 (2026-09-07) — kritisk datasikkerhet og stabilisering:**
felles dobbel-innsendingsbeskyttelse (`beskyttSubmit()`/`beskyttKlikk()`),
en serialisert per-ressurs skrivekø i `storage.airtable.js`
(`_koKjor()`/`_skriveKoer`), rollback-på-lagringsfeil for kritiske
mutasjoner (`mutasjonMedRollback()`), trygg JSON-parsing med eksplisitt
ok/feil-status for Settings-blobene `servicehistorikk`/`planlagteservicer`
(`parseJsonTrygt()`), opprydding av gjensidige referanser mellom
`AktiveSaker` og `WorkshopAppointments` ved sletting, en confirm-gate rundt
direkte km-endring i `saveVehicleForm()`, batchet bakgrunnspoll-rendering
(`_lagBatchetLiveSyncHandler()`), og full livssyklus (rediger/fullfør/
slett) for planlagte servicer. Se "Dataintegritet", "Service" og
"Regler for Claude / videre utvikling" under for full detalj.

**Prioritet 31 (2026-09-07) — regresjonsfiks: sjåførkontroll kunne henge for
alltid uten feilmelding.** Root cause: Prioritet 29 sin serialiserte
skrivekø (`_koKjor()` i `storage.airtable.js`) kjeder alle `set()`/`del()`-
kall mot SAMME Airtable-ressurs (f.eks. `Vehicles`/`DriverChecks`) bak
hverandre med `.then()`. `airtableFetch()` hadde ingen timeout — en enkelt
hengende forespørsel (typisk ved dårlig mobildekning i en bil) ble dermed
ALDRI avgjort, og `.then()`-kjeden ventet for alltid. Enhver senere
`submitKontroll()`-innsending mot samme tabell (uansett hvilken bil/sjåfør,
i samme åpne fane) ble da låst bak den hengende skrivingen permanent — uten
feilmelding, uten bekreftelse, uten lagring. Før Prioritet 29 påvirket en
hengende forespørsel kun den ene handlingen; skrivekøen gjorde feilen
appbred og vedvarende. Rettet ved å gi `airtableFetch()` en eksplisitt
20-sekunders timeout (`AbortController`), slik at enhver forespørsel alltid
AVGJØRES (lykkes eller feiler synlig) — som igjen lar `_koKjor()` sin kø
fortsette til neste operasjon uansett hvor dårlig forbindelsen er. Se
"Dataintegritet" under for full detalj. Bekreftet med en dynamisk,
reprodusert test (ikke bare kodelesing) før og etter fiksen.

**Prioritet 32 (2026-09-07) — tydeligere brukerforståelse rundt
"forsvinnende" biler på Dashboard (ren visningsforbedring, ingen
logikkendring).** Oppfølging av en analyse (ikke feil) av
`vehicleHovedstatus()`/`vehicleAktivSjafor()`/`vehicleAktiveSaker()`, som
alle er bekreftet korrekte og UENDRET i denne runden. To reelle,
bevisste mekanismer i eksisterende kode kunne likevel oppleves som at biler
"forsvant" uten grunn:

1. `startBilokt()` (linje ~1669–1690) nullstiller automatisk en annen bils
   `aktivSjafor` dersom samme sjåførnavn allerede sto aktiv der (regelen
   "én sjåfør, én aktiv biløkt" — uendret). Sjåføren får nå et synlig
   `alert()`-varsel når dette skjer, med navn på sjåfør og hvilken bil som
   ble sjekket ut, i stedet for at det skjer stille.
2. Dashboardets "Krever handling nå" og "Prioriterte biler" bygger begge på
   `dashKreverListe`, kuttet til topp 5 (`.slice(0, 5)`). En endring på én
   bil (ny sak, kontroll registrert) kan dermed skyve en annen, uendret bil
   inn eller ut av de synlige 5 — et rent visningsfenomen, ikke en
   datafeil. Begge kort viser nå "Viser 5 av X — +X flere …" når listen er
   avkortet, slik at avkortingen er synlig i stedet for at biler ser ut
   til å forsvinne.

Ingen endring i `vehicleHovedstatus()`, `vehicleAktivSjafor()`,
`vehicleAktiveSaker()`, saksmotoren, biløkt-reglene eller noe
Airtable-skjema — kun to nye, synlige tekstvarsler i eksisterende flyt.

For full detalj: resten av denne filen, samt ROADMAP.md og
AIRTABLE_MIGRATION.md.

---

## Produktvisjon

- Operativt styringssystem for bilparken til Bring Larvik (ca. 16 kjøretøy,
  ca. 40 ansatte som bytter bil gjennom turnus — systemet forutsetter aldri
  fast sjåfør på fast bil).
- Primærbrukere: driftskoordinator (hovedbruker, ansvar for oppfølging,
  verkstedbestillinger, skader, varsellamper, dekk, kostnader/avsettinger) og
  sjåfører (registrerer kontroll, avvik, skader, varsellamper).
- Drift og operativ kontroll kommer før økonomi og analyse.
- «Less is More» / «Keep It Stupid Simple» — administrator skal forstå status
  på hele bilparken på under 10 sekunder; Dashboard spesifikt på under 5
  sekunder.

## Arkitektur

**Måldefinisjon:**

| Lag | Verdi |
|---|---|
| Frontend | GitHub Pages |
| Backend | Airtable |
| Storage | `storage.airtable.js` |
| PWA | Ja |
| APK | Nei |
| Android | Nei |
| TWA | Nei |
| Vercel | Nei |
| Netlify | Nei |

Repoet inneholder ingen filer for andre hostingplattformer og ingen
Android/APK/TWA/Bubblewrap/Play Store-relatert konfigurasjon — alt dette er
fjernet. Introduser det ikke igjen uten en eksplisitt, ny beslutning.

- **Frontend:** Ett samlet HTML-dokument (`index.html`, ~10 700 linjer) med
  all CSS og all forretningslogikk inline i to `<script>`-blokker. Ingen
  separate CSS- eller komponentfiler.
- **Database:** Airtable — se AIRTABLE_MIGRATION.md for fullt skjema. Ingen
  backend/proxy; appen snakker direkte med Airtables REST-API fra
  nettleseren.
- **Hosting:** GitHub Pages — den eneste plattformen prosjektet publiseres på.
- **PWA/service worker:** `sw.js`, nettverk-først-strategi med cache som
  offline-fallback (`CACHE_VERSION = 'bilpark-v26'`, økt fordi `index.html`
  ble endret). To separate
  manifester: `manifest.json` (hovedapp) og `manifest-sjafor.json`
  (sjåfør-snarvei via `kontroll.html`, `start_url` med `?sjafor=1`).
- **Autoritativ storage-fil:** `storage.airtable.js` (nåværende versjon
  `v2.8.0`, cache-bustet via `?v=2.8.0` på script-taggen i `index.html`).
  Dette er den ENESTE Airtable-storage-filen i prosjektet — ingen
  konkurrerende varianter (`storage_airtable.js`, `airtable_storage.js`,
  `airtable.storage.js`) finnes som egne filer (kun feilskrivinger i
  løpende kommentartekst forekommer — se AIRTABLE_MIGRATION.md). Siden
  Prioritet 29 har filen en internt serialisert per-ressurs skrivekø
  (`_koKjor()`) rundt `set()`/`del()` — se "Dataintegritet" under.
- **Autoritative datakilder:** `v.km` er eneste autoritative NÅVÆRENDE
  kilometerstand for et kjøretøy; `servicehistorikk[].km` er historisk og
  skal aldri overskrive `v.km` (se "Dataintegritet" under).
- **Operativt dagskille kl. 04:00:** aktive biløkter avsluttes, aktive
  sjåfører fjernes, kontrollstatus nullstilles kl. 04:00 (`ryddOppBiloktDagskille()`/
  `isoDateForOperationalDay()`), ikke ved midnatt — fordi sjåfører kan
  arbeide til langt etter midnatt.

## Desktop Design 2.0

Adaptivt layout med sidebar-navigasjon (`renderDesktopSidebarHtml()`):

- Dashboard — svarer kun på: hva må jeg gjøre nå / hva kommer snart / hvilken
  bil starter jeg med. Alt annet hører hjemme andre steder.
- Aktive saker
- Historikk (samlet hub for kontroll-/service-/dekk-/skadehistorikk)
- Planlegging
- Biloversikt
- Rapporter (📊, eget menypunkt atskilt fra Analyse)
- Analyse (📈, eget menypunkt)
- Innstillinger (inkl. Database status, synkroniseringsstatus, diagnoseverktøy)

## Mobil Design 2.0

- Biloversikt
- Kontroll
- Registrer avvik
- Aktive saker
- Service
- Dekk
- Planlegging
- Rapporttilgang gjennom Rapporter i ☰ Meny (ikke eget hjemmeskjerm-ikon,
  bevisst valg)
- Sveipenavigasjon mellom hovedskjermer
- Manuell overstyring mellom mobil-/desktopvisning finnes IKKE i koden
  (verifisert tre ganger uavhengig — ingen egen bryter, ingen egen
  localStorage-nøkkel). Vurder som en ny, separat sak dersom dette fortsatt
  er ønsket.

## Kjøretøyprofil

Skal kun vise (fire faste felt):

- Registreringsnummer
- Kilometerstand
- Siste service
- EU-godkjent til

All annen operativ informasjon ligger i Operativ status. Profilen er
restrukturert til seks seksjoner — verifiser fortsatt seksjonsinndeling
direkte i koden ved videre endringer.

## Sjåførkontroll

- Gruppering av bilvalg etter Driftslag (`v.driftslag`, fritekstfelt med
  `<datalist>`-autofullføring, styrer KUN gruppering i Sjåførkontroll, ingen
  annen betydning i appen).
- Fargekodede lag (`DRIFTSLAG_IKON`/`DRIFTSLAG_ORDER` — Lag 1–4, Curbside,
  Montering, Lastebil har faste ikoner/rekkefølge; ukjente/egendefinerte
  driftslag får egen, nøytral gruppe).
- Akkordion — kun én gruppe åpen om gangen (`kontrollApenDriftslag`), delt
  komponent `renderDriftslagGruppertBilvalg()` brukt både i sjåførens
  bilvalg og i admin sin "Bytt bil"-fallback.
- Sist brukte lag huskes lokalt (`localStorage`,
  `bilpark_sjaforkontroll_sist_driftslag`) — kun ved faktisk bilvalg, ikke
  ved ren utforsking.
- "Pick Up Point Larvik" skjules fra Sjåførkontroll sitt bilvalg
  (`DRIFTSLAG_SKJULT_I_KONTROLL`), men er fullt synlig/fungerende alle andre
  steder i appen.
- Driftslag lagres permanent i Airtable (`Vehicles.Driftslag`), ikke kun
  lokalt.
- **Biler ute av drift (`v.uteAvDrift`):** vises IKKE i sin vanlige
  driftslag-gruppe i Sjåførkontroll sitt bilvalg (`kontrollDriftslagGrupper()`),
  men samles i en egen, alltid sist plasserte gruppe "🚫 Biler ute av drift" —
  kortene der er bevisst ikke klikkbare (ingen bilvalg-attributt settes), kun
  synlige for sporbarhet/åpenhet. `v.driftslag` fjernes ALDRI fra kjøretøyet
  mens det er ute av drift, så bilen havner automatisk tilbake i riktig
  driftslag-gruppe den dagen `markerUteAvDrift()`/`settTilbakeIDrift()` setter
  `v.uteAvDrift = false` igjen — ingen egen "husk opprinnelig lag"-logikk
  finnes eller er nødvendig. Samme regel skjuler biler ute av drift fra
  Dashboard sine operative tellinger (kontrollstatus, EU-kontroll/service
  forfalt — se `aktiveVehicles` i `renderDashboard()`), fra Planlegging sine
  status-baserte "kommende"-varsler (`flatePlanleggingData()`), og fra
  bilvelgeren ved registrering av NY sak/verkstedtime/dekkkostnad/skade
  (`vehicleOptions(id, {ekskluderUteAvDrift:true})`). Service-/Dekk-skjermenes
  egne bilvelgere viser fortsatt ALLE biler (historikk skal alltid være
  nåbar) — kun "+ Registrer service"/"+ Planlegg service"/
  "+ Registrer dekkskifte"-knappene skjules når valgt bil er ute av drift.
  Bilen forblir uendret synlig i Biloversikt/Administrasjon, Kjøretøyprofil,
  Historikk, Rapporter og Analyse — ingen av disse filtrerer på `uteAvDrift`.
  Ingen kjøretøy slettes, arkiveres eller mister historikk av denne regelen —
  den er en ren visningsfiltrering.

## Aktiv biløkt

- Kontroll tilhører bilen (`v.aktivSjafor`, satt av `startBilokt()`).
- Biløkt tilhører sjåføren.
- Sjekk ut (`vehicleAktivSjafor()` → null) gjør bilen tilgjengelig for neste
  sjåfør.
- Automatisk avslutning kl. 04:00 (operativt dagskille, se over).
- `startBilokt()` kalles kun fra faktisk sjåførmodus (`driverMode`,
  `?sjafor=1`/`kontroll.html`) — kontroller registrert via admin sitt vanlige
  ✅ Kontroll-ikon setter IKKE `v.aktivSjafor`. `vehicleSisteSjafor()` finnes
  som en bredere visningsfunksjon (viser siste gjennomførte kontroll i dag
  hvis ingen aktiv biløkt), brukt kun til informasjonsvisning — ikke til
  "biler i drift"-tellingen (`hDriftCount`), som fortsatt strengt betyr
  "kjører akkurat nå".

## Aktive saker og Wizard

- Samlet sak per kontroll (én sak per bil, ikke én sak per avvik).
- Flere avvikspunkter per sak (Sammenslåtte Kontrollavvik).
- Selektiv verkstedbehandling og selektiv fullføring av enkeltavvik innenfor
  en flerpunkts sak.
- Kun aktive avvik påvirker bilstatus (fargekoding: Grønn = ingen aktive
  saker, Gul = aktive saker finnes, Oransje = verksted bestilt, Rød =
  kritisk sak).
- Livssyklus: Ny → Vurderes → Tiltak planlagt → Verksted bestilt → Delvis
  utført (kun flerpunkts saker med gjenstående avvik) → Utført → Lukket.
- Sakstyper: Varsellampe, Skade, Kontrollavvik, Dekk, Service, Annet.
- Reservebiler som ikke er tatt i bruk ennå i dag er unntatt fra det daglige
  kontrollkravet (Reservebil-logikk); ved dagskille går bilen automatisk
  tilbake til reservestatus.
- To felt på `AktiveSaker` (`RegistrationNumber`, `AssignedTo`) skrives ved
  opprettelse, men leses aldri tilbake av appen i dag — se
  AIRTABLE_MIGRATION.md. Ikke bygg videre logikk på dem uten å bekrefte
  formålet først; ikke slett dem uten en egen, eksplisitt godkjent
  migrering.

## Service

- `v.km` er eneste autoritative NÅVÆRENDE kilometerstand. **Tillatte
  skrivepunkter (uttømmende liste, Prioritet 29, Del 6):**
  - `submitKontroll()` — normal, operativ skrivevei ved hver kontroll.
  - `performKontrollDeletion()` — kan rekalkulere `v.km` fra nyeste
    gjenværende kontroll når en kontroll slettes.
  - `resetFleetData()` — eksplisitt admin-nullstilling av hele flåten.
  - `saveVehicleForm()` — direkte redigering av km i kjøretøyskjemaet er
    fortsatt mulig, men KUN som en eksplisitt admin-korreksjon: en
    `confirm()`-dialog vises nå før lagring dersom (og kun dersom) km-verdien
    i skjemaet faktisk avviker fra `v.km`, slik at vanlig redigering av
    regnr/modell/lag/annen kjøretøyinfo aldri kan overskrive `v.km` utilsiktet
    ved et uhell. Samme funksjon lagrer nå kun ÉN gang (den tidligere
    duplikate `saveVehicles()`-kallingen er fjernet).
  - Ingen andre steder i koden skriver til `v.km` — verifisert ved
    kodegjennomgang i Prioritet 29-revisjonen.
- `servicehistorikk[].km` er historisk kilometerstand ved utført service —
  skal ALDRI overskrive `v.km`. **Historisk kritisk feil** (rettet): en
  tidligere versjon av `submitService()` overskrev `v.km` når en historisk
  service-km var høyere enn bilens daværende km. Rettet ved å fjerne
  skrivingen til `v.km` fra `submitService()`, med validering og
  bekreftelsesdialog ved avvik. **Sjekk eksisterende data manuelt** for
  kjøretøy som kan ha fått `v.km` feilaktig overskrevet før rettingen — dette
  er ikke automatisk korrigert.
- Serviceintervall per bil: `v.serviceIntervallKm` (Airtable-felt
  `ServiceIntervallKm`).
- Varslingsgrenser knyttet til intervallet (`vehicleServiceStatus()`).
- Registrering (`submitService()`), redigering (`saveServiceEdit()`) og
  sletting (`deleteService()`) av servicehistorikk — verifisert at kun
  opprettelse noensinne hadde km-overskrivingsfeilen. Alle tre går nå gjennom
  `mutasjonMedRollback()` (rollback ved lagringsfeil, se "Dataintegritet").
- **Planlagt service** (`planlagteServicer`) har siden Prioritet 29 full
  livssyklus: opprettelse (`submitPlanlagtService()`), redigering
  (`savePlanlagtServiceEdit()`), sletting (`deletePlanlagtService()`) og
  markering som utført (`fullforPlanlagtService()` — oppretter en korrekt
  servicehistorikk-oppføring med sporbarhetsfeltet `fraPlanlagtServiceId`
  tilbake til den opprinnelige avtalen, FØR den planlagte avtalen fjernes,
  og kun etter at historikk-oppføringen er bekreftet lagret). Beskyttet mot
  dobbel innsending/dobbelttrykk (`beskyttSubmit()`/`beskyttKlikk()`). `v.km`
  røres aldri av noen av disse — brukeren oppgir km eksplisitt ved
  fullføring, på samme måte som ved vanlig "Registrer service".
- Planlagt service og ordinære verkstedtimer er FULLSTENDIG adskilte
  datamodeller — `planlagteServicer` er en egen array/Settings-nøkkel, IKKE
  en verkstedtime. `WorkshopAppointments.Type` (`verkstedtime.type`) finnes
  fortsatt registrert i `LIST_TABLES` av historiske årsaker, men er IKKE i
  aktiv bruk i dagens kode (rettet dokumentasjonsfeil, Prioritet 29 —
  se `storage.airtable.js` for detaljer). Feltet er ikke fjernet, siden
  databasefelt ikke slettes uten eksplisitt instruks.
- **`servicehistorikk` og `planlagteservicer` er IKKE egne Airtable-tabeller**
  — de lagres som én samlet JSON-blob hver i `Settings`-tabellen (samme
  Key/Value-mønster som `theme-preference`/`verksteder`). All historisk
  service for ALLE kjøretøy over ALLE år ligger i ÉN Airtable-celle — vær
  oppmerksom på Airtables praktiske feltgrense ved videre vekst. Begge
  datasett er siden Prioritet 29 beskyttet mot korrupt JSON (se
  "Dataintegritet") og lagres via en serialisert skrivekø. Vurdert, men IKKE
  aktivert, radbasert migrering til egne tabeller — se AIRTABLE_MIGRATION.md,
  seksjon 9 (tabellene finnes ikke i produksjonsbasen i dag).

## EU-kontroll

- Permanent felt på kjøretøyet: `v.euGodkjentTil` (Airtable-felt
  `EuGodkjentTil`).
- Varslingsnivåer (`vehicleEuKontrollStatus()`): fire nivåer — over 90 dager
  igjen / under 90 / under 30 / utløpt.
- Vises i Kjøretøyprofil (ett av de fire faste feltene), Operativ status, og
  Planlegging.

## Rapporter

Rapporthub (`renderRapporterOversikt()`), standardisert flatt rutenett
(`RAPPORT_ORDER`, 12 rapporter), delt infrastruktur
(`rapportTabellHtml()`, `rapportEksporterExcel()`, felles statusfilter):

- Kilometerstandsrapport (kun `v.km` som kilde, egen datakvalitetsstatus)
- Servicerapport
- Dekkrapport
- EU-kontrollrapport
- Skaderapport (per skade, med bildeteller via `damagePhotoCount()`)
- Saksrapport (tidligere "Avviksrapport")
- Kostnadsrapport
- Bilparkrapport
- Verkstedrapport
- Bilhelserapport
- Månedsrapport (eneste med full bredde, 2×2-nøkkeltallskort)
- Kontrollrapport

Alle følger: Overskrift → Filtre → Forhåndsvisning → Excel-eksport
(SheetJS/xlsx.full 0.18.5, lastet fra CDN i `index.html`).

## Dataintegritet

- **Timeout på Airtable-nettverkskall (Prioritet 31, regresjonsfiks):**
  `airtableFetch()` i `storage.airtable.js` avbryter (via `AbortController`)
  enhver forespørsel som ikke har fått svar innen 20 sekunder
  (`AIRTABLE_TIMEOUT_MS`), og forkaster den med en synlig feil i stedet for
  å la den henge for alltid. Dette er en forutsetning for at Prioritet 29
  sin serialiserte skrivekø (`_koKjor()` under) skal være trygg: køen
  kjeder skrivinger mot samme ressurs bak hverandre med `.then()`, og en
  hengende forespørsel uten timeout ville blokkert ALLE senere skrivinger
  mot samme tabell for alltid (bekreftet regresjon — se
  "Prosjektkontekst" øverst i denne filen for full beskrivelse). Rør ikke
  denne timeouten ned mot 0 eller fjern den — det gjenåpner nøyaktig denne
  feilen.
- Ingen duplikate sannheter (f.eks. `v.km` vs. servicehistorikk-km, se over;
  "biler i drift"-tellingen har kun én autoritativ kilde, `hDriftCount`).
- Ingen parallelle historikkmotorer.
- Ingen databasefelt slettes uten eksplisitt instruks.
- `AIRTABLE_MIGRATION.md` oppdateres ved enhver feltendring.
- Full Cleanup: kontrollsletting fjerner alle relaterte data uten
  "spøkelsesdata" igjen.
- Synkroniseringsstatus: `instrumenterStorageForSynkStatus()` sporer
  `pagaendeSkrivinger`, `synkFeilLogg` (siste 20 feilede forsøk),
  `sisteVellykkedeSynkTidspunkt` — vist øverst i Database status i
  Innstillinger. **Oppdatert (Prioritet 29):** det finnes fortsatt ingen
  UBEGRENSET automatisk retry-kø for feilede lagringer — "feilet lagring"
  betyr fortsatt at brukeren får en tydelig, vedvarende feilmelding med én
  gang og selv må trykke på nytt for å prøve igjen (ikke noe som står og
  venter i bakgrunnen uten videre handling). Det som ER nytt: (1) en
  serialisert per-ressurs SKRIVEKØ i `storage.airtable.js` (`_koKjor()`)
  sørger for at to samtidige lagringer til samme tabell/Settings-rad aldri
  kjører side om side (dette er ren rekkefølge-sikring, ikke retry — en
  feilet operasjon rapporteres fortsatt umiddelbart, den prøves ikke på
  nytt automatisk, og feiler den, blokkerer den ikke senere operasjoner i
  køen); (2) kritiske mutasjoner (service, planlagt service, aktive saker,
  verkstedtimer) bruker nå `mutasjonMedRollback()`, som ved feilet lagring
  gjenoppretter forrige, korrekte lokale tilstand og re-rendrer — slik at
  brukergrensesnittet ALDRI kan vise en endring som "lagret" når den faktisk
  feilet.
- **Korrupt Settings-JSON (Prioritet 29, Del 4):** `parseJsonTrygt()` gir et
  eksplisitt `{ok: true, value}` / `{ok: false, error}`-resultat ved
  innlasting av `servicehistorikk`/`planlagteservicer`. Ved korrupt JSON
  blir datasettet ALDRI stille nullstilt til et tomt array — det flagges i
  `_korrupteDatasett`, lagring til nettopp det datasettet blokkeres
  (`saveServicehistorikk()`/`savePlanlagteServicer()` kaster en feil i
  stedet for å lagre), og brukeren varsles både med en engangs-`alert()` ved
  oppstart og med et vedvarende varselpanel i Database status i
  Innstillinger. Én korrupt Settings-nøkkel påvirker aldri andre datasett.
- Et nytt felt i JavaScript-koden som IKKE er registrert i `LIST_TABLES` i
  `storage.airtable.js` forsvinner STILLE ved neste henting fra Airtable
  (bekreftet gjentatte ganger historisk: ServiceIntervallKm, EuGodkjentTil,
  AktivSjafor, Driftslag rammet alle av nøyaktig denne feilen før de ble
  registrert). **Registrer ALLTID et nytt felt i `LIST_TABLES` samtidig som
  det tas i bruk i `index.html`.**
- **Dobbel innsending (Prioritet 29, Del 1):** alle kritiske skjemaer og
  handlingsknapper (service, planlagt service, verkstedtime, kontroll, sak,
  kjøretøy, dekkskifte/-kostnad, skade, sletting av sak/verkstedtime, lagring
  av kjøretøyskjema, fullføring av planlagt service) er beskyttet av en
  delt, intern JS-lås (`beskyttSubmit()` for skjema-submit,
  `beskyttKlikk()` for knappeklikk) — ikke bare HTML sitt `disabled`-
  attributt. Første trykk låser umiddelbart, låsen frigjøres ALLTID i en
  `finally`-blokk (også ved feil), og brukeren kan alltid prøve på nytt
  etter en feilet lagring.
- **Gjensidige referanser mellom Aktive saker og verkstedtimer (Prioritet
  29, Del 5):** `deleteSak()` nullstiller `sakId`/`caseId` på enhver
  verkstedtime som pekte på den slettede saken (fjerner IKKE selve
  verkstedtiden). `deleteVT()` nullstiller `linkedVtId` og tilbakestiller
  status til `'tiltak-planlagt'` på en eventuell sak som pekte på den
  slettede verkstedtiden (fjerner IKKE selve saken, og lar den aldri stå
  feilaktig fast som "Verksted bestilt" uten en gyldig verkstedtime).

## Sikkerhet

`airtable-config.js` inneholder en ekte Airtable Base ID og et ekte Personal
Access Token i klartekst, synlig for enhver som besøker siden (ingen
backend/proxy finnes). Dette er en kjent, dokumentert arkitekturbegrensning,
ikke en feil å rette i denne appen slik den er bygget i dag:

- Bruk et Personal Access Token scopet KUN til denne basen, med KUN
  `data.records:read`/`data.records:write` (+ `schema.bases:read`/`write`
  for automatisk skjemasjekk).
- Roter tokenet jevnlig via Airtable Console.
- Del aldri lenken til appen offentlig utover de som skal bruke den.
- Ekte beskyttelse (skjule tokenet helt) krever en egen backend/proxy —
  utenfor denne appens nåværende arkitektur.
- Ved deling av kildekoden (f.eks. en ZIP): bruk `airtable-config.example.js`
  med placeholder-verdier i stedet for den ekte filen.

## Regler for Claude / videre utvikling

**Før enhver endring:**

1. Les denne filen, ROADMAP.md og AIRTABLE_MIGRATION.md.
2. Analyser eksisterende kode direkte i `index.html`/`storage.airtable.js`
   før du antar hvordan noe fungerer — flere historiske feil i dette
   prosjektet oppsto nettopp av antakelser uten kodeverifisering.
3. Kontroller autoritative filnavn: `storage.airtable.js` er den ENESTE
   Airtable-storage-filen. Finner du referanser til `storage_airtable.js`,
   `airtable_storage.js` eller `airtable.storage.js` som faktiske FILER (ikke
   bare feilskrivinger i kommentartekst) — stopp og avklar, ikke anta
   hvilken som er riktig.
4. Ta en snapshot/backup (git-commit) før du starter — git-historikken er
   backupen, ikke en arkivmappe i produksjonsprosjektet.

**Under endring:**

- Endre minst mulig. Ikke dupliser funksjoner — søk etter eksisterende
  `renderX()`/`saveX()`/beregningsfunksjoner før du skriver en ny.
- Ikke opprett nye sannheter (f.eks. en ny kilde til "nåværende km" ved
  siden av `v.km`, eller en ny "biler i drift"-telling ved siden av
  `hDriftCount`).
- Ikke bygg parallelle løsninger (f.eks. en ny Airtable-storage-fil ved
  siden av `storage.airtable.js`).
- Ikke fjern fungerende funksjonalitet under redesign.
- Skill mellom mobil og desktop — de har bevisst forskjellige layouts, men
  skal dele samme data/logikk.
- Bevar dataintegritet: et nytt felt MÅ registreres i `LIST_TABLES` i
  `storage.airtable.js` SAMTIDIG som det tas i bruk i `index.html`.
- Ikke skriv hemmeligheter (tokens, nøkler) i kode eller chat. Bruk
  `airtable-config.example.js` som mal ved deling.

**Etter endring — testkrav:**

- Kjør syntakssjekk (`node --check` på JS-filer; balanse-/tag-sjekk på
  `index.html`).
- Test mobil-shell og desktop-shell (åpner, navigerer, sveip).
- Test Airtable-lesing og -skriving, samt refresh (data må laste korrekt på
  nytt).
- Test kjernefunksjonene som faktisk er berørt av endringen: Driftslag,
  Sjåførkontroll-grupper, Aktiv biløkt/sjåfør, kontroll
  registrere/slette/Full Cleanup, Aktive saker, Dashboardtellinger,
  Serviceintervall (og at servicehistorikk ALDRI endrer `v.km`), EU-kontroll,
  Dekk, Skadebilder, Historikk, Planlegging, Rapporthub/Kilometerstandsrapport-
  eksport, service worker/PWA, oppdateringsfunksjonen ("Oppdater app" i
  Innstillinger).
- Oppdater dokumentasjon (denne filen ved ny funksjonalitet,
  AIRTABLE_MIGRATION.md ved databaseendringer, ROADMAP.md ved
  statusendring) — etter implementering, ikke før.
- Oppdater filversjon/cache-busting: `?v=` i `index.html` OG
  `versjon`-verdien i `storage.airtable.js` samtidig (kun ved endring i
  `storage.airtable.js`); `CACHE_VERSION` i `sw.js` (ved endring i
  app-shell-filer).
- Oppgi alle endrede filer, gjennomførte tester og kjente begrensninger.

**Kjente, dokumenterte fallgruver i dette prosjektet:**

- Et nytt JS-felt uten tilsvarende `LIST_TABLES`-oppføring forsvinner stille
  (ikke en feilmelding — bare tapt data ved neste refresh).
- `v.km` må ALDRI overskrives av en historisk service-km-verdi.
- Service worker cacher app-shell-filer "nettverk først, cache som
  offline-fallback" — en gammel `storage.airtable.js` kan likevel sitte
  igjen i nettleseren hvis cache-buster-tallet ikke økes ved opplasting.
- `servicehistorikk`/`planlagteservicer` er én JSON-blob i Settings, ikke
  egne tabeller — vær varsom med feltgrenser ved stor vekst.
