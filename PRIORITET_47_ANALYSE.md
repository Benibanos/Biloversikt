# PRIORITET 47 – Sjåførside 2.0 + Dashboard-komprimering — KARTLEGGING OG LEVERANSE

Status: **DEL 1 implementert og verifisert (se «DEL 1 — LEVERANSE» nederst i dette dokumentet). DEL 2 (bunnmeny, Ringeliste/Oppgaver i sjåførmodus, «Sjekk ut bil»-tekst) er bevisst IKKE implementert — venter fortsatt på avklaring av det kritiske funnet i punkt 0 under. Bruker har eksplisitt bedt om at den faktiske, kjørende `index.html` lastes opp før Del 2 forsøkes.**

Kartleggingen under (punkt 0–5) er uendret fra før implementering — den er det som lå til grunn for beslutningen om å dele bestillingen i Del 1 (kan bygges trygt nå) og Del 2 (krever avklaring). Ingen av funnene i punkt 0 er endret av at Del 1 er levert.

---

## 0. KRITISK FUNN — referansebildene stemmer ikke med koden i prosjektet

Før de fire kartleggingspunktene i bestillingen kan besvares ærlig, må dette sies rett ut, i tråd med regelen «koden er alltid sannheten» og prosjektets historikk (Prioritet 36/37/42 hvor nettopp et avvik mellom levert/dokumentert kode og faktisk kjørende kode skapte reelle feil):

**De to referansebildene av sjåførmodus (Min Bil / Velg bil) viser en bunnmeny («Min Bil · Velg bil · Oppgaver · Mer») og en kortbasert Min Bil-liste med undertekster («Sjekk ut bilen og start kjøring» osv.) som IKKE finnes noe sted i `index.html` slik den ligger i dette Claude-prosjektet i dag.**

Verifisert ved direkte kodesøk (ikke antatt):

- `renderDriverShell()` (sjåførmodusens app-skall) bygger KUN en topplinje (`brandBlockHtml()` + «Sjåførmodus»-tekst) og selve skjermkroppen — **ingen bunnmeny i det hele tatt**. Den eneste bunnmenyen som finnes i koden er `MOBIL_BUNNMENY` (Hjem · Biler · Bestill · Kalender · Mer), og den brukes uttrykkelig KUN i administrasjonens mobilvisning (`renderMobilHjem()`), aldri i sjåførmodus.
- Det finnes ingen skjerm, funksjon eller navigasjonsnøkkel med navnet «Oppgaver» noe sted i `index.html` — verken i sjåførmodus, mobil administrasjon eller desktop.
- `renderDriverMinBil()` sin «✓ Sjekk ut bil»-knapp har ren tekst uten undertekst, og bekreftelsesdialogen sier allerede *«Sjekke ut denne bilen? Kontrollstatus beholdes — du trenger ikke kontrollere den på nytt i dag.»* — den påståtte, feilaktige teksten «Sjekk ut bilen og start kjøring» fra bestillingens punkt 3 finnes ikke i denne koden.
- Til gjengjeld stemmer bilvalg-grupperingen i bildet («LAG 1 (2)», «LAG 2 (2)» osv.) nøyaktig med `DRIFTSLAG_ORDER`/`renderDriftslagGruppertBilvalg()` slik den faktisk er implementert — så bildene er ikke et vilkårlig, urelatert mockup. De ligner en videreutviklet, senere versjon av akkurat denne skjermen.

**Dette er nøyaktig samme type avvik som ble avdekket i Prioritet 36/37/42** (kontroll.html/ikon-mappe ute av sync med det faktisk publiserte GitHub Pages-repoet). Mest sannsynlige forklaring: den `index.html` som ligger i dette Claude-prosjektet er ikke lenger identisk med det som faktisk kjører live, og sjåførsiden har blitt videreutviklet (bunnmeny + kortbasert Min Bil-design) et sted denne økten ikke har sett.

