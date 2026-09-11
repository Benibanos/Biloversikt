# CLAUDE.md — Bilpark Operativsystem

Dette dokumentet er prosjektets grunnlov: varige produktregler, arkitektur, dataintegritet og krav til videre utvikling.

Ved avvik mellom dokumentasjon og faktisk kode er koden sannheten. Verifiser alltid mot `index.html`, `storage.airtable.js` og faktisk Airtable-skjema før endringer.

Historiske leveranser, rotårsaksanalyser og testresultater hører hjemme i `CHANGELOG.md`. Status og neste arbeid hører hjemme i `ROADMAP.md`. Datamodellen hører hjemme i `AIRTABLE_MIGRATION.md`.

## 1. Produktvisjon

Bilpark er et operativt styringssystem for den daglige bilparken hos Bring Larvik. Systemet brukes for omtrent 16 kjøretøy og 40 ansatte som bytter bil gjennom turnus. Det skal aldri forutsettes fast sjåfør på fast bil.

Bilpark skal sørge for at riktig informasjon fører til riktig handling.

Bilpark er ikke primært:

- et bilregister
- et rapportsystem
- et analyseverktøy
- et ERP-system

Bilpark skal først og fremst gi kontroll på:

1. aktive saker
2. service
3. EU-kontroll
4. verksted og kommende avtaler
5. daglig sjåførkontroll og kjøretøybruk

Drift og operativ kontroll kommer før økonomi og analyse.

### Beslutningsregel

Vurder alle forslag mot spørsmålet:

> Hjelper dette driftskoordinatoren med å holde kontroll på bilparken raskere og med mindre støy?

Hvis svaret er nei, skal løsningen forenkles, flyttes, skjules eller droppes.

Prioriter i denne rekkefølgen:

1. operativ verdi
2. enkelhet
3. hastighet
4. konsistens
5. design

Design skal aldri gå foran operativ verdi eller dataintegritet.

## 2. Brukere og arbeidsflater

### Driftskoordinator

Primærbrukeren følger opp:

- aktive saker
- service og EU-frister
- verkstedbestillinger
- skader og varsellamper
- dekk og kostnader
- bilstatus og historikk

Desktop er kontrollsenteret. Mobil administrasjonsvisning skal være handlingsdrevet og bruke samme data og forretningslogikk som desktop.

### Sjåfør

Sjåføren skal kunne:

- velge bil
- oppgi navn
- gjennomføre daglig kontroll
- registrere skade, varsellampe og kontrollavvik
- se egen bil, ringeliste og bilspesifikke kommentarer
- bytte eller sjekke ut bil

Sjåførsiden skal være forståelig uten opplæring, mobiltilpasset og ha færrest mulig klikk.

## 3. Designretning

Det godkjente referansebildet for Aktive saker er visuell hovedretning for hele appen.

Opplevelsen skal være:

- mørk som standard, med fungerende lys drakt
- rolig og moderne
- kortbasert
- statusdrevet
- handlingsorientert
- konsekvent på tvers av skjermer

Bruk eksisterende designtokens, delte komponenter og eksisterende ikonfunksjoner. Ikke bygg et parallelt designsystem for én skjerm.

### Informasjonshierarki

En operativ skjerm skal normalt følge denne rekkefølgen:

1. overskrift og kort forklaring
2. nøkkeltall eller status
3. primær arbeidsflate
4. sekundær informasjon
5. historikk eller oppslag

Brukeren skal forstå hovedsituasjonen på under fem sekunder. Vis det viktigste uten klikk. Detaljer kan åpnes ved behov.

Unngå:

- store flate tabeller når operative kort er tydeligere
- mange likestilte handlingsknapper
- dupliserte forklaringer
- pyntetall uten neste handling
- historiske detaljer på aktive arbeidsflater
- nye moduler når en eksisterende flate kan utvides eller gjenbrukes

### Kortregel

Et operativt kort skal, når relevant, svare på:

- hva gjelder dette?
- hva er registrert?
- hva er status?
- hva er neste handling?

## 4. Dashboard

Dashboardet skal hjelpe driftskoordinatoren å forstå:

1. hva krever handling nå?
2. hvilke service- og EU-frister nærmer seg eller er forfalt?
3. hva er under oppfølging eller planlagt?
4. hva kommer neste?

