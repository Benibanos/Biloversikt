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
verkstedtimer, EU-kontroll og service vist i Planlegging.
**DOKUMENTASJONSRETTING (Mobil Design 3.0):** planlagt service lagres i
`planlagteServicer` (Settings-blob), IKKE i `WorkshopAppointments.Type`.
Objektet har fra og med Mobil Design 3.0 et påkrevd `type`-felt (type service)
inne i JSON-bloben — ikke et nytt Airtable-felt.

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
sidebar-navigasjon) — se CLAUDE.md for full struktur. Desktop er uendret av
Mobil Design 3.0.

🟡 Delvis implementert (mobil) — **DOKUMENTASJONSRETTING:** "manuell
overstyring mellom mobil- og desktopvisning" FINNES i koden (`deviceOverride`,
`currentUiExperience()` og to brytere som setter den), men valget lagres ikke
permanent og nullstilles ved refresh — ingen localStorage-nøkkel skrives. Den
tidligere påstanden om at funksjonen ikke fantes i det hele tatt var feil.
Vedvarende lagring gjenstår, se "Neste prioriterte arbeid".

## Mobil Design 3.0 (driftskoordinatorens mobilforside)

✅ Implementert — mobilforsiden bygd av åtte soner (header, søk,
oppmerksomhet, primærhandlinger, bestill tjeneste, neste frister, bilparken,
sekundærhandlinger) og en ny, samlet Bestill tjeneste-flyt
(`screen='bestilltjeneste'`) for service, EU-kontroll, dekkskifte og
verkstedtime. Gjenbruker `submitPlanlagtService()`/`submitAddVT()` og den delte
driftslag-akkordionen — ingen ny verkstedmotor, ingen ny bilvelger, ingen ny
tellelogikk, ingen nye Airtable-felt. Sjåførmodus (`kontroll.html`, `?sjafor=1`,
Sjåførkontroll og driftslag-visningen for sjåfører) er en separat flyt og er
uendret. Se CLAUDE.md for full struktur.

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

📋 Gjør "manuell overstyring mellom mobil-/desktopvisning" vedvarende.
Selve overstyringen finnes (`deviceOverride`), men lagres ikke og nullstilles
ved refresh. Bygg lagring som ny, avgrenset sak dersom fortsatt ønsket.
