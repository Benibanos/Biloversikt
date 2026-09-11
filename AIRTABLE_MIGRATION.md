# AIRTABLE_MIGRATION.md — Nåværende Airtable-modell

Sist konsolidert: 2026-09-10 (Prioritet 46 — ingen nye felt; gjenbruker
`WorkshopAppointments.Type` og `Vehicles.Telefon`, se seksjon 16). Forrige
feltendring: Prioritet 45 — nytt felt `Telefon` på `Vehicles` for 📞
Ringeliste. Kilde: faktisk `LIST_TABLES`-konfigurasjon i
`storage.airtable.js` (v2.11.0), kryssjekket mot faktiske feltreferanser i
`index.html`. Den tidligere, separate oppsettsguiden for
Firebase→Airtable-migreringen er ikke lenger bevart som egen fil i
produksjonsprosjektet — den ligger i git-commit `cae279d`. Denne filen
beskriver DAGENS FAKTISKE skjema, og seksjon 10 under gjengir den fortsatt
gyldige oppsettsprosedyren direkte.

**Prinsipp fulgt i denne filen:** kun felt som faktisk finnes i
`LIST_TABLES` (og dermed faktisk sendes til/leses fra Airtable) er
dokumentert som Airtable-felt. Data lagret via Settings-mønsteret, live-
beregnede verdier og lokale brukerpreferanser er tydelig merket som separate
kategorier — ingen av dem er Airtable-kolonner.

---

## 1. Autoritativ storage-fil og versjon

- **Fil:** `storage.airtable.js` (eneste Airtable-storage-fil i prosjektet)
- **Versjon:** `v2.11.0` (`window.storageAirtableInfo.versjon`) — økt i
  Prioritet 45 fordi `LIST_TABLES.vehicles` fikk ett nytt felt (`Telefon`)
- **Cache-busting:** `<script src="storage.airtable.js?v=2.11.0">` i BÅDE
  `index.html` og `kontroll.html`
- **Regel (permanent versjonsløsning, Prioritet 36):** øk BÅDE `?v=`-tallet
  på script-taggen i `index.html`/`kontroll.html` OG `versjon`-verdien i
  `storage.airtable.js` samtidig ved enhver fremtidig endring i filen.
  Database status (Innstillinger → ⚙️ Systeminnstillinger, Prioritet 45)
  leser "forventet versjon" AUTOMATISK fra `?v=`-parameteren — det finnes
  ingen egen, tredje `FORVENTET_VERSJON`-konstant å huske å oppdatere. Se
  CLAUDE.md, "Versjonskontroll (permanent løsning)", for full detalj.

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
| drivstoff | Drivstoff | tekst (Prioritet 37) |
| mobilitetsgaranti | Mobilitetsgaranti | tekst (Prioritet 37) |
| **telefon** | **Telefon** | **tekst (Prioritet 45 — 📞 Ringeliste)** |

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
| telefon | Telefon | tekst — **merk:** dette er verkstedtimens EGEN kontakttelefon, en helt annen kolonne (annen tabell) enn det nye `Vehicles.Telefon` fra Prioritet 45 |
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
| kommentarLest | KommentarLest | boolsk |

> **Nytt i Prioritet 50 («Kommentarer 2.0»):** `kommentarLest` er les-status
> for `kommentar`-feltet over, satt av administrator via «✅ Marker som lest»
> i Kommentaroversikt/Aktive saker. Rent administrativt felt — påvirker aldri
> Kontrollflyt, kilometerlogikk eller bilstatus.
>
> Samtidig innført: en HELT NY, separat liste `kommentarer` (fristilte
> sjåførkommentarer lagt til via ☰ Mer → 💬 Legg til kommentar, IKKE knyttet
> til en kontroll). Denne er bevisst IKKE en egen Airtable-tabell — den lagres
> som én JSON-blob i Settings-tabellen, med nøyaktig samme mønster som
> `servicehistorikk`/`planlagteservicer` under (se «Enkeltverdier i
> Settings-tabellen»). Trenger derfor ingen egen felt-tabell her.

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
| kommentar | Kommentar | tekst |

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
| historikk | Historikk | JSON (tekst) — logg over hver rapportering/hendelse på saken (dato/av/kommentar). **Rettelse (Prioritet 52):** forrige beskrivelse her var feil — dette feltet er IKKE avvikspunktene selv, se `avvik` under. |
| avvik | Avvik | JSON (tekst) — **KRITISK FELTRETTING (Prioritet 52):** dette er de faktiske avvikspunktene i en flerpunkts sak (ett element per varsellampe/kontrollavvik, se `sakAvvikListe()`). Var ALDRI registrert i `LIST_TABLES` — feltet ble stille droppet ved hver Airtable-synk siden Prioritet 12. **Krever ny kolonne `Avvik` (long text) i AktiveSaker-tabellen i Airtable før v2.13.0 tas i bruk.** |
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
  `verksteder` (hele verkstedlisten lagret som én JSON-streng i én rad),
  `bilkategorier` (Prioritet 41), `dashboard-layout` (Prioritet 44 — se
  seksjon 3 under).

