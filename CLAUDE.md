# CLAUDE.md — Bilpark Operativsystem

Prosjektets kilde til sannhet. Sist konsolidert: 2026-09-04 (Mobilitetsavtale
på kjøretøy, se ROADMAP.md). **Ved avvik mellom denne filen og koden er koden
alltid sannheten.**

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
`storage.airtable.js` (v2.8.0). Mobil = handlingsdrevet. Desktop =
kontrollsenter. Ingen Android/APK/TWA/Netlify/Vercel-distribusjon — se
"Arkitektur" under for full måldefinisjon.

Kritiske regler som aldri skal brytes: et nytt felt MÅ registreres i
`LIST_TABLES` i `storage.airtable.js` samtidig som det tas i bruk i
`index.html`, ellers forsvinner det stille; `v.km` skrives KUN fra
`submitKontroll()`, aldri fra service-registrering; ingen databasefelt
fjernes uten eksplisitt instruks; øk `?v=` i `index.html` OG `versjon` i
`storage.airtable.js` sammen ved enhver endring i storage-filen.

Kjente, uferdige områder: "manuell overstyring mellom mobil-/
desktopvisning" er bekreftet IKKE implementert i kode (verifisert tre
ganger uavhengig, se ROADMAP.md) — ikke anta at den finnes. Eksisterende
km-data bør kontrolleres manuelt for historiske feil fra en nå rettet
service-km-overskrivingsbug (se "Service" under).

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
  offline-fallback (`CACHE_VERSION = 'bilpark-v27'`, økt fordi `index.html`
  og `storage.airtable.js` ble endret for Mobilitetsavtale-feltet). To separate
  manifester: `manifest.json` (hovedapp) og `manifest-sjafor.json`
  (sjåfør-snarvei via `kontroll.html`, `start_url` med `?sjafor=1`).
- **Autoritativ storage-fil:** `storage.airtable.js` (nåværende versjon
  `v2.8.0`, cache-bustet via `?v=2.8.0` på script-taggen i `index.html`).
  Dette er den ENESTE Airtable-storage-filen i prosjektet — ingen
  konkurrerende varianter (`storage_airtable.js`, `airtable_storage.js`,
  `airtable.storage.js`) finnes som egne filer (kun feilskrivinger i
  løpende kommentartekst forekommer — se AIRTABLE_MIGRATION.md).
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
  bil starter jeg med. Alt annet hører hjemme andre steder. **Prioritet 29
  (Desktop Dashboard 3.0):** nøyaktig fire områder — 1) kompakt, klikkbar
  statuslinje i toppfeltet (`renderDashboard`/hovedrenderen — 🟢 Operative /
  🟡 Oppfølging / 🔴 Kritisk → Aktive saker / 🚚 i drift), 2)+3) "Krever
  handling nå" og "Kommer snart" side om side (`.dash-row-2`, inkl. kommende
  Service/EU-kontroll i "Kommer snart" — kun `snart`-nivåene, ikke forfalt),
  4) "Prioriterte biler" som bred tabell (Prioritet/Bil/Årsak/Status/Neste
  handling) under. Kun desktop — mobilforsiden (`renderMobilHjem()`) er
  ikke rørt.
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

## Mobilitetsavtale (2026-09-04)

- Nytt felt på kjøretøyet: `v.mobilitetsavtale` (boolsk, Airtable-kolonne
  `Mobilitetsavtale`, registrert i `LIST_TABLES`).
- Ren kjøretøyinformasjon — følger bilen, IKKE service-/verksted-/
  sakshistorikk. Ingen egen historikkmotor, ingen kobling mot
  `servicehistorikk`/`verkstedtimer`/`aktiveSaker`.
