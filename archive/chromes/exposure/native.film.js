/* H · EXPOSURE — native film: "Embeddings: meaning as position" (glance).
   Revision 1: the plate starts unexposed (80 words only as a latent fog). A query is a light source: it EMITS,
   and each word's star accumulates exposure at a rate ∝ max(0, cos)^4 — light travels through meaning, not across
   the map, so a word far away on this flat sketch can burn in. Two queries double-expose one plate; the shared
   word is lit by both. Labels appear only where light has developed them.
   Clock law: frame = f(t, state, seed); the drag is state. */
(function () {
  const EX = window.EX, U = Atelier.U, PAL = EX.PAL;

  /* ── the data: 8 constellations × 10 words, hand-set features (sketch) ── */
  const F = ['animal', 'pet', 'rodent', 'wild', 'canine', 'feline', 'young', 'computer', 'pointing', 'typing', 'display',
    'portable', 'money', 'finance', 'river', 'land', 'flow', 'music', 'low', 'sea', 'fish', 'food', 'weather', 'sound', 'edge'];
  const FI = Object.fromEntries(F.map((f, i) => [f, i]));
  const D = F.length + 6;                                      // + 6 small hashed "idiosyncrasy" dims (sketch)
  const CL = [
    { name: 'ANIMALS', c: [150, 282], base: { animal: 1 }, words: {
      dog: { pet: .8, canine: 1 }, puppy: { pet: .9, canine: 1, young: 1 }, cat: { pet: .8, feline: 1 }, kitten: { pet: .9, feline: 1, young: 1 },
      wolf: { wild: 1, canine: .9 }, fox: { wild: 1, canine: .5 }, rabbit: { pet: .4, rodent: .5, wild: .4 }, hamster: { pet: .9, rodent: 1 },
      rat: { rodent: 1, wild: .4 }, mouse: null } },
    { name: 'WEATHER', c: [560, 118], base: { weather: 1 }, words: {
      rain: { flow: .3 }, cloud: {}, storm: { sound: .3 }, thunder: { sound: .7, low: .4 }, snow: {}, wind: { flow: .3 }, fog: {}, frost: {}, drizzle: { flow: .2 }, mist: {} } },
    { name: 'MACHINES', c: [780, 300], base: { computer: 1 }, words: {
      keyboard: { typing: 1, pointing: .2 }, cursor: { pointing: 1, display: .4 }, click: { pointing: 1, typing: .3, sound: .2 }, trackpad: { pointing: .9, portable: .4 },
      screen: { display: 1 }, monitor: { display: 1 }, laptop: { portable: 1, display: .4, typing: .3 }, icon: { display: .7, pointing: .3 },
      scroll: { pointing: .6, display: .5 }, button: { pointing: .5, typing: .5 } } },
    { name: 'FOOD', c: [120, 462], base: { food: 1 }, words: {
      bread: {}, cheese: {}, soup: { flow: .2 }, pasta: {}, honey: {}, butter: {}, rice: {}, salt: { sea: .2 }, pepper: {}, apple: {} } },
    { name: 'RIVERS', c: [320, 120], base: { river: 1 }, words: {
      stream: { flow: .6 }, shore: { land: .4, sea: .3, edge: 1 }, valley: { land: 1 }, current: { flow: 1 }, flood: { flow: .6, weather: .4 },
      reed: { land: .4 }, meadow: { land: 1 }, delta: { land: .5, sea: .3 }, pond: {}, waterfall: { flow: .8 } } },
    { name: 'MONEY', c: [590, 446], base: { money: 1 }, words: {
      cash: {}, loan: { finance: 1 }, savings: { finance: .8 }, deposit: { finance: .7 }, interest: { finance: .8 }, credit: { finance: .9 },
      wallet: { portable: .4 }, coin: {}, bank: null, cheque: { finance: .4 } } },
    { name: 'SEA', c: [350, 448], base: { sea: 1 }, words: {
      fish: { fish: 1 }, trout: { fish: 1, river: .4 }, salmon: { fish: 1, river: .3, food: .2 }, whale: { animal: .5 }, coral: { land: .2 },
      tide: { flow: .6 }, reef: { land: .3 }, cod: { fish: 1, food: .3 }, wave: { flow: .5, weather: .2 }, bass: null } },
    { name: 'MUSIC', c: [800, 128], base: { music: 1 }, words: {
      melody: {}, chord: {}, rhythm: { sound: .3 }, drum: { sound: .4, low: .8 }, tempo: {}, choir: { sound: .3 }, guitar: {}, song: {},
      cello: { low: 1 }, flute: {} } },
  ];
  // polysemous words: two senses, each normalised, summed (sketch)
  const SENSES = {
    mouse: [{ animal: .6, rodent: 1, pet: .2 }, { computer: .5, pointing: 1 }, 0.7],
    bank: [{ money: .8, finance: 1 }, { river: .6, land: .3, edge: 1 }, 0.75],
    bass: [{ sea: .6, fish: 1 }, { music: .5, low: 1 }],
  };
  const norm = v => { let s = 0; for (const x of v) s += x * x; s = Math.sqrt(s) || 1; return v.map(x => x / s); };
  const vecOf = (obj) => { const v = new Array(D).fill(0); for (const k in obj) v[FI[k]] += obj[k]; return v; };
  const WORDS = [];
  CL.forEach((cl, ci) => Object.keys(cl.words).forEach((w, i) => {
    let v;
    if (SENSES[w]) { const a = norm(vecOf(SENSES[w][0])), b = norm(vecOf(SENSES[w][1])), wa = SENSES[w][2] || 1; v = a.map((x, k) => wa * x + b[k]); }
    else { const b = {}; for (const k in cl.base) b[k] = 0.6 * cl.base[k]; const o = cl.words[w]; for (const k in o) b[k] = (b[k] || 0) + o[k]; v = vecOf(b); }
    for (let k = F.length; k < D; k++) v[k] = 0.16 * (U.h(77, ci * 16 + i, k, 0, 0) - 0.5) * 2;   // idiosyncrasy (sketch)
    WORDS.push({ w, ci, i, v: norm(v), poly: !!SENSES[w] });
  }));
  const NW = WORDS.length;
  const cos = (a, b) => { let s = 0; for (let k = 0; k < D; k++) s += a[k] * b[k]; return s; };

  /* ── the map: elliptical sunflower per constellation, then deterministic label relaxation (pure, once) ── */
  const LW = w => 8.4 * w.length + 12;                    // label box width estimate (mono 14 px)
  (function layout() {
    for (const W of WORDS) {
      const cl = CL[W.ci], k = W.i + 0.6, th = k * 2.39996 + W.ci * 0.9;
      const cx = cl.c[0], cy = cl.c[1];
      W.x = cx + 38 * Math.sqrt(k) * Math.cos(th) - 24; W.y = cy + 22 * Math.sqrt(k) * Math.sin(th);
    }
    for (let it = 0; it < 120; it++) {
      for (let a = 0; a < NW; a++) for (let b = a + 1; b < NW; b++) {
        const A = WORDS[a], B = WORDS[b];
        const ax0 = A.x - 4, ax1 = A.x + LW(A.w), bx0 = B.x - 4, bx1 = B.x + LW(B.w);
        const ox = Math.min(ax1, bx1) - Math.max(ax0, bx0), oy = 20 - Math.abs(A.y - B.y);
        if (ox > 0 && oy > 0) {
          if (oy < ox) { const s = (A.y < B.y ? -1 : 1) * oy * 0.5; A.y += s; B.y -= s; }
          else { const s = (A.x < B.x ? -1 : 1) * ox * 0.25; A.x += s; B.x -= s; }
        }
      }
      for (const W of WORDS) { W.x = U.clamp(W.x, 56, 920 - LW(W.w)); W.y = U.clamp(W.y, 78, 478); }
    }
  })();
  const byName = Object.fromEntries(WORDS.map(W => [W.w, W]));

  /* ── query pairs (the control): start near → dragged to → the polysemous word that should light far away ── */
  /* ── queries: light sources. Pair = (first query, second query, the shared word, its two contexts) ── */
  const PAIRS = [
    { a: ['puppy', 'dog'], al: 'a young dog', b: ['click'], bl: 'something you click', poly: 'mouse', ctx: ['“click the mouse”', '“the cat saw a mouse”'] },
    { a: ['savings', 'loan'], al: 'where savings go', b: ['shore'], bl: 'a river’s edge', poly: 'bank', ctx: ['“the river bank”', '“a bank loan”'] },
    { a: ['trout', 'fish'], al: 'a river fish', b: ['cello', 'drum'], bl: 'a low sound', poly: 'bass', ctx: ['“a bass line”', '“caught a bass”'] },
  ];
  const mid = names => { const ws = names.map(n => byName[n]); return [ws.reduce((s, w) => s + w.x, 0) / ws.length + 10, ws.reduce((s, w) => s + w.y, 0) / ws.length + 6]; };
  const H = 20;                                            // the query's kernel on the map (design px)
  /** query vector at a map position: blend of the words under it (softmax of −d²/2h²) */
  function queryAt(x, y) {
    const lg = WORDS.map(W => -(((W.x + 4 - x) ** 2) + ((W.y - y) ** 2)) / (2 * H * H)), mx = Math.max(...lg);
    const q = new Array(D).fill(0);
    WORDS.forEach((W, i) => { const wt = Math.exp(lg[i] - mx); for (let k = 0; k < D; k++) q[k] += wt * W.v[k]; });
    return norm(q);
  }
  const _cos = new Map();
  function cosines(x, y) {
    const key = x.toFixed(2) + ',' + y.toFixed(2); if (_cos.has(key)) return _cos.get(key);
    const q = queryAt(x, y), c = new Float32Array(NW); for (let i = 0; i < NW; i++) c[i] = Math.max(0, cos(q, WORDS[i].v));
    if (_cos.size > 256) _cos.clear(); _cos.set(key, c); return c;
  }
  const TT = { q1: 0.9, arc: 6.9, q2: 12.6, ctx: 19.6, end: 25 }, BURN = 5.5;
  function queries(st) {
    const P = PAIRS[st.pair | 0];
    if (st.qx != null) return [{ x: st.qx, y: st.qy, label: 'your query', t0: -99 }];
    const b = mid(P.b), a = mid(P.a);
    return [{ x: b[0], y: b[1], label: P.bl, t0: TT.q1 }, { x: a[0], y: a[1], label: P.al, t0: TT.q2 }];
  }
  const burn = (t, t0) => Math.pow(U.clamp((t - t0) / BURN), 2.2);
  const AMP = 170, LABEL_E = 8;
  /** where each sense of the shared word would sit on this map (softmax over its cosine to every other word) */
  function ghosts(P) {
    const sv = SENSES[P.poly].slice(0, 2).map(s => norm(vecOf(s).concat([]))), pw = byName[P.poly];
    const pos = sv.map(v => { let sx = 0, sy = 0, sw = 0; WORDS.forEach(W => { if (W === pw) return; const w = Math.exp(14 * cos(v, W.v)); sx += w * W.x; sy += w * W.y; sw += w; }); return [sx / sw, sy / sw]; });
    const b = mid(P.b), d0 = Math.hypot(pos[0][0] - b[0], pos[0][1] - b[1]), d1 = Math.hypot(pos[1][0] - b[0], pos[1][1] - b[1]);
    return d0 <= d1 ? [pos[0], pos[1]] : [pos[1], pos[0]];        // [near the first query, near the second]
  }
  /** rank of the shared word for a query, and how many lower-ranked words sit closer on the map */
  function polyStats(Q, P) {
    const c = cosines(Q.x, Q.y), pi = WORDS.indexOf(byName[P.poly]), order = [...c.keys()].sort((a, b) => c[b] - c[a]);
    const d = i => Math.hypot(WORDS[i].x + 4 - Q.x, WORDS[i].y - Q.y);
    let closer = 0; for (let i = 0; i < NW; i++) if (c[i] < c[pi] && d(i) < d(pi)) closer++;
    return { rank: order.indexOf(pi) + 1, c: c[pi], closer };
  }

  Atelier.film({
    id: 'exposure-native',
    title: 'Exposure — embeddings: meaning as position',
    direction: 'H · Exposure · the light table',
    level: 'glance',
    duration: 30,
    size: [960, 540],
    renderer: 'p2d',
    fps: 30,
    seed: 1,
    ground: PAL.ground,
    chapters: [{ t: 0, label: 'A query emits' }, { t: 6.9, label: 'Near in meaning, far on the map' }, { t: 12.6, label: 'A second exposure' },
      { t: 19.6, label: 'Context moves a word' }, { t: 25, label: 'The plate' }],
    captions: [
      { t0: 0.3, t1: 6.8, text: 'An embedding gives each word a position. A query lights the words nearest in meaning.' },
      { t0: 6.9, t1: 12.5, text: 'One word burns in far away: near in meaning, far on this flat map.' },
      { t0: 12.6, t1: 19.5, text: 'A second query, same plate. The shared word is lit from both sides.' },
      { t0: 19.6, t1: 25, text: 'Real models learn unnamed dimensions, and context moves a word to fit its sentence.' },
      { t0: 25, t1: 30, text: 'This map is a sketch: hand-set features, flattened, so distances are distorted.' },
    ],
    state: { pair: 0, qx: null, qy: null },
    controls: [
      { key: 'pair', type: 'select', label: 'Two queries, one shared word', options: PAIRS.map((P, i) => [i, `${P.poly}: ${P.bl} / ${P.al}`]),
        hint: 'Or press and drag on the plate: your query lights words by cosine to the words under it. Reset to return.' },
    ],

    setup(p, ctx) {
      const cv = p.canvas; let down = false;
      const at = e => { const r = cv.getBoundingClientRect(); return { qx: U.clamp((e.clientX - r.left) / r.width * 960, 52, 920), qy: U.clamp((e.clientY - r.top) / r.height * 540, 70, 488) }; };
      const send = e => { const A = window.__atelier; if (A) A.setState(at(e)); };
      if (ctx.mode === 'live') {
        cv.style.touchAction = 'none'; cv.style.cursor = 'crosshair';
        cv.addEventListener('pointerdown', e => { down = true; cv.setPointerCapture(e.pointerId); send(e); });
        cv.addEventListener('pointermove', e => { if (down) send(e); });
        cv.addEventListener('pointerup', () => { down = false; });
      }
    },

    draw(p, t, ctx) {
      const st = ctx.state, S = EX.surface(ctx.size.k, ctx.seed), R = S.R, dc = p.drawingContext, P = PAIRS[st.pair | 0];
      const X = ctx.N || (ctx.N = {});
      if (X.R !== R) { X.R = R; X.E = new Float32Array(S.W * S.H); }
      const E = X.E, W = S.W, Hh = S.H; E.fill(0);
      const stamp = (cx, cy, amp, sig, mode) => {
        const rad = Math.ceil(4 * sig);
        for (let y = Math.max(0, Math.floor(cy - rad)); y <= Math.min(Hh - 1, Math.ceil(cy + rad)); y++)
          for (let x = Math.max(0, Math.floor(cx - rad)); x <= Math.min(W - 1, Math.ceil(cx + rad)); x++) {
            const r2 = (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2, v = amp * Math.exp(-r2 / (2 * sig * sig));
            E[y * W + x] += v;
          }
      };
      const Qs = queries(st), A = new Float32Array(NW), best = new Float32Array(NW);
      /* the latent plate: every word a faint fog point (no names until light develops them) */
      const lat = U.seg(t, 0.1, 1.0) * 0.55;
      /* light: each query emits; each word accumulates exposure ∝ cos⁴; faint streaks record the light's path */
      for (const Q of Qs) {
        const b = burn(t, Q.t0); if (b <= 0) continue;
        const c = cosines(Q.x, Q.y);
        for (let i = 0; i < NW; i++) {
          const a = AMP * Math.pow(c[i], 4) * b; A[i] += a; best[i] = Math.max(best[i], c[i]);
          const li = 0.05 * a; if (li < 0.02) continue;
          const x0 = Q.x * R, y0 = Q.y * R, x1 = WORDS[i].x * R, y1 = WORDS[i].y * R, L = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(L / 0.8);
          for (let k = 4 * R | 0; k < n; k++) {
            const u = k / n, px = x0 + (x1 - x0) * u, py = y0 + (y1 - y0) * u, ix = px | 0, iy = py | 0;
            if (ix < 1 || iy < 1 || ix >= W - 1 || iy >= Hh - 1) continue;
            const fx = px - ix, fy = py - iy, w = li * 0.8 / R;
            E[iy * W + ix] += w * (1 - fx) * (1 - fy); E[iy * W + ix + 1] += w * fx * (1 - fy); E[(iy + 1) * W + ix] += w * (1 - fx) * fy; E[(iy + 1) * W + ix + 1] += w * fx * fy;
          }
        }
        stamp(Q.x * R, Q.y * R, 400 * U.seg(t, Q.t0, Q.t0 + 0.8), 2.6 * R);     // the source itself
      }
      for (let i = 0; i < NW; i++) stamp(WORDS[i].x * R, WORDS[i].y * R, lat + A[i], 1.7 * R);
      EX.clear(S);
      EX.tone(S, E, W, Hh, 0, 0, 1);
      EX.exposeMask(S, EX.mask(S, 'ntitle', { text: 'MEANING AS POSITION', font: '700 34px ' + EX.FONT.display, size: 34, x: 56, y: 50, align: 'left', spacing: 5 }), EX.develop(t, 0.1, 2.4, -6, 3.6));
      EX.blit(p, S);
      dc.save();

      /* labels: only where light has developed them; their tone follows the same curve */
      const poly = byName[P.poly], pi = WORDS.indexOf(poly);
      for (let i = 0; i < NW; i++) {
        if (A[i] < 1) continue;
        const Wd = WORDS[i], isP = i === pi && Qs.length > 1, al = U.clamp((A[i] - LABEL_E * 0.5) / LABEL_E);
        if (al <= 0) continue;
        EX.text(dc, isP ? `${Wd.w} ${best[i].toFixed(2)}` : Wd.w, Wd.x + 7, Wd.y + 5, { size: 14, color: isP ? PAL.copper : EX.toneCss(A[i] * 0.12, 0.06), alpha: al, halo: PAL.ground });
      }
      /* the sources: a thin ink reticle and the query's words */
      Qs.forEach((Q, qi) => {
        const a = U.seg(t, Q.t0, Q.t0 + 0.6); if (a <= 0) return;
        dc.globalAlpha = a * 0.85; dc.strokeStyle = PAL.ink; dc.lineWidth = 1;
        dc.beginPath(); dc.arc(Q.x, Q.y, 11, 0, 2 * Math.PI); dc.stroke(); dc.globalAlpha = 1;
        const up = Q.y > 120;
        EX.text(dc, `“${Q.label}”`, Q.x, Q.y + 78, { size: 17, align: 'center', weight: 500, color: PAL.copper, alpha: a, halo: PAL.ground });
      });
      /* near in meaning, far on the map (the first query and the shared word) */
      if (Qs.length > 1 && t >= TT.arc) {
        const Q = Qs[0], a = U.seg(t, TT.arc, TT.arc + 0.7) * (1 - 0.6 * U.seg(t, TT.q2, TT.q2 + 0.6)), x1 = poly.x, y1 = poly.y;
        const mx = (Q.x + x1) / 2, my = Math.max(110, Math.min(Q.y, y1) - 70);
        dc.globalAlpha = a; dc.strokeStyle = PAL.copper; dc.lineWidth = 1.5;
        dc.beginPath(); dc.moveTo(Q.x, Q.y - 12); dc.quadraticCurveTo(mx, my - 20, x1, y1 - 10); dc.stroke();
        dc.beginPath(); dc.arc(x1, y1, 10, 0, 2 * Math.PI); dc.stroke(); dc.globalAlpha = 1;
        const ps = polyStats(Q, P);
        EX.text(dc, 'near in meaning · far on the map', mx, my - 22, { size: 17, weight: 500, align: 'center', color: PAL.copper, alpha: a, halo: PAL.ground });
        EX.text(dc, `“${P.poly}” ranks #${ps.rank}; ${ps.closer} weaker matches sit closer on the map`, mx, my - 2, { size: 14, align: 'center', color: PAL.ink, alpha: a, halo: PAL.ground });
      }
      /* context moves a word: where each sense would sit (sketch) */
      if (Qs.length > 1 && t >= TT.ctx) {
        const a = U.seg(t, TT.ctx, TT.ctx + 0.8), gh = ghosts(P);
        gh.forEach((g, k) => {
          const u = U.seg(t, TT.ctx + 0.2 * k, TT.ctx + 1.2 + 0.2 * k, 'enter'), gx = U.lerp(poly.x, g[0], u), gy = U.lerp(poly.y, g[1], u);
          dc.globalAlpha = a; dc.strokeStyle = PAL.copper; dc.lineWidth = 1.3; dc.setLineDash([3, 4]);
          dc.beginPath(); dc.moveTo(poly.x, poly.y); dc.lineTo(gx, gy); dc.stroke();
          dc.beginPath(); dc.arc(gx, gy, 9, 0, 2 * Math.PI); dc.stroke(); dc.setLineDash([]); dc.globalAlpha = 1;
          EX.text(dc, `${P.poly} in ${P.ctx[k]}`, gx > 620 ? gx + 6 : gx + 14, gy + (gx > 620 ? -18 : 22), { size: 14, align: gx > 620 ? 'right' : 'left', color: PAL.copper, alpha: a * u, halo: PAL.ground });
        });
      }
      const fa = U.seg(t, 1.5, 2.5);
      EX.text(dc, 'sketch: hand-set features, flattened to 2D, so distances are distorted', 56, 516, { size: 14, color: PAL.dim, alpha: fa });
      dc.restore();
    },

    score(ctx) {
      const st = ctx.state, ev = [{ t: 0.2, kind: 'tone', freq: 110, dur: 3, gain: 0.3, attack: 1.2 }];
      queries(st).forEach(Q => {
        if (Q.t0 < 0) return;
        ev.push({ t: Q.t0, kind: 'click', gain: 0.6, freq: 1318.5 });
        const c = cosines(Q.x, Q.y);
        WORDS.forEach((W, i) => {                                // a soft tick as each word's label develops
          const a = AMP * Math.pow(c[i], 4); if (a < LABEL_E) return;
          const u = Math.pow(LABEL_E / a, 1 / 2.2), t = Q.t0 + BURN * u;
          ev.push({ t, kind: 'tick', gain: 0.3, freq: 2000 + 2000 * c[i], pan: W.x / 480 - 1 });
        });
      });
      ev.push({ t: TT.arc + 0.05, kind: 'tone', freq: 659.3, dur: 1.4, gain: 0.42 });
      ev.push({ t: TT.ctx + 0.1, kind: 'tone', freq: 440, dur: 1.6, gain: 0.3 });
      ev.push({ t: TT.end + 0.2, kind: 'tone', freq: 196, dur: 2.6, gain: 0.4, attack: 0.4 });
      return ev;
    },

    meta(ctx) {
      const P = PAIRS[ctx.state.pair | 0], Qs = queries(ctx.state), ps = polyStats(Qs[0], P);
      return [
        { label: 'Words on the plate', value: NW },
        { label: 'Features (hand-set sketch)', value: D },
        { label: `“${P.poly}” rank for the first query`, value: ps.rank },
        { label: `cos(query, ${P.poly})`, value: ps.c },
        { label: 'Weaker matches closer on the map', value: ps.closer },
      ];
    },
  });
})();
