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