- Manuelt av/på-felt: redigeres som en vanlig avkrysningsboks ("☑ Aktiv
  mobilitetsavtale") i Bilinformasjon (`renderBilkort()` → `infoBody`),
  lagres sammen med resten av kjøretøyfeltene via `saveVehicleForm()`/
  "Lagre" — samme mønster som Løyvenummer/Driftslag, ingen egen
  umiddelbar-lagre-knapp (i motsetning til "Ute av drift", som er en
  Faresone-handling).
- Vises i bilkort-hodet (`.bilkort-head`, nederst til høyre) som
  ✅/❌ Mobilitetsavtale-merke.
- **Ikke bygget ennå (bevisst utsatt, "Fremtidig støtte"):** forslag om å
  tilby "☑ Aktiver mobilitetsavtale" ved serviceregistrering. Feltet skal
  fortsatt kunne overstyres manuelt selv om dette bygges senere — ikke la
  en fremtidig auto-utfylling fjerne den manuelle bryteren.
- Kjøretøyprofil-toppanelet (de fire faste feltene over) er bevisst IKKE
  utvidet med dette feltet — kun Bilkort-hodet og Bilinformasjon viser det i
  dag, jf. brukerens egen prioritering ("Kjøretøyprofil" markert valgfritt/
  senere).

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

- `v.km` er eneste autoritative NÅVÆRENDE kilometerstand.
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
- Registrering, redigering (`saveServiceEdit()`) og sletting
  (`deleteService()`) av servicehistorikk — verifisert at kun opprettelse
  (`submitService()`) noensinne hadde km-overskrivingsfeilen.
- Serviceavtaler/planlagt service og ordinære verkstedtimer er adskilt
  (`WorkshopAppointments.Type` skiller `'service'` fra vanlige
  verkstedtimer).
- **`servicehistorikk` og `planlagteservicer` er IKKE egne Airtable-tabeller**
  — de lagres som én samlet JSON-blob hver i `Settings`-tabellen (samme
  Key/Value-mønster som `theme-preference`/`verksteder`). All historisk
  service for ALLE kjøretøy over ALLE år ligger i ÉN Airtable-celle — vær
  oppmerksom på Airtables praktiske feltgrense ved videre vekst. Se
  AIRTABLE_MIGRATION.md.

## Planlegging — Utfør arbeid direkte (Prioritet 30)

Formål: eliminere dobbeltregistrering. Ny arbeidsflyt overalt: Planlegging →
Utført arbeid → historikk opprettes automatisk → planlagt hendelse fjernes
(IKKE: Planlegg → Utfør → Registrer på nytt → Historikk).

- **Planlagt service:** "✔ Utført arbeid" på en rad i `planlagteServicer`
  åpner et inline skjema (`fullforPlanlagtService()`). Oppretter en
  `servicehistorikk`-oppføring (`type: 'Planlagt service'`), fjerner
  planen fra `planlagteServicer`, og fjerner en eventuell tilhørende
  service-verkstedtime med samme dato. Km ved service lagres KUN på
  servicehistorikk-oppføringen — `v.km` overskrives aldri (samme
  bekreftelsesdialog-mønster som `submitService()` ved avvik, se
  "Kilometerregel"/"Service" over).
- **Planlagt verkstedtime:** "✔ Utført arbeid" på en kommende
  (`upcoming`) `vtCard()` åpner et inline skjema
  (`fullforVerkstedtime()`). Bevisst INGEN nye felt/tabeller: gjenbruker
  `t.dato` (utført dato — faller dermed automatisk ut av
  "kommende"-filteret), `t.pris` (kostnad) og `t.beskrivelse`/`t.notater`
  (arbeid utført/kommentar). Verkstedtimen ER historikken; det opprettes
  ingen egen, parallell verkstedhistorikk-oppføring. Trigger den
  eksisterende `oppdaterVerkstedStatuser()`-kaskaden for en eventuelt
  tilknyttet sak, akkurat som ved vanlig redigering.
- **Planlagt dekkskifte:** Planleggings "Dekk"-kolonne er et LIVE
  DOT-alder-varsel (`dekkAlderStatus()`), ikke en egen planlagt-enhet —
  derfor ingen ny entitet innført. Den eksisterende "Registrer
  dekkskifte"-knappen i `renderDekkSkjerm()` er omdøpt til "✔ Utført
  dekkskifte" (samme felt/logikk/`submitDekkskifte()` som før). Klikk på
  en Planlegging-dekkrad (`data-goto-dekk` i `attachPlanleggingListeners()`)
  åpner skjemaet automatisk (`showAddDekkskifte = true`). NB: selve
  DOT-alder-varselet fjernes fortsatt kun via det separate "Lagre
  dekkinfo"/DOT-kode-skjemaet på samme skjerm — dette er eksisterende,
  ikke ny, atferd.
- **Oppfølginger:** "✔ Utført oppfølging" i saks-wizardens steg 3
  (`sakWizardSteg3Html()`), vist kun når `s.followUpDate` er satt, åpner et
  eget skjema (`submitSakWizardOppfolgingUtfort()`) atskilt fra "📅 Legg
  til oppfølging" (som setter en NY dato, ikke markerer utført). Oppretter
  en `s.historikk`-oppføring og nullstiller `s.followUpDate` — fraværet av
  gyldig oppfølgingsdato er nok til at saken automatisk faller ut av
  Planleggings oppfølgingskolonne (`sakOppfolgingStatus()`).
- **Dataintegritet:** service/verksted/dekk/oppfølging forblir fire
  atskilte historikktyper — ingen datamodeller er slått sammen.
- **Dashboard/Planlegging:** alle fire flytene kaller `render()` etter
  lagring — ingen egen "oppdater Dashboard"-kode trengs, samme prinsipp som
  resten av appen (LIVE-beregnet ved hvert render()).
- Gjelder både desktop og mobil (Service/Dekk/Planlegging/Aktive saker
  finnes på begge — se "Mobil Design 2.0"). Dashboard-restrukturen fra
  Prioritet 29 er IKKE rørt av Prioritet 30.

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
  Innstillinger. **Viktig:** ingen retry-kø finnes — "feilet lagring" betyr
  at brukeren allerede fikk en feilmelding med én gang, ikke at noe står og
  venter på å bli lagret automatisk.
- Et nytt felt i JavaScript-koden som IKKE er registrert i `LIST_TABLES` i
  `storage.airtable.js` forsvinner STILLE ved neste henting fra Airtable
  (bekreftet gjentatte ganger historisk: ServiceIntervallKm, EuGodkjentTil,
  AktivSjafor, Driftslag rammet alle av nøyaktig denne feilen før de ble
  registrert). **Registrer ALLTID et nytt felt i `LIST_TABLES` samtidig som
  det tas i bruk i `index.html`.**

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
