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
const kort = extractFn('ux3KontrollkortHtml');
assert(kort.indexOf('ux3HeroHtml') < kort.indexOf('ux3-handling'), 'hero står før krever handling');
assert(kort.indexOf('ux3-handling') < kort.indexOf('ux3NesteHtml'), 'handling står før neste aktiviteter');
assert(kort.indexOf('ux3NesteHtml') < kort.indexOf('ux3SjaforHtml'), 'neste aktiviteter står før sjåfør');
assert(kort.indexOf('ux3SjaforHtml') < kort.indexOf('ux3-saker'), 'sjåfør står før aktive saker');
assert(kort.includes('.slice(0, 5)') === false && kort.includes('ux3KreverHandling') && kort.includes('ux3SakerForBil'), 'kontrollkortet bruker de avgrensede listene');
const side = extractFn('renderBilkort');
assert(side.indexOf('ux3KontrollkortHtml') < side.indexOf('ux3-hist'), 'historikk kommer etter kontrollkortet');
assert(side.indexOf('ux3-hist') < side.indexOf('ux3-dok'), 'dokumentasjon kommer etter historikk');
assert(!side.includes('layoutFlowHtml'), 'profilen leser ikke layoutrekkefølgen');
assert(extractFn('ux3KreverHandling').includes('.slice(0, 5)'), 'maks fem oppfølgingspunkter');
assert(extractFn('ux3SakerForBil').includes('.slice(0, 5)'), 'maks fem saker');

const sandbox = {
  flatehelseGruppe(v){ return v.gruppe; },
  ux1KjoretoyStatus(v){
    if (v.gruppe === 'reserve') return {domene:'driftsstatus', key:'reserve', tekst:'Tilgjengelig'};
    if (v.gruppe === 'pa-verksted') return {domene:'operativ', key:'pa-verksted', tekst:''};
    return {domene:'operativ', key:'operativ', tekst:'I drift'};
  },
  AlertEngine: { forKjoretoy(){ return sandbox.varsler; } },
  ux1Saker(){ return sandbox.saker; },
  varsler: [
    {id:'a1', alvorlighet:'kritisk'}, {id:'a2', alvorlighet:'hoy'}, {id:'a3', alvorlighet:'middels'},
    {id:'a4', alvorlighet:'lav'}, {id:'a5', alvorlighet:'hoy'}, {id:'a6', alvorlighet:'kritisk'},
    {id:'km', alvorlighet:null}
  ],
  saker: [
    {id:'s1', vehicleId:'b1'}, {id:'s2', vehicleId:'b2'}, {id:'s3', vehicleId:'b1'},
    {id:'s4', vehicleId:'b1'}, {id:'s5', vehicleId:'b1'}, {id:'s6', vehicleId:'b1'}, {id:'s7', vehicleId:'b1'}
  ]
};
vm.createContext(sandbox);
['ux3StatusVis', 'ux3KreverHandling', 'ux3SakerForBil'].forEach(n => vm.runInContext(extractFn(n), sandbox));
assert(vm.runInContext("ux3StatusVis({gruppe:'tilgjengelig'}).tekst", sandbox) === 'I drift', 'bil i drift leses som I drift');
assert(vm.runInContext("ux3StatusVis({gruppe:'pa-verksted'}).key", sandbox) === 'pa-verksted', 'på verksted bruker verkstedstatus');
assert(vm.runInContext("ux3StatusVis({gruppe:'kan-ikke-brukes'}).key", sandbox) === 'kan-ikke-brukes', 'utfasing vises med sin egen status på profilen');
const handling = vm.runInContext("ux3KreverHandling({id:'b1'}).map(x => x.id)", sandbox);
assert(JSON.stringify(handling) === JSON.stringify(['a1','a2','a3','a4','a5']), 'fem oppføringer, km uten alvorlighet er ute');
assert(JSON.stringify(vm.runInContext("ux3SakerForBil({id:'b1'}).map(s => s.id)", sandbox)) === JSON.stringify(['s1','s3','s4','s5','s6']), 'maks fem saker for denne bilen');

if (fails.length) {
  console.error(fails.length + ' feilet');
  process.exit(1);
}
console.log('UX-3 sandbox OK');
