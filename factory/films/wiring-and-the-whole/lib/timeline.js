/* arsenal/core/timeline.js · the authoring core. Pure of t. No Math.random, Date, frameCount, millis.
   track(key, keyframes)           one animated number or colour, compiled to absolute intervals    [[track-tween]]
   timeline().play/wait/all/stagger/beat   cursor builder, compiled once; seek = binary search      [[timeline-builder]]
   scene(t0, t1, fn) / sequence()  scene-local time windows with cross-fade                         [[scene-local-time]]
   captions(list)                  caption lookup from an array, or from the beats of a timeline    [[beats-and-captions]]
   Colours: colorMode ('rgb' | 'hsl' | 'oklab') is fixed per key at compile time, then lerped in that space. [[lerp-color]] */
(function (root) {
'use strict';
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const EASE = {
  linear: (u) => u,
  smooth: (u) => u * u * (3 - 2 * u),                                   // smoothstep
  in: (u) => u * u * u,
  out: (u) => 1 - Math.pow(1 - u, 3),
  inout: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2), // the factory kit's ease()
  expo: (u) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u)),
  back: (u) => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2),
  step: (u) => (u >= 1 ? 1 : 0),
};
const easeFn = (e) => (typeof e === 'function' ? e : EASE[e || 'smooth'] || (() => { throw new Error('timeline: unknown ease ' + e); })());

/* ── colour ─────────────────────────────────────────────────────────────── */
function parseColor(s) {
  s = String(s).trim(); let m;
  if ((m = /^#([0-9a-f]{3,8})$/i.exec(s))) {
    let h = m[1]; if (h.length <= 4) h = h.split('').map((c) => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
  }
  if ((m = /^rgba?\(([^)]+)\)$/i.exec(s))) { const v = m[1].split(',').map(parseFloat); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; }
  throw new Error('timeline: cannot parse colour ' + s);
}
const css = (c) => 'rgba(' + Math.round(clamp(c[0], 0, 255)) + ',' + Math.round(clamp(c[1], 0, 255)) + ',' + Math.round(clamp(c[2], 0, 255)) + ',' + +clamp(c[3]).toFixed(3) + ')';
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const gam = (v) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
function toOk(c) {
  const r = lin(c[0]), g = lin(c[1]), b = lin(c[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function fromOk(L, a, b) {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3), m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3), s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), gam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)];
}
function toHsl(c) {
  const r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (d < 1e-9) return [NaN, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1)); let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}
function fromHsl(h, s, l) {
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}
function mixColor(A, B, u, mode) {                     // A, B: [r,g,b,a] 0..255; u already eased
  const al = A[3] + (B[3] - A[3]) * u;
  if (mode === 'oklab') { const p = toOk(A), q = toOk(B), o = fromOk(p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, p[2] + (q[2] - p[2]) * u); return [o[0], o[1], o[2], al]; }
  if (mode === 'hsl') {
    const p = toHsl(A), q = toHsl(B); let h0 = p[0], h1 = q[0];
    if (isNaN(h0)) h0 = h1; if (isNaN(h1)) h1 = h0; if (isNaN(h0)) h0 = h1 = 0;
    let dh = ((h1 - h0 + 540) % 360) - 180;              // shortest way round the wheel
    const o = fromHsl((h0 + dh * u + 360) % 360, p[1] + (q[1] - p[1]) * u, p[2] + (q[2] - p[2]) * u); return [o[0], o[1], o[2], al];
  }
  return [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u, al];
}
const MODES = { rgb: 1, hsl: 1, oklab: 1 };

/* ── the shared lookup: segs sorted by t0 ──────────────────────────────── */
// seg = { t0, t1, a, b, fn, e }  (a, b raw: number or [r,g,b,a]); the latest-started seg with t0 <= t owns t.
function rawAt(segs, init, t, mode) {
  let lo = 0, hi = segs.length - 1, k = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (segs[m].t0 <= t) { k = m; lo = m + 1; } else hi = m - 1; }
  if (k < 0) return init;
  const s = segs[k]; if (t >= s.t1) return s.b;
  const u = s.fn((t - s.t0) / (s.t1 - s.t0));
  return typeof s.a === 'number' ? s.a + (s.b - s.a) * u : mixColor(s.a, s.b, u, mode);
}
const out = (raw) => (typeof raw === 'number' ? raw : css(raw));
const kindOf = (v) => (typeof v === 'number' ? 'num' : 'color');
const norm = (v) => (typeof v === 'string' ? parseColor(v) : v);

