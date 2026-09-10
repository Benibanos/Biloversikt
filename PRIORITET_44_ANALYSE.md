# PRIORITET 44 — 🎨 Layout Editor under Innstillinger

Full analyse, kartlegging, lagringsdesign, løsning, simulering og tester.
Metodikk: samme prinsipp som Prioritet 42/43 — **ingen antakelser, kun
direkte kodeverifisering** mot den faktiske, kjørende koden (`index.html`).
All kartlegging under er gjort FØR implementering, slik bestillingen krevde
("Før implementering: Kartlegg alle dashboard-komponenter, Kartlegg alle
Min Bil-komponenter, Vis hvordan layoutdata lagres").

---

## 1. Kartlegging (før implementering)

### 1.1 Desktop Dashboard — `renderDashboard()`

Lesing av `renderDashboard()` i sin helhet (før noen endring) identifiserer
**7 håndterbare komponenter**, i den rekkefølgen de lå i den opprinnelige
template-literalen, samt 2 faste elementer som ikke er del av noen
komponentliste:

| # | Nøkkel | Innhold | Opprinnelig kolonne (`dash40-split`, Prioritet 37/38) |
|---|---|---|---|
| — | *(fast)* | `p38-tophead` — hilsen/topplinje | Over gridden, alltid øverst |
| — | *(fast)* | `db-warning-banner` — Airtable-varselbanner | Over gridden, alltid øverst |
| 1 | `kpi` | Nøkkeltall (4 kort) | Full bredde (over kolonnene) |
| 2 | `bestill` | ➕ Bestill tjenester | Full bredde (over kolonnene) |
| 3 | `kommende` | 📋 Kommende oppgaver | Venstre kolonne |
| 4 | `biloversikt` | 🚐 Biloversikt (biltabell) | Venstre kolonne |
| 5 | `bilparkstatus` | 🚚 Bilpark status | Høyre kolonne |
| 6 | `kreverhandling` | ⚠️ Krever handling nå | Høyre kolonne |
| 7 | `prioriterte` | 🎯 Prioriterte biler | Høyre kolonne |
| — | *(fast)* | `totalVehicles === 0`-tomtilstand | Under gridden |

**Konklusjon (1.1):** komponentene fordeler seg over tre faste grupper i
den eksisterende to-kolonne CSS-gridden (`full`/`venstre`/`hoyre`) — se
seksjon 2.3 for hvordan dette håndteres uten å redesigne selve gridden.

### 1.2 Mobil Dashboard — `renderMobilHjem()`

Lesing av `renderMobilHjem()` i sin helhet identifiserer **5 håndterbare
komponenter** i én kolonne (mobil har ingen kolonnedeling fra før), samt 3
faste elementer:

| # | Nøkkel | Innhold |
|---|---|---|
| — | *(fast)* | `p41-head` — merkevare-header |
| — | *(fast)* | `db-warning-banner` — Airtable-varselbanner |
| — | *(fast)* | `p41-sok` — søkefelt |
| 1 | `kpi` | Nøkkeltall (2 kort) |
| 2 | `bestill` | ➕ Bestill tjenester |
| 3 | `kommende` | 📋 Kommende oppgaver |
| 4 | `bilparkstatus` | 🚚 Bilpark status |
| 5 | `kreverhandling` | ⚠️ Krever handling nå |
| — | *(fast)* | `totalVehicles === 0`-tomtilstand |

**Konklusjon (1.2):** samme underliggende komponentsett som Desktop for de
komponentene som finnes på begge (`kpi`, `bestill`, `kommende`,
`bilparkstatus`, `kreverhandling`) — Mobil mangler ganske enkelt
`biloversikt` og `prioriterte`, som allerede kun rendres på Desktop i
opprinnelig kode. Ingen kolonnedeling å ta hensyn til.

### 1.3 Min Bil — `renderDriverMinBil()`

Lesing av `renderDriverMinBil()` i sin helhet identifiserer **6 håndterbare
komponenter**, samt 2 faste elementer — hvorav ett er sikkerhetskritisk:

| # | Nøkkel | Innhold |
|---|---|---|
| — | *(fast)* | `<h2>Min Bil</h2>` + sjåfør-hint (`required-hint`) |
| 1 | `bilkort` | Kjøretøystatus-panel (skilt, bilnummer/merke/modell, `ov-grid` med kontrollstatus/aktive saker/neste verksted/status) |
| 2 | `skade` | ➕ Registrer skade (knapp + panel) |
| 3 | `varsel` | ➕ Registrer varsellampe (knapp + panel) |
| 4 | `avvik` | ➕ Registrer avvik (knapp + panel) |
| 5 | `kontakt` | 📞 Kontakt driftskoordinator (knapp + panel) |
| 6 | `nysjafor` | 👤 Ny sjåfør (knapp + panel) |
| — | *(fast, alltid sist)* | `mb-sjekk-ut-btn` — «✓ Sjekk ut bil» |

**Konklusjon (1.3):** «✓ Sjekk ut bil» er en avslutningshandling
(sjåføren logger seg ut av bilen) og holdes bevisst UTENFOR
layoutsystemet — den skal aldri kunne skjules eller flyttes bort fra sin
faste plass sist i listen, siden det er sjåførens eneste vei ut av
biløkten fra denne skjermen.

### 1.4 Hvordan layoutdata lagres

Prosjektet har allerede et etablert mønster for globale, ikke-tabellbaserte
innstillinger: `theme-preference`, `bilkategorier` og `verksteder` lagres
alle som enkeltrader i Airtable-tabellen **Settings** (nøkkel/verdi), lest
og skrevet via det **generiske** (ikke-`LIST_TABLES`) sporet i
`storage.airtable.js` sin `get()`/`set()`. Dette sporet krever INGEN
`LIST_TABLES`-registrering — feltregelen i CLAUDE.md ("nytt felt i
index.html må registreres i LIST_TABLES") gjelder kun feltnavn på
tabellrader i `LIST_TABLES`-ressurser (Vehicles, DriverChecks, osv.), ikke
disse generiske Settings-nøklene.

**Valg for Prioritet 44:** gjenbruk NØYAKTIG samme mønster med én ny
Settings-nøkkel, `dashboard-layout`, hvis verdi er én JSON-blob:

```json
{
  "desktop": { "order": ["kpi","bestill","kommende","biloversikt","bilparkstatus","kreverhandling","prioriterte"], "hidden": [] },
  "mobil":   { "order": ["kpi","bestill","kommende","bilparkstatus","kreverhandling"], "hidden": [] },
  "minbil":  { "order": ["bilkort","skade","varsel","avvik","kontakt","nysjafor"], "hidden": [] }
}
```

Dette tilfredsstiller bestillingens «Lagres i Settings. Ingen ny
Airtable-tabell.» eksplisitt: ingen ny tabell, intet nytt felt i
`LIST_TABLES`, ingen endring i `storage.airtable.js` i det hele tatt.
Lasting skjer i `loadAll()` (samme sted og samme feilhåndteringsmønster som
`theme-preference`), og er dermed automatisk med i appens eksisterende
Airtable-synk uten noen ny mekanisme.

---

## 2. Løsning

### 2.1 Datamodell og fremtidssikring

`DASHBOARD_LAYOUT_FLATER` definerer standard komponentliste (nøkkel +
brukervendt label) for hver av de tre flatene. `defaultLayoutForFlate()`
returnerer standarden (`order` = alle nøkler i original rekkefølge,
`hidden` = tom). `getLayoutFlate()` slår sammen en eventuelt lagret layout
med standarden:

- enhver nøkkel i den lagrede `order` som IKKE lenger finnes i standarden
  (f.eks. en fjernet komponent) filtreres bort,
- enhver nøkkel i standarden som IKKE finnes i den lagrede `order` (f.eks.
  en NY komponent lagt til i en senere versjon av koden) legges automatisk
  til på slutten — **aldri silent-hidden**. Dette er samme
  fremtidssikringsprinsipp som `rebyggKategoriOppslag()` allerede bruker
  for `bilkategorier`.
- `hidden` filtreres tilsvarende mot gyldige nøkler.

En manglende eller korrupt lagret verdi (feil ved `JSON.parse`, eller
ingen rad funnet i Settings) faller trygt tilbake til `null`, som
`getLayoutFlate()` igjen tolker som "bruk ren standard" — aldri en
krasjende feil, kun standardvisningen.

### 2.2 Rendering — «kun plassering og synlighet»

Kjernegarantien i bestillingen («Ikke gjør komponentene redigerbare. Kun
plassering og synlighet.») er implementert strukturelt, ikke bare som en
regel å huske på:

- `renderDashboard()`, `renderMobilHjem()` og `renderDriverMinBil()` bygger
  fortsatt EKSAKT samme markup som før Prioritet 44 for hver komponent —
  denne markupen er kun flyttet, ord for ord, inn i et
  `komponentHtml = {key: '<html>', ...}`-oppslagsobjekt per funksjon.
  Ingen tekst, klasse, ID eller event-hook i noen komponent er endret.
- `layoutFlateHtml(flateKey, komponentHtml)` er den ENESTE nye
  rendering-logikken: den slår opp gjeldende `order`/`hidden` for flaten og
  returnerer komponentenes HTML i riktig rekkefølge, med skjulte
  komponenter utelatt. Den kan aldri endre en komponents innhold — den ser
  bare nøklene, aldri HTML-strengene sitt innhold.
- Faste elementer (topplinjer, søkefelt, varselbanner, tittel/hint,
  «Sjekk ut bil») ligger fortsatt direkte i template-literalen, helt
  utenfor `komponentHtml`/`layoutFlateHtml` — de kan derfor aldri bli
  skjult eller flyttet via Layout Editoren, som tiltenkt.

### 2.3 Desktop sin to-kolonne-grid bevares uendret

Den eksisterende `dash40-split`-gridden (Prioritet 37/38) er en fungerende
layout og skal ikke redesignes («endre minst mulig», «ikke fjern
fungerende funksjonalitet under redesign»). Løsningen er en fast
gruppe-partisjonering, `DESKTOP_LAYOUT_KOLONNER = { full: [...], venstre:
[...], hoyre: [...] }`, som permanent tilordner hver komponentnøkkel til
én av de tre gruppene gridden allerede har. Layout Editoren viser likevel
ÉN samlet, sorterbar liste for "Desktop Dashboard" — matcher brukerens
mentale modell av "3 flater" fra bestillingen — men selve
`renderDashboard()` filtrerer den ene lagrede rekkefølgen ned per gruppe
for å avgjøre relativ rekkefølge INNENFOR hver gruppe.

**Bevisst avgrensning:** en komponent kan flyttes opp/ned innenfor sin
kolonne og skjules/vises fritt, men kan IKKE flyttes over i en annen
kolonne fra Layout Editoren (det ville kreve et redesign av selve gridden
til én kolonne, eller en dynamisk kolonnetildeling — begge vurdert som
større inngrep enn bestillingen ba om). Dette er dokumentert som en kjent
begrensning, se seksjon 5.

### 2.4 Reorder-UI: opp/ned-knapper

Brukeren ble eksplisitt spurt (siden bestillingen nevnte "dra og slippe")
om opp/ned-knapper, ekte HTML5 dra-og-slipp, eller en hybrid, og valgte
**opp/ned-knapper**. Dette gjenbruker nøyaktig samme mønster som allerede
finnes for å omsortere `bilkategorier` (Prioritet 41) — «ikke dupliser
eksisterende funksjoner» — og unngår at native HTML5 drag-and-drop (kjent
upålitelig på mobil/touch) skal måtte fungere i Innstillinger, som også er
nåbar fra mobil.

### 2.5 Innstillinger-integrasjon

Ny accordion-rad `🎨 Layout Editor` i `renderInnstillinger()`, plassert
mellom den eksisterende `⚙️ Administrer bilkategorier`-raden og
`system`-raden. Hver av de tre flatene får sin egen seksjon
(`layoutEditorFlateHtml()`) med én rad per komponent (label, ↑/↓/👁️-knapper,
"skjult"-merking når relevant) og en «↺ Nullstill til standard»-knapp med
bekreftelsesdialog som kun tilbakestiller DEN ENE flatens lagrede
rekkefølge/synlighet, ikke de to andre.

### 2.6 Nye funksjoner (full liste)

| Funksjon | Ansvar |
|---|---|
| `DASHBOARD_LAYOUT_FLATER` | Standard komponentliste + labels per flate |
| `DESKTOP_LAYOUT_KOLONNER` | Fast gruppe-tilordning for Desktop sin to-kolonne-grid |
| `defaultLayoutForFlate(flateKey)` | Bygger ren standard `{order, hidden}` |
| `getLayoutFlate(flateKey)` | Slår sammen lagret + standard, fremtidssikret |
| `saveDashboardLayout()` | Skriver `dashboardLayout` til Settings-nøkkelen `dashboard-layout` |
| `flyttLayoutKomponent(flateKey, key, retning)` | Bytter plass med nabo i `order`, lagrer, rerendrer |
| `toggleLayoutSynlighet(flateKey, key)` | Legger til/fjerner fra `hidden`, lagrer, rerendrer |
| `resetLayoutFlate(flateKey)` | Tilbakestiller én flate til standard (bekreftelsesdialog) |
| `layoutFlateHtml(flateKey, komponentHtml)` | Returnerer synlige komponenters HTML i riktig rekkefølge |
| `layoutFlateSynligeNokler(flateKey)` | Samme som over, men returnerer nøkler (brukt av Desktop for kolonnefiltrering) |
| `layoutEditorFlateHtml(flateKey)` | Bygger admin-UI-en for én flate i Innstillinger |

---

## 3. Simulering (etter implementering)

Kjørt som en frittstående Node.js-simulering
(`/tmp/p44check/layout_sim.js`) av `getLayoutFlate()`/
`saveDashboardLayout()`/lasting-mekanismen, kopiert 1:1 fra `index.html`,
mot en simulert Airtable Settings-lagring (samme mønster som
`theme-preference`). "Oppdater app" / "Reload" / "Ny innlogging" simuleres
alle identisk: `dashboardLayout` nullstilles fullstendig i minnet og bygges
opp igjen fra grunnen fra den lagrede Settings-verdien, akkurat som en ekte
`loadAll()`-kjøring ved sideinnlasting eller ny sesjon.

**Scenario 1 — Desktop:** flytt `bilparkstatus` forbi `biloversikt` i
rekkefølgen, skjul `prioriterte`. Lagre → nullstill alt i minnet (simulerer
reload) → last på nytt fra Settings.
Resultat: ✅ `bilparkstatus` fortsatt flyttet, ✅ `prioriterte` fortsatt
skjult, ✅ alle 7 komponenter fortsatt til stede.

**Scenario 2 — Mobil:** skjul `kommende`. Lagre → reload → verifiser skjult
→ kjør "Nullstill til standard" → reload igjen → verifiser tilbake til ren
standard rekkefølge og ingen skjulte.
Resultat: ✅ skjuling overlevde reload, ✅ nullstilling ga eksakt
standardoppsettet (`['kpi','bestill','kommende','bilparkstatus','kreverhandling']`,
ingen skjulte).

**Scenario 3 — Min Bil:** flytt `kontakt` til topps i rekkefølgen. Lagre →
reload.
Resultat: ✅ `kontakt` fortsatt først, ✅ alle 6 komponenter fortsatt til
stede.

**Scenario 4 — fremtidssikring:** simulerer at en fremtidig kodeversjon
legger til en helt ny komponentnøkkel (`nykomponent`) i Min Bil sin
standardliste, mens en gammel lagret layout (uten den nøkkelen, fra
scenario 3) fortsatt ligger i Settings.
Resultat: ✅ den nye komponenten dukker automatisk opp i den sammenslåtte
listen, ✅ den er synlig som standard (ikke skjult) — bekrefter at
`getLayoutFlate()` sin sammenslåingslogikk aldri silent-hider en fremtidig
komponent.

Alle fire scenarioer besto. Full kjørelogg er reprodusert i seksjon 5
under "Tester utført".

---

## 4. Endrede filer

| Fil | Endring |
|---|---|
| `index.html` | Ny datamodell/funksjoner (seksjon 2.6), ny accordion-rad i `renderInnstillinger()` + tilhørende listeners i `attachInnstillingerListeners()`, refaktorering av `renderDashboard()`/`renderMobilHjem()`/`renderDriverMinBil()` til `komponentHtml`-mønsteret, ny `dashboardLayout`-lasting i `loadAll()`. |
| `kontroll.html` | Resynkronisert som eksakt byte-for-byte kopi av `index.html` (prosjektkonvensjon). |
| `sw.js` | `CACHE_VERSION`: `bilpark-v39` → `bilpark-v40` (app-shell-innhold i `index.html` endret betydelig). |
| `storage.airtable.js` | **Uendret.** Ingen ny tabell, intet nytt `LIST_TABLES`-felt, ingen endring i generisk get()/set() nødvendig — Settings-nøkler krever ingen kodeendring i denne filen. |
| `CLAUDE.md` | Ny «Prioritet 44»-seksjon, oppdatert toppdato/-oppsummering og `CACHE_VERSION`-referanse. All tidligere historikk bevart uendret. |
| `ROADMAP.md` | Ny «Prioritet 44»-oppføring foran «Prioritet 43», oppdatert toppdato/-oppsummering. All tidligere historikk bevart uendret. |
| `PRIORITET_44_ANALYSE.md` | Ny fil (denne). |

---

## 5. Tester utført

- ✅ `node --check` på begge `<script>`-blokkene i `index.html` (og den
  identiske `kontroll.html`) — ingen syntaksfeil.
- ✅ `diff index.html kontroll.html` — bekreftet byte-for-byte identiske,
  som forutsatt av prosjektets etablerte konvensjon.
- ✅ Versjonskonsistens verifisert med `grep`: `storage.airtable.js?v=2.10.0`
  uendret i BÅDE `index.html` og `kontroll.html` (korrekt — filen er ikke
  rørt i denne prioriteten), `versjon: 'v2.10.0'` uendret i
  `storage.airtable.js`, `CACHE_VERSION = 'bilpark-v40'` i `sw.js` —
  samstemt.
- ✅ **Isolert, kjørt simulering** (`layout_sim.js`, Node.js) av
  `getLayoutFlate()`/lagrings-/lastingsmekanismen kopiert 1:1 fra
  `index.html`: alle 4 scenarioer i seksjon 3 besto (Desktop, Mobil, Min
  Bil, fremtidssikring).
- ✅ Uttømmende kodelesing av `renderDashboard()`, `renderMobilHjem()` og
  `renderDriverMinBil()` FØR noen endring (seksjon 1) — bekrefter nøyaktig
  7 + 5 + 6 håndterbare komponenter og hvilke elementer som er faste.
- ✅ Manuell verifisering av at all flyttet markup er byte-for-byte
  identisk med originalen (ingen tekst-, klasse- eller ID-endring i noen
  komponent) ved å sammenligne `komponentHtml`-blokkene mot den
  opprinnelige template-literalen komponent for komponent.
- ✅ Bekreftet at `layoutFlateHtml()`/`layoutFlateSynligeNokler()` kun
  opererer på nøkler (streng-sammenligning og array-filtrering) og aldri
  leser eller skriver til komponentenes HTML-innhold — strukturell garanti
  for «kun plassering og synlighet».
- 🔲 **Ikke utført: manuell test i faktisk nettleser** (klikk på ↑/↓/👁️/
  Nullstill-knappene i en levende DOM, visuell verifisering av at Desktop
  sin to-kolonne-grid ser riktig ut med ulike skjul/vis-kombinasjoner) —
  krever en nettleserøkt denne omgivelsen ikke har (samme begrensning som
  Prioritet 42/43 sin manglende live GitHub Pages-/Airtable-test).
  Simuleringen i seksjon 3 verifiserer lagrings-/gjenopprettingslogikken
  presist (samme kode, samme datastruktur), men erstatter ikke en faktisk
  visuell/interaktiv test.
- 🔲 **Ikke utført: live test mot ekte Airtable-base** for selve
  `dashboard-layout`-Settings-raden — krever ekte nettverkstilgang
  (utenfor denne øktens tilgang, se «Kjente begrensninger»). Mekanismen er
  identisk med den allerede fungerende `theme-preference`-lagringen, som
  er verifisert i produksjon fra tidligere prioriteter.
- 🔲 **Ikke utført: full regresjonstest** av Aktive saker, Historikk,
  Planlegging, Sjåførkontroll, Rapporthub, Serviceintervaller, EU-kontroll,
  Skader, Dekk og service worker/"Oppdater app" utover det som er dekket
  over — endringen er presist avgrenset til rendering av tre spesifikke
  flater og påvirker ingen annen skjerm, datamodell eller Airtable-tabell,
  så regresjonsrisikoen vurderes som lav, men er ikke verifisert med en
  faktisk kjørt full runde i denne økten, av samme tilgangsårsak som over.

---

## 6. Kjente begrensninger

1. **Ingen live-test i faktisk nettleser eller mot ekte Airtable-base.**
   Lagrings-/gjenopprettingslogikken er bekreftet med en presis, kjørt
   simulering av selve mekanismen (seksjon 3), og selve
   Settings-lagringsmønsteret er identisk med det allerede
   produksjonsverifiserte `theme-preference` — men den visuelle/
   interaktive opplevelsen (knappeklikk i DOM, faktisk grid-oppførsel) er
   ikke observert direkte i denne økten (samme tilgangsbegrensning som
   Prioritet 42/43).
2. **Desktop Dashboard støtter ikke omsortering på tvers av kolonner.**
   En komponent kan flyttes opp/ned innenfor sin faste gruppe (`full`/
   `venstre`/`hoyre`) og skjules/vises fritt, men Layout Editoren kan ikke
   flytte den til en annen kolonne — dette er en bevisst avveining for å
   bevare den eksisterende, fungerende to-kolonne-gridden uendret (se
   seksjon 2.3). Ønskes full fri plassering på Desktop, krever det en
   separat, større beslutning om å redesigne selve gridden.
3. **Layoutinnstillingen er delt/global, ikke per bruker.** Alle brukere
   (driftskoordinator og eventuelle andre admin-brukere) ser samme lagrede
   Desktop-/Mobil-layout — samme prinsipp som `theme-preference` allerede
   bruker. Er per-bruker-layout ønsket senere, krever det en egen
   beslutning (og mest sannsynlig et sted å knytte layoutvalget til en
   bruker-identitet, som appen i dag ikke har for driftskoordinator-siden).
4. **Reorder-UI er opp/ned-knapper, ikke ekte dra-og-slipp**, per
   brukerens eget valg (seksjon 2.4) — funksjonelt likeverdig for
   bestillingens formål («endre rekkefølge»), men visuelt et annet
   interaksjonsmønster enn ordet «dra og slippe» i den opprinnelige
   bestillingsteksten isolert sett kunne tilsi.
5. **Min Bil sin `bilkort`-komponent er nå en del av den sorterbare
   listen** (kan i teorien flyttes/skjules som de andre), i tråd med
   `DASHBOARD_LAYOUT_FLATER.minbil` sin komponentliste kartlagt i seksjon
   1.3. Å skjule kjøretøystatus-panelet fullstendig er teknisk mulig via
   Layout Editoren, selv om det neppe er en ønsket driftssituasjon —
   ingen egen sperre er lagt inn mot å skjule akkurat denne komponenten,
   siden bestillingen ikke definerte noen slik unntaksregel utover
   «Sjekk ut bil»-knappen.
