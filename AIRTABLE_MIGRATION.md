# AIRTABLE_MIGRATION.md — Nåværende Airtable-modell

Sist konsolidert: 2026-09-04 (Prioritet 31 — km-felt på dekkhistorikk). Kilde:
faktisk `LIST_TABLES`-konfigurasjon i `storage.airtable.js` (v2.9.0),
kryssjekket mot faktiske feltreferanser i `index.html`. Den tidligere,
separate oppsettsguiden for Firebase→Airtable-migreringen er ikke lenger
bevart som egen fil i produksjonsprosjektet — den ligger i git-commit
`cae279d`. Denne filen beskriver DAGENS FAKTISKE skjema, og seksjon 8 under
gjengir den fortsatt gyldige oppsettsprosedyren direkte.

**Prinsipp fulgt i denne filen:** kun felt som faktisk finnes i
`LIST_TABLES` (og dermed faktisk sendes til/leses fra Airtable) er
dokumentert som Airtable-felt. Data lagret via Settings-mønsteret, live-
beregnede verdier og lokale brukerpreferanser er tydelig merket som separate
kategorier — ingen av dem er Airtable-kolonner.

---

## 1. Autoritativ storage-fil og versjon

- **Fil:** `storage.airtable.js` (eneste Airtable-storage-fil i prosjektet)
- **Versjon:** `v2.9.0` (`window.storageAirtableInfo.versjon`)
- **Cache-busting:** `<script src="storage.airtable.js?v=2.9.0">` i
  `index.html`
- **Regel:** øk BÅDE `?v=`-tallet i `index.html` OG `versjon`-verdien i
  `storage.airtable.js` samtidig ved enhver fremtidig endring i filen.

## 2. Faktiske Airtable-tabeller og felt

### Vehicles (app-nøkkel: `vehicles`)

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| bilnummer | Bilnummer | tekst |
| regnr | Regnr | tekst |
| merke | Merke | tekst |
| modell | Modell | tekst |
| arsmodell | Årsmodell | tekst |
| kategori | Kategori | tekst |
| status | Status | tekst |
| dekk | Dekk | tekst |
| km | KM | tall |
| loyvenummer | Løyvenummer | tekst |
| hasPhoto | HasPhoto | boolsk |
| sommerdekkDot | SommerdekkDot | tekst |
| sommerdekkKommentar | SommerdekkKommentar | tekst |
| vinterdekkDot | VinterdekkDot | tekst |
| vinterdekkKommentar | VinterdekkKommentar | tekst |
| serviceIntervallKm | ServiceIntervallKm | tall |
| euGodkjentTil | EuGodkjentTil | tekst |
| aktivSjafor | AktivSjafor | tekst |
| aktivSjaforSiden | AktivSjaforSiden | tekst |
| uteAvDrift | UteAvDrift | boolsk |
| uteAvDriftArsak | UteAvDriftArsak | tekst |
| uteAvDriftDato | UteAvDriftDato | tekst |
| uteAvDriftKommentar | UteAvDriftKommentar | tekst |
| statusHistorikk | StatusHistorikk | JSON (tekst) |
| driftslag | Driftslag | tekst |
| **mobilitetsavtale** | **Mobilitetsavtale** | boolsk |

### Damages (app-nøkkel: `damages`)

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| vehicleId | VehicleId | tekst |
| dato | Dato | tekst |
| beskrivelse | Beskrivelse | tekst |
| alvorlighet | Alvorlighet | tekst |
| kommentar | Kommentar | tekst |
| status | Status | tekst |
| registrertAv | RegistrertAv | tekst |
| hasPhoto | HasPhoto | boolsk |
| createdByControlId | CreatedByControlId | tekst |
| estimertKostnad | EstimertKostnad | tall |

### WorkshopAppointments (app-nøkkel: `verkstedtimer`)

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| vehicleId | VehicleId | tekst |
| verksted | Verksted | tekst |
| dato | Dato | tekst |
| tidspunkt | Tidspunkt | tekst |
| beskrivelse | Beskrivelse | tekst |
| notater | Notater | tekst |
| pris | Pris | tall |
| sakId | SakId | tekst |
| caseId | CaseId | tekst |
| kontaktperson | Kontaktperson | tekst |
| telefon | Telefon | tekst |
| type | Type | tekst — skiller planlagt service (`'service'`) fra ordinære verkstedtimer |

