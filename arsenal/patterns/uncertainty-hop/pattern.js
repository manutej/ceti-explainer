/* uncertainty-hop · hypothetical outcome plots (HOPs), quantile dotplots and a fading ensemble, on the pure clock.
   data = a plain array of samples, OR a distribution spec {type, ...} drawn with the seed. setup() precomputes ONE
   seeded sample table; draw k = floor((t - start) * rate) + 1 indexes it, so any re-seek is identical.
   Hard cuts only (R-D S20, S21): no tween ever touches a draw. count(t) = draws shown. The commit variants show draws,
   freeze for an estimate window (no result on screen), and only then count and ratio (count first).
   Roles only (tokens.color.*, tokens.type.*); no Math.random / Date / frameCount; ARSENAL.uncertaintyHop exposes the helpers. */
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const mulberry32 = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const X0 = 80, X1 = 880, AY = 410, TOP = 150;               // plot box in logical 960x540 px

  /* ---------- samplers: normal, lognormal, uniform, mixture of those ---------- */
  function draw1(rand, d) {
    if (d.type === 'mixture') { let r = rand() * d.parts.reduce((s, q) => s + q.w, 0), q = d.parts[0]; for (const c of d.parts) { if (r < c.w) { q = c; break; } r -= c.w; } return draw1(rand, q); }
    if (d.type === 'uniform') return d.a + (d.b - d.a) * rand();
    const z = Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
    if (d.type === 'lognormal') return Math.exp(d.mu + d.sigma * z);
    return d.mu + d.sd * z;                                    // normal
  }
  function sampleTable(rand, dist, data, N) {
    if (Array.isArray(data) && data.length) {                  // supplied samples: a seeded permutation, so file order is not the draw order
      const a = data.map(Number), out = [];
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const s = a[i]; a[i] = a[j]; a[j] = s; }
      return a;
    }
    const out = []; for (let i = 0; i < N; i++) out.push(draw1(rand, dist)); return out;
  }
  const quantiles = (table, n) => {                            // n dots at (i+0.5)/n of the empirical CDF, linear between order statistics
    const s = table.slice().sort((a, b) => a - b), M = s.length, out = [];
    for (let i = 0; i < n; i++) { const f = (i + 0.5) / n * M - 0.5, lo = clamp(Math.floor(f), 0, M - 1), hi = Math.min(M - 1, lo + 1); out.push(s[lo] + (s[hi] - s[lo]) * clamp(f - lo, 0, 1)); }
    return out;
  };
  function niceDomain(lo, hi, zero) {
    if (zero && lo >= 0) lo = 0;
    const raw = (hi - lo) / 6, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag, step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
    return { d0: Math.floor(lo / step + 1e-9) * step, d1: Math.ceil(hi / step - 1e-9) * step, step };
  }

  /* ---------- text on the canvas, faces from the pack ---------- */
  const fnt = (T, role, size) => { const f = T.type[role]; return f.weight + ' ' + size + 'px "' + f.family + '"'; };
  function txt(p, T, s, x, y, o) {
    o = o || {}; const c = p.drawingContext; c.save(); c.font = fnt(T, o.font || 'body', o.size || 16); c.textAlign = o.align || 'left'; c.textBaseline = 'alphabetic';
    c.globalAlpha = o.a == null ? 1 : o.a; c.fillStyle = o.fill || T.color.muted; c.fillText(s, x, y); c.restore();
  }

  /* ---------- timeline: pure of t. k = draws shown ---------- */
  function timing(P, K) {
    const drawEnd = P.start + K / P.rate, cm = P.commit;
    const est = cm ? P.estimate : 0, countAt = drawEnd + est, ratioAt = countAt + P.ratioDelay;
    return { drawEnd, countAt, ratioAt };
  }
  function countAt(t, P, K) { if (t < P.start) return 0; return Math.min(K, Math.floor((t - P.start) * P.rate) + 1); }
  function stageAt(t, P, K) {
    if (!P.commit) return 'draw'; const tm = timing(P, K);
    return t < tm.drawEnd ? 'draw' : t < tm.countAt ? 'estimate' : t < tm.ratioAt ? 'count' : 'ratio';
  }

  /* ---------- setup: the sample table, quantile dots, domain, stacks. Nothing here depends on t ---------- */
  function setup(p, ctx, P) {
    P = Object.assign({}, base, P);
    const rand = mulberry32(ctx.seed | 0), table = sampleTable(rand, P.dist, P.data, P.N);
    const K0 = P.show === 'qdots' ? P.dots : Math.min(P.K, table.length);
    const used = P.show === 'qdots' ? quantiles(table, P.dots) : table.slice(0, K0);   // domain fits what is shown, so no draw leaves the axis
    const lo = Math.min.apply(null, used), hi = Math.max.apply(null, used);
    const dm = P.domain ? { d0: P.domain[0], d1: P.domain[1], step: (P.domain[1] - P.domain[0]) / 6 } : niceDomain(lo, hi, P.zero);
    const sx = (v) => X0 + (v - dm.d0) / (dm.d1 - dm.d0) * (X1 - X0);
    const K = P.show === 'qdots' ? P.dots : Math.min(P.K, table.length);
    const st = { table, K, dm, sx, lo, hi, truncated: dm.d0 > 0 };
    if (P.show === 'qdots') {
      const q = quantiles(table, P.dots), perm = q.map((_, i) => i);
      for (let i = perm.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const s = perm[i]; perm[i] = perm[j]; perm[j] = s; }   // seeded build order
      let d = 46, dots;
      for (; d >= 8; d--) {                                    // largest dot whose tallest stack still fits under the title
        const cnt = {}; let mx = 0; q.forEach((v) => { const b = Math.floor((sx(v) - X0) / d); cnt[b] = (cnt[b] || 0) + 1; mx = Math.max(mx, cnt[b]); });
        if (mx * d <= AY - TOP - 14) break;
      }
      const bins = {}; dots = new Array(q.length);
      perm.forEach((qi, rank) => {                             // stack height = dots of this bin that appeared earlier, so nothing floats
        const v = q[qi], b = Math.floor((sx(v) - X0) / d), h = bins[b] || 0; bins[b] = h + 1;
        dots[qi] = { v, rank, x: X0 + (b + 0.5) * d, y: AY - 2 - d * (h + 0.5), r: d * 0.42 };
      });
      st.dots = dots; st.d = d;
    }
    return st;
  }

  /* ---------- drawing pieces ---------- */
  function axis(p, T, st, P, a) {
    const c = p.drawingContext, col = T.color, dm = st.dm; c.save();
    for (let v = dm.d0; v <= dm.d1 + 1e-9; v += dm.step) {
      const x = st.sx(v), zero = Math.abs(v) < 1e-9;
      c.globalAlpha = a; c.strokeStyle = zero ? col.ink : col.line; c.lineWidth = zero ? 1.8 : 1;
      c.beginPath(); c.moveTo(x, zero ? TOP - 6 : TOP + 20); c.lineTo(x, AY); c.stroke();
      txt(p, T, String(+v.toFixed(6)), x, AY + 20, { font: 'mono', size: 13, align: 'center', a, fill: zero ? col.ink : col.muted });
    }
    c.globalAlpha = a; c.strokeStyle = col.ink; c.lineWidth = 1.4; c.beginPath(); c.moveTo(X0, AY); c.lineTo(X1, AY); c.stroke();
    txt(p, T, P.unit, X1, AY + 42, { font: 'mono', size: 13, align: 'right', a });
    if (st.truncated) txt(p, T, 'axis starts at ' + dm.d0 + ', not 0', X0, AY + 42, { font: 'mono', size: 13, fill: col.accent });
    c.restore();
  }
  function threshold(p, T, st, P) {
    if (P.threshold == null) return; const c = p.drawingContext, x = st.sx(P.threshold);
    c.save(); c.strokeStyle = T.color.accent2; c.lineWidth = 2; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(x, TOP - 6); c.lineTo(x, AY); c.stroke(); c.restore();
    txt(p, T, P.thresholdText, x + 8, TOP + 4, { font: 'body', size: 16, fill: T.color.accent2 });
  }
  function hopBar(p, T, st, P, v) {                            // one draw: a bar from the drawn zero (a dot where the axis is cut)
    const c = p.drawingContext, x = st.sx(v), cy = (TOP + AY) / 2 - 12, h = 76; c.save();
    if (!st.truncated) { c.fillStyle = T.color.ink; c.fillRect(X0, cy - h / 2, x - X0, h); c.fillStyle = T.color.accent; c.fillRect(x - 5, cy - h / 2 - 8, 5, h + 16); }
    else { c.fillStyle = T.color.accent; c.beginPath(); c.arc(x, cy, 22, 0, 6.2832); c.fill(); }
    c.restore();
  }
  function lines(p, T, st, P, k, o) {                          // k hairlines; age = how many draws ago. o.reveal colours by the threshold
    const c = p.drawingContext; c.save(); c.lineCap = 'butt';
    for (let i = 0; i < k; i++) {
      const age = k - 1 - i, x = st.sx(st.table[i]), newest = age === 0 && !o.still;
      let a = o.still ? 0.38 : P.floor + (0.55 - P.floor) * Math.exp(-age / P.tau), col = T.color.ink, w = 2;
      if (newest) { a = 1; col = T.color.accent; w = 4; }
      if (o.reveal) { const hit = st.table[i] > P.threshold; col = hit ? T.color.accent : T.color.ink; a = hit ? 0.85 : 0.3; w = 2.5; }
      c.globalAlpha = a; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x, TOP + 24); c.lineTo(x, AY); c.stroke();
    }
    c.restore();
  }
  function dotsDraw(p, T, st, P, k, stage) {
    const c = p.drawingContext; c.save();
    st.dots.forEach((d) => {
      if (d.rank >= k) return; let col = T.color.ink, a = 1;
      if (stage === 'draw' && d.rank === k - 1) col = T.color.accent;
      if (stage === 'count' || stage === 'ratio') { const hit = d.v > P.threshold; col = hit ? T.color.accent : T.color.ink; a = hit ? 1 : 0.5; }
      c.globalAlpha = a; c.fillStyle = col; c.beginPath(); c.arc(d.x, d.y, d.r, 0, 6.2832); c.fill();
    });
    c.restore();
  }
  const SHOWN = { hop: 'draws', ensemble: 'draws', qdots: 'dots' };
  const CAP = {
    hop: 'one equally likely outcome per frame; the cut between frames is the point',
    ensemble: 'draws pile up; the older ones fade to a trace, the newest is marked',
    qdots: (P) => 'each dot is 1 of ' + P.dots + ' equally likely outcomes: count dots, do not read a shape',
  };

  function drawFrame(p, t, st, P, T) {
    P = Object.assign({}, base, P); p.background(T.color.bg);
    const K = st.K, k = countAt(t, P, K), stage = stageAt(t, P, K), tm = timing(P, K), col = T.color;
    // head
    txt(p, T, P.title, X0, 66, { font: 'disp', size: 36, fill: col.ink });
    txt(p, T, P.sub, X0, 96, { font: 'body', size: 17 });
    txt(p, T, k + ' of ' + K + ' ' + SHOWN[P.show], X1, 66, { font: 'disp', size: 34, align: 'right', fill: stage === 'draw' && k < K ? col.ink : col.accent });
    axis(p, T, st, P, 1);
    // marks
    const frozenShape = P.show !== 'hop';
    if (P.show === 'hop') {
      if (stage === 'draw' && k > 0) hopBar(p, T, st, P, st.table[k - 1]);
      else if (stage === 'estimate') txt(p, T, '?', (X0 + X1) / 2, (TOP + AY) / 2 + 62, { font: 'disp', size: 190, align: 'center', a: 0.9, fill: col.accent });
      else if (stage === 'count' || stage === 'ratio') lines(p, T, st, P, K, { reveal: true });
      else if (k === K) hopBar(p, T, st, P, st.table[K - 1]);
    } else if (P.show === 'ensemble') lines(p, T, st, P, k, {});
    else dotsDraw(p, T, st, P, k, stage);
    threshold(p, T, st, P);
    // caption slot
    let cap = typeof CAP[P.show] === 'function' ? CAP[P.show](P) : CAP[P.show], capFill = col.muted, capSize = 18;
    if (P.commit) {
      const n = st.table.slice(0, K).filter((v) => v > P.threshold).length;
      if (st.dots) st.nAbove = st.dots.filter((d) => d.v > P.threshold).length;
      const hits = P.show === 'qdots' ? st.nAbove : n, what = P.show === 'qdots' ? 'dots' : 'draws';
      if (stage === 'draw') cap = 'watch the draws; the question comes after, and your number comes before the answer';
      else if (stage === 'estimate') {
        cap = 'commit now: of ' + K + ' ' + what + ', how many ' + P.thresholdText + '?'; capFill = col.accent; capSize = 24;
        const u = clamp((t - tm.drawEnd) / P.estimate, 0, 1), c = p.drawingContext; c.save(); c.fillStyle = col.accent; c.fillRect(X0, 456, (X1 - X0) * (1 - u), 3); c.restore();
      } else if (stage === 'count') { cap = hits + ' of ' + K + ' ' + what + ' ' + P.thresholdText; capFill = col.ink; capSize = 26; }
      else { cap = hits + ' / ' + K + ' = ' + Math.round(100 * hits / K) + '%  of ' + what + ' ' + P.thresholdText; capFill = col.ink; capSize = 26; }
    }
    txt(p, T, cap, X0, 492, { font: 'body', size: capSize, fill: capFill });
    txt(p, T, P.limits || (st.srcNote + ' · seed ' + st.seed + ' · ' + (P.show === 'qdots' ? 'dots are sample quantiles' : 'no smoothing between draws') + ' · illustrative'), X0, 522, { font: 'mono', size: 11 });
  }

  const BUS = { type: 'lognormal', mu: Math.log(11), sigma: 0.38 };
  const base = {
    show: 'hop', data: null, dist: BUS, N: 1000, K: 44, dots: 20, rate: 4, start: 0.5, floor: 0.08, tau: 7,
    zero: true, domain: null, unit: 'minutes', title: 'When does the bus come?',
    sub: 'same model, a new possible outcome each frame', commit: false, estimate: 3, ratioDelay: 2,
    threshold: null, thresholdText: 'later than 15 min', limits: null,
  };
  const distNote = (P) => Array.isArray(P.data) && P.data.length ? P.data.length + ' supplied samples' : P.dist.type + ' model';

  const API = {
    countAt, stageAt, timing, sampleTable, quantiles, mulberry32,
    count(t, P, st) { P = Object.assign({}, base, P); return countAt(t, P, st ? st.K : (P.show === 'qdots' ? P.dots : P.K)); },
  };
  ARSENAL.uncertaintyHop = API;
  const CM = { commit: true, threshold: 15, rate: 5, K: 30, estimate: 3 };
  ARSENAL.patterns['uncertainty-hop'] = {
    id: 'uncertainty-hop', atlas: ['pure-function-of-t', 'seeded-determinism', 'random-seed', 'generative-distributions', 'map-norm-constrain', 'text-width'],
    renderer: 'p2d', dur: 12, params: base,
    variants: [
      { name: 'hop', params: { show: 'hop', rate: 4, K: 44 } },
      { name: 'qdots-20', params: { show: 'qdots', dots: 20, rate: 3, sub: 'a quantile dotplot: 20 dots, each one equally likely', title: 'When does the bus come?' } },
      { name: 'qdots-50', params: { show: 'qdots', dots: 50, rate: 5, sub: 'the same model as 50 dots: finer, same shape' } },
      { name: 'ensemble', params: { show: 'ensemble', rate: 6, K: 60, sub: 'draws accumulate; fading keeps the newest readable' } },
      { name: 'commit', params: Object.assign({ show: 'hop', sub: 'show the draws, freeze, ask, then count' }, CM) },
      { name: 'commit-qdots', params: { show: 'qdots', dots: 20, rate: 4, commit: true, threshold: 15, estimate: 3, sub: 'build the dots, freeze, ask, then count' } },
    ],
    setup(p, ctx, P) { const PP = Object.assign({}, base, P), st = setup(p, ctx, PP); st.seed = ctx.seed; st.srcNote = distNote(PP); return st; },
    draw: drawFrame,
    count(t, P, st) { return API.count(t, P, st); },
  };
})();
