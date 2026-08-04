# 🚚 Bilpark

Flåtestyring for kjøretøyparken: sjåførkontroller, bilregister, verkstedtimer,
skadehistorikk, varsellamper og et enkelt dashboard — som en installerbar PWA
(Progressive Web App).

## ⚠️ Krever oppsett av din egen Airtable-base

Appen lagrer nå data sentralt i **Airtable** i stedet for lokalt i
nettleseren, slik at data en sjåfør sender inn fra mobil er synlig for
administrator på PC (med inntil ca. 20 sekunders forsinkelse — se punkt 5 i
migreringsdokumentet). **Se
[AIRTABLE_MIGRATION.md](./AIRTABLE_MIGRATION.md) for full arkitekturoversikt,
tabelloppsett og steg-for-steg oppsett** — appen fungerer ikke før
`airtable-config.js` er fylt ut med din egen base-ID og API-token. Dette
dokumentet inneholder også et viktig sikkerhetsforbehold dere bør lese før
appen tas i bruk. Resten av denne filen forutsetter at oppsettet er gjort.

## 1. Hva appen er

Bilpark er i bunn og grunn en frittstående webapp bygget i vanlig
HTML/CSS/JavaScript — **uten noe build-verktøy, rammeverk eller
npm-avhengigheter.** Hele applikasjonen ligger i `index.html`. Det finnes
derfor ingen `package.json`, `vite.config` eller `src/`-mappe i dette
prosjektet.

**Datalagring:** Alle data (biler, kontroller, skader, verkstedtimer,
varsellamper, administratorbrukere, innstillinger) lagres sentralt i
**Airtable** — samme database uansett hvilken enhet eller nettleser noen
bruker, som ekte tabeller du kan bla i og filtrere direkte i Airtable. Se
`AIRTABLE_MIGRATION.md` for full tabell-/feltoversikt.

**Om "sanntid" og offline:** I motsetning til enkelte skytjenester har ikke
Airtables vanlige API push-varsling eller innebygd offline-kø. Appen
oppdaterer seg selv automatisk med jevne mellomrom (standard hvert 20.
sekund) i stedet for umiddelbart, og en synlig varsellinje vises øverst
dersom enheten mister nettforbindelsen — se AIRTABLE_MIGRATION.md punkt 5.

## 2. Innhold i pakken

```

bilpark-project/
├── index.html               Hele appen (dashboard, bilregister, sjåførkontroll-
│                             historikk, skader, verkstedtimer, innstillinger, login)
├── kontroll.html             Fast inngangsdør til sjåførmodus (viderefører til
│                             index.html?sjafor=1) — for QR-kode/bokmerke i bilen
├── airtable-config.js        Din Airtable base-ID + API-token (MÅ fylles ut — se
│                             AIRTABLE_MIGRATION.md)
├── storage.airtable.js       Airtable-backet datalagring (get/set/delete/list) +
│                             periodisk oppfriskning på tvers av enheter
├── manifest.json             PWA-manifest for admin/hovedappen
├── manifest-sjafor.json      Eget PWA-manifest for sjåførskjemaet — sikrer at en
│                             installert snarvei alltid åpner rett i skjemaet
├── sw.js                     Service worker for offline app-shell-cache (cacher
│                             KUN egne filer, ikke Airtable-trafikk)
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-512-maskable.png
├── _redirects                Valgfri: pen URL "/kontroll" på Netlify
├── vercel.json                Valgfri: pen URL "/kontroll" på Vercel
├── .htaccess                  Valgfri: pen URL "/kontroll" på Apache-hosting
├── AIRTABLE_MIGRATION.md      Full arkitekturoversikt og Airtable-oppsett
└── README.md                  Denne filen
```

De tre "valgfri"-filene (`_redirects`, `vercel.json`, `.htaccess`) trenger du
kun én av, avhengig av hvor du publiserer — se punkt 9. De gjør ingenting av
seg selv med mindre hosting-plattformen leser dem.

## 3. Installere avhengigheter

