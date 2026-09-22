#!/usr/bin/env node
'use strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '/home/ubuntu/.npm/_npx/eb7983f9b02fb67f/node_modules/playwright/index.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = '/opt/cursor/artifacts';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome-stable',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1400,900'],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));

async function shot(name) {
  const p = path.join(outDir, name);
  await page.screenshot({ path: p, fullPage: false });
  console.log('SHOT', name);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

try {
  await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#login-brukernavn', { timeout: 90000 });
  await page.fill('#login-brukernavn', 'pedersen');
  await page.fill('#login-passord', 'bring2026');
  await page.click('#login-form button[type="submit"]');
  await page.waitForFunction(() => typeof loadAll === 'function' && Array.isArray(vehicles) && vehicles.length, null, { timeout: 120000 });
  await sleep(1200);

  await page.evaluate(() => { goTo('verksted'); });
  await page.waitForSelector('[data-vt-fane="kommende"]', { timeout: 20000 });
  await sleep(400);

  const state = await page.evaluate(() => {
    const fane = document.querySelector('[data-vt-fane="kommende"]');
    const kpi = [...document.querySelectorAll('[data-vt-kpi]')].map(el => el.dataset.vtKpi);
    const compact = document.body.innerText.includes('Neste verksted');
    const storTittel = [...document.querySelectorAll('.nvt-tittel')].some(el => el.textContent.includes('Neste verkstedtime'));
    const grupper = [...document.querySelectorAll('.vt-plan-gruppe-tittel')].map(el => el.textContent.trim());
    const rader = document.querySelectorAll('.vt-plan-rad').length;
    const apne = document.querySelectorAll('[data-apne-vt]').length;
    const utfort = document.querySelectorAll('[data-fullfor-vt]').length;
    return {
      defaultKommende: fane && fane.classList.contains('active'),
      kpi,
      compact,
      storTittel,
      grupper,
      rader,
      apne,
      utfort,
      faneState: vtOversiktFane,
      textHasBiler: !!document.querySelector('[data-vt-fane="biler"]'),
      textHasHist: !!document.querySelector('[data-vt-fane="historikk"]')
    };
  });
  console.log('STATE', JSON.stringify(state, null, 2));
  if (!state.defaultKommende) throw new Error('Kommende er ikke standardfane');
  if (state.kpi.join() !== 'idag,uke,forfalt') throw new Error('KPI mangler: ' + state.kpi);
  if (!state.compact) throw new Error('Kompakt Neste verksted mangler');
  if (state.storTittel) throw new Error('Stort Neste verkstedtime-kort vises fortsatt');
  if (!state.textHasBiler || !state.textHasHist) throw new Error('Faner mangler');
  await shot('p75_01_kommende.png');

  await page.click('[data-vt-fane="biler"]');
  await sleep(500);
  const biler = await page.evaluate(() => ({
    fane: vtOversiktFane,
    acc: !!document.querySelector('[data-toggle-vto-vehicle]'),
    ytre: !!document.querySelector('[data-toggle-vt-grupper]'),
    planRader: document.querySelectorAll('.vt-plan-rad').length
  }));
  console.log('BILER', biler);
  if (biler.fane !== 'biler') throw new Error('Biler-fane ikke aktiv');
  if (biler.ytre) throw new Error('Ytre Biloversikt-akkordion skal være borte i Biler-fanen');
  await shot('p75_02_biler.png');

  await page.click('[data-vt-fane="historikk"]');
  await sleep(500);
  const hist = await page.evaluate(() => {
    const rad = document.querySelector('.vt-plan-rad');
    let overlap = false;
    if (rad) {
      const tid = rad.querySelector('.vt-plan-tid');
      const bil = rad.querySelector('.vt-plan-bil');
      if (tid && bil) {
        const a = tid.getBoundingClientRect();
        const b = bil.getBoundingClientRect();
        overlap = a.right > b.left + 1 && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
      }
    }
    return {
      fane: vtOversiktFane,
      utfortKnapper: document.querySelectorAll('[data-fullfor-vt]').length,
      overlap,
      tidTekst: rad?.querySelector('.vt-plan-tid')?.textContent || '',
      rader: document.querySelectorAll('.vt-plan-rad').length
    };
  });
  console.log('HIST', hist);
  if (hist.fane !== 'historikk') throw new Error('Historikk-fane ikke aktiv');
  if (hist.utfortKnapper > 0) throw new Error('Historikk skal ikke ha Utført-knapper');
  if (hist.overlap) throw new Error('Historikk: dato overlapper bilnavn');
  await shot('p75_03_historikk.png');

  await page.click('[data-vt-fane="kommende"]');
  await sleep(400);
  if (state.rader > 0) {
    await page.click('[data-vt-rad] [data-apne-vt]');
    await sleep(600);
    const open = await page.evaluate(() => !!document.querySelector('.dmg-editbox'));
    console.log('APNE_EDIT', open);
    if (!open) throw new Error('Åpne viste ikke redigeringsboks');
    await shot('p75_04_apne.png');
    await page.evaluate(() => { editingVTId = null; render(); });
    await sleep(300);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => render());
  await sleep(400);
  await shot('p75_05_mobil.png');

  console.log('P75 E2E OK');
} finally {
  await browser.close();
}
