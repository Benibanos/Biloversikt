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
const side = extractFn('renderKalender');
const rekk = ['Verkstedkapasitet', 'Krever planlegging', 'Tidslinje', 'Månedskalender', 'Historikk'].map(t => side.indexOf('bp-overline">' + t));
assert(rekk.every((n, i) => n > (i ? rekk[i - 1] : -1)), 'seksjonene står i operativ rekkefølge');
assert(!side.includes('layoutFlowHtml'), 'kalenderen leser ikke layoutrekkefølgen');
assert(side.includes('ux4KreverPlanlegging(5)'), 'maks fem i krever planlegging');
assert(html.includes('function kalenderAktiviteterKart()'), 'kalenderkartet er beholdt');

const sandbox = {
  todayISO(){ return '2026-09-23'; },
  isoDateOffset(iso, d){
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    const dt = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + d));
    return dt.toISOString().slice(0, 10);
  },
  isoUkeStart(){ return '2026-09-21'; },
  KAL_UKEDAG_KORT: ['Man','Tir','Ons','Tor','Fre','Lør','Søn'],
  WorkshopFollowupEngine: { alle(){ return [
    {id:'forfalt', oppfolging:'krever-oppfolging', vtStatus:'forfalt'},
    {id:'venter', oppfolging:'avventer-verksted', vtStatus:'planlagt'}
  ]; } },
  AlertEngine: { aktive(){ return [{id:'eu1', kategori:'eu', alvorlighet:'hoy'}, {id:'sak', kategori:'skade', alvorlighet:'kritisk'}, {id:'eu2', kategori:'eu', alvorlighet:null}]; } }
};
vm.createContext(sandbox);
['ux4Ukedag', 'ux4Tidslinje', 'ux4Historikk', 'ux4KreverPlanlegging'].forEach(n => vm.runInContext(extractFn(n), sandbox));
const kart = {
  '2026-09-20': [{tittel:'Gammel'}],
  '2026-09-23': [{tittel:'I dag', tid:'08:00'}],
  '2026-09-24': [{tittel:'I morgen', tid:'09:00'}],
  '2026-09-25': [{tittel:'Fredag'}],
  '2026-10-02': [{tittel:'Senere'}]
};
const linje = vm.runInContext('ux4Tidslinje(' + JSON.stringify(kart) + ')', sandbox);
assert(linje.iDag.map(a => a.tittel).join() === 'I dag', 'i dag er egen gruppe');
assert(linje.morgen.map(a => a.tittel).join() === 'I morgen', 'i morgen er egen gruppe');
assert(Object.keys(linje.ukeKart).join() === '2026-09-25', 'resten av uka tar ikke med i morgen eller senere');
assert(vm.runInContext("ux4Ukedag('2026-09-23')", sandbox) === 'Ons', 'onsdag leses fra samme ukedagsindeks');
const hist = vm.runInContext('ux4Historikk(' + JSON.stringify(kart) + ', 8)', sandbox);
assert(hist.map(a => a.tittel).join() === 'Gammel', 'historikk er bare datoer før i dag');
const plan = vm.runInContext('ux4KreverPlanlegging(5)', sandbox);
assert(plan.map(p => p.kind + ':' + (p.r ? p.r.id : p.x.id)).join() === 'wfe:venter,eu:eu1', 'kalenderen tar ubekreftet time og EU, ikke verkstedets forfalt-liste');

if (fails.length) {
  console.error(fails.length + ' feilet');
  process.exit(1);
}
console.log('UX-4 sandbox OK');