Ingen avhengigheter å installere. Det finnes ingen `package.json` fordi appen
ikke bruker npm, Vite, React eller lignende — det er ren HTML/CSS/JS.

## 4. Kjøre appen lokalt

Du kan åpne `index.html` direkte i nettleseren (dobbeltklikk / "Åpne med" →
nettleser). Det er nok for å teste appen.

**Anbefalt for full PWA-funksjonalitet** (service worker, "Legg til på
Hjem-skjerm" osv. krever at siden serveres over `http://`, ikke `file://`):
kjør en enkel lokal server fra prosjektmappen. Alle disse gjør nøyaktig det
samme — velg det du har installert fra før:

```bash
# Med Python 3 (følger med de fleste maskiner):
python3 -m http.server 8080

# Med Node.js, uten global installasjon:
npx serve .

# Med PHP:
php -S localhost:8080
```

Åpne deretter `http://localhost:8080` i nettleseren.

## 5. "Bygge" appen

Det finnes ikke noe byggesteg — det er ingenting å kompilere eller bundle.
`index.html`, `manifest.json`, `sw.js` og `kontroll.html` *er*
produksjonsversjonen. Skal du gjøre endringer, rediger filene direkte og
last siden på nytt.

## 6. Publisere / distribuere

Bilpark kan legges ut på hvilken som helst statisk filhosting, siden det ikke
trengs en backend. Eksempler:

- **GitHub Pages / GitLab Pages** — push mappen til et repo og aktiver Pages.
- **Netlify / Vercel** — dra-og-slipp-opplasting av mappen, eller koble til et
  repo (ingen build command trengs — la "Publish directory" peke på mappen
  som inneholder `index.html`).
- **Egen webserver** (Apache, Nginx, IIS, o.l.) — kopier alle filene til
  webroten.

Sørg for at `manifest.json`, `sw.js`, `kontroll.html` og `icons/`-mappen
havner **i samme mappe som** `index.html`, slik at de relative stiene
fortsatt stemmer.

**Kun for HTTPS (eller `localhost`):** Service workere (og dermed
PWA-installasjon) krever en sikker kontekst. Åpnes appen over vanlig `http://`
på en annen adresse enn `localhost`, vil ikke `sw.js` bli registrert — det gir
ingen feil i appen, men "Installer app" vil ikke tilbys. De fleste
hostingtjenestene nevnt over gir HTTPS automatisk.

## 7. PWA / installasjon

Appen kan installeres som en app på både mobil og PC:

- **Android/Chrome/Edge (stasjonær og mobil):** En installasjonslinje dukker
  opp nederst i appen når nettleseren vurderer at appen er installerbar.
  Alternativt: bruk nettleserens eget meny­valg "Installer app" /
  "Legg til på startskjerm".
- **iOS/Safari:** Safari støtter ikke automatisk installasjonsprompt. Appen
  viser derfor en egen hint-boks med instruksjon om å bruke
  Del-knappen → "Legg til på Hjem-skjerm".
- Etter installasjon fungerer appen offline for allerede besøkte sider
  (app-skallet caches av `sw.js`); data er uansett alltid lokal på enheten.

Ikonene i `icons/`-mappen er enkle, genererte plassholder-ikoner i
Bring-inspirerte farger. Bytt dem gjerne ut med en egen logo — behold bare
filnavnene og størrelsene (192×192 og 512×512), eller oppdater stiene i
`manifest.json` og `<head>` i `index.html` og `kontroll.html` om du endrer
filnavn.

## 8. Adminbrukere

Ved førstegangs oppstart opprettes tre navngitte administratorbrukere
automatisk i Airtable-tabellen **Users**, med felles standardpassord:

| Rolle       | Tittel           | Brukernavn  | Passord     |
|-------------|------------------|-------------|-------------|
| Pedersen    | Administrator    | `pedersen`  | `bring2026` |
| Gustavsen   | Koordinator      | `gustavsen` | `bring2026` |
| Jakobsen    | Transportleder   | `jakobsen`  | `bring2026` |

**Bytt disse passordene** via Innstillinger → Administratorbrukere før appen
tas i reell bruk. Brukernavn, tittel og passord kan redigeres fritt der, og
nye admin­brukere kan legges til.

Denne innloggingen er en **tilgangssperre i grensesnittet** — den styrer hva
som vises og er klikkbart i appen, men er *ikke* ekte serversikkerhet.
Airtable har ingen egen innloggingsfunksjon, og API-tokenet appen bruker gir
uansett full tilgang til hele basen for alle som besøker siden — se
sikkerhetsforbeholdet i `airtable-config.js` og AIRTABLE_MIGRATION.md punkt
0. Vurder fysisk/enhetsbasert sikring og hold lenken til appen internt
dersom det er behov for sterkere sikkerhet.

## 9. Sjåførkontroll uten innlogging

Sjåførene trenger **ingen bruker eller passord**. Kontrollskjemaet nås på to
likeverdige måter, og ingen av dem går innom login:

1. **`kontroll.html`** — en fast lenke/bokmerke (fin til QR-kode i bilen),
   som automatisk sender videre til skjemaet.
2. **`index.html?sjafor=1`** — samme skjema direkte via URL-parameter.

Begge viser *kun* selve kontrollskjemaet (kjøretøy, kilometerstand,
sjåførnavn, varsellamper, eventuelle nye skader, kommentar, "Send inn
kontroll") — ingen meny, ingen tilgang til resten av systemet (dashboard,
register, verkstedtimer, skader, historikk, innstillinger), og ingen
innlogging kreves. Innlogging er fortsatt påkrevd for alt annet i appen. Den
fulle lenken vises også inne i appen under Innstillinger, med en "Kopier
lenke"-knapp.

**Om sjåføren "installerer" siden på hjem-skjermen** (via nettleserens
"Installer app"/"Legg til på Hjem-skjerm"): dette er nå fikset til å alltid
åpne rett i skjemaet — se punkt 12 for hva som var galt og hva som ble
endret.

**Ønsker du en "pen" URL uten `.html`, f.eks. `https://minapp.no/kontroll`?**
Det avhenger av hvor appen er publisert, siden dette er en ren fil-basert
app uten egen server-routing. Tre ferdige regelfiler følger med i pakken —
host-en din bruker maks én av dem, resten kan slettes:

- **Netlify:** `_redirects` (brukes automatisk hvis den ligger i rotmappen)
- **Vercel:** `vercel.json` (brukes automatisk hvis den ligger i rotmappen)
- **Apache-basert webhotell:** `.htaccess` (krever at `mod_rewrite` er på)
- **GitHub Pages** støtter dessverre ikke denne typen omskriving uten en
  egen 404-siden-triks-løsning — bruk `kontroll.html` (med filendelsen) der.

## 10. Ting å være obs på

- **Sentral database (Airtable):** Data deles nå på tvers av enheter via
  Airtable, med periodisk oppfriskning (ikke øyeblikkelig sanntid) — se
  punkt 1 og AIRTABLE_MIGRATION.md. Ta jevnlig sikkerhetskopi ved behov
  (f.eks. eksporter tabellene fra Airtable, eller bruk "Nullstill
  bilparkdata" i Innstillinger — merk at denne *sletter* historikk, den tar
  ikke backup).
- **Airtable-tokenet er synlig i nettleseren:** se sikkerhetsforbeholdet i
  `airtable-config.js` og AIRTABLE_MIGRATION.md punkt 0 før appen publiseres
  eller lenken deles.
- **Standardpassord:** Bytt admin­passordene før appen tas i bruk, se punkt 8.
- **Mobilmeny:** Navigasjonen på mobil er en fullverdig sidemeny (drawer) som
  åpnes med "☰ Meny" og inneholder all navigasjon (Dashboard, Verkstedtimer,
  Skader, Kontrollhistorikk, samt Bilregister/Innstillinger under
  "Administrasjon", og Logg ut) med 44px+ trykkflater og tydelig markering av
  hvilken side du står på. Fanerekken øverst brukes fortsatt på større
  skjermer (PC/nettbrett), men er skjult under 640px bredde siden sidemenyen
  dekker det samme der. Sjåførsiden (`kontroll.html` / `?sjafor=1`) viser
  ingen meny i det hele tatt — kun kontrollskjemaet, uansett skjermstørrelse.
- **Plassholder-ikoner:** `icons/`-filene er enkle genererte ikoner — bytt
  dem ut med en offisiell logo om ønskelig.
- **HTTPS for PWA:** Installasjon og offline-støtte krever HTTPS eller
  `localhost`, se punkt 6.
- **Relative filstier:** `manifest.json`, `manifest-sjafor.json`, `sw.js`,
  `kontroll.html`, `airtable-config.js`, `storage.airtable.js` og `icons/` må
  ligge i samme mappe som `index.html` — flytt dem sammen.
- **Testing før driftsetting:** Alt JavaScript i pakken er kontrollert for
  syntaksfeil og alle skjermer (dashboard, login, sjåførkontroll,
  bilregister, verkstedtimer, skader, innstillinger) er verifisert til stede
  i koden. Jeg har derimot ikke kunnet teste appen mot en ekte Airtable-base
  herfra — en rask manuell gjennomgang i nettleseren etter publisering (logg
  inn, kjør en test-sjåførkontroll, og sjekk konsollen (F12) for
  feilmeldinger) er nødvendig før dette tas i reell bruk.

## 11. "Data lagres ikke fra mobil" — løst av Airtable-migreringen

**Løst.** Dette punktet beskrev en tidligere kjent begrensning fra da appen
kun lagret data lokalt i nettleseren (`localStorage`), uten deling mellom
enheter — en sjåførs innsending på mobil var usynlig for en administrator på
PC, siden de hadde hver sin lokale lagring. Etter Airtable-migreringen
skriver alle enheter til den samme sentrale Airtable-basen i stedet, og
Dashboard/historikk oppdateres automatisk (med inntil ca. 20 sekunders
forsinkelse — se AIRTABLE_MIGRATION.md punkt 5) når en annen enhet
registrerer noe. Detaljene i den opprinnelige feilsøkingsteksten (om
`localStorage`, «ingen database/API» osv.) er ikke lenger korrekte og er
derfor fjernet herfra — se i stedet AIRTABLE_MIGRATION.md for hvordan
lagringen fungerer i dag, og punkt 1 i denne filen for offline-varsling.

## 12. Direkte lenke til sjåførkontroll — hva som var galt, og hva som er fikset

Kontrollskjemaet har hele tiden vært tilgjengelig uten innlogging via
`kontroll.html` eller `index.html?sjafor=1` (se punkt 9) — koden sjekker
sjåførmodus *før* den sjekker om noen er logget inn. Årsaken til at sjåfører
likevel kunne havne på login, var trolig følgende:

**Rotårsaken:** Appen har en innebygd "Installer app"-funksjon (PWA). Før
denne oppdateringen pekte *alle* sider — også sjåførskjemaet — på samme
`manifest.json`, som alltid åpner `index.html` (uten `?sjafor=1`) når en
installert snarvei trykkes. Dersom en sjåfør trykket "Installer app" mens de
sto i kontrollskjemaet, ville den installerte snarvien på hjem-skjermen
likevel alltid åpne på login-siden neste gang — fordi selve installasjonen
ikke "husket" URL-parameteren.

**Fiksen:** Sjåførsiden bruker nå sin egen manifest (`manifest-sjafor.json`)
med `start_url` satt direkte til `index.html?sjafor=1`. `kontroll.html`
bruker denne manifesten fra start, og `index.html` bytter automatisk til den
samme manifesten så snart siden oppdager at den kjører i sjåførmodus. Dermed
vil "Installer app" — uansett om sjåføren står på `kontroll.html` eller
`index.html?sjafor=1` når de trykker install — gi en snarvei som alltid
åpner rett i kontrollskjemaet, uten login, hver gang.

**Anbefaling til sjåførene:** Be dem installere/legge til på hjem-skjermen
*fra `kontroll.html`-lenken* (eller del ut den lenken direkte som QR-kode),
så er man garantert riktig oppførsel med det samme.
