# Bilpark App

# KRITISK FEILSØKING — "🚚 Biler i drift nå" opplevd avvik mot bilgruppe

**Melding:** driftskoordinator opplevde at tallet kun så ut til å telle
biler fra "Bil 1–11", ikke Lastebil/Montering/Reserve.

**Kodegjennomgang, uttømmende (to runder):** `hDriftCount`/
`bilerIDriftCount` (`vehicles.filter(v => !!vehicleAktivSjafor(v.id))`),
`vehicleAktivSjafor()`, `startBilokt()`, `ryddOppBiloktDagskille()` og
`isoDateForOperationalDay()` er ALLE 100 % kategori-agnostiske — ingen
referanse til `v.kategori` finnes noe sted i denne kjeden, verken på
lese- eller skrivesiden. Kun ÉN funksjon (`startBilokt()`) skriver et
faktisk `aktivSjafor`-verdi, og den behandler enhver `vehicleId` likt.

**Konklusjon:** ingen kodebug funnet. Siden Claude ikke har tilgang til
den faktiske, kjørende Airtable-basen (kun kildekoden), kan ikke et
eventuelt datavik i selve dataene verifiseres herfra.

**Løsning — diagnoseverktøy lagt til i appen:** ny seksjon i
Innstillinger, "🚚 Biler i drift — diagnose"
(`driftDiagnoseBody`/`settingsAccordionRow('driftdiagnose', ...)`), rent
lesende/beregnet (ingen skriving, ingen påvirkning på selve tellingen).
Viser:
- Full liste over alle biler som faktisk teller med akkurat nå (navn,
  kategori, sjåførnavn, tidspunkt for biløkt-start)
- Per kjøretøygruppe: antall i gruppen, antall med
  `aktivSjafor`+`aktivSjaforSiden` satt (rått), og antall som faktisk
  teller med (etter datosjekk) — et avvik mellom disse to siste
  kolonnene ville bekreftet hypotesen om at datosjekken feiler for
  enkelte grupper
- Egen liste over eventuelle biler som HAR et registrert `aktivSjafor`,
  men som feiler datosjekken (viser nøyaktig hvilken operativ dag
  `aktivSjaforSiden` tolkes som, til sammenligning med dagens dato)

Gir driftskoordinator et faktisk vindu inn i de levende dataene, slik at
et eventuelt datanivå-avvik (i motsetning til et kodenivå-avvik) kan
identifiseres presist og rapporteres tilbake.

---


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

Reservebiler som ikke er tatt i bruk ennå i dag er unntatt fra det daglige
kontrollkravet og vises verken som gul/rød av den grunn — se "Optimalisering
14 — Reservebil-logikk" for full spesifikasjon.

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
Delvis utført (kun flerpunkts saker med gjenstående avvik — se
"Prioritet 12 — Sammenslåtte Kontrollavvik")
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

# Dashboard — struktur (Prioritet 26.2 — Dashboard Nullstilling)

Dashboard er appens mest brukte side. Prioritet 26.2 er en fullstendig
redesign, ikke en optimalisering: Dashboard skal KUN svare på tre spørsmål —
(1) Hva må jeg gjøre nå? (2) Hva kommer snart? (3) Hvilken bil starter jeg
med? — og skal kunne leses på under 5 sekunder. Alt annet (historikk,
servicehistorikk, dekkhistorikk, skader, lange tabeller, metadata,
forklaringer, generell biloversikt) hører hjemme andre steder i appen
(Biloversikt/Historikk/Kjøretøyprofil/Aktive Saker), ikke på Dashboard.

**Viktig arkitekturmerknad:** dette kapittelet erstatter de tidligere
"Dashboard Pro" og "Operativ Dashboard Compact (Prioritet 17)"-kapitlene i
sin helhet. Ved eventuelt avvik mellom denne dokumentasjonen og koden er det
alltid koden (`renderDashboard()` i `index.html`) som er sannheten — dette
gjaldt allerede da Prioritet 26.2 ble spesifisert (spesifikasjonen forutsatte
feilaktig at Prioritet 18–24, service-/kontrollprognoser og en
"Operativ Belastning"-indikator allerede fantes; ingen av delene fantes i
koden, og er derfor bevisst IKKE bygget som del av denne oppgaven).

**Toppfelt (uendret fra Prioritet 17):** det delte `shell-top` (brand + ☰
Meny, vises på alle sider) utvides med en "Bilparkhelse Status"-rad — men
KUN på selve Dashboard-skjermen (`screen === 'dashboard'`). Beregnes direkte
i `render()` med `vehicleHovedstatus()`/`vehicleAktivSjafor()` — ingen egen
tellelogikk. Viser 🟢🟡🟠🔴-chips (Bilparkhelse) + "🚚 N biler i drift nå" på
samme rad. Ren statusvisning ("Kun status" — Prioritet 26.2 Fase 3): ingen
detaljliste vises lenger på selve Dashboardet ved klikk på en chip — siden
Dashboardets tidligere inline Biloversikt-akkordion er fjernet (se under),
ruter chipsene nå til den faktiske Bilregister-siden i stedet
(`goToRegisterHovedstatus()`, nytt `filterHovedstatus`-filter på
Bilregister — se "Bilregister — hovedstatusfilter" under). ☰ Meny-knappen
er fortsatt bevisst IKKE flyttet.

**Gjeldende struktur (topp til bunn, kropp) — maks tre operative
seksjoner:**

1. Hilsen/greeting-card (uendret, inkl. hurtigknapper for
   kontroll/verkstedtime-registrering og "⭐ Neste verkstedtime").
2. Databasevarsel (kun ved feil/manglende felt).
3. **🚨 Krever handling nå** — hovedkortet. Samlet oppsummering av kritiske
   saker, biler ute av drift, oppfølginger i dag og manglende kontroll,
   bygget på eksisterende `sakKreverHandling()` (ingen egen, parallell
   forretningslogikk). Hver rad i den utvidbare listen (`dashKreverTop5`,
   maks 5) viser nå eksplisitt Bil, Problem, **Prioritet** (Kritisk/Høy/
   Normal — nytt felt) og **Neste handling** (`item.aksjon`, fantes i data
   fra før men ble ikke vist — nå gjort synlig). Egen "Se alle"-knapp
   (`data-goto-aktivesaker-filter="alle"`) i stedet for tidligere
   "+N til"-tekst. Panelet er KUN rødt når det faktisk finnes kritiske
   saker eller biler ute av drift (`krHarKritisk`), amber ellers
   (uendret prinsipp fra Optimalisering 15).
4. **📅 Kommer snart** — kommende verkstedtimer (inntil 7 dager, gjenbruker
   `vtWithinWeek()`) og saker med oppfølgingsdato innen 3 dager
   (`sakOppfolgingStatus(s) === 'snart'`, eksisterende terskel). Maks 5,
   sortert kronologisk. Det som allerede vises i "Krever handling nå"
   (dagens/forfalte oppfølginger, kritiske saker, mangler kontroll) er
   bevisst utelatt for å unngå dobbeltinformasjon. Service-/
   kontrollprognoser (dager-basert gul/rød-status, km-baserte
   serviceintervaller) finnes ikke i kodebasen og er bevisst IKKE bygget nå
   — se arkitekturmerknaden over.
5. **🎯 Prioriterte biler** — samme `dashKreverListe` som Kort 3, men
   gruppert PER BIL (ikke per sak): én rad per bil med dens mest alvorlige
   årsak (Map som beholder første/høyest-prioriterte treff per
   `vehicleId`, siden `dashKreverListe` allerede er sortert
   kritisk→forfalt→oppfølging→mangler kontroll). Maks 5 biler. Ingen ny
   forretningslogikk eller datakilde.

**Fjernet fra Dashboard i Prioritet 26.2 (flyttet eller vurdert overflødig):**
- **🚦 Operativ Status-kortet** (Prioritet 17 Del 1) — innholdet er enten
  allerede dekket av "Krever handling nå" (oppfølging i dag, kritisk sak,
  mangler kontroll) eller flyttet inn i "Kommer snart" (verksted i dag/
  kommende). "Biler klare"-tallet og den generelle "📋 Aktive saker: N →"-
  lenken er droppet helt — svarer ikke på "hva må jeg gjøre nå" eller "hva
  kommer snart" (Fase 8-sjekken), og var uansett dekket av Bilparkhelse i
  toppfeltet / "Se alle"-knappen på Kort 1.
- **⭐ Min bil-kortet** (Optimalisering 8) — fjernet som egen seksjon per
  eksplisitt instruks i Prioritet 26.2 ("Det er alt" — kun de tre kortene
  over skal vises). **Avvik å være oppmerksom på:** dette er reell
  funksjonalitet som gikk tapt (hurtigtilgang til egen bil når
  driftskoordinator selv er aktiv sjåfør) — ingen erstatning er bygget inn
  i de tre gjenværende kortene. Diskuter med driftskoordinator om dette bør
  gjeninnføres (f.eks. som en fremhevet rad i "Prioriterte biler") dersom
  det viser seg å være et reelt behov i praksis.
- **📅 Kommende verkstedtimer-panelet** (egen seksjon) — slått sammen inn i
  "Kommer snart" sammen med kommende oppfølginger.
- **🚗 Biler i drift nå-kortet** (liste over bil+sjåfør) — fjernet som egen
  seksjon; kun tallet (`bilerIDriftCount`) gjenstår, i toppfeltet. Detaljer
  (hvem kjører hvilken bil) må nå slås opp i Biloversikt
  (☰ Meny → Oversikter → Biloversikt, eller via toppfeltets "🚚 N biler i
  drift nå" → `goToRegisterHovedstatus('har-aktiv-sjafor')`).
- **🚐 Biloversikt-akkordionen** (filtrerbar, gruppert biloversikt inline på
  Dashboard) — fjernet i sin helhet. Dashboard skal ikke inneholde
  navigasjon eller store oversikter (Prioritet 26.2 Svar 3). Samme filtrere
  finnes nå på selve Bilregister-siden (se under).

Ikke prioritert på Dashboard (finnes andre steder i appen): historikk,
analyse, kostnader, full biloversikt.

---

# Bilregister — hovedstatusfilter (nytt i Prioritet 26.2)

Da Dashboardets inline Biloversikt-akkordion ble fjernet (se over), mistet
toppfeltets Bilparkhelse-chips sin destinasjon. I stedet for å bygge en
erstatning på Dashboard (som ville brutt "Dashboard skal kun vise handling"),
er filtreringen flyttet til den faktiske Bilregister-siden: nytt
`filterHovedstatus`-felt (`'' | 'operativ' | 'oppfolging' | 'verksted' |
'kritisk' | 'har-aktiv-sjafor'`), samme mønster som eksisterende
`filterKontrollStatus`/`filterKategori`/`filterLoyve`. Egen dropdown i
`renderRegister()` sitt filter-rad, og en ny navigasjonsfunksjon
`goToRegisterHovedstatus(status)` (samme mønster som `goToRegisterKategori()`
/`goToRegisterFiltered()`). Gjenbruker `vehicleHovedstatus()`/
`vehicleAktivSjafor()` uendret — ingen ny tellelogikk. Kun de fem verdiene
toppfeltet faktisk trenger er inkludert (ikke hele det tidligere,
bredere settet fra Dashboardets gamle akkordion-filter, f.eks. "reserve"/
"ute-av-drift"/"har-forfalt" — disse kan legges til på samme måte om behovet
oppstår).

---

# Kjøretøyprofil — Service (km-basert serviceintervall, ny funksjonalitet)

**Viktig bakgrunn:** dette fantes IKKE i `index.html` før denne oppgaven,
selv om `AIRTABLE_MIGRATION.md` allerede beskrev en plan for det under
"Prioritet 18 — Serviceintervall basert på kilometer" (databaseskjemaet var
altså tenkt gjennom tidligere, men aldri faktisk bygget i appen). Bygget nå
i tråd med den eksisterende planen, med eksplisitt bekreftet retning fra
driftskoordinator: km-basert intervall, egen alltid synlig seksjon (ikke
gjemt i en accordion).

**Datamodell** (ingen ny Airtable-tabell — se AIRTABLE_MIGRATION.md):
- `v.serviceIntervallKm` — nytt felt på selve kjøretøyet (`ServiceIntervallKm`
  i Airtable), km mellom hver service. Ingen automatisk standardverdi.
- `servicehistorikk` — ny global liste, samme lagringsmønster som
  `dekkhistorikk` (`window.storage.get/set('servicehistorikk', true)`, delt,
  JSON). Ett element per utført service:
  `{id, vehicleId, dato, km, type, verksted, kommentar, createdAt, createdBy}`.
  `type` er fritekst (ikke fast liste). `verksted` gjenbruker samme
  verkstedregister/dropdown (`verkstedSelectOptions()`) som verkstedtimer.

**Beregning — LIVE, ingen lagret status** (`vehicleServiceStatus()`,
plassert rett ved siden av `dekkAlderStatus()` i `index.html`, samme
prinsipp): "neste service" = km ved siste registrerte service +
`serviceIntervallKm` (0 km som utgangspunkt dersom ingen service er
registrert ennå). Status mot bilens nåværende `v.km`: 🟢 grønn ved god
margin, 🟡 gul innen `SERVICE_VARSEL_KM` (1000 km, fast terskel — bevisst
ikke konfigurerbar, samme filosofi som `dekkAlderStatus()` sine faste
årsgrenser), 🔴 rød ved forfalt (bilen har passert beregnet service-km).

**Plassering:** egen panel i Kjøretøyprofil, "🔧 Service" — plassert som
**primær, alltid synlig seksjon** (ikke i `acc-list`-accordionen), rett
etter "🩺 Operativ status" og før "🗂️ Aktive saker". Panelet fargelegges
rødt/amber ved forfalt/snart-status, samme mønster som "Krever handling
nå" på Dashboard. Inneholder: statusgrid (intervall/siste service/neste
service/status), skjema for å sette/endre intervall, registreringsskjema
for utført service, og full historikkliste.

**Bevisst IKKE gjort:** ingen `updatedAt`/redigering av allerede
registrerte servicer (kun opprette nye — samme begrensning som
dekkskiftehistorikk har fra før). Ingen integrasjon mot Dashboard
("Kommer snart"/"Krever handling nå") ennå — dette var eksplisitt utelatt
fra Prioritet 26.2 og er ikke en del av denne oppgaven; kan vurderes senere
nå som selve datagrunnlaget finnes.

---

# Kjøretøyprofil — Dekk slått sammen (Dekkoversikt + Dekkhistorikk)

De to tidligere separate accordion-radene "Dekkoversikt" (DOT-koder,
produksjonsdato, alder per sesong) og "Dekkhistorikk" (logg over
dekkskifter) er slått sammen til én rad, "🛞 Dekk" — begge handlet om
samme bils dekk, og fantes som to adskilte rader uten noen reell grunn til
separasjon. All funksjonalitet er beholdt uendret (DOT-registrering,
lagreknapp, dekkskifte-registrering, historikkliste) — kun presentasjonen
er samlet i én body (`dekkSamletBody` i `index.html`), med en enkel
overskrift ("Dekkskiftehistorikk") som skiller de to delene visuelt.
Reduserer Kjøretøyprofil sin accordion-liste fra 7 til 6 rader.

---

## 5. To mindre mobil-UI-justeringer

