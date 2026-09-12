# ROADMAP.md — Bilpark Operativsystem

Sist oppdatert: 2026-09-10 (Prioritet 48.1 — kontrastfeil på «Registrer
varsellampe»/«Registrer avvik» funnet og rettet: `.chip`/`.chip-text` manglet
eksplisitt tekstfarge og falt tilbake på nettleserens standard knappefarge).
Før det: Prioritet 48 — siste premium-polish av
sjåførside: nytt linjeikonsystem, restylet Min Bil/Velg Bil, implementert
direkte i faktisk prosjektkode og verifisert med Playwright-simulering.
«Sjekk ut bil»-teksten er nå satt eksplisitt til «Sjekk ut bil» / «Avslutt
arbeidsdagen og frigjør bilen» som del av denne runden.
Før det igjen: Prioritet 47, Del 2, redefinert av bruker — sjåførens bunnmeny
🚐 Min Bil · 📞 Ringeliste · 💬 Kommentarer · ☰ Mer; Ringeliste flyttet ut av
Min Bil; Kommentarer viser Del 1 sin «📨 Nye kommentarer»-logg. Før det:
Prioritet 47, Del 1 — fjernet «Andre kontrollavvik» fra valgbare
lister, ny «📨 Nye kommentarer»-seksjon i Aktive saker, bestillingstjenester
samlet på én rad. Før det igjen: Prioritet 46 — Rapporter (full historikk ved bilfiltrering),
Carglass Ruteskift-hurtigknapp, ny 💥 Ruteglassrapport, Verkstedtime 2.0,
telefonnummer i Kjøretøyprofil. Før det: Prioritet 45 — Omstrukturering av
Innstillinger: fire grupperte hovedseksjoner, «⚙️ Innstillinger» flyttet
nederst i sidemenyen, ny 👤 Sjåførside med 📞 Ringeliste, ny 📘
Informasjonsveileder. Før det igjen: Prioritet 44 — 🎨 Layout Editor under
Innstillinger.
Forrige konsolidering: Prioritet 36, basert på faktisk kjørende kode i
`Benibanos/Biloversikt` (klonet direkte fra GitHub for denne
konsolideringen).
Status er verifisert mot koden i `index.html`/`storage.airtable.js`, ikke
antatt fra tidligere bestilling. Den fulle, kronologiske historikken over
alle tidligere "Prioritet N"/"Optimalisering N"-runder er ikke lenger
bevart som egen fil i produksjonsprosjektet — den ligger i git-commit
`cae279d` (prosjektets tilstand før den første store konsolideringen).

Statuser: ✅ Implementert og verifisert · 🟡 Delvis implementert ·
🔧 Må feilrettes · 📋 Planlagt

**Prosjektet er rendyrket til GitHub Pages + Airtable.** Ingen
Android/APK/TWA/Bubblewrap/Play Store og ingen Netlify/Vercel-rester finnes
i prosjektet.

**Prioritet 48.1 — Kontrastfeil på «Registrer varsellampe»/«Registrer avvik»
(2026-09-10):** ✅ Funnet, rettet og verifisert.

Bruker oppdaget rett etter levering av Prioritet 48 at teksten i disse to
handlingskortene så nesten svart ut mot mørk bakgrunn. Rotårsak: `.chip`
(varsellampe-/avvikstype-velgeren inne i akkurat disse to kortenes panel —
den eneste komponenten som skiller dem fra de tre andre, fungerende kortene)
manglet en eksplisitt `color`-egenskap og kunne falle tilbake på nettleserens
standard knappefarge i stedet for appens `--ink`-token. Rettet med to nye
`color:var(--ink)`-linjer — gjelder automatisk i alle tilstander. Verifisert
med skjermbilder i mørk og lys modus, pluss hele Prioritet 48 sin
regresjons-/responsivitetstest kjørt på nytt (alle bestått). `CACHE_VERSION`
→ `bilpark-v46`. Se PRIORITET_48_ANALYSE.md, kapittel 8.

**Prioritet 48 — Siste premium-polish av Sjåførside (2026-09-10):**
✅ Implementert og verifisert direkte mot faktisk kjørende kode (Playwright,
ikke bare statisk kodelesing — se PRIORITET_48_ANALYSE.md).

Ren visuell finpuss av sjåførmodus (Min Bil + Velg Bil) mot de samme to
referansebildene som lå til grunn for Prioritet 47 — eksplisitt avgrenset
til presentasjon, ingen endring i navigasjon, funksjonalitet, Airtable,
Aktiv sjåfør-, kontroll- eller kilometerlogikk.

Levert: (1) nytt linjeikonsystem (`sjaforIkonSvg()`, 14 ikoner) erstatter
emoji i bunnmeny, nøkkeltall, handlingskort og Sjekk ut bil; (2) ett nytt
fargepar (`--teal`/`--teal-soft`, samme mønster som `--purple`) for å skille
CURBSIDE fra LAG 3 — ingen parallelt designsystem; (3) Min Bil sitt
kjøretøykort fikk et ekte 2×2-nøkkeltallsgrid, større skilt og egen
statuslinje; alle fem handlingskort fikk samme kortstil uten at noen
handling/`id` er endret; (4) «Sjekk ut bil» fikk eksakt teksten «Sjekk ut
bil» / «Avslutt arbeidsdagen og frigjør bilen»; (5) Velg Bil fikk en
tilbakepil (funksjonell kun når en aktiv biløkt finnes å returnere til,
ellers deaktivert — dokumentert tolkning), samme skilt-komponent på
bilkortene, og distinkte fargeprikker for LAG 3/CURBSIDE; (6) den delte
`renderDriftslagGruppertBilvalg()` (brukt av både Velg Bil og admin sin
«Bytt bil»-fallback) fikk samme restyling begge steder, bevisst gjenbruk.

25/25 Playwright-regresjonssjekker og 8/8 responsivitetssjekker (320-430 px)
bestått. `storage.airtable.js` uendret (`v2.11.0`), `CACHE_VERSION` i
`sw.js` → `bilpark-v45`, `kontroll.html` resynkronisert.

Se PRIORITET_48_ANALYSE.md for full kartlegging, simuleringsresultat,
regresjonstest og dokumenterte gjenstående visuelle avvik (skiltfont,
avatarikon, ikonflate-fargenyanser — ingen påvirker funksjon).

**Prioritet 47, Del 2 — Sjåførside bunnmeny, redefinert av bruker
(2026-09-10):** ✅ Implementert og verifisert (statisk/isolert, se
PRIORITET_47_ANALYSE.md).

Etter Del 1 (under) ba bruker om en ny, eksplisitt spesifisert bunnmeny for
sjåførmodus i stedet for å vente på avklaring av kode-/live-avviket i de
opprinnelige referansebildene (som fortsatt IKKE er avklart, se under) —
uttrykkelig med kravet «ingen nye funksjoner, kun gjenbruk av det som
allerede finnes».

Levert: (1) `DRIVER_BUNNMENY` — ny, egen bunnmeny kun for sjåførmodus (🚐 Min
Bil · 📞 Ringeliste · 💬 Kommentarer · ☰ Mer), atskilt fra administrasjonens
`MOBIL_BUNNMENY`/`screen`/`openDrawer()`-mekanikk, vist på alle sjåførskjermer
slik at Ringeliste og Kommentarer alltid er tilgjengelige. (2) 📞 Ringeliste
flyttet fra Min Bil-kort til egen skjerm (`renderDriverRingeliste()`) —
fjernet fra `DASHBOARD_LAYOUT_FLATER.minbil`, med eksisterende
fremtidssikring i `getLayoutFlate()` som automatisk rydder bort referansen i
allerede lagrede Min Bil-layouts. (3) 💬 Kommentarer erstatter det
opprinnelige, ikke-eksisterende «📋 Oppgaver»-forslaget — viser Del 1 sin
«📨 Nye kommentarer»-logikk (`nyeKommentarerListe()`) alltid utvidet, med
radmarkupen skilt ut i en delt funksjon (`nyeKommentarRadHtml()`) brukt av
både Aktive saker og denne nye skjermen. (4) ☰ Mer viser kun «🔁 Bytt bil» —
gjenbruker eksakt samme tilbakestillingslogikk som kt-back-knappen i Kontroll
og «← Velg en annen bil» i Allerede kontrollert-skjermen, ingen ny funksjon.

Ingen nye Airtable-felt, ingen `LIST_TABLES`-endring — `storage.airtable.js`
uendret på `v2.11.0`. `sw.js` `CACHE_VERSION` → `bilpark-v44`. `kontroll.html`
resynkronisert.

Testet: `node --check` på begge script-blokker — ingen syntaksfeil. Isolerte
Node.js-simuleringer av bunnmeny-navigasjon (alle fire punkter navigerer
korrekt), Ringeliste sin egen-bil-ekskludering, og at delt radmarkup gir
identisk output i begge kontekster — alle bestått. `diff index.html
kontroll.html`: bekreftet identiske. Kun statisk/isolert testet.

🔧 **Fortsatt uavklart, ikke løst av denne redefineringen:** det opprinnelige
kode-/live-avviket (referansebildenes bunnmeny «Min Bil · Velg bil · Oppgaver
· Mer» og kortbaserte Min Bil-visning stemte ikke med koden — se
PRIORITET_47_ANALYSE.md punkt 0) er UENDRET uavklart. Bruker har ikke lastet
opp den faktiske, kjørende `index.html`. «Sjekk ut bil»-teksten (opprinnelig
Del 2, punkt 3) er fortsatt ikke vurdert eller endret.

**Prioritet 47, Del 1 — Sjåførside 2.0 / Dashboard-komprimering: kommentar-
håndtering og bestillingsrad (2026-09-10):** ✅ Del 1 implementert og
verifisert (statisk/isolert, se PRIORITET_47_ANALYSE.md).

