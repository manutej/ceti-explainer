// kit2/probe.mjs (kit2: fill value from the commit range; no try-it panel is not an error; overlay placement reported; D11: commit off → play-through check) <abs page.html> <abs shots-dir> [t1,t2,...]: film-mode load, screenshots at the given times, re-seek purity (SVG + canvas), live commit pause/seal, 8 s "no answer" on a phone viewport; prints errors.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const page_path = process.argv[2], shots = process.argv[3], times = (process.argv[4] || '3,7.5,14,19').split(',').map(Number);
const url = 'file://' + page_path;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errs = [];
const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push('console.' + m.type() + ': ' + m.text()); });
pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
await pg.goto(url + '?film=1');
await pg.evaluate(() => window.__film.ready());
const snap = async (t) => pg.evaluate((t) => { const r = window.__film.seek(t); const c = document.querySelector('#stage canvas');
  return { err: r.error, svg: document.querySelector('#stage svg').outerHTML, px: c.toDataURL() }; }, t);
for (const t of times) { await snap(t); await pg.screenshot({ path: `${shots}/t${String(t).replace('.', '_')}.png` }); }
// purity: fresh seek vs re-seek after a tour
const window_dur = await pg.evaluate(() => window.__film.info.dur);
const out = {};
for (const t of times) {
  const a = await snap(t); for (const u of [0.3, ...times.map(x => x * 0.61), window_dur * 0.9]) await snap(u); const b2 = await snap(t);
  out[t] = { svgSame: a.svg === b2.svg, pxSame: a.px === b2.px, svgLen: a.svg.length };
}
console.log('purity', JSON.stringify(out));
console.log('info', JSON.stringify(await pg.evaluate(() => ({ keys: Object.keys(window.__film), ctrl: Object.keys(window.__ctrl), info: window.__film.info.id, brand: window.__film.info.brand, kit: Object.keys(window.KIT).length }))));
// live page
const lp = await b.newPage({ viewport: { width: 1280, height: 900 } });
lp.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push('live console.' + m.type() + ': ' + m.text()); });
lp.on('pageerror', e => errs.push('live pageerror: ' + e.message));
await lp.goto(url);
await lp.evaluate(() => window.__film.ready());
if (await lp.evaluate(() => (window.__film.info.commit || {}).enabled === false)) {
  // D11: the commit beat is off: no overlay, no rail, no try-it pane, no film-mode default; the clock runs straight through
  const off = await lp.evaluate(async () => { window.__ctrl.seek(7); window.__ctrl.play(); await new Promise(r => setTimeout(r, 2500));
    const t = +document.getElementById('scrub').value; window.__ctrl.pause();
    return { t, ask: !!document.getElementById('ask'), rail: !!document.getElementById('rail'), tryit: !!document.getElementById('try'), answer: window.__ctrl.state.answer, commitBox: !!window.KIT.commitGeom }; });
  const fm = await pg.evaluate(() => window.__ctrl.state.answer);
  console.log('live', JSON.stringify({ commit: 'off (D11)', playedFrom7To: off.t, askInDom: off.ask, railInDom: off.rail, tryInDom: off.tryit, answer: off.answer, filmModeAnswer: fm, commitGeom: off.commitBox }));
  console.log('errors', errs.length, errs.join('\n'));
  await b.close(); process.exit(0);
}
await lp.evaluate(() => { window.__ctrl.seek(window.__film.info.commit.at - 0.3); window.__ctrl.play(); });
await lp.waitForTimeout(800);
const askShown = await lp.evaluate(() => document.getElementById('ask').classList.contains('show'));
await lp.screenshot({ path: `${shots}/live-ask.png` });
const fillV = await lp.evaluate(() => { const c = window.__film.info.commit || {}; const lo = c.min != null ? c.min : 0, hi = c.max != null ? c.max : 100;
  return String(c.default != null && c.default >= lo && c.default <= hi ? (c.default === lo ? Math.min(hi, lo + 1) : c.default - (c.step && c.step < 1 ? c.step : 1) >= lo ? c.default - 1 : c.default) : Math.round((lo + hi) / 2)); });
const askBox = await lp.evaluate(() => { const a = document.getElementById('ask').getBoundingClientRect(), s = document.getElementById('stage').getBoundingClientRect(), g = window.KIT.commitGeom;
  return { overlay: [Math.round(960 * (a.left - s.left) / s.width), Math.round(540 * (a.top - s.top) / s.height)], box: g ? [g.x, g.y] : null }; });
await lp.fill('#askIn', fillV); await lp.click('#askGo');
await lp.waitForTimeout(300);
const ans = await lp.evaluate(() => window.__ctrl.state.answer);
await lp.evaluate(() => { window.__ctrl.pause(); window.__ctrl.seek(window.__film.info.brand.at - 0.4); });
await lp.screenshot({ path: `${shots}/live-count.png`, fullPage: true });
// no-answer path
const lp2 = await b.newPage({ viewport: { width: 390, height: 844 } });
lp2.on('pageerror', e => errs.push('phone pageerror: ' + e.message));
await lp2.goto(url); await lp2.evaluate(() => window.__film.ready());
await lp2.evaluate(() => { window.__ctrl.seek(window.__film.info.commit.at - 0.1); window.__ctrl.play(); });
await lp2.waitForTimeout(8900);
const ans2 = await lp2.evaluate(() => window.__ctrl.state.answer);
await lp2.screenshot({ path: `${shots}/phone.png` });
console.log('live', JSON.stringify({ askShown, ans, ans2, fillV, askBox, tryOut: await lp.evaluate(() => { const e = document.getElementById('tryOut'); return e ? e.textContent.slice(0, 80) : '(no try-it panel)'; }) }));
console.log('errors', errs.length, errs.join('\n'));
await b.close();
