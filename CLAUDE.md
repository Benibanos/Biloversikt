# Bilpark App

## Prosjektformål

Bilpark App er et operativt styringssystem for Bring Larvik.

Målet er ikke å lagre informasjon.

Målet er å sikre:

- 100 % dokumenterte kontroller
- 50 % mindre administrasjonstid
- Full oversikt over samtlige kjøretøy
- Ingen glemte saker
- Datadrevet verkstedplanlegging

---

# Brukere

## Driftskoordinator

Ansvar:

- Oppfølging av bilpark
- Verkstedbestillinger
- Skader
- Varsellamper
- Dekk
- Kostnader
- Avsettinger

## Sjåfører

Ansvar:

- Registrere kontroll
- Rapportere avvik
- Rapportere skader
- Rapportere varsellamper

---

# Bilpark

Ca:

- 16 kjøretøy
- 40 ansatte

Sjåfører bytter bil gjennom turnus.

Systemet kan aldri forutsette fast sjåfør på fast bil.

---

# Designprinsipper

Mobil først.

Alle nye funksjoner skal fungere optimalt på:

- iPhone
- Android

Regler:

- Ingen horisontal scrolling
- Store trykkflater
- Enkel navigasjon
- Maksimalt mulig antall oppgaver på én skjerm

---

# Hurtigknapper

Dashboard skal prioritere:

- Kontrolloversikt
- Verkstedoversikt
- Skadeoversikt
- Varseloversikt
- Dekkoversikt

---

# Bilstatus

Grønn

Ingen aktive saker

Gul

Aktive saker finnes

Oransje

Verksted bestilt

Rød

Kritisk sak

---

# Aktive Saker

Formål:

Ingen registrerte feil skal kunne bli glemt.

Livssyklus:

Ny
↓
Vurderes
↓
Tiltak planlagt
↓
Verksted bestilt
↓
Utført
↓
Lukket

---

# Sakstyper

- Varsellampe
- Skade
- Kontrollavvik
- Dekk
- Service
- Annet

---

# Teknologi

Frontend:

- HTML
- JavaScript
- CSS

Database:

- Airtable

Hosting:

- GitHub Pages

---

# Database-regler

Ved alle nye felt:

- Oppdater AIRTABLE_MIGRATION.md
- Dokumenter feltendringer

Ingen databasefelt skal fjernes uten eksplisitt instruks.

---

# UI-regler

Vis alltid totaler der relevant:

- Totale verkstedtimer
- Total verkstedkostnad
- Antall aktive saker
- Antall biler kontrollert

Administrator skal kunne forstå status på hele bilparken på under 10 sekunder.

---

# Dashboard Pro — struktur og prinsipp om ingen dobbeltinformasjon

Dashboard er appens mest brukte side og skal gi driftskoordinator full
oversikt over bilparken på under 10 sekunder. Hvis informasjon allerede er
synlig i et hovedkort eller en hovedseksjon, skal den normalt ikke gjentas et
annet sted. Mål: mer oversikt, mindre støy, minst mulig scrolling.

Gjeldende struktur (topp til bunn):

1. Hilsen/greeting-card
2. Databasevarsel (kun ved feil/manglende felt)
3. **Hovedstatus** — én kompakt seksjon: antall biler totalt, kontrollert,
   mangler kontroll, aktive saker, verksted, kritisk. Første statusinformasjon
   brukeren ser.
4. **Morgenvisning** — den primære, handlingsorienterte arbeidsseksjonen for
   dagens start. Viser kun det som krever handling i dag eller påvirker
   dagens drift, aldri historiske data. Fem underseksjoner:
   - *Dagens situasjon*: nøkkeltall (biler klare, mangler kontroll, verksted
     i dag, oppfølging i dag, kritiske saker)
   - *Må gjøres i dag*: samme prioriterte utvalg (og rekkefølge) som "Krever
     handling nå" under, men med handlingsorientert tekst ("Kontakt verksted
     — Bil 7") — gjenbruker `dashKreverTop5`/feltet `aksjon` på hver
     oppføring, ikke egen logikk
   - *Mangler kontroll*: liste over biler uten kontroll i dag, trykk åpner
     kontrollregistrering direkte for den bilen
   - *Verksted i dag*: kun verkstedtimer med dato = i dag, skjules helt hvis
     tom
   - *Kritiske forhold*: kun åpne saker med kritisk prioritet, skjules helt
     hvis tom
