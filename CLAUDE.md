# CLAUDE.md — Bilpark Operativsystem

Prosjektets kilde til sannhet. Sist konsolidert: 2026-09-22 (Prioritet 74 —
**Historisk service.** «Registrer tidligere service» ved siden av «Registrer service». Utført dato = ServiceDato (`servicehistorikk[].dato`); `createdAt` er registreringstidspunkt. Siste service og km igjen beregnes live fra nyeste gyldige historikkpost; sletting oppdaterer automatisk. `storage.airtable.js` uendret v2.24.0; appversjon 121. Se «Prioritet 74 (2026-09-22)» nederst. Før det: 2026-09-22 (Prioritet 71.1 —
**Fjern løftebord fra sjåførkontroll.** Løftebord-seksjonen, OK/Må gjøres og status er tatt ut av kontrollflyten. Min Bil beholder status, sist utført, vedlikeholdshistorikk og «Smør løftebord». Ny rekkefølge: km → varsellamper → kontrollavvik → avvikskommentar → sjåførkommentar → nye skader → send. `storage.airtable.js` uendret v2.24.0; appversjon 120. Se «Prioritet 71.1 (2026-09-22)» nederst. Før det: 2026-09-22 (Prioritet 70 —
**Skill kommentar og kontrollavvik.** Kommentar fra sjåfør er informasjon og oppretter aldri sak, varsel eller kontrollavvik. Kontrollavvik er oppfølging, med eget avvik «Sidespeil defekt/ødelagt» og egen avvikskommentar på avviket. Bil og sjåfør er tatt ut av kontrollskjemaet. Nye skader og løftebord ligger på samme rad. `storage.airtable.js` uendret v2.24.0; appversjon 119. Se «Prioritet 70 (2026-09-22)» nederst. Før det: 2026-09-22 (Prioritet 69 —
Prosjektets kilde til sannhet. Sist konsolidert: 2026-09-22 (Prioritet 72 — **Komprimer Biloversikt.** ← Tilbake fjernet fra primære sider (Biloversikt/Verksted/Kalender/Aktive saker/Varslingssenter/Rapporter-hub/Kostnader), beholdt på detaljsider; kjøretøyteller fjernet; «+ Ny bil» som egen fane til høyre i fanelinjen; Søk + Filter på samme linje. `storage.airtable.js` uendret (v2.24.0). Se «Prioritet 72 (2026-09-22)» nederst. Før det: 2026-09-22 (Prioritet 69 —
**Varslingssenter viser kun aktive hendelser.** Avslåtte, lukkede og utførte saker og kvitterte varsellamper ligger i historikk, ikke i Varslingssenteret. «Merk som løst» lukker også tilhørende sak. `storage.airtable.js` uendret v2.24.0; appversjon 118. Se «Prioritet 69 (2026-09-22)» nederst. Før det: 2026-09-22 (Prioritet 68 —
**Opprydding av Kjøretøyprofil.** Bilkort samler navn·regnr, mobilitetsikon, løyve│servicenr, aktiv sjåfør og neste verkstedtime. Statusrad: Km · Sist service · EU · Dekk · Løftebord. Aktive saker er historikkfane. `Vehicles.Servicenummer` nytt felt. `storage.airtable.js` v2.24.0. Se «Prioritet 67 (2026-09-21)» nederst. Før det: 2026-09-21 (Prioritet 66 —
**Skill kommentarer og kilometeravvik.** Kilometeravvik og sjåførkommentarer er egne hendelser. `storage.airtable.js` v2.23.0. Se «Prioritet 66 (2026-09-21)» nederst. Før det: 2026-09-21 (Prioritet 65 —
**Aktiv sjåfør følger kontrollhistorikken.** En bil med gyldig kontroll i inneværende operative dag har alltid aktiv sjåfør = sjåføren på siste slike kontroll. `storage.airtable.js` uendret v2.23.0. Se «Prioritet 65 (2026-09-21)» nederst. Før det: 2026-09-21 (Prioritet 64 —
**Samle oppdatering og synkronisering.** Oppdater app, Database status og Systemkontroll sjåfører er samlet i Innstillinger → **Optimaliseringer** med Hurtigoversikt-faner (Alle / App / Airtable / Sjåfører) og «Oppdater og synkroniser alt». `storage.airtable.js` uendret (v2.23.0). Se «Prioritet 64 (2026-09-21)» nederst. Før det: 2026-09-21 (Prioritet 63 —
**Dublettsikring og flerbilssaker.** Sjåførkontroll: «Registrerer...»-knapp og dublettsikring (samme bil + sjåfør + operative dag innen 10 min lagres kun én gang). Aktive saker: «➕ Legg til bil» —
én sak for flere biler (én saksrad per bil knyttet med `sakGruppeId`), samlet Godta og én verkstedbestilling per bil. **Ny Airtable-kolonne `AktiveSaker.SakGruppeId` MÅ opprettes før idriftsettelse.**
Se «Prioritet 63 (2026-09-21)» nederst. `storage.airtable.js` v2.23.0. Før det: 2026-09-21 (Prioritet 62 —
**Dynamisk tekst for driftsdager.** «Siste N driftsdager» på Dashboard følger valgt driftsdagskonfigurasjon (`activeWeekdays.length`), og prosenten regnes over samme N.
Se «Prioritet 62 (2026-09-21)» nederst — den avløser «siste 7 driftsdager» fra Prioritet 53. Før det: 2026-09-21 (Prioritet 61 —
**Daglig systemkontroll for sjåfører.** Første åpning av sjåførappen på en enhet hver operative dag (dagskille kl. 04:00) møter en
sperrende «Systemkontroll» med knappen «Oppdater og fortsett» (hard refresh, cache tømmes, versjon kontrolleres, lastVerifiedVersion/Date
registreres); status vises for administrator i Innstillinger. `version-check.js` fikk en felles `hardRefresh()` som bevarer `?sjafor=1`.
Se «Prioritet 61 (2026-09-21)» nederst. `storage.airtable.js` v2.22.0 (ekte `list()`), ingen Airtable-endring. Før det: 2026-09-21 (Prioritet 60 —
**Layout Engine 2.0 for hele Bilpark.** Dashboard Editor 1.0 er utviklet videre til ÉN felles layoutmotor med ett
komponentregister (`LAYOUT_COMPONENTS`) og én versjonert Settings-konfigurasjon (`bilpark-layout-config-v2`) for Desktop
Dashboard, Sidemeny, Bilinformasjon, Min Bil, Sjåførkontroll (begrenset), Mobil Dashboard og standardsidene. Layout styrer
kun plassering/synlighet/størrelse/starttilstand — aldri forretningslogikk. Se «Prioritet 60 (2026-09-21)» nederst — den
avløser opp/ned-modellen fra Prioritet 44, lagringsformatet `dashboard-layout-v1` fra Prioritet 58 og de faste sidemenylistene.
`storage.airtable.js`/Airtable er uendret. Før det: 2026-09-21 (Prioritet 56.1 —
**Kompakt bilvalg.** Sjåførens Velg bil (og administrasjonens «Bytt bil»-fallback) bruker nå Ringeliste-gruppekortene
(`.ringeliste-group`) med kompakte bilrader og en lavere toppseksjon. Se «Prioritet 56.1 (2026-09-21)» nederst — den
avløser Velg bil-kortene fra Prioritet 48. Før det: 2026-09-20 (Prioritet 59 —
**Forenkle Bilinformasjon og dekkskift for flere biler.** (Brukerens EGEN betegnelse «Prioritet 59» — det finnes fra
før en helt annen, «Prioritet 59 (2026-09-13) — Prioritet er ikke lenger en sannhet»; navnesammenfallet er tilfeldig.)
Kjøretøyprofilen har fått ny statusrad og én Historikk-seksjon med fem faner i stedet for de gamle fanene, og dekkskift
kan bestilles for flere biler samtidig — én egen verkstedbestilling per bil. Se «Prioritet 59 (2026-09-20)» nederst — den
avløser fanestrukturen på Kjøretøyprofilen fra Prioritet 37/65/71.5 og «Bestill dekkskift» fra Prioritet 62. To nye
Airtable-kolonner på `WorkshopAppointments` MÅ opprettes før idriftsettelse. Før det: 2026-09-19 (Prioritet 58 —
**Dashboard Editor 1.0.** (Brukerens EGEN betegnelse «Prioritet 58» — det finnes fra før en helt annen,
«Prioritet 58 (2026-09-13) — Synlighetsdrevet Lucide-migrering»; navnesammenfallet er tilfeldig.) Administrator
omorganiserer Desktop Dashboard selv i et 12-kolonners rutenett: dra kort, endre bredde/høyde, skjule/vise, legge
til kort fra et bibliotek, angre, forhåndsvise, lagre og tilbakestille — Innstillinger → Layout Editor → Desktop
Dashboard → «Rediger dashboard». Layouten lagres som én versjonert Settings-blob `dashboard-layout-v1`;
`storage.airtable.js` er IKKE endret. Se «Prioritet 58 (2026-09-19)» nederst — den avløser opp/ned-modellen for
Desktop Dashboard (Prioritet 44) og «banneret er fast innhold» (Prioritet 50/57) for desktop; mobil og Min Bil er
uendret. Før det: 2026-09-19 (Prioritet 57 —
**Dashboard og Hurtigoversikt.** Varsler-fanen har samme radmønster som de andre fanene, og «Neste
verkstedtime» ligger i Dashboard-banneret (høyre kolonne). Se «Prioritet 57 (2026-09-19)» nederst — den
avløser Dashboard-plasseringen fra Prioritet 54 og Varsler-radene fra Prioritet 50. Før det: 2026-09-19
(Prioritet 56 —
**Moderniser hele sjåførmodus.** Ringeliste er referansedesignet for alle sjåførskjermer (delte
`sj-*`-klasser), Min Bil har ETT bilkort (kontrollstatus · km · neste verkstedtime · løftebord), løftebord er
steg 4 i kontrollflyten, og en sendt kontroll går rett til Min Bil med en kort bekreftelse. Se «Prioritet 56
(2026-09-19)» nederst — den avløser Min Bil-plasseringene i Prioritet 49 Del 2/54. Før det: 2026-09-19
(Prioritet 54 —
**Neste verkstedtime som operativ informasjon.** Nærmeste kommende verkstedtime (én definisjon,
`nesteVerkstedtime()`, kilde `WorkshopAppointments`) vises på Dashboard, Verkstedoversikt,
Kjøretøyprofil/Bilinformasjon og Min Bil — via ETT delt kort, `nesteVerkstedtimeHtml()`. Se
«Prioritet 54 (2026-09-19)» nederst. Før det: 2026-09-19 (Prioritet 53 —
**Konfigurerbart grunnlag for operativ kontroll.** (Brukerens EGEN betegnelse «Prioritet 53» —
det finnes fra før en helt annen, tidligere «Prioritet 53 — Dashboard 5.0» lenger ned; navne-
sammenfallet er tilfeldig.) Administrator velger selv hvilke kjøretøy (lagret på Vehicle-ID) og
hvilke ukedager (ISO 1–7) som utgjør operativ kontroll, i Innstillinger → Systeminnstillinger →
🎯 Operativ kontrollgrunnlag. Én Settings-blob `operativ-kontrollgrunnlag`; `storage.airtable.js`
er IKKE endret. Erstatter den hardkodede kjernepopulasjonen fra Prioritet 50 og «7 kalenderdager».
**Uten gyldig grunnlag vises aldri en prosent.** Se egen seksjon «Prioritet 53 (2026-09-19)»
nederst. Før det: 2026-09-18 (Prioritet 52 —
**Dashboard UX Polish** (ren opprydding, ingen ny funksjonalitet): permanent scrollbarspor
og fanebytte i Hurtigoversikt uten full `render()` (ingen layout shift), Operativ kontroll-
banneret komprimert til to linjer, Bestill tjenester/Hurtigoversikt som seksjoner med
overskrift og skillelinje i stedet for bokser, og Biloversikt med kun Søk + Filter-panel.
Se egen seksjon «Prioritet 52» nederst. Før det: Prioritet 51 —
**Korrigert krav: Aktiv sjåfør og dagskille kl. 04:00.** Den ferdige regelen:
**«Aktiv sjåfør beholdes gjennom operativ dag, men nullstilles alltid ved operativt
dagskille kl. 04:00.»** Denne saken RETTER tre reelle avvik funnet ved grundig lesing av
den eksisterende (Prioritet 34/40/66/66.2) mekanismen mot et presist spesifisert
korrigert krav — den bygger IKKE en ny mekanisme fra bunnen, siden `ryddOppBiloktDagskille()`/
`handhevOperativtDogn()`/`vehicleAktivSjafor()` allerede dekket det aller meste korrekt:
(1) **`settAktivSjafor()` overskrev `aktivSjaforSiden` ved HVER kontroll**, selv når samme
sjåfør kontrollerte samme bil på nytt samme operative dag — rettet til å beholde det
opprinnelige tidsstempelet i akkurat det tilfellet; (2) **`ryddOppBiloktDagskille()` hadde
ingen rollback ved mislykket lagring** — en lokal nullstilling kunne dermed vises som
gjennomført selv om Airtable-skrivingen feilet; rettet med samme snapshot/rollback-mønster
som `submitKontroll()`/`deleteVT()` allerede bruker; (3) **en reell krasjrisiko**: et
ugyldig `aktivSjaforSiden`-tidsstempel (`new Date('ugyldig-streng')` → Invalid Date) fikk
`isoDateForOperationalDay()` (som bruker `Intl.DateTimeFormat`) til å KASTE en `RangeError`
i stedet for å returnere en verdi — uten en `isNaN`-vakt ville dette krasjet `vehicleAktivSjafor()`,
altså enhver visning som leser aktiv sjåfør (Dashboard/Biloversikt/Kjøretøyprofil/
sjåførmodus). Ny funksjonalitet lagt til i samme runde: et manuelt admin-«🔁 Nullstill
aktiv sjåfør»-trykk i Bilinformasjon (fantes ikke fra før, til tross for at ticket-en
antok det), og «Siden kl. HH:MM» nå faktisk VIST i UI (Kjøretøyprofilens Aktiv sjåfør-kort
og Biloversikt-kortets pille) — `aktivSjaforSiden` ble tidligere kun brukt internt, aldri
vist. Se egen seksjon lenger ned for full detalj. Før det: Prioritet 50 —
**Dashboard 5.0: ett sammenhengende skall, ett banner, én Hurtigoversikt.** (Merk:
brukerens EGEN betegnelse «Dashboard 5.0» — det finnes fra før en helt annen, tidligere
«Prioritet 53 — Dashboard 5.0» lenger ned i denne loggen; navnesammenfallet er tilfeldig,
samme situasjon som Prioritet 49 sin nummerering.) To deler: **Del 1 (app-ramme)** — en ny,
delt `.desktop-frame` slår sidepanelet og en full-bredde toppstripe (brand + løpende
sidetittel + varselklokke, `desktopFrameTittel()`) sammen til ett visuelt sammenhengende
skall, brukt AUTOMATISK av alle admin-skjermer siden den ligger i den delte
render()-innpakningen, ikke i hver skjerms egen kode — scopet bevisst til desktop, siden
mobil ikke har noe sidepanel å koble sammen med noe. **Del 2 (Dashboard-innhold)** —
Dashboard er radikalt forenklet til KUN tre ting: et nytt «🎯 Operativ kontroll»-banner
(dagens kontrollprosent for en ny, snevrere kjernepopulasjon — Lag 2/Montering/Lastebil,
`operativeKjerneBiler()` — pluss 7-dagers trend og en «aktive biler»-linje, alt samlet fra
det som før var to separate kort), «➕ Bestill tjenester» (uendret), og en ny, fanedelt
«📋 Hurtigoversikt» (Aktive saker/Oppfølging/Verksted/Varsler — samme
`.profil-tabs`/`.profil-tab`-mønster som Biloversikt/Varslingssenter) som erstatter de fire
gamle KPI-kortene. Kommende oppgaver, Biloversikt-forhåndsvisningen, Bilpark status,
Krever handling nå og Prioriterte biler er FJERNET fra Dashboard i sin helhet — begge
plattformer (`renderDashboard()`/`renderMobilHjem()`) deler nå NØYAKTIG samme
banner-/Hurtigoversikt-funksjoner, for ekte identisk oppførsel på tvers av desktop og
mobil. `storage.airtable.js` er IKKE endret (ren presentasjonsendring på eksisterende
data) — kun `CACHE_VERSION`/`APP_VERSION`/`version.json` økt (98 → 99). Se egen seksjon
lenger ned for full detalj, designvalg og kjente begrensninger (bl.a. at flere interne
felt i `dashboardBeregning()` nå beregnes uten noen gjenværende leser — bevisst ikke ryddet
i denne runden for å avgrense omfanget). Før det: Prioritet 49, Del 2 —
**Løftebord: avvik, vedlikehold og årlig kontroll.** Full løftebordstøtte lagt til Bilpark:
(1) ny kontrollavvikstype `'loftebord'` (🛗) i den eksisterende `KONTROLLAVVIK_ORDER`-motoren
— dukker automatisk opp i BÅDE full sjåførkontroll og Min Bil sin hurtigflyt, med et eget
fritekst beskrivelsesfelt KUN for løftebord i Min Bil (`submitMinBilAvvik()`), som lagres som
sakens beskrivelse via den UENDREDE `registrerAvvikSomSak()`; (2) et nytt, alltid synlig
«🛗 Løftebord»-kort på Min Bil (utenfor Layout Editor — ingen konfigurasjon skjuler det),
fargekodet fra dager siden sist smurt (🟢 0–14 · 🟡 15–30 · 🔴 31+ eller aldri) via ny
`loftebordVedlikeholdStatus()`; (3) «🛢 Smør løftebord» åpner et bekreftelsesskjema
(avkrysning påkrevd) → `submitMinBilLoftebordVedlikehold()`; (4) administratorens ett-klikks
«✅ Utført løftebordkontroll» i Bilinformasjon (`registrerLoftebordKontroll()`) — dato/utført
av/365-dagers gyldighet settes automatisk, kun `confirm()`, ingen sjåførvarsler; (5) en ny,
egen Airtable-tabell **LiftgateHistory** (app-nøkkel `loftebordHistorikk`) for BÅDE
vedlikehold og kontroll — disse to skal aldri blandes, og er samtidig en HELT annen datamodell
enn løftebord*avvik* (som fortsatt går gjennom `AktiveSaker` uendret). **Bevisst INGEN
«har løftebord»-felt eller annen kjøretøykonfigurasjon** — alle kjøretøy i flåten antas å ha
løftebord. `storage.airtable.js` v2.19.0 → v2.20.0 (kun `LIST_TABLES`-tillegg, ingen endring i
eksisterende felt). Se egen seksjon lenger ned for full detalj, designvalg og kjente
begrensninger. Før det: Prioritet 49 (Del 1) —
**Verkstedbestilling 3.0.** Merk nummereringen: dette er en bestilling brukeren
selv omtalte som «Prioritet 49» i sin ticket, men den er levert KRONOLOGISK
ETTER Prioritet 72.0 under — nummeret følger brukerens egen backlog, ikke
denne loggens løpende rekkefølge (49 var aldri brukt tidligere i prosjektet,
bekreftet ved søk før denne runden). Mål: gjør verkstedbestillingen fra en
aktiv sak («Aktiv sak → Godta → Bestill verksted») om fra et administrativt
registreringsskjema til en operativ arbeidsordre — ren design-/UX-endring,
ingen endring i Airtable-struktur, verkstedlogikk, saksmotor eller
statusflyt. `renderVerksted()` sin `linkedSak`-gren (skjemaet som åpnes av
`bestillVerkstedForSak()`) har fått en ny «arbeidsordre-header»
(`.vt-order-header`): bil (`${luc('truck','ic-blue')}` + `vehicleLabel()`)
og sakstype (`SAK_TYPE_LUCIDE`/`SAK_TYPE_LABEL` + `sakAvvikChecklistHtml()`,
samme sjekkliste-komponent som allerede vises på selve sakskortet i Aktive
saker, Prioritet 52/58 — gjenkjennelig fra forrige skjerm) vises tydelig
øverst, ikke lenger som redigerbare felt. Feltrekkefølgen er nå Bil → Problem
→ Verksted → Dato → Tid, matchende ticket-ens visuelle prioritet. Kommentar/
Kontaktperson/Telefonnummer er samlet under en ny, lukket-som-standard
«▼ Flere detaljer»-seksjon (`vtFlereDetaljerApen`, ny ren visningstilstand,
nullstilt til `false` hver gang skjemaet åpnes — se `bestillService()` m.fl.
og `add-vt-btn`-lytteren). Toggling skjer UTEN `render()` (ren DOM-klasse-/
`style.display`-veksling i `attachVerkstedListeners()`), av samme grunn som
den eksisterende type-velger-lytteren allerede unngår `render()`: en full
re-rendring ville nullstilt Dato/Tid/Verksted til malens statiske
`value`-attributter og slettet alt brukeren allerede hadde fylt inn.
Kommentarfeltet foreslår nå automatisk `sakKildeTekster(linkedSak)` (samme
kilde som sakskortets «beskrivelse», Prioritet 68) når skjemaet åpnes fra en
sak — feltet er fortsatt skjult til brukeren selv åpner «Flere detaljer»
(ferdigkrav 8). Primærknappen er endret fra «Lagre» til
«✅ Bestill verkstedtime» — for BEGGE grener av skjemaet (også den
frittstående «🔧 Ny verkstedtime», siden den også alltid bestiller en
verkstedtime, aldri bare «lagrer en post»). Ingen endring i `submitAddVT()`
sin innsendingslogikk, feltvalidering, sak-kobling eller type-utledning —
alle `id`-er (`vt-vehicle`, `vt-verksted`, `vt-dato`, `vt-tid`,
`vt-beskrivelse`, `vt-kontaktperson`, `vt-telefon`, `vt-notater`,
`vt-mobilitetsgaranti`) er UENDRET, kun plassering/synlighet i malen er
endret — `submitAddVT()` selv er ikke rørt. Den generelle, IKKE sak-koblede
«Ny verkstedtime»-grenen (Verkstedoversiktens eget «+ Ny verkstedtime») har
fått samme «Flere detaljer»-seksjon og samme knappetekst, men beholder sin
egen type-velger/bilvelger/beskrivelsesfelt øverst uendret — ticket-ens
wireframe gjaldt eksplisitt sak-flyten, men kravet «kommentarfelt skal ikke
vises som standard» var ikke avgrenset til den, så samme forenkling er
anvendt konsekvent begge steder. `sakTilVtType()`/`bestillVerkstedForSak()`/
`standardVerkstedForVtType()`/`submitAddVT()` er alle UENDRET — kun
`renderVerksted()` sin markup og `attachVerkstedListeners()` sin nye
toggle-lytter er endret. `storage.airtable.js` er IKKE endret — ingen nye
felt, ingen `LIST_TABLES`-endring — derfor uendret `versjon`/`?v=`.
`CACHE_VERSION` i `sw.js`, `APP_VERSION` i `version-check.js` og `version.json`
økt sammen (v96 → v97, appens app-shell-innhold endret). `node`/`python` var
ikke tilgjengelig i denne økten — verifisert med en global krøllparentes-/
backtick-/parentesbalansesjekk på `index.html` (5291 åpne = 5291 lukkede
krøllparenteser, partall antall backticks, parentesdiff uendret på −6, samme
baseline som tidligere runder har rapportert) og full gjennomlesning av hver
endret funksjon/mal før og etter redigering. **Ikke verifisert i en faktisk
kjørende nettleser eller mot en ekte/mock-Airtable-base i denne økten** —
anbefalt før idriftsettelse: åpne appen, klikk «📅 Bestill verkstedtime» på
en sak i «Under oppfølging», bekreft at bil/problem/sjekkliste vises korrekt
i headeren, at «▼ Flere detaljer» åpner/lukker uten å nullstille andre
felt, at et forhåndsforeslått kommentarfelt vises riktig kun etter åpning,
og at innsending fortsatt kobler verkstedtimen til riktig sak akkurat som
før. Ikke rørt: Aktiv sjåfør-logikk, Sjåførkontroll, `v.km`-skriveregler,
saksmotoren (`sakFase()`/`sakErApen()`/`godtaSak()`/`avslaSak()`/
`markerSakUtfort()` kun lest, aldri endret), Kalender, Biloversikt,
Varslingssenteret, Layout Editor, Bilkategorier, PWA/manifest-ikonfilene.
Før det: Prioritet 72.0 —
**Dashboard 2.0, Lucide-standard og bedre navigasjon.** Seks delmål bestilt
samlet: (1) full Lucide-ikonopprydding med en fargekodet standard (samme
KONSEPT = samme farge — bil=blå, verksted/reparasjon=oransje, dekk=oransje,
EU-kontroll=blå, varsler/avvik=gul, skader=rød, sjåfør=lilla, kalender=grønn,
historikk=grå); (2) «God morgen»-hilsenen på Dashboard erstattet av
«🎯 Operativ status» (ny `kontrollrateUke()`, kontrollrate siste 7 dager +
dagens kontrollerte-tall, samme kilde som `kontrollstatusKpiHtml()` alltid
har brukt); (3) én samlet KPI-rad med fem kort (Aktive saker/Under
oppfølging/Planlagt verksted/Aktive biler/Varsler,
`dashboardKpiRadHtml()`) — Planlagt verksted er bevisst IKKE fjernet; (4) et
nytt, kompakt «📅 Denne uken»-kalenderwidget på Dashboard
(`kalenderUkeWidgetHtml()`, samme datakilde som selve Kalenderen), klikk
åpner full Kalender; (5) Biloversikt sine kategorigrupper er gjort om fra
ekspander/lukk-akkordion til FANER (`.profil-tabs`, kun én gruppe synlig om
gangen — `registerAktivFane`); (6) Kalenderens datodetaljer vises nå i et
SIDEPANEL ved siden av månedsgriden (`.kal-split`) i stedet for stablet
under. Aktiv sjåfør som primær visning (fremfor «Sist kontrollert av») var
allerede levert på Biloversikt/Bilprofilens toppseksjon (Prioritet 71.11) —
fullført i denne runden også for Dashboardets egen mini-biloversikt-tabell,
som var det siste, dokumenterte unntaket. Full Lucide-standardisering er
BEVISST en avgrenset, dokumentert pass (samme «migrer etter synlighet, ikke
etter antall»-prinsipp som Prioritet 58) — se egen seksjon lenger ned for
nøyaktig hva som er konvertert og hva som bevisst står igjen (bl.a.
`HOVEDSTATUS_IKON` og andre statusfargesirkler, uendret siden Prioritet
57/58). Ingen endring i `storage.airtable.js` — ren presentasjons-/
navigasjonsendring på fire flater. Se egen seksjon lenger ned for full
detalj, designvalg og kjente begrensninger. Før det: Prioritet 71.11 —
**Aktiv sjåfør settes automatisk ved sjåførkontroll.** Bestilt etter en
observasjon av «2/13 kontrollert i dag» samtidig som «0 aktive biler» på
Dashboard. Grundig kartlegging (full lesing av
`settAktivSjafor()`/`startBilokt()`/`settAktivSjaforForKontroll()`/
`vehicleAktivSjafor()` m.fl., pluss et uttømmende grep-søk) bekreftet at
selve TILDELINGSLOGIKKEN allerede var fullstendig implementert siden
Prioritet 34/40/66.2 — `submitKontroll()` setter alltid aktiv sjåfør som
sitt siste steg, uansett kanal, og aktiv sjåfør beholdes til eksplisitt
utsjekk, kryss-bil-overtakelse eller operativt dagskille. Den reelle,
gjenstående forskjellen lå kun i VISNINGEN: Biloversikt-kortet og
Bilprofilens toppseksjon viste tidligere en konkurrerende «🕓 Sist
kontrollert av»-pille ved siden av «Aktiv sjåfør»-pillen. Denne er fjernet
fra begge steder som primær/synlig informasjon (beholdt som ikke-primær
title-tooltip) — «Aktiv sjåfør»/«Ingen aktiv sjåfør» står nå alene, slik
ticket ba om. Se egen seksjon lenger ned for full detalj og et forbehold om
at et avvik mellom kode og PUBLISERT side (samme klasse feil som Prioritet
42) ikke løses av en kodeendring. Før det: Prioritet 71.10 —
**godkjenning av store kilometerendringer.** Et bekreftet «storthopp»
(sjåførregistrert kilometerøkning på 1 000 km eller mer, allerede lagret
uendret siden Prioritet 66/67) har fått en formell Godta/Avslå-arbeidsflyt
for driftskoordinator i 🔔 Varslingssenteret, i stedet for kun en passiv
tekstlinje på Kjøretøyprofilen som pekte til Rediger informasjon. To nye
felt på `DriverChecks` (`kmGodkjenningStatus`/`kmGodkjenningInfo`, krever
nye Airtable-kolonner før bruk — se AIRTABLE_MIGRATION.md) sporer hvem som
godkjente eller avslo, og når. «✅ Godta endring» setter `v.km` til
kontrollens registrerte verdi (kontrollhistorikken uendret); «✖️ Avslå
endring» lar `v.km` stå uendret og merker verdien som avvist — og
ekskluderer den samtidig fra km-gulvet (`kontrollKmGulv()`) fremover, slik
at en avvist feilregistrering ikke permanent blokkerer senere, korrekte
kontroller. Varselets id er bundet til kontroll-ID (duplikatvern): samme
kontroll kan aldri gi mer enn ett varsel. Se egen seksjon lenger ned for
full detalj. Før det: Prioritet 71.9 —
**operativ opprydding i verksted, kalender og kjøretøyvisning.** Fem delmål.
(1) «Bestill verkstedtime fra sak» var i praksis allerede levert av
Prioritet 71.8 (tekst + `sakTilVtType()`) — bekreftet, ikke re-implementert.
(2) Reparasjon behandles allerede som egen, likestilt verkstedkategori siden
Prioritet 71.6 (`VT_TYPE_VELGER`) — den får nå i tillegg sitt EGET ikon/
tittel i `vtTypeIkon()`/`vtTypeLucide()`/`vtTypeArt()`/`vtTypeTittel()`
(tidligere delte Service/Dekkskift/Reparasjon alle det samme generiske
«🏭 Verkstedtime»). Bevisst IKKE gitt et femte Dashboard-bestillingskort —
det ville brutt Prioritet 62 sitt prinsipp om at en verkstedtime er et
resultat av en sak, ikke noe man bestiller direkte. (3) Kalenderens gamle
«📋 Alle kommende aktiviteter» (typegruppert, med 7/30/90-dagers periodevalg)
er erstattet av **`kalenderIDagSenereHtml()`** — «I dag»/«Senere», samme
datakilde som selve månedsgriden (`kalenderAktiviteterKart()`), ikke lenger
den separate, delvis dupliserte `flatePlanleggingData()`-visningen.
(4) Reservekjøretøy og Ute av drift skjules nå som standard på Biloversikt,
i sjåførens Ringeliste OG i Dashboardets Biloversikt-forhåndsvisning — tre
uavhengige par togglingsvariabler (`visReserve`/`visUteAvDrift`,
`driverRingelisteVisReserve`/`driverRingelisteVisUteAvDrift`,
`dashVisReserve`/`dashVisUteAvDrift`), alle standard `false`, med
«✅ Vis reserve»/«✅ Vis ute av drift»-hurtigknapper. Gjelder IKKE «Har aktiv
sjåfør»-visningen — en reserve-/ute av drift-bil som faktisk kjøres akkurat
nå er relevant, ikke støy. (5) Faresonen på Kjøretøyprofilen (Marker ute av
drift / Slett bil) er ikke lenger en alltid-synlig rød boks, men en lukket-
som-standard akkordionrad «⚙️ Avanserte handlinger»
(`bilkortAccordionRow('avansert', …)`), fortsatt fullt funksjonell når
åpnet. Ingen Airtable-endring i noen av de fem delene. Testet direkte i
nettleser for sjåfør-delen (innloggingsfri); admin-delene (Kalender,
Biloversikt, Dashboard, Kjøretøyprofil) kun kodeverifisert — se egen
seksjon lenger ned. Før det: Prioritet 71.8 —
**fra sak til verkstedbestilling.** Sakskortets knapp i fasen «Under
oppfølging» er omdøpt fra «Registrer verkstedtime» til «📅 Bestill
verkstedtime» (samme `luc('calendar-days')`-ikon som før — kun teksten er
endret). Viktigere: `bestillVerkstedForSak()` setter nå `vtPrefillType` fra
en ny `sakTilVtType(sak)` (Service-sak → `'service'`, Dekk-sak →
`'dekkskift'`, alle andre → `'reparasjon'`) i stedet for et hardkodet
`'reparasjon'` uansett saktype — og `submitAddVT()` sin fallback for
sak-koblede skjema (som ikke viser noen type-velger) leser nå
`vtPrefillType` i stedet for en hardkodet streng. Dette retter en reell,
tidligere feil: en verkstedtime bestilt fra en Service-sak ble ALDRI
registrert med `type='service'`, og `fullforVerkstedbestilling()` sin
automatiske servicehistorikk-oppretting (Prioritet 71.5) kunne derfor aldri
utløses for sak-originerte service-besøk. Bil/Regnr/Sakstype/Beskrivelse var
allerede forhåndsutfylt fra før (uendret) — kun automatisk verkstedtype var
den reelle mangelen. EU-kontroll har bevisst ingen regel i `sakTilVtType()`:
EU-kontroll blir aldri en sak i dagens datamodell. Ingen Airtable-endring.
Se egen seksjon lenger ned. Før det: Prioritet 71.7 —
**ringeliste-opprydding.** Sjåførens 📞 Ringeliste (`renderDriverRingeliste()`)
har fått tre endringer: (i)-info-ikonet i toppen er fjernet (ingen
informasjon var lenger skjult bak det); standardvisningen ved åpning viser
nå KUN 🟢 Aktive sjåfører utvidet — 🟡 Ingen aktive sjåfører og 👔 Ledelse
starter lukket, og tilbakestilles til nettopp denne standarden hver gang
skjermen faktisk åpnes fra bunnmenyen (ikke husket fra forrige besøk); og
🚚 Home Delivery/🛟 Veihjelp-kontaktkortene ligger nå i en egen, fast
bunnseksjon (`.ringeliste-fixed-quick`, `position:fixed` rett over
sjåførens bunnmeny) som alltid er synlig, uavhengig av hvor langt brukeren
har scrollet i gruppelisten over. Ingen ny funksjonalitet, ingen endring i
selve dataene (`ringeliste-ekstra`, `v.telefon`) eller Airtable-skjemaet —
ren presentasjons-/tilstandsendring. Testet direkte i nettleser (sjåførmodus
er innloggingsfri) — se egen seksjon lenger ned. Før det: Prioritet 71.6 —
**verkstedopprydding og smartere filtrering.** Verkstedbesøk (både aktive
bestillinger og historikk-poster fra alle tre kilder — verkstedtimer,
servicehistorikk, dekkhistorikk) kan nå slettes med bekreftelsesdialog, ny
delt `deleteDekkhistorikk()` og dispatcher-funksjonen
`deleteVerkstedHistorikkPost()` i den frittstående Verkstedhistorikk-
skjermen. Verkstedtype velges nå med én, horisontal, gjensidig utelukkende
velger (`VT_TYPE_VELGER`: EU-kontroll/Service/Dekkskift/Ruteskift/
Reparasjon) i «Ny verkstedtime»-skjemaet — erstatter de to uavhengige
avkrysningsboksene fra Prioritet 46/61/62, og retter i samme slengen et
eksisterende avvik der Ruteskift-/EU-kontroll-bestillinger ofte endte
udifferensiert som «Reparasjon» i historikken siden forhåndskryssingen av
boksene aldri faktisk virket (`vtEuForhandskrysset`/
`vtRuteskiftForhandskrysset` ble aldri satt `true` noe sted i koden).
Varslingssenteret viser nå kategoriene horisontalt som faner
(gjenbruker `.profil-tabs`/`.profil-tab`) med loggen for valgt kategori
vist vertikalt under, i stedet for alle åtte kategorier stablet samtidig.
Biloversikt åpnes nå alltid ufiltrert fra generell navigasjon (sidebar/
drawer/mobil bunnmeny — ny delt `resetRegisterFiltre()`), med to nye
hurtigfilterknapper «✅ Kontrollert»/«⚠️ Ikke kontrollert» som leser/skriver
samme `filterKontrollStatus` som det eksisterende nedtrekksfilteret — ingen
av de fire eksisterende filtrene (kategori/bil/status/løyvenummer) er
fjernet eller endret. Ingen nye Airtable-felt, ingen `LIST_TABLES`-endring —
`storage.airtable.js` er uendret. Se egen seksjon lenger ned for full
detalj, designvalg og kjente begrensninger. Før det: Prioritet 71.5 —
**opprydding saksmotor og ny operativ bilprofil.** Den gamle 4-stegs
saksveiviseren («Avansert redigering» / «Vurder sak» / «Fortsett saken» /
«Slett saken») er fjernet i sin helhet — saksbehandling skjer nå
UTELUKKENDE gjennom Godta/Avslå/Registrer verksted/Utført uten
verkstedbesøk, ingen alternativ arbeidsflyt. Fullføres en verkstedtime av
typen 'service' (Verksted → «✅ Utført arbeid»), oppdateres bilen nå
AUTOMATISK: en servicehistorikk-oppføring opprettes (kilometerstand fra
`v.km`, som allerede er live-oppdatert fra siste sjåførkontroll — ingen
manuell registrering), og krysses «🛟 Mobilitetsgaranti inkludert i denne
servicen» av i skjemaet, forlenges mobilitetsgarantien automatisk 12
måneder fra denne datoen (nytt felt `WorkshopAppointments.
MobilitetsgarantiAktivert`, videreført til `servicehistorikk` sitt
`mobilitetsgarantiAktivert` — se AIRTABLE_MIGRATION.md, krever en ny
Airtable-kolonne før bruk). Kjøretøyprofilen har fått en ny operativ
toppseksjon (`.profil-stat5`, fem kort: Km-stand, Sist service, EU-kontroll,
Mobilitetsgaranti, Aktiv sjåfør) rett under identitetslinjen, Kjøretøydetaljer
er komprimert til seks horisontale label:verdi-rader (Reg.nr, Løyvenummer,
Driftslag, Drivstoff, Årsmodell, Telefon — `.detalj-grid`/`.detalj-rad`,
Kategori/Bilgruppe/Merke-modell/Biltype er bevisst fjernet fra denne
seksjonen siden ticket-kravet ikke nevnte dem), en ny «📋 Verkstedhistorikk»-
fane er lagt til (samme tre kilder som den frittstående Verkstedhistorikk-
skjermen, kun forhåndsfiltrert på kjøretøyet — se `samletVerkstedHistorikkAlle()`),
og Historikk-fanens gamle Tidslinje/Nøkkeltall/Kontroller-understruktur er
erstattet med Kontroller/Skader/Kommentarer/Varsellamper (Skader gjenbruker
`skadeBody`, som tidligere var reell, men UNÅBAR dødkode bak en fane
`PROFIL_FANER` aldri inneholdt — se egen seksjon lenger ned og
CHANGELOG.md, Prioritet 71.5, for full detalj, kartlegging og kjente
begrensninger (bl.a. at sakbasert kostnadsregistrering — estimert/faktisk
kostnad, avsetting — ikke lenger kan settes noe sted, siden det kun skjedde
i den fjernede veiviserens Steg 4)). Før det: Prioritet 71.4 —
**delvis reversering av Prioritet 71.2:** Aktive saker er igjen gruppert per
kjøretøy (flat, ugruppert liste er IKKE lenger gjeldende — se advarsel i
CHANGELOG.md, Prioritet 71.4), med en ny «Nyeste: {problem} • {dato}»-linje i
gruppeoverskriften. «Vis alle saker» viser nå bilens saker HORISONTALT side om
side (`.sak-horisontal-rad`, `overflow-x:auto`) i smale kort uten
bilnavn/regnr (kun sakstype som overskrift, bilde som liten miniatyr øverst
til høyre, Godta/Avslå stablet nederst). «Avansert redigering» åpner
veiviseren i full bredde RETT UNDER hele raden, ikke inni et enkelt smalt
kort. Se egen seksjon lenger ned og CHANGELOG.md for full detalj. Før det:
Prioritet 71.3 —
sjåførens 📞 Ringeliste er redesignet etter et referansebilde: tre kollapsbare
grupper (🟢 Aktive sjåfører / 🟡 Ingen aktive sjåfører / 👔 Ledelse) pluss faste
🚚 Home Delivery/🛟 Veihjelp-kontaktkort. Ny, frittstående Settings-blob
`ringeliste-ekstra` dekker Ledelse/Home Delivery/Veihjelp (kontakter uten et
kjøretøy) — `v.telefon` er uendret. Innstillinger sin Ringeliste-seksjon er
omgjort fra én lang, usortert kjøretøyliste til nestede grupper (Home
Delivery/Veihjelp/Ledelse + kjøretøytelefon gruppert LIVE etter
`bilkategorier`, ikke hardkodede kategorinavn). Se egen seksjon lenger ned og
CHANGELOG.md for full detalj. Før det: Prioritet 71.2 —
Aktive saker er nå en FLAT, nyeste-først liste igjen (ingen bilgruppering/
«Vis alle saker»-utvidelse), sakskortet viser hele saken i én ny venstre/
høyre-layout uten duplisert bilnavn/regnr/dato/sakstype, ny «✅ Utført uten
verkstedbesøk» på saker under oppfølging, «✏️ Avansert redigering» virker
igjen (var utilsiktet død kode), «Slitte bremser» lagt til som
kontrollavvik, Kommentaroversikt har fått et kjøretøyfilter, og
tilbakepilen på sjåførens «Velg bil»-skjerm er fjernet helt (ikke bare
deaktivert) før dagens første kontroll. Se egen seksjon lenger ned og
CHANGELOG.md for full detalj. Før det: Prioritet 71.1 —
`migrerLegacySkaderTilSaker()` var ved en feil deklarert NESTET inne i
`registrerAvvikSomSak()` og dermed usynlig for `loadAll()` sitt toppnivå-kall,
som kastet en stille, fanget `ReferenceError` på hver eneste app-oppstart
siden feilen ble introdusert — konsekvens: Prioritet 70.2 sin idempotente
skade→sak-migrering har i praksis aldri kjørt før nå. Flyttet til toppnivå,
uendret logikk. Se CHANGELOG.md, Prioritet 71.1, for full detalj — inkludert
et viktig testnotat: verifisering i en ekte nettleser mot produksjonsbasen
(uten den vanlige `window.storage.set()`-no-op-patchen) fikk migreringen til
faktisk å opprette 5 nye rader (`SAK-0034`–`SAK-0038`) i produksjons-
`AktiveSaker`, som bruker ba fjernet igjen.). Før det: Prioritet 71 —
«Påminnelser» erstattet med samlet 🔔 Varslingssenter, «Kommende frister»
fjernet fra mobil-Dashboard, varsler kan markes som sett med automatisk
gjenoppdukking etter 48 timer, og en reell regresjon i sveip-tilbake
(Verkstedhistorikk/Kalender/Bestill/Kommentarer manglet i hviteliste) rettet.
Se egen seksjon lenger ned. Før det: Prioritet 70.7 —
kompakte sakskort viser all nødvendig saksinformasjon direkte uten
«Mer informasjon». Før det: Prioritet 70.6 —
forenklet oppstartsskjerm med Bilpark-logo som eneste merkevareelement,
tilfeldig HMS-melding og samlet ikonreferanse. Før det: Prioritet 70.5 —
Bilpark-branding og tilfeldig HMS-påminnelse på sjåførsiden. Før det:
Prioritet 70.4 —
duplikatgjengivelse i Aktive saker fjernet; én bil rendres én gang per seksjon
med samlet ekspansjon. Før det: Prioritet 70.3 —
Avansert visning er fjernet; Aktive saker bruker kun dagens gruppering per bil.
Før det: Prioritet 70.2 —
opprydding etter Verksted-migrering: utført arbeid flyttes til samlet
Verkstedhistorikk, Verksted viser ikke kostnadssummer eller «Neste
verkstedtime», aktive saker grupperes per bil, og eldre skader migreres
idempotent til dagens saksmodell uten sletting av originaldata). Før det:
Prioritet 70 — samlet Verksted og Verkstedhistorikk. Før det:
Prioritet 69.3 — sjåførkontrollen åpnet igjen etter at midlertidig
vedlikeholdssperre ble fjernet; tvungen versjonskontroll er beholdt. Før det:
Prioritet 48.1 —
kontrastfeil på «Registrer varsellampe»/«Registrer avvik» funnet og rettet:
`.chip`/`.chip-text` manglet eksplisitt tekstfarge og falt tilbake på
nettleserens standard knappefarge i stedet for appens `--ink`-token). Før det:
Prioritet 48 — premium-polish av sjåførside, implementert direkte i faktisk
prosjektkode: nytt linjeikonsystem, restylet Min Bil/Velg Bil etter godkjent
referansebilde, ren visuell finpuss uten endring av navigasjon/funksjonalitet/
Airtable. Før det igjen:
Prioritet 47, Del 2, redefinert av bruker — sjåførens bunnmeny 🚐 Min Bil ·
📞 Ringeliste · 💬 Kommentarer · ☰ Mer, Ringeliste flyttet ut av Min Bil,
Kommentarer viser Del 1 sin «📨 Nye kommentarer»-logg. Før det: Prioritet 47,
Del 1 — fjernet «Andre kontrollavvik» fra valgbare lister, ny «📨 Nye
kommentarer»-seksjon i Aktive saker, bestillingstjenester samlet på én rad.
Før det igjen: Prioritet 46 — Rapporter (full historikk ved bilfiltrering),
Carglass Ruteskift-hurtigknapp, ny 💥 Ruteglassrapport, Verkstedtime 2.0,
telefonnummer i Kjøretøyprofil.
**Ved avvik mellom denne filen og koden er koden alltid sannheten.**

⚠️ **Fortsatt uavklart, ikke løst av Del 2-redefineringen under:** de
opprinnelige referansebildene av sjåførmodus (bunnmeny «Min Bil · Velg bil ·
Oppgaver · Mer» + kortbasert Min Bil med undertekster som «Sjekk ut bilen og
start kjøring») stemte ikke med koden i dette Claude-prosjektet — se
PRIORITET_47_ANALYSE.md, punkt 0. Bruker har IKKE lastet opp den faktiske,
kjørende `index.html`. I stedet ga bruker en ny, eksplisitt og fullstendig
spesifisert bunnmeny-struktur (se Prioritet 47, Del 2 under) som bevisst
gjenbruker eksisterende funksjonalitet i stedet for å gjenskape
referansebildet — dette er IKKE et forsøk på å løse kode-/live-avviket, kun
en alternativ, uavhengig løsning bruker selv valgte. **«Sjekk ut bil»-teksten
(opprinnelig PRIORITET 47, Del 2, punkt 3) er FORTSATT ikke vurdert/endret**
— det var aldri del av brukerens nye spesifikasjon, og påstanden om at
teksten er feil kunne uansett ikke bekreftes mot koden (se punkt 0).

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

**Prioritet 48.1 (2026-09-10) — Kontrastfeil på «Registrer varsellampe»/
«Registrer avvik» funnet og rettet.** Bruker oppdaget, rett etter levering av
Prioritet 48, at teksten i disse to handlingskortene så «nesten svart ut mot
mørk bakgrunn», i motsetning til de tre andre kortene. Kartlegging (kodeverifisert):
selve korttitlene (`.p48-action-title`/`.p48-action-sub`) var allerede korrekte
og identiske for alle fem kort — feilen lå i `.chip`/`.chip-text`
(varsellampe-/avvikstype-velgeren inne i disse to kortenes utvidede panel,
den ENESTE komponenten disse to kortene har som de tre andre ikke har). Denne
knappen manglet en eksplisitt `color`-egenskap, i motsetning til alle andre
tekstkomponenter i designsystemet, og kunne derfor falle tilbake på
nettleserens egen standard knappefarge i stedet for appens `--ink`-token.
Rettet med to nye `color:var(--ink)`-linjer (på `.chip` og `.chip-text`) —
gjelder automatisk alle tilstander (normal/valgt/hover/aktiv/fokus), siden
ingen av dem overstyrer `color` fra før (bortsett fra den allerede korrekte,
mer spesifikke grønne fargen for «allerede aktiv»-chips, som er uendret).
Verifisert med målrettede skjermbilder av begge paneler i mørk og lys modus,
pluss hele den 25-punkts regresjonstesten og 8-punkts responsivitetstesten
fra Prioritet 48 kjørt på nytt (alle fortsatt bestått). `CACHE_VERSION` i
`sw.js` økt til `bilpark-v46`. Se PRIORITET_48_ANALYSE.md, kapittel 8, for
full detalj.

**Prioritet 48 (2026-09-10) — Siste premium-polish av Sjåførside (ren visuell
finpuss, implementert direkte i faktisk prosjektkode).** Etter at Prioritet
47 Del 2 sin bunnmeny-struktur var på plass, ba bruker om én siste
premium-polish av hele sjåførmodus mot de samme to referansebildene som lå
til grunn for Prioritet 47 (Min Bil / Velg bil) — denne gangen eksplisitt
avgrenset til presentasjon: **«Ikke endre funksjonalitet. Ikke endre
navigasjon. Ikke flytt innhold. Ikke legg til eller fjern funksjoner. Ikke
endre Airtable. Ikke endre Aktiv sjåfør-, kontroll- eller
kilometerlogikk.»** Prosessen fulgte tre runder: (1) avvik mellom
referansebilde og daværende kode kartlagt og godkjent, (2) mockup bygget og
godkjent, (3) denne runden — direkte implementering i den ekte `index.html`,
verifisert med Playwright-simulering mot faktisk kjørende kode (ikke bare
kodelesing) før levering.

**Løsning (full detalj i PRIORITET_48_ANALYSE.md):**
1. **Nytt linjeikonsystem** — `sjaforIkonSvg(navn, storrelse)`, en ny,
   håndtegnet SVG-ikonfunksjon (14 ikoner: `car`, `phone`, `chat`, `menu`,
   `calendar`, `gauge`, `folder`, `wrench`, `plus`, `alert`, `user`,
   `logout`, `chevronRight`, `chevronLeft`), erstatter emoji nøyaktig der
   **(HISTORISK — se Prioritet 58: de håndtegnede SVG-ene er fjernet.
   `sjaforIkonSvg()` finnes fortsatt, med samme navn/signatur/nøkler, men
   returnerer nå Lucide via `P48_LUCIDE`. Alle 12 kallesteder er uendret.)**
   bestillingen listet det: bunnmeny, nøkkeltallene på Min Bil, alle
   handlingskort, Sjekk ut bil. Varsellampe-/avvikschips, `HOVEDSTATUS_IKON`
   og kontrollert-pillens ✅/⚪ er BEVISST urørt (ikke del av den eksplisitte
   listen, delt med administrasjonsdelen).
2. **Ingen parallelt designsystem** — ett nytt tonepar, `--teal`/`--teal-soft`
   (samme mønster som `--purple`, Prioritet 38), lagt til utelukkende for å
   gi CURBSIDE en egen farge adskilt fra LAG 3. Alt annet (radius, skygger,
   spacing, typografi) gjenbruker Desktop/Mobil 4.1 sine eksisterende tokens
   uendret.
3. **Min Bil:** ny, større avatarflate for sjåføridentitet; kjøretøykortet
   fikk et ekte 2×2-nøkkeltallsgrid med lik ikonstørrelse, større/skarpere
   skilt (`.plate.p48-plate-lg`), og egen statuslinje adskilt fra
   nøkkeltallene. Alle fem handlingskort (skade/varsellampe/avvik/kontakt/
   ny sjåfør) fikk samme kortstil (ikonflate/tittel/undertekst/pil) — ingen
   kort fjernet, ingen handling endret, samme `id`-er som før. «Sjekk ut
   bil» fikk eksakt teksten **«Sjekk ut bil» / «Avslutt arbeidsdagen og
   frigjør bilen»** (ikke «Sjekk ut bilen og start kjøring») med en
   kontrollert rødaksent (kant, ikke heldekket flate).
4. **Velg Bil:** ny tilbakepil — funksjonell (går til Min Bil) kun når en
   aktiv biløkt faktisk finnes å returnere til, ellers vist deaktivert
   (samme betingelse `loadAll()` selv bruker for startskjerm-routing; en
   bevisst, dokumentert tolkning siden bestillingen selv ikke definerte
   pilens mål uten biløkt). Driftslag-gruppenes bilkort bruker samme
   skilt-komponent som Min Bil, med kontrollstatus-pille, klokkeslett og
   navigasjonspil. LAG 3/CURBSIDE har nå distinkte fargeprikker
   (`P48_DRIFTSLAG_FARGE`), og en åpen gruppe skiller seg visuelt fra
   lukkede via en scoped inline-stil i selve rendringsfunksjonen (de delte
   CSS-klassene `.dash-group-card`/`.group-card-head`, brukt bredt i
   Biloversikt/Rapporter/Analyse, er IKKE rørt på klassenivå).
5. **Delt komponent, bevisst gjenbruk:** `renderDriftslagGruppertBilvalg()`
   brukes av BÅDE Velg Bil og administrasjonens «Bytt bil»-fallback i den
   delte `renderKontroll()` — restylingen gjelder derfor begge steder, i
   tråd med «ikke dupliser eksisterende funksjoner», ikke en utilsiktet
   bivirkning.
6. `CACHE_VERSION` i `sw.js` økt til `bilpark-v45` (app-shell-innhold
   endret betydelig). `storage.airtable.js` er IKKE endret — ingen nye
   Airtable-felt, ingen `LIST_TABLES`-endring — `versjon`/`?v=` uendret på
   `v2.11.0`.

**Testet (se PRIORITET_48_ANALYSE.md for full detalj):** `node --check` på
begge script-blokkene (OK), `diff index.html kontroll.html` (identiske), en
25-punkts Playwright-regresjonstest kjørt mot den faktisk implementerte
koden med mock-Airtable (25/25 bestått — Velg bil, navnedialog,
kontrollregistrering, automatisk Min Bil-åpning, aktiv sjåfør, ny sjåfør,
ringeliste, kommentarer, registrer skade/varsellampe/avvik, sjekk ut bil,
kilometerstand fra kontroll, biler i drift, tilbakefunksjon, bunnmeny, lys
og mørk modus), og en responsivitetstest ved 320/360/390/430 px (8/8
bestått — ingen horisontal scroll, ingen skilt/pille-kollisjon, bunnmeny
dekker ikke innhold). Ni skjermer rendret og visuelt kontrollert mot
referansebildet.

**Kjente, dokumenterte gjenstående visuelle avvik (ikke skjult, se
PRIORITET_48_ANALYSE.md punkt 2):** skiltets font er appens eksisterende
delte `.plate`-komponent, ikke en ekte skiltfont; avataravataret bruker
samme generiske linjeikon som resten av ikonsettet fremfor et unikt
avatarikon; handlingskortenes ikonflate-farger og Sjekk ut bil sin
rødaksent-tone er tilnærmet, ikke pikselmålt mot referansebildet. Ingen av
disse påvirker funksjon, lesbarhet eller designprinsippene.

**Ikke rørt:** Aktiv sjåfør-logikk, Kontrolllogikk (`submitKontroll()`),
Kilometerlogikk (`v.km`-skriveregler), Saker/saksmotoren,
`storage.airtable.js`, `LIST_TABLES`/Airtable-skjema, `driverScreen`-
tilstandsmaskinen, antall/rekkefølge på bunnmeny og handlingskort,
administrasjonens øvrige skjermer (utover den delte bilvalg-restylingen
nevnt i punkt 5 over).

**Prioritet 47, Del 2 (2026-09-10, redefinert av bruker) — Sjåførside
bunnmeny.** Etter at Del 1 (under) var levert, ba bruker om en NY, eksplisitt
spesifisert bunnmeny for sjåførmodus — en bevisst forenkling av det
opprinnelige referansebildet, IKKE et forsøk på å gjenskape det. Bruker var
tydelig: «Jeg ønsker ikke at vi introduserer nye funksjoner på sjåførsiden
dersom vi kan gjenbruke det som allerede finnes.» Dette er derfor en ren
omorganisering av eksisterende skjermer/funksjoner, ikke ny logikk.

**Løsning:**
1. **`DRIVER_BUNNMENY`** — ny, egen bunnmeny KUN for sjåførmodus (adskilt fra
   administrasjonens `MOBIL_BUNNMENY`, som bruker `screen`/`goTo()`/
   `openDrawer()`; sjåførmodus har sin egen, atskilte navigasjonstilstand
   `driverScreen`). Fire punkter: 🚐 Min Bil · 📞 Ringeliste ·
   💬 Kommentarer · ☰ Mer. Vises på ALLE sjåførskjermer (også Velg bil/
   Kontroll/Allerede kontrollert), slik at Ringeliste og Kommentarer er
   tilgjengelige uansett hvor i flyten sjåføren er — «på den måten er den
   alltid tilgjengelig», som bruker formulerte det for Ringeliste spesifikt.
   Gjenbruker `.p41-bunn` sin CSS (fast bunnplassering/farger/padding) med
   én ny modifier-klasse (`.p41-bunn-4`) for fire i stedet for fem kolonner.
2. **📞 Ringeliste flyttet UT av Min Bil**, til en egen skjerm
   (`renderDriverRingeliste()`) nådd direkte fra bunnmenyen — ikke lenger et
   Min Bil-kort. Fjernet fra `DASHBOARD_LAYOUT_FLATER.minbil.komponenter`
   (Layout Editor sin Min Bil-liste); `getLayoutFlate()` sin eksisterende
   fremtidssikring forkaster automatisk `'ringeliste'` fra enhver tidligere
   lagret Min Bil-layout — ingen egen migrering var nødvendig. Selve
   innholdet (andre kjøretøy med registrert telefonnummer, `tel:`-lenker) er
   UENDRET — kun flyttet, ikke omskrevet. Ingen dobbel plassering: knappen/
   panelet er fjernet fra Min Bil sin `komponentHtml`.
3. **💬 Kommentarer erstatter det opprinnelige, ikke-eksisterende
   «📋 Oppgaver»-forslaget.** Viser nøyaktig den samme «📨 Nye
   kommentarer»-logikken fra Del 1 (`nyeKommentarerListe()`), alltid utvidet
   (ingen skjul/vis-toggle, siden dette nå er skjermens eneste formål).
   Radmarkupen er skilt ut i en delt funksjon, **`nyeKommentarRadHtml(k,
   isFirst)`**, brukt av BÅDE Aktive saker sin ekspanderbare seksjon og denne
   nye sjåførskjermen — samme kode, ingen duplisert markup. Fortsatt ingen
   ny Airtable-struktur, ingen kobling til saksmotoren, ingen lest/kvittert-
   tilstand — ren informasjonslogg, slik bruker presiserte.
4. **☰ Mer** er bevisst holdt minimal: viser kun «🔁 Bytt bil», som
   gjenbruker EKSAKT samme tilbakestillingslogikk som allerede fantes to
   andre steder (kt-back-knappen i Kontroll-skjemaet i sjåførmodus, og
   «← Velg en annen bil» i Allerede kontrollert-skjermen) — ingen ny
   funksjon. Selve bilbyttet går gjennom den eksisterende kryss-bil-
   utsjekkingslogikken (`startBilokt()`/`settAktivSjafor()`), siden sjåføren
   uansett velger bil og bekrefter navn på nytt.
5. `CACHE_VERSION` i `sw.js` økt til `bilpark-v44` (app-shell-innhold
   endret). `storage.airtable.js` er IKKE endret — ingen nye Airtable-felt,
   ingen `LIST_TABLES`-endring.

**Testet:** `node --check` på begge script-blokkene — ingen syntaksfeil.
Isolert Node.js-simulering av bunnmeny-navigasjon (alle fire punkter
navigerer korrekt til riktig `driverScreen`), Ringeliste sin egen-bil-
ekskludering (ekskluderer aktiv bil når satt, viser alle når ingen aktiv bil
finnes ennå), og at `nyeKommentarRadHtml()` gir identisk markup uansett
hvilken skjerm som kaller den — alle bestått. `diff index.html
kontroll.html`: bekreftet identiske. Kun statisk/isolert testet.

**Ikke rørt:** «Sjekk ut bil»-knappen/-teksten i Min Bil (uendret, urørt av
denne redefineringen — se advarselen øverst i denne filen), Sjåførkontroll
(`submitKontroll()`), Aktiv sjåfør-logikk, `v.km`-skriveregler,
`storage.airtable.js`, administrasjonens `MOBIL_BUNNMENY`/drawer (helt
uendret og atskilt fra `DRIVER_BUNNMENY`), Bilkategorier, Layout Editor sin
mekanikk for øvrig (kun `minbil`-komponentlisten er redusert med én).

**Prioritet 47, Del 1 (2026-09-10) — Sjåførside 2.0 / Dashboard-komprimering:
kommentarhåndtering og bestillingsrad.** Bestilt som en todeling: Del 1
(kartlagt og implementert her) og Del 2 (opprinnelig bunnmeny/Ringeliste/
Oppgaver/"Sjekk ut bil"-tekst i sjåførmodus, basert på referansebilder som
ikke stemte med koden — se advarselen øverst i denne filen). **Del 2 ble
senere redefinert av bruker og implementert med en annen, eksplisitt
spesifisert bunnmeny — se Prioritet 47, Del 2 over.** «Sjekk ut bil»-teksten
er fortsatt ikke endret.

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
   pillerad for kontroll, varsellamper og skader). **Prioritet 64 komprimerte
   kortet:** skiltkomponenten og radene Løyvenummer / Status / Aktiv sjåfør er
   erstattet av statusprikk i tittellinjen + to infolinjer («Modell • Regnr» og
   «Løyve • Km»), og Aktiv sjåfør er flyttet ned i pilleraden. Løyvenummer er
   fortsatt synlig uten ekstra klikk. Statusfargen bruker `vehicleHovedstatus()` +
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

> ⚠️ **Helt avløst av Prioritet 60 (2026-09-21):** `DASHBOARD_LAYOUT_FLATER`/`getLayoutFlate()`/`dashboard-layout` finnes ikke lenger
> som mekanisme (kun lest ved migrering). Dette avsnittet er historikk. Se «Prioritet 60 (2026-09-21)» nederst.

> ⚠️ **Delvis avløst av Prioritet 58 (2026-09-19):** opp/ned-modellen gjelder nå KUN Mobil Dashboard og Min Bil.
> Desktop Dashboard har egen rutenett-editor (`dashboard-layout-v1`); `DESKTOP_LAYOUT_KOLONNER`,
> `layoutFlateSynligeNokler()` og `DASHBOARD_LAYOUT_FLATER.desktop` er fjernet. Se «Prioritet 58 (2026-09-19)» nederst.

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
  offline-fallback (`CACHE_VERSION = 'bilpark-v44'`, Prioritet 47 Del 2). To
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
  `airtable.storage.js`) finnes som egne filer. **Prioritet 62.0: heller ikke
  i kommentar- eller grensesnittekst lenger** — de fire siste forekomstene av
  understrek-varianten er sanert, og prosjektet har nå nøyaktig ett gyldig
  filnavn overalt. Siden
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
- Varslingssenter (Prioritet 71 — erstatter «Påminnelser»; samler nye kommentarer,
  km-grense passert, service/EU-kontroll som nærmer seg, verkstedoppfølging, nye
  skader, varsellamper og forfalt saksoppfølging ett sted, se egen seksjon under)
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

> ⚠️ **Delvis avløst av Prioritet 59 (2026-09-20):** fanene Oversikt/Historikk/Dekk/Kostnader (og Verkstedhistorikk som
> egen fane, Prioritet 71.5) finnes ikke lenger. Profilen har nå statusraden Kilometerstand · Siste service · EU-kontroll ·
> Mobilitetsgaranti · Løftebord, og nederst én seksjon «Historikk» med fem faner. Se «Prioritet 59 (2026-09-20)» nederst.

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
  - `godtaKmEndring()` — **nytt i Prioritet 71.10:** driftskoordinatorens
    godkjenning av et tidligere bekreftet storthopp (se «Prioritet 71.10»
    lenger ned). Skriver `v.km = kontrollens registrerte km` KUN når
    administrator eksplisitt trykker «✅ Godta endring» i 🔔 Varslingssenteret
    — aldri automatisk. `avslaKmEndring()` skriver ALDRI `v.km` (kun et
    sporbart avslag på selve kontrollen, se samme seksjon).
  - Ingen andre steder i koden skriver til `v.km` — verifisert ved
    kodegjennomgang i Prioritet 29-revisjonen, og re-verifisert (uttømmende
    `grep`-basert kartlegging) i Prioritet 43 uten å finne noen femte,
    udokumentert skrivevei (Prioritet 71.10 la senere til den femte,
    dokumenterte skriveveien over).
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
- **Nytt i Prioritet 50: `kontroller[]` (DriverChecks) er det eneste
  datagrunnlaget for `isKontrollertIdag()`/`vehicleKontroller()`/
  `lastKontrollForVehicle()` — enhver fremtidig funksjon som pusher nye rader
  inn i `kontroller[]` uten et ekte kilometer-/varsellampe-/skadefelt vil
  forurense Kontrollflyt-statusen og kilometerhistorikken. Fristilte
  kommentarer (Prioritet 50) lagres derfor bevisst i en HELT SEPARAT liste
  (`kommentarer[]`, egen Settings-blob) — se punktet under.

## Prioritet 50 (2026-09-10) — Kommentarer 2.0

Bestilling: kommentarer skal være bilspesifikke (ikke flåtebrede) for
sjåfører, Dashboard-sidemeny skal vise `💬 Kommentarer (x)` med uleste-teller,
en dedikert Kommentaroversikt for administrator, og en fristilt
«💬 Legg til kommentar»-funksjon under ☰ Mer knyttet til sjåførens aktive bil.
IKKE ENDRE: Aktiv sjåfør, Kontrollflyt, Kilometerlogikk, Skader, Varsellamper,
Biler i drift — alle bekreftet urørt (se simuleringsharness og diff-
verifisering i PRIORITET_50_ANALYSE.md).

**Kartlegging (før implementering) — funnet, IKKE antatt:**
1. Kommentarer var IKKE en egen entitet — kun fritekstfeltet `kommentar` på
   hver sjåførkontroll (`kontroller[]`/DriverChecks), satt via
   `kontrollFormKommentar` i den ordinære kontrollflyten.
2. Biltilknytning fantes allerede (`k.vehicleId` på hver kontroll) — dette
   var ALDRI feilen.
3. **Rotårsak til kritisk feil (sjåfør så hele flåtens kommentarer):**
   `renderDriverKommentarer()` kalte `nyeKommentarerListe()` uten noe
   `vehicleId`-filter, selv om sjåførens aktive bil (`driverVelgBilId`)
   allerede var tilgjengelig i sesjonen. Ren visningslogikk-feil — dataene
   var allerede korrekt bilspesifikke.
4. «💬 Legg til kommentar» under ☰ Mer fantes IKKE i kildekoden (kun en
   likelydende knapp inne i administrators saksveiviser, en annen funksjon).
   Måtte bygges fra bunnen — se arkitekturvalg under.

**Arkitekturvalg (avklart med bruker før implementering):** en fristilt
kommentar (uten full kontroll) kunne enten (A) gjenbrukt `kontroller[]`
direkte, eller (B) lagres i en helt ny, separat liste. Bruker bekreftet (B)
etter at (A) ble flagget som risikofylt: `kontroller[]` er lese-kilden for
`isKontrollertIdag()`/kilometerhistorikk/flere rapport- og statistikkflater —
å presse inn kommentar-only-rader der ville krevd å touche mange kritiske
lesepunkter og risikert å forurense «kontrollert i dag»-status, stikk i strid
med IKKE ENDRE-listen.

**Løsning:**
- Ny liste `kommentarer[]` — fristilte sjåførkommentarer, lagret som egen
  JSON-blob i Settings-tabellen med samme trygge lasting/lagring
  (`parseJsonTrygt`, `_korrupteDatasett`-blokkering) som `servicehistorikk`.
  INGEN ny Airtable-tabell, INGEN kobling til `kontroller[]`.
  `{id, vehicleId, dato, tidspunkt, sjafor, tekst, lest}`.
- `nyeKommentarerListe(vehicleId)` utvidet: slår sammen kontroll-kommentarer
  (uendret kilde) og fristilte kommentarer (`kommentarer[]`), med et delt
  `lest`-felt per rad. `vehicleId` er nå et valgfritt filter.
- `renderDriverKommentarer()` sender nå inn `driverVelgBilId` — **retter den
  kritiske feilen**: sjåfør ser kun kommentarer for bilen vedkommende faktisk
  kjører.
- Administrator (Dashboard-sidemeny, ny Kommentaroversikt, Aktive
  saker-panelet, Rapporter) kaller fortsatt uten filter — ser hele flåten,
  slik det alltid har gjort.
- Nytt felt `kommentarLest` (boolsk) på `kontroller[]` for les-status på
  kontroll-kommentarer — registrert i `LIST_TABLES.kontroller.fields` i
  `storage.airtable.js` (feltregelen fulgt). Fristilte kommentarers
  `lest`-felt trenger ingen registrering (Settings-blob).
- Ny funksjon `markerKommentarSomLest(kilde, id)` — oppdaterer riktig kilde
  (`kontroller[]` eller `kommentarer[]`) avhengig av hvor kommentaren kom fra.
  Kun tilgjengelig i administrator-visninger (`visMarkerSomLest`-parameter på
  `nyeKommentarRadHtml()`) — sjåførens egen skjerm har ALDRI denne knappen,
  jf. bestillingens punkt 6 («Les-status skal være administrativ»).
- Ny administrator-skjerm `renderKommentaroversikt()` (screen
  `'kommentaroversikt'`): Dato/Bil/Sjåfør/Kommentar, nyeste først, «✅ Marker
  som lest» per rad. Gjenbruker `nyeKommentarerListe()`/`nyeKommentarRadHtml()`
  uendret — ingen egen datakilde.
- Sidemeny (`renderDrawer()`): nytt punkt `💬 Kommentarer (x)` (uleste-teller
  fra samme `nyeKommentarerListe()`), uten teller når alt er lest, jf.
  bestillingen. Plassert sammen med Aktive saker/Påminnelser.
- ☰ Mer (sjåfør, `renderDriverMer()`): ny knapp «💬 Legg til kommentar» → eget
  skjema (`renderDriverNyKommentar()`), lagrer en ny rad i `kommentarer[]`
  knyttet til `driverVelgBilId` og `driverNavn` fra sesjonen.

**Filer endret:** `index.html`, `storage.airtable.js` (nytt felt
`kommentarLest` + versjon v2.11.0 → v2.12.0), `index.html` sin `?v=`-referanse
oppdatert til 2.12.0, `sw.js` (`CACHE_VERSION` bilpark-v46 → bilpark-v47),
`kontroll.html` synkronisert som eksakt kopi av `index.html`.

**Verifisert URØRT (diff mot forrige versjon, ingen endring):**
`vehicleKontroller()`, `lastKontrollForVehicle()`, `isKontrollertIdag()`,
`submitKontroll()`, `settAktivSjafor()`, `vehicleHovedstatus()`,
`submitService()`. Se simuleringsharness for kjørte scenarier.

**Kjente begrensninger:**
- `kommentarer[]` er, som `servicehistorikk`, én JSON-blob i Settings — ikke
  live-synkronisert på tvers av enheter i sanntid (samme begrensning som
  servicehistorikk/planlagteservicer allerede har, siden `window.subscribeLiveSync()`
  kun poller `LIST_TABLES`-nøkler). En admin som har Kommentaroversikt åpen i
  lang tid ser ikke en helt fersk fristilt kommentar fra en annen enhet før
  neste fulle reload — konsistent med eksisterende mønster, ikke en ny
  svakhet introdusert her.
- Fristilte kommentarer har ingen slette-/redigeringsfunksjon i denne runden
  (kun «marker som lest»). Kan bygges som egen, avgrenset sak senere dersom
  ønsket.
- Kommentaroversikt har ingen filtrering på bil/periode i denne runden (flat,
  nyeste-først-liste) — vurder dette som fremtidig finpuss dersom
  kommentarvolumet vokser mye.

## Prioritet 51 (2026-09-11) — Ny saksflyt

Bestilling: Aktive Saker var blitt for tung, spesielt på mobil. Erstattet med
en sterkt forenklet, firenivås arbeidsflyt UTEN delstatuser, prosessveiviser
eller behandlingsfelt: **Aktiv sak → Under oppfølging → Planlagt verksted →
Utført/Historikk**, pluss en egen terminal-status «Avslått». Alle fire
hovedhandlinger er ett-klikks, ingen skjema. IKKE ENDRE: Aktiv sjåfør,
Kontrollflyt, Kilometerlogikk, Skader, Varsellamper, Biler i drift — alle
bekreftet urørt (diff mot forrige versjon, se simuleringsharness).

**Arkitekturvalg (avklart med bruker gjennom tre avklaringsrunder):**
1. Ny terminal-status `avslatt` (ett klikk, ingen felt) — vurdert mot å
   gjenbruke `lukket`+`resultat`-feltet, men det siste tvinger gjennom den
   gamle, obligatoriske Steg 4-veiviseren (resultat/sluttkommentar/utført
   dato), stikk i strid med bestillingen. `avslatt` er derfor en helt egen,
   uavhengig statusverdi.
2. De 4 gamle delstatusene (`vurderes`/`tiltak-planlagt`/`delvis-utfort`/
   `utfort-venter-bekreftelse`) og den gamle 4-stegs veiviseren er IKKE
   fjernet fra koden — kun ikke lenger DEFAULT-inngangen. Bruker bekreftet
   eksplisitt at ingen nye saker skal kunne havne i disse delstatusene igjen,
   men at eksisterende, historiske saker med disse verdiene fortsatt skal
   vises korrekt (se `sakFase()` under). Veiviseren er fortsatt nåbar via
   «✏️ Avansert redigering» — nødvendig fordi kostnadsregistrering
   (estimert/faktisk kostnad, avsetting) UTELUKKENDE skjer der, og
   Kostnadsoversikt er uendret avhengig av disse feltene.
3. Navigasjon: ÉN skjerm (Aktive saker) med tre faner, ikke tre separate
   skjermer/menypunkter.

**Løsning:**
- `sakErApen(s)` utvidet: `'utfort'` og `'avslatt'` regnes nå OGSÅ som
  lukket, ikke bare `'lukket'`. Bevisst atferdsendring (ikke en feil) — i den
  nye flyten ER "Arbeid utført" selve sluttpunktet, uten eget
  bekreftelsessteg. ALLE nedstrøms forbrukere (Dashboard,
  `vehicleHovedstatus()` via `vehicleAktiveSaker()`, Rapporter, Analyse,
  Verksted-filter) bruker allerede utelukkende `sakErApen()` — ingen av dem
  er selv rørt, alle arver riktig oppførsel automatisk.
- Ny `sakFase(s)`: rent visningsfilter som grupperer ENHVER status (gammel
  og ny) inn i `'aktiv'`/`'oppfolging'`/`'verksted'`/`null`. Gamle
  delstatuser havner i samme «Under oppfølging»-bøtte som den nye
  `'under-oppfolging'` — de betyr alle "sett og under behandling".
- Fire nye, ett-klikks funksjoner: `godtaSak()` (ny→under-oppfolging),
  `avslaSak()` (→avslatt, med bekreftelsesdialog), `markerSakUtfort()`
  (→utfort), `bestillVerkstedForSak()` (gjenbruker UENDRET
  `goToRegisterVT()`/`submitVT()` — sistnevnte satte allerede
  `sak.status = 'verksted-bestilt'` automatisk når en sak kobles til en
  verkstedtime, lenge før denne sprinten).
- `renderAktiveSaker()` skrevet om: tre faner øverst (med live tellere) og en
  ny, kompakt kortliste (`sakKompaktKortHtml()`/`sakFaneListeHtml()`) — kun
  bil/sakstype/dato + fasens ENE relevante handlingsknapp vises kollapset;
  detaljer/beskrivelse/«✏️ Avansert redigering» vises først ved trykk. Den
  gamle, fulle filter-/gruppevisningen (`sakGroupedSection()`, uendret) er
  bevart uendret bak en ny, valgfri «🔎 Avansert visning»-knapp — ingen
  funksjonalitet fjernet, kun ikke lenger standardvisningen.
- Dashboard (desktop og mobil): ny, delt komponent `sakFaseTellereHtml()`
  viser 🔴 Aktive saker / 🟡 Under oppfølging / 🔧 Planlagt verksted, alle
  fra samme kilde (`sakFase()`) som fanene i Aktive saker — garantert
  identisk tall. Hver knapp navigerer rett til riktig fane
  (`goToSakFane()`).
- `sakWizardStartSteg()` oppdatert til å bruke `sakErApen()` i stedet for
  `status === 'lukket'` direkte, slik at saker med de nye terminal-statusene
  også åpnes i lesemodus når de nås via «Avansert redigering».
- `deleteVT()` sin tilbakestilling ved sletting av en koblet verkstedtime
  endret fra den gamle delstatusen `'tiltak-planlagt'` til den nye
  `'under-oppfolging'` (samme fase via `sakFase()`, men bruker nå kun
  statusverdier den nye flyten selv produserer).
- `SAK_STATUS_ORDER`/`SAK_STATUS_LABEL` utvidet med `'under-oppfolging'` og
  `'avslatt'` (filtre/dropdowns app-wide viser nå disse korrekt).

**Filer endret:** `index.html`, `sw.js` (CACHE_VERSION bilpark-v47 →
bilpark-v48), `kontroll.html` synkronisert. **`storage.airtable.js` er IKKE
endret** — ingen nye Airtable-felt, kun nye verdier i det allerede
registrerte `status`-feltet.

**Verifisert URØRT (diff mot forrige versjon, ingen endring):**
`vehicleHovedstatus()`, `submitKontroll()`, `settAktivSjafor()`,
`submitService()`, `isKontrollertIdag()`, `vehicleKontroller()`,
`todayISO()`. Kostnadsoversikt bekreftet å ikke lese `status` i det hele
tatt — upåvirket.

**Kjente begrensninger:**
- Kompakte kort er en flat, nyeste-først-liste uten bil-gruppering (bevisst
  — fanene gjør listene korte nok til at akkordion-gruppering ikke lenger
  trengs som standard). Full gruppering fortsatt tilgjengelig i «Avansert
  visning». **Historisk — ikke lenger gjeldende.** Prioritet 70.3 gjorde
  per-bil-gruppering til standardvisningen igjen; Prioritet 71.2 fjernet den
  nok en gang; Prioritet 71.4 gjeninnførte den permanent (nå med horisontal
  visning ved «Vis alle saker»). Se CHANGELOG.md, Prioritet 71.4, for
  gjeldende oppførsel.
- «✏️ Avansert redigering» åpner fortsatt hele den gamle 4-stegs veiviseren
  (uendret) — dette er bevisst (kostnadsregistrering), men betyr at en bruker
  som går denne veien igjen kan sette en sak i en gammel delstatus
  (`vurderes` osv.) via veiviserens Steg 2/3. `sakFase()` håndterer dette
  korrekt (grupperes fortsatt riktig), men er verdt å være oppmerksom på.

---

## Prioritet 52 (2026-09-11) — Sakskort-sjekkliste, «Arbeid utført»-fullføring og fjerning av kommentarer fra Aktive saker

Fire samlet leverte deler (kartlagt og godkjent separat før implementering):

**Del 1 — Direkte sjekkliste på sakskortet.** Mål: forstå saken uten å åpne
den. Ny `sakAvvikChecklistHtml(s)` leser via den universelle
`sakAvvikListe(s)` (fungerer identisk for nye flerpunkts-saker og eldre
enkeltavvik-saker — ingen egen lesevei) og viser ☑ + ikon + etikett for hvert
varsellampe-/kontrollavvik-element DIREKTE i `sakKompaktKortHtml()`, ikke
gjemt bak «vis mer». «Annet» (kun varsellampe har fritekst) vises som
«Annet: {fritekst}» — kun når fritekst faktisk finnes, ellers bare «Annet»
(unngår «Annet: Annet»). Andre sakstyper (skade, manuelt "annet") er
uendret — sjekkliste vises kun for varsellampe/kontrollavvik, som bestilt.

**Del 2 — «✅ Arbeid utført» fullfører nå faktisk saken.** Tidligere satte
`markerSakUtfort()` KUN `status='utfort'` — saken ble usynlig i
Historikk/Rapporter/Analyse (som leser `resolvedAt`/`completedAt`, aldri
satt), varsellampen forble aktiv i `varsellys[]` (egen, persistent liste,
aldri kvittert), og flerpunkts-avvik forble `'aktiv'` i `sak.avvik[]`.
Skrevet om til å gjenbruke NØYAKTIG de samme feltene den avanserte
veiviseren (`submitSakWizardFullfor`) allerede setter ved lukking:
`resolvedAt`/`resolvedBy`/`completedAt`/`verkstedResultat` (standard
`'feil-utbedret'` for ett-klikks fullføring), samt å markere alle
gjenværende aktive avvik i `sak.avvik[]` som `'utfort'` og AUTOMATISK
kvittere tilhørende `varsellys[]`-poster (matching på vehicleId+type — trygt
og entydig siden ett aktivt varsellys-element per bil+type er garantert av
`submitKontroll()`). Ingen parallell lukkelogikk — samme felter, samme
konsekvens som den etablerte veiviseren alltid har gitt.

**Del 2b — rotårsak til at saker ble "hengende" i Under oppfølging.**
`vtPrefillSakId` (kobler ny verkstedtime til en sak) ble kun satt via
sakskortets egen «📅 Registrer verkstedtime»-knapp og den gamle veiviserens
Steg 3 — ALLE andre innganger (Verkstedoversikt sin generelle skjema,
hurtigbestilling fra Dashboard/Kjøretøyprofil, Min Bil) nullstilte den, og
saken nådde da aldri `'verksted-bestilt'`. `submitAddVT()` har fått en
fallback: finnes det NØYAKTIG én åpen sak i fasen "Under oppfølging" på
bilen når ingen eksplisitt sak er forhåndsvalgt, kobles den automatisk på
samme måte som om sakskort-knappen var brukt. Flere/ingen kandidater →
uendret oppførsel (ingen gjetting).

**Del 3 — Kommentarer fjernet fra Aktive saker.** `${nyeKommentarerSectionHtml()}`
og de to tilhørende lytterne (`nye-kommentarer-toggle-btn`,
`[data-marker-lest]`) fjernet fra `renderAktiveSaker()`/
`attachAktiveSakerListeners()`. Selve dataene (`kommentarer[]`,
`kontroller[].kommentar`), `nyeKommentarerListe()` og handlingen
`markerKommentarSomLest()` er UENDRET — nås fortsatt via 💬 Kommentarer i
sidemenyen og sjåførens egen kommentarskjerm. `nyeKommentarerSectionHtml()`
selv er ikke fjernet fra koden (ingen aktive kallsteder igjen, ufarlig).

**Del 4 — Kommentarer i sidemeny.** Allerede implementert (Prioritet 50) —
`💬 Kommentarer (n)` med ulest-teller ligger allerede i `renderDrawer()`.
Ingen endring nødvendig, kun bekreftet.

**KRITISK FELTRETTING oppdaget under verifisering (ikke en ny funksjon —
retter et eksisterende, stille datatap):** `sak.avvik[]` — selve
kjernedataen bak flerpunkts-saker siden Prioritet 12/51, og selve grunnlaget
Del 1 sin sjekkliste leser — var ALDRI registrert i `LIST_TABLES` i
`storage.airtable.js`. Feltet ble stille droppet av `toAirtableFields()` ved
hver lagring, og aldri gjenopprettet av `fromAirtableFields()` ved neste
innlasting — nøyaktig FELTREGEL-bruddet. Rettet: `avvik: ['Avvik', 'json']`
lagt til i `LIST_TABLES.aktiveSaker.fields`. **KREVER en ny kolonne "Avvik"
(long text) i AktiveSaker-tabellen i Airtable FØR disse filene tas i bruk —
uten den kolonnen vil skrivinger til dette feltet feile/ignoreres av
Airtable.** Se AIRTABLE_MIGRATION.md.

**Simulering:** Node.js-harness kjørt mot de FAKTISKE, uendrede ekstraherte
funksjonene (`sakAvvikListe`, `avvikTypeLabel`, `registrerKontrollAvvikSomSak`,
`sakAvvikChecklistHtml`, `sakFase`, `markerSakUtfort`) gjennom hele kjeden:
kontroll med varsellampe+kontrollavvik+"annet" → sjekkliste vises korrekt →
Godta → Under oppfølging → verkstedtime registrert UTENOM sakskortet
auto-kobles → Planlagt verksted → Arbeid utført → alle avvik utført,
varsellamper kvittert, saken lukket med `resolvedAt`/`completedAt`/
`verkstedResultat` satt. **17/17 assertions bestått.**

**Filer endret:** `index.html`, `storage.airtable.js` (v2.12.0 → v2.13.0 —
NYTT felt `avvik`, se feltrettingen over), `sw.js` (CACHE_VERSION
bilpark-v48 → bilpark-v49), `kontroll.html` synkronisert,
`AIRTABLE_MIGRATION.md` oppdatert.

**Kjente begrensninger:**
- Auto-kobling av verkstedtime (Del 2b) dekker kun det vanlige tilfellet
  (nøyaktig én åpen sak i "Under oppfølging" på bilen). Har bilen flere
  samtidige saker i den fasen, kreves fortsatt eksplisitt «📅 Registrer
  verkstedtime» fra riktig sakskort — ingen automatisk gjetting ved
  tvetydighet.
- «Arbeid utført» setter alltid `verkstedResultat='feil-utbedret'` som
  standard ved ett-klikks fullføring (kan endres i etterkant via «✏️
  Avansert redigering» ved behov) — konsistent med P51 sitt "ingen
  prosesssteg"-prinsipp.
- **Airtable-endring kreves før idriftsettelse:** ny kolonne "Avvik" (long
  text) i AktiveSaker-tabellen. Uten denne vil flerpunkts-sakers avvik-detaljer
  fortsette å forsvinne ved synk, og Del 1 sin sjekkliste vil se tom ut etter
  en reload (selv om den fungerer korrekt umiddelbart etter registrering, i
  samme økt).
- Layout Editor for sidemeny: KUN kartlagt (se eget notat), ikke
  implementert i denne leveransen.

---

## Prioritet 53 (2026-09-12) — Dashboard 5.0: operativ kontroll fremfor oversikt

**Nytt varig prinsipp:** Dashboard skal svare på "hva haster / er bilparken operativ /
hva må følges opp / hva kommer neste" — ikke duplisere informasjon som allerede finnes
et annet sted på siden eller på en annen skjerm. Før nye Dashboard-kort legges til: sjekk
om informasjonen allerede vises via `sakFaseTellereHtml()`, Kalender eller Biloversikt.

**Ny regel: Verkstedtime opprettes ikke lenger fritt fra Dashboardets Bestill
tjenester.** Verkstedtime skal være et resultat av saksflyten (Aktiv sak → Under
oppfølging → Verksted bestilles → Planlagt verksted), ikke en direkte hurtigbestilling
ved siden av Service/EU-kontroll/Dekkskifte/Ruteskift. Gjelder KUN Dashboardets eget
"➕ Bestill tjenester"-kort (`komponentHtml.bestill` i `renderDashboard()`) — mobil,
Kjøretøyprofil og den dedikerte "Bestill tjenester"-skjermen har fortsatt Verkstedtime
som direkte valg, og verkstedmodulen/eksisterende verkstedtimer er helt uendret.

**Arkitekturnotat:** `bilparkStatusInnholdHtml()` er bevisst DELT mellom mobil og
desktop (samme prinsipp som ellers i appen — ingen parallelle løsninger). En endring i
denne funksjonen slår derfor alltid igjennom på begge flater samtidig, uansett om
oppdraget som utløste endringen kun nevner én av dem. Vurder dette eksplisitt før neste
endring her.

Se CHANGELOG.md for full detalj, tolkningsvalg og kjente begrensninger (bl.a. at
mobildashbordets KPI-rad/Bestill tjenester bevisst IKKE ble forenklet i denne runden).

---

## Prioritet 54 (2026-09-12) — Kalender er eneste planleggingsflate

**Nytt varig prinsipp:** Det skal ikke finnes en egen "Planlegging"-skjerm ved siden av
Kalender. Alle fremtidige aktiviteter (service, dekkskift, EU-kontroll, verksted,
oppfølging) skal spores tilbake til Kalender — både månedsgriden og den underliggende
listevisningen (`planleggingSeksjonHtml()`, som leser `flatePlanleggingData()`).
Fremtidige endringer i "kommende aktiviteter"-logikk skal gjøres i disse to funksjonene,
ikke i en gjenopprettet, separat Planlegging-skjerm.

**Arkitekturmønster bekreftet:** Kalender oppretter/redigerer/sletter ALDRI noe selv —
den navigerer videre til den eksisterende, dedikerte skjermen som allerede eier den
aktuelle datatypen (Service, Dekk, Verkstedoversikt, Aktive saker). Dette er bevisst,
ikke en mangel — unngår duplisert skjema-/valideringslogikk. Behold dette mønsteret ved
videre arbeid på Kalender.

---

## Prioritet 55 (2026-09-12) — Lucide-ikoner: nytt varig mønster

**Nytt varig prinsipp:** Operative ikoner i Bilpark skal komme fra Lucide, ikke emoji
eller egendefinerte SVG-sett — bruk alltid den delte `luc(navn)`-hjelpefunksjonen, aldri
en ny, parallell ikonmekanisme. Statusfarger (🟢🟡🔴⚪) er unntatt — de forblir emoji og
er fortsatt PRIMÆR statuskommunikasjon; Lucide-ikoner er alltid sekundære/dekorative.

**Arkitekturvalg — ekstern CDN, ikke innbakt SVG:** Lucide lastes via
`https://unpkg.com/lucide@latest` i `<head>` (samme mønster som SheetJS/xlsx), med
`refreshLucideIcons()` kalt etter hver `render()`/`renderDriverShell()`/
`renderLoginShell()`. Dette var et bevisst valg fremfor å bake inn SVG-baneddata
direkte, fordi nettsøk ikke ga pålitelig nok kildedata til å garantere pikselnøyaktige
ikoner. **Kjent konsekvens:** ikoner vises ikke ved ekte offline bruk før nettleseren
selv har cachet scriptet — service workeren cacher bevisst kun samme-opprinnelse-filer
(uendret prinsipp). Vurder eksplisitt før flere kritiske UI-elementer gjøres avhengige
av dette; se CHANGELOG.md, Prioritet 55.

**Kun delvis standardisert:** Dashboard, Sidemeny, Bestill tjenester (Dashboard) og ni
navngitte sjåførmodus-funksjoner er konvertert. Resten av appens emoji er UENDRET —
dette var en eksplisitt avgrensning (oppdraget ga kun ikon-tabell for disse fire
seksjonene), ikke en forglemmelse. Ikke anta at "standardiseringen er ferdig" ved
fremtidig arbeid — sjekk CHANGELOG.md, Prioritet 55 for nøyaktig hva som gjenstår.

---

## Prioritet 56 (2026-09-12) — Kritisk regel for videre Lucide-migrering

**Sjekk ALLTID konsumentkonteksten før en emoji-til-Lucide-konvertering:** Ikke anta at
en verdi som "ser ut som et ikon" trygt kan bli en `luc()`-HTML-streng. Sjekk om verdien
noen gang passerer gjennom `esc()`, havner i et `<option>`-element, eller brukes av en
Excel/CSV-eksportfunksjon (`exportKostnadExcel`/`exportRapportExcel`/
`exportAnalyseExcel`) — i alle disse tilfellene vil HTML/SVG IKKE rendres, kun vises
som synlig, ødelagt tekst. Bekreftede eksempler på delte, FLERBRUKS-ordbøker som IKKE
kan konverteres uten videre: `HOVEDSTATUS_IKON`, `SAK_TYPE_IKON`, `KONTROLLAVVIK_IKON`,
`DRIVSTOFF_IKON`, `GRUPPE_IKON`, `STANDARD_BILKATEGORIER`,
`DASHBOARD_LAYOUT_FLATER[...].komponenter[].label` (sistnevnte pga. `esc()` i
`layoutEditorFlateHtml()`/`settingsAccordionRow()`).

**Metodisk lærdom:** Et bredt, automatisert linje-for-linje-erstatningsforsøk med et
sikkerhetsfilter FANGET IKKE alle disse mønstrene og introduserte 8 reelt ødelagte
visninger i Prioritet 56, oppdaget kun ved fullstendig manuell gjennomgang av HELE
diffen før levering. Videre emoji-fjerning bør gjøres kallested for kallested med
verifisert kontekst, ikke som ett stort automatisert steg — se CHANGELOG.md,
Prioritet 56 for full liste over funn og anbefalt fremgangsmåte (splitte delte
ordbøker i HTML- og tekst-varianter).

---

## Prioritet 57 (2026-09-12) — Mønster for videre Lucide-konvertering av delte ordbøker

**Etablert løsningsmønster for Prioritet 56 sitt funn:** Når en emoji-ordbok brukes
BÅDE i ren HTML og i `<option>`/eksport, IKKE endre ordboken selv. Lag i stedet en
parallell `_LUCIDE`-konstant med samme nøkler (se `GRUPPE_LUCIDE`, `SAK_TYPE_LUCIDE`,
`KONTROLLAVVIK_LUCIDE` som forbilder), og bytt kun de bekreftet rene HTML-
kallestedene til å bruke `luc(NY_LUCIDE_KONSTANT[nøkkel] || 'fallback-ikon')`. Original-
ordboken og alle `<option>`/eksport-kallesteder forblir 100 % uendret.

**Unntak — rør ALDRI `HOVEDSTATUS_IKON`:** Denne ordboken er ikke bare et eksport-
problem — flertallet av verdiene (🔴🟠🟡⚪🟢) ER de lovpålagte statusfargesirklene
(STATUSREGLER, Prioritet 55/56). Selv en parallell Lucide-variant for DENNE ordboken
ville risikert et inkonsistent statusuttrykk (noen steder farge, andre steder Lucide-
ikon for samme statuskonsept). La hele `HOVEDSTATUS_IKON` stå urørt.

**Før enhver ny konvertering:** sjekk ALLTID om target-verdien ender i `esc()`,
`<option>`, eller en `export*Excel`-funksjon (se Prioritet 56/57 i CHANGELOG.md for
metodikk og konkrete eksempler på hvordan dette sjekkes effektivt med grep før endring,
ikke etterpå).


## Prioritet 58 (2026-09-13) — Synlighetsdrevet Lucide-migrering: varige regler

**Ny regel — migrer etter SYNLIGHET, ikke etter antall.** Et blandet ikonuttrykk er et
designproblem per SKJERM, ikke per fil. Målet er aldri «færrest mulig emoji igjen», men
«ingen skjerm som brukeren ser daglig skal blande Lucide og emoji». Konsekvens: en
skjerm migreres HELT eller IKKE I DET HELE TATT. Delvis migrerte skjermer er verre enn
umigrerte, fordi de ser ut som en feil.

**Ett ikonbibliotek — nå faktisk sant.** `sjaforIkonSvg()` var et andre, håndtegnet
SVG-ikonsett ved siden av Lucide (innført i Prioritet 48, flagget som åpent i Prioritet
55). Det er nå fjernet: funksjonen beholder navn og signatur, men slår opp i `P48_LUCIDE`
og returnerer en Lucide-plassholder med inline pikselstørrelse. **Ikke gjeninnfør
håndtegnede SVG-er.** Trenger en flate en annen ikonstørrelse, settes det via CSS/inline
px på Lucide-plassholderen (se `.p48-stat-icon .lucide-ic` m.fl.).

**Samme funksjon = samme ikon overalt.** Den kanoniske ikontabellen for Bilpark:

| Konsept | Lucide |
|---|---|
| Bil/kjøretøy/biloversikt | `truck` |
| Service | `wrench` |
| EU-kontroll | `shield-check` |
| Dekk | `circle-dot` |
| Verkstedtime | `factory` |
| Ruteskift | `car-front` |
| Kalender/dato | `calendar-days` |
| Kommende frister | `calendar-clock` |
| Aktiv sak / kritisk | `triangle-alert` |
| Under oppfølging | `clock-3` |
| Kontroll | `clipboard-check` |
| Krever handling nå | `siren` |
| Påminnelser/varsler | `bell` |
| Person/sjåfør | `user-round` |
| Kommentarer | `message-square` |
| Meny | `menu` / `more-horizontal` |

Avvik fra denne tabellen krever en egen beslutning.

**Unntak som fortsatt gjelder (utvidet fra Prioritet 57):** `HOVEDSTATUS_IKON`,
`SAK_PRIORITET_IKON`, `SAK_OPPFOLGING_IKON`, `SAK_BILSTATUS_IKON`, `dash50Ikon` og
alle `status.ikon`-verdier fra `vehicleServiceStatus()`/`vehicleEuKontrollStatus()`/
`dekkAlderStatus()` er statusfargesirkler (STATUSREGLER) og skal IKKE migreres.

**Én bevisst justering av dette prinsippet:** I «Krever handling nå» var sirkelen aldri
en kjøretøystatus — den duplikerte prioriteten, som allerede vises to ganger i samme rad
(fargetone på flisen + teksten «Kritisk/Høy/Normal»). Sirkelen er derfor erstattet av et
Lucide *type*-ikon (hva slags problem det er), som tilfører ny informasjon i stedet for å
gjenta. `bilparkStatusInnholdHtml()` sine 🟢🟡🔴 er URØRT — der ER sirkelen statusen.

**Parallell-variant-regelen (Prioritet 57) gjelder fortsatt.** `vtTypeIkon()` er BEVISST
urørt fordi Kalender/Planlegging ikke ble migrert i denne runden. Ny parallell
`vtTypeLucide()` + nøkkelfunksjonen `vtTypeArt()` brukes av de migrerte flatene.


## Prioritet 59 (2026-09-13) — Prioritet er ikke lenger en sannhet i Bilpark

**Varig regel: det finnes ingen saksprioritet.** Lav/Normal/Høy/Kritisk er avviklet.
Ikke gjeninnfør et prioritetsfelt, en prioritetsbadge, et prioritetsfilter eller en
prioritetssortering uten en ny, eksplisitt arkitekturbeslutning. Arbeid rangeres av:

1. **Status** (Aktiv sak → Under oppfølging → Planlagt verksted → Utført / Avslått)
2. **Oppfølgingsdato** (forfalt → i dag → uten frist)
3. **Verkstedstatus**
4. **Operativ påvirkning** (`v.uteAvDrift`)

**`vehicleHovedstatus()` — oppdatert beskyttet hierarki, seks nivåer:**

    Ute av drift > Verksted bestilt > Under oppfølging > Reservebil > Ikke kontrollert > Operativ

Nivået `kritisk` finnes ikke lenger. Hierarkiet er fortsatt beskyttet og skal ikke
utvides eller endres uten eksplisitt godkjenning.

**RØDT betyr én ting: bilen kan ikke brukes.** Ikke «viktig», ikke «forsinket», ikke
«noen mener dette haster». Forfalt oppfølging er administrasjon og skal aldri fargelegge
en bil rød. Denne definisjonen deles av `vehicleHovedstatus()` og `vehicleSakStatus()`.

**Bakoverkompatibilitet — les tolerant, skriv aldri.** Eksisterende saker i Airtable har
fortsatt en `Priority`-verdi, og eldre `Avvik`-blober har `prioritet` per avvikspunkt.
Disse feltene skal IGNORERES ved lesing, ikke nullstilles og ikke slettes. Kolonnen
`AktiveSaker.Priority` beholdes permanent som historisk data.

**Dashboard bruker hastegrad, ikke prioritet.** «Krever handling nå» fargelegges av
`sakOppfolgingStatus()`: forfalt = rød, i dag = oransje, uten frist = amber. Ingen ny
datakilde, ingen ny beregning.


## Prioritet 60 (2026-09-13) — «Prioritet» er et forbudt ord i grensesnittet

Utfyller Prioritet 59. Ordet **Prioritet** og verdiene **Kritisk / Høy / Normal / Lav /
Ikke vurdert** skal aldri vises for brukeren i noen saksammenheng: ikke på sakskort, i
detaljvisninger, modaler, oppsummeringer, etiketter, hjelpetekster, filtre eller
rapportoverskrifter. Ordet er fortsatt greit i kodekommentarer som sprintnavn
(«Prioritet 58», «Prioritet 59») — det er intern historikk, ikke grensesnitt.

**Lærdom: å fjerne et `<select>` er ikke å fjerne en funksjon.** Prioritet 59 fjernet
nedtrekkslistene, men lot `<div class="field"><label>Prioritet</label>` stå igjen tre
steder. Brukeren så fortsatt etiketten — nå uten innhold, altså verre enn før. Ved
fjerning av et skjemafelt skal HELE feltet fjernes, og rutenettet rundt (`row2`)
reorganiseres slik at det ikke blir stående halvtomt.

**Unntak som IKKE er en rest av prioritetssystemet:** `ALVOR_LABEL` ({lav, middels, hoy})
er skademodellens egen alvorlighetsgrad på Damages-tabellen, med egne nedtrekkslister i
skaderegistreringen. Den er urørt. Ikke forveksl de to — skal alvorlighetsgraden
avvikles, krever det en egen beslutning med databasekonsekvenser.


## Prioritet 61 (2026-09-13) — Standardverksted: forhåndsutfylling, aldri låsing

**Prinsipp: et standardvalg er et forslag, ikke en regel.** Standardverkstedet fylles inn
i skjemaet ved åpning og kan alltid endres. Ingen felt låses, ingen validering krever at
standarden brukes, og ingenting skrives til en verkstedtime uten at brukeren lagrer
skjemaet. Samme prinsipp gjelder for eventuelle framtidige standardvalg.

**Lagres som navn, ikke id — og da MÅ konsistensen vedlikeholdes.** `standardVerksted`
holder verkstedNAVN fordi det er samme representasjon som `verkstedtime.verksted` bruker.
Prisen er at `saveVerkstedEdit()` må oppdatere standardene ved omdøping og
`deleteVerksted()` må fjerne dem ved sletting. Begge er implementert. I tillegg er
`standardVerkstedFor()` tolerant: peker et lagret navn på et verksted som ikke finnes,
returnerer den tom streng, og skjemaet faller tilbake til «Velg verksted...». Et dødt
standardvalg skal aldri kunne føre til at det står et verksted i feltet som ikke finnes
i nedtrekkslisten.

**Nye Settings-nøkler trenger ingen `LIST_TABLES`-registrering.** Feltregelen gjelder
felt på et objekt i en LISTE-tabell. En frittstående Settings-blob (`verksteder`,
`bilkategorier`, `dashboard-layout`, `standardverksted`) lagres via
`window.storage.set(nøkkel, json, true)`, og storage-laget skriver den til
Settings-tabellen automatisk. Ikke legg slike nøkler i `LIST_TABLES`.

**«Samme funksjon = samme ikon» gjelder også her:** tjenestetypene i standardverksted-
skjemaet bruker de samme Lucide-ikonene som resten av appen (`wrench`, `shield-check`,
`factory`, `car-front`, `circle-dot`) — se ikontabellen under Prioritet 58.


## Prioritet 62 (2026-09-13) — Bestill tjenester er planlagt vedlikehold, ikke «opprett noe»

**Varig regel: Bestill tjenester har FIRE kort.** Service, EU-kontroll, Dekkskifte,
Ruteskift. Ikke legg til et femte uten en ny beslutning, og legg spesielt aldri
Verkstedtime tilbake. Skillet er prinsipielt, ikke kosmetisk:

- De fire er **planlagt vedlikehold** — noe man bestemmer seg for å gjøre.
- En **verkstedtime er et resultat** — den oppstår fordi noe er galt, og skal alltid ha
  en sak bak seg: Aktiv sak → Under oppfølging → Bestill verksted → Planlagt verksted.

Kan en verkstedtime opprettes fritt fra en bestillingsmeny, får Bilpark to veier til
samme objekt, og den ene omgår saksmotoren. Da mister Aktive saker sin posisjon som
hjertet i systemet. `bestillVerkstedForSak()` er den riktige inngangen; Verkstedskjermens
egen «+ Ny verkstedtime» er unntaket for reell nødsituasjon, ikke hovedveien.

**Hurtigopprettelse betyr at brukeren bare skal velge bil og dato.** Et bestillingskort
skal fylle ut alt systemet allerede vet: type, standardverksted, dato, klokkeslett,
obligatoriske tekstfelt og fornuftige valg utledet av bilens tilstand (f.eks.
dekkretning fra `v.dekk`). Står det igjen et obligatorisk felt brukeren må skrive for
hånd hver gang, er kortet ikke ferdig.

**Forslagsregelen (fra Prioritet 61, nå gjeldende for alle forhåndsutfylte felt):** et
forslag kan oppdateres automatisk når konteksten endres, men KUN hvis feltet fortsatt
står på forrige forslag. Har brukeren rørt feltet, er det brukerens. Implementert med
`data-std-default` på elementet og sammenligning mot `element.value`.


## Prioritet 62.0 (2026-09-13) — Storage-filnavnet er sanert. Hold det slik.

Prosjektet har **nøyaktig ett** gyldig navn på Airtable-storage-filen:

    storage.airtable.js

Ingen andre varianter er gyldige — ikke `storage_airtable.js`, ikke
`airtable_storage.js`, ikke `airtable-storage.js`, ikke `storageAirtable.js`, ikke
`airtable.storage.js`. Dette gjelder **filnavnet, `<script src>`, `sw.js` sin cache-liste,
kommentarer, grensesnittekst og dokumentasjon**. Et feilskrevet filnavn i en kommentar er
ikke ufarlig: det var nettopp slik den historiske forvekslingen oppsto, og i Prioritet
62.0 pekte selve *diagnoseskjermen* (Database status) mot feil navn — altså den skjermen
som skal avsløre problemet.

**Ett unntak som IKKE skal «rettes»:** `window.storageAirtableInfo` er et
JavaScript-variabelnavn, ikke et filnavn. Det er gyldig og skal stå urørt.

**Regel før hver leveranse:** kjør en kontroll på alle fem ugyldige varianter i
`index.html`, `kontroll.html`, `sw.js`, `storage.airtable.js` og alle `.md`-filer. Eneste
tillatte treff er de i denne filen som eksplisitt beskriver variantene som ugyldige.


## Prioritet 62.1 (2026-09-14) — Én KPI, ett spørsmål

**Varig regel: en KPI skal svare på nøyaktig ett spørsmål, og tallet skal komme fra kilden
som faktisk måler det spørsmålet.** «Biler i drift nå» brøt dette: den het som om den
svarte på «hvor mange biler er i bruk i dag», men målte «hvor mange aktive biløkter finnes
akkurat nå». Ingen feil i koden — feil spørsmål i kortet.

Dashboardets KPI-er og deres ENESTE gyldige kilde:

| KPI | Spørsmål | Kilde |
|---|---|---|
| Kontrollstatus | Hvor mange biler er kontrollert i dag? | `isKontrollertIdag()` via `kontrollertIdagCount` |
| Aktive sjåfører | Hvem kjører akkurat nå? | `vehicleAktivSjafor()` via `hDriftCount` |
| Aktive saker / Under oppfølging / Planlagt verksted | Hva må gjøres? | `sakFaseAntall` |
| Kommende frister / Kalender | Hva kommer? | `upcomingVT` |
| Bilpark status | Er bilparken operativ? | `vehicleHovedstatus()` via `hbp` |

**Kontrollstatus skal ALDRI bruke `vehicleAktivSjafor()`.** Fire kontroller i dag skal gi
fire, uavhengig av hvor mange biløkter som er aktive. Motsatt: Aktive sjåfører skal aldri
utledes av kontroller — `vehicleSisteSjafor()` hører til informasjonsvisning, ikke til
denne tellingen.

**Dashboardvisning ≠ datamodell.** 🔴 Ute av drift er fjernet fra dashboardkortet fordi
tallet ikke hadde en neste handling der. Statusnivået, filtrene, Biloversikt,
Kjøretøyprofil og rapportene er uendret. Når et tall fjernes fra Dashboard, skal det
alltid fortsatt finnes hos eieren av informasjonen — Dashboard eier aldri data.

**Ett tall, én sannhet på tvers av klikk.** «N mangler kontroll» bruker samme definisjon
(`manglerKontrollCount`) som Biloversikt-filteret klikket lander på
(`goToRegisterFiltered('ikke')`). Et KPI-tall som ikke stemmer med skjermen det leder til,
er verre enn ingen KPI.


## Prioritet 62.1a (2026-09-14) — Tall på Dashboard skal aldri kreve forklaring

**Varig regel: et sammensatt tall må være matematisk konsistent i seg selv.** Viser et kort
«X / Y» og «N mangler», skal `X + N = Y` alltid holde. Et `title`-attributt som forklarer
hvorfor tallene ikke går opp, er ikke en løsning — det er en innrømmelse av at kortet er
feil. Dashboard skal forstås på under to sekunder; et tall som må forklares har allerede
brukt dem opp.

**Praktisk konsekvens:** når teller, nevner og differanse skal vises sammen, må alle tre
avledes av SAMME populasjon. Feilen i Prioritet 62.1 var at nevneren var «alle biler som
ikke er ute av drift», mens telleren og differansen i tillegg unntok reservebiler som
ikke var tatt i bruk. Riktig populasjon her er «biler som faktisk har kontrollkrav i dag»
= `aktiveVehicles − reserveUnntatt`.

**KPI-er skal være hurtigknapper, ikke oppslagsverk.** «Aktive biler» erstattet «Aktive
sjåfører» fordi verdien ikke ligger i tallet alene, men i å komme rett til Biloversikt →
Har aktiv sjåfør uten å stille filtre manuelt. Et KPI-kort som bare viser et tall uten en
naturlig neste skjerm hører ikke hjemme på Dashboard.

**Rydd opp etter deg.** `goToRingeliste()` ble innført i 62.1 for ett kort. Da kortet ble
erstattet i 62.1a, ble funksjonen og dens `data-`attributt fjernet i samme slengen. Hjelpere
uten kallesteder er død kode, ikke beredskap.


## Prioritet 63 (2026-09-14) — Bilpark-identiteten: én logo, én fil

**Varig regel: det finnes ÉN Bilpark-logo, og den ligger i `icons/icon-192.png`.**
Header, sidemeny, drawer, innloggingsskjerm, mobilforside, favicon, apple-touch-icon og
PWA-ikonet refererer alle den samme filen. Ikke lag en egen header-variant, en egen
SVG-kopi eller et «forenklet merke for små størrelser» — to filer kommer alltid i utakt.

**Ikke redesign logoen.** Ingen nye B-varianter, ingen nye farger, ingen kjøretøysymboler,
ingen emoji som logo. Grønn er primærfarge, oransje er aksent, begge hentet fra logofilen.
Det gamle lastebil-ikonet i `brandBlockHtml()` er fjernet og skal ikke tilbake.

**Skill logo fra UI-ikoner.** `luc('truck')` brukes fortsatt som Lucide-ikon for
kjøretøy/biloversikt i grensesnittet — det er innhold, ikke merkevare. Logoen opptrer kun
i brand-blokkene.

**Maskable-regel:** `icon-512-maskable.png` skal ha heldekkende bakgrunn uten egen
hjørneavrunding, og motivets DIAGONAL må ligge innenfor den sikre sonen (80 % av bredden).
Å bare sjekke høyden er ikke nok — et høyt, smalt motiv kan likevel få hjørnene kuttet av
launcherens sirkelmaske. Ved ny logo: mål bounding box, skaler til ~56 % høyde, verifiser
diagonalen.

**Undertittelen er «Operativ kontroll»** i alle brand-blokker.


## Prioritet 63.1 (2026-09-14) — Ikonfiler skal alltid være versjonerte

**Varig regel: PWA-ikoner får aldri generiske filnavn.** Bruk mønsteret
`bilpark-icon-<størrelse>[-maskable]-v<sprint>.png`. Ikoner caches hardt av nettleseren,
av service workeren og av Android-launcheren — en `CACHE_VERSION`-bump alene tvinger ikke
fram nytt hjemskjermsikon. Endres logoen, skal filnavnet endres i samme slengen.

**Et ikonnavn finnes fjorten steder.** Ved bytte må ALLE oppdateres, ellers får man 404
eller en blanding av gammel og ny logo: `index.html` (favicon, apple-touch-icon,
CSS-kommentar, to `brand-mark`-img), `kontroll.html` (kopi), `sw.js` precache-liste (3),
`manifest.json` (3) og `manifest-sjafor.json` (3). Verifiser med et søk på det GAMLE
navnet — det skal gi null treff.

**Maskable-ikonet skal verifiseres, ikke antas.** Sjekklisten som faktisk fanger feil:
ingen alfakanal; bakgrunn helt ut i alle fire hjørner; ingen hjørnebortfall langs noen
kant (mål horisontal variasjon per kant — vertikal variasjon kan være logoens egen
gradient); motivet sentrert; og — viktigst — verste motivPIKSELS avstand fra midten under
`0.4 × bredden`. Å måle bounding box-høyden alene er ikke nok, fordi et høyt, smalt motiv
kan få hjørnene kuttet av launcherens sirkelmaske selv med god høydemargin.

## Prioritet 64 (2026-09-14) — Bilkortet skal komprimeres, ikke utvides

**Varig regel for Biloversikt: et bilkort skal svare på fire ting — hvilken bil, hvilken
status, hvem kjører den, og er noe galt.** Alt annet hører hjemme på Kjøretøyprofilen.
Kortet består derfor av nøyaktig: tittellinje med statusprikk, to infolinjer, og en
pillerad. Nye felt legges ikke til her uten at noe annet fjernes.

**Status kommuniseres med farge, ikke etikett.** `galleryCard()` bruker den eksisterende
`.p48-dot` farget med `P38_STATUS_STIL[hs].tone` (🟢 `--green-ink` · 🟡 `--amber` ·
🟠 `--orange` · 🔴 `--red` · ⚪ `--muted`), med `HOVEDSTATUS_IKON`/`HOVEDSTATUS_LABEL` som
`title`. Ingen ny prikk-komponent, ingen nye statusfarger. `vehicleHovedstatus()` er urørt.

**De to infolinjene har fast form:**

| Linje | Innhold |
|---|---|
| 1 | `Merke Modell • Regnr` (fallback «Modell ikke satt») |
| 2 | `Løyve <nr> • <km> km` (fallback `⚠️ Løyve mangler` via `.gcard-loyve.mangler` / «Km ikke satt») |

Årsmodell og drivstoff vises IKKE på kortet. Dataene er urørte og vises fortsatt på
Kjøretøyprofilen (`drivstoffTekst()` brukes fortsatt to steder der).

**Kategori-/driftslagtaggen hører ikke hjemme på kortet.** Bilen ligger allerede inne i sin
egen gruppe i Biloversikt, så taggen gjentok det brukeren nettopp klikket seg inn i.
Unntaket er den flate listen «🚚 Biler i drift» (filter `har-aktiv-sjafor`), der kategori
ikke lenger fremgår av kortet — se kjent begrensning i `ROADMAP.md`.

**«Ingen varsellamper» er ikke informasjon.** Varsellampepillen vises kun når
`activeVarsellysForVehicle()` returnerer noe. Grønn prikk i tittellinjen dekker det
motsatte tilfellet. Samme prinsipp som skadepillen, som alltid har vært betinget.

## Prioritet 65 (2026-09-14) — Kjøretøyprofilen er en kontrollflate, ikke en databasevisning

**Varig regel for rekkefølgen på Kjøretøyprofilen.** Siden skal svare på fem spørsmål før
brukeren scroller: er bilen operativ, hvem kjører den, finnes åpne saker, må noe bestilles,
har bilen mobilitetsgaranti. Rekkefølgen er derfor fast:

1. Toppseksjon — bilnavn + statusprikk, `Modell • Regnr`, `Løyve • Km`, sjåførpille,
   mobilitetsgarantipille
2. ⛔ Ute av drift-banner (kun når aktuelt)
3. Operativ status — Kontrollstatus · Varsellamper · Skader · Aktive saker
4. ➕ Bestill tjenester (fire kort) + hurtighandlinger
5. Faner (Oversikt/Historikk/Skader/Dekk/Kostnader) | Kommende oppgaver · Aktive saker ·
   ▼ Kjøretøydetaljer
6. ⚠️ Faresone

Referansedata (kategori, biltype, årsmodell, drivstoff, driftslag, telefon, reg.nr,
kilometerstand, mobilitetsgaranti-detaljer) hører hjemme i **▼ Kjøretøydetaljer**, som er
LUKKET som standard (`bilkortAccordionRow('detaljer', …)`). Nye referansefelt legges dit,
ikke på forsiden av profilen.

**Nøkkelen 'detaljer', ikke 'info'.** `formInProgress()` behandler
`bilkortOpenSections.has('info')` som «brukeren står midt i et skjema» og stopper
bakgrunnsoppdatering. Kjøretøydetaljer er ren lesing og skal ikke blokkere synk — derfor
egen nøkkel.

**Mobilitetsgaranti er LIVE-BEREGNET, ikke et felt som vedlikeholdes.**
`vehicleMobilitetsgaranti(v)` leser to kilder og velger den seneste datoen:

| Kilde | Regel |
|---|---|
| Automatisk | Siste service i `servicehistorikk` der `verksted` inneholder «mekonomen» + 12 måneder |
| Manuelt | En dato lest ut av fritekstfeltet `v.mobilitetsgaranti` (DD/MM/ÅÅÅÅ, DD.MM.ÅÅÅÅ, DD-MM-ÅÅÅÅ eller ÅÅÅÅ-MM-DD) |

Ingen nye Airtable-felt, ingen migrering, ingen `LIST_TABLES`-endring. Fire tilstander:
`gyldig` · `utlopt` · `ukjent` (fritekst uten lesbar dato — vises som «registrert», aldri
som «ingen») · `ingen`.

**Nedtelling er forbudt her.** Mobilitetsgaranti vises som gyldig-til-dato, utløpt eller
ingen garanti. Aldri «X dager igjen», aldri teller.

**Service/EU-status skal finnes ÉN gang over folden.** Den gamle 4-fliters statsraden
(Kilometerstand · Siste service · Neste service · EU-godkjent til) er fjernet fordi de
samme tallene allerede fantes i «Kommende oppgaver» og i Oversikt-fanen. Kilometerstand
står nå på infolinje 2 i toppseksjonen, «sist kontroll» i Kontrollstatus-flisen, og siste
servicedato/EU-dato i Kommende oppgaver. Ikke gjenopprett raden — utvid Kommende oppgaver.

**Bestillingskortet heter «Dekkskift», ikke «Dekkskifte»**, på alle fire flater
(Dashboard desktop, Dashboard mobil, Kjøretøyprofil, Bestill tjenester). Tjenestetypen i
Innstillinger (`STD_VERKSTED_TYPER`) heter fortsatt «Dekkskifte» — den er en verksted-
kategori, ikke en knapp.

## Prioritet 65.1 (2026-09-14) — Bestillingskort skal snakke i handlingsform

**Varig regel: undertittelen på et hurtigbestillingskort er en handling, ikke en
beskrivelse.** Mønsteret er «Bestill <tjeneste>» — Bestill service · Bestill EU-kontroll ·
Bestill dekkskift · Bestill ruteskift. Ikke leverandørnavn («Carglass ruteskift»), ikke
systembegrep («Verkstedtime for EU»), ikke navigasjonssteg («Velg bil → …»). Bilvelgeren
møter brukeren i skjemaet kortet åpner; det steget hører til flyten, ikke knappen.

**Teksten skal være identisk på alle fire flater:** Dashboard desktop, Dashboard mobil,
Kjøretøyprofil og den dedikerte Bestill tjenester-skjermen. Endres én, endres alle fire.

**Kortene skal aldri klippe tekst.** `.dash40-bestill` har bevisst ingen
`white-space:nowrap`, `overflow:hidden` eller `text-overflow` — kortet vokser i høyden i
stedet. Legg aldri til klippende egenskaper for å «rydde» i lange etiketter; kort ned
teksten i stedet.

## Prioritet 65.2 (2026-09-14) — Tomtilstander skal ikke ta plass

**Varig regel: en seksjon som bare kan vise «0», «–», «Ingen planlagt» eller «Ikke satt»
skal ikke rendres i det hele tatt.** Informasjon som ikke krever handling, skal ikke
konkurrere om plassen med informasjon som gjør det. Unntaket er felt der fraværet SELV er
handlingen — manglende EU-registrering, manglende løyve og dekk som ikke er satt vises
fortsatt, fordi de betyr «registrer dette».

Konkret på Kjøretøyprofilen:

| Seksjon | Regel |
|---|---|
| 🗂️ Aktive saker (panel) | Rendres kun når `vAktiveSakerListe.length > 0` |
| 🏭 Verkstedtime | Kun når `vNesteVT` finnes |
| ⏰ Neste oppfølging | Kun når `followUpDate` finnes |
| 💥 Ruteskift | Kun når `vehicleHarRegistrertRuteskiftTime()` |
| 📅 Planlagt service/dekkskift | Kun når timen faktisk finnes |

**Kjøretøyprofilen har ÉN statusliste.** Oversikt-fanen er eneste sted Service/Dekk/EU/
Verksted/oppfølging vises på profilen. Panelet «📋 Kommende oppgaver» og blokken «Operativ
status» (`ov-split-grid`) er fjernet fordi de var tredje og fjerde visning av samme tall.
Ikke gjenopprett dem — utvid Oversikt-fanen.

**Profilen har ingen egen hurtighandlingsrad.** Registrer kontroll, Registrer skade og
Åpne aktive saker finnes på sine egne arbeidsflater. Det som står over bestillingskortene
er status, ikke knapper. Eneste navigasjon fra statusraden: Skader-flisen → Skader-fanen,
Aktive saker-flisen → Aktive saker (kun når det finnes saker).

**Ny bil = ny side = scrollposisjon 0.** `goTo()` scroller til toppen når `scr === 'bilkort'`
OG `vehicleId !== undefined`. Begge betingelsene er nødvendige: uten den andre ville hver
re-render av samme profil (lagring, fanebytte, synk) hoppet til toppen.

## Prioritet 66 (2026-09-14) — Dataintegritet: operativt døgn og kilometerstand

**Varig regel: `v.km` kan aldri gå NEDOVER via Sjåførkontroll.** `validerKontrollKm()` er
eneste definisjon av hva som er en gyldig ny kilometerstand, og brukes av både
blur-valideringen og `submitKontroll()`. Lavere enn `v.km` = hard blokkering (ingen
kontroll, ingen sak, ingen bilder, ingen aktiv sjåfør, ingen km-endring). Nedjustering er
kun mulig via den beskyttede adminflyten i `saveVehicleForm()`, som viser gammel og ny
verdi og krever bekreftelse. Gjør aldri blokkeringen om til en bekreftelse igjen — det var
nettopp den «Registrere likevel?»-dialogen som gjorde tastefeil til dataavvik.

**Grensene er eksakte:** < 1 000 km differanse = ingen ekstra bekreftelse · nøyaktig
1 000 km = advarsel · > 1 000 km = advarsel · lavere enn `v.km` = alltid blokkert · lik
`v.km` = tillatt.

**`v.km` skrives FØRST i `submitKontroll()`, ikke sist.** Rekkefølgen er en
dataintegritetsgaranti, ikke en tilfeldighet: skrives kontrollen først og km-lagringen så
feiler, står historikken med høyere km enn kjøretøyet — akkurat det avviket som ble meldt
fra drift. Bruk `saveVehiclesOrThrow()` der en mislykket lagring må gi rollback;
`saveVehicles()` svelger feilen med vilje og er kun for steder der det er greit.

**Fem — og bare fem — skrivestier til `v.km`:** `submitKontroll()`,
`performKontrollDeletion()`, `resetFleetData()`, `saveVehicleForm()` (administrativ
korrigering) og, siden Prioritet 71.10, `godtaKmEndring()` (driftskoordinatorens
godkjenning av et tidligere bekreftet storthopp, se egen seksjon). `submitService()` og
`saveServiceEdit()` skal ALDRI røre `v.km`.

**Operativt døgn håndheves ved inngangspunkter, ikke av en timer.** Appen ligger på GitHub
Pages og har ingen prosess som kan kjøre kl. 04:00. `handhevOperativtDogn()` kalles ved
oppstart, `visibilitychange`, `pageshow`, hver live-synk og hver `goTo()`. Den er
idempotent og skriver kun når det faktisk finnes en foreldet biløkt. Legg aldri til en
`setInterval` som «backup» — en PWA i bakgrunnen kjører den ikke uansett.

**Én definisjon av «i dag».** `todayISO()`/`isoDateForOperationalDay()` er eneste kilde.
Ikke innfør `new Date().toISOString().slice(0,10)` noe sted.

**Stort kilometerhopp merkes i kontrollens kommentarfelt**, med prefikset `⚠️ Kontroller km:`
(konstanten `KM_AVVIK_PREFIX`, testet med `kontrollHarKmAvvik()`). Det er bevisst ingen ny
tabell og intet nytt Airtable-felt — kjøretøy, sjåfør, dato og tidspunkt er allerede
kolonner på kontrollen, og kommentaren rendres allerede i historikk og detaljvisning.
Et hopp skal ALDRI opprette en verkstedsak automatisk: dette er mulig feilregistrering,
ikke en kjøretøyfeil.

**Historiske km-avvik korrigeres aldri automatisk.** `kmAvvikForVehicle()` og
`window.rapporterKmAvvik()` rapporterer; korrigering er en bevisst adminhandling.

## Prioritet 66.1 (2026-09-14) — Kilometergulv og ærlig transaksjonsspråk

**Valideringsgulvet er ikke `v.km` alene.** `kontrollKmGulv(v)` returnerer det HØYESTE av
`v.km` og siste gyldige kontrollkilometer. Grunnen er at eksisterende data allerede kan
være inkonsistente — validerer man kun mot `v.km`, kan en ny registrering ligge under siste
kontroll og gjøre avviket permanent. Både blokkeringen (Del 6) og 1 000 km-advarselen
(Del 7) måler mot dette gulvet.

**Gulvet er beskyttelse, ikke en ny sannhet.** `v.km` er fortsatt eneste autoritative
nåværende kilometerstand. Gulvet leser siste kontroll, men skriver den ALDRI til `v.km`.
Ikke innfør automatisk «løft v.km til siste kontroll» — det er en bevisst adminhandling.

**`submitKontroll()` er IKKE atomisk. Ikke bruk ordet.** Airtable har ingen transaksjoner.
Det som finnes er sekvensiell lagring med snapshot-basert rollback og kompenserende
skriving. Rekkefølgen står dokumentert i kommentaren øverst i funksjonen — hold den
oppdatert når nye persistente steg legges til, og legg nye steg inn i `lagret`-listen med
`try/catch` → `rullTilbake()`.

**Rollback-kontrakten ved feil:** lokal state tilbake fra snapshot · kompenserende lagring i
motsatt rekkefølge · lagrede bilder slettes · ingen «Kontroll registrert» · ingen navigasjon
· skjemadata og utkast beholdes · meldingen navngir hvilket steg som feilet, og sier fra
dersom tilbakestillingen i Airtable heller ikke gikk gjennom.

**Steg 8 (aktiv sjåfør) er utenfor rollback-grensen** — kontrollen er gyldig uten biløkt.

## Prioritet 66.2 (2026-09-14) — Gulvet er hele historikken, og aktiv sjåfør har én kilde

**`kontrollKmGulv(v)` ser på HELE kontrollhistorikken**, ikke bare siste kontroll. Gulvet
er høyeste gyldige km av `v.km` og alle kontroller for bilen. Grunnen: en eldre kontroll
kan ha høyere km enn den siste i eksisterende, inkonsistente data — bruker man bare siste,
slipper en for lav verdi gjennom. Bruk `kmVerdiEllerNull()` for all km-tolkning: den
forkaster tomt, ikke-numerisk og negativt.

**Gulvet returnerer kilde.** `{verdi, kilde, kilde_type, kontroll}` — `kilde_type` er
`'vehicle'` eller `'kontroll'`, og `kontroll` bærer `{id, dato, tidspunkt, sjafor, km}`.
Kilden skal følge med i avvisningsdialog, storthopp-dialog og km-avviksmerknaden, slik at
driftskoordinator kan finne igjen nøyaktig hvilken kontroll som satte gulvet.

**Aktiv sjåfør har ÉN kilde: `vehicleAktivSjafor()`.** Den sjekker `v.aktivSjaforSiden` mot
operativt døgn og returnerer null for en foreldet biløkt. `vehicleSisteSjafor()` er bredere
(aktiv biløkt ELLER siste kontroll i dag) og skal ALDRI presenteres som aktiv sjåfør — den
leses kun når det ikke finnes en aktiv sjåfør, og merkes «🕓 Sist kontrollert av …».
Rå `v.aktivSjafor` skal aldri leses direkte i visningen, uten døgnkontroll.

**To ulike feilmeldinger ved rollback.** Ren rollback = trygt å prøve på nytt. Mislykket
kompenserende skriving = MULIG DELVIS LAGRING, og brukeren skal da IKKE sende inn på nytt
før Database status eller kontrollhistorikken er undersøkt — et nytt forsøk kan gi
dobbeltregistrering.

## Prioritet 66.3 (2026-09-14) — Deklarasjonsrekkefølge i renderBilkort()

**`renderBilkort()` bygger fane-innholdet FØR den bygger returmalen.** Enhver `const` som
leses av `faneBody`-objektet (Oversikt/Historikk/Skader/Dekk/Kostnader) må deklareres over
det objektet — ikke nede ved `vMobgaranti`/`p38SjaforNa`, som bare brukes i returmalen.
Bryter man dette, kaster funksjonen `Cannot access 'X' before initialization`.

**En exception i `renderBilkort()` ser ut som en klikkfeil.** `goTo()` setter `screen` og
`currentVehicleId` FØR `render()`. Kaster `render()`, står appen igjen med riktig state men
gammel DOM — og siden alle senere `render()`-kall treffer den samme ødelagte skjermen, dør
også knapper og grupper på den forrige skjermen. Symptomet «trykk gjør ingenting» skal
derfor alltid sjekkes mot nettleserkonsollen FØR man leter i event delegation, z-index
eller overlays.

**Test klikk i nettleser, ikke ved kodelesing.** Regresjonen var usynlig for `node --check`,
tag-balanse og templatesimulering — den krevde et ekte museklikk mot en ekte DOM.

## Prioritet 66.9 (2026-09-14) — Datasikring for kjøretøyregisteret

**EN LESEFEIL ER IKKE ET TOMT DATASETT.** Dette er den viktigste regelen i hele
kodebasen etter datahendelsen i september 2026. `vehiclesLoadStatus` er eneste sannhet om
hvorvidt registeret faktisk er lest: `ikke-startet` · `laster` · `lastet` ·
`bekreftet-tom` · `lesefeil`. `bekreftet-tom` og `lesefeil` skal ALDRI behandles likt, i
noen kodevei.

**`saveVehiclesOrThrow()` er eneste vei inn til kjøretøyregisteret, og den spør
`vehiclesSkrivingTillatt()` først.** Minimumskrav per kjøretøy er id, bilnummer og regnr —
IKKE km eller løyvenummer, som kan være legitimt tomme. Ikke legg til en ny skrivevei
utenom denne funksjonen, og ikke svekk kravene.

**DEFAULT_FLEET skal aldri kjøre automatisk.** Den finnes kun bak den manuelle knappen i
Innstillinger → Database status: admin, `vehiclesLoadStatus === 'bekreftet-tom'`, skrevet
bekreftelsesfrase, og `vehiclesAdminSeedingGodkjent` settes og nullstilles rundt det ene
kallet. Det flagget er eneste måte å omgå skrivesperren på, og skal aldri settes andre
steder.

**Masseslettingssperren i `reconcileList()` gjelder `vehicles` og skal ikke kopieres blindt
til andre tabeller.** Terskler: ≥ 3 slettinger, ≥ 20 % av radene, eller flertallet av
AppId-ene erstattet med nye. Konsekvensen beregnes og kastes FØR første skriving. Bygg
ALDRI en generell «fortsett likevel»-knapp inn i normal flyt.

**Destruktiv reconcile bruker aldri en cache som kan være utdatert.** Før en
Vehicles-reconcile hentes radene ferskt fra Airtable. Det er denne sikringen som gjør at en
app som sto åpen under en gjenoppretting fra Trash ikke kan slette de restaurerte radene.

**Retry kun på det som faktisk er forbigående:** 429, 500, 502, 503, 504 og nettverksfeil,
tre nye forsøk med økende ventetid, `Retry-After` respektert. 400/401/403/404 og
skjemafeil kastes umiddelbart — de krever korrigering, ikke nye forsøk.

**`krevVehiclesSkriving(handling)` kalles FØRST i enhver funksjon som kan endre Vehicles
eller relasjoner til Vehicles** — før noen mutasjon av lokal state. Gjelder i dag
`submitAddVehicle()`, `saveVehicleForm()`, `deleteVehicle()` og `submitKontroll()`. Nye
slike funksjoner skal gjøre det samme.

**Denne feilklassen testes i nettleser, ikke ved kodelesing.** `node --check`, grep og
templatesimulering fanger den ikke. Kjør faktiske scenarier med 429, 5xx, timeout, tom
tabell og stale cache, og verifiser at det er null POST/PATCH/DELETE mot Vehicles.

## Prioritet 67 (2026-09-14) — Når v.km oppdateres automatisk

**En gyldig kontroll oppdaterer `v.km` automatisk. Ett unntak: bekreftet storthopp.**
`submitKontroll()` skriver `v.km` når `kmVal.status !== 'storthopp'`. Er hoppet ≥ 1 000 km
over km-gulvet og sjåføren har bekreftet det, lagres kontrollen — men kjøretøyets
kilometerstand står urørt til en administrator godkjenner den. **Oppdatert i Prioritet
71.10:** godkjenningen skjer nå som en formell Godta/Avslå-handling i 🔔 Varslingssenteret
(`godtaKmEndring()`/`avslaKmEndring()`), ikke lenger kun implisitt via Rediger informasjon
— se egen seksjon lenger ned. Begrunnelsen er tastefeilen 31 000 → 310 000: en sjåfør skal
kunne registrere hva som faktisk står på telleren, men ikke alene kunne gjøre det til
bilens autoritative stand.

**Etter et bekreftet storthopp er `v.km` LAVERE enn siste kontroll, og km-avviksvarselet
vises. Det er hensikten.** Varselet fra Prioritet 66 er nå forbeholdt fire tilfeller:
historiske data som allerede er feil, manuell adminkorrigering, et bekreftet storthopp som
ikke er godkjent ennå, og inkonsistente gamle data. Det skal ikke forekomme i vanlig
daglig drift — dukker det opp ellers, er det en feil å undersøke.

**Km-gulvet beskytter fortsatt.** `kontrollKmGulv()` ser på hele kontrollhistorikken, ikke
bare `v.km`. Et storthopp som ikke er godkjent hever derfor likevel gulvet, og neste
kontroll kan ikke registreres under det.

**Rollback-sekvensen er kortere ved storthopp.** `vehicles` legges ikke i `lagret`-listen
når km-skrivingen hoppes over — ikke «fiks» dette ved å skrive `v.km` likevel.

## Prioritet 68 (2026-09-14) — Saksdetaljer leses, aldri kopieres

**Aktive saker lagrer ALDRI en kopi av kommentar, bilde eller skade.** Detaljseksjonen
under «ℹ️ Mer informasjon» leser live fra originalkilden: `damages[]` via
`sakSkadeDamages()`, `kontroller[]` via `s.createdByControlId`, og bilder via
`sakBilderKeys()` → `damagePhotoKeys()`. Endres skaden, endres det saken viser. Ikke innfør
et felt på saken for å «slippe oppslaget» — det ville gjenskapt dobbeltlagringen.

**Bilder hentes først når kortet er utvidet.** `attachSakDetaljBilder()` går gjennom
`sakDetaljApneIds` og kaller `getPhoto()` kun for dem. Ikke flytt bildelastingen inn i
kortrenderingen — en liste med tjue saker ville da hentet hvert eneste bilde ved hver
render.

**Kilden vises med ikon, avledet fra den eksisterende `sakKildeLabel()`.** En skade meldt
via sjåførkontroll viser «✅ Sjåførkontroll», ikke «📷 Skaderegistrering» — kilden er der
hendelsen faktisk ble registrert. `SAK_KILDE_IKON` mapper label → ikon; legges en ny
kildetype til i `sakKildeLabel()`, legg ikonet der.

**Godta/Avslå-flyten er urørt.** Prioritet 68 la til kontekst, ikke sakslogikk.

## Prioritet 68.1 (2026-09-14) — Ingen systemtekst i utvidet sak

**Den utvidede saksvisningen viser kun informasjon som hjelper en beslutning.** Sakens egen
`description` rendres ikke der: for auto-genererte saker er den boilerplate («Automatisk
generert fra …»), og for manuelle saker vises den allerede som «✍️ Beskrivelse» gjennom
`sakKildeTekster()`. Ikke legg den tilbake — legg i stedet til kilden i
`sakKildeTekster()` hvis en ny sakstype mangler tekst.

**Fallbacken er eksplisitt.** Finnes ingen tekst på noen kilde, skriver
`sakKompaktKortHtml()` (tidligere `sakMerInfoHtml()`, inlinet i Prioritet 71.2 sin
sakslayout — samme `sakKildeTekster()`-kilde, uendret regel) «Ingen kommentar registrert
på kilden.» Det er et svar, ikke en tom seksjon.

## Prioritet 69 (2026-09-15) — Oppstart er en statusflate

**Appen åpnes kun gjennom `oppstartApne()`.** `loaded = true`, `subscribeLiveSync()`,
første `render()` og `runDatabaseCheck()` ligger der — ikke i `loadAll()`. `loadAll()`
avslutter med `oppstartFullfor()`, som avgjør fasen: `klar` (åpnes automatisk),
`advarsel` (bruker velger), `stoppet` (åpnes ikke) eller `krasj`. Ikke sett
`loaded = true` noe annet sted.

**Kjøretøy-raden har ingen egen sannhet.** `oppstartMerkVehicles()` speiler
`vehiclesLoadStatus`. `lesefeil` → fase `stoppet`: Dashboard og Biloversikt åpnes ikke,
kun «Last på nytt» og (admin) «Database status». Ingen «åpne likevel» ved lesefeil.

**Kun reell status.** Rader som ikke har startet vises dempet uten «Laster…». Ingen
prosent, ingen fremdriftslinje, ingen KPI-er eller dashboarddata før appen er åpnet.
«Airtable svarer tregt» vises først når en faktisk lesing har pågått i 6 s.

**`oppstartMerk()` kalles inne i datasettenes `try`, og kaster aldri.** En visningsfeil
skal ikke kunne havne i `catch` og gjøre en vellykket lesing om til en tom liste.

**Nytt datasett på oppstartsskjermen:** legg det i `OPPSTART_STEG` og kall
`oppstartMerk(key, 'laster'|'lastet'|'feil')` rundt den eksisterende lesingen. Ingen
annen kode skal endres.

**Versjonen leses, den vedlikeholdes ikke i oppstartsskjermen.**
`hentOppstartVersjon()` bruker høyeste `bilpark-vNN` fra `caches.keys()` og
`storageAirtableInfo.versjon` kun som visningsinformasjon. Den tvungne
versjonskontrollen bruker i tillegg den kodebundne `APP_VERSION` i
`version-check.js` og krever eksakt samsvar med `version.json`.

## Prioritet 69.3 — Sjåførkontroll åpen igjen (2026-09-16)

Den midlertidige vedlikeholdssperren er fjernet. Det finnes ingen
`SJAFORKONTROLL_SPERRET`-bryter eller `sjaforkontrollSperret()`-portvakt i koden.
P69.2 sin `version-check.js` er fortsatt eneste globale inngangssperre: ved
`VERSION_MISMATCH` eller manglende `version.json`-verifisering starter ikke normal
drift.

## Prioritet 70 — Samlet Verksted og Verkstedhistorikk (2026-09-16)

**Varig regel: All planlegging og aktive bestillinger samles under 🔧 Verksted, og all historikk under 📋 Verkstedhistorikk.**
Separate arbeidsflater for Service og Dekkskift er faset ut.

**Fem standardiserte verkstedtyper håndteres likt:**
- `service` (Service)
- `dekkskift` (Dekkskift)
- `reparasjon` (Reparasjon)
- `eu-kontroll` (EU-kontroll)
- `annet` (Annet)

**Arbeidsflyt og ett-klikks fullføring:**
- Aktiv sak → Godta → Under oppfølging → Verkstedbestilling → «✅ Utført arbeid» (`fullforVerkstedbestilling`).
- Ingen mellomliggende verkstedstatuser («Må bestilles», «På verksted», etc.).
- Ved trykk på «✅ Utført arbeid» merkes bestillingen med `utfort = true` og `utfortDato = todayISO()`, og flyttes direkte til `Verkstedhistorikk`. Eventuell koblet sak fullføres automatisk via `markerSakUtfort()`.

**Kostnadsisolering:**
- Kostnader registreres og håndteres KUN under `💰 Kostnader` (`screen === 'kostnadsoversikt'`).
- Verksted-modulen viser kun statusmerke `✅ Kostnad registrert` eller `⚠️ Kostnad mangler` basert på om kostnadspost er opprettet.

---

## Prioritet 71 (2026-09-17) — 🔔 Varslingssenter erstatter Påminnelser, «Kommende frister» fjernet, marker-som-sett/48-timersregel, sveip-tilbake-regresjon rettet

Bestilling: «Påminnelser» var i praksis KUN aktive varsellamper (screen `'varsler'` →
`renderVarslerOversikt()`), mens flere andre varseltyper (nye kommentarer, km-avvik,
service/EU-kontroll som nærmer seg, verkstedoppfølging, forfalt saksoppfølging) enten var
usynlige, eller vist spredt/duplisert flere steder (Dashboard, Aktive saker, Verksted). Mål:
ETT sted for alt som krever oppmerksomhet, med en reell «marker som sett»-mekanikk slik at
0 varsler faktisk er oppnåelig — men uten at et glemt problem kan forsvinne permanent.

**Varig regel: et varsel har ALDRI en egen datamodell.** `beregnVarslingssenterListe()`
bygger hele listen LIVE, hver render, utelukkende fra eksisterende kilder:
`nyeKommentarerListe()` (ulest), `kmAvvikForVehicle(v)` (Prioritet 66.2, tidligere KUN
tilgjengelig via `window.rapporterKmAvvik()` i konsollen), `vehicleServiceStatus(v)`/
`vehicleEuKontrollStatus(v)` (kun når IKKE allerede en aktiv planlagt time/verkstedtime —
samme «regel 2/3»-dempingsprinsipp Dashboard sitt «Krever handling nå» allerede brukte),
`sakFase(s)`/`sakOppfolgingStatus(s)` (verkstedoppfølging, nye skader, forfalt oppfølging)
og `allActiveVarsellys()`. Konsekvens: et varsel forsvinner AUTOMATISK i det den
underliggende årsaken er løst (varsellampe kvittert, sak lukket, kommentar lest, km
rettet) — det finnes ingen «avslutt varsel»-handling å holde synkronisert med resten av
appen, og ingen risiko for at varslingssenteret kommer ut av synk med den faktiske saken.

**Marker som sett — ny, egen tilstand, adskilt fra hver kildes eget «løst»-begrep.**
`varselSett` er et nytt, minimalt `{varselId: sistSettISO}`-kart, lagret som ÉN JSON-blob i
den eksisterende Settings-tabellen (nøyaktig samme mønster som `standardVerksted`/
`bilkategorier` — INGEN ny Airtable-tabell, INGEN `LIST_TABLES`-endring, INGEN endring i
`storage.airtable.js` i det hele tatt, derfor uendret `versjon`/`?v=`). `varselId` er en
deterministisk, syntetisk nøkkel per varseltype+kilde (`'km:'+vehicleId`,
`'sak:'+sakId`, `'vl:'+varsellysId`, `'kommentar:'+kilde+':'+id`, osv.) — IKKE en egen
rad i noen tabell. `varselErSkjult(id)`/`markerVarselSett(id)`/`markerAlleVarslerSett(...)`
er de tre eneste funksjonene som leser/skriver dette kartet.

**48-timersregelen (ferdigkrav 4):** et varsel merket «sett» er skjult fra aktiv visning og
fra alle røde tellere i 48 timer (`VARSEL_SKJUL_TIMER`), deretter beregnes det på nytt som
om det aldri var sett. Siden varselet uansett slutter å bli generert i det øyeblikket den
faktiske årsaken er løst, er det ALDRI nødvendig å sammenligne mot en «fingeravtrykk» av
forrige tilstand for å avgjøre om det er «samme» eller et «nytt» problem — bare tiden siden
`sistSett` avgjør. Verifisert med direkte tidsforskyvning i `varselSett` (47 t → fortsatt
skjult, 49 t → synlig igjen).

**Åtte kategorier, én rekkefølge (`VARSLINGSSENTER_KATEGORI_ORDER`):** Nye kommentarer →
Nye skader → Verkstedoppfølging → Påminnelser (forfalt saksoppfølging) → Varsellamper →
Service nærmer seg → EU-kontroll → Km-grense passert. Et bevisst valg: «Nye skader» dekker
KUN saker i fase «Aktiv sak» med `caseType === 'skade'` — andre nyregistrerte sakstyper
(kontrollavvik, «annet») får IKKE en tilsvarende «ny»-varsling her, siden Aktive saker sin
egen «Aktiv sak»-fane allerede er stedet for triage av alt nytt, og målet var å FJERNE
duplisert varsling, ikke innføre en ny.

**Varsellampe kvittering historikk er UENDRET og BEVART**, som egen seksjon nederst på
samme skjerm (samme funksjoner: `varsellysHistorikkRow()`, `deleteVarsellysHistorikk()`,
`deleteSelectedVarsellysHistorikk()`, `vlhOpenVehicles`/`vlhSelectedIds`) — dette er
fortsatt eneste sted en administrator kan revidere/slette kvitterte varsellamper, og var
aldri en del av «for mye støy»-problemet (kvitterte varsler var allerede skjult fra aktiv
visning). **Avløst 2026-09-22:** kvitteringshistorikken vises ikke lenger i Varslingssenteret. Kvitterte lamper ligger i bilens Varsellamper-historikk. Varsellampe-rader i selve varslingssenteret har fortsatt en direkte
«✅ Merk som løst»-knapp (`kvitterVarsellys()`, uendret) ved siden av «Marker som sett» —
de to handlingene er bevisst forskjellige: kvittering løser varselet permanent, «marker som
sett» skjuler det midlertidig i 48 timer uten å røre `varsellys[]`.

**Fjernet, dødt kodesporhold rundt det gamle skjermnavnet:** `toggleVarslerVehicle()` og
`varslerOpenVehicles` (per-bil-accordion for aktive varsellamper) er fjernet — den flate,
kategoriserte listen trenger ingen per-bil-utvidelse. `renderVarslerOversikt()`/
`attachVarslerOversiktListeners()` (funksjonsnavn og screen-nøkkelen `'varsler'`) er BEVISST
IKKE omdøpt, for å unngå å måtte røre `goTo()`, `OVERSIKT_SWIPE_BACK_SCREENS`,
sidebar-/drawer-navigasjonen og de to dashboard-klokkeknappene bare for et internt navn —
alt brukervendt (meny-etiketter, skjermtittel, `title`-attributter) er endret, ingenting
internt som ikke påvirker brukeren er rørt unødvendig.

**Badge-tall — én kilde, fire visningssteder.** `varslingssenterAntall()` (antall AKTIVE,
altså ikke-skjulte varsler) erstattet `allActiveVarsellys().length` i alle fire steder som
tidligere viste et «Påminnelser»-tall: desktop-sidebarens badge, den nye badge-en på
drawer-menyens punkt (fantes ikke tidligere — «Påminnelser» hadde ingen teller i ☰ Meny),
og begge dashboard-klokkeknappene (mobil og desktop). Alle fire kan derfor aldri vise
forskjellige tall for samme tilstand.

**Ferdigkrav 1 — «Kommende frister» fjernet.** Kun det bokstavelig navngitte elementet: en
egen fjerde KPI-flis på mobil-Dashboard (`d.kommendeFristerAntall`, lenket til Kalender).
Grid-klassen på den raden er endret fra `.dash40-grid4` (fire kolonner) til den allerede
eksisterende `.dash40-grid3` (samme klasse desktop sin KPI-rad bruker siden Prioritet
62.1) — ingen ny CSS. `kommendeFristerAntall` er fjernet fra `dashboardBeregning()` sitt
returobjekt og fra destruktureringen i `renderDashboard()` (død kode, ingen gjenværende
kallesteder). **Panelet «📋 Kommende oppgaver»** (desktop og mobil, samme
`kommendeOppgaveRadHtml()`) er BEVISST IKKE fjernet — det er et annet, mer detaljert
element med et annet navn, allerede lenket videre til Kalender, og var ikke selve
gjenstanden for ferdigkravet. Vurder som egen sak dersom brukeren mener også dette panelet
bør bort.

**Ferdigkrav 5 — sveip-tilbake, reell regresjon funnet og rettet.** Selve
berøringslogikken (`touchstart`/`touchmove`/`touchend` på `document`,
`OVERSIKT_SWIPE_BACK_SCREENS`-hvitelisten) var internt konsistent og korrekt koblet — INGEN
feil i selve algoritmen. Den faktiske regresjonen: `OVERSIKT_SWIPE_BACK_SCREENS` inneholdt
fortsatt kun den gamle screen-verdien `'historikk'`, mens Verkstedhistorikk i praksis
navigeres til med screen-verdien `'verkstedhistorikk'` (se `data-desktop-nav`/
`drawerItemHtml`-kallene) — sveip-tilbake har dermed ALDRI virket på Verkstedhistorikk,
selv om skjermen ellers oppfører seg som enhver annen underside. `'kalender'`, `'bestill'`
og `'kommentaroversikt'` var av samme grunn (skjermer lagt til etter at hvitelisten sist ble
oppdatert) også utelatt. Alle fire er lagt til. Verifisert direkte i nettleseren
(`OVERSIKT_SWIPE_BACK_SCREENS.includes('verkstedhistorikk')` osv.), ikke bare ved
kodelesing. Ingen endring i selve berøringshåndteringen (kant-sone, terskel, animasjon).

**Testet, i faktisk kjørende kode mot en reell (produksjons-)Airtable-base, ikke bare
kodelesing** (`window.storage.set` midlertidig patchet til en no-op i nettleserkonsollen
under testing, slik at ingen skriving nådde Airtable): innlasting uten konsollfeil,
Dashboard/Mobil Hjem rendrer korrekt med `.dash40-grid3`, Varslingssenter viser 16 reelle
varsler korrekt gruppert i kategorier (inkl. 6 ekte km-avvik som tidligere kun var synlige
via `window.rapporterKmAvvik()`), `markerVarselSett()` fjerner ett varsel og reduserer
tallet med nøyaktig én, 47/49-timers grensetest for gjenoppdukking bestått,
`markerAlleVarslerSett()` bringer tallet til nøyaktig 0 og full tilbakestilling gjenoppretter
det opprinnelige tallet, «Åpne sak» navigerer korrekt til riktig fane i Aktive saker,
`OVERSIKT_SWIPE_BACK_SCREENS` bekreftet oppdatert. `node --check` var ikke tilgjengelig i
denne økten (ikke installert) — syntaksgyldighet er i stedet bekreftet ved at hele appen
faktisk lastet og kjørte i en ekte nettleser via en lokal statisk server.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi),
`sw.js` (`CACHE_VERSION` bilpark-v83 → bilpark-v84), `version-check.js`
(`APP_VERSION` 83 → 84) og `version.json` (`"version"` 83 → 84) — app-shell-innhold endret
betydelig, og Prioritet 69.2/69.3 sin tvungne versjonskontroll krever at disse to siste
alltid oppdateres sammen. **`storage.airtable.js` er IKKE endret** — ingen nye
Airtable-felt, ingen `LIST_TABLES`-endring (`varselSett` er en frittstående Settings-blob,
samme unntak som `standardverksted`/`dashboard-layout`, se Prioritet 61) — derfor uendret
`versjon`/`?v=2.16.0`.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll (`submitKontroll()`), `v.km`-
skriveregler, saksmotoren (`sakErApen()`/`sakFase()`/`sakKreverHandlingSamletMaster()` er
KUN lest, aldri endret), Verksted/Verkstedhistorikk (Prioritet 70), Kommentarer 2.0
(Prioritet 50/52 — `nyeKommentarerListe()`/`markerKommentarSomLest()`/`kommentarer[]` er
uendret; Varslingssenter LESER denne listen, men innfører ingen egen kommentarlogikk),
Layout Editor-mekanikken for øvrig, Bilkategorier, PWA/manifest-ikonfilene.

**Kjente, dokumenterte begrensninger:**
- `varselSett` er, som `dashboard-layout`/`standardverksted`, IKKE registrert i
  `reloadOne()` sin bakgrunnspoll — et «sett»-merke satt på én enhet dukker derfor ikke opp
  som skjult på en annen enhet før neste fulle reload/innlogging der. Samme begrensning
  disse to Settings-blobbene allerede hadde; ikke en ny svakhet introdusert her.
- «Nye skader» og «Verkstedoppfølging» leser kun `aktiveSaker` — en skade registrert
  UTENFOR saksmotoren (finnes ikke i dagens datamodell) ville ikke fanges opp. Ikke en
  reell begrensning i dag, men verdt å huske dersom skaderegistrering noen gang skulle få
  en egen, sakløs vei.
- Km-grense-varselet (`kmAvvikForVehicle()`) forblir en REN RAPPORTERINGSFUNKSJON — å vise
  det i Varslingssenter endrer ingenting ved at retting fortsatt utelukkende skjer manuelt
  via Rediger informasjon (Prioritet 66/66.2). Dette var en bevisst videreføring, ikke en
  forglemmelse.

---

## Prioritet 71.5 (2026-09-17) — Opprydding saksmotor og ny operativ bilprofil

Bestilling: to deler. (1) Den gamle saksbehandlingsveiviseren («Avansert redigering» /
«Vurder sak» / «Fortsett saken» / «Slett saken») skulle fjernes helt — saksbehandling skal
kun skje gjennom Godta / Avslå / Registrer verksted / Utført uten verkstedbesøk, ingen
alternativ arbeidsflyt. (2) Kjøretøyprofilen skulle bygges rundt operativ informasjon
(km-stand, sist service, EU-status, mobilitetsgaranti, aktiv sjåfør) synlig UTEN scrolling,
med Service → Utført arbeid automatisk oppdaterende bilen, Kjøretøydetaljer komprimert
horisontalt, en egen Verkstedhistorikk-fane og en enklere Historikk-fane.

**Kartlegging (før implementering, kun kodelesing — ingen antakelser):**

1. Alt av «Avansert redigering»/«Vurder sak»/«Fortsett saken»/«Slett saken» lå utelukkende i
   Aktive Saker sitt render-/lytter-lag: `sakKompaktKortHtml()` (togglet redigeringspanelet),
   `sakFaneListeHtml()` (rendret `sakWizardHtml()` under den horisontale kortraden når en sak
   var «under redigering»), og selve veiviseren
   (`sakWizardHtml`/`sakWizardSteg1-4Html`/`sakWizardLesemodusHtml`/`sakWizardProgressHtml`/
   `avvikRadHtml`) pluss mutasjonene bak den
   (`toggleEditSak`/`submitSakWizardVurdering`/`submitSakWizardOppfolging`/
   `submitSakWizardKommentar`/`submitSakWizardFullfor`/`reapneSak`/`deleteSak`/
   `markerAvvikUtfort`/`sakOppdaterStatusEtterAvvik`/`sakAlleAvvikFerdig`). Ingenting av dette
   ble referert fra `renderBilkort()` eller noe annet sted i appen — fjerningen er derfor
   fullstendig avgrenset til disse to områdene. `sakAvvikAktive()` er BEVISST beholdt — den
   brukes fortsatt av den kompakte sakoverskriften (`sakKortOverskrift()`), som IKKE er en
   del av den fjernede veiviseren.
2. `fullforVerkstedbestilling()` (Prioritet 70) satte allerede `t.utfort=true`, men opprettet
   ALDRI en `servicehistorikk`-oppføring for en fullført verkstedtime av typen `'service'` —
   dette var selve rotårsaken bak «må registreres manuelt på bilen». `vehicleSisteService()`/
   `vehicleServiceStatus()`/`vehicleMobilitetsgaranti()` leser utelukkende `servicehistorikk`,
   aldri `verkstedtimer` direkte.
3. `verkstedtimer` (`WorkshopAppointments`) har ingen `km`-felt, og «Ny verkstedtime»-skjemaet
   ber aldri om kilometerstand — ett-klikks fullføring (`data-fullfor-vt`) har ingen egen form.
   Løsning: bruk `v.km` direkte som kilometerstand for den auto-opprettede
   servicehistorikk-raden — `v.km` er allerede appens live-oppdaterte, autoritative
   kilometerstand fra siste sjåførkontroll (Prioritet 43/66), akkurat slik ticket-tillegget om
   KM-stand ber om («ikke manuelt vedlikeholdt verdi dersom nyere kontrolldata finnes»).
4. `renderBilkort()` sin «Skader»-stat-flis (`.profil-stat4`) hadde `data-profil-fane="skader"`
   — men `'skader'` var ALDRI en nøkkel i `PROFIL_FANER` eller `faneBody`. Flisen var altså
   klikkbar, men landet stille tilbake på Oversikt-fanen igjen — en reell, eksisterende bug,
   ikke noe jeg innførte. `skadeBody` (aktive/fikset-sub-accordion) fantes ferdig bygget, men
   var uten en fungerende inngang. Løst ved å legge Skader inn som en av de fire nye
   underseksjonene i Historikk-fanen (se punkt 6 i bestillingen) og re-koble flisen dit.

**Løsning — Del 1 (saksmotor):**

- Alle elleve funksjonene i kartleggingens punkt 1 er slettet, sammen med de tilhørende
  DOM-lytterne (`data-toggle-edit-sak`, `data-goto-wizard-steg`, `data-marker-avvik-utfort`,
  `swz-delete-*`/`swz-reapne-*`/`swz-vurdering-lagre-*`/`swz-vt-btn-*`/`swz-oppf-*`/
  `swz-kommentar-*`/`swz-lagre-uten-lukk-*`/`swz-lukk-*`) og state-variablene
  (`editingSakId`, `sakWizardStep`, `sakWizardSaving`, `sakWizardVtOpen`,
  `sakWizardOppfolgingOpen`, `sakWizardKommentarOpen`) — inkludert referansene til dem i
  `goTo()` sin skjerm-reset og i `goToSakDetalj()`, som tidligere åpnet veiviseren automatisk
  ved dyplenking til en sak (fjernet — `goToSakDetalj()` navigerer nå kun til riktig
  fane/bilgruppe, uendret ellers).
- `sakKompaktKortHtml()` viser nå KUN sakstype/sjekkliste/beskrivelse/registrert av/dato og
  fasens ene handlingsknapp — ingen «Avansert redigering»-lenke lenger.
- **Kjent, bevisst konsekvens (ikke løst, ikke bedt om løst):** kostnadsregistrering
  (`estimatedCost`/`actualCost`/`requiresProvision`/`provisionMonth`/`provisionAmount`) skjedde
  UTELUKKENDE i den fjernede veiviserens Steg 4. Ingen gjenværende UI setter disse feltene
  lenger. Kostnadsoversikt/Kostnadsrapport leser dem fortsatt uendret der de historisk finnes
  (viser «Ingen kostnad registrert» for nye saker) — ingen kode er fjernet på lesesiden, kun
  skrivesiden forsvant sammen med veiviseren. Dette var et eksplisitt, akseptert bytte
  («Ingen alternative arbeidsflyter»), ikke en forglemmelse.

**Løsning — Del 2 (Service oppdaterer bilen automatisk):**

- Nytt felt `WorkshopAppointments.mobilitetsgarantiAktivert` (Airtable-kolonne
  `MobilitetsgarantiAktivert`, boolsk), registrert i `LIST_TABLES.verkstedtimer` i
  `storage.airtable.js` SAMTIDIG som det tas i bruk (feltregelen fulgt) —
  `storage.airtable.js` `versjon` v2.16.0 → v2.17.0, `?v=` i `index.html`/`kontroll.html` til
  2.17.0. **Krever en ny Airtable-kolonne før idriftsettelse** — se AIRTABLE_MIGRATION.md.
- Ny, betinget avkrysningsboks «🛟 Mobilitetsgaranti inkludert i denne servicen» i «Ny
  verkstedtime»-skjemaet, vist KUN når `vtPrefillType === 'service'` (dvs. skjemaet nådd via
  «➕ Bestill tjenester» → Service). Fanget opp i `submitAddVT()` og lagret på selve
  verkstedtimen.
- `fullforVerkstedbestilling()` oppretter nå automatisk én `servicehistorikk`-oppføring når
  den fullførte verkstedtimen er av typen `'service'` (`vtHarType(t,'service')`): kilometerstand
  fra `v.km`, type fra `t.beskrivelse`, verksted fra `t.verksted`, kommentar fra `t.notater`,
  `fraVerkstedtimeId` for sporbarhet (samme mønster som `fraPlanlagtServiceId` i
  `fullforPlanlagtService()`), og `mobilitetsgarantiAktivert` videreført fra verkstedtimen.
  Lagringen er beskyttet av samme snapshot/rollback-mønster som funksjonen allerede brukte for
  `verkstedtimer`/`aktiveSaker` — feiler lagringen, rulles ALT (inkludert den nye
  servicehistorikk-raden) tilbake lokalt, og brukeren varsles.
- `vehicleMobilitetsgaranti()` har fått en TREDJE, uavhengig kilde: siste
  `servicehistorikk`-rad med `mobilitetsgarantiAktivert === true`, +12 måneder — SAMME
  «nyeste dato av alle kilder vinner»-prinsipp som allerede gjaldt mellom det navnebaserte
  Mekonomen-signalet og den manuelle fritekstdatoen. Alle tre kilder sameksisterer uendret.
- `samletVerkstedHistorikk()` sin postbygging er skilt ut UFILTRERT i en ny funksjon,
  `samletVerkstedHistorikkAlle()` — dette løser en reell duplikat-risiko: uten en
  de-duplisering ville en service fullført via Verksted-modulen vist seg TO GANGER i
  Verkstedhistorikk (én gang fra `verkstedtimer` sin `utfort`-kilde, én gang fra den nye,
  auto-opprettede `servicehistorikk`-raden). Løst ved at `servicehistorikk`-kilden hopper over
  enhver rad som har `fraVerkstedtimeId` satt — den er allerede representert via
  `verkstedtimer`-kilden. Manuelt registrerte servicer (via den eldre, fortsatt eksisterende
  `submitService()`) har ALDRI `fraVerkstedtimeId` og vises uendret.

**Løsning — Del 3 (ny operativ toppseksjon, fem kort):** ny `.profil-stat5`-seksjon (samme
kortstil/token-bruk som den eksisterende `.profil-stat4`, kun fem kolonner med responsiv
nedtrapping 5→3→2) satt inn i `renderBilkort()` rett under identitetslinjen (og under
ute-av-drift-banneret når det vises) — FØR den eksisterende `.profil-stat4`
(Kontrollstatus/Varsellamper/Skader/Aktive saker), som er UENDRET og beholdt (bestillingen ba
ikke om å fjerne den, og Prioritet 65 etablerte den som nødvendig operativ informasjon).
Fem kort, ingen av dem beregner noe nytt:

| Kort | Verdi | Undertekst |
|---|---|---|
| 🚗 Km-stand | `v.km` | «Oppdatert fra siste kontroll» |
| 🔧 Sist service | `vehicleSisteService(v.id).dato` | dager siden (`isoDateDiff`) |
| 🚦 EU-kontroll | `v.euGodkjentTil` | dager igjen/forfalt (fra `vehicleEuKontrollStatus()`) |
| 🛟 Mobilitetsgaranti | Aktiv/Utløpt/Registrert/Ingen | gyldig til-dato (fra `vehicleMobilitetsgaranti()`) |
| 👤 Aktiv sjåfør | `vehicleAktivSjafor()` | sist kontrollert av / «Kjører nå» |

**Løsning — Del 4 (Kjøretøydetaljer komprimert):** `bilkortAccordionRow('detaljer', …)` sitt
innhold er erstattet med en ny, kompakt `.detalj-grid`/`.detalj-rad`-struktur (to kolonner av
horisontale label:verdi-rader, én kolonne på mobil) med EKSAKT de seks feltene ticket-en ba om,
i den rekkefølgen: Reg.nr, Løyvenummer, Driftslag, Drivstoff, Årsmodell, Telefon. Kategori,
Bilgruppe, Merke/modell, Biltype, Kilometerstand, Mobilitetsgaranti og «Sist kontrollert av»
er fjernet fra denne seksjonen — de tre sistnevnte fordi de nå vises i den nye toppseksjonen
(Del 3) eller identitetslinjen, de øvrige fordi ticket-ens feltliste var eksplisitt og ikke
inkluderte dem. Ingen av de underliggende dataene er slettet eller skjult andre steder i appen
(Kategori/Biltype styrer fortsatt Biloversikt-gruppering som før).

**Løsning — Del 5 (📋 Verkstedhistorikk som egen fane):** ny fane lagt til i `PROFIL_FANER`
mellom Historikk og Dekk (Oversikt → Historikk → Verkstedhistorikk → Dekk → Kostnader — Dekk
er beholdt, ticket-en ba ikke om å fjerne den). Bruker den nye `samletVerkstedHistorikkAlle()`
filtrert på `vehicleId` — nøyaktig samme tre kilder (fullførte verkstedtimer, servicehistorikk,
dekkhistorikk) som den frittstående Verkstedhistorikk-skjermen, ingen parallell historikkmotor.

**Løsning — Del 6 (Historikk-fanen forenklet):** `HISTORIKK_SUB_ORDER` endret fra
`['tidslinje', 'nokkeltall', 'kontroll']` til `['kontroll', 'skader', 'kommentarer',
'varsellamper']`. `kontrollBody`/`skadeBody` er UENDRET og gjenbrukt uendret (`skadeBody` er nå
faktisk nåbar, se kartleggingens punkt 4). To nye underseksjoner: `kommentarerBody` (bygget fra
`nyeKommentarerListe(v.id)`/`nyeKommentarRadHtml()` — samme delte kilde/markup som
Kommentaroversikt, med «✅ Marker som lest» siden Kjøretøyprofilen er en administratorvisning)
og `varsellamperBody` (aktive + historiske varsellamper for bilen, `varsellysCard()` — samme
komponent som allerede brukes i «Rediger informasjon»-panelet). De delte funksjonene/
konstantene som tidligere kun matet Tidslinje/Nøkkeltall (`vehicleHistorikkTidslinje()`,
`HISTORIKK_TYPE_ORDER`/`LABEL`/`IKON`, `bilkortHistorikkItem()`) er IKKE fjernet fra koden —
de er fortsatt i aktiv bruk av den separate, flåtebrede Historikk-huben
(`renderHistorikk()`/`flateHistorikkTidslinje()`), kun bruken INNI `renderBilkort()` er fjernet.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi),
`storage.airtable.js` (`versjon` v2.16.0 → v2.17.0 — nytt felt
`WorkshopAppointments.mobilitetsgarantiAktivert`), `sw.js` (`CACHE_VERSION` bilpark-v88 →
bilpark-v89), `version-check.js` (`APP_VERSION` 88 → 89), `version.json` (`"version"` 88 → 89),
`AIRTABLE_MIGRATION.md` (nytt felt dokumentert, pluss en ærlighetsnotis om at resten av filens
brødtekst stammer fra en eldre, ikke fullstendig re-konsolidert gjennomgang).

**Testet:** grep-basert verifisering av at INGEN kode fortsatt refererer de fjernede
funksjonene/variablene (`editingSakId`, `sakWizardStep`, `toggleEditSak`, `deleteSak`,
`sakWizardHtml` m.fl. — kun kommentartekst, ingen kjørende kode, gjenstår), og en global
brace-/backtick-balansesjekk på hele `index.html` (5178 åpne = 5178 lukkede krøllparenteser,
partall antall backticks) som svak, men konsistent signal på syntaktisk integritet. **`node`
var ikke tilgjengelig i denne økten (verken via bash eller PowerShell) og ingen nettleser ble
brukt til å faktisk laste appen** — i motsetning til flere tidligere prioriteter i denne filen
er dette derfor IKKE verifisert i en kjørende nettleser mot en ekte eller mock-Airtable-base.
Hver endrede funksjon/mal er i stedet lest i sin helhet før og etter redigering for å bekrefte
strukturell korrekthet (balanserte maler, riktige avhengigheter, ingen temporal-dead-zone-feil
av typen Prioritet 66.3). **Anbefalt før idriftsettelse:** åpne appen i en nettleser (mock-
eller ekte Airtable), bekreft at Kjøretøyprofilen rendrer uten konsollfeil, test Godta/Avslå/
Registrer verksted/Utført uten verkstedbesøk på en reell sak, fullfør en service-type
verkstedtime og bekreft at «Sist service»-kortet og Verkstedhistorikk oppdateres uten
duplikater, og legg til `MobilitetsgarantiAktivert`-kolonnen i Airtable før noen krysser av
den nye avkrysningsboksen (uten kolonnen vil Airtable enten avvise skrivingen eller stille
ignorere feltet, avhengig av API-oppførsel — ikke verifisert her).

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll (`submitKontroll()`), `v.km`-skriveregler,
`sakErApen()`/`sakFase()`/`sakOppfolgingStatus()`/`sakKreverHandlingSamletMaster()` (kun lest,
aldri endret), Varslingssenter (Prioritet 71), Layout Editor, Bilkategorier, `renderVerksted()`/
`renderVerkstedhistorikk()` (den frittstående skjermen — kun dens interne postbygging er delt ut
til en ny, gjenbrukt funksjon, ingen atferdsendring der), PWA/manifest-ikonfilene.

**Kjente, dokumenterte begrensninger:**
- Kostnadsregistrering på en sak (estimert/faktisk kostnad, avsetting) har ingen gjenværende
  inngang noe sted i appen — se Del 1 over. Vurder som egen, separat sak dersom dette
  fortsatt trengs et sted (f.eks. et nytt, dedikert kostnadsfelt direkte på
  Verksted-registreringen, utenfor sakflyten).
- `fullforVerkstedbestilling()` sin auto-opprettede servicehistorikk-km er alltid `v.km` på
  fullføringstidspunktet — er bilen kjørt videre mellom verkstedtimen ble BESTILT og faktisk
  UTFØRT, reflekterer ikke km-tallet nødvendigvis kilometerstanden PÅ SELVE verkstedbesøket,
  kun «siste kjente km når noen trykket Utført arbeid». Samme presisjonsnivå som resten av
  appens km-regler (ingen ny svakhet).
- Ikke testet i en faktisk kjørende nettleser i denne økten (se «Testet» over) — kun statisk
  lese-/strukturverifisering.

---

## Prioritet 71.6 (2026-09-17) — Verkstedopprydding og smartere filtrering

Bestilling: fem delmål — slette feilregistrerte verkstedbesøk, en ny fast verkstedtype
«Reparasjon», en horisontal enkeltvalgt verkstedtype-velger, horisontale
varselkategori-faner i Varslingssenter, og hurtigfiltrering (alltid ufiltrert ved åpning,
pluss «Kontrollert»/«Ikke kontrollert»-snarveier) på Biloversikt.

**Kartlegging (før implementering, kun kodelesing) — funnet, IKKE antatt:**
1. `deleteVT()` fantes allerede og virket for BÅDE aktive og fullførte verkstedtimer (ingen
   `t.utfort`-sperre i funksjonen) — den manglet kun en synlig inngang i den frittstående
   Verkstedhistorikk-skjermen (`renderVerkstedhistorikk()`), som viste poster uten noen
   handlingsknapper i det hele tatt. `deleteService()` fantes tilsvarende. **`dekkhistorikk`
   (dekkskifter) hadde derimot INGEN slettefunksjon noe sted i koden** — måtte bygges fra
   bunnen, samme mønster som de to andre.
2. Verkstedtype-registrering var allerede delvis strukturert (`WorkshopAppointments.Type`,
   lest av `vtHarType()`), men bygget rundt to UAVHENGIGE avkrysningsbokser
   («🚦 EU-kontroll»/«💥 Ruteskift», Prioritet 46) pluss en stille fallback til
   `vtPrefillType` for service/dekkskift/reparasjon/annet. **Reell, eksisterende bug
   funnet:** `vtEuForhandskrysset`/`vtRuteskiftForhandskrysset` (variablene som skulle
   forhåndskrysse boksene fra en Bestill-snarvei) ble ALDRI satt til `true` noe sted i
   koden — kun deklarert og nullstilt. Konsekvens: `bestillEuKontroll()`/
   `bestillRuteskift()` satte riktig `vtPrefillType`, men siden `'eu-kontroll'` ikke stod i
   fallback-allowlisten (`['service','dekkskift','reparasjon','annet']`) og
   `vtRuteskiftForhandskrysset` aldri var sann, endte disse to bestillingstypene i praksis
   nesten alltid opp som en udifferensiert, tom eller «reparasjon»-type i historikken med
   mindre brukeren manuelt tikket av boksen selv. `standardVerkstedForVtType()` hadde en
   tilsvarende svakhet: den leste kun de to boolean-forhåndskryssene, aldri
   `vtPrefillType` — så «Bestill Service»/«Bestill Dekkskift» sitt forslag til
   standardverksted traff aldri riktig verksted, kun det generelle «Reparasjon»-standardet.
3. `verkstedHistorikkType()` (som avgjør hvilken kategori en fullført verkstedtime havner i
   under Verkstedhistorikk) gjettet type fra fritekst i beskrivelse/notater for
   service/dekkskift/reparasjon, selv om det strukturerte feltet ofte allerede hadde riktig
   svar — kun EU-kontroll/Ruteskift ble lest strukturert.
4. Varslingssenteret (Prioritet 71) viste allerede sine åtte kategorier
   (`VARSLINGSSENTER_KATEGORI_ORDER`), men ALLE samtidig, stablet vertikalt — ingen
   fane-/filtermekanisme fantes.
5. Biloversikt (`renderRegister()`) hadde allerede et fullverdig filtersett
   (`filterSearch`/`filterKategori`/`filterKontrollStatus`/`filterLoyve`/
   `filterHovedstatus`), inkludert et eksisterende nedtrekksfilter for nøyaktig
   «Kontrollert i dag»/«Ikke kontrollert i dag» (`filterKontrollStatus`). Ingen av filtrene
   ble nullstilt ved generell navigasjon til siden (kun de tre deep-link-funksjonene
   `goToRegisterFiltered()`/`goToRegisterKategori()`/`goToRegisterHovedstatus()` nullstilte
   ALLE andre filtre før de satte sitt eget, bevisste — et etablert, korrekt mønster i seg
   selv). Et filter satt manuelt av brukeren og deretter forlatt (uten en av disse tre
   funksjonene) ble derfor stående til neste besøk.

**Løsning — Del 1 (slett verkstedbesøk):**
- Ny `deleteDekkhistorikk(id)` (index.html, samme `mutasjonMedRollback()`-mønster som
  `deleteService()`) — ingen andre entiteter refererer en dekkhistorikk-id, så mutasjonen er
  en ren splice+lagring uten den ekstra sak-/verkstedtime-referanseoppryddingen `deleteVT()`
  trenger.
- Ny dispatcher `deleteVerkstedHistorikkPost(compositeId)` i `renderVerkstedhistorikk()` sin
  poststrøm — leser prefikset på den sammensatte post-id-en fra `samletVerkstedHistorikkAlle()`
  (`'vt:'`/`'service:'`/`'dekk:'`) og delegerer til riktig, EKSISTERENDE slettefunksjon. Ingen
  parallell slettelogikk — samme tre funksjoner som allerede eide dataene.
- Bekreftelsesteksten er samordnet til «Er du sikker på at du vil slette dette
  verkstedbesøket?» på tvers av `deleteVT()`/`deleteService()`/`deleteDekkhistorikk()`
  (native `confirm()`/OK-Avbryt — ingen egen modal-komponent bygget for dette).
- 🗑️ Slett-knapp lagt til på hver post i `renderVerkstedhistorikk()`. Verksted (aktive
  bestillinger) hadde allerede en Slett-knapp i sin rediger-utvidelse (`vtCard()`), uendret.

**Løsning — Del 2/3 (Reparasjon + horisontal enkeltvalgt type-velger):**
- Ny `VT_TYPE_VELGER` (5 kanoniske type-id-er: `eu-kontroll`/`service`/`dekkskift`/
  `ruteskift`/`reparasjon`, med samme Lucide-ikoner som resten av appens ikontabell,
  Prioritet 58) erstatter de to uavhengige avkrysningsboksene i «Ny verkstedtime»-skjemaet.
  Radioknapper (`name="vt-type"`) med native enkeltvalg-oppførsel — «Kun én verkstedtype
  skal kunne velges» er dermed garantert av selve HTML-semantikken, ikke egen JS-logikk.
  Visuelt: `.vt-type-row`/`.vt-type-opt`, samme `:has(input:checked)`-mønster som den
  eksisterende `.chip-yn` (Ja/Nei-velgeren i sjåførkontroll).
- `standardVerkstedForVtType(valgtType)` og `vtBeskrivelseForslag(valgtType)` er begge
  skrevet om fra to boolean-parametre til ett enkelt type-id — `VT_TYPE_TIL_STD_TYPE` bygger
  broen til `STD_VERKSTED_TYPER` sine litt andre id-er (`'eu-kontroll'→'eu'`,
  `'dekkskift'→'dekk'`). Retter samtidig avviket fra kartleggingens punkt 2: Service og
  Dekkskift får nå et korrekt standardverksted-forslag, og EU-kontroll/Ruteskift-
  bestillinger fra Dashboard/Kjøretøyprofil/Bestill tjenester treffer nå pålitelig riktig
  type hver gang (`bestillRuteskift()` setter nå `vtPrefillType = 'ruteskift'` direkte i
  stedet for `'reparasjon'` + en kommentar-hint).
- Mobilitetsgaranti-avkrysningsboksen (kun relevant for type `service`, Prioritet 71.5)
  ligger nå ALLTID i DOM-en (skjult med CSS når valgt type ≠ `service`), slik at
  type-velgerens forslags-oppdatering kan bytte type uten en full `render()` — samme
  «ikke rør resten av skjemaet»-prinsipp som den eksisterende verksted-/beskrivelse-
  forslagslogikken allerede fulgte. `submitAddVT()` sperrer i tillegg boksen mot å smitte
  over på en annen type dersom brukeren krysser den av og deretter bytter type uten å
  fjerne krysset.
- `verkstedHistorikkType()` leser nå det strukturerte typefeltet for ALLE fem typer (ikke
  kun EU-kontroll/Ruteskift) — tekstgjetting fra beskrivelse/notater er beholdt som
  fallback UTELUKKENDE for eldre poster registrert før denne endringen. Verkstedhistorikk-
  skjermens type-filter har fått et nytt `Ruteskift`-alternativ.

**Løsning — Del 4 (Varslingssenter, horisontale kategori-faner):**
- Ny, ren visningstilstand `varslingssenterAktivKategori` (som `bilkortAktivFane` —
  ALDRI lagret, faller tilbake til første kategori med innhold når tom/ugyldig).
  `renderVarslerOversikt()` viser nå `.profil-tabs`/`.profil-tab` (samme understrekfane-
  komponent som Kjøretøyprofilen) med én kategori valgt om gangen, loggen for den valgte
  kategorien vist vertikalt under — i stedet for alle åtte kategorier stablet samtidig.
  `beregnVarslingssenterListe()`/`varslingssenterAktiveListe()`/`varslingssenterAntall()`
  (Prioritet 71) er UENDRET — kun presentasjonen av den samme listen er endret.
  Varsellampe-kvitteringshistorikken nederst på samme skjerm er urørt.

**Løsning — Del 5 (Biloversikt, ufiltrert åpning + hurtigfilter):**
- Ny, delt `resetRegisterFiltre()` nullstiller alle fem Biloversikt-filtre
  (`filterSearch`/`filterKategori`/`filterKontrollStatus`/`filterLoyve`/`filterHovedstatus`)
  pluss `showAddVehicleForm`. De tre eksisterende deep-link-funksjonene
  (`goToRegisterFiltered()`/`goToRegisterKategori()`/`goToRegisterHovedstatus()`) er
  refaktorert til å kalle denne i stedet for å duplisere nullstillingen tre steder — ingen
  atferdsendring der, kun DRY.
- De TRE generelle navigasjonsinngangene til Biloversikt (desktop-sidebarens
  `[data-desktop-nav]`, drawerens `[data-drawer-nav]`, mobilens `[data-mobilbunn]`) kaller nå
  `resetRegisterFiltre()` når målet er `'register'`, FØR `goTo()`. Dette er bevisst
  spesialtilfelle-håndtering i de tre generiske dispatcherne, ikke en endring i selve
  `goTo()` — en generell reset inne i `goTo()` ville kollidert med de tre
  deep-link-funksjonene, som setter sitt filter RETT FØR de selv kaller `goTo('register')`.
  Sveip-tilbake (`goBack()`) er bevisst UENDRET — å gå «tilbake» til Biloversikt fra en
  underside skal fortsatt gjenopprette filteret brukeren hadde, siden dette er en
  fortsettelse av samme arbeidsøkt, ikke et nytt besøk.
- To nye hurtigfilterknapper («✅ Kontrollert»/«⚠️ Ikke kontrollert») over filterraden på
  Biloversikt. Leser og skriver NØYAKTIG samme `filterKontrollStatus` som det eksisterende
  nedtrekksfilteret («Alle biler»/«Kontrollert i dag»/«Ikke kontrollert i dag») — ingen ny
  filtervariabel, ingen ny filtreringslogikk i `renderRegister()`. Togglebar (klikk på en
  aktiv knapp igjen nullstiller til «Alle biler»). De fire eksisterende filtrene
  (kategori/bil/status/løyvenummer) er uendret og fullt fungerende ved siden av.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi), `sw.js`
(`CACHE_VERSION` bilpark-v89 → bilpark-v90), `version-check.js` (`APP_VERSION` 89 → 90),
`version.json` (`"version"` 89 → 90). **`storage.airtable.js` er IKKE endret** — ingen nye
Airtable-felt, ingen `LIST_TABLES`-endring (verkstedtype lagres fortsatt i det allerede
registrerte `WorkshopAppointments.Type`-feltet, kun med én verdi i stedet for en
kommaseparert kombinasjon) — derfor uendret `versjon`/`?v=2.17.0`.

**Testet:** grep-basert verifisering av at ingen kode fortsatt refererer de fjernede
variablene `vtEuForhandskrysset`/`vtRuteskiftForhandskrysset` eller de gamle DOM-id-ene
`vt-eu-kontroll`/`vt-ruteskift`; en global brace-/backtick-balansesjekk på hele `index.html`
(5213 åpne = 5213 lukkede krøllparenteser, partall antall backticks); manuell gjennomlesning
av hver endret funksjon/mal før og etter redigering (`submitAddVT()`, `renderVerksted()`,
`attachVerkstedListeners()`, `renderVerkstedhistorikk()`, `attachVerkstedhistorikkListeners()`,
`renderVarslerOversikt()`, `attachVarslerOversiktListeners()`, `renderRegister()`,
`attachRegisterListeners()`, de tre navigasjons-dispatcherne). **I tillegg, i motsetning til
Prioritet 71.5: appen ble faktisk lastet i en ekte nettleser i denne økten**, via en
midlertidig lokal PowerShell-basert statisk fil-server (siden verken `node` eller `python`
var tilgjengelig i denne økten) — siden lastet uten konsoll-feil helt frem til innloggings-
skjermen (bekrefter at hele det utvidede JS-scriptet parses og kjører uten unntak, inkludert
alle nye topplevel-konstanter som `VT_TYPE_VELGER`), men videre UI-verifisering av de faktiske
skjermene (Verksted, Verkstedhistorikk, Varslingssenter, Biloversikt) var IKKE mulig uten
gyldige administrator-innloggingsopplysninger, som ikke var tilgjengelig i denne økten.

**Anbefalt før idriftsettelse:** logg inn som administrator og bekreft i en ekte nettleser:
(1) sletting av et verkstedbesøk fra både Verksted og Verkstedhistorikk fjerner riktig post
uten å påvirke andre; (2) den horisontale type-velgeren viser korrekt forhåndsvalgt type fra
alle fire Bestill-snarveiene (Service/EU-kontroll/Dekkskift/Ruteskift) og fra sakskortets
«Registrer verkstedtime»; (3) mobilitetsgaranti-boksen vises/skjules korrekt ved typebytte;
(4) Varslingssenterets kategori-faner viser riktig antall og riktig innhold per kategori;
(5) Biloversikt åpnes tomt/ufiltrert fra sidebar/drawer/mobil bunnmeny etter at et filter er
satt og siden forlatt, mens et dypt lenket filter (f.eks. fra Dashboard) fortsatt treffer
riktig; (6) de to hurtigfilterknappene toggler korrekt og holder seg synkronisert med
nedtrekksfilteret.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll (`submitKontroll()`), `v.km`-skriveregler,
saksmotoren (`sakErApen()`/`sakFase()`/`sakOppfolgingStatus()` kun lest, aldri endret),
`beregnVarslingssenterListe()`/`varselErSkjult()`/`markerVarselSett()` (Prioritet 71 — kun
PRESENTASJONEN i `renderVarslerOversikt()` er endret), Layout Editor, Bilkategorier,
Kjøretøyprofil (Prioritet 71.5, urørt utover at den gjenbruker de samme, uendrede
delete-/type-funksjonene indirekte via `vtHarType()`), PWA/manifest-ikonfilene.

**Kjente, dokumenterte begrensninger:**
- `deleteVerkstedHistorikkPost()` er kun koblet til den frittstående Verkstedhistorikk-
  skjermen (`renderVerkstedhistorikk()`) — Kjøretøyprofilens egen «📋 Verkstedhistorikk»-fane
  (Prioritet 71.5, `samletVerkstedHistorikkAlle()` filtrert på ett kjøretøy) forblir en REN
  VISNING uten slette-knapper, samme prinsipp som Dekk-/Kostnader-fanene der (Prioritet 65.2).
  Vurder som egen, separat sak dersom sletting også ønskes derfra.
- Verkstedtype-velgeren tillater fortsatt kun de fem kanoniske typene å velges for NYE
  verkstedtimer. Eldre poster med en kommaseparert kombinasjon (f.eks.
  `'eu-kontroll,ruteskift'`, mulig før denne endringen dersom brukeren manuelt tikket av
  begge de gamle boksene) leses fortsatt korrekt av `vtHarType()`, men kan ikke gjenskapes
  eller redigeres til en ny kombinasjon via skjemaet lenger — kun én type kan velges ved
  redigering av en NY registrering.
- Ikke UI-verifisert i en faktisk innlogget nettleserøkt i denne omgangen (se «Testet» over)
  — kun frem til innloggingsskjermen, pluss grundig statisk lese-/strukturverifisering.

---

## Prioritet 71.7 (2026-09-17) — Ringeliste-opprydding

Bestilling: tre delmål — fjern (i)-info-ikonet fra sjåførens Ringeliste, åpne skjermen med
kun 🟢 Aktive sjåfører synlig (de to andre gruppene lukket), og fest 🚚 Home Delivery/
🛟 Veihjelp i en fast bunnseksjon som alltid er tilgjengelig, uansett hvor langt brukeren har
scrollet. Mål: se aktive sjåfører, Home Delivery og Veihjelp umiddelbart, uten scrolling og
uten ekstra klikk.

**Kartlegging (før implementering, kun kodelesing):** `renderDriverRingeliste()` (Prioritet
71.3) hadde allerede nøyaktig den datastrukturen ticket-en beskriver — tre kollapsbare
grupper (`ringelisteGroupHtml()`, styrt av `driverRingelisteLukket`-settet) pluss to faste,
ikke-kollapsbare kontaktkort (`ringelisteQuickCardHtml()` i en `.ringeliste-quick-grid`) helt
nederst i normal dokumentflyt. To reelle avvik fra ticket-kravet ble funnet: (1)
`driverRingelisteLukket` startet som et TOMT sett — kommentaren i koden sa eksplisitt «alle
tre er åpne som standard, samme visning som referansebildet» — altså en bevisst, men nå
utdatert designbeslutning fra 71.3; (2) Home Delivery/Veihjelp lå i vanlig dokumentflyt helt
nederst, under de tre gruppene — på en lang gruppeliste (opptil ~20 biler + kontakter) krevde
det scrolling forbi alt annet for å nå dem, stikk i strid med «alltid tilgjengelig uten
scrolling».

**Løsning:**
1. **Info-ikon fjernet.** `<span class="ringeliste-info-btn">`-elementet i
   `renderDriverRingeliste()` sin header er fjernet, sammen med den nå ubrukte
   `.ringeliste-info-btn`-CSS-regelen. Ingen informasjon gikk tapt — teksten bak `title`-
   attributtet var en generisk beskrivelse av skjermen som allerede fremgår av innholdet selv.
2. **Standardvisning.** `driverRingelisteLukket` sin startverdi er endret fra `new Set()` til
   `new Set(['ingen-aktive', 'ledelse'])` — kun `'aktive'` er dermed IKKE i settet og vises
   derfor åpen. I tillegg nullstilles settet til nøyaktig denne standarden hver gang
   `driverScreen` faktisk settes til `'ringeliste'` via bunnmenyen
   (`attachDriverBunnmenyListeners()`, eneste stedet `driverScreen` noensinne settes til
   `'ringeliste'`) — en sjåfør som selv har åpnet «Ingen aktive sjåfører», navigert bort og
   kommer tilbake, får dermed alltid samme, forutsigbare startvisning, ikke en huket
   tilstand fra forrige besøk. Selve toggle-mekanikken (`attachDriverRingelisteListeners()`,
   `data-ringeliste-toggle`) er UENDRET — brukeren kan fortsatt åpne/lukke alle tre grupper
   fritt underveis.
3. **Fast bunnseksjon.** Kontaktkortene er flyttet inn i en ny, egen wrapper
   `.ringeliste-fixed-quick` (`position:fixed`, plassert `bottom:calc(71px +
   env(safe-area-inset-bottom, 0px))` — rett over sjåførens bunnmeny `.p41-bunn`, hvis
   deklarerte høyde 71px+safe-area speiles her eksplisitt i en kommentar, med beskjed om å
   oppdatere begge sammen ved en fremtidig endring). De tre gruppene er samtidig pakket inn i
   en ny `.ringeliste-scroll`-wrapper med en rikelig (ikke pikselnøyaktig utmålt)
   `padding-bottom:210px`, slik at siste gruppe aldri havner skjult bak de to faste
   bunnbarene (`.ringeliste-fixed-quick` + `.p41-bunn`) når man scroller helt ned. Selve
   kontaktkort-komponenten (`ringelisteQuickCardHtml()`) og dens data (`ringeliste-ekstra`,
   redigert under Innstillinger → 👤 Sjåførside) er UENDRET — kun plasseringen/positioneringen
   er endret.

**Testet i faktisk kjørende nettleser (sjåførmodus krever ingen innlogging, så dette var
mulig i denne økten — i motsetning til Prioritet 71.6):** kjørt mot ekte, live Airtable-data
via en midlertidig lokal statisk fil-server. Bekreftet visuelt: (i)-ikonet er borte;
Ringeliste åpnes med «Aktive sjåfører (5)» utvidet og «Ingen aktive sjåfører (14)»/«Ledelse
(0)» lukket; å utvide «Ingen aktive sjåfører» til 14 rader og scrolle helt til bunns viser at
Home Delivery/Veihjelp forblir synlig, fast plassert rett over bunnmenyen, uten å bli dekket
av eller dekke over det siste gruppeinnholdet; å navigere til Min Bil og tilbake til
Ringeliste nullstiller korrekt til standardvisningen igjen; verifisert både på mobilbredde
(375px) og bredere visning. Ingen konsollfeil. Kun lesing/navigering utført — ingen faktiske
skrivinger (samtaler/kontroller/kommentarer) ble sendt til den ekte Airtable-basen i denne
økten.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi), `sw.js`
(`CACHE_VERSION` bilpark-v90 → bilpark-v91), `version-check.js` (`APP_VERSION` 90 → 91),
`version.json` (`"version"` 90 → 91). **`storage.airtable.js` er IKKE endret** — ren
presentasjons-/tilstandsendring, ingen nye felt, ingen `LIST_TABLES`-endring — derfor
uendret `versjon`/`?v=2.17.0`.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll, `v.km`-skriveregler,
`ringeliste-ekstra`-datamodellen og dens administrasjon i Innstillinger, `v.telefon`,
Kommentarer/Mer/Min Bil (de tre andre sjåførskjermene i `DRIVER_BUNNMENY`), administrasjonens
egen mobil-bunnmeny (`.p41-bunn` brukes også der, men kun sjåførmodusens bruk av komponenten
er berørt av den nye faste bunnseksjonen — administrasjonens skjermer har ingen
`.ringeliste-fixed-quick`).

**Kjente, dokumenterte begrensninger:**
- Offset-en til `.ringeliste-fixed-quick` (`71px + safe-area`) er et deklarert, ikke
  JS-målt, tall avledet av `.p41-bunn` sin egen CSS. Endres `.p41-bunn` sin høyde i en
  fremtidig sak (nytt ikonsett, flere linjer tekst i knappene, endret padding), må denne
  verdien oppdateres i samme slengen — se kommentaren i CSS-en.
- `.ringeliste-scroll` sin `padding-bottom:210px` er bevisst rikelig tilmålt fremfor
  pikselnøyaktig — gir litt ekstra tomrom nederst på korte lister (f.eks. når «Ingen aktive
  sjåfører»/«Ledelse» begge er lukket) i bytte mot garantert synlig innhold på lange lister.

---

## Prioritet 71.8 (2026-09-17) — Fra sak til verkstedbestilling

Bestilling: knappen «Registrer verkstedtime» på en sak i fasen «Under oppfølging» skal hete
«📅 Bestill verkstedtime» (beskriver handlingen bedre), og selve verkstedbestillingen skal
forhåndsutfylles med det saken allerede vet (bil/regnr/sakstype/beskrivelse), inkludert en
automatisk utledet verkstedtype — brukeren skal kun trenge å velge verksted, dato og
tidspunkt.

**Kartlegging (før implementering, kun kodelesing):** `bestillVerkstedForSak(sakId)` (den
LIVE, vinnende av to funksjonsdeklarasjoner med samme navn — se «Kjent, ikke rørt» under)
satte allerede `vtPrefillVehicleId`/`vtPrefillSakId`, og `renderVerksted()` sin
`linkedSak`-gren i «Ny verkstedtime»-skjemaet forhåndsutfylte allerede Bil (skjult felt) og
Beskrivelse (skjult felt = `sak.title`), og viste Bil/Regnr (via `vehicleLabel()`) og
Sakstype (`SAK_TYPE_LABEL`) i en infoboks — alt dette var altså ALLEREDE på plass og krevde
ingen endring. **Den reelle, eneste manglende biten var automatisk verkstedtype:**
`bestillVerkstedForSak()` hardkodet `vtPrefillType = 'reparasjon'` UANSETT sakens
`caseType`, og `submitAddVT()` sin fallback for sak-koblede skjema (der ingen type-velger
vises, se Prioritet 71.6) hardkodet `type = 'reparasjon'` direkte i stedet for å lese
`vtPrefillType` i det hele tatt. Konsekvens: en verkstedtime bestilt fra en Service-sak ble
ALDRI lagret med `type='service'` — og dermed kunne `fullforVerkstedbestilling()` sin
automatiske servicehistorikk-opprettelse (Prioritet 71.5, betinget på
`vtHarType(t,'service')`) aldri utløses for et sak-originert service-besøk, uansett hva
saken faktisk gjaldt.

**Løsning:**
1. **Tekstendring:** sakskortets handlingsknapp i fase `'oppfolging'`
   (`sakKompaktKortHtml()`, `data-bestill-vt-sak`) endret fra «Registrer verkstedtime» til
   «Bestill verkstedtime». Ikonet er UENDRET (`luc('calendar-days')` — allerede riktig
   kalenderikon per Prioritet 58 sin ikontabell, byttet derfor ikke til en emoji). Skjemaets
   `<h3>`-overskrift for sak-koblede bestillinger er tilsvarende endret fra «Registrer
   verkstedtime for sak» til «Bestill verkstedtime for sak».
2. **Automatisk verkstedtype:** ny funksjon `sakTilVtType(sak)` —
   `caseType==='service'` → `'service'`, `caseType==='dekk'` → `'dekkskift'`, alt annet
   (`varsellampe`/`skade`/`kontrollavvik`/`annet`) → `'reparasjon'` (samme standardtype disse
   alltid har hatt — INGEN atferdsendring for disse fire). `bestillVerkstedForSak()` bruker
   nå denne i stedet for det hardkodede `'reparasjon'`. `submitAddVT()` sin fallback (når
   ingen `input[name="vt-type"]:checked` finnes i DOM-en, dvs. kun for sak-koblede skjema)
   leser nå `vtPrefillType` direkte — som Prioritet 71.6 sine ANDRE bestill-funksjoner
   (`bestillService()`/`bestillEuKontroll()`/`bestillRuteskift()`/`bestillDekkskift()`)
   allerede gjorde konsistent, kun `bestillVerkstedForSak()` var unntaket.
3. **Standardverksted følger nå riktig type:** `renderVerksted()` sin `linkedSak`-gren brukte
   `standardVerkstedFor('reparasjon')` ubetinget for Verksted-nedtrekket — byttet til
   `standardVerkstedForVtType(initialType)` (samme bro-funksjon fra Prioritet 71.6), slik at
   en Service-sak nå foreslår Service-standardverkstedet, ikke alltid
   Reparasjon-standardverkstedet.
4. **Mobilitetsgaranti-boksen** (Prioritet 71.5/71.6, kun relevant for `type==='service'`) var
   tidligere ALDRI vist for sak-koblede skjema (`${!linkedSak ? ... : ''}`), fordi
   `type='service'` aldri var mulig derfra før denne endringen. Betingelsen er nå fjernet —
   boksen vises/skjules utelukkende basert på `initialType==='service'`, uavhengig av
   `linkedSak`, slik at en Service-sak sin verkstedbestilling også kan markere
   mobilitetsgaranti-forlengelse ved bestilling, akkurat som en direkte «Bestill
   Service»-bestilling allerede kunne.

**EU-kontroll — bevisst utelatt fra `sakTilVtType()`:** ticket-en nevner «EU-varsel → EU-
kontroll» som en av seks type-regler, men EU-kontroll har ALDRI vært en sak i denne
datamodellen — et nærstående EU-kontroll-forfall er utelukkende et Varslingssenter-varsel
lest direkte fra `vehicleEuKontrollStatus()` (Prioritet 71), uten noen tilhørende
`aktiveSaker`-rad. Det finnes derfor ingen `sak.caseType` som kunne utløst en
"EU-kontroll"-gren i `sakTilVtType()` — regelen er dokumentert her som bevisst urealiserbar
i dagens arkitektur, ikke glemt.

**Testet:** manuell, fullstendig sporing av hele kjeden fra kodelesing (klikk på
`data-bestill-vt-sak` → `bestillVerkstedForSak()` → `goTo('verksted')` → `renderVerksted()`
sin `linkedSak`-gren → `attachVerkstedListeners()` → `submitAddVT()` → `verkstedtimer.push()`
→ ved senere fullføring, `fullforVerkstedbestilling()`), samt en global
brace-/backtick-balansesjekk på `index.html` (5213 åpne = 5213 lukkede krøllparenteser,
partall antall backticks). **Ikke UI-verifisert i en faktisk innlogget nettleserøkt** —
Aktive saker/Verksted er administrasjonsskjermer som krever admin-innlogging, og gyldige
opplysninger var ikke tilgjengelig i denne økten (i motsetning til Prioritet 71.7, som er en
innloggingsfri sjåførskjerm og kunne testes direkte).

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi), `sw.js`
(`CACHE_VERSION` bilpark-v91 → bilpark-v92), `version-check.js` (`APP_VERSION` 91 → 92),
`version.json` (`"version"` 91 → 92). **`storage.airtable.js` er IKKE endret** — `type`-feltet
på `WorkshopAppointments` var allerede registrert (Prioritet 46), kun hvilken verdi som
skrives dit er endret — derfor uendret `versjon`/`?v=2.17.0`.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll, `v.km`-skriveregler, saksmotoren
(`sakErApen()`/`sakFase()`/`godtaSak()`/`avslaSak()`/`markerSakUtfort()` — kun LEST via
`sakTilVtType(s.caseType)`, aldri endret), `bestillService()`/`bestillEuKontroll()`/
`bestillRuteskift()`/`bestillDekkskift()` (allerede korrekte fra Prioritet 71.6, urørt),
`VT_TYPE_VELGER`/`standardVerkstedForVtType()`/`vtBeskrivelseForslag()` (gjenbrukt uendret),
Ringeliste (Prioritet 71.7), den generelle, IKKE sak-koblede «🔧 Registrer verkstedtime»-
knappen i Verksted-skjermens verktøylinje (bevisst uendret — se «Kjent, ikke rørt» under).

**Kjent, ikke rørt (oppdaget, men utenfor denne saken):** `bestillVerkstedForSak(sakId)` og
`goToRegisterVT(vehicleId)` finnes hver som TO separate `function`-deklarasjoner i
`index.html` (linje ~5599/~6222 og ~6106/~6231 før denne endringen) — kun den SISTE
deklarasjonen av hver er faktisk aktiv (JavaScript overskriver stille tidligere
funksjonsdeklarasjoner med samme navn på toppnivå), og den første av hver er derfor død,
uåkallbar kode som refererer en `submitVT()`-funksjon som ikke lenger finnes i koden. Dette
er forvirrende å lese, men ufarlig (aldri kjørt) — rørt bevisst ikke her, siden opprydding av
dette er en egen, uavhengig sak (dupliserte funksjonsnavn generelt), ikke en del av «fra sak
til verkstedbestilling».

---

## Prioritet 71.9 (2026-09-17) — Operativ opprydding i verksted, kalender og kjøretøyvisning

Bestilling: fem delmål — bestill verkstedtime fra sak (tekst + automatisk type), Reparasjon
som egen verkstedkategori, kalenderens nedre seksjon bygget om til «I dag»/«Senere», Reserve/
Ute av drift skjult som standard (Biloversikt/Ringeliste/Dashboard), og Faresonen på
Kjøretøyprofilen gjemt bak en kollapset «Avanserte handlinger»-seksjon.

**Kartlegging (før implementering, kun kodelesing) — funnet, IKKE antatt:**
1. **Del 1 var allerede levert.** `bestillVerkstedForSak()`/`sakTilVtType()`/knappteksten
   «📅 Bestill verkstedtime» ble implementert i Prioritet 71.8, samme økt tidligere. Denne
   runden bekreftet koden fortsatt var intakt — ingen re-implementering.
2. **Del 2 var allerede DELVIS levert.** `VT_TYPE_VELGER` (Prioritet 71.6) gjør Reparasjon
   valgbart/historerbart/filtrerbart på lik linje med Service/Dekkskift/EU-kontroll/
   Ruteskift. Det som manglet var VISNING: `vtTypeIkon()`/`vtTypeLucide()`/`vtTypeArt()`/
   `vtTypeTittel()` skilte fortsatt KUN ut EU-kontroll/Ruteskift — enhver Service-, Dekkskift-
   eller Reparasjon-verkstedtime falt sammen til det samme generiske «🏭 Verkstedtime» i
   Kalender og Dashboardets «Kommende oppgaver», selv om det strukturerte `t.type`-feltet
   (siden Prioritet 71.6/71.8) pålitelig kunne skille dem.
3. **Del 3:** Kalenderens `planleggingSeksjonHtml()` («📋 Alle kommende aktiviteter») leste
   `flatePlanleggingData(periodeDager)` — en ANNEN datakilde enn selve månedsgriden
   (`kalenderAktiviteterKart()`), gruppert etter TYPE i stedet for DATO, med et eget
   7/30/90-dagers periodevalg (`planleggingPeriodeDager`). Reell duplisering: samme
   informasjon (verkstedtimer, planlagt service/dekkskift, EU-frist, sak-oppfølging) vist to
   ganger på samme skjerm i to ulike grupperinger.
4. **Del 4:** Verken Biloversikt, Ringeliste eller Dashboardets biltabell filtrerte bort
   reserve-/ute av drift-kjøretøy — alle tre viste dem ubetinget blandet inn med operative
   biler.
5. **Del 5:** Faresonen (`.danger-zone`) i `renderBilkort()` var en alltid synlig, rødkantet
   boks nederst på Kjøretøyprofilen (Marker ute av drift + Slett bil), uendret siden
   Prioritet 37/65 sin dokumenterte fastsatte rekkefølge.

**Løsning:**
1. **Del 1 — ingen endring, kun verifisert.**
2. **Del 2 — visning fullført.** `vtTypeIkon()`/`vtTypeLucide()`/`vtTypeArt()`/
   `vtTypeTittel()` fikk hver to nye grener (`vtHarType(t,'service')`/
   `vtHarType(t,'dekkskift')`) FØR den generiske fallback-en, som nå eksplisitt betyr
   Reparasjon (🏭/`factory`/`'verksted'`/«Reparasjon (verkstedtime)»). `vtTypeArt()` sin
   Service-/Dekkskift-gren returnerer `'service'`/`'dekk'` — samme nøkler
   `KOMMENDE_ART`/resten av `kommendeOppgaver` allerede bruker for planlagt service/
   dekkskift, ingen ny nøkkel innført. Kalenderens forklaringslinje under månedsgriden
   («🔧 Service · 🛞 Dekkskift · … · 🚦 EU-kontroll · 📋 Oppfølging») er oppdatert fra
   «🏭 Verkstedtime» til «🏭 Reparasjon» for å matche. **Bevisst IKKE gjort:** et femte
   Dashboard-bestillingskort for Reparasjon — Prioritet 62 sitt prinsipp («en verkstedtime
   er et resultat av en sak, ikke noe man bestiller direkte») gjelder fortsatt uendret;
   Reparasjon er allerede valgbar ved ad-hoc-registrering via Verksted-skjermens egen
   «🔧 Registrer verkstedtime»-knapp (nødsituasjon-unntaket fra samme prinsipp).
3. **Del 3 — Kalenderens nedre seksjon bygget om.** `planleggingSeksjonHtml()` (og den nå
   ubrukte `planleggingPeriodeDager`-variabelen/periodevelgeren) er FJERNET. Ny
   `kalenderIDagSenereHtml()` leser SAMME `kalenderAktiviteterKart()` som månedsgriden
   allerede bygger — «I dag» = `kart[todayISO()]`, «Senere» = alle datoer > i dag, flatet ut
   og kronologisk sortert (siden `Object.keys(kart)`-datoene sorteres tekstlig først, og hver
   dags aktivitetsliste allerede er tids-sortert internt). Delt radmarkup
   `kalenderRadHtml(a, visDato)` gjenbrukes NÅ også av panelet «Velg en dato» over (som
   dupliserte nøyaktig samme markup inline før denne endringen — fjernet duplisering, ikke
   introdusert). Ingen periodegrense på «Senere», bevisst — ticket fjernet periodevelgeren
   som konsept, og «Senere» er uansett bare en flat snarvei til det samme månedsgriden
   allerede viser ved å bla fremover. `flatePlanleggingData()` selv er UENDRET og fortsatt i
   bruk av `renderBestillTjenester()` og Dashboardets «Kommende oppgaver» — kun Kalenderens
   EGEN nedre seksjon sluttet å lese den.
4. **Del 4 — Reserve/Ute av drift skjult som standard, tre uavhengige steder:**
   - **Biloversikt** (`renderRegister()`): filterpredikatet skjuler nå
     `v.kategori==='reserve'`-biler og `v.uteAvDrift`-biler med mindre nye
     `visReserve`/`visUteAvDrift` (default `false`) er slått på — ELLER brukeren allerede har
     valgt nettopp den kategorien/statusen eksplisitt i de vanlige filtrene (Kategori=reserve
     / Hovedstatus=ute-av-drift), som da regnes som et bevisst, aktivt valg. Unntatt: «🚚 Har
     aktiv sjåfør»-visningen — en reserve-/ute av drift-bil som faktisk er i drift akkurat nå
     er relevant, ikke støy. To nye hurtigknapper («✅ Vis reserve»/«✅ Vis ute av drift») i
     samme rad som de eksisterende Kontrollert/Ikke kontrollert-knappene fra Prioritet 71.6.
     Begge nullstilles til `false` av `resetRegisterFiltre()` (samme «alltid ufiltrert ved
     generell navigasjon»-regel som Prioritet 71.6 innførte).
   - **Sjåførens Ringeliste** (`renderDriverRingeliste()`): egne variabler
     `driverRingelisteVisReserve`/`driverRingelisteVisUteAvDrift` (adskilt fra
     administrasjonens, siden sjåførmodus har sin egen navigasjonstilstand), med samme to
     hurtigknapper rett under headeren. Nullstilles til `false` hver gang skjermen åpnes fra
     bunnmenyen — samme mønster Prioritet 71.7 allerede etablerte for
     `driverRingelisteLukket`.
   - **Dashboardets Biloversikt-forhåndsvisning** (`komponentHtml.biloversikt` i
     `renderDashboard()`): tredje, egen variabelpar `dashVisReserve`/`dashVisUteAvDrift`.
     `biloversiktBiler` fra `dashboardBeregning()` er UENDRET (fortsatt full, ufiltrert liste)
     — filtreringen skjer kun ved selve visningen, i en ny IIFE rundt komponentens markup.
     Fottekstlinjen viser nå «Viser X av Y biler (N skjult — reserve/ute av drift)» i stedet
     for det tidligere «Viser alle Y biler», slik at avkortingen er synlig i stedet for at
     biler «forsvinner» stille (samme prinsipp som Prioritet 32 etablerte for andre
     avkortede Dashboard-lister).
5. **Del 5 — Faresonen kollapset.** `.danger-zone`/`.danger-zone-title` (alltid synlig, rød
   boks) erstattet av `bilkortAccordionRow('avansert', '⚙️ Avanserte handlinger', null,
   dangerZoneBodyHtml)` — samme, allerede eksisterende akkordion-komponent som
   «▼ Kjøretøydetaljer» (Prioritet 65) bruker, lukket som standard. Innholdet (Marker ute av
   drift / Sett tilbake i drift / Slett bil, med sine respektive bekreftelsesskjemaer) er
   BYTE-FOR-BYTE uendret — kun ytre wrapper er byttet, ingen `id`-er eller lytterkoblinger
   rørt (den generiske `[data-toggle-bilkort]`-lytteren fanger automatisk opp den nye
   `'avansert'`-nøkkelen). `formInProgress()` har fått en tilsvarende sjekk for
   `bilkortOpenSections.has('avansert')` (samme beskyttelsesmønster som det allerede
   eksisterende, men i praksis dødt `'info'`-sjekket) — uten den kunne en bakgrunnssynk midt
   i utfylling av «Marker ute av drift» kollapse seksjonen og miste inntastingen, selv om
   `formInProgress()` sin generiske `document.activeElement`-sjekk allerede dekker det
   vanligste tilfellet (aktivt fokusert felt).

**EU-kontroll — ingen endring i Del 4.** Reserve-/ute av drift-filtreringen gjelder kun
kjøretøyvisning (`v.kategori`/`v.uteAvDrift`), helt uavhengig av EU-kontroll-status — ingen
sammenheng med `vehicleEuKontrollStatus()` eller Varslingssenteret.

**Testet:** sjåfør-delen av Del 4 (Ringeliste-togglene) ble testet direkte i en faktisk
kjørende nettleser mot ekte, live Airtable-data (sjåførmodus er innloggingsfri, samme
fremgangsmåte som Prioritet 71.7). Bekreftet: fersk åpning viste «Ingen aktive sjåfører
(11)» (default skjult); «✅ Vis reserve» økte tallet til 14 (+3, matcher de tre reserve-
kategori-bilene «Ikke satt»-gruppen på Velg bil viste); «✅ Vis ute av drift» økte det
videre til 17 (+3, matcher de tre bilene i «Biler ute av drift»); å navigere til Min Bil og
tilbake til Ringeliste nullstilte korrekt tilbake til 11. Ingen konsollfeil. Kun lesing/
navigering/toggling — ingen skrivinger sendt til den ekte Airtable-basen. De fire
admin-delene (Kalender, Biloversikt, Dashboard, Kjøretøyprofil) krever innlogging som ikke
var tilgjengelig i denne økten — verifisert i stedet ved grundig, fullstendig gjennomlesning
av hver endret funksjon før og etter redigering, pluss en global brace-/backtick-
balansesjekk på `index.html`.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi), `sw.js`
(`CACHE_VERSION` bilpark-v92 → bilpark-v93), `version-check.js` (`APP_VERSION` 92 → 93),
`version.json` (`"version"` 92 → 93). **`storage.airtable.js` er IKKE endret** — alle fem
delene er ren logikk-/presentasjonsendring på eksisterende felt (`v.kategori`, `v.uteAvDrift`,
`t.type`) — derfor uendret `versjon`/`?v=2.17.0`.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll, `v.km`-skriveregler, saksmotoren
(`sakErApen()`/`sakFase()` kun lest via eksisterende kallesteder, aldri endret),
`flatePlanleggingData()` (fortsatt i bruk av Bestill tjenester/Dashboard, kun Kalenderens
egen nedre seksjon sluttet å lese den), `vehicleErReserveUnntatt()`/reservebil-unntaket for
daglig kontrollkrav (Prioritet 41, en HELT annen mekanisme enn Del 4 sin visningsfiltrering —
ingen av dem endrer eller leser den andre), `markerUteAvDrift()`/`settTilbakeIDrift()` sin
underliggende logikk (kun UI-plasseringen av knappene som utløser dem er endret), Varslings-
senter, Layout Editor, Bilkategorier.

**Kjente, dokumenterte begrensninger:**
- De tre reserve-/ute av drift-toggle-parene (Biloversikt/Ringeliste/Dashboard) er bevisst
  UAVHENGIGE av hverandre — å slå på «Vis reserve» på Biloversikt påvirker ikke Ringeliste
  eller Dashboard. Konsistent med at de tre allerede var separate visninger med separat
  filtertilstand (f.eks. `filterKontrollStatus` deles heller ikke med Ringeliste), men verdt
  å være oppmerksom på dersom en fremtidig sak ønsker én delt, global toggle i stedet.
- `.danger-zone`/`.danger-zone-title`-CSS-reglene er ikke fjernet, kun ikke lenger
  referert fra noe HTML — harmløs, urørt dødt CSS, samme lavrisiko-vurdering som
  `.planlegging-grid` (nå også ubrukt etter Del 3, se over) fikk i Prioritet 71.6.
- Ikke UI-verifisert i en faktisk innlogget admin-nettleserøkt i denne omgangen for Del 2/3/4
  (Dashboard/Biloversikt)/5 — kun grundig kodelesing/-sporing. Anbefalt før idriftsettelse: 
  logg inn som administrator og bekreft (a) Kalenderens «I dag»/«Senere» viser riktige,
  ikke-dupliserte aktiviteter sammenlignet med månedsgriden; (b) Biloversikt/Dashboard sine
  «Vis reserve»/«Vis ute av drift»-knapper viser/skjuler korrekt antall biler og at
  fottekstene stemmer; (c) «⚙️ Avanserte handlinger» på Kjøretøyprofilen åpner/lukker
  korrekt og at Marker ute av drift/Slett bil fortsatt fungerer uendret inni den.

---

## Prioritet 71.10 (2026-09-18) — Godkjenning av store kilometerendringer

Bestilling: formaliser Prioritet 66/67 sin «bekreftet storthopp»-mekanikk med en reell
Godta/Avslå-arbeidsflyt for driftskoordinator, i stedet for kun en passiv rapporteringstekst
på Kjøretøyprofilen som pekte til Rediger informasjon.

**Kartlegging (før implementering, kun kodelesing):** hovedregelen (0–999 km oppdaterer
automatisk, ≥ 1 000 km krever godkjenning, lavere enn gulvet blokkeres, nøyaktig 1 000 km
regnes som stort hopp) var ALLEREDE fullt implementert siden Prioritet 66/66.1/66.2/67
(`validerKontrollKm()`/`kontrollKmGulv()`/`KM_HOPP_GRENSE`/`submitKontroll()`). Det som
manglet var selve GODKJENNINGEN: et bekreftet storthopp ble liggende som en passiv tekstlinje
på bilkortet («⚠️ Km-avvik … Korrigeres kun via Rediger informasjon») uten noen egen Godta/
Avslå-handling, og uten noen formell registrering av HVEM som godkjente/avslo og NÅR. Den
eneste faktiske korrigeringsveien var den generelle, eldre adminflyten i `saveVehicleForm()`
(direkte redigering av km-feltet) — en gyldig, men implisitt og usporet mekanisme for akkurat
dette formålet.

**Løsning:**
1. **To nye felt på `DriverChecks`** (app-nøkkel `kontroller`):
   `kmGodkjenningStatus` (`''`/`'godkjent'`/`'avvist'`) og `kmGodkjenningInfo` (tekst — hvem
   godkjente/avslo og når, samme lesbare-tekst-i-eksisterende-felt-mønster som
   `kmAvvikMerknad()` fra Prioritet 66 Del 8). Registrert i `LIST_TABLES.kontroller` i
   `storage.airtable.js` SAMTIDIG som de tas i bruk (feltregelen fulgt) — `versjon` v2.17.0 →
   v2.18.0, `?v=` i `index.html`/`kontroll.html` til 2.18.0. **Krever to nye Airtable-kolonner
   («KmGodkjenningStatus», «KmGodkjenningInfo») i DriverChecks før idriftsettelse** — se
   AIRTABLE_MIGRATION.md.
2. **`kontrollKmGulv()` ekskluderer nå `kmGodkjenningStatus === 'avvist'`-kontroller** fra
   gulvberegningen. Dette er den reelle konsekvensen av et avslag: uten denne ekskluderingen
   ville en avvist feilregistrering (typisk en tastefeil, f.eks. 31 000 → 310 000) fortsette å
   presse km-gulvet oppover for alltid, og PERMANENT blokkere enhver senere, korrekt kontroll
   under den forkastede verdien (jf. blokkeringsregelen i Prioritet 66 Del 6). En 'godkjent'
   kontroll forblir derimot en gyldig gulv-kandidat, siden verdien da nettopp ER bekreftet
   riktig.
3. **To nye funksjoner, `godtaKmEndring(vehicleId)`/`avslaKmEndring(vehicleId)`**, plassert
   rett etter `kmAvvikForVehicle()`/`window.rapporterKmAvvik()` i `index.html`:
   - **Godta:** `v.km` settes til kontrollens registrerte km (`saveVehiclesOrThrow()` med
     rollback ved lagringsfeil — samme mønster/kritikalitet som de fire eksisterende
     `v.km`-skriverne, se «Service»-seksjonen over, nå utvidet til fem). Deretter merkes
     SELVE kontrollen med `kmGodkjenningStatus='godkjent'` og et
     «Godkjent av {rolle} {dato} kl. {klokkeslett}»-spor i `kmGodkjenningInfo` — kontrollens
     `km`-felt (selve historikkverdien) røres ALDRI.
   - **Avslå:** `v.km` forblir UENDRET. Samme kontroll merkes
     `kmGodkjenningStatus='avvist'` + et «Avvist av …»-spor, bak en `confirm()`-dialog (samme
     mønster som `avslaSak()`, Prioritet 51). Kontrollens opprinnelige `km`-verdi beholdes
     uendret i historikken — ingen kilometerverdi slettes, kun merket.
   - Ingen av funksjonene oppretter et eget «varsel»-objekt — varselet har fortsatt INGEN egen
     datamodell (samme prinsipp som resten av Varslingssenteret, Prioritet 71): det er
     `kmAvvikForVehicle()` (uendret signatur, nå matet av det innskrenkede gulvet) som avgjør
     om varselet fortsatt eksisterer, hver render.
4. **Varslingssenteret («km»-kategorien) fikk direkte handlingsknapper.**
   `beregnVarslingssenterListe()` sin km-varsel-id er endret fra bil-ID til kontroll-ID
   (`'km:'+kmA.kontrollId`) — **duplikatvern**: samme kontroll kan derfor aldri produsere mer
   enn ett varsel, uavhengig av hvor mange ganger siden rendres. Varselteksten viser nå
   tidligere km, registrert km, differanse og sjåførnavn direkte (tidligere kun differansen).
   `varslingssenterRadHtml()` viser «✅ Godta endring»/«✖️ Avslå endring» for admin på km-rader,
   ved siden av (ikke i stedet for) den generiske «👁️ Marker som sett» alle kategorier allerede
   hadde. Kategorietiketten er endret fra «Km-grense passert» til «Uvanlige
   kilometerøkninger»/«Uvanlig kilometerøkning» (mer presist — dette ER alltid en pågående
   godkjenning, ikke en passert grense i seg selv).
5. **Kjøretøyprofilens passive km-avvikslinje** (Oversikt-fanen) er kun tekstjustert — pekeren
   til «Rediger informasjon» er byttet til «Godkjennes eller avslås i 🔔 Varslingssenteret».
   Ingen nye knapper lagt til her — den formelle handlingen skjer bevisst ett sted
   (Varslingssenteret), ikke duplisert på to skjermer.

**Ferdigkrav, punkt for punkt:**
- ✅ 0–999 km: `submitKontroll()` oppdaterer `v.km` automatisk, ingen varsel (uendret fra
  Prioritet 67).
- ✅ ≥ 1 000 km (inkl. nøyaktig 1 000): kontrollen lagres med registrert km, `v.km` røres
  ikke, ett varsel dukker opp i Varslingssenteret (uendret fra Prioritet 66/67, nå med
  Godta/Avslå).
- ✅ Godta: `v.km` = kontrollens registrerte verdi, varselet forsvinner (gulvet ligger nå
  under/på `v.km` igjen), godkjenningstidspunkt+rolle registrert i `kmGodkjenningInfo`,
  kontrollhistorikken uendret.
- ✅ Avslå: `v.km` uendret, kontrollens opprinnelige verdi beholdt i historikken, merket
  `kmGodkjenningStatus='avvist'`, varselet forsvinner (gulvet ekskluderer nå denne
  kontrollen), ingen sletting.
- ✅ Lavere kilometerstand: fortsatt hard blokkering, uendret fra Prioritet 66 Del 6 — ingen
  endring i denne runden.
- ✅ Duplikatvern: varsel-id bundet til kontroll-ID.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi),
`storage.airtable.js` (`versjon` v2.17.0 → v2.18.0 — to nye felt på `kontroller`), `sw.js`
(`CACHE_VERSION` bilpark-v89 → bilpark-v90), `version-check.js` (`APP_VERSION` 89 → 90),
`version.json` (`"version"` 89 → 90), `AIRTABLE_MIGRATION.md` (nye felt dokumentert).

**Testet:** `node` var ikke tilgjengelig i denne økten (samme begrensning som Prioritet
71.5) — ingen kjørende nettleser ble brukt. Verifisert i stedet: en global krøllparentes-/
backtick-balansesjekk på hele `index.html` (5187 åpne = 5187 lukkede krøllparenteser, partall
antall backticks) viser samme, uendrede parentesbalanse (`(` − `)` = −6) som den originale,
committede filen FØR denne endringen — dvs. de nye funksjonene/malene introduserer ingen ny
ubalanse. Hver endret funksjon er lest i sin helhet før og etter redigering. **Ikke verifisert
i en faktisk kjørende nettleser eller mot en ekte/mock-Airtable-base i denne økten** — se
samme forbehold under Prioritet 71.5.

**Anbefalt før idriftsettelse:** legg til de to nye kolonnene («KmGodkjenningStatus»,
«KmGodkjenningInfo», begge enkel tekst) i DriverChecks-tabellen i Airtable, åpne appen i en
nettleser og bekreft at et bekreftet storthopp faktisk dukker opp i Varslingssenteret med
Godta/Avslå-knapper, test at «Godta» oppdaterer `v.km` og fjerner varselet, test at «Avslå»
lar `v.km` stå uendret og at en SENERE, lavere/normal kontroll deretter går gjennom uten å bli
blokkert av den avviste verdien (dette er den konkrete regresjonen ekskluderingen i
`kontrollKmGulv()` er ment å forhindre).

**Ikke rørt:** Aktiv sjåfør-logikk, `submitKontroll()` sin km-valideringslogikk
(`validerKontrollKm()`/`KM_HOPP_GRENSE`/blokkeringsregelen for lavere km) — kun gulv-
kandidatlisten i `kontrollKmGulv()` er utvidet med ett unntak, saksmotoren, Layout Editor,
Bilkategorier, `renderVerksted()`/`renderVerkstedhistorikk()`, PWA/manifest-ikonfilene.

**Kjente, dokumenterte begrensninger:**
- `kmGodkjenningInfo` er fri tekst (samme mønster som `kmAvvikMerknad()`), ikke et
  strukturert, maskinlesbart tidsstempel-felt — tilstrekkelig for sporbarhet/revisjon, men
  ikke egnet for fremtidig sortering/filtrering på godkjenningstidspunkt uten et nytt,
  dedikert felt.
- Godta/Avslå er kun tilgjengelig fra Varslingssenteret, ikke som knapper direkte på
  Kjøretøyprofilens km-avvikslinje — et bevisst valg for å unngå å duplisere handlingskoden
  to steder (se Løsning, punkt 5).
- Som resten av Varslingssenteret (Prioritet 71): «Marker som sett» er fortsatt tilgjengelig
  også for km-varsler, ved siden av Godta/Avslå. Et km-varsel som kun markeres «sett» (uten
  Godta/Avslå) kommer automatisk tilbake etter 48 timer, siden gulvet fortsatt er upåvirket.

---

## Prioritet 71.11 (2026-09-18) — Aktiv sjåfør skal settes automatisk ved sjåførkontroll

Bestilling: fullført sjåførkontroll skal automatisk sette Aktiv sjåfør på bilen (ingen ekstra
knapp/manuell aktivering), aktiv sjåfør skal beholdes til eksplisitt utsjekk eller til en ny
sjåfør kontrollerer samme bil, Dashboard/Biloversikt/Bilprofil skal vise Aktiv sjåfør (ikke
«Sist kontrollert av») som primær informasjon, og kontrollhistorikken skal fortsatt lagre
hvem/når uten at det brukes til å AVGJØRE aktiv sjåfør. Bakgrunn oppgitt av bruker: observert
et dashboard som viste «2/13 kontrollert i dag» samtidig som «0 aktive biler».

**Kartlegging (før noen endring — hele denne saken ble først verifisert mot faktisk kode, ikke
antatt):** ALLE fem kjernekravene i «NY REGEL»/«AKTIV SJÅFØR SKAL BEHOLDES»/«DASHBOARD» var
allerede fullt implementert, fra Prioritet 34/40/66.2:
- `settAktivSjafor(vehicleId, navn)` er den ENE tildeleren av `v.aktivSjafor`/
  `v.aktivSjaforSiden` (uendret siden Prioritet 40), med innebygd kryss-bil-utsjekking (én
  sjåfør kan kun disponere én bil samtidig — «en ny sjåfør overtar bilen ved ny kontroll» var
  allerede eksakt slik funksjonen alltid har virket).
- `submitKontroll()` kaller ALLTID enten `startBilokt()` (sjåførmodus) eller
  `settAktivSjaforForKontroll()` (administrasjonen) som STEG 8, etter at kontrollen er
  fullstendig og gyldig lagret — bekreftet ved å lese hele funksjonen fra topp til bunn, ingen
  bypass-vei funnet (`kontroller.push(...)` finnes kun ett sted i hele `index.html`, inne i
  nettopp denne funksjonen).
- Aktiv sjåfør beholdes til `avsluttBilokt()` (eksplisitt «Sjekk ut bil»), kryss-bil-
  utsjekking i `settAktivSjafor()`, eller `ryddOppBiloktDagskille()` (operativt dagskille kl.
  04:00) — ingen fjerde, udokumentert nullstillingsvei ble funnet (grep på alle
  `.aktivSjafor =`-tildelinger i filen ga nøyaktig disse fire treffene).
- `vehicleAktivSjafor()` — Dashboardets «Aktive biler»-KPI (`hDriftCount`, Prioritet 62.1/
  62.1a) bygger allerede utelukkende på denne, over ALLE kjøretøy, ikke på
  `isKontrollertIdag()`/`kontrollertIdagCount`. De to tallene måler bevisst to ulike
  spørsmål («hvor mange er kontrollert i dag» vs. «hvor mange disponeres akkurat nå») —
  et gap mellom dem (f.eks. «2 kontrollert, 0 aktive») oppstår derfor NORMALT når sjåfører har
  sjekket ut igjen etter kontrollen, ikke av en kodefeil i tildelingen. Dette bekreftet
  IKKE noen «0 aktive selv om noen kjører»-defekt i selve logikken.

**Den faktiske, gjenstående forskjellen mellom ticket og kode lå KUN i visningen**, ikke i
tildelingslogikken:
1. **Biloversikt (`galleryCard()`):** badge-pillen viste tidligere «🕓 Sist kontrollert av
   {navn}» som en tredje, likestilt tilstand ved siden av «👤 {aktiv sjåfør}»/«⚪
   Tilgjengelig» — det var nettopp DENNE tredje tilstanden ticket ba om å fjerne som «primær
   informasjon». Endret til kun to synlige tilstander — navn eller «⚪ Ingen aktiv sjåfør»
   (tekst endret fra «Tilgjengelig» for å matche ticket-ordlyden eksakt) — med «sist
   kontrollert av» beholdt som `title`-tooltip (sekundær, ikke-primær), siden
   `vehicleSisteSjafor()`/kontrollhistorikken fortsatt eksisterer uendret og informasjonen
   ikke er slettet, kun degradert fra primær til sekundær.
2. **Bilprofil (`renderBilkort()`, toppraden/`profil-ident-meta`):** viste tidligere BÅDE en
   «👤/⚪ Aktiv sjåfør»-pille OG en konkurrerende «🕓 Sist kontrollert av»-pille ved siden av
   hverandre. Den frittstående «Sist kontrollert av»-pillen er fjernet fra selve toppraden
   (samme title-tooltip-mønster som over) — «Aktiv sjåfør»-pillen står nå alene som ticket
   ba om («Toppraden skal vise: Aktiv sjåfør i stedet for: Sist kontrollert av»). Den
   EKSISTERENDE, mer detaljerte «👤 Aktiv sjåfør»-statuskortet i `.profil-stat5`
   (Prioritet 71.5, lenger ned på siden — IKKE «toppraden») er UENDRET: det har alltid vist
   «Aktiv sjåfør» som hovedverdi med «Sist kontrollert av …»/«Kjører nå» som liten,
   underordnet forklaringstekst — det var allerede riktig og konkurrerer ikke med toppraden.
3. **Dashboard:** «Aktive biler»-KPI-kortet var allerede eksakt som spesifisert (biler MED
   aktiv sjåfør, via `vehicleAktivSjafor()`/`hDriftCount`) — ingen endring nødvendig.

**Bevisst IKKE endret:** Dashboardets egen forhåndsvisningstabell (`komponentHtml.biloversikt`
i `renderDashboard()`, «Bilpark status»-panelets Sjåfør-kolonne) beholder sin eksisterende
👤/🕓/— tre-tilstands-kolonne uendret. Denne er en annen, mer kompakt tabellcelle (ikke en
frittstående pille som kan mistolkes som «aktiv»), skiller allerede tydelig mellom
tilstandene via ikon OG title-tooltip, og lå utenfor ticket-ens eksplisitt navngitte
skjermer (Dashboard-seksjonen i ticket-en omtalte kun selve KPI-tallet). Å endre den ville
vært utenfor angitt omfang («endre minst mulig»). `vehicleSisteSjafor()` selv,
Excel-eksportenes «Aktiv sjåfør»-kolonne (Kilometerstandsrapport, som fortsatt bruker
`vehicleSisteSjafor()`, en allerede dokumentert, akseptert avvik siden Prioritet 33) og alle
fire tildelings-/nullstillingsfunksjonene er UENDRET.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi), `sw.js`
(`CACHE_VERSION` bilpark-v90 → bilpark-v91), `version-check.js` (`APP_VERSION` 90 → 91),
`version.json` (`"version"` 90 → 91). **`storage.airtable.js` er IKKE endret** — ingen nye
felt, ingen logikkendring i tildelingen — derfor uendret `versjon`/`?v=2.18.0`.

**Testet:** `node` var ikke tilgjengelig i denne økten. Verifisert: en global krøllparentes-/
backtick-balansesjekk på `index.html` viser samme, uendrede parentesbalanse som før
endringen (ingen ny ubalanse introdusert). Kjernepåstanden i kartleggingen (at
tildelingslogikken allerede var korrekt) er verifisert ved fullstendig lesing av
`settAktivSjafor()`/`startBilokt()`/`settAktivSjaforForKontroll()`/`overforAktivSjafor()`/
`avsluttBilokt()`/`ryddOppBiloktDagskille()`/`vehicleAktivSjafor()`/`vehicleSisteSjafor()` og
et uttømmende grep-søk på `.aktivSjafor =` og `kontroller.push(` — ikke ved kodelesing av kun
utdrag. **Ikke verifisert i en faktisk kjørende nettleser eller mot en ekte/mock-Airtable-base
i denne økten.**

**Anbefalt før idriftsettelse:** bekreft i en nettleser at en fullført sjåførkontroll (både
via sjåfør-URL og via administrasjonens ✅-ikon) umiddelbart viser bilen som «👤 {navn}» i
Biloversikt/Bilprofil/Dashboard sitt «Aktive biler»-tall uten noen ekstra handling, at en NY
sjåførs kontroll på samme bil overtar den (gammel sjåfør forsvinner fra sin forrige bil, se
kryss-bil-varselet i «👤 Ny sjåfør»-panelet), og at «Sjekk ut bil» fjerner bilen fra «Aktive
biler» igjen. Dersom den rapporterte «2 kontrollert / 0 aktive»-observasjonen fortsatt kan
reproduseres etter denne leveransen, er det IKKE lenger et logikkspørsmål (bekreftet korrekt
over) — undersøk i stedet om de aktuelle sjåførene faktisk sjekket ut bilen etter kontrollen,
eller om den observerte tilstanden var fra en tidligere, ikke oppdatert utrulling av appen
(se Prioritet 42 for et tidligere, reelt eksempel på nøyaktig dette avviket mellom kode og
publisert side).

**Ikke rørt:** `settAktivSjafor()`/`startBilokt()`/`settAktivSjaforForKontroll()`/
`overforAktivSjafor()`/`avsluttBilokt()`/`ryddOppBiloktDagskille()`/`vehicleAktivSjafor()`/
`vehicleSisteSjafor()` (alle kun LEST og verifisert, ingen linje endret),
`submitKontroll()` sin kilometer-/sak-/varsellampelogikk, saksmotoren, Varslingssenteret,
`storage.airtable.js`/Airtable-skjema, Rapporter/Analyse.

**Kjente, dokumenterte begrensninger:**
- Dashboardets kompakte forhåndsvisningstabell («Bilpark status» → Biloversikt-komponentet)
  viser fortsatt «🕓 {navn}» for siste kontrollør — bevisst utenfor omfang, se over.
  **RETTET I PRIORITET 72.0:** denne mini-tabellen (Dashboard sin egen
  `komponentHtml.biloversikt`) viser nå også Aktiv sjåfør som primær visning, med «sist
  kontrollert av» degradert til en title-tooltip — samme mønster som resten av denne saken.
- Kilometerstandsrapportens «Aktiv sjåfør»-eksportkolonne bruker fortsatt
  `vehicleSisteSjafor()` — en allerede kjent, akseptert avvik fra Prioritet 33, ikke rørt i
  denne runden (ticket nevnte ikke Rapporter).
- Dersom den opprinnelige observasjonen («2/13 kontrollert, 0 aktive») skyldtes en publisert
  side som ligger bak dette repoets faktiske kode (samme klasse feil som Prioritet 42), løser
  ikke denne leveransen det — det krever en ny utrulling, ikke en kodeendring.

---

## Prioritet 72.0 (2026-09-18) — Dashboard 2.0, Lucide-standard og bedre navigasjon

Bestilling: seks samlede delmål — (1) full Lucide-ikonstandardisering med en fargekodet
konseptstandard, (2) Dashboard 2.0 (fjern «God morgen», vis kontrollrate), (3) behold
toppkortene (Aktive saker/Under oppfølging/Planlagt verksted/Aktive biler/Varsler), (4)
Kalender som kompakt dashboard-widget, (5) Biloversikt med faner i stedet for
ekspander/lukk, (6) Aktiv sjåfør som (primær) visning fremfor «Sist kontrollert av» på
Dashboard/Biloversikt/Bilprofil, (7) Kalenderdetaljer i sidepanel i stedet for under
kalenderen. Mål: mindre scrolling, mindre visuell støy, mer operativ.

**Kartlegging (før implementering, kun kodelesing):** punkt 6 (Aktiv sjåfør som primær
visning) var allerede levert på to av tre navngitte flater i Prioritet 71.11
(Biloversikt-kortet og Kjøretøyprofilens toppseksjon) — kun Dashboardets EGEN,
kompakte biloversikt-forhåndsvisning (`komponentHtml.biloversikt` i `renderDashboard()`)
gjensto fortsatt, dokumentert som en bevisst avgrensning i Prioritet 71.11 sine «Kjente,
dokumenterte begrensninger». De øvrige fem punktene var ikke tidligere forsøkt.

### Del 1 — Full Lucide-standardisering med fargekodet ikonstandard

**Ny, varig kanonisk fargetabell** (CSS-klasser `.ic-blue`/`.ic-orange`/`.ic-red`/
`.ic-yellow`/`.ic-purple`/`.ic-green`/`.ic-gray`, satt via `luc(navn, cls)` sitt
eksisterende, valgfrie andre argument — INGEN ny ikonmekanisme):

| Konsept | Farge | CSS-klasse |
|---|---|---|
| Bil/kjøretøy | Blå | `.ic-blue` |
| Verksted/Reparasjon | Oransje | `.ic-orange` |
| Dekk | Oransje (delt med Verksted — se begrunnelse under) | `.ic-orange` |
| EU-kontroll | Blå | `.ic-blue` |
| Varsler/Avvik | Gul (`--amber`) | `.ic-yellow` |
| Skader | Rød | `.ic-red` |
| Sjåfør | Lilla | `.ic-purple` |
| Kalender | Grønn | `.ic-green` |
| Historikk | Grå | `.ic-gray` |

**Bevisst avvik fra ticket-ens «dekk = rød/oransje»:** dekk er satt til oransje, ikke rød —
rød er allerede en etablert, sterk betydning i appen («kritisk»/«aktiv sak»/HOVEDSTATUS-nivå
«Ute av drift», se Prioritet 59). Å gi Dekk samme farge som disse ville svekket akkurat det
signalet «samme farge = samme betydning» skal beskytte.

**Migrert etter SYNLIGHET, samme prinsipp som Prioritet 58 — ikke hele appen.** Konvertert i
denne runden: desktop-sidebarens hovednavigasjon (`DESKTOP_NAV_PRIMARY`, var allerede 100 %
Lucide siden Prioritet 55 — kun fargekodingen er ny) og sekundærseksjonen
(Verkstedhistorikk→grå); hele Dashboard (KPI-rad, Operativ status, Bilpark-oversikt-panelet,
Biloversikt-/Prioriterte biler-panelhoder, Kommende oppgaver-panelhode); hele Kalender
(sidetittel, det nye ukewidgetet, datodetalj-panelhodet); Biloversikt sine nye fane-ikoner
(`kategoriIkonLucide()`, var allerede Lucide siden gruppevisningen ble innført — kun
fargekodingen er ny) og `galleryCard()`/Kjøretøyprofilens toppseksjon sitt kjøretøytype- og
sjåførikon (erstatter de to siste gjenværende emoji — 🚛/🚐 og 👤 — på akkurat disse to
stedene, som var de mest synlige, daglig brukte flatene disse to ikonene fortsatt fantes
udekorert på).

**Bevisst IKKE rørt (samme unntak som Prioritet 57/58, uendret):** `HOVEDSTATUS_IKON` og
alle andre statusfargesirkler (🟢🟡🟠🔴⚪ — `P38_STATUS_STIL`, `dash50Ikon`,
`vehicleServiceStatus()`/`vehicleEuKontrollStatus()`/`dekkAlderStatus()` sine egne
`status.ikon`-verdier) — disse ER selve statuskommunikasjonen (STATUSREGLER), ikke
dekorative konsept-ikoner, og skal aldri migreres til et Lucide-konsept-ikon som ville
konkurrere med fargesirkelen. `.p38-pill`/`.flis`/`.dash40-kpi` sine ikoner som ALLEREDE
fargelegges via inline `--tint`/`--tone` (f.eks. Bestill tjenester-kortene, sakskortenes
sjekkliste-ikoner) er heller ikke rørt — de har allerede en fungerende, per-kort fargelogikk,
og å legge en `.ic-*`-klasse OVENPÅ den ville enten vært virkningsløst (inline vinner alltid)
eller skapt en falsk forventning om at klassen faktisk styrer fargen der. Verkstedmodulens
`vtTypeIkon()`/Kalenderens `vtTypeIkon()`-baserte visning (Prioritet 46/58/71.9, delt
mellom flere skjermer) er IKKE konvertert i denne runden — utenfor ticket-ens eksplisitt
navngitte flater (Dashboard/Kalender/Biloversikt), og en «parallell-variant»-konvertering
(samme mønster som `vtTypeLucide()` i Prioritet 58) er en egen, avgrenset oppgave dersom
ønsket senere. Emoji i skjema-labels (f.eks. «⛽ Drivstoff», «🛟 Mobilitetsgaranti» i «Ny
bil»-skjemaet), hurtigfilterknapper (✅/⚠️ på Biloversikt) og status-pillenes egne
✅/⚠️/🔴-tilstandsikoner (`galleryCard()` sine badges) er BEVISST ikke rørt — disse er enten
skjemaetiketter (utenfor «ikon»-begrepet ticket-en sikter til) eller booleans/tilstander av
samme, beskyttede art som statusfargesirklene, ikke gjenbrukbare «konsepter» i ticket-ens
forstand. Se «Kjente, dokumenterte begrensninger» for en ærlig oppsummering av hva som
gjenstår — «ingen gamle ikoner skal eksistere» er derfor IKKE oppnådd for appen i sin helhet
i denne runden, kun for de fem eksplisitt navngitte flatene/delene.

### Del 2 — Dashboard 2.0: «God morgen» erstattet av «🎯 Operativ status»

`greetingInfo()` (klokkeslettbasert hilsen, «God morgen»/«God dag»/«God kveld» + emoji) er
FJERNET i sin helhet — ingen gjenværende kallested. Erstattet av en ny, fast (ikke
Layout Editor-styrt, samme presedens som den gamle hilsenen alltid har hatt) seksjon øverst
på Dashboard: **«🎯 Operativ status»**, med en ny, dedikert beregning
**`kontrollrateUke()`** — gjennomsnittlig andel av dagens flåte (`vehicles.filter(v =>
!v.uteAvDrift)`) som hadde minst én registrert kontroll, for hver av de siste 7
kalenderdagene (inkl. i dag), avrundet til hel prosent. INGEN ny datakilde — leser kun
`kontroller[]`, samme rader som `isKontrollertIdag()` alltid har brukt. Ny hjelpefunksjon
**`isoDateOffset(iso, deltaDager)`** (ren kalenderdag-forskyvning fra en allerede kjent
ISO-dato — ALDRI brukt til å definere «i dag» selv, som fortsatt utelukkende er
`todayISO()`/`isoDateForOperationalDay()`, se CLAUDE.md-regelen under «Prioritet 66»).

**Bevisst forenkling, dokumentert ærlig:** nevneren (dagens flåtestørrelse) brukes for ALLE
sju dagene — ikke en historisk rekonstruksjon av hvilke biler som faktisk fantes/var i drift
på hver enkelt dag. Presist nok til et trendtall på et dashboard, ikke egnet som
revisjonsgrunnlag. Reservebil-unntaket (`vehicleErReserveUnntatt()`) gjelder kun «i dag» og
er bevisst ikke forsøkt rekonstruert bakover.

Under selve prosenttallet vises **samme tall som `kontrollstatusKpiHtml()` alltid har brukt**
(`kontrollertIdagCount` av `aktiveVehicles.length − reserveUnntattCount`, Prioritet 62.1a) —
«{X} av {Y} biler kontrollert i dag», tydelig merket «i dag» slik at det aldri kan
mistolkes som en del av ukesprosenten (Prioritet 62.1a sin regel om at et tall på Dashboard
aldri skal kreve forklaring — hver av de to tallene forklarer sin egen tidsramme i teksten,
ingen skjult sammenheng mellom dem).

### Del 3 — Én samlet KPI-rad (fem kort)

Ny, delt funksjon **`dashboardKpiRadHtml(d)`** — Aktive saker/Under oppfølging/Planlagt
verksted (samme tall/navigasjon som den eksisterende `sakFaseTellereHtml()`, som er
UENDRET og fortsatt brukt av Mobil Hjem) pluss Aktive biler (`aktiveBilerKpiHtml(d)`,
gjenbrukt uendret) og et nytt Varsler-kort (`varslingssenterAntall()`, samme kilde som
klokkeikonet øverst til høyre og sidebarens badge). Ny CSS-klasse `.dash40-grid5-kpi`
(5 kolonner ≥1200px → 3 ≤1199px → 2 ≤640px, samme responsive mønster som
`.dash40-grid3`/`.dash40-grid4`). Erstatter den tidligere kombinasjonen av
`sakFaseTellereHtml()` (3 kort, fast plassert) + et separat 3-korts
Kontrollstatus/Aktive-biler/Kalender-rutenett (`komponentHtml.kpi`, Layout Editor-styrt) —
Kontrollstatus-tallene lever nå i «Operativ status» (Del 2), og Kalender-snarveien er
erstattet av det mer informative ukewidgetet (Del 4). `kpi`-nøkkelen i
`DASHBOARD_LAYOUT_FLATER.desktop` er BEHOLDT (samme nøkkel, nytt innhold — brukeren kan
fortsatt skjule/flytte hele KPI-raden), kun label oppdatert fra «Nøkkeltall (2 kort)» til
«Nøkkeltall (5 kort)» (selve labelen var allerede historisk unøyaktig — 3 kort — fra en
tidligere runde; nå korrekt). **Mobil er bevisst IKKE rørt** i denne runden — `renderMobilHjem()`
sin egen `kpi`-komponent, `kontrollstatusKpiHtml()`/`aktiveBilerKpiHtml()`/
`sakFaseTellereHtml()` sine kallesteder der er uendret.

### Del 4 — Kalender som dashboard-widget

Ny, delt funksjon **`kalenderUkeWidgetHtml()`** (+ hjelpefunksjon `kalenderUkeDager()`) —
en hel `.panel` gjort om til én trykkbar knapp (ny CSS-klasse `.dash-kal-widget`, samme
mønster som `.dash40-kpi`), som viser antall aktiviteter per ukedag (mandag–søndag, samme
ukedefinisjon som selve månedsgriden) for INNEVÆRENDE uke, kun dager med aktivitet
(`{navn} ({i dag})` · `N aktivitet(er)`), eller en tom-melding når uken er helt fri. Leser
UTELUKKENDE `kalenderAktiviteterKart()` — samme, eksisterende datakilde som selve Kalenderen
allerede bygger, ingen ny datamodell. Hele flaten navigerer til full Kalender via det
eksisterende, generiske `data-quick-page`-attributtet — ingen ny lytterkode. Lagt til som en
ny, togglebar/flyttbar komponent i Layout Editor (`kalenderwidget`, plassert i
`DESKTOP_LAYOUT_KOLONNER.hoyre`, øverst — rett over Bilpark status).

### Del 5 — Biloversikt: faner i stedet for ekspander/lukk

`renderRegister()` sin gruppevisning (kategorier, `KATEGORI_ORDER` + `UTE_AV_DRIFT_KATEGORI_ID`)
er gjort om fra et ekspander/lukk-akkordion (`registerGrupperApne`, ett `open`-flagg per
gruppe, flere kunne stå åpne samtidig) til **faner** — samme `.profil-tabs`/`.profil-tab`-
komponent som Kjøretøyprofilen (Prioritet 37/38) og Varslingssenteret (Prioritet 71.6)
allerede bruker, KUN én gruppe synlig om gangen. Ny state-variabel **`registerAktivFane`**
(ren visningstilstand, ALDRI lagret — nullstilles til `''` av `resetRegisterFiltre()`, som
fra før allerede nullstiller alle andre Biloversikt-filtre ved generell navigasjon hit).

**Aktiv fane-logikk** (i prioritert rekkefølge, speiler den gamle «hvilken gruppe er åpen»-
regelen): et eksplisitt kategorifilter (`filterKategori`) vinner alltid → ellers forrige
valgte fane, hvis den fortsatt finnes blant dagens grupper → ellers gruppen til egen aktive
bil (`egenAktiveBil()`, samme auto-fremheving akkordionen hadde) → ellers første gruppe.
`registerGrupperApne`/`toggleRegisterGruppe()` er BEVISST IKKE slettet fra koden (historisk,
ingen gjenværende kallested i `renderRegister()`) — i tilfelle en fremtidig sak ønsker en
ekspanderbar variant tilbake. «🚚 Biler i drift»-spesialvisningen (filteret «Har aktiv
sjåfør», som viser ÉN samlet liste på tvers av kategorier — se Prioritet 41) er UENDRET og
bruker fortsatt ikke faner, siden den prinsipielt aldri var en gruppe-per-kategori-visning.

### Del 6 — Aktiv sjåfør fullført som primær visning (Dashboard)

Fullfører Prioritet 71.11: Dashboardets egen, kompakte biloversikt-forhåndsvisning
(`komponentHtml.biloversikt` i `renderDashboard()`) viste fortsatt «👤 {navn}» /
«🕓 {sist kontrollert}» / «—» som TRE likestilte tilstander i Sjåfør-kolonnen — den
eneste av de tre navngitte flatene (Dashboard/Biloversikt/Bilprofil) som IKKE fikk
«Aktiv sjåfør som primær»-behandlingen i forrige runde (dokumentert som bevisst
avgrensning der). Nå: kun to synlige tilstander — `luc('user-round')` + navn, eller
«⚪ Ingen aktiv sjåfør» — med «sist kontrollert av» degradert til `title`-tooltip, identisk
mønster som `galleryCard()`/Kjøretøyprofilens toppseksjon. `vehicleAktivSjafor()`/
`vehicleSisteSjafor()` er UENDRET (kun lesefunksjoner, kun visningen av resultatet deres er
endret) — se Prioritet 66.2 for hvorfor disse to ALDRI skal blandes sammen i samme visning.

### Del 7 — Kalenderdetaljer i sidepanel

`renderKalender()` sin layout er endret fra tre stablede paneler (månedsgrid → «Velg en
dato»/valgt dags detaljer → «I dag»/«Senere», Prioritet 71.9) til **to kolonner side om
side** (ny CSS-klasse `.kal-split`, samme responsive to-kolonnersmønster som
`.dash40-split` — kollapser til én stablet kolonne ≤1199px, se `@media`-blokkene).
Venstre kolonne: månedsgriden, uendret. Høyre kolonne: valgt dato sine aktiviteter (eller
en «Velg en dato»-tomtilstand) ØVERST, med **`kalenderIDagSenereHtml()`** («I dag»/
«Senere», Prioritet 71.9, INGEN endring i selve funksjonen) rett under. Ingen ny
datakilde, ingen ny navigasjon — kun plasseringen av eksisterende paneler er endret, slik at
ingen detaljer lenger krever scrolling forbi hele månedsgriden for å bli synlige.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi), `sw.js`
(`CACHE_VERSION` bilpark-v94 → bilpark-v95), `version-check.js` (`APP_VERSION` 94 → 95),
`version.json` (`"version"` 94 → 95). **`storage.airtable.js` er IKKE endret** — ingen nye
Airtable-felt, ingen `LIST_TABLES`-endring (ren presentasjons-/navigasjonsendring på
eksisterende, allerede leste felt/funksjoner) — derfor uendret `versjon`/`?v=2.18.0`.

**Testet:** `node` var ikke tilgjengelig i denne økten (samme begrensning som flere
tidligere prioriteter, se f.eks. Prioritet 71.5/71.10). Verifisert i stedet: en global
krøllparentes-/backtick-balansesjekk på hele `index.html` (5257 åpne = 5257 lukkede
krøllparenteser, partall antall backticks — kontrollert både før og etter hver større
redigeringsrunde i denne økten, ingen ny ubalanse introdusert noe sted underveis). Hver
endret/ny funksjon (`kontrollrateUke()`, `isoDateOffset()`, `dashboardKpiRadHtml()`,
`kalenderUkeDager()`/`kalenderUkeWidgetHtml()`, `renderRegister()` sin nye fane-gren,
`renderKalender()` sin nye `.kal-split`-struktur, `renderDashboard()` i sin helhet) er lest
i sin fulle sammenheng før og etter redigering for å bekrefte balanserte maler og riktige
avhengigheter (samme type feil som Prioritet 66.3 advarer mot). **Ikke verifisert i en
faktisk kjørende nettleser eller mot en ekte/mock-Airtable-base i denne økten** — kun
statisk lese-/strukturverifisering.

**Anbefalt før idriftsettelse:** åpne appen i en nettleser og bekreft: (1) «🎯 Operativ
status» viser en rimelig prosent og at «{X} av {Y} biler kontrollert i dag» stemmer med
Biloversikt sitt «Ikke kontrollert»-hurtigfilter; (2) alle fem KPI-kortene navigerer riktig
(Aktive saker/Under oppfølging/Planlagt verksted → riktig fane i Aktive saker, Aktive biler
→ Biloversikt filtrert på «Har aktiv sjåfør», Varsler → Varslingssenteret); (3)
«📅 Denne uken»-widgeten viser korrekt ukedag-fordeling og åpner full Kalender ved klikk;
(4) Biloversikt sine faner bytter korrekt uten sideeffekt på de øvrige filtrene, og at et
kategorifilter fra et dashboard-snarveikort fortsatt tvinger riktig fane aktiv; (5)
Kalenderens sidepanel oppdaterer seg korrekt ved datovalg, og at layouten kollapser pent til
én kolonne på smal skjerm; (6) fargekodingen vises konsekvent i lys og mørk modus (alle sju
`--tone`-baserte CSS-variabler er allerede definert i begge temaer, se Prioritet 38, men
ikke separat re-verifisert i denne økten).

**Ikke rørt:** Aktiv sjåfør-logikk (`settAktivSjafor()`/`vehicleAktivSjafor()`/
`vehicleSisteSjafor()` — kun LEST), Sjåførkontroll (`submitKontroll()`), `v.km`-
skriveregler, saksmotoren (`sakFase()`/`sakErApen()` kun lest via eksisterende
kallesteder), Varslingssenteret sin egen logikk (`beregnVarslingssenterListe()`/
`varselErSkjult()` — kun `varslingssenterAntall()` LEST for det nye Varsler-KPI-kortet),
`flatePlanleggingData()`/`kalenderAktiviteterKart()` (kun LEST av det nye ukewidgetet),
Layout Editor-mekanikken for øvrig, Bilkategorier, `storage.airtable.js`/Airtable-skjema,
PWA/manifest-ikonfilene, `HOVEDSTATUS_IKON` og alle andre statusfargesirkler.

**Kjente, dokumenterte begrensninger:**
- Full Lucide-standardisering er, som i Prioritet 55/58, KUN gjennomført for de flatene
  denne saken faktisk navngir (Dashboard, Kalender, Biloversikt sine nye faner/kort, samt
  `galleryCard()`/Kjøretøyprofilens toppseksjon sitt kjøretøytype-/sjåførikon). Emoji finnes
  fortsatt i store deler av resten av appen (Verksted, Aktive saker, Rapporter, Innstillinger,
  skjemaer, statuspiller m.fl.) — «ingen gamle ikoner skal eksistere» gjelder derfor i praksis
  kun de navngitte flatene i denne runden, ikke appen i sin helhet. Se Del 1 for full liste
  over bevisste unntak (statusfargesirkler, allerede tone-fargede flater, skjemaetiketter).
- Fargekodingen er en presentasjonsstandard (CSS-klasser), ikke en ny datamodell — den kan
  derfor trygt utvides til flere flater i en senere, egen sak uten noen arkitekturendring.
- Mobil (Mobil Dashboard/Mobil Hjem) er bevisst IKKE omfattet av Del 2/3/4 — «God morgen»/
  KPI-rad/kalenderwidget finnes kun i den mobile forsiden slik den allerede var (egen
  `renderMobilHjem()`-struktur, uendret). Vurder som egen, separat sak dersom mobil også
  ønskes oppdatert til samme mønster.
- «Kontrollrate siste 7 dager» (Del 2) er en forenklet, ikke-historisk rekonstruert
  beregning (se Del 2) — egnet som trendindikator, ikke som revisjonsgrunnlag.
- Ikke UI-verifisert i en faktisk kjørende nettleser i denne omgangen (se «Testet» over) —
  kun grundig statisk lese-/strukturverifisering og en global balansesjekk.

---

## Prioritet 49 (2026-09-18) — Verkstedbestilling 3.0

**Nummerering:** brukeren omtalte denne bestillingen selv som «Prioritet 49» i sin ticket.
Søk i denne filen før implementering bekreftet at nummeret aldri tidligere er brukt — den
er likevel levert KRONOLOGISK ETTER Prioritet 72.0 over. Tallet følger brukerens egen,
uavhengige nummerering, ikke denne loggens løpende rekkefølge.

**Mål:** verkstedbestilling skal oppleves som «jeg sender Bil X på verksted», ikke «jeg
registrerer en database-post». Rammet inn av brukeren selv: ikke endre Airtable-struktur,
ikke endre verkstedlogikk, ikke endre saksmotor, ikke endre eksisterende statusflyt — kun
design/UX/informasjonsarkitektur/forhåndsutfylling.

**Kartlegging (før implementering, kun kodelesing):** `renderVerksted()` sin `linkedSak`-
gren (skjemaet `bestillVerkstedForSak()` åpner fra en sak i fasen «Under oppfølging») viste
allerede Bil/Regnr/Sakstype/Sakstittel forhåndsutfylt — men i en «databasepost»-aktig
infoboks (`🗂️ {caseId} — {title}` + en andre linje med bil/type/dato), ikke som en tydelig
arbeidsordre. Feltrekkefølgen var Verksted → Dato/Tid → Kontaktperson/Telefon → Kommentar,
uten noen skjult/åpne-mekanikk. Ett funn: `vtPrefillKommentar` (en variabel som allerede satt
riktig verdi per bestillingsvei — `s.title` fra `bestillVerkstedForSak()`, `'Ruteskift'` fra
`bestillRuteskift()`, tom streng ellers) var deklarert og tildelt hele fem steder, men ALDRI
lest av noen mal — et forberedt, men aldri fullført krok for nettopp denne saken.

**Løsning:**
1. **Ny arbeidsordre-header** (`.vt-order-header`) i `linkedSak`-grenen: bil
   (`${luc('truck','ic-blue')} ${vehicleLabel(lv)}`) og sakstype
   (`${luc(SAK_TYPE_LUCIDE[caseType])} ${SAK_TYPE_LABEL[caseType]}` + `sakAvvikChecklistHtml()`
   — samme sjekkliste-komponent Aktive saker allerede viser på selve sakskortet, Prioritet
   52/58, gjenkjennelig fra forrige skjerm i stedet for en ny visning) erstatter den gamle
   infoboksen. Saksreferansen (`caseId` + registreringsdato) er beholdt, men nedtonet til en
   liten, dempet linje (`.vt-order-sakref`) for sporbarhet uten å konkurrere med arbeidsordren.
2. **Feltrekkefølge snudd til ticket-ens visuelle prioritet:** Bil/Problem (header, kun lest)
   → Verksted → Dato → Tid → (Mobilitetsgaranti, kun for service) → Flere detaljer. Gjelder
   begge grener av skjemaet — også den frittstående «🔧 Ny verkstedtime» fikk Bil/Beskrivelse
   flyttet foran Verksted i stedet for side ved side i en `row2`.
3. **«▼ Flere detaljer» — ny, lukket-som-standard seksjon** (`vtFlereDetaljerApen`, ren
   visningstilstand, ALDRI lagret) samler Kommentar/Kontaktperson/Telefonnummer, gjenbruker de
   eksisterende `.acc-row`/`.acc-head`/`.acc-body`/`.chevron`-klassene (samme visuelle språk som
   Kjøretøyprofilens `bilkortAccordionRow()`). Toggles i `attachVerkstedListeners()` med en ny,
   dedikert lytter som VERKEN kaller `render()` — samme begrunnelse som den eksisterende
   type-velger-lytteren (`oppdaterForslag()`, Prioritet 61/62) allerede dokumenterer: en full
   `render()` ville nullstilt Dato/Tid/Verksted/Bil til malens statiske `value`-attributter og
   slettet alt brukeren allerede hadde fylt inn. Nullstilles til `false` hver gang skjemaet
   åpnes på nytt: i `bestillService()`/`bestillDekkskift()`/`bestillEuKontroll()`/
   `bestillRuteskift()`/`bestillVerkstedForSak()`/`goToRegisterVT()`, i `add-vt-btn`-lytteren
   (begge retninger — åpne og lukke), i `submitAddVT()` sin post-innsending-reset, og i
   `goTo()` sin `scr !== 'verksted'`-opprydding.
4. **Kommentarfelt-forslag (ferdigkrav 8):** når skjemaet åpnes fra en sak, foreslås nå
   `sakKildeTekster(linkedSak)` (samme kilde sakskortets «beskrivelse» allerede leser,
   Prioritet 68) som startverdi i `vt-notater` — feltet er likevel skjult til brukeren selv
   åpner «Flere detaljer». Den tidligere ubrukte `vtPrefillKommentar` brukes fortsatt for de
   ikke-sak-koblede bestillingsveiene (f.eks. `'Ruteskift'` fra `bestillRuteskift()`), nå
   endelig faktisk lest av malen i stedet for å stå urørt.
5. **Primærknapp omdøpt:** «Lagre» → «✅ Bestill verkstedtime», for BEGGE grener av skjemaet
   (også ikke-sak-koblet registrering, siden også den alltid bestiller en verkstedtime).

**Ingen endring i `submitAddVT()`.** Samtlige `id`-er skjemaet leser
(`vt-vehicle`/`vt-verksted`/`vt-dato`/`vt-tid`/`vt-beskrivelse`/`vt-kontaktperson`/
`vt-telefon`/`vt-notater`/`vt-mobilitetsgaranti`) er uendret — kun plassering og
synlighet i malen er endret. `sakTilVtType()`, `standardVerkstedForVtType()`,
`vtBeskrivelseForslag()`, `bestillVerkstedForSak()` sin kobling til
`vtPrefillSakId`/`vtPrefillType`, og hele auto-koblingslogikken i `submitAddVT()`
(Prioritet 71.5 Del 2b) er UENDRET.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi), `sw.js`
(`CACHE_VERSION` bilpark-v96 → bilpark-v97), `version-check.js` (`APP_VERSION` 96 → 97),
`version.json` (`"version"` 96 → 97). **`storage.airtable.js` er IKKE endret** — ren
presentasjons-/tilstandsendring på eksisterende, allerede leste felt/funksjoner — derfor
uendret `versjon`/`?v=`.

**Testet:** verken `node` eller `python` var tilgjengelig i denne økten. Verifisert i stedet:
en global krøllparentes-/backtick-/parentesbalansesjekk på hele `index.html` (5291 åpne =
5291 lukkede krøllparenteser, partall antall backticks, parentesdiff uendret på −6 — samme
baseline tidligere runder har rapportert, ingen ny ubalanse introdusert), `diff index.html
kontroll.html` bekreftet identiske etter synkronisering, og full gjennomlesning av hver
endret funksjon/mal (`renderVerksted()` sin `linkedSak`- og ikke-`linkedSak`-gren,
`attachVerkstedListeners()`, `bestillService()`/`bestillDekkskift()`/`bestillEuKontroll()`/
`bestillRuteskift()`/`bestillVerkstedForSak()`/`goToRegisterVT()`, `submitAddVT()`,
`goTo()`) før og etter redigering. **Ikke verifisert i en faktisk kjørende nettleser eller
mot en ekte/mock-Airtable-base i denne økten** — Verksted er en administrasjonsskjerm som
krever innlogging, samme begrensning som flere tidligere prioriteter (se f.eks. Prioritet
71.8/71.10).

**Anbefalt før idriftsettelse:** logg inn som administrator og bekreft i en ekte nettleser:
(1) «📅 Bestill verkstedtime» fra en sak i «Under oppfølging» viser korrekt bil, sakstype og
sjekkliste i den nye headeren, med riktig forhåndsutfylt verksted/type; (2) «▼ Flere
detaljer» åpner/lukker uten å nullstille Dato/Tid/Verksted-feltene, og kommentarforslaget
vises korrekt først etter åpning; (3) innsending fortsatt kobler verkstedtimen til riktig
sak og setter `sak.status = 'verksted-bestilt'` som før; (4) den frittstående «🔧 Ny
verkstedtime» (uten sak) fortsatt fungerer uendret med ny feltrekkefølge og «Flere
detaljer»; (5) mobilitetsgaranti-boksen vises/skjules fortsatt korrekt ved typebytte.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll (`submitKontroll()`), `v.km`-
skriveregler, saksmotoren (`sakFase()`/`sakErApen()`/`godtaSak()`/`avslaSak()`/
`markerSakUtfort()`/`sakTilVtType()` kun lest, aldri endret), Kalender, Biloversikt,
Varslingssenteret, Layout Editor, Bilkategorier, `storage.airtable.js`/Airtable-skjema,
PWA/manifest-ikonfilene, `HOVEDSTATUS_IKON` og alle andre statusfargesirkler.

**Kjente, dokumenterte begrensninger:**
- Arbeidsordre-headerens ikoner (`luc('truck','ic-blue')`, `SAK_TYPE_LUCIDE`) er Lucide,
  mens resten av Verksted-skjermen (h2/h3-titler, mobilitetsgaranti-boksen) fortsatt bruker
  emoji — bevisst, IKKE en ny inkonsistens: `VT_TYPE_VELGER` (Prioritet 71.6) bruker allerede
  Lucide-ikoner på nøyaktig dette skjemaet, og `SAK_TYPE_LUCIDE` er samme ikon brukeren
  nettopp så på sakskortet i Aktive saker rett før navigering hit. Verksted er ikke en av de
  screens Prioritet 55/58/72.0 offisielt fullmigrerte — se de seksjonene for gjeldende status.
- Ikke UI-verifisert i en faktisk innlogget nettleserøkt i denne omgangen (se «Testet» over)
  — kun grundig statisk lese-/strukturverifisering.

---

## Prioritet 49, Del 2 (2026-09-18) — Løftebord: avvik, vedlikehold og årlig kontroll

Bestilling: utvid Bilpark med full løftebordstøtte — sjåføravvik, sjåførvedlikehold
(smøring), administratorens årlige kontroll, varsling og full historikk. Eksplisitt krav:
**ingen** «Har løftebord»/«Løftebord aktivert»/«Vis/skjul løftebord»-felt eller annen
kjøretøykonfigurasjon — alle kjøretøy i dagens flåte har løftebord. Tre begreper skal aldri
blandes: løftebord*avvik* (noe er feil), løftebord*vedlikehold* (smøring) og
løftebord*kontroll* (årlig).

**Varig regel: løftebordavvik er IKKE en egen datamodell.** Det er en ren tilleggsverdi i den
eksisterende `KONTROLLAVVIK_ORDER`/`_LABEL`/`_IKON`/`_LUCIDE`-motoren (samme mønster som
«Slitte bremser» fikk i Prioritet 71.2) — dukker automatisk opp i BÅDE full sjåførkontroll
(`renderKontroll()`) og Min Bil sin hurtigflyt (`renderDriverMinBil()`), uten én eneste linje
ny avviks- eller saksmotorlogikk. Vedlikehold og kontroll er derimot HELT egne hendelser i en
ny, dedikert Airtable-tabell — ingen av de tre begrepene deler datamodell med hverandre.

**Løsning — Del 1 (avvik):**
- `'loftebord'` lagt til i `KONTROLLAVVIK_ORDER` (ikon 🛗, Lucide `arrow-up-down`, label
  «Løftebord»). Full sjåførkontroll trenger ingen endring — checkboxen dukker opp av seg selv,
  registreres med den generiske «Automatisk generert fra kontrollregistrering.»-teksten
  akkurat som de fire andre typene, i den eksisterende batch-saken
  (`registrerKontrollAvvikSomSak()`).
- Min Bil sin hurtigflyt (`mb-avvik-*`) fikk derimot en ny, betinget fritekst
  **Beskrivelse**-textarea, vist KUN når `minBilAvvikType === 'loftebord'`
  (`minBilAvvikBeskrivelse`, nullstilt så snart brukeren velger en annen type eller lukker
  panelet — teksten skal aldri kunne henge igjen og sendes inn på en senere, urelatert
  registrering). `submitMinBilAvvik()` bruker denne teksten som sakens `description` i stedet
  for den generiske auto-teksten NÅR den faktisk er fylt ut — for løftebord alene, de fire
  andre avvikstypene er UENDRET. Fortsatt kun ett kall til `registrerAvvikSomSak()` — ingen
  parallell saksopprettelse.

**Løsning — Del 2/3/4 (Min Bil — kort, vedlikehold, varsling):**
- Nytt `.loftebord-card` (gjenbruker `.acc-row.ok/.oppfolging/.varsel` sin fargede
  venstrekant — grønn/gul/rød, IKKE en ny statusfargekomponent) rendres alltid i
  `renderDriverMinBil()`, BEVISST utenfor `layoutFlateHtml('minbil', komponentHtml)` — det
  finnes ingen konfigurasjon som kan skjule det, siden det ikke finnes noen
  «har løftebord»-bryter å skjule det bak (samme unntaksprinsipp som «✓ Sjekk ut bil»,
  Prioritet 44).
- `loftebordVedlikeholdStatus(vehicleId)` leser siste `loftebordHistorikk`-rad av typen
  `'vedlikehold'` for bilen og beregner dager siden med `daysSince()` — en ren
  Date.UTC-kalenderdifferanse (samme funksjon service-/EU-kontroll-status alltid har brukt),
  IKKE månedsnummer, og fungerer derfor korrekt over månedsskifte/årsskifte/skuddår uten egen
  logikk. Ingen historikk → 🔴 «Vedlikehold ikke registrert»; 0–14 dager → 🟢; 15–30 → 🟡;
  31+ → 🔴.
- «🛢 Smør løftebord» deler `minBilAksjon`-tilstanden med de fire andre handlingskortene
  (verdi `'loftebord'`) — kun ett panel åpent om gangen, samme etablerte mønster. Panelet
  krever en avkrysning («Løftebord er smurt») FØR «✅ Registrer vedlikehold»-knappen aktiveres
  (`disabled`-attributt styrt av `minBilLoftebordSmurt`), med valgfri kommentar.
  `submitMinBilLoftebordVedlikehold()` pusher `{id, vehicleId, dato, tidspunkt, type:
  'vedlikehold', utfortAv: driverNavn, kommentar, registreringskanal: 'sjafor'}` til
  `loftebordHistorikk`, lagrer, og viser `alert('✅ Vedlikehold registrert.')` — samme
  bekreftelsesmønster som `submitMinBilAvvik()`/`submitMinBilVarsel()`. Beskyttet mot
  dobbeltklikk med `beskyttKlikk()`.

**Løsning — Del 5/6 (administratorens årlige kontroll, kun Bilinformasjon):**
- Ny seksjon «🛗 Løftebord — Årlig kontroll» i `infoBody` (Kjøretøyprofil →
  «✏️ Rediger informasjon»), MED VILJE plassert som en egen, alltid synlig statusblokk —
  ikke et skjemafelt knyttet til «Lagre»-knappen, siden dette er en tidsstemplet hendelse
  (som `godtaKmEndring()`), ikke en redigerbar kjøretøyegenskap.
- «✅ Utført løftebordkontroll» (`registrerLoftebordKontroll(vehicleId)`) krever kun ett
  `confirm()` — ingen skjema. Dato (`todayISO()`), utført av (`loggedInRole`, samme
  identitetskilde som `godtaKmEndring()`/`avslaKmEndring()`, Prioritet 71.10) og
  registreringskanal (`'admin'`) settes automatisk. Gyldighet er en LIVE beregning
  (`loftebordKontrollStatus()`), ikke et lagret felt: `isoDateOffset(sisteKontrollDato, 365)`
  — samme ren kalenderdato-forskyvning som `daysSince()` bruker, konsistent med
  CLAUDE.md sin regel om at «i dag»/datoberegninger aldri skal bruke månedsnummer-aritmetikk.
- Fire nivåer: >30 dager til utløp → 🟢 Gyldig; 0–30 → 🟡 Utløper snart; utløpt → 🔴 Kontroll
  utløpt; ingen historikk → 🔴 Kontroll mangler. Vises UTELUKKENDE i Bilinformasjon — ingen
  varsel lagt til Varslingssenteret, Dashboard eller noe sjåførvisning, som eksplisitt bedt om.

**Løsning — Del 7 (historikk):** en ny, enkel `<ul class="dmg-simple-list">`-liste
(`vehicleLoftebordHistorikk()`/`loftebordHistorikkRadHtml()`) rett under kontroll-statusen i
samme Bilinformasjon-seksjon, nyeste først, tydelig merket «✅ Kontroll» eller
«🛢 Vedlikehold» + utført av + eventuell kommentar — samme visningsmønster (dato – tekst) som
den eksisterende Verkstedhistorikk-listen lenger ned i samme panel.

**Løsning — Del 8 (datamodell):** ny Airtable-tabell **LiftgateHistory** (app-nøkkel
`loftebordHistorikk`), registrert i `LIST_TABLES` i `storage.airtable.js` SAMTIDIG som
funksjonene som bruker den (feltregelen fulgt) — felt `id`/`vehicleId`/`dato`/`tidspunkt`/
`type`/`utfortAv`/`kommentar`/`registreringskanal`, `type` er ENTEN `'kontroll'` ELLER
`'vedlikehold'`. Lastes/lagres med nøyaktig samme mønster som `dekkhistorikk`
(`window.storage.get/set('loftebordHistorikk', ...)`) — en ekte Airtable-tabell, IKKE en
JSON-blob i Settings. Lagt til i `loadAll()`, `reloadOne()` (inkl. `_lagBatchetLiveSyncHandler()`
sin bakgrunnspoll, som automatisk plukker den opp via `Object.keys(LIST_TABLES)` uten egen
kode) og `deleteVehicle()` sin opprydding (filtrert bort sammen med skader/verkstedtimer når
et kjøretøy slettes). **Bevisst IKKE lagt til i `resetFleetData()`** — den funksjonen tømmer
allerede i dag KUN damages/verkstedtimer/kontroller/varsellys, IKKE dekkhistorikk/
servicehistorikk/aktiveSaker, til tross for sin egen kommentar om «all operativ historikk»;
å inkludere løftebordhistorikk der ville vært et bevisst avvik fra dette eksisterende (om enn
snevrere enn dokumentert) mønsteret, ikke en konsistent utvidelse av det.

**Ingen `HarLoftebord`-felt på `Vehicles`, og ingen annen løftebord-konfigurasjon noe sted i
koden.** `storage.airtable.js` versjon v2.19.0 → v2.20.0 (kun ett nytt `LIST_TABLES`-tillegg —
ingen eksisterende felt endret), `?v=` i `index.html`/`kontroll.html` oppdatert tilsvarende,
`CACHE_VERSION`/`APP_VERSION`/`version.json` økt sammen (app-shell-innhold endret betydelig).

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi),
`storage.airtable.js`, `sw.js`, `version-check.js`, `version.json`, `AIRTABLE_MIGRATION.md`
(ny `LiftgateHistory`-seksjon), `CHANGELOG.md`, `ROADMAP.md`.

**Testet:** verken `node` eller `python` var tilgjengelig i denne økten (samme begrensning som
flere tidligere prioriteter). Verifisert i stedet: en global krøllparentes-/backtick-
balansesjekk på hele `index.html`, og full gjennomlesning av hver ny/endret funksjon
(`vehicleLoftebordVedlikehold()`/`loftebordVedlikeholdStatus()`/`vehicleLoftebordKontroll()`/
`loftebordKontrollStatus()`/`vehicleLoftebordHistorikk()`/`loftebordHistorikkRadHtml()`,
`submitMinBilAvvik()`, `submitMinBilLoftebordVedlikehold()`, `registrerLoftebordKontroll()`,
`renderDriverMinBil()`/`attachDriverMinBilListeners()`, `renderBilkort()`/
`attachBilkortListeners()` sine endrede deler, `loadAll()`/`reloadOne()`/`deleteVehicle()`)
før og etter redigering, samt `diff index.html kontroll.html` bekreftet identiske etter
synkronisering. **Ikke verifisert i en faktisk kjørende nettleser eller mot en ekte/mock-
Airtable-base i denne økten** — samme forbehold som flere tidligere prioriteter (se f.eks.
Prioritet 71.5/71.10).

**Anbefalt før idriftsettelse:** opprett `LiftgateHistory`-tabellen i Airtable (se
AIRTABLE_MIGRATION.md for feltliste) FØR appen tas i bruk med denne versjonen — uten den vil
lesing/skriving av løftebordhistorikk feile eller bli stille ignorert, avhengig av API-
oppførsel. Deretter, i en nettleser: (1) registrer et løftebordavvik fra Min Bil med en
beskrivelse og bekreft at saken får nettopp den teksten i Aktive saker; (2) registrer et
løftebordavvik fra full sjåførkontroll og bekreft at det havner i samme batch-sak som andre
samtidige avvik; (3) bekreft at «🛗 Løftebord»-kortet på Min Bil viser riktig farge/tekst for
0/10/20/35 dager siden sist smurt, og for «aldri smurt»; (4) registrer vedlikehold og bekreft
at kortet oppdaterer seg umiddelbart uten reload; (5) i Bilinformasjon, registrer en
løftebordkontroll og bekreft dato/utført av/gyldig-til/status, og at historikklisten viser
begge hendelsestyper korrekt skilt fra hverandre; (6) bekreft at et kjøretøy som slettes også
fjerner dets løftebordhistorikk.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll (`submitKontroll()`), `v.km`-skriveregler,
saksmotoren (`registrerAvvikSomSak()`/`registrerKontrollAvvikSomSak()`/`sakErApen()`/`sakFase()`
kun kalt/lest uendret, aldri endret), de fire eksisterende kontrollavvikstypene, Varslingssenteret
(bevisst IKKE utvidet med løftebordvarsler — verken avvik, vedlikehold eller kontroll er en del
av `beregnVarslingssenterListe()`, siden ticket-en eksplisitt skilte dette ut som egne, separate
mekanismer), Layout Editor-mekanikken for øvrig, Bilkategorier, `resetFleetData()`.

**Kjente, dokumenterte begrensninger:**
- Løftebordhistorikken vises kun inne i Bilinformasjon-redigeringspanelet på Kjøretøyprofilen
  — ikke som en egen fane i `PROFIL_FANER`/`HISTORIKK_SUB_ORDER`, og ikke i den flåtebrede
  Historikk-huben (`renderHistorikk()`) eller i Rapporter. Tilstrekkelig for ticket-ens krav
  («vise historikk for kontroll og vedlikehold»), men en fremtidig sak kan vurdere å løfte
  denne inn i Historikk-fanen/Rapporthub dersom løftebordhistorikk trengs på flåtenivå.
- Løftebordvedlikehold/-kontroll varsler ALDRI i Varslingssenteret, Dashboard eller noe annet
  sted enn Min Bil-kortet (sjåfør) og Bilinformasjon (admin) — et bevisst, eksplisitt valg fra
  ticket-en («Ingen varsler til sjåfør» for kontroll; vedlikeholdsvarselet skal kun vises på
  Min Bil-kortet), ikke en forglemmelse.
- Ikke UI-verifisert i en faktisk kjørende nettleser i denne omgangen (se «Testet» over) — kun
  grundig statisk lese-/strukturverifisering.

---

## Prioritet 50 (2026-09-18) — Dashboard 5.0: ett skall, ett banner, én Hurtigoversikt

> ⚠️ **Delvis avløst av Prioritet 58 (2026-09-19) for DESKTOP:** «banneret er fast innhold, ikke en Layout Editor-
> komponent» gjelder ikke lenger der — Operativ kontroll og Neste verkstedtime er nå to vanlige kort i Dashboard
> Editor (`operativ-kontroll`, `neste-verkstedtime`) som kan flyttes/skjules. Mobil bruker fortsatt det samlede,
> faste banneret (`dashOperativBannerHtml()`). Resten av denne seksjonen (kontrollgrunnlag, Hurtigoversikt) gjelder uendret.

Bestilling: forenkle Dashboard til et operativt arbeidsbord — under 2 sekunder skal
brukeren forstå kontrollstatus i dag, kontrolltrend, aktive biler, saker som krever
handling, planlagt verksted og varsler. To deler, begge omfattende.

### Del 1 — Ny app-ramme (kun desktop)

**Problem:** sidepanelet og innholdsområdet var visuelt to separate kort — sidepanelet
hadde sin egen border/bakgrunn/radius, innholdsområdet hadde ingen, og hver skjerm bygde
sin egen `<h2>`-tittel et sted inni innholdet i stedet for i et delt banner.

**Løsning:** en ny, delt `.desktop-frame` (border/bakgrunn/radius) omslutter BÅDE en
full-bredde toppstripe (`.desktop-frame-top`: brand + `desktopFrameTittel()` + varselklokke
`#frame-varsler-btn`) og selve sidepanel+innhold-raden (`.desktop-frame-body`) under.
`.desktop-sidebar` sin egen border/bakgrunn/radius (Design 4.1-laget, Prioritet 38) er
nøytralisert til kun en loddrett `border-right` mot innholdet — rammen eier nå kantlinjen.
`desktopFrameTittel()` slår opp gjeldende `screen` i en ny `DESKTOP_FRAME_TITTEL`-tabell.
Brand-blokken er flyttet UT av `renderDesktopSidebarHtml()` (nå kun i toppstripen).

**Delt, ikke per skjerm.** Rammen bygges ÉN gang i den sentrale `render()`-innpakningen —
enhver admin-skjerm får den derfor automatisk, uten å måtte endres selv. `renderDashboard()`
sin gamle egen `.p38-tophead`-tittel (tittel+bell+dato/vær) er fjernet — dato/vær-linjen
er flyttet inn i det nye Operativ kontroll-banneret (se Del 2), tittelen inn i den delte
toppstripen. De ANDRE ni skjermene (Biler, Verksted, Kalender, osv.) beholder sin egen,
eksisterende `<h2>` UENDRET i denne runden — se «Kjente, dokumenterte begrensninger».

**Regresjonsvern:** `#header-menu-btn` (den skjulte, men fortsatt fullt funksjonelle
☰ Meny-knappen/drawer-mekanismen) render()-koden alltid har gjort et ubetinget
`getElementById(...).addEventListener(...)`-kall på, MÅTTE forbli i DOM-en på begge
grener (desktop og mobil) — akkurat den samme feilklassen som `del-vehicle`-regresjonen i
Prioritet 72.1. Løst ved å beholde `shell-top`-markupen uendret og alltid til stede (kun
visuelt skjult på desktop via `.app-shell-desktop .shell-top{display:none}`, uendret CSS),
i en egen `shellTopHtml`-variabel gjenbrukt i begge grener.

**Mobil er BEVISST ikke omfattet av Del 1** — mobil har ingen sidebar (bunnmeny er eneste
navigasjon), og har allerede sin egen, kompakte topplinje (`.p41-head`, kun på Dashboard).
Det finnes derfor ikke noe sidepanel å visuelt koble sammen med noe på mobil.

### Del 2 — Dashboard-innhold: banner + Hurtigoversikt

**⚠️ AVLØST av Prioritet 53 (2026-09-19):** `operativeKjerneBiler()` og `kontrollrateUke()`
finnes ikke lenger — grunnlaget er nå administrator-konfigurert (se «Prioritet 53 (2026-09-19)»
nederst). Teksten under er bevart som historikk.

**Ny kjernepopulasjon for "Operativ kontroll" (Del 3 i ticket):** `operativeKjerneBiler()`
— KUN kjøretøy med `v.driftslag` lik nøyaktig `'Lag 2'`, `'Montering'` eller `'Lastebil'`
(eksakte strenger fra `DRIFTSLAG_ORDER`), i tillegg ekskludert dersom `v.uteAvDrift`,
`v.kategori === 'reserve'` eller `v.status === 'verksted'`. Dette er en BEVISST, ny og
SNEVRERE populasjon enn `aktiveVehicles - reserveUnntatt` (Prioritet 62.1a), som fortsatt
gjelder UENDRET alle andre steder (Biloversikt-filteret «Ikke kontrollert»,
`dashboardBeregning()` sine øvrige tellinger) — de to tallene svarer bevisst på to ulike
spørsmål («hvor mange av flåten» vs. «hvor mange av kjernedriftslagene») og skal ALDRI
blandes eller vises side om side som om de var samme ting. `operativKontrollStatusIdag()`
gir `{kontrollert, totalt, prosent}` for i dag; `kontrollrateUke()` er omskrevet til å
bruke SAMME kjernepopulasjon for 7-dagers trenden (tidligere: hele `!v.uteAvDrift`-flåten).

**Banneret** (`dashOperativBannerHtml(d)`, delt av desktop og mobil): dagens prosent som
stort tall (Del 3), «Kontroll siste 7 dager: X%» som undertekst (Del 4), og en
«🚚 N aktive biler / Se hvilke →»-linje nederst (Del 5) — SAMME data (`d.hDriftCount`) og
SAMME klikkmål (`data-goto-biloversikt-filter="har-aktiv-sjafor"`) som det gamle
«Aktive biler»-KPI-kortet alltid brukte, kun flyttet fra eget kort til en banner-rad, som
ticket eksplisitt ba om («Behold ikon, behold tekst, behold klikkbar funksjon. Kun flytt
plassering»). Banneret er BEVISST fast innhold i selve returtemplaten — IKKE en Layout
Editor-komponent (som «Sjekk ut bil» på Min Bil, Prioritet 44) — nettopp for at desktop og
mobil skal vise identisk innhold uten noen parallell versjon (akseptansekriterium 14).

**Bilpark status er fjernet i sin helhet** (Del 6) — hele `bilparkStatusInnholdHtml()`
sammen med begge komponentene som viste den (desktop og mobil).

**Hurtigoversikt** (`dashHurtigoversiktHtml(d)`, Del 7-11, delt av desktop og mobil): en ny
panel med `.profil-tabs`/`.profil-tab` (SAMME fanekomponent/klasser som Biloversikt,
Prioritet 72.0, og Varslingssenteret, Prioritet 71.6 — ingen ny fanemekanisme), plassert
DIREKTE under Bestill tjenester i `DESKTOP_LAYOUT_KOLONNER.full`. Fire faner:
- **Aktive saker** (`sakFase(s)==='aktiv'`) og **Oppfølging** (`sakFase(s)==='oppfolging'`)
  og **Verksted** (`sakFase(s)==='verksted'`) leser alle `aktiveSaker` direkte, nyeste
  først, via en felles radkomponent `dashHovSakRadHtml(s, fane)` — linje 2 varierer per
  fane (sakens problem for Aktive saker, `s.nextAction` for Oppfølging, verkstedtimens
  dato/verksted via `s.linkedVtId` for Verksted). Klikk navigerer med den UENDREDE
  `goToSakDetalj()` (samme funksjon «Krever handling nå»/«Prioriterte biler» alltid brukte).
- **Varsler** gjenbruker `varslingssenterRadHtml()` HELT UENDRET (samme handlingsknapper —
  Åpne bilkort/sak/kommentarer, Merk som løst, Godta/Avslå km-endring, Marker som sett —
  som selve Varslingssenteret allerede har). De tilhørende lytterne
  (`data-goto-varsel-*`/`data-kvitter`/`data-godta-km`/`data-avsla-km`/
  `data-marker-varsel-sett`) er lagt til i `attachDashboardListeners()`.
- Hver fane viser maks 8 rader, med en «se alle»-lenke til riktig sted (Aktive saker sin
  fane, hhv. Varslingssenteret) når det finnes flere.

**De fire gamle KPI-kortene fjernet fullstendig** (`sakFaseTellereHtml()`,
`dashboardKpiRadHtml()`, `kontrollstatusKpiHtml()`, `aktiveBilerKpiHtml()`, samt
«Denne uken»-kalenderwidgeten `kalenderUkeWidgetHtml()`/`kalenderUkeDager()` og
`kommendeOppgaveRadHtml()`/`dashKreverRadHtml()`/`bilparkStatusInnholdHtml()`) — alle var
enten fullstendig orphanet av denne omleggingen eller erstattet av banneret/Hurtigoversikt,
og er derfor SLETTET, ikke bare avkoblet, i tråd med prosjektets etablerte
«hjelpere uten kallesteder er død kode»-prinsipp (Prioritet 62.1a). `KOMMENDE_ART` (kun
brukt av den slettede `kommendeOppgaveRadHtml()`) er slettet av samme grunn. `goToSakFane()`
er BEHOLDT — fortsatt i bruk av Hurtigoversikt sine «se alle i Aktive saker»-lenker.

**`DASHBOARD_LAYOUT_FLATER`/`DESKTOP_LAYOUT_KOLONNER` er kraftig forenklet**: desktop og
mobil har nå begge kun to Layout Editor-komponenter (`bestill`, `hurtigoversikt`) — det
gamle to-kolonners oppsettet (`dash40-split`, `venstre`/`hoyre`) er avviklet til fordel for
én, full bredde. `getLayoutFlate()` sin eksisterende fremtidssikring forkaster automatisk
enhver tidligere lagret referanse til de fjernede komponentnøklene — ingen egen migrering.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi), `sw.js`
(`CACHE_VERSION` bilpark-v98 → bilpark-v99), `version-check.js` (`APP_VERSION` 98 → 99),
`version.json` (`"version"` 98 → 99). **`storage.airtable.js` er IKKE endret** — ren
presentasjons-/navigasjonsendring på eksisterende, allerede leste felt/funksjoner (kun
`v.driftslag`/`v.status`/`v.kategori`/`v.uteAvDrift` LEST i en ny kombinasjon, aldri nye
felt) — derfor uendret `versjon`/`?v=`.

**Testet:** verken `node` eller `python` var tilgjengelig i denne økten. Verifisert i stedet:
en global krøllparentes-/backtick-/parentesbalansesjekk på hele `index.html` etter hver
større redigeringsrunde (balansert gjennomgående, parentesdiff uendret på −6 — samme
baseline tidligere runder har rapportert), `diff index.html kontroll.html` bekreftet
identiske etter synkronisering, og full gjennomlesning av hver endret/ny funksjon
(`operativeKjerneBiler()`/`operativKontrollStatusIdag()`/`kontrollrateUke()`,
`dashOperativBannerHtml()`/`dashHovSakRadHtml()`/`dashHurtigoversiktInnholdHtml()`/
`dashHurtigoversiktHtml()`, `renderDashboard()`/`renderMobilHjem()` i sin helhet, den nye
render()-innpakningen med `.desktop-frame`) før og etter redigering. **Ikke verifisert i en
faktisk kjørende nettleser eller mot en ekte/mock-Airtable-base i denne økten** — samme
forbehold som flere tidligere prioriteter (se f.eks. Prioritet 71.5/71.10/49 Del 2).

**Anbefalt før idriftsettelse:** åpne appen i en nettleser og bekreft: (1) sidepanelet og
toppstripen fremstår visuelt som ett sammenhengende skall på desktop, med korrekt
sidetittel per skjerm og fungerende varselklokke; (2) ☰ Meny/drawer fortsatt fungerer
(regresjonsvernet over); (3) Operativ kontroll-banneret viser korrekt prosent for
KUN Lag 2/Montering/Lastebil-biler (sammenlign manuelt mot Biloversikt filtrert på
driftslag); (4) «Se hvilke →» åpner Biloversikt filtrert på aktiv sjåfør; (5) alle fire
Hurtigoversikt-fanene viser riktig antall og riktig innhold, og at handlingsknappene i
Varsler-fanen (Godta/Avslå km, Merk som løst, Marker som sett) fungerer identisk til selve
Varslingssenteret; (6) mobil viser nøyaktig samme banner og Hurtigoversikt som desktop.

**Ikke rørt:** Aktiv sjåfør-logikk, Sjåførkontroll (`submitKontroll()`), `v.km`-
skriveregler, saksmotoren (`sakFase()`/`sakErApen()`/`godtaSak()`/`avslaSak()`/
`goToSakDetalj()` kun lest/kalt uendret, aldri endret), Varslingssenteret sin egen logikk
(`beregnVarslingssenterListe()`/`varselErSkjult()`/`varslingssenterRadHtml()` kun
gjenbrukt uendret), Bestill tjenester-kortenes egen logikk, Layout Editor-mekanikken for
øvrig, Bilkategorier, `storage.airtable.js`/Airtable-skjema, PWA/manifest-ikonfilene,
Driftsmodus (`renderDriverShell()` — helt uberørt av Del 1, egen render-vei).

**Kjente, dokumenterte begrensninger:**
- Del 1 er BEVISST avgrenset til selve app-rammen (sidepanel+toppstripe) — de ni andre
  skjermenes egne, eksisterende `<h2>`-titler (Biler, Verksted, Kalender, Aktive saker,
  Varsler, Kostnader, Rapporter, Analyse, Innstillinger) er IKKE fjernet i denne runden,
  til tross for at sidetittelen nå også vises i den delte toppstripen. Dette er en bevisst
  risikobegrensning (stripping av ni separate skjermers markup økte omfanget vesentlig)
  — akseptansekriteriene i denne saken tester kun selve rammen og Dashboard-innholdet, ikke
  fravær av duplisert tittel på andre skjermer. Vurder som egen, avgrenset sak.
- `dashboardBeregning()` beregner fortsatt flere felt (`dashKreverListe`/
  `prioriterteBilerListe`/`kommendeOppgaver`/`hbp`/`biloversiktBiler` m.fl.) som nå har
  INGEN gjenværende leser etter at de tilhørende visningene ble fjernet fra Dashboard —
  ren, harmløs overflødig beregning (ikke en korrekthetsfeil), bevisst ikke ryddet i denne
  runden for å avgrense omfanget av en allerede stor endring. Se kommentaren ved
  `dashboardBeregning()` sin deklarasjon.
- Flere nå-orphanede CSS-klasser (bl.a. `.dash40-grid5-kpi`, `.dash-kal-widget`,
  `.p38-statrow`, `.dash50-biltabell`, `.desktop-sidebar-brand`) er ikke fjernet — samme
  lavrisiko-vurdering som tidligere runder har gjort for tilsvarende orphanet CSS (f.eks.
  `.danger-zone`, Prioritet 71.9).
- Ikke UI-verifisert i en faktisk kjørende nettleser i denne omgangen (se «Testet» over) —
  kun grundig statisk lese-/strukturverifisering.

---

## Prioritet 51 (2026-09-18) — Korrigert krav: Aktiv sjåfør og dagskille kl. 04:00

**Den ferdige, autoritative regelen** (ordrett fra ticket-en, gjelder permanent):

> «Aktiv sjåfør beholdes gjennom operativ dag, men nullstilles alltid ved operativt
> dagskille kl. 04:00.»

**Viktig om denne saken sin natur:** ticket-en beskrev et fullstendig, detaljert
kravsett for aktiv sjåfør/dagskille som om det skulle bygges fra bunnen
(`nullstillAktiveSjaforerEtterDagskille()`, snapshot/rollback, `_koKjor()`-gjenbruk osv.).
Grundig lesing av EKSISTERENDE kode (`ryddOppBiloktDagskille()`/`handhevOperativtDogn()`/
`vehicleAktivSjafor()`/`settAktivSjafor()`, alle fra Prioritet 34/40/66/66.2) viste at
praktisk talt HELE mekanismen allerede var på plass og korrekt — inkludert riktig
tidssone-/DST-robust 04:00-grense (`isoDateForOperationalDay()`, `Intl.DateTimeFormat`
med eksplisitt `Europe/Oslo`), riktig `window.storage.set('vehicles', ...)`-vei, riktig
gjenbruk av den serialiserte ressurskøen, og riktig "GET skal aldri erstatte vehicles med
tom liste ved feil"-beskyttelse (Prioritet 66.9). Denne saken er derfor en PRESIS
KORRIGERING av tre reelle, konkrete avvik — ikke en ny arkitektur — pluss to reelle
mangler (manuell nullstilling fantes ikke; «siden»-tidspunktet ble aldri vist).

### Avvik 1 — `aktivSjaforSiden` ble overskrevet ved hver kontroll, selv for samme sjåfør

**Feil (før):** `settAktivSjafor()` satte ubetinget `v.aktivSjaforSiden = new
Date().toISOString()` ved HVER kontroll — Ahmed kl. 07:12, deretter Ahmed igjen kl. 11:45
på samme bil, ga «Siden kl. 11:45», ikke «Siden kl. 07:12» som kravet sier.

**Rettet:** en ny `sammeSjaforSammeOperativeDag`-sjekk (samme navn, trimmet/case-ufølsomt,
OG forrige `aktivSjaforSiden` tilhører INNEVÆRENDE operative dag) avgjør om tidsstempelet
skal beholdes. Kun en FAKTISK ny sjåfør, eller samme sjåfør etter et dagskille (en ny
"vakt"), får et nytt tidsstempel. `settAktivSjaforForKontroll()`/`startBilokt()`/
`overforAktivSjafor()` er alle UENDRET — de kaller fortsatt kun `settAktivSjafor()`, som nå
har riktig oppførsel for alle tre.

### Avvik 2 — ingen rollback i `ryddOppBiloktDagskille()` ved mislykket lagring

**Feil (før):** funksjonen mutere `vehicles` direkte (tømte `aktivSjafor`/
`aktivSjaforSiden`) og kalte `saveVehicles()` (den ALERT-varslende varianten) — ved en
mislykket Airtable-skriving forble den LOKALE nullstillingen stående uendret, selv om
Airtable fortsatt hadde det gamle, ikke-nullstilte innholdet. Ticket-krav 8/9/17: "Ved
feil skal lokal tilstand rulles tilbake" / "ikke lat som nullstillingen er lagret".

**Rettet:** samme snapshot/rollback-mønster som `submitKontroll()`/`deleteVT()` allerede
etablerte (Prioritet 66.1) — en dyp kopi av `vehicles` tas FØR mutasjonen, og
`saveVehiclesOrThrow()` brukes i et try/catch som gjenoppretter snapshotet ved feil. Denne
funksjonen ER OG FORBLIR den ETT-og-eneste "nullstillAktiveSjaforerEtterDagskille()"
ticket-en ba om — gjenbrukt under sitt eksisterende, allerede referererte navn, ikke
duplisert under et nytt. Retry skjer automatisk: neste inngangspunkt (oppstart,
`visibilitychange`, `pageshow`, live-synk, `goTo()`) finner den SAMME foreldede biløkten
igjen, siden den lokale tilstanden ble rullet tilbake til akkurat det den var før forsøket.

**Utvidet i samme runde:** "foreldet" dekker nå OGSÅ manglende/ugyldig `aktivSjaforSiden`
(ikke bare "riktig dato, men fra en tidligere operativ dag") — dekker ticket-ens
testscenarioer "AktivSjafor finnes, men AktivSjaforSiden mangler" og "Ugyldig
AktivSjaforSiden" ved faktisk å RYDDE OPP anomalien i stedet for å la den stå for alltid.
Samme utvidede sjekk er speilet i `handhevOperativtDogn()` sin `harForeldetBilokt`-
forhåndssjekk, slik at en slik anomali ikke kan unngå opprydding resten av dagen fordi den
oppsto etter forrige dagskille-kontroll.

### Avvik 3 — reell krasjrisiko ved ugyldig `aktivSjaforSiden` (funnet under verifisering)

**Feil (før, ikke tidligere oppdaget):** `vehicleAktivSjafor()` kalte
`isoDateForOperationalDay(new Date(v.aktivSjaforSiden))` uten å sjekke om resultatet var et
gyldig tidspunkt. `new Date('en-ugyldig-streng')` gir en `Invalid Date`, og
`Intl.DateTimeFormat(...).formatToParts()` (brukt inne i `isoDateForOperationalDay()`)
**kaster en `RangeError`** på en `Invalid Date` i stedet for å returnere noe. Siden
`vehicleAktivSjafor()` er den ENESTE kilden til "aktiv sjåfør" og leses av praktisk talt
alle skjermer (Dashboard, Biloversikt, Kjøretøyprofil, Min Bil, Aktive sjåfør-tellinger),
ville én eneste korrupt `aktivSjaforSiden`-verdi i Airtable ha KRASJET render() på tvers av
hele appen — ikke en isolert visningsfeil. Samme krasjrisiko fantes i `settAktivSjafor()`
sin nye `sammeSjaforSammeOperativeDag`-sjekk (Avvik 1) mot den EKSISTERENDE, forrige
verdien av `aktivSjaforSiden` på bilen som kontrolleres.

**Rettet:** begge stedene sjekker nå eksplisitt `isNaN(dato.getTime())` FØR
`isoDateForOperationalDay()` kalles, og behandler en ugyldig verdi som "ikke aktiv"/"ikke
samme vakt" i stedet for å krasje. `tidFraIso()` (ny, se under) har samme vakt fra starten.

### Ny funksjonalitet — manuell nullstilling (Del 9) og synlig "Siden kl. HH:MM" (Del 3)

Ticket-en omtalte «Administratorens knapp beholdes: [Nullstill aktiv sjåfør]» som om den
allerede fantes — et grundig søk bekreftet at den IKKE gjorde det (kun den urelaterte,
PER-BIL konfigurerbare «🔁 Nullstill aktiv sjåfør automatisk»-bryteren fra Prioritet 72.1,
med et helt annet, admin-valgt klokkeslett, standard 14:50 — en annen mekanisme enn det
autoritative 04:00-dagskillet, og bevisst IKKE endret i denne saken). Bygget nå fra bunnen:

- **`nullstillAktivSjaforManuelt(vehicleId)`** — ett-klikks admin-handling i Bilinformasjon
  (`renderBilkort()` → `infoBody`), samme snapshot/rollback-mønster som over, `confirm()`
  før utførelse, `krevVehiclesSkriving()`-vakt, virker HELT uavhengig av både det
  automatiske 04:00-dagskillet og den per-bil konfigurerbare autoreset-tiden. Vises kun når
  `vehicleAktivSjafor(v.id)` faktisk er sann (ingen knapp å trykke på en bil uten aktiv
  sjåfør). Lytteren bruker samme `querySelectorAll`-forsiktighet som løftebord-knappen
  (Prioritet 49 Del 2) — knappen finnes betinget i DOM-en.
- **`tidFraIso(iso)`** (ny, delt hjelpefunksjon) formaterer et VILKÅRLIG ISO-tidsstempel
  (ikke bare "nå", som `nowTimeOslo()` gjør) til `HH:MM` i Europe/Oslo — brukt til å
  faktisk VISE `aktivSjaforSiden`, som frem til nå kun ble lest internt, aldri rendret i
  UI. Lagt til to steder: Kjøretøyprofilens `.profil-stat5` "Aktiv sjåfør"-kort (`Siden kl.
  HH:MM` i stedet for det tidligere «Kjører nå») og Biloversikt-kortets sjåførpille
  (`👤 Ahmed · siden 07:12`).
- **`handhevOperativtDogn()` kalles nå eksplisitt ved starten av `submitKontroll()`** —
  dekker ticket-ens eksplisitte inngangspunktkrav ("før en ny sjåførkontroll behandles") og
  garanterer rekkefølgen fra ticket-ens konkurrentseksjon (kjør dagskillekontroll FØR en
  eventuell ny sjåførovertakelse behandles). Idempotent og billig — ingen ny Airtable-
  trafikk når døgnet ikke har skiftet og ingen biløkt er foreldet.

### Samtidighet — hvorfor ingen ny låsemekanisme var nødvendig

Ticket-ens seksjon 7 spesifiserte en eksplisitt "hent → dagskille → sjåførovertakelse →
lagre → verifiser"-rekkefølge for å hindre at en forsinket dagskillejobb kan fjerne en
sjåfør som nettopp overtok. Analyse av den faktiske kjøremodellen viser at dette ALLEREDE
er garantert, uten noen ny kø/lås: `vehicles` er ETT delt, kontinuerlig mutert JS-objekt,
og `JSON.stringify(vehicles)` i `saveVehiclesOrThrow()` evalueres SYNKRONT i det
øyeblikket kallet skjer — ikke tidligere. Uansett hvilken rekkefølge to
`settAktivSjafor()`/`ryddOppBiloktDagskille()`-kall sine skrivinger til slutt når fram til
Airtable i (via den eksisterende `_koKjor()`-køen), vil den SISTE skrivingen som faktisk
kjører alltid inneholde ALLE mutasjoner gjort til da — inkludert en eventuell ny
sjåførovertakelse som skjedde mens en tidligere dagskille-lagring ventet i køen. Data kan
derfor ikke "tapes" i denne racen. Den eksplisitte `handhevOperativtDogn()`-kallingen i
`submitKontroll()` (over) er likevel lagt til — ikke fordi det er strengt nødvendig for
korrekthet her, men fordi det er billig, eksplisitt ba om, og gir raskere opprydding av
ANDRE biler sin foreldede tilstand samtidig som en kontroll behandles.

**Filer endret:** `index.html`, `kontroll.html` (synkronisert som eksakt kopi), `sw.js`
(`CACHE_VERSION` bilpark-v99 → bilpark-v100), `version-check.js` (`APP_VERSION` 99 → 100),
`version.json` (`"version"` 99 → 100). **`storage.airtable.js` er IKKE endret** — ingen nye
felt (`AktivSjafor`/`AktivSjaforSiden` var allerede registrert siden Prioritet 34/40) —
derfor uendret `versjon`/`?v=`.

**Testet:** verken `node` eller `python` var tilgjengelig i denne økten. Verifisert i
stedet: en global krøllparentes-/backtick-/parentesbalansesjekk på `index.html` etter hver
redigeringsrunde (balansert gjennomgående, parentesdiff uendret på −6), `diff index.html
kontroll.html` bekreftet identiske etter synkronisering, og full gjennomlesning av hver
endret funksjon (`settAktivSjafor()`, `ryddOppBiloktDagskille()`, `handhevOperativtDogn()`,
`vehicleAktivSjafor()`, `nullstillAktivSjaforManuelt()`, `tidFraIso()`,
`submitKontroll()` sitt nye tidlige kall, `galleryCard()`/`renderBilkort()` sine endrede
visningslinjer) før og etter redigering — inkludert et manuelt gjennomspilt tankeeksperiment
av alle 14 testscenarioene i ticket-ens seksjon 11. **Ikke verifisert i en faktisk kjørende
nettleser eller mot en ekte/mock-Airtable-base i denne økten** — samme forbehold som flere
tidligere prioriteter (se f.eks. Prioritet 71.5/49 Del 2/50).

**Anbefalt før idriftsettelse:** åpne appen i en nettleser og bekreft: (1) kontroll kl.
07:12 og igjen kl. 11:45 av samme sjåfør på samme bil beholder «Siden kl. 07:12» i
Kjøretøyprofilen; (2) en ny sjåfør kl. 14:33 gir «Siden kl. 14:33»; (3) sett systemklokken
forbi 04:00 mens appen er åpen (eller last siden på nytt med klokken forbi 04:00) og
bekreft at Dashboardets "aktive biler"-tall og «Se hvilke»-listen ikke lenger viser
gårsdagens sjåfører; (4) administratorens nye «🔁 Nullstill aktiv sjåfør»-knapp i
Bilinformasjon fungerer og kun vises når bilen faktisk har en aktiv sjåfør; (5) simuler en
mislykket Airtable-skriving (f.eks. ved å blokkere nettverket midlertidig) under et
dagskille og bekreft at den lokale visningen IKKE stille viser "nullstilt" uten at det
faktisk er lagret.

**Ikke rørt:** Kilometerlogikk, kontrollflyten for øvrig (`submitKontroll()` sin km-/sak-/
varsellampe-/skadelogikk), saksmotoren, Verksted, Løftebord (Prioritet 49 Del 2),
`handhevAktivSjaforAutoReset()` (den separate, per-bil konfigurerbare 14:50-mekanismen fra
Prioritet 72.1 — bevisst urørt, se «Kjente, dokumenterte begrensninger»), Layout Editor,
Bilkategorier, `storage.airtable.js`/Airtable-skjema, PWA/manifest-ikonfilene.

**Kjente, dokumenterte begrensninger:**
- `handhevAktivSjaforAutoReset()` (Prioritet 72.1) har PRESIS samme manglende
  rollback-svakhet som Avvik 2 hadde (muterer `vehicles` direkte, ingen gjenoppretting ved
  mislykket `saveVehiclesOrThrow()`) — men er en helt annen, opt-in-per-bil mekanisme
  (standard klokkeslett 14:50, ikke det autoritative 04:00-dagskillet) og eksplisitt
  UTENFOR denne ticket-ens omfang. Flagget her for åpenhet, ikke rettet i denne runden —
  vurder som egen, avgrenset sak dersom ønsket.
- Ikke UI-verifisert i en faktisk kjørende nettleser i denne omgangen (se «Testet» over) —
  kun grundig statisk lese-/strukturverifisering og et manuelt tankeeksperiment mot
  ticket-ens 14 testscenarioer.

---

## Prioritet 52 (2026-09-18) — Dashboard UX Polish

Bestilling: stabil layout, mindre visuell støy, tydeligere seksjoner, bedre plassutnyttelse —
uten nye KPI-er, widgets eller dashboardmoduler. `storage.airtable.js` er IKKE endret (ren
presentasjon); `CACHE_VERSION`/`APP_VERSION`/`version.json` økt sammen (100 → 101),
`kontroll.html` er eksakt kopi av `index.html`.

**Del 1 — ingen layout shift (varige regler):**
- `html{overflow-y:scroll;scrollbar-gutter:stable}` — scrollbarsporet er permanent. Fjern det
  ikke: uten det hopper hele siden ~15 px sideveis når en fane gir kortere/lengre innhold.
- **Fanebytte i Hurtigoversikt kaller ikke `render()`.** `byttHurtigoversiktFane()` bytter
  aktiv fane-klasse og `.dash-hov-innhold` (id `dash-hov-sek`), og fester lyttere på nytt kun
  på det nye innholdet via `attachHovInnholdListeners(root)` (samme handlere som før; kalles
  med `document` fra `attachDashboardListeners()`). Nye lyttere for Hurtigoversikt-innhold
  skal legges i `attachHovInnholdListeners()`, ikke direkte i `attachDashboardListeners()`,
  ellers dobbeltfestes de eller mangler etter fanebytte.
- `.dash-hov-innhold{min-height:420px}`, og funksjonen «ratchet»er inline `min-height` opp til
  høyeste fane som er vist (aldri ned). Grunn: en lavere fane forkorter ellers siden, og
  nettleseren klemmer scrollposisjonen når man står nær bunnen (målt: `same:false` uten dette).
  Nullstilles av neste full `render()`.
- **Bestill tjenester på Dashboard bytter ikke innhold** (de fire kortene navigerer videre),
  så tolkningen av «min-height 260 px» er: fast 260 px på den dedikerte Bestill tjenester-
  skjermens 2×2-rutenett (`.dash40-grid2x2`). En minimumshøyde på Dashboardets enkeltrad ga
  bare ~100 px tomrom og er bevisst utelatt.

**Del 2 — banner:** `dashOperativBannerHtml()` (delt desktop/mobil) er to linjer: dato/klokkeslett/
vær, deretter «N% i dag • N% siste 7 dager • 🚚 N aktive» + «Se hvilke →» (`data-goto-biloversikt-
filter="har-aktiv-sjafor"`, uendret klikkmål). Samme tre tall/kilder som før (`operativKontrollStatusIdag()`,
`kontrollrateUke()`, `d.hDriftCount`); høyde ca. 190 → 75 px. Overskriften «Operativ kontroll»
er fjernet fra kortet (sidetittelen ligger i toppstripen/`.p41-head`); «X av Y operative biler»
ligger i `title`-tooltip.

**Del 3 — seksjoner:** ny delt `dashBestillSekHtml()` (desktop og mobil, samme markup) og
`dashHurtigoversiktHtml()` er `<section class="dash-sek">` med `.dash-sek-tittel` (versal
overskrift) og `.dash-sek + .dash-sek` (luft + `--line-soft`-skillelinje). Ingen nye kort/rammer;
Hurtigoversikt mistet i stedet sin egen `.panel`-ramme.

**Del 4 — Biloversikt:** kun `#f-search` + `#reg-filter-btn` («Filter ▼», antall aktive filtre
som merke) er synlige; `showRegisterFilter` (ren visningstilstand, nullstilles av
`resetRegisterFiltre()`) åpner panelet med avkrysning for Kontrollert/Ikke kontrollert
(`filterKontrollStatus`, utelukker hverandre som før) og Reserve/Ute av drift (`visReserve`/
`visUteAvDrift`), samt selectene Kategori/Status/Løyvenummer (`f-kategori`/`f-hovedstatus`/
`f-loyve`). Filtervariabler og -predikat i `renderRegister()` er uendret. Det gamle
`f-kontrollstatus`-nedtrekket er fjernet som kontroll (funksjonen dekkes av de to avkrysningene).
«Biltype» i ticket-ens filterliste finnes ikke som filter i koden (kategori er det nærmeste).

**Verifisert:** global brace-/paren-/bracket-balanse identisk med HEAD, backticks partall; nettleser-
test (lokal statisk server, live Airtable-lesing med `storage.set`/`delete` no-op, admin-tilstand
satt i konsollen) på 1400 px og 579 px: posisjon og bredde for sidepanel, toppstripe, banner,
kortrekke og faner identisk før/etter alle fanebytter, også ved scroll til bunn; scrollbarspor
15 px konstant; filterpanelet og alle filtre endrer bilantallet riktig. **Ikke testet:** ekte
mobilenhet/touch, og at Hurtigoversikt-handlingsknappene i Varsler-fanen (Godta/Avslå km, Merk
som løst) fortsatt fungerer etter fanebytte — lytterne festes på nytt, men handlingene ble ikke
utløst mot ekte data (skriving var bevisst avslått).

---

## Prioritet 53 (2026-09-19) — Konfigurerbart grunnlag for operativ kontroll

(Brukerens egen nummerering; det finnes en tidligere, urelatert «Prioritet 53 — Dashboard 5.0»
lenger opp. Nummeret følger brukerens backlog, ikke denne filens rekkefølge.)

**Varig regel: hva som er «operativ kontroll» bestemmes av administrator, ikke av appen.**
Dagens Dashboard-tall (kontrollprosent i dag og siste 7 driftsdager) regnes UTELUKKENDE fra to
lagrede valg: en liste kjøretøy og en liste ukedager. Appen gjetter ikke, filtrerer ikke og
har ingen fallback. Dagens behov er 13 kjøretøy og man–fre; lørdag/søndag kan aktiveres senere
uten kodeendring.

**Datamodell.** ÉN JSON-blob i den eksisterende Settings-tabellen, nøkkel
`operativ-kontrollgrunnlag` (`OPERATIV_GRUNNLAG_KEY`), lest/skrevet med
`window.storage.get/set(nøkkel, verdi, true)` — samme mønster som `standardverksted`/
`varselSett`/`ringeliste-ekstra`. Ingen ny Airtable-tabell, ingen nye felt på `Vehicles`,
ingen `LIST_TABLES`-registrering, **`storage.airtable.js` er uendret** (uendret `versjon`/`?v=`):

    {"version":1, "vehicleIds":["<Vehicle-ID>",…], "activeWeekdays":[1,2,3,4,5],
     "updatedAt":"ISO", "updatedBy":"<innlogget rolle>"}

Ukedager er ISO (1 = mandag … 7 = søndag). **Kjøretøy lagres med `v.id`, aldri navn eller
gruppe** — omdøping av bil og flytting mellom driftslag/kategori fjerner derfor aldri valget
(verifisert). En lagret id som ikke lenger finnes i `vehicles` (slettet bil) ignoreres i
beregningen (den kan ikke kontrolleres, og ville gjort 100 % umulig), vises som «N tidligere
valgte kjøretøy finnes ikke lenger» i skjemaet og fjernes ved neste lagring. `deleteVehicle()`
skriver bevisst ikke om grunnlaget.

**Funksjoner (alle i `index.html`, samlet der `operativeKjerneBiler()` sto):**
`validerOperativGrunnlag()` (streng validering: version 1, ≥ 1 id, ≥ 1 ukedag 1–7, ellers `null`),
`lastOperativGrunnlag()`, `operativGrunnlagTilstand()`, `operativErDriftsdag()`,
`operativKontrollStatusIdag()`, `kontrollrateSyvDriftsdager()`, `lagreOperativGrunnlag()`,
`operativGrunnlagBodyHtml()`/`attachOperativGrunnlagListeners()`. Tilstand:
`operativGrunnlag` (validert konfigurasjon eller `null`) + `operativGrunnlagStatus`
(`'ok'`/`'mangler'`/`'korrupt'`/`'lesefeil'`/`'ikke-lastet'`).

**Beregning.**
- Den lagrede listen er eneste grunnlag for teller OG nevner. INGEN filtrering på reserve, ute av
  drift, verkstedstatus, aktiv sjåfør eller gruppe — en valgt bil på verksted teller som «mangler».
- Hver bil teller maks én gang per dag (teller `vehicleId|dato`-nøkler, ikke kontrollrader).
  Kontroll på en ikke-valgt bil lagres normalt, men påvirker verken teller eller nevner.
- **«I dag» = `todayISO()`** (operativt døgn, dagskille 04:00) og ukedagen avledes av DEN datoen
  (`operativIsoUkedag()`), så natt til lørdag før 04:00 er fortsatt fredag. Ingen ny «i dag»-
  definisjon er innført (jf. Prioritet 66).
- Fridag (ukedag ikke valgt): «Ingen planlagt kontroll i dag» — **aldri 0 %**.
- **Siste 7 driftsdager** _(avløst av Prioritet 62: antallet er nå antall valgte driftsdager, `activeWeekdays.length`, i både tekst og beregning)_ = de syv siste datoene, regnet bakover fra og MED i dag (når i dag er
  en driftsdag — samme oppførsel som forrige «7 dager»), hvis ukedag er valgt; helger hoppes over
  når kun man–fre er valgt. Formel: unike kontrollerte kjøretøy-dager / (valgte biler × 7).
  Bevisst forenkling: dagens valgte bilsett brukes for alle sju dagene (ingen historikk over
  hvilke biler som var valgt), egnet som trendtall, ikke som revisjonsgrunnlag. Prosent avrundes,
  men er aldri 100 % uten at alt er kontrollert (`operativProsent()`) og aldri over 100.
- Dette er fortsatt en ANNEN populasjon enn `kontrollstatusKpiHtml()`-tidens
  `aktiveVehicles − reserveUnntatt`, som gjelder uendret for Biloversikt-filteret «Ikke
  kontrollert» — to tall, to spørsmål; ikke sett dem side om side som om de var samme ting.

**Ingen prosent uten gyldig grunnlag (viktigste regel).** `operativGrunnlagTilstand()` er eneste
port; alle beregninger og bannere går gjennom den. Tilstandene holdes bevisst adskilt:
`mangler` (raden finnes ikke) → «Operativ kontroll må konfigureres» [Konfigurer]; `korrupt`
(finnes, men ugyldig JSON/format) og `ingen-kjoretoy` (ingen av de valgte finnes lenger) →
«må konfigureres på nytt»; `lesefeil` (Airtable svarte ikke) → «Kunne ikke lese …» [Prøv igjen].
**En lesefeil er ikke et tomt/ugyldig grunnlag:** en tidligere gyldig konfigurasjon beholdes
urørt ved lesefeil (samme prinsipp som `vehiclesLoadStatus`, Prioritet 66.9), og lagring er
sperret mens status er `lesefeil` slik at et uleselig grunnlag ikke kan overskrives blindt.

**Banner** (`dashOperativBannerHtml()`, delt av desktop og mobil): driftsdag →
`23 % i dag • 96 % siste 7 driftsdager • N aktive` + `3/13 kontrollert` / «Se hvilke →»
(åpner Kontrollert/Mangler kontroll med klikkbare biler; `dashKontrollListeApen`, ren
visningstilstand, byttes uten `render()` og nullstilles av `goTo()` bort fra Dashboard).
Fridag → `Ingen planlagt kontroll i dag • 96 % siste 7 driftsdager` + `N aktive` / «Se hvilke →»
(til aktive biler). På driftsdag er «N aktive» selv en snarvei til Biloversikt → Har aktiv sjåfør,
slik at klikkfunksjonen fra Prioritet 50 ikke gikk tapt. Datolinjen (dato/klokkeslett/vær) er beholdt.

**Innstillinger** (`settingsAccordionRow('operativgrunnlag', …)` nestet i Systeminnstillinger):
alle kjøretøy gruppert på `v.driftslag` (`DRIFTSLAG_ORDER`, ukjente alfabetisk, «Uten
driftslag» sist) — også ute av drift/reserve (merket, ikke skjult); søk, Velg alle/Fjern alle
(gruppe og globalt, virker kun på synlige rader), alltid synlig «N kjøretøy valgt», syv
driftsdager (standard man–fre), Nullstill (forkaster ulagrede valg → lagret grunnlag) og Lagre.
Skjemaet arbeider mot en KOPI (`operativGrunnlagDraft`); all interaksjon skjer i DOM + kopi
uten `render()` (fokus/scroll mistes ellers midt i utvelgelsen), og malen bygges alltid fra
kopien slik at en bakgrunnsrender aldri mister valg. Kopien forkastes når seksjonen lukkes eller
man forlater Innstillinger (`goTo()`).

**Lagring:** valider → lås Lagre («Lagrer …») → `storage.set` → først ETTER bekreftet skriving
byttes `operativGrunnlag` og `render()` beregner Dashboard på nytt → «Operativt kontrollgrunnlag
er lagret.» Ved feil: forrige gyldige grunnlag urørt, «Kunne ikke lagre. Forrige innstilling er
fortsatt aktiv.», og valgene står som ULAGRET i skjemaet (vises ikke som lagret).

**Synk mellom enheter.** `subscribeLiveSync()` poller bare `LIST_TABLES`-nøkler, så grunnlaget
leses eksplisitt i `_lagBatchetLiveSyncHandler()` hver runde (én ekstra Settings-lesing per
45 s per klient) og av `loadAll()` ved oppstart. En lesing som startet før en pågående lagring
kan ikke sette gammel verdi tilbake (`operativGrunnlagLagrer`-vakt). Åpent skjema overskrives
aldri stille: urørt skjema bytter umerket til det nye grunnlaget; skjema med ulagrede valg
beholdes med varsel og «Last inn siste», og Lagre krever `confirm()` før det overskriver en
annen brukers endring. **«Skittent» måles mot baseline (`baseNoekkel`) utkastet ble bygget fra,
ALDRI mot det som ligger lagret nå** — dette var en reell feil funnet i test (et urørt skjema ble
regnet som ulagret arbeid da noen andre lagret).

**Filer endret:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (`CACHE_VERSION`
bilpark-v101 → v102), `version-check.js` (`APP_VERSION` 101 → 102), `version.json` (101 → 102),
CLAUDE.md, ROADMAP.md, CHANGELOG.md. **Ikke `storage.airtable.js`/`AIRTABLE_MIGRATION.md`** —
ingen Airtable-endring (Settings-raden opprettes av storage-laget ved første lagring).

**Ikke rørt (som bestilt):** Sjåførkontroll (`submitKontroll()`), kilometerlogikk, Aktiv sjåfør,
dagskille kl. 04:00 (`todayISO()`/`isoDateForOperationalDay()` kun LEST), saksmotoren, Biloversikt,
reserve-/ute-av-drift-logikk utenfor denne beregningen.

**Driftsforutsetning:** ved første bruk finnes ingen konfigurasjon — banneret viser «Operativ
kontroll må konfigureres» til administrator har valgt kjøretøy og driftsdager. Det er bevisst
(ingen automatisk seeding av «13 biler»; appen kan ikke vite hvilke 13).

**Testet** i nettleser (Browser-pane) mot en kopi av appen med in-memory storage-mock (ingen
kontakt med produksjons-Airtable; `node`/`python` finnes ikke i miljøet): 3/13 = 23 %, 13/13 =
100 %, samme bil flere ganger, ikke-valgt bil, man–fre, lørdag/søndag som fridag, lørdag aktivert,
dagskille 03:59/04:00 Oslo, omdøpt/flyttet/slettet bil, ute av drift/reserve valgt, lagringsfeil,
sju varianter av korrupt konfigurasjon, lesefeil med/uten tidligere grunnlag, synk (urørt/skittent
skjema, gjentatt poll, bekreftelse), validering (ingen kjøretøy/ingen driftsdag), banner og skjema
på 1280 px og 375 px uten horisontal overflow. **Ikke testet:** mot ekte Airtable (bl.a. at
Settings-raden faktisk opprettes ved første lagring — koden bruker det etablerte
`writeSettingsRow`-mønsteret), på ekte mobil/touch, eller visuelt i detalj (skjermbilder i
panelet var ustabile; layout er målt via DOM). Anbefalt før idriftsettelse: logg inn, åpne
Innstillinger → Operativ kontrollgrunnlag, velg de 13 bilene, lagre, last siden på nytt og
bekreft at valget overlever, og at en annen enhet ser det etter ≤ 45 s.

---

## Prioritet 54 (2026-09-19) — Neste verkstedtime som operativ informasjon

(Brukerens egen nummerering.) **Varig regel: en registrert verkstedtime skal være synlig der
brukerne jobber — ikke bare i Kalender.** Fire flater viser samme time, fra samme kilde, uten
egen filtrering, sortering eller kopiering:

| Flate | Hva / hvor | Åpne-knapp |
|---|---|---|
| Dashboard (desktop + mobil) | Liten seksjon direkte under Hurtigoversikt, HELE bilparken (`dashNesteVerkstedSekHtml()`) | «Åpne» |
| Verkstedoversikt | Øverst, uavhengig av filtrene; samme time fremheves i listen (`nextId`, blå ramme) | «Åpne avtale» |
| Kjøretøyprofil / Bilinformasjon | Under statusflisene, for DENNE bilen. Når «✏️ Bilinformasjon» er åpen står kortet i stedet øverst i panelets verkstedseksjon — aldri begge | «Åpne avtale» |
| Min Bil (sjåfør) | Kun når AKTIV bil har kommende time; «Årsak:» fra timens beskrivelse; utenfor Layout Editor (kan ikke skjules); ingen tomtilstand | ingen (sjåføren har ikke Verksted) |

**Datakilde og definisjon (ÉN, `index.html` ved `vtVehicle()`):** `nesteVerkstedtime(vehicleId?)` →
`kommendeVerkstedtimer()` → `vtErKommende()`. **Kommende** = ikke `utfort`, har `dato`, og dato/tid
ligger frem i tid. Sortert på `dato + tidspunkt`, tidligste vinner.
- **Ingen «kansellert»-status finnes i datamodellen** (ingen felt på `WorkshopAppointments`): en
  avlyst time slettes (`deleteVT()`), en gjennomført er `utfort`. Begge faller ut av «kommende» uten egen
  regel. Ikke innfør en kanselleringsstatus uten å oppdatere `vtErKommende()` samtidig.
- **«I fremtiden» regnes mot FAKTISK Oslo-kalenderdato og -klokkeslett** (`vtOsloNaa()`), IKKE det
  operative døgnet (dagskille 04:00). Spørsmålet er «har timen passert ennå?». Konsekvens (bevisst
  tolkning av «dato/tid i fremtiden»): en time i dag kl. 07:30 forsvinner fra «Neste verkstedtime» kl.
  07:31, selv om den ikke er markert utført. Timen ligger fortsatt i Verkstedoversikten (listen filtrerer
  kun på `utfort`) til noen trykker «Utført arbeid». En time UTEN klokkeslett regnes som «hele dagen» og
  forblir kommende ut kalenderdagen. (Resten av appen — Verksted-filteret «Kommende» — bruker
  fortsatt `dato >= todayISO()`; de to er ikke identiske for timer som allerede har passert i dag.)
- Kortet viser avtalens `dato`/`tidspunkt`/`verksted` — aldri datoen saken/bestillingen ble opprettet.
  Datoformat er appens låste `fmt()` (DD/MM/ÅÅÅÅ), ikke punktum som i bestillingens eksempel.
- **Fjernet:** `upcomingVT`/`nearestVT`/`nearestWithin7` i `dashboardBeregning()` — en andre,
  avvikende definisjon (kun dato, inkluderte utførte timer) uten noen leser. Ikke gjeninnfør en
  parallell «nærmeste time»-beregning; bruk `nesteVerkstedtime()`.

**Delt kort:** `nesteVerkstedtimeHtml(t, {visBil, visArsak, knapp, utenTittel, skjulTom})`. Tom
tilstand: «Ingen planlagte verkstedtimer» (`skjulTom` for Min Bil). «Åpne»/«Åpne avtale» =
`apneVerkstedAvtale(id)` (nullstiller filtre, åpner riktig bil og avtalens redigeringsboks, ruller til
den); lytter festes av `attachNesteVerkstedtimeListeners()` fra Dashboard/Verksted/Bilkort.
Dashboard-widgeten er BEVISST del av samme Layout Editor-komponent som Hurtigoversikt (ikke en egen
nøkkel), slik at «under Hurtigoversikt» holder uansett lagret layout — den kan bare skjules ved å
skjule Hurtigoversikt. Dashboard viser fortsatt KUN banner, Bestill tjenester og Hurtigoversikt
(med widgeten som følgesvenn); Kalender er uendret.

**Endring i delt oppførsel — sjåførmodus og bakgrunnssynk:** `formInProgress()` var alltid `true` i
sjåførmodus (`screen` står på `'kontroll'`), så `_lagBatchetLiveSyncHandler()` lastet ferske data
men tegnet aldri på nytt. Uten en fiks ville en endret verkstedtime ikke dukket opp på Min Bil før
sjåføren trykket seg videre. Nå tegnes Min Bil på nytt av synken når `driverScreen==='min-bil'` OG
`minBilAksjon` er tom (ingen åpent handlingspanel). Alle andre sjåførskjermer (Velg bil, Kontroll,
Kommentarer, Ringeliste, Mer) og Min Bil med åpent panel er uendret beskyttet (verifisert).

**Filer endret:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (bilpark-v102 → v103),
`version-check.js` (102 → 103), `version.json` (102 → 103), CLAUDE.md, ROADMAP.md, CHANGELOG.md.
`storage.airtable.js`/Airtable uendret (ingen nye felt).

**Ikke rørt:** saksmotoren (`sakFase()`/`sakTilVtType()`/«Planlagt verksted» som saksfase-navn i
Aktive saker/Hurtigoversikt), `submitAddVT()`/`saveVTEdit()`/`deleteVT()`/`fullforVerkstedbestilling()`,
Kalender, Verkstedhistorikk, sjåførkontroll/km/aktiv sjåfør.

**Testet** i nettleser mot kopi av appen med in-memory storage-mock (`node`/`python` finnes ikke; ingen
kontakt med ekte Airtable): fortid/utført/i dag passert/i dag frem i tid/i dag uten klokkeslett,
sortering, samme dato/tid/verksted på alle fire flater, endring via `saveVTEdit()`/sletting/utført
slår gjennom, «Åpne avtale», tom-tilstand, mobil admin (375 px uten overflow), sjåførmodus (kun aktiv
bils time, ingen knapp/notater/bil-linje, ingen kort uten time), synk fra «annen enhet», beskyttelse av
åpent panel. **Ikke testet:** mot ekte Airtable, ekte mobil/touch, eller visuelt i detalj (layout målt
via DOM). Anbefalt før idriftsettelse: bestill en time, og bekreft at den dukker opp på Dashboard, i
Verkstedoversikten, på bilprofilen og på Min Bil (sjåfør-URL) for den bilen.

---

## Prioritet 56 (2026-09-19) — Moderniser hele sjåførmodus

(Brukerens egen nummerering. Ticketen ble sendt to ganger: den første ble avbrutt og var avkuttet etter
akseptansekriterium 1; den andre, fullstendige versjonen er fulgt. Forskjell mellom dem: den første plasserte
«Ny sjåfør» over bilkortet — den andre nevner den ikke, og den ligger nå blant «øvrige handlinger».)

**Varig regel: Ringeliste er referansedesignet for hele sjåførmodus.** Ny sjåførskjerm/-komponent skal bruke
`sj-*`-klassene, ikke en ny stil. Reglene DELES med `ringeliste-*` via grupperte selektorer (ett sted for
verdiene): `.sj-header` (ikonflate 44 px + h2 + hint; `--tint`/`--tone` styrer fargen, standard rød),
`.sj-card` (1,5 px ramme, 4 px aksent `--accent`, `--radius`) med `.sj-card-head`/`-title`/`-body` (`.flush` uten
padding, `.klikk` for utfoldbar), `.sj-row` (34 px ikonflate + `-main`/`-sub`), `.sj-pill-btn`, `.sj-pill`
(`gronn`/`gul`/`rod`/`noytral`), `.sj-section-title`, `.sj-toast`. De eldre handlingskortene (`.p48-action-*`,
`.p48-checkout-*`) er restylet til samme kortspråk uten markupendring. `renderDriverShell()` pakker innholdet i
`.sj-app`; overstyringer av delte komponenter (`.panel`, `.chip`) er scopet dit, så administrasjonen ikke
endres. Ingen nye farger — kun eksisterende tokens.

**⚠️ CSS-felle funnet (og rettet):** en `*/` inne i en CSS-kommentar (`.dmg-*/.acc-*`) lukket kommentaren
for tidlig, og resten av teksten ble tolket som selektor og SLUKTE regelen som fulgte
(`.ringeliste-header`). Ikonet lå derfor over tittelen på Ringeliste. Aldri skriv `*/`, heller ikke inne i
et mønster som `xxx-*/yyy-*`, i en CSS-kommentar. Konsekvens: Ringeliste-headeren ser nå ut som koden var
skrevet for (ikon ved siden av tittelen) — en synlig, tilsiktet endring.

**Min Bil (`renderDriverMinBil()`).** Rekkefølge: header (ikon, «Min Bil», Aktiv sjåfør) → **bilkort** →
«Handlinger» (Registrer skade, Registrer varsellampe, avvik, kontakt, Ny sjåfør — Layout Editor-styrt) → Sjekk
ut bil. Bilkortet er ETT `.sj-card` med rader i denne rekkefølgen: **Kontrollstatus** («Kontrollert i dag» +
«Kontroll utført HH:MM») → **Kilometerstand** → **Neste verkstedtime** (`nesteVerkstedtimeHtml(t, {rad:true})`,
Prioritet 54 — samme `nesteVerkstedtime()`, ingen rad når bilen ikke har noen) → **Løftebord** (status,
«Sist utført dd/mm/åååå · N dager siden», «Smør løftebord») → fot «● Operativ» (+ antall aktive saker).
Løftebord- og verkstedtime-kortene er FLYTTET inn, ikke duplisert; `mb-loftebord-*`-id-ene,
`loftebordVedlikeholdStatus()` og `submitMinBilLoftebordVedlikehold()` er uendret (smør-panelet åpnes inne i
bilkortet). **`bilkort` er FJERNET fra Layout Editor** (`DASHBOARD_LAYOUT_FLATER.minbil`) — bilkortet er fast,
slik at løftebord alltid er synlig for sjåføren; `getLayoutFlate()` forkaster stille en lagret `bilkort`-nøkkel.
På 375×812 ligger bilkort, «Registrer skade» og «Registrer varsellampe» over bunnmenyen.

**Registrer kontroll (`renderKontroll()`, delt med admin).** Kort i rekkefølgen 1 Bil og sjåfør (2 felt i ett
kort) · 3 Kilometerstand · **4 Løftebord** · 5 Varsellamper · 6 Kontrollavvik · 7 Kommentar · 8 Nye skader.
Det ENESTE løftebord-elementet som fantes i kontrollflyten var kontrollavviket `'loftebord'` (gjemt som siste
chip i det lukkede Kontrollavvik-panelet). Steg 4 løfter det ut i eget kort sammen med løftebordets status
(`sj-pill` + «Sist utført …»): samme `kt-avvik-loftebord`-id, samme `kontrollFormAvvik`, samme
`submitKontroll()` — kun plasseringen er endret; «Kontrollavvik» viser de øvrige typene. **Smøring registreres
fortsatt bare på Min Bil** (kortet sier det) — bevisst, siden «ikke ny funksjonalitet» og siden en
vedlikeholdsregistrering i selve kontrollen ville dratt en ny skriving inn i `submitKontroll()` sin
rollback-kjede. Skiltkortet (`.kt-vehicle-card`) er fjernet fra «Bil og sjåfør» (bil/regnr/modell står i
kjøretøyraden; ca. 75 px mindre scrolling). Alle id-er og lyttere (`kt-*`) er uendret.

**Kontroll fullført — ingen mellomskjerm.** Koden gikk allerede rett til Min Bil etter innsending (siden
Prioritet 40); det som er nytt: (1) `submitKontroll()` sin sjåførgren kaller `sjFriskOppMinBilData()` FØR
Min Bil vises — henter `verkstedtimer` og `loftebordHistorikk` på nytt (tak 2,5 s, aldri en feil; kontrollstatus,
km og aktiv sjåfør er allerede oppdatert lokalt), og viser deretter `visSjToast('Kontroll registrert')` — en
kort, ikke-blokkerende bekreftelse på `<body>` (overlever `render()`, forsvinner etter ca. 2,6 s, ingen knapp,
`prefers-reduced-motion` respektert). (2) **«Allerede kontrollert»-mellomskjermen med «Gå til Min Bil»-knapp er
FJERNET** (`driverScreen === 'allerede-kontrollert'` finnes ikke lenger). En bil som allerede er kontrollert i
dag åpnes rett i Min Bil av `driverApneKontrollertBil()` (`startBilokt()` som knappen kalte før, + toast
«Allerede kontrollert i dag»); kalles fra navnedialogen («Hvem kjører denne bilen?», der «Fortsett» står — navn
kreves, så den dialogen er beholdt) og fra `velgKontrollBil()`. Uten kjent sjåførnavn beholdes skjemaet i stedet
for å starte en biløkt uten sjåfør. (3) Suksess-`alert()` på Min Bil (skade/varsellampe/avvik/løftebord-
vedlikehold) er byttet med samme toast; feil og advarsler (f.eks. bilde ikke lagret) beholder `alert()`.

**⚠️ Lagringsfeil — eksisterende feil rettet.** `rullTilbake()` i `submitKontroll()` satte feilmeldingen på
`#kt-msg` og kalte deretter `render()`, som bygger skjemaet på nytt og dermed slettet meldingen (`msgEl`
pekte på det frakoblede elementet). Sjåføren så et skjema uten forklaring. Meldingen settes nå OGSÅ på det nye
elementet etter `render()` (og rulles til syne). Ved lagringsfeil: ingen navigasjon, ingen toast, skjemadata
beholdt (`kontrollForm*`), knappen aktiv, ærlig melding om ren rollback eller mulig delvis lagring (uendret tekst).

**Ikke rørt:** `submitKontroll()` sin lagrings-/rollback-kjede (kun meldingsvisning og sjåførgrenens
avslutning), km-/aktiv sjåfør-/dagskillelogikk, saksmotoren, løftebord-datamodellen (`LiftgateHistory`),
Kommentarer 2.0-logikk, bunnmenyen (`DRIVER_BUNNMENY`), administrasjonens skjermer (kontrollskjemaet har ny
rekkefølge/kortdesign også der — det er delt — men uendret flyt: `alert` + Kjøretøyprofil).

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (v103 → v104), `version-check.js` (103 → 104),
`version.json` (103 → 104), CLAUDE.md/ROADMAP.md/CHANGELOG.md. `storage.airtable.js`/Airtable uendret.

**Testet** i nettleser mot kopi av appen med in-memory storage-mock (`node`/`python` finnes ikke; ingen ekte
Airtable) på 375×812 og ca. 640 px: bilkortets rader og rekkefølge, smøring fra bilkortet (panel, avkrysning,
lagring, oppdatert status, toast), kontrollskjemaets 7 kort i riktig rekkefølge, løftebord-avvik i samme
`kontrollFormAvvik`, lagringsfeil (blir på siden, melding synlig, data beholdt, ingenting lagret), retry → Min
Bil med oppdatert kontrollstatus/km/aktiv sjåfør og en verkstedtime som først fantes i «databasen» (hentet på nytt),
allerede kontrollert bil (rett til Min Bil, ingen knapp), header-mønsteret og ingen horisontal overflow på alle
sjåførskjermer, admin-kontroll uendret flyt, ingen JS-feil. **Ikke testet:** ekte Airtable, ekte mobil/touch,
«offlineflyt» (det finnes ingen offlinekø i koden — en feil håndteres som før), eller Ringeliste-fanen visuelt utover
header-endringen. Anbefalt før idriftsettelse: kjør en kontroll fra sjåfør-URL-en på en ekte telefon og bekreft at
du lander på Min Bil med bekreftelsen, og at «Smør løftebord» fungerer fra bilkortet.

---

## Prioritet 57 (2026-09-19) — Dashboard og Hurtigoversikt

(Brukerens egen nummerering.) **Varig regel: alle Hurtigoversikt-faner er ÉN komponent — samme radmønster.**
Aktive saker, Oppfølging, Verksted og Varsler bruker alle `.p38-case`: ikon-flis (`.flis.sm`, tonet), fet
bil-linje, én tekstlinje og «→ Åpne …»-lenke, hele raden er klikkmålet. Ingen faner har egne knapper eller egen
radtype. Ny fane/rad skal bygges som `.p38-case`, ikke som et eget layout.

**Varsler-fanen** (`dashHovVarselRadHtml()`, tone per kategori i `DASH_VARSEL_TONE`, ikon fra
`VARSLINGSSENTER_KATEGORI_IKON`): bil-linjen er bilens navn (varselets `tekst` starter med det, prefikset
strippes og teksten kortes til 90 tegn). **Klikkmål:** km-varsler og varsellamper → Varslingssenteret på riktig
kategori (`data-goto-varsel-senter` setter `varslingssenterAktivKategori`) — der ligger Godta/Avslå endring og
Merk som løst; saker → `goToVarselSak()`; kommentarer → Kommentaroversikt; øvrige (service/EU) → bilkortet.
**Endring i funksjon:** Godta/Avslå km, Merk som løst og Marker som sett er IKKE lenger tilgjengelige direkte fra
Dashboard (kun i Varslingssenteret, uendret) — bevisst, som bestilt («fjern store handlingsknapper»).
`varslingssenterRadHtml()` og skjermen Varslingssenter er uendret; lytterne for `data-kvitter`/`data-godta-km`/
`data-avsla-km`/`data-marker-varsel-sett` er fjernet fra `attachHovInnholdListeners()` (ingen rad i Dashboard har dem).
Tom fane: «Ingen varsler nå.» (samme `.empty-note` som de andre fanene).

**«Neste verkstedtime» i banneret.** `dashOperativBannerHtml()` er nå en omslagsfunksjon: venstre kolonne =
`dashOperativBannerVenstreHtml()` (kontrollstatus — innhold og logikk fra Prioritet 50/52/53 uendret, kun uten
egen ramme), høyre kolonne = `dashBannerVerkstedHtml()`. Rutenett `.dash-banner-grid`
(`minmax(0,1fr) auto`), stables under kontrollstatusen ≤ 720 px. Samme `nesteVerkstedtime()` (Prioritet 54): ÉN
`<button data-apne-vt>` — hele feltet er klikkbart og åpner avtalen via `apneVerkstedAvtale()` (festet av
`attachNesteVerkstedtimeListeners()`, som kalles fra `attachDashboardListeners()` for både desktop og mobil).
Innhold: tittel, bil, faktisk `dato · klokkeslett` (samme `fmt()` som overalt) og verkstedets navn. **Ingen
kommende time:** kun en dempet tekstlinje «Ingen planlagte verkstedtimer» — aldri en tom boks. Banneret har
fortsatt datolinjen og alle tilstander (mangler/ugyldig/lesefeil, fridag, driftsdag med «Se hvilke»); VT-blokken
vises i ALLE tilstander, uavhengig av kontrollgrunnlaget.
**Fjernet:** `dashNesteVerkstedSekHtml()` (seksjonen nederst) og bruken av den i begge `komponentHtml.hurtigoversikt`.
Dashboard inneholder igjen kun banner, Bestill tjenester og Hurtigoversikt. Dato og klokkeslett står på ÉN linje
her (kompakt); de andre flatene (Prioritet 54) har dem på hver sin linje — samme data.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (v104 → v105), `version-check.js` (104 → 105),
`version.json` (104 → 105), CLAUDE.md/ROADMAP.md/CHANGELOG.md. `storage.airtable.js`/Airtable uendret.

**Testet** i nettleser mot mock-storage (ingen ekte Airtable), 1200 px og 375 px: banner i to kolonner (VT høyre
for kontrollstatus), klikk på indre tekst åpner avtalen, tom-tilstand uten boks, kun to seksjoner under banneret,
lik radstruktur/høyde (56 px)/startposisjon og ingen knapper i alle fire faner, klikkmål for varsellampe/kommentar,
stabling og ingen horisontal overflow på mobil. **Ikke testet:** ekte Airtable, ekte telefon, eller pikselsammenligning
av banneret (skjermbildene i panelet er små; layout målt via DOM).

---

## Prioritet 58 (2026-09-19) — Dashboard Editor 1.0

> ⚠️ **Avløst av Prioritet 60 (2026-09-21):** Dashboard Editor er nå ett av flere områder i Layout Engine 2.0
> (`layouts['admin-dashboard']` i `bilpark-layout-config-v2`); `DASH_WIDGETER`/`dashEdit*` og skrivemålet
> `dashboard-layout-v1` er fjernet. 12-kolonners reglene (ingen overlapp, minstehøyde, tyngdekraft) gjelder uendret via
> `layoutGridPlaser()`. Resten av avsnittet er historikk.

(Brukerens egen nummerering; det finnes en tidligere, urelatert «Prioritet 58 (2026-09-13) — Synlighetsdrevet
Lucide-migrering» lenger opp. Nummeret følger brukerens backlog, ikke denne filens rekkefølge.)

**Varig regel: utseendet på Desktop Dashboard er data, ikke kode.** Administrator bestemmer plassering, størrelse og
synlighet av kortene selv. Layouten styrer KUN dette — kortene bruker fortsatt sine egne eksisterende funksjoner og
data, og ingen forretningslogikk er endret. Skal Dashboard få et nytt kort, legges det til i `DASH_WIDGETER` (ett
sted), ikke bygges inn i `renderDashboard()`.

**Inngang:** Innstillinger → 🎨 Layout Editor → Desktop Dashboard → «Rediger dashboard»
(`#dash-rediger-btn` → `dashStartRedigering()` → åpner Dashboard i redigeringsmodus). Innstillinger viser status
(standard/egendefinert, sist endret av/når, ugyldig/lesefeil) og en skjematisk miniforhåndsvisning. Knappen er
deaktivert i mobilvisning og ved lesefeil.

### Datamodell

ÉN versjonert JSON-blob i den eksisterende Settings-tabellen, nøkkel **`dashboard-layout-v1`**
(`DASH_LAYOUT_KEY`) — samme mønster som `operativ-kontrollgrunnlag`/`standardverksted`. Ingen ny Airtable-tabell, ingen
`LIST_TABLES`-endring, **`storage.airtable.js` uendret** (uendret `versjon`/`?v=2.20.0`):

    {"version":1,
     "widgets":[{"widgetId":"neste-verkstedtime","x":8,"y":0,"width":4,"height":2,"visible":true}, …],
     "updatedAt":"ISO", "updatedBy":"<innlogget rolle>"}

Delt/global for hele bilparken (ikke per bruker), som tema/bilkategorier. `version:1` er selve formatversjonen — en
framtidig v2 skal lese v1 og migrere. Mobil Dashboard og Min Bil bruker fortsatt den eldre `dashboard-layout`
(opp/ned + skjul/vis, `DASHBOARD_LAYOUT_FLATER` — nå uten `desktop`).

### Rutenettet (regler som aldri skal brytes)

- **12 kolonner.** `x` (0–11) og `width` (1–12) er kolonner; `y` og `height` er rader. Ingen piksler lagres. Radhøyden
  (`DASH_RAD_PX` = 40) og mellomrommet (`DASH_GAP_PX` = 12) er rene CSS-enheter og må samsvare med `.dash-grid` i CSS —
  editoren regner pekerposisjon om til kolonne/rad med dem.
- **`height` er en MINSTEHØYDE.** Radene er `minmax(40px, auto)`: et kort med mer innhold vokser i stedet for å bli
  klippet. Derfor kan en for lav høyde aldri skjule innhold.
- **Ingen overlapp — noensinne.** `dashLayoutPlaser(liste, prioId, prioStartY)` er ENESTE sted plassering løses og
  brukes av alt (drag, tastatur, steppere, Vis kort, Tilbakestill, innlesing). Den klemmer kort inn i rutenettet og
  innenfor `min`-grensene (`DASH_WIDGETER[id].min`, maks høyde 24), og plasserer synlige kort ett og ett med
  «tyngdekraft»: hvert får laveste `y` der det ikke kolliderer. `x` og størrelse endres aldri av plasseringen. Tomme
  rader mellom kort kan derfor ikke oppstå (tomme kolonner kan).
- **Rekkefølgen avgjør hvem som viker**, og er bygget som «sett inn»: vanlige kort ordnes etter midtpunktet
  (`y + høyde/2`), kortet du drar etter overkanten, og ved flytting NEDOVER etter underkanten. To kort bytter altså
  plass når underkanten på kortet du drar passerer midten av kortet under; dras kortet oppover havner det over det det
  treffer. **Lærdom:** den første versjonen skjøv alltid det andre kortet under det du drar — men tyngdepakkingen
  reverserte det, så et kort kunne ikke dras ned forbi et annet (det «falt tilbake»). Oppdaget først med en ekte
  museforflytning; ikke gå tilbake til «det flyttede kortet står fast».
- **Innlesing kaster aldri** (`dashLayoutNormaliser()`): ukjent `widgetId`, duplikater og ikke-objekter ignoreres;
  ugyldig geometri (ikke-heltall) på et KJENT kort repareres fra dets standardplassering i stedet for at kortet
  forsvinner; kort som mangler helt (f.eks. et nytt bibliotekskort lagt til i koden etter at layouten ble lagret)
  legges til som **skjult** — de dukker aldri opp uventet, men finnes under «Legg til kort». Strukturelt ugyldig blob
  (ikke objekt, `version` ≠ 1, `widgets` ikke liste) = status `korrupt`.
- **Skjulte kort** beholder geometrien sin men ligger ikke på rutenettet (teller ikke i overlapp). «Legg til kort»
  (`dashEditVis()`) setter kortet nederst i kolonne 1 og lar tyngdekraften løfte det til første ledige plass.
- **Ingen egne farger/skrifter/pikselplassering er mulig** — editoren har bare posisjon, bredde, høyde og synlighet.

### Komponentbiblioteket (`DASH_WIDGETER`)

Hvert kort = `{label, ikon, beskrivelse, std:{x,y,width,height,visible}, min:{width,height}, html(d)}`. `html` er ETT kall
til en eksisterende dashboardfunksjon:

| widgetId | Standard | Innhold / kilde |
|---|---|---|
| `operativ-kontroll` | x0 y0 8×2, synlig | `dashOperativBannerVenstreHtml(d)` — kontrollprosent i dag/7 driftsdager, aktive |
| `neste-verkstedtime` | x8 y0 4×2, synlig | `dashBannerVerkstedHtml()` — `nesteVerkstedtime()` (Prioritet 54/57) |
| `bestill` | x0 y2 12×4, synlig | `dashBestillSekHtml()` |
| `hurtigoversikt` | x0 y6 12×11, synlig | `dashHurtigoversiktHtml(d)` (faner uendret) |
| `aktive-biler` | skjult | `d.hDriftCount` + «Se hvilke →» (Biloversikt → Har aktiv sjåfør) |
| `kalender` | skjult | `kalenderUkeWidgetHtml()` — «Denne uken», samme kilde som Kalenderen |
| `varsler` | skjult | `varslingssenterAktiveListe()` + `dashHovVarselRadHtml()` (4 nyeste) |
| `aktive-saker` | skjult | `sakFase(s)==='aktiv'` + `dashHovSakRadHtml()` (4 nyeste) |
| `loftebord` | skjult | telling per status fra `loftebordVedlikeholdStatus()`/`loftebordKontrollStatus()` (flåten, ikke ute av drift) |

Standardlayouten (de fire synlige) er Dashboard slik det var før Prioritet 58, med ÉN synlig forskjell: banneret er nå
to kort side om side (Operativ kontroll | Neste verkstedtime) i stedet for ett kort med en innfelt knapp.
`kalenderUkeDager()`/`kalenderUkeWidgetHtml()` var fjernet i Prioritet 50 og er gjeninnført fra git (kun uten den inline bunnmargen)
(`310a9b1^`). Ingen av de fem bibliotekskortene innfører ny beregning eller datamodell; løftebordkortet er bevisst
kun et telleoppsett uten klikkmål (det finnes ingen naturlig flate for «alle biler»), og «Aktive biler» dupliserer
med vilje «N aktive»-lenken i Operativ kontroll (skjult som standard).

**Eldre lagret desktop-layout:** finnes ikke `dashboard-layout-v1`, bygges standarden med hensyn til en eventuell
tidligere `dashboard-layout`.desktop (skjult/rekkefølge for Bestill/Hurtigoversikt), slik at en administrator som
allerede hadde tilpasset Dashboard ikke får det «tilbakestilt» av oppgraderingen (`dashLayoutStandard(true)`).
«Tilbakestill» i editoren bruker ren standard (`dashLayoutStandard(false)`).

### Normalmodus

`renderDashboard()` (desktop) = DB-varselbanner + `dashRutenettHtml(dashLayoutAktiv(), d, false)`.
`dashLayoutAktiv()` = gyldig lagret layout, ellers standard — en lesefeil/manglende/korrupt layout gir aldri krasj eller
tomt Dashboard. Hvert kort er `<div class="dash-w" data-dash-widget style="--gx/--gy/--gw/--gh">`; DOM-rekkefølgen er
`(y, x)`. Et kort som kaster under rendring erstattes av «Kortet kunne ikke vises» uten å ta med resten av Dashboard
(`dashWidgetHtml()`). Smal innholdsflate (`@container (max-width:640px)` på `.dash-grid-wrap`, altså brukbar bredde og ikke
vindusbredde) stabler kortene i full bredde i leserekkefølge. Alle eksisterende lyttere (`attachDashboardListeners()`)
virker uendret siden kortene er vanlig DOM. Mobil (`renderMobilHjem()`) er uendret og bruker fortsatt det samlede banneret.

### Redigeringsmodus

- **Kun administrator, kun desktop.** `dashKanRedigere()` = `!driverMode && loggedInRole && isAdmin` (samme
  innloggingsgrunnlag som resten av administrasjonsdelen — Innstillinger er allerede bak innlogging). Mobilvisning
  (`currentUiExperience()==='mobil'`) nekter å starte og avslutter en pågående redigering stille. Utlogging avslutter den.
- **Utkast, ikke lagring.** `dashEditUtkast` er en kopi; normalmodus leser aldri utkastet, og INGENTING skrives til
  Airtable før «Lagre layout». Tilstand (`dashEditModus` m.fl.) er ren visningstilstand og overlever ikke omlasting.
- **Skjematisk redigering (fast radhøyde) og ekte forhåndsvisning.** Redigering viser skjematiske kort (navn,
  størrelse, beskrivelse, kontroller) på fast 40 px rad, slik at pekerposisjon kan regnes om til kolonne/rad uten at
  innholdshøyder forstyrrer; kolonnene vises som svake striper. «Forhåndsvis» viser de EKTE kortene med utkastet, i et
  `inert` rutenett (ingenting kan aktiveres, så man ikke navigerer bort fra utkastet).
- **Handlinger:** dra i tittelen (flytt) eller hjørnet (størrelse) med musepeker/berøring — kortene «snapper», og
  alle kort tegnes om live (`dashLayoutPlaser()` → CSS-variabler, uten `render()`), lagres i utkastet først ved slipp;
  Bredde/Høyde −/+; Skjul; «Legg til kort»-chips for skjulte kort; piltaster på et fokusert kort flytter (Pil opp/ned
  gjentar til kortet kommer forbi det neste), Skift+piltaster endrer størrelse; **Angre** (opptil 50 steg);
  **Tilbakestill** (bekreftelse → ren standard i UTKASTET, kan angres, lagres ikke før Lagre); **Avbryt** (bekreftelse
  ved endringer); **Lagre layout** (kun aktiv ved endringer).
- **Lagring** (`dashEditLagre()`): validerer (minst ett synlig kort), avviser ved status `lesefeil`, ber om bekreftelse
  hvis en annen administrator har lagret siden redigeringen startet, låser knappen, skriver, og byttes først ETTER
  bekreftet skriving til ny aktiv layout (+ toast «Dashboard-layout lagret»). **Ved feil beholdes forrige layout og
  utkastet urørt**, med melding. `dashLayoutLagrer` hindrer dobbeltlagring og at en eldre lesing overskriver en lagring.
- **Navigasjonsvern:** `goTo()` til en annen skjerm med ulagrede endringer krever bekreftelse (Avbryt = blir stående);
  uendret utkast forlates uten spørsmål. `formInProgress()` er sann i redigeringsmodus, så bakgrunnssynken aldri tegner
  over et utkast eller et pågående drag.

### Synk mellom administratorenheter

`subscribeLiveSync()` poller kun `LIST_TABLES`-nøkler, så `lastDashLayout()` kalles eksplisitt i `loadAll()` (oppstart)
og i `_lagBatchetLiveSyncHandler()` (hver runde, som operativt kontrollgrunnlag — én ekstra Settings-lesing per 45 s
per klient; i motsetning til `varselSett`/`standardverksted` synkroniseres altså denne). Samme tre tilstander som
kontrollgrunnlaget: `mangler`, `korrupt` (standard brukes, ingenting gjettes) og `lesefeil` (en tidligere gyldig layout
beholdes urørt — en lesefeil er ikke en tom layout). En endring gjort av en annen mens du redigerer overskriver aldri
utkastet: varsel i verktøylinjen (`#dash-edit-ekstern`) og bekreftelse ved lagring.

### Filer, tester og begrensninger

**Endret:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (`CACHE_VERSION` v105 → v106), `version-check.js`
(`APP_VERSION` 105 → 106), `version.json` (105 → 106), CLAUDE.md/ROADMAP.md/CHANGELOG.md. **Ikke endret:**
`storage.airtable.js`, Airtable, `AIRTABLE_MIGRATION.md` (Settings-raden opprettes av storage-laget ved første lagring),
mobil/Min Bil-editorene, all forretningslogikk (`dashboardBeregning()`, saksmotor, kontrollgrunnlag, km, aktiv sjåfør).

**Testet** i nettleser (Browser-pane) mot en scratch-kopi med in-memory mock-storage — ingen kontakt med ekte Airtable
(`node`/`python` finnes ikke): standardlayout ≙ før; alle ni kort rendres uten klipping; drag/resize/skjul/vis/tastatur/
Angre/Tilbakestill/forhåndsvisning uten noen gang overlapp (også med ekte museforflytning); min-størrelser; mislykket
lagring (forrige layout + utkast beholdt), vellykket lagring (blob i riktig format), omlasting, korrupt JSON/feil versjon/
ikke-liste/tall, ukjente og duplikate widgeter, søppelgeometri, overlappende lagret data, lesefeil med og uten tidligere
layout, manglende bibliotekskort, eldre desktop-layout, synk via den faktiske bakgrunnshandleren (normalmodus og under
redigering), navigasjons-/Avbryt-/utloggingsvern, mobil (editor nektes, mobilforside og mobil/Min Bil-editorene uendret),
stabling og ingen horisontal overflow ved 800 px, redigering ved 800 px, brace-/backtick-balanse.
**Ikke testet:** mot ekte Airtable (bl.a. at Settings-raden faktisk opprettes ved første lagring — samme mønster som
`operativ-kontrollgrunnlag`), på ekte berøringsskjerm/nettbrett (`touch-action:none` er satt på håndtakene, men drag er
kun testet med mus), i lys modus, og Lucide-ikonene kommer som før fra CDN.

**Kjente begrensninger:** (a) redigering av flere administratorer samtidig følger «siste lagring vinner» (med varsel/
bekreftelse), ikke sammenslåing; (b) utkastet mistes ved omlasting av siden (ingen `beforeunload`-vern); (c) ingen Esc for
å avbryte et drag (avbrutt pekerhendelse forkastes) og ingen Gjenta; (d) tyngdepakkingen fjerner tomme rader — et kort
kan ikke stå igjen med bevisst luft over seg; (e) kort med mye innhold (Hurtigoversikt) vokser utover sin lagrede høyde
i normalmodus, så redigeringens høyde er et minimum, ikke en fasit; (f) Tilbakestill i editoren er utkast-basert — det
finnes ingen egen «lagre standard direkte»-knapp i Innstillinger; (g) `dashboardBeregning()` beregnes også for skjulte kort
(kun i normalmodus/forhåndsvisning) — samme overflødige beregning som før, bevisst ikke ryddet.


---

## Prioritet 59 (2026-09-20) — Forenkle Bilinformasjon og dekkskift for flere biler

(Brukerens egen nummerering; det finnes en tidligere, urelatert «Prioritet 59 (2026-09-13) — Prioritet er ikke lenger en
sannhet». Nummeret følger brukerens backlog, ikke denne filens rekkefølge.)

**Varig regel: Kjøretøyprofilen viser hver opplysning ÉN gang.** «Rediger informasjon» finnes kun i «Kjøretøydetaljer».
Mobilitetsgaranti finnes kun i statusraden. Service og EU vises kun i statusraden (ikke lenger også i en Oversikt-fane).
Ikke gjeninnfør en Oversikt-, Dekk- eller Kostnader-fane på profilen; nye referansefelt legges i Kjøretøydetaljer, ny
historikk som en fane i Historikk-seksjonen.

### Kjøretøyprofil (`renderBilkort()`)

- **Øverst til høyre:** «Neste verkstedtime» for DENNE bilen — `dashBannerVerkstedHtml(v.id)` (`.profil-ident-hoyre`), samme
  kort og samme `nesteVerkstedtime(vehicleId)` som Dashboard (Prioritet 54/57). Hele feltet er klikkbart og åpner avtalen
  (`apneVerkstedAvtale()`); uten kommende time står bare «Ingen planlagte verkstedtimer». Bil-linjen utelates når
  `vehicleId` er gitt.
- **Statusrad** (`.profil-stat5`, fast rekkefølge): Kilometerstand · Siste service · EU-kontroll · Mobilitetsgaranti ·
  Løftebord. **Aktiv sjåfør er fjernet fra raden** (står som pille i identitetslinjen, nå med «· siden HH:MM»).
  «Siste service»: «Sist service [dato / Ingen registrert]», `.stat-skille`, «Kilometer igjen til service [verdi]»
  (`vehicleServiceStatus()`, uendret beregning). «Løftebord»: kontrollstatus (`loftebordKontrollStatus()` — gyldig /
  utløper snart / utløpt / mangler), sist smurt og OK / Bør gjøres / Må gjøres (`loftebordVedlikeholdStatus()`).
  Kilder og tersklene fra Prioritet 49 Del 2 er uendret.
- **Km-avvik** (Prioritet 66/71.10) vises fortsatt, nå som eget varsel under identitetsraden (var en rad i Oversikt-fanen).
- **Fjernet:** Oversikt-/Historikk-/Dekk-/Kostnader-fanene, `PROFIL_FANER`, «Neste oppfølging»/«Ruteskift»/dekkstatus-radene
  som bare fantes i Oversikt. Ingen data slettet: dekkhistorikk vises under Verkstedhistorikk, kostnader ligger på
  Kostnader-siden (`getKostnadsposter()`/`renderKostnadsoversikt()` urørt).

### Historikk-seksjonen (`bilkortHistorikkSekHtml()`)

Nederst på profilen, `<section class="dash-sek bilkort-hist" id="bilkort-hist-sek">`, tittel «Historikk», fem faner i
`.profil-tabs`/`.profil-tab` (samme stil og høyde som Hurtigoversikt): `BILKORT_HIST_FANER` = Kontroller · Skader ·
Varsellamper · Verkstedhistorikk · Kommentarer. Valgt fane (`bilkortAktivFane`, standard `'kontroller'`, nullstilles av
`goTo()`) er eneste som rendres. Data hentes lazy av `bilkortHistorikkRader(v)` (nyeste først; verkstedhistorikk fra
`samletVerkstedHistorikkAlle()` filtrert på bilen). Antall vises i fanen kun når det finnes data; tom fane = kompakt
tomtilstand. En rad (`.p38-case.bilkort-hist-rad`, `data-hist-rad`) åpner det EKSISTERENDE detaljkortet
(`kontrollHistoryCard`/`damageCard`/`varsellysCard`/`nyeKommentarRadHtml`) — `bilkortHistRadApen` husker åpne rader.

**Fanebytte skjer uten `render()`** (`byttBilkortHistorikkFane()` → `oppdaterBilkortHistorikkInnhold()`), samme mønster som
`byttHurtigoversiktFane()`: bytt aktiv fane-klasse, bytt innholdet i `.bilkort-hist-innhold`, fest lyttere på nytt kun der
(`attachBilkortHistorikkListeners(root)`), «ratchet» min-height. Uten dette flytter siden seg og scrollposisjonen klemmes.
Nye lyttere for historikkinnhold hører hjemme i `attachBilkortHistorikkListeners()`.

### Dekkskift for flere biler

**Varig regel: én verkstedbestilling per bil — aldri én rad med flere `vehicleId`.** Kalender, neste time, «utført» og
historikk leser alle `verkstedtime.vehicleId`.

- **Skjema** («Ny verkstedtime», type Dekkskift): «Velg flere biler» (standard av = én bil, uendret flyt). Slått på vises
  bilvelger (`.vt-flerbil-liste`) med «Velg alle» og «N biler valgt». Felles: Retning (`DEKK_RETNING_VALG`: Til sommerdekk /
  Til vinterdekk; standard foreslått av `dekkRetningForslag()` fra bilens `v.dekk`), Verksted, Dato, Klokkeslett,
  Kommentar. Primærknapp «Bestill dekkskift for N biler» → bekreftelsesdialog (`visBekreftDialog()`): «Du oppretter dekkskift
  for N biler hos [verksted] på valgt dato.» [Avbryt] [Bekreft bestilling]. Skjemaet er DOM-drevet (ingen `render()` mens
  man fyller ut), som resten av verkstedskjemaet.
- **Datamodell:** to nye felt på `WorkshopAppointments`, registrert i `LIST_TABLES.verkstedtimer` i
  `storage.airtable.js` (v2.20.0 → v2.21.0): `dekkRetning` (`DekkRetning`, samme verdier som `dekkhistorikk.retning`:
  `'sommer-vinter'` = til vinterdekk, `'vinter-sommer'` = til sommerdekk) og `bestillingGruppeId` (`BestillingGruppeId`,
  kun for visning/«Alle N utført»). **Kolonnene MÅ opprettes i Airtable før idriftsettelse** — alle `LIST_TABLES`-felt
  skrives ved hver skriving, så uten dem feiler ALLE lagringer av verkstedtimer. Se AIRTABLE_MIGRATION.md.
- **Opprettelse** (`opprettDekkskiftFlereBiler()` → `lagreDekkskiftPoster()`): N poster med unike id-er, riktig `vehicleId`,
  `type='dekkskift'`, felles verksted/dato/tid/retning/kommentar/`bestillingGruppeId`, alle i ÉN `storage.set`
  (`reconcileList` PATCHer alle eksisterende rader ved hver skriving — N enkeltskrivinger ville vært N hele tabellskrivinger).
  Multi-bil hopper over sak-auto-koblingen fra `submitAddVT()` (ingen gjetting på tvers av biler).
- **Delvis feil, ingen duplikater.** `reconcileList` oppdaterer sin recordId-cache først etter vellykkede POST-svar, så en
  tapt respons kan la en post ligge i Airtable uten at appen vet det. Ved feil leses derfor **fasiten** på nytt
  (`hentVerkstedtimerFasit()` — `window.storage.get('verkstedtimer')`) og hver bil får status `lagret` / `feilet` / `ukjent`
  (`vtFlerBilResultat`). Panelet (`vtFlerBilResultatHtml()`) lister hvem som er hva. «Prøv de feilede på nytt»
  (`proverDekkskiftPaNytt()`) leser ALLTID fasiten først, gjenbruker SAMME id-er og sender bare de som mangler. **Kan fasiten
  ikke leses, sendes ingenting på nytt** (ukjent ≠ feilet) — brukeren får en melding og kan prøve igjen. Ikke bytt til «bare
  send alt på nytt»: det gir duplikater når en respons gikk tapt.
- **Fullføring** (`fullforVerkstedbestillinger(ids)`, `fullforVerkstedbestilling(id)` delegerer): per bil settes `utfort`/
  `utfortDato`, for dekkskift med `dekkRetning` oppdateres `v.dekk` (`'sommer-vinter'` → `'vinter'`, `'vinter-sommer'` →
  `'sommer'`) og en `dekkhistorikk`-rad med **deterministisk id `'dekk-'+vt.id`** opprettes (idempotent: en dobbeltfullføring
  gir ikke to). Service-type oppretter servicehistorikk som før (Prioritet 71.5). Alt lagres i én omgang med snapshot/rollback
  av `servicehistorikk`/`dekkhistorikk`/`vehicles`/`verkstedtimer` ved lagringsfeil. «✅ Alle N utført» (`data-fullfor-vt-gruppe`)
  fullfører hele gruppen i ett kall — men hver bil får sin egen dekkstatus og historikk. Dekkhistorikk og `v.dekk` lagres
  FØR verkstedtimene: feiler siste steg, står idempotent dekkhistorikk igjen, og en ny fullføring dupliserer ikke.
- **Verkstedhistorikk:** `samletVerkstedHistorikkAlle()` hopper over `dekk-…`-dekkhistorikk når den fullførte
  verkstedtimen finnes (ellers to rader for samme dekkskift); `deleteVerkstedHistorikkPost()` (nå async) fjerner også
  `'dekk-'+id`-raden. `vtCard()` viser retning og «👥 Samlet bestilling · N biler».
- **`logout()`** nullstiller `vtFlerBilResultat`.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `storage.airtable.js` (v2.21.0), `sw.js` (v106 → v107),
`version-check.js` (106 → 107), `version.json` (106 → 107), CLAUDE.md/ROADMAP.md/CHANGELOG.md/AIRTABLE_MIGRATION.md.

**Ikke rørt:** saksmotoren, sjåførkontroll/km/aktiv sjåfør, Kostnader (`getKostnadsposter()`), Kalender, Dashboard Editor,
Bestill tjenester sitt kortoppsett (Prioritet 62), kontrollgrunnlaget, Airtable-tabellene utover de to nye kolonnene.

**Testet** i nettleser mot en scratch-kopi med in-memory mock-storage (ingen ekte Airtable; `node`/`python` finnes ikke):
ingen gamle faner, statusradens innhold og rekkefølge, fanebytte uten `render()`/geometri-/scrollendring, rader åpner
eksisterende kort; enkeltbil-dekkskift uendret; flervalg (antall, «Velg alle», knappetekst); bekreftelsesdialogens tekst og
Avbryt; 13 separate bestillinger med delte verdier i én skriving; kalender og neste time per bil; samlet «utført» for 13 biler
(13 × `v.dekk`, 13 × dekkhistorikk, ingen dobbeltføring i Verkstedhistorikk); delvis feil 10/13 + retry uten duplikater;
tapt respons; uleselig fasit (retry blokkert → deretter vellykket, 8 unike id-er); enkeltfullføring, dobbel fullføring,
eldre dekkskift uten retning (kun VT utført), rollback ved lagringsfeil. Brace-/backtick-balanse OK (5961/5961).
**Ikke testet:** mot ekte Airtable (bl.a. at de to nye kolonnene aksepteres), på ekte mobil/touch.

**Kjente begrensninger:**
- Dekkskift bestilt fra en SAK (`bestillVerkstedForSak()`) og eldre dekkskift har ingen `dekkRetning`; ved fullføring
  oppdateres derfor verken `v.dekk` eller dekkhistorikk (kun verkstedtimen markeres utført) — samme oppførsel som før.
- Flerbilsbestilling hopper over sak-auto-koblingen (Prioritet 52 Del 2b).
- Riktig delvis-feil-håndtering avhenger av at fasiten kan leses; ellers stopper retry bevisst (se over).
- Ruteskift-/oppfølgings-/dekkstatus-radene som bare fantes i Oversikt-fanen vises ikke lenger på profilen. Montert dekk
  (`v.dekk`) kan fortsatt ses og endres i «Rediger informasjon» og på den dedikerte Dekk-skjermen (`renderDekkSkjerm()`),
  dekkskift ligger i Verkstedhistorikk, og «Krever dekkskift» varsles fortsatt fra Dashboard/Varslingssenteret.
- Ikke committet.


---

## Prioritet 56.1 (2026-09-21) — Kompakt bilvalg

(Brukerens egen nummerering; bygger på Prioritet 56 «Moderniser hele sjåførmodus».)

**Varig regel: bilvalget bruker Ringeliste-gruppekortene.** `renderDriftslagGruppertBilvalg(velgAttr)` — delt av sjåførens
Velg bil (`data-velg-bil`) og administrasjonens «Bytt bil»-fallback i `renderKontroll()` (`data-velg-kontroll-bil`) — bygger
`.ringeliste-group` (`--accent` = `p48DriftslagFarge()`), `-head` (fargeprikk `.p48-dot`, tittel «LAG 1 (2)» i versaler via
CSS, Lucide `chevron-up`/`chevron-down`) og `-body`. Ikke gå tilbake til `.dash-group-card`/`.group-card-head` her — de er
Biloversikt/Rapporter/Analyse sine egne, høyere kort, og gjør at ikke alle lag får plass. Gruppehode (46 px) og mellomrom
(14 px) er målt identiske med Ringeliste; wrapperne rundt komponenten har derfor ingen egen `gap`, ellers dobles mellomrommet.

**Bilrad** (`.ringeliste-row.sj-velg-rad`, ca. 52 px): `luc('truck')`-ikonflate, «Bilnummer · regnr», «Merke modell
(· 👤 aktiv sjåfør)», liten kontrollpille (`.sj-pill gronn` med klokkeslett `✅ 07:10`, ellers `noytral` «Ikke kontrollert»)
og chevron (`.sj-velg-chevron`). Skiltkomponenten (`.plate`) og «Kontrollert i dag»-pillen er tatt ut av raden. Linjene kortes
med ellipsis. Bil «ute av drift» = samme rad med `.ute` (dempet, `sj-pill rod`, **ingen** `data-velg…`-attributt →
fortsatt ikke klikkbar).

**Toppseksjon** (`.sj-header.kompakt`): 36 px ikon, h2 17 px, én hinttekst «Velg kjøretøyet du kjører i dag.» — 41 px høy (målt)
(målt; den gamle hadde 44 px ikon, en lang hinttekst over flere linjer og 18 px margin — ikke målt separat). Modifieren er scopet til Velg bil; øvrige sjåførskjermer bruker `.sj-header` uendret.

**Åpne/lukke:** som før kun ÉN gruppe åpen om gangen (`kontrollApenDriftslag`, sist brukte lag huskes i `localStorage`).
Dette avviker bevisst fra Ringeliste, der flere grupper kan stå åpne — ett åpent lag gir minst scrolling, og «sist brukte lag
åpent» er en etablert regel (Prioritet 27.7). Toggling kaller `render()` (som Ringeliste).

**Uendret:** navnedialogen («Hvem kjører denne bilen?»), `attachDriftslagGruppeListeners()`, `kontrollDriftslagGrupper()`,
alle klikk-håndterere. Dødt CSS igjen (ikke fjernet): `.p48-velg-card` m.fl.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (v107 → v108), `version-check.js` (107 → 108),
`version.json` (107 → 108), CLAUDE.md/ROADMAP.md/CHANGELOG.md. `storage.airtable.js`/Airtable uendret.

**Testet** i nettleser mot scratch-kopi med mock-storage (ingen ekte Airtable): åtte grupper (sju lag + ute av drift) under
hverandre på ca. 625 px ved 390×844; gruppehode/mellomrom lik Ringeliste; åpne/lukke; bilklikk → navnedialog → «Velg en annen
bil»; ute av drift-rad ikke klikkbar; 320 px uten horisontal overflow og med ellipsis på lange sjåførnavn; ingen JS-feil.
**Ikke testet:** ekte telefon/touch, lys modus, administrasjonens «Bytt bil»-fallback visuelt (samme komponent).


---

## Prioritet 60 (2026-09-21) — Layout Engine 2.0 for hele Bilpark

(Brukerens egen nummerering. Bygger på Dashboard Editor 1.0, Prioritet 58 — den er utviklet videre, ikke duplisert.)

**Varig regel: utseendet på Bilpark er data, ikke kode — og det finnes ÉN motor for det.** Layout styrer kun
plassering, rekkefølge, synlighet, kortstørrelse, seksjonsbredde, starttilstand og standardfane. Den styrer ALDRI
forretningslogikk, datamodell, kontrollregler, saksmotor, verkstedlogikk, kilometerlogikk, lagringslogikk eller HMS-validering.
Ikke bygg en egen editor, en egen widgetliste eller et eget lagringsformat for en enkelt flate — registrer komponenten i
registeret og la motoren gjøre resten.

### Register og konfigurasjon

- **`LAYOUT_COMPONENTS`** er eneste sted en komponent defineres: `id` (widgetId, unik), `area`/`page`, `label`, `ikon`,
  `renderer`, standardplassering (`std`), `canMove`/`canHide`/`canResize`, min/maks-størrelse, `critical`, `devices`, `roles`,
  `parent` (barn — faner, bilkortrader), `tab`, `collapsible`, `maxIndex`, `lockReason`/`hideReason`. Registreres lazily i
  `layoutRegistrerAlle()` via `layoutSikreRegister()` (noen registreringer leser konstanter deklarert lenger ned i filen —
  aldri kall registeret ved skriptets toppnivå før hele filen er lastet). **Ny funksjon = én `layoutReg()`-linje.**
- **Områder** (`LAYOUT_OMRADER`, modus): `admin-dashboard` (grid, 12 kolonner), `admin-sidebar` (sidebar), `vehicle-profile`
  (seksjoner), `driver-min-bil`, `driver-control` (begrenset), `mobile-dashboard` (liste), og standardsidene
  `admin-standard-pages:<side>` (`LAYOUT_STANDARDSIDER`: verksted, kalender, aktivesaker, varsler, rapporter, analyse,
  innstillinger).
- **Konfigurasjon:** ÉN JSON-blob i Settings, nøkkel **`bilpark-layout-config-v2`** (`LAYOUT_KEY`), lest/skrevet med
  `window.storage.get/set(nøkkel, verdi, true)` — ingen direkte Airtable-kall, ingen `LIST_TABLES`-endring, **`storage.airtable.js`
  uendret**: `{schemaVersion:2, layouts:{<gruppe>:[{widgetId, visible, order, width, height, x, y, collapsed, section}]},
  options:{<gruppe>:{defaultTab}}, updatedAt, updatedBy, backup}`. (Ticketen skisserte `"admin-standard-pages":{}` som ett objekt;
  implementert som én nøkkel per side, `admin-standard-pages:<side>`.) Kun presentasjonsdata.
- **Standardlayout i kode** (`layoutStandardKonfig()` fra registerets `std`), bygget for hvert område — ikke hardkodet i den
  lagrede blobben. En manglende/ugyldig gruppe gir automatisk standard; ingen side kan bli tom (`layoutSynligeTopp()` faller
  tilbake til standard hvis ingenting er synlig).

### Innlesing, migrering og normalisering

- `lastLayoutConfig()` (kalles i `loadAll()` OG i bakgrunnssynkens handler) → `layoutStatus`: `ok` · `mangler` · `migrert` ·
  `korrupt` · `ny-versjon` · `lesefeil` · `ikke-lastet`. **En lesefeil er ikke en tom layout:** en tidligere publisert layout
  beholdes, og publisering sperres. **Nyere `schemaVersion` enn appen kjenner** gir standardlayout og BLOKKERT publisering (så
  en eldre app aldri overskriver en nyere layout).
- **`migrateLayoutConfig(config)`** + `LAYOUT_MIGRERINGER`: leser `schemaVersion`, migrerer stegvis, fjerner ukjente
  widgetId-er/områder, legger til nye påkrevde komponenter fra standard. Fra legacy (`layoutLesLegacy()`, kun lesing):
  `dashboard-layout-v1` → `admin-dashboard`, `dashboard-layout` → `mobile-dashboard`/`driver-min-bil` (skjult/rekkefølge
  bevart). **De gamle nøklene slettes aldri.** Migreringen lagres (`layoutPersisterMigrering()`) kun i en administratorsesjon
  og kun én gang — en sjåførenhet skriver aldri layout.
- **`layoutNormaliserGruppe()`** kjøres ved HVER innlesing og HVER endring: fjerner ukjente og duplikater, legger til
  manglende fra standard, **tvinger låste komponenter synlige**, fastholder `canMove:false` (Send kontroll, Sjekk ut bil m.fl.
  står på sin plass) og `maxIndex` (løftebord i Sjåførkontroll), klemmer størrelser, og legger barn under sin forelder. Derfor
  kan verken en manipulert lagret blob eller en manipulert `layoutDraft` skjule en låst komponent — `layoutValider()` avviser
  i tillegg utkastet ved publisering.

### Utkast, Angre og publisering

- **Lokalt utkast** (`layoutDraft`, `layoutUndo`/`layoutRedo` maks 50, `layoutBaseUpdatedAt`) via ÉN inngang,
  `layoutDraftEndre()`/`layoutDraftEndreGruppe()`. Alle operasjoner (`layoutOpSynlig/Flytt/FlyttTil/Bredde/Start/Seksjon/
  Standardfane`, `layoutGridEndre/Skjul/Vis`) går gjennom den. Dashboard bruker `layoutGridPlaser()` (12 kolonner,
  tyngdekraft, ingen overlapp, ingen pikselplassering — reglene fra Prioritet 58 gjelder uendret). Utkast leses aldri av
  normalvisningen, og INGENTING skrives før «Publiser».
- **`layoutPubliser()`:** valider (låste/påkrevde, duplikater, størrelser) → les lagret verdi på nytt og sammenlign
  `updatedAt` mot utkastets utgangspunkt (ingen blind siste-skriving-vinner) → `storage.set` → VENT på bekreftet lagring →
  først da byttes `layoutPub`; forrige publiserte layout legges i `backup` («Gjenopprett forrige» laster den INN I UTKASTET).
  Feil: forrige layout urørt, utkastet vises ikke som lagret, «Layouten kunne ikke lagres. Forrige layout er fortsatt aktiv.»
  Konflikt: «Layouten ble endret fra en annen enhet. Last inn nyeste versjon før du publiserer.» Dobbeltpublisering hindres av
  `layoutLagrer`, og en lesing som startet før en pågående lagring kan ikke sette gammel verdi tilbake.
- **Synk:** `layoutEtterEksternLasting()` oppdaterer publisert layout i bakgrunnen, men overskriver ALDRI et åpent utkast
  (varsel + «Last inn nyeste»). `formInProgress()` er sann mens et utkast er åpent. `goTo()` bort fra editoren med ulagrede
  endringer krever bekreftelse; utlogging avslutter utkastet.
- **Kun administrator redigerer/publiserer** (`layoutKanRedigere()` = admin, ikke sjåførmodus). Sjåfører leser bare publisert
  layout. Editoren for Desktop Dashboard-rutenettet krever desktopvisning (≥ 768 px); øvrige undersider kan redigeres på mobil.
- «Tilbakestill denne siden» / «Tilbakestill hele appen» virker på utkastet (med bekreftelse) og kan angres.

### Flatene

| Flate | Motor-modus | Hva kan endres | Låst (kan ikke skjules) |
|---|---|---|---|
| Desktop Dashboard | grid | plassering, bredde, høyde, skjul/vis, legg til fra bibliotek | – (minst ett kort synlig) |
| Sidemeny (desktop) + drawer (mobil) | sidebar | rekkefølge, skjul/vis, primær ↔ sekundær, dra og slipp | Hjem, Alle sider, Innstillinger |
| Bilinformasjon | seksjoner | rekkefølge, skjul/vis, halv/full bredde, åpen/lukket start; Historikk-faner: rekkefølge, skjul/vis, standardfane | – (minst én fane synlig; skjult fane sletter aldri data) |
| Min Bil (mobil) | liste | rekkefølge, skjul/vis, starttilstand (aldri bredde/høyde) | Bilkort (+ løftebord-raden), Registrer skade, Registrer varsellampe, Sjekk ut bil (låst nederst) |
| Sjåførkontroll | begrenset | Kommentarfeltene kan skjules | Kilometerstand, Varsellamper, Kontrollavvik, Nye skader, Send kontroll (nederst). Løftebord håndteres på Min Bil. |
| Mobil Dashboard | liste | rekkefølge, skjul/vis | – |
| Standardsider | seksjoner | seksjonsrekkefølge, skjul/vis, starttilstand, standardfane | listen på Verksted, selve kalenderen, fanen «Aktiv sak», kritiske HMS-varselkategorier (varsellampe, skade), Layout Editor i Innstillinger |

- **Sidemeny:** `renderDesktopSidebarHtml()`/`layoutDrawerNavHtml()` bygges fra registeret. Skjulte sider ligger fortsatt under
  «Alle sider» (`renderAlleSider()`, screen `allesider`). Sidemenyen styrer også mobilens ☰-drawer.
- **Bilinformasjon:** `renderBilkort()` lager HTML-biter (`bilDeler`, «parts»-mønsteret: `${(deler['id'] = ` + "`…`" + `, '')}`) som
  `layoutFlowHtml()` setter sammen i et 12-kolonners `.lay-flow`. Når «Kjøretøydetaljer» er skjult vises en fallback-knapp
  «Rediger informasjon» slik at redigering aldri blir utilgjengelig. Historikk-fanene bruker `bilkortHistFaner()`.
- **Min Bil / Sjåførkontroll:** Bilkortets rader (Kontrollstatus, Kilometerstand, Neste verkstedtime, Løftebordstatus) er barn
  av «Bilkort». Sjåførkontroll beholder ALL eksisterende logikk (`submitKontroll()` leser `kt-kommentar` null-sikkert, så et
  skjult kommentarfelt ikke krasjer innsending); layout kan aldri endre validering, påkrevde felt, lagringsrekkefølge,
  automatisk navigasjon til Min Bil, dagskille eller aktiv sjåfør.
- **Komponenter registrert utover ticketens liste:** `vehicle.operativ-status`, `vehicle.aktive-saker`,
  `vehicle.avanserte-handlinger`, Mobil Dashboard som eget område. «Kjøretøy og sjåfør» i Sjåførkontroll er ÉTT låst kort
  (ikke to).

### Regler videre

1. Ny flate/komponent = `layoutReg()` i `layoutRegistrerAlle()` + tilsvarende del i sidens `…Deler`-objekt. Ikke lag en egen
   editor eller lagringsnøkkel.
2. Sett `canHide:false`/`critical:true` (med `lockReason`/`hideReason`) på alt som er HMS-kritisk eller nødvendig for å
   kunne fullføre kontrollflyten. Layout skal aldri kunne skjule kritiske HMS-varsler, synkfeil, påkrevde kontrollfelt,
   tilbakenavigasjon, muligheten til å gjenopprette standard eller admin-Innstillinger.
3. Endres formatet: øk `LAYOUT_SCHEMA_VERSJON` og legg til et steg i `LAYOUT_MIGRERINGER`. Slett aldri eldre nøkler automatisk.
4. Utkast leses aldri av normalvisning; ingen lagring før «Publiser»; ingen visning av utkast som lagret ved feil.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (`CACHE_VERSION` v108 → v109), `version-check.js`
(`APP_VERSION` 108 → 109), `version.json` (108 → 109), CLAUDE.md/ROADMAP.md/CHANGELOG.md/AIRTABLE_MIGRATION.md.
**Ikke endret:** `storage.airtable.js`, Airtable, saksmotor, kilometerlogikk, aktiv sjåfør, dagskille, kontrollgrunnlag.

**Testet** i nettleser (Browser-pane) mot en scratch-kopi med in-memory mock-storage — ingen kontakt med ekte Airtable
(`node`/`python` finnes ikke): migrering fra `dashboard-layout-v1`/`dashboard-layout`; Dashboard dra (ekte museforflytning),
skalere, skjule, vise, Angre/Gjør om; sidemeny (låser, skjul, seksjonsflytt, ekte museforflytning, drawer, Alle sider);
Bilinformasjon (skjul/vis, bredde, starttilstand, faner, standardfane, siste fane kan ikke skjules, data urørt); Min Bil
(rekkefølge, skjul, låste kort nekter skjuling, starttilstand, klikk åpner/lukker); Sjåførkontroll (alle låste kort nekter
skjuling/flytting, løftebord-grense, skjult kommentar → kontroll sendes uten feil); standardsider (skjul, låste seksjoner,
standardfane, starttilstand, skjult varselkategori-hint); manipulert lagret konfigurasjon (skjulte kritiske komponenter,
ukjent widgetId/område, duplikat, ugyldig størrelse → normalisert), manipulert utkast (avvist, ingenting lagret); korrupt
JSON (standard, ingen skriving, advarsel), nyere `schemaVersion` (publisering blokkert), lesefeil (layout beholdes),
skrivefeil (forrige layout beholdes), endring fra annen enhet (bakgrunnssynk og stille konflikt), tilbakestill side/hele
appen, Avbryt, publisering + omlasting (persistert), Mobil Dashboard, 375 px uten horisontal overflow og desktop.

**Ikke testet / kjente begrensninger:** (a) mot ekte Airtable (bl.a. at Settings-raden faktisk opprettes ved første
publisering) og ekte samtidig redigering fra to fysiske enheter; (b) på ekte telefon/berøringsskjerm (kun mus; `touch-action:none`
er satt); (c) lys modus; (d) forhåndsvisningen for områdene utenom Dashboard er skjematisk (komponentnavn i rekkefølge),
ikke en pikselnøyaktig kopi av den ekte siden; (e) utkast mistes ved omlasting (ingen `beforeunload`-vern); (f) siste
publisering vinner etter en eksplisitt konfliktmelding — ingen sammenslåing; (g) `dashboardBeregning()` beregnes også for
skjulte kort (samme overflødige beregning som før); (h) Sjåførkontroll er bevisst nesten helt låst — kun løftebord og
kommentar kan endres; (i) ikke committet.


---

## Prioritet 61 (2026-09-21) — Daglig systemkontroll for sjåfører

(Brukeren ga ikke saken et nummer; «61» er tildelt her som neste i rekken etter Prioritet 60. Sak: «Sikre at alle sjåfører bruker siste versjon av DriverControl».)

**Varig regel: en sjåførenhet skal aldri kunne bruke en gammel appversjon gjennom flere dager uten å bekrefte og hente siste versjon.**
Første gang appen åpnes på en enhet hver OPERATIVE dag (`todayISO()`, dagskille kl. 04:00 — samme definisjon som overalt) møter sjåføren
en sperrende skjerm, **Systemkontroll** («Dagens systemkontroll»), og kan ikke lukke den, hoppe over den eller gå videre uten å
trykke **«Oppdater og fortsett»**. Knappen vises ALLTID, også når ingen ny versjon finnes. Gjelder kun sjåførmodus
(`driverMode`); administrasjonen er ikke berørt.

### Forløp (`skUtfor()` → `VERSION_CHECK.hardRefresh()` → `skFullfor()`)

1. Trykk: `version.json` hentes uten cache (`VERSION_CHECK.fetchServerVersion()`). Feiler det: «Kunne ikke kontrollere versjon …» med
   knappen aktiv (prøv igjen). Er serverversjonen ≠ `APP_VERSION`: «**Ny versjon funnet** / Oppdaterer ...».
2. **Hard refresh** (`VERSION_CHECK.hardRefresh()` i `version-check.js`, ÉN felles rutine): service worker oppdateres
   (`registration.update()`), **`bilpark-*`-cachene slettes** (ikke andre — GitHub Pages deler opprinnelse med andre repoer),
   appressursene (siden selv, `version.json`, `version-check.js`, `index.html`, `kontroll.html`, alle `<script src>`/manifest/ikoner)
   hentes på nytt med `fetch(..., {cache:'reload'})` (oppdaterer også nettleserens HTTP-cache), og siden lastes på nytt med ny
   `_v`-parameter **og en engangs-token `_sk`**. Hvert steg er best effort; feiler ett, navigeres det likevel (versjonskontrollen
   ved oppstart er fortsatt fail-secure).
3. Den NYE koden fullfører kontrollen (`skPortvakt()` → `skFullfor()`): token i URL må være lik den lagrede (`bilpark_systemkontroll_pending_v1`,
   maks 10 min gammel; en forfalsket `_sk` godtas ikke). Den registrerer **`lastVerifiedVersion`** (= `window.APP_VERSION`, altså versjonen som
   FAKTISK kjører) og **`lastVerifiedDate`**, viser **«✅ Systemkontroll fullført»** i ~1 s og åpner appen. `_sk`/`_v` fjernes fra adressen
   (`?sjafor=1` beholdes).
4. Portvakten kjører **FØR `loadAll()`** (`VERSION_CHECK_READY.then(async …)`): ingen data lastes og ingenting tegnes før kontrollen er fullført.
   En FEIL i selve portvakten åpner appen som før (feilen logges) — en bug skal ikke sperre alle sjåfører ute. Sperreskjermen setter `#app`
   `inert`, har `role="dialog" aria-modal`, ingen lukkeknapp og lukker seg ikke ved klikk på bakgrunnen.

### Daglig regel — «én gang per sjåfør og enhet per operativ dag»

- Enhetens status (`localStorage['bilpark_systemkontroll_v1']`, reserve sessionStorage/minne): `{enhetId, lastVerifiedDate, lastVerifiedVersion,
  lastVerifiedAt, drivers[], remoteSynced}`. `enhetId` (`bilpark_enhet_id_v1`) er en tilfeldig id laget første gang.
- **Kreves når** `lastVerifiedDate !== todayISO()` (`skKreverKontroll()`) — ved oppstart OG når appen kommer tilbake fra bakgrunnen etter
  04:00 (`skSjekkMidtIOkt()` kalles fra `handhevOperativtDogn()`, som allerede kjøres ved `visibilitychange`/`pageshow`). Ingen `setInterval`
  (samme regel som dagskillet ellers).
- **Per sjåfør:** når en sjåfør bekrefter navnet i «Hvem kjører denne bilen?» (`skNavnSjekk()`): et navn som allerede er registrert i dag →
  ingen ny kontroll; en enhet uten registrert sjåfør ennå godtar første navn uten ny kontroll og registrerer det; et ANNET navn enn de som er
  kontrollert på enheten i dag → systemkontrollen kreves på nytt (og navnet legges til). Sjåførnavn hentes ellers fra sjåførens lokale sesjon.

### Registrering og administratorvisning

- Én **Settings-rad per enhet**: nøkkel `systemkontroll:<enhetId>`, verdi JSON `{enhetId, enhet, sjafor, sjaforer[], versjon, dato, tidspunkt, oppdatert}`
  (`skSynk()`). **Bevisst ikke én felles blob**: mange sjåfører kontrollerer samtidig om morgenen, og lesing + skriving på tvers av enheter er ikke
  atomisk — en felles blob ville tapt oppdateringer. Ingen ny Airtable-tabell/kolonne, ingen `LIST_TABLES`-endring. Feiler Airtable-skrivingen stoppes
  ikke sjåføren; `remoteSynced=false` og den forsøkes på nytt ved neste åpning (og når et navn legges til).
- `window.storage.list(prefix)` i `storage.airtable.js` (**v2.22.0**, `?v=2.22.0`) er nå en ekte implementasjon (var en tom stubb): én paginert
  lesing av Settings som returnerer `{keys, items:[{key,value}]}` for nøkler med prefikset. Bakoverkompatibel.
- **Innstillinger → Optimaliseringer → Sjåfører** (`skAdminBodyHtml()`, laster ved åpning, «Oppdater»-knapp): tabell med
  **Sjåfør(er) · Enhet · Versjon · Sist systemkontroll · Status** (✅ I dag / ⚠️ Ikke i dag; ⚠️ ved versjon ≠ gjeldende), «N av M enheter kontrollert i dag».
  Enheter uten kontroll på over 60 dager skjules (med teller). «Enhet» er en lesbar tekst utledet av userAgent + de fire siste tegnene av enhets-id
  (f.eks. «Android · Chrome (installert app) · #a3f9»).

### Endringer i `version-check.js` (Prioritet 69.2-mekanismen)

- **`performUpdate()` er skrevet om** til å bruke `hardRefresh()`. Den gamle tømte cachene uten å vente på dem, navigerte etter 500 ms uten å hente
  ressursene utenom HTTP-cachen, og brukte `location.href.split('?')[0]`, som **fjernet `?sjafor=1`** fra en installert sjåførsnarvei
  (`index.html?sjafor=1`) — sjåføren kunne havne på administratorinnloggingen. Søkeparametre beholdes nå.
- **Sjåførmodus oppdaterer automatisk** når en utdatert klient oppdages ved oppstart («Ny versjon funnet» / «Oppdaterer ...»,
  `tillatAutoOppdatering()`): maks to forsøk per fem minutter (sessionStorage), deretter står den manuelle knappen igjen — ellers kunne en CDN som
  midlertidig serverer `version.json` og `index.html` i utakt gi en evig omlastingsløkke. Administrasjonen har uendret manuell knapp.

### Regler videre

1. Ikke la noe annet enn `skFullfor()` skrive `lastVerifiedDate`/`lastVerifiedVersion`, og aldri før versjonskontrollen har bestått.
2. Ikke gjør `_sk`-token valgfri eller godta den uten at den finnes i lagringen (unntak: når localStorage er helt utilgjengelig — da godtas parameteren alene).
3. Legger du en ny sjåfør-inngang til appen, må den gå gjennom `skPortvakt()` (oppstart) — eller kalle `skNavnSjekk()` når et navn bekreftes.
4. `hardRefresh()` skal kun slette cacher som starter med `bilpark-`.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `version-check.js`, `storage.airtable.js` (v2.21.0 → v2.22.0), `sw.js` (`CACHE_VERSION` v109 → v110),
`version.json` (109 → 110), `version-check.js` `APP_VERSION` (109 → 110), CLAUDE.md/ROADMAP.md/CHANGELOG.md/AIRTABLE_MIGRATION.md.
**Ikke endret:** Airtable-skjema, saksmotor, kilometerlogikk, aktiv sjåfør/dagskille-logikk, Layout Engine.

**Testet** i nettleser mot scratch-kopi med mock-storage (ingen ekte Airtable, ingen ekte service worker/GitHub Pages; `node`/`python` finnes ikke):
sperreskjermen ved første åpning (app ikke lastet, `#app` inert, knapp alltid synlig); trykk → hard refresh → ✅ → app åpnes, status og Settings-rad
skrevet, `?sjafor=1` bevart og `_sk`/`_v` fjernet; ingen ny sperre senere samme dag; forfalsket `_sk` godtas ikke; dagskille både ved oppstart og midt i
økten (`visibilitychange`); «Ny versjon funnet / Oppdaterer ...» (serverversjon endret) og automatisk oppdatering i version-check med løkkevern
(to forsøk, deretter manuell knapp, `?sjafor=1` bevart); feilsti uten svar fra `version.json` (feilmelding, knappen aktiv); annen sjåfør samme enhet
(ny kontroll og begge navn registrert), samme navn (ingen kontroll), første navn på tom enhet (registreres uten kontroll); Airtable-skriving feiler
(sjåføren passerer, `remoteSynced=false`, retry lykkes); administratorvisning (2 av 3 kontrollert, eldre versjon merket, >60 dager skjult, korrupt rad
hoppet over, feilmeldinger, ikke gjennom portvakten); 375 px uten horisontal overflow; brace-/backtick-balanse.
**Ikke testet:** mot ekte GitHub Pages/CDN (bl.a. at `cache:'reload'` faktisk omgår HTTP-cachen og at ny `_v` treffer ferske filer), ekte service worker og
`caches.delete()` i praksis, iOS-PWA (standalone) og Android-PWA, ekte samtidighet fra mange enheter, og at Settings-radene faktisk opprettes mot Airtable.

**Kjente begrensninger:** (a) kontrollen er KLIENTSIDE og kan ikke håndheves av en server — en sjåfør som rydder lagring eller redigerer localStorage
kan omgå den (samme klasse som resten av arkitekturen uten backend); (b) «operativ dag» bruker enhetens klokke — en enhet med feil klokke kan få feil
dagskille; (c) en klient eldre enn Prioritet 69.2 har ingen versjonskontroll og ingen systemkontroll — den blir først dekket når den har hentet ny kode
(nettverk-først i service worker gjør at dette skjer ved første åpning online); (d) er enheten offline, sperrer allerede versjonskontrollen (fail-secure) —
systemkontrollen kan ikke fullføres uten nett; (e) enhetsrader slettes aldri automatisk (de skjules kun i visningen etter 60 dager); (f) `pwa-install-bar`
ligger utenfor `#app` og er ikke gjort inert (skjult bak sperreskjermen); (g) ikke committet.


---

## Prioritet 62 (2026-09-21) — Dynamisk tekst for driftsdager

(Brukerens egen nummerering.) **Varig regel: «siste N driftsdager» på Dashboard er aldri hardkodet.** N er antall valgte driftsdager i
Operativt kontrollgrunnlag — `activeWeekdays.length` (`operativAntallDriftsdager()`, 1–7; `validerOperativGrunnlag()` garanterer unike heltall).
Man–fre gir «siste 5 driftsdager», man–lør 6, man–søn 7, én dag «siste driftsdag» (`operativSisteDriftsdagerTekst()`).

**Tekst OG beregning bruker samme N.** `kontrollrateSyvDriftsdager()` er omdøpt til `kontrollrateSisteDriftsdager()` og teller nå de N siste
driftsdatoene (dager som ikke er valgt hoppes over) med nevner = valgte biler × N, og returnerer `antall`. Bare å endre teksten ville latt
prosenten fortsatt være regnet over 7 driftsdager (1,4 uker ved man–fre) mens teksten sa 5 — like misvisende. **Konsekvens:** prosenten
siste-driftsdager endrer verdi for alle konfigurasjoner utenom man–søn (den var før regnet over 7 driftsdager uansett).

Teksten leses fra det lagrede grunnlaget hver render, så en endring i Innstillinger → Operativ kontrollgrunnlag slår gjennom med én gang (også via
bakgrunnssynk fra en annen enhet). Samme banner (`dashOperativBannerVenstreHtml()`) brukes av desktop og mobil. Beskrivelsen av kortet «Operativ kontroll» i
Layout Editor er gjort generisk. Ingen andre steder på Dashboard nevner «7 driftsdager» (grep-verifisert); «Siste 7 dager» i Kontrolloversikt/Verksted er
kalenderfiltre, ikke driftsdager, og er urørt.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (`CACHE_VERSION` v110 → v111), `version-check.js` (`APP_VERSION` 110 → 111), `version.json` (110 → 111),
CLAUDE.md/ROADMAP.md/CHANGELOG.md. `storage.airtable.js`/Airtable uendret.

**Testet** i nettleser mot mock-storage: man–fre → «siste 5 driftsdager», man–lør → 6, man–søn → 7, én dag → «siste driftsdag», lør–søn og tirs/tors/lør på en
fridag (teksten følger, antall dager i beregningen = N, nevner = biler × N), og en ekte lagring via Innstillinger (fjernet lør/søn → Dashboard viste «5 driftsdager»
uten omlasting). **Ikke testet:** mobilvisning visuelt (samme funksjon), ekte Airtable.


---

## Prioritet 63 (2026-09-21) — Dublettsikring og flerbilssaker

(Brukerens egen nummerering.) To uavhengige deler.

### Del 1 — Sjåførkontroll: dublettsikring og knappetilstand

- **Knappen:** «Send inn kontroll» deaktiveres og viser «Registrerer...» umiddelbart og kan ikke trykkes flere ganger.
  `beskyttSubmit(nokkel, handler, {opptattTekst})` (delt mekanisme, Prioritet 29) fikk en valgfri `opptattTekst`; opprinnelig tekst gjenopprettes i
  `finally` (kun hvis knappen fortsatt står i DOM-en). JS-låsen `_aktiveHandlingsLaser` er selve sperren — ikke bare `disabled`.
- **Etter vellykket lagring:** uendret flyt — «✅ Kontroll registrert» (`visSjToast`, med `circle-check`-ikon) og rett til Min Bil (sjåførmodus).
- **Dublett = samme bil + samme sjåfør (navn normalisert: trim, mellomrom, små bokstaver) + samme operative dag + innen `KONTROLL_DUBLETT_MINUTTER` (10)
  minutter.** Kun den første lagres. `kontrollFinnDublett()` kjøres i `submitKontroll()` etter dagskille-håndhevingen og FØR km-validering/noe skrives, i tre lag:
  (1) `kontroller[]` (lokal + live-synket); (2) et fingeravtrykk i localStorage (`bilpark_kontroll_sist_v1`: `{nokkel, ts, status:'pagar'|'ok'}`) som overlever omlasting
  og at synken bytter ut listen, og som også markerer en PÅGÅENDE innsending (gyldig 90 s) slik at en andre fane ikke kan starte samtidig; (3) knapp + lås.
  Tidsforskjellen regnes fra operativt dagskille (`kontrollMinutterIDogn()`), så 23:58 og 00:03 er 5 minutter fra hverandre.
- **Når en dublett oppdages:** ingenting lagres (`kontroller` uendret, `v.km` uendret). Sjåførmodus → Min Bil med «Kontrollen var allerede registrert» (aktiv sjåfør bekreftes
  idempotent via `startBilokt()`); admin → melding + bilkortet. Pågår en annen innsending: «Kontrollen registreres allerede — vent et øyeblikk.» og skjemaet beholdes.
  Fingeravtrykket settes til `'pagar'` FØR første skriving og `'ok'` når alt er lagret; `rullTilbake()` fjerner det, så et nytt forsøk etter en mislykket innsending er lov.
- **Ærlig grense:** to ULIKE enheter som sender samme kontroll innen ~45 s (før live-synk har hentet den første) kan fortsatt begge lagre — det finnes ingen server som kan avgjøre rekkefølgen.
- **Latent feil rettet:** `submitKontroll()` leste `submitBtn` FØR `const submitBtn` var deklarert (temporal dead zone) i grenen der `krevVehiclesSkriving()` avviser — ville kastet `ReferenceError` i stedet for å vise meldingen. Deklarasjonen er flyttet til toppen.

### Del 2 — Flerbilssaker («ett problem + flere biler = én sak»)

**Datamodell (viktig valg):** hver bil beholder SIN EGEN saksrad (egen status, historikk, oppfølgingsdato/neste handling, verkstedbestilling, kjøretøyhistorikk og bilstatus), og radene som
hører sammen knyttes med et felles **`sakGruppeId`** (`AktiveSaker.SakGruppeId`, ny kolonne — se AIRTABLE_MIGRATION.md). Aktive saker viser dem som ÉN sak: `sakGruppePanelerHtml(fase)` — ett panel per
sak med én rad per bil (kun biler som står i valgt fane), og gruppen står ikke i per-bil-grupperingen under. Alternativet, én rad med `biler[]`, ville krevd per-bil status/oppfølging/verksted inne i én rad og at alle
konsumenter av `s.vehicleId` (Dashboard, `vehicleHovedstatus()`, Varslingssenter, Historikk, Rapporter, sletting) lærte formatet. Konsekvens: «ett problem» er én sak i visningen, men i data flere saksnumre
(SAK-0004, SAK-0005 …) — et bevisst kompromiss.

- **➕ Legg til bil** (`sakLeggTilBil()`): på ethvert åpent sakskort og i flerbilspanelet. Lager en ny saksrad for bilen (samme sakstype/tittel/beskrivelse/avvik, neste handling og oppfølgingsdato kopieres,
  ny bil starter i «Aktiv sak» hvis kilden gjør det, ellers i «Under oppfølging» — aldri direkte i «Planlagt verksted»), sporer koblingen i begge sakers historikk, og rulles tilbake ved lagringsfeil.
  En bil kan ikke legges til to ganger i samme åpne sak.
- **Unntak:** varsellampe- og skadesaker (`SAK_FLERBIL_UNNTATT`) kan ikke få flere biler — de er knyttet til ÉN bils egen `varsellys[]`/`damages[]`-registrering, og en kopi ville pekt på feil bils data.
- **Godta alle** (`godtaSakGruppe()`): alle biler i «Aktiv sak» → «Under oppfølging» i én lagring med rollback.
- **Verkstedbestilling per bil** (`visSakGruppeVtDialog()` → `opprettVerkstedForSakGruppe()`): «Bestill verkstedtime for alle (N)» åpner en dialog (biler kan velges bort, verksted foreslås fra standardverksted,
  dato, tid, kommentar) og oppretter **én verkstedbestilling per bil** (`sakId`/`caseId` satt, felles `bestillingGruppeId` slik at «Alle N utført» i Verksted virker), kobler hver sak (`verksted-bestilt`,
  `linkedVtId`, historikk). **Idempotent:** en bil som allerede har en ikke-utført time koblet til saken (fra et delvis forsøk) får den kobles på nytt i stedet for en ny. Feiler timelagringen leses fasiten fra Airtable —
  det som faktisk ligger der beholdes og kobles, resten tilbakestilles; feiler sak-lagringen etter at timene ble lagret, tilbakestilles sakene og et nytt trykk adopterer timene uten dubletter.
- Per-bil-handlingene (Godta, Avslå, Bestill verkstedtime, Utført uten verkstedbesøk, Arbeid utført) er de SAMME som før (`sakHandlingHtml()` er delt av sakskortet og bilradene) og virker per bil.
- **`submitAddSak()`** («+ Ny sak») refererte en udefinert variabel `priority` (etterlatt av Prioritet 59) og kastet `ReferenceError` ved lagring — rettet. «Ny sak» oppretter fortsatt én bil; flere biler legges til etterpå.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `storage.airtable.js` (v2.22.0 → **v2.23.0**, nytt felt `sakGruppeId`), `sw.js` (`CACHE_VERSION` v111 → v112), `version-check.js` (`APP_VERSION` 111 → 112),
`version.json` (111 → 112), CLAUDE.md/ROADMAP.md/CHANGELOG.md/AIRTABLE_MIGRATION.md. **Krever en ny Airtable-kolonne før idriftsettelse:** `AktiveSaker.SakGruppeId` (enkel tekst) — alle `LIST_TABLES`-felt skrives ved hver skriving, så uten
kolonnen feiler ALLE lagringer av aktive saker. Innstillinger → Optimaliseringer → Airtable → «Synkroniser nå» kan opprette den.

**Testet** i nettleser mot scratch-kopi med mock-storage (ingen ekte Airtable): dobbeltklikk/`requestSubmit` under en treg lagring (én kontroll, én skriving, «Registrerer...»); dublett fra `kontroller[]`, fra bare
fingeravtrykket, utenfor vinduet, annen sjåfør/bil/dag, navnenormalisering, midnatt/dagskille, pågår-merke (nytt og utløpt), ende-til-ende (ingen `kontroller`-skriving, km uendret); skrivefeil → rollback → merket fjernet → nytt forsøk lykkes;
`krevVehiclesSkriving()`-grenen uten `ReferenceError`; «Legg til bil» (ekte klikk, bil 2 og 3, avvist dobbel, ingen knapp på skade/varsellampe), Godta alle, samlet verkstedbestilling (tre biler → tre timer, felles gruppe-id),
per-bil «Arbeid utført» og «Alle utført», per-bil status/historikk, tre feilstier (timer feiler / saker feiler / retry uten dubletter), rollback ved «Legg til bil», ny bil i verksted-fase, øvrige skjermer uten JS-feil.
**Ikke testet:** ekte Airtable (bl.a. at kolonnen `SakGruppeId` aksepteres), mobilvisning av flerbilspanelet, to samtidige enheter.

**Kjente begrensninger:** (a) en flerbilssak har ett saksnummer per bil, ikke ett felles; (b) Dashboard, Varslingssenter og bilkort viser fortsatt hver bils sak for seg (bevisst — per kjøretøy);
(c) «Ny sak»-skjemaet kan ikke velge flere biler ved opprettelse; (d) en bil som legges til får en kopi av kildens avvik og oppfølging på tidspunktet — senere endringer på kilden følger ikke med; (e) er «Planlagt verksted»-fanen skjult i
Layout Editor, vises ikke gruppen der — sakene er uendret; (f) ikke committet.

---

## Prioritet 64 (2026-09-21) — Samle oppdatering og synkronisering

(Brukerens egen nummerering. Det finnes en tidligere, urelatert «Prioritet 64 (2026-09-14) — Bilkortet skal komprimeres» lenger opp. Nummeret følger brukerens backlog.)

**Varig regel: Ett sted for appoppdatering, Airtable-synk og systemstatus.** Oppdater app, Database status og Systemkontroll sjåfører er ikke lenger egne trekkspillseksjoner. De ligger i Innstillinger → **🔄 Optimaliseringer**, med samme fanemønster som Hurtigoversikt (`.profil-tabs` / `byttOptimaliseringFane()` uten full `render()`).

| Fane | Innhold | Handling |
|---|---|---|
| Alle | Appversjon, siste Airtable-synk, sjåfører kontrollert i dag | felles knappen under |
| App | Appversjon, PWA-installasjon | Oppdater app (`hardRefreshApp`) |
| Airtable | Siste synk, status, full diagnose (`databaseStatusHtml()`) | Synkroniser nå |
| Sjåfører | Enheter, versjoner, sist systemkontroll, status (`skAdminBodyHtml()`) | Oppdater-listen |

**Felles knapp «Oppdater og synkroniser alt»** (`oppdaterOgSynkroniserAlt()`), synlig under alle faner: (1) skjemasjekk/`autoFixAirtableSchema` via `runDatabaseSync()`, (2) last operative lister på nytt (`lastAirtableDataNaa()` / `AIRTABLE_LIVE_NOKLER`), (3) hent systemkontrollstatus (`skAdminLast()`), (4) `hardRefreshApp({bekreft:false})` — omlasting tvinger fersk appkode og Dashboard. Rekkefølgen er bevisst: synk FØR hard refresh, fordi refresh logger ut (innlogging er kun i minnet).

**Layout:** `innstillinger.optimaliseringer` er registrert i Layout Engine 2.0 (`canHide:false`, `critical:true`). Akkordiontittelen bruker emoji (`🔄`), ikke Lucide — `settingsAccordionRow()` sender tittelen gjennom `esc()`. Systeminnstillinger inneholder nå Operativ kontrollgrunnlag, Administratorbrukere, Informasjonsveileder, Enhetsvisning og Nullstill.

**Dyplenker** (lesefeil-panel, Dashboard-skjemabanner, stoppet oppstart) åpner Optimaliseringer → Airtable via `aapneOptimaliseringer('airtable')`.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (`CACHE_VERSION` v112 → v113), `version-check.js` (`APP_VERSION` 112 → 113), `version.json` (112 → 113), CLAUDE.md/ROADMAP.md/CHANGELOG.md/README.md/AIRTABLE_MIGRATION.md. **`storage.airtable.js` uendret** (v2.23.0) — ingen nye felt.

**Ikke rørt:** sjåførens daglige Systemkontroll-sperre (Prioritet 61), saksmotor, kilometerlogikk, aktiv sjåfør, kontrollgrunnlaget, Layout Engine-mekanikken for øvrig.

**Kjente begrensninger:** (a) hard refresh logger ut administrator (samme som «Oppdater app» alltid har gjort — innlogging ligger i minnet); Dashboard vises etter ny innlogging; (b) «Oppdater og synkroniser alt» kan ikke fullføre Airtable-synk etter omlastingen i samme økt — synken kjøres FØR refresh; (c) to ulike enheter som synker samtidig følger siste skriving, uendret.

---

## Prioritet 69 (2026-09-22) — Rydd opp i sakslivssyklus

**Varig regel: avslå lukker hele hendelsen.** Når administrator avslår en sak, er saken,
tilhørende varsellampe og tilhørende kontrollavvik lukket samtidig. Min Bil, Dashboard,
Aktive saker og Varsler leser de samme kildene: åpen sak via `sakErApen()` (status
`avslatt`, `utfort` og `lukket` er lukket) og aktiv varsellampe via `status === 'aktiv'`.
En avslått sak skal ikke kunne stå som aktiv varsellampe eller aktivt kontrollavvik.

`avslaSak()` setter `status` til `avslatt`, `resolvedAt`/`resolvedBy` og en historikklinje,
setter hvert aktivt punkt i `sak.avvik` til `avslatt`, og kvitterer matchende varsellampe
(`kvittert`) når ingen annen åpen sak på samme bil fortsatt har den lampen. Feiler
lagringen, rulles både saker og varsellamper tilbake. Lukkede saker forsvinner fra de
aktive listene og vises i historikk via `resolvedAt`. Kvitterte lamper ligger i
varsellamphistorikken på kjøretøyprofilen.

**Varslingssenter er «dette krever handling nå».** `beregnVarslingssenterListe()` tar med
åpne saker og varsellamper med `status === 'aktiv'`. Avslåtte, lukkede og utførte saker og
kvitterte lamper rendres ikke på skjermen. «Merk som løst» (`kvitterVarsellys()`) setter
lampen til `kvittert` og avslår åpne saker på samme bil som kun hadde den lampen igjen.
Andre aktive avvik på saken blir stående.

**Varig regel: én sak tilhører ett kjøretøy.** «Legg til bil» og samlet flerbilshåndtering
er fjernet fra Aktive saker, varsellamper, kontrollavvik og skader. Eldre `sakGruppeId`-rader
vises som egne saker på sin bil; kolonnen slettes ikke. Flere biler kan kun velges på
dekkskift (`Velg flere biler` i verkstedskjemaet), som fortsatt lager én verkstedbestilling
per bil.

`storage.airtable.js` er uendret på v2.24.0. App-/cacheversjon 116 → 118.

---

## Prioritet 68 (2026-09-22) — Direkte redigering av bilinformasjon

**Varig regel: redigering av en bil skjer i Kjøretøydetaljer på selve bilprofilen.** «Rediger
informasjon» bytter samme seksjon fra kompakt visning til redigerbare felt; det skal ikke
bygges en separat redigeringsskjerm eller et langt, frittstående databasepanel. Bilkort,
statusrader, aktive saker og Historikk forblir i DOM-en og synlige under redigering.

**Kompakt layout:** `.bilinfo-edit-grid` bruker tre kolonner på desktop, to på mellomstore
flater og én på mobil. En Kjøretøydetaljer-komponent med aktiv redigering spenner hele
profilbredden, uavhengig av lagret halvbredde i Layout Engine. Avanserte
driftsinnstillinger og løftebordkontroll ligger lukket under hovedfeltene, slik at normal
redigering krever minst mulig scrolling.

**Servicebegrepene er uavhengige:**
- `v.serviceIntervallKm` / `Vehicles.ServiceIntervallKm` er et tall i kilometer og brukes
  av `vehicleNesteServiceKm()`/`vehicleServiceStatus()` til neste service, varsler og km igjen.
- `v.servicenummer` / `Vehicles.Servicenummer` er ren tekst for verksted-, faktura- og
  kostnadsreferanse. Feltet påvirker aldri serviceberegninger.

Ny kolonne `Vehicles.Servicenummer` (enkel tekst) MÅ opprettes før idriftsettelse, eller
opprettes via Innstillinger → Optimaliseringer → Airtable → «Synkroniser nå».
`storage.airtable.js` er uendret på v2.24.0; app-/cacheversjon 115 → 116.

---

## Prioritet 66 (2026-09-21) — Skill kommentarer og kilometeravvik

(Brukerens egen nummerering; det finnes en tidligere, urelatert «Prioritet 66 (2026-09-14) — Dataintegritet: operativt døgn og kilometerstand». Nummeret følger brukerens backlog.)

**Varig regel: kilometeravvik og sjåførkommentarer er separate hendelser.** De skal aldri vises som én blandet tekstblokk i kommentarsenteret. Lagret `kontroller[].kommentar` (som fortsatt kan inneholde `KM_AVVIK_PREFIX`-linjen fra storthopp) slettes ikke — visningen splitter.

- **Kilometeravvik** (`kmAvvikHendelserListe()`, `kmAvvikHendelseRadHtml()`): tittel «⚠ Kilometeravvik»; Fra, Til, Differanse; **Godkjenn** (`godtaKmEndring()`, samme som Varslingssenteret). Avslå beholdes som sekundær adminhandling.
- **Sjåførkommentar** (`nyeKommentarerListe()` via `kontrollSjaforKommentarTekst()`): tittel «💬 Sjåførkommentar»; kun sjåførens tekst. Km-prefix-linjer telles ikke som kommentar og inngår ikke i ulest-telleren.
- **Sjåfør** (Mer / bunnmeny Kommentarer): kun `driverActiveVehicleId`. Tom filter viser ikke flåten — «Ingen aktiv bil».
- **Administrator** (Kommentaroversikt): Alle biler eller ett kjøretøy (`kommentaroversiktFilterBil`). To paneler: avvik og kommentarer.
- Kontrollhistorikk viser også de to hendelsene hver for seg. Ingen Airtable-endring.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js`/`version-check.js`/`version.json` 113 → 114. `storage.airtable.js` uendret.

---

## Prioritet 67 (2026-09-21) — Opprydding av Kjøretøyprofil

(Brukerens egen nummerering.) **Varig regel: Kjøretøyprofilen viser daglig operativ informasjon ett sted.** Duplikater (mobilitetsgaranti-felt, aktiv sjåfør i statusrad, eget Aktive saker-panel, neste verkstedtime som eget layoutkort) er fjernet fra visningen — dataene er urørt.

**Neste verkstedtime.** `vtErKommende(t)` = ikke `utfort` og har `dato`. Klokkeslett eller dato som er passert skjuler ikke timen. Gjelder Dashboard, profil, Min Bil og Verkstedoversikt (samme `nesteVerkstedtime()`). Kortet viser 🛠 Neste verkstedtime, dato, klokkeslett og verksted; klikk åpner avtalen (`apneVerkstedAvtale()`). Ligger INNE i bilkortet (`dashBannerVerkstedHtml(v.id)`). Layoutnøkkelen `vehicle.neste-verkstedtime` er tom og skjult som standard.

**Bilkort:** `Bilnummer · Regnr` / modell / `Løyve: … │ Servicenr: …` / aktiv sjåfør / neste verkstedtime / lite mobilitetsikon (🟢 Aktiv når `vehicleMobilitetsgaranti().status==='gyldig'`, ellers 🔴 Ikke aktiv). Ingen eget mobilitetsfelt.

**Servicenummer** (`v.servicenummer` → `Vehicles.Servicenummer`) er verksted-/faktura-referanse — ingen kobling til serviceintervall eller km igjen. Rediger informasjon + Ny bil. **Krever Airtable-kolonne før idriftsettelse.**

**Statusrad:** Kilometerstand · Sist service (dato + km igjen) · EU (Godkjent til + status) · Dekk (🔵 vinter / 🟢 sommer / helårs, `data-apne-dekk` → `goToBilDekk()` → `renderDekkSkjerm()`) · Løftebord. Aktiv sjåfør og mobilitetsgaranti er fjernet herfra.

**Historikk:** sjette fane Aktive saker (`history.aktivesaker`). Eget Aktive saker-panel er tomt/skjult. Kommentarer og kilometeravvik forblir egne hendelsestyper (Prioritet 66); etikettene er Fra/Til.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `storage.airtable.js` v2.23.0 → **v2.24.0**, `sw.js`/`version-check.js`/`version.json` 114 → 115, CLAUDE.md/ROADMAP.md/CHANGELOG.md/AIRTABLE_MIGRATION.md.

**Ikke rørt:** saksmotor, `submitKontroll()`/`v.km`-skriveregler, aktiv sjåfør-tildeling, Layout Engine-mekanikk (kun registertekst og standard synlighet).
## Prioritet 65 (2026-09-21) — Aktiv sjåfør følger kontrollhistorikken

(Brukerens egen nummerering. Det finnes en tidligere, urelatert «Prioritet 65 (2026-09-14) — Kjøretøyprofilen er en kontrollflate» lenger opp.)

**Varig regel: aktiv sjåfør = siste person som gjennomførte gyldig kontroll på bilen i inneværende operative dag.** En bil med kontroll i dag skal aldri vises uten aktiv sjåfør, med mindre administrator har trykket «Nullstill aktiv sjåfør» etter den kontrollen. `AktivSjaforSiden` settes til kontrollens tidspunkt ved gjenoppretting.

**Lesing (`vehicleAktivSjafor()`):** siste gyldige kontroll i dag (`sisteGyldigeKontrollIdag()` — navngitt sjåfør, ikke `kmGodkjenningStatus === 'avvist'`) vinner, med mindre (1) administrator har manuelt nullstilt etter den kontrollen, eller (2) kjøretøyfeltet er gyldig for i dag og nyere enn kontrollen (f.eks. «Ny sjåfør»). Tomt felt etter reload gir derfor likevel riktig visning.

**Gjenoppretting (`gjenopprettAktiveSjaforerFraKontrollhistorikk()`):** skriver manglende/eldre felt tilbake til Airtable når `vehiclesSkrivingTillatt()`. Kjøres etter dagskille-opprydding i `loadAll()`, og via `etterAktivSjaforInngang()` (auto-reset FØR gjenoppretting) ved oppstart, synk (`_lagBatchetLiveSyncHandler` / `lastAirtableDataNaa`), `goTo()`, `visibilitychange` og `pageshow`. Snapshot/rollback ved lagringsfeil. Skriver ikke ved lesefeil.

**Manuell nullstilling:** Settings-nøkkel `aktiv-sjafor-manuell-nullstilling` `{[vehicleId]:{dato, at}}`. Ny kontroll (eller «Ny sjåfør») fjerner unntaket. Gammel dag prunes ved lasting.

**Dashboard:** «N aktive» i Operativ kontroll-banneret (`operativAktiveCount()`) telles på **samme kjøretøygrunnlag** som «X/Y kontrollert», slik at 7 kontrollert ikke kan vises som 0 aktive for de samme 13 bilene.

**Dagskille 04:00** (`ryddOppBiloktDagskille()` / `todayISO()`) er uendret. Ny kontroll fra annen sjåfør overtar (siste kontroll i dag). Kryss-bil-utsjekking i `settAktivSjafor()` er fjernet — per-bil siste kontroll er sannheten.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (v113 → v114), `version-check.js` / `version.json` (113 → 114), CLAUDE.md/ROADMAP.md/CHANGELOG.md/AIRTABLE_MIGRATION.md. **`storage.airtable.js` uendret** (v2.23.0) — ingen nye Vehicles-felt.

**Ikke rørt:** kilometerlogikk, saksmotor, kontrollgrunnlagets kjøretøy-/ukedagsvalg, Layout Engine.

**Kjente begrensninger:** (a) «Sjekk ut bil» avslutter lokal sjåførsesjon, men Dashboard viser fortsatt siste kontrollsjåfør inntil manuell admin-nullstilling eller dagskille — dette er ticket-regelen, ikke en feil; (b) per-bil 14:50-autoreset tømmer feltet, men visning og gjenoppretting følger kontrollhistorikken samme dag; (c) to ulike enheter innen ~45 s før live-synk kan midlertidig divergere, som øvrig Settings/Vehicles-synk.

---

## Prioritet 70 (2026-09-22) — Skill kommentar og kontrollavvik

(Brukerens egen nummerering. Det finnes en tidligere, urelatert «Prioritet 70 — Samlet Verksted og Verkstedhistorikk» lenger opp.)

**Varig regel: kommentar er informasjon, kontrollavvik er et problem.** Sjåførens generelle kommentar (`kontroller.kommentar`) oppretter aldri sak, varsel eller kontrollavvik. Den vises under Historikk → Kommentarer. Nye kontrollrader settes `kommentarLest: true`, og `kommentarSkalVarsles()` utelater `kilde === 'kontroll'` fra Varslingssenteret og sidemenytelleren. Fristilte kommentarer fra ☰ Mer kan fortsatt varsles.

**Avvikskommentar** vises bare når minst ett kontrollavvik er valgt (inkludert løftebord «Må gjøres»). Teksten lagres på avvikpunktet (`avvik[].kommentar` i den eksisterende `AktiveSaker.Avvik`-blobben) og i historikklinjen, kun for `caseType === 'kontrollavvik'`. Ingen ny kolonne. `storage.airtable.js` forblir v2.24.0.

**Nytt avvik:** `sidespeil` / «Sidespeil defekt/ødelagt» i `KONTROLLAVVIK_ORDER`. Løftebord er tatt ut av chiplisten og ligger sammen med Nye skader: venstre Ja/Nei, høyre OK / Må gjøres. «Må gjøres» legger `loftebord` i `kontrollFormAvvik`. Smøring registreres fortsatt på Min Bil.

**Kontrollrekkefølge er låst** (`canMove: false`): kilometerstand, varsellamper, kontrollavvik, kommentar til kontrollavvik, kommentar fra sjåfør, nye skader og løftebord, send. Bil og sjåfør er ikke felt på skjemaet. Uten valgt bil viser administrasjonen bilvelgeren før skjemaet; sjåføren sendes tilbake til Velg bil.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` / `version-check.js` / `version.json` 118 → 119. `storage.airtable.js` uendret.

## Prioritet 71.1 (2026-09-22) — Fjern løftebord fra sjåførkontroll

(Brukerens egen nummerering. Det finnes en tidligere, urelatert «Prioritet 71.1 — migrerLegacySkaderTilSaker» lenger opp.)

**Varig regel: løftebord håndteres på Min Bil, ikke i sjåførkontrollen.** Kontrollflyten viser ikke løftebordseksjon, OK/Må gjøres eller vedlikeholdsstatus. `'loftebord'` beholdes i `KONTROLLAVVIK_ORDER`/`_LABEL`/`_IKON`/`_LUCIDE` for Min Bil-avvik og historikk, men filtreres ut av chiplisten, kladd, innsending og avvikskommentar-visning i `renderKontroll()`.

**Kontrollrekkefølge er låst** (`canMove: false`): kilometerstand, varsellamper, kontrollavvik, kommentar til kontrollavvik, kommentar fra sjåfør, nye skader, send. Layout-id `control.nye-skader` avløser `control.skade-loftebord` (ukjent nøkkel forkastes av `layoutNormaliserGruppe()`).

**Min Bil er urørt:** `driver.loftebord`, `loftebordVedlikeholdStatus()`, «Smør løftebord» / `submitMinBilLoftebordVedlikehold()`.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` / `version-check.js` / `version.json` 119 → 120. `storage.airtable.js` uendret (v2.24.0).

---

## Prioritet 74 (2026-09-22) — Historisk service som autoritativ kilde

**Varig regel: servicehistorikk er eneste kilde til «Siste service».** Det finnes ikke et eget kjøretøyfelt for siste service. `vehicleSisteService()` leser nyeste gyldige post (`dato` = ServiceDato, ISO `YYYY-MM-DD`) i `servicehistorikk`. `vehicleNesteServiceKm()` / `vehicleServiceStatus()` («km igjen») bruker den postens km + `v.serviceIntervallKm`. Ugyldig eller manglende dato telles ikke.

**Registrer tidligere service** ligger ved siden av **Registrer service** (Verksted-verktøy + Service-skjermen). Felt: Utført dato, Kilometerstand ved service, Verksted, Kommentar. `createdAt` settes til nå og røres aldri av utført dato. Ny service (i dag) bruker samme `dato`-felt, men forhåndsutfylt med i dag.

**Sletting:** `deleteService()` fjerner posten. `deleteVT()` fjerner også `servicehistorikk` med `fraVerkstedtimeId` (ellers ble «Siste service» stående etter at visningen i Verkstedhistorikk hoppet over den). Neste gyldige post vinner ved neste `render()`. `v.km` røres aldri.

**Service-skjermen** (`screen === 'service'` → `renderServiceSkjerm()`) er igjen arbeidsflaten for utførte servicer. Kjøretøyprofilens «Sist service»-kort åpner den (`apneServicehistorikk`). Bestill service (kommende verkstedtime) er uendret.

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` / `version-check.js` / `version.json` 120 → 121. `storage.airtable.js` uendret (v2.24.0).

## Prioritet 72 (2026-09-22) — Komprimer Biloversikt

(Brukerens egen nummerering; det finnes en tidligere, urelatert «Prioritet 72.0 (2026-09-18) — Dashboard 2.0».)

**Varig regel: primære navigasjonssider har ikke ← Tilbake.** Brukeren kommer dit via sidemeny/bunnmeny; tilbake-knappen hører hjemme på detalj-/undersider. Primære uten Tilbake: Biloversikt, Verksted, Kalender, Aktive saker, Varslingssenter, Rapporter-hub, Kostnader. Detaljer med Tilbake: Bilprofil (`#back-to-register`), rapportdetalj (tilbake til hub), Verkstedhistorikk, Historikk, Bestill, Kommentarer, Analyse, Innstillinger, m.fl.

**Biloversikt — mindre høyde, samme funksjon.**
- Kjøretøytelleren «N av M kjøretøy» er fjernet (lite operativ verdi).
- Søk + Filter står først på samme linje (`.reg-filterbar`) — plassen Tilbake/toolbar frigjorde.
- «+ Ny bil» er en fane i `.profil-tabs` med `margin-left:auto` (`.profil-tab-ny`), ikke en egen knapp/blokk over listen. Valgt fane `ny-bil` setter `showAddVehicleForm = true` og rendrer `registerNyBilSkjemaHtml()` som fanens innhold. `formInProgress()` / `submitAddVehicle()` / `resetRegisterFiltre()` er uendret i kontrakt.
- Handlingsknapper som «+ Ny sak» og «Marker alle som sett» beholdes på sine primære sider (uten Tilbake ved siden av).

**Filer:** `index.html`, `kontroll.html` (eksakt kopi), `sw.js` (v118 → v119), `version-check.js` (118 → 119), `version.json` (118 → 119). **`storage.airtable.js` uendret** (v2.24.0).