### Photos (Key/Value-mønster, egen tabell)

- **Kolonner:** `Key` (tekst), `Value` (tekst — base64 dataURL)
- **Brukes til skadebilder:** `photo:damage:{id}` (enkeltbilde) og
  `photo:kontroll:{id}:0`, `:1`, … (flerbilde fra sjåførkontroll).
- Er en EGEN tabell, ikke del av Settings, selv om mønsteret (Key/Value) er
  identisk.

## 3. Data lagret via Settings/Photos (ikke egne Airtable-felt per rad)

- `theme-preference` — brukerens tema-valg
- `verksteder` — liste over verksteder (JSON i én Settings-rad)
- `bilkategorier` — liste over kjøretøykategorier (JSON i én Settings-rad,
  Prioritet 41)
- `dashboard-layout` — 🎨 Layout Editor (Prioritet 44): ÉN JSON-blob,
  `{ desktop: {order, hidden}, mobil: {order, hidden}, minbil: {order,
  hidden} }`, delt/global for hele bilparken. Samme generiske Settings-
  get()/set()-spor som `theme-preference` — INGEN egen tabell, INGEN
  `LIST_TABLES`-registrering (gjelder kun `LIST_TABLES`-ressurser, ikke
  generiske Settings-nøkler).
- `planlagteservicer` — planlagte servicer (lagres via `window.storage.set`,
  samme Settings-mønster)
- `servicehistorikk` — **dokumentasjonsrettelse (Prioritet 28):** all
  servicehistorikk for ALLE kjøretøy lagres som én samlet JSON-blob i én
  Settings-rad (`window.storage.get('servicehistorikk')`/`.set(...)`), IKKE
  som egne rader i en Airtable-tabell. `servicehistorikk` er derfor
  IKKE registrert i `LIST_TABLES` og finnes ikke som egen tabell i
  Airtable — dette var feilaktig utelatt fra forrige konsolidering av denne
  filen. Se ROADMAP.md, "Gjenstående kjente feil eller mangler", for
  driftsrisikoen ved denne modellen (Airtables praktiske feltgrense per
  celle ved fortsatt vekst).
- `kommentarer` — **nytt i Prioritet 50 («Kommentarer 2.0»):** fristilte
  sjåførkommentarer lagt til via ☰ Mer → 💬 Legg til kommentar (IKKE knyttet
  til en kontroll). Samme Settings-blob-mønster som `servicehistorikk`
  (`window.storage.get('kommentarer')`/`.set(...)`, trygg lasting via
  `parseJsonTrygt`). Bevisst IKKE lagt i `kontroller[]`/DriverChecks — se
  CLAUDE.md, Prioritet 50, for hvorfor (unngår å forurense
  `isKontrollertIdag()`/kilometerhistorikk). `{id, vehicleId, dato,
  tidspunkt, sjafor, tekst, lest}`.
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

**Prioritet 45 (2026-09-10) — ett nytt felt på `Vehicles`:**

| App-felt | Airtable-felt | Type | Brukes til |
|---|---|---|---|
| `telefon` | `Telefon` | singleLineText | 📞 Ringeliste — registreres i Innstillinger → 👤 Sjåførside → 📞 Ringeliste, vises i Min Bil hos sjåførene som en tappbar `tel:`-lenke til andre kjøretøy med registrert nummer. |

