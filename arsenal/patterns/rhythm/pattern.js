/* arsenal/patterns/rhythm · visual tempo for silent films. A beat grid from the brand's tempo token (beat_s); every
   entrance, hold and exit snaps to beats and half-beats; easing families as named curves; an emphasis vocabulary
   (pulse, settle, tick, flash-then-hold, breathe), each a pure function of (t, beat); a caption cadence helper that
   paces captions to beats and reports words per second against a 2.5 to 3.5 reading range.
   Library surface (pure, reusable by films): ARSENAL.patterns.rhythm.lib = { snap, grid, EASES, easeFor, EMPH, cadence }.
   [[easing-functions]] [[oscillation]] [[loop-phase-animation]] [[beats-and-captions]] */
(function () {
'use strict';
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, u) => a + (b - a) * u;
const mod = (a, b) => ((a % b) + b) % b;
const TAU = Math.PI * 2;
function rgba(c, a) {                                                  // colour role string -> rgba() with alpha scaled
  let m = /^#([0-9a-f]{6})$/i.exec(c);
  if (m) { const h = m[1]; return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')'; }
  m = /^rgba?\(([^)]+)\)$/i.exec(c);
  if (m) { const v = m[1].split(',').map(parseFloat); return 'rgba(' + v[0] + ',' + v[1] + ',' + v[2] + ',' + ((v.length > 3 ? v[3] : 1) * a) + ')'; }
  return c;
}

/* ── the beat grid ──────────────────────────────────────────────────────── */
// snap(t, beat, sub): nearest grid line; sub 1 = beats, 2 = half-beats, 4 = quarter-beats.
const snap = (t, beat, sub = 2) => Math.round(t / (beat / sub)) * (beat / sub);
function grid(beat, dur, sub = 2) {
  const out = [], g = beat / sub;
  for (let i = 0; i * g <= dur + 1e-9; i++) out.push({ t: i * g, beat: i % sub === 0, n: i / sub });
  return out;
}

/* ── easing families: named curves, progress 0..1 -> value (overshoot allowed; callers clamp alpha) ───── */
const out3 = (u) => 1 - Math.pow(1 - u, 3);
const EASES = {
  linear: (u) => u,
  quad: (u) => 1 - (1 - u) * (1 - u),
  sine: (u) => Math.sin((u * Math.PI) / 2),
  cubic: out3,
  expo: (u) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u)),
  back: (u) => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2),         // easeOutBack, c1 1.70158
  anticipate: (u) => {                                                                   // easeInOutBack: dips, then overshoots
    const c2 = 1.70158 * 1.525;
    return u < 0.5 ? (Math.pow(2 * u, 2) * ((c2 + 1) * 2 * u - c2)) / 2 : (Math.pow(2 * u - 2, 2) * ((c2 + 1) * (2 * u - 2) + c2) + 2) / 2;
  },
  snap: (u) => 1 - Math.pow(1 - clamp(u * 2), 4),                                        // lands at the half-beat, then holds
};
const NOTES = {
  linear: 'constant speed. reads as a machine.', quad: 'gentle landing.', sine: 'softest landing.', cubic: 'the house ease: firm start, calm end.',
  expo: 'near-instant start, long tail.', back: 'overshoots 10 percent, then returns.', anticipate: 'dips back first, then overshoots.',
  snap: 'arrives by the half-beat, then holds.',
};
const easeFor = (name) => EASES[name] || EASES.cubic;

/* ── emphasis vocabulary: pure functions of (t, beat), t local to the cue. Returns modifiers around rest:
      { s: scale (1 = rest), rot: radians, glow: 0..1 }, plus v = the primary scalar, charted by the sampler. ─── */