### DriverChecks (app-nøkkel: `kontroller`)

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| vehicleId | VehicleId | tekst |
| dato | Dato | tekst |
| tidspunkt | Tidspunkt | tekst |
| sjafor | Sjafor | tekst |
| km | KM | tall |
| varsellamper | Varsellamper | JSON (tekst) |
| annetTekst | AnnetTekst | tekst |
| harNyeSkader | HarNyeSkader | boolsk |
| skadeBeskrivelse | SkadeBeskrivelse | tekst |
| skadeBilderCount | SkadeBilderCount | tall |
| kommentar | Kommentar | tekst |
| linkedDamageId | LinkedDamageId | tekst |

### WarningLights (app-nøkkel: `varsellys`)

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| vehicleId | VehicleId | tekst |
| type | Type | tekst |
| annetTekst | AnnetTekst | tekst |
| status | Status | tekst |
| registrertDato | RegistrertDato | tekst |
| registrertAv | RegistrertAv | tekst |
| kvittertDato | KvittertDato | tekst |
| kvittertAv | KvittertAv | tekst |
| createdByControlId | CreatedByControlId | tekst |

### Users (app-nøkkel: `admin-users`)

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| rolle | Rolle | tekst |
| tittel | Tittel | tekst |
| brukernavn | Brukernavn | tekst |
| passord | Passord | tekst |

### TireChanges (app-nøkkel: `dekkhistorikk`)

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| vehicleId | VehicleId | tekst |
| dato | Dato | tekst |
| retning | Retning | tekst |
| km | KM | tall |
| kommentar | Kommentar | tekst |

`retning` er, siden Prioritet 31, en av seks type-koder (ikke bare
"sommer-vinter"/"vinter-sommer") — se `DEKK_TYPE_OPTIONS` i `index.html`.
`km` er nytt (Prioritet 31, 2026-09-04): km ved dekkskifte, kun for
oppføringer opprettet via den nye "✔ Utført dekkskifte"-fullfør-flyten
(`fullforDekkskifttime()`) — historikk fra den eksisterende ad-hoc-
registreringen (`submitDekkskifte()`) har fortsatt ingen km. Endrer ALDRI
`v.km` (se Kilometerregel i CLAUDE.md).

### TireCosts (app-nøkkel: `dekkkostnader`)

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| vehicleId | VehicleId | tekst |
| dato | Dato | tekst |
| kostnad | Kostnad | tall |
| kommentar | Kommentar | tekst |

### AktiveSaker (app-nøkkel: `aktiveSaker`)

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| caseId | CaseId | tekst |
| vehicleId | VehicleId | tekst |
| registrationNumber | RegistrationNumber | tekst |
| caseType | CaseType | tekst |
| title | Title | tekst |
| description | Description | tekst |
| status | Status | tekst |
| priority | Priority | tekst |
| sourceType | SourceType | tekst |
| sourceId | SourceId | tekst |
| reportedBy | ReportedBy | tekst |
| reportedAt | ReportedAt | tekst |
| assignedTo | AssignedTo | tekst |
| nextAction | NextAction | tekst |
| followUpDate | FollowUpDate | tekst |
| resolvedAt | ResolvedAt | tekst |
| resolvedBy | ResolvedBy | tekst |
| resolutionNote | ResolutionNote | tekst |
| createdAt | CreatedAt | tekst |
| updatedAt | UpdatedAt | tekst |
| reportCount | ReportCount | tall |
| lastReportedAt | LastReportedAt | tekst |
| historikk | Historikk | JSON (tekst) — dette er de individuelle avvikspunktene i en flerpunkts sak |
| linkedVtId | LinkedVtId | tekst |
| verkstedResultat | VerkstedResultat | tekst |
| completedAt | CompletedAt | tekst |
| estimatedCost | EstimatedCost | tall |
| actualCost | ActualCost | tall |
| requiresProvision | RequiresProvision | boolsk |
| provisionAmount | ProvisionAmount | tall |
| provisionMonth | ProvisionMonth | tekst |

