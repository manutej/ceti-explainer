/* arsenal/core/generator.js · generator-authored scenes, compiled once into absolute intervals ([[generator-scenes]]).
   Author with function* / yield* (Motion Canvas style); the generator runs ONCE at compile time, a virtual cursor
   turns every tween into an absolute interval {t0,t1,from,to,ease}; seek is then a binary-search lookup, so
   at(t) is a pure function of t and costs O(tracks * log intervals). Yields only pace authoring, the cursor is the clock.

     const sc = ARSENAL.generator.scene(function* (s) {
       yield* tween(s.dot, { x: 400 }, 1, 'outCubic');      // 0 -> 1 s
       yield wait(0.5);                                      // 1 -> 1.5 s
       yield* all(tween(s.dot, { y: 80 }, 1), tween(s.dot, { r: 30 }, 1.2));   // parallel, ends at the longest
     }, { init: { dot: { x: 0, y: 0, r: 10 } }, dur: 8 });
     sc.at(2.2)  // -> { dot: { x, y, r } } fresh object; sc.dur, sc.labels, sc.stats

   Rules: no Math.random/Date inside a scene (use a seeded rng passed in by the caller); do not tween one prop from two
   parallel branches (the later-started interval wins). Values may be numbers, arrays of numbers, or '#rrggbb'. */
(function (root) {
  'use strict';
  const A = root.ARSENAL = root.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const EASE = {
    linear: (k) => k, inCubic: (k) => k * k * k, outCubic: (k) => 1 - Math.pow(1 - k, 3),
    inOutCubic: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    outExpo: (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k)),
    outBack: (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    step: (k) => (k >= 1 ? 1 : 0),
  };
  const getEase = (e) => (typeof e === 'function' ? e : EASE[e || 'inOutCubic'] || EASE.inOutCubic);

  const hex2 = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const toHex = (a) => '#' + a.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  function lerpV(a, b, k) {
    if (typeof a === 'number') return a + (b - a) * k;
    if (Array.isArray(a)) return a.map((v, i) => v + (b[i] - v) * k);
    if (typeof a === 'string' && a[0] === '#' && a.length === 7) { const x = hex2(a), y = hex2(b); return toHex(x.map((v, i) => v + (y[i] - v) * k)); }
    return k >= 1 ? b : a; // non-interpolable: switch at the end
  }

  class Track {
    constructor(target, prop, init) { this.target = target; this.prop = prop; this.init = init; this.iv = []; }
    valueAt(t) {                       // last interval (ties: last inserted) with t0 <= t
      const iv = this.iv; let lo = 0, hi = iv.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (iv[m].t0 <= t) lo = m + 1; else hi = m; }
      if (!lo) return this.init;
      const v = iv[lo - 1];
      if (t >= v.t1) return v.to;
      return lerpV(v.from, v.to, v.ease((t - v.t0) / (v.t1 - v.t0)));
    }
    add(t0, t1, to, ease) {
      const from = this.valueAt(t0), iv = this.iv; let lo = 0, hi = iv.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (iv[m].t0 <= t0) lo = m + 1; else hi = m; }
      iv.splice(lo, 0, { t0, t1, from, to, ease });
    }
  }

  let C = null; // the compile in progress (the cursor lives here)
  const need = () => { if (!C) throw new Error('generator: tween/wait used outside scene() compile'); return C; };
  function trackOf(target, prop) {
    const c = need(); let m = c.tracks.get(target);
    if (!m) c.tracks.set(target, (m = new Map()));
    let tr = m.get(prop);
    if (!tr) { m.set(prop, (tr = new Track(target, prop, target[prop]))); c.list.push(tr); }
    return tr;
  }
  function drain(it) {
    for (let r = it.next(); !r.done; r = it.next()) {
      const y = r.value;
      if (y && y.k === 'wait') C.cursor += y.s;
      else if (y && y.k === 'label') C.labels[y.name] = C.cursor;
      else if (y && typeof y.next === 'function') drain(y);   // `yield all(...)` without the star still works
    }
  }

  // ---- authoring vocabulary ----
  const wait = (s) => ({ k: 'wait', s: Math.max(0, +s || 0) });
  const label = (name) => ({ k: 'label', name });
  function* tween(target, props, dur, ease) {
    const c = need(), t0 = c.cursor, d = Math.max(0, +dur || 0), e = getEase(ease);
    for (const p in props) { trackOf(target, p).add(t0, t0 + d, props[p], d === 0 ? EASE.step : e); c.intervals++; }
    yield wait(d);
  }
  function* set(target, props) { yield* tween(target, props, 0); }
  function* all(...gens) {
    const c = need(), start = c.cursor; let end = start;
    for (const g of gens) { c.cursor = start; drain(g); end = Math.max(end, c.cursor); }
    c.cursor = end;
  }
  function* stagger(gap, ...gens) {
    const c = need(), start = c.cursor; let end = start;
    gens.forEach((g, i) => { c.cursor = start + i * gap; drain(g); end = Math.max(end, c.cursor); });
    c.cursor = end;
  }
  function* delay(s, gen) { yield wait(s); yield* gen; }
  function* sequence(...gens) { for (const g of gens) yield* g; }

  function cloneGraph(o, map) {
    if (o === null || typeof o !== 'object') return o;
    const k = Array.isArray(o) ? [] : {}; map.set(o, k);
    for (const key in o) k[key] = cloneGraph(o[key], map);
    return k;
  }

  function scene(genFn, opts) {
    opts = opts || {};
    const init = opts.init || {};
    const stats = { compiles: 0, intervals: 0, tracks: 0, calls: 0 };
    const prev = C;
    C = { cursor: 0, labels: {}, tracks: new Map(), list: [], intervals: 0 };
    let c;
    try { drain(genFn(init)); c = C; } finally { C = prev; }
    stats.compiles = 1; stats.intervals = c.intervals; stats.tracks = c.list.length;
    const dur = Math.max(c.cursor, opts.dur || 0);
    const list = c.list;
    const compiled = {
      dur, labels: c.labels, stats, end: c.cursor,
      at(t) {
        stats.calls++;
        const map = new Map(), out = cloneGraph(init, map);
        for (const tr of list) { const o = map.get(tr.target); if (o) o[tr.prop] = tr.valueAt(t); }
        return out;
      },
      value(target, prop, t) { const m = c.tracks.get(target); const tr = m && m.get(prop); return tr ? tr.valueAt(t) : target[prop]; },
    };
    return compiled;
  }

  A.generator = { scene, tween, set, wait, label, all, stagger, delay, sequence, ease: EASE, version: '1.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = A.generator;
})(typeof window !== 'undefined' ? window : globalThis);