**Konsekvens:** Jeg kan ikke trygt bygge PRIORITET 47 punkt 2 (bunnmeny) og punkt 3 (Sjekk ut bil-tekst) mot riktig grunnlag før dette er avklart — å gjette meg frem til en bunnmeny-struktur som «virker riktig» ut fra bildet alene, uten å vite hvordan den faktisk er bygget i den ekte, kjørende koden, er akkurat den typen antakelse CLAUDE.md eksplisitt advarer mot («flere historiske feil i dette prosjektet oppsto nettopp av antakelser uten kodeverifisering»). Se spørsmål til deg nederst i denne rapporten.

**Punkt 1 (kommentarer), 4 (kommentarlogikk i innsending), 5 (aktive saker uendret) og 6 (Andre kontrollavvik) er derimot fullt kartlagt i den koden jeg faktisk har** — se under. Løsningen for disse kan utformes nå.

---

## 1. Kartlegging: hvor blir kommentarer aktive saker i dag?

**Funn: en fritekst-kommentar alene oppretter ALDRI en sak i dag.** Den påstanden i bestillingen («Kommentar → Aktiv sak») stemmer ikke bokstavelig med koden — det reelle problemet er mer presist enn det, og forklarer trolig hvorfor det oppleves slik:

- Sjåførkontrollskjemaets kommentarfelt (`kt-kommentar` → `kontrollFormKommentar`) lagres alltid på selve kontroll-oppføringen (`kontroller[].kommentar`), uavhengig av om noe annet er huket av. Denne verdien er KUN synlig for driftskoordinator nede i Kontrollhistorikk per bil (`kt-history-meta`-linjen, «Kommentar: …») og i Excel/tekst-eksporter — det finnes ingen samlet oversikt over nye kommentarer i dag.
- I `submitKontroll()`: kommentaren sendes bare videre inn i en sak (som ekstra kontekst i sakens historikk-oppføring) HVIS minst ett av følgende allerede har trigget en sak: en huket varsellampe, et huket kontrollavvik (inkl. «Andre kontrollavvik»), eller en registrert skade. Er ALT dette tomt, skjer `sakerEndret` aldri, og kommentaren blir liggende usett på selve kontrollen — ingen sak, ingen synlighet utover Kontrollhistorikk.
- **Den reelle mekanismen bak «kommentar blir sak» er avkrysningsboksen «Andre kontrollavvik»** (`annet-avvik` i `KONTROLLAVVIK_ORDER`): den er det eneste stedet en sjåfør kan signalisere «jeg har noe å si» på en måte som faktisk blir synlig for driftskoordinator (en ny rad i Aktive saker) — og da oppstår en sak med den generiske tittelen «Andre kontrollavvik», mens selve innholdet sjåføren faktisk ville formidle ligger i det atskilte kommentarfeltet. Dette er sannsynligvis nøyaktig situasjonen bestillingen beskriver.

**Konklusjon:** Det er ikke kommentarfeltet som må «kobles fra» saksmotoren (det er allerede frakoblet) — det som må gjøres er (a) gi kommentarfeltet en egen, synlig destinasjon («📨 Nye kommentarer», se løsning under) i stedet for å ligge begravd i Kontrollhistorikk, og (b) fjerne «Andre kontrollavvik» som den nåværende, uoffisielle snarveien sjåfører bruker til akkurat dette formålet (se punkt 3 under).

---

## 2. Kartlegging: hvor brukes «Andre kontrollavvik»?

`annet-avvik` er ett av fem faste nøkler i `KONTROLLAVVIK_ORDER = ['slitte-dekk','defekt-lys','manglende-utstyr','feil-pa-kjoretoy','annet-avvik']` (med tilhørende `KONTROLLAVVIK_LABEL['annet-avvik'] = 'Andre kontrollavvik'` og ikon 📋). Brukssteder, uttømmende:

