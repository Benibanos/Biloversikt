✅ Fase 1
Aktive Saker

✅ Fase 2
Automatisk Saksgenerering

✅ Fase 3
Verkstedflyt

✅ Fase 4
Kostnadsoversikt og Avsettingsstyring

────────────────────────────

✅ Fase 5
Operativ Kontroll og Bilparkhelse

Mål:
Gi driftskoordinator full kontroll over bilparken på under 10 sekunder.

Innhold:
- Krever handling nå
- Manglende kontroller
- Bilparkhelse
- Kritiske biler
- Sakens alder
- Eldste åpne saker
- Kommende verkstedtimer
- Neste handling pr sak
- Kontrollstatus pr bil

────────────────────────────

✅ Fase 6
Påminnelsesmotor og Oppfølging

Mål:
Ingen aktive saker skal kunne bli glemt.

Innhold:
- Oppfølgingsdato på saker
- Forfalte saker
- Manglende neste handling
- Automatiske varsler i appen
- Daglig oppfølgingsliste
- Dashboardvarsler
- Påminnelser på verkstedtimer

────────────────────────────

✅ Fase 7
Bilstatus 2.0 og Kjøretøyhistorikk

Mål:
Hver bil skal ha en komplett digital tvilling.

Innhold:
- Full tidslinje per bil
- Samlet historikk
- Skader
- Varsellamper
- Verkstedhistorikk
- Kontrollhistorikk
- Dekkhistorikk
- Statusutvikling over tid

────────────────────────────

✅ Fase 8
Rapportering og Ledelsesoversikt

Mål:
Gi transportleder og ledelse oversikt uten å påvirke den operative delen.

Innhold:
- Månedlige rapporter
- Kostnadssammendrag
- Verkstedrapport
- Bilhelserapport
- Kontrollgrad
- Antall åpne saker
- Excel-eksporter

────────────────────────────

✅ Fase 9
Analyse og Prediktiv Oppfølging

Mål:
La systemet hjelpe dere å være proaktive.

Innhold:
- Gjentatte feil per bil
- Mest kostbare biler
- Verkstedtrender
- Bil med flest saker
- Kommende servicebehov
- Risikoindikatorer

────────────────────────────

✅ Optimalisering 1
Universell Tilbakeknapp

Mål:
Redusere antall klikk og gjøre navigasjonen raskere på mobil.

Innhold:
- Felles navigasjonshistorikk (goTo/goBack) — "← Tilbake" går alltid til
  reell forrige side, ikke en fast side
- Konsekvent "← Tilbake"-design på alle undersider
- Tilbakeknapp på Kjøretøyprofil, Aktive Saker, Verkstedoversikt,
  Skadeoversikt, Varseloversikt, Dekkoversikt, Kontrolloversikt,
  Kostnadsoversikt, Rapporter, Analyse, Kontroll
- Sveip høyre oppdatert til samme logikk

────────────────────────────

✅ Optimalisering 2
Rydd Dashboard og Fjern Dobbeltinformasjon

Mål:
Mindre støy, mindre dobbeltinformasjon, mindre scrolling, raskere forståelse.

Innhold:
- "Krever handling nå" samlet ett sted og flyttet tidlig opp: oppsummering
  (kritiske saker / oppfølging i dag / mangler kontroll / evt. ute av drift)
  + utvidbar liste over de 5 viktigste hendelsene
- Kontrollstatus vises kun ett sted: "X / Y kontrollert" + fremdriftsbar + %
- Bilparkstatus redusert til 5 rene nøkkeltallskort (ingen avledede tall)
- Fjernet: "Viktige varsler"-banner, separate "Forfalte saker"- og
  "Oppfølging i dag"-paneler, eget "Kritiske biler"-listepanel,
  "Bilparkhelse"-panelet — alt dekket av de gjenværende seksjonene

────────────────────────────

✅ Optimalisering 3
Kontrollsletting med Full Cleanup

Mål:
Ingen "spøkelsesdata" skal bli liggende igjen når en kontroll slettes.

Innhold:
- Ny smart slettedialog (mobiloptimalisert, store knapper) i stedet for
  window.confirm() — viser hva kontrollen har opprettet før sletting
- To modus: "Kun slett kontroll" (beholder alt tilknyttet) og
  "Full cleanup" (fjerner alt som utelukkende stammer fra kontrollen)
- Sikkerhetsregel: saker som er viderebehandlet (verksted bestilt, nye
  registreringer, egen oppfølging satt) krever eksplisitt bekreftelse
  før de kan fjernes automatisk
- Kilometerstand rekalkuleres og bilstatus/kontrollstatus oppdateres
  automatisk ved sletting (allerede live-beregnet, ingen manuell handling)
- Historikkhendelse ("Kontroll slettet av administrator" + ev. årsak)
  bevares på bilen selv om kontrollen selv slettes
- Nytt felt: CreatedByControlId på AktiveSaker (se AIRTABLE_MIGRATION.md)

────────────────────────────

✅ Optimalisering 4 (tidligere planlagt som Fase 10)
Dashboard Pro

