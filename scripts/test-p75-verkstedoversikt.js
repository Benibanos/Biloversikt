'use strict';
// Isolert sjekk av Prioritet 75-dato-gruppering (samme regler som vtKommendeGrupper / vtOversiktKpi).
function isoDateOffset(iso, deltaDager){
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if(!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + deltaDager));
  return d.toISOString().slice(0, 10);
}
function isoUkeStart(iso){
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if(!m) return iso;
  const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  const ukedagIdx = (dt.getUTCDay() + 6) % 7;
  return isoDateOffset(iso, -ukedagIdx);
}
function vtOversiktKpi(liste, idag){
  const ukeStart = isoUkeStart(idag);
  const ukeSlutt = isoDateOffset(ukeStart, 6);
  const planlagt = (liste || []).filter(t => t && !t.utfort && t.dato);
  return {
    idag: planlagt.filter(t => t.dato === idag).length,
    uke: planlagt.filter(t => t.dato >= idag && t.dato <= ukeSlutt).length,
    forfalt: planlagt.filter(t => t.dato < idag).length
  };
}
function vtKommendeGrupper(liste, idag){
  const ukeStart = isoUkeStart(idag);
  const ukeSlutt = isoDateOffset(ukeStart, 6);
  const sortert = (liste || []).slice().sort((a,b) => (a.dato + (a.tidspunkt || '')).localeCompare(b.dato + (b.tidspunkt || '')));
  const forfalt = [], iDag = [], uke = [], senere = [];
  sortert.forEach(t => {
    if(!t.dato){ senere.push(t); return; }
    if(t.dato < idag) forfalt.push(t);
    else if(t.dato === idag) iDag.push(t);
    else if(t.dato <= ukeSlutt) uke.push(t);
    else senere.push(t);
  });
  return {forfalt, iDag, uke, senere, ukeSlutt};
}

const idag = '2026-09-22'; // tirsdag
const liste = [
  {id:'a', dato:'2026-09-20', tidspunkt:'08:00', utfort:false},
  {id:'b', dato:'2026-09-22', tidspunkt:'12:00', utfort:false},
  {id:'c', dato:'2026-09-22', tidspunkt:'08:00', utfort:false},
  {id:'d', dato:'2026-09-24', tidspunkt:'09:00', utfort:false},
  {id:'e', dato:'2026-09-28', tidspunkt:'10:00', utfort:false},
  {id:'f', dato:'2026-09-22', tidspunkt:'07:00', utfort:true}
];
const g = vtKommendeGrupper(liste.filter(t => !t.utfort), idag);
const kpi = vtOversiktKpi(liste, idag);
function assert(ok, msg){ if(!ok) throw new Error(msg); }

assert(isoUkeStart(idag) === '2026-09-21', 'uke starter mandag');
assert(g.forfalt.map(t => t.id).join() === 'a', 'forfalt');
assert(g.iDag.map(t => t.id).join() === 'c,b', 'i dag sortert på klokkeslett');
assert(g.uke.map(t => t.id).join() === 'd', 'resten av uken');
assert(g.senere.map(t => t.id).join() === 'e', 'etter uken');
assert(kpi.idag === 2, 'kpi i dag');
assert(kpi.uke === 3, 'kpi denne uken inkluderer i dag');
assert(kpi.forfalt === 1, 'kpi forfalt');
assert(!g.iDag.some(t => t.utfort) && !g.forfalt.some(t => t.id === 'f'), 'utførte utelatt');
console.log('P75 verkstedoversikt-gruppering OK');
