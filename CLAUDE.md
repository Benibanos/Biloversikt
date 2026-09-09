# CLAUDE.md — Bilpark Operativsystem

Prosjektets kilde til sannhet. Sist konsolidert: 2026-09-09 (Prioritet 41 —
Redigerbare bilkategorier + systemstyrt Ute av drift). **Ved avvik mellom
denne filen og koden er koden alltid sannheten.**

---

## Prosjektkontekst (kort oppstart for nye Claude-økter)

Bilpark Operativsystem er et operativt styringssystem for bilparken til
Bring Larvik (~16 kjøretøy, ~40 ansatte som bytter bil gjennom turnus —
aldri fast sjåfør på fast bil). Ikke et bilregister — et system som sikrer
at riktig informasjon fører til riktig handling. Driftskoordinator er
primærbruker (oppfølging, verksted, skader, varsellamper, dekk, kostnader);
sjåfører registrerer kontroll/avvik/skader via en egen, innloggingsfri URL.

Arkitektur: **GitHub Pages (frontend) + Airtable (backend)**, PWA-støtte,
ett samlet `index.html`-dokument, autoritativ storage-fil
`storage.airtable.js` (v2.8.1). Mobil = handlingsdrevet. Desktop =
kontrollsenter. Ingen Android/APK/TWA/Netlify/Vercel-distribusjon — se
"Arkitektur" under for full måldefinisjon.

Kritiske regler som aldri skal brytes: et nytt felt MÅ registreres i
`LIST_TABLES` i `storage.airtable.js` samtidig som det tas i bruk i
`index.html`, ellers forsvinner det stille; `v.km` skrives KUN fra
`submitKontroll()` (normal drift), `performKontrollDeletion()`
(rekalkulering ved sletting) eller `resetFleetData()` (eksplisitt
admin-nullstilling) — se "Service" under for full liste over tillatte
skrivepunkter; ingen databasefelt fjernes uten eksplisitt instruks; øk
`?v=` i `index.html` OG `versjon` i `storage.airtable.js` sammen ved enhver
endring i storage-filen.

Kjente, uferdige områder: "manuell overstyring mellom mobil-/
desktopvisning" er bekreftet IKKE implementert i kode (verifisert tre
ganger uavhengig, se ROADMAP.md) — ikke anta at den finnes. Eksisterende
km-data bør kontrolleres manuelt for historiske feil fra en nå rettet
service-km-overskrivingsbug (se "Service" under).

**Prioritet 29 (2026-09-07) — kritisk datasikkerhet og stabilisering:**
felles dobbel-innsendingsbeskyttelse (`beskyttSubmit()`/`beskyttKlikk()`),
en serialisert per-ressurs skrivekø i `storage.airtable.js`
(`_koKjor()`/`_skriveKoer`), rollback-på-lagringsfeil for kritiske
mutasjoner (`mutasjonMedRollback()`), trygg JSON-parsing med eksplisitt
ok/feil-status for Settings-blobene `servicehistorikk`/`planlagteservicer`
(`parseJsonTrygt()`), opprydding av gjensidige referanser mellom
`AktiveSaker` og `WorkshopAppointments` ved sletting, en confirm-gate rundt
direkte km-endring i `saveVehicleForm()`, batchet bakgrunnspoll-rendering
(`_lagBatchetLiveSyncHandler()`), og full livssyklus (rediger/fullfør/
slett) for planlagte servicer. Se "Dataintegritet", "Service" og
"Regler for Claude / videre utvikling" under for full detalj.

**Prioritet 31 (2026-09-07) — regresjonsfiks: sjåførkontroll kunne henge for
alltid uten feilmelding.** Root cause: Prioritet 29 sin serialiserte
skrivekø (`_koKjor()` i `storage.airtable.js`) kjeder alle `set()`/`del()`-
kall mot SAMME Airtable-ressurs (f.eks. `Vehicles`/`DriverChecks`) bak
hverandre med `.then()`. `airtableFetch()` hadde ingen timeout — en enkelt
hengende forespørsel (typisk ved dårlig mobildekning i en bil) ble dermed
ALDRI avgjort, og `.then()`-kjeden ventet for alltid. Enhver senere
`submitKontroll()`-innsending mot samme tabell (uansett hvilken bil/sjåfør,
i samme åpne fane) ble da låst bak den hengende skrivingen permanent — uten
feilmelding, uten bekreftelse, uten lagring. Før Prioritet 29 påvirket en
hengende forespørsel kun den ene handlingen; skrivekøen gjorde feilen
appbred og vedvarende. Rettet ved å gi `airtableFetch()` en eksplisitt
20-sekunders timeout (`AbortController`), slik at enhver forespørsel alltid
AVGJØRES (lykkes eller feiler synlig) — som igjen lar `_koKjor()` sin kø
fortsette til neste operasjon uansett hvor dårlig forbindelsen er. Se
"Dataintegritet" under for full detalj. Bekreftet med en dynamisk,
reprodusert test (ikke bare kodelesing) før og etter fiksen.

**Prioritet 32 (2026-09-07) — tydeligere brukerforståelse rundt
"forsvinnende" biler på Dashboard (ren visningsforbedring, ingen
logikkendring).** Oppfølging av en analyse (ikke feil) av
`vehicleHovedstatus()`/`vehicleAktivSjafor()`/`vehicleAktiveSaker()`, som
alle er bekreftet korrekte og UENDRET i denne runden. To reelle,
bevisste mekanismer i eksisterende kode kunne likevel oppleves som at biler
"forsvant" uten grunn:

1. `startBilokt()` (linje ~1669–1690) nullstiller automatisk en annen bils
   `aktivSjafor` dersom samme sjåførnavn allerede sto aktiv der (regelen
   "én sjåfør, én aktiv biløkt" — uendret). Sjåføren får nå et synlig
   `alert()`-varsel når dette skjer, med navn på sjåfør og hvilken bil som
   ble sjekket ut, i stedet for at det skjer stille.
2. Dashboardets "Krever handling nå" og "Prioriterte biler" bygger begge på
   `dashKreverListe`, kuttet til topp 5 (`.slice(0, 5)`). En endring på én
   bil (ny sak, kontroll registrert) kan dermed skyve en annen, uendret bil
   inn eller ut av de synlige 5 — et rent visningsfenomen, ikke en
   datafeil. Begge kort viser nå "Viser 5 av X — +X flere …" når listen er
   avkortet, slik at avkortingen er synlig i stedet for at biler ser ut
   til å forsvinne.

Ingen endring i `vehicleHovedstatus()`, `vehicleAktivSjafor()`,
`vehicleAktiveSaker()`, saksmotoren, biløkt-reglene eller noe
Airtable-skjema — kun to nye, synlige tekstvarsler i eksisterende flyt.

**Prioritet 33 (2026-09-07) — "Aktiv sjåfør" betyr nå det samme overalt i
UI (ren tekst-/visningsendring, ingen logikkendring).** Rotårsak (funnet
via analyse, ikke endret): Biloversikt-kortet (`galleryCard()`) viste alltid
"👤 Aktiv sjåfør: [navn]" basert på `vehicleSisteSjafor()` (aktiv biløkt
ELLER bare siste kontroll i dag — bredere kilde, se linje ~1659), mens
filteret "🚚 Har aktiv sjåfør" i Biloversikt (`renderRegister()`, linje
~5731) bruker `vehicleAktivSjafor()` strengt (kun en LIVE biløkt akkurat
nå). En bil kunne dermed vise "Aktiv sjåfør" på kortet uten å dukke opp i
filteret — typisk en bil kontrollert i dag via administrasjonens vanlige
✅ Kontroll-ikon (som aldri kaller `startBilokt()`, se linje ~1648–1651),
eller en bil hvis biløkt siden er avsluttet (manuelt eller automatisk via
`startBilokt()`s kryss-bil-utsjekking, se Prioritet 32). Løst UTEN å røre
`vehicleAktivSjafor()`, `vehicleSisteSjafor()`, biløktlogikk eller Airtable
— kortet (`galleryCard()`) og Kjøretøyprofilens "Aktiv sjåfør"-felt
(`renderBilkort()`, "Operativ status") viser nå:
- `vehicleAktivSjafor()` sann → "👤 Aktiv sjåfør: [navn]" (alltid med i
  "Har aktiv sjåfør"-filteret)
- kun `vehicleSisteSjafor()` sann (ingen aktiv biløkt nå, men kontrollert i
  dag) → "🕓 Sjåfør i dag: [navn]" (aldri med i filteret)
- ingen av delene → "⚪ Tilgjengelig" / "– Ingen aktiv sjåfør"

Bekreftet med dynamisk test: alle biler filtrert frem av "Har aktiv
sjåfør" viser nå "👤 Aktiv sjåfør" på kortet, og ingen bil utenfor filteret
viser det. **Delvis avløst av Prioritet 34 under** — se den for hvorfor
"🕓 Sjåfør i dag" nå kun oppstår for eldre/legacy-tilfeller, ikke for nye
kontroller uansett kanal. Fortsatt kjent, bevisst gjenstående inkonsistens:
Excel-eksportenes "Aktiv sjåfør"-kolonne (Bilparkrapport,
`rapportEksporterExcel()`) bruker fortsatt `vehicleSisteSjafor()` uendret —
vurder om denne også bør presiseres ved behov.

**Prioritet 34 (2026-09-07) — Aktiv sjåfør følger turnus, uansett
registreringskanal (logikkendring, ikke bare visning).** Bring har ingen
fast sjåfør på fast bil — "Aktiv sjåfør" skal derfor bety **hvem som
disponerer bilen i inneværende skift**, ikke bare hvem som har startet en
teknisk biløkt via sjåfør-URL-en. Rotårsak til at dette ikke stemte
operativt (dokumentert allerede i Prioritet 26.7-kommentaren ved
`vehicleSisteSjafor()`): `v.aktivSjafor` ble KUN satt av `startBilokt()`,
som igjen KUN ble kalt fra `driverMode`-grenen i `submitKontroll()`. En
kontroll registrert av en driftskoordinator via det vanlige ✅
Kontroll-ikonet i administrasjonsdelen satte derfor ALDRI "Aktiv sjåfør",
selv om sjåføren fortsatt disponerte bilen resten av skiftet — dette var
den egentlige, underliggende årsaken bak Prioritet 32/33 sine symptomer.

