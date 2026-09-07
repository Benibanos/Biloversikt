/*
 * airtable-config.example.js
 *
 * Eksempelmal UTEN ekte verdier — kopier denne til airtable-config.js og
 * fyll inn din egen Airtable-base. Se AIRTABLE_MIGRATION.md, seksjon 9
 * ("Oppsettsguide"), for fullstendig fremgangsmåte (opprette basen,
 * generere Personal Access Token, koble appen til Airtable).
 *
 * VIKTIG SIKKERHETSFORBEHOLD — se "Sikkerhet" i CLAUDE.md: tokenet ligger
 * åpent i nettleseren for alle som besøker siden, siden appen ikke har noen
 * backend. Bruk et Personal Access Token scopet KUN til denne basen, med
 * KUN scopene data.records:read og data.records:write
 * (+ schema.bases:read/write om du vil bruke automatisk skjemasjekk i
 * Database status).
 */
const AIRTABLE_CONFIG = {
  baseId: 'DIN_BASE_ID_HER',
  token: 'DITT_PERSONAL_ACCESS_TOKEN_HER'
};