**Biloversikt flyttet opp:** `MOBIL_HJEM_IKONER` omordnet slik at
🚐 Biloversikt nå er fjerde ikon (andre rad, sammen med Kontroll/
Registrer avvik/Aktive saker i de to øverste radene), i stedet for sjette
(tidligere gruppert med Service/Dekk/Planlegging nederst). Kun
rekkefølge endret — ingen ny logikk.

**☰ Meny flyttet ned på mobil:** Toppkortet (`.shell-top`) stables nå
vertikalt på skjermer ≤768px (`flex-direction:column`) i stedet for
side-ved-side med merkevaren — menyknappen havner under merkevare-raden,
høyrejustert, tydelig sekundær. Kun CSS (ny regel i eksisterende
`@media (max-width:768px)`-blokk) — ingen endring i selve
menyens funksjon, plassering i DOM, eller oppførsel på desktop (der
`.shell-top-right` uansett er skjult av `.app-shell-desktop`-regelen fra
før, siden sidebaren er navigasjonen der).

---

# KRITISK FEILRETTING — Skadebilder lagret ikke faktisk (viste "Skadebilde" uten bilde)

**Rotårsak, bekreftet ved gjennomgang av `storage_airtable.js`:** bilder
lagres i `Photos`-tabellen, `Value`-feltet er en Airtable "Long text"
(`multilineText`)-kolonne — praktisk grense **~100 000 tegn per celle**.
`resizeImage()` komprimerte tidligere til maks 1000px ved FAST
JPEG-kvalitet 0,72, uavhengig av bildets kompleksitet — for et travelt/
detaljert bilde kunne den resulterende base64-strengen lett overstige
grensen. Når Airtable da avviste skrivingen, kastet
`writeSettingsRow()` en feil som `savePhoto()` fanget **helt stille**
(kun `console.error`, ingen varsling videre).

**Den avgjørende, sammensatte feilen:** `hasPhoto`/`skadeBilderCount`
ble satt basert på om sjåføren *valgte* et bilde — ikke på om lagringen
faktisk lyktes. Systemet viste derfor "📷 Bilder (1)" og en gyldig
`damage:{id}`-nøkkel i galleriet, men uten faktisk bildedata bak —
nøyaktig symptomet som ble meldt ("Skadebilde"-plassholder, ingen bilde
rendres).

**To rettelser:**
1. `resizeImage()` prøver nå gradvis lavere JPEG-kvalitet (fra 0,72 ned
   mot 0,25) til resultatet er trygt under 85 000 tegn — garanterer at
   det som faktisk lagres alltid får plass i Airtable-feltet, uansett
   bildets kompleksitet.
2. `savePhoto()` returnerer nå `true`/`false` i stedet for å svelge
   feilen stille. **Alle fire steder** et skadebilde kan lagres
   (`submitAddSkade`, `submitMinBilSkade`, `saveDamageEdit`,
   `submitKontroll`) setter nå `hasPhoto`/`skadeBilderCount` KUN basert
   på bekreftet vellykket lagring, og varsler brukeren (`alert()`)
   dersom det faktisk feiler — i stedet for å late som alt gikk bra.

**Ekstra presisjon i `submitKontroll()` (flerbilde-tilfellet):** bilder
lagres nå under sammenhengende indekser blant kun de VELLYKKEDE bildene
(ikke original posisjon i utvalget), slik at `damagePhotoKeys()` sin
antakelse om en sammenhengende `0..count-1`-sekvens alltid stemmer, selv
om ett bilde midt i en serie på flere skulle feile.

**Fortsatt ikke løst av denne rettelsen (utenfor det jeg kan verifisere
herfra):** dersom `Photos`-tabellen eller `Value`-feltet i den faktiske
Airtable-basen er feilkonfigurert (f.eks. feil felttype, eller tabellen
mangler helt), vil skriving fortsatt feile uavhengig av bildestørrelse —
kjør "🔄 Synkroniser Airtable" i Innstillinger for å bekrefte/rette dette
(EXPECTED_SCHEMA i `storage_airtable.js` inkluderer allerede `Photos`
med riktig felttype, se linje 385/390).

---

# Kritisk manglende funksjon — Visning av skadebilder

## Kartlagt flyt

**Hvor bildene lagres:** `window.storage.set('photo:'+key, dataUrl, true)`
— generisk delt nøkkel/verdi (samme Settings-mekanisme som
servicehistorikk/dekkhistorikk), permanent. **Bekreftet: lagres
permanent** — ingen midlertidig/sesjonsbasert lagring.

**Hvordan de kobles til saken — to ulike kilder, oppdaget under
kartleggingen:**
1. Admin-/Min Bil-registrert skade: ETT bilde, `damage:{id}`,
   `damage.hasPhoto` (boolsk).
2. Skade meldt via sjåførkontroll MED flere bilder: driftskoordinator
   kunne **aldri se mer enn det første bildet**. Alle bildene lagres
   riktig (`kontroll:{kontrollId}:0`, `:1`, `:2` ...,
   `kontroll.skadeBilderCount`), men kun bilde nr. 0 kopieres til
   `damage:{id}` (`submitKontroll()`, uendret i denne runden) — resten
   var teknisk sett permanent lagret, men **utilgjengelig via dataene**
   fra noe sted i UI. Dette var rotårsaken til at "flere bilder" aldri
   kunne vises.

**Løsning:** `damagePhotoKeys(d)` henter riktig bildesett fra riktig
kilde (kontrollens fulle sett når skaden stammer derfra, ellers det ene
`damage:{id}`-bildet) — uten å endre noe i selve lagringen.

## Implementert

- `bildeGalleriHtml()`/`attachBildeGalleriListeners()` — gjenbrukbar
  miniatyrgrid-komponent, brukt to steder:
  - `sakWizardSteg1Html()` — Aktive saker → åpne sak → 📷 Bilder (N),
    synlig med én gang saken åpnes (samler bilder fra ALLE skader
    koblet til saken via `sakSkadeDamages()`/`sakAvvikListe()`, dekker
    både enkelt- og flerpunkts saker)
  - `damageCard()` — badge "📷 N bilder" på selve skadekortet (alltid
    synlig, ikke gjemt bak redigeringsmodus) + galleri rett under.
    Samme komponent brukes i Kjøretøyprofil sin Historikk→Skader-fane
    for BÅDE aktive og fikset/historiske skader
    (`attachDamageCardListeners(vehicleDamages(currentVehicleId))`
    dekker begge) — dekker "Historikk → Skade → Bilder"-kravet direkte,
    ingen egen kode nødvendig for lukkede saker.
- `openLightbox()`/`renderLightbox()` — global fullskjerm-visning (egen
  container `#bilde-lightbox-modal` utenfor `#app`, samme mønster som
  slettedialogen for kontroller), med forrige/neste-navigasjon
  (`lightboxForrige()`/`lightboxNeste()`) når saken har flere bilder,
  og tellevisning ("2 / 3"). Fungerer identisk på mobil og desktop —
  ren CSS/DOM, ingen enhetsspesifikk kode.

**Bevisst kjent, ikke rettet:** dersom en kontroll med flere skadebilder
senere slettes (`performKontrollDeletion`), forsvinner de ekstra bildene
sammen med kontrollens egne nøkler — skaden beholder fortsatt sitt ene
`damage:{id}`-bilde (kopiert ved opprettelse), så ingenting knekker,
men "flere bilder" reduseres til "ett bilde" i det tilfellet. Dette var
allerede slik lagringen fungerte før denne runden — ikke en ny
begrensning innført nå, kun dokumentert.

---

# Prioritet 26.10 — Verifisering + Service lagt til i Historikk-huben

Alle tre punkter i denne rundens oppgave ble grundig verifisert mot
faktisk kode (ikke antatt) før noe ble endret:

1. **Rediger/slett servicehistorikk** (Prioritet 26.8) — bekreftet
   fullstendig implementert og korrekt koblet opp. Ingen feil funnet.
2. **Serviceavtaler adskilt fra verkstedtimer** (Prioritet 26.9) —
   bekreftet: `submitPlanlagtService()` skriver kun til
   `planlagteServicer`, aldri `verkstedtimer`.
3. **Proaktiv Planlegging uten registrering** — bekreftet:
   `flatePlanleggingData()` sin `service`/`euKontroll` er allerede 100 %
   terskelbasert (`vehicleServiceStatus()`/`vehicleEuKontrollStatus()`).

**Ett reelt gap funnet og rettet:** `servicehistorikk` var IKKE en del av
`HISTORIKK_TYPE_LABEL`/`HISTORIKK_TYPE_IKON`/`HISTORIKK_HUB_TYPER` eller
`flateHistorikkTidslinje()` — i motsetning til Kontroll/Skade/Dekk/
Kostnad/Verksted/Varsellamper, som alle er søkbare/filtrerbare i den
samlede Historikk-huben. Service var kun synlig via den dedikerte
Service-skjermen. Trolig roten til at "fungerer på samme måte som andre
historikkobjekter" ikke opplevdes oppfylt.

**Løsning:** `service` lagt til som sjuende type i Historikk-huben.
Bevisst lagt til direkte i `flateHistorikkTidslinje()` (den flåtebrede
huben), IKKE i `vehicleHistorikkTidslinje()` (som fortsatt brukes av
Kjøretøyprofil sin "Historikk"-fane — Service skal fortsatt IKKE dukke
opp der, siden Kjøretøyprofil bevisst er ren kjøretøyinformasjon uten
Service-seksjon siden funksjonsbasert navigasjon ble innført). Ingen
endring i selve servicehistorikk-datamodellen eller rediger/slett-
logikken — kun lagt til som en ekstra, skrivebeskyttet visningskilde i
huben (klikk på et service-element i Historikk-huben tar deg til
Kjøretøyprofil, samme mønster som alle andre hub-elementer — vil du
faktisk redigere/slette, går du videre derfra til Service-skjermen via
Operativ status-lenken, uendret flyt).

---

# Prioritet 26.9 — Serviceavtaler og verkstedtimer fullstendig adskilt

**Bakgrunn:** Prioritet 26.7 lagret planlagt service SOM en verkstedtime
(`type: 'service'` på et vanlig `verkstedtimer`-objekt) for enkelhets
skyld. Uønsket i praksis — en registrert serviceavtale skal ikke
automatisk telle som/opptre som en verkstedtime noe sted i appen.

**Løsning — full separasjon:**
- Ny, egen liste `planlagteServicer` (`{id, vehicleId, dato, tidspunkt,
  verksted, kommentar}`), egen lagringsnøkkel (`'planlagteservicer'`,
  samme generiske Settings-mønster som `servicehistorikk` — **ingen ny
  Airtable-tabell eller feltkartlegging nødvendig**, `storage_airtable.js`
  er derfor UENDRET denne runden).
- `submitPlanlagtService()` skriver nå til `planlagteServicer`/
  `savePlanlagteServicer()` — aldri til `verkstedtimer`.
- `renderServiceSkjerm()` sin liste over kommende planlagte servicer
  (`vPlanlagteServicer`) leser fra den nye, adskilte arrayen.

**Planlegging viser dem side om side, men henter dem separat**
(`flatePlanleggingData()` returnerer nå `service` (km-varsler),
`planlagtService` (avtaler) og `verksted` (ekte verkstedtimer) som tre
uavhengige lister). "🔧 Service"-kolonnen slår sammen km-varsler og
planlagte avtaler i samme visning (to adskilte datakilder, én liste) —
"🛠️ Verksted"-kolonnen (ikon endret fra 🔧 til 🛠️ for tydeligere visuelt
skille, som bedt om) viser nå KUN ekte verkstedtimer, aldri
serviceavtaler.

**Kjent, uendret vestigial rest:** `type`-feltet som ble lagt til
`verkstedtimer`/`storage_airtable.js` i Prioritet 26.7 er nå ubrukt (alle
nye poster har `type` udefinert igjen) — bevisst IKKE fjernet fra
`storage_airtable.js`, siden et alltid-tomt registrert felt er helt
harmløst og en fjerning kun ville krevd unødvendig ny opplasting av den
filen uten noen funksjonell gevinst.

**Bevisst utenfor denne rundens omfang:** Dashboard sitt "📅 Kommer
snart"-kort (Prioritet 26.2) henter fortsatt kun fra `verkstedtimer` —
planlagte serviceavtaler vises derfor ikke der. Oppgaven spesifiserte
kun Planlegging ("Planlegging skal kunne vise..."), ikke Dashboard.

---

# Prioritet 26.8 — Rediger/slett servicehistorikk

**Rotårsak (samme klasse feil som Prioritet 26.7 sin oppdagelse for
kontroller):** servicehistorikk ble bygget i Prioritet 26.3 med kun
registrering og en enkel, ren visningsliste (`<ul><li>...</li></ul>`) —
aldri med rediger/slett, i motsetning til verkstedtimer og
kontrollhistorikk som begge har hatt dette mønsteret lenge.

**Løsning — samme etablerte mønster som verkstedtimer (`vtCard()`/
`toggleEditVT()`/`saveVTEdit()`/`deleteVT()`):** ny `serviceHistoryCard()`
— hvert element er nå et klikkbart kort (`data-toggle-service`) som
utvider til en redigeringsboks (`dmg-editbox`, samme CSS som
verkstedtimer/skader) med Dato/Kilometerstand/Type/Verksted/Kommentar +
[Lagre endringer] [Avbryt] [Slett]-knapper (`toggleEditService()`,
`saveServiceEdit()`, `deleteService()` — `editingServiceId`, samme
delt-state-mønster som `editingVTId`).

**Ingen egen rekalkuleringskode nødvendig** for "siste service"/"neste
service"/serviceindikator/Planlegging/Dashboard — alle er allerede LIVE
beregnet fra `servicehistorikk` ved hvert `render()`
(`vehicleSisteService()`/`vehicleNesteServiceKm()`/
`vehicleServiceStatus()`), samme arkitekturprinsipp som resten av appen.
Redigering/sletting av et element oppdaterer `servicehistorikk`-arrayet
og kaller `render()` — resten følger automatisk.

**Bevisst ikke gjort:** `v.km` (bilens nåværende kilometerstand)
rekalkuleres IKKE ved redigering/sletting av en service, i motsetning til
hvordan kontrollsletting ruller tilbake km. Dette var ikke en del av
denne oppgavens krav (kun servicehistorikk/siste/neste
service/serviceindikator/Planlegging/Dashboard ble spesifisert) — vurder
om det bør legges til senere dersom det viser seg nødvendig i praksis.

---

# Prioritet 26.7 — Planlagt service og skjerpet servicevarsling

## 1. Planlagt service

Ny registreringsflyt i `renderServiceSkjerm()`: "📅 Planlegg service"
(bil allerede valgt via `serviceValgtVehicleId` → Dato → Klokkeslett →
Verksted → Kommentar → Lagre — nøyaktig flyten fra oppgaven). Lagres som
et vanlig `verkstedtimer`-objekt (`submitPlanlagtService()`), kun med
`type: 'service'` og `beskrivelse: 'Service'` — samme underliggende
datamodell/tabell som ordinære verkstedtimer, ingen ny datastruktur.

Vises i Planlegging **automatisk, uendret** — "🔧 Verksted"-kolonnen
(`flatePlanleggingData()`) filtrerer allerede ikke på type, så en
planlagt service dukker opp der akkurat som enhver annen verkstedtime,
med samme dato/tidspunkt-formatering. Ingen kodeendring var nødvendig i
Planlegging selv for å oppfylle "vises på samme måte som verkstedtimer".