Løsning: selve tildelingen (kryss-bil-utsjekking + varsel + feltoppdatering
på `v.aktivSjafor`/`v.aktivSjaforSiden`) er skilt ut i en ny funksjon,
**`settAktivSjaforForKontroll(vehicleId, navn)`** (linje ~1677 i
`index.html`). `submitKontroll()` kaller nå denne funksjonen fra BEGGE
grener — `driverMode` (via `startBilokt()`, som er uendret i oppførsel og
fortsatt eneste sted som setter sjåførens lokale enhets-sesjon
`driverActiveVehicleId`/`saveDriverLocalSession()`) OG administrasjonsdelen
(direkte, uten å røre den lokale sesjonen — en administrator som
registrerer på vegne av noen andre skal ikke overstyre sin egen enhets
sjåførtilstand). Kryss-bil-utsjekkingsvarselet fra Prioritet 32 ("Ola
Hansen var allerede aktiv på Bil 5 …") vises nå identisk uansett hvilken
kanal kontrollen ble registrert fra.

**`vehicleAktivSjafor()` og `vehicleSisteSjafor()` er UENDRET** — dette er
bevisst en endring av NÅR/HVOR feltene de leser fra faktisk blir satt, ikke
av selve lesefunksjonene. Konsekvens: "🚚 Biler i drift" og "👤 Aktiv
sjåfør" blir nå sanne for enhver bil kontrollert i dag, uansett
registreringskanal, og forblir det gjennom skiftet inntil: (a) en annen
sjåfør registrerer en ny kontroll på samme bil (overskriver naturlig,
ingen ny logikk), (b) samme sjåfør registreres aktiv på en annen bil
(kryss-bil-utsjekking, uendret regel), (c) bilen sjekkes eksplisitt ut
(`avsluttBilokt()`, kun fra sjåførmodus sin "Min Bil"-skjerm — uendret),
eller (d) det operative dagskillet kl. 04:00 passeres
(`ryddOppBiloktDagskille()`, uendret). `vehicleSisteSjafor()`s fallback til
dagens siste kontroll ("🕓 Sjåfør i dag") beholdes som sikkerhetsnett for
eldre data/kanter appen ikke fanger opp — men vil i praksis nesten aldri
lenger trenge å slå inn for kontroller registrert ETTER denne endringen,
siden `v.aktivSjafor` nå alltid settes riktig med én gang, uansett kanal.

Bekreftet med dynamisk test: en kontroll registrert via administrasjonens
✅-ikon (ikke sjåfør-URL) setter nå `v.aktivSjafor` korrekt, bilen dukker
umiddelbart opp i "Har aktiv sjåfør"-filteret og viser "👤 Aktiv sjåfør" på
kortet, kryss-bil-utsjekkingsvarselet vises korrekt når sjåføren allerede
disponerte en annen bil, og administratorens egen lokale sesjon
(`driverActiveVehicleId`) forblir urørt.

**Prioritet 35 (2026-09-07) — retting av falsk versjonsalarm i Database
Status (kun diagnostikk, ingen funksjonell endring).** `FORVENTET_VERSJON` i
`renderInnstillinger()` var tidligere en TREDJE, separat, manuelt
vedlikeholdt tekstkonstant — løst ved å lese `FORVENTET_VERSJON` automatisk
fra `?v=`-parameteren på `<script src="storage.airtable.js?v=...">`-taggen
i stedet. **Korrigert i Prioritet 36 under:** denne konsolideringen påsto
feilaktig at `?v=`-parameteren og `storage.airtable.js` sin `versjon`
allerede stemte overens ("begge v2.8.1 siden Prioritet 31") — det stemte
ikke i koden slik den faktisk lå (script-taggen sto fortsatt på `?v=2.8.0`
mens `storage.airtable.js` var `v2.8.1`), og den dynamiske lesingen hadde
den gang fortsatt en hardkodet fallback-verdi (`'v2.8.1'`) i tillegg til
selve DOM-lesingen. Se Prioritet 36 for det faktiske, verifiserte bildet og
den fullstendige rettingen.

**Prioritet 36 (2026-09-08) — full prosjektopprydding og permanent
versjonsløsning (pakke-/dokumentasjonsopprydding + diagnostikkfiks, ingen
endring i forretningslogikk).** Kildegrunnlag: `Benibanos/Biloversikt`
klonet direkte fra GitHub (ikke tidligere vedlegg/ZIP-er) — hvert filnavn
verifisert mot faktisk innhold før noe ble endret.

1. **Ekte, gjenværende versjonsavvik funnet og rettet:** i motsetning til
   hva Prioritet 35-teksten over hevdet, sto `?v=`-parameteren på
   `storage.airtable.js`-script-taggen i BÅDE `index.html` og
   `kontroll.html` fortsatt på `2.8.0`, mens `storage.airtable.js` sin
   `versjon`-verdi faktisk var `v2.8.1` — et ekte, levende avvik som ville
   vist en (denne gangen korrekt) rød versjonsalarm. Rettet ved å sette
   begge script-tagger til `?v=2.8.1`, slik at de igjen samsvarer med filen
   som faktisk kjører.
2. **Tredje versjonskonstant endelig fjernet helt:** `FORVENTET_VERSJON`
   har ingen hardkodet fallback-verdi lenger (heller ikke `'v2.8.1'`) — den
   er utelukkende resultatet av å lese `?v=`-parameteren fra DOM-en, hver
   gang. Kun to versjonskilder gjenstår å holde i sync: `versjon` i
   `storage.airtable.js` og `?v=` på script-taggen i `index.html`/
   `kontroll.html`.
3. **Nøytrale, ikke-konkluderende feilmeldinger i Database status:**
   - `window.storageAirtableInfo` mangler helt →
     "🔴 storage.airtable.js er ikke lastet eller rapporterer ikke
     versjon." (tidligere tekst påsto en ubevist rotårsak: "svært gammel
     filversjon kjører fortsatt").
   - `?v=`-parameteren kan ikke leses fra script-taggen →
     "🟡 Kunne ikke lese forventet storage-versjon fra script-taggen." —
     viser ALDRI en gjettet/gammel forventet versjon.
   - Faktisk avvik mellom kjørende og forventet versjon → uendret rød
     alarm som viser begge faktiske verdier.
4. **Filoppryddning:** fjernet `release-apk.yml` (Bubblewrap/APK-utgivelse),
   `vercel.json` (Vercel-spesifikk rewrite), `_headers` og `_redirects`
   (Netlify-spesifikke, egen kommentar i `_headers` bekreftet dette) — ingen
   av de fire hadde noen aktiv referanse fra kjørende kode, kun prosjektets
   egen dokumentasjon som allerede sa at disse plattformene IKKE brukes.
   Ingen andre/duplikate `storage`-varianter, gamle ZIP-er eller
   backup-filer fantes i repoet.
5. **Ikon-plassering rettet i den leverte pakken:** `index.html`,
   `kontroll.html`, begge manifestene og `sw.js` har alltid forventet
   ikonene under en `icons/`-mappe (`icons/icon-192.png` osv.) — i det
   klonede repoet lå de tre ikonfilene derimot direkte i rot. Dette er KUN
   en flytting av filer til mappestrukturen koden allerede forventer, ingen
   kodeendring.
6. `CACHE_VERSION` i `sw.js` økt (`bilpark-v30`) siden app-shell-filene
   endret seg (`?v=` i index.html/kontroll.html, mappestruktur for ikoner).
   `storage.airtable.js` sitt INNHOLD er uendret — kun cache-busting-tallet
   som pekte på den er synkronisert, derfor er `versjon`-verdien inni filen
   fortsatt `v2.8.1`.

Ikke rørt: kilometerlogikk, sjåførkontroll/aktiv sjåfør, Dashboard, Aktive
saker, Service, EU-kontroll, Dekk, Planlegging, Rapporter, mobil-/
desktopdesign, eller noe Airtable-skjema. Se ROADMAP.md for
valideringsresultater og AIRTABLE_MIGRATION.md punkt 1 for den oppdaterte
versjonsregelen.

**Prioritet 39 (2026-09-08) — Navigasjon og ferdigstilt designretning.** Ingen
ny forretningslogikk, ingen nye Airtable-felt, ingen endring i
`storage.airtable.js`.

1. **Sidemenyen følger referansebildet:** Hjem · Biler · Bestill tjenester ·
   Kalender · Aktive saker · Påminnelser · Kostnader · Rapporter ·
   Innstillinger. Hvert punkt peker på en skjerm som ALLEREDE fantes —
   «Påminnelser» er den uendrede varsellampe-oversikten
   (`renderVarslerOversikt()`), og «Kostnader» er `renderKostnadsoversikt()`,
   som fantes men manglet menypunkt. Historikk og Analyse er flyttet ned i
   sekundærseksjonen (fortsatt fullt nåbare); Historikk nås primært fra
   Kjøretøyprofil, Aktive saker og Rapporter. Aktive saker og Påminnelser viser
   teller som rød pille (`totaltKreverHandlingCount()` / `allActiveVarsellys()`).
2. **Ny flate `renderBestillTjenester()` (screen `'bestill'`)** — menypunktet
   «🛠️ Bestill tjenester». Inneholder KUN de fire eksisterende
   hurtigbestillingskortene (`bestillService`/`bestillEuKontroll`/
   `bestillDekkskift`/`bestillVerkstedtime`) pluss en liste over kommende
   avtaler fra `flatePlanleggingData(7)`. Ingen ny logikk, ingen ny lagring.
3. **Kalender er arbeidsflaten, Planlegging er dataene.** Oppfølginger
   (`sak.followUpDate`) er lagt til i kalenderens dagsvisning, slik at alle fem
   typer — service, dekkskift, EU-kontroll, verkstedtimer og oppfølginger — nå
   vises samme sted. Seksjonen under kalenderen heter «📋 Alle kommende
   aktiviteter» i stedet for «Planlegging», så det ikke oppleves som to systemer.
4. **Kjøretøyinformasjon samler all identitetsdata:** aktiv sjåfør er lagt til,
   sammen med løyvenummer (fremhevet øverst), reg.nr, bilgruppe, biltype,
   årsmodell, drivstoff, driftslag og mobilitetsgaranti. Mobilitetsgarantien
   vises fortsatt også som eget panel øverst i profilen.
5. **Spacing-finjustering:** biltabellen på Dashboard fikk plass til alle seks
   kolonner (kolonnen «Aktiv sjåfør» heter «Sjåfør» i tabellhodet, og tom verdi
   vises som «—» med forklarende tooltip i stedet for «⚪ Tilgjengelig»).
   Biloversikt-siden er uendret.

**Prioritet 41 (2026-09-09) — Redigerbare bilkategorier + systemstyrt 🚫 Ute av
drift.** Ingen ny Airtable-tabell, ingen nye felt, ingen `LIST_TABLES`-endring,
ingen endring i `storage.airtable.js` (`?v=2.9.0` står stille), ingen migrering.

**Kartlegging (verifisert i kode):** kategoriene var hardkodet FIRE steder —
`KATEGORI_LABEL`, `KATEGORI_GROUP_LABEL`, `KATEGORI_ORDER`, `GRUPPE_IKON` — pluss
en femte, lokal `KATEGORI_BILTYPE_LABEL` inne i `renderBilkort()`, og tre
hardkodede `<option>`-lister (Ny bil, Biloversikt-filteret, kjøretøyskjemaet).
Til sammen ~15 kallesteder på tvers av Biloversikt, Varsler, Rapporter,
Kostnader, Analyse, Excel-eksport, `sortedVehicles()` og `vehicleOptions()`.

**Løsning:**
1. **`bilkategorier`** — ny liste `[{id, navn, ikon}]`, lagret som ÉN JSON-blob i
   den eksisterende **Settings**-tabellen, nøyaktig samme mønster som
   `verksteder`. `saveBilkategorier()`. Seedes med `STANDARD_BILKATEGORIER` ved
   førstegangsoppstart. **De fire standard-id-ene (`bil`, `lastebil`,
   `montering`, `reserve`) er bevisst beholdt**, slik at alle eksisterende
   kjøretøy og all eksisterende data fortsetter å peke riktig.
2. **`rebyggKategoriOppslag()`** fyller de fire oppslagene på nytt fra
   `bilkategorier`, ved å MUTERE innholdet i de eksisterende objektene/arrayet.
   Alle kallesteder er dermed uendret — de leser samme konstanter som før, men
   innholdet er nå data i stedet for kode. Kalles etter lasting og etter hver
   lagring. `KATEGORI_BILTYPE_LABEL` er fjernet som egen sannhet (leser nå
   `kategoriNavn()` via en Proxy, slik at kallestedene står urørt).
3. **`kategoriOptionsHtml()`** erstatter de tre hardkodede `<option>`-listene.
   Nye kategorier dukker derfor automatisk opp overalt.
4. **🚫 Ute av drift er SYSTEMSTYRT, ikke en kategori.** `UTE_AV_DRIFT_KATEGORI_ID`
   ligger ALDRI i `bilkategorier`/`KATEGORI_ORDER` og dukker derfor ikke opp i noen
   nedtrekksliste eller noe rapportfilter. **`v.kategori` røres ALDRI** når en bil
   settes ute av drift — plasseringen beregnes live av
   `vehicleVisningsKategori(v)` fra `v.uteAvDrift`, akkurat som alle andre
   statusindikatorer i appen. Nettopp derfor bevares den opprinnelige kategorien
   helt av seg selv, og bilen faller automatisk tilbake i det `uteAvDrift`
   fjernes: ingen ekstra felt, ingen manuell flytting, ingenting som kan komme
   ut av synk. Kjøretøyprofilen viser «🚫 Ute av drift (tilbake til …)».
5. **Biloversikt** grupperer nå på `vehicleVisningsKategori()`, i
   `KATEGORI_ORDER` sin rekkefølge, med 🚫 Ute av drift ALLTID nederst. Tomme
   grupper skjules automatisk (uendret regel).
6. **Biloversikt vs. Biler i drift — bevisst ULIK logikk.** Biloversikt =
   ORGANISERING (kategori). «Biler i drift» = AKTIV BRUK. Når filteret
   «Har aktiv sjåfør» er valgt, viser Biloversikt ÉN samlet liste
   «🚚 Biler i drift (N)» på tvers av alle kategorier — også biler som står ute
   av drift, hvis de faktisk har en aktiv sjåfør. `hDriftCount` i
   `dashboardBeregning()` var allerede kategoriuavhengig og er UENDRET.
7. **⚙️ Administrer bilkategorier** — ny trekkspillseksjon i Innstillinger (ingen
   ny skjerm, ingen `ADMIN_SCREENS`-endring): opprett, endre navn/ikon, flytt opp/
   ned, slett, og flytt kjøretøy mellom kategorier. `addBilkategori()`,
   `saveKategoriEdit()`, `flyttKategori()`, `deleteBilkategori()`,
   `flyttBilTilKategori()`.
8. `CACHE_VERSION` i `sw.js` økt til `bilpark-v37`. `kontroll.html` resynkronisert.

**Regler som beskytter mot tapt data:**
- En kategori med biler i **kan ikke slettes** — bilene må flyttes først.
  Alternativet (å flytte dem stille) ville vært en skjult dataendring på kjøretøy.
- Den siste kategorien kan ikke slettes.
- Navnebytte endrer KUN `navn`; `id` står fast, slik at et navnebytte aldri kan
  løsrive en bil fra kategorien sin.
- **Kategori-id-en `reserve` har egen operativ betydning:**
  `vehicleErReserveUnntatt()` bruker den til å la en reservebil slippe daglig
  kontrollkrav før den tas i bruk. Navnet kan endres fritt, men slettes
  kategorien forsvinner regelen — derfor egen advarsel ved sletting.

**Uendret:** aktiv sjåfør, kontroll, kilometerlogikk, service, dekk, EU,
verksted, historikk, saksmotoren, `vehicleHovedstatus()` og hele Airtable-skjemaet.

**Prioritet 40 (2026-09-09) — Aktiv sjåfør fullført: én skriver, riktig flyt.**
Ingen nye Airtable-felt, ingen endring i `storage.airtable.js` (`?v=2.9.0` står
stille), ingen endring i kilometerlogikk, saksmotor eller historikk.

**Kartlegging (verifisert i kode, ikke antatt):**
- `v.aktivSjafor`/`v.aktivSjaforSiden` ble FØR denne runden TILDELT kun ett sted:
  `startBilokt()`. Nullstilt tre steder: kryss-bil-utsjekkingen inne i
  `startBilokt()`, `avsluttBilokt()` og `ryddOppBiloktDagskille()` (dagskille
  kl. 04:00).
- `startBilokt()` ble kun kalt fra sjåførmodus: etter innsendt kontroll
  (`submitKontroll()` sin `driverMode`-gren) og fra knappen «Gå til Min Bil» på
  skjermen «allerede kontrollert i dag».
- Derfor: en kontroll registrert via administrasjonens ✅ Kontroll-ikon satte
  ALDRI aktiv sjåfør — bilen fikk kun «🕓 Sjåfør i dag» via `vehicleSisteSjafor()`
  sin fallback til dagens siste kontroll. Og en bil som allerede var kontrollert
  krevde ett ekstra trykk («Gå til Min Bil») før sjåføren ble aktiv.
- `settAktivSjaforForKontroll()`, som Prioritet 34-teksten under beskrev som
  implementert, fantes ikke. Det samme gjaldt kryss-bil-utsjekkingsvarselet
  Prioritet 32-teksten beskrev — `startBilokt()` sjekket ut den andre bilen
  stille, uten `alert()`.

**Løsning:**
1. **`settAktivSjafor(vehicleId, navn)` er nå den ENESTE tildeleren** av
   `v.aktivSjafor`/`v.aktivSjaforSiden`. Innholdet er flyttet UENDRET ut av
   `startBilokt()` (samme kryss-bil-utsjekking, samme feltskriving, samme
   `saveVehicles()`). Den returnerer navnet på en ev. annen bil samme sjåfør ble
   sjekket ut av, slik at kryss-bil-utsjekkingen kan gjøres synlig uten en
   blokkerende dialog.
2. **Tre kallere, hver med sitt ene ekstra steg:**
   - `startBilokt()` = tildeling + lokal enhets-sesjon (`driverActiveVehicleId`/
     `driverNavn`/`saveDriverLocalSession()`) = en faktisk biløkt i sjåførmodus.
     Oppførselen er uendret.
   - `settAktivSjaforForKontroll()` = kun tildeling. Kalles fra
     `submitKontroll()` sin ADMINISTRASJONS-gren. Rører bevisst IKKE den lokale
     enhets-sesjonen — en driftskoordinator som registrerer på vegne av noen
     andre skal ikke overstyre sin egen enhets sjåførtilstand.
   - `overforAktivSjafor()` = kun tildeling. Brukes av «👤 Ny sjåfør».
3. **Flyt etter kontroll:** Kontroll lagret → aktiv sjåfør settes → Min Bil
   åpnes (sjåførmodus) / Kjøretøyprofilen åpnes (administrasjon). Den vanlige
   «Kontroll registrert»-dialogen er FJERNET i sjåførmodus (ett ekstra trykk på
   veien til Min Bil, som uansett åpnes umiddelbart og er bekreftelsen). En reell
   FEIL — bilder som ikke ble lagret — varsles fortsatt med dialog, i begge
   moduser. Administrasjonen beholder bekreftelsesdialogen uendret.
4. **Ny knapp «👤 Ny sjåfør» på Min Bil** (`minBilAksjon === 'nysjafor'`, samme
   trekkspillmønster som Registrer skade/varsellampe/avvik). Navn + «Oppdater»
   → `overforAktivSjafor()`. Dette er REN OVERFØRING: ingen kontroll, ingen
   historikk, ingen ny biløkt. Fordi Dashboard, «Biler i drift», Biloversikt og
   Kjøretøyprofil alle leser `vehicleAktivSjafor()` live, oppdateres alle fire
   umiddelbart uten noen egen synkronisering.
5. **Min Bil-overskriften viser nå BILENS aktive sjåfør** (`vehicleAktivSjafor()`),
   ikke bare navnet i enhetens lokale sesjon. Er bilen overført videre, sier
   skjermen tydelig fra i stedet for å vise et navn som ikke lenger stemmer.
6. `CACHE_VERSION` i `sw.js` økt til `bilpark-v36`. `kontroll.html` resynkronisert.

7. **Forenklet sjåførflyt — BIL FØRST, deretter navn (etter tilbakemelding fra
   sjåførene).** Den gamle flyten (åpne app → skriv navn → velg bil → kontroll)
   hadde navnefeltet øverst på «Velg bil», og bilvalget var BLOKKERT til navnet
   var fylt ut («Skriv inn navnet ditt før du velger bil»). Ny flyt: åpne app →
   velg bil → skriv navn → kontroll → Min Bil. Navnefeltet er fjernet fra
   toppen av skjermen; når en bil velges åpnes i stedet dialogen «Hvem kjører
   denne bilen?» (`.modal-overlay`/`.modal-sheet` — eksisterende modal-CSS,
   ingen ny komponent) med Navn + «Fortsett» + «← Velg en annen bil». Ny UI-
   tilstand: `driverNavnDialogBilId` / `driverNavnDialogMsg` (ren visningstilstand,
   lagres ingen steder). **Alt ETTER navnet er uendret:** samme
   `isKontrollertIdag()`-sjekk, samme «allerede kontrollert»-skjerm, samme
   `kontrollFormVehicleId`/`kontrollFormSjaforNavn`-forhåndsutfylling, samme
   `syncKontrollAnnetFromActive()`, samme `submitKontroll()`. Ingenting lagres,
   ingen biløkt opprettes og ingen kontroll åpnes før «Fortsett» trykkes.
   `avsluttBilokt()` nullstiller også dialogtilstanden, slik at den ikke kan bli
   stående åpen fra en tidligere økt. `kontrollApenDriftslag`/`lagreSistDriftslag()`
   (Prioritet 27.7) skjer nå ved bilvalget, som før.

**Uendret:** `vehicleAktivSjafor()` og `vehicleSisteSjafor()` (kun lesefunksjoner),
dagskillet kl. 04:00, «én sjåfør, én aktiv bil»-regelen, `avsluttBilokt()`,
kontrollstatus etter utsjekk, kilometerregelen (`v.km` skrives fortsatt kun fra
`submitKontroll()`, `performKontrollDeletion()` og `resetFleetData()`), saksmotoren,
historikk og alt Airtable-skjema.

**Fortsatt IKKE implementert (bevisst, ikke bestilt):** kryss-bil-utsjekkings-
varselet Prioritet 32-teksten beskriver som en `alert()`. Utsjekkingen SKJER
(uendret regel), og er nå synlig som tekst i «👤 Ny sjåfør»-panelet, men det
finnes ingen blokkerende dialog ved kontrollinnsending — det ville vært i direkte
konflikt med «ingen ekstra trykk». Bestill som egen sak dersom en dialog ønskes.

**Prioritet 39 (2026-09-09) — Mobil Design 4.1: mobilen bruker Desktop 4.1 sitt
designsystem.** Ingen ny funksjonalitet, ingen ny forretningslogikk, ingen nye
Airtable-felt og ingen endring i `storage.airtable.js` (derfor står `?v=2.9.0`
stille). Kun layout, CSS, komponenter og navigasjon.

1. **Ny mobilforside** (`renderMobilHjem()`). Det gamle 2×N-ikonrutenettet
   (`MOBIL_HJEM_IKONER`) er FJERNET og erstattet av «Desktop 4.1 på telefon»:
   topplinje (Bilpark / «Dine biler. Full kontroll.» / 🔔 Varsler / 👤 Konto),
   søkefelt, to KPI-kort (🚨 Aktive saker, 📅 Kommende frister), fire store
   bestillingskort (Service / EU-kontroll / Dekkskifte / Verkstedtime),
   «Kommende oppgaver», «Bilpark status» og «Krever handling nå». Alle bruker
   de SAMME klassene som desktop (`.dash40-kpi`, `.dash40-bestill`, `.p38-task`,
   `.p38-statrow`, `.p38-case`, `.flis`, `.p38-pill`) — det finnes ikke noe eget
   mobil-designsystem. `brandBlockHtml()` er UENDRET; undertittelen «Dine biler.
   Full kontroll.» finnes kun på mobilforsiden.
2. **Delt beregning i stedet for parallell.** Hele tellingen som lå inne i
   `renderDashboard()` er FLYTTET UENDRET ut i **`dashboardBeregning()`**, og
   markupen for enkeltrader/paneler ut i **`kommendeOppgaveRadHtml()`**,
   **`dashKreverRadHtml()`** og **`bilparkStatusInnholdHtml()`**. Mobil og
   desktop leser nå nøyaktig de samme tallene fra den samme koden — ingen
   duplisert tellelogikk kunne oppstå. Ingen av de underliggende funksjonene
   (`vehicleHovedstatus()`, `vehicleAktivSjafor()`, `sakKreverHandlingSamletMaster()`,
   `flatePlanleggingData()` …) er endret.
3. **Bunnmeny (ny, kun mobil):** `MOBIL_BUNNMENY` /
   `renderMobilBunnmenyHtml()` / `attachMobilBunnmenyListeners()` — 🏠 Hjem,
   🚐 Biler, ➕ Bestill, 📅 Kalender, ☰ Mer. REN NAVIGASJON til skjermer som
   allerede fantes; ☰ Mer åpner den uendrede drawer-menyen (`openDrawer()`).
   Den gamle merkevare-topplinjen (`.shell-top`) skjules visuelt på mobil via
   `.app-shell-mobil` — ☰-knappen ligger fortsatt i DOM med uendret listener,
   nøyaktig samme mønster som desktop bruker for `.shell-top-right`.
4. **Søket på forsiden** skriver til den EKSISTERENDE `filterSearch` og
   navigerer til Biloversikt. Ingen ny state, ingen ny søkemotor. Verdien
   skrives først når søket utføres (Enter/«Søk»), slik at hvert tastetrykk ikke
   utløser en `render()`.
5. **Kontroll og Registrer avvik** er flyttet ut av mobilforsiden. De finnes nå
   på Min bil, på Kjøretøyprofilen og i ☰ Mer (`drawer-kontroll-btn` /
   `drawer-avvik-btn` → uendrede `goToRegisterKontroll('')` /
   `goToRegisterSak('')`). Drawer-rekkefølgen følger nå desktopmenyen, med
   Historikk og Analyse i en egen «Oppslag»-seksjon nederst.
6. **Biloversikt:** `galleryCard()` er redesignet til 4.1-kort (ikonflis,
   skiltkomponent, radene Løyvenummer / Status / Aktiv sjåfør, pillerad for
   kontroll, varsellamper, skader og kategori). Løyvenummer er synlig uten
   ekstra klikk. Statuspillen bruker `vehicleHovedstatus()` +
   `P38_STATUS_STIL`, samme som desktopens biltabell. Kortet skiller nå også
   «👤 Aktiv sjåfør» (`vehicleAktivSjafor()`) fra «🕓 … (i dag)»
   (`vehicleSisteSjafor()`) — jf. Prioritet 33. **Begge lesefunksjonene er
   uendret; kun etiketten er presisert.**
7. **Kjøretøyprofil:** den store `.p38-loyve-rad`-seksjonen er fjernet.
   Løyvenummer ligger nå som et fremhevet felt (`.ov-item.ov-loyve`) i
   «Kjøretøyinformasjon», sammen med Aktiv sjåfør, Reg.nr, Bilgruppe, Biltype,
   Årsmodell, Drivstoff og Mobilitetsgaranti. Fanene (Oversikt/Historikk/
   Skader/Dekk/Kostnader) er uendret, men scroller sideveis på mobil.
8. **Kalender/Planlegging:** uendret kode, kun mobiltilpasset rutenett.
   Kalender er fortsatt hovedvisningen, med planleggingsseksjonen inne i seg.
9. `CACHE_VERSION` i `sw.js` økt til `bilpark-v34`. `kontroll.html` er
   resynkronisert som eksakt kopi av `index.html`.

**Dokumentasjonsfeil rettet i samme runde:** Prioritet 34-teksten under hevder
at `settAktivSjaforForKontroll(vehicleId, navn)` finnes på linje ~1677 og at
`submitKontroll()` kaller den fra BEGGE grener. **Dette stemmer ikke med
koden.** Funksjonen finnes ikke i `index.html`, og `v.aktivSjafor` settes
fortsatt KUN av `startBilokt()`, som kun kalles fra `driverMode`-grenen i
`submitKontroll()` og fra sjåførmodusens bilvalg. En kontroll registrert fra
administrasjonsdelen gir derfor «🕓 Sjåfør i dag» via `vehicleSisteSjafor()`,
ikke «👤 Aktiv sjåfør». Verifisert dynamisk i simulering (se ROADMAP.md).
Prioritet 39 endret bevisst ikke dette — aktiv sjåfør sto på «ikke rør»-listen.
**RETTET I PRIORITET 40:** funksjonen finnes nå, og en kontroll registrert fra
administrasjonsdelen setter aktiv sjåfør. Se Prioritet 40 over.

Ikke rørt i Prioritet 39: Airtable-struktur, `storage.airtable.js`,
kilometerlogikk, service-, EU-, dekk- og verkstedlogikk, saksmotoren,
historikk, aktiv sjåfør, Dashboard-logikk, rapporter og hele sjåførmodus.

**Prioritet 38 (2026-09-08) — Design 4.1: visuell implementering.** Ingen ny
funksjonalitet, ingen ny logikk, ingen nye Airtable-felt og ingen endring i
`storage.airtable.js` (derfor står `?v=2.9.0` stille). Kun designsystem og
presentasjon.

1. **Nytt designsystem.** `:root[data-theme="dark"]` har fått en ny premium-
   palett (#080C0B / #101614 / #19A66B) og et lite sett nye tokens
   (`--surface-2`, `--surface-3`, `--line-soft`, `--ink-2`, `--purple`,
   `--sh-card`, `--sh-hover`). Lys drakt har fått de samme nye tokenene, slik at
   det er ETT system i to drakter. Fordi alle skjermer allerede henter farger
   fra disse variablene, løftes Aktive saker, Historikk, Rapporter, Analyse og
   Innstillinger automatisk — ingen skjermspesifikk markup er endret for det.
2. **Mørk modus er ny standard.** `themePreference` faller nå tilbake til
   `'dark'` i stedet for `'system'` når ingen verdi er lagret. Brukere som
   aktivt har valgt lys eller «følg enheten» beholder sitt valg. Temabryteren
   ligger fortsatt KUN i Innstillinger (bevisst — ikke i sidemenyen eller på
   Dashboard).
3. **Delte presentasjonsklasser:** `.flis` (ikonflis med emoji i tonet flate),
   `.p38-pill` (ett pillesystem som visuelt erstatter blandingen av `.badge` og
   `.dash-chip`), `.p38-task`, `.p38-case`, `.p38-statrow`, `.p38-panel-head`,
   `.profil-stat4`, `.p38-loyve-rad` og understrekfaner (`.profil-tab`).
   `P38_STATUS_STIL` er en ren farge-oppslagstabell per hovedstatus — den
   inneholder ingen logikk, og statusverdiene kommer fortsatt utelukkende fra
   `vehicleHovedstatus()`.
4. **Dashboard:** hilsen-kortet er erstattet av en slank topplinje. De to
   hurtigknappene der (✅ kontroll / 🔧 verkstedtime) er FJERNET etter
   bestilling — begge funksjonene finnes fortsatt på Kjøretøyprofilen og på
   sine egne skjermer. Igjen står kun 🔔 varselklokken, som åpner den
   eksisterende Varsler-skjermen og viser antall aktive varsellamper
   (`allActiveVarsellys()`). «Kommende oppgaver» viser nå dato/klokkeslett én
   gang, med en fargekodet «dager igjen»-pille ved siden av (`daysUntil()`).
5. **Planlegging integrert i Kalender.** Kalender er nå hovedvisningen:
   månedsrutenett + valgt dato + hele planleggingsseksjonen
   (`planleggingSeksjonHtml()`), som bruker samme `flatePlanleggingData()` og
   samme periodevelger (7/30/90 dager) som Planlegging-skjermen hadde.
   `renderPlanlegging()` er UENDRET i koden, men ikke lenger koblet til noen
   meny. Mobilens hjemskjerm peker nå til Kalender.
6. **Bredere desktop-grid:** `#app` går fra 1080 px til 1420 px på skjermer
   ≥1200 px, og den duplikate merkevare-topplinjen skjules på desktop (sidemenyen
   er merkevareblokken). Mobil og smale skjermer er uendret.

Ikke rørt: Airtable-struktur, aktiv sjåfør, kilometerlogikk, service-, EU- og
dekk-logikk, historikk, rapporter, alle skjemaer og hele sjåførmodus.

**Prioritet 37 (2026-09-08) — Dashboard 4.0, Kjøretøyprofil 4.0, Kalender,
Kostnader-fane, Drivstoff og Mobilitetsgaranti.** Bestilt som en
OMORGANISERING: eksisterende funksjoner → ny plassering → bedre arbeidsflyt.
Ingen ny forretningslogikk, ingen ny statusmotor, ingen nye tabeller.

1. **Hurtigbestilling (fire kort, Dashboard + Kjøretøyprofil).** Fire delte
   snarveier — `bestillService()`, `bestillEuKontroll()`, `bestillDekkskift()`,
   `bestillVerkstedtime()` — som kun setter eksisterende UI-state og navigerer
   til den arbeidsflaten som allerede eier flyten. Flyten Planlegging → Utført
   → Historikk er UENDRET: `submitPlanlagtService()`/`fullforPlanlagtService()`,
   `submitPlanlagtDekkskift()`/`submitFullforPlanlagtDekkskift()` og
   `submitVT()`. EU-kontroll har ingen egen datamodell — kortet forhåndskrysser
   «🚦 Gjelder EU-kontroll» (`vtEuForhandskrysset` → `verkstedtime.type =
   'eu-kontroll'`), som er den eneste EU-bestillingsveien som finnes.
2. **Dashboard 4.0** (`renderDashboard()`, kun desktop-grenen): fire KPI-kort
   (Aktive saker / Kommende frister / Biler i drift / Planlagte timer),
   hurtigbestillingsraden, «Kommende oppgaver» og en biltabell med
   **løyvenummer som egen kolonne**. Høyre kolonne: Bilpark status, Krever
   handling nå, Prioriterte biler. Kortet «Kommer snart» er ERSTATTET av
   «Kommende oppgaver», som bygger på `flatePlanleggingData(7)` — samme kilder
   pluss service/EU/dekk. Bilparkhelse-stripen er FLYTTET fra topplinjen
   (`shell-top`) til panelet «Bilpark status»; samme tellinger
   (`vehicleHovedstatus()`/`vehicleAktivSjafor()`), samme klikkfiltre.
3. **Kalender** (`renderKalender()`, nytt menypunkt 🗓️). REN VISNING av fire
   eksisterende kilder gruppert på dato: `planlagteServicer`,
   `planlagteDekkskift`, `verkstedtimer` (inkl. `type='eu-kontroll'`) og
   `v.euGodkjentTil`. Datoer med aktivitet markeres; valgt dato viser alle
   avtaler med klokkeslett. Ingen registrering skjer herfra — klikk fører til
   den eksisterende arbeidsflaten. Ingen ny datamodell, ingen ny tabell.
4. **To nye kjøretøyfelt** — `drivstoff` (fast liste: diesel/bensin/elektrisk/
   hybrid/hvo/annet) og `mobilitetsgaranti` (fritekst). Begge registrert i
   `LIST_TABLES.vehicles` i `storage.airtable.js` SAMTIDIG som de tas i bruk
   (feltregelen), storage-versjon økt til `v2.9.0` og `?v=`-parameteren i
   `index.html`/`kontroll.html` til `2.9.0`. Se AIRTABLE_MIGRATION.md punkt 6.
5. **Kostnader-fane per kjøretøy** — filtrert visning av `getKostnadsposter()`
   (verkstedtimer, saker, dekkkostnader, skader) med `bestKostnad()`. Samme
   kostnadsmotor som Kostnadsoversikt og Kostnadsrapport. Ingen ny beregning.
6. **kontroll.html var en STALE fullkopi av index.html** (én leveranse bak —
   manglet hele «ute av drift»-arbeidet, og brukte `vehicles` der index.html
   brukte `aktiveVehicles`). Sjåfører kjørte altså gammel kode. Filen er i
   denne leveransen synkronisert til å være en EKSAKT kopi av `index.html`
   (sjåførmodus utledes av filnavnet, se `driverMode`-deteksjonen, og
   manifestet byttes i kjøretid til `manifest-sjafor.json`). **Anbefalt egen
   sak:** erstatt `kontroll.html` med en ren omdirigering til
   `index.html?sjafor=1`, slik at prosjektet ikke lenger har to nesten like
   HTML-filer å holde i sync.

Ikke rørt: kilometerlogikk (`v.km` skrives fortsatt kun fra de fire tillatte
stedene), sjåførkontroll/aktiv sjåfør, saksmotoren, Aktive saker, Service-,
Dekk- og Verksted-arbeidsflatene, Rapporter, Analyse, mobilvisningen
(`renderMobilHjem()`) og alt Airtable-skjema utover de to nye feltene.

---

## Produktvisjon

- Operativt styringssystem for bilparken til Bring Larvik (ca. 16 kjøretøy,
  ca. 40 ansatte som bytter bil gjennom turnus — systemet forutsetter aldri
  fast sjåfør på fast bil).
- Primærbrukere: driftskoordinator (hovedbruker, ansvar for oppfølging,
  verkstedbestillinger, skader, varsellamper, dekk, kostnader/avsettinger) og
  sjåfører (registrerer kontroll, avvik, skader, varsellamper).
- Drift og operativ kontroll kommer før økonomi og analyse.
- «Less is More» / «Keep It Stupid Simple» — administrator skal forstå status
  på hele bilparken på under 10 sekunder; Dashboard spesifikt på under 5
  sekunder.

## Arkitektur

**Måldefinisjon:**

| Lag | Verdi |
|---|---|
| Frontend | GitHub Pages |
| Backend | Airtable |
| Storage | `storage.airtable.js` |
| PWA | Ja |
| APK | Nei |
| Android | Nei |
| TWA | Nei |
| Vercel | Nei |
| Netlify | Nei |

Repoet inneholder ingen filer for andre hostingplattformer og ingen
Android/APK/TWA/Bubblewrap/Play Store-relatert konfigurasjon — alt dette er
fjernet. Introduser det ikke igjen uten en eksplisitt, ny beslutning.

- **Frontend:** Ett samlet HTML-dokument (`index.html`, ~10 700 linjer) med
  all CSS og all forretningslogikk inline i to `<script>`-blokker. Ingen
  separate CSS- eller komponentfiler.
- **Database:** Airtable — se AIRTABLE_MIGRATION.md for fullt skjema. Ingen
  backend/proxy; appen snakker direkte med Airtables REST-API fra
  nettleseren.
- **Hosting:** GitHub Pages — den eneste plattformen prosjektet publiseres på.
- **PWA/service worker:** `sw.js`, nettverk-først-strategi med cache som
  offline-fallback (`CACHE_VERSION = 'bilpark-v32'`). To separate
  manifester: `manifest.json` (hovedapp) og `manifest-sjafor.json`
  (sjåfør-snarvei via `kontroll.html`, `start_url` med `?sjafor=1`). Ikoner
  ligger i `icons/` (`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`).
- **Autoritativ storage-fil:** `storage.airtable.js` (nåværende versjon
  `v2.9.0`, cache-bustet via `?v=2.9.0` på script-taggen i `index.html` OG
  `kontroll.html` — se "Versjonskontroll (permanent løsning)" under for
  hvordan Database status verifiserer dette automatisk). Dette er den
  ENESTE Airtable-storage-filen i prosjektet — ingen
  konkurrerende varianter (`storage_airtable.js`, `airtable_storage.js`,
  `airtable.storage.js`) finnes som egne filer (kun feilskrivinger i
  løpende kommentartekst forekommer — se AIRTABLE_MIGRATION.md). Siden
  Prioritet 29 har filen en internt serialisert per-ressurs skrivekø
  (`_koKjor()`) rundt `set()`/`del()` — se "Dataintegritet" under.
- **Autoritative datakilder:** `v.km` er eneste autoritative NÅVÆRENDE
  kilometerstand for et kjøretøy; `servicehistorikk[].km` er historisk og
  skal aldri overskrive `v.km` (se "Dataintegritet" under).
- **Operativt dagskille kl. 04:00:** aktive biløkter avsluttes, aktive
  sjåfører fjernes, kontrollstatus nullstilles kl. 04:00 (`ryddOppBiloktDagskille()`/
  `isoDateForOperationalDay()`), ikke ved midnatt — fordi sjåfører kan
  arbeide til langt etter midnatt.

## Desktop Design 2.0

Adaptivt layout med sidebar-navigasjon (`renderDesktopSidebarHtml()`):

- Dashboard — svarer kun på: hva må jeg gjøre nå / hva kommer snart / hvilken
  bil starter jeg med. Alt annet hører hjemme andre steder.
- Aktive saker
- Historikk (samlet hub for kontroll-/service-/dekk-/skadehistorikk)
- Kalender (📅 — Prioritet 38/39: Planlegging er INTEGRERT her, inkludert
  oppfølginger. `renderPlanlegging()` er uendret i koden, men ikke lenger koblet
  til noen meny — samme mønster som Prioritet 27 brukte for Kontrolloversikt/
  Skadeoversikt m.fl.)
- Biler (Biloversikt)
- Bestill tjenester
- Påminnelser (varsellamper)
- Kostnader
- Rapporter (📊, eget menypunkt atskilt fra Analyse)
- Analyse (📈, eget menypunkt)
- Innstillinger (inkl. Database status, synkroniseringsstatus, diagnoseverktøy)

## Mobil Design 2.0

- Biloversikt
- Kontroll
- Registrer avvik
- Aktive saker
- Service
- Dekk
- Planlegging
- Rapporttilgang gjennom Rapporter i ☰ Meny (ikke eget hjemmeskjerm-ikon,
  bevisst valg)
- Sveipenavigasjon mellom hovedskjermer
- Manuell overstyring mellom mobil-/desktopvisning finnes IKKE i koden
  (verifisert tre ganger uavhengig — ingen egen bryter, ingen egen
  localStorage-nøkkel). Vurder som en ny, separat sak dersom dette fortsatt
  er ønsket.

## Kjøretøyprofil (4.0, Prioritet 37)

**Regelendring, bevisst besluttet:** den tidligere regelen «skal kun vise fire
faste felt (Registreringsnummer / Kilometerstand / Siste service / EU-godkjent
til)» er erstattet. Bakgrunn: løyvenummer brukes daglig operativt og lå gjemt i
redigeringsskjemaet. Profilen er nå bygget slik (`renderBilkort()`):

1. **Identitetslinje** — skilt/reg.nr, bilnummer, merke/modell, biltype,
   bilgruppe, årsmodell, drivstoff, hovedstatus, aktiv sjåfør, og
   **løyvenummer i en egen, fremhevet boks**.
2. **Mobilitetsgaranti** — eget, tydelig felt rett under identitetslinjen
   (operativt felt ved havari/veihjelp).
3. **Nøkkeltall (fire kort)** — Kilometerstand, Siste service, Neste service,
   EU-godkjent til. Samme fire tall som før, ny plassering.
4. **Hurtigbestilling (fire kort)** — Service, EU-kontroll, Dekkskifte,
   Verkstedtime, med bilen forhåndsvalgt. Sekundært: Registrer kontroll,
   Registrer skade, Åpne aktive saker.
5. **Faner** (`bilkortAktivFane`) — Oversikt (= Operativ status + service/dekk/
   EU-statuslenkene), Historikk (tidslinje/nøkkeltall/kontroller), Skader,
   Dekk (ren visning), Kostnader (ren visning). Erstatter de tidligere
   akkordion-radene. **Ikke legg til nye faner uten egen beslutning.**
   «Dokumenter» er bevisst IKKE bygget (parkert av bruker, Prioritet 37).
6. **Høyre kolonne** — Kommende oppgaver (per bil), Aktive saker,
   Kjøretøyinformasjon (løyvenummer først), og «Rediger informasjon» som
   åpner det uendrede Bilinformasjon-skjemaet.
7. **Faresone** nederst — uendret (ute av drift, slett bil).

**Bilbilde er fjernet fra visningen** (ingen operativ verdi). Ingen data er
slettet: `v.hasPhoto` og eventuelle `vehicle:{id}`-rader i `Photos` er urørt —
kun opplasting og visning er tatt bort fra grensesnittet.

**Endring i Prioritet 38:** løyvenummer har IKKE lenger et eget kort ved siden
av skiltet øverst. Det ligger i stedet fremhevet øverst i panelet
«🚐 Kjøretøyinformasjon» (`.p38-loyve-rad`), sammen med reg.nr, bilgruppe,
årsmodell, drivstoff, biltype, driftslag og mobilitetsgaranti.

Fanene «Dekk» og «Kostnader» er RENE VISNINGER av eksisterende data. All
registrering/redigering skjer fortsatt kun på de dedikerte arbeidsflatene
(`renderDekkSkjerm()`) og gjennom den eksisterende kostnadsmotoren
(`getKostnadsposter()`/`bestKostnad()`) — ingen parallell dekk- eller
kostnadsmotor er innført.

## Sjåførkontroll

- Gruppering av bilvalg etter Driftslag (`v.driftslag`, fritekstfelt med
  `<datalist>`-autofullføring, styrer KUN gruppering i Sjåførkontroll, ingen
  annen betydning i appen).
- Fargekodede lag (`DRIFTSLAG_IKON`/`DRIFTSLAG_ORDER` — Lag 1–4, Curbside,
  Montering, Lastebil har faste ikoner/rekkefølge; ukjente/egendefinerte
  driftslag får egen, nøytral gruppe).
- Akkordion — kun én gruppe åpen om gangen (`kontrollApenDriftslag`), delt
  komponent `renderDriftslagGruppertBilvalg()` brukt både i sjåførens
  bilvalg og i admin sin "Bytt bil"-fallback.
- Sist brukte lag huskes lokalt (`localStorage`,
  `bilpark_sjaforkontroll_sist_driftslag`) — kun ved faktisk bilvalg, ikke
  ved ren utforsking.
- "Pick Up Point Larvik" skjules fra Sjåførkontroll sitt bilvalg
  (`DRIFTSLAG_SKJULT_I_KONTROLL`), men er fullt synlig/fungerende alle andre
  steder i appen.
- Driftslag lagres permanent i Airtable (`Vehicles.Driftslag`), ikke kun
  lokalt.
- **Biler ute av drift (`v.uteAvDrift`):** vises IKKE i sin vanlige
  driftslag-gruppe i Sjåførkontroll sitt bilvalg (`kontrollDriftslagGrupper()`),
  men samles i en egen, alltid sist plasserte gruppe "🚫 Biler ute av drift" —
  kortene der er bevisst ikke klikkbare (ingen bilvalg-attributt settes), kun
  synlige for sporbarhet/åpenhet. `v.driftslag` fjernes ALDRI fra kjøretøyet
  mens det er ute av drift, så bilen havner automatisk tilbake i riktig
  driftslag-gruppe den dagen `markerUteAvDrift()`/`settTilbakeIDrift()` setter
  `v.uteAvDrift = false` igjen — ingen egen "husk opprinnelig lag"-logikk
  finnes eller er nødvendig. Samme regel skjuler biler ute av drift fra
  Dashboard sine operative tellinger (kontrollstatus, EU-kontroll/service
  forfalt — se `aktiveVehicles` i `renderDashboard()`), fra Planlegging sine
  status-baserte "kommende"-varsler (`flatePlanleggingData()`), og fra
  bilvelgeren ved registrering av NY sak/verkstedtime/dekkkostnad/skade
  (`vehicleOptions(id, {ekskluderUteAvDrift:true})`). Service-/Dekk-skjermenes
  egne bilvelgere viser fortsatt ALLE biler (historikk skal alltid være
  nåbar) — kun "+ Registrer service"/"+ Planlegg service"/
  "+ Registrer dekkskifte"-knappene skjules når valgt bil er ute av drift.
  Bilen forblir uendret synlig i Biloversikt/Administrasjon, Kjøretøyprofil,
  Historikk, Rapporter og Analyse — ingen av disse filtrerer på `uteAvDrift`.
  Ingen kjøretøy slettes, arkiveres eller mister historikk av denne regelen —
  den er en ren visningsfiltrering.

## Aktiv biløkt

- Kontroll tilhører bilen (`v.aktivSjafor`, satt av `startBilokt()`).
- Biløkt tilhører sjåføren.
- Sjekk ut (`vehicleAktivSjafor()` → null) gjør bilen tilgjengelig for neste
  sjåfør.
- Automatisk avslutning kl. 04:00 (operativt dagskille, se over).
- `startBilokt()` kalles kun fra faktisk sjåførmodus (`driverMode`,
  `?sjafor=1`/`kontroll.html`) — kontroller registrert via admin sitt vanlige
  ✅ Kontroll-ikon setter IKKE `v.aktivSjafor`. `vehicleSisteSjafor()` finnes
  som en bredere visningsfunksjon (viser siste gjennomførte kontroll i dag
  hvis ingen aktiv biløkt), brukt kun til informasjonsvisning — ikke til
  "biler i drift"-tellingen (`hDriftCount`), som fortsatt strengt betyr
  "kjører akkurat nå".

## Aktive saker og Wizard

- Samlet sak per kontroll (én sak per bil, ikke én sak per avvik).
- Flere avvikspunkter per sak (Sammenslåtte Kontrollavvik).
- Selektiv verkstedbehandling og selektiv fullføring av enkeltavvik innenfor
  en flerpunkts sak.
- Kun aktive avvik påvirker bilstatus (fargekoding: Grønn = ingen aktive
  saker, Gul = aktive saker finnes, Oransje = verksted bestilt, Rød =
  kritisk sak).
- Livssyklus: Ny → Vurderes → Tiltak planlagt → Verksted bestilt → Delvis
  utført (kun flerpunkts saker med gjenstående avvik) → Utført → Lukket.
- Sakstyper: Varsellampe, Skade, Kontrollavvik, Dekk, Service, Annet.
- Reservebiler som ikke er tatt i bruk ennå i dag er unntatt fra det daglige
  kontrollkravet (Reservebil-logikk); ved dagskille går bilen automatisk
  tilbake til reservestatus.
- To felt på `AktiveSaker` (`RegistrationNumber`, `AssignedTo`) skrives ved
  opprettelse, men leses aldri tilbake av appen i dag — se
  AIRTABLE_MIGRATION.md. Ikke bygg videre logikk på dem uten å bekrefte
  formålet først; ikke slett dem uten en egen, eksplisitt godkjent
  migrering.

## Service

- `v.km` er eneste autoritative NÅVÆRENDE kilometerstand. **Tillatte
  skrivepunkter (uttømmende liste, Prioritet 29, Del 6):**
  - `submitKontroll()` — normal, operativ skrivevei ved hver kontroll.
  - `performKontrollDeletion()` — kan rekalkulere `v.km` fra nyeste
    gjenværende kontroll når en kontroll slettes.
  - `resetFleetData()` — eksplisitt admin-nullstilling av hele flåten.
  - `saveVehicleForm()` — direkte redigering av km i kjøretøyskjemaet er
    fortsatt mulig, men KUN som en eksplisitt admin-korreksjon: en
    `confirm()`-dialog vises nå før lagring dersom (og kun dersom) km-verdien
    i skjemaet faktisk avviker fra `v.km`, slik at vanlig redigering av
    regnr/modell/lag/annen kjøretøyinfo aldri kan overskrive `v.km` utilsiktet
    ved et uhell. Samme funksjon lagrer nå kun ÉN gang (den tidligere
    duplikate `saveVehicles()`-kallingen er fjernet).
  - Ingen andre steder i koden skriver til `v.km` — verifisert ved
    kodegjennomgang i Prioritet 29-revisjonen.
- `servicehistorikk[].km` er historisk kilometerstand ved utført service —
  skal ALDRI overskrive `v.km`. **Historisk kritisk feil** (rettet): en
  tidligere versjon av `submitService()` overskrev `v.km` når en historisk
  service-km var høyere enn bilens daværende km. Rettet ved å fjerne
  skrivingen til `v.km` fra `submitService()`, med validering og
  bekreftelsesdialog ved avvik. **Sjekk eksisterende data manuelt** for
  kjøretøy som kan ha fått `v.km` feilaktig overskrevet før rettingen — dette
  er ikke automatisk korrigert.
- Serviceintervall per bil: `v.serviceIntervallKm` (Airtable-felt
  `ServiceIntervallKm`).
- Varslingsgrenser knyttet til intervallet (`vehicleServiceStatus()`).
- Registrering (`submitService()`), redigering (`saveServiceEdit()`) og
  sletting (`deleteService()`) av servicehistorikk — verifisert at kun
  opprettelse noensinne hadde km-overskrivingsfeilen. Alle tre går nå gjennom
  `mutasjonMedRollback()` (rollback ved lagringsfeil, se "Dataintegritet").
- **Planlagt service** (`planlagteServicer`) har siden Prioritet 29 full
  livssyklus: opprettelse (`submitPlanlagtService()`), redigering
  (`savePlanlagtServiceEdit()`), sletting (`deletePlanlagtService()`) og
  markering som utført (`fullforPlanlagtService()` — oppretter en korrekt
  servicehistorikk-oppføring med sporbarhetsfeltet `fraPlanlagtServiceId`
  tilbake til den opprinnelige avtalen, FØR den planlagte avtalen fjernes,
  og kun etter at historikk-oppføringen er bekreftet lagret). Beskyttet mot
  dobbel innsending/dobbelttrykk (`beskyttSubmit()`/`beskyttKlikk()`). `v.km`
  røres aldri av noen av disse — brukeren oppgir km eksplisitt ved
  fullføring, på samme måte som ved vanlig "Registrer service".
- Planlagt service og ordinære verkstedtimer er FULLSTENDIG adskilte
  datamodeller — `planlagteServicer` er en egen array/Settings-nøkkel, IKKE
  en verkstedtime. `WorkshopAppointments.Type` (`verkstedtime.type`) finnes
  fortsatt registrert i `LIST_TABLES` av historiske årsaker, men er IKKE i
  aktiv bruk i dagens kode (rettet dokumentasjonsfeil, Prioritet 29 —
  se `storage.airtable.js` for detaljer). Feltet er ikke fjernet, siden
  databasefelt ikke slettes uten eksplisitt instruks.
- **`servicehistorikk` og `planlagteservicer` er IKKE egne Airtable-tabeller**
  — de lagres som én samlet JSON-blob hver i `Settings`-tabellen (samme
  Key/Value-mønster som `theme-preference`/`verksteder`). All historisk
  service for ALLE kjøretøy over ALLE år ligger i ÉN Airtable-celle — vær
  oppmerksom på Airtables praktiske feltgrense ved videre vekst. Begge
  datasett er siden Prioritet 29 beskyttet mot korrupt JSON (se
  "Dataintegritet") og lagres via en serialisert skrivekø. Vurdert, men IKKE
  aktivert, radbasert migrering til egne tabeller — se AIRTABLE_MIGRATION.md,
  seksjon 9 (tabellene finnes ikke i produksjonsbasen i dag).

## EU-kontroll

- Permanent felt på kjøretøyet: `v.euGodkjentTil` (Airtable-felt
  `EuGodkjentTil`).
- Varslingsnivåer (`vehicleEuKontrollStatus()`): fire nivåer — over 90 dager
  igjen / under 90 / under 30 / utløpt.
- Vises i Kjøretøyprofil (ett av de fire faste feltene), Operativ status, og
  Planlegging.

## Rapporter

Rapporthub (`renderRapporterOversikt()`), standardisert flatt rutenett
(`RAPPORT_ORDER`, 12 rapporter), delt infrastruktur
(`rapportTabellHtml()`, `rapportEksporterExcel()`, felles statusfilter):

- Kilometerstandsrapport (kun `v.km` som kilde, egen datakvalitetsstatus)
- Servicerapport
- Dekkrapport
- EU-kontrollrapport
- Skaderapport (per skade, med bildeteller via `damagePhotoCount()`)
- Saksrapport (tidligere "Avviksrapport")
- Kostnadsrapport
- Bilparkrapport
- Verkstedrapport
- Bilhelserapport
- Månedsrapport (eneste med full bredde, 2×2-nøkkeltallskort)
- Kontrollrapport

Alle følger: Overskrift → Filtre → Forhåndsvisning → Excel-eksport
(SheetJS/xlsx.full 0.18.5, lastet fra CDN i `index.html`).

## Dataintegritet

- **Timeout på Airtable-nettverkskall (Prioritet 31, regresjonsfiks):**
  `airtableFetch()` i `storage.airtable.js` avbryter (via `AbortController`)
  enhver forespørsel som ikke har fått svar innen 20 sekunder
  (`AIRTABLE_TIMEOUT_MS`), og forkaster den med en synlig feil i stedet for
  å la den henge for alltid. Dette er en forutsetning for at Prioritet 29
  sin serialiserte skrivekø (`_koKjor()` under) skal være trygg: køen
  kjeder skrivinger mot samme ressurs bak hverandre med `.then()`, og en
  hengende forespørsel uten timeout ville blokkert ALLE senere skrivinger
  mot samme tabell for alltid (bekreftet regresjon — se
  "Prosjektkontekst" øverst i denne filen for full beskrivelse). Rør ikke
  denne timeouten ned mot 0 eller fjern den — det gjenåpner nøyaktig denne
  feilen.
- Ingen duplikate sannheter (f.eks. `v.km` vs. servicehistorikk-km, se over;
  "biler i drift"-tellingen har kun én autoritativ kilde, `hDriftCount`).
- Ingen parallelle historikkmotorer.
- Ingen databasefelt slettes uten eksplisitt instruks.
- `AIRTABLE_MIGRATION.md` oppdateres ved enhver feltendring.
- Full Cleanup: kontrollsletting fjerner alle relaterte data uten
  "spøkelsesdata" igjen.
- Synkroniseringsstatus: `instrumenterStorageForSynkStatus()` sporer
  `pagaendeSkrivinger`, `synkFeilLogg` (siste 20 feilede forsøk),
  `sisteVellykkedeSynkTidspunkt` — vist øverst i Database status i
  Innstillinger. **Oppdatert (Prioritet 29):** det finnes fortsatt ingen
  UBEGRENSET automatisk retry-kø for feilede lagringer — "feilet lagring"
  betyr fortsatt at brukeren får en tydelig, vedvarende feilmelding med én
  gang og selv må trykke på nytt for å prøve igjen (ikke noe som står og
  venter i bakgrunnen uten videre handling). Det som ER nytt: (1) en
  serialisert per-ressurs SKRIVEKØ i `storage.airtable.js` (`_koKjor()`)
  sørger for at to samtidige lagringer til samme tabell/Settings-rad aldri
  kjører side om side (dette er ren rekkefølge-sikring, ikke retry — en
  feilet operasjon rapporteres fortsatt umiddelbart, den prøves ikke på
  nytt automatisk, og feiler den, blokkerer den ikke senere operasjoner i
  køen); (2) kritiske mutasjoner (service, planlagt service, aktive saker,
  verkstedtimer) bruker nå `mutasjonMedRollback()`, som ved feilet lagring
  gjenoppretter forrige, korrekte lokale tilstand og re-rendrer — slik at
  brukergrensesnittet ALDRI kan vise en endring som "lagret" når den faktisk
  feilet.
- **Korrupt Settings-JSON (Prioritet 29, Del 4):** `parseJsonTrygt()` gir et
  eksplisitt `{ok: true, value}` / `{ok: false, error}`-resultat ved
  innlasting av `servicehistorikk`/`planlagteservicer`. Ved korrupt JSON
  blir datasettet ALDRI stille nullstilt til et tomt array — det flagges i
  `_korrupteDatasett`, lagring til nettopp det datasettet blokkeres
  (`saveServicehistorikk()`/`savePlanlagteServicer()` kaster en feil i
  stedet for å lagre), og brukeren varsles både med en engangs-`alert()` ved
  oppstart og med et vedvarende varselpanel i Database status i
  Innstillinger. Én korrupt Settings-nøkkel påvirker aldri andre datasett.
- Et nytt felt i JavaScript-koden som IKKE er registrert i `LIST_TABLES` i
  `storage.airtable.js` forsvinner STILLE ved neste henting fra Airtable
  (bekreftet gjentatte ganger historisk: ServiceIntervallKm, EuGodkjentTil,
  AktivSjafor, Driftslag rammet alle av nøyaktig denne feilen før de ble
  registrert). **Registrer ALLTID et nytt felt i `LIST_TABLES` samtidig som
  det tas i bruk i `index.html`.**
- **Dobbel innsending (Prioritet 29, Del 1):** alle kritiske skjemaer og
  handlingsknapper (service, planlagt service, verkstedtime, kontroll, sak,
  kjøretøy, dekkskifte/-kostnad, skade, sletting av sak/verkstedtime, lagring
  av kjøretøyskjema, fullføring av planlagt service) er beskyttet av en
  delt, intern JS-lås (`beskyttSubmit()` for skjema-submit,
  `beskyttKlikk()` for knappeklikk) — ikke bare HTML sitt `disabled`-
  attributt. Første trykk låser umiddelbart, låsen frigjøres ALLTID i en
  `finally`-blokk (også ved feil), og brukeren kan alltid prøve på nytt
  etter en feilet lagring.
- **Gjensidige referanser mellom Aktive saker og verkstedtimer (Prioritet
  29, Del 5):** `deleteSak()` nullstiller `sakId`/`caseId` på enhver
  verkstedtime som pekte på den slettede saken (fjerner IKKE selve
  verkstedtiden). `deleteVT()` nullstiller `linkedVtId` og tilbakestiller
  status til `'tiltak-planlagt'` på en eventuell sak som pekte på den
  slettede verkstedtiden (fjerner IKKE selve saken, og lar den aldri stå
  feilaktig fast som "Verksted bestilt" uten en gyldig verkstedtime).

## Versjonskontroll (permanent løsning, Prioritet 36)

Én autoritativ versjonssannhet — ingen tredje, manuelt vedlikeholdt kopi:

1. `storage.airtable.js` rapporterer selv sin kjørende versjon via
   `window.storageAirtableInfo.versjon`.
2. `index.html`/`kontroll.html` sin `<script src="storage.airtable.js?v=X">`-
   tag bærer cache-bustingen.
3. Database status (Innstillinger) leser "forventet versjon" AUTOMATISK fra
   `?v=`-parameteren på den faktiske script-taggen i DOM-en — ingen egen
   `FORVENTET_VERSJON`-konstant vedlikeholdes lenger.
4. Ved enhver fremtidig endring i `storage.airtable.js`: øk BÅDE `versjon`
   inni filen OG `?v=` på begge script-tagger, samtidig (se "Regler for
   Claude / videre utvikling").

Tre tilstander i Database status: 🟢 samsvarer (kjørende versjon = forventet
versjon), 🔴 ekte avvik (viser begge faktiske verdier), 🟡 kan ikke
bekrefte (fant ingen `?v=`-parameter — viser ALDRI en gjettet/gammel
forventet versjon som fasit).

## Sikkerhet

`airtable-config.js` inneholder en ekte Airtable Base ID og et ekte Personal
Access Token i klartekst, synlig for enhver som besøker siden (ingen
backend/proxy finnes). Dette er en kjent, dokumentert arkitekturbegrensning,
ikke en feil å rette i denne appen slik den er bygget i dag:

- Bruk et Personal Access Token scopet KUN til denne basen, med KUN
  `data.records:read`/`data.records:write` (+ `schema.bases:read`/`write`
  for automatisk skjemasjekk).
- Roter tokenet jevnlig via Airtable Console.
- Del aldri lenken til appen offentlig utover de som skal bruke den.
- Ekte beskyttelse (skjule tokenet helt) krever en egen backend/proxy —
  utenfor denne appens nåværende arkitektur.
- Ved deling av kildekoden (f.eks. en ZIP): bruk `airtable-config.example.js`
  med placeholder-verdier i stedet for den ekte filen.

## Regler for Claude / videre utvikling

**Før enhver endring:**

1. Les denne filen, ROADMAP.md og AIRTABLE_MIGRATION.md.
2. Analyser eksisterende kode direkte i `index.html`/`storage.airtable.js`
   før du antar hvordan noe fungerer — flere historiske feil i dette
   prosjektet oppsto nettopp av antakelser uten kodeverifisering.
3. Kontroller autoritative filnavn: `storage.airtable.js` er den ENESTE
   Airtable-storage-filen. Finner du referanser til `storage_airtable.js`,
   `airtable_storage.js` eller `airtable.storage.js` som faktiske FILER (ikke
   bare feilskrivinger i kommentartekst) — stopp og avklar, ikke anta
   hvilken som er riktig.
4. Ta en snapshot/backup (git-commit) før du starter — git-historikken er
   backupen, ikke en arkivmappe i produksjonsprosjektet.

**Under endring:**

- Endre minst mulig. Ikke dupliser funksjoner — søk etter eksisterende
  `renderX()`/`saveX()`/beregningsfunksjoner før du skriver en ny.
- Ikke opprett nye sannheter (f.eks. en ny kilde til "nåværende km" ved
  siden av `v.km`, eller en ny "biler i drift"-telling ved siden av
  `hDriftCount`).
- Ikke bygg parallelle løsninger (f.eks. en ny Airtable-storage-fil ved
  siden av `storage.airtable.js`).
- Ikke fjern fungerende funksjonalitet under redesign.
- Skill mellom mobil og desktop — de har bevisst forskjellige layouts, men
  skal dele samme data/logikk.
- Bevar dataintegritet: et nytt felt MÅ registreres i `LIST_TABLES` i
  `storage.airtable.js` SAMTIDIG som det tas i bruk i `index.html`.
- Ikke skriv hemmeligheter (tokens, nøkler) i kode eller chat. Bruk
  `airtable-config.example.js` som mal ved deling.

**Etter endring — testkrav:**

- Kjør syntakssjekk (`node --check` på JS-filer; balanse-/tag-sjekk på
  `index.html`).
- Test mobil-shell og desktop-shell (åpner, navigerer, sveip).
- Test Airtable-lesing og -skriving, samt refresh (data må laste korrekt på
  nytt).
- Test kjernefunksjonene som faktisk er berørt av endringen: Driftslag,
  Sjåførkontroll-grupper, Aktiv biløkt/sjåfør, kontroll
  registrere/slette/Full Cleanup, Aktive saker, Dashboardtellinger,
  Serviceintervall (og at servicehistorikk ALDRI endrer `v.km`), EU-kontroll,
  Dekk, Skadebilder, Historikk, Planlegging, Rapporthub/Kilometerstandsrapport-
  eksport, service worker/PWA, oppdateringsfunksjonen ("Oppdater app" i
  Innstillinger).
- Oppdater dokumentasjon (denne filen ved ny funksjonalitet,
  AIRTABLE_MIGRATION.md ved databaseendringer, ROADMAP.md ved
  statusendring) — etter implementering, ikke før.
- Oppdater filversjon/cache-busting: `?v=` i `index.html` OG
  `versjon`-verdien i `storage.airtable.js` samtidig (kun ved endring i
  `storage.airtable.js`); `CACHE_VERSION` i `sw.js` (ved endring i
  app-shell-filer).
- Oppgi alle endrede filer, gjennomførte tester og kjente begrensninger.

**Kjente, dokumenterte fallgruver i dette prosjektet:**

- Et nytt JS-felt uten tilsvarende `LIST_TABLES`-oppføring forsvinner stille
  (ikke en feilmelding — bare tapt data ved neste refresh).
- `v.km` må ALDRI overskrives av en historisk service-km-verdi.
- Service worker cacher app-shell-filer "nettverk først, cache som
  offline-fallback" — en gammel `storage.airtable.js` kan likevel sitte
  igjen i nettleseren hvis cache-buster-tallet ikke økes ved opplasting.
- `servicehistorikk`/`planlagteservicer` er én JSON-blob i Settings, ikke
  egne tabeller — vær varsom med feltgrenser ved stor vekst.
