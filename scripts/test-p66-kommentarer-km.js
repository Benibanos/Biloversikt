#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function extractFn(name) {
  const re = new RegExp('function ' + name + '\\(');
  const m = re.exec(html);
  if (!m) throw new Error('missing function ' + name);
  let i = m.index;
  const start = html.indexOf('{', i);
  let depth = 0;
  for (let j = start; j < html.length; j++) {
    const ch = html[j];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return html.slice(i, j + 1);
    }
  }
  throw new Error('unbalanced ' + name);
}
function extractConst(name) {
  const re = new RegExp('const ' + name + " = ([^;]+);");
  const m = re.exec(html);
  if (!m) throw new Error('missing const ' + name);
  return m[0];
}

const src = [
  extractConst('KM_HOPP_GRENSE'),
  extractConst('KM_AVVIK_PREFIX'),
  extractFn('esc'),
  extractFn('fmt'),
  extractFn('vehicleLabel'),
  extractFn('kmVerdiEllerNull'),
  extractFn('kontrollKmGulv'),
  extractFn('kontrollLinjeErKmAvvik'),
  extractFn('kontrollSjaforKommentarTekst'),
  extractFn('kontrollKmAvvikTekst'),
  extractFn('kontrollHarKmAvvik'),
  extractFn('kmAvvikForVehicle'),
  extractFn('nyeKommentarerListe'),
  extractFn('kmAvvikHendelserListe'),
  extractFn('driverKommentarVehicleId'),
  extractFn('nyeKommentarRadHtml'),
  extractFn('kmAvvikHendelseRadHtml'),
].join('\n');

const ctx = {
  vehicles: [],
  kontroller: [],
  kommentarer: [],
  driverActiveVehicleId: '',
};
const fn = new Function(
  'vehiclesRef',
  `"use strict";
   let vehicles = vehiclesRef.vehicles;
   let kontroller = vehiclesRef.kontroller;
   let kommentarer = vehiclesRef.kommentarer;
   let driverActiveVehicleId = vehiclesRef.driverActiveVehicleId;
   ${src}
   return {
     set(data){
       vehicles = data.vehicles; vehiclesRef.vehicles = vehicles;
       kontroller = data.kontroller; vehiclesRef.kontroller = kontroller;
       kommentarer = data.kommentarer || []; vehiclesRef.kommentarer = kommentarer;
       if('driverActiveVehicleId' in data){
         driverActiveVehicleId = data.driverActiveVehicleId;
         vehiclesRef.driverActiveVehicleId = driverActiveVehicleId;
       }
     },
     kontrollSjaforKommentarTekst, kontrollKmAvvikTekst, kontrollHarKmAvvik,
     nyeKommentarerListe, kmAvvikHendelserListe, driverKommentarVehicleId,
     nyeKommentarRadHtml, kmAvvikHendelseRadHtml, kmAvvikForVehicle,
     KM_AVVIK_PREFIX, KM_HOPP_GRENSE
   };`
);
const api = fn(ctx);

const prefix = api.KM_AVVIK_PREFIX;
const mixed = prefix + ' +5000 km siden forrige registrering (fra 31 000 km til 36 000 km — bekreftet av Ola).\nVenstre speil hakker i svinger.';
const kmOnly = prefix + ' +1200 km ...';
const commentOnly = 'Bremser piper ved bakkestart.';

