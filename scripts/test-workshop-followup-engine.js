'use strict';
// Isolert WorkshopFollowupEngine v1 — 12 scenarier. Ingen Airtable, ingen DOM.
let vehicles = [];
let verkstedtimer = [];
let aktiveSaker = [];
let vehiclesLoadStatus = 'lastet';
let sisteVellykkedeSynkTidspunkt = '2026-09-26T08:00:00.000Z';
let _synk = 'ok';
function synkStatus(){ return _synk; }
function todayISO(){ return '2026-09-26'; }
function statusNokkel(domene, key){
  const alias = {verksted:{'utført':'utfort','cancelled':'avlyst','ongoing':'pagar','pågår':'pagar'}};
  return (alias[domene] && alias[domene][key]) || key;
}
function vtStatus(t){
  if(!t) return null;
  const lagret = statusNokkel('verksted', t.status);
  if(t.utfort || lagret === 'utfort') return 'utfort';
  if(lagret === 'avlyst' || t.avlystDato) return 'avlyst';
  if(lagret === 'pagar') return 'pagar';
  if(t.dato && t.dato < todayISO()) return 'forfalt';
  if(lagret === 'forfalt') return 'forfalt';
  if(lagret === 'bekreftet' || t.bekreftetDato) return 'bekreftet';
  if(t.akutt) return 'pagar';
  return 'planlagt';
}
function sakErApen(s){ return !!(s && !['utfort','avslatt','lukket'].includes(s.status)); }
function sakAlvorlighet(s){ return s.alvorlighet || 'middels'; }
function hoyesteAlvorlighet(liste){
  const o = ['kritisk','hoy','middels','lav'];
  let best = null;
  liste.forEach(a => { if(o.indexOf(a) >= 0 && (best === null || o.indexOf(a) < o.indexOf(best))) best = a; });
  return best;
}
function vehicleDriftsstatus(v){ return v.driftsstatus || (v.uteAvDrift ? 'kan-ikke-brukes' : 'aktiv'); }
function vehicleLabel(v){ return v.navn || v.id; }
function sakTilVtType(s){
  if(s.caseType === 'service') return 'service';
  if(s.caseType === 'dekk') return 'dekkskift';
  return 'reparasjon';
}
const VT_TYPE_REKKEFOLGE = ['eu-kontroll','service','reparasjon','dekkskift','ruteskift'];
function vtTyperListe(tEllerStreng){
  const raw = (tEllerStreng && typeof tEllerStreng === 'object') ? tEllerStreng.type : tEllerStreng;
  const sett = new Set(String(raw || '').split(',').map(s => s.trim()).filter(k => VT_TYPE_REKKEFOLGE.includes(k)));
  return VT_TYPE_REKKEFOLGE.filter(k => sett.has(k));
}
function vtHarType(t, kode){ return vtTyperListe(t).includes(kode); }
function vtSlaTyperSammen(a, b){
  const sett = new Set(vtTyperListe(a).concat(vtTyperListe(b)));
  return VT_TYPE_REKKEFOLGE.filter(k => sett.has(k)).join(',');
}
function vtOppgaverTekst(t){ return vtTyperListe(t).join(', ') || (t && t.beskrivelse) || ''; }
function vtOsloNaa(){ return {dato: todayISO(), tid:'12:00'}; }

