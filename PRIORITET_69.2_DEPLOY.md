# PRIORITET 69.2 – Tvungen versjonskontroll for sjåførkontroll

## Oversikt

Sikrer at sjåfører **alltid** kjører siste deployede versjon av Bilpark før de kan registrere kontroller. Appen blokkeres helt inntil versjonsjekk er OK.

## Arkitektur

```
version.json (server)
     ↓
   [SANNHETSKILDE]
     ↓
version-check.js (klient)
     ↓
Sammenlign versioner
     ↓
Hvis serverVersion > clientVersion:
  → BLOKKÉR sjåførkontroll
  → VIS tvungen oppdateringspanel
  → Krev refresh
```

## Filer

| Fil | Formål |
|-----|--------|
| `version.json` | Serverversjon (sannhetskilde) |
| `version-check.js` | Versjonskontroll-logikk |
| `index.html` / `kontroll.html` | Inkluderer `version-check.js` + oppdateringspanel |

## Deploy-prosess

### 1. Du gjør endringer i koden

```bash
git add .
git commit -m "Fix sjåførkontroll bug"
```

### 2. Oppdater version.json

**Dette er det ENESTE du trenger å gjøre manuelt:**

```json
{
  "version": "80"
}
```

Øk nummeret med 1. Det blir din nye serverversjon.

### 3. Deploy til produksjon

```bash
git add version.json
git commit -m "Bump version to 80"
git push origin main
```

### 4. Hva skjer når sjåfør åpner appen:

1. **Initialisering**: `version-check.js` kjører automatisk
2. **Hent versjon**: Klienten fetcher `version.json` (no-cache)
3. **Sammenlign**:
   - Hvis `serverVersion === clientVersion` → ✅ Normal drift
   - Hvis `serverVersion > clientVersion` → ❌ Appen blokkeres
4. **Blokkering**: Hvis appen er gammel:
   - Sjåførkontrollen er SKJULT
   - Alle knapper er DEAKTIVERT
   - Oppdateringspanel vises
5. **Oppdatering**: Sjåfør klikker "Oppdater", browserens cache tømmes, ny kode lastes

## Sikkerhet

### Fail-secure (defaut: sikker)

```javascript
if (serverVersion > clientVersion) {
  // BLOKKÉR ALT
  showUpdatePanel();
  blockAllInteraction(); // Deaktiver alle knapper
}
```

### Hvis versjonsjekk feiler

Hvis `version.json` ikke kan lastes (nettverksfeil, server nede):

```javascript
if (serverVersion === null) {
  // SIKKERHET: Tillat IKKE kontroll
  blockAllInteraction();
  console.error('VERSION CHECK FAILED');
}
```

**Resultat**: Sjåførkontroll FORBLIR SPERRET (ikke åpen tilgang)

## Versjonsnumre

Bruk enkle **heltall** som øker monotont:

```
79 → 80 → 81 → 82 ...
```

**Ikke** bruk:
- ❌ `1.0.0` (semver)
- ❌ `v79` (prefikser)
- ❌ `2026-09-16` (datoer)

Enkle tall er raskere å sammenligne og mindre utsatt for feil.

## Status-flags

`version-check.js` eksponerer disse globalt:

```javascript
window.VERSION_CHECK.versionCheckComplete  // true/false
window.VERSION_CHECK.versionCheckOk        // true/false
window.VERSION_CHECK.APP_VERSION           // nummer
```

Du kan bruke disse for å skjule/vise UI-elementer basert på versjonsstatus.

## Sjåførkontroll-blokkering

Når versjonsjekk feiler eller finner outdated versjon:

1. **HTML-elementer deaktiveres**:
   ```javascript
   document.querySelectorAll('button, input, textarea, select')
     .forEach(el => el.disabled = true)
   ```

2. **Sjåførkontroll-skjema skjules**:
   ```javascript
   document.getElementById('app').style.display = 'none'
   ```

3. **Oppdateringspanel vises**:
   ```javascript
   document.getElementById('version-update-panel').style.display = 'flex'
   ```

## Oppdateringsflyt

```
Sjåfør åpner appen
    ↓
version-check.js kjører
    ↓
Versjonsjekk feiler?
├─ JA: BLOKKÉR appen, vis oppdateringspanel
└─ NEI: Normal drift
    ↓
Sjåfør klikker "Oppdater sjåførkontrollen"
    ↓
VERSION_CHECK.performUpdate():
  1. Oppdater service worker
  2. Tøm ALL cache
  3. Hard refresh (location.reload)
    ↓
Ny kode lastes
    ↓
version-check.js kjører igjen
    ↓
Versjonsjekk OK
    ↓
Sjåførkontroll aktiveres
```

## Logger i browser-konsollen

Se `[VERSION_CHECK]` prefiksen for diagnostikk:

```
[VERSION_CHECK] Initializing version check...
[VERSION_CHECK] Server version loaded: 80
[VERSION_CHECK] ✓ Version check OK
[VERSION_CHECK] Version check OK. Application READY
```

Hvis det feiler:

```
[VERSION_CHECK] CRITICAL: Could not fetch version.json from server!
[VERSION_CHECK] Sjåførkontroll remains BLOCKED for security
```

## Checklist før deploy

- [ ] Endringer er committed og testet lokalt
- [ ] `version.json` er oppdatert (øk nummeret med 1)
- [ ] Nye og gamle versjoner av koden fungerer (backward compatible)
- [ ] Du har pushet til main branch
- [ ] Du verifiserer at `version.json` er tilgjengelig på serveren

## Feilsøking

### Sjåførkontroll er sperret, men versjonene ser like ut?

1. Åpne browser dev tools (F12)
2. Se `[VERSION_CHECK]` logger
3. Kontroller `version.json`:
   ```bash
   curl https://ditt-domene.no/version.json
   ```

### Service worker cacher gammel kode?

Klienten gjør hard refresh:
```javascript
window.location.href = window.location.href.split('?')[0] + '?_v=' + Date.now()
```

Dette sikrer at **alle** ressurser lastes på nytt fra serveren.

### Hvordan teste versjonskontroll lokalt?

1. Åpne `version.json` i teksteditoren
2. Endre `"version": "79"` til `"version": "80"`
3. Refresh siden (Ctrl+Shift+R for hard refresh)
4. Sjåførkontrollen skal blokkeres
5. Klikk "Oppdater"
6. Appen refresher og kontroll kommer tilbake

## Kontakt

Hvis noe ikke fungerer som forventet, se loggen i browser-konsollen under `[VERSION_CHECK]`.