Egen liste over kommende planlagte servicer vises også direkte på
Service-skjermen for valgt bil (`vPlanlagteServicer`, filtrert på
`type==='service' && dato >= i dag`).

## 2. Skjerpet servicevarsling — fire nivåer

`vehicleServiceStatus()` har nå samme firenivå-struktur som
`vehicleEuKontrollStatus()` fikk i Prioritet 26.4: 🟢 ok (mer enn 2500 km
igjen), 🟡 `snart-gul` (2500 km eller mindre), 🔴 `snart-rod` (1000 km
eller mindre), 🔴 `forfalt` (intervall passert). Erstatter det tidligere
enkeltnivået `SERVICE_VARSEL_KM = 1000` (grønn/gul/rød i praksis kun to
reelle nivåer) — 1500 km igjen er nå korrekt gul, ikke grønn.

Alle konsumenter oppdatert til de nye statusnavnene: Serviceindikator
(Kjøretøyprofil topppanel, Operativ status), Service-skjermens egen
statusgrid/panelfarge, Planlegging sitt Service-filter. **Nytt denne
runden:** Service (kun `forfalt`-nivået, samme prinsipp som EU-kontroll)
vises nå også i Dashboard sitt "🚨 Krever handling nå"/"🎯 Prioriterte
biler" (`serviceForfalteBiler`, inkludert i `krHarKritisk`) — målet er at
service planlegges FØR den blir kritisk, ikke først når den er rett på.

---

# KRITISK REGRESJON — Kontrollhistorikk kunne ikke slettes

**Symptom:** slett-knapp for tidligere kontroller var ikke lenger
tilgjengelig noe sted i UI.

**Rotårsak, bekreftet ved kodegjennomgang:** det finnes to forskjellige
kort-komponenter for én registrert kontroll — `kontrollHistoryCard(k)`
(brukt i Kjøretøyprofil sin Historikk→Kontroller-fane) har **aldri** hatt
slett-knapp. `kontrollHistorikkRow(k)` (med slett-knapp) brukes **kun**
av `renderKontrolloversikt()` — den frittstående, flåtebrede siden som
bevisst ble koblet fra all navigasjon i Prioritet 27 (erstattet av
Historikk-huben). Dette gjorde slett-funksjonen uoppnåelig i UI, selv om
selve slettelogikken (`deleteKontroll()`/`performKontrollDeletion()`,
inkl. full rekalkulering av km/varsellamper/statushistorikk) var
fullstendig intakt og urørt hele tiden.

**To feil rettet:**
1. Slett-knapp (admin-gated, samme mønster som `kontrollHistorikkRow`)
   lagt til i `kontrollHistoryCard()`.
2. `[data-delete-kontroll]`-klikklytteren var KUN registrert i
   `attachKontrolloversiktListeners()` (samme frakoblede side) — uten
   tilsvarende registrering i `attachBilkortListeners()` ville knappen
   fra punkt 1 vært synlig, men uten funksjon. Lagt til der også.

**Ny/gjeninnført vei:** Biloversikt → velg bil → Kjøretøyprofil →
Historikk → Kontroller-fanen → 🗑️ Slett kontroll (samme smarte
slettedialog med "kun kontroll"/"full cleanup" som før — modalen selv
(`renderKontrollSlettModal()`) var aldri påvirket).

**Berørte funksjoner:** `kontrollHistoryCard()`, `attachBilkortListeners()`.
**Endret fil:** kun `index.html`. Ingen endring i selve slette-/
rekalkuleringslogikken (`deleteKontroll`/`performKontrollDeletion`) — den
var aldri i stykker.

**Bevisst ikke gjort:** delete-knapp er ikke lagt til i den nye,
flåtebrede Historikk-huben (`renderHistorikk()`/`flateHistorikkTidslinje()`)
— den viser generiske, sammenslåtte tidslinjehendelser på tvers av alle
typer (kontroll/skade/dekk/kostnad/verksted/varsellampe), ikke
strukturerte kontroll-objekter med tilgang til slette-/rekalkulerings-
logikken. Per-kjøretøy-veien over dekker samme behov uten denne
kompleksiteten.

---

# KRITISK FEILRETTING — Mobilnavigasjon åpnet menyen i stedet for å navigere

**Symptom:** alle 7 ikonene på mobilens hjemskjerm åpnet ☰ Meny i stedet
for å navigere til riktig skjerm.

**Rotårsak, bekreftet ved kodegjennomgang:** forrige rundes sveip-
refaktorering (drag-følging, Prioritet 26.4 oppfølging 3) fjernet en
universell minimumsterskel (`if(Math.abs(dx) < SWIPE_TERSKEL || ...)
return;`) som tidligere lå FØR forgreningen mellom "sveip høyre"/"sveip
venstre". Terskelen ble kun bygget inn i `skalTilbake` (høyre-grenen),
men venstre-grenen (`toggleHeaderMenu()`) fikk ALDRI en tilsvarende
sjekk — ethvert touchend der `dx <= 0` (praktisk talt et hvert vanlig
trykk, siden fingeren knapt beveger seg under et tap) endte i
menyveksling.

**Rettet:** venstre-grenen krever nå samme reelle, horisontalt dominante
bevegelse forbi `SWIPE_TERSKEL` som høyre-grenen, i stedet for kun "ikke
et sveip til høyre".

**Andre hypoteser undersøkt og avkreftet ved kodegjennomgang** (ba om i
oppgaven): `.drawer-overlay` har korrekt `pointer-events:none` i lukket
tilstand (kun `pointer-events:auto` når `.open`-klassen er satt) —
overlayet kan ikke stjele trykk fra ikonene når menyen er lukket.
Ikonene er ekte `<button>`-elementer, korrekt ekskludert fra
sveip-deteksjon via `target.closest('...button...')` i touchstart.
Ikon-klikkene bruker uendret, standard `click`-lyttere
(`attachMobilHjemListeners()`), upåvirket av touch-lytterne når disse
fungerer korrekt.

**Berørt funksjon:** `document.addEventListener('touchend', ...)`
(sveipenavigasjon-blokken, `index.html`).
**Endret fil:** kun `index.html`.

---

# Prioritet 26.6 — Operativ Status Cleanup

## 1. "Marker ute av drift" flyttet til Faresone

`uteAvDriftBody`-konstanten er uendret (samme knapp/skjema), men BRUKES
nå i Faresone, over "🗑️ Slett bil" — ikke lenger inne i Operativ
status-panelet. Begrunnelse fra oppgaven: begge er spesielle,
risikofylte handlinger, ikke operativ informasjon. Faresone-teksten er
justert til å nevne begge handlingene.

## 2. Operativ status i to kolonner

`operativStatusBody` delt i `.ov-split-grid` (to `.ov-split-col`):
venstre — Bilgruppe/Biltype/Hovedstatus/Kontrollstatus/Aktiv sjåfør;
høyre — Aktive saker/Kritiske saker/Forfalte oppfølginger/Neste handling/
Neste oppfølgingsdato/Neste verkstedtime/Sist oppdatert. CSS bruker
`auto-fit`/`minmax(260px,1fr)` (samme mønster `.ov-grid` selv allerede
brukte internt) — layouten avgjør selv ekte 2-kolonne (nok bredde) vs.
to stablede, tydelig avgrensede seksjoner (for smalt), uten egen
mobil/desktop-forgrening i koden.

## 3. Handlingsknappenes plassering — verifisert, ingen endring nødvendig

Kontrollert opp mot faktisk kode: quick-links-raden (✅ Registrer
kontroll / ⚠️ Registrer skade / 🔧 Registrer verkstedtime / 📋 Åpne
aktive saker) lå allerede nøyaktig mellom "🚐 Kjøretøyprofil"-panelet og
"🩺 Operativ status"-panelet — samme rekkefølge oppgaven ba om. Ingen
kodeendring var nødvendig her.

---

# Prioritet 26.4 — Finjusteringer etter Design 2.0 (oppfølging 3)

## Meny øverst til høyre — den faktiske gjenværende årsaken

Forrige rundes "revert" (meny tilbake øverst, mindre toppkort) så riktig
ut i teorien, men en ELDRE, ikke-relatert regel overstyrte den på ekte
telefonbredder: `.shell-top-right{width:100%;...}` inne i
`@media (max-width:640px)` (fra lenge før denne redesign-serien) tvang
menyknappen til egen rad via `flex-wrap:wrap` på `.shell-top`, uansett
hva som ble endret i 768px-blokken. Rettet til `width:auto` — BILPARK og
☰ Meny deler nå samme rad ned til minste telefonbredde, som gir den
lavere toppkort-høyden som var målet hele tiden.

## Ikonrekkefølge

Uendret — bekreftet riktig (Biloversikt → Kontroll → Registrer avvik →
Aktive saker → Service → Dekk → Planlegging).

## Sveip tilbake — reell drag-følging lagt til

Forrige runde rettet den LOGISKE feilen (kant/ikke-kant byttet om) og en
touchmove-sensitivitetsfeil, men sveipet var fortsatt strukturelt et
binært "hopp" — ingenting skjedde visuelt før `touchend`, uansett hvor
korrekt logikken ellers var. Dette er den grunnleggende forskjellen fra
iOS, som følger fingeren kontinuerlig.

Lagt til: `.app-shell-main` (hele shell-top+innhold) følger nå fingeren
1:1 via `transform:translateX()` under selve kant-sveipet
(`swipeDragActive`), med skygge for dybdefølelse. Ved slipp: fullføres
sveipet med en rask utglidning (150ms) før selve navigasjonen
(`goBack()`) kjøres, eller fjærer tilbake til start (180ms) dersom
terskelen ikke ble nådd — samme "commit eller avbryt"-mønster som iOS.
`will-change:transform` settes kun mens draget faktisk er aktivt (fjernes
i `swipeResetDrag()`) for jevnere komposittering på de tyngre skjermene
som ble spesifikt nevnt (Historikk, Aktive Saker, Planlegging).

Har vertikal jitter FØR draget er aktivt, avbrytes det fortsatt (uendret
fra forrige runde) — men når draget FØRST er aktivt, kan det ikke lenger
avbrytes av vertikal skjelving midt i bevegelsen (samme som iOS sin
"committed" pan-gesture).

---

# Prioritet 26.4 — Finjusteringer etter Design 2.0 (oppfølging 2)

## Meny tilbake øverst, toppkort lavere

Forrige rundes stabling (meny under merkevaren) ga for mye tomrom og
mindre plass til app-ikonene. Reversert: ☰ Meny er tilbake øverst til
høyre, side ved side med merkevaren som originalen — men selve
toppkortet er gjort lavere på mobil (mindre padding, mindre
merkevaretekst/ikon/undertekst i `@media (max-width:768px)`), som løser
det egentlige målet (mindre tomrom, renere område) uten å ofre
plasseringen.

## Ny ikonrekkefølge — Biloversikt først

`MOBIL_HJEM_IKONER` omordnet: Biloversikt → Kontroll → Registrer avvik →
Aktive saker → Service → Dekk → Planlegging. Biloversikt er nå første og
øverste ikon.

## KRITISK FEILRETTING — Sveip tilbake var byttet om

**Rotårsak funnet ved kodegjennomgang:** sveipenavigasjonen hadde kant-
og ikke-kant-sveip forbyttet. Kant-sveip (fra venstre skjermkant) åpnet
tidligere sidemenyen; "tilbake" trigget kun ved sveip som IKKE startet i
kantsonen — stikk motsatt av iOS-konvensjonen (kant-sveip = tilbake).
Brukere som sveipet fra kanten (den naturlige iOS-refleksen) fikk
sidemenyen i stedet for å gå tilbake.

