# CHANGELOG.md — Bilpark Operativsystem

Kronologisk historikk over ferdige leveranser, tekniske rettinger og verifisering. Nyeste endring står øverst.

Dette dokumentet skal ikke brukes som statusliste eller produktregelverk:

- Nåværende status og neste arbeid: `ROADMAP.md`
- Varige regler og arkitektur: `CLAUDE.md`
- Datamodell og migrering: `AIRTABLE_MIGRATION.md`
- Kort prosjektintroduksjon: `README.md`

> Merk: Historikk eldre enn oppføringene nedenfor ligger i git-historikken, blant annet commit `cae279d`. Faktisk kode er alltid sannheten dersom historisk tekst avviker fra senere implementering.

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
