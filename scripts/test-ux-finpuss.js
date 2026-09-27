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
assert(html.includes('.bp-case.is-compact'), 'kompakt sakskort finnes');
assert(!extractFn('ux2Anbefaling').includes('Avslutt oppfølgingen'), 'anbefalingen sier ikke avslutt uten knapp');
const kort = extractFn('ux3KontrollkortHtml');
assert(kort.indexOf('ux3BilinfoHtml') < kort.indexOf('ux3-handling'), 'bilinformasjon ligger rett etter status');
assert(extractFn('renderBilkort').indexOf('ux3KontrollkortHtml') < extractFn('renderBilkort').indexOf('id="ux3-hist"'), 'historikk kommer etter kontrollkortet');
assert(html.includes("'Lag 1':'var(--success)'") && html.includes("'Lag 4':'var(--warning)'"), 'lag 1–4 har tokenfarger');

const sandbox = { esc(s){ return s; } };
vm.createContext(sandbox);
vm.runInContext(extractFn('ux2Handling') + '\n' + extractFn('ux2Anbefaling'), sandbox);
const klar = vm.runInContext("ux2Handling({oppfolging:'klar-til-avslutning', sakIds:['s1'], vtId:'t1'})", sandbox);
assert(klar.tekst.indexOf('Lukk saken') === 0, 'klar til avslutning peker på lukk saken');
assert(klar.knapp.indexOf('data-wfe-lukk-sak') >= 0, 'knappen lukker saken');
const drift = vm.runInContext("ux2Handling({kreverSikkerhetsvurdering:true, vehicleId:'v1', oppfolging:'klar-til-avslutning'})", sandbox);
assert(drift.knapp.indexOf('data-wfe-tilbake-drift') >= 0, 'sikkerhetsvurdering har sett tilbake i drift');

if (fails.length) {
  console.error(fails.length + ' feilet');
  process.exit(1);
}
console.log('UX-finpuss sandbox OK');