const v4 = {id:'bil4', bilnummer:'Bil 4', regnr:'EL12345', km:31000};
const v7 = {id:'bil7', bilnummer:'Bil 7', regnr:'EL99999', km:80000};
const kMixed = {id:'k1', vehicleId:'bil4', dato:'2026-09-21', tidspunkt:'07:12', sjafor:'Ola', km:36000, kommentar: mixed, kommentarLest:false};
const kKmOnly = {id:'k2', vehicleId:'bil4', dato:'2026-09-21', tidspunkt:'08:00', sjafor:'Ola', km:37200, kommentar: kmOnly, kommentarLest:false};
const kComment = {id:'k3', vehicleId:'bil4', dato:'2026-09-20', tidspunkt:'16:00', sjafor:'Kari', km:30900, kommentar: commentOnly, kommentarLest:false};
const kOtherCar = {id:'k4', vehicleId:'bil7', dato:'2026-09-21', tidspunkt:'09:00', sjafor:'Per', km:81000, kommentar: 'Annen bil: oljelekasje', kommentarLest:false};
const kHist = {id:'k5', vehicleId:'bil4', dato:'2026-08-01', tidspunkt:'10:00', sjafor:'Kari', km:28000, kommentar: 'Historisk merknad om dekk.', kommentarLest:true};
const stand = {id:'f1', vehicleId:'bil4', dato:'2026-09-19', tidspunkt:'11:00', sjafor:'Ola', tekst:'Fristilt: ryggekamera', lest:false};
const standOther = {id:'f2', vehicleId:'bil7', dato:'2026-09-19', tidspunkt:'12:00', sjafor:'Per', tekst:'Fristilt annen bil', lest:false};

api.set({
  vehicles: [v4, v7],
  kontroller: [kMixed, kKmOnly, kComment, kOtherCar, kHist],
  kommentarer: [stand, standOther],
  driverActiveVehicleId: 'bil4'
});

const fails = [];
function assert(cond, msg) {
  if (!cond) fails.push(msg);
  else console.log('OK  ' + msg);
}

assert(api.kontrollSjaforKommentarTekst(kMixed) === 'Venstre speil hakker i svinger.',
  'AC3 mixed string: driver comment without km prefix');
assert(api.kontrollKmAvvikTekst(kMixed).startsWith(prefix),
  'mixed string still has km line for history');
assert(api.kontrollSjaforKommentarTekst(kKmOnly) === '',
  'km-only control is not a driver comment');
assert(api.kontrollSjaforKommentarTekst(kComment) === commentOnly,
  'plain comment unchanged');
assert(api.kontrollSjaforKommentarTekst(kHist) === 'Historisk merknad om dekk.',
  'AC6 historical comments retained');

const adminAll = api.nyeKommentarerListe();
assert(adminAll.every(r => r.type === 'kommentar'), 'AC2 comment list type=kommentar');
assert(adminAll.every(r => !r.kommentar.includes(prefix) && !r.kommentar.includes('Kontroller km')),
  'AC3 comments never include km prefix');
const ids = adminAll.map(r => r.id).sort().join(',');
assert(ids === 'f1,f2,k1,k3,k4,k5', 'AC5 admin sees all cars (kontroll+fristilt, not km-only k2)');
assert(adminAll.find(r => r.id === 'k1').kommentar === 'Venstre speil hakker i svinger.',
  'mixed control contributes only driver text');

const adminBil4 = api.nyeKommentarerListe('bil4');
assert(adminBil4.every(r => r.vehicleId === 'bil4'), 'admin vehicle filter: only Bil 4');
assert(!adminBil4.some(r => r.id === 'k4' || r.id === 'f2'), 'admin filter excludes Bil 7');

const driverId = api.driverKommentarVehicleId();
assert(driverId === 'bil4', 'driver filter uses active vehicle');
const driverListe = api.nyeKommentarerListe(driverId);
assert(driverListe.every(r => r.vehicleId === 'bil4'), 'AC4 driver only active car');
assert(!driverListe.some(r => r.id === 'k4' || r.id === 'f2'), 'AC4 no fleet comments');
assert(driverListe.some(r => r.id === 'k1') && driverListe.some(r => r.id === 'k3') && driverListe.some(r => r.id === 'k5') && driverListe.some(r => r.id === 'f1'),
  'driver still sees all Bil 4 comments including history');

api.set({vehicles:[v4,v7], kontroller:[kMixed,kKmOnly,kComment,kOtherCar,kHist], kommentarer:[stand,standOther], driverActiveVehicleId:''});
assert(api.driverKommentarVehicleId() === '', 'no active vehicle → empty id (never unfiltered)');