Kartlegging (FØR implementering, se PRIORITET_47_ANALYSE.md): en fritekst-
kommentar i sjåførkontrollskjemaet har aldri alene opprettet en aktiv sak —
den lagres kun på kontroll-oppføringen (`kontroller[].kommentar`). Den
reelle mekanismen bak opplevelsen "kommentar blir sak" var avkrysningsboksen
«Andre kontrollavvik» (`annet-avvik` i `KONTROLLAVVIK_ORDER`) — eneste sted
en sjåfør kunne signalisere noe som faktisk ble synlig for driftskoordinator
som en ny rad i Aktive saker. Videre var alle fire forekomster av "➕ Bestill
tjenester" allerede utvidet til fem knapper (Prioritet 46), men fortsatt
bundet til `.dash40-grid4` (fast 4 kolonner) — femte kort havnet alltid
alene på en ny rad.

Løsning: (1) `annet-avvik` fjernet fra `KONTROLLAVVIK_ORDER` (valgbare
lister), men BEHOLDT i `KONTROLLAVVIK_LABEL`/`KONTROLLAVVIK_IKON` for
historisk visning — samme mønster som `UTE_AV_DRIFT_KATEGORI_ID` (Prioritet
41). Skade, Varsellampe og de fire gjenværende avvikstypene oppretter
fortsatt aktive saker uendret. (2) Ny «📨 Nye kommentarer»-seksjon øverst i
Aktive saker (`nyeKommentarerListe()`/`nyeKommentarerSectionHtml()`) — rent
visningsfilter over eksisterende `kontroller[]`, ingen ny tabell/felt/
sakskobling, sortert nyeste først, bevisst INGEN "lest/kvittert"-tilstand
(kun én lokal, uendret visnings-toggle) — "dette er informasjon, ikke
oppgaver". (3) Ny `.dash40-grid5`-klasse (5 kolonner, med responsiv
nedtrapping på samme brytepunkter som `.dash40-grid4`) satt på alle fire
reelle "➕ Bestill tjenester"-forekomster — `.dash40-grid4` er URØRT
(KPI-radene bruker den fortsatt uendret). Service, EU-kontroll, Dekkskifte,
Verkstedtime og Ruteskift ligger nå på én rad.

Ingen nye Airtable-felt, ingen `LIST_TABLES`-endring — `storage.airtable.js`
uendret på `v2.11.0`. `sw.js` `CACHE_VERSION` → `bilpark-v43`. `kontroll.html`
resynkronisert som eksakt kopi.

Testet: `node --check` på begge script-blokker — ingen syntaksfeil. Isolert
Node.js-simulering av `nyeKommentarerListe()`-logikken (filtrering av tomme/
whitespace-kommentarer, sortering nyeste først) og av
`KONTROLLAVVIK_ORDER`-fjerningen (4 valgbare typer, historisk label-oppslag
intakt) — begge bestått. Kun statisk/isolert testet denne runden (ingen
kjørende nettleser/Airtable).

Se PRIORITET_47_ANALYSE.md for full kartlegging, kode-/live-avviket i
detalj, og simuleringslogg.

**Prioritet 46 — Rapporter, Carglass Ruteskift og Verkstedtime 2.0
(2026-09-10):** ✅ Implementert og verifisert (se PRIORITET_46_ANALYSE.md).

Bestilling: bedre rapporter (full historikk ved bilfiltrering), bedre
håndtering av ruteskift (Carglass), enklere verkstedbestilling (strukturerte
felt istedenfor fritekst), bedre synlighet av telefonnummer. IKKE ENDRE:
Aktiv sjåfør, Kontrollflyt, Kilometerlogikk, Layout Editor, Bilkategorier —
alle bekreftet urørt.

Kartlegging (FØR implementering, se PRIORITET_46_ANALYSE.md): grundig
gjennomgang fant INGEN `.find()`-basert «kun siste registrering»-bug i
Kontrollhistorikk/Servicehistorikk/Verkstedhistorikk/Skadehistorikk/
Kostnadshistorikk — disse viste allerede full historikk. De to reelle
avvikene: (1) Dekkoversikt sin dekkskifteliste var kappet til 5 med
`.slice(0, 5)`; (2) Rapporthub sine tre statusrapporter (Kilometerstand-/
Service-/Dekkrapport) er ett-rad-per-kjøretøy-flåteoversikter som IKKE
skiftet til full historikk når filtrert til ett spesifikt kjøretøy — dette
er nøyaktig det ticket sitt Bil 7-eksempel beskriver.

Løsning: (1) `.slice(0, 5)`-kappen i Dekkoversikt fjernet. (2)
Kilometerstands-, Service- og Dekkrapport viser nå full historikk for det
filtrerte kjøretøyet (`vehicleKontroller()`/`vehicleServiceHistorikk()`/
`dekkhistorikk`) når `rapportFilterBil` peker på ETT kjøretøy — både i
skjermvisning og Excel-eksport; flåteoversikten uten bilfilter er uendret.
(3) Ny 💥 Ruteskift-hurtigknapp i alle «Bestill tjenester»-forekomster,
samme mønster som 🚦 EU-kontroll (`bestillRuteskift()` →
`vtRuteskiftForhandskrysset`). (4) Ny 💥 Ruteglassrapport i Rapporthub
(`rapportRuteglassRader()`/`renderRapportRuteglass()`/
`eksporterRapportRuteglass()`, samme mal som Skaderapport) — Dato/Bil/
Verksted/Kommentar/Kostnad/Status, filtrerbar på Bil/Periode/Verksted (nytt
Verksted-filter, `RAPPORT_HAR_VERKSTED_FILTER`). (5) Verkstedtime 2.0: to
uavhengige avkrysningsbokser (🚦 EU-kontroll/💥 Ruteskift) øverst i Ny
verkstedtime, begge kan krysses samtidig; `WorkshopAppointments.Type`
lagres kommaseparert (`vtHarType()`/`vtTypeIkon()`/`vtTypeTittel()` — én
delt lesefunksjon istedenfor fire spredte `=== 'eu-kontroll'`-sjekker);
beskrivelsesfeltet brukes ikke lenger til å identifisere disse typene. (6)
`v.telefon` vises nå som klikkbar `tel:`-lenke i Kjøretøyprofil →
Kjøretøyinformasjon.

Ingen nye Airtable-felt (`Type` og `Telefon` allerede registrert fra
tidligere prioriteter) — `storage.airtable.js` uendret på `v2.11.0`. `sw.js`
`CACHE_VERSION` → `bilpark-v42`. `kontroll.html` resynkronisert.

Simulert (se PRIORITET_46_ANALYSE.md): 27 automatiserte assert-sjekker i en
isolert Node.js-simulering — Kilometerrapport (Bil 7-eksempelet: 4 av 4
registreringer), Servicehistorikk, Verkstedhistorikk, Ruteglassrapport
(riktige rader + Bil-/Verksted-filter + status), Ruteskift-bestilling,
EU-bestilling, begge samtidig (kombinert type/ikon/tittel),
Kjøretøyprofil-telefonnummer, dekk-cap-regresjon — alle bestått. `node
--check` på begge script-blokker: ingen syntaksfeil. `diff index.html
kontroll.html`: bekreftet identiske.

Se PRIORITET_46_ANALYSE.md for full kartlegging, rotårsaksfunn, simulerings-
logg og testresultater.

**Prioritet 45 — Omstrukturering av Innstillinger (2026-09-10):** ✅
Implementert og verifisert (se PRIORITET_45_ANALYSE.md) — strukturell/
navigasjonsendring, kun ett nytt datafelt (`Vehicles.Telefon`), ingen
endring i Dashboard, Mobil Dashboard, Sjåførkontroll, Aktiv sjåfør-logikk,
kilometerlogikk, Service, Dekk eller EU.

Bestilling: redusere visuell støy i Innstillinger og samle relaterte
funksjoner i logiske grupper for mindre scrolling og bedre struktur.

Kartlegging (uttømmende gjennomgang av `renderInnstillinger()` FØR noen
endring, se PRIORITET_45_ANALYSE.md): seks flate topplinje-seksjoner ble
til fire grupperte hovedseksjoner — 📦 Register (bilkategorier +
verksted), 🎨 Layout Editor (+ Tema flyttet hit, + skjematisk
forhåndsvisning), 👤 Sjåførside (ny — Min bil-forhåndsvisning, flyttet
Sjåførkontroll-lenke, ny 📞 Ringeliste), ⚙️ Systeminnstillinger (nå selv
nestet: Oppdater app/Installer app, Database status, Administratorbrukere,
ny 📘 Informasjonsveileder, Enhetsvisning, Nullstill bilparkdata). Samme
`settingsAccordionRow()`-funksjon brukt rekursivt for nesting — ingen ny
akkordion-mekanisme.

Sidemeny: «⚙️ Innstillinger» flyttet til siste punkt i både desktop-
sidebaren og mobilens ☰ Meny. «📱 Bytt til Mobil-visning»/«🖥️ Bytt til
Desktop-visning» — tidligere to separate menypunkter — slått sammen til én
bryter inne i Innstillinger → ⚙️ Systeminnstillinger.

Nytt felt: `Vehicles.Telefon` (app-nøkkel `telefon`) for 📞 Ringeliste —
registrert i `LIST_TABLES`, `storage.airtable.js` `versjon` → `v2.11.0`,
`?v=2.11.0` i `index.html`/`kontroll.html`. Vises hos sjåførene som en ny
Min Bil-komponent (`tel:`-lenke til andre kjøretøy med registrert nummer),
automatisk lagt til i alle eksisterende lagrede Layout Editor-oppsett via
samme fremtidssikring som Prioritet 44 innførte — bekreftet med en kjørt
simulering.

Informasjonsveileder: 🛟 Mobilitetsgaranti sin forklaringstekst (tidligere i
Kjøretøyprofilen) og 🛠️ Bestill tjenester sin forklaringssetning (tidligere
på Bestill tjenester-skjermen) er flyttet dit i sin helhet — begge steder
sto tidligere med full instruksjonstekst, nå kun kortfattet
status/telling. Ingen datafelt eller funksjonalitet endret.

`sw.js`: `CACHE_VERSION` → `bilpark-v41` (app-shell-innhold endret
betydelig). `kontroll.html` resynkronisert.

