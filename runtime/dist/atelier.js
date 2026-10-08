/* ════════════════════════════════════════════════════════════════════════════
   Atelier runtime 0.1 — the shared clock, player, engine and score for p5.js
   explainer films (p5 2.3.4, instance mode). One file; no dependency but p5.

   CLOCK LAW: every frame is a pure function of (t, ctx.state, ctx.seed).
   draw() never reads frameCount, millis(), Date, performance, Math.random or
   p.random — use Atelier.U.h (counter hash) and U.stateAt (fixed-step memo).
   Paused == playing; the live page and the MP4 are the same film.

     Atelier.film(def)            mount a film (player page, or ?film=1 chromeless)
     Atelier.U                    pure utilities (hash RNG, noise, easing, colour …)
     Atelier.AgentLoop(params)    the agent-loop ensemble engine (single source of numbers)
     Atelier.tokens               CETI semantic colour tokens
     window.__atelier             headless hooks (ready, seek, info, setState, meta, audio, capture)

   URL: ?film=1 chromeless at render size · ?w=1280 render width · ?seed=7 · ?t=4.2 start time
   See README.md for the def contract.
   ════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const VERSION = '0.1.0';

  /* ─────────────────────────── U · pure utilities ─────────────────────────── */

  /** lowbias32 integer finaliser (Wellons). Pure, 32-bit, Math.imul only. */
  function mix32(x) {
    x = Math.imul(x ^ (x >>> 16), 0x21f0aaad);
    x = Math.imul(x ^ (x >>> 15), 0x735a2d97);
    return (x ^ (x >>> 15)) >>> 0;
  }
  /** Counter-based hash RNG → [0,1). Random access: h(seed, run, step, purpose).
   *  Arguments are truncated to int32; order matters (h(s,1,0) ≠ h(s,0,1)). */
  function h(seed, a, b, c, d) {
    let x = mix32((seed | 0) ^ 0x9e3779b9);
    x = mix32(x ^ mix32(((a | 0) + 0x632be5ab) | 0));
    x = mix32(x ^ mix32(((b | 0) + 0x85ebca6b) | 0));
    x = mix32(x ^ mix32(((c | 0) + 0xc2b2ae35) | 0));
    x = mix32(x ^ mix32(((d | 0) + 0x27d4eb2f) | 0));
    return x / 4294967296;
  }
  /** Standard normal from the same counters (Box–Muller; deterministic per engine). */
  function gauss(seed, a, b, c, d) {
    const u1 = 1 - h(seed, a, b, c, d), u2 = h(seed ^ 0x68e31da4, a, b, c, d);
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, u) => a + (b - a) * u;
  const map = (v, a0, a1, b0, b1, clip) => { let u = (v - a0) / (a1 - a0); if (clip) u = clamp(u); return b0 + (b1 - b0) * u; };
  const smoothstep = (e0, e1, x) => { const u = clamp((x - e0) / (e1 - e0)); return u * u * (3 - 2 * u); };
  const fade5 = u => u * u * u * (u * (u * 6 - 15) + 10);

  /* hash value noise: lattice values from h(), quintic interpolation. Pure in inputs. */
  function noise1(seed, x) {
    const xi = Math.floor(x), u = fade5(x - xi);
    return lerp(h(seed, xi, 0, 0, 101), h(seed, xi + 1, 0, 0, 101), u);
  }
  function noise2(seed, x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), u = fade5(x - xi), v = fade5(y - yi);
    const a = h(seed, xi, yi, 0, 202), b = h(seed, xi + 1, yi, 0, 202), c = h(seed, xi, yi + 1, 0, 202), d = h(seed, xi + 1, yi + 1, 0, 202);
    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }
  function noise3(seed, x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const u = fade5(x - xi), v = fade5(y - yi), w = fade5(z - zi);
    const n = (i, j, k) => h(seed, xi + i, yi + j, zi + k, 303);
    return lerp(lerp(lerp(n(0, 0, 0), n(1, 0, 0), u), lerp(n(0, 1, 0), n(1, 1, 0), u), v),
                lerp(lerp(n(0, 0, 1), n(1, 0, 1), u), lerp(n(0, 1, 1), n(1, 1, 1), u), v), w);
  }
  /** Fractal sum, normalised to [0,1). dims picked from arg count: fbm(seed, oct, x[, y[, z]]). */
  function fbm(seed, octaves, x, y, z) {
    let s = 0, a = 0.5, f = 1, n = 0;
    for (let o = 0; o < octaves; o++) {
      const so = seed + o * 7919;
      s += a * (z !== undefined ? noise3(so, x * f, y * f, z * f) : y !== undefined ? noise2(so, x * f, y * f) : noise1(so, x * f));
      n += a; a *= 0.5; f *= 2;
    }
    return s / n;
  }

  /* easings by ROLE. Each maps [0,1] → ~[0,1]. */
  function bezier(p1x, p1y, p2x, p2y) {
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    const fx = t => ((ax * t + bx) * t + cx) * t, fy = t => ((ay * t + by) * t + cy) * t, dfx = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const e = fx(t) - x; if (Math.abs(e) < 1e-6) break; const d = dfx(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
      let lo = 0, hi = 1; if (Math.abs(fx(t) - x) > 1e-5) { t = x; for (let i = 0; i < 30; i++) { if (fx(t) < x) lo = t; else hi = t; t = (lo + hi) / 2; } }
      return fy(t);
    };
  }
  /** Closed-form damped spring step response at time t (s): 0 → 1. f = natural freq (Hz), zeta = damping ratio. */
  function spring(t, f = 2, zeta = 0.5) {
    if (t <= 0) return 0;
    const w = 2 * Math.PI * f;
    if (zeta < 1) { const wd = w * Math.sqrt(1 - zeta * zeta); return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + (zeta * w / wd) * Math.sin(wd * t)); }
    if (zeta === 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    const r = Math.sqrt(zeta * zeta - 1), s1 = -w * (zeta - r), s2 = -w * (zeta + r);
    return 1 + (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s1 - s2);
  }
  /** Trapezoidal velocity profile (accelerate, cruise, brake): machine motion. */
  function mechanical(u, a = 0.2) {
    u = clamp(u); const v = 1 / (1 - a);
    if (u < a) return 0.5 * v * u * u / a;
    if (u > 1 - a) { const r = 1 - u; return 1 - 0.5 * v * r * r / a; }
    return v * (u - a / 2);
  }
  const ease = {
    linear: u => clamp(u),
    enter: bezier(0.22, 1, 0.36, 1),            // arrives fast, lands soft
    exit: bezier(0.55, 0, 1, 0.45),             // leaves accelerating
    inOut: bezier(0.65, 0, 0.35, 1),
    settle: u => (u >= 1 ? 1 : spring(u, 1.9, 0.55) / spring(1, 1.9, 0.55)), // overshoot ~10 %, lands at 1
    mechanical: u => mechanical(u),
    hand: u => { u = clamp(u); return u * u * u * (10 - 15 * u + 6 * u * u); }, // minimum-jerk (Flash & Hogan)
    bezier, spring, mechanical,
  };
  const easeOf = e => (typeof e === 'function' ? e : (e && ease[e]) || ease.linear);
  /** Eased progress of t through [t0, t1] (clamped). ease: role name or fn. */
  const seg = (t, t0, t1, e) => easeOf(e)(clamp((t - t0) / (t1 - t0)));

  /* colour: sRGB ↔ OKLab/OKLCh, mixing, retuning for a ground */
  const hex2rgb = hx => { hx = hx.replace('#', ''); if (hx.length === 3) hx = hx.split('').map(c => c + c).join(''); const n = parseInt(hx.slice(0, 6), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
  const rgb2hex = c => '#' + c.map(v => Math.round(clamp(v) * 255).toString(16).padStart(2, '0')).join('');
  const toLin = v => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const toGam = v => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
  function rgb2oklab(c) {
    const [r, g, b] = c.map(toLin);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  }
  function oklab2rgbLin([L, a, b]) {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  }
  const oklab2rgb = lab => oklab2rgbLin(lab).map(v => toGam(clamp(v)));
  const toOklch = hx => { const [L, a, b] = rgb2oklab(hex2rgb(hx)); return { L, C: Math.hypot(a, b), h: Math.atan2(b, a) }; };
  /** OKLCh → hex, reducing chroma (hue and L kept) until inside sRGB. */
  function fromOklch(L, C, hue) {
    let lo = 0, hi = C, c = C;
    const inGamut = cc => oklab2rgbLin([L, cc * Math.cos(hue), cc * Math.sin(hue)]).every(v => v >= -1e-4 && v <= 1 + 1e-4);
    if (!inGamut(C)) { for (let i = 0; i < 24; i++) { c = (lo + hi) / 2; if (inGamut(c)) lo = c; else hi = c; } c = lo; }
    return rgb2hex(oklab2rgb([L, c * Math.cos(hue), c * Math.sin(hue)]));
  }
  /** Perceptual mix of two hex colours in OKLab. */
  function mixOk(c1, c2, u) { const A = rgb2oklab(hex2rgb(c1)), B = rgb2oklab(hex2rgb(c2)); return rgb2hex(oklab2rgb([lerp(A[0], B[0], u), lerp(A[1], B[1], u), lerp(A[2], B[2], u)])); }
  const rgba = (hx, a = 1) => { const [r, g, b] = hex2rgb(hx); return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`; };

  /** CETI semantic tokens (designed on ground #0E1014). Meaning is invariant; L/C may be retuned per ground. */
  const tokens = Object.freeze({
    copper: '#CE9A6A', // mass · what flows · probability
    sage: '#8FA985',   // verified · pass
    peach: '#D88B5C',  // error · cost
    slate: '#6E8CA8',  // structure · system
    ink: '#F5EFE3', dim: '#A39A89', ground: '#0E1014', panel: '#171B23',
  });
  /** Retune a token's lightness/chroma for another ground, keeping hue (meaning).
   *  The token's lightness distance from the CETI ground is preserved (×contrast), flipped on light grounds. */
  function retune(hx, ground, opt = {}) {
    const k = opt.contrast ?? 1, cs = opt.chroma ?? 1;
    const t = toOklch(hx), g0 = toOklch(tokens.ground).L, g = toOklch(ground).L, d = Math.abs(t.L - g0) * k;
    const L = g > 0.6 ? clamp(g - d * 0.85, 0.12, 0.72) : clamp(g + d, 0.3, 0.97);
    return fromOklch(L, t.C * cs, t.h);
  }
  /** The whole semantic set for a ground: { copper, sage, peach, slate, ink, dim, ground, panel }. */
  /** Curated semantic set for light grounds (OKLCH L > 0.6): hues pulled apart so copper (amber) and peach (vermilion-rust)
   *  never collapse into one brown; all ≥ 4.5:1 on paper-like grounds. Meaning unchanged. */
  const tokensLight = Object.freeze({ copper: '#9C6516', sage: '#3F7046', peach: '#B8432A', slate: '#36597D', ink: '#1E2124', dim: '#5E5A52' });
  function tokensFor(ground, opt) {
    if (!ground || ground.toLowerCase() === tokens.ground.toLowerCase()) return Object.assign({}, tokens);
    const gL = toOklch(ground).L;
    if (gL > 0.6 && !(opt && opt.retune)) { const g = toOklch(ground); return Object.assign({ ground, panel: fromOklch(clamp(g.L - 0.04), g.C, g.h) }, tokensLight); }
    if (gL >= 0.3 && gL <= 0.6 && !(opt && opt.retune)) return Object.assign({}, tokens, { ground }); // mid grounds: keep CETI values
    const o = { ground };
    ['copper', 'sage', 'peach', 'slate', 'ink', 'dim'].forEach(k => (o[k] = retune(tokens[k], ground, opt)));
    const g = toOklch(ground); o.panel = fromOklch(clamp(g.L + (g.L > 0.6 ? -0.04 : 0.04)), g.C, g.h);
    return o;
  }

  /* stateAt: fixed-step integration with a checkpoint LRU memo — exact for any seek order. */
  const _stores = new Map();
  /**
   * State after floor(t/step) fixed steps from init(). advance(state, i, step) mutates (or returns) the state.
   * Checkpoints every opt.every steps (default 32) are cloned (opt.clone, default structuredClone) and kept in an
   * LRU of opt.max (default 128). Forward playback uses the cursor (sequential fast path). The returned object is
   * READ-ONLY (it is the live cursor). key must encode everything the state depends on besides t (seed, params).
   */
  function stateAt(key, t, step, init, advance, opt = {}) {
    const every = opt.every || 32, max = opt.max || 128, clone = opt.clone || (s => structuredClone(s));
    const n = Math.max(0, Math.floor(t / step + 1e-9));
    let S = _stores.get(key);
    if (!S) { S = { cps: new Map(), cur: null, curN: -1 }; _stores.set(key, S); }
    let best = -1;
    for (const m of S.cps.keys()) if (m <= n && m > best) best = m;
    if (S.cur && S.curN <= n && S.curN >= best) { /* fast path: continue from the cursor */ }
    else if (best >= 0) { const cp = S.cps.get(best); S.cps.delete(best); S.cps.set(best, cp); S.cur = clone(cp); S.curN = best; }
    else { S.cur = init(); S.curN = 0; if (!S.cps.has(0)) S.cps.set(0, clone(S.cur)); }
    while (S.curN < n) {
      const r = advance(S.cur, S.curN, step); if (r !== undefined) S.cur = r;
      S.curN++;
      if (S.curN % every === 0 && !S.cps.has(S.curN)) {
        S.cps.set(S.curN, clone(S.cur));
        if (S.cps.size > max) { for (const k of S.cps.keys()) { if (k !== 0) { S.cps.delete(k); break; } } }
      }
    }
    return S.cur;
  }
  stateAt.reset = key => (key === undefined ? _stores.clear() : _stores.delete(key));

  /* geometry & type helpers (these take p) */
  const _arc = new WeakMap();
  const P = q => (Array.isArray(q) ? q : [q.x, q.y]);
  /** Draw the first u∈[0,1] of a polyline by arc length (pts: [[x,y]…] or [{x,y}…]). Cached lengths. */
  function drawOn(p, pts, u, close) {
    if (!pts || pts.length < 2 || u <= 0) return;
    let L = _arc.get(pts);
    if (!L) { L = new Float64Array(pts.length); for (let i = 1; i < pts.length; i++) { const a = P(pts[i - 1]), b = P(pts[i]); L[i] = L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]); } _arc.set(pts, L); }
    const target = clamp(u) * L[L.length - 1];
    p.beginShape();
    for (let i = 0; i < pts.length; i++) {
      const b = P(pts[i]);
      if (L[i] <= target) { p.vertex(b[0], b[1]); continue; }
      const a = P(pts[i - 1]), f = (target - L[i - 1]) / (L[i] - L[i - 1] || 1);
      p.vertex(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); break;
    }
    p.endShape(close && u >= 1 ? p.CLOSE : undefined);
  }
  const _tc = new Map(), _fontIds = new WeakMap(); let _fontN = 0;
  /** Cached font.textToContours at a given size (2.3.4 uses the CURRENT textSize — handled here). */
  function textContours(p, font, str, size, opt = {}) {
    if (!_fontIds.has(font)) _fontIds.set(font, ++_fontN);
    const sf = opt.sampleFactor ?? 0.25, key = _fontIds.get(font) + '|' + size + '|' + sf + '|' + str;
    if (_tc.has(key)) return _tc.get(key);
    const prev = p.textSize(); p.textSize(size);
    const c = font.textToContours(str, 0, 0, { sampleFactor: sf });
    p.textSize(prev); _tc.set(key, c); return c;
  }
  /** Tabular number: min `digits` integer digits padded with FIGURE SPACE (U+2007); opt {decimals, sep:',', pad}.
   *  p5.Font text (WEBGL, textContours) has no glyph fallback — latin subsets lack U+2007: pass {pad:' '} with a mono face. */
  function tabular(n, digits = 0, opt = {}) {
    const dec = opt.decimals || 0, pad = opt.pad ?? ' ', sep = opt.sep ?? ',';
    const neg = n < 0, s = Math.abs(n).toFixed(dec), [ip, fp] = s.split('.');
    let ii = ip.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    const need = digits - ip.length; if (need > 0) ii = pad.repeat(need + (sep ? Math.floor((digits - 1) / 3) - Math.floor((ip.length - 1) / 3) : 0)) + ii;
    return (neg ? '−' : '') + ii + (fp ? '.' + fp : '');
  }
  /** Largest textSize ≤ maxSize (≥ minSize) at which str fits maxW with the current font. Sets it; returns it. */
  function fitText(p, str, maxW, maxSize, minSize = 6) {
    let lo = minSize, hi = maxSize;
    p.textSize(hi); if (p.textWidth(str) <= maxW) return hi;
    for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; p.textSize(m); if (p.textWidth(str) <= maxW) lo = m; else hi = m; }
    p.textSize(lo); return lo;
  }
  const fmtTime = s => { s = Math.max(0, s); const m = Math.floor(s / 60), r = s - m * 60; return m + ':' + String(Math.floor(r)).padStart(2, '0'); };

  const U = {
    h, mix32, gauss, noise1, noise2, noise3, fbm, ease, easeOf, spring, bezier, seg, clamp, lerp, map, smoothstep,
    stateAt, drawOn, textContours, tabular, fitText, fmtTime,
    color: { hex2rgb, rgb2hex, rgb2oklab, oklab2rgb, toOklch, fromOklch, mix: mixOk, rgba, retune, tokensFor },
    mix: mixOk, rgba, retune, tokensFor,
  };

  /* ─────────────────────────── AgentLoop · the engine ─────────────────────────── */
  /** Exact DP over steps: survival after j steps, off (p^j) and on (p'^j), p' = p + (1−p)·c·(1−(1−p)^retry). */
  function exact(k, p = 0.95, c = 0.8, retry = 1) {
    const pr = p + (1 - p) * c * (1 - Math.pow(1 - p, retry));
    const off = new Float64Array(k + 1), on = new Float64Array(k + 1), fOff = new Float64Array(k), fOn = new Float64Array(k);
    off[0] = on[0] = 1;
    for (let j = 0; j < k; j++) { off[j + 1] = off[j] * p; on[j + 1] = on[j] * pr; fOff[j] = off[j] * (1 - p); fOn[j] = on[j] * (1 - pr); }
    return { k, p, c, retry, pPrime: pr, off, on, failAt: { off: fOff, on: fOn } };
  }
  /**
   * Twin-world ensemble with common random numbers. Per (run, step):
   *   u0 = h(seed,run,step,0): slip iff u0 > p · u1 = h(…,1): caught iff u1 < c · u2+r = h(…,2+r): retry r ok iff < p.
   * World 'off' fails at the first slip. World 'on' fails at the first slip that is not (caught and retried ok).
   */
  function AgentLoop(params) {
    const P = Object.assign({ N: 2000, k: 20, p: 0.95, c: 0.8, retry: 1, seed: 1 }, params || {});
    const { N, k, p, c, retry, seed } = P;
    const flags = new Uint8Array(N * k);               // bit0 slip · bit1 caught · bit2 retryOk
    const fail = { off: new Int16Array(N).fill(-1), on: new Int16Array(N).fill(-1) };
    for (let r = 0; r < N; r++) {
      for (let j = 0; j < k; j++) {
        if (!(h(seed, r, j, 0) > p)) continue;
        let f = 1; const caught = h(seed, r, j, 1) < c; let ok = false;
        if (caught) { f |= 2; for (let q = 0; q < retry; q++) if (h(seed, r, j, 2 + q) < p) { ok = true; break; } }
        if (ok) f |= 4;
        flags[r * k + j] = f;
        if (fail.off[r] < 0) fail.off[r] = j;
        if (fail.on[r] < 0 && !ok) fail.on[r] = j;
      }
    }
    const surv = w => { const s = new Int32Array(k + 1); for (let r = 0; r < N; r++) { const f = fail[w][r], top = f < 0 ? k : f; for (let j = 0; j <= top; j++) s[j]++; } return s; };
    const ex = exact(k, p, c, retry);
    const survivors = { off: surv('off'), on: surv('on') };
    const expected = { off: ex.off.map(q => N * q), on: ex.on.map(q => N * q) };
    const sd = { off: ex.off.map(q => Math.sqrt(N * q * (1 - q))), on: ex.on.map(q => Math.sqrt(N * q * (1 - q))) };
    const saved = [], lost = [];
    for (let r = 0; r < N; r++) { if (fail.off[r] >= 0 && fail.on[r] < 0) saved.push(r); if (fail.off[r] < 0 && fail.on[r] >= 0) lost.push(r); }
    const W = w => (w === 'on' || w === 1 || w === true ? 'on' : 'off');
    return {
      params: P, N, k, flags, failStep: fail, survivors, expected, sd, exact: ex, pPrime: ex.pPrime,
      saved: Int32Array.from(saved), lost: Int32Array.from(lost),
      slip: (r, j) => !!(flags[r * k + j] & 1), caught: (r, j) => !!(flags[r * k + j] & 2), retryOk: (r, j) => !!(flags[r * k + j] & 4),
      /** run r has completed j steps in world w (j = 0…k) */
      alive: (r, w, j) => { const f = fail[W(w)][r]; return f < 0 || f >= j; },
      passed: (r, w) => fail[W(w)][r] < 0,
      /** per-step events of run r in world w, up to (and including) its failure: [{step, slip, caught, retryOk, fail}] */
      events(r, w) {
        w = W(w); const out = [], f = fail[w][r], top = f < 0 ? k - 1 : f;
        for (let j = 0; j <= top; j++) {
          const b = flags[r * k + j]; if (!b) continue;
          if (w === 'off') out.push({ step: j, slip: true, caught: false, retryOk: false, fail: true });
          else out.push({ step: j, slip: true, caught: !!(b & 2), retryOk: !!(b & 4), fail: j === f });
        }
        return out;
      },
      /** count of runs (world w) that failed exactly at step j */
      failedAt(w, j) { const a = fail[W(w)]; let n = 0; for (let r = 0; r < N; r++) if (a[r] === j) n++; return n; },
      table() {
        return Array.from({ length: k + 1 }, (_, j) => ({ step: j, off: survivors.off[j], expOff: +expected.off[j].toFixed(1), sdOff: +sd.off[j].toFixed(1),
          on: survivors.on[j], expOn: +expected.on[j].toFixed(1), sdOn: +sd.on[j].toFixed(1) }));
      },
    };
  }
  AgentLoop.exact = exact;
  /** Realised within 4 sd of expectation at every step, twin invariants hold. Prints a table; returns {pass, rows}. */
  AgentLoop.selfTest = function (opt = {}) {
    const seeds = opt.seeds || [1, 2, 3], ks = opt.ks || [5, 10, 20, 40], N = opt.N || 2000, rows = []; let pass = true;
    for (const seed of seeds) for (const k of ks) {
      const A = AgentLoop({ N, k, seed }); let worst = 0;
      for (const w of ['off', 'on']) for (let j = 0; j <= k; j++) {
        const s = A.sd[w][j], z = s > 0 ? Math.abs(A.survivors[w][j] - A.expected[w][j]) / s : (A.survivors[w][j] === A.expected[w][j] ? 0 : Infinity);
        worst = Math.max(worst, z);
      }
      const inv = A.lost.length === 0 && Array.from(A.failStep.off).every((f, r) => f < 0 ? A.failStep.on[r] < 0 : (A.failStep.on[r] < 0 || A.failStep.on[r] >= f));
      const ok = worst <= 4 && inv; pass = pass && ok;
      rows.push({ seed, k, realisedOff: A.survivors.off[k], expectedOff: +A.expected.off[k].toFixed(1), realisedOn: A.survivors.on[k],
        expectedOn: +A.expected.on[k].toFixed(1), sd: +A.sd.off[k].toFixed(1) + '/' + A.sd.on[k].toFixed(1), saved: A.saved.length, worstZ: +worst.toFixed(2), ok });
    }
    if (!opt.quiet && typeof console !== 'undefined' && console.table) console.table(rows);
    return { pass, rows };
  };

  /* ─────────────────────────── Score · WebAudio synthesis ─────────────────────────── */
  const _noise = new WeakMap();
  function noiseBuf(ac) {
    let b = _noise.get(ac); if (b) return b;
    b = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.25), ac.sampleRate);
    const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = h(4242, i) * 2 - 1;   // deterministic noise
    _noise.set(ac, b); return b;
  }
  function envGain(ac, dest, when, peak, a, d) {
    const g = ac.createGain(); g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(peak, when + a); g.gain.exponentialRampToValueAtTime(1e-4, when + a + d);
    g.connect(dest); return g;
  }
  function panned(ac, dest, pan) { if (!pan || !ac.createStereoPanner) return dest; const s = ac.createStereoPanner(); s.pan.value = clamp(pan, -1, 1); s.connect(dest); return s; }
  function osc(ac, type, f, when, dur, out) { const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, when); o.connect(out); o.start(when); o.stop(when + dur + 0.02); return o; }
  function noiseSrc(ac, when, dur, out, rate = 1) { const s = ac.createBufferSource(); s.buffer = noiseBuf(ac); s.playbackRate.value = rate; s.connect(out); s.start(when, (rate * 997 % 200) / 1000); s.stop(when + dur + 0.02); return s; }
  function bp(ac, f, q, out) { const b = ac.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = f; b.Q.value = q; b.connect(out); return b; }
  /** Primitive voices. ev: {t, kind, gain=1, freq, dur, pan}. Returns the source nodes (so live play can stop them). */
  const VOICES = {
    tick(ac, d, w, ev) { const g = ev.gain ?? 1, out = panned(ac, d, ev.pan);
      return [noiseSrc(ac, w, 0.03, bp(ac, ev.freq || 3400, 2.2, envGain(ac, out, w, 0.32 * g, 0.001, 0.018))),
              osc(ac, 'sine', (ev.freq || 3400) * 0.76, w, 0.03, envGain(ac, out, w, 0.06 * g, 0.001, 0.012))]; },
    clack(ac, d, w, ev) { const g = ev.gain ?? 1, out = panned(ac, d, ev.pan);
      const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime((ev.freq || 190) * 1.6, w); o.frequency.exponentialRampToValueAtTime(ev.freq || 190, w + 0.05);
      o.connect(envGain(ac, out, w, 0.28 * g, 0.002, 0.09)); o.start(w); o.stop(w + 0.14);
      return [noiseSrc(ac, w, 0.07, bp(ac, 820, 1.3, envGain(ac, out, w, 0.42 * g, 0.001, 0.05)), 0.7), o]; },
    click(ac, d, w, ev) { const g = ev.gain ?? 1, out = panned(ac, d, ev.pan), f = ev.freq || 1760;
      return [osc(ac, 'sine', f, w, 0.09, envGain(ac, out, w, 0.16 * g, 0.002, 0.07)), osc(ac, 'sine', f * 1.5, w + 0.012, 0.08, envGain(ac, out, w + 0.012, 0.1 * g, 0.002, 0.06))]; },
    tone(ac, d, w, ev) { const g = ev.gain ?? 1, out = panned(ac, d, ev.pan), f = ev.freq || 440, dur = ev.dur || 0.6;
      return [osc(ac, 'sine', f, w, dur, envGain(ac, out, w, 0.16 * g, ev.attack || 0.012, dur)), osc(ac, 'sine', f * 2, w, dur, envGain(ac, out, w, 0.04 * g, ev.attack || 0.012, dur * 0.6))]; },
  };
  /** Sort, and merge same-kind events closer than 12 ms (gain grows sub-linearly) so ensembles do not clip. */
  function normaliseScore(evs, dur) {
    const s = (evs || []).filter(e => e && VOICES[e.kind] && e.t >= 0 && e.t <= dur).map(e => Object.assign({}, e)).sort((a, b) => a.t - b.t);
    const out = [], last = {};
    for (const e of s) { const L = last[e.kind]; if (L && e.t - L.t < 0.012) { L.gain = Math.min(2, (L.gain ?? 1) + 0.25 * (e.gain ?? 1)); continue; } out.push(e); last[e.kind] = e; }
    return out;
  }
  function masterBus(ac) {
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.12;
    const g = ac.createGain(); g.gain.value = 0.8; g.connect(comp); comp.connect(ac.destination); return g;
  }
  function wavB64(buf) {
    const ch = buf.numberOfChannels, n = buf.length, sr = buf.sampleRate, bytes = 44 + n * ch * 2, ab = new ArrayBuffer(bytes), v = new DataView(ab);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, bytes - 8, true); str(8, 'WAVE'); str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * ch * 2, true); v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * ch * 2, true);
    const data = []; for (let c = 0; c < ch; c++) data.push(buf.getChannelData(c));
    let o = 44; for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) { const s = clamp(data[c][i], -1, 1); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2; }
    const u8 = new Uint8Array(ab); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  /** Offline render of a score → base64 WAV (48 kHz stereo 16-bit). */
  async function renderScore(evs, dur, sr = 48000) {
    const ac = new OfflineAudioContext(2, Math.ceil(sr * (dur + 0.3)), sr), bus = masterBus(ac);
    for (const e of evs) VOICES[e.kind](ac, bus, e.t, e);
    return wavB64(await ac.startRendering());
  }

  /* ─────────────────────────── Player chrome (CSS + DOM) ─────────────────────────── */
  const CSS = `
:root{--g:#0E1014;--pn:#171B23;--pn2:#1E232D;--ink:#F5EFE3;--dim:#A39A89;--ln:rgba(245,239,227,.10);--ln2:rgba(245,239,227,.18);
--cu:#CE9A6A;--sg:#8FA985;--pc:#D88B5C;--sl:#6E8CA8;--fd:'Fraunces',Georgia,serif;--ft:'DM Sans',system-ui,sans-serif;--fm:'Space Mono',ui-monospace,monospace;color-scheme:dark}
*{box-sizing:border-box}[hidden]{display:none!important}html,body{margin:0;background:var(--g);color:var(--ink)}body{font:15px/1.5 var(--ft);-webkit-font-smoothing:antialiased;overflow-x:hidden}
.at-app{max-width:1360px;margin:0 auto;padding:20px clamp(12px,3vw,32px) 28px}
.at-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:4px 0 16px}
.at-eyebrow{font:400 11px/1 var(--fm);letter-spacing:.14em;text-transform:uppercase;color:var(--dim);display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.at-eyebrow .lv{color:var(--g);background:var(--cu);border-radius:3px;padding:3px 6px 2px}
.at-title{font:italic 300 clamp(24px,3.4vw,36px)/1.1 var(--fd);margin:8px 0 0;letter-spacing:-.01em;text-wrap:balance}
.at-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:18px}
@media(min-width:1180px){.at-grid{grid-template-columns:minmax(0,1fr) 300px}}
.at-theatre{min-width:0}
.at-stage{position:relative;width:100%;border-radius:10px 10px 0 0;overflow:hidden;background:#000;border:1px solid var(--ln);border-bottom:0}
.at-stage canvas{display:block;width:100%!important;height:auto!important}
.at-cap{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;padding:0 6% 3.2%;pointer-events:none}
.at-cap span{font:500 clamp(12px,1.7vw,17px)/1.35 var(--ft);background:rgba(14,16,20,.78);color:var(--ink);padding:.35em .7em;border-radius:6px;max-width:44em;text-align:center;
backdrop-filter:blur(4px);transition:opacity .2s}.at-cap span:empty{opacity:0}
.at-holdpill{position:absolute;top:12px;right:12px;display:none;max-width:calc(100% - 24px);gap:8px;align-items:center;font:500 13px/1 var(--ft);background:var(--ink);color:var(--g);
border:0;border-radius:99px;padding:9px 14px;cursor:pointer;box-shadow:0 0 0 3px rgba(206,154,106,.45)}.at-held .at-holdpill{display:flex}
.at-transport{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;background:var(--pn);border:1px solid var(--ln);border-radius:0 0 10px 10px;padding:10px 12px}
.at-btn{appearance:none;border:1px solid var(--ln2);background:transparent;color:var(--ink);border-radius:7px;height:32px;min-width:32px;padding:0 9px;display:inline-flex;align-items:center;justify-content:center;gap:6px;
font:500 12px/1 var(--ft);cursor:pointer}.at-btn:hover{border-color:var(--dim)}.at-btn:focus-visible,.at-scrub:focus-visible,.at-chip:focus-visible{outline:2px solid var(--cu);outline-offset:2px}
.at-btn svg{width:14px;height:14px;fill:currentColor}.at-btn[aria-pressed=false]{color:var(--dim)}.at-play{background:var(--ink);color:var(--g);border-color:var(--ink);width:40px;height:32px}
.at-time{font:400 12px/1 var(--fm);color:var(--dim);white-space:nowrap;min-width:84px}.at-time b{color:var(--ink);font-weight:400}
.at-track{position:relative;flex:1 1 220px;min-width:160px;height:32px;display:flex;align-items:center}
.at-scrub{-webkit-appearance:none;appearance:none;width:100%;height:32px;background:transparent;margin:0;position:relative;z-index:2;cursor:pointer}
.at-scrub::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:linear-gradient(90deg,var(--ink) var(--pct,0%),var(--ln2) var(--pct,0%))}
.at-scrub::-moz-range-track{height:4px;border-radius:2px;background:linear-gradient(90deg,var(--ink) var(--pct,0%),var(--ln2) var(--pct,0%))}
.at-scrub::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--ink);margin-top:-5px;border:3px solid var(--pn)}
.at-scrub::-moz-range-thumb{width:10px;height:10px;border-radius:50%;background:var(--ink);border:3px solid var(--pn)}
.at-ticks{position:absolute;left:7px;right:7px;top:0;bottom:0;pointer-events:none;z-index:1}
.at-ticks i{position:absolute;top:9px;width:1px;height:14px;background:var(--dim);opacity:.7}.at-ticks i.cm{width:7px;height:7px;top:12.5px;margin-left:-3px;background:var(--cu);transform:rotate(45deg);opacity:1}
.at-group{display:flex;gap:4px;align-items:center}.at-sp{font:400 11px/1 var(--fm);padding:0 7px;min-width:0}.at-sp[aria-pressed=true]{background:var(--pn2);color:var(--ink);border-color:var(--dim)}
.at-chaps{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0 0}
.at-chip{appearance:none;border:1px solid var(--ln);background:transparent;color:var(--dim);border-radius:99px;padding:6px 11px 6px 8px;font:500 12px/1 var(--ft);cursor:pointer;display:inline-flex;gap:7px;align-items:center}
.at-chip .n{font:400 10px/1 var(--fm);color:var(--dim);opacity:.8}.at-chip[aria-current=true]{color:var(--ink);border-color:var(--ln2);background:var(--pn)}
.at-panel{background:var(--pn);border:1px solid var(--ln);border-radius:10px;padding:14px 16px 16px;align-self:start;min-width:0}
.at-h{font:400 10.5px/1 var(--fm);letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin:6px 0 12px;display:flex;justify-content:space-between}
.at-ctl{padding:12px 0;border-top:1px solid var(--ln)}.at-ctl:first-of-type{border-top:0;padding-top:2px}
.at-ctl label,.at-ctl .lab{display:flex;justify-content:space-between;gap:8px;font:500 13px/1.3 var(--ft);margin-bottom:8px}
.at-ctl output{font:400 12px/1.3 var(--fm);color:var(--ink)}.at-ctl .hint{font:400 12px/1.4 var(--ft);color:var(--dim);margin:-2px 0 8px}
.at-ctl input[type=range]{width:100%;accent-color:var(--cu)}.at-ctl select{width:100%;background:var(--pn2);color:var(--ink);border:1px solid var(--ln2);border-radius:6px;padding:6px}
.at-seg{display:flex;flex-wrap:wrap;gap:4px}.at-seg .at-btn{flex:1 1 auto}.at-seg .at-btn[aria-pressed=true]{background:var(--ink);color:var(--g);border-color:var(--ink)}
.at-sw{width:42px;height:24px;border-radius:99px;border:1px solid var(--ln2);background:var(--pn2);position:relative;cursor:pointer;padding:0}.at-sw::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--dim);transition:transform .15s}
.at-sw[aria-checked=true]{background:var(--sg);border-color:var(--sg)}.at-sw[aria-checked=true]::after{transform:translateX(18px);background:var(--ink)}
.at-row{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:8px;flex-wrap:wrap}.at-jump{font:400 11px/1 var(--fm);color:var(--dim);height:26px}
.at-commit{border:1px solid var(--ln2);border-radius:9px;padding:12px;margin:0 -4px;background:var(--g)}.at-commit.pulse{animation:at-pulse 1.4s ease-in-out infinite}
@keyframes at-pulse{50%{box-shadow:0 0 0 4px rgba(206,154,106,.35);border-color:var(--cu)}}
.at-commit .go{background:var(--ink);color:var(--g);border-color:var(--ink)}.at-commit .skip{border:0;color:var(--dim);text-decoration:underline;text-underline-offset:3px;padding:0}
.at-commit .done{font:400 12px/1.4 var(--fm);color:var(--sg)}
.at-read{margin-top:18px}.at-meta{display:grid;grid-template-columns:1fr auto;gap:6px 10px;font:13px/1.3 var(--ft)}
.at-meta dt{color:var(--dim)}.at-meta dd{margin:0;text-align:right;font:400 12px/1.3 var(--fm)}.at-meta dd small{display:block;color:var(--dim);font-size:10.5px}
.at-meta dd.ok b{color:var(--sg);font-weight:400}.at-meta dd.bad b{color:var(--pc);font-weight:400}
.at-foot{margin-top:16px;font:400 10.5px/1.6 var(--fm);color:var(--dim);letter-spacing:.04em;display:flex;gap:14px;flex-wrap:wrap}
.at-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media(max-width:560px){.at-app{padding:14px 12px 20px}.at-track{order:5;flex-basis:100%}.at-time{min-width:0}.at-stage{overflow:visible}.at-cap{position:static;padding:8px 10px;background:var(--pn);min-height:3.4em;align-items:center}.at-cap span{background:none;padding:0;font-size:14px}.at-holdpill{font-size:12px;padding:7px 10px;top:8px;right:8px}.at-head{margin-bottom:12px}}
html.at-film,html.at-film body{background:#000;overflow:hidden}html.at-film .at-stage{border:0;border-radius:0;position:fixed;left:0;top:0}
`;
  const ICON = {
    play: '<svg viewBox="0 0 16 16"><path d="M4 2.5v11l9.5-5.5z"/></svg>',
    pause: '<svg viewBox="0 0 16 16"><path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg>',
    cc: '<svg viewBox="0 0 16 16"><path d="M1.5 3h13v10h-13zM3 4.5v7h10v-7zM4.3 6.2h3v1.1H5.5v1.4h1.8v1.1h-3zm4.6 0h3v1.1h-1.8v1.4h1.8v1.1h-3z" fill-rule="evenodd"/></svg>',
    snd: '<svg viewBox="0 0 16 16"><path d="M2 6h3l4-3.5v11L5 10H2zM11 5.2a4 4 0 010 5.6l-.9-.9a2.7 2.7 0 000-3.8zM12.8 3.4a6.5 6.5 0 010 9.2l-.9-.9a5.2 5.2 0 000-7.4z"/></svg>',
  };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } } };

  /** Register @font-face rules for every face build.py embedded (window.ATELIER_FONTS: one copy, WOFF base64). */
  function registerFonts() {
    const emb = root.ATELIER_FONTS; if (!emb || typeof document === 'undefined' || document.getElementById('atelier-fonts')) return;
    const st = document.createElement('style'); st.id = 'atelier-fonts';
    st.textContent = Object.values(emb).map(f => `@font-face{font-family:'${f.family}';font-style:${f.style || 'normal'};font-weight:${f.weight || 400};font-display:block;src:url(data:font/woff;base64,${f.data}) format('woff')}`).join('');
    document.head.appendChild(st);
  }
  registerFonts();

  /* ─────────────────────────── Atelier.film ─────────────────────────── */
  function film(def) {
    if (typeof p5 === 'undefined') throw new Error('Atelier: p5 2.3.4 must load before atelier.js');
    const Q = new URLSearchParams(location.search);
    const FILM = Q.get('film') === '1';
    const [DW, DH] = def.size || [960, 540];
    const RW = FILM ? Math.max(16, parseInt(Q.get('w') || DW, 10)) : DW;
    const RH = Math.round(RW * DH / DW);
    const DUR = def.duration, FPS = def.fps || 30, WEBGL = def.renderer === 'webgl';
    const seed = Q.has('seed') ? parseInt(Q.get('seed'), 10) : (def.seed ?? 1);
    const KEY = 'atelier-' + def.id;
    const controls = def.controls || [], commitDefs = controls.filter(c => c.type === 'commit');
    const state = Object.assign({}, def.state || {});
    commitDefs.forEach(c => { if (!(c.key in state)) state[c.key] = c.min ?? 0; state[c.key + '$committed'] = false; });
    const defaults = Object.assign({}, state);
    const errors = [], violations = [];
    const report = (msg, e) => { if (errors.includes(msg)) return; errors.push(msg); console.error('[atelier] ' + msg, e || ''); };
    addEventListener('error', e => report('error: ' + (e.message || e)));
    addEventListener('unhandledrejection', e => report('rejection: ' + (e.reason && e.reason.message || e.reason)));

    /* ctx */
    const layers = new Map();
    let p = null, k = RW / DW, curT = Q.has('t') && !FILM ? clamp(parseFloat(Q.get('t')) || 0, 0, DUR) : 0;
    const ctx = {
      id: def.id, def, mode: FILM ? 'film' : 'live', duration: DUR, fps: FPS, seed, state,
      size: { w: DW, h: DH, rw: RW, rh: RH, k }, tokens: tokensFor(def.ground), U, fonts: {}, engine: null, commits: {}, commit: null,
      /** offscreen p5.Graphics (kind 'p2d'|'webgl') or p5.Framebuffer ('framebuffer', WEBGL films), cached by name;
       *  drawn in design units; rebuilt via opt.build(g, ctx) whenever the render scale changes. */
      layer(name, opt = {}) {
        let L = layers.get(name);
        if (L && L.k === k) return L.g;
        if (L) L.free && L.free();
        const w = opt.w || DW, hh = opt.h || DH, d = k * (opt.density || 1), kind = opt.kind || 'p2d';
        let g, free;
        if (kind === 'framebuffer') { g = p.createFramebuffer({ width: w, height: hh, density: d, format: opt.float ? p.FLOAT : p.UNSIGNED_BYTE, textureFiltering: opt.nearest ? p.NEAREST : p.LINEAR }); free = () => g.remove(); }
        else { g = p.createGraphics(w, hh, kind === 'webgl' ? p.WEBGL : p.P2D); g.pixelDensity(d); free = () => g.remove(); }
        layers.set(name, { g, k, free });
        if (opt.build) { if (kind === 'framebuffer') g.draw(() => opt.build(g, ctx)); else opt.build(g, ctx); }
        return g;
      },
      caption: t => { const c = (def.captions || []).find(c => t >= c.t0 && t < c.t1); return c ? c.text : ''; },
      chapter: t => { let i = -1; (def.chapters || []).forEach((c, j) => { if (t >= c.t) i = j; }); return i; },
    };
    function refreshCommits() {
      commitDefs.forEach(c => {
        const cd = c.countdown ?? 3, hold = c.jump - cd;
        ctx.commits[c.key] = { key: c.key, value: state[c.key], committed: !!state[c.key + '$committed'], auto: FILM, jump: c.jump, hold, countdownDur: cd,
          /** seconds left in the commit beat [hold, jump), else null */
          countdown: t => (t >= hold && t < c.jump ? c.jump - t : null) };
      });
      ctx.commit = commitDefs.length ? ctx.commits[commitDefs[0].key] : null;
    }
    let score = [], meta = [];
    function derive() {
      refreshCommits();
      stateAt.reset();
      if (def.engine) ctx.engine = def.engine(ctx);
      try { score = normaliseScore(def.score ? def.score(ctx) : [], DUR); } catch (e) { report('score(): ' + e.message, e); score = []; }
      try { meta = def.meta ? def.meta(ctx) : []; } catch (e) { report('meta(): ' + e.message, e); meta = []; }
      if (!Array.isArray(meta)) meta = Object.entries(meta).map(([label, value]) => ({ label, value }));
    }

    /* rendering: one queue, exact t */
    let ready = false, busy = false, want = null, waiters = [];
    const guard = { on: false };
    function pump() {
      if (busy || want === null || !ready) return;
      busy = true; const t = want; want = null; curT = t;
      Promise.resolve(p.redraw()).catch(e => report('redraw: ' + e.message, e)).then(() => {
        busy = false;
        const w = waiters; waiters = []; w.forEach(f => f(t));
        pump();
      });
    }
    function renderAt(t) { want = clamp(t, 0, DUR); return new Promise(r => { waiters.push(r); pump(); }); }
    function userDraw() {
      if (!ready) return;
      const t = curT, mr = Math.random, dn = Date.now;
      Math.random = function () { violations.push('Math.random in draw'); return mr(); };
      Date.now = function () { violations.push('Date.now in draw'); return dn(); };
      p.push();
      try { p.background(ctx.tokens.ground); def.draw(p, t, ctx); }
      catch (e) { report('draw(t=' + t.toFixed(3) + '): ' + e.message, e); }
      finally { p.pop(); Math.random = mr; Date.now = dn; }
    }
    /* clock-law guards on p5's impure helpers (recorded; gate fails on any) */
    function guardP5() {
      ['random', 'randomGaussian', 'millis'].forEach(n => { const f = p[n]; if (typeof f !== 'function') return; p[n] = function () { if (busy) violations.push('p.' + n + ' in draw'); return f.apply(p, arguments); }; });
    }

    /* fonts: def.fonts [{family, url|base64, weight}] → ctx.fonts[family] (p5.Font, for textToContours/WEBGL text) */
    async function loadFonts() {
      const emb = root.ATELIER_FONTS || {};
      for (const f of def.fonts || []) {
        const key = f.family + (f.weight ? ' ' + f.weight : '');
        const src = f.url || (f.base64 && 'data:font/woff;base64,' + f.base64) || (emb[key] && 'data:font/woff;base64,' + emb[key].data) ||
          (Object.values(emb).find(e => e.family === f.family) && 'data:font/woff;base64,' + Object.values(emb).find(e => e.family === f.family).data);
        if (!src) { report('font not embedded: ' + key + ' (build.py --fonts "' + f.family + '=path.woff2")'); continue; }
        try { ctx.fonts[f.family] = await p.loadFont(src); } catch (e) { report('loadFont ' + key + ': ' + e.message, e); }
      }
      if (document.fonts) {
        await Promise.all(Object.values(emb).map(e => document.fonts.load(`${e.style || 'normal'} ${e.weight || 400} 16px "${e.family}"`).catch(() => null)));
        await document.fonts.ready;
      }
    }

    /* DOM */
    let ui = {};
    function buildDOM() {
      const st = el('style'); st.textContent = CSS; document.head.appendChild(st);
      if (!document.title) document.title = def.title || def.id;
      const stage = el('div', 'at-stage'); stage.id = 'stage';
      if (FILM) {
        document.documentElement.classList.add('at-film');
        stage.style.width = RW + 'px'; stage.style.height = RH + 'px';
        document.body.appendChild(stage); ui = { stage }; return;
      }
      const app = el('div', 'at-app');
      const head = el('header', 'at-head');
      const hl = el('div'); hl.append(el('div', 'at-eyebrow', `<span>${def.direction || 'Atelier'}</span>${def.level ? `<span class="lv">${def.level}</span>` : ''}<span>${fmtTime(DUR)}</span>`), el('h1', 'at-title', def.title || def.id));
      head.append(hl);
      const grid = el('div', 'at-grid'), th = el('section', 'at-theatre');
      stage.setAttribute('role', 'img'); stage.setAttribute('aria-label', def.title || def.id);
      const cap = el('div', 'at-cap', '<span></span>'); const capLive = el('div', 'at-sr'); capLive.setAttribute('aria-live', 'polite');
      const pill = el('button', 'at-holdpill', 'Your call first — commit a guess to continue →'); pill.type = 'button';
      stage.append(cap, pill);
      const tr = el('div', 'at-transport');
      const play = el('button', 'at-btn at-play', ICON.play); play.type = 'button'; play.setAttribute('aria-label', 'Play');
      const time = el('div', 'at-time');
      const track = el('div', 'at-track'), ticks = el('div', 'at-ticks'), scrub = el('input', 'at-scrub');
      Object.assign(scrub, { type: 'range', min: 0, max: DUR, step: 1 / FPS, value: 0 }); scrub.setAttribute('aria-label', 'Seek');
      (def.chapters || []).forEach(c => { const i = el('i'); i.style.left = (c.t / DUR * 100) + '%'; i.title = c.label; ticks.appendChild(i); });
      commitDefs.forEach(c => { const i = el('i', 'cm'); i.style.left = (c.jump / DUR * 100) + '%'; i.title = 'commit · ' + c.label; ticks.appendChild(i); });
      track.append(ticks, scrub);
      const spd = el('div', 'at-group'); spd.setAttribute('aria-label', 'Speed');
      const speeds = [0.5, 1, 1.5, 2].map(s => { const b = el('button', 'at-btn at-sp', s + '×'); b.type = 'button'; b.dataset.s = s; spd.appendChild(b); return b; });
      const ccb = el('button', 'at-btn', ICON.cc); ccb.type = 'button'; ccb.setAttribute('aria-label', 'Captions');
      const sndb = el('button', 'at-btn', ICON.snd); sndb.type = 'button'; sndb.setAttribute('aria-label', 'Sound');
      const tog = el('div', 'at-group'); tog.append(ccb, sndb);
      tr.append(play, time, track, spd, tog);
      const chaps = el('nav', 'at-chaps'); chaps.setAttribute('aria-label', 'Chapters');
      const chapBtns = (def.chapters || []).map((c, i) => { const b = el('button', 'at-chip', `<span class="n">${String(i + 1).padStart(2, '0')}</span>${c.label}`); b.type = 'button'; b.onclick = () => { seekUI(c.t); }; chaps.appendChild(b); return b; });
      th.append(stage, tr, chaps, capLive);
      const panel = el('aside', 'at-panel');
      const ctlWrap = el('div');
      if (controls.length) { panel.append(el('div', 'at-h', '<span>Try it</span><span>state</span>'), ctlWrap); }
      const read = el('div', 'at-read'); read.append(el('div', 'at-h', '<span>Readout</span><span>engine</span>')); const dl = el('dl', 'at-meta'); read.append(dl);
      panel.append(read);
      grid.append(th, panel);
      const foot = el('footer', 'at-foot', `<span>${def.id}</span><span>seed ${seed}</span><span>p5 ${p5.VERSION || '2.3.4'}</span><span>atelier ${VERSION}</span><span>frame = f(t, state, seed)</span>`);
      app.append(head, grid, foot); document.body.appendChild(app);
      ui = { stage, cap: cap.firstChild, capLive, pill, play, time, scrub, speeds, ccb, sndb, chapBtns, ctlWrap, dl, panel };
    }

    /* live player state */
    let playing = false, speed = parseFloat(store.get(KEY + '-speed')) || 1, capsOn = store.get(KEY + '-cc') !== '0', soundOn = store.get(KEY + '-snd') !== '0', heldOn = null;
    if (![0.5, 1, 1.5, 2].includes(speed)) speed = 1;
    let lastCap = null;
    function syncUI() {
      if (FILM) return;
      ui.play.innerHTML = playing ? ICON.pause : ICON.play; ui.play.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      ui.time.innerHTML = `<b>${fmtTime(curT)}</b> / ${fmtTime(DUR)}`;
      if (document.activeElement !== ui.scrub || !scrubbing) ui.scrub.value = curT;
      ui.scrub.style.setProperty('--pct', (curT / DUR * 100) + '%');
      const ci = ctx.chapter(curT); ui.chapBtns.forEach((b, i) => b.setAttribute('aria-current', i === ci ? 'true' : 'false'));
      const c = capsOn ? ctx.caption(curT) : '';
      if (c !== lastCap) { ui.cap.textContent = c; ui.capLive.textContent = c; lastCap = c; }
      ui.speeds.forEach(b => b.setAttribute('aria-pressed', +b.dataset.s === speed ? 'true' : 'false'));
      ui.ccb.setAttribute('aria-pressed', capsOn ? 'true' : 'false'); ui.sndb.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      ui.stage.classList.toggle('at-held', !!heldOn);
      ui.ctlWrap.querySelectorAll('.at-commit').forEach(n => n.classList.toggle('pulse', heldOn === n.dataset.key));
    }
    let scrubbing = false;
    /** first uncommitted commit beat whose hold point lies in (from, to] — playback/scrub may not cross it */
    function gate(from, to) {
      if (FILM) return null;
      let hit = null;
      for (const c of commitDefs) { const C = ctx.commits[c.key]; if (C.committed) continue; if (to > C.hold + 1e-6 && from <= C.hold + 1e-6 && (!hit || C.hold < hit.hold)) hit = C; }
      return hit;
    }
    function seekUI(t) {
      t = clamp(t, 0, DUR);
      const g = gate(0, t); if (g && t > g.hold) { t = g.hold; heldOn = g.key; playing = false; } else heldOn = null;
      curT = t; audio.reset(); renderAt(t); syncUI();
    }
    function setPlaying(on) {
      if (on && heldOn) { focusCommit(heldOn); return; }
      if (on && curT >= DUR - 1e-3) curT = 0;
      playing = on; audio.unlock(); audio.reset(); syncUI();
    }
    function focusCommit(key) { const n = ui.ctlWrap && ui.ctlWrap.querySelector(`.at-commit[data-key="${key}"]`); if (n) { n.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); const r = n.querySelector('input'); r && r.focus({ preventScroll: true }); } }

    function setState(patch, opts = {}) {
      Object.assign(state, patch); derive(); audio.reset();
      if (!FILM) { renderMeta(); syncControls(); }
      return opts.noRender ? Promise.resolve() : renderAt(curT);
    }

    /* controls panel */
    const syncers = [];
    function syncControls() { syncers.forEach(f => f()); }
    function buildControls() {
      const wrap = ui.ctlWrap; if (!wrap) return;
      for (const c of controls) {
        const row = el('div', 'at-ctl'), id = 'at-c-' + c.key, fmt = c.format || (v => (typeof v === 'number' ? +v.toFixed(4) : v));
        if (c.type === 'toggle') {
          const lab = el('div', 'lab', `<span>${c.label}</span>`), sw = el('button', 'at-sw'); sw.type = 'button'; sw.setAttribute('role', 'switch'); sw.id = id; sw.setAttribute('aria-label', c.label);
          sw.onclick = () => setState({ [c.key]: !state[c.key] }); lab.appendChild(sw); row.append(lab);
          syncers.push(() => sw.setAttribute('aria-checked', state[c.key] ? 'true' : 'false'));
        } else if (c.type === 'range') {
          const lab = el('label', '', `<span>${c.label}</span>`), out = el('output'); lab.htmlFor = id; lab.appendChild(out);
          const r = el('input'); Object.assign(r, { type: 'range', id, min: c.min, max: c.max, step: c.step || 'any' });
          r.oninput = () => setState({ [c.key]: parseFloat(r.value) }); row.append(lab, r);
          syncers.push(() => { if (document.activeElement !== r) r.value = state[c.key]; out.textContent = fmt(state[c.key]); });
        } else if (c.type === 'select') {
          const opts = (c.options || []).map(o => (Array.isArray(o) ? { value: o[0], label: o[1] } : typeof o === 'object' ? o : { value: o, label: String(o) }));
          row.append(el('div', 'lab', `<span>${c.label}</span>`));
          if (opts.length <= 4) {
            const seg = el('div', 'at-seg'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', c.label);
            const bs = opts.map(o => { const b = el('button', 'at-btn', o.label); b.type = 'button'; b.onclick = () => setState({ [c.key]: o.value }); seg.appendChild(b); return [b, o]; });
            row.append(seg); syncers.push(() => bs.forEach(([b, o]) => b.setAttribute('aria-pressed', String(o.value) === String(state[c.key]) ? 'true' : 'false')));
          } else {
            const s = el('select'); s.id = id; opts.forEach(o => { const op = el('option', '', o.label); op.value = o.value; s.appendChild(op); });
            s.onchange = () => { const o = opts.find(o => String(o.value) === s.value); setState({ [c.key]: o ? o.value : s.value }); }; row.append(s);
            syncers.push(() => { s.value = state[c.key]; });
          }
        } else if (c.type === 'commit') {
          row.className = 'at-ctl'; const box = el('div', 'at-commit'); box.dataset.key = c.key;
          const lab = el('label', '', `<span>${c.label}</span>`), out = el('output'); lab.htmlFor = id; lab.appendChild(out);
          const r = el('input'); Object.assign(r, { type: 'range', id, min: c.min, max: c.max, step: c.step || 'any' });
          const hint = c.hint ? el('div', 'hint', c.hint) : null;
          const rowB = el('div', 'at-row'), go = el('button', 'at-btn go', 'Commit'), skip = el('button', 'at-btn skip', 'skip — just show me'), done = el('div', 'done'), again = el('button', 'at-btn at-jump', 're-guess');
          go.type = skip.type = again.type = 'button';
          r.oninput = () => setState({ [c.key]: parseFloat(r.value) });
          const commit = () => { const wasHeld = heldOn === c.key; heldOn = null; setState({ [c.key + '$committed']: true }); if (wasHeld) setPlaying(true); };
          go.onclick = commit; skip.onclick = commit;
          again.onclick = () => { setState({ [c.key + '$committed']: false }); seekUI(ctx.commits[c.key].hold); };
          rowB.append(go, skip, done, again);
          box.append(lab); hint && box.append(hint); box.append(r, rowB); row.append(box);
          syncers.push(() => {
            const C = ctx.commits[c.key]; if (document.activeElement !== r) r.value = state[c.key]; out.textContent = fmt(state[c.key]);
            r.disabled = C.committed; go.hidden = skip.hidden = C.committed; done.hidden = again.hidden = !C.committed; done.textContent = '✓ committed · reveal at ' + fmtTime(c.jump);
          });
        }
        if (c.hint && c.type !== 'commit') row.append(el('div', 'hint', c.hint));
        if (c.jump != null && c.type !== 'commit') { const j = el('button', 'at-btn at-jump', '▸ see it at ' + fmtTime(c.jump)); j.type = 'button'; j.onclick = () => { seekUI(c.jump); setPlaying(true); }; row.append(j); }
        wrap.appendChild(row);
      }
      if (controls.length) { const rs = el('button', 'at-btn at-jump', 'reset'); rs.type = 'button'; rs.style.marginTop = '10px'; rs.onclick = () => { setState(Object.assign({}, defaults)); }; wrap.appendChild(rs); }
      syncControls();
    }
    function renderMeta() {
      if (!ui.dl) return; ui.dl.innerHTML = '';
      // never spoil a prediction: the engine readout stays hidden until every commit beat is committed
      if (commitDefs.some(c => !state[c.key + '$committed'])) { ui.dl.append(el('dt', '', 'Engine readout'), el('dd', '', 'hidden until you commit your guess')); return; }
      for (const m of meta) {
        const dt = el('dt', '', m.label), dd = el('dd');
        const v = typeof m.value === 'number' ? (Number.isInteger(m.value) ? tabular(m.value) : m.value.toFixed(3)) : m.value;
        let sub = '';
        if (m.check) { const x = checkMeta(m); dd.className = x.ok ? 'ok' : 'bad'; sub = `<small>expected ${x.expected.toFixed(x.N ? 1 : 3)}${x.N ? ' ± ' + x.sd.toFixed(1) : ''} ${x.ok ? '✓' : '✗'}</small>`; }
        dd.innerHTML = `<b>${v}</b>${sub}`; ui.dl.append(dt, dd);
      }
    }
    /** meta row {value, check:{world, k, p, c, retry, N?, tol?}} vs AgentLoop.exact: counts within 4 sd; probabilities within tol (5e-4). */
    function checkMeta(m) {
      const c = m.check, E = exact(c.k, c.p ?? 0.95, c.c ?? 0.8, c.retry ?? 1), q = E[c.world === 'on' ? 'on' : 'off'][c.k];
      if (c.N) { const exp = c.N * q, sd = Math.sqrt(c.N * q * (1 - q)); return { ok: Math.abs(m.value - exp) <= (c.sds ?? 4) * sd + 1e-9, expected: exp, sd, N: c.N }; }
      return { ok: Math.abs(m.value - q) <= (c.tol ?? 5e-4), expected: q, sd: 0 };
    }

    /* live audio */
    const audio = {
      ac: null, bus: null, nodes: [], horizon: 0, idx: 0,
      unlock() {
        if (FILM || !soundOn) return;
        try {
          if (!this.ac) { const AC = root.AudioContext || root.webkitAudioContext; if (!AC) return; this.ac = new AC(); this.bus = masterBus(this.ac); }
          if (this.ac.state === 'suspended') this.ac.resume();
        } catch (e) { /* audio is optional */ }
      },
      reset() {
        if (this.ac) { const now = this.ac.currentTime; this.nodes.forEach(n => { try { n.stop(now); } catch (e) { /* already stopped */ } }); }
        this.nodes = []; this.horizon = curT; let i = 0; while (i < score.length && score[i].t < curT) i++; this.idx = i;
      },
      tick() {
        if (!this.ac || !playing || !soundOn || this.ac.state !== 'running') return;
        const end = curT + 0.25 * speed, now = this.ac.currentTime;
        while (this.idx < score.length && score[this.idx].t < end) {
          const e = score[this.idx++]; if (e.t < this.horizon - 1e-6) continue;
          const when = now + Math.max(0, (e.t - curT) / speed);
          try { this.nodes.push(...VOICES[e.kind](this.ac, this.bus, when, e)); } catch (er) { /* skip a bad voice */ }
        }
        this.horizon = end;
        if (this.nodes.length > 600) this.nodes = this.nodes.slice(-300);
      },
    };

    /* rAF loop (live only) */
    let last = 0;
    function frame(ts) {
      const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0; last = ts;
      if (playing && !scrubbing) {
        let nt = curT + dt * speed;
        const g = gate(curT, nt);
        if (g) { nt = g.hold; playing = false; heldOn = g.key; focusCommit(g.key); }
        if (nt >= DUR) { nt = DUR; playing = false; }
        curT = nt; renderAt(curT); audio.tick(); syncUI();
      }
      requestAnimationFrame(frame);
    }
    function wireUI() {
      ui.play.onclick = () => setPlaying(!playing);
      ui.pill.onclick = () => focusCommit(heldOn);
      ui.scrub.addEventListener('input', () => { scrubbing = true; seekUI(parseFloat(ui.scrub.value)); });
      ui.scrub.addEventListener('change', () => { scrubbing = false; audio.reset(); });
      ui.speeds.forEach(b => (b.onclick = () => { speed = +b.dataset.s; store.set(KEY + '-speed', speed); audio.reset(); syncUI(); }));
      ui.ccb.onclick = () => { capsOn = !capsOn; store.set(KEY + '-cc', capsOn ? '1' : '0'); lastCap = null; syncUI(); };
      ui.sndb.onclick = () => { soundOn = !soundOn; store.set(KEY + '-snd', soundOn ? '1' : '0'); if (soundOn) audio.unlock(); audio.reset(); syncUI(); };
      const unlockOnce = () => audio.unlock();
      addEventListener('pointerdown', unlockOnce, { once: true }); addEventListener('keydown', unlockOnce, { once: true });
      addEventListener('keydown', e => {
        const tag = (e.target.tagName || '').toUpperCase();
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
        if (e.code === 'Space' && tag !== 'BUTTON') { e.preventDefault(); setPlaying(!playing); }
        else if (e.key === 'ArrowRight') seekUI(curT + (e.shiftKey ? 5 : 1));
        else if (e.key === 'ArrowLeft') seekUI(curT - (e.shiftKey ? 5 : 1));
        else if (e.key === '.') seekUI(curT + 1 / FPS);
        else if (e.key === ',') seekUI(curT - 1 / FPS);
        else if (e.key === 'Home') seekUI(0);
        else if (e.key === 'End') seekUI(DUR);
        else if (e.key === 'c') ui.ccb.click();
        else if (e.key === 'm') ui.sndb.click();
      });
      if ('ResizeObserver' in root) {
        let to = null;
        new ResizeObserver(() => { clearTimeout(to); to = setTimeout(fitLive, 120); }).observe(ui.stage);
      }
    }
    function liveScale() { const w = ui.stage.getBoundingClientRect().width || DW; return clamp(w * Math.min(2, root.devicePixelRatio || 1), 160, 1920) / DW; }
    function fitLive() {
      if (!ready) return;
      const nk = liveScale(); if (Math.abs(nk - k) < 0.02) return;
      k = nk; ctx.size.k = k; ctx.size.rw = Math.round(DW * k); ctx.size.rh = Math.round(DH * k);
      p.pixelDensity(k); renderAt(curT);
    }

    /* boot */
    let resolveReady; const readyP = new Promise(r => (resolveReady = r));
    function boot() {
      buildDOM();
      if (!FILM) k = liveScale();
      ctx.size.k = k; ctx.size.rw = Math.round(DW * k); ctx.size.rh = Math.round(DH * k);
      new p5(pp => {
        p = pp;
        p.setup = async () => {
          p.createCanvas(DW, DH, WEBGL ? p.WEBGL : p.P2D);
          if (WEBGL) p.setAttributes({ preserveDrawingBuffer: true, antialias: true });
          p.pixelDensity(k); p.noLoop(); p.randomSeed(seed); p.noiseSeed(seed);
          guardP5();
          await loadFonts();
          derive();
          if (def.setup) await def.setup(p, ctx);
          derive();   // setup may have built what score/meta read
          if (!FILM) { buildControls(); renderMeta(); wireUI(); }
          ready = true;
          setTimeout(async () => { await renderAt(curT); if (!FILM) { syncUI(); requestAnimationFrame(frame); } resolveReady(true); }, 0);
        };
        p.draw = userDraw;
      }, ui.stage);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

    /* headless hooks */
    const api = {
      ready: readyP,
      version: VERSION,
      /** render exactly time t; resolves after the frame is on the canvas */
      async seek(t) { await readyP; playing = false; heldOn = null; await renderAt(t); audio.reset(); syncUI(); return { t: clamp(t, 0, DUR), errors: errors.length, violations: violations.length }; },
      info: () => ({ id: def.id, title: def.title, direction: def.direction, level: def.level, duration: DUR, fps: FPS, size: [ctx.size.rw, ctx.size.rh], design: [DW, DH],
        renderer: WEBGL ? 'webgl' : 'p2d', seed, chapters: def.chapters || [], captions: def.captions || [], controls: controls.map(c => ({ key: c.key, type: c.type, label: c.label, jump: c.jump })),
        mode: ctx.mode, atelier: VERSION, p5: p5.VERSION, events: score.length }),
      setState: (o) => setState(o),
      state: () => Object.assign({}, state),
      meta: () => meta.map(m => Object.assign({}, m, m.check ? { result: checkMeta(m) } : {})),
      score: () => score.map(e => Object.assign({}, e)),
      audio: async () => { await readyP; return renderScore(score, DUR); },
      /** canvas pixels as a data URL ('png' | 'jpg', quality) */
      capture: (fmt = 'png', q = 0.92) => p.canvas.toDataURL(fmt === 'jpg' ? 'image/jpeg' : 'image/png', q),
      errors, violations,
      get t() { return curT; },
      play: () => setPlaying(true), pause: () => setPlaying(false),
    };
    root.__atelier = api;
    return api;
  }

  root.Atelier = { VERSION, film, U, AgentLoop, tokens, exact };
})(typeof window !== 'undefined' ? window : globalThis);