Aktive saker, service og EU-kontroll er likeverdige kjerneområder. Biler ute av drift skal ikke automatisk prioriteres foran saker eller vedlikeholdsfrister. Ute-av-drift-status vises der den er relevant, men skal ikke dominere arbeidsflaten.

Dashboardet skal bruke delte beregninger og samme datakilder som detaljskjermene. Ikke lag egne tellinger som kan avvike.

## 5. Aktive saker

### Formål

Aktive saker er arbeidskøen for forhold som krever vurdering eller handling.

En kommentar er informasjon. En sak er arbeid. Kommentarer skal ikke opprette sak uten et tydelig handlingsbehov.

### Standard saksflyt

Den operative standardflyten er:

1. `ny` → **Aktiv sak**
2. `under-oppfolging` → **Under oppfølging**
3. `verksted-bestilt` → **Planlagt verksted**
4. `utfort` → **Utført / Historikk**

`avslatt` er en terminal status og vises i historikk.

Gamle statusverdier kan finnes i historiske data. `sakFase()` skal fortsatt gruppere dem riktig. Nye standardhandlinger skal ikke føre nye saker tilbake til gamle delstatuser.

### Handlinger

- Ny sak kan godtas eller avslås med ett klikk.
- Godtatt sak går til Under oppfølging.
- Verkstedtime knyttet til saken flytter den til Planlagt verksted.
- Arbeid utført skal fullføre saken, lukke aktive avvik, sette nødvendige ferdigfelter og kvittere tilhørende varsellampe når koblingen er entydig.
- Utførte og avslåtte saker slettes aldri som del av normal flyt.

### Flerpunktsaker

- Én kontroll kan opprette én samlet sak med flere avvikspunkter.
- `sak.avvik[]` er kjernedata for flerpunktsaker.
- Feltet må være registrert i `LIST_TABLES.aktiveSaker.fields` som Airtable-feltet `Avvik` med JSON/lang tekst.
- Sakskort skal vise relevante varsellamper og kontrollavvik direkte når dette reduserer behovet for å åpne saken.

### Verkstedkobling

En verkstedtime betyr at saken er planlagt, ikke utført.

- Eksplisitt kobling fra sak til verkstedtime skal foretrekkes.
- Automatisk kobling er bare tillatt når nøyaktig én åpen sak i Under oppfølging finnes på bilen.
- Ved flere mulige saker skal systemet aldri gjette.
- Sletting av sak eller verkstedtime skal rydde gjensidige referanser uten å slette det andre objektet automatisk.

### Avansert redigering

Den gamle veiviseren kan beholdes for kostnader og eldre data, men skal ikke være standardinngang. Ikke bygg ny funksjonalitet som gjør den gamle delstatusflyten til hovedflyt igjen.

## 6. Kommentarer

Kommentarer og saker skal holdes adskilt.

- Kontrollkommentarer ligger på kontrollen.
- Fristilte kommentarer ligger i `kommentarer[]`, lagret som egen Settings-blob.
- Fristilte kommentarer skal aldri legges inn som falske rader i `kontroller[]`.
- Sjåfører skal bare se kommentarer for aktiv bil.
- Administrator kan se kommentarer for hele bilparken og markere dem som lest.
- Kommentarer skal ikke vises inne i Aktive saker som standard.

`kontroller[]` er eneste datagrunnlag for kontrollstatus, kontrollhistorikk og kontrollrelatert kilometerlogikk. Kommentarfunksjoner må ikke forurense dette datasettet.

## 7. Sjåførkontroll og aktiv biløkt

### Kontrollflyt

Standardflyten er:

1. velg bil
2. oppgi navn
3. gjennomfør kontroll
4. åpne Min Bil

Bilvalg grupperes etter `v.driftslag`. Ukjente driftslag skal fortsatt fungere i en nøytral gruppe.

Kontrollen kan registrere:

- kilometerstand
- varsellamper
- skade
- kontrollavvik
- kommentar

Nye kontrollvalg skal bare legges til når de gir tydelig operativ verdi og kan behandles korrekt videre. «Sprekk i frontruta» bør ved implementering behandles som et tydelig, raskt valg som kan opprette en sak, men eksisterende kode og datamodell skal kartlegges før kategori eller felt bestemmes.

### Aktiv sjåfør

