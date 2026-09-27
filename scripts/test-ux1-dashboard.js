#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const app = path.join(__dirname, '..', 'App');
const html = fs.readFileSync(path.join(app, 'index.html'), 'utf8');
const kontroll = fs.readFileSync(path.join(app, 'kontroll.html'), 'utf8');
const storage = fs.readFileSync(path.join(app, 'storage.airtable.js'), 'utf8');
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
assert(html.includes('function ux1KontrollsentralHtml'), 'kontrollsentralen finnes');
assert(html.includes('function renderDashboard') && html.includes('${ux1KontrollsentralHtml()}'), 'forsiden tegner kontrollsentralen');
assert(!/function renderDashboard\(\)\{[\s\S]{0,800}layoutGridHtml\(/.test(html), 'renderDashboard leser ikke layout-rutenettet');
assert(html.includes("ux1Sek('ux1-varsler'") && html.includes("ux1Sek('ux1-verksted'") && html.includes("ux1Sek('ux1-saker'") && html.includes("ux1Sek('ux1-biler'"), 'de fire navngitte seksjonene finnes');
assert(html.includes('Operativ status') && html.includes('Krever handling') && html.includes('Kommende verksted') && html.includes('Aktive saker') && html.includes('Kjøretøystatus') && html.includes('Siste aktivitet'), 'seksjonstitlene er med');
assert(html.includes('biler i drift') && html.includes('reservebiler'), 'heroen viser drift og reserve');
const hero = extractFn('dashWidgetFlatehelseHtml');
assert(!hero.includes('Kan ikke brukes') && !hero.includes(' / ${flateN}'), 'utfasing og brøk av hele flåten er ute av heroen');
const sentral = extractFn('ux1KontrollsentralHtml');
assert(!sentral.includes('dashBestillSekHtml') && !sentral.includes('fmtKr') && !sentral.includes('Hurtigoversikt'), 'forsiden har ikke bestilling, kostnad eller hurtigoversikt');
assert(sentral.includes('ux1KritiskeVarsler(3)') && sentral.includes('ux1Saker(5)'), 'maks 3 varsler og 5 saker');
assert(storage.includes('v2.26.1'), 'storage.airtable.js er fortsatt v2.26.1');
assert(!/function flatehelse\(\)\{[\s\S]{0,40}ux1/.test(html), 'flatehelse() er ikke byttet ut');
assert(html.includes('dashboard(){ return this.aktive().filter(x => this.tellerIDashboard(x)); }'), 'AlertEngine.dashboard er uendret');

const sandbox = {
  vehicles: [
    {id:'v1', bilnummer:'Bil 1', regnr:'AA1', driftsstatus:'aktiv'},
    {id:'v2', bilnummer:'Bil 2', regnr:'AA2', driftsstatus:'kan-ikke-brukes'}
  ],
  aktiveSaker: [
    {id:'s-lav', status:'ny', caseType:'annet', reportedAt:'2026-09-20', alvorlighet:'lav', nextAction:'Ignorer'},
    {id:'s-lukket', status:'lukket', caseType:'skade', reportedAt:'2026-09-27', alvorlighet:'kritisk', nextAction:'Ferdig'},
    {id:'s-m', status:'ny', caseType:'dekk', reportedAt:'2026-09-22', alvorlighet:'middels', nextAction:'Bestill dekk'},
    {id:'s-h', status:'ny', caseType:'service', reportedAt:'2026-09-21', alvorlighet:'hoy', nextAction:'Ring verksted'},
    {id:'s-k', status:'ny', caseType:'skade', reportedAt:'2026-09-19', alvorlighet:'kritisk', nextAction:'Stopp bilen'},
    {id:'s-k2', status:'under-oppfolging', caseType:'skade', reportedAt:'2026-09-26', alvorlighet:'kritisk', nextAction:'Hent bil'}
  ],
  timer: [
    {id:'forfalt', dato:'2026-09-20', vehicleId:'v1'},
    {id:'idag', dato:'2026-09-23', vehicleId:'v1'},
    {id:'uke', dato:'2026-09-25', vehicleId:'v2'},
    {id:'senere', dato:'2026-10-02', vehicleId:'v1'},
    {id:'utfort', dato:'2026-09-23', vehicleId:'v1', status:'utfort'}
  ],
  hendelser: [
    {type:'kontroll', tekst:'Kontroll registrert', dato:'2026-09-23', vehicleId:'v1'},
    {type:'skade', tekst:'Skade registrert: ripe', dato:'2026-09-22', vehicleId:'v2'},
    {type:'skade', tekst:'Estimert skadekostnad registrert', dato:'2026-09-22', vehicleId:'v2'},
    {type:'sak', tekst:'Sak opprettet: brems', dato:'2026-09-21', vehicleId:'v1'},
    {type:'sak', tekst:'Sak lukket: brems', dato:'2026-09-21', vehicleId:'v1'},
    {type:'verksted', tekst:'Verkstedtime: service', dato:'2026-09-20', vehicleId:'v1'},
    {type:'kostnad', tekst:'Verkstedkostnad registrert', dato:'2026-09-20', vehicleId:'v1'}
  ],
  todayISO(){ return '2026-09-23'; },
  isoDateOffset(iso, d){
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    const dt = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + d));
    return dt.toISOString().slice(0, 10);
  },
  kommendeVerkstedtimer(){ return sandbox.timer.filter(t => t.status !== 'utfort'); },
  vtStatus(t){
    if (t.status === 'utfort') return 'utfort';
    if (t.dato < sandbox.todayISO()) return 'forfalt';
    return 'planlagt';
  },
  sakErApen(s){ return s.status !== 'lukket' && s.status !== 'utfort' && s.status !== 'avslatt'; },
  sakAlvorlighet(s){ return s.alvorlighet; },
  alvorlighetRang(k){ return {kritisk:0, hoy:1, middels:2, lav:3}[k]; },
  flateHistorikkTidslinje(){ return sandbox.hendelser; },
  AlertEngine: { dashboard(){ return [{id:'a1', alvorlighet:'kritisk'}, {id:'a2', alvorlighet:'hoy'}, {id:'a3', alvorlighet:'hoy'}, {id:'a4', alvorlighet:'hoy'}]; } }
};
vm.createContext(sandbox);
sandbox.flatehelseGruppe = function(v){ return v.gruppe; };
['ux1UkeSlutt', 'ux1VerkstedGrupper', 'ux1Saker', 'ux1KritiskeVarsler', 'ux1AktivitetListe', 'ux1Kjoretoy', 'ux1KjoretoyStatus'].forEach(n => {
  vm.runInContext(extractFn(n), sandbox);
});
const g = vm.runInContext('ux1VerkstedGrupper()', sandbox);
assert(g.forfalt.map(t => t.id).join() === 'forfalt', 'forfalt verksted er egen gruppe');
assert(g.iDag.map(t => t.id).join() === 'idag', 'dagens verksted er egen gruppe');
assert(g.uke.map(t => t.id).join() === 'uke', 'denne uka tar ikke med senere timer');
assert(g.iDag.concat(g.uke, g.forfalt).every(t => t.id !== 'senere' && t.id !== 'utfort'), 'utført og senere timer er ute');
const saker = vm.runInContext('ux1Saker(5).map(s => s.id)', sandbox);
assert(JSON.stringify(saker) === JSON.stringify(['s-k2', 's-k', 's-h', 's-m']), 'saker sorteres kritisk, høy, middels og hopper over lav og lukket');
const varsler = vm.runInContext('ux1KritiskeVarsler(3).map(x => x.id)', sandbox);
assert(JSON.stringify(varsler) === JSON.stringify(['a1', 'a2', 'a3']), 'maks tre varsler fra AlertEngine.dashboard');
const feed = vm.runInContext('ux1AktivitetListe(8).map(h => h.type + ":" + h.tekst)', sandbox);
assert(feed.length === 4, 'feeden har kontroll, skade, sak opprettet og verksted');
assert(!feed.some(x => x.indexOf('kostnad') >= 0 || x.indexOf('Sak lukket') >= 0), 'kostnad og sak lukket er ute av feeden');
assert(vm.runInContext("ux1UkeSlutt('2026-09-23')", sandbox) === '2026-09-27', 'uken slutter søndag');
sandbox.vehicles = [
  {id:'drift', bilnummer:'Bil 7', gruppe:'tilgjengelig'},
  {id:'ut', bilnummer:'Bil 9', gruppe:'kan-ikke-brukes'},
  {id:'res', bilnummer:'Reserve 1', gruppe:'reserve'},
  {id:'verk', bilnummer:'Bil 4', gruppe:'pa-verksted'},
  {id:'borte', bilnummer:'Bil 8', gruppe:'utfaset'}
];
const biler = vm.runInContext('ux1Kjoretoy().map(v => v.id)', sandbox);
assert(JSON.stringify(biler) === JSON.stringify(['drift', 'res', 'verk']), 'forsiden viser drift, reserve og verksted, ikke utfasing');
assert(vm.runInContext("ux1KjoretoyStatus({gruppe:'tilgjengelig'}).tekst", sandbox) === 'I drift', 'biler i drift leses som I drift');
assert(vm.runInContext("ux1KjoretoyStatus({gruppe:'reserve'}).tekst", sandbox) === 'Tilgjengelig', 'reserve leses som tilgjengelig kapasitet');

if (fails.length) {
  console.error(fails.length + ' feilet');
  process.exit(1);
}
console.log('UX-1 sandbox OK');
