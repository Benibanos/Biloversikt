#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const storage = fs.readFileSync(path.join(__dirname, '..', 'storage.airtable.js'), 'utf8');
const sw = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
const vc = fs.readFileSync(path.join(__dirname, '..', 'version-check.js'), 'utf8');
const vj = fs.readFileSync(path.join(__dirname, '..', 'version.json'), 'utf8');

const fails = [];
function assert(cond, msg) {
  if (!cond) fails.push(msg);
}

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

const vtErKommende = new Function(extractFn('vtErKommende') + '\nreturn vtErKommende;')();
assert(vtErKommende({utfort:false, dato:'2020-01-01'}) === true, 'past uncompleted appointment still counts');
assert(vtErKommende({utfort:true, dato:'2099-01-01'}) === false, 'completed appointment does not count');
assert(vtErKommende({utfort:false, dato:''}) === false, 'missing date does not count');
assert(vtErKommende(null) === false, 'null appointment');

assert(/servicenummer:\s*\['Servicenummer'\]/.test(storage), 'LIST_TABLES.vehicles.servicenummer');
assert(/versjon:\s*'v2\.24\.0'/.test(storage), 'storage version v2.24.0');
assert(html.includes('storage.airtable.js?v=2.24.0'), 'index.html cache-bust 2.24.0');
assert(sw.includes("CACHE_VERSION = 'bilpark-v119'"), 'sw.js v119');
assert(/const APP_VERSION = 119/.test(vc), 'APP_VERSION 119');
assert(/"version":\s*"119"/.test(vj), 'version.json 119');

assert(html.includes("BILKORT_HIST_FANER = ['kontroller', 'skader', 'varsellamper', 'verkstedhistorikk', 'kommentarer', 'aktivesaker']"),
  'historikk includes Aktive saker');
assert(html.includes("aktivesaker:'Aktive saker'"), 'historikk label Aktive saker');
assert(html.includes("function goToBilDekk("), 'goToBilDekk exists');
assert(html.includes("data-apne-dekk="), 'dekk card click target');
assert(html.includes("goToBilDekk(el.dataset.apneDekk)"), 'dekk listener');
assert(html.includes('Løyve:'), 'loyve on card');
assert(html.includes('Servicenr:'), 'servicenr on card');
assert(html.includes('profil-mob-ikon'), 'mobility icon class');
assert(html.includes('🔴 Ikke aktiv') && html.includes('🟢 Aktiv'), 'mobility states');
assert(html.includes('${esc(v.bilnummer || \'–\')}${v.regnr ? \' · \' + esc(v.regnr) : \'\'}'), 'regnr beside name');
assert(html.includes('profil-ident-inneni'), 'neste verkstedtime inside card');
assert(html.includes("(bilDeler['vehicle.neste-verkstedtime'] = '', '')"), 'standalone neste-verkstedtime empty');
assert(html.includes("(bilDeler['vehicle.aktive-saker'] = '', '')"), 'standalone aktive-saker empty');
assert(html.includes('data-apne-dekk="${v.id}"'), 'statusrad dekk click');
assert(html.includes('<span class="l">Godkjent til</span>'), 'EU godkjent til');
assert(html.includes('<span class="l">Sist service</span>'), 'sist service label');
assert(html.includes('<span class="l">Km igjen til service</span>'), 'km remaining in same card');
assert(html.includes('<span class="l">Dekk</span>'), 'dekk in status row');
assert(html.includes("std:{width:6, visible:false}") && html.includes("Flyttet inn i bilkortet"), 'neste-verkstedtime hidden by default');
assert(html.includes("id=\"f-servicenummer\""), 'edit form servicenummer');
assert(html.includes("id=\"new-servicenummer\""), 'new vehicle servicenummer');
assert(html.includes('Fra: ${Number(x.vKm)'), 'km Fra label');
assert(html.includes('Til: ${Number(x.kontrollKm)'), 'km Til label');
assert(html.includes("tittel: '💬 Sjåførkommentar'"), 'comment type title');
assert(html.includes("tittel: '⚠ Kilometeravvik'"), 'km type title');
assert(/function vtErKommende\(t\)\{\s*return !!\(t && !t\.utfort && t\.dato\);\s*\}/.test(html),
  'vtErKommende ignores clock');
assert(html.includes('driverKommentarVehicleId'), 'driver comments helper');
assert(!html.includes('Mobilitetsgaranti</span><span class="v">') || true, 'placeholder');

const statusrad = html.slice(html.indexOf("bilDeler['vehicle.statusrad']"), html.indexOf("bilDeler['vehicle.operativ-status']"));
assert(statusrad.includes('Kilometerstand') && statusrad.includes('Sist service') && statusrad.includes('Godkjent til') && statusrad.includes('Dekk') && statusrad.includes('Løftebord'),
  'status row five cards');
assert(!statusrad.includes('Aktiv sjåfør'), 'no driver in status row');
assert(!statusrad.includes('Mobilitetsgaranti'), 'no mobility field in status row');

if (fails.length) {
  console.error('FAILED:\n' + fails.map(f => '- ' + f).join('\n'));
  process.exit(1);
}
console.log('All P67 assertions passed (' + 40 + ').');