5. **Krever handling nå** — fortsatt en egen seksjon (se
   Dashboard Pro-integrasjon i Morgenvisningen), samlet oppsummering
   (🔴 kritiske saker, ⛔ biler ute av drift ved behov, 🟠 oppfølginger i
   dag, 🟡 biler mangler kontroll, Totalt) + "Operativ arbeidsliste":
   utvidbar liste over de 5 viktigste hendelsene, prioritert kritisk →
   forfalt → oppfølging i dag → manglende kontroll. Bygger på eksisterende
   `sakKreverHandling()` — ingen egen, parallell forretningslogikk.
6. **Kommende verkstedtimer** — kun neste 3 (ikke lange lister).
7. **Bilparkhelse** — kompakt: kun tall og statusfarge (🟢🟡🟠🔴⚪), ingen
   forklarende tekst.
8. **Hurtighandlinger** — 4 registreringsknapper (kontroll/skade/verksted/ny
   sak), alltid lett tilgjengelig.
9. Biloversikt (filtrerbar, uendret) — hvert bilkort viser nå "Dagens
   status" (`vehicleDagensStatus()`: kritisk sak > mangler kontroll >
   verksted i dag > klar for drift) som hodechip, i stedet for den tidligere
   rene kontrollert/ikke-kontrollert-chippen som den strengt utvider.

Ikke prioritert på Dashboard (finnes andre steder i appen): historikk,
analyse, kostnader. Fjernet fra Dashboard i denne omgangen: den gamle
5-korts stat-grid, egen "Kontrollstatus"-fremdriftsbar, "Eldste åpne
saker"-panelet, kostnadskortene (Forventede kostnader/Avsettinger), og de 7
gamle navigasjons-hurtiglenkene (fortsatt tilgjengelig via ☰ Meny).

---

# Navigasjon — universell tilbakeknapp

Alle undersider (åpnet fra en annen side) skal ha en tilbakeknapp øverst til
venstre, med fast tekst "← Tilbake" (ikon + tekst, aldri kun ikon), samme
stil overalt (`.backrow` / `.backbtn`, min. 44px trykkflate).

Navigasjon skjer alltid via den sentrale `goTo(screen, vehicleId)`-
funksjonen, aldri ved å sette `screen`-variabelen direkte. `goTo()` legger
automatisk gjeldende side på en navigasjonshistorikk (`screenHistory`), og
"← Tilbake" kaller `goBack()`, som går til stedet brukeren faktisk kom fra —
ikke en fast side. Sveip høyre gjør det samme. Ved ny funksjonalitet som
åpner en side fra flere steder i appen (slik Kjøretøyprofil gjør), er dette
automatisk riktig så lenge navigasjonen går via `goTo()` — ingen
spesialtilpasning trengs per kallsted.

Unntak (skal IKKE bruke `goBack()`, men gå til en fast side): etter vellykket
innlogging, og etter sletting av et kjøretøy (der "tilbake" ville pekt på en
side for en bil som ikke lenger finnes).

---

# Kontrollsletting — full cleanup uten spøkelsesdata

Sletting av en sjåførkontroll går ALDRI via `window.confirm()` — den åpner
alltid smart-slettedialogen (`openKontrollSlettDialog()` /
`#kontroll-slett-modal`), som analyserer hva kontrollen har opprettet
(`analyserKontrollPavirkning()`) og lar administrator velge mellom to modus i
`performKontrollDeletion(toDelete, opts)`:

- **Kun slett kontroll** (`fullCleanup:false`): fjerner kun kontrollposten,
  bildene og logger én historikkhendelse. Aktive saker, varsellamper, skader
  og all annen historikk står fullstendig urørt — kun en ev. stale
  `createdByControlId`-referanse på det som beholdes nulles ut.
- **Full cleanup** (`fullCleanup:true`): fjerner i tillegg skader/varsellamper
  som utelukkende stammer fra kontrollen (samme "uendret siden opprettelse"-
  sjekk som før), og nå også aktive saker som utelukkende stammer derfra —
  men KUN dersom saken ikke er "viderebehandlet"
  (`sakHarBlittViderebehandlet()`: status forbi "ny", rapportert på nytt,
  fått `nextAction`/`followUpDate`, eller fått bestilt verksted). Er den
  viderebehandlet, kreves eksplisitt avkrysset bekreftelse før den kan
  fjernes automatisk.