const EMPH = {
  pulse: { key: 's', range: [0.95, 1.2], note: 'hit on every beat, decay in 0.6 beat',
    fn(t, b) { const u = clamp(mod(t, b) / b / 0.6), k = Math.pow(1 - u, 2); return { s: 1 + 0.16 * k, rot: 0, glow: 0.7 * k, v: 1 + 0.16 * k }; } },
  settle: { key: 's', range: [0.7, 1.12], note: 'drops in small, rings out over 1 beat; every 2nd beat',
    fn(t, b) { const u = clamp(mod(t, 2 * b) / b), r = Math.exp(-4.5 * u) * Math.cos(TAU * 1.25 * u), s = 1 - 0.22 * r; return { s, rot: 0, glow: 0, v: s }; } },
  tick: { key: 'rot', range: [0, TAU], note: 'quarter-step on every beat, 0.18 beat to land',
    fn(t, b) { const n = Math.floor(t / b), r = (n + out3(clamp(mod(t, b) / b / 0.18))) * (TAU / 12); return { s: 1, rot: r, glow: 0, v: r }; } },
  flash: { key: 'glow', range: [0, 1], note: 'flash 1.0, settle to 0.35 hold, release; every 2 beats',
    fn(t, b) { const u = mod(t, 2 * b) / b, g = u < 1.6 ? 0.35 + 0.65 * Math.exp(-9 * u) : 0.35 * (1 - EASES.cubic(clamp((u - 1.6) / 0.4))); return { s: 1 + 0.05 * g, rot: 0, glow: g, v: g }; } },
  breathe: { key: 's', range: [0.95, 1.05], note: 'one slow cycle per 2 beats, from rest',
    fn(t, b) { const w = 0.5 - 0.5 * Math.cos((TAU * t) / (2 * b)); return { s: 1 + 0.04 * w, rot: 0, glow: w, v: 1 + 0.04 * w }; } },
};
const EMPH_ORDER = ['pulse', 'settle', 'tick', 'flash', 'breathe'];

/* ── caption cadence: pace captions to the grid, report words per second ────────────────────────────────
   items [{text, at}]; o { beat_s, grain 0.5 (beats per step), lo 2.5, hi 3.5, target 3, end }.
   Each caption starts on a grid line at or after the previous end, and lasts n grains, n chosen so wps is nearest the
   target among durations that fit before `end`. status: ok | slow | fast. */
function cadence(items, o) {
  const b = o.beat_s, grain = o.grain || 0.5, lo = o.lo || 2.5, hi = o.hi || 3.5, target = o.target || 3, endT = o.end == null ? Infinity : o.end;
  const res = []; let prev = 0;
  for (const it of items) {
    const words = it.text.trim().split(/\s+/).length;
    const start = Math.max(snap(it.at, b, 1 / grain), prev);
    let best = null;
    for (let n = 1; n <= 16; n++) {
      const dur = n * grain * b; if (start + dur > endT + 1e-9 && best) break;
      const wps = words / dur, cand = { n, dur, wps };
      if (!best || start + dur <= endT + 1e-9 && Math.abs(wps - target) < Math.abs(best.wps - target) || best && start + best.dur > endT + 1e-9) best = cand;
    }
    let dur = best.dur, clipped = false;
    if (start + dur > endT) { dur = Math.max(0.1, endT - start); clipped = true; }
    const wps = words / dur;
    res.push({ t: start, end: start + dur, text: it.text, words, beats: dur / b, wps, status: wps < lo ? 'slow' : wps > hi ? 'fast' : 'ok', clipped });
    prev = start + dur;
  }
  return res;
}

/* ── the 12-second scene, authored once in IDEAL seconds, then snapped to the beat grid ───────────────────── */
const IDEAL = [['title', 0.0], ['t1', 1.0], ['t2', 2.5], ['t3', 4.0], ['t4', 5.5], ['dial', 6.0], ['light', 7.5], ['exit', 10.0]];
const CAPS = [
  { text: 'Four steps, each laid on the grid', at: 0.3 },
  { text: 'Every move lands exactly on a beat', at: 3.2 },
  { text: 'The third step carries the whole point', at: 6.2 },
  { text: 'Then all of it leaves together', at: 9.2 },
];
const LABELS = [['READ', '01'], ['COUNT', '02'], ['CHECK', '03'], ['SHIP', '04']];