1. **Sjåførkontrollskjemaet** (den daglige kontrollen) — avkrysningsgrid over alle fem avvikstyper, sjåføren kan huke av flere samtidig.
2. **Min Bil → «➕ Registrer avvik»** — samme fem valg som en egen, frittstående hurtigregistrering (`registrerAvvikSomSak`/`minBilAvvikType`), uavhengig av dagens kontroll.
3. **Saksmotoren** — `registrerKontrollAvvikSomSak()` (fra kontrollskjemaet) og `registrerAvvikSomSak()` (fra Min Bil) oppretter/oppdaterer en sak av type `kontrollavvik` med `sourceId: 'annet-avvik'`, tittel hentet fra `KONTROLLAVVIK_LABEL`.
4. **Visning av eksisterende saker** — `avvikTypeLabel()` og sakens `caseLabel`-oppslag leser `KONTROLLAVVIK_LABEL['annet-avvik']` for å vise riktig tittel på allerede opprettede saker (Aktive saker, Historikk, Rapporter/Saksrapport).

Det finnes **ingen** frittstående, egen «Andre kontrollavvik»-skjerm eller -tabell — det er utelukkende disse fire kodestedene.

**Viktig for løsningen:** eksisterende, allerede lagrede saker med `sourceId === 'annet-avvik'` (historiske data) må fortsatt vises korrekt (label-oppslaget kan ikke bare slettes, det ville brutt visning av gammel historikk/rapporter) — kun *muligheten til å velge det på nytt* skal fjernes. Dette er nøyaktig samme mønster prosjektet allerede har brukt for `UTE_AV_DRIFT_KATEGORI_ID` i Prioritet 41 (fjernet fra den valgbare listen, men lesefunksjonene beholdt for eksisterende data) — ingen ny mekanisme trengs, kun gjenbruk av et etablert mønster.

---

## 3. Kartlegging: hvordan påvirkes «Oppgaver»?

Som nevnt i punkt 0: **det finnes ingen skjerm, telling eller datastruktur med navnet «Oppgaver» i koden i dag.** Det nærmeste som finnes er:

- Dashboardets «📋 Kommende oppgaver» (`kommendeOppgaver` i `dashboardBeregning()`) — en ren, tidsstyrt liste (service/dekk/EU/verksted/oppfølging de neste 7 dagene), ikke knyttet til sjåførmodus i det hele tatt.
- «Aktive saker» — den faktiske sak-/avvikslisten driftskoordinator jobber fra.

Bestillingens bunnmeny-forslag («Min Bil · Ringeliste · Oppgaver · Mer») nevner «Oppgaver» som om det allerede er et eksisterende sjåfør-vendt menypunkt som ikke skal røres — men det punktet finnes ikke i denne koden. **Jeg kan derfor ikke bekrefte hvordan «Oppgaver» påvirkes, fordi jeg ikke kan finne funksjonen den skal referere til.** Dette henger sammen med funn i punkt 0, og må avklares samtidig.

---

## 4. Kartlegging: hvordan kan alle fem bestillingstjenester ligge på én rad?

Fullstendig kartlagt — ingen uklarheter her.