const WFE_SAK_TYPER = ['skade', 'kontrollavvik', 'varsellampe', 'dekk', 'service', 'annet'];
const WFE_LISTE_REKKEFOLGE = ['krever-oppfolging', 'klar-til-avslutning', 'mangler-kobling', 'pa-verksted', 'avventer-verksted'];
function sakErVerkstedrelatert(s){ return !!(s && WFE_SAK_TYPER.indexOf(s.caseType) >= 0); }
function vtForventetFerdigIso(t){
  if(!t) return '';
  const s = String(t.forventetFerdig || t.ForventetFerdig || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}
function verkstedDataFerskhet(){
  const synk = synkStatus();
  const load = vehiclesLoadStatus;
  const lastet = load === 'lastet' || load === 'bekreftet-tom';
  const stale = synk === 'offline' || synk === 'utdatert';
  const lesefeil = load === 'lesefeil';
  return { synk, load, lastet, stale, lesefeil, kanKoble: lastet && !stale && !lesefeil, sistSynk: sisteVellykkedeSynkTidspunkt,
    advarsel: !lastet ? 'Verksteddata er ikke ferdig lastet.' : (lesefeil ? 'Siste synk feilet.' : (stale ? 'Dataene kan være utdatert. Kobling er sperret til synken er gyldig.' : '')) };
}
function sakHarGyldigVerkstedkobling(s){
  if(!s || !s.linkedVtId) return false;
  const t = verkstedtimer.find(x => x.id === s.linkedVtId);
  if(!t) return false;
  return vtStatus(t) !== 'avlyst';
}
function wfeVtInkompatibelForSak(t, sak){
  if(!t || !sak) return true;
  if(t.vehicleId !== sak.vehicleId) return true;
  const st = vtStatus(t);
  if(st === 'utfort' || st === 'avlyst') return true;
  if(t.sakId){
    const annen = aktiveSaker.find(x => x.id === t.sakId);
    if(annen && annen.vehicleId && annen.vehicleId !== sak.vehicleId) return true;
  }
  return false;
}
function wfeSakerForTime(t){ return aktiveSaker.filter(s => s.linkedVtId === t.id); }
function wfeByggRad(del){
  const v = vehicles.find(x => x.id === del.vehicleId);
  return Object.assign({
    vehicleId: del.vehicleId || '', bilTekst: v ? vehicleLabel(v) : '', vtId: del.vtId || '',
    sakIds: del.sakIds || [], caseIds: del.caseIds || [], vtStatus: del.vtStatus || null,
    dato: del.dato || '', tidspunkt: del.tidspunkt || '', verksted: del.verksted || '',
    oppgaver: del.oppgaver || [], sakAntall: (del.sakIds || []).length, oppfolging: del.oppfolging,
    regel: del.regel || 0, visning: del.visning || 'info', alvorlighet: del.alvorlighet || null,
    requiresManualReview: !!del.requiresManualReview, manglerFelt: del.manglerFelt || [],
    kreverSikkerhetsvurdering: !!del.kreverSikkerhetsvurdering, tekst: del.tekst || ''
  }, del);
}
function wfeVurderTime(t){
  const st = vtStatus(t);
  const mangler = [];
  if(!t) return wfeByggRad({id:'vt:ukjent', oppfolging:'krever-oppfolging', requiresManualReview:true, manglerFelt:['time'], visning:'hoy', regel:0, tekst:'Verkstedtime mangler.'});
  if(!t.vehicleId) mangler.push('vehicleId');
  if(!t.dato && st !== 'utfort' && st !== 'avlyst' && st !== 'pagar') mangler.push('dato');
  const saker = wfeSakerForTime(t);
  const apne = saker.filter(sakErApen);
  const kritisk = apne.some(s => sakAlvorlighet(s) === 'kritisk');
  const v = vehicles.find(x => x.id === t.vehicleId);
  const kanIkke = v && vehicleDriftsstatus(v) === 'kan-ikke-brukes';
  const resultatMangler = st === 'utfort' && saker.length > 0 && saker.every(s => !s.verkstedResultat);
  const oppgaver = vtTyperListe(t);
  const base = { id:'vt:'+t.id, kind:'appointment', vtId:t.id, vehicleId:t.vehicleId, sakIds:saker.map(s => s.id), caseIds:saker.map(s => s.caseId).filter(Boolean),
    vtStatus:st, dato:t.dato||'', tidspunkt:t.tidspunkt||'', verksted:t.verksted||'', oppgaver, sakAntall:saker.length, alvorlighet: hoyesteAlvorlighet(apne.map(s => sakAlvorlighet(s))) };
  if(st === 'avlyst') return null;
  if(mangler.length) return wfeByggRad(Object.assign({}, base, {oppfolging:'krever-oppfolging', regel:0, visning:'hoy', requiresManualReview:true, manglerFelt:mangler, tekst:'Mangler '+mangler.join(', ')}));
  if(st === 'utfort' && kritisk) return wfeByggRad(Object.assign({}, base, {oppfolging:'klar-til-avslutning', regel:1, visning:'hoy', tekst:'Kritisk sak er fortsatt åpen etter utført verkstedarbeid.'}));
  if(st === 'utfort' && kanIkke) return wfeByggRad(Object.assign({}, base, {oppfolging:'klar-til-avslutning', regel:1, visning:'hoy', kreverSikkerhetsvurdering:true, tekst:'Bilen står som kan ikke brukes etter utført verkstedarbeid og krever eksplisitt vurdering.'}));
  if(st === 'pagar'){
    const ferdig = vtForventetFerdigIso(t);
    if(ferdig && ferdig < todayISO()) return wfeByggRad(Object.assign({}, base, {oppfolging:'krever-oppfolging', regel:2, visning:'hoy', tekst:'Pågående verkstedarbeid har passert forventet ferdig.'}));
  }
  if(st === 'forfalt' || ((st === 'planlagt' || st === 'bekreftet') && t.dato && t.dato < todayISO()))
    return wfeByggRad(Object.assign({}, base, {oppfolging:'krever-oppfolging', regel:3, visning:'hoy', tekst:'Verkstedtimen har passert uten registrert resultat.'}));
  if(st === 'utfort' && resultatMangler) return wfeByggRad(Object.assign({}, base, {oppfolging:'klar-til-avslutning', regel:4, visning:'hoy', tekst:'Verkstedarbeid er utført, men verkstedresultat mangler.'}));
  if(st === 'utfort' && apne.length) return wfeByggRad(Object.assign({}, base, {oppfolging:'klar-til-avslutning', regel:6, visning:'middels', tekst:'Verkstedarbeid er utført, men saken er fortsatt åpen.'}));
  if(st === 'planlagt' || st === 'bekreftet') return wfeByggRad(Object.assign({}, base, {oppfolging:'avventer-verksted', regel:7, visning:'info', tekst:'Verkstedtime er planlagt.'}));
  if(st === 'pagar') return wfeByggRad(Object.assign({}, base, {oppfolging:'pa-verksted', regel:8, visning:'info', tekst:'Verkstedarbeid pågår.'}));
  if(st === 'utfort') return wfeByggRad(Object.assign({}, base, {oppfolging:'fullfort', regel:9, visning:'historikk', tekst:'Verkstedarbeid og sak er fulgt opp.'}));
  return wfeByggRad(Object.assign({}, base, {oppfolging:'krever-oppfolging', regel:0, visning:'hoy', requiresManualReview:true, manglerFelt:['status']}));
}
function wfeVurderSakUtenKobling(s){
  return wfeByggRad({id:'sak:'+s.id, kind:'case', vehicleId:s.vehicleId, sakIds:[s.id], caseIds:[s.caseId].filter(Boolean), oppfolging:'mangler-kobling', regel:5, visning:'middels', alvorlighet:sakAlvorlighet(s), tekst:'Åpen verkstedrelatert sak uten koblet verkstedtime.'});
}
const WorkshopFollowupEngine = {
  alle(){
    const sett = [];
    (verkstedtimer || []).forEach(t => { const rad = wfeVurderTime(t); if(rad) sett.push(rad); });
    (aktiveSaker || []).forEach(s => {
      if(!sakErVerkstedrelatert(s) || !sakErApen(s) || sakHarGyldigVerkstedkobling(s)) return;
      sett.push(wfeVurderSakUtenKobling(s));
    });
    const rang = k => WFE_LISTE_REKKEFOLGE.indexOf(k);
    return sett.sort((a,b) => {
      const ia = rang(a.oppfolging) < 0 ? 99 : rang(a.oppfolging);
      const ib = rang(b.oppfolging) < 0 ? 99 : rang(b.oppfolging);
      return ia !== ib ? ia - ib : String(a.dato||'').localeCompare(String(b.dato||''));
    });
  },
  kreverOppfolging(){ return this.alle().filter(r => r.oppfolging === 'krever-oppfolging'); },
  forKjoretoy(vehicleId){ return this.alle().filter(r => r.vehicleId === vehicleId); },
  forSak(caseId){
    const s = aktiveSaker.find(x => x.id === caseId || x.caseId === caseId);
    if(!s) return [];
    return this.alle().filter(r => (r.sakIds||[]).indexOf(s.id) >= 0);
  },
  koblingsforslag(caseId){
    const s = aktiveSaker.find(x => x.id === caseId || x.caseId === caseId);
    const ferskhet = verkstedDataFerskhet();
    if(!s || !sakErApen(s) || sakHarGyldigVerkstedkobling(s)) return {sak:s||null, forslag:[], foretrukket:null, kanKoble:false, ferskhet};
    const onsket = sakTilVtType(s);
    const idag = todayISO();
    const naa = vtOsloNaa();
    const forslag = verkstedtimer.filter(t => !wfeVtInkompatibelForSak(t, s)).map(t => {
      const st = vtStatus(t);
      const typeMatch = vtHarType(t, onsket);
      const nøkkel = (t.dato||'')+(t.tidspunkt||'');
      let dist = 2;
      if(st === 'pagar') dist = 0;
      else if((t.dato||'') > idag || ((t.dato||'') === idag && (t.tidspunkt||'99:99') >= naa.tid)) dist = 1;
      return {id:t.id, typeMatch, dist, nøkkel, type:t.type};
    }).sort((a,b) => (a.dist-b.dist)||(b.typeMatch-a.typeMatch)||a.nøkkel.localeCompare(b.nøkkel));
    return {sak:s, forslag, foretrukket:forslag[0]||null, kanKoble:ferskhet.kanKoble, ferskhet};
  }
};

let failed = 0;
function assert(cond, msg){
  if(!cond){ failed++; console.error('FAIL', msg); }
  else console.log('ok', msg);
}
function reset(){
  vehicles = [{id:'v1', navn:'Bil 1', driftsstatus:'aktiv'}];
  verkstedtimer = [];
  aktiveSaker = [];
  vehiclesLoadStatus = 'lastet';
  _synk = 'ok';
}

reset();
verkstedtimer = [{id:'t-pre', vehicleId:'v1', dato:'2026-09-28', tidspunkt:'08:00', verksted:'Møller', type:'service', status:'planlagt'}];
aktiveSaker = [{id:'s1', caseId:'SAK-1', vehicleId:'v1', caseType:'service', status:'under-oppfolging', alvorlighet:'middels'}];
const f1 = WorkshopFollowupEngine.koblingsforslag('s1');
assert(f1.foretrukket && f1.foretrukket.id === 't-pre', '1: time booket før sak er koblingskandidat');
assert(WorkshopFollowupEngine.forSak('s1')[0].oppfolging === 'mangler-kobling', '1: sak uten kobling = mangler-kobling');
assert(verkstedtimer.length === 1, '1: ingen duplikat-time');

reset();
verkstedtimer = [{id:'t-past', vehicleId:'v1', dato:'2026-09-20', type:'reparasjon', status:'planlagt'}];
assert(WorkshopFollowupEngine.alle()[0].oppfolging === 'krever-oppfolging' && WorkshopFollowupEngine.alle()[0].regel === 3, '2: passert dato uten utført');

reset();
verkstedtimer = [{id:'t-done', vehicleId:'v1', dato:'2026-09-20', type:'reparasjon', utfort:true}];
aktiveSaker = [{id:'s2', caseId:'SAK-2', vehicleId:'v1', caseType:'skade', status:'under-oppfolging', linkedVtId:'t-done', alvorlighet:'hoy', verkstedResultat:'feil-utbedret'}];
const r3 = WorkshopFollowupEngine.alle().find(x => x.vtId === 't-done');
assert(r3.oppfolging === 'klar-til-avslutning' && r3.regel === 6, '3: utført + åpen ikke-kritisk');
assert(sakErApen(aktiveSaker[0]), '3: saken lukkes ikke automatisk');

reset();
vehicles = [{id:'v1', navn:'Bil 1', driftsstatus:'kan-ikke-brukes'}];
verkstedtimer = [{id:'t-done2', vehicleId:'v1', dato:'2026-09-20', type:'reparasjon', utfort:true}];
aktiveSaker = [{id:'s3', caseId:'SAK-3', vehicleId:'v1', caseType:'skade', status:'utfort', linkedVtId:'t-done2', alvorlighet:'kritisk', verkstedResultat:'feil-utbedret'}];
const r4 = WorkshopFollowupEngine.alle().find(x => x.vtId === 't-done2');
assert(r4.oppfolging === 'klar-til-avslutning' && r4.kreverSikkerhetsvurdering, '4: utført + kan-ikke-brukes krever vurdering');
assert(vehicleDriftsstatus(vehicles[0]) === 'kan-ikke-brukes', '4: ingen auto tilbake i drift');

reset();
verkstedtimer = [{id:'t-pagar', vehicleId:'v1', dato:'2026-09-26', type:'service', status:'pagar', forventetFerdig:'2026-09-25'}];
assert(WorkshopFollowupEngine.alle()[0].regel === 2 && WorkshopFollowupEngine.alle()[0].oppfolging === 'krever-oppfolging', '5: pagar + forventetFerdig passert (kun når feltet finnes)');
verkstedtimer[0].forventetFerdig = '';
assert(WorkshopFollowupEngine.alle()[0].oppfolging === 'pa-verksted' && WorkshopFollowupEngine.alle()[0].regel === 8, '5b: pagar uten forventetFerdig gjettes ikke');

reset();
verkstedtimer = [{id:'t-avlys', vehicleId:'v1', dato:'2026-09-28', type:'reparasjon', status:'avlyst', avlystDato:'2026-09-26'}];
aktiveSaker = [{id:'s4', caseId:'SAK-4', vehicleId:'v1', caseType:'skade', status:'under-oppfolging', linkedVtId:'t-avlys', alvorlighet:'kritisk'}];
const r6 = WorkshopFollowupEngine.forSak('s4');
assert(r6.length === 1 && r6[0].oppfolging === 'mangler-kobling', '6: avlyst time → sak tilbake til mangler-kobling');
assert(sakErApen(aktiveSaker[0]), '6: kritisk sak beholdes');

reset();
verkstedtimer = [{id:'t-svc', vehicleId:'v1', dato:'2026-09-28', type:'service', status:'planlagt'}];
const merged = vtSlaTyperSammen(verkstedtimer[0].type, 'reparasjon');
assert(merged === 'service,reparasjon', '7: oppgave slås sammen uten duplikat');
assert(vtSlaTyperSammen('service,reparasjon', 'service') === 'service,reparasjon', '7b: duplikat-type ignoreres');

reset();
verkstedtimer = [{id:'t-ok', vehicleId:'v1', dato:'2026-09-20', type:'service', utfort:true}];
aktiveSaker = [{id:'s5', caseId:'SAK-5', vehicleId:'v1', caseType:'service', status:'utfort', linkedVtId:'t-ok', verkstedResultat:'feil-utbedret'}];
assert(WorkshopFollowupEngine.alle().every(r => r.oppfolging === 'fullfort' || r.oppfolging === 'avventer-verksted'), '8: alt fulgt opp er fullfort (ikke i dashboard-listen)');
assert(WorkshopFollowupEngine.alle().filter(r => WFE_LISTE_REKKEFOLGE.indexOf(r.oppfolging) >= 0).length === 0, '8: tom oppfølgingsliste');

reset();
verkstedtimer = [];
aktiveSaker = [{id:'s6', caseId:'SAK-6', vehicleId:'v1', caseType:'skade', status:'under-oppfolging', linkedVtId:'slettet', alvorlighet:'hoy'}];
assert(WorkshopFollowupEngine.forSak('s6')[0].oppfolging === 'mangler-kobling', '9: slettet time → brutt lenke = mangler-kobling');

reset();
verkstedtimer = [
  {id:'t-a', vehicleId:'v1', dato:'2026-09-27', tidspunkt:'08:00', type:'service', status:'planlagt'},
  {id:'t-b', vehicleId:'v1', dato:'2026-09-29', tidspunkt:'08:00', type:'reparasjon', status:'planlagt'}
];
aktiveSaker = [{id:'s7', caseId:'SAK-7', vehicleId:'v1', caseType:'skade', status:'under-oppfolging'}];
const f10 = WorkshopFollowupEngine.koblingsforslag('s7');
assert(f10.forslag.length === 2, '10: flere åpne timer er kandidater');
assert(f10.foretrukket.id === 't-b', '10: matcher type reparasjon foran nærmeste service');

reset();
verkstedtimer = [{id:'t-ord', vehicleId:'v1', dato:'2026-09-28', type:'service,reparasjon', status:'planlagt', sakId:'s8'}];
aktiveSaker = [
  {id:'s8', caseId:'SAK-8', vehicleId:'v1', caseType:'service', status:'verksted-bestilt', linkedVtId:'t-ord'},
  {id:'s9', caseId:'SAK-9', vehicleId:'v1', caseType:'skade', status:'verksted-bestilt', linkedVtId:'t-ord'}
];
const r11 = WorkshopFollowupEngine.alle().find(x => x.vtId === 't-ord');
assert(r11.sakAntall === 2, '11: to saker på én ordre');
assert(WorkshopFollowupEngine.forSak('s8')[0].vtId === WorkshopFollowupEngine.forSak('s9')[0].vtId, '11: samme oppfølgingsrad');

reset();
_synk = 'offline';
aktiveSaker = [{id:'s10', caseId:'SAK-10', vehicleId:'v1', caseType:'skade', status:'under-oppfolging'}];
verkstedtimer = [{id:'t-x', vehicleId:'v1', dato:'2026-09-28', type:'reparasjon', status:'planlagt'}];
const f12 = WorkshopFollowupEngine.koblingsforslag('s10');
assert(f12.kanKoble === false && f12.ferskhet.stale, '12: offline sperrer kobling');
_synk = 'utdatert';
assert(WorkshopFollowupEngine.koblingsforslag('s10').kanKoble === false, '12b: utdatert sperrer kobling');
_synk = 'ok';
assert(WorkshopFollowupEngine.koblingsforslag('s10').kanKoble === true, '12c: gyldig synk tillater kobling');

const dash = WorkshopFollowupEngine.forKjoretoy('v1').map(r => r.oppfolging);
const oversikt = WorkshopFollowupEngine.alle().filter(r => r.vehicleId === 'v1').map(r => r.oppfolging);
assert(JSON.stringify(dash) === JSON.stringify(oversikt), 'samme oppfølgingsstatus Dashboard/oversikt/profil');

assert(!String(wfeVurderTime).includes('anbefal') && !String(WorkshopFollowupEngine.koblingsforslag).includes('bestill'), 'ingen verkstedsvalg i motoren');

if(failed){ console.error(failed + ' feil'); process.exit(1); }
console.log('Alle WorkshopFollowupEngine-scenarier bestått.');