function planScene(beat, dur) {
  const cues = IDEAL.map(([id, ideal]) => ({ id, ideal, t0: snap(ideal, beat, 2) }));
  const seen = {};                                                    // cues that collide on a grid line fan out by 1/8 beat
  for (const c of cues) { const k = c.t0.toFixed(4); c.t0 += (seen[k] = seen[k] == null ? 0 : seen[k] + 1) * (beat / 8); c.dur = beat * 0.25; }
  const by = {}; cues.forEach((c) => (by[c.id] = c));
  return { cues, by, ticks: grid(beat, dur, 2), caps: cadence(CAPS, { beat_s: beat, grain: 0.5, end: dur }), beat, dur };
}

/* ── pattern ────────────────────────────────────────────────────────────── */
const PAT = {
  id: 'rhythm', atlas: ['easing-functions', 'oscillation', 'loop-phase-animation', 'beats-and-captions'], renderer: 'p2d',
  params: { mode: 'scene', beat_s: null, dur: 12, lo: 2.5, hi: 3.5 },
  variants: [
    { name: 'tempo-2.5', params: { mode: 'scene', beat_s: 2.5 } },
    { name: 'tempo-4', params: { mode: 'scene', beat_s: 4 } },
    { name: 'tempo-5', params: { mode: 'scene', beat_s: 5 } },
    { name: 'easing-chart', params: { mode: 'easing', beat_s: 3.4 } },
    { name: 'emphasis', params: { mode: 'emphasis', beat_s: 1.5 } },
  ],
  lib: { snap, grid, EASES, easeFor, EMPH, cadence, planScene },
  setup(p, ctx, params) {
    const tk = ctx.tokens, beat = params.beat_s != null ? params.beat_s : tk.tempo.beat_s;
    return { beat, ease: tk.tempo.ease, plan: params.mode === 'scene' ? planScene(beat, params.dur) : null };
  },
  draw(p, t, st, params, tk) {
    const c = p.drawingContext, W = 960, H = 540;
    c.save(); p.background(tk.color.bg);
    const F = (role, px, w) => (w || tk.type[role].weight) + ' ' + px + 'px "' + tk.type[role].family + '", ' + (role === 'mono' ? 'monospace' : 'sans-serif');
    const T = (s, x, y, font, col, align, a) => { c.font = font; c.fillStyle = rgba(col, a == null ? 1 : a); c.textAlign = align || 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); };
    const L = (x0, y0, x1, y1, col, w) => { c.strokeStyle = col; c.lineWidth = w || 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); };
    const RR = (x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
    const b = st.beat, K = tk.color;
    const head = (title, sub) => { T(title, 30, 44, F('disp', 28), K.ink); T(sub, 930, 44, F('mono', 11), K.muted, 'right'); };
    if (params.mode === 'scene') scene(); else if (params.mode === 'easing') easing(); else emphasis();
    c.restore();

    /* ── scene: the same 12 s, one tempo ─────────────────────────────── */
    function scene() {
      const P = st.plan, C = P.by, brandEase = easeFor(st.ease), D = params.dur;
      head('RHYTHM  ' + b.toFixed(1) + ' s / beat', '12 s = ' + (D / b).toFixed(1) + ' beats · half-beat ' + (b / 2).toFixed(2) + ' s · brand ease: ' + st.ease);
      const prog = (cue, e) => (e || brandEase)(clamp((t - cue.t0) / cue.dur));
      const exitU = clamp((t - C.exit.t0) / C.exit.dur), exitP = EASES.cubic(exitU);
      // title, breathing once in
      const ti = prog(C.title, EASES.expo), tb = EMPH.breathe.fn(Math.max(0, t - C.title.t0 - C.title.dur), b);
      c.save(); c.translate(60, 140); c.scale(tb.s, tb.s); T('FOUR STEPS', 0, 0, F('disp', 64), K.ink, 'left', clamp(ti) * (1 - exitP)); c.restore();
      T('one idea per beat', 62, 168 - 0, F('mono', 12), K.muted, 'left', clamp(ti) * (1 - exitP));
      // tiles
      for (let i = 0; i < 4; i++) {
        const cue = C['t' + (i + 1)], e = prog(cue), a = clamp(e) * (1 - exitP), x = 60 + i * 215, y0 = 196, w = 195, h = 128;
        const hot = i === 2 && t >= C.light.t0, tl = t - C.light.t0, fl = hot ? EMPH.flash.fn(tl, b) : { glow: 0, s: 1 };
        const exOff = exitP * -26 - (i * 0) , y = y0 + (1 - e) * 30 + exOff, cx = x + w / 2, cy = y + h / 2;
        if (a <= 0.001) continue;
        c.save(); c.translate(cx, cy); c.scale(fl.s, fl.s); c.translate(-cx, -cy);
        if (hot) { c.shadowColor = rgba(K.accent, 0.9 * fl.glow * a); c.shadowBlur = 26 * fl.glow; }
        RR(x, y, w, h, 6); c.fillStyle = rgba(K.panel, a); c.fill();
        c.shadowBlur = 0; c.shadowColor = 'rgba(0,0,0,0)';
        c.lineWidth = hot ? 2 : 1; c.strokeStyle = rgba(hot ? K.accent : K.line, hot ? a : 1 * a); RR(x, y, w, h, 6); c.stroke();
        T(LABELS[i][1], x + 16, y + 28, F('mono', 12), hot ? K.accent : K.muted, 'left', a);
        T(LABELS[i][0], x + 16, y + 78, F('disp', 46), K.ink, 'left', a);
        const bw = (w - 32) * (0.25 * (i + 1)) * clamp(e); c.fillStyle = rgba(hot ? K.accent : K.muted, a * (hot ? 1 : 0.6)); c.fillRect(x + 16, y + 100, Math.max(0, bw), 4);
        c.restore();
      }
      // dial: ticks once per beat
      { const e = prog(C.dial, EASES.back), a = clamp(e) * (1 - exitP);
        if (a > 0.001) { const lt = Math.max(0, t - C.dial.t0 - C.dial.dur), tk2 = EMPH.tick.fn(lt, b), cx = 868, cy = 112, r = 34 * Math.max(0, e);
          c.save(); c.globalAlpha = a; c.strokeStyle = K.line; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke();
          for (let k = 0; k < 12; k++) { const an = (k / 12) * TAU - Math.PI / 2; L(cx + Math.cos(an) * r * 0.82, cy + Math.sin(an) * r * 0.82, cx + Math.cos(an) * r * 0.97, cy + Math.sin(an) * r * 0.97, K.muted, 1); }
          const ha = tk2.rot - Math.PI / 2; L(cx, cy, cx + Math.cos(ha) * r * 0.74, cy + Math.sin(ha) * r * 0.74, K.accent, 2.5);
          c.fillStyle = K.accent; c.beginPath(); c.arc(cx, cy, 3, 0, TAU); c.fill(); c.restore(); } }

      // beat grid strip
      const X0 = 96, X1 = 912, xs = (s) => X0 + (s / D) * (X1 - X0), yR = 350, laneTop = 372, laneH = 11;
      T('beat grid', 30, yR - 2, F('mono', 10), K.muted);
      for (const k of P.ticks) { const x = xs(k.t); L(x, yR + 2, x, k.beat ? yR + 12 : yR + 7, k.beat ? K.ink : K.muted, k.beat ? 1.4 : 1);
        if (k.beat) T(String(k.n), x + 3, yR + 10, F('mono', 9), K.muted); }
      for (let s = 0; s <= D; s += 1) if (s % 2 === 0) T(s + 's', xs(s), yR + 24, F('mono', 9), K.muted, 'center', 0.7);
      for (const k of P.ticks) { const x = xs(k.t); L(x, laneTop - 2, x, laneTop + laneH * 8 + 2, K.line, k.beat ? 1 : 0.5); }
      P.cues.forEach((cu, i) => { const y = laneTop + i * laneH, x0 = xs(cu.t0), x1 = xs(Math.min(D, cu.t0 + cu.dur)), xi = xs(cu.ideal);
        T(cu.id, 86, y + 8, F('mono', 9.5), K.muted, 'right');
        if (Math.abs(xi - x0) > 0.5) { L(xi, y + 4, x0, y + 4, rgba(K.muted, 0.7), 1); c.strokeStyle = K.muted; c.strokeRect(xi - 2, y + 2, 4, 4); }
        c.fillStyle = cu.id === 'exit' ? K.accent2 : K.accent; c.fillRect(x0, y + 1, Math.max(2, x1 - x0), laneH - 3);
        c.fillStyle = K.ink; c.fillRect(x0 - 1, y, 2, laneH - 1); });
      // caption lane
      const yc = laneTop + laneH * 8 + 6;
      P.caps.forEach((cp) => { const x0 = xs(cp.t), x1 = xs(cp.end), col = cp.status === 'ok' ? K.accent : K.accent2;
        c.fillStyle = rgba(col, 0.28); c.fillRect(x0, yc, x1 - x0 - 1, 12); c.strokeStyle = col; c.lineWidth = 1; c.strokeRect(x0 + 0.5, yc + 0.5, x1 - x0 - 2, 11);
        if (x1 - x0 > 56) T(cp.wps.toFixed(1) + ' wps', x0 + 4, yc + 9, F('mono', 9), K.ink); });
      T('captions', 86, yc + 9, F('mono', 9), K.muted, 'right');
      const px = xs(clamp(t, 0, D)); L(px, yR - 6, px, yc + 14, K.accent2, 1.5);
      // live caption + readout
      const cp = P.caps.find((q) => t >= q.t && t < q.end) || (t >= D - 1e-9 ? null : null);
      if (cp) { const a = EASES.cubic(clamp((t - cp.t) / 0.3)) * clamp((cp.end - t) / 0.3 + 0.0001);
        T(cp.text, W / 2, 504, F('body', 22), K.ink, 'center', a);
        T(cp.words + ' words · ' + cp.beats.toFixed(1) + ' beats · ' + cp.wps.toFixed(1) + ' wps · ' + (cp.status === 'ok' ? 'in range 2.5 to 3.5' : cp.status === 'slow' ? 'SLOW, below 2.5' : 'FAST, above 3.5'), W / 2, 526, F('mono', 11), cp.status === 'ok' ? K.muted : K.accent2, 'center', a); }
    }

    /* ── easing chart: a mark rides each curve ───────────────────────── */
    function easing() {
      head('EASING FAMILIES', 'one move = 1 beat (' + b.toFixed(1) + ' s) then rest 0.5 beat · brand ease ' + st.ease + ' is lit');
      const names = ['quad', 'cubic', 'expo', 'back', 'anticipate', 'snap'], per = 1.5 * b, ph = mod(t, per), u = clamp(ph / b);
      names.forEach((nm, i) => {
        const col = i % 3, row = (i / 3) | 0, x = 30 + col * 305, y = 66 + row * 230, w = 285, pw = 150, ph2 = 126, fn = EASES[nm], mine = nm === st.ease, ac = mine ? K.accent : K.ink;
        RR(x, y, w, 214, 6); c.fillStyle = K.panel; c.fill(); c.strokeStyle = mine ? K.accent : K.line; c.lineWidth = mine ? 1.6 : 1; c.stroke();
        T(nm.toUpperCase(), x + 14, y + 28, F('disp', 26), ac); T(NOTES[nm], x + 14, y + 44, F('mono', 9.5), K.muted);
        // plot: u 0..1 horizontal, value -0.25..1.25 vertical
        const gx = x + 14, gy = y + 56, vy = (v) => gy + ph2 - ((v + 0.25) / 1.5) * ph2, ux = (q) => gx + q * pw;
        L(gx, vy(0), gx + pw, vy(0), K.line, 1); L(gx, vy(1), gx + pw, vy(1), K.line, 1); L(gx, gy, gx, gy + ph2, K.line, 1);
        T('1', gx - 4, vy(1) + 3, F('mono', 8), K.muted, 'right'); T('0', gx - 4, vy(0) + 3, F('mono', 8), K.muted, 'right');
        c.strokeStyle = rgba(ac, 0.55); c.lineWidth = 1.6; c.beginPath(); for (let k = 0; k <= 80; k++) { const q = k / 80; k ? c.lineTo(ux(q), vy(fn(q))) : c.moveTo(ux(q), vy(fn(q))); } c.stroke();
        const v = fn(u); c.strokeStyle = rgba(K.accent2, 0.7); c.lineWidth = 1; L(ux(u), vy(0), ux(u), vy(v), K.accent2, 1); L(gx, vy(v), ux(u), vy(v), K.accent2, 1);
        c.fillStyle = K.accent2; c.beginPath(); c.arc(ux(u), vy(v), 5, 0, TAU); c.fill();
        // ride track at right: a vertical lane, mark moves 0 -> 1 by the same curve
        const rx = x + 14 + pw + 54, ry0 = gy + ph2, ry1 = gy, ty = (q) => ry0 + (ry1 - ry0) * q;
        L(rx, ry0, rx, ry1, K.line, 1); L(rx - 12, ry0, rx + 12, ry0, K.muted, 1); L(rx - 12, ry1, rx + 12, ry1, K.muted, 1);
        T('rest', rx + 16, ry0 + 3, F('mono', 8), K.muted); T('land', rx + 16, ry1 + 3, F('mono', 8), K.muted);
        RR(rx - 11, ty(v) - 11, 22, 22, 3); c.fillStyle = ac; c.fill();
        T('u ' + u.toFixed(2) + '  value ' + v.toFixed(2), x + 14, y + 204, F('mono', 10), K.muted);
        if (nm === 'snap') T('lands at u 0.50', x + w - 14, y + 204, F('mono', 10), K.muted, 'right');
        else if (v > 1.001 || v < -0.001) T(v > 1 ? 'over ' + (v - 1).toFixed(2) : 'under ' + v.toFixed(2), x + w - 14, y + 204, F('mono', 10), K.accent2, 'right');
      });
      // cycle bar
      const bx = 30, bw = 900, by = 524; L(bx, by, bx + bw, by, K.line, 1);
      c.fillStyle = rgba(K.accent, 0.5); c.fillRect(bx, by - 3, (bw * 1) / 1.5, 6); L(bx + bw * (ph / per), by - 8, bx + bw * (ph / per), by + 8, K.accent2, 2);
      T('move (1 beat)', bx, by - 9, F('mono', 9), K.muted); T('rest', bx + bw, by - 9, F('mono', 9), K.muted, 'right');
    }

    /* ── emphasis sampler ───────────────────────────────────────────── */
    function emphasis() {
      head('EMPHASIS VOCABULARY', 'pure functions of (t, beat) · beat ' + b.toFixed(2) + ' s · trace shows 4 beats');
      const win = 4 * b, w0 = Math.floor(t / win) * win;
      EMPH_ORDER.forEach((nm, i) => {
        const E = EMPH[nm], x = 30 + i * 183, w = 168, cx = x + w / 2, cy = 190, o = E.fn(t, b);
        RR(x, 66, w, 410, 6); c.fillStyle = K.panel; c.fill(); c.strokeStyle = K.line; c.lineWidth = 1; c.stroke();
        T(nm === 'flash' ? 'FLASH+HOLD' : nm.toUpperCase(), x + 12, 96, F('disp', 26), K.ink);
        // wrapped note
        const words = E.note.split(' '); let line = '', ly = 114; for (const wd of words) { if ((line + wd).length > 27) { T(line, x + 12, ly, F('mono', 9.5), K.muted); line = ''; ly += 12; } line += wd + ' '; } T(line, x + 12, ly, F('mono', 9.5), K.muted);
        c.save(); c.translate(cx, cy);
        if (nm === 'pulse') { c.shadowColor = rgba(K.accent, 0.8 * o.glow); c.shadowBlur = 30 * o.glow; c.fillStyle = K.accent; c.beginPath(); c.arc(0, 0, 34 * o.s, 0, TAU); c.fill(); }
        else if (nm === 'settle') { c.scale(o.s, o.s); RR(-34, -34, 68, 68, 6); c.fillStyle = K.accent; c.fill(); c.fillStyle = K.bg; c.fillRect(-18, -4, 36, 8); }
        else if (nm === 'tick') { c.strokeStyle = K.line; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.stroke();
          for (let k = 0; k < 12; k++) { const an = (k / 12) * TAU - Math.PI / 2; L(Math.cos(an) * 33, Math.sin(an) * 33, Math.cos(an) * 39, Math.sin(an) * 39, K.muted, 1.5); }
          const ha = o.rot - Math.PI / 2; L(0, 0, Math.cos(ha) * 30, Math.sin(ha) * 30, K.accent, 3.5); c.fillStyle = K.accent; c.beginPath(); c.arc(0, 0, 4, 0, TAU); c.fill(); }
        else if (nm === 'flash') { c.scale(o.s, o.s); c.shadowColor = rgba(K.accent, 0.95 * o.glow); c.shadowBlur = 38 * o.glow; RR(-36, -36, 72, 72, 6); c.fillStyle = rgba(K.panel, 1); c.fill();
          c.shadowBlur = 0; c.lineWidth = 2; c.strokeStyle = rgba(K.accent, 0.35 + 0.65 * o.glow); c.stroke(); c.fillStyle = rgba(K.accent, 0.12 + 0.88 * o.glow); RR(-24, -24, 48, 48, 4); c.fill(); }
        else { c.scale(o.s, o.s); c.fillStyle = rgba(K.accent, 0.25 + 0.6 * o.glow); c.beginPath(); c.arc(0, 0, 38, 0, TAU); c.fill(); c.strokeStyle = K.accent; c.lineWidth = 2; c.stroke(); }
        c.restore();
        // trace of the primary value over a 4-beat window, playhead at t
        const tx = x + 12, tw = w - 24, ty0 = 300, th = 74, [lo, hi] = E.range, vy = (v) => ty0 + th - ((v - lo) / (hi - lo)) * th, sx = (s) => tx + ((s - w0) / win) * tw;
        L(tx, ty0 + th, tx + tw, ty0 + th, K.line, 1); L(tx, ty0, tx + tw, ty0, K.line, 0.5);
        c.strokeStyle = K.ink; c.lineWidth = 1.5; c.beginPath(); for (let k = 0; k <= 160; k++) { const s = w0 + (k / 160) * win, v = E.fn(s, b).v; k ? c.lineTo(sx(s), vy(clamp(v, lo, hi))) : c.moveTo(sx(s), vy(clamp(v, lo, hi))); } c.stroke();
        T(E.key + ' ' + (E.key === 'rot' ? (o.v * 180 / Math.PI).toFixed(0) + ' deg' : o.v.toFixed(3)), tx, ty0 - 6, F('mono', 9.5), K.muted);
        c.fillStyle = K.accent2; c.beginPath(); c.arc(sx(t), vy(clamp(o.v, lo, hi)), 4, 0, TAU); c.fill();
        // beat stripe
        const sy = 392; for (let k = 0; k <= 8; k++) { const s = w0 + (k / 2) * b, X = sx(s); L(X, sy, X, sy + (k % 2 ? 6 : 14), k % 2 ? K.muted : K.ink, k % 2 ? 1 : 1.4); }
        L(sx(t), sy - 2, sx(t), sy + 18, K.accent2, 1.5); T('beat', tx, sy + 32, F('mono', 9), K.muted); T('half', tx + 34, sy + 32, F('mono', 9), K.muted);
        T('beat ' + (Math.floor(t / b) % 100) + '  phase ' + (mod(t, b) / b).toFixed(2), tx, 452, F('mono', 9.5), K.muted);
      });
      T('Each function takes local time and the beat. Cues start them on grid lines; the film adds only position and colour.', 480, 512, F('body', 13), K.muted, 'center');
    }
  },
};
window.ARSENAL.patterns.rhythm = PAT;
})();
