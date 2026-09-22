#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const kontroll = fs.readFileSync(path.join(root, 'kontroll.html'), 'utf8');
const storage = fs.readFileSync(path.join(root, 'storage.airtable.js'), 'utf8');
const fails = [];
function assert(cond, msg) {
  if (!cond) { fails.push(msg); console.error('FAIL', msg); }
  else console.log('OK ', msg);
}

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

assert(html === kontroll, 'index.html og kontroll.html er identiske');
assert(html.includes("bilkortKontrollGruppeApen = new Set(['denne-uken','forrige-uke'])"), 'Denne uken og Forrige uke er åpne som standard');
assert(html.includes('bilkortKontrollManedApen = new Set()'), 'måneder under Eldre starter lukket');
assert(html.includes("ktHistGruppeHtml('eldre'"), 'Eldre kontroller er egen gruppe');
assert(html.includes('id="kt-hist-full-btn"'), 'lenke til full kontrollhistorikk finnes');
assert(html.includes("screen === 'kontrollhistorikk'"), 'full historikk er egen skjerm');
assert(html.includes('function renderFullKontrollhistorikk'), 'full historikkside rendres');
assert(html.includes('function eksporterFullKontrollhistorikk'), 'Excel-eksport for full historikk');
assert(html.includes('id="kthist-sjafor"') && html.includes('id="kthist-kommentar"'), 'filter for sjåfør og kommentar');
assert(!html.includes('kontroller = []') || html.includes('kontroller.filter'), 'kontrollhistorikk slettes ikke som tom liste i P73-kode');
assert(storage.includes("versjon: 'v2.24.0'") || storage.includes('v2.24.0'), 'storage.airtable.js uendret v2.24.0');

const kmSrc = extractFn('rapportKilometerstandRader') + extractFn('rapportKilometerstandHistorikkRader') + extractFn('renderRapportKilometerstand') + extractFn('eksporterRapportKilometerstand');
assert(kmSrc.includes('vehicleKontroller(vehicleId)'), 'kilometerstandsrapport leser fortsatt vehicleKontroller');
assert(!kmSrc.includes('kontrollHistorikkFordel'), 'kilometerstandsrapport bruker ikke ukegrupperingen');
assert(html.includes("CACHE_VERSION") || true, 'cache bump sjekkes i sw.js separat');

const sandbox = {
  MAANEDER_NB: ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'],
  todayISO(){ return '2026-09-22'; },
  luc(n){ return '[' + n + ']'; },
  esc(s){ return String(s); },
  fmt(d){ return d || ''; },
  bilkortKontrollGruppeApen: new Set(['denne-uken','forrige-uke']),
  bilkortKontrollManedApen: new Set(),
  bilkortHistRadHtml(r){ return '<div class="p38-case" data-hist-rad="' + r.id + '">' + r.tittel + '</div>'; }
};
vm.createContext(sandbox);
['isoDateOffset','isoUkeStart','kontrollHistorikkUkegrenser','kontrollManedTittel','kontrollHistorikkFordel','kontrollHistorikkManedGrupper','ktHistGruppeHtml','ktHistManedHtml','bilkortKontrollGrupperHtml'].forEach(n => {
  vm.runInContext(extractFn(n), sandbox);
});

const g = vm.runInContext("kontrollHistorikkUkegrenser('2026-09-22')", sandbox);
assert(g.denneStart === '2026-09-21' && g.denneSlutt === '2026-09-27', 'denne uken er man–søn 21–27 sep 2026');
assert(g.forrigeStart === '2026-09-14' && g.forrigeSlutt === '2026-09-20', 'forrige uke er 14–20 sep 2026');

const rader = [
  {id:'k:1', dato:'2026-09-22', tittel:'i dag'},
  {id:'k:2', dato:'2026-09-21', tittel:'mandag'},
  {id:'k:3', dato:'2026-09-20', tittel:'søndag forrige'},
  {id:'k:4', dato:'2026-09-14', tittel:'mandag forrige'},
  {id:'k:5', dato:'2026-09-13', tittel:'eldre sep'},
  {id:'k:6', dato:'2026-08-03', tittel:'august'},
  {id:'k:7', dato:'2026-07-01', tittel:'juli'}
];
sandbox.rader = rader;
const fordelt = vm.runInContext('kontrollHistorikkFordel(rader, "2026-09-22")', sandbox);
sandbox.fordelt = fordelt;
assert(fordelt.denne.map(x => x.id).join() === 'k:1,k:2', 'denne uken får 21. og 22.');
assert(fordelt.forrige.map(x => x.id).join() === 'k:3,k:4', 'forrige uke får 14. og 20.');
assert(fordelt.eldre.map(x => x.id).join() === 'k:5,k:6,k:7', 'eldre får 13. sep og tidligere');

assert(vm.runInContext("kontrollManedTittel('2026-09-13')", sandbox) === 'September 2026', 'månedstittel September 2026');
const maneder = vm.runInContext('kontrollHistorikkManedGrupper(fordelt.eldre)', sandbox);
assert(maneder.map(m => m.tittel).join('|') === 'September 2026|August 2026|Juli 2026', 'eldre grupperes nyeste måned først');

const htmlLukket = vm.runInContext('bilkortKontrollGrupperHtml(rader)', sandbox);
assert(htmlLukket.includes('data-kt-hist-gruppe="denne-uken"') && htmlLukket.includes('data-kt-hist-gruppe="forrige-uke"') && htmlLukket.includes('data-kt-hist-gruppe="eldre"'), 'tre grupper rendres');
assert(htmlLukket.includes('data-hist-rad="k:1"') && htmlLukket.includes('data-hist-rad="k:3"'), 'åpne uker viser rader');
assert(!htmlLukket.includes('data-hist-rad="k:6"') && !htmlLukket.includes('August 2026'), 'lukket Eldre renderer ikke månedsrader');
assert(htmlLukket.includes('Åpne full kontrollhistorikk'), 'full historikk-knapp vises på fanen');
assert(htmlLukket.includes('aria-expanded="false"') && htmlLukket.includes('Eldre kontroller'), 'Eldre er lukket som standard');

vm.runInContext("bilkortKontrollGruppeApen.add('eldre')", sandbox);
const htmlApen = vm.runInContext('bilkortKontrollGrupperHtml(rader)', sandbox);
assert(htmlApen.includes('September 2026') && htmlApen.includes('August 2026') && htmlApen.includes('Juli 2026'), 'åpen Eldre viser månedsoverskrifter');
assert(!htmlApen.includes('data-hist-rad="k:6"'), 'lukket måned renderer ikke kontrollrader (ytelse)');
vm.runInContext("bilkortKontrollManedApen.add('2026-08')", sandbox);
const htmlManed = vm.runInContext('bilkortKontrollGrupperHtml(rader)', sandbox);
assert(htmlManed.includes('data-hist-rad="k:6"') && !htmlManed.includes('data-hist-rad="k:7"'), 'kun åpnet måned viser rader');

const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const vc = fs.readFileSync(path.join(root, 'version-check.js'), 'utf8');
const vj = fs.readFileSync(path.join(root, 'version.json'), 'utf8');
assert(sw.includes("CACHE_VERSION = 'bilpark-v120'"), 'sw.js v120');
assert(vc.includes('const APP_VERSION = 120'), 'APP_VERSION 120');
assert(vj.includes('"120"'), 'version.json 120');

if (fails.length) {
  console.error('\nFAILED: ' + fails.length);
  process.exit(1);
}
console.log('\nAll assertions passed.');
