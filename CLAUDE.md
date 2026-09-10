# CLAUDE.md — Bilpark Operativsystem

Prosjektets kilde til sannhet. Sist konsolidert: 2026-09-10 (Prioritet 47,
Del 1 — fjernet «Andre kontrollavvik» fra valgbare lister, ny «📨 Nye
kommentarer»-seksjon i Aktive saker, bestillingstjenester samlet på én rad).
Forrige: Prioritet 46 — Rapporter (full historikk ved bilfiltrering),
Carglass Ruteskift-hurtigknapp, ny 💥 Ruteglassrapport, Verkstedtime 2.0
(EU-kontroll/Ruteskift som egne, samtidig-avkryssbare felt), telefonnummer i
Kjøretøyprofil. Før det: Prioritet 45 — Omstrukturering av Innstillinger
(fire grupperte hovedseksjoner, «⚙️ Innstillinger» nederst i sidemenyen, ny
👤 Sjåførside med 📞 Ringeliste, ny 📘 Informasjonsveileder). **Ved avvik
mellom denne filen og koden er koden alltid sannheten.**

⚠️ **VIKTIG, uavklart avvik oppdaget i Prioritet 47 (se PRIORITET_47_ANALYSE.md):**
referansebilder av sjåførmodus (mottatt fra bruker) viser en bunnmeny
(«Min Bil · Velg bil · Oppgaver · Mer») og en kortbasert Min Bil-visning med
undertekster som IKKE finnes noe sted i `index.html`/`kontroll.html` slik de
ligger i dette Claude-prosjektet — verken som skjerm, funksjon eller
navigasjonsnøkkel. `renderDriverShell()` har i denne koden ingen bunnmeny i
det hele tatt. Dette kan bety at det finnes en nyere `index.html` på GitHub
Pages enn den dette prosjektet analyserer (samme type avvik som Prioritet
36/42 — kode levert/dokumentert her matchet ikke det faktisk publiserte
repoet). **Bruker har bedt om at den faktiske, kjørende `index.html` lastes
opp før bunnmeny/Sjåførside 2.0/"Sjekk ut bil"-tekst (PRIORITET 47, Del 2)
implementeres — IKKE gjett eller gjenskap skjermbildet mot antatt kode.**

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
`storage.airtable.js` (v2.11.0). Mobil = handlingsdrevet. Desktop =
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

**Prioritet 47, Del 1 (2026-09-10) — Sjåførside 2.0 / Dashboard-komprimering:
kommentarhåndtering og bestillingsrad.** Bestilt som en todeling: Del 1
(kartlagt og implementert her) og Del 2 (bunnmeny/Ringeliste/Oppgaver/"Sjekk
ut bil"-tekst i sjåførmodus — **IKKE implementert**, se advarselen øverst i
denne filen og PRIORITET_47_ANALYSE.md).

**Kartlegging (før implementering, se PRIORITET_47_ANALYSE.md):** en fritekst-
kommentar i sjåførkontrollskjemaet (`kt-kommentar`/`kontrollFormKommentar`)
har ALDRI opprettet en aktiv sak alene — den lagres kun på selve
kontroll-oppføringen (`kontroller[].kommentar`) og var kun synlig nedgravd i
Kontrollhistorikk. Den reelle mekanismen bak opplevelsen "kommentar blir sak"
var avkrysningsboksen **«Andre kontrollavvik»** (`annet-avvik` i
`KONTROLLAVVIK_ORDER`) — det eneste stedet en sjåfør kunne signalisere "jeg
har noe å si" på en måte som faktisk ble synlig for driftskoordinator (en ny
rad i Aktive saker), med en generisk tittel og selve innholdet gjemt i det
atskilte kommentarfeltet. `annet-avvik` ble brukt fire steder: sjåfør-
kontrollskjemaets avvikschips, Min Bil sin "➕ Registrer avvik"-hurtigflyt,
saksmotoren (`registrerKontrollAvvikSomSak()`/`registrerAvvikSomSak()`), og
label-oppslag for eksisterende saker/historikk/rapporter. Videre var alle
fire forekomster av "➕ Bestill tjenester" (Mobil Dashboard, Desktop
Dashboard, Kjøretøyprofil/Bilkort, den dedikerte Bestill tjenester-skjermen)
allerede utvidet til fem knapper (Service/EU-kontroll/Dekkskifte/
Verkstedtime/Ruteskift, Prioritet 46), men fortsatt bundet til
`.dash40-grid4` (fast `repeat(4,1fr)`) — femte kort (Ruteskift) havnet derfor
alltid alene på en ny rad.

**Løsning:**
1. **«Andre kontrollavvik» fjernet fra alle valgbare lister, ikke fra
   historikken.** `KONTROLLAVVIK_ORDER` er nå
   `['slitte-dekk', 'defekt-lys', 'manglende-utstyr', 'feil-pa-kjoretoy']` —
   `annet-avvik` er BEVISST fjernet herfra, men BEHOLDT uendret i
   `KONTROLLAVVIK_LABEL`/`KONTROLLAVVIK_IKON` slik at allerede lagrede saker/
   kontroller med `sourceId: 'annet-avvik'` fortsatt viser riktig tittel/ikon
   i Aktive saker, Historikk og Rapporter. Samme mønster som
   `UTE_AV_DRIFT_KATEGORI_ID` (Prioritet 41): fjernet fra det valgbare
   settet, beholdt for lesing av eksisterende data. Siden både
   sjåførkontrollskjemaets avvikschips og Min Bil sin avvikschips bygges
   dynamisk fra `KONTROLLAVVIK_ORDER.map(...)`, forsvinner «Andre
   kontrollavvik» automatisk fra begge steder uten noen egen UI-endring.
   Skade, Varsellampe og de fire gjenværende kontrollavvikstypene (Slitte
   dekk, Defekt lys, Manglende utstyr, Feil på kjøretøy) oppretter fortsatt
   aktive saker helt uendret.
2. **Ny «📨 Nye kommentarer»-seksjon øverst i Aktive saker**
   (`nyeKommentarerListe()`/`nyeKommentarerSectionHtml()`). RENT
   VISNINGSFILTER over den eksisterende `kontroller[]`-listen — ingen ny
   tabell, ingen nytt Airtable-felt, ingen kobling til saksmotoren. Viser
   Dato/Bil/Sjåfør/Kommentar for enhver kontroll med ikke-tom `kommentar`,
   sortert nyeste først. Bevisst **ingen "lest/kvittert"-tilstand** (kun en
   åpen/lukket visnings-toggle, `nyeKommentarerApen`, tilbakestilt når man
   forlater Aktive saker-skjermen) — dette er en ren logg, ikke en oppgave.
   En kommentar her oppretter aldri en sak, endrer aldri status og påvirker
   aldri bilstatus.
