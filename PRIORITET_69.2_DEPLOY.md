# PRIORITET 69.2 – Tvungen versjonskontroll for sjåførkontroll

## Oversikt

Sikrer at sjåfører **alltid** kjører siste deployede versjon av Bilpark før de kan registrere kontroller. Appen blokkeres helt inntil versjonsjekk er OK.

## Arkitektur

```
APP_VERSION (version-check.js)
     ↓
Sammenlign med version.json
     ↓
Hvis verdiene avviker:
  → VIS VERSION_MISMATCH
  → BLOKKÉR hele Bilpark
  → Ikke start normal drift
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

### 2. Oppdater begge versjonsverdiene

**Begge verdiene må oppdateres samtidig:**

```json
{
  "version": "80"
}
```

Øk nummeret med 1. Det blir din nye serverversjon.
Sett samme tall i `const APP_VERSION = 80` i `version-check.js`.

### 3. Deploy til produksjon

```bash
git add version-check.js version.json
git commit -m "Bump version to 80"
git push origin main
```

### 4. Hva skjer når sjåfør åpner appen:

1. **Initialisering**: `version-check.js` kjører automatisk
2. **Hent versjon**: Klienten fetcher `version.json` (no-cache)
3. **Sammenlign**:
   - Hvis `APP_VERSION === version.json.version` → ✅ Normal drift
   - Hvis verdiene avviker → ❌ `VERSION_MISMATCH`
4. **Blokkering**: Ved avvik skjules appen, alle knapper deaktiveres og `loadAll()` starter ikke
5. **Oppdatering**: Rett begge verdiene og last inn siden på nytt

## Sikkerhet

### Fail-secure (default: sikker)

```javascript
if (APP_VERSION !== serverVersion) {
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

**Resultat**: Hele Bilpark FORBLIR SPERRET (ikke åpen tilgang)

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
window.APP_VERSION                         // klientnummer
window.VERSION_CHECK.APP_VERSION           // samme klientnummer
```

Du kan bruke disse for å skjule/vise UI-elementer basert på versjonsstatus.

## Sjåførkontroll-blokkering

Når versjonsjekk feiler eller finner `VERSION_MISMATCH`:

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
Versjonsverdiene avviker?
├─ JA: BLOKKÉR appen, vis VERSION_MISMATCH
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
[VERSION_CHECK] Client version: 80 Server version: 80
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
- [ ] `APP_VERSION` og `version.json` har samme verdi
- [ ] Nye og gamle versjoner av koden fungerer (backward compatible)
- [ ] Du har pushet til main branch
- [ ] Du verifiserer at `version.json` er tilgjengelig på serveren

## Feilsøking

### Sjåførkontroll er sperret, men versjonene ser like ut?

1. Åpne browser dev tools (F12)
2. Se `[VERSION_CHECK]` logger
3. Kontroller begge versjonsverdiene:
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

1. Endre `const APP_VERSION = 79` og `"version": "79"` til samme nye verdi
3. Refresh siden (Ctrl+Shift+R for hard refresh)
4. Sjåførkontrollen skal blokkeres
5. Klikk "Oppdater"
6. Appen refresher og kontroll kommer tilbake

## Kontakt

Hvis noe ikke fungerer som forventet, se loggen i browser-konsollen under `[VERSION_CHECK]`.
