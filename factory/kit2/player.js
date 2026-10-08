/* factory/kit2/player.js · (kit2: the commit overlay follows K.commitGeom; try-it pane guarded) the page around the stage: player, chapters, CC, the sealed commit, transcript,
   sources, honest limits, the optional try-it panel. Film mode (?film=1): bare 1920 × 1080 stage.
   Hooks: window.__film {ready, seek, only, info} and window.__ctrl {play, pause, seek, setState, state, duration}. */
(function () {
'use strict';
const K = window.KIT, F = K.FILM, DUR = K.DUR, S = K.state, FILM_MODE = K.FILM_MODE;
const R = () => window.FILM_RENDER || {};
const stage = document.getElementById('stage');
if (FILM_MODE) document.body.classList.add('film');
const mounted = K.mount(stage);

let t = 0, playing = false, last = null;
const fmt = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
function seek(x) { t = Math.max(0, Math.min(DUR, +x || 0)); K.render(t, S); if (!FILM_MODE) ui(); return { t, error: window.__error || null }; }
function play() { if (t >= DUR - 0.05) t = 0; playing = true; last = null; if (!FILM_MODE) ui(); }
function pause() { playing = false; if (!FILM_MODE) ui(); }

window.__ctrl = { play, pause, seek, duration: DUR, state: S, setState: (o) => { Object.assign(S, o); K.render(t, S); if (!FILM_MODE) refreshTry(); } };
window.__film = {
  ready: async () => { await mounted; if (document.fonts) await document.fonts.ready; K.render(t, S); return true; },
  seek: (x) => { try { return seek(x); } catch (e) { window.__error = String(e); return { t: x, error: String(e) }; } },
  only: (groups) => { const c = stage.querySelector('canvas'), v = stage.querySelector('svg');
    if (c) c.style.visibility = groups.includes('figure') || groups.includes('ground') ? '' : 'hidden';
    if (v) v.style.visibility = groups.includes('svg') ? '' : 'hidden';
    stage.style.background = groups.includes('bg') ? '' : 'transparent'; },
  info: { id: F.id, title: F.title, dur: DUR, chapters: F.chapters || [], cards: F.cards || [], captions: F.captions || [],
          commit: F.commit || null, brand: F.brand ? { at: K.brandAt(), takeaway: F.brand.takeaway } : null,
          axes: K.AXES || null }
};
window.addEventListener('error', (e) => { window.__error = String(e.message || e); });
if (FILM_MODE) { mounted.then(() => K.render(0, S)); return; }

/* ── live page ── */
const $ = (id) => document.getElementById(id);
const scrub = $('scrub'), tm = $('tm'), playB = $('play'), rail = $('rail');
scrub.max = DUR;
playB.onclick = () => (playing ? pause() : play());
scrub.oninput = () => { pause(); seek(+scrub.value); };
$('cc').onclick = (e) => { const on = e.currentTarget.classList.toggle('on'); e.currentTarget.setAttribute('aria-pressed', on);
  const g = stage.querySelector('g[data-layer=cap]'); if (g) g.style.display = on ? '' : 'none'; };
document.addEventListener('keydown', (e) => { if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); }
  if (e.code === 'ArrowRight') seek(t + 5); if (e.code === 'ArrowLeft') seek(t - 5); });

// chapters (+ optional cards) as buttons; #<chapter id> deep-links
const marks = [...(F.chapters || []).map((c, i) => ({ id: c.id, t: c.t0, label: (i + 1) + ' · ' + c.title, card: false })),
               ...(F.cards || []).map(c => ({ id: c.id, t: c.t0, label: (c.label || c.id).toUpperCase(), card: true }))].sort((a, b) => a.t - b.t);
marks.forEach(m => { const b = document.createElement('button'); b.textContent = m.label; if (m.card) b.className = 'card'; b.onclick = () => { pause(); seek(m.t + 0.01); }; $('chapters').appendChild(b); });
const hm = marks.find(m => m.id === location.hash.slice(1));