3. **Ny `.dash40-grid5`-klasse** (`repeat(5,1fr)`, med tilhørende
   responsive nedtrapping til 3 kolonner ≤1199px og 2 kolonner ≤640px —
   samme brytepunkter som `.dash40-grid4` allerede bruker) satt på alle fire
   reelle "➕ Bestill tjenester"-forekomster. **`.dash40-grid4` er URØRT** —
   KPI-radene (som fortsatt kun har fire kort) bruker fortsatt nøyaktig
   samme klasse og oppførsel som før. Service, EU-kontroll, Dekkskifte,
   Verkstedtime og Ruteskift ligger nå på én rad på desktop-bredde.
   (Den ubrukte, foreldede `bestillKortHtml`-konstanten fra Prioritet 37,
   som fortsatt kun har fire knapper og ikke er referert noe sted i koden,
   er bevisst IKKE rørt — dødt, urelatert restkode.)
4. `CACHE_VERSION` i `sw.js` økt til `bilpark-v43` (app-shell-innhold
   endret). `storage.airtable.js` er IKKE endret — ingen nye Airtable-felt,
   ingen `LIST_TABLES`-endring — så `versjon`/`?v=` er uendret på `v2.11.0`.

**Testet:** `node --check` på begge script-blokkene i `index.html` — ingen
syntaksfeil. Isolert Node.js-simulering av `nyeKommentarerListe()`-logikken
(filtrering av tomme/whitespace-kommentarer, sortering nyeste først) og av
`KONTROLLAVVIK_ORDER`-fjerningen (bekrefter 4 valgbare typer, `annet-avvik`
fortsatt slår opp riktig historisk tittel) — begge simuleringer bestått. Kun
statisk/isolert testet (ingen kjørende nettleser/Airtable i denne økten).

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll (`submitKontroll()` sin
kjernelogikk for kilometerstand/varsellamper/skade er uendret — kun hvilke
avvikstyper som kan VELGES er endret), `v.km`-skriveregler, Layout Editor,
Bilkategorier, `.dash40-grid4`/KPI-kortene, sjåførmodus sitt app-skall
(`renderDriverShell()`), «Sjekk ut bil»-teksten. **Del 2 av bestillingen
(bunnmeny «Min Bil · Ringeliste · Oppgaver · Mer», «Sjekk ut bil»-tekst) er
bevisst IKKE implementert** — venter på avklaring av kode-/live-avviket
beskrevet øverst i denne filen.

Se PRIORITET_47_ANALYSE.md for full kartlegging, kode-/live-avviket i detalj,
og simuleringslogg.

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
   **⚠️ Se Prioritet 42 under: denne flyttingen ble aldri faktisk lastet opp
   til det publiserte GitHub Pages-repoet — regresjonen var fortsatt til
   stede live per 2026-09-09, og var rotårsaken til at PWA-installasjon
   sluttet å tilbys.**
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
administrasjonsdelen gir derfor «🕓 Sjåfør i dag», ikke «👤 Aktiv sjåfør».
Verifisert dynamisk i simulering (se ROADMAP.md).
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

## Prioritet 42 (2026-09-09) — PWA-installasjon: rotårsak funnet og
bekreftet LIVE mot GitHub Pages (ikke bare kodelesing)

Bestilling: "på nye telefoner" tilbys ikke lenger "Installer app"/"Legg til
på startskjerm" på `https://benibanos.github.io/Biloversikt/`.

**Rotårsak (verifisert direkte mot den kjørende siden, med `fetch()`/
`caches.addAll()` i en ekte nettleserfane — ikke antatt):**

1. `manifest.json`/`manifest-sjafor.json` sine `icons[].src`
   (`icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-512-maskable.png`)
   gir **404** på den faktiske GitHub Pages-siden. Ikonene ligger i praksis i
   REPO-ROTEN (`icon-192.png` osv. — bekreftet 200 OK der), ikke under en
   `icons/`-mappe, selv om ALL kode (manifestene, `sw.js`, `index.html`s
   `<link rel="icon">`/`apple-touch-icon`) konsekvent forventer `icons/`-
   mappen. Ingen alternativ mappe (`Icons/`, `ICONS/`, `icon/`,
   `assets/icons/`) finnes heller.
2. Fordi ikonene 404, har manifestet ingen gyldig, lastbar 192px+-ikon — ett
   av Chromes to harde installerbarhetskrav feiler alene av dette.
3. **Samme mangel ødelegger i tillegg selve Service Workeren:** `sw.js` sin
   `install`-håndterer kjører `caches.open(CACHE_VERSION).then(cache =>
   cache.addAll(APP_SHELL))`, og `APP_SHELL` inneholder de samme tre
   ikonstiene. `cache.addAll()` er alt-eller-ingenting — når tre av ti URL-er
   404er, kaster HELE installasjonssteget en feil (`TypeError: Failed to
   execute 'addAll' on 'Cache': Request failed`), reprodusert direkte i
   nettleseren. Service workeren blir dermed værende i `installing`-
   tilstand og når ALDRI `activated`. Det andre harde installerbarhets-
   kravet (aktiv service worker) feiler dermed også — av nøyaktig samme
   underliggende årsak.

**Konklusjon:** dette er ikke en kodefeil i `index.html`/manifestene/
`sw.js` — alle fire filene er internt konsistente og korrekte, og peker
samstemt på `icons/`-mappen slik prosjektets egen dokumentasjon alltid har
beskrevet strukturen. Feilen er at `icons/`-mappen mangler på den FAKTISK
PUBLISERTE GitHub Pages-siden. Prioritet 36-teksten over hevdet at nøyaktig
dette var rettet "i den leverte pakken" — men det leverte innholdet ble
tydeligvis aldri (eller ikke lenger) faktisk lastet opp til det kjørende
repoet. Forklarer også hvorfor eksisterende, allerede installerte
telefoner ikke er rammet: de installerte trolig FØR denne mappen forsvant
fra live-siden, og sitter fortsatt med en fungerende, tidligere installert
kopi + gammel service worker-cache. "Nye telefoner" er ganske enkelt ethvert
FØRSTE besøk etter at mappen forsvant fra det publiserte repoet.

**Den faktiske fiksen er ikke en kodeendring, men en repo-operasjon:** last
opp `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` til en
`icons/`-mappe i `Benibanos/Biloversikt`-repoet på GitHub (samme filnavn, ny
plassering) — se PRIORITET_42_ANALYSE.md for eksakt fremgangsmåte. Denne
leveransen inneholder ikke selve bildefilene (de er ikke en del av
Claude-prosjektets tekstdokumenter) og kan derfor ikke gjøre denne delen av
jobben automatisk.