- `settAktivSjafor()` er eneste tildeler av `v.aktivSjafor` og `v.aktivSjaforSiden`.
- Kontroll registrert fra sjåførmodus og administrasjon skal sette aktiv sjåfør uten å overstyre administratorens lokale sjåførsesjon.
- Én sjåfør kan bare være aktiv på én bil om gangen.
- «Ny sjåfør» er ren overføring og skal ikke opprette kontroll eller historikk.
- Manuell utsjekking gjør bilen tilgjengelig.
- Operativt dagskille er kl. 04:00, ikke midnatt.

### Biler ute av drift

- `v.uteAvDrift` er en status, ikke en vanlig bilkategori.
- `v.kategori` og `v.driftslag` skal bevares når bilen settes ute av drift.
- Bilen skal ikke kunne velges i vanlig sjåførkontroll eller ved opprettelse av nye operative registreringer der dette er ulogisk.
- Historikk og administrativt oppslag skal fortsatt være tilgjengelig.
- Ute-av-drift-biler skal ikke dominere Dashboard eller automatisk behandles som høyeste prioritet.

## 8. Service, EU-kontroll, dekk og verksted

### Service

- `v.km` er eneste autoritative nåværende kilometerstand.
- `servicehistorikk[].km` er historisk kilometerstand og skal aldri overskrive `v.km`.
- Serviceintervall er kjøretøyspesifikt via `v.serviceIntervallKm`.
- Planlagt service og utført service skal kunne opprettes, redigeres, fullføres og slettes med sporbarhet.
- Fullføring av planlagt service skal opprette historikk før den planlagte posten fjernes.
- Planlagt service og ordinære verkstedtimer er separate datamodeller.

Tillatte skriveveier til `v.km`:

- `submitKontroll()`
- `performKontrollDeletion()`
- `resetFleetData()`
- `saveVehicleForm()` kun som eksplisitt admin-korreksjon med bekreftelse ved faktisk verdiendring

Ingen andre funksjoner skal skrive til `v.km`.

### EU-kontroll

- Autoritativt felt er `v.euGodkjentTil`.
- EU-status skal vise god tid, under 90 dager, under 30 dager og utløpt.
- Kommende og forfalt EU-kontroll skal være synlig uten å åpne rapporter.
- Verkstedtime kan merkes strukturert som EU-kontroll.

### Dekk og ruteskift

- Dekkregistrering og -historikk skal gjenbruke eksisterende datakilder.
- Ruteskift registreres som strukturert verkstedtype, ikke ved å tolke fritekst.
- Ikke bygg en parallell motor for ruteglass, dekk eller verksted.

### Kalender

Kalender er visningen for planlagte aktiviteter. Den skal samle eksisterende kilder, ikke eie en ny datamodell.

Aktuelle kilder omfatter:

- planlagt service
- planlagt dekkskift
- EU-frister
- verkstedtimer
- saksoppfølginger

## 9. Kjøretøyprofil, historikk, rapporter og analyse

### Kjøretøyprofil

Profilen skal gi identitet, operativ status og relevante snarveier uten å bli et dumpested for all funksjonalitet.

Viktige felt omfatter:

- bilnummer og registreringsnummer
- merke og modell
- løyvenummer
- kilometerstand
- aktiv sjåfør
- siste og neste service
- EU-godkjent til
- driftslag, kategori og biltype
- drivstoff, telefon og mobilitetsgaranti når registrert

Eksisterende faner skal gjenbrukes. Ikke legg til nye faner uten en egen beslutning.

### Historikk

Historikk er arkiv og oppslag, ikke aktiv arbeidsflate. Historiske kontroller, saker, service, verksted, dekk og skader skal bevares og være søkbare per bil.

### Rapporter

Rapporter skal bruke de samme autoritative datakildene som appen. De skal ikke innføre egne tall eller statuser.

- Flåteoversikter kan vise én rad per bil.
- Når en rapport filtreres til én bil, skal relevant full historikk vises der dette er rapportens formål.
- Excel-eksport skal gjengi samme filtrering og betydning som skjermvisningen.

### Analyse

Analyse er sekundært. Nye analyser skal bare bygges når de støtter en konkret operativ beslutning som ikke allerede dekkes av Dashboard, rapport eller historikk.

## 10. Arkitektur

### Plattform

