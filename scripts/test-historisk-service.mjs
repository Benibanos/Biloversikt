// Isolert sjekk av «Siste service» = nyeste gyldige ServiceDato i historikken.
function serviceDatoGyldig(dato){
  if(typeof dato !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dato)) return false;
  const [y, m, d] = dato.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
function servicePostErGyldig(s){
  return !!(s && s.vehicleId && serviceDatoGyldig(s.dato));
}
function vehicleServiceHistorikk(list, vehicleId){
  return list.filter(s => s.vehicleId === vehicleId).sort((a,b) => {
    const da = serviceDatoGyldig(a.dato) ? a.dato : '';
    const db = serviceDatoGyldig(b.dato) ? b.dato : '';
    if(db !== da) return db.localeCompare(da);
    return (Number(b.km) || 0) - (Number(a.km) || 0);
  });
}
function vehicleSisteService(list, vehicleId){
  return vehicleServiceHistorikk(list, vehicleId).find(servicePostErGyldig) || null;
}
function vehicleNesteServiceKm(list, vehicleId, v){
  const intervall = v && v.serviceIntervallKm ? Number(v.serviceIntervallKm) : null;
  if(!intervall) return null;
  const siste = vehicleSisteService(list, vehicleId);
  const baseline = siste && siste.km ? Number(siste.km) : 0;
  return baseline + intervall;
}

function assert(ok, msg){ if(!ok) throw new Error(msg); }

const v = {id:'b1', km: 180000, serviceIntervallKm: 15000};
let hist = [
  {id:'s-old', vehicleId:'b1', dato:'2024-01-10', km: 150000, createdAt:'2026-09-22T10:00:00.000Z'},
  {id:'s-new', vehicleId:'b1', dato:'2025-06-01', km: 165000, createdAt:'2026-09-22T11:00:00.000Z'},
  {id:'s-other', vehicleId:'b2', dato:'2025-12-01', km: 200000, createdAt:'2026-09-22T12:00:00.000Z'},
  {id:'s-bad', vehicleId:'b1', dato:'ikke-en-dato', km: 999999, createdAt:'2026-09-22T13:00:00.000Z'},
];

let siste = vehicleSisteService(hist, 'b1');
assert(siste && siste.id === 's-new', 'nyeste gyldige dato vinner, ikke km og ikke ugyldig post');
assert(siste.dato === '2025-06-01', 'ServiceDato er utført-dato');
assert(siste.createdAt === '2026-09-22T11:00:00.000Z', 'createdAt er registreringstidspunkt');
assert(vehicleNesteServiceKm(hist, 'b1', v) === 165000 + 15000, 'km igjen bruker siste gyldige service-km');

// Høyere km på eldre post skal ikke vinne (gammel sortering)
hist.push({id:'s-highkm', vehicleId:'b1', dato:'2023-01-01', km: 500000, createdAt:'2026-09-22T14:00:00.000Z'});
siste = vehicleSisteService(hist, 'b1');
assert(siste.id === 's-new', 'eldre post med høyere km er ikke siste service');

hist = hist.filter(s => s.id !== 's-new');
siste = vehicleSisteService(hist, 'b1');
assert(siste && siste.id === 's-old', 'sletting av nyeste gir neste gyldige');
assert(vehicleNesteServiceKm(hist, 'b1', v) === 150000 + 15000, 'km igjen oppdateres etter sletting');

hist = hist.filter(s => s.vehicleId === 'b1' && servicePostErGyldig(s) === false || s.vehicleId !== 'b1');
hist = [
  {id:'s-bad', vehicleId:'b1', dato:'', km: 1, createdAt:'2026-09-22T13:00:00.000Z'},
];
assert(vehicleSisteService(hist, 'b1') === null, 'ingen gyldig post → ingen siste service');

console.log('historisk-service: 7/7 OK');