**Kodeendringer levert i samme runde (defensive/robuste forbedringer, ikke
selve rotårsaksfiksen, men adresserer sakens EKSTRA-punkt og gjør neste
eventuelle avvik synlig med én gang i stedet for å måtte reproduseres
manuelt):**

1. **Ny, alltid tilgjengelig installasjonsinngang i Innstillinger →
   Systeminnstillinger → "📲 Installer app"** (`pwaInstallStatusHtml()`).
   Tidligere fantes KUN det ene, lukkbare toppbanneret (`#pwa-install-bar`)
   — lukket man det (eller det aldri viste seg), fantes ingen annen vei inn
   i appens egen installasjonsflyt. Den nye seksjonen viser enten
   "🔽 Installer Bilpark"-knappen (deler samme `deferredInstallPrompt`/
   `installPwaNow()` som toppbanneret — ingen duplisert installasjonslogikk),
   en bekreftelse på at appen allerede kjører installert, iOS-instruksjonen,
   eller — dersom nettleseren aldri har tilbudt installasjon — en
   forklaring: **"📵 PWA ikke tilgjengelig på denne enheten"**, med
   konkret(e) årsak(er) hvis diagnosen under har funnet noen.
2. **Ny kjøretids-diagnose (`pwaDiag`/`kjorPwaDiagnostikk()`)**: henter
   manifestet på nytt (`fetch`), sjekker at hvert ikon faktisk laster
   (`new Image()`), og sjekker at service worker-registreringen faktisk
   lykkes — og viser resultatet i klartekst i "📲 Installer app"-seksjonen
   over. Dette er nøyaktig den samme sjekken som avdekket rotårsaken over,
   nå innebygd i appen slik at et fremtidig avvik (f.eks. hvis ikonene
   flyttes/forsvinner igjen) vises direkte til driftskoordinator i stedet
   for å kreve en ny, manuell utviklerøkt for å reproduseres.
3. **`id`-felt lagt til i begge manifestene** (`/Biloversikt/` og
   `/Biloversikt/?sjafor=1`) — anbefalt praksis for stabil app-identitet på
   tvers av fremtidige oppdateringer. Rent tillegg, endrer ikke eksisterende
   oppførsel.
4. `CACHE_VERSION` i `sw.js` økt til `bilpark-v38` (app-shell-filene endret
   seg). `kontroll.html` resynkronisert som eksakt kopi av `index.html`, som
   før.

**Ikke rørt:** Dashboard, Mobil Design 4.1, Kjøretøyprofil, Aktiv sjåfør,
Service, EU-kontroll, Dekk, hele Airtable-laget/`storage.airtable.js`
(ingen `?v=`-endring, siden filen selv ikke er endret) — saken var
eksplisitt avgrenset til PWA/manifest/service worker/installasjon.

Se PRIORITET_42_ANALYSE.md for full analyse (alle 8 kontrollpunktene fra
bestillingen, punkt for punkt), simuleringsresultat og eksakt fremgangsmåte
for repo-fiksen.

---

## Prioritet 43 (2026-09-09) — Kilometerstand følger nå alltid siste
sjåførkontroll (race condition i lesing funnet og rettet, ikke en feil i
skrivereglene)

Bestilling: kilometerstanden på et kjøretøy stemte ikke alltid overens med
den siste registrerte sjåførkontrollen (eksempel: Bil 7 viste 183 100 km i
Kjøretøyprofilen etter at en kontroll hadde registrert 184 220 km).

**Kartlegging (kun kodelesing, ingen antakelser — se PRIORITET_43_ANALYSE.md
for full detalj):** `v.km` skrives fra eksakt fire steder, og disse
stemte fra før nøyaktig med det denne filen allerede dokumenterte:
`submitKontroll()` (normal drift), `saveVehicleForm()` (eksplisitt
admin-korreksjon, bekreftelsesdialog), `performKontrollDeletion()`
(rekalkulering ved sletting, fra kronologisk nyeste gjenværende kontroll —
ikke høyeste km-verdi) og `resetFleetData()` (admin-nullstilling). Ingen
femte, udokumentert skrivevei ble funnet. Service- og
verkstedfunksjonene rører aldri `v.km` (kun sitt eget `service.km`-felt) —
bekreftet uendret siden Prioritet 29.

**Rotårsak (bekreftet med en kjørt simulering av selve kø-mekanismen, ikke
bare kodelesing):** `storage.airtable.js` sin `get()`-funksjon gikk, FØR
denne rettingen, IKKE gjennom den serialiserte per-ressurs-skrivekøen
(`_koKjor()`) som `set()`/`delete()` har brukt siden Prioritet 29. Appens
bakgrunnspoll (`window.subscribeLiveSync()`, hvert 45. sekund) kaller
`get('vehicles')` (via `reloadOne('vehicles')` i `index.html`) helt
uavhengig av om en `set('vehicles')`-skriving fra nettopp en
`submitKontroll()` fortsatt er underveis mot Airtable. Krysset de to
hendelsene hverandre, kunne pollens lesing få svar FØR skrivingen faktisk var
forpliktet, og returnere den GAMLE kilometerstanden — `reloadOne()` erstatter
da HELE det lokale `vehicles`-arrayet ubetinget (`vehicles = parsed`), og
sletter dermed den nettopp korrekt skrevne verdien fra det viste bildet i
appen, helt til neste pollrunde (opptil 45 sekunder) tilfeldigvis traff etter
at skrivingen var ferdig. Selve Airtable-raden var hele tiden korrekt — feilen
lå kun i det lokale, viste øyeblikksbildet.

**Løsning:** `get()` sendes nå gjennom SAMME `_koKjor()`-kø og samme
ressursnøkkel (`_ressursNokkelForKey()`) som `set()`/`delete()` allerede
brukte — ingen ny kø, ingen ny mekanisme, kun en utvidelse av en eksisterende
Prioritet 29-løsning til også å dekke lesing. En lesing mot en gitt
tabell/Settings-rad kan dermed aldri lenger starte midt i en ikke-fullført
skriving mot akkurat den ressursen. **Ingen endring i selve `v.km`-
skrivereglene i `index.html` var nødvendig** — de var allerede korrekte.
`storage.airtable.js` `versjon` økt til `v2.10.0`, `?v=` i `index.html`/
`kontroll.html` til `2.10.0`, `CACHE_VERSION` i `sw.js` til `bilpark-v39`.

**Ikke rørt:** Dashboard, Mobil Design 4.1, Kjøretøyprofil (markup/visning),
Aktiv sjåfør, Service-/verksted-/EU-/dekk-arbeidsflatene, `LIST_TABLES`/
Airtable-skjema, PWA/manifest/service worker sin `APP_SHELL`-liste (kun
cache-versjonstallet endret).

