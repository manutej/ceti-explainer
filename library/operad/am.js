/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   AM · the Atelier module library core (v0.1). Loaded after runtime/atelier.js, before materials, modules, cameras
   and compose.js. Everything here is pure: no clock reads, no Math.random; caches are keyed by inputs only.

     AM.module(def) / AM.material(def) / AM.camera(def)   registries (compose.js reads them)
     AM.Number(o)                                          the only way a result reaches the screen (belief law)
     AM.layout                                             grid / rack / macro packing, rack geometry, morphs
     AM.runs(A)                                            per-run facts from an AgentLoop (fail steps, catches)
     AM.items(...)                                         unit states at a progress s — what Material.units() draws
     AM.cam                                                camera algebra: {x, y, z} world centre + zoom
     AM.canvas(key, k)                                     a CPU (willReadFrequently) canvas cached by key + scale
     AM.guardText(str, o)                                  belief + legibility guards wrapped around Material.text
   Design units: 960×540 world; camera maps world → screen.
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM = root.AM || {};
  AM.VERSION = '0.1.0';
  AM.modules = AM.modules || {};
  AM.materials = AM.materials || {};
  AM.cameras = AM.cameras || {};
  const U = () => root.Atelier.U;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, u) => a + (b - a) * u;
  AM.clamp = clamp; AM.lerp = lerp;

  /* ── object types (port colours) — mirrored in operad.json ── */
  AM.TYPES = {
    Params: 'engine parameters {N, k, p, c, retry, seed} (+ perStep p[])',
    Ensemble: 'an AgentLoop instance + its params: twin worlds on common random numbers',
    Run: 'one run id r with its events in both worlds',
    Trace: 'a labelled-sketch worked run: {goal, steps:[{j, kind, text}], k, failAt, r}',
    Arrangement: 'unit rects over time: {kind: grid|rack, world, rects Float32Array(4N), order?}',
    Number: 'a typed quantity {q, exact, realised, sd, N, source: engine|marks|sketch|given}',
    Commit: 'a viewer prediction {key, q, unit, N, jump}; its value lives in ctx.state',
    Cost: 'work the checks added {redone, total, frac} computed from engine flags',
    Focus: 'a world rect {x, y, w, h} a camera may frame',
    Shot: 'a camera function t → {x, y, z} (closed form in t)',
    Mix: 'a transition weight t → [0, 1] (onion-skin / rack focus)',
    Evidence: 'an evidence-row spec (PEDAGOGY-MAP §5)',
    Material: 'the one Material a film is drawn in',
  };

  /* ── registries ── */
  const need = (def, keys, what) => { for (const k of keys) if (def[k] === undefined) throw new Error(`AM.${what}: "${def.id || '?'}" is missing "${k}"`); };
  AM.module = def => { need(def, ['id', 'structure', 'cls', 'in', 'out', 'dur', 'draw'], 'module'); AM.modules[def.id] = def; return def; };
  AM.material = def => { need(def, ['id', 'source', 'axis', 'cell', 'nRange', 'ground', 'begin', 'units', 'mark', 'line', 'area', 'text', 'num', 'anchor', 'end', 'voice'], 'material'); AM.materials[def.id] = def; return def; };
  AM.camera = def => { need(def, ['id', 'in', 'out', 'dur', 'shot'], 'camera'); AM.cameras[def.id] = def; return def; };

  /* ── Number: the belief law's carrier ── */
  const SOURCES = ['engine', 'marks', 'sketch', 'given'];
  AM.Number = function (o) {
    const n = Object.assign({ __type: 'Number', q: '', exact: null, realised: null, sd: null, N: null, source: 'engine', unit: '' }, o);
    if (!SOURCES.includes(n.source)) throw new Error(`belief law: Number "${n.q}" has source "${n.source}" (allowed: ${SOURCES.join(', ')})`);
    if (n.realised == null && n.exact == null) throw new Error(`belief law: Number "${n.q}" carries no value`);
    return Object.freeze(n);
  };
  AM.isNumber = x => !!x && x.__type === 'Number';
  /** thousands-separated integer or fixed decimals; never "exact ±" (PEDAGOGY-CRIT defect 2) */
  AM.fmt = (v, d = 0) => U().tabular(v, 0, { decimals: d, sep: ',', pad: '' });

  /** belief + legibility guards around Material.text (compose.js installs them) */
  const MUST_READ = { title: 18, head: 16, text: 14, num: 14, sketch: 14 };
  AM.guardText = function (str, o, matId) {
    o = o || {};
    if (/\d/.test(str) && !(o.given || o.sketch || o.fromNumber))
      throw new Error(`belief law (${matId}): text "${str}" contains a digit. Results go through M.num(Number); ` +
        `stated parameters pass {given:true}; illustrations pass {sketch:true}.`);
    const role = o.role || 'text', min = MUST_READ[role];
    if (min && o.size != null && o.size < min)
      throw new Error(`legibility law (${matId}): role "${role}" at ${o.size}px < ${min}px (must-read text never shrinks; use role "note" for labels that carry no result)`);
    if (role === 'note' && o.size != null && o.size < 10) throw new Error(`legibility law (${matId}): note at ${o.size}px < 10px`);
  };

  /* ── camera algebra ── */
  AM.cam = {
    I: Object.freeze({ x: 480, y: 270, z: 1 }),
    X: (c, x) => (x - c.x) * c.z + 480,
    Y: (c, y) => (y - c.y) * c.z + 270,
    /** world rect → screen rect */
    rect: (c, x, y, w, h) => [(x - c.x) * c.z + 480, (y - c.y) * c.z + 270, w * c.z, h * c.z],
    /** the camera that frames world rect r (with margin m) on screen */
    frame(r, m = 1.25) { const z = Math.min(960 / (r.w * m), 540 / (r.h * m)); return { x: r.x + r.w / 2, y: r.y + r.h / 2, z }; },
    /** log-space interpolation of zoom (a dolly feels linear in log z) with the frame centre carried consistently */
    mix(a, b, u) {
      const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), u));
      const dz = 1 / a.z - 1 / b.z;   // equal zoom: a plain pan, so the centre moves linearly in u (was stuck at a)
      const wz = Math.abs(dz) < 1e-9 ? u : (1 / a.z - 1 / z) / dz;   // fraction of the way in screen-space extent
      return { x: lerp(a.x, b.x, clamp(isFinite(wz) ? wz : u)), y: lerp(a.y, b.y, clamp(isFinite(wz) ? wz : u)), z };
    },
  };

  /* ── CPU canvases (software raster, one blit per frame — the pattern every direction converged on) ── */
  const _cv = new Map();
  AM.canvas = function (key, k, w = 960, h = 540) {
    const W = Math.max(1, Math.round(w * k)), H = Math.max(1, Math.round(h * k)), id = key + '|' + W + 'x' + H;
    let o = _cv.get(id);
    if (!o) { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; o = { cv, c: cv.getContext('2d', { willReadFrequently: true }), W, H, k }; _cv.set(id, o); }
    return o;
  };
  /** render scale for CPU work: capped at 1.5× so a 2× live page does not quadruple the cost */
  AM.renderScale = ctx => Math.min(ctx.size.k, 1.5);

  /* ── per-run facts (cached on the engine) ── */
  AM.runs = function (A) {
    if (A.__runs) return A.__runs;
    const N = A.N, k = A.k, R = new Array(N);
    let redone = 0;
    for (let r = 0; r < N; r++) {
      const fOff = A.failStep.off[r], fOn = A.failStep.on[r], caught = [], caughtFail = [];
      const top = fOn < 0 ? k - 1 : fOn;
      for (let j = 0; j <= top; j++) if (A.slip(r, j) && A.caught(r, j)) { if (A.retryOk(r, j)) caught.push(j); else caughtFail.push(j); redone++; }
      R[r] = { r, fOff, fOn, caught, caughtFail, saved: fOff >= 0 && fOn < 0 };
    }
    // the steps actually executed in the on-world: every step up to its end, plus one redo per catch
    let exec = 0; for (let r = 0; r < N; r++) exec += (R[r].fOn < 0 ? k : R[r].fOn + 1);
    Object.defineProperty(A, '__runs', { value: R, enumerable: false });
    Object.defineProperty(A, '__cost', { value: { redone, executed: exec, frac: redone / exec }, enumerable: false });
    return R;
  };
  AM.costOf = A => { AM.runs(A); return A.__cost; };

  /**
   * Unit states at global progress s (steps formed, float in [0, k]) in world w.
   * o: {rects: Float32Array(4N), alpha(r)?, emph(r)?, lost?, secPerStep (for failure age), only? (Int32Array of runs)}
   * → items: [{r, x, y, w, h, k, rows, done, failAt, age, caught, world, alpha, emph, lost}]
   */
  AM.items = function (A, w, s0, o) {
    const R = AM.runs(A), k = A.k, out = [], rects = o.rects, sps = o.secPerStep || 0.6;
    const list = o.only || null, n = list ? list.length : A.N;
    for (let q = 0; q < n; q++) {
      const r = list ? list[q] : q, ri = R[r], f = o.fail ? o.fail[r] : (w === 'on' ? ri.fOn : ri.fOff);
      const a = o.alpha ? o.alpha(r) : 1; if (a <= 0.002) continue;
      const s = o.sOf ? o.sOf(r) : s0;
      const failed = f >= 0 && s > f, done = failed ? f : Math.min(s, k);
      const cl = o.caughtOf ? o.caughtOf(r) : (w === 'on' ? ri.caught : []);
      const caught = cl.filter(j => j < Math.min(s, failed ? f : k));
      out.push({ r, x: rects[r * 4], y: rects[r * 4 + 1], w: rects[r * 4 + 2], h: rects[r * 4 + 3], k, rows: Math.min(Math.ceil(s), k), done,
        failAt: failed ? f : -1, age: failed ? (s - f) * sps : 0, caught, world: w, alpha: a, emph: o.emph ? o.emph(r) : null, lost: !!o.lost });
    }
    return out;
  };

  /* ── layout: grid (folded bands at the material's natural aspect), rack (sorted by survival), macro ── */
  AM.layout = {
    /** cell: {along, across} — one step's length along the unit axis vs the unit's thickness; maxAcross caps thickness */
    grid(N, k, rect, axis, cell, opt = {}) {
      const gap = opt.gap ?? 10, ratio = (k * cell.along) / cell.across, maxT = cell.maxAcross || 1e9;
      const spread = axis === 'y' ? rect.w : rect.h, depth = axis === 'y' ? rect.h : rect.w;
      let best = null;
      for (let nb = 1; nb <= N; nb++) {
        const B = Math.ceil(N / nb), T = Math.min(maxT, spread / B), L = ratio * T, tot = nb * L + (nb - 1) * gap;
        if (tot > depth) break;
        if (!best || T > best.T + 1e-9) best = { nb, B, T, L, tot };
        if (T >= maxT) break;
      }
      if (!best) { const T = depth / ratio, B = N; best = { nb: 1, B, T: Math.min(T, spread / N), L: depth, tot: depth }; }
      const { nb, B, T, L, tot } = best, out = new Float32Array(N * 4), bandSpan = B * T;
      const s0 = (axis === 'y' ? rect.x : rect.y) + (spread - bandSpan) / 2, d0 = (axis === 'y' ? rect.y : rect.x) + (depth - tot) / 2;
      for (let i = 0; i < N; i++) {
        const b = Math.floor(i / B), m = i % B, sp = s0 + m * T, dp = d0 + b * (L + gap);
        if (axis === 'y') out.set([sp, dp, T, L], i * 4); else out.set([dp, sp, L, T], i * 4);
      }
      return { kind: 'grid', rects: out, bands: nb, perBand: B, T, L, axis };
    },
    /** order: run ids sorted (index s → run). Unit lengths are the full rect depth (anisotropic): silhouette = survival. */
    rack(order, k, rect, axis) {
      const N = order.length, out = new Float32Array(N * 4), T = (axis === 'y' ? rect.w : rect.h) / N;
      for (let s = 0; s < N; s++) {
        const r = order[s];
        if (axis === 'y') out.set([rect.x + s * T, rect.y, T, rect.h], r * 4); else out.set([rect.x, rect.y + s * T, rect.w, T], r * 4);
      }
      return { kind: 'rack', rects: out, T, axis, rect, order };
    },
    /** sort runs longest-first by fail step in world w (identity tie-break by r) — the ruler-test ordering */
    survivalOrder(A, w) {
      const f = A.failStep[w], k = A.k, idx = Array.from({ length: A.N }, (_, r) => r);
      idx.sort((a, b) => ((f[b] < 0 ? k : f[b]) - (f[a] < 0 ? k : f[a])) || a - b);
      return Int32Array.from(idx);
    },
    /** world point at survival fraction `frac` (along the spread axis) and step depth j in a rack rect */
    rackPoint(rect, axis, frac, j, k) {
      return axis === 'y' ? [rect.x + frac * rect.w, rect.y + (j / k) * rect.h] : [rect.x + (j / k) * rect.w, rect.y + frac * rect.h];
    },
    /** the count edge of a rack (where full-length units end) as [x0, y0, x1, y1] */
    countEdge(rect, axis) { return axis === 'y' ? [rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h] : [rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h]; },
    /** a single unit framed large at the material's natural aspect, centred in rect */
    macro(k, rect, axis, cell, fill = 0.82) {
      const ratio = (k * cell.along) / cell.across;
      if (axis === 'y') { const L = rect.h * fill, T = L / ratio; return { x: rect.x + rect.w / 2 - T / 2, y: rect.y + (rect.h - L) / 2, w: T, h: L }; }
      const L = rect.w * fill, T = L / ratio; return { x: rect.x + (rect.w - L) / 2, y: rect.y + rect.h / 2 - T / 2, w: L, h: T };
    },
    /** eased per-unit morph between two rect sets (identity kept); stagger ∈ [0,1) delays far units */
    lerpRects(A, B, u, out, stagger = 0, keyOf) {
      const N = A.length / 4, E = U().ease.inOut;
      for (let i = 0; i < N; i++) {
        const d = stagger ? (keyOf ? keyOf(i) : i / N) * stagger : 0, v = E(clamp((u - d) / (1 - stagger || 1)));
        for (let c = 0; c < 4; c++) out[i * 4 + c] = lerp(A[i * 4 + c], B[i * 4 + c], v);
      }
      return out;
    },
  };

  /** per-step anchor helper for materials whose steps run evenly along the unit axis */
  AM.stepPoint = (rect, axis, j, k, frac = 0.5) => (axis === 'y'
    ? [rect.x + rect.w / 2, rect.y + ((j + frac) / k) * rect.h]
    : [rect.x + ((j + frac) / k) * rect.w, rect.y + rect.h / 2]);

  /* ── sound: semantic events → the runtime's voices, re-voiced per material ── */
  AM.voice = function (M, ev) {
    const v = M.voice[ev.kind] || AM.defaultVoice[ev.kind]; if (!v) return null;
    return Object.assign({ t: ev.t, kind: v.kind, freq: v.freq, gain: (v.gain ?? 1) * (ev.gain ?? 1), pan: ev.pan || 0 }, v.dur ? { dur: v.dur } : {});
  };
  AM.defaultVoice = { step: { kind: 'tick', freq: 3400, gain: 0.5 }, fail: { kind: 'clack', freq: 190, gain: 0.6 }, save: { kind: 'click', freq: 1760, gain: 0.6 },
    reveal: { kind: 'tone', freq: 392, gain: 0.5, dur: 0.9 }, commit: { kind: 'click', freq: 880, gain: 0.5 }, cost: { kind: 'tick', freq: 2200, gain: 0.35 } };

  /* ── common text for the shared concept (labelled sketch, AD §4 THE TRACE) ── */
  AM.TRACE_INVOICES = {
    goal: 'Reconcile 40 invoices against purchase orders',
    steps: [
      { j: 0, kind: 'plan', text: 'plan: match each invoice to its order' },
      { j: 1, kind: 'act', text: 'call fetch_purchase_orders' },
      { j: 2, kind: 'observe', text: 'observe: the orders come back' },
      { j: 3, kind: 'check', text: 'match invoices one by one' },
      { j: 6, kind: 'fail', text: '“Acme Corp” ≠ “ACME Corporation”: totals mismatch' },
      { j: 6, kind: 'catch', text: 'the check catches it: retry by tax ID' },
      { j: 19, kind: 'stop', text: 'all matched: stop' },
    ],
    failAt: 6,
  };
})(typeof window !== 'undefined' ? window : globalThis);
