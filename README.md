# Bilpark App
## Operativt Styringssystem for Bring Larvik

---

# Visjon

Bilpark App er ikke et bilregister.

Bilpark App er et operativt styringssystem utviklet for å gi driftskoordinator full kontroll over bilparken til enhver tid.

Målet er ikke å lagre informasjon.

Målet er å sørge for at riktig informasjon fører til riktig handling.

---

# Problemet systemet løser

Driftskoordinator er ansvarlig for:

- 16+ biler
- 40+ ansatte
- Daglige kontroller
- Skader
- Verkstedoppfølging
- Varsellamper
- Dekk
- Avvik
- Historikk
- Oppfølging

Tradisjonelt ligger mye av denne kunnskapen i hodet på én eller få personer.

Det skaper risiko for:

- Glemte saker
- Manglende oppfølging
- Manglende oversikt
- Unødvendig administrasjon

Bilpark App skal eliminere denne risikoen.

---

# Kjernefilosofi

Hvis brukeren må huske noe selv:

Da mangler systemet funksjonalitet.

Systemet skal fortelle brukeren:

- Hva som krever handling
- Hvilke biler som har avvik
- Hvilke biler som mangler kontroll
- Hva som må følges opp
- Hva som er ferdig behandlet

---

# Hovedmål

✅ 100 % dokumenterte kontroller

✅ Full sporbarhet

✅ Ingen glemte saker

✅ Tydelig verkstedoppfølging

✅ Operativ kontroll på under 10 sekunder

✅ Redusere administrasjonstid

---

# Brukere

## Driftskoordinator

Ansvar:

- Bilparkoversikt
- Aktive saker
- Verkstedoppfølging
- Bilstatus
- Oppfølging
- Rapportering

Driftskoordinator er primærbruker.

Alle beslutninger i systemet skal støtte denne rollen først.

---

## Sjåfør

Ansvar:

- Daglig kontroll
- Registrere varsellamper
- Registrere skader
- Registrere avvik

Sjåføren skal ha en enkel arbeidsflate.

Så få klikk som mulig.

---

# Operativ Prioritet

Systemet prioriterer:

1. Drift
2. Kontroll
3. Oppfølging
4. Verksted
5. Historikk
6. Rapportering
7. Kostnader

Kostnader er viktige.

Men drift kommer først.

---

# Daglig Drift

Systemet skal gi svar på:

- Hvilke biler er klare?
- Hvilke biler mangler kontroll?
- Hvilke biler er på verksted?
- Hvilke saker krever handling?
- Hvilke saker er kritiske?
- Hvem bruker bilen akkurat nå?

---

# Aktiv Biløkt

Kontrollen tilhører bilen.

Ikke sjåføren.

Hvis bilen allerede er kontrollert:

Ny kontroll er ikke nødvendig.

Neste sjåfør skal kunne gå direkte til:

Min Bil

Derfra kan sjåføren:

- Registrere skade
- Registrere varsellampe
- Registrere avvik
- Kontakte driftskoordinator
- Sjekke ut bil

Driftskoordinator skal på Dashboard raskt se:

- Hvilke biler som er i drift akkurat nå, og hvem som kjører dem
- Sin egen bil, dersom hun eller han selv er aktiv sjåfør på en bil

---

# Dagskille

Operativt dagskille er:

04:00

Grunn:

Sjåfører kan arbeide til langt etter midnatt.

Klokken 04:00:

- Aktive biløkter avsluttes
- Aktive sjåfører fjernes
- Kontrollstatus nullstilles
- Ny kontroll kreves

---

# Aktive Saker

Ingen registrerte feil skal kunne bli glemt.

Én kontroll med flere avvik gir én samlet sak per bil.

Ikke én sak per avvik.

Sakslivssyklus:

Registrert
↓
Vurderes
↓
Tiltak planlagt
↓
Verksted bestilt
↓
Delvis utført (flere avvik, ikke alle ferdig ennå)
↓
Utført
↓
Lukket

---

# Bilstatus

Hver bil skal til enhver tid ha én tydelig status.

Prioritet:

1. Ute av drift
2. Kritisk
3. Verksted bestilt
4. Under oppfølging
5. Ikke kontrollert
6. Operativ

---

# Dashboard

Dashboardet er systemets kontrollrom.

Brukeren skal forstå bilparken på under 10 sekunder.

Dashboardet skal prioritere:

- Krever handling nå
- Manglende kontroller
- Kritiske biler
- Verkstedaktivitet
- Bilparkhelse

---

# Designprinsipp

Mobil først.

Alle funksjoner skal fungere optimalt på:

- iPhone
- Android

Regler:

- Ingen horisontal scrolling
- Store trykkflater
- Lite støy
- Få klikk

---

# Teknologi

Frontend:

- HTML
- CSS
- JavaScript

Database:

- Airtable

Hosting:

- GitHub Pages

---

# Dokumentasjon

CLAUDE.md

Beskriver hvordan systemet skal fungere.

AIRTABLE_MIGRATION.md

Beskriver databasearkitektur og databaseendringer.

ROADMAP.md

Beskriver implementerte og planlagte funksjoner.

README.md

Beskriver systemets visjon og filosofi.

---

# Sluttregel

Bilpark App er ikke bygget for å registrere problemer.

Bilpark App er bygget for å sørge for at problemer blir oppdaget, fulgt opp og løst.