Se PRIORITET_43_ANALYSE.md for full kartlegging (alle km-skrivere punkt for
punkt), rotårsaksanalyse, simuleringsresultat (4 scenarioer) og
testresultater.

---

## Prioritet 44 (2026-09-10) — 🎨 Layout Editor under Innstillinger

Bestilling: redusere behovet for kodeendringer ved layoutjusteringer. Egen
«🎨 Layout Editor» under Innstillinger som lar brukeren administrere
rekkefølge og synlighet for Desktop Dashboard, Mobil Dashboard og Min Bil —
uten å gjøre selve komponentene redigerbare (kun plassering/synlighet),
lagret i Settings, ingen ny Airtable-tabell.

**Kartlegging (før implementering, se PRIORITET_44_ANALYSE.md for full
detalj):** Desktop Dashboard har 7 håndterbare komponenter (`kpi`,
`bestill`, `kommende`, `biloversikt`, `bilparkstatus`, `kreverhandling`,
`prioriterte`) fordelt på den eksisterende to-kolonne CSS-gridden
(`dash40-split` fra Prioritet 37/38). Mobil Dashboard har 5 (`kpi`,
`bestill`, `kommende`, `bilparkstatus`, `kreverhandling`) i én kolonne. Min
Bil har 6 (`bilkort`, `skade`, `varsel`, `avvik`, `kontakt`, `nysjafor`).
Faste elementer («chrome») holdes UTENFOR layoutsystemet på alle tre
flater: Desktop sin hilsen/topplinje og DB-varselbanner; Mobil sin
merkevare-header, søkefelt og DB-varselbanner; Min Bil sin tittel/
sjåfør-hint og den sikkerhetskritiske «✓ Sjekk ut bil»-knappen (alltid
synlig og sist).

**Lagring:** Én ny Settings-nøkkel, `dashboard-layout`, lest/skrevet via
det allerede eksisterende generiske get()/set()-sporet i
`storage.airtable.js` (samme mekanisme som `theme-preference`/
`bilkategorier`/`verksteder` — ingen ny Airtable-tabell, ingen endring i
`storage.airtable.js` selv, ingen `LIST_TABLES`-registrering nødvendig
siden dette IKKE er en `LIST_TABLES`-ressurs). Verdien er én JSON-blob:
`{ [flateKey]: { order: [...], hidden: [...] } }` for `desktop`/`mobil`/
`minbil`. Delt/globalt for alle brukere (samme prinsipp som
`theme-preference`), lastes i `loadAll()` og er dermed automatisk med i
appens eksisterende Airtable-synk.

**Løsning:**
- `DASHBOARD_LAYOUT_FLATER` definerer standard komponentliste (rekkefølge +
  label) per flate. `getLayoutFlate()` slår sammen lagret layout med
  standarden: enhver komponentnøkkel som finnes i standarden men IKKE i en
  lagret `order` legges automatisk til på slutten (aldri silent-hidden —
  samme fremtidssikringsprinsipp som `rebyggKategoriOppslag()` bruker for
  `bilkategorier`). En lagret nøkkel som ikke lenger finnes i standarden
  (f.eks. etter en fremtidig fjernet komponent) filtreres bort.
- `layoutFlateHtml(flateKey, komponentHtml)` er den eneste nye
  rendering-mekanismen: rendringsfunksjonene bygger fortsatt EKSAKT samme
  markup som før i et `komponentHtml`-oppslagsobjekt (`{key: '<html>'}`) —
  layoutsystemet avgjør kun HVILKE nøkler som vises og i HVILKEN
  rekkefølge, og rører aldri komponentenes eget innhold. Dette er selve
  garantien for «Ikke gjør komponentene redigerbare. Kun plassering og
  synlighet.»
- Desktop Dashboard sin eksisterende to-kolonne-grid bevares uendret (ikke
  redesignet til én kolonne): hver komponentnøkkel er permanent tilordnet
  én av tre grupper i `DESKTOP_LAYOUT_KOLONNER` (`full`, `venstre`,
  `hoyre`). Layout Editoren viser fortsatt ÉN samlet, sorterbar liste for
  "Desktop Dashboard" (matcher brukerens mentale modell av "3 flater"), men
  selve renderingen filtrerer den ene rekkefølgen ned per kolonnegruppe.
  Konsekvens: en komponent kan flyttes opp/ned INNENFOR sin kolonne og
  skjules/vises fritt, men kan ikke flyttes over i en annen kolonne — en
  bevisst avveining for å unngå et fullt redesign av en fungerende layout
  («endre minst mulig»).
- Rekkefølge endres med opp/ned-knapper — samme mønster som allerede brukes
  for å sortere `bilkategorier` (Prioritet 41), ikke ekte HTML5
  dra-og-slipp. Valgt eksplisitt av brukeren (fremfor drag-and-drop eller en
  hybrid) fordi det gjenbruker et etablert mønster («ikke dupliser
  eksisterende funksjoner») og fordi native drag-and-drop er upålitelig på
  mobil/touch — Innstillinger er også nåbar fra mobil.
- Ny accordion-rad «🎨 Layout Editor» i `renderInnstillinger()`, med egen
  seksjon per flate og en «↺ Nullstill til standard»-knapp per flate
  (bekreftelsesdialog, tilbakestiller kun den ene flaten sin lagrede
  rekkefølge/synlighet — ikke de andre to).

**Simulering (se PRIORITET_44_ANALYSE.md for full kjøring og resultat):**
Fire scenarioer kjørt i en frittstående Node.js-simulering av selve
lagrings-/gjenopprettingsmekanismen (kopiert 1:1 fra `index.html`): (1)
Desktop — endre rekkefølge + skjule en komponent, overlever full
tilstandsnullstilling (dvs. «Oppdater app»/Reload/Ny innlogging, som alle
fører til at `loadAll()` bygger `dashboardLayout` helt på nytt fra
Settings); (2) Mobil — skjule en komponent, overlever nullstilling, og
«Nullstill til standard» gir tilbake nøyaktig standard rekkefølge/synlighet;
(3) Min Bil — endre rekkefølge, overlever nullstilling, ingen komponent tapt;
(4) fremtidssikring — en ny komponentnøkkel lagt til i koden ETTER at en
layout ble lagret, dukker automatisk opp i visningen (aldri silent-hidden).
Alle fire besto.

`CACHE_VERSION` i `sw.js` økt til `bilpark-v40` (app-shell-innhold i
`index.html`/`kontroll.html` endret betydelig). `storage.airtable.js`
UENDRET i denne prioriteten — ingen versjonsøkning av `?v=`-parameteren var
nødvendig.