Mål:
Én side som viser absolutt alt som krever oppmerksomhet, forstått på under
10 sekunder.

Innhold:
- Ny rekkefølge: Hovedstatus → Morgenvisning → Krever handling nå (med
  "Operativ arbeidsliste", prioritert kritisk → forfalt → oppfølging i dag →
  manglende kontroll) → Kommende verkstedtimer (topp 3) →
  kompakt Bilparkhelse (kun tall og status) → Hurtighandlinger → Biloversikt
- Nye Hurtighandlinger: Registrer kontroll / skade / verksted / Opprett sak
- Fjernet fra Dashboard: gammel 5-korts stat-grid, egen
  Kontrollstatus-fremdriftsbar, "Eldste åpne saker"-panel, kostnadskort
  (Forventede kostnader/Avsettinger), gamle navigasjons-hurtiglenker
  (fortsatt tilgjengelig via hovedmenyen)

────────────────────────────

✅ Optimalisering 5
Operativ Morgenvisning

Mål:
På under 10 sekunder om morgenen vite hva som krever oppmerksomhet i dag.

Innhold:
- Ny, utvidet Morgenvisning rett under Hovedstatus, foran Krever handling nå
- Dagens situasjon: biler klare, mangler kontroll, verksted i dag,
  oppfølging i dag, kritiske saker
- Må gjøres i dag: samme prioriterte topp 5-liste som Krever handling nå,
  med handlingsorientert tekst ("Kontakt verksted — Bil 7")
- Mangler kontroll: liste over biler uten kontroll i dag, trykk åpner
  kontrollregistrering direkte
- Verksted i dag: kun dagens verkstedtimer, skjult hvis ingen
- Kritiske forhold: kun kritiske saker, skjult hvis ingen
- Ny "Dagens status" per bil på Biloversikt-bilkortet
- Viser aldri historiske data — kun det som krever handling i dag
- Oppdateres automatisk (appens vanlige live-rendering)

────────────────────────────

✅ Aktiv Biløkt / Min Bil

Mål:
Knytte daglig drift til bilen, ikke sjåføren — er bilen kontrollert i dag,
skal neste sjåfør slippe å kontrollere den på nytt.

Innhold:
- Ny sjåførflyt: Velg bil (+ navn) → systemet sjekker kontrollstatus →
  ordinært kontrollskjema (uendret) ELLER "Allerede kontrollert i dag" →
  begge leder til Min Bil
- Min Bil: bil, kontrollstatus, aktive saker, neste verksted, bilstatus,
  hurtigregistrering av skade/varsellampe/avvik, kontakt driftskoordinator,
  sjekk ut bil (avslutter kun biløkten, ikke kontrollstatusen)
- Én aktiv biløkt per sjåfør — bilbytte avslutter forrige biløkt automatisk
- Operativt dagskille kl. 04:00 i stedet for midnatt (endrer `todayISO()`
  for hele appen — kontrollstatus, Dashboard, rapporter — ikke et eget
  parallelt system)
- Dashboard: ny "Biler i drift nå"-seksjon (aktive biløkter/tilgjengelige)
- Biloversikt: viser nå aktiv sjåfør og biløktstatus per bil
- To nye felt: AktivSjafor, AktivSjaforSiden på Vehicles
  (se AIRTABLE_MIGRATION.md)

────────────────────────────

✅ Saksbehandling Wizard

Mål:
Behandle en sak fra registrert til lukket i én sammenhengende arbeidsflyt,
uten å navigere mellom flere sider.

Innhold:
- 4-stegs wizard i samme boks i Aktive Saker: Saksinformasjon → Vurder sak →
  Fortsett saken → Fullfør saken, med tydelig fremdriftsindikator
- Fleksibel steg-navigasjon (klikkbare piller), ikke tvungen lineær flyt
- Databasert startsteg ut fra sakens status — lukkede saker åpnes i
  lesemodus (kan gjenåpnes ved behov)
- Steg 3: inline hurtighandlinger — registrer verkstedtime (gjenbruker
  eksisterende verkstedskjema uendret), legg til oppfølging, legg til
  kommentar
- Steg 4: resultat/utført dato/sluttkommentar, kostnad+avsetting kun vist
  når verksted er registrert. Lukking (fortsatt krever alle tre feltene)
  holdt adskilt fra "lagre uten å lukke"
- Status og prioritet fortsatt strengt adskilt — "Lukket" kan aldri velges
  som prioritet, og velges det som status i Steg 2 sendes brukeren til
  Steg 4 for å fullføre lukkingen der
- Dobbeltlagringsvern lagt til (fantes ikke i det tidligere skjemaet)
- Ingen nye Airtable-felt, ingen parallell saksflyt — bygget som en
  presentasjonsomlegging av eksisterende, fungerende funksjonalitet

────────────────────────────

✅ Optimalisering 6
Oversiktmeny

Mål:
Kortere sidemeny, raskere navigasjon, ryddigere struktur, bedre
mobilopplevelse.

Innhold:
- Ny hovedmeny-rekkefølge: Dashboard → Aktive Saker → Rapporter → Analyse →
  Oversikter ▼ → Innstillinger
