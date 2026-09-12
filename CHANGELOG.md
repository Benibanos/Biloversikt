# CHANGELOG.md — Bilpark Operativsystem

Kronologisk historikk over ferdige leveranser, tekniske rettinger og verifisering. Nyeste endring står øverst.

Dette dokumentet skal ikke brukes som statusliste eller produktregelverk:

- Nåværende status og neste arbeid: `ROADMAP.md`
- Varige regler og arkitektur: `CLAUDE.md`
- Datamodell og migrering: `AIRTABLE_MIGRATION.md`
- Kort prosjektintroduksjon: `README.md`

> Merk: Historikk eldre enn oppføringene nedenfor ligger i git-historikken, blant annet commit `cae279d`. Faktisk kode er alltid sannheten dersom historisk tekst avviker fra senere implementering.

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