**Merk om "Sammenslåtte kontrollavvik":** flere avvikspunkter per sak lagres
i `historikk`-feltet (JSON) på selve saken, IKKE som egne Airtable-rader i en
separat tabell. Det finnes ingen egen "avvikspunkt"-tabell i Airtable.

### Settings (Key/Value-mønster)

- **Kolonner:** `Key` (tekst), `Value` (tekst/JSON)
- **Brukes til enkeltverdier**, ikke lister: `theme-preference`,
  `verksteder` (hele verkstedlisten lagret som én JSON-streng i én rad).

### Photos (Key/Value-mønster, egen tabell)

- **Kolonner:** `Key` (tekst), `Value` (tekst — base64 dataURL)
- **Brukes til skadebilder:** `photo:damage:{id}` (enkeltbilde) og
  `photo:kontroll:{id}:0`, `:1`, … (flerbilde fra sjåførkontroll).
- Er en EGEN tabell, ikke del av Settings, selv om mønsteret (Key/Value) er
  identisk.

## 3. Data lagret via Settings/Photos (ikke egne Airtable-felt per rad)

- `theme-preference` — brukerens tema-valg
- `verksteder` — liste over verksteder (JSON i én Settings-rad)
- `planlagteservicer` — planlagte servicer (lagres via `window.storage.set`,
  samme Settings-mønster)
- `dekkskifttimer` — planlagte dekkskifttimer (Prioritet 31, 2026-09-04),
  samme Settings-mønster som `planlagteservicer` — IKKE en egen
  `LIST_TABLES`-tabell.
- `servicehistorikk` — **dokumentasjonsrettelse (Prioritet 28):** all
  servicehistorikk for ALLE kjøretøy lagres som én samlet JSON-blob i én
  Settings-rad (`window.storage.get('servicehistorikk')`/`.set(...)`), IKKE
  som egne rader i en Airtable-tabell. `servicehistorikk` er derfor
  IKKE registrert i `LIST_TABLES` og finnes ikke som egen tabell i
  Airtable — dette var feilaktig utelatt fra forrige konsolidering av denne
  filen. Se ROADMAP.md, "Gjenstående kjente feil eller mangler", for
  driftsrisikoen ved denne modellen (Airtables praktiske feltgrense per
  celle ved fortsatt vekst).
- Alle skadebilder (`photo:*`-nøkler i Photos-tabellen)

## 4. Live-beregnede verdier (IKKE Airtable-felt — beregnes i JavaScript)

Disse skal ALDRI dokumenteres eller behandles som Airtable-kolonner:

- `vehicleAktivSjafor()`, `vehicleSisteSjafor()` — beregnet fra
  `aktivSjafor`/`aktivSjaforSiden` + dagens `kontroller`
- `vehicleServiceStatus()`, `vehicleNesteServiceKm()`,
  `vehicleSisteService()` — beregnet fra `servicehistorikk` + `v.km` +
  `serviceIntervallKm`
- `vehicleEuKontrollStatus()` — beregnet fra `euGodkjentTil` vs. dagens dato
- `vehicleDatakvalitetStatus()` — beregnet fra kontrollhistorikk-tidspunkt
- `dekkAlderStatus()` — beregnet fra dekkhistorikk
- `damagePhotoCount()`/`damagePhotoKeys()` — beregnet/utledet, peker til
  Photos-nøkler
- Synkroniseringsstatus (`pagaendeSkrivinger`, `synkFeilLogg`,
  `sisteVellykkedeSynkTidspunkt`) — kun i minnet under kjørende økt, ikke
  persistert noe sted

## 5. Lokale brukerpreferanser (IKKE Airtable, kun `localStorage`)

- `bilpark_sjaforkontroll_sist_driftslag` — sist brukte driftslag-gruppe i
  Sjåførkontroll
- Kontroll-kladd (`KONTROLL_DRAFT_KEY`)
- Sjåførøkt-session (`DRIVER_SESSION_KEY`)
- "Husk innlogging" (`REMEMBER_LOGIN_KEY`)

## 6. Nye felt siden forrige dokumenterte migrering