- Frontend og forretningslogikk: `index.html`
- Sjåførinngang: `kontroll.html` og/eller `index.html?sjafor=1`
- Database: Airtable
- Autoritativ integrasjon: `storage.airtable.js`
- Hosting: GitHub Pages
- PWA: `sw.js`, `manifest.json`, `manifest-sjafor.json`
- Ingen byggsteg eller frontendrammeverk

Ikke introduser Android, APK, TWA, Netlify, Vercel, Firebase eller en alternativ backend uten en uttrykkelig ny arkitekturbeslutning.

`storage.airtable.js` er eneste Airtable-storage-fil. Ikke opprett navnevarianter eller parallelle lagringslag.

### Autoritative kilder

- Faktisk kode er sannheten for implementert oppførsel.
- `LIST_TABLES` er sannheten for hvilke radbaserte Airtable-felt som leses og skrives.
- `AIRTABLE_MIGRATION.md` beskriver dagens Airtable-modell og manuelt oppsett.
- Settings-blobber skal tydelig skilles fra radbaserte Airtable-tabeller.
- Lokale preferanser skal tydelig skilles fra delte data.

## 11. Airtable og dataintegritet

### Feltregelen

Et nytt felt i JavaScript som ikke registreres i riktig `LIST_TABLES`-definisjon kan forsvinne ved neste synkronisering.

Derfor skal enhver feltendring utføres samlet:

1. kartlegg faktisk bruk i koden
2. opprett eller bekreft feltet i Airtable
3. registrer feltet i `LIST_TABLES`
4. oppdater lesing og skriving
5. oppdater `AIRTABLE_MIGRATION.md`
6. test lagring og ny innlasting

Ingen Airtable-felt skal slettes uten en egen, eksplisitt godkjent migrering.

### Kø og samtidighet

- `get()`, `set()` og `delete()` for samme ressurs skal gå gjennom `_koKjor()`.
- Lesing må ikke starte midt i en pågående skriving mot samme ressurs.
- Ikke fjern eller omgå den serialiserte køen.
- `airtableFetch()` skal ha en eksplisitt timeout. Ikke fjern timeoutbeskyttelsen.

### Lagringsfeil

- Kritiske mutasjoner skal bruke eksisterende rollback-mønster.
- Brukergrensesnittet skal aldri vise en endring som lagret dersom lagringen feilet.
- Feil skal være synlige, og brukeren skal kunne prøve igjen.
- Kritiske skjemaer og knapper skal beskyttes mot dobbel innsending med eksisterende interne låser.

### Settings-blobber

Datasett lagret som JSON i Settings skal bruke trygg parsing.

- Korrupt JSON skal aldri tolkes som tom liste og lagres tilbake automatisk.
- Lagring til et kjent korrupt datasett skal blokkeres.
- Brukeren skal varsles tydelig.
- Vær oppmerksom på Airtables praktiske feltgrenser ved fortsatt vekst.

## 12. PWA, cache og versjoner

### Versjonsregel

Ved enhver endring i `storage.airtable.js`:

1. øk `window.storageAirtableInfo.versjon`
2. oppdater `?v=` i scriptreferansen i `index.html`
3. oppdater `?v=` i `kontroll.html`

Det skal ikke innføres en tredje hardkodet forventet versjon.

Ved endring i app-shell-filer skal `CACHE_VERSION` i `sw.js` økes.

### PWA-regler

- Ikonene skal ligge i `icons/` med navnene manifestene og `sw.js` forventer.
- `APP_SHELL` må bare referere til filer som faktisk finnes på den publiserte siden.
- `cache.addAll()` er alt-eller-ingenting. Én manglende fil kan stoppe hele service worker-installasjonen.
- PWA-endringer skal verifiseres mot faktisk publisert GitHub Pages-side, ikke bare lokal kildekode.

## 13. Sikkerhet

`airtable-config.js` lastes i nettleseren. Tokenet er derfor synlig for brukere med tilgang til appen.

- Bruk et token begrenset til nødvendig base og nødvendige operasjoner.
- Ikke legg ekte token i offentlig repository, delte filer eller dokumentasjon.
- Bruk en eksempelkonfigurasjon med plassholdere ved deling av kildekode.
- Roter tokenet ved mulig eksponering.
- Reell skjerming av token krever backend eller proxy og er utenfor dagens arkitektur.

## 14. Regler for videre utvikling

### Før endring

