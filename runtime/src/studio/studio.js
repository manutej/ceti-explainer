
/* ceti-p5-studio runtime */
/*!
 * studio.js — ceti-p5-studio runtime  v0.2.0  (target: p5.js 2.3.x)
 * One file, no dependencies. Load AFTER p5 (p5.min.js first, then studio.js).
 *
 * What it gives every sketch (global or instance mode):
 *   Studio.params(defaults)      URL-driven config (?seed=&w=&h=&d=&frames=&t=&mode=&p.name=)
 *   Studio.stream(name)          independent seeded random streams (structure ≠ detail ≠ colour)
 *   stream.uniform/gauss/pareto/weighted/chance/pick/shuffle/int
 *   Studio.poissonDisc(...)      blue-noise placement (Bridson 2007)
 *   Studio.palette(spec)         role-weighted OKLCH palettes, or roles read from CSS tokens
 *   Studio.seg(t,a,b,f) · Studio.ramp(t,s,d,e)   explainer timing (ex.seg/ex.ramp ports); ease.{glaser,warmIn,defer,collect,rest}
 *   Studio.clock(cfg)            still | loop (pure function of t) | sim (fixed dt) | scroll
 *   Studio.harness(p, cfg)       __done / __renderFrame / __meta / __error contract for headless renders
 *   Studio.svg                   path recorder → plotter-ready SVG (p5.js-svg is broken on 2.x)
 *   Studio.ease                  easings named by ROLE, not by brand
 *   Studio.a11y(p, text)         describe() + reduced-motion flag
 *   Studio.rgb(css) / pal.rgb()  numeric colour for shaders, alpha helper pal.alpha(name, a)
 *   Studio.presets               named palette sources in OKLCH (brand + non-brand grounds — fight the house look)
 *   Studio.fft / Studio.stft     offline analysis for the Listen unit (synthesized or recorded signals)
 *   Studio.gestures(stream, …)   scripted pointer Signal for deterministic renders of interactive pieces
 *   Studio.live(p) / Studio.host(p, …)   resume live play after a still; host contract (window.__sketch)
 * Doctrine: the harness never decides aesthetics; it makes every output reproducible, measurable, exportable.
 */