Simulert (se PRIORITET_45_ANALYSE.md): alle tolv tidligere innholdsblokker
bekreftet brukt nøyaktig én gang i ny struktur (ingen tapt/duplisert
innstilling); kjørt Node.js-simulering av `getLayoutFlate()`-sammenslåingen
for "ringeliste" mot en layout lagret FØR Prioritet 45; `node --check` på
begge script-blokker og `storage.airtable.js`; `diff index.html
kontroll.html` bekreftet identiske; manuell verifisering av at
«⚙️ Innstillinger» forekommer nøyaktig én gang i både sidebar og drawer.

Se PRIORITET_45_ANALYSE.md for full kartlegging (gammel struktur → ny
struktur, alle flyttede felt/hjelpetekster), simuleringslogg og
testresultater.

**Prioritet 44 — 🎨 Layout Editor under Innstillinger (2026-09-10):** ✅
Implementert og verifisert med en kjørt simulering av selve
lagrings-/gjenopprettingsmekanismen (se PRIORITET_44_ANALYSE.md) — ikke en
live flerbruker-test mot ekte Airtable (utenfor denne øktens
nettverkstilgang, se "Kjente begrensninger" i analysen).

Bestilling: redusere behovet for kodeendringer ved layoutjusteringer. Egen
«🎨 Layout Editor» under Innstillinger som lar brukeren dra/endre
rekkefølge, skjule/vise komponenter og nullstille til standard — for
Desktop Dashboard, Mobil Dashboard og Min Bil. Lagres i Settings, ingen ny
Airtable-tabell. Komponentene selv skal IKKE bli redigerbare — kun
plassering og synlighet.

Kartlegging (uttømmende gjennomgang av `renderDashboard()`,
`renderMobilHjem()` og `renderDriverMinBil()` i `index.html`, ingen
antakelser — se PRIORITET_44_ANALYSE.md): Desktop Dashboard har 7
håndterbare komponenter fordelt på den eksisterende to-kolonne CSS-gridden
(`dash40-split`, Prioritet 37/38); Mobil Dashboard har 5 i én kolonne; Min
Bil har 6. Faste, ikke-håndterbare elementer holdes utenfor på alle tre
flater (topplinjer/søk/varselbanner, samt Min Bil sin sikkerhetskritiske
«✓ Sjekk ut bil»-knapp, som alltid forblir synlig og sist).

Løsning: én ny Settings-nøkkel `dashboard-layout` (delt/globalt, samme
generiske get()/set()-spor som `theme-preference`/`bilkategorier` — ingen
endring i `storage.airtable.js`, ingen `LIST_TABLES`-registrering
nødvendig). Rendringsfunksjonene bygger fortsatt EKSAKT samme markup som
før i et `komponentHtml`-oppslag; en ny, delt `layoutFlateHtml()`-funksjon
avgjør kun hvilke nøkler som vises og i hvilken rekkefølge —
komponentinnholdet er aldri rørt. Lagret layout slås sammen med
standardlisten slik at en fremtidig ny komponent aldri blir silent-hidden.
Desktop sin to-kolonne-grid bevares uendret via en fast
gruppe-partisjonering (`DESKTOP_LAYOUT_KOLONNER`): omsortering skjer
innenfor egen kolonne, ikke på tvers — en bevisst avveining for å unngå et
fullt redesign av en fungerende layout. Rekkefølge endres med opp/ned-
knapper (samme mønster som `bilkategorier`, Prioritet 41), ikke ekte
dra-og-slipp — valgt av brukeren selv, både for gjenbruk av et etablert
mønster og fordi native drag-and-drop er upålitelig på mobil/touch.

Simulerte scenarioer (se PRIORITET_44_ANALYSE.md): (1) Desktop — endret
rekkefølge + skjult komponent overlever full tilstandsnullstilling
(«Oppdater app»/Reload/Ny innlogging); (2) Mobil — skjult komponent
overlever nullstilling, «Nullstill til standard» gir tilbake nøyaktig
standardoppsettet; (3) Min Bil — endret rekkefølge overlever nullstilling,
ingen komponent tapt; (4) fremtidssikring — en ny komponentnøkkel lagt til
i koden etter at en layout ble lagret, dukker automatisk opp (aldri
silent-hidden). Alle fire besto.

`sw.js`: `CACHE_VERSION` → `bilpark-v40` (app-shell-innhold endret
betydelig). `storage.airtable.js` uendret i denne prioriteten — ingen
`?v=`-økning nødvendig. `kontroll.html` resynkronisert.

Se PRIORITET_44_ANALYSE.md for full komponentkartlegging, lagringsdesign og
simuleringslogg.

