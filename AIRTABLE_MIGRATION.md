# Bilpark → Airtable: arkitekturplan og oppsettsguide

Dette dokumentet beskriver hvordan Bilpark bruker **Airtable** som sentral
database i stedet for lokal lagring (`localStorage`/`sessionStorage`) —
appen selv er **ikke** bygget om, kun lagringslaget bak den.

## 0. Viktig forbehold — les dette først

Airtable har **ikke** noe innebygd system for å begrense hva en API-nøkkel
kan gjøre basert på hvem som spør (slik Firebase Firestore-regler kan). En
nøkkel med tilgang til basen gir **full lese- og skrivetilgang til alt** i
den, og siden dette er en ren, statisk nettside uten egen server, ligger
nøkkelen **synlig i nettleseren** for alle som besøker siden. Se
`airtable-config.js` for samme forbehold i klartekst, med forslag til hvordan
risikoen reduseres (Personal Access Token skalert til kun denne basen, del
aldri lenken offentlig, osv.). Dette er en vesentlig svakere sikkerhetsmodell
enn en ekte backend — vurder dette nøye før dere legger inn
forretningskritiske eller sensitive data.

En annen praktisk konsekvens: Airtables gratisnivå tillater **5 kall i
sekundet per base**. Med mange samtidige brukere kan dere støte på
hastighetsbegrensninger — se punkt 6.

## 1. Hva som endres, i korte trekk

| I dag (lokalt/Firebase) | Nå (Airtable) |
|---|---|
| `localStorage`/Firestore | **Airtable** — én rad per oppføring i egne tabeller |
| Firebase Authentication | Enkel brukernavn/passord-sjekk mot Airtable-tabellen **Users** (Airtable har ingen egen innloggingsfunksjon) |
| `sessionStorage` (husket innlogging) | Ingen — sesjonen holdes kun i minnet. Laster du siden på nytt, må du logge inn igjen |
| Firestore sanntidsoppdatering (`onSnapshot`) | **Periodisk oppfrisking** (hvert 20. sekund) — Airtables vanlige API har ingen sanntids-push, se punkt 5 |

Grensesnittet appen bruker mot lagring (`window.storage.get/set/delete/list`)
er **uendret**, så det aller meste av appens forretningslogikk er urørt.

## 2. Airtable-tabeller som opprettes

| Tabell | Tilsvarer i appen | Én rad = |
|---|---|---|
| **Vehicles** | Bilregister + Løyvenummer | ett kjøretøy |
| **DriverChecks** | Sjåførkontroller + Kontrollhistorikk | én innsendt kontroll |
| **Damages** | Skader | én skade |
| **WarningLights** | Varsellamper (aktive og kvitterte) | én varsellampe-hendelse |
| **WorkshopAppointments** | Verkstedtimer | én verkstedavtale |
| **TireCosts** | Dekkkostnader (Kostnadsoversikt) | én dekkregistrering med kostnad |
| **AktiveSaker** | Aktive Saker | én sak/oppfølgingspunkt for et kjøretøy |
| **Users** | Administratorbrukere | én administrator |
| **Settings** | Systeminnstillinger (tema, verkstedregister) og bilder | én nøkkel/verdi-rad |

Alle tabeller (unntatt Settings) trenger et tekstfelt **`AppId`** i tillegg
til de vanlige feltene — det er appens egen, interne id (ikke Airtables eget
rad-id), og brukes til å koble sammen data på tvers av tabeller (f.eks.
hvilket kjøretøy en sjåførkontroll gjelder).

### Feltoversikt per tabell

**Vehicles**: `AppId` (text), `Bilnummer` (text), `Regnr` (text), `Merke`
(text), `Modell` (text), `Årsmodell` (text), `Kategori` (text: bil/lastebil/
montering), `Status` (text: ok/oppfolging/verksted), `Dekk` (text), `KM`
(number), `Løyvenummer` (text), `HasPhoto` (checkbox)

**DriverChecks**: `AppId`, `VehicleId` (text — samme verdi som `AppId` på
den aktuelle Vehicles-raden), `Dato` (text, DD/MM/ÅÅÅÅ), `Tidspunkt` (text),
`Sjafor` (text), `KM` (number), `Varsellamper` (long text — lagres som
JSON-liste), `AnnetTekst` (text), `HarNyeSkader` (checkbox),
`SkadeBeskrivelse` (long text), `SkadeBilderCount` (number), `Kommentar`
(long text), `LinkedDamageId` (text)

