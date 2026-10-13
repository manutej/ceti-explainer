/* page: player, sealed commit, revise chips, try-it panel, transcript. Film mode: bare stage + window.__ctrl / __film */
(function () {
'use strict';
const O = window.OPERA, F = O.FILM, T = O.T, DUR = O.DUR, S = O.state;
const FILM_MODE = /[?&]film=1/.test(location.search);
const stage = document.getElementById('stage');
if (FILM_MODE) document.body.classList.add('film');
O.build(stage);

let t = 0, playing = false, last = null;
const fmt = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
function seek(x) { t = Math.max(0, Math.min(DUR, x)); O.render(t); if (!FILM_MODE) ui(); return { t, error: window.__error || null }; }
function play() { if (t >= DUR - 0.05) t = 0; playing = true; last = null; if (!FILM_MODE) ui(); }
function pause() { playing = false; if (!FILM_MODE) ui(); }

window.__ctrl = { play, pause, seek, duration: DUR, state: S, setState: (o) => { Object.assign(S, o); O.render(t); } };
window.__film = {
  ready: async () => { await O.ready(); if (document.fonts) await document.fonts.ready; O.render(t); return true; },
  seek: (x) => { try { return seek(x); } catch (e) { window.__error = String(e); return { t: x, error: String(e) }; } },
  only: (groups) => { const c = stage.querySelector('canvas'), v = stage.querySelector('svg');
    if (c) c.style.visibility = groups.includes('figure') || groups.includes('ground') ? '' : 'hidden';
    if (v) v.style.visibility = groups.includes('svg') ? '' : 'hidden';
    stage.style.background = groups.includes('bg') ? '' : 'transparent'; },
  info: { id: F.id, dur: DUR, chapters: F.chapters, cards: F.cards, captions: F.captions }
};
window.addEventListener('error', (e) => { window.__error = String(e.message || e); });
if (FILM_MODE) { O.ready().then(() => O.render(0)); return; }

/* ── live page ── */
const $ = (id) => document.getElementById(id);
const scrub = $('scrub'), tm = $('tm'), playB = $('play'), rail = $('rail');
scrub.max = DUR;
playB.onclick = () => (playing ? pause() : play());
scrub.oninput = () => { pause(); seek(+scrub.value); };
$('cc').onclick = (e) => { const on = e.currentTarget.classList.toggle('on'); e.currentTarget.setAttribute('aria-pressed', on);
  stage.querySelector('g[data-layer=cap]').style.display = on ? '' : 'none'; };
document.addEventListener('keydown', (e) => { if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); }
  if (e.code === 'ArrowRight') seek(t + 5); if (e.code === 'ArrowLeft') seek(t - 5); });
// chapters + cards
const marks = [...F.chapters.map(c => ({ id: c.id, t: c.t0, label: c.id.replace('ch', '') + ' · ' + c.title, card: false })),
               ...F.cards.map(c => ({ id: c.id, t: c.t0, label: c.id.replace('card-', '').toUpperCase(), card: true }))].sort((a, b) => a.t - b.t);
marks.forEach(m => { const b = document.createElement('button'); b.textContent = m.label; if (m.card) b.className = 'card'; b.onclick = () => { pause(); seek(m.t + 0.01); }; $('chapters').appendChild(b); });
// hash anchors: #ch5, #card-e
const h = location.hash.slice(1); const hm = marks.find(m => m.id === h);

/* ── the sealed commit: the clock pauses at 0:51 for a month (8 s, else "no date") ── */
const ask = $('ask'), askIn = $('askIn'), askBar = $('askBar');
let askT0 = null, askResume = false;
function openAsk(resume) { ask.classList.add('show'); askIn.value = ''; askIn.focus({ preventScroll: true }); askT0 = performance.now(); askResume = resume; }
function closeAsk(v) { ask.classList.remove('show'); askT0 = null; S.date = v; O.render(t); if (askResume) play(); refreshTry(); }
$('askGo').onclick = () => { const v = Math.round(+askIn.value); if (v >= 1 && v <= 48) closeAsk(v); else askIn.focus(); };
askIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') $('askGo').click(); });