**Ikke rørt:** `storage.airtable.js` (ingen endring i denne filen for
Prioritet 44), `LIST_TABLES`/Airtable-skjema (ingen ny tabell/felt),
`v.km`-skriveregler, service-/verksted-/EU-/dekk-arbeidsflatene, Aktiv
sjåfør, PWA/manifest-filene (kun `CACHE_VERSION`-tallet i `sw.js` endret).

Se PRIORITET_44_ANALYSE.md for full komponentkartlegging (alle tre flater
punkt for punkt), lagringsdesign og simuleringsresultat.

---

## Prioritet 45 (2026-09-10) — Omstrukturering av Innstillinger

Bestilling: redusere visuell støy i Innstillinger (som hadde vokst til en
lang, flat liste med seks topplinje-seksjoner) og samle relaterte funksjoner
i logiske grupper — «mindre scrolling, mindre støy, lettere å finne
funksjoner, bedre struktur». Eksplisitt avgrenset til struktur/navigasjon/
Innstillinger/opprydding av informasjonsfelt — Dashboard, Mobil Dashboard,
Sjåførkontroll, Aktiv sjåfør-logikk, kilometerlogikk, Service, Dekk og EU
skulle IKKE endres.

**Kartlegging (før implementering, se PRIORITET_45_ANALYSE.md):** seks
tidligere topplinje-seksjoner i Innstillinger (Administratorbrukere,
Verkstedregister, ⚙️ Administrer bilkategorier, 🎨 Layout Editor,
Systeminnstillinger, Database status), der Systeminnstillinger alene
inneholdt fem urelaterte ting (Tema, Lenke for sjåfører, Om appen, Installer
app, Oppdater app, Nullstill bilparkdata).

**Løsning — sidemeny:** «⚙️ Innstillinger» flyttet fra desktop-sidebarens
primærliste (`DESKTOP_NAV_PRIMARY`) til sekundærseksjonen, som siste punkt
etter Historikk/Analyse; i mobilens ☰ Meny flyttet fra hovedlisten til
`drawer-footer`, som siste navigasjonspunkt rett over «🚪 Logg ut» (logg ut
beholdt som aller siste handling — universell konvensjon, se «Kjente
begrensninger»). «📱 Bytt til Mobil-visning»/«🖥️ Bytt til Desktop-visning» —
tidligere to separate menypunkter, ett i hver visning — er slått sammen til
ÉN bryter inne i Innstillinger → ⚙️ Systeminnstillinger
(`attachDeviceOverrideToggleListener()`), som leser/setter samme
`deviceOverride`-variabel som før.

**Løsning — Innstillinger, fire grupperte hovedseksjoner** (samme
`settingsAccordionRow()`-funksjon gjenbrukt REKURSIVT for nesting — ingen ny
akkordion-mekanisme, ingen ny lytterkode, siden den eksisterende delegerte
`[data-toggle-settings]`-lytteren allerede fanger opp nestede rader):

1. **📦 Register** — ⚙️ Administrer bilkategorier (med ny «Alle kjøretøy»-
   overskrift over kategorilisten) + Verkstedregister, nestet under én
   dropdown.
2. **🎨 Layout Editor** — Tema (flyttet hit fra Systeminnstillinger) +
   Desktop Dashboard, Mobil Dashboard, Min Bil Dashboard (Prioritet 44,
   uendret funksjon). Nytt: en lett, SKJEMATISK forhåndsvisning under hver
   flates liste (`layoutForhandsvisningHtml()`) — kort med komponentnavn i
   riktig rekkefølge/gruppering, bevisst IKKE en pikselnøyaktig kopi av det
   ekte Dashboardet (det ville krevd å duplisere rendringslogikken inne i
   Innstillinger, i strid med «ikke dupliser eksisterende funksjoner»).
3. **👤 Sjåførside** (ny) — 🚐 Min bil (åpner sjåførsidens faktiske
   inngangslenke i ny fane, samme `driverLink()` som under), ✅
   Sjåførkontroll (lenke + «Kopier lenke», flyttet uendret fra
   Systeminnstillinger), 📞 Ringeliste (ny, se under).
4. **⚙️ Systeminnstillinger** — nå selv en nestet dropdown-gruppe: 🔄
   Oppdater app (inkl. 📲 Installer app), 📡 Database status, 👤
   Administratorbrukere, 📘 Informasjonsveileder (ny, se under), 📱🖥️
   Enhetsvisning, 🗑️ Nullstill bilparkdata.

**Ny funksjon — 📞 Ringeliste:** telefonnummer registreres PER KJØRETØY
(nytt felt `v.telefon` → `Vehicles.Telefon`, registrert i `LIST_TABLES` i
`storage.airtable.js`, `versjon` økt til `v2.11.0`, `?v=` i
`index.html`/`kontroll.html` til `2.11.0`) fra Innstillinger → 👤
Sjåførside → 📞 Ringeliste (legg til/rediger/fjern, samme inline
rediger-mønster som Verkstedregisteret, lagres via `saveVehicles()` — samme
vei som eksisterende `flyttBilTilKategori()`). Vises hos sjåførene som en
ny, håndterbar Min Bil-komponent («📞 Ringeliste», automatisk lagt til i
`DASHBOARD_LAYOUT_FLATER.minbil` og dermed automatisk med i EKSISTERENDE
lagrede Layout Editor-oppsett via samme fremtidssikring som Prioritet 44
allerede har — verifisert med en kjørt simulering, se PRIORITET_45_ANALYSE.md):
lister andre kjøretøy med registrert nummer (egen bil ekskludert), hver rad
en ekte `tel:`-lenke for direkte oppringing. Rører IKKE Sjåførkontroll eller
Aktiv sjåfør-logikk — kun Min Bil, som ikke er på den forbudte listen.

**Ny seksjon — 📘 Informasjonsveileder:** samler forklarende hjelpetekst som
tidligere lå spredt i appen. 🛟 Mobilitetsgaranti sin forklaring (tidligere
vist i Kjøretøyprofilen når feltet var tomt: «Ikke registrert — legg den inn
under Rediger informasjon») er kortet ned i Kjøretøyprofilen til «Ikke
registrert — se Informasjonsveilederen i Innstillinger», med full forklaring
flyttet hit. 🛠️ Bestill tjenester sin forklaringssetning («Velg tjeneste, så
velger du bil i neste steg…») er fjernet fra selve Bestill tjenester-skjermen
(kun den dynamiske telleren «X kommende avtaler» står igjen der) og flyttet
hit i sin helhet. «Om appen» flyttet hit fra Systeminnstillinger. Ingen av
de underliggende datafeltene (`v.mobilitetsgaranti` osv.) eller noen
funksjonalitet er endret — kun forklaringsteksten er samlet.

