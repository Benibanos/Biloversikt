# Bilpark App

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

# Dashboard Pro — struktur og prinsipp om ingen dobbeltinformasjon

Dashboard er appens mest brukte side og skal gi driftskoordinator full
oversikt over bilparken på under 10 sekunder. Hvis informasjon allerede er
synlig i et hovedkort eller en hovedseksjon, skal den normalt ikke gjentas et
annet sted. Mål: mer oversikt, mindre støy, minst mulig scrolling.

Gjeldende struktur (topp til bunn):

1. Hilsen/greeting-card
2. Databasevarsel (kun ved feil/manglende felt)
3. **Hovedstatus** — én kompakt seksjon: antall biler totalt, kontrollert,
   mangler kontroll, aktive saker, verksted, kritisk. Første statusinformasjon
   brukeren ser.
4. **Morgenvisning** — den primære, handlingsorienterte arbeidsseksjonen for
   dagens start. Viser kun det som krever handling i dag eller påvirker
   dagens drift, aldri historiske data. Fem underseksjoner:
   - *Dagens situasjon*: nøkkeltall (biler klare, mangler kontroll, verksted
     i dag, oppfølging i dag, kritiske saker)
   - *Må gjøres i dag*: samme prioriterte utvalg (og rekkefølge) som "Krever
     handling nå" under, men med handlingsorientert tekst ("Kontakt verksted
     — Bil 7") — gjenbruker `dashKreverTop5`/feltet `aksjon` på hver
     oppføring, ikke egen logikk
   - *Mangler kontroll*: liste over biler uten kontroll i dag, trykk åpner
     kontrollregistrering direkte for den bilen
   - *Verksted i dag*: kun verkstedtimer med dato = i dag, skjules helt hvis
     tom
   - *Kritiske forhold*: kun åpne saker med kritisk prioritet, skjules helt
     hvis tom
5. **Krever handling nå** — fortsatt en egen seksjon (se
   Dashboard Pro-integrasjon i Morgenvisningen), samlet oppsummering
   (🔴 kritiske saker, ⛔ biler ute av drift ved behov, 🟠 oppfølginger i
   dag, 🟡 biler mangler kontroll, Totalt) + "Operativ arbeidsliste":
   utvidbar liste over de 5 viktigste hendelsene, prioritert kritisk →
   forfalt → oppfølging i dag → manglende kontroll. Bygger på eksisterende
   `sakKreverHandling()` — ingen egen, parallell forretningslogikk.
6. **Kommende verkstedtimer** — kun neste 3 (ikke lange lister).
7. **Bilparkhelse** — kompakt: kun tall og statusfarge (🟢🟡🟠🔴⚪), ingen
   forklarende tekst.
8. **Hurtighandlinger** — 4 registreringsknapper (kontroll/skade/verksted/ny
   sak), alltid lett tilgjengelig.
9. Biloversikt (filtrerbar, uendret) — hvert bilkort viser nå "Dagens
   status" (`vehicleDagensStatus()`: kritisk sak > mangler kontroll >
   verksted i dag > klar for drift) som hodechip, i stedet for den tidligere
   rene kontrollert/ikke-kontrollert-chippen som den strengt utvider.

Ikke prioritert på Dashboard (finnes andre steder i appen): historikk,
analyse, kostnader. Fjernet fra Dashboard i denne omgangen: den gamle
5-korts stat-grid, egen "Kontrollstatus"-fremdriftsbar, "Eldste åpne
saker"-panelet, kostnadskortene (Forventede kostnader/Avsettinger), og de 7
gamle navigasjons-hurtiglenkene (fortsatt tilgjengelig via ☰ Meny).

---

# Navigasjon — universell tilbakeknapp

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
  og all annen historikk står fullstendig urørt — kun en ev. stale
  `createdByControlId`-referanse på det som beholdes nulles ut.
- **Full cleanup** (`fullCleanup:true`): fjerner i tillegg skader/varsellamper
  som utelukkende stammer fra kontrollen (samme "uendret siden opprettelse"-
  sjekk som før), og nå også aktive saker som utelukkende stammer derfra —
  men KUN dersom saken ikke er "viderebehandlet"
  (`sakHarBlittViderebehandlet()`: status forbi "ny", rapportert på nytt,
  fått `nextAction`/`followUpDate`, eller fått bestilt verksted). Er den
  viderebehandlet, kreves eksplisitt avkrysset bekreftelse før den kan
  fjernes automatisk.

Kilometerstand rekalkuleres alltid fra gjenværende kontroller uansett modus
(rent avledet tall, ikke en "sak"). Én historikkhendelse ("Kontroll slettet
av administrator", med ev. årsak) logges alltid til bilens `statusHistorikk`
(samme felt som "ute av drift"-logg fra Fase 7) FØR kontrollen fjernes, slik
at den overlever i Kjøretøyhistorikk selv om kontrollen selv er borte.

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

---

# Viktigste prinsipp

Denne appen bygges for å eliminere behovet for hukommelse.

Hvis brukeren må huske noe selv:

Da mangler appen funksjonalitet.