(function (root) {
  'use strict';
  const VERSION = '0.2.0';

  // ---------- hashing + PRNG (sfc32 seeded by cyrb128) ----------
  function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
  }
  function sfc32(a, b, c, d) {
    return function () {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      let t = (a + b) | 0;
      a = b ^ (b >>> 9); b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11); d = (d + 1) | 0;
      t = (t + d) | 0; c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  let _seed = 1;
  const _streams = {};
  /** A named, independent random stream. Same seed + same name ⇒ same sequence, regardless of call order elsewhere. */
  function stream(name) {
    name = String(name || 'main');
    if (_streams[name]) return _streams[name];
    const r = sfc32(...cyrb128(_seed + '::' + name));
    for (let i = 0; i < 12; i++) r(); // warm up
    let spare = null;
    const s = {
      name,
      next: r,
      uniform(a = 0, b = 1) { return a + (b - a) * r(); },
      int(a, b) { return Math.floor(a + (b - a + 1) * r()); },
      chance(p = 0.5) { return r() < p; },
      /** Gaussian (Box–Muller). Hobbs: "about the same, with outliers". */
      gauss(mean = 0, sd = 1) {
        if (spare !== null) { const v = spare; spare = null; return mean + sd * v; }
        let u = 0, v = 0; while (u === 0) u = r(); v = r();
        const m = Math.sqrt(-2 * Math.log(u));
        spare = m * Math.sin(2 * Math.PI * v);
        return mean + sd * m * Math.cos(2 * Math.PI * v);
      },
      /** Pareto / power law: many small, few large. alpha≈1.2–3, xm = minimum. Optional cap. */
      pareto(xm = 1, alpha = 2, cap = Infinity) { return Math.min(cap, xm / Math.pow(1 - r(), 1 / alpha)); },
      /** Weighted choice. items: array; weights: array of numbers (need not sum to 1). */
      weighted(items, weights) {
        const tot = weights.reduce((a, b) => a + b, 0); let x = r() * tot;
        for (let i = 0; i < items.length; i++) { x -= weights[i]; if (x <= 0) return items[i]; }
        return items[items.length - 1];
      },
      pick(arr) { return arr[Math.floor(r() * arr.length)]; },
      shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    };
    _streams[name] = s;
    return s;
  }

  /** Bridson Poisson-disc sampling in a w×h box; minimum distance r. Returns [[x,y],...]. */
  function poissonDisc(w, h, r, rng = stream('poisson'), k = 30, accept = null) {
    const cell = r / Math.SQRT2, gw = Math.ceil(w / cell), gh = Math.ceil(h / cell);
    const grid = new Int32Array(gw * gh).fill(-1), pts = [], active = [];
    const add = (x, y) => { pts.push([x, y]); active.push(pts.length - 1); grid[Math.floor(y / cell) * gw + Math.floor(x / cell)] = pts.length - 1; };
    let x0 = rng.uniform(0, w), y0 = rng.uniform(0, h), tries = 0;
    while (accept && !accept(x0, y0) && tries++ < 1000) { x0 = rng.uniform(0, w); y0 = rng.uniform(0, h); }
    add(x0, y0);
    while (active.length) {
      const ai = Math.floor(rng.next() * active.length), [px, py] = pts[active[ai]];
      let found = false;
      for (let t = 0; t < k; t++) {
        const a = rng.uniform(0, Math.PI * 2), d = rng.uniform(r, 2 * r);
        const x = px + Math.cos(a) * d, y = py + Math.sin(a) * d;
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        if (accept && !accept(x, y)) continue;
        const gx = Math.floor(x / cell), gy = Math.floor(y / cell); let ok = true;
        for (let yy = Math.max(0, gy - 2); yy <= Math.min(gh - 1, gy + 2) && ok; yy++)
          for (let xx = Math.max(0, gx - 2); xx <= Math.min(gw - 1, gx + 2); xx++) {
            const j = grid[yy * gw + xx]; if (j < 0) continue;
            const dx = pts[j][0] - x, dy = pts[j][1] - y; if (dx * dx + dy * dy < r * r) { ok = false; break; }
          }
        if (ok) { add(x, y); found = true; break; }
      }
      if (!found) active.splice(ai, 1);
    }
    return pts;
  }

  // ---------- params ----------
  let _params = null;
  /** Merge defaults with URL (?seed=…&w=…&p.name=…). Sets the global seed for streams. */
  function params(defaults = {}) {
    const q = (typeof location !== 'undefined') ? new URLSearchParams(location.search) : new URLSearchParams('');
    const num = (k, d) => (q.has(k) && q.get(k) !== '' && !isNaN(+q.get(k))) ? +q.get(k) : d;
    const out = Object.assign({ seed: 1, w: 1080, h: 1350, d: 1, frames: 1, fps: 30, t: null, mode: 'still' }, defaults);
    out.seed = num('seed', out.seed); out.w = num('w', out.w); out.h = num('h', out.h);
    out.d = num('d', out.d); out.frames = num('frames', out.frames); out.fps = num('fps', out.fps);
    if (q.has('t')) out.t = num('t', out.t);
    if (q.has('mode')) out.mode = q.get('mode');
    out.render = q.has('render');              // set by render.py: headless, stop after the requested frames
    out.live = !out.render;
    out.p = Object.assign({}, defaults.p || {});
    for (const [k, v] of q.entries()) if (k.startsWith('p.')) out.p[k.slice(2)] = isNaN(+v) ? v : +v;
    _seed = out.seed; for (const k in _streams) delete _streams[k];
    _params = out;
    return out;
  }

  // ---------- colour ----------
  const _rgbCache = {};
  let _ctx = null;
  /** Any CSS colour (hex, rgb(), oklch(… / a), named) → [r, g, b, a] in 0–255 (a in 0–1). Uses the browser's own parser. */
  function rgb(css) {
    if (_rgbCache[css]) return _rgbCache[css];
    if (!_ctx) { const c = document.createElement('canvas'); c.width = c.height = 1; _ctx = c.getContext('2d', { willReadFrequently: true }); }
    _ctx.clearRect(0, 0, 1, 1); _ctx.fillStyle = '#000'; _ctx.fillStyle = css; _ctx.fillRect(0, 0, 1, 1);
    const d = _ctx.getImageData(0, 0, 1, 1).data;
    return (_rgbCache[css] = [d[0], d[1], d[2], +(d[3] / 255).toFixed(3)]);
  }
  const hex = (css) => { const [r, g, b] = rgb(css); return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join(''); };
  /** CSS colour with a new alpha (works for oklch/hex/rgb). */
  function withAlpha(css, a) { const [r, g, b] = rgb(css); return `rgba(${r},${g},${b},${a})`; }

  /** spec forms:
   *   { ground, roles:[{name, color, weight}], source }            — colours as OKLCH/CSS strings
   *   { preset:'cyanotype' }                                        — one of Studio.presets
   *   { css:['--ex-ground','--ex-accent'], weights:[…] }            — host tokens, names derived from the var
   *   { css:{ ink:'--ex-ink', accent:'--ex-accent' }, weights:{…} }  — host tokens mapped to YOUR role names
   *  Returns { ground, roles, source, pick(stream), byName(n), list(), rgb(n), alpha(n, a), hex(n) }. */
  function palette(spec) {
    if (spec.preset) { const pr = presets[spec.preset]; if (!pr) throw new Error('Studio.palette: unknown preset ' + spec.preset); spec = Object.assign({}, pr, spec); }
    let roles = [];
    if (spec.css) {
      const cs = getComputedStyle(document.documentElement);
      const entries = Array.isArray(spec.css) ? spec.css.map(v => [v.replace(/^--/, ''), v]) : Object.entries(spec.css);
      const W = spec.weights || {};
      roles = entries.map(([name, v], i) => ({ name, color: cs.getPropertyValue(v).trim() || (spec.fallback && spec.fallback[name]) || '#888', weight: (Array.isArray(W) ? W[i] : W[name]) ?? 1 }));
    } else roles = (spec.roles || []).map(r => Object.assign({ weight: 1 }, r));
    const ground = spec.ground || (roles[0] && roles[0].color) || '#f5efe3';
    const get = (n) => { const r = roles.find(x => x.name === n); return r ? r.color : (n === 'ground' ? ground : n); };
    const weighted = roles.filter(r => r.weight > 0);
    return {
      ground, roles, source: spec.source || 'unstated',
      pick(rng = stream('colour')) { return rng.weighted(weighted.map(r => r.color), weighted.map(r => r.weight)); },
      byName(n) { const r = roles.find(x => x.name === n); return r ? r.color : null; },
      list() { return roles.map(r => r.color); },
      rgb(n) { return rgb(get(n)); },
      rgb01(n) { const [r, g, b, a] = rgb(get(n)); return [r / 255, g / 255, b / 255, a]; },
      hex(n) { return hex(get(n)); },
      alpha(n, a) { return withAlpha(get(n), a); },
    };
  }

  /** Named palette sources (OKLCH). Brand presets convert the verbatim tokens in references/integration.md.
   *  The non-brand sources exist to push a series OFF the studio's default (cream + hairline + vermilion). */
  const presets = {
    'ceti-dark':   { source: 'CETI explainer --ex-* roles', ground: 'oklch(0.173 0.009 264.3)', roles: [
      { name: 'ink', color: 'oklch(0.954 0.017 84.6)', weight: 6 }, { name: 'dim', color: 'oklch(0.689 0.026 83.4)', weight: 3 },
      { name: 'copper', color: 'oklch(0.725 0.089 63.4)', weight: 1.5 }, { name: 'sage', color: 'oklch(0.705 0.059 137.1)', weight: 1 },
      { name: 'support', color: 'oklch(0.628 0.054 246.9)', weight: 0.6 }] },
    'ceti-paper':  { source: 'CETI marketing --mk-* (light)', ground: 'oklch(0.954 0.017 84.6)', roles: [
      { name: 'deep-sea', color: 'oklch(0.242 0.030 269.9)', weight: 6 }, { name: 'copper', color: 'oklch(0.609 0.075 55.9)', weight: 2 },
      { name: 'sage', color: 'oklch(0.630 0.054 137.0)', weight: 1.5 }, { name: 'rust', color: 'oklch(0.484 0.098 43.0)', weight: 0.8 },
      { name: 'slate', color: 'oklch(0.381 0.037 244.4)', weight: 1 }] },
    'ceti-silver': { source: 'CETI Silver — one gold light', ground: 'oklch(0.215 0.019 309.9)', roles: [
      { name: 'ink', color: 'oklch(0.943 0.017 79.4)', weight: 6 }, { name: 'gold', color: 'oklch(0.754 0.122 83.6)', weight: 1 },
      { name: 'dim', color: 'oklch(0.507 0.026 314.6)', weight: 3 }] },
    'glaser-paper': { source: 'milton CETI × Glaser preset', ground: 'oklch(0.977 0.007 80.7)', roles: [
      { name: 'ink', color: 'oklch(0.213 0.006 91.6)', weight: 6 }, { name: 'vermilion', color: 'oklch(0.582 0.184 32.1)', weight: 1 },
      { name: 'cobalt', color: 'oklch(0.481 0.135 260.3)', weight: 1 }, { name: 'sunflower', color: 'oklch(0.799 0.144 84.8)', weight: 0.7 },
      { name: 'forest', color: 'oklch(0.491 0.083 150.0)', weight: 0.7 }] },
    // non-brand named sources (process / material / place) — approximations, named as such
    'cyanotype':   { source: 'cyanotype print: Prussian blue ground, paper-white exposure', ground: 'oklch(0.33 0.09 255)', roles: [
      { name: 'white', color: 'oklch(0.93 0.02 230)', weight: 6 }, { name: 'mid', color: 'oklch(0.58 0.08 245)', weight: 3 }, { name: 'stain', color: 'oklch(0.78 0.06 85)', weight: 0.5 }] },
    'riso-fluoro': { source: 'risograph: fluorescent pink + federal blue on newsprint grey', ground: 'oklch(0.90 0.008 95)', roles: [
      { name: 'blue', color: 'oklch(0.42 0.13 262)', weight: 5 }, { name: 'pink', color: 'oklch(0.70 0.20 1)', weight: 3 }, { name: 'overprint', color: 'oklch(0.38 0.12 300)', weight: 1 }] },
    'kraft-graphite': { source: 'graphite and white chalk on kraft card', ground: 'oklch(0.68 0.06 70)', roles: [
      { name: 'graphite', color: 'oklch(0.32 0.01 260)', weight: 6 }, { name: 'chalk', color: 'oklch(0.95 0.01 90)', weight: 2 }, { name: 'shadow', color: 'oklch(0.52 0.05 60)', weight: 2 }] },
    'verdigris':   { source: 'weathered copper: verdigris over oxidised brown', ground: 'oklch(0.30 0.04 40)', roles: [
      { name: 'patina', color: 'oklch(0.72 0.09 175)', weight: 5 }, { name: 'pale', color: 'oklch(0.86 0.05 165)', weight: 2 }, { name: 'copper', color: 'oklch(0.60 0.12 50)', weight: 1 }] },
    'oxblood-bone': { source: 'oxblood lacquer and bone', ground: 'oklch(0.30 0.09 20)', roles: [
      { name: 'bone', color: 'oklch(0.90 0.025 85)', weight: 6 }, { name: 'ember', color: 'oklch(0.55 0.14 30)', weight: 2 }, { name: 'soot', color: 'oklch(0.18 0.02 30)', weight: 2 }] },
    'sodium-night': { source: 'sodium streetlight on wet asphalt', ground: 'oklch(0.20 0.015 250)', roles: [
      { name: 'sodium', color: 'oklch(0.78 0.15 70)', weight: 4 }, { name: 'wet', color: 'oklch(0.45 0.03 240)', weight: 4 }, { name: 'cold', color: 'oklch(0.70 0.05 220)', weight: 1 }] },
  };

  // ---------- easing by role ----------
  const ease = {
    settle: t => 1 - Math.pow(1 - t, 3),                 // arrives and rests
    breathe: t => 0.5 - 0.5 * Math.cos(Math.PI * 2 * t),   // loop-safe 0→1→0
    emphasis: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    linear: t => t,
  };
  // CETI explainer eases — identical cubic-bezier sampler to ceti-explainer/engine.js, so p5 layers and SVG agree.
  function cubicBezier(p1x, p1y, p2x, p2y) {
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    const fx = t => ((ax * t + bx) * t + cx) * t, fy = t => ((ay * t + by) * t + cy) * t, dfx = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x;
      for (let i = 0; i < 8; i++) { const e = fx(t) - x; if (Math.abs(e) < 1e-4) break; const d = dfx(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
      return fy(Math.min(1, Math.max(0, t))); };
  }
  Object.assign(ease, { glaser: cubicBezier(0.22, 1, 0.36, 1), warmIn: cubicBezier(0.4, 0, 0.2, 1),
    defer: cubicBezier(0.25, 0.46, 0.45, 0.94), collect: cubicBezier(0.55, 0, 0.55, 0.2), rest: cubicBezier(0.4, 0, 0.6, 1), cubicBezier });

  /** Port of ceti-explainer ex.seg: 0 outside [a,b], fades CONTAINED inside the window (defer up, collect down).
   *  Same-region scenes hand off through an empty gap — the p5 side of the explainer's §15b rule. */
  function seg(t, a, b, f = 0.4) {
    if (b - a <= 2 * f) f = Math.max(1e-4, (b - a) / 2);
    if (t <= a || t >= b) return 0;
    const w = (x, e) => e(Math.min(1, Math.max(0, x)));
    return Math.min(w((t - a) / f, ease.defer), 1 - w((t - (b - f)) / f, ease.collect));
  }
  /** ramp(t, start, dur, e) — 0→1 over dur seconds (explainer ex.ramp). */
  function ramp(t, start, dur, e) { const x = Math.min(1, Math.max(0, (t - start) / Math.max(1e-6, dur))); return (e || ease.defer)(x); }

  // ---------- clock ----------
  /** mode: 'still' (one frame), 'loop' (t = frame/fps, wraps at period — draw must be a pure function of t),
   *  'sim' (fixed dt steps; deterministic replay from frame 0), 'scroll' (t from host). */
  function clock(cfg = {}) {
    const c = Object.assign({ mode: (_params && _params.mode) || 'still', fps: (_params && _params.fps) || 30, period: 8, dt: 1 / 60, rate: 1 }, cfg);
    c.frame = 0; c.t = (_params && _params.t != null) ? _params.t : 0; c._hold = (_params && _params.t != null);
    const at = (self, i) => self.mode === 'loop' ? ((i / self.fps) * self.rate) % self.period : i * self.dt * self.rate;
    /** Advance one frame — unless a host/harness just set t (at/renderAt), in which case hold it for this draw. */
    c.tick = function () { if (this._hold) { this._hold = false; return this.t; } this.frame++; this.t = at(this, this.frame); return this.t; };
    c.at = function (i) { this.frame = i; this.t = at(this, i); this._hold = true; return this.t; };
    c.set = function (t) { this.t = t; this._hold = true; return t; };
    c.phase = function () { return this.mode === 'loop' ? this.t / this.period : 0; };
    if (typeof window !== 'undefined') window.__studioClock = c;
    return c;
  }

  // ---------- harness contract ----------
  /** Call once at the END of setup(). cfg: { sketch, frames, clock, meta:{…}, onFrame:(i)=>void }.
   *  Installs window.__meta, __done, __error, __renderFrame. p = p5 instance (or the global p5 instance in global mode). */
  function harness(p, cfg = {}) {
    const W = (typeof window !== 'undefined') ? window : {};
    W.__done = false;
    W.__meta = Object.assign({
      studio: VERSION, p5: (typeof p5 !== 'undefined' && p5.VERSION) || 'unknown',
      sketch: cfg.sketch || 'untitled', seed: _seed, params: _params,
      palette: cfg.palette ? { source: cfg.palette.source, roles: cfg.palette.roles } : null,
      clock: cfg.clock ? cfg.clock.mode : 'still', created: null,
    }, cfg.meta || {});
    const frames = cfg.frames ?? (_params ? _params.frames : 1);
    if (cfg.clock) W.__studioClock = cfg.clock;
    W.__studioFrames = frames;
    // Deterministic frame stepping for video/scrub: set t then await redraw() (async in p5 2.x).
    W.__renderFrame = async (i) => {
      if (p.isLooping && p.isLooping()) p.noLoop();   // stepping owns time now
      if (cfg.clock) cfg.clock.at(i);
      if (cfg.onFrame) cfg.onFrame(i);
      await p.redraw();
      return true;
    };
    return W.__meta;
  }
  /** Call at the end of draw(). Marks __done after the requested frames.
   *  still → stops the loop · loop/sim → keeps playing live, stops only in headless renders (?render) ·
   *  after Studio.live(p) (e.g. first user interaction) it never stops the loop again. */
  function frameDone(p) {
    const W = window, P = _params || {};
    if (p.frameCount >= (W.__studioFrames || 1)) {
      W.__done = true;
      if (W.__studioLive) return;
      const mode = (W.__studioClock && W.__studioClock.mode) || P.mode || 'still';
      if (mode === 'still' || P.render) p.noLoop();
    }
  }
  /** Resume live play (interactive pieces after a still): call from the first input handler. */
  function live(p) { if (typeof window !== 'undefined') window.__studioLive = true; p.loop(); }
  /** Host contract (ceti-explainer, field-story, scroll explainers, silver-hero): installs window.__sketch.
   *  renderAt(t) stops free-running play and draws exactly time t; setState(s) is the single mutator; rate(k) scales time. */
  function host(p, cfg = {}) {
    const c = cfg.clock;
    const api = {
      renderAt: async (t) => { if (p.isLooping()) p.noLoop(); if (c) c.set(t); await p.redraw(); return true; },
      setState: (s) => { if (cfg.setState) cfg.setState(s); p.redraw(); },
      rate: (k) => { if (c) c.rate = k; },
      still: () => { if (cfg.still) cfg.still(); p.redraw(); },
      play: () => live(p),
      pause: () => p.noLoop(),
    };
    if (typeof window !== 'undefined') window.__sketch = api;
    return api;
  }
  if (typeof window !== 'undefined') {
    window.__error = null;
    window.addEventListener('error', e => { window.__error = String(e.message || e); window.__done = true; });
    window.addEventListener('unhandledrejection', e => { window.__error = String(e.reason); window.__done = true; });
  }

  /** Provenance-stamped filename: <sketch>_s<seed>_<w>x<h>.<ext> */
  function filename(ext = 'png', sketch) {
    const m = (typeof window !== 'undefined' && window.__meta) || {};
    const P = _params || {};
    return `${sketch || m.sketch || 'sketch'}_s${_seed}_${P.w || 0}x${P.h || 0}.${ext}`;
  }

  // ---------- SVG path recorder (plotter / draw-on ready) ----------
  function rdp(pts, eps) {   // Ramer–Douglas–Peucker simplification
    if (pts.length < 3 || !eps) return pts;
    const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
    let dmax = 0, idx = 0; const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / L; if (d > dmax) { dmax = d; idx = i; } }
    if (dmax <= eps) return [pts[0], pts[pts.length - 1]];
    return rdp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(pts.slice(idx), eps));
  }
  const svg = (function () {
    let W = 0, H = 0, items = [], layers = {};
    const f = n => (Math.round(n * 100) / 100).toString();
    const col = c => { try { return c === 'none' || c === 'currentColor' ? c : hex(c); } catch (e) { return c; } };
    return {
      begin(w, h) { W = w; H = h; items = []; layers = {}; },
      /** points: [[x,y],…]; opts: {stroke, width, closed, fill, layer, dash:[on,off]} */
      path(points, o = {}) {
        if (!points || points.length < 2) return;
        const it = { tag: 'path', pts: points.map(p => [p[0], p[1]]), closed: !!o.closed, stroke: o.stroke || '#000', width: o.width || 1, fill: o.fill || 'none', layer: o.layer || 'ink', dash: o.dash || null };
        items.push(it); (layers[it.layer] = layers[it.layer] || []).push(it);
      },
      circle(x, y, r, o = {}) {
        const it = { tag: 'circle', x, y, r, stroke: o.stroke || '#000', width: o.width || 1, fill: o.fill || 'none', layer: o.layer || 'ink' };
        items.push(it); (layers[it.layer] = layers[it.layer] || []).push(it);
      },
      count() { return items.length; },
      /** opts: plotter (one <g> layer per pen; fills dropped; dashes expanded) · keepFill · simplify (px tolerance) ·
       *  mm:[w,h] physical size for the plotter · currentColor (stroke="currentColor" for draw-on hosts) */
      toString(opts = {}) {
        const plot = !!opts.plotter, eps = opts.simplify || 0;
        const g = Object.entries(layers).map(([name, arr]) => {
          const body = arr.map(it => {
            const fill = plot && !opts.keepFill ? 'none' : col(it.fill);
            const stroke = opts.currentColor ? 'currentColor' : col(it.stroke);
            const common = `fill="${fill}" stroke="${stroke}" stroke-width="${f(it.width)}" stroke-linecap="round" stroke-linejoin="round"`;
            if (it.tag === 'circle') return `<circle cx="${f(it.x)}" cy="${f(it.y)}" r="${f(it.r)}" ${common}/>`;
            const pts = rdp(it.pts, eps);
            const d = 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L') + (it.closed ? 'Z' : '');
            const dash = it.dash && !plot ? ` stroke-dasharray="${it.dash.join(' ')}"` : '';
            return `<path class="line" d="${d}" ${common}${dash}/>`;
          }).join('\n');
          return `<g id="${name}" inkscape:groupmode="layer" inkscape:label="${name}">\n${body}\n</g>`;
        }).join('\n');
        const meta = (typeof window !== 'undefined' && window.__meta) ? `<desc>${JSON.stringify({ sketch: window.__meta.sketch, seed: window.__meta.seed, studio: VERSION })}</desc>` : '';
        const size = opts.mm ? `width="${opts.mm[0]}mm" height="${opts.mm[1]}mm"` : `width="${W}" height="${H}"`;
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ${size} viewBox="0 0 ${W} ${H}">${meta}\n${g}\n</svg>`;
      },
      download(name, opts) {
        const blob = new Blob([this.toString(opts)], { type: 'image/svg+xml' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name || filename('svg'); a.click();
      },
    };
  })();

  // ---------- signals: offline analysis (Listen unit) + scripted input ----------
  /** In-place radix-2 FFT. re, im: Float64Array of length 2^k. */
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
    for (let len = 2; len <= n; len <<= 1) {
      const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
      for (let i = 0; i < n; i += len) { let cr = 1, ci = 0;
        for (let k = 0; k < len / 2; k++) { const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
          re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } }
    }
  }
  /** Short-time Fourier transform of a mono signal (Float32Array/Array). Returns {mags: Float32Array[] (size/2 bins each), size, hop, sampleRate}. */
  function stft(samples, { size = 1024, hop = 256, sampleRate = 8000 } = {}) {
    const win = new Float64Array(size).map((_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1)));
    const mags = [];
    for (let s = 0; s + size <= samples.length; s += hop) {
      const re = new Float64Array(size), im = new Float64Array(size);
      for (let i = 0; i < size; i++) re[i] = samples[s + i] * win[i];
      fft(re, im);
      const m = new Float32Array(size / 2); for (let i = 0; i < size / 2; i++) m[i] = Math.hypot(re[i], im[i]) / size;
      mags.push(m);
    }
    return { mags, size, hop, sampleRate, binHz: sampleRate / size };
  }
  /** Scripted pointer Signal for deterministic renders: count gestures of eased, noisy strokes.
   *  Returns [{t, x, y, pressure, down}] sampled every dt seconds. Replay it through the SAME code path live input uses. */
  function gestures(rng, { count = 4, w = 1000, h = 1000, duration = 12, dt = 1 / 60, margin = 0.06 } = {}) {
    const out = []; let t = 0;
    for (let g = 0; g < count; g++) {
      const len = rng.uniform(0.8, 2.6), pause = rng.uniform(0.2, 1.0);
      const x0 = rng.uniform(margin, 1 - margin) * w, y0 = rng.uniform(margin, 1 - margin) * h;
      const ang = rng.uniform(0, Math.PI * 2), reach = rng.pareto(0.15, 2.2, 0.8) * Math.min(w, h);
      const bend = rng.gauss(0, 0.6);
      for (let u = 0; u <= 1; u += dt / len) {
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        const a = ang + bend * Math.sin(Math.PI * e);
        out.push({ t, x: x0 + Math.cos(a) * reach * e, y: y0 + Math.sin(a) * reach * e, pressure: 0.35 + 0.65 * Math.sin(Math.PI * u), down: true });
        t += dt;
      }
      t += pause; if (t > duration) break;
    }
    return out;
  }

  // ---------- accessibility ----------
  function a11y(p, text, opts = {}) {
    const reduced = (typeof matchMedia !== 'undefined') && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (text && p.describe) p.describe(text, opts.label || undefined);
    return { reducedMotion: reduced };
  }

  /** Convenience: apply the standard determinism block. Call first in setup(). */
  function begin(p, P) {
    p.createCanvas(P.w, P.h, P.renderer || p.P2D);
    p.pixelDensity(P.d);
    p.randomSeed(P.seed);
    p.noiseSeed(P.seed);
  }

  root.Studio = { VERSION, seg, ramp, params, stream, poissonDisc, palette, presets, rgb, hex, withAlpha, ease, clock, harness, frameDone, live, host,
    filename, svg, rdp, fft, stft, gestures, a11y, begin, _hash: cyrb128 };
})(typeof window !== 'undefined' ? window : globalThis);


