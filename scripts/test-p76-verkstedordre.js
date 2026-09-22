'use strict';
// Isolert sjekk av Prioritet 76: kombinerbare typer, merge-kandidat, eksklusive typer, historikkfilter.
const VT_TYPE_LABEL = {
  'eu-kontroll':'EU-kontroll',
  service:'Service',
  dekkskift:'Dekkskift',
  ruteskift:'Ruteskift',
  reparasjon:'Reparasjon'
};
const VT_TYPE_REKKEFOLGE = ['eu-kontroll','service','reparasjon','dekkskift','ruteskift'];
const VT_ORDRE_TYPER = ['eu-kontroll','service','reparasjon'];
const VT_EKSKLUSIVE_TYPER = ['dekkskift','ruteskift'];
function vtTyperListe(tEllerStreng){
  const raw = (tEllerStreng && typeof tEllerStreng === 'object') ? tEllerStreng.type : tEllerStreng;
  const sett = new Set(String(raw || '').split(',').map(s => s.trim()).filter(k => VT_TYPE_REKKEFOLGE.includes(k)));
  return VT_TYPE_REKKEFOLGE.filter(k => sett.has(k));
}
function vtSlaTyperSammen(a, b){
  const sett = new Set(vtTyperListe(a).concat(vtTyperListe(b)));
  return VT_TYPE_REKKEFOLGE.filter(k => sett.has(k)).join(',');
}
function vtErKombinerbarOrdre(tEllerStreng){
  const typer = vtTyperListe(tEllerStreng);
  return typer.length > 0 && typer.every(k => VT_ORDRE_TYPER.includes(k));
}
function vtOppgaverTekst(t){
  const typer = vtTyperListe(t);
  if(typer.length) return typer.map(k => VT_TYPE_LABEL[k]).join(', ');
  return (t && t.beskrivelse) ? String(t.beskrivelse) : 'Arbeid';
}
function finnEksisterendeVerkstedordre(liste, vehicleId, dato, verksted, unntattId){
  if(!vehicleId || !dato || !verksted) return null;
  return liste.find(t =>
    t && !t.utfort &&
    t.id !== unntattId &&
    t.vehicleId === vehicleId &&
    t.dato === dato &&
    t.verksted === verksted &&
    vtErKombinerbarOrdre(t)
  ) || null;
}

function assert(ok, msg){ if(!ok) throw new Error(msg); }

assert(vtTyperListe('service,eu-kontroll').join() === 'eu-kontroll,service', 'rekkefølge EU før service');
assert(vtSlaTyperSammen('service', 'eu-kontroll,reparasjon') === 'eu-kontroll,service,reparasjon', 'slå sammen tre oppgaver');
assert(vtSlaTyperSammen('service', 'service') === 'service', 'ingen duplikat');
assert(vtErKombinerbarOrdre('eu-kontroll,service,reparasjon'), 'tre kombinerbare');
assert(!vtErKombinerbarOrdre('dekkskift'), 'dekkskift ikke kombinerbar ordre');
assert(!vtErKombinerbarOrdre('service,dekkskift'), 'blanding med dekk er ikke kombinerbar');
assert(vtOppgaverTekst({type:'eu-kontroll,service'}) === 'EU-kontroll, Service', 'oppgavetekst');
assert(VT_EKSKLUSIVE_TYPER.includes('ruteskift') && VT_EKSKLUSIVE_TYPER.includes('dekkskift'), 'eksklusive');

const liste = [
  {id:'o1', vehicleId:'b1', dato:'2026-10-15', verksted:'Norsk Scania', type:'eu-kontroll', utfort:false},
  {id:'o2', vehicleId:'b1', dato:'2026-10-15', verksted:'Annet', type:'service', utfort:false},
  {id:'o3', vehicleId:'b1', dato:'2026-10-16', verksted:'Norsk Scania', type:'service', utfort:false},
  {id:'o4', vehicleId:'b2', dato:'2026-10-15', verksted:'Norsk Scania', type:'service', utfort:false},
  {id:'o5', vehicleId:'b1', dato:'2026-10-15', verksted:'Norsk Scania', type:'dekkskift', utfort:false},
  {id:'o6', vehicleId:'b1', dato:'2026-10-15', verksted:'Norsk Scania', type:'service', utfort:true}
];
const treff = finnEksisterendeVerkstedordre(liste, 'b1', '2026-10-15', 'Norsk Scania');
assert(treff && treff.id === 'o1', 'samme bil+dato+verksted, ikke utført, kombinerbar');
assert(!finnEksisterendeVerkstedordre(liste, 'b1', '2026-10-15', 'Annet X'), 'annet verksted');
assert(finnEksisterendeVerkstedordre(liste, 'b1', '2026-10-15', 'Annet').id === 'o2', 'annet verksted treffer o2');
assert(!finnEksisterendeVerkstedordre(liste.filter(t => t.id !== 'o1' && t.id !== 'o2'), 'b1', '2026-10-15', 'Norsk Scania'), 'utført og dekkskift ignoreres');

const merged = {type: vtSlaTyperSammen(treff.type, 'service,reparasjon')};
assert(merged.type === 'eu-kontroll,service,reparasjon', 'legg til service+reparasjon på EU-ordre');

const poster = [{typer: vtTyperListe(merged), type: 'EU-kontroll + Service + Reparasjon'}];
function histTreff(filterType){
  return poster.filter(p => {
    if(Array.isArray(p.typer) && p.typer.length) return p.typer.includes(filterType);
    return p.type === filterType;
  }).length;
}
assert(histTreff('service') === 1, 'historikkfilter service treffer samlet ordre');
assert(histTreff('eu-kontroll') === 1, 'historikkfilter EU treffer samlet ordre');
assert(histTreff('reparasjon') === 1, 'historikkfilter reparasjon treffer samlet ordre');
assert(histTreff('dekkskift') === 0, 'dekkskift treffer ikke');

const saker = [
  {id:'s1', linkedVtId:'o1', status:'verksted-bestilt'},
  {id:'s2', linkedVtId:'o1', status:'verksted-bestilt'},
  {id:'s3', linkedVtId:'o2', status:'verksted-bestilt'}
];
const t = {id:'o1', sakId:'s1'};
const lukkes = saker.filter(s => (s.linkedVtId === t.id) || (t.sakId && s.id === t.sakId));
assert(lukkes.map(s => s.id).join() === 's1,s2', 'Utført lukker alle saker på ordren');

console.log('P76 verkstedordre OK');