**Simulering (se PRIORITET_45_ANALYSE.md):** (1) hver av de tolv tidligere
selvstendige innholdsblokkene (adminBody/verkstedBody/kategoriBody/
databaseBody/layoutBody/sjaforsideBody/registerBody/systemBody m.fl.) er
bekreftet brukt NØYAKTIG ÉN GANG i den nye returnerte HTML-en — ingen
innstilling forsvant eller ble duplisert; (2) kjørt Node.js-simulering av
`getLayoutFlate()`-sammenslåingen bekrefter at «ringeliste» automatisk
dukker opp (aldri silent-hidden) i en Min Bil-layout lagret FØR Prioritet
45, med brukerens øvrige rekkefølge/skjulte komponenter urørt; (3)
`node --check` på begge script-blokkene og `storage.airtable.js`: ingen
syntaksfeil; (4) `diff index.html kontroll.html`: bekreftet identiske; (5)
manuell gjennomgang bekrefter «⚙️ Innstillinger» forekommer nøyaktig én
gang i både desktop-sidebar og mobil-drawer, plassert sist i begge.

`CACHE_VERSION` i `sw.js` økt til `bilpark-v41` (app-shell-innhold i
`index.html`/`kontroll.html` endret betydelig — meny/Innstillinger-
restrukturering).

**Ikke rørt:** Dashboard, Mobil Dashboard (kun Bestill tjenester-skjermens
forklaringssetning er kortet ned, selve `renderDashboard()`/
`renderMobilHjem()` er urørt), Sjåførkontroll (`renderKontroll()`/
`submitKontroll()`), Aktiv sjåfør-logikk, `v.km`-skriveregler, Service-/
Dekk-/EU-arbeidsflatene, `LIST_TABLES` for alle andre tabeller enn det ene
nye `Vehicles.Telefon`-feltet.

Se PRIORITET_45_ANALYSE.md for full kartlegging (gammel struktur → ny
struktur, alle flyttede felt, alle flyttede hjelpetekster), simuleringslogg
og testresultater.

---

## Prioritet 46 (2026-09-10) — Rapporter, Carglass Ruteskift og Verkstedtime 2.0

Bestilling: fem delmål — bedre rapporter (full historikk ved bilfiltrering),
bedre håndtering av ruteskift (Carglass), enklere verkstedbestilling
(strukturerte EU-kontroll/Ruteskift-felt istedenfor fritekst), bedre
synlighet av telefonnummer i Kjøretøyprofil. IKKE ENDRE: Aktiv sjåfør,
Kontrollflyt, Kilometerlogikk, Layout Editor, Bilkategorier — alle bekreftet
urørt.

**Kartlegging (før implementering, se PRIORITET_46_ANALYSE.md) — funnet, IKKE
antatt:** en grundig gjennomgang av samtlige historikk-/rapportvisninger
(Kontrollhistorikk, Servicehistorikk, Verkstedhistorikk, Skadehistorikk,
Kostnadshistorikk) viste at disse ALLEREDE bruker `.filter()` og viser full,
ukappet historikk — INGEN `.find()`-basert «kun siste»-bug ble funnet der.
De faktiske, bekreftede avvikene fra ticket-kravet «Filter på bil skal aldri
redusere visningen til kun siste hendelse» var kun to: (1) Dekkoversikt sin
«dekkskifter»-underliste var hardkodet kappet til 5 (`.slice(0, 5)` på
`dekkhistorikk`); (2) Rapporthub sine tre statusrapporter (Kilometerstand-,
Service- og Dekkrapport) er ETT-rad-per-kjøretøy-flåteoversikter av design
(nødvendig for <10 sek-forståelse av hele flåten) — men da uten unntak selv
når filtrert til ETT spesifikt kjøretøy, noe som i praksis ga nøyaktig den
opplevelsen ticket-eksempelet beskriver («Bil 7 kontroller 01.09→184890» —
kun siste kontroll vist, ikke alle fire). Dette er dokumentert ærlig i
PRIORITET_46_ANALYSE.md istedenfor å bli stille omtolket.

**Løsning — Del 1 (Rapporter, full historikk ved bilfiltrering):**
- Dekkoversikt: `.slice(0, 5)`-kappingen på dekkskiftelisten er fjernet —
  viser nå ALLE registrerte dekkskifter for kjøretøyet (overskrift endret
  fra «Siste dekkskifter» til «Dekkskifter (N)»).
- Kilometerstandsrapport, Servicerapport og Dekkrapport (under 📈 Rapporter):
  når `rapportFilterBil` er satt til ETT spesifikt kjøretøy, erstattes den
  vanlige ett-rad-per-bil-oversikten med FULL historikk for akkurat det
  kjøretøyet — kilometerhistorikk fra `vehicleKontroller()` (samme datakilde
  som Kontrollhistorikk, ingen ny sannhet), servicehistorikk fra
  `vehicleServiceHistorikk()`, dekkhistorikk fra `dekkhistorikk`-arrayet.
  Uten bilfilter (eller ved gruppefilter på flere biler) er flåteoversikten
  uendret — nødvendig for at rapportene fortsatt er lesbare på flåtenivå.
  Gjelder både skjermvisning og Excel-eksport.
- Kontrollhistorikk (Bilkort → Historikk → Kontroller, `vKontroller`),
  Kontrolloversikt (flåtebred), Servicehistorikk (`renderServiceSkjerm()`),
  Verkstedhistorikk (`getFilteredVerkstedtimer()`), Skaderapport
  (`rapportSkadeRader()`) og Kostnadsoversikt (`renderKostnadsoversikt()`) er
  IKKE endret — bekreftet allerede uten cap, allerede full historikk.

**Løsning — Del 2 (💥 Ruteskift-hurtigknapp):** ny 5. knapp lagt til i ALLE
eksisterende «➕ Bestill tjenester»-forekomster (Mobil Dashboard- og Desktop
Dashboard-komponentet under Layout Editor, Bilkort sin per-bil-variant, og
den dedikerte 🛠️ Bestill tjenester-skjermen) — samme mønster som 🚦
EU-kontroll: `data-bestill="ruteskift"` → `bestillRuteskift(vehicleId)` →
`vtRuteskiftForhandskrysset = true` → `goToRegisterVT()` → forhåndskrysser
den nye Ruteskift-boksen i Ny verkstedtime-skjemaet. Ingen ny sakstype, ingen
ny tabell, ingen ny navigasjonsflate.