1. Les `CLAUDE.md`, `ROADMAP.md` og relevante deler av `AIRTABLE_MIGRATION.md`.
2. Les kodeflyten direkte. Ikke anta at tidligere dokumentasjon beskriver koden korrekt.
3. Søk etter eksisterende `renderX()`, `saveX()`, beregninger og komponenter før nye funksjoner opprettes.
4. Kartlegg alle lesere og skrivere for data som skal endres.
5. Ta git-commit eller annen snapshot før redigering.
6. Avklar om endringen påvirker Airtable-skjema, cache, PWA eller begge HTML-inngangene.

### Under endring

- Endre minst mulig.
- Gjenbruk eksisterende data og funksjoner.
- Ikke opprett parallelle sannheter, tellinger, historikkmotorer eller lagringslag.
- Ikke fjern fungerende funksjonalitet som en utilsiktet del av redesign.
- Skill mellom layout og forretningslogikk.
- Mobil og desktop kan ha ulike oppsett, men skal dele data, statusregler og beregninger.
- Bevar støtte for historiske data når statusverdier eller visninger forenkles.
- Ikke gjett ved tvetydige koblinger.
- Ikke skriv hemmeligheter i kode, dokumentasjon eller testdata.

### Etter endring

1. Kjør syntakssjekk av berørte JavaScript-filer og scriptblokker.
2. Test berørt flyt ende til ende.
3. Test desktop, mobil og sjåførmodus når endringen kan påvirke dem.
4. Test Airtable-lagring, feilhåndtering og ny innlasting.
5. Test historiske data og relevante kanttilfeller.
6. Kontroller at `index.html` og `kontroll.html` fortsatt er synkronisert dersom begge inneholder appkode.
7. Oppdater versjoner og cache etter reglene over.
8. Oppdater riktig dokument, ikke alle dokumenter.
9. Dokumenter endrede filer, utførte tester og kjente begrensninger i `CHANGELOG.md`.

## 15. Testkrav etter område

Test bare relevante områder grundig, men kjør regresjon på avhengigheter som kan være berørt.

### Aktive saker

- ny → godta → under oppfølging
- avslått → historikk
- koblet verkstedtime → planlagt verksted
- arbeid utført → ferdigfelter, historikk, avvik og varsellampe
- flerpunktsak før og etter ny innlasting
- tvetydig verkstedkobling skal ikke gjettes

### Sjåførkontroll

- bilvalg og driftslag
- navn og aktiv sjåfør
- allerede kontrollert bil
- kilometerstand
- varsellampe, skade og kontrollavvik
- dårlig forbindelse, timeout og synlig feil
- utsjekking og dagskille kl. 04:00

### Service og EU

- serviceintervall og varsling
- planlegg, rediger, fullfør og slett service
- servicehistorikk endrer aldri `v.km`
- EU-frister i riktige nivåer
- kalender og bestillingsflyt

### Data og PWA

- nytt felt lagres og lastes etter refresh
- rollback ved lagringsfeil
- ingen dobbel innsending
- manifest, ikoner og service worker returnerer gyldig innhold live
- oppdateringsfunksjonen henter ny appversjon

## 16. Dokumentansvar

Hver opplysning skal ha ett primært hjem:

- `README.md`: kort introduksjon, hovedfunksjoner og oppsett
- `CLAUDE.md`: varige regler, arkitektur og dataintegritet
- `ROADMAP.md`: nåværende status, kjente feil og neste arbeid
- `CHANGELOG.md`: kronologisk leveransehistorikk, tester og rotårsaker
- `AIRTABLE_MIGRATION.md`: tabeller, felt, Settings-nøkler og migreringer

Unngå å kopiere hele avsnitt mellom dokumentene. Bruk korte referanser i stedet.

## 17. Kjente varige begrensninger

- Airtable-tokenet er synlig i klientarkitekturen.
- Flere datasett lagres som Settings-blobber og kan møte feltgrenser ved vekst.
- `index.html` og `kontroll.html` kan være parallelle fullkopier og må holdes synkronisert så lenge denne strukturen består.
- Historiske statusverdier finnes og må fortsatt kunne leses.
- PWA-en er avhengig av at alle filer i `APP_SHELL` faktisk finnes på publisert side.
- Eksisterende kilometerdata kan inneholde historiske feil fra den tidligere service-km-feilen og må eventuelt kontrolleres manuelt.

Detaljert status og åpne tiltak vedlikeholdes i `ROADMAP.md`, ikke her.
