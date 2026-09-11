# Bilpark

Operativt styringssystem for den daglige bilparken hos Bring Larvik.

Bilpark er laget for at riktig informasjon skal føre til riktig handling. Systemet gir driftskoordinatoren rask oversikt over aktive saker, service, EU-kontroll, verksted og kommende frister, samtidig som sjåførene får en enkel mobil arbeidsflate for daglig kontroll og registrering av feil.

## Hovedbrukere

- **Driftskoordinator:** følger opp saker, service, EU-kontroll, verksted, skader, varsellamper, dekk og kostnader.
- **Sjåfør:** velger bil, gjennomfører daglig kontroll og registrerer avvik, varsellamper, skader og kommentarer.

## Kjernefunksjoner

### Aktive saker

Registrerte problemer samles i en enkel operativ arbeidsflyt:

1. **Aktiv sak** – ny sak som må godtas eller avslås.
2. **Under oppfølging** – saken er godkjent og må følges opp.
3. **Planlagt verksted** – verkstedtime er registrert.
4. **Utført** – arbeidet er ferdig og saken flyttes til historikk.

Avslåtte saker beholdes også i historikken. Varsellamper og kontrollavvik vises direkte på sakskortet, slik at saken kan forstås uten unødvendige klikk.

### Service og EU-kontroll

- Kilometerbasert serviceintervall per kjøretøy.
- Varsling om kommende og forfalt service.
- Fire varslingsnivåer for EU-kontroll.
- Planlegging, redigering, fullføring og sletting av planlagt service.
- Kalenderoversikt for service, EU-kontroll, dekkskift, verkstedtimer og oppfølginger.

### Sjåførkontroll

- Mobiltilpasset kontrollflyt uten innlogging.
- Bilvalg gruppert etter driftslag.
- Registrering av kilometerstand, varsellamper, skader og kontrollavvik.
- Automatisk opprettelse av aktive saker når et registrert forhold krever oppfølging.
- Aktiv sjåfør og biløkt avsluttes automatisk ved operativt dagskille kl. 04:00.

### Verksted og historikk

- Verkstedtimer kan kobles til aktive saker.
- EU-kontroll og ruteskift kan registreres som strukturerte verkstedtyper.
- Utført arbeid lagres med sporbarhet i historikk.
- Historikk er tilgjengelig for kontroller, saker, service, verksted, dekk og skader.

### Rapporter

Rapporthuben gir standardiserte rapporter for blant annet kilometerstand, service, dekk, EU-kontroll, skader, saker, kostnader, bilpark, verksted og kontroll. Rapportene kan eksporteres til Excel.

## Brukerflater

- **Desktop:** kontrollsenter for driftskoordinatoren.
- **Mobil:** handlingsdrevet administrasjonsvisning.
- **Sjåførside:** egen mobil arbeidsflate via `index.html?sjafor=1` eller `kontroll.html`.

Designet skal være rolig, kortbasert og handlingsorientert. Det viktigste skal kunne forstås raskt uten å åpne flere skjermer.

## Teknologi

- **Frontend:** HTML, CSS og JavaScript i `index.html`.
- **Database:** Airtable via `storage.airtable.js`.
- **Hosting:** GitHub Pages.
- **PWA:** `sw.js`, `manifest.json` og `manifest-sjafor.json`.
- **Byggsteg:** Ingen.

Prosjektet bruker ikke Android-app, APK, TWA, Netlify eller Vercel.

## Prosjektfiler

### Kjøretid

- `index.html` – app-skall, brukergrensesnitt og forretningslogikk.
- `kontroll.html` – inngang til sjåførmodus.
- `storage.airtable.js` – autoritativ Airtable-integrasjon.
- `airtable-config.js` – Airtable Base ID og tilgangstoken.
- `sw.js` – service worker og app-shell-cache.
- `manifest.json` – PWA-manifest for hovedappen.
- `manifest-sjafor.json` – PWA-manifest for sjåførsiden.
- `icons/` – appikoner.

### Dokumentasjon

- `README.md` – kort introduksjon, funksjoner og oppsett.
- `CLAUDE.md` – produktregler, arkitektur, dataintegritet og utviklingskrav.
- `ROADMAP.md` – nåværende status, kjente feil og neste arbeid.
- `CHANGELOG.md` – kronologisk endringshistorikk og testresultater.
- `AIRTABLE_MIGRATION.md` – autoritativ datamodell og Airtable-oppsett.

## Oppsett

1. Klon eller last ned prosjektet.
2. Opprett Airtable-basen etter skjemaet i `AIRTABLE_MIGRATION.md`.
3. Kontroller at alle påkrevde tabeller og felt finnes, inkludert feltet `Avvik` som langt tekstfelt i tabellen `AktiveSaker`.
4. Opprett et Airtable Personal Access Token med minst nødvendige rettigheter til den aktuelle basen.
5. Legg Base ID og token i `airtable-config.js`.
6. Kontroller at appikonene ligger i `icons/` med filnavnene som brukes av manifestene og `sw.js`.
7. Publiser prosjektet på GitHub Pages.
8. Åpne **Innstillinger → Database status** og bekreft at filversjon, synkronisering og Airtable-skjema er godkjent.

## Oppdatering

Ved endringer i `storage.airtable.js`:

1. Øk versjonen i `storage.airtable.js`.
2. Oppdater `?v=` på scriptreferansen i `index.html` og `kontroll.html` til samme versjon.

Ved endringer i filer som inngår i app-skallet:

1. Øk `CACHE_VERSION` i `sw.js`.
2. Publiser filene på nytt.
3. Bruk **Oppdater app** under Systeminnstillinger for å hente en frisk versjon.

Oppdater også relevant dokumentasjon etter endringen:

- `AIRTABLE_MIGRATION.md` ved databaseendringer.
- `ROADMAP.md` ved statusendringer.
- `CHANGELOG.md` ved ferdig leveranse.
- `CLAUDE.md` bare når varige regler eller arkitektur endres.

## Sikkerhet

`airtable-config.js` lastes i nettleseren. Et token i denne filen er derfor synlig for brukere som har tilgang til appen.

- Bruk et token som kun har tilgang til nødvendig Airtable-base og nødvendige operasjoner.
- Ikke publiser ekte token i et offentlig repository.
- Bruk en eksempelkonfigurasjon med plassholdere når kildekoden deles.
- Roter tokenet dersom det kan ha blitt eksponert.

Full skjerming av tokenet krever en backend eller proxy og er ikke en del av dagens arkitektur.

## Viktige utviklingsregler

- Nye Airtable-felt må registreres i `LIST_TABLES` samtidig som de tas i bruk.
- `v.km` er eneste autoritative nåværende kilometerstand.
- Historisk servicekilometer skal aldri overskrive `v.km`.
- Ikke bygg parallelle datakilder, lagringsfiler eller beregningsmotorer.
- Gjenbruk eksisterende funksjoner før nye mekanismer opprettes.
- Test både desktop, mobil og sjåførmodus etter relevante endringer.

Se `CLAUDE.md` for fullstendige og bindende utviklingsregler.