**Løsning — Del 3 (💥 Ruteglassrapport, ny):** lagt til i Rapporthub
(`RAPPORT_ORDER`/`RAPPORT_LABEL`/`RAPPORT_IKON`), bygget etter nøyaktig samme
mal som Skaderapport (`rapportRuteglassRader()`/`renderRapportRuteglass()`/
`eksporterRapportRuteglass()`, delt `rapportTabellHtml()`/
`rapportEksporterExcel()` — ingen parallell rapportmotor). Datakilde:
`verkstedtimer` der `type` inneholder `'ruteskift'` — INGEN ny tabell. Viser
Dato/Bil/Verksted/Kommentar/Kostnad/Status. Filtrering: Bil og Periode
(gjenbruker de delte filtrene alle rapporter har) PLUS et nytt Verksted-filter
(`rapportFilterVerksted`, kun vist for Ruteglassrapport via
`RAPPORT_HAR_VERKSTED_FILTER`) — i motsetning til de fem eldre
statusrapportene er Periode- og det nye Verksted-filteret her faktisk
anvendt på dataene (ticket-krav), ikke bare vist i UI.

**Løsning — Del 4 (Verkstedtime 2.0 — strukturerte felt):** to uavhengige
avkrysningsbokser («🚦 EU-kontroll» og «💥 Ruteskift») flyttet til ØVERST i
Ny verkstedtime-skjemaet (over Bil/Verksted-valget), og kan begge krysses av
samtidig. `WorkshopAppointments.Type` (allerede registrert felt, ingen ny
Airtable-kolonne) lagres nå som en kommaseparert streng
(`'eu-kontroll'`/`'ruteskift'`/`'eu-kontroll,ruteskift'`/`''`) — ALDRI
gjettet fra beskrivelsesfeltet. Beskrivelsesfeltets placeholder-tekst er
endret fra å foreslå «F.eks. EU-kontroll» til nøytral tekst, siden feltet
ikke lenger skal brukes til å identifisere disse typene. Ny, delt
lesefunksjon `vtHarType(t, kode)` (+ `vtTypeIkon()`/`vtTypeTittel()` for
kombinert 🚦💥-visning) erstatter fire tidligere spredte, separate
`t.type === 'eu-kontroll'`-sjekker (Bestill tjenester sin «kommende
avtaler»-liste, Kalender, Planlegging, en indre kalenderfunksjon) — SAMME
lesemåte overalt, ikke fire ulike. `vehicleHarRegistrertRuteskiftTime()`
speiler den eksisterende `vehicleHarRegistrertEuTime()` og vises på Bilkort.

**Løsning — Del 5 (telefonnummer i Kjøretøyprofil):** `v.telefon` (registrert
i Prioritet 45 sin 📞 Ringeliste) vises nå også i 🚐 Kjøretøyprofil under
Kjøretøyinformasjon, ved siden av Reg.nr/Bilgruppe/Aktiv sjåfør/
Mobilitetsgaranti — som en klikkbar `tel:`-lenke («📞 Ring …») når registrert,
ellers «–». Samme saniteringsmønster (`replace(/[^+0-9]/g,'')`) som den
eksisterende Ringeliste-visningen — ingen ny logikk.

**Simulering (se PRIORITET_46_ANALYSE.md):** 27 automatiserte
assert-sjekker i en isolert Node.js-simulering av nøkkellogikken (siden
appen for øvrig krever nettleser-DOM/Airtable/XLSX) — alle bestått: (1)
Kilometerrapport filtrert på ett kjøretøy viser alle historiske registreringer
(ticket sitt Bil 7-eksempel: 4 av 4 kontroller, ikke bare siste); (2)
Servicehistorikk uendret full; (3) Verkstedhistorikk viser alle timer for
filtrert bil; (4) Ruteglassrapport viser korrekt kun ruteskift-typer, med
virkende Bil- og Verksted-filter og riktig utledet Planlagt/Utført-status;
(5) Ruteskift-bestilling forhåndskrysser korrekt boks og setter riktig type
alene; (6) EU-bestilling uendret; (7) begge avkrysset samtidig registrerer
BEGGE typene på samme verkstedtime med korrekt kombinert ikon/tittel; (8)
Kjøretøyprofil viser korrekt `tel:`-lenke når nummer finnes, «–» når det
mangler; (9) Dekkoversikt viser alle 8 (ikke kun 5) i en regresjonstest av
den fjernede kappingen. I tillegg: `node --check` på begge script-blokkene —
ingen syntaksfeil; `diff index.html kontroll.html` — bekreftet identiske.

`CACHE_VERSION` i `sw.js` økt til `bilpark-v42` (app-shell-innhold endret
betydelig). `storage.airtable.js` er IKKE endret (ingen nye Airtable-felt —
`Type` og `Telefon` var allerede registrert fra tidligere prioriteter), så
`versjon`/`?v=` er uendret på `v2.11.0`.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll (`renderKontroll()`/
`submitKontroll()`), `v.km`-skriveregler, Layout Editor (mekanikken —
knappene i Bestill tjenester-komponentet er innholdsendringer INNI et
eksisterende, administrerbart komponent, ikke en endring av selve
reorganiserings-/synlighetsmekanismen), Bilkategorier, redigeringsskjemaet
for eksisterende verkstedtimer (`saveVTEdit()` — type settes kun ved
opprettelse, som før Prioritet 46).

Se PRIORITET_46_ANALYSE.md for full kartlegging, rotårsaksfunn på
«kun siste hendelse»-avviket, designbegrunnelse for det kommaseparerte
type-feltet, simuleringslogg og testresultater.

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

- **Frontend:** Ett samlet HTML-dokument (`index.html`, ~10 800 linjer) med
  all CSS og all forretningslogikk inline i to `<script>`-blokker. Ingen
  separate CSS- eller komponentfiler.
- **Database:** Airtable — se AIRTABLE_MIGRATION.md for fullt skjema. Ingen
  backend/proxy; appen snakker direkte med Airtables REST-API fra
  nettleseren.
- **Hosting:** GitHub Pages — den eneste plattformen prosjektet publiseres på.
- **PWA/service worker:** `sw.js`, nettverk-først-strategi med cache som
  offline-fallback (`CACHE_VERSION = 'bilpark-v41'`, Prioritet 45). To
  separate manifester: `manifest.json` (hovedapp) og `manifest-sjafor.json`
  (sjåfør-snarvei via `kontroll.html`, `start_url` med `?sjafor=1`), begge nå
  med et eksplisitt `id`-felt (Prioritet 42). Ikoner skal ligge i `icons/`
  (`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`) — **se Prioritet
  42: bekreftet live at denne mappen for øyeblikket MANGLER på den
  publiserte siden; må rettes i selve GitHub-repoet, se
  PRIORITET_42_ANALYSE.md.** Se også ny seksjon "PWA og installasjon" under.
