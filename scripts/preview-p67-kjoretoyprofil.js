#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function extractFn(name) {
  const re = new RegExp('function ' + name + '\\(');
  const m = re.exec(html);
  if (!m) throw new Error('missing ' + name);
  const start = html.indexOf('{', m.index);
  let depth = 0;
  for (let j = start; j < html.length; j++) {
    if (html[j] === '{') depth++;
    else if (html[j] === '}') { depth--; if (depth === 0) return html.slice(m.index, j + 1); }
  }
  throw new Error('unbalanced ' + name);
}

const src = [
  extractFn('esc'),
  extractFn('fmt'),
  extractFn('vtVehicle'),
  extractFn('vtErKommende'),
  extractFn('kommendeVerkstedtimer'),
  extractFn('nesteVerkstedtime'),
  extractFn('dashBannerVerkstedHtml'),
  extractFn('kmAvvikHendelseRadHtml'),
  extractFn('nyeKommentarRadHtml')
].join('\n');

const api = new Function(`
  "use strict";
  let verkstedtimer = [];
  let vehicles = [];
  function luc(n){ return '<span class="luc">'+n+'</span>'; }
  function vehicleLabel(v){ return (v.bilnummer||'') + (v.regnr ? ' · ' + v.regnr : ''); }
  ${src}
  return {
    set(d){ vehicles = d.vehicles; verkstedtimer = d.verkstedtimer; },
    vtErKommende, nesteVerkstedtime, dashBannerVerkstedHtml,
    kmAvvikHendelseRadHtml, nyeKommentarRadHtml, fmt
  };
`)();

const vehicles = [
  {id:'v1', bilnummer:'Bil 1', regnr:'ER97228', merke:'Mercedes', modell:'eSprinter', loyvenummer:'117', servicenummer:'240145', km:3395, dekk:'vinter'}
];
const verkstedtimer = [
  {id:'vt1', vehicleId:'v1', dato:'2026-09-21', tidspunkt:'12:00', verksted:'Bekkelund & Knutsen', utfort:false},
  {id:'vt2', vehicleId:'v1', dato:'2020-01-01', tidspunkt:'08:00', verksted:'Gammel', utfort:true}
];
api.set({vehicles, verkstedtimer});

const pastOpen = {id:'vt3', vehicleId:'v1', dato:'2020-01-02', tidspunkt:'07:00', verksted:'Bekkelund & Knutsen', utfort:false};
api.set({vehicles, verkstedtimer: verkstedtimer.concat([pastOpen])});
const nestePast = api.nesteVerkstedtime('v1');
if (!nestePast || nestePast.id !== 'vt3') {
  console.error('expected overdue open appointment as neste, got', nestePast);
  process.exit(1);
}

api.set({vehicles, verkstedtimer});
const vtHtml = api.dashBannerVerkstedHtml('v1');
const kmHtml = api.kmAvvikHendelseRadHtml({
  dato:'2026-09-21', bilTekst:'Bil 1 · ER97228', sjafor:'Ola',
  vKm:61559, kontrollKm:63093, differanse:1534, vehicleId:'v1'
}, true, true);
const komHtml = api.nyeKommentarRadHtml({
  dato:'2026-09-21', bilTekst:'Bil 1 · ER97228', sjafor:'Kari',
  kommentar:'Ekstremt rotete. Gamle lapper ligger igjen.', lest:false, kilde:'fristilt', id:'c1'
}, true, false);