api.set({vehicles:[v4,v7], kontroller:[kMixed,kKmOnly,kComment,kOtherCar,kHist], kommentarer:[stand,standOther], driverActiveVehicleId:'bil4'});
const kmListe = api.kmAvvikHendelserListe();
assert(kmListe.length === 2 && kmListe.every(x => x.type === 'km'), 'AC1 km is own event type');
const kmBil4 = kmListe.find(x => x.vehicleId === 'bil4');
assert(kmBil4 && kmBil4.vKm === 31000 && kmBil4.kontrollKm === 37200 && kmBil4.differanse === 6200,
  'AC1 shows previous, new, difference (highest control vs v.km)');
const kmHtml = api.kmAvvikHendelseRadHtml(kmBil4, true, true);
assert(kmHtml.includes('⚠ Kilometeravvik'), 'km title');
assert(kmHtml.includes('Fra:'), 'previous km label');
assert(kmHtml.includes('Til:'), 'new km label');
assert(kmHtml.includes('Differanse'), 'difference label');
assert(kmHtml.includes('Godkjenn'), 'approve button');
assert(!kmHtml.includes('Venstre speil') && !kmHtml.includes('Bremser piper') && !kmHtml.includes('Fristilt'),
  'AC3 km event does not mix driver comments');

const komHtml = api.nyeKommentarRadHtml(adminAll.find(r => r.id === 'k1'), true, true);
assert(komHtml.includes('💬 Sjåførkommentar'), 'comment title');
assert(komHtml.includes('Venstre speil hakker i svinger.'), 'comment body only');
assert(!komHtml.includes('Fra:') && !komHtml.includes('Godkjenn') && !komHtml.includes(prefix),
  'comment event has no km fields');

const outDir = '/opt/cursor/artifacts';
fs.mkdirSync(outDir, {recursive:true});
const page = `<!DOCTYPE html><html lang="no"><head><meta charset="utf-8"><title>P66 Kommentarer vs km</title>
<style>
body{font-family:system-ui,sans-serif;background:#101614;color:#e8eee9;margin:0;padding:24px;}
h1,h2{font-size:18px;margin:0 0 8px;}
.hint{color:#9aa89d;font-size:13px;margin-bottom:16px;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.panel{background:#161c19;border:1px solid #2a3530;border-radius:14px;padding:16px;}
.btn{background:#19A66B;color:#082016;border:0;border-radius:8px;padding:6px 10px;font-weight:700;}
.btn.danger-outline{background:transparent;color:#f87171;border:1px solid #f87171;}
.btn.secondary{background:#24302b;color:#e8eee9;}
.empty-note{color:#9aa89d;font-size:13px;}
@media (max-width:800px){.grid{grid-template-columns:1fr;}}
</style></head><body>
<h1>Prioritet 66 — separate hendelser</h1>
<p class="hint">Rendret med de ekte funksjonene fra index.html (nyeKommentarRadHtml / kmAvvikHendelseRadHtml / nyeKommentarerListe).</p>
<div class="grid">
  <div class="panel">
    <h2>Sjåfør · Mer → Kommentarer · aktiv Bil 4</h2>
    <p class="hint">Kun kommentarer for Bil 4. Ingen kilometeravvik blandet inn.</p>
    ${driverListe.map((k,i)=>api.nyeKommentarRadHtml(k,i===0,false)).join('')}
  </div>
  <div class="panel">
    <h2>Administrator · Kommentarer · Alle biler</h2>
    <p class="hint">Kilometeravvik eget panel. Sjåførkommentarer eget panel. Filter kan velge én bil.</p>
    <h2>⚠ Kilometeravvik (${kmListe.length})</h2>
    ${kmListe.map((x,i)=>api.kmAvvikHendelseRadHtml(x,i===0,true)).join('')}
    <h2 style="margin-top:20px">💬 Sjåførkommentar (${adminAll.length})</h2>
    ${adminAll.map((k,i)=>api.nyeKommentarRadHtml(k,i===0,true)).join('')}
  </div>
</div>
</body></html>`;
fs.writeFileSync(path.join(outDir, 'p66_kommentarer_km_preview.html'), page);

if (fails.length) {
  console.error('\nFAILED:\n' + fails.map(f => '- ' + f).join('\n'));
  process.exit(1);
}
console.log('\nAll assertions passed (' + (9 + fails.length) + ' groups).');
console.log('Preview: /opt/cursor/artifacts/p66_kommentarer_km_preview.html');