**Rettet:** kant-sveip er nå ALLTID tilbake-navigasjon (samme
`goBack()`-mål som ← Tilbake-knappen, inkl. samme spesialhåndtering for
rapport-/analysetype-undernavigasjon), på alle undersider
(`OVERSIKT_SWIPE_BACK_SCREENS`, uendret liste). Meny-åpning via
kant-sveip er fjernet i sin helhet — ikke et iOS-mønster, og var
nettopp det som konfliktet. ☰ Meny-knappen selv er helt uendret. Sveip
som ikke starter i kantsonen gjør nå ingenting (fjerner samtidig en
tidligere kilde til utilsiktet tilbake-navigering midt i vanlig
sveiping/scrolling av innhold — bedre for "ikke konflikter med
scrolling"-kravet).

**Sekundær feil rettet:** `touchmove`-lytteren avbrøt tidligere sveipet
permanent ved den minste vertikale bevegelse, vurdert allerede på FØRSTE
touchmove-event — der `dx`/`dy` ofte bare er et par pikslers støy
uansett faktisk retning. Dette kunne drepe et reelt horisontalt sveip
før det rakk å etablere seg, og er trolig hovedårsaken til at sveipet
"ikke fungerte tilfredsstillende" selv når retningen var korrekt.
Rettet: avbrytelse vurderes nå først når bevegelsen er stor nok (>10px)
til at retning er meningsfull. `SWIPE_EDGE_SONE` også utvidet fra 24px
til 28px (nærmere iOS sin egen kantsone) for mer pålitelig treff.

---

# Prioritet 26.4 — Finjusteringer etter Design 2.0

## 1. 🚚 Min bil fjernet som eget hovedikon

Løste samme oppgave som 🚐 Biloversikt — unødvendig navigasjon. Fjernet
fra `MOBIL_HJEM_IKONER` (7 ikoner igjen). Den tidligere `goToMinBil()`
er erstattet med `egenAktiveBil()` — en ren oppslagsfunksjon (samme
`vehicleAktivSjafor()`-sammenligning som før), nå brukt til å **markere**
driftskoordinatorens egen aktive bil i Biloversikt i stedet for å navigere
dit: en fremhevet "🚚 Aktiv bil: [bil] →"-banner øverst på siden, PLUSS
bilen løftes til øverst i sin egen kategorigruppe (`galleryCard(v,
erMinAktiveBil)`, ny "⭐ Min aktive bil"-merking på selve kortet). Gruppen
den tilhører åpnes også automatisk. Ingen ny datakilde — kun ny
plassering av eksisterende oppslag.

## 2. Dashboard-telling vs Aktive Saker — gjenværende avvik funnet og rettet

Forrige rettingsrunde innførte `sakKreverHandlingSamletMaster()` som
masterkilde for Dashboard (desktop) og Aktive Saker sitt filter. Ved
denne rundens gjennomgang ble **`totaltKreverHandlingCount()`** —
badge-tallet på mobilens 📋 Aktive saker-ikon — funnet UENDRET med den
gamle feilen (egen duplisert kritisk/oppfølging-beregning OG
`manglerKontrollCount` blandet inn i sak-tallet). Rettet til
`aktiveSaker.filter(sakKreverHandlingSamletMaster).length` — samme
kildekode som resten av appen. Dette var den gjenværende årsaken til at
avviket fortsatt ble opplevd (trolig sett fra mobilvisningen).

## 3. EU-kontroll — full varslingslogikk (samme mønster som service)

`vehicleEuKontrollStatus()` har nå fire eksplisitte nivåer i stedet for
tre: 🟢 ok (mer enn 90 dager/~3 mnd igjen), 🟡 `snart-gul` (90 dager eller
mindre), 🔴 `snart-rod` (30 dager/~1 mnd eller mindre), 🔴 `forfalt`
(passert). "3 måneder"/"1 måned" oversatt til dager (90/30) siden all
annen datologikk i appen (`daysUntil()`) allerede regner i hele dager.
Fallback-tekst rettet til "Mangler registrering" (var "Ikke registrert").

**Synlig i:** Kjøretøyprofil (toppanel, rå dato), Operativ status
(indikator), Planlegging (egen kolonne, uendret fra forrige runde),
Dashboard sitt "🚨 Krever handling nå"/"🎯 Prioriterte biler" — NY denne
runden: kun `forfalt`-nivået vises der (kjøring med utløpt EU-kontroll er
et compliance-/sikkerhetsbrudd, samme alvorlighetsnivå som en kritisk
sak — `sort:0`, `prioritet:'Kritisk'`, teller også med i `krHarKritisk`
for panelfarging). `snart-gul`/`snart-rod` (ikke enda forfalt) vises
bevisst KUN via Planlegging/Operativ status, ikke i Krever handling nå —
det kortet skal fortsatt kun vise det som krever handling NÅ, ikke om
1–3 måneder (Less is More).

Tomtilstand-sjekken for "Krever handling nå"-kortet er samtidig forenklet
fra to parallelle betingelser (`dashTotalHandlinger === 0 &&
uteAvDriftBiler.length === 0`) til direkte `dashKreverListe.length ===
0` — færre steder betingelsen kan komme i utakt med selve listen.

## 4. Biloversikt gruppert dropdown-visning

Allerede korrekt implementert i forrige runde (se "Biloversikt —
gruppert dropdown-visning" lenger ned) — verifisert uendret og fortsatt
riktig ved denne gjennomgangen. Ingen endring nødvendig utover
integrasjonen med "Min aktive bil"-merkingen i punkt 1 over.

---

# KRITISK FEILRETTING — Dashboard-telling stemte ikke med Aktive Saker

**Symptom:** Dashboard viste et tall (via "Se alle"-knappen på "🚨 Krever
handling nå") som ikke matchet antall saker synlig i Aktive Saker ved
klikk-igjennom.

**Rotårsak, bekreftet ved kodegjennomgang (to separate feil samtidig):**
1. `dashKreverListe` (tallet som ble vist) blandet sammen FIRE ulike ting i
   én liste: kritiske saker, oppfølgingssaker som krever handling, biler
   ute av drift, og biler som mangler kontroll i dag. De to siste er IKKE
   saker — ingen `sakId`, finnes aldri i `aktiveSaker`-arrayet — og kunne
   derfor aldri gjenfinnes i Aktive Saker uansett filter.
2. "Se alle"-knappen navigerte med `goToAktiveSakerFiltered({})` — viste
   ALLE åpne saker, ikke det samme (smalere) utvalget Dashboard talte.

**Løsning — én masterkilde:** `sakKreverHandlingSamletMaster(s)` er nå
den ENESTE definisjonen av "krever handling nå" i hele appen
(`sakErApen(s) && (s.priority === 'kritisk' || sakKreverHandling(s))`).
Både Dashboard (`kritiskeSakerAlle`/`oppfolgingKreverHandlingSaker`,
begge avledet fra denne ene funksjonen) og Aktive Saker (nytt filter
`sakFilterKreverHandlingSamlet`, kaller samme funksjon direkte) bruker
nøyaktig samme kildekode — ikke to parallelle implementasjoner som
tilfeldigvis regner likt.

Dashboard sin "Se alle saker (N)"-knapp viser nå KUN sak-tallet
(`dashTotalSaker`) og navigerer med det nye, presise filteret
(`data-goto-aktivesaker-filter="krever-handling"` →
`goToAktiveSakerFiltered({kreverHandlingSamlet: true})`) — tallet på
Dashboard og "N / M aktive saker"-telleren i Aktive Saker er nå
garantert identiske ved dette klikket.

**Ute av drift/mangler kontroll er IKKE fjernet** — de vises fortsatt i
selve "Krever handling nå"-listen (fortsatt reelle, actionable signaler),
men telles nå aldri sammen med sak-tallet. Vises i stedet som en egen,
tydelig merket linje under knappen ("+ X biler ute av drift, Y biler
mangler kontroll — ikke saker, vises kun her og i Biloversikt").

---

# Prioritet 27 — Design 2.0: Adaptiv Layout (Mobil + Desktop)

**Kjerneprinsipp (Regel 1/8):** Mobil og Desktop er IKKE samme system i ulik
størrelse — de er to forskjellige brukeropplevelser med samme data.
Desktop = Kontrollsenter (oversikt/planlegging/oppfølging/analyse). Mobil =
Operativ app (handling). Ved konflikt mellom "mer informasjon" og "Less is
More": Less is More vinner alltid (Regel 8).

**Arkitektur:** Ett datalag, ett sett `renderX()`-skjermfunksjoner
(`screen`-state, `goTo()`/`goBack()`/`screenHistory` uendret og felles).
KUN navigasjonsrammen (shell) rundt skjermene er ulik — samme mønster som
`renderDriverShell()`/`renderLoginShell()` allerede brukte for sine egne
kontekster. Ingen forretningslogikk er duplisert.

**Enhetsdeteksjon** (`detectDeviceType()`/`currentUiExperience()` i
`index.html`): bredde-basert (`window.innerWidth`), tre klasser oppdages
(mobil <768px, nettbrett 768–1199px, desktop ≥1200px), men kun to
UI-opplevelser vises — nettbrett bruker Desktop-opplevelsen (med smalere,
ikon-only sidebar, se CSS `@media (max-width:1199px)`), siden oppgaven kun
definerer to opplevelser. Grensene justeres ett sted (`DEVICE_BREAKPOINTS`)
om erfaring tilsier noe annet. Reagerer på faktisk vindusendring (debounced
`resize`-lytter), ikke bare sideinnlasting.

**Manuell overstyring** (`deviceOverride`, kun i minnet — ikke lagret per
bruker/enhet): "Bytt til Mobil-visning" nederst i desktop-sidebaren, "Bytt
til Desktop-visning" i mobilens ☰ Meny-footer (`attachMobilOverrideListener()`).

## Desktop = Kontrollsenter

Permanent sidebar (`renderDesktopSidebarHtml()`/`attachDesktopSidebarListeners()`),
erstatter ☰ Meny som primærnavigasjon (drawer/hamburger er uendret i koden
og fortsatt fullt funksjonell, kun visuelt skjult via CSS på desktop — se
`.app-shell-desktop .shell-top-right{display:none}` — minimerte risiko ved
IKKE å røre drawer-logikken i det hele tatt).

Fem primære punkter (Regel 4): 🏠 Dashboard, 🗂️ Aktive saker, 🕐 Historikk,
📅 Planlegging, 🚐 Biloversikt. Sekundært, nederst i sidebaren: 📊 Analyse
(dekker både Rapporter og Analyse-skjermene), ⚙️ Innstillinger, manuell
overstyring.

**Desktop Dashboard (Regel 4 — "Kun"):** Ingen endring av selve
`renderDashboard()` sitt desktop-innhold — det bygget fra Prioritet 26.2 av
består allerede UTELUKKENDE av 🟢 Bilparkhelse + 🚚 Biler i drift
(toppfeltet) + 🚨 Krever handling nå + 📅 Kommer snart + 🎯 Prioriterte
biler, nøyaktig Regel 4 sin liste. En tidligere skissert "Analyse-fane" på
Dashboard (fra wireframe-runden) ble IKKE bygget — Regel 4/8 avgjorde at
Analyse/Rapporter i stedet ligger som eget, sekundært sidebar-punkt.

## Mobil = Operativ app

**Regel 3 — mobilens forside er IKKE Dashboard i mobilformat.**
`renderDashboard()` forgrener tidlig: `if(currentUiExperience() ===
'mobil') return renderMobilHjem();` — ingen av desktopens kort/data bygges
i det hele tatt for mobil. `renderMobilHjem()` er et rent ikonrutenett (2
kolonner, store trykkflater ≥112px høyde, minimal tekst — Regel 2), ingen
kort, ingen accordioner, ingen Bilparkhelse-statusrad (den vises kun på
desktopens Dashboard, se `render()`).

Åtte ikoner (`MOBIL_HJEM_IKONER`), nøyaktig Regel 3 sin liste:

| Ikon | Handling |
|---|---|
| 🚚 Min bil | `goToMinBil()` — gjeninnfører det tidligere ⭐ Min bil-dashboardkortet (fjernet i 26.2, flagget som tapt funksjonalitet siden): hopper til egen aktive bil om driftskoordinator selv kjører (samme case-insensitive `vehicleAktivSjafor()`-sammenligning som `startBilokt()` bruker), ellers Biloversikt filtrert på `tilgjengelig` (ny filterverdi). **Rører IKKE** den separate sjåfør-URL-modusen (`?sjafor=1`/`kontroll.html`) — bevisst adskilt og låst inngang for dedikerte sjåfør-enheter |
| ✅ Kontroll | `goToRegisterKontroll('')` — samme funksjon som greeting-cardens hurtigknapp allerede brukte |
| 🚨 Registrer avvik | `goToRegisterSak('')` — samme "+ Ny sak"-skjema som Aktive Saker-siden allerede har, forhåndsåpnet |
| 📋 Aktive saker | `goTo('aktivesaker')` |
| 🔧 Service | `goTo('service')` — egen dedikert arbeidsflate, inline gruppert bilvalg (se "Funksjonsbasert navigasjon" under) |
| 🛞 Dekk | `goTo('dekk')` — egen dedikert arbeidsflate, inline gruppert bilvalg (se "Funksjonsbasert navigasjon" under) |
| 🚐 Biloversikt | `goTo('register')` |
| 📅 Planlegging | `goTo('planlegging')` |

**Badge-tall** (`totaltKreverHandlingCount()`, delt med Dashboard sin
desktop-logikk — ingen egen parallell tellelogikk) vises på 📋 Aktive
saker og 📅 Planlegging (sistnevnte via `flatePlanleggingData(30)` sin
totale lengde) — eneste "informasjon" på hjemskjermen, som små røde
tallmerker på ikonene, ikke egne seksjoner.

**Service/Dekk** rutet i en tidligere runde av Prioritet 27 via Bilregister
med forhåndsåpning av seksjon i Kjøretøyprofil (`mobilBilvalgMaal`). Dette
er **erstattet** — se "Funksjonsbasert navigasjon — Service/Dekk egne
arbeidsflater" lenger ned i dette dokumentet for gjeldende løsning
(`screen='service'`/`'dekk'`, ikke lenger via Kjøretøyprofil i det hele
tatt).

## Historikk-hub (Regel 5)

`renderHistorikk()`/`flateHistorikkTidslinje()` — master for Kontroll,
Skader, Verksted, Dekk, Kostnader OG Varsler (sjette type, avklart
eksplisitt). Erstatter disse som primærnavigasjon i BÅDE desktop-sidebar og
mobilens ☰ Meny (`drawerOversikterHtml()` omskrevet). De opprinnelige
`renderKontrolloversikt()`/`renderSkader()`/`renderVerksted()`/
`renderDekkoversikt()`/`renderKostnadsoversikt()`/`renderVarslerOversikt()`-
funksjonene er **UENDRET i koden** (kan nås direkte om nødvendig) — kun
ikke lenger koblet til noen meny.

`flateHistorikkTidslinje(filterType, filterVehicleId)` gjenbruker
`vehicleHistorikkTidslinje()` direkte per bil (loop + merge), ingen
parallell datainnhentingslogikk. Filtrerbar på type (6 kategorier) + bil +
dato (dato-filter kun på desktop, `currentUiExperience() === 'desktop'` —
mindre skjerm, sjeldnere presist datobehov i felt).

## Planlegging (Regel 6)

`renderPlanlegging()`/`flatePlanleggingData()` — hjem for Service, Dekk,
Verksted, Oppfølging OG EU-kontroll (fem kategorier, EU-kontroll lagt til
eksplisitt i denne runden). Flåtebred generalisering av Dashboardets
"📅 Kommer snart" (26.2), uten 5-post-taket. Periodevalg 7/30/90 dager
(styrer kun verksted/oppfølging sitt visningsvindu — service/dekk/EU-
kontroll sin status er alltid live og tidløs i seg selv, jf.
`vehicleServiceStatus()`/`dekkAlderStatus()`/`vehicleEuKontrollStatus()`).
"Kommende dekkskift" er en presisering: appen har INGEN fremtidsdatert
dekkskift-plan — bruker eksisterende `dekkAlderStatus()` (DOT-alder 🟡/🔴)
som "trenger snart"-signal, ikke en kalenderdato.

## EU-kontroll (ny funksjonalitet, samme mønster som Service)

`v.euGodkjentTil` (dato, Airtable `EuGodkjentTil` — se
AIRTABLE_MIGRATION.md), `vehicleEuKontrollStatus()` (60 dagers
varselgrense, `EU_KONTROLL_VARSEL_DAGER`). Redigeres i Bilinformasjon
(samme skjema-mønster som øvrige datofelt). Vises i Kjøretøyprofil sitt
toppanel (se under) og som egen kategori i Planlegging.

## Kjøretøyprofil — ytterligere forenklet (Regel 7)

Toppanelet (`toppseksjonBody`) er nå UTELUKKENDE: Registreringsnummer,
Kilometerstand, Siste service, EU-godkjent til — "Kun dette" (Regel 7,
reaffirmerer og fullfører retningen fra 26.3). ALL annen informasjon
(Bilgruppe, Biltype, Hovedstatus, Kontrollstatus, Aktive saker, Kritiske
saker, Forfalte oppfølginger, Neste handling, Neste oppfølgingsdato, Neste
verkstedtime, Sist oppdatert) ligger nå UTELUKKENDE i "🩺 Operativ status"
— motsatt retning av 26.3 sin dedupliserings-plassering (den fjernet
duplikater FRA Operativ status; nå går all operativ info DIT, ut av
toppanelet), men samme underliggende prinsipp: hvert felt vises kun ett
sted.

## Funksjonsbasert navigasjon — Service/Dekk egne arbeidsflater (Prioritet 27, oppfølging 2)

Mobil skal ikke bruke Kjøretøyprofil som inngang til alle funksjoner —
hver funksjon får sin egen, dedikerte arbeidsflate, nådd direkte
("Trykk funksjon → Velg bil → Utfør"), ikke via Kjøretøyprofil.

✅ Kontroll (`screen='kontroll'`) og 🚨 Registrer avvik
(`screen='aktivesaker'`, "Ny sak"-skjema forhåndsåpnet) var **allerede**
bygget slik — begge har inline, gruppert bilvalg
(`<select>`/`vehicleOptions()`) direkte på selve arbeidsflaten. Ingen
endring var nødvendig for disse to.

🔧 Service og 🛞 Dekk manglet dette — de gikk tidligere via Bilregister →
Kjøretøyprofil (med seksjonen forhåndsåpnet/scrollet til, se forrige
Prioritet 27-runde). Bygget om til samme mønster som Kontroll: nye,
selvstendige skjermer `screen='service'`/`screen='dekk'`
(`renderServiceSkjerm()`/`renderDekkSkjerm()`), hver med egen inline,
gruppert bilvalg-dropdown øverst (`serviceValgtVehicleId`/
`dekkValgtVehicleId`, samme `vehicleOptions()`). `submitService()`/
`submitDekkskifte()` bruker nå disse i stedet for `currentVehicleId`
(som hørte til Kjøretøyprofil-konteksten).

**Kjøretøyprofil er nå ren kjøretøyinformasjon.** Service-panelet og
Dekk-accordionraden er fjernet fra `renderBilkort()` i sin helhet — all
driftsinformasjon (inkl. Service- og Dekk-status) samles i "🩺 Operativ
status", som nå har to statuslenker (🔧 Service, 🛞 Dekk) som åpner de
dedikerte arbeidsflatene direkte med bilen forhåndsvalgt
(`data-goto-service`/`data-goto-dekk`). Samme lenkemønster brukt fra
Planlegging sine Service/Dekk-kolonner (oppdatert til å peke dit i
stedet for til Kjøretøyprofil).

Mobilens 🔧/🛞-ikoner går nå rett til de nye skjermene
(`goTo('service')`/`goTo('dekk')`) — den midlertidige
`mobilBilvalgMaal`-mekanismen fra forrige runde (som rutet via
Bilregister) er fjernet, siden den ikke lenger trengs.

**Bevisst IKKE gjort:** ingen tredje kopi av bilvalg-UI-et — alle tre
funksjonsflater (Kontroll, Service, Dekk) bruker nøyaktig samme
`vehicleOptions()`-genererte, grupperte `<select>` som allerede fantes.
Historikk-hubens lenker (`data-goto-bilkort`) er bevisst UENDRET — der er
formålet å bla gjennom hendelser på tvers av flåten, ikke å utføre en
handling, så Kjøretøyprofil (nå ren info + lenker videre) er fortsatt
riktig mål.

## Biloversikt — gruppert dropdown-visning (Prioritet 27, oppfølging)

Bilregister-siden (`renderRegister()`) viser ikke lenger et flatt galleri
av alle (filtrerte) biler samtidig — biler er nå gruppert etter
`KATEGORI_ORDER` (▼ Bil 1–11 / Lastebil / Montering / Reserve), **lukket
som standard**. Biler i en gruppe vises kun når gruppen åpnes
(`registerGrupperApne`, `toggleRegisterGruppe()`) — samme
dropdown-mønster (`.dash-group-card`/`.group-card-head`/
`.vehicle-group-body`/chevron) som allerede brukes andre grupperte steder
i appen (Rapporter/Analyse) — ingen ny CSS/komponent, ren gjenbruk. Mål:
mindre scrolling, raskere bilvalg, konsistent gruppering på tvers av
appen.

Ett unntak der en gruppe åpnes automatisk (i tillegg til manuelt åpnede):
er kun én kategori synlig pga. `filterKategori`. (Et tidligere unntak for
mobilens Service/Dekk-dyplenke er fjernet sammen med selve mekanismen —
Service/Dekk går ikke lenger via Biloversikt i det hele tatt, se
"Funksjonsbasert navigasjon" over.)

---

# Kjøretøyprofil — restrukturert til 6 seksjoner (Prioritet 26.3)

Godkjent løsning for duplikatstatus og seksjonsantall:

**Duplikatstatus løst — begge panelene beholdt, felt fjernet fra ett.**
"🚐 Kjøretøyprofil" (toppseksjonen, identitet + rask statusoversikt) beholdt
uendret som den ENESTE kilden til Hovedstatus/Kontrollstatus/Aktive saker/
Neste verkstedtime på siden. "🩺 Operativ status" viser nå kun feltene som
er unike for den seksjonen: Kritiske saker, Forfalte oppfølginger, Neste
handling, Neste oppfølgingsdato, samt Ute av drift-kontrollen. Ingen
informasjon er fjernet fra appen — kun fra ett av to steder den sto
duplisert.

**Fire historikk-relaterte accordion-rader slått sammen til én.**
"🕐 Kjøretøyhistorikk", "📈 Historiske nøkkeltall", "Kontrollhistorikk" og
"Skadehistorikk" var fire separate rader med overlappende formål —
`vehicleHistorikkTidslinje()` dekker allerede kontroll/skade/varsellampe/
sak/verksted/dekk/kostnad/statusendring i én filtrerbar tidslinje. Slått
sammen til én "🕐 Historikk"-rad med fire nøstede underseksjoner (samme
sub-accordion-mønster som Skadehistorikk sin aktive/fikset-splitt fra før:
`bilkortHistorikkSubOpen`, `toggleBilkortHistorikkSub()` — direkte
videreføring av `bilkortSkadeSubOpen`-mønsteret): 🕐 Tidslinje,
📈 Nøkkeltall, Kontroller, Skader. **Ingen av de fire underliggende
visningene (`historikkTidslinjeBody`/`historiskeNokkeltallBody`/
`kontrollBody`/`skadeBody`) er endret eller forenklet** — samme detaljnivå,
samme kort, samme filter, kun samlet ett nivå dypere under én rad i stedet
for fire rader ved siden av hverandre.

**Endelig struktur (6 seksjoner, ekskl. identitetsheader og Faresone som
ikke telles som operativt innhold):**
1. 🩺 Operativ status (deduplisert)
2. 🔧 Service
3. 🗂️ Aktive saker
4. 🕐 Historikk (Tidslinje/Nøkkeltall/Kontroller/Skader samlet)
5. Bilinformasjon
6. 🛞 Dekk (allerede samlet fra tidligere)

---



Alle undersider (åpnet fra en annen side) skal ha en tilbakeknapp øverst til
venstre, med fast tekst "← Tilbake" (ikon + tekst, aldri kun ikon), samme
stil overalt (`.backrow` / `.backbtn`, min. 44px trykkflate).

Navigasjon skjer alltid via den sentrale `goTo(screen, vehicleId)`-
funksjonen, aldri ved å sette `screen`-variabelen direkte. `goTo()` legger
automatisk gjeldende side på en navigasjonshistorikk (`screenHistory`), og
"← Tilbake" kaller `goBack()`, som går til stedet brukeren faktisk kom fra —
ikke en fast side. Sveip høyre (utenfor kantsonen — se "Sveipenavigasjon"
under) gjør det samme. Ved ny funksjonalitet som åpner en side fra flere
steder i appen (slik Kjøretøyprofil gjør), er dette automatisk riktig så
lenge navigasjonen går via `goTo()` — ingen spesialtilpasning trengs per
kallsted.

Unntak (skal IKKE bruke `goBack()`, men gå til en fast side): etter vellykket
innlogging, og etter sletting av et kjøretøy (der "tilbake" ville pekt på en
side for en bil som ikke lenger finnes).

Alle undersider skal ha `← Tilbake` (`.backrow`/`.backbtn`) — dette gjelder
også Bilregister (`register`) og Innstillinger, som tidligere manglet den
(Optimalisering 7). Begge kaller `goBack('dashboard')`, samme mønster som
øvrige skjermer.

---

# Sveipenavigasjon (mobil) — Optimalisering 7

To uavhengige sveipegester, skilt på HVOR sveipen starter (ikke bare
retning), slik at de aldri overstyrer hverandre:

1. **Sveip høyre fra en smal sone helt ute i venstre skjermkant**
   (`SWIPE_EDGE_SONE`, 24px) **åpner sidemenyen** — samme `openDrawer()`/meny
   som ☰-knappen, ingen egen menylogikk. Fungerer på alle admin-hovedsider
   (Dashboard, Biloversikt, Kontrolloversikt, Verkstedoversikt, Aktive Saker,
   Kjøretøyprofil, Skadeoversikt, Varseloversikt, Dekkoversikt, Bilregister,
   Innstillinger) siden menyknappen finnes likt på alle `ADMIN_SCREENS`.
   Sjåførmodus ("Min Bil") har bevisst ingen sidemeny i det hele tatt (egen,
   minimal skjermflyt uten `☰ Meny`) og er derfor uendret utelatt — det
   finnes ingenting for en sveipegest å åpne der.
2. **Sveip høyre som IKKE starter i kantsonen** beholder den opprinnelige
   "sveip høyre = tilbake"-oppførselen på oversiktssider
   (`OVERSIKT_SWIPE_BACK_SCREENS`, nå inkl. `register`/`innstillinger`) —
   samme logikk som `← Tilbake`-knappen, helt uendret fra før
   Optimalisering 7.
3. **Sveip venstre** lukker sidemenyen når den er åpen (og åpner den, som
   før, når den er lukket) — samme `toggleHeaderMenu()` som tidligere, ingen
   endring.
4. **Trykk utenfor menyen** lukker den — fantes allerede via
   `#drawer-overlay`-klikk, uendret.

Kantsonen er bevisst smal (presisjon fremfor aggressiv deteksjon), og samme
terskelverdi (`SWIPE_TERSKEL`) og vertikal-bevegelse-ignoreres-logikk som før
gjelder likt for begge sveipegestene, slik at normal scrolling aldri
feiltolkes som sveip.

---

# Sidemeny — Oversiktmeny

Sidemenyen (`renderDrawer()`) er gruppert slik (topp til bunn): Dashboard,
Aktive Saker, Rapporter, Analyse, **Oversikter ▼** (undermeny), deretter
Innstillinger under en egen "Administrasjon"-overskrift. Ren
navigasjonsomorganisering — ingen side er fjernet, ingen `screen`-rute er
endret, kun hvor menyvalget vises.

**Oversikter ▼** (`drawerOversikterHtml()`) samler syv sider som tidligere
lå flatt i menyen: Biloversikt, Kontrolloversikt, Verkstedoversikt,
Skadeoversikt, Varseloversikt, Dekkoversikt, Kostnadsoversikt
(`OVERSIKT_SCREENS`). "Biloversikt" ruter til den eksisterende
Bilregister-siden (`register`) — appen har ingen egen, separat
"Biloversikt"-side å peke til. Undermenyen utvides automatisk når man
allerede står på en av disse sidene (`OVERSIKT_SCREENS.includes(screen)`),
slik at aktiv side alltid er synlig uten et ekstra trykk; ellers styres den
av `drawerOversikterOpen` og et enkelt ▼/▲-symbol. `drawerItemHtml()` er
uendret og gjenbrukt for undermenyvalgene (kun en `sub`-parameter lagt til
for innrykk) — aktiv-markering (`.active`, prikk) fungerer identisk som før.

Alle `goTo()`-ruter, hurtigknapper, direktelenker og
`goBack()`/navigasjonshistorikk er upåvirket — kun selve menyens
presentasjon (`renderDrawer()`) er endret.

---

# Kontrollsletting — full cleanup uten spøkelsesdata

Sletting av en sjåførkontroll går ALDRI via `window.confirm()` — den åpner
alltid smart-slettedialogen (`openKontrollSlettDialog()` /
`#kontroll-slett-modal`), som analyserer hva kontrollen har opprettet
(`analyserKontrollPavirkning()`) og lar administrator velge mellom to modus i
`performKontrollDeletion(toDelete, opts)`:

- **Kun slett kontroll** (`fullCleanup:false`): fjerner kun kontrollposten,
  bildene og logger én historikkhendelse. Aktive saker, varsellamper, skader
  og all annen historikk står fullstendig urørt — kun ev. stale
  `createdByControlId`-referanser på det som beholdes nulles ut. Utvidet i
  Optimalisering 13 til å rydde denne referansen på ALLE tre datatyper
  (saker, skader, varsellamper) — dekket tidligere kun saker.
- **Full cleanup** (`fullCleanup:true`): fjerner i tillegg skader/varsellamper
  som utelukkende stammer fra kontrollen (samme "uendret siden opprettelse"-
  sjekk som før), og aktive saker som utelukkende stammer derfra — men KUN
  dersom saken ikke er "viderebehandlet" (`sakHarBlittViderebehandlet()`).
  Er den viderebehandlet, kreves eksplisitt avkrysset bekreftelse før den
  kan fjernes automatisk. Data som IKKE slettes (fordi den fortsatt er
  uendret/støttet av gjenværende kontroller, eller allerede kvittert) får nå
  også sin `createdByControlId`-referanse nullet (Optimalisering 13) — samme
  "ingen foreldreløse referanser"-prinsipp som saker alltid har hatt.

**`sakHarBlittViderebehandlet()` — utvidet i Optimalisering 13** til å også
fange opp aktivitet som ikke nødvendigvis flytter noen av sakens egne
toppnivåfelt: (1) en frittstående kommentar
(`submitSakWizardKommentar()` — la kun til en historikk-oppføring, rørte
ingen av de andre feltene sjekken så på), og (2) for flerpunkts saker
(Prioritet 12) — ett enkelt avvik markert utført (`markerAvvikUtfort()`)
eller rapportert på nytt, selv om saken som helhet fortsatt står som "Ny".
Historikk-sjekken sammenligner mot `sakAvvikListe(sak).length` (ikke en
fast `1`), siden en fersk flerpunkts kontroll-sak alltid starter med
nøyaktig én historikkoppføring PER avvik den samler — det alene er ikke et
tegn på viderebehandling. Beskyttelsen er bevisst helt-eller-ingenting per
sak (ikke per avvik): er ETT avvik i en flerpunkts sak viderebehandlet,
beskyttes HELE saken — enklere og tryggere enn å forsøke delvis sletting av
enkeltavvik inni en sak som deles med uberørte avvik.

**Slettedialogen** viser nå en mer detaljert oppsummering
(Optimalisering 13): varsellamper og kontrollavvik som egne linjer (i
stedet for kun ett samlet "aktive saker"-tall), pluss skader — varsellamper
telles fra selve `WarningLights`-tabellen (`paavirkedeVarsler`, den
faktiske kilden til sannhet for om lampen fortsatt lyser), kontrollavvik
telles på avvik-nivå på tvers av alle berørte saker
(`sakAvvikListe(s)`-summen, `avvikKontroll` i `analyserKontrollPavirkning()`
sitt returobjekt) — fungerer likt for både eldre enkeltavvik-saker og nye
flerpunkts kontroll-saker.

Kilometerstand rekalkuleres alltid fra gjenværende kontroller uansett modus
(rent avledet tall, ikke en "sak"). Én historikkhendelse ("Kontroll slettet
av administrator", med ev. årsak) logges alltid til bilens `statusHistorikk`
(samme felt som "ute av drift"-logg fra Fase 7) FØR kontrollen fjernes, slik
at den overlever i Kjøretøyhistorikk selv om kontrollen selv er borte.

Bilstatus/Dashboard/Bilparkhelse/Krever handling nå trenger ingen egen
oppdateringslogikk ved sletting — alt beregnes fortsatt live fra
`kontroller`/`aktiveSaker`/`varsellys` ved hvert `render()`-kall (samme
prinsipp som resten av appen), og `render()` kalles allerede etter
`performKontrollDeletion()` fullfører.

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

# Dashboard/Biloversikt-hurtigtilgang til aktiv bil — Optimalisering 8

Videreutvikler Aktiv Biløkt / Min Bil over — ingen ny biløkt-modell, ingen
nye Airtable-felt, alt beregnes live fra det samme `v.aktivSjafor`/
`vehicleAktivSjafor()` som allerede er fasit.

**"⭐ Min bil" på Dashboard** (`minBilVehicle` i `renderDashboard()`): vises
kun dersom den innloggede administratorens visningsnavn (`loggedInRole`,
samme navn som i velkomsthilsen) er identisk — case-insensitivt, samme
sammenligning som `startBilokt()` allerede bruker ved bilbytte — med aktiv
sjåfør på en bil. Dekker tilfellet der driftskoordinator også kjører selv.
Plassert rett under Hovedstatus (før Morgenvisning), i tråd med "ingen
dobbeltinformasjon"-prinsippet: skjules helt når ingen match finnes, tar
ingen plass. "Åpne Min Bil"-knappen ruter til Kjøretøyprofil (`bilkort`,
`data-goto-bilkort` — gjenbrukt uendret), IKKE til sjåførens driverMode
Min Bil-skjerm, siden administrasjonssiden og sjåførflyten er bevisst
adskilte systemer (se over) og det ikke er en ny registreringsflyt å bygge
en bro mellom dem.

**"Biler i drift nå" utvidet** med en liste (topp 5 + "+N til"-lenke, samme
mønster som "Krever handling nå") over hvilken bil/sjåfør-par som er aktive
akkurat nå, i tillegg til de eksisterende aggregerte tallene. Hver rad
(`data-goto-bilkort`) åpner Kjøretøyprofil direkte.

**"Bilgrupper"-hurtigkort** på Dashboard: ett kort per kategori
(`KATEGORI_ORDER`) med antall biler/aktive/tilgjengelige for gruppen, trykk
åpner Bilregister forhåndsfiltrert på kategorien
(`goToRegisterKategori()`, samme filterfelt `filterKategori` som det
manuelle kategorifilteret på Bilregister fra før — ingen ny filtermodell).

**Aktiv sjåfør på Bilregister (`galleryCard`)**: bilkortene på selve
Biloversikt-siden (`Oversikter ▼ → Biloversikt`) viste tidligere ikke
aktiv sjåfør i det hele tatt — kun Dashboardets Biloversikt-akkordion og
Kjøretøyprofil gjorde det. Lagt til som en ekstra linje
(`👤 Aktiv sjåfør: X` / `⚪ Tilgjengelig`), samme `vehicleAktivSjafor()`.

**Ingen manuell oppdatering nødvendig**: siden alt (`minBilVehicle`,
`aktiveBilerListe`, `kategoriHurtigkort`, `galleryCard`-badgen) beregnes på
nytt fra `vehicles`-arrayet ved hvert `render()`-kall, og `startBilokt()`/
`avsluttBilokt()` begge kaller `saveVehicles()` (som trigger appens vanlige
live-oppdatering), oppdateres alle disse visningene automatisk ved
bilbytte/utsjekking — akkurat som "Biler i drift nå"-tellingen alltid har
gjort. Ingen egen synk-mekanisme lagt til.

---

# Saksbehandling Wizard

Erstatter det tidligere flate ett-skjema-redigeringsvinduet i `sakCard()` med
en 4-stegs arbeidsflyt i **samme boks** (`sakWizardHtml()`), ikke en ny side
eller modal. `editingSakId` styrer fortsatt HVILKEN sak som er åpen (uendret
bruk fra alle eksisterende innganger — Dashboard, Morgenvisning,
Kjøretøyprofil, `goToSakDetalj()`); `sakWizardStep` (1–4, eller `'lese'` for
lukkede saker) styrer HVILKET steg som vises. Samme tilstandsmønster som
Aktiv Biløkt sin `driverScreen`-flyt — bevisst gjenbrukt, ikke funnet opp på
nytt.

**Steg:** (1) Saksinformasjon — ren visning, ingenting lagres. (2) Vurder
sak — prioritet og status, adskilt (se under). (3) Fortsett saken — tre
inline hurtighandlinger: Registrer verkstedtime, Legg til oppfølging, Legg
til kommentar. (4) Fullfør saken — resultat/utført dato/sluttkommentar,
kostnad+avsetting kun vist når `s.linkedVtId` finnes.

**Alltid Steg 1 ved åpning, deretter fri navigasjon.** `sakWizardStartSteg(s)`
returnerer alltid `1` (uansett status) — eneste unntak er `lukket`, som
fortsatt går til egen lesemodus. Driftskoordinator ser dermed alltid
problemstillingen først, og velger selv "Vurder sak" eller "Fortsett saken"
derfra. Steg 2/3/4 har hver sin egen, formålsrettede "← Tilbake"/"Neste →"-
knapp i bunnen av stegets innhold (uendret) — det finnes ingen global
steg-hopping-mekanisme lenger (se fremdriftsindikator under). En lukket sak
kan gjenåpnes (`reapneSak()`, setter status `vurderes`) — eneste vei ut av
lesemodus.

**Status og prioritet lagres og valideres fortsatt strengt adskilt.**
Velges status "Lukket" i steg 2, skjer INGEN lukking der — det sender kun
brukeren til steg 4, hvor den eksisterende lukkekravet (resultat +
sluttkommentar + faktisk utført dato, håndhevet i
`submitSakWizardFullfor(id, lukkSaken)`) fortsatt gjelder uendret. "Lagre
uten å lukke" i steg 4 setter status `utfort`; kun eksplisitt "Lukk saken"
setter `lukket` + `resolvedAt`/`resolvedBy`. Saken slettes aldri ved
lukking.

**Gjenbruk, ikke duplisering.** Steg 3 sitt "Registrer verkstedtime"-skjema
bruker BEVISST samme element-id-er (`vt-vehicle`, `vt-verksted`, `vt-dato`
osv.) som det frittstående skjemaet på Verkstedoversikt, og lagres av den
helt uendrede `submitAddVT()` — kun bundet på nytt i
`attachAktiveSakerListeners()`. "Legg til oppfølging"/"Legg til kommentar"
skriver til nøyaktig de samme feltene (`nextAction`, `followUpDate`,
`historikk`) som før, bare fordelt på egne, mindre lagringsfunksjoner i
stedet for ett stort skjema — reduserer tidsvinduet der en samtidig endring
fra en annen enhet kan bli overskrevet av `saveAktiveSaker()` sin "helt
array"-lagring.

**Ingen eksplisitt integrasjon nødvendig.** Dashboard, "Krever handling nå",
Bilstatus 2.0 (`vehicleHovedstatus`), Bilparkhelse og Kjøretøyhistorikk
(`vehicleHistorikkTidslinje`) leser alle `aktiveSaker` direkte og live ved
hvert render — wizarden trenger aldri "varsle" noen av dem eksplisitt.

**Kilde til saken** (steg 1) beregnes av `sakKildeLabel(s)` som en tilnærmet
heuristikk over eksisterende felt (`sourceType`, `createdByControlId`,
`caseType`) — presis nok til de fleste tilfeller, men kan i dag IKKE skille
Aktiv Biløkt fra admin sin manuelle skaderegistrering (begge gir
`sourceType:'auto'`, `createdByControlId:null`). Et eget `Kilde`-felt ble
vurdert og bevisst utelatt (ikke nødvendig for lansering) — se den
strategiske foranalysen for wizarden ved behov for presis kildesporing
senere.

**Dobbeltlagringsvern:** `sakWizardSaving` låser alle lagre-/lukk-knapper
mens en lagring pågår — fantes ikke i det tidligere ett-skjema-vinduet, lagt
til som en liten, isolert utvidelse.

---

# Steg 1 — Saksinformasjon (Optimalisering 9)

Mål: driftskoordinator skal forstå problemet og kunne ta en beslutning på
2–3 sekunder, uten scrolling på mobil. Ren visningsomlegging av
`sakWizardSteg1Html(s)` — ingen nye felt, ingen ny forretningslogikk.

**Rekkefølge (topp til bunn):** bil (`Bil 5 – LS97571`, alltid øverst) →
komprimert, PROBLEM-spesifikk overskrift → status/prioritet → kort
beskrivelse → ev. andre aktive varsellamper på samme bil → handlingsknapper
(Vurder sak / Fortsett saken). Metadata skjult bak `▼ Mer informasjon`
(lukket som standard).

**Eksakt problem, ikke generisk automattekst** (`sakProblemLabel(s)`): den
gamle, generiske tittelen ("Varsellampe registrert"/"Kontrollavvik
registrert") erstattes av selve lampen/avviket, hentet fra `s.sourceId` mot
de samme `VARSELLAMPE_LABEL`/`KONTROLLAVVIK_LABEL`-oppslagene
kontrollskjemaet og Min Bil allerede bruker ved registrering — samme nøkkel,
ingen ny relasjon. For "Annet"-lamper hentes fritekst fra første
historikkoppføring (der den allerede lagres, se `submitKontroll`). Sakstyper
uten en slik nøkkel (skade, service, manuelt opprettede saker) viser sakens
egen tittel uendret — den er allerede brukerskrevet og spesifikk.
`sakProblemLabelErKortform(s)` avgjør om overskriften vises med STORE
BOKSTAVER (kun kjente korte konstant-etiketter) eller normal tekstform (fri
tekst leser tyngre i store bokstaver).

**Kort, spesifikk beskrivelse** (`sakKortBeskrivelse(s)`): for
automatgenererte saker (`sourceType:'auto'`) erstattes boilerplate-teksten
("Automatisk generert fra kontrollregistrering.") med
`{problemLabel} — {kilde}.` (gjenbruker `sakKildeLabel()` uendret).
Brukerskrevne beskrivelser (manuelle saker/skader) vises uendret — de er
ikke boilerplate og skal ikke omskrives.

**Prioritet vises som "Ikke vurdert" når status er `ny`** — ikke fordi
saken mangler en prioritetsverdi (den har alltid én, satt av systemet ved
opprettelse), men fordi ingen administrator faktisk har tatt stilling til
den ennå; det skjer først i Steg 2 ("Vurder sak"). Så snart status har
beveget seg forbi `ny`, vises den faktiske prioritetsverdien.

**Andre aktive varsellamper på samme bil** (`sakAndreAktiveVarsler(s)`):
kun for `caseType:'varsellampe'`, og kun vist når bilen har 2+ aktive
lamper. Gjenbruker `activeVarsellysForVehicle()` uendret (samme funksjon
som Dashboard/Biloversikt/Kjøretøyprofil) — ingen ny datakilde. Sikrer at
driftskoordinator ser hele bildet på bilen uten å måtte åpne flere saker
separat, i tråd med sjekklistens "ikke skjul hvilke lamper som faktisk er
registrert".

**"▼ Mer informasjon"** (`sakWizardSteg1MerOpen`, lukket som standard,
samme "ett om gangen, nullstilt ved sakbytte"-mønster som
`sakWizardVtOpen`/`sakWizardOppfolgingOpen`/`sakWizardKommentarOpen`):
samler saksnummer, registrert av, registrert dato, kilde, sist oppdatert og
full historikk (samme `<ul class="dmg-simple-list">`-oppsett som Steg 3) —
alt som tidligere sto synlig i Steg 1 uansett behov, nå tilgjengelig ved
behov i stedet for alltid.

---

# Wizard UX Cleanup

Andre opprydningsrunde på Saksbehandling Wizard, bygget videre på "Steg 1 —
Saksinformasjon" over. Mål: mest mulig beslutningsinformasjon, minst mulig
administrativ informasjon, mindre scrolling. Ren visnings-/navigasjons-
omlegging — ingen nye felt.

**dmg-top blir slank når saken er åpen.** `sakCard(s, showVehicle)` viser nå
to helt forskjellige header-varianter avhengig av `isEditing`: kollapset
(listevisning, uendret) viser fortsatt full tittel/beskrivelse/metadata
(`caseId`, type, registrert av/dato, rapportantall, "Åpen i X dager", "Sist
oppdatert") og alle tre badges (prioritet/status/oppfølging) — nødvendig for
rask skumlesing av mange saker i listen. Åpen (wizard synlig under) viser
KUN én slank linje: ikon + evt. bil + `sakProblemLabel(s)` (samme
problem-spesifikke etikett som Steg 1 bruker — IKKE sakens generiske
`s.title`). All metadata og alle badges er fjernet herfra når saken er
åpen, fordi Steg 1 allerede viser status/prioritet/problem rett under på en
ryddigere måte — å vise det to ganger var nettopp klumpete duplisering.
Den slanke linjen beholder `data-toggle-edit-sak`-klikkflaten for å lukke
saken igjen.

**Fremdriftsindikator flyttet til bunnen, redusert til ren prikkerad**
(`sakWizardProgressHtml`): `(2/4) ✅✅•• Vurder sak`-teksten og de fire store
"1 2 3 4"-stegknappene (klikkbare, kunne hoppe fritt) er fjernet. Erstattet
av en enkel, IKKE-klikkbar rad `✅ ✅ • •` nederst i wizard-boksen (etter
stegets eget innhold, før "Slett saken") — ingen sidetall, ingen tekst.
✅-emojien er grønn i seg selv, ingen egen fargelogikk nødvendig. Fri
step-hopping er bevisst fjernet: hvert steg har fortsatt sin egen,
formålsrettede "← Tilbake"/"Neste →"-knapp i bunnen av stegets eget
innhold (uendret på steg 2/3/4; steg 1 sine to handlingsknapper — "Vurder
sak"/"Fortsett saken" — fyller samme rolle for det steget).

**Alltid Steg 1 ved åpning** (se `sakWizardStartSteg(s)` over) — tidligere
hoppet wizarden rett til steg 2/3/4 basert på status, slik at
problembeskrivelsen i Steg 1 i praksis aldri ble sett ved gjenåpning av en
sak som allerede var under behandling.

**Statuschips overflyter ikke lenger på mobil** (`.dmg-top`/`.dmg-badges` i
mobil-medieforespørselen `@media (max-width:640px)`): manglet tidligere
`flex-wrap`, slik at tre brede chips (prioritet/status/oppfølging — f.eks.
"⚪ Ingen oppfølgingsdato") kunne presse `.dmg-badges` bredere enn kortet og
flyte utenfor høyre kant på smale skjermer. Samme mønster som den
eksisterende `.vt-top`-fiksen i samme medieforespørsel. Gjelder kun den
kollapsede listevisningen nå (den åpne visningen har ingen badges lenger,
se over).

**Status/Prioritet i Steg 1 tvinges side ved side** (ikke `.ov-grid`, som
faller til én kolonne på smale skjermer) — begge er korte
etikett/verdi-par som uansett har plass til to kolonner selv på de smaleste
mobilskjermene, og stables derfor bevisst IKKE, for å holde Steg 1 så lavt
som mulig.

---

# Aktive Saker UX Cleanup

Tredje opprydningsrunde, denne gangen på selve sakskortet i den KOLLAPSEDE
listevisningen (ikke wizarden — se "Wizard UX Cleanup" over for den åpne
visningen). Samme mål: mest mulig beslutningsinformasjon, minst mulig
administrativ informasjon. Ren visnings-/layoutomlegging — ingen nye felt,
ingen endringer i sakslogikk.

**Saksnummer skjult fra hovedkortet** (`sakCard`): `s.caseId` vises ikke
lenger i den kollapsede kortvisningen. Feltet er uendret i datamodellen og
fortsatt tilgjengelig i Steg 1 sin `▼ Mer informasjon` når saken åpnes — kun
fjernet fra det som vises uten å åpne saken. Det finnes ikke noe eget
fritekstsøk på Aktive Saker i dag (kun nedtrekksfiltre), så "søkbart" her
betyr at feltet fortsatt finnes og er tilgjengelig — ikke at det ble bygget
en ny søkefunksjon.

**Eksakt problem i overskriften** (`sakKortOverskrift(s)`, ny funksjon):
kollapset korttittel bruker nå samme prinsipp som Steg 1
(`sakProblemLabel`) i stedet for den generiske `s.title`. For
varsellampe-saker der bilen har FLERE aktive lamper akkurat nå, gjenbrukes
den samme `sakAndreAktiveVarsler()`-listen fra Steg 1: nøyaktig 2 aktive
lamper → `"Motorlampe + ABS"`, 3 eller flere → `"3 varsellamper
registrert"`. Med kun 1 aktiv lampe (det vanlige tilfellet) vises kun den
ene, som i Steg 1. Effekten: ETHVERT varsellampe-kort for en bil med flere
samtidige varsler gir hele bildet, uten å måtte åpne noen av dem — ingen
kort er slått sammen eller endret i datamodellen, kun overskriftsteksten er
delt mellom kortene som allerede fantes.
`varsellysKortLabel(w)` er selve etikett-oppslaget (VARSELLAMPE_LABEL eller
`annetTekst`), skilt ut som egen liten funksjon og gjenbrukt av både
`sakKortOverskrift()` og Steg 1 sin chip-liste — var tidligere dupliserte
inline-uttrykk begge steder.

**"Registrert {dato}" erstatter tre metadatalinjer.** Kortet viste
tidligere "Registrert av"/"Registrert dato" (i `dmg-meta`) og "Sist
oppdatert" (i en egen `dmg-meta`-linje sammen med "Åpen i X dager") midt i
kortet. Alle tre er fjernet fra hovedkortet. Én liten `Registrert {dato}`-
tekst vises nå øverst til høyre, over prioritet-/status-/
oppfølgingschipsene (samme høyre kolonne som badges alltid har hatt) —
gir rask kontekst uten metadatastøyen. "Registrert av", "Sist oppdatert" og
"Åpen i X dager" finnes fortsatt i Steg 1 sin `▼ Mer informasjon`, uendret
fra forrige runde.

**Bil/regnr vises IKKE på hvert enkelt kort.** Sjekklistens eksempel viser
"Bil 5 – LS97571" på selve kortet, men Aktive Saker grupperer allerede alle
saker under en synlig bil-overskrift (`sakGroupedSection` →
"📍 Bil 5 – LS97571" over hver gruppe) — å gjenta det på hvert kort i
gruppen hadde vært akkurat den typen duplisering resten av denne
opprydningsserien har fjernet. `showVehicle`-parameteren til `sakCard()`
er uendret og brukes fortsatt for det ene unntaket der det er nødvendig:
saker knyttet til et slettet kjøretøy (`foreldrelose`), som ikke vises i
noen bilgruppe.

**"+ Ny sak" flyttet opp til `.backrow`**, på samme rad som `← Tilbake`
(`margin-left:auto` skyver den til høyre) — samme knapp/id (`add-sak-btn`),
kun flyttet i markup. Den gamle, egne verktøylinjen som kun inneholdt
"N saker vist" + knappen er fjernet.

**Tellingene slått sammen** til én linje, `${antall vist} / ${antall
totalt} aktive saker`, alltid i dette formatet (også uten aktivt filter,
f.eks. "18 / 18 aktive saker") — erstatter de to tidligere separate
linjene ("N aktive saker totalt" og "N saker vist").

---

# Prioritet 12 — Sammenslåtte Kontrollavvik

Én sjåførkontroll som rapporterer flere varsellamper/kontrollavvik samtidig
gir nå ÉN aktiv sak for bilen (med alle avvikene som egne elementer i den),
i stedet for én sak per avvik. Bygget videre på eksisterende `AktiveSaker`
— ett nytt felt (`Avvik`, se AIRTABLE_MIGRATION.md), ingen ny tabell, ingen
parallell saksmodell.

**Avgrensning (bekreftet eksplisitt):** kun varsellampe + kontrollavvik
FRA SAMME kontrollinnsending slås sammen. Dette gjelder ALDRI: skader
(egen struktur/flyt, uendret), manuelt opprettede saker
(`+ Ny sak`, uendret), historiske saker (leses via bakoverkompatibel
fallback, aldri migrert), eller hendelser fra Aktiv Biløkt/Min Bil (bruker
fortsatt `registrerAvvikSomSak()` ett avvik om gangen, uendret — se under).
En SENERE, separat kontroll starter alltid sin egen nye sak for genuint nye
avvik; den henter ALDRI inn i en allerede eksisterende sak fra en tidligere
kontroll. Kun et EKSAKT duplikat av et allerede aktivt avvik (uansett hvor
det bor — flerpunkts sak eller eldre enkeltavvik-sak) bumper det
eksisterende i stedet for å opprette noe nytt (`finnAktivSakMedAvvik()`,
brukt av begge opprettelsesveiene).

**Datamodell:** `sak.avvik` (kun satt på nye, flerpunkts kontroll-saker) er
en liste av `{id, caseType, sourceId, label, status: 'aktiv'|'utfort',
prioritet, createdAt, resolvedAt, linkedVtId, reportCount,
lastReportedAt}`. All visningskode leser ALLTID via `sakAvvikListe(s)`, som
returnerer `sak.avvik` når det finnes, og ellers syntetiserer ETT element
fra sakens egne toppnivåfelt (`caseType`/`sourceId`/`status`/`priority`
osv.) — dette er hvordan skade/manuelle/Min Bil-saker OG all eldre data fra
før denne endringen fortsetter å fungere helt uendret, uten noen
bulk-migrering. `sakAvvikAktive()`/`sakAvvikUtforte()` filtrerer denne
listen; `sakAlleAvvikFerdig()` = ingen aktive igjen.

**Opprettelse** (`registrerKontrollAvvikSomSak()`, kalt ÉN gang fra
`submitKontroll()` med alle nye varsellamper+kontrollavvik fra
innsendingen som ett batch-kall): finner et avvik ingen match blant åpne
saker på bilen → legges til i ÉN sak som opprettes for DENNE
kontrollen (kun første nye avvik oppretter saken, resten legges inn i
`avvik[]`). Finnes avviket allerede aktivt et sted → bumper `reportCount`/
historikk der, oppretter ingenting nytt. Sakens `Priority` settes til
`max(gjeldende, ny-avvik-type sin standardprioritet)`
(`SAK_PRIORITET_RANK`) — ALDRI automatisk nedjustert, verken ved
opprettelse eller senere når avvik løses, slik at en administrator sin
manuelle prioritetsjustering (Steg 2) aldri overstyres stille. Skade bruker
fortsatt den uendrede `registrerAvvikSomSak()` (nå med bredere
duplikatsøk via `finnAktivSakMedAvvik()`, som også finner avvik inni en
flerpunkts sak — ikke bare i en sak sine egne toppnivåfelt — slik at Min
Bil/skade-hendelser aldri dupliserer noe en kontroll-sak allerede sporer).

**Visning:** `sakKortOverskrift(s)` (sakskort/gruppelister/Dashboard/
Kjøretøyprofil) generalisert til å bruke `sakAvvikAktive(s)`: ett aktivt
avvik → vis det alene, nøyaktig 2 → "A + B", 3 eller flere → "N avvik
registrert" — fungerer nå likt på tvers av varsellampe+kontrollavvik
blandet, ikke bare varsellamper som før (Optimalisering 11). Steg 1 i
wizarden viser en avvik-sjekkliste (🟠 aktiv / ✅ utført, delt i "Aktive
avvik"/"Utførte avvik" når begge finnes) i stedet for én problemlinje, med
en direkte "Marker utført"-handling per aktivt avvik
(`markerAvvikUtfort()`) — dekker "eksplisitt lukket eller avvist" uten å
kreve verksted for hvert lite avvik. Enkeltavvik-saker (skade, manuell,
Min Bil, eldre data) er visningsmessig HELT uendret.

**Selektiv verkstedkobling (Steg 3):** har saken 2+ aktive avvik, viser
`sakWizardVtFormHtml()` en avkrysningsboks per avvik ("Avvik som tas med
til verksted", alle haket av som standard). `submitAddVT()` setter
`avvikItem.linkedVtId` KUN på de valgte avvikene — resten forblir aktive
og upåvirket. Sakens egen `LinkedVtId` (toppnivå) settes fortsatt alltid,
uendret — den representerer "mest nylige/relevante verkstedtime for
saken", mens `avvik[].linkedVtId` representerer "hvilken verkstedrunde
løser akkurat DETTE avviket". Skjemaet på Verkstedoversikt (uten
sakstilknytning) er helt uendret — ingen avkrysningsbokser der.

**Selektiv fullføring (Steg 4) — kjerneregelen:** når resultat/utført
dato/sluttkommentar lagres, fullføres KUN avvikene som er koblet til
sakens gjeldende `LinkedVtId` (`submitSakWizardFullfor()`). Står ett eller
flere avvik fortsatt aktive: saken hopper ALDRI tilbake til "Vurderes" —
den er jo allerede vurdert og under behandling. I stedet settes den til
den nye statusen **"Delvis utført"** (`delvis-utfort`, lagt til i
`SAK_STATUS_ORDER`/`SAK_STATUS_LABEL`, mellom "Utført - venter
bekreftelse" og "Utført"). "Lukk saken" er blokkert med en tydelig
feilmelding (som lister hvilke avvik som gjenstår) helt til
`sakAlleAvvikFerdig()` er sann — saken kan først lukkes når ALLE avvik er
utført (via verksted ELLER "Marker utført" i Steg 1).
`sakOppdaterStatusEtterAvvik()` er den delte rekalkuleringslogikken
(brukt av både Steg 4 og `markerAvvikUtfort()`): alle avvik utført → status
"Utført" (samme sti som en enkeltavvik-sak alltid har hatt); noen gjenstår
→ "Delvis utført", MEN kun dersom saken allerede har kommet forbi de tidlige
stegene (verksted bestilt eller senere) — en sak fortsatt i "Ny"/"Vurderes"/
"Tiltak planlagt" med ett gjenstående avvik endrer ikke status ved dette,
siden "delvis utført" ikke gir mening før noe faktisk har blitt utført.

**Bevisst IKKE nedjustert:** `Priority` rekalkuleres aldri nedover når det
alvorligste avviket i en sak blir løst (f.eks. Motorlampe (Høy) utført,
kun Slitte dekk (Normal) gjenstår — saken beholder Høy). Dette unngår å
stille overstyre en administrators manuelle prioritetsvurdering; ønsket
nedjustering gjøres fortsatt manuelt via Steg 2, akkurat som før.

**Bilstatus/Dashboard/Bilparkhelse/Krever handling nå/Morgenvisning/Må
gjøres i dag — INGEN endringer nødvendig.** `vehicleHovedstatus()`/
`vehicleSakStatus()`/`sakKreverHandling()` leser allerede utelukkende
sakens EGNE `priority`/`status`-felt (aldri enkeltavvik direkte), og disse
holdes riktige automatisk av opprettelses-/fullføringslogikken over — "det
alvorligste avviket vinner" virker dermed helt av seg selv, uten
spesialtilfelle i noen av statusfunksjonene. `sakKreverHandling()` fikk
kun `delvis-utfort` lagt til i listen over statuser som alltid krever
handling (samme mønster som `ny`/`vurderes`/
`utfort-venter-bekreftelse` fra før).

**Historikk uendret.** `sak.historikk` (observasjonslogg) fortsetter å
logge hvert avvik separat akkurat som før — kun selve OPPFØLGINGEN
(sak-objektet de tilhører) er samlet. Kjøretøyhistorikk-tidslinjen på
Kjøretøyprofil bygger fra kontroller/skader/varsellamper/verkstedtimer
direkte, ikke fra `aktiveSaker`, og er upåvirket.

---

# Optimalisering 14 — Reservebil-logikk

Reservebiler (`v.kategori === 'reserve'`, kategorien fantes fra før —
ingen ny verdi) skal ikke skape unødvendige varsler eller daglig oppfølging
mens de bare står parkert. Ren visnings-/beregningslogikk — ingen nye felt,
ingen ny kjøretøystatus lagret på kjøretøyet, ingen nye registreringsflyter.

**Kjerneprinsipp — helt live-beregnet, akkurat som `isKontrollertIdag()`:**
`vehicleErReserveUnntatt(vehicleId)` returnerer sann kun når (1) kategorien
er `reserve`, (2) bilen IKKE er kontrollert i dag, og (3) bilen IKKE har en
aktiv biløkt akkurat nå. Ingen av disse er et lagret flagg — alt regnes ut
på nytt ved hvert `render()`-kall mot `todayISO()`/det operative dagskillet
(04:00), akkurat som `isKontrollertIdag()`/`vehicleAktivSjafor()` selv
allerede gjør. Det betyr at "dagskille kl. 04:00 → bilen går automatisk
tilbake til reservestatus" ikke krever NOEN egen kode i det hele tatt: i
morgen er `isKontrollertIdag`/`vehicleAktivSjafor` tilbake til usann for
bilen med mindre den faktisk brukes på nytt den dagen, og unntaket gjelder
dermed automatisk igjen.

**Tas i bruk → vanlige regler resten av dagen:** i det øyeblikket bilen får
en kontroll (typisk via Aktiv Biløkt sin "Velg bil"-flyt, men gjelder
uansett kilde) ELLER en biløkt startes, opphører
`vehicleErReserveUnntatt()` å være sann, og ALT nedenfor faller automatisk
tilbake til normal oppførsel — ingen overgangs-spesialkode nødvendig, kun
en konsekvens av at unntaket er en ren beregning basert på disse to
tilstandene.

**`vehicleHovedstatus()` — ny status `'reserve'`** satt inn RETT FØR
`'ikke-kontrollert'`-fallbacken (aldri før `kritisk`/`verksted`/
`oppfolging` — en reservebil med en ekte aktiv sak vises fortsatt normalt
som sådan, uendret; reservebilen "har fortsatt kunne ha aktive
saker/verkstedoppfølging" per spesifikasjonen). `HOVEDSTATUS_ORDER`/
`_IKON`(🚐)/`_LABEL`("Reservebil (ikke i bruk)")/`_BADGE_KLASSE` (nøytral
grå, samme som "unset" — bevisst IKKE gul, siden det ikke er et problem)
utvidet tilsvarende. `vehicleDagensStatus()` (Biloversikt-kortenes "Dagens
status") fikk samme behandling, med en ny nøytral `.dash-chip.reserve`
CSS-klasse i stedet for den urovekkende amber "mangler kontroll"-fargen.

**Konsekvenser (alt kaskaderer fra `vehicleErReserveUnntatt()`/
`vehicleHovedstatus()`, ingen dupliserte sjekker):**
- **Dashboard Hovedstatus:** `manglerKontrollCount` trekker nå også fra
  antall reservebil-unntak, ikke bare kontrollerte biler.
- **Krever handling nå:** "Kontroll mangler i dag"-oppføringene hopper
  over reservebil-unntak.
- **Morgenvisning:** "Mangler kontroll"-listen samme fix.
- **Bilparkhelse:** ny egen `reserve`-bøtte i tellingen (kritisk teknisk
  detalj — `bilparkhelse`-objektet måtte initialiseres med `reserve:0`
  eksplisitt, ellers ville `vehicleHovedstatus()` sin nye returverdi stille
  korrumpert tellingen med `NaN`), vist som eget 🚐-tall i panelet og som
  eget alternativ i Biloversikt-filtreringen (`dashBiloversiktFilter`).
- **Liten sidegevinst-fiks:** Dashboardets `ikke-kontrollert`-filter brukte
  tidligere rå `!isKontrollertIdag()` i stedet for den autoritative
  `vehicleHovedstatus()` — en bil som allerede var flagget
  verksted/kritisk/oppfølging kunne dermed også dukke opp under
  "ikke kontrollert"-filteret. Rettet til å bruke
  `vehicleHovedstatus(v.id) === 'ikke-kontrollert'`, i tråd med "kun én
  hovedstatus per bil"-prinsippet fra Bilstatus 2.0.
- **Bilregister sitt manuelle "Ikke kontrollert i dag"-filter** ekskluderer
  nå også reservebil-unntak, for konsistens med Dashboard-tallet den lenkes
  fra (`data-stat-nav="mangler-kontroll"`) — bilen er fortsatt fullt
  søkbar/synlig via fritekstsøk eller det eksisterende
  kategorifilteret (`Reserve`).
- **Biloversikt/Kjøretøyprofil (`galleryCard`/`accordionRow`/
  `renderBilkort`):** viser "🚐 Reservebil — ikke i bruk i dag" i stedet
  for den vanlige "⚠️ Ikke kontrollert i dag" der bilen faktisk er unntatt,
  slik at brukeren forstår HVORFOR, i stedet for å lure på om noe er
  glemt.

**Bevisst UTENFOR omfang:** sjåførens "Velg bil"-skjerm i Aktiv Biløkt
viser fortsatt ren "✅ Kontrollert"/"⚪ Ikke kontrollert" for alle biler,
reservebiler inkludert — det er ikke et passivt dashboard-varsel, men
informasjon en sjåfør som faktisk skal kjøre bilen trenger nøyaktig (og
kontroll kreves fortsatt idet bilen tas i bruk). Rapporter sin periodebaserte
"Kontrollgrad"-prosent (`rapportKontrollData()`) er også urørt — det er en
historisk analyse over en valgt periode, ikke et daglig driftsvarsel, og lå
uansett utenfor sjekklistens eksplisitt nevnte overflater (Dashboard/
Morgenvisning/Krever handling nå/Bilparkhelse).

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

Saksbehandling Wizard (implementert)
Se "Saksbehandling Wizard" over. 4-stegs arbeidsflyt (Saksinformasjon →
Vurder sak → Fortsett saken → Fullfør saken) i samme boks i Aktive Saker,
erstatter det tidligere flate redigeringsvinduet. Fleksibel steg-navigasjon,
databasert startsteg, status/prioritet fortsatt strengt adskilt, lukking
krever fortsatt resultat+sluttkommentar+utført dato. Gjenbruker eksisterende
skjemaer/funksjoner (`submitAddVT` uendret) — ingen parallell saksflyt,
ingen nye Airtable-felt

Optimalisering 6 (implementert)
Oversiktmeny — se "Sidemeny — Oversiktmeny" over. Biloversikt/
Kontrolloversikt/Verkstedoversikt/Skadeoversikt/Varseloversikt/
Dekkoversikt/Kostnadsoversikt samlet i én "Oversikter ▼"-undermeny i
sidemenyen, kortere hovedmeny (Dashboard/Aktive Saker/Rapporter/Analyse/
Oversikter/Innstillinger). Ren navigasjonsomorganisering — ingen sider,
ruter, hurtigknapper eller tilbakenavigasjon endret

Optimalisering 7 (implementert)
Sveip-navigasjon og mobilflyt — se "Sveipenavigasjon (mobil) —
Optimalisering 7" over. Sveip høyre fra venstre kantsone åpner sidemenyen,
sveip venstre lukker den (eksisterende meny/`goTo()`/`goBack()`-logikk
gjenbrukt uendret) — den opprinnelige "sveip høyre midt på skjermen =
tilbake" beholdes uendret på oversiktssider. `← Tilbake` lagt til på
Bilregister og Innstillinger, som tidligere manglet den. Ren navigasjons-
og mobiloptimalisering — ingen nye sider/moduler/databasefelt

Optimalisering 8 (implementert)
Aktiv Sjåfør Hurtigvalg og Min Bil Hurtigtilgang — se "Dashboard/
Biloversikt-hurtigtilgang til aktiv bil — Optimalisering 8" over.
Videreutvikling av Aktiv Biløkt/Min Bil: "⭐ Min bil"-kort på Dashboard når
innlogget administrators navn matcher aktiv sjåfør på en bil, utvidet
"Biler i drift nå" med bil/sjåfør-liste, nye "Bilgrupper"-hurtigkort
(åpner Bilregister forhåndsfiltrert på kategori), aktiv sjåfør synlig på
Bilregister-siden. Alt beregnes live fra eksisterende `vehicleAktivSjafor()`
— ingen nye Airtable-felt, ingen ny registreringsflyt

Optimalisering 9 (implementert)
Steg 1-sjekkliste (Saksbehandling Wizard) — se "Steg 1 — Saksinformasjon
(Optimalisering 9)" over. Viser eksakt problem (f.eks. "MOTORLAMPE") i
stedet for generisk automattekst, kort spesifikk beskrivelse i stedet for
boilerplate, status/prioritet ("Ikke vurdert" før Steg 2), andre aktive
varsellamper på samme bil, metadata (saksnummer/registrert av/dato/kilde/
historikk) skjult bak "▼ Mer informasjon". Ren visningsomlegging av Steg
1 — ingen nye felt, ingen ny forretningslogikk

Optimalisering 10 (implementert)
Wizard UX Cleanup — se "Wizard UX Cleanup" over. Wizarden åpner alltid på
Steg 1 nå (aldri direkte til Steg 2/3/4). dmg-top redusert til én slank,
klikkbar linje med eksakt problem når saken er åpen (ingen metadata/badges
— Steg 1 dekker det). Fremdriftsindikator flyttet til bunnen og redusert
til en ren, ikke-klikkbar prikkerad (✅/•) — ingen sidetall, ingen store
"1 2 3 4"-stegknapper. Fikset chip-overflow på mobil
(`.dmg-top`/`.dmg-badges` manglet `flex-wrap`). Status/Prioritet i Steg 1
tvinges side ved side for å holde høyden nede. Ren visnings-/
navigasjonsomlegging — ingen nye felt

Optimalisering 11 (implementert)
Aktive Saker UX Cleanup — se "Aktive Saker UX Cleanup" over. Saksnummer
skjult fra det kollapsede sakskortet (fortsatt i Steg 1 sin "Mer
informasjon"). Korttittel viser nå eksakt problem
(`sakKortOverskrift()`) — "Motorlampe + ABS" ved nøyaktig 2 samtidig
aktive lamper på bilen, "N varsellamper registrert" ved 3+. "Registrert
{dato}" som liten tekst øverst til høyre erstatter tre metadatalinjer
midt i kortet. "+ Ny sak" flyttet opp til samme rad som "← Tilbake".
Tellingene ("N aktive saker totalt" / "N saker vist") slått sammen til
én linje ("N / M aktive saker"). Ren visnings-/layoutomlegging — ingen
nye felt, ingen endringer i sakslogikk

Prioritet 12 (implementert)
Sammenslåtte Kontrollavvik — se "Prioritet 12 — Sammenslåtte
Kontrollavvik" over. Én sjåførkontroll med flere varsellamper/
kontrollavvik samtidig gir nå ÉN aktiv sak med alle avvikene som egne
elementer, i stedet for én sak per avvik. Avgrensning: kun avvik fra
SAMME kontroll slås sammen — skade, manuelle saker, historiske saker og
Aktiv Biløkt/Min Bil-hendelser er uendret. Ny status "Delvis utført" —
saken hopper aldri tilbake til "Vurderes" når noen avvik er utført mens
andre gjenstår. Selektiv verkstedkobling (Steg 3) og selektiv
fullføring (Steg 4), direkte "Marker utført" per avvik i Steg 1. Ett
nytt felt: `Avvik` (JSON) på AktiveSaker (se AIRTABLE_MIGRATION.md) —
ingen ny tabell, full bakoverkompatibilitet med all eksisterende data
uten migrering. Bilstatus/Dashboard/Bilparkhelse fungerer uendret siden
de kun leser sakens egne prioritet/status-felt

Optimalisering 13 (implementert)
Full Cleanup ved Sletting av Kontroll — se "Kontrollsletting — full
cleanup uten spøkelsesdata" over (oppdatert). Rettet en reell
korrekthetsbrist etter Prioritet 12: `sakHarBlittViderebehandlet()` så
ikke aktivitet på enkeltavvik-nivå (markert utført, rapportert på nytt)
eller frittstående kommentarer — kunne tidligere latt Full Cleanup
fjerne en sak der reelt arbeid var gjort. Referanseopprydding
(`createdByControlId`-nulling) utvidet fra kun saker til også skader og
varsellamper i begge slettemodus. Slettedialogen viser nå varsellamper/
kontrollavvik/skader som egne linjer i stedet for ett samlet tall. Ingen
nye felt — ren logikkretting og visningsutvidelse

Optimalisering 14 (implementert)
Reservebil-logikk — se "Optimalisering 14 — Reservebil-logikk" over.
Reservebiler (eksisterende `kategori: 'reserve'`) er nå unntatt det
daglige kontrollkravet — og alt avledet av det (Mangler kontroll,
Morgenvisning, Krever handling nå, Bilparkhelse) — helt live-beregnet, så
lenge de faktisk ikke er tatt i bruk (kontrollert eller aktiv biløkt) i
dag. Ny `vehicleHovedstatus()`-verdi `'reserve'` (🚐), egen bøtte i
Bilparkhelse. Tas bilen i bruk gjelder vanlige regler automatisk resten
av dagen; ved neste dagskille (04:00) gjelder unntaket automatisk igjen
— ingen egen "gå tilbake"-jobb, kun en konsekvens av at alt beregnes live
mot samme dagskille som `isKontrollertIdag()` allerede bruker. Ingen nye
felt, ingen ny registreringsflyt

Optimalisering 15 (implementert)
Dashboard Cleanup v2 — se "Dashboard Pro — struktur og prinsipp om ingen
dobbeltinformasjon" over (oppdatert). "Bilparkhelse Status" og "Biler i
drift nå" flyttet opp i det delte toppfeltet (kun på Dashboard-skjermen).
Bilgrupper- og Hurtighandlinger-panelene fjernet (samme funksjoner nås
allerede via ☰ Meny/toppfeltet/Min Bil). "Krever handling nå" er ikke
lenger rødt bare fordi biler mangler kontroll — kun ekte kritiske
forhold/ute av drift utløser rødt nå, resten gir amber. "Må gjøres i
dag" bygget om fra én flat liste til tre uavhengig kollapsbare
kategorier (Kritiske saker/Oppfølging i dag/Mangler kontroll), samtidig
som to nå-redundante lister (separat "Mangler kontroll" og "Kritiske
forhold") ble fjernet. "Mangler kontroll"-listen i Morgenvisning sortert
med samme kanoniske Bilgruppe→Bilnummer-rekkefølge som resten av appen.
Ingen nye felt, ingen nye moduler

Prioritet 16 (implementert)
Morgenvisning Compact — se "Morgenvisning" (punkt 4 i Dashboard Pro-
strukturen) over. "Dagens situasjon" (fem separate bokser) erstattet av
kompakte to-verdiers rader ("✅ 14 Klare | ⚪ 2 Mangler"), som halverer
den vertikale plassen. "Må gjøres i dag" (Optimalisering 15) erstattet
av fire uavhengig kollapsbare, formålsbygde seksjoner: Mangler kontroll
(gruppert etter bilgruppe), Oppfølging i dag (antall oppfølgingspunkter
per bil i parentes, utledet — ingen nye felt), Verksted i dag (sortert
kronologisk, eneste bevisste unntak fra bil-sorteringsregelen), og
Kritiske forhold (skjules helt når tom). Alt kollapset som standard for
minst mulig scrolling. Dashboard-rekkefølgen (Header → Hovedstatus →
Morgenvisning → Krever handling nå) var allerede riktig fra
Optimalisering 15 og krevde ingen endring. Ingen nye felt, ingen nye
moduler

Prioritet 17 (implementert)
Operativ Dashboard Compact — se "Operativ Dashboard Compact (Prioritet
17)" over. Hovedstatus- og Morgenvisning-kortene (som dekket mye av den
samme informasjonen) slått sammen til ett kort, "🚦 Operativ Status".
"Oppfølging i dag"- og "Kritiske forhold"-listene (Prioritet 16) fjernet
— erstattet av direkte navigasjon til Aktive Saker med relevant filter
forhåndssatt (`goToAktiveSakerFiltered()`, gjenbruker eksisterende
filterfelt). Verksted i dag flyttet foran Mangler kontroll. "Biler i
drift nå" er nå del av samme rad som Bilparkhelse Status i toppfeltet
(samme høydenivå) i stedet for en egen linje ved siden av ☰ Meny.
Bilparkhelse Status-raden sentrert på desktop, forblir venstrejustert
(stablet) på mobil. ☰ Meny bevisst IKKE flyttet — sitter fast på samme
sted på alle skjermer for pålitelig gjenfinnbarhet. Bevisst IKKE
implementert: en full ombygging av Aktive Saker sin interne sortering
til en flat kritisk→oppfølging→alder-rekkefølge, siden siden er bygget
som en bilgruppe-akkordion — forhåndssatte filtre gir samme praktiske
nytte uten den arkitekturrisikoen. Ingen nye felt, ingen nye moduler

Prioritet 26.2 (implementert) — Dashboard Nullstilling
Full redesign, ikke optimalisering — se "Dashboard — struktur (Prioritet
26.2)" og "Bilregister — hovedstatusfilter" over, som erstatter de
tidligere "Dashboard Pro"/"Operativ Dashboard Compact"-kapitlene i sin
helhet. Dashboard redusert fra 7 seksjoner (Operativ Status, Min bil,
Krever handling nå, Kommende verkstedtimer, Biler i drift nå, Biloversikt-
akkordion) til 3: 🚨 Krever handling nå (nå med Prioritet + Neste handling
per rad, egen "Se alle"-knapp), 📅 Kommer snart (kommende verkstedtimer +
oppfølging innen 3 dager, slått sammen), 🎯 Prioriterte biler (ny — samme
`dashKreverListe` gruppert per bil). Toppfeltet uendret i utseende, men
Bilparkhelse-chipsene ruter nå til Bilregister (nytt `filterHovedstatus`-
filter + `goToRegisterHovedstatus()`) i stedet for en inline
Dashboard-akkordion, siden akkordionen er fjernet. Viktig avvik oppdaget
og dokumentert underveis: spesifikasjonen forutsatte at Prioritet 18–24
(serviceintervall, tiered kontrollstatus, "Operativ Belastning") allerede
fantes i koden — det gjorde de ikke, verken i denne filen eller i
index.html, og er derfor bevisst IKKE bygget som del av denne oppgaven.
**⭐ Min bil-kortet er fjernet uten erstatning** (reell funksjonalitet
tapt, per eksplisitt "Det er alt"-instruks) — vurder gjeninnføring som
fremhevet rad i Prioriterte biler om behovet viser seg i praksis. Ingen
nye Airtable-felt, ingen ny forretningslogikk — kun gjenbruk/omgruppering
av `dashKreverListe`, `sakOppfolgingStatus()`, `vtWithinWeek()`,
`vehicleHovedstatus()`

---

# Viktigste prinsipp

Denne appen bygges for å eliminere behovet for hukommelse.

Hvis brukeren må huske noe selv:

Da mangler appen funksjonalitet.
