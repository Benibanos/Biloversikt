# ROADMAP.md — Bilpark Operativsystem

Sist konsolidert: 2026-09-04 (Prioritet 32 — Hurtighandlinger på Desktop
Dashboard), basert på
faktisk kjørende kode i `Benibanos/Biloversikt`.
Status er verifisert mot koden i `index.html`/`storage.airtable.js`, ikke
antatt fra tidligere bestilling. Den fulle, kronologiske historikken over
alle tidligere "Prioritet N"/"Optimalisering N"-runder er ikke lenger bevart
som egen fil i produksjonsprosjektet — den ligger i git-commit `cae279d`
(prosjektets tilstand før den første store konsolideringen).

Statuser: ✅ Implementert og verifisert · 🟡 Delvis implementert ·
🔧 Må feilrettes · 📋 Planlagt

**Prosjektet er rendyrket til GitHub Pages + Airtable.** Ingen
Android/APK/TWA/Bubblewrap/Play Store og ingen Netlify/Vercel-rester finnes
i prosjektet.

**Prioritet 28 — Total Less Is More (2026-09-04):** Repoet redusert fra 25
til 13 filer (dokumentrapporter fra tidligere oppryddingsrunder enten
fjernet eller slått sammen inn i CLAUDE.md/README.md, siden git-historikken
er backupen). 13 verifisert ubrukte funksjoner + 1 ubrukt duplikatvariabel
fjernet fra `index.html` (~70 linjer), ~14 ubrukte CSS-regler fra to
tidligere, allerede erstattede dashboard-design fjernet, og de to
diagnoseseksjonene "Biler i drift — diagnose"/"Driftslag — diagnose" fjernet
fra Innstillinger (begge bekreftet knyttet til nå rettede bugs). Se
CLAUDE.md for testkrav kjørt etter endringen.

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

✅ **Prioritet 29 — Desktop Dashboard 3.0 (2026-09-04):** Dashboard (kun
desktop — mobilforsiden `renderMobilHjem()` er urørt) restrukturert til
nøyaktig fire områder: 1) kompakt, klikkbar statuslinje i toppfeltet (🟢
Operative / 🟡 Oppfølging / 🔴 Kritisk / 🚚 i drift — "Verksted"-chippen
fjernet fra raden, "Kritisk" ruter nå til Aktive saker filtrert på kritisk
prioritet i stedet for Biloversikt), 2) "Krever handling nå" og 3) "Kommer
snart" side om side (`.dash-row-2`), 4) "Prioriterte biler" som en bred
tabell (Prioritet/Bil/Årsak/Status/Neste handling) under. Ingen seksjoner
fjernet fra Biloversikt/Historikk/Rapporter/Analyse — kun Dashboardets egen
presentasjon endret, jf. "Endre minst mulig".

✅ **Del av Prioritet 29:** "Kommer snart" viser nå også kommende Service
og EU-kontroll ("Service om 1800 km" / "EU-kontroll om 56 dager"), avgrenset
til "snart"-nivåene (`vehicleServiceStatus()`/`vehicleEuKontrollStatus()`
sine eksisterende `snart-gul`/`snart-rod`-statuser — forfalt vises fortsatt
kun i "Krever handling nå" for å unngå dobbeltinformasjon). Dette var
tidligere eksplisitt IKKE bygget (se historisk merknad under) — nå bygget
med de samme, allerede eksisterende status-funksjonene, ingen ny
prognoselogikk.

🔧 **Fortsatt IKKE bygget (uendret fra tidligere vurdering):** en egen,
navngitt "Operativ Belastning"-indikator er ikke del av Prioritet 29 og
finnes fortsatt ikke i koden — kun de spesifikke Service-/EU-kontroll-
"kommer snart"-varslene beskrevet over er bygget. Ikke marker en bredere
"Operativ Belastning"-indikator som implementert uten å bygge den først.

✅ **Prioritet 32 — Hurtighandlinger på Desktop Dashboard (2026-09-04):** ny
"⚡ Hurtighandlinger"-seksjon rett under statuslinjen, KUN desktop (mobilens
`renderMobilHjem()` er urørt, som spesifisert).

- 📅 Bestill time: ett felles hurtigskjema (type + bil + dato + klokkeslett
  + kommentar) som ruter til riktig eksisterende planlagt-liste — Service
  → `planlagteServicer`, Dekkskift → `dekkskifttimer`, Verksted →
  `verkstedtimer` (alle tre gjenbrukt uendret, ingen ny lagringslogikk).
  Nytt for EU-kontroll: en minimal, egen liste `euKontrollTimer` (samme
  Settings-blob-prinsipp som de andre) — ingen nye Airtable-felt/tabeller i
  det hele tatt denne runden.
