/* ════════════════════════════════════════════════════════════════════
   P5Film bridge — p5.js layers inside a CETI explainer, on the SAME clock
   --------------------------------------------------------------------
   The engine (engine.js, unchanged) owns time. This bridge wraps the
   episode's build/render so that every render(t) also draws each p5 layer
   at exactly t. Nothing here runs its own loop: p5 instances are created
   with noLoop() and drawn synchronously from render(t).

     P5Film.layer(id, { z, setup(p, L), draw(p, t, L) })
       z < 10 sits under the SVG diagram, z > 10 above it.
       L = { ctx (the canvas 2D context), pal (role colours read from --ex-*),
             data (window.EXPLAINER.data), beats (by id), stream(name),
             seg, ramp, ease, map (viewBox → layer coords helper), film }
       Draw in viewBox units (1000 × 464): the bridge scales for you.

   Film mode (?film=1): chrome-less 1920×1080 frame; the caption band is a
   deterministic HTML layer drawn from t (no CSS transitions). Workers drive
   it through window.__film = { ready(), seek(t), only([groups]), info() }.
   Groups: each p5 layer by its id (or def.group), 'svg', 'html' (caption band), 'bg' (the page ground).
   ──────────────────────────────────────────────────────────────────── */
window.P5Film = (function () {
  const Q = new URLSearchParams(location.search);
  const FILM = Q.get('film') === '1';
  const defs = [];
  const live = [];          // { id, z, def, p, holder, ready, L }
  let content = null, beatsById = {}, lastT = 0, lastCtx = null, stageEl = null, pal = null;
  let readyResolve; const readyP = new Promise(r => (readyResolve = r));
  let pending = 0;

  const VW = () => (content && content.meta && content.meta.vw) || 1000;
  function layer(id, def) { defs.push(Object.assign({ id, z: 0 }, def)); }

  function readPalette() {
    const cs = getComputedStyle(document.documentElement);
    const roles = ['ground', 'ink', 'dim', 'line', 'panel', 'cell', 'accent', 'accent2', 'support', 'peach'];
    const out = {};
    roles.forEach(r => {
      const v = cs.getPropertyValue('--ex-' + r).trim();
      out[r] = v || '#888';
    });
    return out;
  }
  /** css colour → [r,g,b,a] via a 1px canvas (handles rgba(), hex, oklch). */
  const _probe = document.createElement('canvas').getContext('2d');
  function rgba(css, a) {
    _probe.clearRect(0, 0, 1, 1); _probe.fillStyle = '#000'; _probe.fillStyle = css; _probe.fillRect(0, 0, 1, 1);
    const d = _probe.getImageData(0, 0, 1, 1).data;
    const alpha = (d[3] / 255) * (a == null ? 1 : a);
    return `rgba(${d[0]},${d[1]},${d[2]},${alpha.toFixed(4)})`;
  }

  function sizeOf() { const r = stageEl.getBoundingClientRect(); return [Math.max(2, Math.round(r.width)), Math.max(2, Math.round(r.height))]; }

  function mount(stage, opts) {
    stageEl = stage;
    (opts.beats || []).forEach(b => (beatsById[b.id] = b));
    pal = readPalette();
    const svg = stage.querySelector(':scope > svg') || stage.querySelector('svg');
    if (svg) svg.setAttribute('data-group', 'svg');
    const S = window.Studio;
    if (S && S.params) S.params({ seed: (content.film && content.film.seed) || 7 });
    const sorted = defs.slice().sort((a, b) => a.z - b.z);
    pending = sorted.length;
    if (!pending) readyResolve();
    sorted.forEach(def => {
      const holder = document.createElement('div');
      holder.className = 'p5f-layer';
      holder.dataset.layer = def.id;
      holder.dataset.group = def.group || def.id;
      holder.style.zIndex = def.z;
      if (def.z < 10 && svg) stage.insertBefore(holder, svg); else stage.appendChild(holder);
      const rec = { id: def.id, z: def.z, def, holder, ready: false, p: null, L: null };
      live.push(rec);
      // p5 2.x instance mode; setup may be async. noLoop: the explainer clock drives us.
      rec.p = new p5((p) => {
        p.setup = async () => {
          const [w, h] = sizeOf();
          p.createCanvas(w, h);
          p.pixelDensity(FILM ? 1 : Math.min(2, window.devicePixelRatio || 1));
          p.noLoop();
          rec.L = makeL(rec, p);
          if (def.setup) await def.setup(p, rec.L);
          rec.ready = true;
          if (--pending === 0) readyResolve();
          drawLayer(rec, lastT);
        };
        p.draw = () => {};
      }, holder);
    });
    if (!FILM && 'ResizeObserver' in window) {
      new ResizeObserver(() => {
        const [w, h] = sizeOf();
        live.forEach(r => { if (r.ready && (r.p.width !== w || r.p.height !== h)) { r.p.resizeCanvas(w, h); if (r.def.resize) r.def.resize(r.p, r.L); drawLayer(r, lastT); } });
      }).observe(stage);
    }
  }

  function makeL(rec, p) {
    const S = window.Studio;
    return {
      get ctx() { return p.drawingContext; },
      get pal() { return pal; },
      rgba,
      data: content.data || {},
      beats: beatsById,
      film: FILM,
      stream: (name) => S.stream(rec.id + ':' + name),
      seg: S.seg, ramp: S.ramp, ease: S.ease,
      lerp: (a, b, t) => a + (b - a) * t,
      clamp: (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)),
      get scale() { return p.width / VW(); },
      vw: VW(), vh: (content.meta && content.meta.vh) || 464,
      get math() { return content.__math !== false; },
    };
  }

  function drawLayer(rec, t) {
    if (!rec.ready) return;
    const p = rec.p, ctx = p.drawingContext, d = p.pixelDensity();
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, p.width * d, p.height * d);
    const k = (p.width / VW()) * d;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    try { rec.def.draw(p, t, rec.L, lastCtx); }
    catch (e) { window.__error = 'layer ' + rec.id + ': ' + e.message; console.error(e); }
    ctx.restore();
  }

  /* camera: optional content.film.camera(t) → {s, x, y} (scale about stage centre, offsets in viewBox units) */
  function camera(t) {
    const cam = content.film && content.film.camera;
    if (!cam || !stageEl) return;
    const c = cam(t, beatsById) || { s: 1, x: 0, y: 0 };
    const k = stageEl.getBoundingClientRect().width / VW();
    stageEl.style.transform = `translate(${(c.x || 0) * k}px, ${(c.y || 0) * k}px) scale(${c.s || 1})`;
  }

  /* film caption band — deterministic HTML layer */
  let cap = null;
  function buildCaption() {
    if (!FILM || !content.beats || !document.querySelector('.ex-stage-frame')) return;
    cap = document.createElement('div');
    cap.className = 'film-cap';
    cap.dataset.group = 'html';
    cap.innerHTML = '<div class="film-cap__rail"><i></i></div>' +
      '<div class="film-cap__meta"><span class="n"></span><span class="l"></span></div>' +
      '<p class="film-cap__text"><span class="a"></span><span class="b"></span></p>' +
      '<div class="film-cap__brand"><b></b><span></span></div>';
    document.querySelector('.ex-stage-frame').appendChild(cap);
    const m = content.meta;
    cap.querySelector('.film-cap__brand b').textContent = (m.eyebrow || '').toUpperCase();
    cap.querySelector('.film-cap__brand span').textContent = m.tag || '';
  }
  function renderCaption(t, ctx) {
    if (!cap || !ctx || !ctx.beats) return;
    const S = window.Studio, B = ctx.beats, i = ctx.activeBeat, b = B[i];
    const prev = i > 0 ? B[i - 1] : null;
    // outgoing caption fades over 0.25 s after the cut, incoming rises 0.15 s later (no overlap of legibility)
    const inP = S.ramp(t, b.start + 0.12, 0.5, S.ease.glaser);
    const outP = prev ? 1 - S.ramp(t, b.start, 0.22, S.ease.collect) : 0;
    const A = cap.querySelector('.a'), Bn = cap.querySelector('.b');
    if (A.textContent !== b.caption) A.textContent = b.caption;
    A.style.opacity = inP; A.style.transform = `translateY(${(1 - inP) * 10}px)`;
    if (prev) { if (Bn.textContent !== prev.caption) Bn.textContent = prev.caption; Bn.style.opacity = outP; } else Bn.style.opacity = 0;
    cap.querySelector('.n').textContent = String(i + 1).padStart(2, '0');
    cap.querySelector('.l').textContent = b.label;
    cap.querySelector('.film-cap__rail i').style.width = (t / ctx.duration * 100).toFixed(3) + '%';
  }

  function renderAll(t, ctx) {
    lastT = t; lastCtx = ctx;
    for (const r of live) drawLayer(r, t);
    camera(t);
    renderCaption(t, ctx);
  }

  /** Wrap the episode module. Call after the module and layers are defined, before CetiExplainer.create. */
  function install(mod) {
    content = mod;
    const b0 = mod.build, r0 = mod.render, m0 = mod.setMath || mod.setDetail;
    mod.build = function (stage, opts) {
      b0.call(this, stage, opts);
      const host = (stage && stage.tagName && stage.tagName.toLowerCase() === 'svg') ? stage.parentElement : stage;
      mount(host, opts || {}); buildCaption();
    };
    mod.render = function (t, ctx) { r0.call(this, t, ctx); renderAll(t, ctx); };
    if (m0) mod.setMath = function (on) { mod.__math = on; return m0.call(this, on); };
    return mod;
  }

  /* worker API */
  const groups = () => Array.from(document.querySelectorAll('[data-group]'));
  window.__film = {
    ready: async () => { await readyP; if (document.fonts) await document.fonts.ready; return true; },
    seek: (t) => { const c = window.__ctrl; c.pause(); c.seek(t); return { t, error: window.__error || null }; },
    only: (list) => {
      const on = new Set(list || []);
      document.body.classList.toggle('film-iso', !!list);
      document.body.classList.toggle('iso-ground', !!list && on.has('bg'));
      groups().forEach(el => { el.style.opacity = (!list || on.has(el.dataset.group)) ? '' : '0'; }); // opacity, not visibility: an SVG child with visibility=visible would override a hidden parent
      return true;
    },
    info: () => ({ duration: window.__ctrl.duration, beats: window.__ctrl.beats.map(b => ({ id: b.id, label: b.label, start: b.start, end: b.end })),
      layers: live.map(r => ({ id: r.id, z: r.z, group: r.holder.dataset.group })), focal: (content.film && content.film.focal) || null }),
  };

  if (FILM) document.documentElement.classList.add('is-film');
  return { layer, install, rgba, FILM };
})();