Kilometerstand rekalkuleres alltid fra gjenværende kontroller uansett modus
(rent avledet tall, ikke en "sak"). Én historikkhendelse ("Kontroll slettet
av administrator", med ev. årsak) logges alltid til bilens `statusHistorikk`
(samme felt som "ute av drift"-logg fra Fase 7) FØR kontrollen fjernes, slik
at den overlever i Kjøretøyhistorikk selv om kontrollen selv er borte.

Ved nye datatyper som kan opprettes fra en sjåførkontroll: gi dem samme
`createdByControlId`-mønster (sett kun ved førstegangsopprettelse, aldri ved
senere oppdateringer) slik at de automatisk fanges opp av analysen og
cleanup-logikken over.

---

# Aktiv Biløkt / Min Bil — kontrollen tilhører bilen, biløkten tilhører sjåføren

**Grunnprinsipp:** daglig kontroll er knyttet til KJØRETØYET
(`isKontrollertIdag()`), ikke til sjåføren. Er bilen allerede kontrollert i
dag, skal neste sjåfør aldri måtte gjøre en ny kontroll — kun sjekkes inn.

**Operativt dagskille kl. 04:00 (ikke midnatt):** siden arbeidsdager kan vare
til 02:00–03:00, er selve "i dag"-grensen flyttet til kl. 04:00 Europe/Oslo
via `isoDateForOperationalDay()`, som `todayISO()` nå bruker. Dette er IKKE
et eget, parallelt "operativt dag"-begrep — det er en korrigering av den ENE
`todayISO()`-funksjonen alt annet "i dag"-relatert i appen allerede bygger
på (kontrollstatus, Dashboard, Morgenvisning, rapporter). Klokkeslett
00:00–03:59 regnes som forrige operative dag overalt.

**Sjåførflyt** (`renderDriverShell()` ruter mellom fire skjermer via
`driverScreen`): Velg bil (+ oppgi navn) → systemet sjekker
`isKontrollertIdag()` → enten det ordinære kontrollskjemaet (uendret,
gjenbrukt) eller "Allerede kontrollert i dag"-skjermen → begge leder til
**Min Bil**, sjåførens arbeidsflate resten av den operative dagen (bil,
kontrollstatus, aktive saker, neste verksted, bilstatus, samt
hurtigregistrering av skade/varsellampe/avvik — alle tre gjenbruker samme
underliggende datafunksjoner som kontrollskjemaet/`registrerAvvikSomSak`,
ikke et nytt system).

**Biløkt-tilstand** er autoritativ på kjøretøyet i Airtable (`v.aktivSjafor`
+ `v.aktivSjaforSiden`), ikke i en egen tabell — driftskoordinator ser den
umiddelbart på Biloversikt/Dashboard fra hvilken som helst enhet.
`vehicleAktivSjafor(vehicleId)` regner ALLTID live mot operativt dagskille
(samme mønster som `isKontrollertIdag`), så en biløkt fra en tidligere dag
vises korrekt som avsluttet selv før opprydding har rukket å skrive til
Airtable. `ryddOppBiloktDagskille()` kjøres ved oppstart (både sjåfør- og
adminmodus) og holder dataene ryddige.

Én sjåfør kan kun ha én aktiv biløkt — `startBilokt()` avslutter automatisk
en ev. annen aktiv biløkt samme navn har på en annen bil. "Sjekk ut bil"
(`avsluttBilokt()`) nullstiller KUN biløkten, aldri kontrollstatusen — en
utsjekket bil står fortsatt som kontrollert resten av den operative dagen.

DENNE enhetens posisjon i flyten (`driverScreen`/`driverActiveVehicleId`/
`driverNavn`) huskes lokalt i `localStorage` (`bilpark_driver_session_v1`),
slik at en gjenåpnet PWA havner rett tilbake på Min Bil uten å måtte velge
bil på nytt — men er alltid underlagt Airtable-tilstanden
(`vehicleAktivSjafor`) som fasit.

---

# Nåværende utviklingsplan

Fase 1
Aktive Saker

Fase 2
Automatisk saksgenerering

Fase 3
Verkstedflyt

Fase 4
Kostnadsoversikt og avsettinger

Fase 5 (implementert)
Påminnelser og oppfølging — oppfølgingsdato, neste handling, automatisk
"krever handling"-status, Oppfølging i dag / Forfalte saker på Dashboard,
oppfølgingsfiltre i Aktive Saker, "Neste oppfølging" i Biloversikt

Fase 6 (implementert)
Bilstatussystem — videreført som "Operativ Kontroll og Bilparkhelse" og
fullført med "Bilstatus 2.0": Bilparkhelse-seksjon, Krever handling nå (med
dager åpen/neste handling), Manglende kontroller, Kritiske biler, Eldste
åpne saker, filtrerbar Biloversikt, 6 dashboardkort, samlet "Viktige
varsler"-banner, én sentral prioritert statusmotor (vehicleHovedstatus:
Ute av drift > Kritisk > Verksted bestilt > Under oppfølging > Ikke
kontrollert > Operativ) brukt likt på Dashboard/Biloversikt/Kjøretøyprofil,
"Marker ute av drift"/"Sett tilbake i drift" med full logg, ny Kjøretøyprofil
(toppseksjon, operativ status, aktive saker, hurtighandlinger) og komplett,
filtrerbar kjøretøyhistorikk bygget fra alle eksisterende datakilder