const card = `
<div class="profil-ident">
  <div class="profil-ident-venstre">
    <div>
      <div class="profil-ident-navn">Bil 1 · ER97228 <span class="profil-mob-ikon">🟢 Aktiv</span></div>
      <div class="profil-ident-meta">Mercedes eSprinter</div>
      <div class="profil-ident-meta">Løyve: 117<span class="profil-loyve-skille">│</span>Servicenr: 240145</div>
      <div class="profil-ident-meta">👤 Ahmed · siden 07:12</div>
      <div class="profil-ident-inneni">${vtHtml}</div>
    </div>
  </div>
</div>
<div class="profil-stat5">
  <div><span class="l">Kilometerstand</span><span class="v">3 395 km</span></div>
  <div><span class="l">Sist service</span><span class="v">15.08.2026</span><span class="stat-skille"></span><span class="l">Km igjen til service</span><span class="v">36 605 km igjen</span></div>
  <div><span class="l">Godkjent til</span><span class="v">01.03.2027</span><span class="s">Gyldig</span></div>
  <div><span class="l">Dekk</span><span class="v">🔵 Vinterdekk</span></div>
  <div><span class="l">Løftebord</span><span class="v">🔴 Kontroll mangler</span><span class="s">Sist smurt: Aldri</span><span class="s">🔴 Må gjøres</span></div>
</div>
<div class="hist">${kmHtml}${komHtml}</div>
`;

const page = `<!DOCTYPE html><html lang="no"><head><meta charset="utf-8">
<title>P67 kjøretøyprofil — ekte nesteVerkstedtimeHtml</title>
<style>
body{font-family:system-ui,sans-serif;background:#101614;color:#e8eee9;padding:24px;max-width:920px;margin:0 auto;}
.profil-ident{border:1px solid #2a3a34;border-radius:16px;padding:18px;background:#161e1b;margin-bottom:16px;}
.profil-ident-navn{font-size:22px;font-weight:700;}
.profil-ident-meta{color:#9aa8a1;margin-top:4px;}
.profil-loyve-skille{padding:0 8px;color:#3d4f47;}
.profil-mob-ikon{font-size:12px;margin-left:8px;}
.dash-banner-vt{display:flex;flex-direction:column;gap:2px;margin-top:12px;padding:12px;border:1px solid #3d4f47;border-radius:12px;background:#1b2420;width:100%;box-sizing:border-box;}
.dash-banner-vt-tittel{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9aa8a1;}
.dash-banner-vt-tid,.dash-banner-vt-kl{font-size:16px;font-weight:700;}
.profil-stat5{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid #2a3a34;border-radius:16px;background:#161e1b;margin-bottom:16px;}
.profil-stat5>div{padding:14px;border-right:1px solid #2a3a34;}
.profil-stat5>div:last-child{border-right:none;}
.l{display:block;font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:#9aa8a1;font-weight:700;}
.v{display:block;font-size:16px;font-weight:700;margin-top:4px;}
.s{display:block;font-size:12px;color:#9aa8a1;margin-top:2px;}
.stat-skille{display:block;height:1px;background:#2a3a34;margin:8px 0;}
.hist{border:1px solid #2a3a34;border-radius:16px;padding:16px;background:#161e1b;}
.hint{color:#9aa8a1;font-size:13px;}
@media (max-width:800px){.profil-stat5{grid-template-columns:1fr 1fr;}}
</style></head><body>
<h1>Prioritet 67 — Kjøretøyprofil</h1>
<p class="hint">Neste verkstedtime-HTML kommer fra <code>dashBannerVerkstedHtml()</code> i index.html med en åpen time 21.09.2026 12:00 Bekkelund &amp; Knutsen. En utført 2020-time er filtrert bort. En åpen 2020-time vinner som neste (ikke skjult av passert dato).</p>
${card}
</body></html>`;

const outDir = '/opt/cursor/artifacts';
fs.mkdirSync(outDir, {recursive:true});
fs.writeFileSync(path.join(outDir, 'p67_kjoretoyprofil_preview.html'), page);
fs.writeFileSync(path.join(outDir, 'p67_test.log'), [
  'vtErKommende past+open: ' + api.vtErKommende(pastOpen),
  'neste overdue id: ' + nestePast.id,
  'neste current: ' + api.nesteVerkstedtime('v1').id,
  'banner contains Bekkelund: ' + vtHtml.includes('Bekkelund'),
  'banner contains 12:00: ' + vtHtml.includes('12:00'),
  'km Fra/Til: ' + (kmHtml.includes('Fra:') && kmHtml.includes('Til:')),
  'comments separate: ' + komHtml.includes('Sjåførkommentar')
].join('\n') + '\n');
console.log('Wrote preview and log.');