Registrert i `LIST_TABLES.vehicles` i `storage.airtable.js` SAMTIDIG som
feltet tas i bruk i `index.html` (feltregelen). Opprettes automatisk i
Airtable av «🔄 Synkroniser Airtable» i Innstillinger → ⚙️ Systeminnstillinger
→ 📡 Database status (krever `schema.bases:write`). Eksisterende kjøretøy
får tom verdi inntil den fylles ut — ingen migrering nødvendig, ingen
eksisterende felt endret eller fjernet.

**Prioritet 37 (2026-09-08) — to nye felt på `Vehicles`:**

| App-felt | Airtable-felt | Type | Verdier | Brukes til |
|---|---|---|---|---|
| `drivstoff` | `Drivstoff` | singleLineText | `diesel`, `bensin`, `elektrisk`, `hybrid`, `hvo`, `annet` (lagres som nøkkelen, vises via `DRIVSTOFF_LABEL` i `index.html`) | Vises i Kjøretøyprofil (identitetslinje + Kjøretøyinformasjon) og i Biloversikt (bilkort + Dashboardets biltabell) |
| `mobilitetsgaranti` | `Mobilitetsgaranti` | singleLineText | Fritekst, f.eks. «Mercedes Service24h – gyldig til 14/08/2027» | Operativt felt ved havari/veihjelp. Vises som eget, fremhevet felt øverst i Kjøretøyprofilen. Forklarende hjelpetekst for et TOMT felt flyttet til Informasjonsveilederen i Prioritet 45 — selve feltet/visningen er uendret. |

`Driftslag` (Vehicles) var det forrige nye feltet, lagt til i Prioritet 27.1 og
korrekt registrert i `LIST_TABLES` — sendes og leses korrekt. Ingen
navneendringer på eksisterende felt er gjort.

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

