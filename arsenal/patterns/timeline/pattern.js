/* arsenal/patterns/timeline · ONE scene, THREE timelines. drawScene() below never changes; only the recipe that
   authors the tracks does (slow pedagogic / fast reel / stagger-heavy). Needs ARSENAL.core.timeline loaded first.
   Pure of t: the compiled timeline is built in setup; draw() only looks values up.  [[track-tween]] [[timeline-builder]]
   [[scene-local-time]] [[beats-and-captions]] [[lerp-color]] */
(function () {
'use strict';
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
const TL = ARSENAL.core.timeline;
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rgba = (c, a) => { const q = TL.color.parse(c); return TL.color.css([q[0], q[1], q[2], q[3] * a]); };
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const font = (tk, role) => '"' + tk.type[role].family + '", ' + (role === 'mono' ? 'monospace' : role === 'disp' ? 'sans-serif' : 'sans-serif');
const CAPS = { count: 'Sixteen units. Count them one at a time.', compare: 'Now group them: eight bars on one scale.', call: 'One group stands apart.' };

/* ── the three authored timelines. Same channel names, same beats, different time. ───────────────────────── */
const RECIPES = {
  slow(tl, P) {                                               // pedagogic: every beat has room to be read
    tl.play('title', 1, 0.7, 'out').wait(0.3)
      .beat('count', CAPS.count)
      .all((t) => t.stagger(P.dots, 0.2, (i, t) => t.play('dot.' + i, 1, 0.5, 'back')), (t) => t.play('count', P.dots, P.dots * 0.2 + 0.5, 'linear'))
      .wait(1.0)
      .beat('compare', CAPS.compare)
      .stagger(P.bars, 0.36, (i, t) => t.play('bar.' + i, 1, 1.0, 'out'))
      .wait(0.6)
      .beat('call', CAPS.call)
      .all((t) => t.play('hl', P.hi, 1.2, 'inout'), (t) => t.play('callout', 1, 0.8, 'out'))
      .wait(2.4);
  },
  fast(tl, P) {                                               // reel: no waits, short springy moves
    tl.play('title', 1, 0.25, 'out')
      .beat('count', CAPS.count)
      .all((t) => t.stagger(P.dots, 0.035, (i, t) => t.play('dot.' + i, 1, 0.22, 'out')), (t) => t.play('count', P.dots, P.dots * 0.035 + 0.22, 'out'))
      .wait(0.15)
      .beat('compare', CAPS.compare)
      .stagger(P.bars, 0.06, (i, t) => t.play('bar.' + i, 1, 0.35, 'expo'))
      .beat('call', CAPS.call)
      .all((t) => t.play('hl', P.hi, 0.3, 'out'), (t) => t.play('callout', 1, 0.3, 'back'))
      .wait(1.6);
  },
  stagger(tl, P) {                                            // heavy overlap, centre-out ripples
    tl.play('title', 1, 0.6, 'out')
      .beat('count', CAPS.count)
      .all((t) => t.stagger(P.dots, 0.09, (i, t) => t.play('dot.' + i, 1, 1.4, 'back'), { order: 'center' }), (t) => t.play('count', P.dots, 2.1, 'inout'))
      .wait(0.4)
      .beat('compare', CAPS.compare)
      .stagger(P.bars, 0.2, (i, t) => t.play('bar.' + i, 1, 1.6, 'expo'), { order: 'center' })
      .beat('call', CAPS.call)
      .all((t) => t.play('hl', P.hi, 1.4, 'inout'), (t) => t.play('callout', 1, 1.0, 'out'))
      .wait(2.0);
  },
};

function build(P, tk) {
  const tl = TL.timeline(), init = { title: 0, count: 0, callout: 0, hl: tk.color.muted };
  for (let i = 0; i < P.dots; i++) init['dot.' + i] = 0;
  for (let i = 0; i < P.bars; i++) init['bar.' + i] = 0;
  tl.init(init).colorMode('hl', 'oklab');                     // colour space fixed per track before any lerp
  RECIPES[P.rhythm](tl, { dots: P.dots, bars: P.bars, hi: tk.color.accent });
  return tl.compile();
}

/* ── the scene. Reads values by key, never times. ───────────────────────────────────────────────────── */
function drawScene(p, t, S, tk, P) {
  const V = (k) => S.tl.at(k, t), ctx = p.drawingContext, C = tk.color;
  const txt = (s, x, y, role, size, col, al, align) => { p.textFont(font(tk, role)); if (p.textWeight) p.textWeight(tk.type[role].weight); p.textSize(size); p.textAlign(align || p.LEFT, p.BASELINE); p.noStroke(); p.fill(rgba(col, al)); p.text(s, x, y); };
  const host = { enter(f) { ctx.save(); ctx.globalAlpha = f.a; }, exit() { ctx.restore(); } };
  S.scenes.run(t, host, { p, V, txt, C, tk, P, S });
}
function sceneA(f, o) {                                       // "count": dots + counter. f.t is scene-local seconds.
  const { p, V, txt, C, P } = o;
  txt('SCENE A  ·  LOCAL t = ' + f.t.toFixed(2) + ' s', 48, 36, 'mono', 11, C.muted, 1);
  txt('Sixteen units', 48, 92, 'disp', 44, C.ink, clamp(V('title')));
  p.noStroke();
  for (let i = 0; i < P.dots; i++) {
    const v = V('dot.' + i), cx = 72 + (i % 8) * 52, cy = 168 + Math.floor(i / 8) * 56;
    if (v > 0.001) { p.fill(rgba(C.ink, clamp(v * 1.5))); p.circle(cx, cy, 2 * 16 * Math.max(0, v)); }
  }
  txt(String(Math.round(V('count'))), 560, 236, 'disp', 150, C.accent, 1);
  txt('UNITS COUNTED', 564, 272, 'mono', 13, C.muted, 1);
}
function sceneB(f, o) {                                       // "compare": bars + callout, all driven by tracks
  const { p, V, txt, C, S, P } = o, base = 292, x0 = 64, step = 62, w = 40, maxH = 190;
  txt('SCENE B  ·  LOCAL t = ' + f.t.toFixed(2) + ' s', 48, 36, 'mono', 11, C.muted, 1);
  txt('Eight groups', 48, 92, 'disp', 44, C.ink, TL.ease.smooth(clamp(f.t / 0.5)));
  p.noStroke(); p.fill(rgba(C.line, 1)); p.rect(x0 - 10, base, P.bars * step, 1.5);
  for (let i = 0; i < P.bars; i++) {
    const h = S.data[i] * maxH * Math.max(0, V('bar.' + i));
    p.fill(i === S.hi ? V('hl') : rgba(C.muted, 0.75)); p.rect(x0 + i * step, base - h, w, h);
  }
  const a = clamp(V('callout'));
  txt('ONE GROUP', 640, 168, 'disp', 64, C.accent, a); txt('STANDS APART', 640, 222, 'disp', 64, C.accent, a);
  txt('bar ' + (S.hi + 1) + ' of ' + P.bars, 644, 250, 'mono', 13, C.muted, a);
}

/* ── the track chart under the scene ────────────────────────────────────────────────────────────────── */
const CH = { x0: 128, x1: 912, top: 350, bottom: 534, stripY: 380, laneY: 394, laneH: 20 };
function lanes(P) {
  const ks = (pre, n) => Array.from({ length: n }, (_, i) => pre + '.' + i);
  return [{ label: 'title', keys: ['title'], norm: 1 }, { label: 'dot.0-' + (P.dots - 1), keys: ks('dot', P.dots), norm: 1 },
    { label: 'count', keys: ['count'], norm: P.dots }, { label: 'bar.0-' + (P.bars - 1), keys: ks('bar', P.bars), norm: 1 },
    { label: 'hl (oklab)', color: 'hl' }, { label: 'callout', keys: ['callout'], norm: 1 }];
}
function chartPaths(S, P) {                                   // sampled once in setup: a lookup per pixel pair, not per frame
  const n = Math.round((CH.x1 - CH.x0) / 2), out = [];
  for (const L of lanes(P)) {
    if (L.color) { out.push({ L, strip: Array.from({ length: n }, (_, i) => S.tl.at('hl', (i / n) * P.axisT)) }); continue; }
    out.push({ L, lines: L.keys.map((k) => Array.from({ length: n + 1 }, (_, i) => clamp(S.tl.at(k, (i / n) * P.axisT) / L.norm, 0, 1))) });
  }
  return out;
}
function drawChart(p, t, S, tk, P) {
  const C = tk.color, px = (tt) => CH.x0 + (clamp(tt, 0, P.axisT) / P.axisT) * (CH.x1 - CH.x0), dur = S.tl.duration;
  const txt = (s, x, y, size, col, al, align) => { p.textFont(font(tk, 'mono')); if (p.textWeight) p.textWeight(tk.type.mono.weight); p.textSize(size); p.textAlign(align || p.LEFT, p.BASELINE); p.noStroke(); p.fill(rgba(col, al)); p.text(s, x, y); };
  p.noStroke(); p.fill(C.panel); p.rect(32, CH.top, 896, CH.bottom - CH.top, 4);
  txt('TRACKS  ·  ' + P.rhythmLabel.toUpperCase() + '  ·  ' + dur.toFixed(1) + ' s  ·  same scene code, other timeline', 48, CH.top + 17, 10, C.muted, 1);
  // scene windows and beats, from the same compiled timeline the scene reads
  const bc = S.tl.beatTime('compare'), fade = P.fade;
  p.fill(rgba(C.accent, 0.22)); p.rect(px(0), CH.stripY, px(bc + fade) - px(0), 9);
  p.fill(rgba(C.accent2, 0.28)); p.rect(px(bc), CH.stripY, px(dur) - px(bc), 9);
  txt('A', px(0) + 3, CH.stripY + 7.5, 8, C.ink, 0.9); txt('B', px(bc) + 3, CH.stripY + 7.5, 8, C.ink, 0.9);
  for (const b of S.tl.beats) { p.stroke(rgba(C.ink, 0.28)); p.strokeWeight(1); p.line(px(b.t), CH.stripY, px(b.t), CH.bottom - 20); txt(b.name, px(b.t) + 3, CH.bottom - 24, 8, C.muted, 1); }
  S.paths.forEach((row, r) => {
    const y = CH.laneY + r * CH.laneH, L = row.L; txt(L.label, 48, y + 14, 10, C.muted, 1);
    p.stroke(rgba(C.line, 1)); p.strokeWeight(1); p.line(CH.x0, y + CH.laneH - 3, CH.x1, y + CH.laneH - 3);
    if (row.strip) { p.noStroke(); row.strip.forEach((c, i) => { p.fill(c); p.rect(CH.x0 + i * 2, y + 4, 2, CH.laneH - 9); }); return; }
    p.noFill(); p.stroke(rgba(L.keys.length > 1 ? C.ink : C.accent, L.keys.length > 1 ? 0.5 : 1)); p.strokeWeight(1);
    for (const ln of row.lines) { p.beginShape(); ln.forEach((v, i) => p.vertex(CH.x0 + (i / (ln.length - 1)) * (CH.x1 - CH.x0), y + CH.laneH - 4 - v * (CH.laneH - 7))); p.endShape(); }
  });
  for (let i = 0; i * 2 <= P.axisT; i++) { const x = px(i * 2); p.stroke(rgba(C.ink, 0.25)); p.line(x, CH.bottom - 18, x, CH.bottom - 14); txt(i * 2 + 's', x, CH.bottom - 5, 8, C.muted, 1, p.CENTER); }
  p.stroke(C.accent); p.strokeWeight(1.5); p.line(px(t), CH.stripY - 2, px(t), CH.bottom - 18);        // playhead
  p.noStroke(); p.fill(C.accent); p.triangle(px(t) - 4, CH.stripY - 8, px(t) + 4, CH.stripY - 8, px(t), CH.stripY - 2);
}

ARSENAL.patterns.timeline = {
  id: 'timeline', atlas: ['track-tween', 'timeline-builder', 'scene-local-time', 'beats-and-captions', 'generator-scenes', 'explainer-clock', 'lerp-color'], renderer: 'p2d',
  params: { rhythm: 'slow', rhythmLabel: 'slow pedagogic', dots: 16, bars: 8, fade: 0.45, axisT: 14, chart: true },
  variants: [
    { name: 'slow-pedagogic', params: { rhythm: 'slow', rhythmLabel: 'slow pedagogic' } },
    { name: 'fast-reel', params: { rhythm: 'fast', rhythmLabel: 'fast reel' } },
    { name: 'stagger-heavy', params: { rhythm: 'stagger', rhythmLabel: 'stagger heavy' } },
  ],
  setup(p, ctx, P) {
    const tk = ctx.tokens; if (!tk) throw new Error('timeline pattern: ctx.tokens (a brand pack) is required in setup');
    const tlc = build(P, tk), r = mulberry32(ctx.seed == null ? 7 : ctx.seed), hi = Math.min(5, P.bars - 1);
    const data = Array.from({ length: P.bars }, (_, i) => (i === hi ? 1 : 0.3 + 0.5 * r()));
    const bc = tlc.beatTime('compare');
    // scene windows come from the timeline's own beats, so re-timing the beats re-times the scenes; scene code is untouched
    const scenes = TL.scenes([TL.scene(0, bc + P.fade, sceneA, { fadeIn: 0, fadeOut: P.fade }), TL.scene(bc, tlc.duration, sceneB, { fadeIn: P.fade, fadeOut: 0, hold: true })]);
    const S = { tl: tlc, scenes, data, hi, cap: tlc.captions({ fade: 0.3 }) };
    S.paths = P.chart ? chartPaths(S, P) : [];
    return S;
  },
  draw(p, t, S, P, tk) {
    p.background(tk.color.bg);
    drawScene(p, t, S, tk, P);
    const c = S.cap(t);                                         // captions: after the scene, outside any scene alpha
    if (c) { p.textFont(font(tk, 'body')); if (p.textWeight) p.textWeight(tk.type.body.weight); p.textSize(18); p.textAlign(p.LEFT, p.BASELINE); p.noStroke(); p.fill(rgba(tk.color.ink, c.a)); p.text(c.text, 48, 334); }
    if (P.chart) drawChart(p, t, S, tk, P);
  },
};
})();