- 🚨 Registrer avvik og 📋 Opprett sak: begge ruter til den eksisterende
  sak-opprettelsesflyten (`goToRegisterSak('')`), samme mål som mobilens
  allerede eksisterende "Registrer avvik"-ikon.
- 🚐 Åpne biloversikt: `goTo('register')`.
- Alle fire bestillingstypene havner automatisk i riktig kategori i
  Planlegging (EU-kontroll-kolonnen slår nå sammen frist-varsel og bestilte
  timer, samme mønster som Service/Dekk fra Prioritet 30/31).
- Bonus-korrigering (ikke mobilvisning): `reloadOne()` sin sanntids-
  oppfriskingsliste manglet en gren for `dekkskifttimer` siden Prioritet
  31 — rettet sammen med den nye `eukontrolltimer`-grenen.
- Kjent, bevisst ikke rettet begrensning: mobilens egen
  Planlegging-badge-telling (`renderMobilHjem()`) er fortsatt upresis (den
  manglet allerede `planlagtDekkskifte` fra Prioritet 31, mangler nå også
  `euKontrollBestilt`) — latt urørt fordi spesifikasjonen eksplisitt ba om
  at mobilvisningen ikke skulle røres. Selve Planlegging-skjermen viser
  fortsatt korrekt innhold og korrekt totaltall på begge flater.
- Verifisert med Playwright (alle fire bestillingstyper, validering,
  navigasjon, Planlegging-visning, og en egen sjekk av at
  Hurtighandlinger-seksjonen IKKE finnes på mobil). Se CLAUDE.md for full
  teknisk detalj.

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

## Mobilitetsavtale på kjøretøy

✅ **Ny funksjon (2026-09-04):** nytt boolsk felt `v.mobilitetsavtale`
(Airtable-kolonne `Mobilitetsavtale`, registrert i `LIST_TABLES`) — ren
kjøretøyinformasjon, atskilt fra service-/verksted-/sakshistorikk. Vises som
✅/❌ Mobilitetsavtale nederst til høyre i bilkort-hodet, redigeres manuelt
("☑ Aktiv mobilitetsavtale") i Bilinformasjon på samme måte som de andre
kjøretøyfeltene. `storage.airtable.js` økt til `v2.8.0`, `sw.js`
`CACHE_VERSION` økt til `bilpark-v27`.

📋 **Fremtidig, bevisst ikke bygget:** tilby "☑ Aktiver mobilitetsavtale" som
et forslag ved serviceregistrering, med fortsatt mulighet for manuell
overstyring. Ikke marker dette som implementert før det faktisk er bygget.

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

✅ **Prioritet 30 — Utfør arbeid direkte fra Planlegging (2026-09-04):**
eliminerer dobbeltregistrering (Planlegg → Utfør → Registrer på nytt →
Historikk). Ny, felles arbeidsflyt for alle fire planlagte hendelsestyper:
Planlegging → Utført arbeid → historikk opprettes automatisk → planlagt
hendelse fjernes umiddelbart.

- Planlagt service: "✔ Utført arbeid" → `fullforPlanlagtService()`.
- Planlagt verkstedtime: "✔ Utført arbeid" → `fullforVerkstedtime()`
  (gjenbruker eksisterende felt på verkstedtimen — ingen nye
  felt/tabeller).
- Planlagt dekkskifte: eksisterende "Registrer dekkskifte" **midlertidig**
  omdøpt til "✔ Utført dekkskifte" (samme skjema/logikk), auto-åpnes ved
  navigasjon fra Planlegging. **Erstattet av Prioritet 31 under** — se der.
- Oppfølging: "✔ Utført oppfølging" i saks-wizardens steg 3 →
  `submitSakWizardOppfolgingUtfort()`, atskilt fra "Legg til oppfølging".

Ingen datamodeller slått sammen (service/verksted/dekk/oppfølging forblir
fire atskilte historikktyper), `v.km` fortsatt aldri overskrevet av
historisk service-km, Dashboard/Planlegging oppdateres uten refresh (samme
`render()`-prinsipp som resten av appen). Verifisert med Playwright
(automatisert smoke-test av alle fire flyter, desktop + mobil) — se
CLAUDE.md for detaljer om hvilke felt som gjenbrukes per flyt.

✅ **Prioritet 31 — Dekkskifttime + Fullfør arbeid direkte fra Planlegging
(2026-09-04):** utvider Dekk-modulen til samme "Planlegg → Utfør →
Historikk automatisk"-filosofi. Ny, egen planlagt-enhet `dekkskifttimer`
(Settings-blob, samme prinsipp som `planlagteservicer` — ingen ny
Airtable-tabell).

- 🛞 Registrer dekkskifttime: dato, klokkeslett, dekkverksted, type
  dekkskifte (Sommer→Vinter / Vinter→Sommer / Nye sommerdekk / Nye
  vinterdekk / Enkelthjul / Annet), kommentar → `submitDekkskifttime()`.