/* ── track ──────────────────────────────────────────────────────────────── */
// track('x', [{t:0, v:0}, {t:2, v:100, ease:'out'}, ...], {colorMode})  ease on a keyframe governs the segment LEAVING it.
function track(key, kfs, opts = {}) {
  if (!kfs || !kfs.length) throw new Error('track ' + key + ': no keyframes');
  const k = kfs.map((f, i) => ({ t: f.t, v: norm(f.v), e: f.ease, i })).sort((p, q) => p.t - q.t || p.i - q.i);
  const kind = kindOf(k[0].v), mode = opts.colorMode || 'rgb';
  if (!MODES[mode]) throw new Error('track ' + key + ': colorMode ' + mode);
  const segs = [];
  for (let i = 0; i < k.length - 1; i++) {
    if (kindOf(k[i + 1].v) !== kind) throw new Error('track ' + key + ': mixed number/colour');
    segs.push({ t0: k[i].t, t1: k[i + 1].t, a: k[i].v, b: k[i + 1].v, fn: easeFn(k[i].e), e: k[i].e || 'smooth' });
  }
  const init = k[0].v;
  const tr = { key, kind, colorMode: kind === 'color' ? mode : null, duration: k[k.length - 1].t, segs: Object.freeze(segs),
    at: (t) => out(rawAt(segs, init, t, mode)), intervals: () => segs.map((s) => ({ t0: s.t0, t1: s.t1, from: out(s.a), to: out(s.b), ease: s.e })) };
  return Object.freeze(tr);
}

/* ── captions ───────────────────────────────────────────────────────────── */
// captions([{t, text, end?}], {fade: 0.3, end}) -> f(t) -> { text, a, i, local } | null. Latest entry with t <= now owns the screen.
function captions(list, opts = {}) {
  const fade = opts.fade == null ? 0.3 : opts.fade, L = list.slice().sort((p, q) => p.t - q.t);
  return function (t) {
    let lo = 0, hi = L.length - 1, k = -1;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (L[m].t <= t) { k = m; lo = m + 1; } else hi = m - 1; }
    if (k < 0) return null;
    const c = L[k], end = c.end != null ? c.end : k === L.length - 1 ? opts.end : undefined;
    if (end != null && t >= end) return null;
    let a = fade > 0 ? EASE.smooth(clamp((t - c.t) / fade)) : 1;
    if (end != null && fade > 0) a *= EASE.smooth(clamp((end - t) / fade));
    return { text: c.text, a, i: k, local: t - c.t };
  };
}

/* ── timeline builder ───────────────────────────────────────────────────── */
function timeline() {
  let cursor = 0, compiled = null;
  const segs = {}, init = {}, kinds = {}, modes = {}, beats = [];
  const setKind = (key, v) => { const kd = kindOf(v); if (kinds[key] && kinds[key] !== kd) throw new Error('timeline: ' + key + ' mixes number and colour'); kinds[key] = kd; };
  const live = (key, t) => {                                          // value so far, used to start the next play(): O(segs of key)
    let best = null; for (const s of segs[key] || []) if (s.t0 <= t && (!best || s.t0 >= best.t0)) best = s;
    if (!best) return init[key]; if (t >= best.t1) return best.b;
    const u = best.fn((t - best.t0) / (best.t1 - best.t0)); return typeof best.a === 'number' ? best.a + (best.b - best.a) * u : mixColor(best.a, best.b, u, modes[key] || 'rgb');
  };
  const api = {
    init(o) { for (const k in o) { init[k] = norm(o[k]); setKind(k, init[k]); } compiled = null; return api; },
    colorMode(key, mode) { if (!MODES[mode]) throw new Error('timeline: colorMode ' + mode); modes[key] = mode; compiled = null; return api; },
    play(key, to, dur, ease, o) {                                     // play(key, to, dur, ease, {from}) or play({k: v, ...}, dur, ease)
      if (key && typeof key === 'object') { const d = to == null ? 1 : to, e = dur; let end = cursor; const c0 = cursor; for (const k in key) { cursor = c0; api.play(k, key[k], d, e); end = Math.max(end, cursor); } cursor = end; return api; }
      if (dur == null) dur = 1; const b = norm(to); setKind(key, b);
      const from = o && o.from != null ? norm(o.from) : (key in init || (segs[key] && segs[key].length)) ? live(key, cursor) : b;
      if (!(key in init)) init[key] = o && o.from != null ? norm(o.from) : b;
      (segs[key] = segs[key] || []).push({ t0: cursor, t1: cursor + dur, a: from, b, fn: easeFn(ease), e: typeof ease === 'string' ? ease : 'smooth' });
      cursor += dur; compiled = null; return api;
    },
    wait(d = 1) { cursor += d; return api; },
    all(...steps) { const c0 = cursor; let end = c0; for (const s of steps) { cursor = c0; s(api); end = Math.max(end, cursor); } cursor = end; return api; },
    stagger(n, gap, fn, o = {}) {                                     // fn(i, tl): item i starts at c0 + rank(i) * gap; cursor ends at the LATEST end
      const c0 = cursor; let end = c0;
      for (let i = 0; i < n; i++) {
        const rank = o.order === 'end' ? n - 1 - i : o.order === 'center' ? Math.abs(i - (n - 1) / 2) : i;
        cursor = c0 + rank * gap; fn(i, api); end = Math.max(end, cursor);
      }
      cursor = end; return api;
    },
    beat(name, caption) { beats.push({ name, t: cursor, caption }); compiled = null; return api; },
    get cursor() { return cursor; },
    at(key, t) { return api.compile().at(key, t); },
    compile() {
      if (compiled) return compiled;
      const K = {}, keys = Object.keys(init).concat(Object.keys(segs).filter((k) => !(k in init)));
      let dur = cursor;
      for (const k of keys) {
        const arr = (segs[k] || []).map((s, i) => ({ s, i })).sort((p, q) => p.s.t0 - q.s.t0 || p.i - q.i).map((x) => x.s);
        for (const s of arr) dur = Math.max(dur, s.t1);
        K[k] = { segs: Object.freeze(arr), init: init[k], mode: modes[k] || 'rgb', kind: kinds[k] };
      }
      const bs = beats.slice().sort((p, q) => p.t - q.t).map((b) => Object.freeze({ ...b }));
      const at = (key, t) => { const e = K[key]; if (!e) throw new Error('timeline: no track ' + key); return out(rawAt(e.segs, e.init, t, e.mode)); };
      compiled = Object.freeze({
        duration: dur, keys: Object.freeze(keys), beats: Object.freeze(bs), at,
        values: (t, ks) => { const o = {}; for (const k of ks || keys) o[k] = at(k, t); return o; },
        kind: (key) => K[key].kind, colorMode: (key) => (K[key].kind === 'color' ? K[key].mode : null),
        intervals: (key) => K[key].segs.map((s) => ({ t0: s.t0, t1: s.t1, from: out(s.a), to: out(s.b), ease: s.e })),
        beatTime: (name) => { const b = bs.find((x) => x.name === name); if (!b) throw new Error('timeline: no beat ' + name); return b.t; },
        captions: (o) => captions(bs.filter((b) => b.caption != null).map((b) => ({ t: b.t, text: b.caption })), { end: dur, ...o }),
      });
      return compiled;
    },
  };
  return api;
}

