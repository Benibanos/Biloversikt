/*
 * airtable-config.js
 *
 * Fyll inn din egen Airtable-base her. Se AIRTABLE_MIGRATION.md punkt 1-2 for
 * fremgangsmåte (opprette basen, opprette Personal Access Token).
 *
 * ⚠️ VIKTIG SIKKERHETSFORBEHOLD — LES DETTE:
 * I motsetning til Firebase har ikke Airtable noe system for å begrense HVA en
 * nøkkel kan gjøre basert på HVEM som spør (ingen tilsvarende "sikkerhetsregler"
 * håndhevet av Airtable selv per rad/felt). Tokenet under gir FULL lese- og
 * skrivetilgang til hele basen, og ligger — som all annen kode i denne appen —
 * åpent tilgjengelig i nettleseren for alle som besøker siden (Vis kildekode,
 * nettleserens utviklerverktøy, eller nettverksfanen avslører det umiddelbart).
 *
 * Det betyr at HVEM SOM HELST som finner denne siden i prinsippet kan lese,
 * endre eller slette ALT i Airtable-basen din — ikke bare det sjåførskjemaet
 * er ment å skrive til. Dette er en vesentlig svakere sikkerhetsmodell enn
 * Firebase (som kan håndheve regler per rad/felt på selve serveren).
 *
 * Reduser risikoen så godt det lar seg gjøre uten en egen backend:
 *  - Bruk et Personal Access Token (IKKE den gamle, kontobrede API-nøkkelen)
 *    og gi det tilgang KUN til denne ene basen, med KUN scopene
 *    data.records:read og data.records:write — se punkt 2.
 *  - Ikke legg inn andre baser eller sensitiv informasjon i samme Airtable-
 *    konto som denne appen bruker.
 *  - Vurder å rotere (bytte ut) tokenet jevnlig via Airtable Console.
 *  - Del ALDRI lenken til appen offentlig utover de som faktisk skal bruke den.
 * Dette fjerner ikke risikoen, kun reduserer skadeomfanget. Ønsker dere ekte
 * sikkerhet, må det en egen backend/proxy til (utenfor denne appens omfang).
 */
const AIRTABLE_CONFIG = {
  baseId: 'appLbkGIlGss6LPIh',
  token: 'pat4OORshZWLI59cu.d19796b09ae44605c7e6389f0e0860f1ec9c24e5eb6a63017d4d7f2600f70f5c'
};