**Damages**: `AppId`, `VehicleId` (text), `Dato` (text), `Beskrivelse` (long
text), `Alvorlighet` (text), `Kommentar` (long text), `Status` (text),
`RegistrertAv` (text), `HasPhoto` (checkbox), `CreatedByControlId` (text),
`EstimertKostnad` (number — estimert kostnad på skaden, valgfritt, beholdes
selv om skaden lukkes)

**WarningLights**: `AppId`, `VehicleId` (text), `Type` (text), `AnnetTekst`
(text), `Status` (text: aktiv/kvittert), `RegistrertDato` (text),
`RegistrertAv` (text), `KvittertDato` (text), `KvittertAv` (text),
`CreatedByControlId` (text)

**WorkshopAppointments**: `AppId`, `VehicleId` (text), `Verksted` (text),
`Dato` (text), `Tidspunkt` (text), `Beskrivelse` (long text), `Notater`
(long text), `Pris` (number — kostnad/verkstedregning for registreringen)

**TireCosts**: `AppId`, `VehicleId` (text), `Dato` (text), `Kostnad`
(number), `Kommentar` (long text) — registrert fra Kostnadsoversikt
("🛞 Nye dekk"), adskilt fra den eksisterende dekkskifte-loggen
(sommer/vinter-bytte, se TireChanges).

**AktiveSaker** (ny i "Aktive Saker — Fase 1", grunnmur for fremtidig
avviksoppfølging): `AppId`, `CaseId` (text — kort lesbart saksnummer, f.eks.
"SAK-0001"), `VehicleId` (text), `RegistrationNumber` (text — øyeblikksbilde
av regnr på registreringstidspunktet), `CaseType` (text — én av
`varsellampe`/`skade`/`kontrollavvik`/`dekk`/`service`/`annet`), `Title`
(text), `Description` (long text), `Status` (text — én av
`ny`/`vurderes`/`tiltak-planlagt`/`verksted-bestilt`/`utfort`/`lukket`,
standard `ny`), `Priority` (text — én av `lav`/`normal`/`hoy`/`kritisk`,
standard `normal`), `SourceType` (text — tom/`manuell` i Fase 1; brukes i
Fase 2 til å spore automatisk opprettede saker fra varsellamper/skader/
kontroller), `SourceId` (text — id til kildeposten i Fase 2, tom i Fase 1),
`ReportedBy` (text), `ReportedAt` (text), `AssignedTo` (text), `NextAction`
(long text), `FollowUpDate` (text), `ResolvedAt` (text), `ResolvedBy`
(text), `ResolutionNote` (long text), `CreatedAt` (text — ISO-tidsstempel),
`UpdatedAt` (text — ISO-tidsstempel)

**Users**: `AppId`, `Rolle` (text), `Tittel` (text), `Brukernavn` (text),
`Passord` (text — **lagres i klartekst**, se sikkerhetsforbeholdet i punkt 0)

**Settings**: `Key` (text), `Value` (long text) — brukes til temavalg,
verkstedregisteret, og bilder (som `photo:<id>` → base64-tekst i `Value`).
**Obs:** Airtable har en grense på ca. 100 000 tegn per long text-felt —
store bilder i full oppløsning kan i sjeldne tilfeller sprenge denne. Appen
komprimerer bilder før lagring, men vurder om bilder heller bør lagres et
annet sted (f.eks. Airtable-vedleggsfelt eller ekstern bildehosting) om dere
opplever feil ved lagring av bilder.

Feltnavnene med tekst-typer kan gjerne settes opp som Airtables "Single
select" i stedet for ren tekst der det gir mening (f.eks. `Status`,
`Kategori`, `Type`) — appen leser/skriver dem uansett som ren tekst, så
begge varianter fungerer.

## 3. Slik oppretter du Airtable-basen

1. Gå til [airtable.com](https://airtable.com) og logg inn (eller opprett
   konto).
2. Klikk «Create a base» → «Start from scratch» → gi den et navn, f.eks.
   «Bilpark».
