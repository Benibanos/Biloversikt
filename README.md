# Kjøretøyoversikt v2.0

Full omskriving etter ny spesifikasjon: ny hovedmeny (Dashboard, Verkstedtimer,
Skader, Innstillinger — Bilregister ligger som egen knapp i headeren), utvidet
bilkort (bilnummer, merke, modell, årsmodell, kategori, dekk, kilometerstand,
bilbilder), en egen Skader-side med filtrering, og et Verkstedregister under
Innstillinger. All import (Excel/CSV/flåtedata) er fjernet — alt registreres
direkte i appen.

## Filer
Samme struktur og fremgangsmåte for bygging/publisering/installasjon som
tidligere PWA-pakke:
- `index.html` — selve appen (v2.0)
- `manifest.json`, `sw.js`, `storage.local.js` — uendret fra forrige pakke
- `storage.firebase.js` — valgfri oppgradering for ekte deling mellom kolleger
- `icons/` — samme ikonsett som før

Se tidligere leverte README for full bygg/publiser/installer-veiledning
(Netlify Drop, Android/iPhone/Windows-installasjon) — den gjelder uendret for
denne versjonen.

## Nytt i v2.0 (datamodell)
- **Bil**: bilnummer, regnr, merke, modell, årsmodell, kategori (Bil 1–11 /
  Lastebil / Monteringsbil), status, dekk (sommer/vinter/helårs),
  kilometerstand, bilbilde
- **Skade**: nå en egen toppnivå-seksjon (ikke bare per bil) med bil, dato,
  beskrivelse, alvorlighetsgrad (lav/middels/høy), kommentar, bilde, status
  (registrert/under oppfølging/utbedret)
- **Verkstedtime**: verksted velges nå fra en dropdown (Verkstedregister)
  fremfor fritekst
- **Verkstedregister**: ny liste over verksteder, administreres under
  Innstillinger, forhåndsutfylt med Møller Bil, Bertel O. Steen, Mobile,
  Frydenbø, Ford-forhandler og Toyota-forhandler — flere kan legges til når
  som helst

## Fjernet
- «Importer flåtedata»-knappen og all tilhørende importkode
- All gammel «rute»-fritekst — erstattet av strukturerte felt (bilnummer +
  kategori)

## Testing gjort her
- JS-syntakssjekk av hele appen
- HTML-strukturvalidering
- Et fullstendig simulert kjøretidstest (mock lagring + DOM) som oppretter en
  bil, en skade og en verkstedtime, og rendrer alle seks skjermer uten feil