- Vises i Planlegging under "🛞 Dekk" (slått sammen med det eksisterende
  DOT-alder-varselet i samme kolonne — to adskilte datakilder, én kolonne,
  samme mønster som Service-kolonnen).
- Klikk på en planlagt dekkskifttime-rad i Planlegging går rett til
  fullfør-skjemaet for DEN spesifikke timen (`data-goto-dekkskifttime`) —
  ikke bare til bilen (en forbedring utover det eksisterende
  `data-goto-dekk`/`data-goto-service`-mønsteret).
- ✔ Utført dekkskifte (inline skjema, `fullforDekkskifttime()`): utført
  dato, km ved dekkskifte (**nytt felt**, se under), dekktype
  (forhåndsutfylt), kommentar. Oppretter dekkhistorikk, oppdaterer `v.dekk`
  (kun ved faktisk sesongskifte-type), oppdaterer kjøretøyhistorikk og
  Dashboard automatisk, fjerner dekkskifttimen — ingen dobbeltregistrering.
- **Nytt Airtable-felt:** `KM` (tall) på `TireChanges` (dekkhistorikk) —
  eneste genuine unntak fra "ikke lag nye databasefelt" i denne
  leveransen, siden ingen eksisterende struktur dekket "km ved
  dekkskifte". `v.km` overskrives fortsatt ALDRI (samme
  bekreftelsesdialog-mønster som service ved avvik).
- Den midlertidige "✔ Utført dekkskifte"-omdøpingen fra Prioritet 30 er
  reversert — ad-hoc-knappen heter igjen "🛞 Registrer dekkskifte" (uten
  km), og fungerer uendret og uavhengig av den nye planlagte flyten — to
  parallelle registreringsveier til samme historikk-tabell, akkurat som
  service.
- Verksted/Oppfølging/Service er allerede dekket av Prioritet 30.
  **EU-kontroll har IKKE fått en "Utført kontroll"-flyt i denne
  leveransen** — spesifikasjonen nevnte det kun som en fremtidig
  hjemkategori i Planlegging 2.0-visjonen, uten konkrete felt/dialog. Ikke
  marker dette som implementert før det faktisk er spesifisert og bygget.
- Verifisert med Playwright (automatisert smoke-test: registrer
  dekkskifttime → vises i Planlegging → klikk åpner riktig fullfør-skjema
  → fullføring oppretter dekkhistorikk med km, fjerner planen, oppdaterer
  `v.dekk`, `v.km` uendret → kjøretøyhistorikk viser ny oppføring med km →
  ad-hoc "Registrer dekkskifte" fortsatt uavhengig fungerende), desktop +
  mobil. Se CLAUDE.md for full teknisk detalj.

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
detaljer og manuell datakontroll-anbefaling). **Dokumentasjonsrettelse
(Prioritet 28):** `servicehistorikk`/`planlagteservicer` er ikke egne
Airtable-tabeller, men én JSON-blob hver i `Settings` — se
AIRTABLE_MIGRATION.md.

## Gjenstående kjente feil eller mangler

📋 **Eksisterende kilometerdata bør kontrolleres manuelt** for kjøretøy som
kan ha fått `v.km` feilaktig overskrevet av historiske
service-registreringer før km-overskrivingsfeilen ble rettet (se CLAUDE.md).
Ingen automatisk korrigering er gjort.

📋 **To Airtable-felt kun skrives, aldri lest** (`AktiveSaker.RegistrationNumber`,
`AktiveSaker.AssignedTo`) — se AIRTABLE_MIGRATION.md. Ikke slettet; vurder
enten å fullføre den tiltenkte funksjonen (særlig `AssignedTo` — trolig en
planlagt "tildel sak til person"-funksjon som aldri ble ferdigstilt i UI)
eller la dem ligge urørt.

📋 **`servicehistorikk` lagres som én samlet JSON-blob** i Settings-tabellen
for ALLE kjøretøy over ALLE år — ikke en akutt feil, men en driftsrisiko ved
fortsatt vekst (Airtables praktiske feltgrense per celle). Vurder som egen,
fremtidig migreringssak dersom historikken vokser mye videre.

## Neste prioriterte arbeid

📋 Vurder en full, visuell UI-gjennomgang (Del 11 i Prioritet
28-oppryddingen ble kun gjort som statisk kodeanalyse, ikke mot en levende
Airtable-base) for å bekrefte at Aktive saker, Operativ status og
Kjøretøyprofil viser nøyaktig feltsettet spesifisert i CLAUDE.md, ikke mer.

📋 Avklar om "manuell overstyring mellom mobil-/desktopvisning" fortsatt er
ønsket — bekreftet ikke-implementert i kode ved tre uavhengige
gjennomganger. Bygg som ny, avgrenset sak dersom fortsatt aktuelt.
