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

# Reservebiler

Reservebiler skal ikke skape unødvendige varsler når de står parkert.

Ingen krav om daglig kontroll så lenge bilen ikke er tatt i bruk.

Tas bilen i bruk:

Vanlige regler gjelder resten av dagen.

Ved dagskille:

Bilen går automatisk tilbake til reservestatus.

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

# Service

De fleste servicer utføres grunnet kilometerstand.

Ikke dato.

Systemet varsler derfor før bilen passerer serviceintervallet, basert på
kilometer — ikke etterpå.

Mangler intervall eller siste service, sier systemet det tydelig.

Det gjetter aldri.

---

# Kontrollalder

Ikke kontrollert er ikke én tilstand.

En dag siden er noe annet enn en uke siden.

Systemet viser derfor hvor lenge det faktisk er siden siste kontroll —
grønt, gult eller rødt — slik at driftskoordinator vet hvilke biler som
haster mest.

Dagens kontroll og kontrollalder er to spørsmål.

Systemet holder dem fra hverandre, selv når de vises på én linje.

---

# Kjøretøyprofil

Ikke alt fortjener plass.

Spør alltid: hjelper dette meg å ta en beslutning?

Hvis ikke, hører det hjemme i historikken. Eller ingen steder.

Bilgruppe og biltype er ikke borte. De er bare ikke her lenger.

---

# Historikk

Ett sted. Ikke fem.

Alt som har skjedd med en bil samles på ett sted, og filtreres derfra.

Ikke lagres på nytt hver gang noen bygger en ny side.

Én historikk. Flere filtre.

---

# Velg bil

Seksten biler i én liste er seksten biler for mye å lete gjennom.

Sjåføren kjenner gruppen sin. Bil, lastebil, montering, reserve.

Vis gruppen. Ikke alt på én gang.

Og har du allerede en bil i dag, skal du aldri måtte lete etter den igjen.

---

# Sesongskifte

Seksten biler trenger ikke seksten registreringer.

Velg bilene. Velg dekktypen. Lagre én gang.

Historikken følger med, for hver eneste bil, uten at noen måtte gjøre det
manuelt seksten ganger.

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

Bilparkhelse og biler i drift nå vises i toppfeltet.

Synlig uten scrolling.

Manglende kontroll er ikke kritisk.

Rødt er forbeholdt kritiske saker, ute av drift, og alvorlige varsler.

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
