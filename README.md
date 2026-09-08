# Bilpark App
## Operativt Styringssystem for Bring Larvik

---

## Formål

Bilpark App er et operativt styringssystem, ikke et bilregister. Målet er
ikke å lagre informasjon, men å sørge for at riktig informasjon fører til
riktig handling — ingen glemte saker, full sporbarhet, operativ kontroll på
under 10 sekunder.

## Brukere

- **Driftskoordinator** (primærbruker) — bilparkoversikt, aktive saker,
  verkstedoppfølging, bilstatus, rapportering.
- **Sjåfør** — daglig kontroll, registrere varsellamper/skader/avvik, enkel
  arbeidsflate med få klikk.

## Kjernefunksjoner

- Dashboard — svarer på tre spørsmål på under 5 sekunder: hva må gjøres nå,
  hva kommer snart, hvilken bil skal jeg starte med.
- Aktive saker — én samlet sak per kontroll, flere avvikspunkter, full
  livssyklus fra Ny til Lukket.
- Sjåførkontroll — daglig kontroll gruppert etter Driftslag, egen
  sjåfør-URL (`kontroll.html`/`?sjafor=1`) uten innlogging.
- Service — kilometerbasert serviceintervall per bil, service atskilt fra
  ordinære verkstedtimer. Planlagt service har full livssyklus (opprett,
  rediger, marker utført, slett).
- Dekk — dekkoversikt og dekkhistorikk slått sammen på kjøretøyprofilen.
- EU-kontroll — fire varslingsnivåer basert på godkjenningsdato.
- Rapporthub — 12 standardiserte rapporter (kilometerstand, service, dekk,
  EU-kontroll, skade, sak, kostnad, bilpark, verksted, bilhelse, måned,
  kontroll), alle med Excel-eksport.
- Aktiv biløkt — kontrollen tilhører bilen, biløkten tilhører sjåføren,
  automatisk avslutning ved operativt dagskille kl. 04:00.

## Mobil og desktop

Mobil først. Desktop har eget adaptivt sidebar-layout (Design 2.0, se
CLAUDE.md) med Dashboard, Aktive saker, Historikk, Planlegging, Biloversikt,
Rapporter, Analyse og Innstillinger som egne hovedseksjoner. Mobil har
sveipenavigasjon mellom hovedskjermene og rapporttilgang via ☰ Meny.

## Teknologi

- **Frontend:** HTML, CSS og JavaScript i ett samlet dokument (`index.html`)
  — ingen rammeverk, ingen byggsteg. Publiseres på **GitHub Pages**.
- **Database:** Airtable, via direkte REST-API-kall fra nettleseren (ingen
  backend). Se AIRTABLE_MIGRATION.md for fullt skjema.
- **PWA:** `manifest.json` (hovedapp) + `manifest-sjafor.json`
  (sjåfør-snarvei), service worker (`sw.js`) for offline app-shell-caching.

GitHub Pages + Airtable er de eneste plattformene prosjektet bruker. Ingen
Android-app, APK, TWA eller alternativ hosting (Netlify/Vercel) er del av
prosjektet eller planlagt.

## Filoversikt

Prosjektet består av 14 filer:

**Runtime (kreves for at appen skal kjøre):**
- `index.html` — app-shell, all UI og forretningslogikk
- `kontroll.html` — fast inngangsdør for sjåførmodus
- `storage.airtable.js` — autoritativ Airtable-integrasjon
- `airtable-config.js` — Base ID + Personal Access Token (se "Sikkerhet" i
  CLAUDE.md)
- `sw.js` — service worker (offline app-shell-cache)
- `manifest.json` / `manifest-sjafor.json` — PWA-manifester
- `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-512-maskable.png`
  — app-ikoner

Prosjektet inneholder bevisst INGEN filer for andre hostingplattformer
(ingen `vercel.json`, `_headers`/`_redirects` for Netlify, ingen
APK/Android/TWA/Bubblewrap-relatert konfigurasjon som `release-apk.yml`) —
se "Teknologi" over. Git-historikken er backupen dersom noe av dette skulle
bli aktuelt igjen; de holdes ikke som "historikk" i selve prosjektmappen.

**Dokumentasjon:**
- `README.md` — denne filen
- `CLAUDE.md` — kilde til sannhet: produktvisjon, arkitektur, regler,
  utviklings- og testkrav
- `ROADMAP.md` — implementert / delvis implementert / kjente feil / neste
  arbeid
- `AIRTABLE_MIGRATION.md` — full databasemodell

## Installasjon og oppsett

1. Klon repoet.
2. Opprett din egen Airtable-base og Personal Access Token — se
   AIRTABLE_MIGRATION.md for full fremgangsmåte.
3. Fyll inn din egen `baseId` og `token` i `airtable-config.js` (bruk en
   trygg placeholder-versjon uten ekte verdier ved deling av kildekoden).
   **Aldri commit ekte tokens til et offentlig repo** — se "Sikkerhet" i
   CLAUDE.md for risikoen ved denne arkitekturen (ingen backend betyr at
   tokenet ligger åpent i nettleseren).
4. Publiser mappen på GitHub Pages.

## Hvordan appen oppdateres

1. Gjør kodeendringen, øk `?v=`-tallet på `storage.airtable.js`-script-taggen
   i `index.html` OG `versjon`-verdien inne i `storage.airtable.js` samtidig
   (kun nødvendig ved endringer i selve `storage.airtable.js`).
2. Øk `CACHE_VERSION` i `sw.js` hvis `index.html` eller andre filer i
   `APP_SHELL` er endret.
3. Publiser til GitHub Pages.
4. Kjør "Oppdater app" i Systeminnstillinger i appen for å tvinge en frisk
   kopi forbi en eventuell gammel service worker-cache.

## Hvordan riktig storage-versjon kontrolleres

Åpne Innstillinger → Database status. Øverst vises kjørende fil-versjon
(`window.storageAirtableInfo.versjon` fra `storage.airtable.js`)
sammenlignet med versjonen `index.html`/`kontroll.html` sin script-tag
`?v=`-parameter forventer — lest automatisk, ingen egen versjonskonstant å
vedlikeholde (se CLAUDE.md, "Versjonskontroll (permanent løsning)"). Tre
mulige tilstander: 🟢 samsvarer, 🔴 ekte avvik (en gammel, cachet kopi av
`storage.airtable.js` kjører fortsatt — last opp filen på nytt og kjør
"Oppdater app"), eller 🟡 kan ikke bekrefte (fant ingen `?v=`-parameter på
script-taggen).

## Hvordan Database status brukes

Database status (Innstillinger) viser, i rekkefølge: 1) filversjonssjekk (se
over), 2) synkroniseringsstatus (pågående/feilede lagringer, sist
synkronisert), 3) skjemasjekk mot faktisk Airtable-struktur. Se
AIRTABLE_MIGRATION.md for full forklaring.