/* ── the sealed commit: the clock pauses at FILM.commit.at for one number (8 s, else "no answer") ── */
const CM = F.commit || null;
const ask = $('ask'), askIn = $('askIn'), askBar = $('askBar');
let askT0 = null, askResume = false;
if (CM) {
  $('askH').textContent = CM.title || 'YOUR NUMBER';
  $('askP').textContent = CM.prompt || '';
  $('askU').textContent = CM.unit || '';
  if (CM.min != null) askIn.min = CM.min; if (CM.max != null) askIn.max = CM.max; if (CM.step != null) askIn.step = CM.step;
}
function placeAsk() {   // SHIP defect 5: the HTML overlay sits on the box the film actually drew
  const g = K.commitGeom; if (!g) return;
  ask.style.left = (100 * g.x / K.W).toFixed(3) + '%'; ask.style.top = (100 * g.y / K.H).toFixed(3) + '%';
  ask.style.width = (100 * g.w / K.W).toFixed(3) + '%'; ask.style.right = 'auto';
}
function openAsk(resume) { placeAsk(); ask.classList.add('show'); askIn.value = ''; askIn.focus({ preventScroll: true }); askT0 = performance.now(); askResume = resume; }
function closeAsk(v) { ask.classList.remove('show'); askT0 = null; S.answer = v; K.render(t, S); if (askResume) play(); rail.dataset.k = ''; refreshTry(); }
$('askGo').onclick = () => { const v = +askIn.value, lo = CM && CM.min != null ? CM.min : -Infinity, hi = CM && CM.max != null ? CM.max : Infinity;
  if (askIn.value !== '' && isFinite(v) && v >= lo && v <= hi) closeAsk(CM && CM.step && CM.step < 1 ? v : Math.round(v)); else askIn.focus(); };
askIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') $('askGo').click(); });
$('askNo').onclick = () => closeAsk('none');

function railFor(t) {
  const key = CM && t < CM.at + 6 ? (S.answer == null ? 'ask' : 'sealed') : '';
  if (rail.dataset.k === key) return; rail.dataset.k = key; rail.innerHTML = '';
  const txt = (s) => { const d = document.createElement('span'); d.textContent = s; rail.appendChild(d); };
  if (key === 'ask') { txt(`The film will pause at ${fmt(CM.at)} and ask for your number.`);
    const b = document.createElement('button'); b.textContent = 'Seal a number now'; b.onclick = () => { pause(); openAsk(false); }; rail.appendChild(b); }
  if (key === 'sealed') txt(S.answer === 'none' ? 'No answer sealed. The case runs without it.' : 'Your number is sealed. The count will place it against the truth.');
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
    if (CM && S.answer == null && t < CM.at && nt >= CM.at) { nt = CM.at; playing = false; openAsk(true); }
    if (nt >= DUR) { nt = DUR; playing = false; }
    t = nt; K.render(t, S); ui();
  }
  if (askT0 != null) { const u = (now - askT0) / 8000; askBar.style.transform = `scaleX(${Math.max(0, 1 - u)})`; if (u >= 1) closeAsk('none'); }
  requestAnimationFrame(tick);
}

/* ── try it (optional): FILM.tryit {title, note, seek, inputs: [{id, label, min, max, step, value, unit}]}
      + FILM_RENDER.tryit(values, state, KIT) → HTML string for the output pane. Values land in state.try. ── */
const TI = F.tryit || null;
function refreshTry() {
  if (!TI || !R().tryit || !$('tryOut')) return;
  $('tryOut').innerHTML = R().tryit(S.try, S, K);
}
if (TI) {
  $('tryH').textContent = TI.title || 'Try it';
  if (TI.note) $('tryNote').textContent = TI.note;
  S.try = {};
  (TI.inputs || []).forEach(inp => {
    S.try[inp.id] = inp.value;
    const lab = document.createElement('label'); lab.htmlFor = 'try-' + inp.id;
    const v = document.createElement('span'); v.textContent = inp.value;
    lab.append(inp.label + ': ', v, inp.unit ? ' ' + inp.unit : '');
    const r = document.createElement('input'); r.type = 'range'; r.id = 'try-' + inp.id;
    r.min = inp.min; r.max = inp.max; r.step = inp.step || 1; r.value = inp.value;
    r.oninput = () => { S.try[inp.id] = +r.value; v.textContent = r.value; S.tryOn = true; if (TI.seek != null) { pause(); seek(TI.seek); } refreshTry(); };
    $('tryIn').append(lab, r);
  });
} else { const sec = $('try'); if (sec) sec.remove(); }

// transcript, sources, honest limits
(F.captions || []).forEach(c => { const d = document.createElement('div'); const b = document.createElement('b'); b.textContent = fmt(c[0]); d.appendChild(b); d.appendChild(document.createTextNode(c[2]));
  d.onclick = () => { pause(); seek(c[0] + 0.3); stage.scrollIntoView({ behavior: 'smooth', block: 'center' }); }; $('transcript').appendChild(d); });
(F.sources || []).forEach(([k, s]) => { const li = document.createElement('li'); li.textContent = `[${k}] ${s}`; $('sources').appendChild(li); });
[].concat(F.honest || []).forEach(s => { const p = document.createElement('p'); p.className = 'honest'; p.textContent = s; $('honest').appendChild(p); });

mounted.then(async () => { if (document.fonts) await document.fonts.ready; refreshTry(); seek(hm ? hm.t + 0.01 : 0); requestAnimationFrame(tick); });
})();