/* ── scene-local time ───────────────────────────────────────────────────── */
// scene(t0, t1, fn, {fade, fadeIn, fadeOut, hold}) : fn(frame, ...args), frame = { t: local seconds, dur, u: t/dur, a: cross-fade alpha 0..1 }.
// Overlap adjacent windows by their fade to cross-fade. hold: stay on (a = 1) after t1, for the last scene.
function scene(t0, t1, fn, o = {}) {
  const fin = o.fadeIn != null ? o.fadeIn : o.fade != null ? o.fade : 0.4, fout = o.fadeOut != null ? o.fadeOut : o.fade != null ? o.fade : 0.4, dur = t1 - t0;
  const at = (t) => {
    if (t < t0 || (t >= t1 && !o.hold)) return null;
    const a = (fin > 0 ? EASE.smooth(clamp((t - t0) / fin)) : 1) * (t >= t1 ? 1 : fout > 0 ? EASE.smooth(clamp((t1 - t) / fout)) : 1);
    return { t: t - t0, dur, u: clamp((t - t0) / dur), a };
  };
  return Object.freeze({ t0, t1, dur, at, fn, run(t, ...args) { const f = at(t); if (f) fn(f, ...args); return f; } });
}
// sequence([{dur, fn}], {fade}) : lay scenes end to end, each overlapping the previous by `fade`. First has no fade-in, last holds.
function sequence(specs, o = {}) {
  const fade = o.fade == null ? 0.4 : o.fade; let t = 0;
  const list = specs.map((s, i) => { const t0 = i ? t - fade : 0, sc = scene(t0, t0 + s.dur, s.fn, { fade, fadeIn: i ? fade : 0, hold: i === specs.length - 1 }); t = t0 + s.dur; return sc; });
  return { list, run(t, host, ...args) { for (const sc of list) { const f = sc.at(t); if (!f) continue; if (host && host.enter) host.enter(f); sc.fn(f, ...args); if (host && host.exit) host.exit(f); } } };
}
// scenes([scene, ...]) : run every active window of an explicit list (windows from beat times, say), same host protocol.
function scenes(list) {
  return { list, run(t, host, ...args) { for (const sc of list) { const f = sc.at(t); if (!f) continue; if (host && host.enter) host.enter(f); sc.fn(f, ...args); if (host && host.exit) host.exit(f); } } };
}

const API = { track, timeline, scene, sequence, scenes, captions, ease: EASE, color: { parse: parseColor, css, mix: (a, b, u, mode) => css(mixColor(parseColor(a), parseColor(b), u, mode || 'rgb')) } };
root.ARSENAL = root.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
root.ARSENAL.core = root.ARSENAL.core || {}; root.ARSENAL.core.timeline = API;
if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
