#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const app = path.join(__dirname, '..', 'App');
const html = fs.readFileSync(path.join(app, 'index.html'), 'utf8');
const kontroll = fs.readFileSync(path.join(app, 'kontroll.html'), 'utf8');
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
const flate = extractFn('ux2ArbeidsflateHtml');
assert(flate.indexOf('Verkstedstatus') < flate.indexOf('Krever handling'), 'status står før handling');
assert(flate.indexOf('Krever handling') < flate.indexOf('Kommende verksted'), 'handling står før kommende');
assert(flate.indexOf('Kommende verksted') < flate.indexOf('På verksted'), 'kommende står før på verksted');
assert(flate.indexOf('På verksted') < flate.indexOf('Klar til avslutning'), 'på verksted står før avslutning');
assert(flate.indexOf('Klar til avslutning') < flate.indexOf('Historikk'), 'historikk ligger nederst i arbeidsflaten');
assert(!flate.includes('Registrer verkstedtime'), 'registreringsskjemaet er ikke i arbeidsflaten');
assert(flate.includes('ux2KreverHandling(5)'), 'maks fem i krever handling');
const side = extractFn('renderVerksted');
assert(side.indexOf('ux2ArbeidsflateHtml') < side.indexOf('id="ux2-reg"'), 'registrer-seksjonen kommer etter arbeidsflaten');
assert(!side.includes('layoutFlowHtml'), 'verkstedsiden leser ikke layoutrekkefølgen');
assert(!side.includes('vtOversiktFanerHtml'), 'fanene er borte fra verkstedsiden');

const sandbox = {
  todayISO(){ return '2026-09-23'; },
  isoUkeStart(){ return '2026-09-21'; },
  isoDateOffset(iso, d){
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    const dt = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + d));
    return dt.toISOString().slice(0, 10);
  },
  vtErApen(t){ return t.status !== 'utfort' && t.status !== 'avlyst'; },
  vtStatus(t){ return t.status; },
  rader: [
    {id:'k', oppfolging:'krever-oppfolging', vtStatus:'forfalt'},
    {id:'m', oppfolging:'mangler-kobling', vtStatus:null},
    {id:'p', oppfolging:'avventer-verksted', vtStatus:'planlagt'},
    {id:'b', oppfolging:'avventer-verksted', vtStatus:'bekreftet'},
    {id:'pa', oppfolging:'pa-verksted', vtStatus:'pagar'},
    {id:'klar', oppfolging:'klar-til-avslutning', vtStatus:'utfort'},
    {id:'k2', oppfolging:'krever-oppfolging', vtStatus:'forfalt'},
    {id:'k3', oppfolging:'krever-oppfolging', vtStatus:'forfalt'},
    {id:'k4', oppfolging:'krever-oppfolging', vtStatus:'forfalt'},
    {id:'k5', oppfolging:'krever-oppfolging', vtStatus:'forfalt'}
  ],
  WorkshopFollowupEngine: { alle(){ return sandbox.rader; } }
};
vm.createContext(sandbox);
['ux2KreverHandling', 'ux2KommendeGrupper'].forEach(n => vm.runInContext(extractFn(n), sandbox));
const handling = vm.runInContext('ux2KreverHandling(5).map(r => r.id)', sandbox);
assert(JSON.stringify(handling) === JSON.stringify(['k', 'm', 'p', 'k2', 'k3']), 'krever handling tar forfalt, kobling og ubekreftet, maks 5');
assert(!handling.includes('pa') && !handling.includes('klar') && !handling.includes('b'), 'på verksted, avslutning og bekreftet er ute av arbeidslisten');
sandbox.timer = [
  {id:'idag', dato:'2026-09-23', status:'planlagt'},
  {id:'uke', dato:'2026-09-25', status:'bekreftet'},
  {id:'sen-bekr', dato:'2026-10-02', status:'bekreftet'},
  {id:'sen-vent', dato:'2026-10-03', status:'planlagt'},
  {id:'pagar', dato:'2026-09-23', status:'pagar'},
  {id:'forfalt', dato:'2026-09-20', status:'forfalt'},
  {id:'utfort', dato:'2026-09-23', status:'utfort'}
];
const g = vm.runInContext('ux2KommendeGrupper(timer)', sandbox);
assert(g.iDag.map(t => t.id).join() === 'idag', 'i dag er egen gruppe');
assert(g.uke.map(t => t.id).join() === 'uke', 'denne uka tar resten av uken');
assert(g.bekreftet.map(t => t.id).join() === 'sen-bekr', 'senere bekreftet er egen gruppe');
assert(g.venter.map(t => t.id).join() === 'sen-vent', 'senere ubekreftet venter bekreftelse');
assert(!['pagar', 'forfalt', 'utfort'].some(id => g.iDag.concat(g.uke, g.bekreftet, g.venter).some(t => t.id === id)), 'pågår, forfalt og utført er ute av kommende');

if (fails.length) {
  console.error(fails.length + ' feilet');
  process.exit(1);
}
console.log('UX-2 sandbox OK');