**Beslutning (Prioritet 29, Del 11 — verifisert og avklart):** feltene
er IKKE orphaned på datalagnivå slik den forrige revisjonen antok. Begge er
registrert i `LIST_TABLES.aktiveSaker.fields` i `storage.airtable.js` og blir
derfor faktisk lest tilbake til minnet av den generiske
`fromAirtableFields()`-funksjonen ved hver henting fra Airtable — de
"forsvinner" ikke, og verdien finnes i `sak.registrationNumber`/
`sak.assignedTo` etter innlasting. Det opprinnelige funnet ("orphaned/write-
only") gjaldt kun at ingen UI-visning i dag leser disse to feltene fra
minnet, ikke at data-laget mister dem.

Valgt løsning: **behold begge felt, fortsett å skrive dem** (alternativ 3 i
oppgavebeskrivelsen — bevisst redundans, dokumentert her). Årsak: siden
`toAirtableFields()` skriver `''` for `undefined`/`null` på ALLE felt ved
enhver full re-lagring av en sak (se `saveAktiveSaker()`/
`saveAktiveSakerEllerKast()`), ville det å SLUTTE å skrive disse to feltene
aktivt overskrive/slette eksisterende historiske verdier for alle saker som
senere blir lagret på nytt (f.eks. ved statusendring) — i direkte konflikt
med sikkerhetsregel 2/3 i Prioritet 29 ("bevar eksisterende Airtable-data",
"ingen eksisterende poster skal slettes"). Å begynne å lese dem tilbake inn
i UI (alternativ 1) er en egen, ny funksjonsendring utenfor denne
stabiliseringsoppgavens omfang ("gjør minst mulig kodeendring for å oppnå
målet") og er derfor ikke gjort her. Ingen kodeendring er utført for Del 11
— kun denne avklaringen/dokumentasjonen.

## 8. Database status — automatisk skjemasjekk (Innstillinger)

`EXPECTED_SCHEMA` bygges automatisk fra `LIST_TABLES` (pluss egne,
hardkodede oppføringer for `Settings` og `Photos`). Database status —
Innstillinger → ⚙️ Systeminnstillinger → 📡 Database status (nestet dropdown
siden Prioritet 45; funksjonaliteten selv er UENDRET) — viser:

1. Versjonsmerke (`storageAirtableInfo.versjon` vs. forventet versjon i
   `index.html`)
2. Synkroniseringsstatus (se punkt 4 over)
3. Skjemasjekk mot faktisk Airtable-struktur (krever `schema.bases:read`,
   automatisk oppretting av manglende felt krever `schema.bases:write`)

## 9. Servicehistorikk/planlagteservicer — vurdert radbasert migrering (Prioritet 29, Del 7)

Den forrige tekniske revisjonen anbefalte å vurdere å flytte
`servicehistorikk` og `planlagteservicer` fra én samlet JSON-blob per
datasett i `Settings`-tabellen (se seksjon "Service" i CLAUDE.md) til egne,
radbaserte Airtable-tabeller — av hensyn til Airtables praktiske
feltstørrelsesgrense ved fortsatt vekst over mange år/kjøretøy.

**Verifisert direkte mot den faktiske produksjonsbasen** (les-only
skjemainspeksjon, `baseId` kryssjekket mot `airtable-config.js` og bekreftet
identisk): basen inneholder IKKE noen `ServiceHistory`- eller
`PlannedServices`-tabell i dag. Fullstendig liste over faktiske
Bilpark-relevante tabeller i basen: `Vehicles`, `DriverChecks`, `Damages`,
`WarningLights`, `WorkshopAppointments`, `Users`, `Settings`, `TireChanges`,
`Photos`, `TireCosts`, `AktiveSaker` — nøyaktig samme sett som
`LIST_TABLES` i `storage.airtable.js` allerede forventer, ingen flere.

**Følgelig, per sikkerhetsregel 7 ("ikke gjett tabellstruktur, ikke koble
appen til ikke-eksisterende tabeller") og oppgaveteksten for Del 7 sin
"tabeller finnes ikke"-gren:** radbasert migrering er IKKE aktivert i denne
runden. Ingen kode i `index.html`/`storage.airtable.js` forsøker å lese fra
eller skrive til tabeller som ikke finnes. I stedet er selve
Settings-blob-tilnærmingen gjort vesentlig tryggere i denne stabiliserings-
runden (se CLAUDE.md, "Dataintegritet" og "Service"):

- Serialisert skriving per Settings-nøkkel (Del 2 — per-ressurs kø i
  `storage.airtable.js`, utvidet til også å dekke lesing i Prioritet 43)
  hindrer at to samtidige lagringer av samme JSON-blob kan overskrive
  hverandre, og at en lesing kan starte midt i en ikke-fullført skriving.
- Trygg JSON-parsing med eksplisitt `{ok, value}`/`{ok, error}`-status
  (Del 4, `parseJsonTrygt()`) hindrer at korrupt JSON stille blir til et
  tomt array — datasettet flagges i stedet som korrupt, lagring blokkeres,
  og brukeren varsles tydelig i Innstillinger → Database status og ved
  oppstart.
- Rollback ved lagringsfeil (Del 3, `mutasjonMedRollback()`) hindrer at
  lokal tilstand kan vise en endring som faktisk ikke ble lagret i
  Airtable.

Dersom radbasert migrering skal aktiveres i en senere, egen godkjent
migreringssak, er dette mål-datamodellen (kun til referanse — IKKE
implementert):

**Ny tabell `ServiceHistory`** (én rad per historisk service, én per
kjøretøy og hendelse):

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| vehicleId | VehicleId | tekst |
| dato | Dato | tekst |
| km | Km | tall |
| type | Type | tekst |
| verksted | Verksted | tekst |
| kommentar | Kommentar | tekst |
| createdAt | CreatedAt | tekst |
| createdBy | CreatedBy | tekst |
| fraPlanlagtServiceId | FraPlanlagtServiceId | tekst (valgfri — sporbarhet til opprinnelig planlagt avtale, se Del 8) |

**Ny tabell `PlannedServices`** (én rad per planlagt serviceavtale):

| App-felt | Airtable-kolonne | Type |
|---|---|---|
| id | AppId | tekst |
| vehicleId | VehicleId | tekst |
| dato | Dato | tekst |
| tidspunkt | Tidspunkt | tekst |
| verksted | Verksted | tekst |
| kommentar | Kommentar | tekst |

En eventuell fremtidig migrering må følge de samme sikkerhetsreglene som
gjaldt for denne oppgaven: idempotent (kan kjøres flere ganger uten
duplikater, f.eks. ved å bruke eksisterende `id` som unik nøkkel),
lese-tilbake-verifisering av alle migrerte rader før den gamle
Settings-verdien fjernes, og den gamle Settings-blob-verdien beholdes som
sikkerhetskopi inntil migreringen er bekreftet vellykket.

## 10. Oppsettsguide (uendret prosedyre)

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
4. Åpne appen og bekreft i Innstillinger → ⚙️ Systeminnstillinger → 📡
   Database status at versjonsmerket og skjemasjekken er grønne.

## 11. Prioritet 39 (Mobil Design 4.1) — ingen databaseendring

Mobil Design 4.1 er en ren layout-/CSS-/komponent-/navigasjonsendring. Runden
har **ikke** lagt til, endret eller fjernet noen Airtable-tabell eller noe felt.
`LIST_TABLES` er derfor uendret for denne runden, og ingen migrering kreves.

## 12. Prioritet 40 (Aktiv sjåfør) — ingen databaseendring

Prioritet 40 bruker de EKSISTERENDE feltene `Vehicles.aktivSjafor` og
`Vehicles.aktivSjaforSiden` (begge allerede registrert i `LIST_TABLES.vehicles`).
Ingen nye tabeller, ingen nye felt, ingen migrering for denne runden.

## 13. Prioritet 41 (Redigerbare bilkategorier) — ingen strukturendring

Kategoriregisteret lagres som **én rad i den eksisterende `Settings`-tabellen**,
med `Key = 'bilkategorier'` og `Value` = JSON-array `[{id, navn, ikon}]` — nøyaktig
samme mønster som `verksteder`, `servicehistorikk` og `planlagteservicer`. Dette
er bevisst valgt fremfor en ny tabell: ingen `LIST_TABLES`-endring, ingen nye felt,
ingen migrering for denne runden.

`Vehicles.Kategori` er UENDRET og inneholder fortsatt kategori-**id-en**
(`bil`/`lastebil`/`montering`/`reserve`, eller en generert id for nye kategorier).
Feltet skrives ALDRI om når en bil settes ute av drift — `🚫 Ute av drift` er en
ren visningsgruppe beregnet fra `Vehicles.UteAvDrift`.

## 14. Prioritet 43 (Kilometerstand-race) — ingen databaseendring

`get()` i `storage.airtable.js` sendes nå gjennom samme skrivekø som
`set()`/`delete()` (se CLAUDE.md, "Prioritet 43"). Dette er en ren
synkroniseringsfiks internt i `storage.airtable.js` — ingen tabell eller
felt er lagt til, endret eller fjernet. `versjon`/`?v=` økt til `2.10.0` for
selve kodefiksen (senere økt videre til `2.11.0` i Prioritet 45, se seksjon 1).

## 15. Prioritet 44 (🎨 Layout Editor) — ny Settings-nøkkel, ingen ny tabell

Se seksjon 3, `dashboard-layout`. Ingen `LIST_TABLES`-endring — Settings-
nøkler krever ingen kodeendring i `storage.airtable.js` utover det
allerede-generiske get()/set()-sporet som `theme-preference`/`bilkategorier`
allerede bruker.

## 16. Prioritet 46 (Rapporter, Carglass Ruteskift, Verkstedtime 2.0) — ingen databaseendring

Ingen nye Airtable-tabeller eller -felt. To allerede-registrerte felt
gjenbrukes med UTVIDET betydning på applikasjonsnivå, uten noen endring i
`LIST_TABLES` eller Airtable-skjemaet:

- **`WorkshopAppointments.Type`** (app-felt `type`, registrert siden en
  tidligere EU-kontroll-prioritet): lagret verdi kan nå være en
  kommaseparert liste (`'eu-kontroll'`, `'ruteskift'`, eller
  `'eu-kontroll,ruteskift'`) istedenfor kun `'eu-kontroll'`/`''`. Feltet er
  fortsatt `singleLineText` i Airtable — ingen skjemaendring, kun en ny måte
  å tolke tekstinnholdet på i `index.html` (`vtHarType()`). Eksisterende
  rader med `'eu-kontroll'` eller tom streng leses uendret riktig
  (`'eu-kontroll'.split(',')` gir `['eu-kontroll']`, som fortsatt inneholder
  `'eu-kontroll'` — ingen migrering av eksisterende data nødvendig).
- **`Vehicles.Telefon`** (app-felt `telefon`, registrert i Prioritet 45):
  ingen endring i selve feltet — kun en ny visningsplass (Kjøretøyprofil →
  Kjøretøyinformasjon, i tillegg til den eksisterende Ringeliste-visningen).

`storage.airtable.js` `versjon` forblir `v2.11.0`; `?v=` i
`index.html`/`kontroll.html` forblir `2.11.0`.