- **Autoritativ storage-fil:** `storage.airtable.js` (nåværende versjon
  `v2.10.0`, cache-bustet via `?v=2.10.0` på script-taggen i `index.html` OG
  `kontroll.html` — se "Versjonskontroll (permanent løsning)" under for
  hvordan Database status verifiserer dette automatisk). Siden Prioritet 43
  serialiserer filen også `get()`-lesinger gjennom samme per-ressurs-kø som
  `set()`/`delete()` (se "Dataintegritet" under) — dette er den
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

## PWA og installasjon (Prioritet 42)

- Manifester: `manifest.json` (hovedapp, `start_url: ./index.html`),
  `manifest-sjafor.json` (sjåfør-snarvei, `start_url: ./index.html?sjafor=1`).
  Begge har `id` (nytt i Prioritet 42), `name`/`short_name`,
  `display: standalone`, korrekt `scope: ./` (matcher GitHub Pages-
  understien `/Biloversikt/`), og tre ikoner (192 any, 512 any, 512
  maskable).
- `sw.js`: nettverk-først for samme-opprinnelse GET-forespørsler, cache som
  offline-reserve. `install`-steget cacher `APP_SHELL` (app-skallfilene,
  inkl. ikonene) via `cache.addAll()` — **denne er alt-eller-ingenting: hvis
  ÉN fil i `APP_SHELL` 404er, feiler HELE service worker-installasjonen.**
  Hold denne listen synkronisert med hva som faktisk finnes live — dette var
  nøyaktig det som feilet i Prioritet 42.
- `beforeinstallprompt`/`appinstalled` fanges i `index.html` sitt
  hovedscript (`deferredInstallPrompt`), med to visningssteder som deler
  samme tilstand og samme `installPwaNow()`-funksjon: det dismissbare
  toppbanneret (`#pwa-install-bar`, vises automatisk når nettleseren
  tilbyr installasjon) og "📲 Installer app" i Innstillinger →
  Systeminnstillinger (alltid tilgjengelig, viser diagnose
  (`pwaDiag`/`kjorPwaDiagnostikk()`) når installasjon IKKE er tilgjengelig).
- **Kjent, dokumentert driftsavhengighet:** koden forutsetter at
  `icons/icon-192.png`, `icons/icon-512.png` og `icons/icon-512-maskable.png`
  faktisk finnes i `icons/`-mappen i det publiserte GitHub Pages-repoet.
  Dette er IKKE noe koden kan garantere alene — verifiser det manuelt (åpne
  URL-ene direkte i nettleseren, eller se "📲 Installer app" i
  Innstillinger) etter enhver endring i repoets filstruktur.

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
- Innstillinger (inkl. Database status, synkroniseringsstatus, "📲 Installer
  app" (nytt i Prioritet 42), diagnoseverktøy)

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
    kodegjennomgang i Prioritet 29-revisjonen, og re-verifisert (uttømmende
    `grep`-basert kartlegging) i Prioritet 43 uten å finne noen femte,
    udokumentert skrivevei.
  - **Prioritet 43:** disse fire skrivepunktene var allerede korrekte og
    fulgte allerede ønsket prioritering ("siste sjåførkontroll vinner").
    Bugen som meldte at `v.km` ikke alltid stemte overens med siste
    kontroll, lå IKKE i skrivereglene, men i en race condition i
    `storage.airtable.js` sin LESING (`get()`), som kunne la bakgrunnspollen
    (`window.subscribeLiveSync()`) midlertidig overskrive det lokale, viste
    `v.km` med en gammel verdi fra Airtable — se "Dataintegritet" under og
    PRIORITET_43_ANALYSE.md for full rotårsak og fiks.
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
- **Lesing serialisert i samme kø som skriving (Prioritet 43, regresjonsfiks):**
  `_koKjor()` beskyttet frem til Prioritet 43 KUN `set()`/`delete()` — `get()`
  leste Airtable direkte, uavhengig av pågående skrivinger mot samme ressurs.
  `window.subscribeLiveSync()` sin 45-sekunders bakgrunnspoll kunne dermed
  (via `reloadOne()` i `index.html`) lese en GAMMEL verdi midt i en
  ikke-fullført `set()`, og ubetinget overskrive det lokale, viste
  datasettet med den — dette var rotårsaken til at `v.km` ikke alltid
  stemte overens med siste sjåførkontroll (se "Prioritet 43" og
  PRIORITET_43_ANALYSE.md). `get()` går nå gjennom SAMME `_koKjor()`-kø og
  ressursnøkkel som `set()`/`delete()`, slik at en lesing mot en gitt
  tabell/Settings-rad aldri lenger kan starte midt i en ikke-fullført
  skriving mot akkurat den ressursen.
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

1. Les denne filen, ROADMAP.md og AIRTABLE_MIGRATION.md — for PWA/
   installasjonssaker spesifikt også PRIORITET_42_ANALYSE.md.
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
5. **For alt som gjelder PWA-installerbarhet (Prioritet 42): verifiser
   ALLTID mot den faktisk publiserte siden, ikke bare kildekoden/det som er
   levert i en ZIP.** Prioritet 42 viste at kode og live-repo kan divergere
   — ikonmappen fantes i kildekoden/den leverte pakken siden Prioritet 36,
   men var likevel fortsatt fraværende på den publiserte GitHub Pages-siden
   per 2026-09-09.

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
- **For PWA-endringer spesifikt (nytt i Prioritet 42): åpne hver
  ikon-/manifest-/service worker-URL direkte i nettleseren mot den FAKTISK
  publiserte siden og bekreft 200 OK — ikke stol på at kildekoden alene
  garanterer dette.**
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
- **Nytt i Prioritet 42: et manifest/en service worker kan være 100 %
  korrekt i KILDEKODEN og likevel feile fullstendig live, hvis en referert
  fil (typisk ikoner) mangler på selve den publiserte GitHub Pages-siden.
  `cache.addAll()` i `sw.js` er alt-eller-ingenting — én manglende fil i
  `APP_SHELL` blokkerer HELE service worker-installasjonen, ikke bare den
  ene filen.**
- **Nytt i Prioritet 43: en `get()`-lesing mot en Airtable-tabell/Settings-rad
  som ikke er serialisert mot pågående `set()`-skrivinger til SAMME ressurs
  kan tilfeldigvis returnere en gammel verdi og ubetinget overskrive korrekt,
  nettopp lagret lokal tilstand — særlig farlig i kombinasjon med en
  periodisk bakgrunnspoll (`window.subscribeLiveSync()`). Enhver fremtidig
  lesefunksjon i `storage.airtable.js` bør gå gjennom `_koKjor()` på samme
  måte som `get()`/`set()`/`delete()` nå gjør, ikke lese Airtable direkte.**
