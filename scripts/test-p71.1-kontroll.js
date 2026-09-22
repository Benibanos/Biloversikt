#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const kontroll = fs.readFileSync(path.join(root, 'kontroll.html'), 'utf8');
const fails = [];
function assert(cond, msg) {
  if (!cond) { fails.push(msg); console.error('FAIL', msg); }
  else console.log('OK ', msg);
}

assert(html === kontroll, 'index.html og kontroll.html er identiske');
assert(!html.includes('id="kt-loftebord-ok"'), 'kontroll har ikke OK for løftebord');
assert(!html.includes('id="kt-loftebord-ma"'), 'kontroll har ikke Må gjøres for løftebord');
assert(!html.includes("kontrollDeler['control.skade-loftebord']"), 'skade-loftebord-kortet er borte');
assert(html.includes("kontrollDeler['control.nye-skader']"), 'nye skader er eget kort');
assert(!html.includes('name="kt-loftebord"'), 'ingen løftebord-radio i kontrollen');
assert(html.includes("id=\"mb-loftebord-btn\""), 'Min Bil har Smør løftebord');
assert(html.includes("'driver.loftebord':"), 'Min Bil-layout har løftebord');
assert(html.includes("function submitMinBilLoftebordVedlikehold"), 'Min Bil-vedlikehold er urørt');
assert(html.includes("id=\"kt-avvik-kommentar\""), 'avvikskommentar er beholdt');
assert(html.includes("id=\"kt-kommentar\""), 'sjåførkommentar er beholdt');
assert(html.includes("'sidespeil':'Sidespeil defekt/ødelagt'"), 'sidespeil er beholdt');

const orderStart = html.indexOf('const KONTROLLAVVIK_ORDER');
const orderLine = html.slice(orderStart, html.indexOf(';', orderStart));
assert(orderLine.includes("'loftebord'"), 'loftebord ligger fortsatt i avviksordenen (Min Bil / historikk)');

const km = html.indexOf("kt('km'");
const send = html.indexOf("kt('send'");
const block = html.slice(km, send);
['km','varsellamper','kontrollavvik','avvik-kommentar','kommentar','nye-skader'].forEach((id, i, arr) => {
  const pos = block.indexOf("kt('" + id + "'");
  assert(pos >= 0, 'layout har ' + id);
  if (i > 0) {
    const prev = block.indexOf("kt('" + arr[i - 1] + "'");
    assert(prev < pos, id + ' kommer etter ' + arr[i - 1]);
  }
});
assert(!block.includes("kt('skade-loftebord'"), 'layout har ikke skade-loftebord');

function extractFn(name) {
  const re = new RegExp('function ' + name + '\\(');
  const m = re.exec(html);
  if (!m) throw new Error('missing ' + name);
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

const sandbox = {
  aktiveSaker: [],
  vehicles: [{id:'v1', regnr:'AB12345'}],
  uid(){ return 'id-' + (++sandbox.n); },
  n: 0,
  nesteSakId(){ return 'SAK-1'; },
  nowTimeOslo(){ return '08:00'; },
  finnAktivSakMedAvvik(){ return null; }
};
vm.createContext(sandbox);
vm.runInContext(extractFn('registrerKontrollAvvikSomSak') + '\n' + extractFn('kommentarSkalVarsles'), sandbox);
vm.runInContext(`
  registrerKontrollAvvikSomSak('v1', [
    {caseType:'varsellampe', sourceId:'motor', label:'Motorlampe'},
    {caseType:'kontrollavvik', sourceId:'sidespeil', label:'Sidespeil defekt/ødelagt'}
  ], {reportedBy:'Ola', reportedAt:'2026-09-22', controlId:'k1', avvikKommentar:'Defekt høyre sidespeil'});
`, sandbox);
const sak = sandbox.aktiveSaker[0];
assert(sak && sak.avvik.length === 2, 'ett kontrollkall lager én sak med to avvik');
assert(sak.avvik[1].kommentar === 'Defekt høyre sidespeil', 'kontrollavviket lagrer avvikskommentaren');
assert(vm.runInContext("kommentarSkalVarsles({lest:false, kilde:'kontroll'})", sandbox) === false, 'kontrollkommentar varsles ikke');

if (fails.length) {
  console.error(fails.length + ' feilet');
  process.exit(1);
}
console.log('Alle p71.1-sjekker bestått');