- "Oversikter ▼" samler Biloversikt (Bilregister), Kontrolloversikt,
  Verkstedoversikt, Skadeoversikt, Varseloversikt, Dekkoversikt og
  Kostnadsoversikt i én undermeny i stedet for syv separate rader
- Undermenyen utvides automatisk når man allerede er på en av sidene i den,
  slik at aktiv side alltid er synlig — tydelig ▼/▲-symbol ellers
- Ren navigasjonsomorganisering: ingen sider fjernet, ingen ruter endret,
  alle hurtigknapper/tilbakeknapper/navigasjonshistorikk uendret

────────────────────────────

✅ Optimalisering 7
Sveip-navigasjon og Mobilflyt

Mål:
Færre trykk, raskere navigasjon, mer naturlig bruk på iPhone, bedre
enhåndsbruk.

Innhold:
- Sveip høyre fra en smal sone helt i venstre skjermkant åpner sidemenyen
  (samme meny som ☰-knappen)
- Sveip høyre andre steder på skjermen beholder den opprinnelige
  "tilbake"-oppførselen på oversiktssider (uendret fra Optimalisering 1)
- Sveip venstre lukker sidemenyen når den er åpen
- Trykk utenfor menyen lukker den (fantes allerede)
- "← Tilbake" lagt til på Bilregister og Innstillinger, som tidligere
  manglet den
- Ren navigasjons- og mobiloptimalisering: ingen nye sider, ingen
  databaseendringer

────────────────────────────

✅ Optimalisering 8
Aktiv Sjåfør Hurtigvalg og Min Bil Hurtigtilgang

Mål:
Færre klikk og mindre scrolling for å finne riktig bil, tydeligere oversikt
over hvem som bruker hvilken bil akkurat nå.

Innhold:
- "⭐ Min bil"-kort på Dashboard når innlogget administrators visningsnavn
  matcher aktiv sjåfør på en bil — ett trykk åpner Kjøretøyprofil
- "Biler i drift nå" utvidet med en liste over aktive bil/sjåfør-par (topp
  5 + lenke til full liste), i tillegg til de eksisterende aggregerte
  tallene
- Nye "Bilgrupper"-hurtigkort på Dashboard: antall biler/aktive/
  tilgjengelige per kategori, trykk åpner Bilregister forhåndsfiltrert på
  gruppen
- Aktiv sjåfør vises nå også på selve Bilregister-siden (tidligere kun på
  Dashboard/Kjøretøyprofil)
- Videreutvikling av eksisterende Aktiv Biløkt/Min Bil — alt beregnes live
  fra `vehicleAktivSjafor()`, ingen nye Airtable-felt, ingen ny
  registreringsflyt

────────────────────────────

✅ Optimalisering 9
Steg 1-sjekkliste (Saksbehandling Wizard)

Mål:
Steg 1 skal gi driftskoordinator nok informasjon til å ta riktig beslutning
på 2-3 sekunder, uten unødvendig scrolling på mobil.

Innhold:
- Bil vist tydelig helt øverst ("Bil 5 – LS97571")
- Komprimert, problem-spesifikk overskrift ("MOTORLAMPE"/"ABS") i stedet
  for generisk automattekst ("Varsellampe registrert")
- Kort, spesifikk beskrivelse i stedet for boilerplate-tekst
- Status og prioritet vist direkte ("Ikke vurdert" inntil Steg 2)
- Andre aktive varsellamper på samme bil vist samlet, ikke skjult
- Metadata (saksnummer, registrert av, dato, kilde, sist oppdatert,
  historikk) flyttet bak "▼ Mer informasjon" (lukket som standard)
- Ingen dobbeltinformasjon, handlingsknappene (Vurder sak/Fortsett saken)
  uendret
- Ren visningsomlegging — ingen nye felt, ingen ny forretningslogikk

────────────────────────────

✅ Optimalisering 10
Wizard UX Cleanup

Mål:
Mest mulig beslutningsinformasjon, minst mulig administrativ informasjon,
mindre scrolling, raskere vurdering av saken.

Innhold:
- Wizarden åpner alltid på Steg 1 (Saksinformasjon) nå, aldri direkte til
  Steg 2/3/4
- Kortheaderen (over wizarden) redusert til én slank linje med eksakt
  problem når saken er åpen — ingen metadata, ingen badges (Steg 1 dekker
  dette allerede lenger nede)
- Fremdriftsindikator flyttet fra toppen til bunnen, redusert til en ren
  prikkerad (✅ grønn/•) — ingen sidetall, ingen tekst
- Fjernet de fire store "1 2 3 4"-stegknappene til fordel for hvert stegs
  egne "← Tilbake"/"Neste →"-knapper
- Fikset layoutfeil der statuschips (spesielt "Ingen oppfølgingsdato")
  kunne flyte utenfor kortets høyrekant på mobil
- Status og prioritet i Steg 1 holdes side ved side selv på smale
  skjermer, for å redusere høyden ytterligere
- Ren visnings-/navigasjonsomlegging — ingen nye felt, ingen ny
  forretningslogikk