3. Opprett de 7 tabellene fra punkt 2, med feltene som beskrevet der. Slett
   Airtables standard "Name"-felt i hver tabell om du ønsker (ikke i bruk),
   eller la det stå urørt — appen bryr seg ikke om ekstra felt som ikke er i
   listen over.
4. Finn **Base ID** (starter med `app...`): åpne basen, klikk «Help» → «API
   documentation» (eller gå til
   [airtable.com/api](https://airtable.com/api) og velg basen) — Base ID-en
   står øverst i dokumentasjonen som genereres.

## 4. Slik oppretter du API-nøkkelen (Personal Access Token)

Airtable har faset ut de gamle, kontobrede API-nøklene til fordel for
**Personal Access Tokens (PAT)**, som kan begrenses til kun én base:

1. Gå til [airtable.com/create/tokens](https://airtable.com/create/tokens).
2. Klikk «Create new token».
3. Gi det et navn, f.eks. «Bilpark app».
4. Under **Scopes**, legg til:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read` — kreves for «⚙️ Database status» i Innstillinger,
     som sjekker at basen har alle tabeller/felt appen forventer
   - `schema.bases:write` — valgfritt, men kreves for at «🔄 Synkroniser
     Airtable» skal kunne opprette manglende tabeller/felt automatisk i
     stedet for at du må legge dem til manuelt. Utelates dette scopet,
     fungerer resten av appen helt normalt — du får bare en tydelig
     feilmelding i Database status i stedet for automatisk oppretting.
5. Under **Access**, velg «Add a base» og velg Bilpark-basen din spesifikt
   (ikke «All current and future bases»).
6. Klikk «Create token» — kopier tokenet med det samme (det vises kun én
   gang). Det starter med `pat...`.

**Har du allerede et token fra tidligere** (kun `data.records:*`)? Det
fungerer fortsatt for hele appen som før — «Database status» vil bare vise
en feilmelding om manglende tilgang til å lese/endre struktur i stedet for
et rapportresultat. Gå til
[airtable.com/create/tokens](https://airtable.com/create/tokens), åpne det
eksisterende tokenet, og legg til de to nye scopene der for å aktivere
funksjonen — du trenger ikke lage et helt nytt token.

## 5. Slik kobler du appen til Airtable

Åpne `airtable-config.js` i pakken og fyll inn:
```js
const AIRTABLE_CONFIG = {
  baseId: 'appXXXXXXXXXXXXXX',      // fra punkt 3.4
  token: 'patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'  // fra punkt 4.6
};
```
Det er alt som trengs — resten av appen henter og lagrer data via dette
automatisk gjennom `storage.airtable.js`.

**Om "sanntid":** Airtables vanlige API har ingen push-varsling når data
endres fra en annen enhet (Firestore-versjonen hadde dette via
`onSnapshot`). Appen løser dette med **periodisk oppfrisking** (standard
hvert 20. sekund, styrt av `POLL_INTERVAL_MS` i `storage.airtable.js`) —
Dashboard/historikk oppdateres altså automatisk, men med inntil ca. 20
sekunders forsinkelse i stedet for umiddelbart. Sett tallet lavere for
raskere oppdatering, men vær da oppmerksom på Airtables grense på 5
kall/sekund per base (punkt 0) dersom mange bruker appen samtidig.

## 6. Filer som er endret eller lagt til

| Fil | Endring |
|---|---|
| `index.html` | `<head>` laster `airtable-config.js` + `storage.airtable.js` i stedet for Firebase. Innlogging er tilbake til enkel brukernavn/passord-sjekk mot `adminUsers`-listen (nå Airtable-backet), uten `sessionStorage`. |
| `airtable-config.js` **(ny)** | Base ID + Personal Access Token (fyll inn selv, se punkt 3-4). |
| `storage.airtable.js` **(ny, erstatter storage.firebase.js)** | Airtable-backet implementasjon av `get/set/delete/list`, med avstemming (reconciliation) mellom appens datasett og Airtable-radene, samt periodisk oppfriskning. |
| `sw.js` | Oppdatert til å hverken cache eller gripe inn i forespørsler til `api.airtable.com`. |
| `kontroll.html` | Ingen endring. |
| `firebase-config.js`, `storage.firebase.js`, `firestore.rules`, `firebase.json`, `.firebaserc`, `firestore.indexes.json` | **Fjernet** — ikke lenger i bruk. |

## 7. Slik publiserer du løsningen på GitHub etterpå

1. **Opprett et nytt repository** på [github.com/new](https://github.com/new)
   — velg et navn (f.eks. `bilpark`), og la det være **privat** (anbefales
   sterkt siden `airtable-config.js` inneholder et reelt tilgangstoken —
   se punkt 0).
2. **Last opp filene** — enklest via nettleseren: åpne det nye repoet →
   «Add file» → «Upload files» → dra inn alle filene fra denne pakken
   (inkludert `icons/`-mappen) → «Commit changes». (Alternativt, med Git
   installert lokalt: `git init`, `git add .`, `git commit -m "Bilpark"`,
   `git branch -M main`, `git remote add origin <repo-url>`, `git push -u
   origin main`.)
3. **Aktiver GitHub Pages:** i repoet → «Settings» → «Pages» (venstremeny)
   → under «Build and deployment» → «Source»: velg «Deploy from a branch» →
   «Branch»: `main`, mappe `/ (root)` → «Save».
4. Etter ca. ett minutt er siden tilgjengelig på
   `https://<brukernavn>.github.io/<repo-navn>/`. Sjåførlenken blir da
   `https://<brukernavn>.github.io/<repo-navn>/kontroll.html`.
5. **Viktig ved privat repo + GitHub Pages:** vurder om siden bør være
   offentlig tilgjengelig i deres tilfelle, siden `airtable-config.js` sitt
   token uansett blir synlig for alle som besøker den *publiserte* siden
   (kildekoden i nettleseren), helt uavhengig av om selve GitHub-repoet er
   privat. Et privat repo hindrer kun at tilfeldige personer finner tokenet
   ved å bla i kildekoden på GitHub selv — den publiserte nettsiden er,
   som forklart i punkt 0, uansett åpen for alle med lenken.
6. **Ved senere endringer:** last opp de endrede filene på nytt (samme
   «Upload files»-fremgangsmåte, eller `git push` om du bruker Git lokalt) —
   GitHub Pages oppdaterer automatisk innen ett-to minutter.

## 8. Hva som gjenstår / bør vurderes videre

- **Bilder** kan i sjeldne tilfeller bli for store for et Airtable long
  text-felt (se punkt 2) — vurder ekstern bildehosting om dette oppstår.
- **Rate limits:** med mange samtidige brukere, vurder å øke
  `POLL_INTERVAL_MS` i `storage.airtable.js`, eller undersøke Airtables
  betalte nivåer med høyere grenser.
- **Reell sikkerhet** krever en egen backend/proxy foran Airtable-kallene —
  utenfor denne løsningens omfang som en ren, statisk side.
- **Testing:** jeg har kontrollert at koden er syntaktisk korrekt, men har
  ikke kunnet teste den mot en ekte Airtable-base herfra (ingen nettverks-
  eller nettlesertilgang i dette miljøet) — en grundig gjennomgang i egen
  nettleser mot deres faktiske base er nødvendig før dette tas i reell bruk.

## 9. Database status — automatisk skjemasjekk (Innstillinger)

For å unngå at fremtidige nye funksjoner (nye felt/tabeller) glemmes å
opprettes manuelt i Airtable, sjekker appen automatisk i bakgrunnen — stille,
ved oppstart og ved innlogging — om basen har alle tabeller og felt den
forventer, basert på den samme `LIST_TABLES`-oppsettet i
`storage.airtable.js` som resten av appen bruker (én kilde til sannhet: nye
felt lagt til der plukkes automatisk opp av sjekken).

- Finner den avvik, vises et gult varsel øverst på Dashboard.
- Full detalj (hvilke tabeller/felt som mangler) finnes under
  **Innstillinger → Database status**.
- **«🔄 Synkroniser Airtable»**-knappen sjekker på nytt, og forsøker
  deretter å **opprette manglende tabeller/felt automatisk** via Airtables
  metadata-API — men KUN om tokenet har scopet `schema.bases:write` (se
  punkt 4). Uten det scopet får du i stedet en tydelig feilmelding per felt,
  og må legge dem til manuelt i Airtable.
- Appen oppretter **aldri** noe automatisk uten at en administrator selv
  trykker synkroniser-knappen — bakgrunnssjekken ved oppstart varsler kun.
