# ROADMAP.md — Bilpark Operativsystem

Sist konsolidert: 2026-09-04 (Prioritet 28 — Total Less Is More), basert på
faktisk kjørende kode i `Benibanos/Biloversikt`. Status er verifisert mot
koden i `index.html`/`storage.airtable.js`, ikke antatt fra tidligere
bestilling. Den fulle, kronologiske historikken over alle tidligere
"Prioritet N"/"Optimalisering N"-runder er ikke lenger bevart som egen fil i
produksjonsprosjektet — den ligger i git-commit `cae279d` (prosjektets
tilstand før den første store konsolideringen).

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
