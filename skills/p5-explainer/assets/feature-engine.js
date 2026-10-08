/* ════════════════════════════════════════════════════════════════════
   CETI Feature engine — the long-form (feature cut) player, factored out
   --------------------------------------------------------------------
   The clock contract of ceti-explainer, unchanged: ONE clock, every frame a
   pure function of (t, state); build once, mutate only; paused == playing.
   Factored from reference/longform/feature-cut-v2.js so a film is a module,
   not a fork: speed chips, resume, poster frame, reduced motion, chapters,
   captions (never burned in), transcript — plus `state` for interactions.

   Module contract (window.FEATURE):
     meta:     { id, title, dur, poster?, vw=960, vh=540 }
     chapters: [[t, label], …]          captions: [[t0, t1, text], …]
     state:    { …defaults }            controls?: [{ key, label, kind:'toggle'|'range'|'select'|'number', … , jump }]
     build(svg, ctx)                     create every node once
     render(t, ctx)                      ctx = { t, dur, state, rm, ex }
   Workers: window.__ctrl = { play, pause, seek, rerender, setState, duration, time, playing }
   ──────────────────────────────────────────────────────────────────── */
window.CetiFeature = (function () {
  'use strict';
  function cubicBezier(p1x, p1y, p2x, p2y) {
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    const fx = t => ((ax * t + bx) * t + cx) * t, fy = t => ((ay * t + by) * t + cy) * t, dfx = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x;
      for (let i = 0; i < 8; i++) { const e = fx(t) - x; if (Math.abs(e) < 1e-4) break; const d = dfx(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
      return fy(Math.min(1, Math.max(0, t))); };
  }
  const ease = { glaser: cubicBezier(0.22, 1, 0.36, 1), warmIn: cubicBezier(0.4, 0, 0.2, 1), defer: cubicBezier(0.25, 0.46, 0.45, 0.94),
    collect: cubicBezier(0.55, 0, 0.55, 0.2), rest: cubicBezier(0.4, 0, 0.6, 1), linear: t => t };
  const clamp = (v, a = 0, b = 1) => v < a ? a : (v > b ? b : v);
  const lerp = (a, b, p) => a + (b - a) * p;
  /** linear progress through [a,b] (feature-cut `seg`) */
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const ramp = (t, a, d, e) => (e || ease.defer)(prog(t, a, a + d));
  /** scene gate: 0.9 s in, 0.9 s out, inside [r0, r1] */
  const fade = (t, r, f = 0.9) => prog(t, r[0], r[0] + f) * (1 - prog(t, r[1] - f, r[1]));
  /** CetiExplainer ex.seg: fades contained in-window (same-region hand-off through an empty gap) */
  function seg(t, a, b, f = 0.4) { if (b - a <= 2 * f) f = Math.max(1e-4, (b - a) / 2); if (t <= a || t >= b) return 0;
    return Math.min(ease.defer(prog(t, a, a + f)), 1 - ease.collect(prog(t, b - f, b))); }
  const eo = p => 1 - Math.pow(1 - p, 4);
  const eio = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const fmt = s => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const ex = { ease, clamp, lerp, prog, ramp, fade, seg, eo, eio, fmt, cubicBezier };

  function create(cfg) {
    const M = cfg.module, $ = s => document.querySelector(s);
    const svg = cfg.svg, DUR = M.meta.dur, KEY = 'ceti-feature-' + M.meta.id;
    const Q = new URLSearchParams(location.search);
    const FILM = Q.get('film') === '1';
    const RM = !FILM && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = Object.assign({}, M.state || {});
    let t = 0, playing = false, started = FILM, seeking = false, speed = 1, lastCap = null, lastSaved = -9;
    if (RM && $('#rmnote')) $('#rmnote').hidden = false;

    const ctxOf = (tt) => ({ t: tt, dur: DUR, state, rm: RM, film: FILM, ex });
    M.build(svg, ctxOf(0));

    /* chrome */
    const playBtn = $('#play'), scrub = $('#scrub'), timeEl = $('#time'), capEl = $('#cap'), chapWrap = $('#chaps'), spdWrap = $('#speeds');
    if (scrub) { scrub.max = DUR; scrub.step = 0.05; }
    const chapBtns = (M.chapters || []).map((ch, i) => {
      const b = document.createElement('button');
      b.className = 'chip'; b.type = 'button';
      b.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span> ' + ch[1];
      b.addEventListener('click', () => { t = ch[0] + 0.01; started = true; if (!playing && !RM) { playing = true; syncPlay(); } });
      chapWrap && chapWrap.appendChild(b); return b;
    });
    try { const s = parseFloat(localStorage.getItem(KEY + '-speed')); if ([1, 1.25, 1.5].includes(s)) speed = s; } catch (e) {}
    const spdBtns = [1, 1.25, 1.5].map(s => {
      const b = document.createElement('button'); b.className = 'chip speed'; b.type = 'button'; b.textContent = s + '×';
      b.setAttribute('aria-label', 'Playback speed ' + s + 'x');
      b.addEventListener('click', () => { speed = s; try { localStorage.setItem(KEY + '-speed', s); } catch (e) {} syncSpeed(); });
      spdWrap && spdWrap.appendChild(b); return { b, s };
    });
    function syncSpeed() { spdBtns.forEach(o => o.b.setAttribute('aria-pressed', o.s === speed ? 'true' : 'false')); }
    syncSpeed();
    function syncPlay() { if (!playBtn) return; playBtn.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;'; playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play'); }
    playBtn && playBtn.addEventListener('click', () => { if (t >= DUR) t = 0; playing = !playing; started = true; syncPlay(); });
    $('#restart') && $('#restart').addEventListener('click', () => { t = 0; started = true; playing = true; syncPlay(); });
    scrub && scrub.addEventListener('input', () => { seeking = true; t = parseFloat(scrub.value); started = true; render(); });
    scrub && scrub.addEventListener('change', () => { seeking = false; });
    addEventListener('keydown', e => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space' && tag !== 'BUTTON' && tag !== 'SUMMARY') { e.preventDefault(); playBtn.click(); }
      else if (e.key === 'ArrowRight') { t = Math.min(DUR, t + 5); started = true; render(); }
      else if (e.key === 'ArrowLeft') { t = Math.max(0, t - 5); started = true; render(); }
    });

    /* transcript */
    const tr = $('#transcript');
    if (tr) (M.captions || []).forEach(c => { const p = document.createElement('p'); p.innerHTML = '<span class="ts">' + fmt(c[0]) + '</span> ' + c[2]; tr.appendChild(p); });

    /* interaction panel */
    const panel = $('#tryit');
    if (panel && M.controls && M.controls.length) {
      panel.hidden = false;
      const list = panel.querySelector('.controls');
      M.controls.forEach(c => {
        const row = document.createElement('div'); row.className = 'ctl';
        const id = 'ctl-' + c.key;
        let input;
        if (c.kind === 'toggle') { input = document.createElement('button'); input.type = 'button'; input.className = 'tg'; input.setAttribute('role', 'switch');
          const sync = () => { input.setAttribute('aria-checked', state[c.key] ? 'true' : 'false'); input.textContent = state[c.key] ? (c.on || 'on') : (c.off || 'off'); };
          input.addEventListener('click', () => { setState({ [c.key]: !state[c.key] }); sync(); }); sync(); }
        else if (c.kind === 'range') { input = document.createElement('input'); input.type = 'range'; input.min = c.min; input.max = c.max; input.step = c.step; input.value = state[c.key];
          const out = document.createElement('output'); out.textContent = c.format ? c.format(state[c.key]) : state[c.key];
          input.addEventListener('input', () => { const v = parseFloat(input.value); setState({ [c.key]: v }); out.textContent = c.format ? c.format(v) : v; });
          row._out = out; }
        else if (c.kind === 'select') { input = document.createElement('select'); c.options.forEach(o => { const op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; input.appendChild(op); });
          input.value = state[c.key]; input.addEventListener('change', () => setState({ [c.key]: input.value })); }
        else { input = document.createElement('input'); input.type = 'number'; input.value = state[c.key]; input.step = c.step || 1;
          input.addEventListener('input', () => { const v = parseFloat(input.value); if (!Number.isNaN(v)) setState({ [c.key]: v }); }); }
        input.id = id;
        const lab = document.createElement('label'); lab.htmlFor = id; lab.innerHTML = '<b>' + c.label + '</b>' + (c.hint ? '<span>' + c.hint + '</span>' : '');
        const go = document.createElement('button'); go.type = 'button'; go.className = 'chip jump'; go.textContent = 'Show ' + fmt(c.jump);
        go.addEventListener('click', () => { playing = false; syncPlay(); started = true; t = c.jump; render(); });
        row.append(lab, input); if (row._out) row.append(row._out); row.append(go); list.appendChild(row);
      });
      const reset = panel.querySelector('.reset');
      reset && reset.addEventListener('click', () => { Object.assign(state, M.state); list.querySelectorAll('input,select').forEach(i => { const k = i.id.slice(4); i.value = state[k]; }); list.querySelectorAll('.tg').forEach(b => b.click && (state[b.id.slice(4)] !== M.state[b.id.slice(4)]) && b.click()); render(); });
    }
    function setState(patch) { Object.assign(state, patch); render(); }

    function render() {
      const rt = (!started && t === 0 && M.meta.poster != null) ? M.meta.poster : t;
      M.render(rt, ctxOf(rt));
      let c = '';
      if (!started && t === 0) c = 'Press ▶ to start — ' + fmt(DUR) + ' at 1×.';
      else if (t >= DUR - 0.05) c = 'That’s the tour — press ⟲ to watch again.';
      else for (const k of (M.captions || [])) { if (rt >= k[0] && rt < k[1]) { c = k[2]; break; } }
      if (capEl && c !== lastCap) { capEl.textContent = c; lastCap = c; }
      if (scrub && !seeking) scrub.value = t;
      if (timeEl) timeEl.textContent = fmt(t) + ' / ' + fmt(DUR);
      let ai = 0; (M.chapters || []).forEach((ch, i) => { if (t >= ch[0] - 0.01) ai = i; });
      chapBtns.forEach((b, i) => b.setAttribute('aria-current', i === ai ? 'true' : 'false'));
      if (!FILM && started && Math.abs(t - lastSaved) > 0.8) { lastSaved = t; try { localStorage.setItem(KEY + '-t', t.toFixed(1)); } catch (e) {} }
    }
    if (!FILM) { try { const s = parseFloat(localStorage.getItem(KEY + '-t')); if (s > 1 && s < DUR - 1) { t = s; started = true; } } catch (e) {} }
    let last = performance.now();
    function tick(ts) {
      const dt = Math.min(0.05, (ts - last) / 1000); last = ts;
      if (playing) { t = Math.min(DUR, t + dt * speed); if (t >= DUR) { playing = false; syncPlay(); } render(); }
      requestAnimationFrame(tick);
    }
    render();
    requestAnimationFrame(tick);
    const ctrl = {
      play() { started = true; if (t >= DUR) t = 0; playing = true; syncPlay(); },
      pause() { playing = false; syncPlay(); },
      seek(x) { t = clamp(x, 0, DUR); started = true; render(); },
      rerender: render, setState, state,
      get duration() { return DUR; }, get time() { return t; }, get playing() { return playing; },
    };
    window.__ctrl = ctrl;
    return ctrl;
  }
  return { create, ex, ease };
})();