**Prioritet 43 — Kilometerstand følger nå alltid siste sjåførkontroll
(2026-09-09):** ✅ Fikset og verifisert med en kjørt simulering av
race-mekanismen (se PRIORITET_43_ANALYSE.md) — ikke en live flerbruker-test
mot ekte Airtable (utenfor denne øktens nettverkstilgang, se "Kjente
begrensninger" i analysen).

Bestilling: kilometerstanden på et kjøretøy stemte ikke alltid overens med
siste registrerte sjåførkontroll (eksempel: Bil 7 viste 183 100 km i
Kjøretøyprofilen etter at en kontroll hadde registrert 184 220 km).

Kartlegging (uttømmende `grep`-basert gjennomgang av `index.html`, ingen
antakelser): `v.km` skrives fra eksakt fire steder —
`submitKontroll()` (normal drift), `saveVehicleForm()` (admin-korreksjon,
bekreftelsesdialog), `performKontrollDeletion()` (rekalkulering ved
sletting, fra kronologisk nyeste gjenværende kontroll) og `resetFleetData()`
(admin-nullstilling). Disse stemte allerede nøyaktig med det CLAUDE.md
dokumenterte, og fulgte allerede ønsket prioritering ("siste kontroll
vinner") — ingen femte, udokumentert skrivevei ble funnet. Service-/
verkstedfunksjonene rører aldri `v.km` (kun sitt eget `service.km`),
bekreftet uendret siden Prioritet 29.

Rotårsak: `storage.airtable.js` sin `get()`-funksjon gikk IKKE gjennom den
serialiserte per-ressurs-skrivekøen (`_koKjor()`, Prioritet 29) som
`set()`/`delete()` allerede brukte. Bakgrunnspollen
(`window.subscribeLiveSync()`, hvert 45. sekund) kunne dermed lese en gammel
kilometerstand fra Airtable MENS en `submitKontroll()`-skriving fortsatt
pågikk, og `reloadOne('vehicles')` i `index.html` erstattet da HELE det
lokale `vehicles`-arrayet ubetinget med den gamle verdien — selve
Airtable-raden var hele tiden korrekt, feilen lå kun i det lokale, viste
øyeblikksbildet i appen, og varte til neste pollrunde (opptil 45 sekunder)
tilfeldigvis traff etter at skrivingen var ferdig. Bekreftet med en isolert,
kjørt Node.js-simulering av nøyaktig denne kø-mekanismen (se
PRIORITET_43_ANALYSE.md, seksjon 3), ikke bare kodelesing.

Levert: `get()` sendes nå gjennom SAMME `_koKjor()`-kø og ressursnøkkel som
`set()`/`delete()` — ingen ny mekanisme, en presis utvidelse av en
eksisterende Prioritet 29-løsning. Ingen endring i `v.km`-skrivereglene i
`index.html` var nødvendig — kun `?v=2.10.0` på script-taggen.
`storage.airtable.js` `versjon` → `v2.10.0`. `sw.js`: `CACHE_VERSION` →
`bilpark-v39`. `kontroll.html` resynkronisert.

Simulerte scenarioer (se PRIORITET_43_ANALYSE.md, seksjon 3): (1) Bil 7
183 100 → kontroll registrerer 184 220 → `v.km` = 184 220, bekreftet med
kjørt race-simulering (feil FØR fiksen, riktig ETTER); (2) service +
verkstedtime + dashboard-rendering + reload etter kontrollen → `v.km`
forblir 184 220 gjennom hele sekvensen; (3) ny kontroll registrerer
184 890 → `v.km` = 184 890; (4) kontrollhistorikkens nyeste oppføring er
184 890 → Kjøretøyprofilen viser 184 890 (samme kildevariabel skriver begge
feltene i `submitKontroll()`, kronologisk sortering i `vehicleKontroller()`,
ikke sortering på km-størrelse).

Se PRIORITET_43_ANALYSE.md for full kartlegging, rotårsak, simuleringslogg
og testresultater.

**Prioritet 42 — PWA-installasjon: rotårsak funnet og bekreftet LIVE
(2026-09-09):** 🔧 **Rotårsak funnet og dokumentert, men krever en
repo-operasjon (ikke en kodeendring) for å lukkes helt** — se
PRIORITET_42_ANALYSE.md for full detalj og eksakt fremgangsmåte.

Bestilling: "Installer app"/"Legg til på startskjerm" tilbys ikke lenger på
nye telefoner på `https://benibanos.github.io/Biloversikt/`.

Rotårsak (bekreftet direkte mot den kjørende GitHub Pages-siden med
`fetch()`/`caches.addAll()` i en ekte nettleserfane, ikke antatt fra
kodelesing alene): `icons/icon-192.png`, `icons/icon-512.png` og
`icons/icon-512-maskable.png` gir alle 404 live — ikonene ligger i praksis
i repo-ROTEN, ikke under en `icons/`-mappe, selv om manifestene, `sw.js` og
`index.html` konsekvent forventer `icons/`-mappen. Dette slår beina under
installerbarhet på TO uavhengige måter samtidig: (1) manifestet har ingen
gyldig, lastbar 192px+-ikon; (2) `sw.js` sin `install`-håndterer kaller
`caches.addAll(APP_SHELL)`, som er alt-eller-ingenting — de samme tre
404-ene får HELE service worker-installasjonen til å feile
(`TypeError: Failed to execute 'addAll' on 'Cache': Request failed`,
reprodusert direkte), så service workeren blir værende i `installing` og
aktiveres aldri. Prioritet 36 (under) hevdet at nøyaktig denne
ikon-flyttingen var gjort "i den leverte pakken" — men det ble aldri
faktisk lastet opp til det publiserte repoet, eller ble reversert senere.
Forklarer "nye telefoner": eksisterende, allerede installerte telefoner
installerte trolig FØR regresjonen, og er upåvirket av den.

Levert i denne runden (kodeforbedringer — selve rotårsaksfiksen er en
manuell opplasting av tre bildefiler til GitHub, utenfor det denne økten
kan gjøre siden bildefilene ikke er en del av Claude-prosjektets
tekstdokumenter):
- Alltid tilgjengelig "🔽 Installer Bilpark"/"📵 PWA ikke tilgjengelig på
  denne enheten" i Innstillinger → Systeminnstillinger → "📲 Installer app"
  (`pwaInstallStatusHtml()`), som supplement til det eksisterende,
  lukkbare toppbanneret — begge deler nå samme `installPwaNow()`.
- Ny kjøretids-diagnose (`pwaDiag`/`kjorPwaDiagnostikk()`) som sjekker
  manifest/ikoner/service worker live og viser konkret feilårsak i
  Innstillinger, i stedet for at et fremtidig avvik må reproduseres manuelt.
- `id`-felt lagt til i begge manifestene (anbefalt praksis, rent tillegg).
- `sw.js`: `CACHE_VERSION` → `bilpark-v38`. `kontroll.html` resynkronisert.

Se PRIORITET_42_ANALYSE.md for alle 8 kontrollpunktene fra bestillingen
punkt for punkt, simuleringsresultat og eksakt fremgangsmåte for
repo-fiksen (last opp de tre ikonfilene til `icons/`).

**Prioritet 41 — Redigerbare bilkategorier + 🚫 Ute av drift (2026-09-09):**
✅ Implementert og verifisert med dynamisk simulering (68 sjekker, 0 feil) +
full regresjon av alle tre tidligere suiter (101 + 68 + 56 sjekker, 0 feil).

Kartlegging: kategoriene var hardkodet i fire konstanter pluss en femte lokal
etikettliste i `renderBilkort()`, og i tre `<option>`-lister — til sammen ~15
kallesteder.

Levert:
- `bilkategorier` `[{id, navn, ikon}]` lagret som JSON-blob i den eksisterende
  Settings-tabellen (samme mønster som `verksteder`). Ingen ny tabell, ingen nye
  felt, ingen `LIST_TABLES`-endring, ingen migrering.
- `rebyggKategoriOppslag()` fyller KATEGORI_ORDER/KATEGORI_LABEL/
  KATEGORI_GROUP_LABEL/GRUPPE_IKON fra registeret. Alle ~15 kallesteder uendret.
- `kategoriOptionsHtml()` erstatter de tre hardkodede nedtrekkslistene.
- 🚫 Ute av drift er systemstyrt: `v.kategori` røres aldri, plasseringen beregnes
  live fra `v.uteAvDrift` via `vehicleVisningsKategori()`. Opprinnelig kategori
  bevares dermed uten noe ekstra felt.
- Biloversikt: gruppert på visningskategori, 🚫 Ute av drift alltid nederst,
  tomme grupper skjult.
- «🚚 Biler i drift» vises som én samlet liste på tvers av kategorier — bevisst
  annen logikk enn Biloversikt sin organisering.
- ⚙️ Administrer bilkategorier i Innstillinger: opprett / endre navn og ikon /
  endre rekkefølge / slett / flytt kjøretøy.
- `sw.js`: `CACHE_VERSION` → `bilpark-v37`. `kontroll.html` resynkronisert.

Simulerte scenarioer: Bil 7 ute av drift → vises kun under 🚫 Ute av drift ·
Bil 7 tilbake i drift → automatisk tilbake i Bil 1–11 · ny kategori «Express» +
bil flyttet dit + navnebytte + rekkefølge + sletteregler · aktiv sjåfør i tre
ulike kategorier → «Biler i drift (3)» samlet · kilometerregelen · alle skjermer
på desktop, mobil og sjåførmodus.

⚠️ **Merk:** kategori-id-en `reserve` styrer `vehicleErReserveUnntatt()`. Navnet
kan endres fritt, men sletting fjerner regelen om at reservebiler ikke krever
daglig kontroll — det advares eksplisitt om ved sletting.

**Prioritet 40 — Aktiv sjåfør fullført (2026-09-09):** ✅ Implementert og
verifisert med dynamisk simulering (68 sjekker, 0 feil) + full regresjonskjøring
av Prioritet 39-suiten (101 sjekker, 0 feil).

Kartlegging: `v.aktivSjafor` ble tildelt kun i `startBilokt()`, som kun ble
kalt fra sjåførmodus. Kontroll registrert fra administrasjonen satte derfor
aldri aktiv sjåfør, og en allerede kontrollert bil krevde ett ekstra trykk
(«Gå til Min Bil»). `settAktivSjaforForKontroll()` fantes ikke, tross
dokumentasjonen.

Levert:
- `settAktivSjafor()` er nå eneste tildeler av `v.aktivSjafor`. `startBilokt()`,
  `settAktivSjaforForKontroll()` og `overforAktivSjafor()` er de tre kallerne.
- Kontroll lagret → aktiv sjåfør settes → Min Bil åpnes (sjåførmodus) /
  Kjøretøyprofil åpnes (administrasjon). Bekreftelsesdialogen er fjernet i
  sjåførmodus — ingen ekstra trykk. Feilvarsel om bilder beholdt.
- Ny knapp «👤 Ny sjåfør» på Min Bil: navn + Oppdater = ren overføring av aktiv
  sjåfør. Ingen kontroll, ingen historikk, ingen ny biløkt.
- Min Bil viser bilens faktiske aktive sjåfør, og sier fra ved overføring.
- Forenklet sjåførflyt: BIL FØRST, deretter navn. Navnefeltet er fjernet fra
  toppen av «Velg bil»; ved bilvalg åpnes dialogen «Hvem kjører denne bilen?»
  (Navn + Fortsett). Alt etter navnet er uendret. Ny, ren UI-tilstand:
  `driverNavnDialogBilId` / `driverNavnDialogMsg`.
- `sw.js`: `CACHE_VERSION` → `bilpark-v36`. `kontroll.html` resynkronisert.

Simulerte scenarioer: velg bil → skriv navn → kontroll (inkl. tomt navn, avbryt
og allerede kontrollert bil) · kontroll → Min Bil · ny sjåfør · Dashboard ·
Biler i drift · Biloversikt · Kjøretøyprofil · dagskille kl. 04:00 · utsjekk ·
kilometerregelen · alle skjermer på desktop, mobil og sjåførmodus.
Tre simuleringssuiter kjøres samlet: forenklet sjåførflyt (56 sjekker),
aktiv sjåfør (68 sjekker) og Mobil 4.1-regresjon (101 sjekker) — alle grønne.

🔧 **Gjenstår (ikke bestilt):** kryss-bil-utsjekkingsvarselet som Prioritet
32-teksten beskriver som en `alert()` finnes fortsatt ikke. Selve utsjekkingen
skjer (uendret regel) og vises nå som tekst i «👤 Ny sjåfør»-panelet, men en
blokkerende dialog ville vært i konflikt med kravet «ingen ekstra trykk».

**Prioritet 39 — Mobil Design 4.1 (2026-09-09):** ✅ Implementert og verifisert
med dynamisk simulering (101 sjekker, 0 feil). Mobilen er løftet til Desktop
4.1 sitt designsystem — ingen ny funksjonalitet, ingen ny logikk, ingen nye
Airtable-felt, ingen endring i `storage.airtable.js` (`?v=2.9.0` uendret).

Levert:
- Ny mobilforside (`renderMobilHjem()`): topplinje med «Dine biler. Full
  kontroll.» + 🔔 Varsler + 👤 Konto (åpner eksisterende drawer), søkefelt
  koblet til eksisterende `filterSearch`, to KPI-kort, fire store
  bestillingskort, Kommende oppgaver, Bilpark status og Krever handling nå.
  Det gamle ikonrutenettet (`MOBIL_HJEM_IKONER`) er fjernet.
- Ny bunnmeny (kun mobil): 🏠 Hjem · 🚐 Biler · ➕ Bestill · 📅 Kalender ·
  ☰ Mer. Ren navigasjon til eksisterende skjermer.
- Delte funksjoner i stedet for duplisering: `dashboardBeregning()`,
  `kommendeOppgaveRadHtml()`, `dashKreverRadHtml()`,
  `bilparkStatusInnholdHtml()` — mobil og desktop viser garantert samme tall.
- Biloversikt: `galleryCard()` redesignet til 4.1-kort med løyvenummer,
  status og aktiv sjåfør synlig uten ekstra klikk.
- Kjøretøyprofil: den store løyvenummerseksjonen fjernet; løyvenummer ligger
  nå fremhevet i Kjøretøyinformasjon sammen med Aktiv sjåfør.
- Kontroll og Registrer avvik flyttet til ☰ Mer (i tillegg til Min bil og
  Kjøretøyprofil). Drawer-rekkefølgen følger desktopmenyen.
- `sw.js`: `CACHE_VERSION` → `bilpark-v34`. `kontroll.html` resynkronisert.

Simulering kjørt (Node-harness mot faktisk app-JS, DOM- og Airtable-stub):
Mobil Dashboard · Desktop Dashboard (uendret) · Mobil Biloversikt · Søk fra
forsiden · Kjøretøyprofil inkl. alle fem faner · Kalender · Bestill Service ·
Bestill EU-kontroll · Bestill Dekkskifte · Bestill Verkstedtime · Kontroll og
aktiv sjåfør · kilometerregelen · alle 15 skjermer på både mobil og desktop.

🔧 **Funn under simulering (ikke rettet — utenfor bestillingen):**
`settAktivSjaforForKontroll()`, som CLAUDE.md sin Prioritet 34-tekst beskriver
som implementert, finnes IKKE i koden. `v.aktivSjafor` settes fortsatt kun via
`startBilokt()` i sjåførmodus. En kontroll registrert fra administrasjonsdelen
gir «🕓 Sjåfør i dag», ikke «👤 Aktiv sjåfør». Dokumentasjonen er rettet;
selve oppførselen er uendret siden aktiv sjåfør sto på «ikke rør»-listen.
Bør bestilles som egen sak dersom den dokumenterte oppførselen er ønsket.

**Prioritet 29 — Kritisk datasikkerhet og stabilisering (2026-09-07):**
Lukket de kritiske datatap-/samtidighetsrisikoene som ble avdekket i
Prioritet 28-revisjonen: felles dobbel-innsendingsbeskyttelse for alle
kritiske skjemaer/knapper, en serialisert per-ressurs skrivekø i
`storage.airtable.js` (fjerner race conditions i `reconcileList()`/
`recordIdCache`), trygg rollback-på-feil for kritiske mutasjoner (service,
planlagt service, aktive saker, verkstedtimer), korrupt-JSON-beskyttelse
for Settings-blobene `servicehistorikk`/`planlagteservicer` (blokkerer
lagring i stedet for å stille nullstille til tomt array), opprydding av
gjensidige referanser mellom `AktiveSaker` og `WorkshopAppointments` ved
sletting, fjernet en km-overskrivingsvei i `saveVehicleForm()` og en
duplikat `saveVehicles()`-kalling, batchet bakgrunnspoll-rendering til én
`render()` per synkroniseringssyklus, samt full livssyklus (rediger/
fullfør/slett) for planlagte servicer. Se CLAUDE.md for full detalj og
testkrav kjørt etter endringen, og `PRIORITET_29_SLUTTRAPPORT.md` for
komplett leveranserapport.

**Prioritet 31 — Akutt regresjonsfiks: sjåførkontroll kunne henge for alltid
uten feilmelding (2026-09-07):** ✅ Implementert og verifisert. Root cause:
Prioritet 29 sin serialiserte skrivekø (`_koKjor()`) kjeder alle
`set()`/`del()`-kall mot samme Airtable-ressurs bak hverandre, og
`airtableFetch()` hadde ingen timeout — én hengende forespørsel (typisk ved
dårlig mobildekning i en bil) ble da ALDRI avgjort, og blokkerte permanent
alle senere skrivinger mot samme tabell (f.eks. `Vehicles`/`DriverChecks`)
i samme åpne fane, uten feilmelding, uten bekreftelse, uten lagring.
Reprodusert dynamisk (ikke bare lest i koden) og rettet ved å gi
`airtableFetch()` en 20-sekunders timeout (`AbortController`) slik at
enhver forespørsel alltid avgjøres. Se CLAUDE.md "Dataintegritet" for
detalj.

**Prioritet 32 — Tydeligere brukerforståelse rundt "forsvinnende" biler på
Dashboard (2026-09-07):** ✅ Implementert og verifisert. Ren
visningsforbedring — ingen endring i `vehicleHovedstatus()`,
`vehicleAktivSjafor()`, `vehicleAktiveSaker()`, saksmotoren, biløkt-reglene
eller Airtable. To tiltak: (1) `startBilokt()` viser nå et synlig varsel
til sjåføren når den automatisk sjekker ut en annen bil samme sjåfør sto
aktiv på ("Ola Hansen var allerede aktiv på Bil 5. Bil 5 ble automatisk
sjekket ut."); (2) Dashboardets "Krever handling nå" og "Prioriterte
biler" — begge kuttet til topp 5 — viser nå "Viser 5 av X — +X flere …"
når listen er avkortet, slik at biler som skyves ut/inn av de synlige 5
ved en endring på en ANNEN bil ikke lenger oppleves som at de
"forsvinner" uten forklaring. Se CLAUDE.md for full detalj.

**Prioritet 33 — "Aktiv sjåfør" betyr nå det samme overalt i UI
(2026-09-07):** ✅ Implementert og verifisert. Rotårsak: Biloversikt-kortet
brukte `vehicleSisteSjafor()` (bredere — aktiv biløkt ELLER bare siste
kontroll i dag) for etiketten "👤 Aktiv sjåfør", mens filteret "🚚 Har aktiv
sjåfør" brukte `vehicleAktivSjafor()` strengt (kun live biløkt nå) — en bil
kunne dermed vise "Aktiv sjåfør" på kortet uten å være med i filteret.
Løst uten å røre `vehicleAktivSjafor()`, `vehicleSisteSjafor()`,
biløktlogikk eller Airtable: kortet og Kjøretøyprofilens "Aktiv
sjåfør"-felt viser nå "👤 Aktiv sjåfør: [navn]" kun når
`vehicleAktivSjafor()` er sann, ellers "🕓 Sjåfør i dag: [navn]" når kun
`vehicleSisteSjafor()` er sann, ellers "⚪ Tilgjengelig". Bekreftet
dynamisk: alle biler i "Har aktiv sjåfør"-filteret viser nå "👤 Aktiv
sjåfør", og ingen andre biler gjør det. Kjent, bevisst gjenstående
inkonsistens: Excel-eksportenes "Aktiv sjåfør"-kolonne er ikke endret. Se
CLAUDE.md for full detalj.

**Prioritet 34 — Aktiv sjåfør følger turnus, uansett registreringskanal
(2026-09-07):** ✅ Implementert og verifisert. Ekte logikkendring (ikke kun
visning): "Aktiv sjåfør" skal bety hvem som disponerer bilen i inneværende
skift, ikke bare hvem som har en teknisk aktiv biløkt. Rotårsak:
`v.aktivSjafor` ble kun satt via `startBilokt()`, som kun ble kalt fra
sjåførmodus — en kontroll registrert via administrasjonens vanlige ✅
Kontroll-ikon satte derfor aldri "Aktiv sjåfør", selv om sjåføren fortsatt
disponerte bilen. Løst ved å skille ut tildelingslogikken i en ny funksjon,
`settAktivSjaforForKontroll()`, som `submitKontroll()` nå kaller fra BEGGE
registreringskanaler (sjåførmodus via uendret `startBilokt()`, og
administrasjonsdelen direkte). `vehicleAktivSjafor()`, `vehicleSisteSjafor()`,
`driverMode`, `driverActiveVehicleId`, `saveDriverLocalSession()` og all
øvrig biløktlogikk er UENDRET — kun når/hvor feltene faktisk blir satt er
endret. Kryss-bil-utsjekkingsvarselet fra Prioritet 32 vises nå identisk
fra begge kanaler. Bekreftet dynamisk: administrasjonens kontroll-
registrering setter nå Aktiv sjåfør korrekt, bilen teller umiddelbart som
"🚚 Biler i drift", og administratorens egen lokale sesjon forblir urørt.
Se CLAUDE.md for full detalj.

**Prioritet 35 — Retting av falsk versjonsalarm i Database Status
(2026-09-07):** ✅ Implementert. Ren diagnostikkfiks: `FORVENTET_VERSJON` i
`renderInnstillinger()` sluttet å være en tredje, manuelt vedlikeholdt
versjonskonstant og leses i stedet fra `?v=`-parameteren på
`storage.airtable.js`-script-taggen. **Se Prioritet 36 under** — denne
oppføringen påsto den gang feilaktig at `?v=`-parameteren og
`storage.airtable.js` allerede stemte overens; det gjorde de faktisk ikke i
koden, og selve løsningen hadde fortsatt en hardkodet fallback-verdi. Begge
deler er korrigert i Prioritet 36.

**Prioritet 36 — Full prosjektopprydding og permanent versjonsløsning
(2026-09-08):** ✅ Implementert og verifisert (i den leverte pakken —
**se Prioritet 42: ikon-flyttingen under punkt 5 ble aldri faktisk lastet
opp til det publiserte GitHub Pages-repoet**). Kildegrunnlag: repoet klonet
direkte fra GitHub (`Benibanos/Biloversikt`), ikke tidligere vedlegg/ZIP-er
— hvert filnavn verifisert mot faktisk filinnhold først.

- **Ekte versjonsavvik funnet og rettet:** `?v=`-parameteren i BÅDE
  `index.html` og `kontroll.html` sto fortsatt på `2.8.0` mens
  `storage.airtable.js` sin `versjon` faktisk var `v2.8.1` — et reelt,
  levende avvik (Prioritet 35-teksten over antok feilaktig at dette
  allerede var synkronisert). Begge script-tagger satt til `?v=2.8.1`.
- **Ingen tredje versjonskilde i det hele tatt lenger:** den dynamiske
  lesingen av `?v=`-parameteren har ingen hardkodet fallback-verdi (heller
  ikke `v2.8.1`) — kun to kilder gjenstår å synkronisere:
  `storage.airtable.js` sin `versjon` og `?v=` på script-taggene. Se
  CLAUDE.md, "Versjonskontroll (permanent løsning)".
- **Nøytrale feilmeldinger** i Database status når versjon ikke kan
  bekreftes — verken en påstått rotårsak ("gammel filversjon") eller en
  gjettet forventet versjon vises lenger, kun at informasjonen mangler.
- **Filopprydding:** fjernet `release-apk.yml` (APK/Bubblewrap),
  `vercel.json`, `_headers`, `_redirects` (Netlify/Vercel) — ingen aktiv
  kodereferanse til noen av de fire, kun prosjektets egen dokumentasjon som
  allerede utelukket disse plattformene. Ingen duplikate storage-filer eller
  gamle ZIP-er/backup-filer fantes.
- **Ikoner flyttet til `icons/`** i den leverte pakken, i tråd med hvordan
  all kode (index.html, kontroll.html, begge manifestene, sw.js) allerede
  refererte dem — ren filplassering, ingen kodeendring. **🔧 Prioritet 42
  fant at denne flyttingen aldri faktisk kom til den publiserte siden —
  dette var selve rotårsaken til at PWA-installasjon sluttet å tilbys.**
- `CACHE_VERSION` i `sw.js` økt (`bilpark-v30`) som følge av
  app-shell-endringene over.

Ikke rørt: `v.km`-logikk, sjåførkontroll/aktiv sjåfør, Dashboard, Aktive
saker, Service, EU-kontroll, Dekk, Planlegging, Rapporter, mobil-/
desktopdesign, `_koKjor()`/synkroniseringsmekanismer, eller noe
Airtable-skjema. Se CLAUDE.md for full detalj.

**Prioritet 39 — Navigasjon og ferdigstilt designretning (2026-09-08):** ✅
Implementert og verifisert med dynamisk test (92 kontroller grønne, null
JS-feil). Kun UI/UX og navigasjon.

- Sidemenyen følger referansebildet (Hjem · Biler · Bestill tjenester · Kalender
  · Aktive saker · Påminnelser · Kostnader · Rapporter · Innstillinger), med
  teller på Aktive saker og Påminnelser. Historikk og Analyse flyttet til
  sekundærseksjonen.
- Ny flate «Bestill tjenester» — kun de fire eksisterende hurtigbestillingene
  samlet, ingen ny logikk.
- Kostnadsoversikten har igjen et menypunkt (fantes, men var uten inngang).
- Kalender: oppfølginger lagt til i dagsvisningen; seksjonen under heter «Alle
  kommende aktiviteter», så Kalender og Planlegging fremstår som ett system.
- Kjøretøyinformasjon samler all identitetsdata, inkludert aktiv sjåfør.
- Biltabellen på Dashboard fikk plass til alle seks kolonner.

**Prioritet 38 — Design 4.1: visuell implementering (2026-09-08):** ✅
Implementert og verifisert med dynamisk test (68 kontroller grønne, null
JS-feil). Kun UI/UX: nytt designsystem, ingen ny funksjonalitet, ingen ny
logikk, ingen nye Airtable-felt, ingen endring i `storage.airtable.js`.

- Ny mørk premium-palett som NY STANDARD (temabryteren beholdes, kun i
  Innstillinger). Lys drakt bygget i samme tokensystem.
- Delte presentasjonsklasser: ikonfliser, ett pillesystem, KPI-kort,
  bestillingskort, oppgaverader, statusliste, nøkkeltallsstripe,
  understrekfaner.
- Dashboard: kun 🔔 varselklokke i topplinjen (de to hurtigknappene fjernet
  etter bestilling), dato vises én gang med «dager igjen»-pille.
- Kjøretøyprofil: eget løyvekort øverst fjernet — løyvenummer er i stedet
  fremhevet øverst i Kjøretøyinformasjon.
- Planlegging INTEGRERT i Kalender (ett menypunkt). `renderPlanlegging()` er
  uendret i koden, men ikke lenger koblet til noen meny.
- `#app` utvidet til 1420 px på desktop; duplikat topplinje skjult.
- `CACHE_VERSION` → `bilpark-v32`. `kontroll.html` synkronisert.

**Prioritet 37 — Dashboard 4.0, Kjøretøyprofil 4.0, Kalender, Kostnader-fane,
Drivstoff og Mobilitetsgaranti (2026-09-08):** ✅ Implementert og verifisert
med dynamisk test (Playwright mot appen kjørende med et in-memory-lager med
identisk storage-grensesnitt — ingen kontakt med produksjonsbasen i Airtable).

- **Hurtigbestilling** (fire kort på Dashboard og Kjøretøyprofil) — fire delte
  snarveier til EKSISTERENDE skjemaer: `bestillService()`,
  `bestillEuKontroll()`, `bestillDekkskift()`, `bestillVerkstedtime()`. Ingen
  ny lagring, ingen ny datamodell. Simulert ende-til-ende:
  bestilling → Planlegging → «Marker utført» → historikk, uten
  dobbeltregistrering, med `fraPlanlagtServiceId`/`fraPlanlagtDekkskiftId`
  korrekt satt og `v.km` bekreftet uendret.
- **Dashboard 4.0** — fire KPI-kort, hurtigbestilling, «Kommende oppgaver»
  (erstatter «Kommer snart», bygger på `flatePlanleggingData(7)`), biltabell
  med løyvenummer som egen kolonne, og Bilparkhelse flyttet fra topplinjen
  til panelet «Bilpark status». Ingen nye tellinger.
- **Kjøretøyprofil 4.0** — identitetslinje med fremhevet løyvenummer, eget
  Mobilitetsgaranti-felt, fire nøkkeltall, fire bestillingskort og faner
  (Oversikt/Historikk/Skader/Dekk/Kostnader) i stedet for akkordion. Bilbilde
  fjernet fra visningen; `hasPhoto` og Photos-radene er urørt i databasen.
- **Kalender** (🗓️, nytt menypunkt) — ren visning av planlagte servicer,
  planlagte dekkskift, verkstedtimer og EU-frister, gruppert på dato. Ingen ny
  datamodell.
- **Kostnader-fane per kjøretøy** — filtrert visning av `getKostnadsposter()`.
  Ingen ny kostnadsmotor.
- **To nye felt** (`Drivstoff`, `Mobilitetsgaranti` på `Vehicles`), registrert
  i `LIST_TABLES` samtidig som de tas i bruk; storage `v2.9.0`, `?v=2.9.0`,
  `CACHE_VERSION = 'bilpark-v31'`.
- **Dokumenter-fane:** 📋 Parkert etter beslutning fra bruker — krever egen
  datamodell og Airtable-tabell, og er derfor ikke bygget.

🔧 **Funn i denne runden — `kontroll.html` var en stale fullkopi av
`index.html`.** Filen lå én leveranse bak (manglet hele «ute av drift»-
arbeidet), slik at sjåførmodus kjørte gammel kode. Synkronisert til en eksakt
kopi i denne leveransen. 📋 **Anbefalt egen sak:** erstatt `kontroll.html` med
en ren omdirigering til `index.html?sjafor=1`, slik at prosjektet ikke lenger
har to nesten like HTML-filer som må holdes manuelt i sync — dagens løsning
bryter med prinsippet «ingen parallelle løsninger».

---

## PWA-installasjon (Prioritet 42)

🔧 **Rotårsak funnet og bekreftet live, kodeforbedringer levert — selve
lukkingen krever en manuell repo-operasjon (opplasting av tre ikonfiler).**
Se egen seksjon over og PRIORITET_42_ANALYSE.md for full detalj.

## Kalender (inkluderer Planlegging)

✅ Implementert og verifisert (Prioritet 37, utvidet i Prioritet 38) — ren
visning, ingen egen datamodell. Fra Prioritet 38 er Planlegging integrert i
Kalender, som dermed er hovedvisningen for planlagt service, planlagt
dekkskift, EU-kontroll og verkstedtimer. Se CLAUDE.md.

## Aktive saker

✅ Implementert og verifisert — samlet sak per bil, flere avvikspunkter,
selektiv verkstedbehandling/fullføring, full livssyklus Ny→Vurderes→Tiltak
planlagt→Verksted bestilt→Delvis utført→Utført→Lukket. Kun aktive avvik
påvirker bilstatus. **Nytt i Prioritet 47, Del 1:** en egen «📨 Nye
kommentarer»-seksjon øverst viser sjåførkommentarer som ren, uredigerbar
informasjonslogg — disse oppretter ALDRI en sak (se over). **Nytt i
Prioritet 47, Del 2:** samme logg vises nå også for sjåføren selv, som en
alltid-utvidet «💬 Kommentarer»-skjerm nådd fra sjåførens bunnmeny — delt
radmarkup (`nyeKommentarRadHtml()`), ingen duplisert visning.

## Automatisk saksgenerering

✅ Implementert og verifisert — kontrollavvik/varsellamper/skader oppretter
saker automatisk, bekreftet i kodeflyten fra `submitKontroll()`. **Endret i
Prioritet 47, Del 1:** «Andre kontrollavvik» er fjernet fra valgbare
kontrollavvik (kun Skade, Varsellampe, Defekt lys, Manglende utstyr, Feil på
kjøretøy og Slitte dekk oppretter nå saker) — se over.

## Verkstedflyt

✅ Implementert og verifisert — verkstedtimer (`WorkshopAppointments`),
kobling til saker (`SakId`/`CaseId`), kontaktperson/telefon.

## Kostnader og avsettinger

✅ Implementert og verifisert — `AktiveSaker` har `estimatedCost`,
`actualCost`, `requiresProvision`, `provisionAmount`, `provisionMonth`.
Kostnadsrapport i Rapporthub.

## Operativ kontroll

✅ Implementert og verifisert — Dashboard, Operativ status, "Biler i drift
nå"-telling (kategori-agnostisk, verifisert ved kodegjennomgang).

## Påminnelsesmotor

✅ Implementert og verifisert — oppfølgingsdato på saker (`followUpDate`),
forfalte saker, manglende neste handling, dashboardvarsler.

## Bilstatus og kjøretøyhistorikk

✅ Implementert og verifisert — Historikk-hub samler kontroll-/service-/
dekk-/skadehistorikk per bil.

## Rapportering

✅ Implementert og verifisert — Rapporthub 2.0 med 12 standardiserte
rapporter (se CLAUDE.md), delt Excel-eksportinfrastruktur.

## Analyse

🟡 Delvis implementert — eget menypunkt (📈 Analyse) finnes atskilt fra
Rapporter, men omfanget av selve analysefunksjonaliteten er ikke verifisert
i dybden i denne gjennomgangen (ingen egen "Operativ Belastning"-indikator
funnet — se merknad under Dashboard-optimaliseringer).

## Dashboard-optimaliseringer

✅ Implementert og verifisert — Prioritet 26.2 (Dashboard Nullstilling):
svarer kun på tre spørsmål (hva må gjøres nå / hva kommer snart / hvilken
bil starte med), lesbart på under 5 sekunder. **Nytt i Prioritet 47, Del 1:**
alle "➕ Bestill tjenester"-forekomster (Dashboard, Kjøretøyprofil, egen
skjerm) bruker nå `.dash40-grid5` slik at fem hurtigbestillingskort (Service,
EU-kontroll, Dekkskifte, Verkstedtime, Ruteskift) vises på én rad — se over.

🔧 **Kjent, dokumentert avvik fra tidligere spesifikasjon:** en tidligere
spesifikasjon forutsatte at service-/kontrollprognoser og en "Operativ
Belastning"-indikator allerede fantes fra "Prioritet 18–24" — dette ble
avkreftet direkte i koden under Prioritet 26.2-arbeidet og er bevisst IKKE
bygget. Ikke marker dette som implementert uten å bygge det først.

## Kontrollsletting og Full Cleanup

✅ Implementert og verifisert — kontrollsletting fjerner relaterte data uten
spøkelsesdata (tidligere en kjent regresjon, nå rettet og verifisert).

## Reservebil-logikk

✅ Implementert og verifisert — Optimalisering 14: reservebiler unntatt fra
daglig kontrollkrav inntil tatt i bruk, automatisk tilbakestilling ved
dagskille.

## Serviceintervaller

✅ Implementert og verifisert — `v.serviceIntervallKm` per bil, registrert i
`LIST_TABLES` (`ServiceIntervallKm`), varslingsgrenser i
`vehicleServiceStatus()`.

## Kontrollstatus etter dager

✅ Implementert og verifisert — datakvalitetsstatus i Kilometerstandsrapport
(`vehicleDatakvalitetStatus()`, fem nivåer basert på dager siden siste
kontroll).

## Kjøretøyprofil-opprydding

✅ Implementert og verifisert — restrukturert til seks seksjoner (Prioritet
26.3), fire faste felt (Registreringsnummer/Kilometerstand/Siste
service/EU-godkjent til).

## Historikk-hub

✅ Implementert og verifisert — samlet inngang for kontroll-/service-/dekk-/
skadehistorikk, Service lagt til (Prioritet 26.10).

## Gruppert bilvalg

✅ Implementert og verifisert — gruppert dropdown i Biloversikt og Kontroll
(delt mønster), samt driftslag-gruppert bilvalg i Sjåførkontroll.

## Planlegging

✅ Implementert og verifisert — planlagt service atskilt fra ordinære
verkstedtimer (`WorkshopAppointments.Type`), EU-kontroll og service vist i
Planlegging.

## Operativ beslutningsstøtte

🟡 Delvis implementert — Dashboard og Operativ status gir et operativt
øyeblikksbilde, men et samlet, navngitt "beslutningsstøtte"-verktøy utover
dette er ikke identifisert som egen, avgrenset funksjon i koden.

## Less is More-audit

✅ Implementert og verifisert — Dashboard Nullstilling (Prioritet 26.2) er
eksplisitt en Less is More-revisjon: alt som ikke svarer på de tre
kjernespørsmålene er flyttet ut av Dashboard.

## Design 2.0 mobil/desktop

✅ Implementert og verifisert (desktop, Prioritet 27: adaptivt layout,
sidebar-navigasjon) — se CLAUDE.md for full struktur.

🟡 Delvis implementert (mobil) — sveipenavigasjon og hovedskjermene er
verifisert i koden. "Manuell overstyring mellom mobil- og desktopvisning"
som eget, eksplisitt brukervalg finnes IKKE i koden (bekreftet ved tre
uavhengige gjennomganger — ingen egen bryter, ingen tilhørende
localStorage-nøkkel). Se "Neste prioriterte arbeid".

## EU-kontroll

✅ Implementert og verifisert — se CLAUDE.md.

## Rapporthub

✅ Implementert og verifisert — Rapporthub 2.0, alle 12 rapporter
standardisert til samme mal.

## Kilometerstandsrapport

✅ Implementert og verifisert — egen datakvalitetsstatus, kun `v.km` som
kilde, dedikert Excel-eksport med frosset overskrift og tusenskilletegn.

## Driftslag

✅ Implementert og verifisert — se CLAUDE.md, "Sjåførkontroll". Feltet er
korrekt registrert i `LIST_TABLES` i nåværende `storage.airtable.js` (v2.8.1)
og bekreftet sendt/lest til/fra Airtable i koden.

## Biler ute av drift skjules fra aktive lister

✅ Implementert og verifisert (2026-09-07) — en bil merket `v.uteAvDrift`
skjules nå fra: driftslag-gruppert bilvalg i Sjåførkontroll (samlet i en
egen, ikke-klikkbar gruppe "🚫 Biler ute av drift" nederst), Dashboard sine
operative tellinger (kontrollstatus, EU-kontroll/service forfalt),
Planleggings status-baserte "kommende"-varsler, og bilvelgeren ved
registrering av ny sak/verkstedtime/dekkkostnad/skade. Forblir uendret
tilgjengelig i Biloversikt/Administrasjon, Kjøretøyprofil, Historikk,
Servicehistorikk, Dekkhistorikk, Rapporter og Analyse. Service-/Dekk-
skjermenes bilvelgere viser fortsatt alle biler (historikk skal alltid være
nåbar) — kun registrer-knappene skjules. `v.driftslag` beholdes uendret i
databasen mens bilen er ute av drift, så den havner automatisk tilbake i
riktig driftslag-gruppe når status settes tilbake til aktiv. Ingen sletting,
arkivering eller endring av registreringsnummer — ren visningsfiltrering.
Se CLAUDE.md, "Sjåførkontroll".

## Sjåførkontroll-dropdown

✅ Implementert og verifisert — akkordion med kun ett lag åpent om gangen
(Prioritet 27.7), delt komponent mellom sjåførens bilvalg og admin sin
"Bytt bil"-fallback.

## Data- og filnavnrettinger

✅ Implementert og verifisert i denne konsolideringen — bekreftet at
`storage.airtable.js` er den ENESTE, autoritative Airtable-storage-filen i
repoet; ingen konkurrerende filnavn-varianter finnes som faktiske filer (kun
som feilskrivinger i løpende kommentartekst, se AIRTABLE_MIGRATION.md).

## Synkroniseringsstatus

✅ Implementert og verifisert — se CLAUDE.md, "Dataintegritet". Viser
🟢/🟡/🔴-status, feilede lagringer, sist synkronisert-tidspunkt i Database
status.

## Skadebilder

✅ Implementert og verifisert — bilder lagres som base64 dataURL i egen
Airtable-tabell `Photos` (Key/Value-mønster, samme som `Settings`), ikke som
Airtable-vedleggsfelt. Både enkeltbilde (`damage:{id}`) og flerbilde-flyt via
sjåførkontroll (`kontroll:{id}:0`, `:1`, …) er implementert, inkludert
fallback-kopiering og lightbox-galleri.

## Serviceavtaler og servicehistorikk

✅ Implementert og verifisert — se CLAUDE.md, "Service". Kritisk
km-overskrivingsfeil er rettet (se AIRTABLE_MIGRATION.md/CLAUDE.md for
detaljer og manuell datakontroll-anbefaling). `servicehistorikk`/
`planlagteservicer` er ikke egne Airtable-tabeller, men én JSON-blob hver i
`Settings` — se AIRTABLE_MIGRATION.md, seksjon 9, for vurdert (men ikke
aktivert, fordi tabellene ikke finnes i produksjonsbasen) fremtidig
radbasert migrering. **Nytt i Prioritet 29:** full livssyklus for planlagte
servicer (rediger/marker utført/slett — `savePlanlagtServiceEdit()`,
`fullforPlanlagtService()`, `deletePlanlagtService()`), samt korrupt-JSON-
beskyttelse og rollback-på-lagringsfeil for begge datasett (se
"Datasikkerhet og samtidighet" under).

## Datasikkerhet og samtidighet (Prioritet 29)

✅ Implementert og verifisert:

- **Dobbel innsending:** `beskyttSubmit()`/`beskyttKlikk()` — delt,
  internt JS-lås (ikke kun `disabled`-attributtet) rundt alle kritiske
  skjemaer/knapper (service, planlagt service, verkstedtime, kontroll, sak,
  kjøretøy, dekk, skade, sletting av sak/verkstedtime, lagring av
  kjøretøyskjema, fullføring av planlagt service).
- **Skrivekø:** `_koKjor()`/`_skriveKoer` i `storage.airtable.js` —
  serialiserer `set()`/`del()` per ressurs (tabell eller Settings-rad), slik
  at to samtidige lagringer til samme tabell/rad aldri lenger kan
  race-conditione `reconcileList()`/`recordIdCache`. Uendret offentlig
  API (`set`/`del`-signatur), ingen kallesteder måtte endres.
- **Rollback ved lagringsfeil:** `mutasjonMedRollback()` i `index.html` —
  deep-clone-snapshot før mutasjon, gjenoppretter og re-rendrer ved feilet
  Airtable-lagring, med tydelig, vedvarende feilmelding som aldri påstår at
  data ble lagret. Brukt av service, planlagt service, aktive saker og
  verkstedtimer sine kritiske mutasjoner.
- **Korrupt Settings-JSON:** `parseJsonTrygt()` — `servicehistorikk`/
  `planlagteservicer` blir aldri stille nullstilt til tomt array ved
  korrupt JSON; datasettet flagges korrupt, lagring til det blokkeres, og
  brukeren varsles både ved oppstart og i Database status.
- **Gjensidige referanser:** `deleteSak()`/`deleteVT()` rydder nå opp i
  hverandres referanser (nullstiller `sakId`/`caseId` på verkstedtiden ved
  slettet sak; nullstiller `linkedVtId` og tilbakestiller sakstatus til
  "Tiltak planlagt" ved slettet verkstedtime) — ingen av delene slettes
  automatisk som følge av den andre.
- **Kilometerstand:** `saveVehicleForm()` krever nå eksplisitt bekreftelse
  før den kan endre `v.km` direkte (kun ved faktisk verdiendring), og
  dupliserte `saveVehicles()`-kallet i samme funksjon er fjernet.
- **Bakgrunnspoll:** `_lagBatchetLiveSyncHandler()` batcher alle endrede
  datasett i én synkroniseringssyklus til maks ett `render()`-kall, i
  stedet for opptil ett per `LIST_TABLES`-nøkkel.

## Gjenstående kjente feil eller mangler

📋 **Eksisterende kilometerdata bør kontrolleres manuelt** for kjøretøy som
kan ha fått `v.km` feilaktig overskrevet av historiske
service-registreringer før km-overskrivingsfeilen ble rettet (se CLAUDE.md).
Ingen automatisk korrigering er gjort.

✅ **Avklart (Prioritet 29, Del 11):** de to Airtable-feltene
(`AktiveSaker.RegistrationNumber`, `AktiveSaker.AssignedTo`) er IKKE
orphaned på datalagnivå — begge leses faktisk tilbake til minnet ved
innlasting (registrert i `LIST_TABLES`). Beslutning: behold begge felt som
bevisst redundans (se AIRTABLE_MIGRATION.md, seksjon 7, for full
begrunnelse) — ingen kodeendring gjort.

📋 **`servicehistorikk`/`planlagteservicer` lagres fortsatt som JSON-blober**
i Settings-tabellen for ALLE kjøretøy over ALLE år — ikke lenger en akutt
datasikkerhetsrisiko (se "Datasikkerhet og samtidighet" over), men fortsatt
en driftsrisiko ved fortsatt vekst (Airtables praktiske feltgrense per
celle). Målmodell for en eventuell fremtidig radbasert migrering er
dokumentert i AIRTABLE_MIGRATION.md, seksjon 9 — IKKE aktivert, siden de
nødvendige Airtable-tabellene bekreftet ikke finnes i produksjonsbasen i
dag. Krever en egen, separat godkjent migreringssak (inkludert manuelt
Airtable-oppsett) dersom dette skal gjennomføres.

🔧 **PWA-installasjon (Prioritet 42):** rotårsak funnet og bekreftet live —
`icons/`-mappen mangler på det publiserte GitHub Pages-repoet selv om all
kode forventer den der. Krever en manuell opplasting av tre ikonfiler til
`icons/` for å lukkes helt — se PRIORITET_42_ANALYSE.md.

📋 **Kilometerstand-racet (Prioritet 43):** fiksen (`get()` serialisert i
`_koKjor()`) er verifisert med en isolert, kjørt simulering av selve
kø-mekanismen — IKKE med en observert, levende flerbruker-test mot den
faktiske Airtable-basen (krever nettverkstilgang denne økten ikke har).
Anbefales fulgt opp med en reell test (to samtidige enheter/faner, én som
registrerer kontroll mens den andres bakgrunnspoll fyrer) ved neste
anledning noen har tilgang til den kjørende siden. Se PRIORITET_43_ANALYSE.md,
"Kjente begrensninger".

🔧 **Kode-/live-avvik i sjåførmodus (Prioritet 47) — fortsatt uavklart, ikke
løst av Del 2-redefineringen eller Prioritet 48:** referansebilder mottatt
fra bruker viste opprinnelig en bunnmeny («Min Bil · Velg bil · Oppgaver ·
Mer») som IKKE fantes noe sted i `index.html`/`kontroll.html` slik de lå i
dette Claude-prosjektet før Del 2 — samme type avvik som tidligere sett i
Prioritet 36/42. Bruker valgte i stedet å gi en ny, egen bunnmeny-
spesifikasjon (Prioritet 47 Del 2) og senere et konkret, godkjent
referansebilde for selve visningen (Prioritet 48) — dette har løst den
PRAKTISKE konsekvensen (sjåførsiden matcher nå et godkjent referansebilde),
men det opprinnelige spørsmålet om HVORFOR referansebildene i utgangspunktet
viste en struktur som ikke fantes i dette prosjektets kode, er aldri
oppklart. **«Sjekk ut bil»-teksten er nå satt eksplisitt i Prioritet 48**
(«Sjekk ut bil» / «Avslutt arbeidsdagen og frigjør bilen») — se CLAUDE.md og
PRIORITET_47_ANALYSE.md/PRIORITET_48_ANALYSE.md.

## Neste prioriterte arbeid

📋 **Vurder en oppfølgende, fullstendig skriftlig kontrastgjennomgang av
sjåførmodus (Prioritet 48):** denne runden spot-sjekket kontrast visuelt via
ni skjermbilder, men gjorde ikke en punkt-for-punkt-verifisering av samtlige
elleve tilstander bestillingen listet (inputfelt, placeholder-tekst,
feilmeldinger, bekreftelsesdialoger, deaktiverte felt, modalvinduer utover
navnedialogen) — se PRIORITET_48_ANALYSE.md, punkt 5, for hvorfor dette
vurderes lav risiko (delt, urørt kode, allerede dekket av Prioritet 38) og
hvilke tilstander som gjenstår.

📋 **Vurder en oppfølgende finpuss av de fire dokumenterte, gjenstående
visuelle avvikene fra Prioritet 48** (skiltfont, avatarikon, ikonflate-
fargenyanser, rødaksent-tone — se PRIORITET_48_ANALYSE.md punkt 2), dersom
en enda tettere 1:1-match mot referansebildet fortsatt er ønsket.

📋 Last opp `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` til en
`icons/`-mappe i GitHub-repoet (Prioritet 42 — se PRIORITET_42_ANALYSE.md).
Dette er den eneste gjenstående handlingen for å lukke PWA-installasjonssaken
helt; alt annet i sjekklisten er verifisert OK i koden.

📋 Vurder en full, visuell UI-gjennomgang (Del 11 i Prioritet
28-oppryddingen ble kun gjort som statisk kodeanalyse, ikke mot en levende
Airtable-base) for å bekrefte at Aktive saker, Operativ status og
Kjøretøyprofil viser nøyaktig feltsettet spesifisert i CLAUDE.md, ikke mer.

📋 Avklar om "manuell overstyring mellom mobil-/desktopvisning" fortsatt er
ønsket — bekreftet ikke-implementert i kode ved tre uavhengige
gjennomganger. Bygg som ny, avgrenset sak dersom fortsatt aktuelt.

## Prioritet 50 (2026-09-10) — Kommentarer 2.0

Rettet kritisk feil: sjåfører så kommentarer fra HELE bilparken i «💬
Kommentarer» (rotårsak: manglende bilfilter i visningen, ikke i dataene —
se CLAUDE.md for full kartlegging). Lagt til: bilspesifikk kommentarvisning
for sjåfør, `💬 Kommentarer (x)`-teller i Dashboard-sidemenyen (kun
administrator, uleste), ny Kommentaroversikt-skjerm for administrator med
«✅ Marker som lest», og en ny, fristilt «💬 Legg til kommentar»-funksjon
under ☰ Mer knyttet til sjåførens aktive bil (`driverVelgBilId`) — lagret i
en helt ny, separat Settings-blob-liste (`kommentarer[]`), bevisst IKKE i
`kontroller[]`, for å garantere at Kontrollflyt/kilometerlogikk/
`isKontrollertIdag()` forblir 100 % urørt (verifisert med diff mot forrige
versjon + Node.js-simuleringsharness, se PRIORITET_50_ANALYSE.md/CLAUDE.md).
Nytt Airtable-felt: `KommentarLest` på DriverChecks (les-status for
kontroll-baserte kommentarer). `storage.airtable.js` v2.11.0 → v2.12.0,
`sw.js` CACHE_VERSION bilpark-v46 → bilpark-v47.

## Prioritet 51 (2026-09-11) — Ny saksflyt

Erstattet Aktive Saker med en sterkt forenklet, firenivås arbeidsflyt uten
delstatuser/veiviser/behandlingsfelt: Aktiv sak (✅ Godta/❌ Avslå) → Under
oppfølging (📅 Registrer verkstedtime) → Planlagt verksted (✅ Arbeid utført)
→ Historikk. Ny terminal-status `avslatt` (ett klikk, ingen felt). De gamle
delstatusene og 4-stegs veiviseren er IKKE fjernet — kun ikke lenger
standardinngangen; fortsatt nåbar via «✏️ Avansert redigering» for
kostnadsregistrering (Kostnadsoversikt uendret avhengig av disse feltene).
`sakErApen()` utvidet til å også regne `utfort`/`avslatt` som lukket — alle
nedstrøms forbrukere (Dashboard, `vehicleHovedstatus()`, Rapporter, Analyse,
Verksted) arver dette automatisk via den ene, delte funksjonen, ingen av dem
selv rørt. Dashboard (desktop+mobil) har fått tre nye tellere (🔴/🟡/🔧) som
lenker rett til riktig fane. Ingen endring i `storage.airtable.js` (kun nye
verdier i et allerede registrert felt). `sw.js` CACHE_VERSION bilpark-v47 →
bilpark-v48.

## Prioritet 52 (2026-09-11) — Sakskort-sjekkliste, «Arbeid utført»-fullføring, kommentarer ut av Aktive saker

Sakskort viser nå ☑ varsellamper/kontrollavvik + "Annet: {tekst}" direkte
(`sakAvvikChecklistHtml()`) — ingen åpning nødvendig. «✅ Arbeid utført»
(`markerSakUtfort()`) fullfører nå faktisk saken: setter
`resolvedAt`/`completedAt`/`verkstedResultat`, lukker alle avvik, kvitterer
automatisk tilhørende varsellamper, og saken dukker korrekt opp i
Historikk/Rapporter/Analyse (tidligere satte den KUN status, usynlig i alle
tre). Rotårsak til «hengende» saker rettet: verkstedtime registrert utenom
sakskortet kobles nå automatisk til bilens ene åpne sak i "Under
oppfølging" der det er entydig. Kommentarpanel fjernet fra Aktive Saker
(data/💬 Kommentarer i sidemeny uendret — allerede der fra Prioritet 50).
**Kritisk feltretting:** `sak.avvik[]` var aldri registrert i
`LIST_TABLES` — stille datatap ved hver Airtable-synk siden Prioritet 12.
Rettet i `storage.airtable.js` (v2.12.0 → v2.13.0) — **krever ny kolonne
"Avvik" i AktiveSaker-tabellen i Airtable**, se AIRTABLE_MIGRATION.md.
`sw.js` CACHE_VERSION bilpark-v48 → bilpark-v49. 17/17
simuleringsassertions bestått. Layout Editor for sidemeny: kartlagt, ikke
implementert (se CLAUDE.md).

## Prioritet 53 (2026-09-12) — Dashboard 5.0

Desktop Dashboard forenklet: KPI-rad redusert fra fire til to kort (Biler i drift +
Kalender — "Aktive saker" og "Kommende frister" fjernet som duplikater av
fase-tellerne/Kalender). Verkstedtime fjernet fra Dashboardets Bestill tjenester
(opprettes nå kun via saksflyten). Biloversikt-tabellen redusert til Bil/Status/Sjåfør
med ikonbasert status. "Bilpark status" komprimert til tre kategorier (delt mellom
mobil/desktop). `sw.js` CACHE_VERSION bilpark-v49 → bilpark-v50. Se CHANGELOG.md for
full detalj og kjente begrensninger.

**Åpent:** Avklare om mobildashbordets KPI-rad/Bestill tjenester skal forenkles
tilsvarende (bevisst ikke gjort i denne leveransen, siden oppdraget ikke nevnte mobil).