Fase 7 (implementert)
Rapportering og Ledelsesoversikt — egen "Rapporter"-side i hovedmenyen
(rører ikke driftskoordinators Dashboard): Kontrollrapport, Bilparkrapport,
Verkstedrapport, Avviksrapport, Bilhelserapport, Kostnadsrapport og en samlet
Månedsrapport. Felles Periode/Bil/Bilgruppe-filter under én Filtrer-knapp,
Excel-eksport av kun det filtrerte datasettet på alle rapporter. Bygget som
rene visninger av eksisterende data — ingen egne rapporttabeller

Fase 8 (implementert)
Analyse og Prediktiv Oppfølging — egen "Analyse"-side i hovedmenyen: Gjentakende
feil (bruker eksisterende reportCount/historikk på Aktive Saker), Biler med
flest saker, Verkstedtrender (per måned/bil, snitt tid sak→verksted og
sak→lukket), Saker per kategori (fordeling %), Gjennomsnittlig behandlingstid
(snitt/korteste/lengste), Utvikling siste 12 måneder. Felles Bil/Bilgruppe/
Måned/År/Sakstype/Status-filter under én Filtrer-knapp, Excel-eksport av kun
filtrert datasett. "Historiske nøkkeltall" + gjentakende registreringer siste
12 måneder lagt til på Kjøretøyprofil. Rent historisk mønstergjenkjenning —
ingen tekniske/sikkerhetsmessige vurderinger av kjøretøy, ingen
ansattrangering eller prestasjonsmåling, kun rene visninger av eksisterende
data (ingen egne analysetabeller)

Optimalisering 1 (implementert)
Universell tilbakeknapp — se "Navigasjon — universell tilbakeknapp" over.
Ren arbeidsflytforbedring, ingen nye sider/moduler/databasefelt

Optimalisering 2 (implementert)
Rydd Dashboard og fjern dobbeltinformasjon — se "Dashboardregel —
ingen dobbeltinformasjon" over. Ren UX-opprydding, ingen nye
sider/moduler/databasefelt

Optimalisering 3 (implementert)
Kontrollsletting med full cleanup — se "Kontrollsletting — full cleanup
uten spøkelsesdata" over. Smart slettedialog (Kun slett kontroll / Full
cleanup), sikkerhetsregel for viderebehandlede saker, bevart
historikkhendelse ved sletting. Ett nytt felt: `CreatedByControlId` på
AktiveSaker (se AIRTABLE_MIGRATION.md)

Optimalisering 4 (implementert) — tilsvarer tidligere planlagt Fase 10
Dashboard Pro — se "Dashboard Pro — struktur og prinsipp om ingen
dobbeltinformasjon" over. Ny rekkefølge, gammel stat-grid/Kontrollstatus-
bar/Eldste saker/kostnadskort/gamle hurtiglenker fjernet. Ren
UX-omstrukturering, ingen nye sider/moduler/databasefelt

Optimalisering 5 (implementert)
Operativ Morgenvisning — se "Dashboard Pro" over. Ny, utvidet Morgenvisning
rett under Hovedstatus (fem underseksjoner: Dagens situasjon, Må gjøres i
dag, Mangler kontroll, Verksted i dag, Kritiske forhold), Krever handling nå
flyttet til posisjon 5 (fortsatt en egen seksjon, per eksplisitt instruks).
Ny `vehicleDagensStatus()` på Biloversikt-bilkortet. Viser aldri historiske
data — kun det som krever handling i dag. Oppdateres automatisk via appens
vanlige live-rendering, ingen egen oppdateringsmekanisme nødvendig. Ren
UX-utvidelse, ingen nye sider/moduler/databasefelt

Aktiv Biløkt / Min Bil (implementert)
Se "Aktiv Biløkt / Min Bil" over. Ny sjåførflyt (Velg bil → kontroll eller
Allerede kontrollert → Min Bil), operativt dagskille kl. 04:00 (endrer
`todayISO()` for hele appen, ikke et parallelt system), "Biler i drift
nå" på Dashboard, "Aktiv sjåfør"/biløktstatus på Biloversikt. To nye felt:
`AktivSjafor`, `AktivSjaforSiden` på Vehicles (se AIRTABLE_MIGRATION.md)

---

# Viktigste prinsipp

Denne appen bygges for å eliminere behovet for hukommelse.

Hvis brukeren må huske noe selv:

Da mangler appen funksjonalitet.