function railFor(t) {
  const key = (t >= 47 && t < 63) ? 'commit' : (t >= 94 && t < 98) ? 'keep' : (t >= 121 && t < 126) ? 'side' : (t >= 206 && t < 234) ? 'try' : '';
  if (rail.dataset.k === key) return; rail.dataset.k = key; rail.innerHTML = '';
  const btn = (s, on, fn) => { const b = document.createElement('button'); b.textContent = s; if (on) b.className = 'on'; b.onclick = fn; rail.appendChild(b); return b; };
  const txt = (s) => { const d = document.createElement('span'); d.textContent = s; rail.appendChild(d); };
  if (key === 'commit') { txt(S.date == null ? 'The film will pause at 0:51 and ask for your month.' : 'Your month is sealed. The case opens it at 2:33.'); if (S.date == null) btn('Seal a month now', false, () => { pause(); openAsk(false); }); }
  if (key === 'keep') { txt('Keep your month, or change it?'); btn('Keep', S.keep === 'keep', () => { S.keep = 'keep'; rail.dataset.k = ''; }); btn('Change', S.keep === 'change', () => { S.keep = 'change'; pause(); openAsk(true); rail.dataset.k = ''; }); }
  if (key === 'side') { txt('Is your project more like the 300, or the 700?'); btn('the 300', S.side === '300', () => { S.side = '300'; rail.dataset.k = ''; O.render(t); }); btn('the 700', S.side === '700', () => { S.side = '700'; rail.dataset.k = ''; O.render(t); }); }
  if (key === 'try') { txt('Change the plan, the promise or the wall below — the frame re-runs the same arithmetic.'); const a = document.createElement('a'); a.href = '#try'; a.textContent = 'Pin your own plan ↓'; a.style.color = 'inherit'; rail.appendChild(a); }
}
function ui() {
  scrub.value = t.toFixed(1); tm.textContent = fmt(t) + ' / ' + fmt(DUR);
  playB.textContent = playing ? '❚❚ Pause' : '▶ Play';
  railFor(t);
}
function tick(now) {
  if (playing) {
    const dt = last == null ? 0 : Math.min(0.1, (now - last) / 1000); last = now;
    let nt = t + dt;
    if (S.date == null && t < T.ring - 0.5 && nt >= T.ring - 0.5) { nt = T.ring - 0.5; playing = false; openAsk(true); }
    if (nt >= DUR) { nt = DUR; playing = false; }
    t = nt; O.render(t); ui();
  }
  if (askT0 != null) { const u = (now - askT0) / 8000; askBar.style.transform = `scaleX(${Math.max(0, 1 - u)})`; if (u >= 1) closeAsk('none'); }
  requestAnimationFrame(tick);
}

/* ── try it: the same one function, P(done by m) ── */
const EXTRA = ['SECURITY', 'DATA', 'TRAINING', 'MIGRATION', 'AUDIT', 'HANDOVER'];
const on = new Set();
EXTRA.forEach(n => { const b = document.createElement('button'); b.className = 'chip'; b.textContent = '+ ' + n.toLowerCase(); b.onclick = () => { on.has(n) ? on.delete(n) : on.add(n); b.classList.toggle('on'); S.tryExtra = on.size; tryGo(); }; $('tryTasks').appendChild(b); });
[['theses', 'theses (the wall)'], ['textbooks', 'textbook teams'], ['megaprojects', 'megaprojects']].forEach(([k, s]) => {
  const b = document.createElement('button'); b.className = 'chip' + (k === 'theses' ? ' on' : ''); b.textContent = s; b.dataset.k = k;
  b.onclick = () => { S.tryCls = k; [...$('tryCls').children].forEach(x => x.classList.toggle('on', x.dataset.k === k)); tryGo(); }; $('tryCls').appendChild(b); });
$('tryDate').oninput = (e) => { S.tryDate = +e.target.value; $('tryDateV').textContent = S.tryDate; tryGo(); };
function tryGo() { S.tryOn = true; pause(); seek(S.tryCls === 'megaprojects' ? 228 : 220); refreshTry(); }
function refreshTry() {
  const plan = 12 + S.tryExtra, d = S.tryDate, k = O.countBy(d, plan), o = $('tryOut');
  if (S.tryCls === 'theses') {
    const mine = typeof S.date === 'number' ? `<p>Your sealed month ${S.date}: ${O.countBy(S.date, plan).toLocaleString()} ÷ 1,000 finished by then.</p>` : '';
    o.innerHTML = `<div class="ex">PLAN ${plan} MO · PROMISE ${d} MO</div><div class="big">${Math.round(k / 100)} IN 10</div><div class="ex">${k.toLocaleString()} ÷ 1,000 bars finished by month ${d}</div>
      <p>P(done by ${d}) = Φ((ln(${d} ÷ ${plan}) − 0.2555) ÷ 0.487). By the plan itself: ${O.countBy(plan, plan)} ÷ 1,000 — adding tasks never moves that.</p>
      <p>Half the wall is done by ${(plan * Math.exp(0.2555)).toFixed(1)} mo; eight in ten by ${(plan * Math.exp(0.2555 + 0.8416 * 0.487)).toFixed(1)}; nine in ten by ${(plan * Math.exp(0.2555 + 1.2816 * 0.487)).toFixed(1)}.</p>${mine}`;
  } else if (S.tryCls === 'textbooks') {
    o.innerHTML = `<div class="ex">TEXTBOOK TEAMS (FOX, IN KAHNEMAN'S TELLING)</div><div class="big">4 IN 10</div><div class="ex">never finished · the rest took 7–10 years</div>
      <p>No distribution: one expert's sentence. A plan of ~2 years sits below every finished bar. Kahneman's team took 8.</p>`;
  } else {
    o.innerHTML = `<div class="ex">MEGAPROJECTS · 16,000 (FLYVBJERG & GARDNER 2023)</div><div class="big">8.5 %</div><div class="ex">on time and on budget · 0.5 % also on benefits · 91.5 % miss at least one</div>
      <p>We draw no wall here: the published numbers are shares, not a distribution.</p>`;
  }
}
// transcript + sources
F.captions.forEach(c => { const d = document.createElement('div'); d.innerHTML = `<b>${fmt(c[0])}</b>`; d.appendChild(document.createTextNode(c[2])); d.onclick = () => { pause(); seek(c[0] + 0.3); stage.scrollIntoView({ behavior: 'smooth', block: 'center' }); }; $('transcript').appendChild(d); });
F.sources.forEach(([k, s]) => { const li = document.createElement('li'); li.textContent = `[${k}] ${s}`; $('sources').appendChild(li); });

O.ready().then(() => { refreshTry(); seek(hm ? hm.t + 0.01 : 0); requestAnimationFrame(tick); });
})();
