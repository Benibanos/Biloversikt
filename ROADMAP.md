# \# ROADMAP.md — Bilpark Operativsystem

# 

# Sist oppdatert: 2026-09-11

# 

# Formålet med denne filen er å vise dagens status, kjente feil og neste prioriterte arbeid.

# 

# Historiske leveranser, analyser, tester og rotårsaker ligger i CHANGELOG.md.

# 

# Statuser:

# 

# ✅ Ferdig

# 🟡 Pågår

# 🔧 Feil eller teknisk gjeld

# 📋 Planlagt

# 

# \---

# 

# \# Ferdig

# 

# \## Operativ kjerne

# 

# ✅ Aktive saker

# 

# \- Forenklet saksflyt:

# &#x20; - Aktiv sak

# &#x20; - Under oppfølging

# &#x20; - Planlagt verksted

# &#x20; - Utført

# &#x20; - Avslått

# \- Godta / Avslå direkte fra sakskort

# \- Utførte saker flyttes til historikk

# \- Saker kan kobles til verkstedtimer

# \- Sakskort viser varsellamper og kontrollavvik direkte

# 

# ✅ Automatisk saksgenerering

# 

# \- Varsellamper

# \- Kontrollavvik

# \- Skader

# 

# oppretter saker automatisk når forholdet krever oppfølging.

# 

# \---

# 

# \## Operativ kontroll

# 

# ✅ Dashboard

# 

# Fokus på:

# 

# \- Hva må gjøres nå

# \- Hva kommer snart

# \- Hvilke biler krever oppfølging

# \- Service og EU-frister

# 

# ✅ Aktiv sjåfør

# 

# \- Aktiv sjåfør følger bilen

# \- Biløkt håndteres automatisk

# \- Dagskille kl. 04:00

# 

# ✅ Sjåførkontroll

# 

# \- Mobiltilpasset kontroll

# \- Bilvalg gruppert etter driftslag

# \- Skade

# \- Varsellamper

# \- Kontrollavvik

# \- Kommentarer

# 

# \---

# 

# \## Service og vedlikehold

# 

# ✅ Service

# 

# \- Kjøretøyspesifikke serviceintervaller

# \- Planlagt service

# \- Servicehistorikk

# 

# ✅ EU-kontroll

# 

# \- Varslingsnivåer

# \- Planlegging

# \- Historikk

# 

# ✅ Verksted

# 

# \- Verkstedtimer

# \- Kobling mot saker

# \- Strukturert håndtering av EU-kontroll

# \- Strukturert håndtering av ruteskift

# 

# ✅ Dekk

# 

# \- Dekkoversikt

# \- Dekkhistorikk

# 

# \---

# 

# \## Historikk og rapporter

# 

# ✅ Historikk

# 

# \- Kontrollhistorikk

# \- Servicehistorikk

# \- Verkstedhistorikk

# \- Skadehistorikk

# \- Sakshistorikk

# 

# ✅ Rapporthub

# 

# \- Kilometerstand

# \- Service

# \- Dekk

# \- EU-kontroll

# \- Skader

# \- Saker

# \- Kostnader

# \- Verksted

# \- Bilhelse

# \- Kontroll

# 

# Excel-eksport støttes.

# 

# \---

# 

# \## Administrasjon

# 

# ✅ Bilkategorier

# 

# \- Redigerbare kategorier

# \- Systemstyrt "Ute av drift"

# 

# ✅ Layout Editor

# 

# \- Desktop Dashboard

# \- Mobil Dashboard

# \- Min Bil

# 

# ✅ Ringeliste

# 

# ✅ Informasjonsveileder

# 

# ✅ Kommentaroversikt

# 

# \---

# 

# \# Pågår

# 

# \## Operativ forenkling

# 

# 🟡 Reduksjon av visuell støy

# 

# Mål:

# 

# \- Færre skjermbilder

# \- Færre duplikate visninger

# \- Tydeligere sammenheng mellom:

# &#x20; - saker

# &#x20; - service

# &#x20; - verksted

# &#x20; - kalender

# 

# \---

# 

# \## Aktive saker 2.0

# 

# 🟡 Ny designretning

# 

# Referanse:

# 

# \- Mørk

# \- Kortbasert

# \- Statusdrevet

# \- Minimal støy

# 

# Denne designretningen skal gradvis brukes på resten av appen.

# 

# \---

# 

# \# Kjente feil og teknisk gjeld

# 

# 🔧 PWA-installasjon

# 

# Rotårsak identifisert.

# 

# Mangler:

# 

# \- icon-192.png

# \- icon-512.png

# \- icon-512-maskable.png

# 

# i publisert icons/-mappe.

# 

# PWA kan ikke regnes som fullstendig ferdigstilt før dette er verifisert.

# 

# \---

# 

# 🔧 Historiske kilometerdata

# 

# Historiske data kan inneholde kilometerverdier påvirket av en tidligere, nå rettet servicefeil.

# 

# Automatisk korrigering er ikke utført.

# 

# \---

# 

# 🔧 Settings-blokker

# 

# Flere datasett lagres fortsatt som JSON-blokker i Settings.

# 

# Fungerer i dag, men bør overvåkes ved videre vekst.

# 

# \---

# 

# \# Neste prioriterte arbeid

# 

# \## Må ha

# 

# 📋 Full utrulling av nytt operativt designsystem

# 

# Følg referansen fra Aktive saker på:

# 

# \- Dashboard

# \- Kjøretøyprofil

# \- Kalender

# \- Service

# \- Verksted

# 

# \---

# 

# 📋 Sprekk i frontrute

# 

# Vurderes som egen registreringstype i sjåførkontrollen.

# 

# Må kartlegges mot:

# 

# \- eksisterende saksmotor

# \- eksisterende skadeflyt

# \- eksisterende rapportering

# 

# før implementering.

# 

# \---

# 

# 📋 Verifisere PWA-installasjon

# 

# \- Last opp manglende ikoner

# \- Verifiser på ny enhet

# \- Bekreft installasjon

# 

# \---

# 

# \## Bør ha

# 

# 📋 Ytterligere opprydding i navigasjon

# 

# Kartlegg:

# 

# \- duplikate visninger

# \- overlapp mellom Kalender og Planlegging

# \- overlapp mellom Historikk og Rapporter

# 

# \---

# 

# 📋 Gjennomgang av Kjøretøyprofil

# 

# Mål:

# 

# \- redusere støy

# \- tydeligere fokus på nåværende status

# 

# \---

# 

# \## Senere

# 

# 📋 Analyseforbedringer

# 

# Kun funksjoner som støtter konkrete operative beslutninger skal bygges.

# 

# Analyse skal ikke prioriteres foran:

# 

# \- saker

# \- service

# \- EU-kontroll

# \- verksted

# 

# \---

# 

# \# Dokumentstruktur

# 

# README.md

# = hva Bilpark er

# 

# CLAUDE.md

# = regler og arkitektur

# 

# ROADMAP.md

# = status og neste arbeid

# 

# CHANGELOG.md

# = historiske leveranser

# 

# AIRTABLE\_MIGRATION.md

# = datamodell

