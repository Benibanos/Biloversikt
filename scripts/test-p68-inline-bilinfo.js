const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const kontroll = fs.readFileSync(path.join(root, 'kontroll.html'), 'utf8');
const storage = fs.readFileSync(path.join(root, 'storage.airtable.js'), 'utf8');

const failures = [];
function assert(ok, label) {
  if (ok) console.log('OK ', label);
  else failures.push(label);
}

assert(html === kontroll, 'index.html og kontroll.html er identiske');
assert(html.includes('${showBilinfoRediger ? infoBody : `'), 'Kjøretøydetaljer bytter innhold på stedet');
assert(html.includes('grid-template-columns:repeat(3,minmax(0,1fr))'), 'desktop bruker tre kolonner');
assert(html.includes('@media (max-width:900px){ .bilinfo-edit-grid{grid-template-columns:repeat(2,minmax(0,1fr));}'), 'mellomstor flate bruker to kolonner');
assert(html.includes('.detalj-grid,.bilinfo-edit-grid{grid-template-columns:1fr;}'), 'mobil bruker én kolonne');
assert(html.includes('id="f-servicenummer"'), 'servicenummer har eget felt');
assert(html.includes('id="f-service-intervall"'), 'serviceintervall har eget felt');
assert(html.includes('v.servicenummer =') && html.includes('v.serviceIntervallKm ='), 'feltene lagres separat');
assert(html.includes("bilDeler['vehicle.statusrad']"), 'statusraden beholdes på profilen');
assert(html.includes("bilDeler['vehicle.historikk'] = bilkortHistorikkSekHtml(v)"), 'Historikk beholdes på profilen');
assert(storage.match(/servicenummer:\s*\['Servicenummer'\]/g)?.length === 1, 'Servicenummer er registrert én gang i LIST_TABLES');
assert(html.includes('Object.assign(v, snapshot)'), 'lagringsfeil ruller tilbake lokal kjøretøytilstand');

if (failures.length) {
  console.error('FAILED:');
  failures.forEach(f => console.error('- ' + f));
  process.exit(1);
}
console.log(`\nAll assertions passed (${12} checks).`);