- Alle fire faktiske forekomstene av «➕ Bestill tjenester»-kortene (Desktop Dashboard sin `komponentHtml.bestill`, Mobil Dashboard sin tilsvarende blokk, Kjøretøyprofilens per-bil-variant, og den dedikerte «🛠️ Bestill tjenester»-skjermen) inneholder i dag **fem** knapper (Service/EU-kontroll/Dekkskifte/Verkstedtime/Ruteskift — Ruteskift lagt til i Prioritet 46), men wrappes alle i samme CSS-klasse **`.dash40-grid4`**, som er hardkodet til `grid-template-columns: repeat(4, 1fr)`. Med fem knapper i en fast fire-kolonners rutenett havner element nummer fem (Ruteskift) automatisk alene på en ny rad — nøyaktig det bestillingen beskriver.
- `.dash40-grid4` brukes ALLTID av to ulike ting: KPI-kortene (4 stk, fungerer fint i 4 kolonner) og bestillingskortene (5 stk, feiler). En endring må derfor IKKE røre `.dash40-grid4` direkte (det ville påvirket KPI-radene util(silsiktet) — den må i stedet gis en ny, egen klasse kun for bestillingsraden.
- **Anbefalt løsning:** ny CSS-klasse (f.eks. `.dash40-grid5`) med `grid-template-columns: repeat(5, 1fr)` på desktop-bredde, brukt KUN på de fire `bestill`-blokkene (samme sted `data-bestill="..."`-knappene allerede ligger) — `.dash40-grid4` røres ikke, KPI-radene er dermed garantert uendret. På smalere skjermer arver den samme nedtrappingsmønsteret som `.dash40-grid4` allerede har (`1fr 1fr` på tablet, `1fr` på telefon) slik at det ikke tvinges frem uleselig små kort eller unødvendig sideveis scrolling. For å holde kortene lesbare i fem kolonner på desktop-bredde reduseres innhold noe: `dash40-bestill-sub`-teksten kan forkortes eller fjernes (kun tittel + ikon + pil), ELLER selve paddingen/min-height strammes inn — dette er en ren visuell avveining, ingen logikkendring, og påvirker ikke klikkflaten (fortsatt hele kortet er klikkbart).
- Det finnes i tillegg én ubrukt, foreldet kodeblokk (`bestillKortHtml`, linje ~7275 i `index.html`) som fortsatt kun har fire knapper (mangler Ruteskift) og ikke er referert noe sted i koden — dødt, urørt restkode fra Prioritet 37, ikke koblet til noen skjerm. Ikke i veien for denne saken, men nevnes for ordens skyld (i tråd med «ikke opprett nye sannheter» — bør ryddes i en fremtidig opprydding, ikke nå, siden det ikke er bestilt).

---

## 5. Bekreftet: Aktive saker (punkt 5 i bestillingen)

Ingen endring nødvendig her isolert sett. Skade, Varsellampe og de fire gjenværende kontrollavvikstypene (`slitte-dekk`, `defekt-lys`, `manglende-utstyr`, `feil-pa-kjoretoy`) fortsetter uendret å opprette aktive saker akkurat som i dag — kun `annet-avvik` fjernes fra det valgbare settet (se punkt 2).

---

## Anbefalt rekkefølge for videre arbeid

1. **Avklar punkt 0** (se spørsmål under) — dette blokkerer trygg implementering av bunnmeny-endringen (punkt 2 i bestillingen) og «Sjekk ut bil»-teksten (punkt 3 i bestillingen), fordi grunnlaget de skal endres på ikke finnes i koden jeg har tilgang til.
2. **Kan bygges nå, uavhengig av punkt 0:**
   - Fjern `annet-avvik` fra `KONTROLLAVVIK_ORDER` (behold i `KONTROLLAVVIK_LABEL`/`KONTROLLAVVIK_IKON` for historisk visning) — fjerner «Andre kontrollavvik» fra sjåførkontrollskjemaet og Min Bil sin avvikschips, uten å røre skade/varsellampe/de fire andre avvikstypene.
   - Ny seksjon «📨 Nye kommentarer» (trolig i Aktive saker-området eller som eget panel driftskoordinator ser på Dashboard/Aktive saker) som viser `kontroller[]`-oppføringer med ikke-tom `kommentar`, med Dato/Bil/Sjåfør/Kommentar — en RENT VISNINGSFILTER over eksisterende `kontroller`-data, ingen ny sak, ingen statuspåvirkning. (Trenger et bevisst valg: skal denne seksjonen ha en «kvittert/lest»-mekanisme, eller er den kun en logg? Foreslår i første omgang en ren logg, siden bestillingen ikke ber om kvittering.)
   - Ny `.dash40-grid5`-klasse for de fire bestillingsrad-forekomstene.
3. **Vent med bunnmeny-endring og «Sjekk ut bil»-tekstendring til punkt 0 er avklart.**

---

## Spørsmål som må avklares før videre koding (Del 2)

Se egen forespørsel i chatten. Bruker har svart: «Last opp faktisk kjørende index.html» — dette er MOTTATT som instruks, men selve filen er ikke lastet opp ennå. Del 2 forblir blokkert til den er mottatt og kartlagt.

---

## DEL 1 — LEVERANSE (implementert 2026-09-10)

Bruker delte bestillingen eksplisitt i to deler etter kartleggingen over: **Del 1** (punktene som kunne bygges trygt uten å røre det uavklarte kode-/live-avviket) og **Del 2** (bunnmeny, Ringeliste/Oppgaver i sjåførmodus, «Sjekk ut bil»-tekst — utsatt, se punkt 0). Dette dokumenterer hva som faktisk ble implementert for Del 1, i tråd med anbefalingen i «Anbefalt rekkefølge for videre arbeid» punkt 2 over.

### Løsning implementert

1. **«Andre kontrollavvik» fjernet fra valgbare lister, beholdt for historikk.** `KONTROLLAVVIK_ORDER` endret fra `['slitte-dekk','defekt-lys','manglende-utstyr','feil-pa-kjoretoy','annet-avvik']` til `['slitte-dekk','defekt-lys','manglende-utstyr','feil-pa-kjoretoy']`. `KONTROLLAVVIK_LABEL`/`KONTROLLAVVIK_IKON` er UENDRET (fortsatt `'annet-avvik':'Andre kontrollavvik'`/`'📋'`), slik at eksisterende saker/kontroller med `sourceId: 'annet-avvik'` fortsatt viser riktig tittel i Aktive saker, Historikk og Rapporter. Samme mønster som `UTE_AV_DRIFT_KATEGORI_ID` (Prioritet 41), som kartleggingen i punkt 2 over anbefalte. Siden både sjåførkontrollskjemaets og Min Bil sin avvikschips bygges dynamisk fra `KONTROLLAVVIK_ORDER.map(...)`, forsvinner «Andre kontrollavvik» automatisk fra begge uten egen UI-endring. Skade, Varsellampe og de fire gjenværende avvikstypene oppretter fortsatt aktive saker helt uendret (punkt 5 i kartleggingen, bekreftet urørt).

2. **Ny «📨 Nye kommentarer»-seksjon i Aktive saker** (`nyeKommentarerListe()` + `nyeKommentarerSectionHtml()`, satt inn øverst i `renderAktiveSaker()` sitt markup, rett under overskriften «🗂️ Aktive Saker»). Rent visningsfilter over eksisterende `kontroller[]` — ingen ny tabell, ingen nytt Airtable-felt, ingen kobling til saksmotoren, slik kartleggingen i punkt 1 konkluderte med at var riktig retning. Viser Dato · Bil · Sjåfør · Kommentar for enhver kontroll med ikke-tom `kommentar`, sortert nyeste først (`(b.dato+b.tidspunkt).localeCompare(...)`). Etter eksplisitt beskjed fra bruker («Jeg ønsker ingen 'Lest' eller 'Kvittert' funksjon i første versjon... Dette er informasjon. Ikke oppgaver.») er det IKKE bygget noen lest/kvittert-tilstand — kun en lokal, ikke-lagret åpen/lukket-toggle (`nyeKommentarerApen`, tilbakestilt til lukket når man forlater Aktive saker-skjermen). En kommentar her oppretter aldri en sak, endrer aldri sakstatus og påvirker aldri bilstatus.

3. **Ny `.dash40-grid5`-klasse** (`grid-template-columns: repeat(5,1fr)`, med responsiv nedtrapping til 3 kolonner ≤1199px og 2 kolonner ≤640px — samme brytepunkter `.dash40-grid4` allerede bruker) satt på alle fire reelle «➕ Bestill tjenester»-forekomster identifisert i punkt 4: Mobil Dashboard, Desktop Dashboard, Kjøretøyprofil/Bilkort (`data-bestill-bil="${v.id}"`-variant) og den dedikerte «🛠️ Bestill tjenester»-skjermen. **`.dash40-grid4` er ikke rørt** — KPI-radene bruker fortsatt nøyaktig samme klasse og oppførsel som før, akkurat slik kartleggingen krevde. Service, EU-kontroll, Dekkskifte, Verkstedtime og Ruteskift ligger nå på én rad på desktop-bredde, med noe strammere kort-padding/`min-height` for å holde fem kolonner lesbare (bruker delegerte det eksakte komprimeringsvalget: «Du kan selv velge den peneste komprimeringen. Mitt mål er: mindre høyde, mindre scrolling, fortsatt god lesbarhet.»). Den ubrukte, foreldede `bestillKortHtml`-konstanten nevnt i punkt 4 er bevisst IKKE rørt — dødt, urelatert restkode, ikke i veien for denne saken.

4. `CACHE_VERSION` i `sw.js` økt til `bilpark-v43` (app-shell-innhold endret). `storage.airtable.js` er IKKE endret — ingen nye Airtable-felt, ingen `LIST_TABLES`-endring — så `versjon`/`?v=` forblir `v2.11.0`.

### Testet

- `node --check` på begge inline `<script>`-blokkene i `index.html` — ingen syntaksfeil.
- Isolert Node.js-simulering av `nyeKommentarerListe()`: bekrefter filtrering av tomme/whitespace-kommentarer og korrekt sortering nyeste-først.
- Isolert Node.js-simulering av `KONTROLLAVVIK_ORDER`-fjerningen: bekrefter nøyaktig 4 valgbare typer, at `annet-avvik` IKKE er blant dem, og at `KONTROLLAVVIK_LABEL['annet-avvik']` fortsatt slår opp riktig historisk tittel («Andre kontrollavvik»).
- `diff index.html kontroll.html`: bekreftet identiske (kontroll.html resynkronisert etter alle endringer, ikke før).
- Kun statisk/isolert testet i denne økten — ingen kjørende nettleser/Airtable-integrasjon tilgjengelig.

### Endrede filer

- `index.html` — `KONTROLLAVVIK_ORDER`, ny `.dash40-grid5`-CSS (+ responsive varianter), fire `dash40-grid4`→`dash40-grid5`-konverteringer, ny `nyeKommentarerApen`-tilstand, nye funksjoner `nyeKommentarerListe()`/`nyeKommentarerSectionHtml()`, ny seksjon i `renderAktiveSaker()`, ny listener i `attachAktiveSakerListeners()`.
- `kontroll.html` — resynkronisert som eksakt kopi av `index.html`.
- `sw.js` — `CACHE_VERSION` → `bilpark-v43`.
- `CLAUDE.md` — ny Prioritet 47 Del 1-seksjon, ny advarsel om kode-/live-avviket.
- `ROADMAP.md` — ny Prioritet 47 Del 1-oppføring, Del 2 ført opp under «Neste prioriterte arbeid» og «Gjenstående kjente feil eller mangler».
- `PRIORITET_47_ANALYSE.md` — denne filen, statusoppdatering.

### Ikke rørt

Aktiv sjåfør-logikk, Sjåførkontroll (`submitKontroll()` sin kjernelogikk for kilometerstand/varsellamper/skade — kun hvilke avvikstyper som kan VELGES er endret), `v.km`-skriveregler, Layout Editor, Bilkategorier, `.dash40-grid4`/KPI-kortene, sjåførmodus sitt app-skall (`renderDriverShell()`), «Sjekk ut bil»-teksten, `storage.airtable.js`.

### Kjente begrensninger

- **Del 2 gjenstår** (bunnmeny «Min Bil · Ringeliste · Oppgaver · Mer», «Sjekk ut bil»-tekst) — bevisst ikke implementert, se punkt 0 over. Krever at bruker laster opp den faktiske, kjørende `index.html`.
- Kun statisk/isolert testet i denne økten (syntaks + logikksimulering) — ikke verifisert mot en kjørende nettleser eller ekte Airtable-synk.
- «Nye kommentarer»-seksjonens visnings-toggle (`nyeKommentarerApen`) er ikke persistert — den nullstilles til lukket hver gang man forlater og kommer tilbake til Aktive saker, med vilje (ingen lagret tilstand for en ren visningsfilter).
