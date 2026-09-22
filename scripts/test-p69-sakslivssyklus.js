const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const kontroll = fs.readFileSync(path.join(root, 'kontroll.html'), 'utf8');

const failures = [];
function assert(ok, label) {
  if (ok) console.log('OK ', label);
  else { failures.push(label); console.error('FAIL', label); }
}

function extractFunction(source, name) {
  let start = source.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('mangler ' + name);
  const asyncAt = start - 'async '.length;
  if (asyncAt >= 0 && source.slice(asyncAt, start) === 'async ') start = asyncAt;
  let i = source.indexOf('{', start);
  let depth = 0;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error('ubalansert ' + name);
}

assert(html === kontroll, 'index.html og kontroll.html er identiske');
assert(!html.includes('data-sak-legg-til-bil'), 'Legg til bil finnes ikke på saker');
assert(!html.includes('function sakLeggTilBil'), 'flerbilssak kan ikke opprettes');
assert(html.includes('id="vt-flerbil-toggle">Velg flere biler</button>'), 'dekkskift kan fortsatt velge flere biler');
assert(html.includes("s.status = 'avslatt'"), 'avslå setter sakstatus avslatt');
assert(html.includes("w.status = 'kvittert'"), 'avslå kvitterer varsellampe');
assert(html.includes("a.status = 'avslatt'"), 'avslå lukker kontrollavvik');

const sandbox = {
  aktiveSaker: [],
  varsellys: [],
  loggedInRole: 'Admin',
  confirm(){ return true; },
  todayISO(){ return '2026-09-22'; },
  nowTimeOslo(){ return '08:10'; },
  sakProblemLabel(s){ return s.title; },
  async saveVarsellysEllerKast(){ sandbox.vlSaves++; },
  async saveAktiveSakerEllerKast(){ sandbox.sakSaves++; if (sandbox.failSak) throw new Error('sak'); },
  render(){ sandbox.renders++; },
  alert(msg){ sandbox.alerts.push(msg); },
  console
};
sandbox.vlSaves = 0;
sandbox.sakSaves = 0;
sandbox.renders = 0;
sandbox.alerts = [];
sandbox.failSak = false;
vm.createContext(sandbox);
['sakErApen', 'sakAvvikListe', 'sakAvvikAktive', 'aktiveKontrollavvikTyper', 'avslaSak'].forEach(name => {
  vm.runInContext(extractFunction(html, name), sandbox);
});

const sak = {
  id: 's1', vehicleId: 'v1', title: 'Motorlampe', status: 'ny', caseType: 'varsellampe', sourceId: 'motor',
  resolvedAt: null, historikk: [],
  avvik: [
    {id: 'a1', caseType: 'varsellampe', sourceId: 'motor', status: 'aktiv'},
    {id: 'a2', caseType: 'kontrollavvik', sourceId: 'defekt-lys', status: 'aktiv'}
  ]
};
sandbox.aktiveSaker.push(sak);
sandbox.varsellys.push({id: 'w1', vehicleId: 'v1', type: 'motor', status: 'aktiv'});

vm.runInContext('avslaSak("s1")', sandbox);
Promise.resolve().then(() => {
  assert(sak.status === 'avslatt', 'saken er avslått');
  assert(sak.resolvedAt === '2026-09-22', 'saken har historikkdato');
  assert(sak.avvik.every(a => a.status === 'avslatt'), 'begge avvik er lukket');
  assert(sandbox.varsellys[0].status === 'kvittert', 'varsellampen er kvittert');
  assert(sandbox.sakErApen(sak) === false, 'saken er ikke åpen');
  assert(sandbox.aktiveKontrollavvikTyper('v1').size === 0, 'Min Bil ser ingen aktive kontrollavvik');
  assert(sandbox.varsellys.filter(w => w.status === 'aktiv').length === 0, 'ingen aktiv varsellampe igjen');

  sandbox.annen = {
    id: 's2', vehicleId: 'v1', title: 'ABS', status: 'ny', caseType: 'varsellampe', sourceId: 'abs',
    avvik: [{id: 'a3', caseType: 'varsellampe', sourceId: 'abs', status: 'aktiv'}]
  };
  sandbox.behold = {
    id: 's3', vehicleId: 'v1', title: 'ABS igjen', status: 'under-oppfolging', caseType: 'varsellampe', sourceId: 'abs',
    avvik: [{id: 'a4', caseType: 'varsellampe', sourceId: 'abs', status: 'aktiv'}]
  };
  sandbox.aktiveSaker.push(sandbox.annen, sandbox.behold);
  sandbox.varsellys.push({id: 'w2', vehicleId: 'v1', type: 'abs', status: 'aktiv'});
  return vm.runInContext('avslaSak("s2")', sandbox);
}).then(() => {
  assert(sandbox.annen.status === 'avslatt', 'den ene ABS-saken er avslått');
  assert(sandbox.varsellys.find(w => w.id === 'w2').status === 'aktiv', 'lampen blir stående når en annen åpen sak fortsatt har den');
  assert(sandbox.sakErApen(sandbox.behold) === true, 'den andre saken er fortsatt åpen');

  sandbox.failSak = true;
  sandbox.forAvslag = {
    id: 's4', vehicleId: 'v2', title: 'Lys', status: 'ny', caseType: 'kontrollavvik', sourceId: 'defekt-lys',
    avvik: [{id: 'a5', caseType: 'kontrollavvik', sourceId: 'defekt-lys', status: 'aktiv'}]
  };
  sandbox.aktiveSaker.push(sandbox.forAvslag);
  sandbox.varsellys.push({id: 'w3', vehicleId: 'v2', type: 'lys', status: 'aktiv'});
  return vm.runInContext('avslaSak("s4")', sandbox);
}).then(() => {
  const gjenopprettet = sandbox.aktiveSaker.find(x => x.id === 's4');
  assert(gjenopprettet && gjenopprettet.status === 'ny', 'mislykket lagring ruller saken tilbake');
  assert(gjenopprettet && gjenopprettet.avvik[0].status === 'aktiv', 'mislykket lagring ruller avviket tilbake');
  assert(sandbox.alerts.length > 0, 'brukeren får vite at avslaget ikke ble lagret');

  if (failures.length) {
    console.error('\nFAILED:');
    failures.forEach(f => console.error('- ' + f));
    process.exit(1);
  }
  console.log('\nAll assertions passed.');
}).catch(err => {
  console.error(err);
  process.exit(1);
});
