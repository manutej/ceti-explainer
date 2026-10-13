/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Material · STITCH — knitted cloth.
   Kernel: chromes/run/run.kit.js (vendored verbatim as materials/kernels/run.kit.js): procedural stockinette atlas
   (per-pixel tube shading, 2-ply twist, fuzz, AO, rip-mapped), forward column splatter with exact sub-pixel
   horizontal coverage, felt ground with a blurred cloth shadow. Credit: G · The Run team (run/NOTES.md).
   Mark rule: column = one run · row = one step (row 0 at the top; the live row is the lowest) · peach slack loop =
   the step that slipped (address) · crimped rungs = work unravelled (the ladder runs back to the cast-on) ·
   straight rungs = rows never knit · sage stitch = a slip the hook caught and re-knit · slate needle = structure.
   Copper only as probability (exact line, band). Edge kept intact: one renderer from 48-px stitches to sub-pixel
   columns; nothing is scaled as an image.
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM;
  const COL = { felt: '#2A231E', ecru: '#D8CEBA', sage: '#74A862', peach: '#EA7A3C', fleece: '#30261E', rung: '#857B6B', sageDeep: '#4F8040',
    copper: '#E3A867', bone: '#F1EADB', slate: '#8EA5BC', dim: '#A79C8A' };
  const FONT = '"Jost", "DM Sans", sans-serif';
  const ROLE = { title: [600, 30], head: [500, 22], text: [400, 16], num: [600, 22], note: [400, 12], sketch: [400, 14] };
  let pal = null;
  const P5 = () => root.RunKit;

  function paintColumns(S, items, t) {
    const KIT = P5(), KD = KIT.KIND, R = S.R, cam = S.cam;
    // group items sharing a screen row band (grid bands, the rack) → one paint per group
    const groups = new Map();
    for (const it of items) {
      const [sx, sy, sw, sh] = AM.cam.rect(cam, it.x, it.y, it.w, it.h);
      if (sx + sw < -2 || sx > 962 || sy > 542 || sy + sh < -2 || sw <= 0.01) continue;
      const key = Math.round(sy * 8) + '|' + Math.round(sh * 8) + '|' + it.k;
      let g = groups.get(key); if (!g) { g = { sy, sh, k: it.k, list: [] }; groups.set(key, g); }
      g.list.push([it, sx, sw]);
    }
    for (const g of groups.values()) {
      const n = g.list.length, rows = g.k;
      const G = { cols: n, rows, kind: new Uint8Array(n * rows), col: new Uint8Array(n * rows), pal, colX: new Float32Array(n), colW: new Float32Array(n),
        colA: new Float32Array(n), sag: null, y0: g.sy, rowH: g.sh / rows, clip: [0, 0, 960, 540], idBase: 0, colBase: 0, jit: 0.12 };
      for (let c = 0; c < n; c++) {
        const [it, sx, sw] = g.list[c], base = c * rows, f = it.failAt;
        G.colX[c] = sx; G.colW[c] = sw; G.colA[c] = it.alpha;
        const knitTo = f >= 0 ? f : it.done;                 // rows completed
        const ladderRows = f >= 0 && it.lost ? it.age * 30 : 0; // the run descends at 30 rows/s (closed form in t)
        for (let j = 0; j < rows; j++) {
          let kind = 0, col = 0;
          if (f >= 0 && j === f) { kind = KD.LOOP; col = 2; }
          else if (j < knitTo - 0.35 || (j === 0 && knitTo <= 0 && f < 0)) {
            kind = j === 0 && knitTo <= 0 ? KD.LOOSE : KD.KNIT;
            if (it.caught.includes(j)) { col = 1; }
            if (f >= 0 && it.lost && (f - j) <= ladderRows) { kind = KD.CRIMP; col = 4; }
          } else if (f >= 0 && it.lost && j > f && j < it.rows) { kind = KD.BAR; col = 4; }
          G.kind[base + j] = kind; G.col[base + j] = col;
        }
      }
      KIT.paint(R, G);
    }
  }

  const M = AM.material({
    id: 'stitch', title: 'Stitch — knitted cloth', source: ['chromes/run/run.kit.js', 'chromes/run/shared.film.js'],
    markRule: { unit: 'column = one run', step: 'row = one step', address: 'peach slack loop at the dropped row', save: 'sage stitch, re-knit by the hook', cost: 'a sage bead per row knit twice' },
    nouns: { unit: 'column', units: 'columns', step: 'row', steps: 'rows', edge: 'hem', check: 'hook' },
    axis: 'y', cell: { along: 0.72, across: 1, maxAcross: 34 }, nRange: [1, 2500], ground: COL.felt,
    fonts: [['Jost', 'jost-latin-400-normal.woff2', 400], ['Jost', 'jost-latin-500-normal.woff2', 500], ['Jost', 'jost-latin-600-normal.woff2', 600]],
    tokens: { copper: COL.copper, sage: COL.sage, peach: COL.peach, slate: COL.slate, ink: COL.ecru, dim: COL.dim },
    setup() { P5().atlas(); },
    begin(p, ctx, t, cam) {
      const KIT = P5();
      if (!pal) pal = [COL.ecru, COL.sage, COL.peach, COL.fleece, COL.rung, COL.sageDeep].map(KIT.srgb);
      const rk = AM.renderScale(ctx);
      if (!M._R || M._R.scale !== rk) M._R = KIT.renderer(960, 540, rk);
      const R = M._R; KIT.felt(R, ctx.U, KIT.srgb(COL.felt)); KIT.clear(R);
      return { R, cam, k: rk, q: [], t };
    },
    units(S, items, t) { paintColumns(S, items, t); },
    anchor(rect, j, k) { return AM.stepPoint(rect, 'y', j, k); },
    mark(S, kind, x, y, o = {}) { S.q.push(c => markOp(c, S, kind, x, y, o)); },
    line(S, pts, role, o = {}) { S.q.push(c => lineOp(c, S, pts, role, o)); },
    area(S, top, bot, role, o = {}) {
      S.q.push(c => {
        const T = tf(S, o); c.save(); c.globalAlpha = (o.alpha ?? 1) * 0.22; c.fillStyle = role === 'band' ? COL.copper : COL.dim;
        c.beginPath(); top.forEach((q, i) => (i ? c.lineTo(T(q)[0], T(q)[1]) : c.moveTo(T(q)[0], T(q)[1]))); for (let i = bot.length - 1; i >= 0; i--) c.lineTo(T(bot[i])[0], T(bot[i])[1]);
        c.closePath(); c.fill(); c.restore();
      });
    },
    text(S, str, x, y, o = {}) { S.q.push(c => textOp(c, S, str, x, y, o)); },
    num(S, n, x, y, o = {}) { S.q.push(c => textOp(c, S, o.str, x, y, Object.assign({ role: 'num' }, o))); },
    end(p, S) {
      const KIT = P5(); KIT.finish(S.R, p, { blur: 3, dx: 2, dy: 3.5, shadow: 0.55 });
      const c = p.drawingContext; c.save();
      for (const f of S.q) { c.save(); f(c); c.restore(); }
      c.restore();
    },
    voice: { step: { kind: 'tick', freq: 2600, gain: 0.45 }, fail: { kind: 'clack', freq: 160, gain: 0.55 }, save: { kind: 'click', freq: 1500, gain: 0.55 },
      reveal: { kind: 'tone', freq: 330, gain: 0.45, dur: 1.1 }, commit: { kind: 'click', freq: 700, gain: 0.5 }, cost: { kind: 'tick', freq: 1800, gain: 0.3 } },
  });

  /* world→screen transform helper for vector ops (o.screen = coordinates already on screen) */
  const tf = (S, o) => (o.screen ? (q => q) : (q => [AM.cam.X(S.cam, q[0]), AM.cam.Y(S.cam, q[1])]));
  function yarnStroke(c, pts, col, w, dash) {   // couched yarn: dark core, colour, a highlight on the upper edge
    c.lineCap = 'round'; c.lineJoin = 'round'; if (dash) c.setLineDash(dash);
    c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q[0], q[1] + 0.8) : c.moveTo(q[0], q[1] + 0.8))); c.strokeStyle = 'rgba(0,0,0,0.45)'; c.lineWidth = w + 1.2; c.stroke();
    c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.strokeStyle = col; c.lineWidth = w; c.stroke();
    c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q[0] - 0.3, q[1] - w * 0.28) : c.moveTo(q[0] - 0.3, q[1] - w * 0.28))); c.strokeStyle = 'rgba(255,248,232,0.35)'; c.lineWidth = Math.max(0.5, w * 0.3); c.stroke();
    c.setLineDash([]);
  }
  function lineOp(c, S, pts, role, o) {
    const T = tf(S, o), P = pts.map(T), a = o.alpha ?? 1; if (a <= 0.003 || P.length < 2) return;
    c.globalAlpha = a;
    if (role === 'exact') yarnStroke(c, P, COL.copper, o.w || 2.2, [7, 5]);
    else if (role === 'rule') {
      const horiz = Math.abs(P[P.length - 1][1] - P[0][1]) < 1 && P.length === 2;
      if (horiz && Math.abs(P[1][0] - P[0][0]) > 40) P5().needle({ drawingContext: c }, Math.min(P[0][0], P[1][0]), Math.max(P[0][0], P[1][0]), P[0][1], o.w || 5, { hi: '#C9D6E2', mid: '#7F96AC', lo: '#3F5163' });
      else yarnStroke(c, P, COL.slate, o.w || 1.6);
    } else if (role === 'guess') yarnStroke(c, P, COL.bone, o.w || 2.4);
    else if (role === 'ghost') yarnStroke(c, P, 'rgba(216,206,186,0.55)', o.w || 1.6, [3, 4]);
    else if (role === 'gap') yarnStroke(c, P, COL.peach, o.w || 2.4);
    else yarnStroke(c, P, COL.dim, o.w || 1.2);
  }
  function markOp(c, S, kind, x, y, o) {
    const [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1, r = o.r || 7; if (a <= 0.003) return;
    c.globalAlpha = a;
    const ring = (col, rr, w) => { c.beginPath(); c.arc(X, Y + 0.8, rr, 0, 6.2832); c.strokeStyle = 'rgba(0,0,0,0.45)'; c.lineWidth = w + 1; c.stroke(); c.beginPath(); c.arc(X, Y, rr, 0, 6.2832); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
    if (kind === 'address') ring(COL.peach, r, 2.4);
    else if (kind === 'save') { if (r >= 10) P5().hook({ drawingContext: c }, X + 2, Y, -0.55, r * 7, r * 0.55, { hi: '#BFE2AE', mid: COL.sage, lo: COL.sageDeep }); else ring(COL.sage, r, 2.2); }
    else if (kind === 'cost') { c.beginPath(); c.arc(X, Y, o.r || 1.6, 0, 6.2832); c.fillStyle = '#A9D893'; c.fill(); }
    else if (kind === 'guess' || kind === 'truth' || kind === 'realised' || kind === 'expected') {
      // a knitter's stitch marker: a split ring clipped to the selvage, its tail pointing at the value
      const col = kind === 'guess' ? COL.bone : kind === 'truth' || kind === 'expected' ? COL.copper : COL.sage, dir = o.dir || 1;
      c.lineCap = 'round'; c.beginPath(); c.moveTo(X, Y); c.lineTo(X, Y + dir * 14); c.strokeStyle = col; c.lineWidth = 2.2; c.stroke();
      c.beginPath(); c.arc(X, Y + dir * 21, 6.5, 0, 6.2832); c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 4; c.stroke(); c.strokeStyle = col; c.lineWidth = 2.6; c.stroke();
      if (kind === 'expected' || kind === 'truth') { c.fillStyle = col; c.globalAlpha = a * 0.5; c.fill(); }
    } else if (kind === 'tick') {   // countdown: one loop cast onto the needle per second
      c.beginPath(); c.ellipse(X, Y, 4.5, 7, 0, 0, 6.2832); c.strokeStyle = COL.ecru; c.lineWidth = 2.4; c.stroke();
    }
  }
  function textOp(c, S, str, x, y, o) {
    const role = o.role || 'text', [w, s] = ROLE[role] || ROLE.text, size = o.size || s, a = o.alpha ?? 1; if (a <= 0.003 || !str) return;
    const [X, Y] = tf(S, o)([x, y]);
    c.globalAlpha = a; c.font = `${o.weight || w} ${size}px ${FONT}`; c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'alphabetic';
    const col = o.color ? (COL[o.color] || o.color) : role === 'note' ? COL.dim : role === 'sketch' ? COL.copper : COL.ecru;
    c.lineJoin = 'round'; c.strokeStyle = 'rgba(28,22,18,0.82)'; c.lineWidth = Math.max(3, size * 0.22); c.strokeText(str, X, Y);
    c.fillStyle = col; c.fillText(str, X, Y);
  }
})(typeof window !== 'undefined' ? window : globalThis);
