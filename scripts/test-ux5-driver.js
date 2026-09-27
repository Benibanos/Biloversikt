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
const side = extractFn('renderDriverMinBil');
const rekk = ['id="ux5-hero"', 'id="ux5-na"', 'id="ux5-k"', 'id="ux5-h"', 'id="ux5-ring"', 'id="ux5-info"'].map(t => side.indexOf(t));
assert(rekk.every((n, i) => n > (i ? rekk[i - 1] : -1)) && rekk[5] < side.lastIndexOf("delerHtml['driver.sjekk-ut']"), 'Min Bil står i operativ rekkefølge');
const handling = side.indexOf("delerHtml['driver.varsel']");
assert(handling < side.indexOf("delerHtml['driver.skade']") && side.indexOf("delerHtml['driver.skade']") < side.indexOf("delerHtml['driver.kommentarer']"), 'varsel, skade og kommentarer er i den rekkefølgen');
assert(!side.includes('layoutSynligeTopp'), 'Min Bil leser ikke layoutrekkefølgen');
assert(extractFn('ux5MaGjores').includes('.slice(0, 5)'), 'maks fem handlinger');

const sandbox = {
  isKontrollertIdag(){ return false; },
  vehicleErReserveUnntatt(){ return false; },
  AlertEngine: { forKjoretoy(){ return sandbox.varsler; } },
  ringelisteEkstra: { ledelse: [
    {navn:'Kari', rolle:'Økonomi'},
    {navn:'Ola', rolle:'Transportleder'}
  ]},
  varsler: [
    {id:'1', alvorlighet:'kritisk'}, {id:'2', alvorlighet:'hoy'}, {id:'3', alvorlighet:'middels'},
    {id:'4', alvorlighet:'lav'}, {id:'5', alvorlighet:'hoy'}, {id:'6', alvorlighet:null}
  ]
};
vm.createContext(sandbox);
['ux5MaGjores', 'ux5LedelseSortert'].forEach(n => vm.runInContext(extractFn(n), sandbox));
const gjort = vm.runInContext("ux5MaGjores({id:'b'}).map(p => p.kind === 'kontroll' ? 'kontroll' : p.x.id)", sandbox);
assert(JSON.stringify(gjort) === JSON.stringify(['kontroll','1','2','3','4']), 'kontroll først, deretter fire varsler, maks fem');
sandbox.isKontrollertIdag = function(){ return true; };
const gjort2 = vm.runInContext("ux5MaGjores({id:'b'}).map(p => p.x.id)", sandbox);
assert(JSON.stringify(gjort2) === JSON.stringify(['1','2','3','4','5']), 'utført kontroll tar ikke plass, km uten alvorlighet er ute');
assert(vm.runInContext('ux5LedelseSortert().map(k => k.navn).join()', sandbox) === 'Ola,Kari', 'transportleder står foran andre i ledelsen');

if (fails.length) {
  console.error(fails.length + ' feilet');
  process.exit(1);
}
console.log('UX-5 sandbox OK');