`KM` (TireChanges/`dekkhistorikk`, tall) er det nyeste feltet — lagt til
2026-09-04 (Prioritet 31) som km ved dekkskifte, kun fylt ut av den nye
"✔ Utført dekkskifte"-fullfør-flyten (`fullforDekkskifttime()`), aldri av
den eksisterende ad-hoc-registreringen. Korrekt registrert i `LIST_TABLES` i
nåværende `storage.airtable.js` (`v2.9.0`) — sendes og leses korrekt.
Endrer aldri `v.km` (se Kilometerregel). `Mobilitetsavtale` (Vehicles,
boolsk, lagt til 2026-09-04 samme dag, tidligere) forblir det nest nyeste
feltet, deretter `Driftslag` (Vehicles, Prioritet 27.1). Ingen
navneendringer på eksisterende felt er gjort. Merk også: `dekkskifttimer`
(planlagte dekkskifttimer, Prioritet 31) er IKKE et nytt Airtable-felt —
det er en ny Settings-blob-nøkkel, se seksjon 3.

## 7. Felt-kandidater — kun skrevet, aldri lest (Prioritet 28-felterevisjon)

Del 9-feltrevisjonen (statisk kodeanalyse i `index.html`, kryssjekket mot
`storage.airtable.js`) fant to `AktiveSaker`-felt som konsekvent skrives ved
opprettelse, men aldri leses tilbake noe sted i koden:

| Tabell | Felt | Tidligere formål (antatt) | Historiske data? | Slette-risiko | Anbefaling |
|---|---|---|---|---|---|
| AktiveSaker | `RegistrationNumber` (app: `registrationNumber`) | Trolig ment som en denormalisert kopi av kjøretøyets regnr for enklere visning/eksport uten oppslag mot `Vehicles` | Ukjent — feltet kan inneholde reelle historiske verdier for eksisterende saker | Lav ved fortsatt eksistens, men **ukjent** ved fjerning uten videre undersøkelse | La feltet ligge urørt. Ikke slett. |
| AktiveSaker | `AssignedTo` (app: `assignedTo`) | Trolig en planlagt "tildel sak til person"-funksjon som aldri ble ferdigstilt i UI | Ukjent | Lav ved fortsatt eksistens, men **ukjent** ved fjerning uten videre undersøkelse | La feltet ligge urørt. Vurder enten å fullføre tildelingsfunksjonen i UI, eller la det ligge. |

**Eksplisitt regel:** dette er kun dokumentasjon av kandidater, ikke et
handlingspunkt. Ingen Airtable-felt skal slettes eller migreres basert på
denne tabellen alene — en eventuell fjerning krever en egen, separat
godkjent migreringssak. Se også ROADMAP.md, "Gjenstående kjente feil eller
mangler".

## 8. Database status — automatisk skjemasjekk (Innstillinger)

`EXPECTED_SCHEMA` bygges automatisk fra `LIST_TABLES` (pluss egne,
hardkodede oppføringer for `Settings` og `Photos`). Database status i
Innstillinger viser:

1. Versjonsmerke (`storageAirtableInfo.versjon` vs. forventet versjon i
   `index.html`)
2. Synkroniseringsstatus (se punkt 4 over)
3. Skjemasjekk mot faktisk Airtable-struktur (krever `schema.bases:read`,
   automatisk oppretting av manglende felt krever `schema.bases:write`)

## 9. Oppsettsguide (uendret prosedyre)

Fremgangsmåten for å koble appen til en Airtable-base, uendret siden
prosjektet gikk over fra Firebase til Airtable:

1. Opprett en ny Airtable-base med tabellene listet i seksjon 2 over (samme
   navn og kolonnenavn som i `LIST_TABLES` i `storage.airtable.js`), samt en
   `Settings`- og en `Photos`-tabell med kolonnene `Key`/`Value` (se
   seksjon 2, "Settings" og "Photos").
2. Generer en Airtable Personal Access Token med minst `data.records:read`,
   `data.records:write` og `schema.bases:read`-scope for basen (legg til
   `schema.bases:write` dersom automatisk oppretting av manglende felt via
   Database status skal brukes, se seksjon 8).
3. Fyll inn din egen `baseId` og token i `airtable-config.js` — bruk ALDRI
   ekte verdier i en delt/offentlig kopi av prosjektet (se "Sikkerhet" i
   CLAUDE.md).
4. Åpne appen og bekreft i Innstillinger → Database status at
   versjonsmerket og skjemasjekken er grønne.
