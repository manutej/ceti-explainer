/* arsenal/patterns/track-unit · object constancy, told honestly (renderer: p2d)
   One mark per unit; every unit keeps its identity through a re-partition computed with arsenal/structures/structures.js
   (grid, columns-as-waffle-bars, slabs, ring) and interpolated with structures.transition (seeded rank, minimal stagger).
   TAGGED units are drawn as comets: a fading trail sampled from their own pure path, a dotted history and a ghost at the
   origin, with a label pinned to the head. check(t) is a congruence lint: at any in-between frame the unit count, the
   ids and the total mark area equal the layouts' (lint() sweeps 48 in-between frames). The numerator/denominator LAMP
   lights the base units and counts them, then the counted units, and prints the ratio only after both counts complete.
   draw(t) is pure of t; seeds in setup (mulberry32 from structures.js); no fetch; roles only (tokens.color.*). */
(function (root) {
  'use strict';
  const A = (root.ARSENAL = root.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  const ID = 'track-unit', W = 960, H = 540, GAP = 0.2;
  const St = () => A.structures;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-9));
  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const EASE = {
    cubic: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
    quint: (u) => (u < 0.5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2),
    smooth: (u) => u * u * (3 - 2 * u),
  };

  /* ── data presets (a film passes its own `data` array instead) ───────────────────────────────────────────────── */
  function berkeley() {   // Bickel, Hammel & O'Connell 1975, Science 187:398 · six largest departments, fall 1973
    const G = ['MEN', 'WOMEN'], C = ['A', 'B', 'C', 'D', 'E', 'F'];
    const n = [[825, 560, 325, 417, 191, 373], [108, 25, 593, 375, 393, 341]];
    const a = [[512, 353, 120, 138, 53, 22], [89, 17, 202, 131, 94, 24]];
    const units = []; let id = 0;
    G.forEach((g, gi) => C.forEach((c, ci) => { for (let k = 0; k < n[gi][ci]; k++) units.push({ id: id++, group: g, category: c, hit: k < a[gi][ci] }); }));
    return { units, groups: G, cats: C, unitName: 'APPLICANT', title: 'BERKELEY 1973 · SIX DEPARTMENTS',
      caption: 'ONE MARK = ONE APPLICANT · INK = ADMITTED', source: 'SOURCE · BICKEL, HAMMEL & O’CONNELL 1975 · SCIENCE 187:398' };
  }
  function screening() {  // natural-frequency teaching example: 1,000 women, prevalence 1 %, sensitivity 90 %, false-positive 9 %
    const rows = [['TESTED POSITIVE', 'CANCER', 9], ['TESTED POSITIVE', 'NO CANCER', 89], ['TESTED NEGATIVE', 'CANCER', 1], ['TESTED NEGATIVE', 'NO CANCER', 901]];
    const units = []; let id = 0;
    rows.forEach(([g, c, k]) => { for (let j = 0; j < k; j++) units.push({ id: id++, group: g, category: c, hit: c === 'CANCER' }); });
    return { units, groups: ['TESTED POSITIVE', 'TESTED NEGATIVE'], cats: ['CANCER', 'NO CANCER'], unitName: 'WOMAN', title: '1,000 WOMEN SCREENED',
      caption: 'ONE MARK = ONE WOMAN', source: 'SOURCE · GIGERENZER ET AL. 2007 · PSYCHOL. SCI. PUBLIC INTEREST 8(2) · 1 % · 90 % · 9 %' };
  }
  function invoices() {   // illustrative, seeded: 360 invoices in five lines, value 1..4 (area = amount)
    const C = ['PAYROLL', 'CLOUD', 'RENT', 'TRAVEL', 'OTHER'], N = [120, 90, 70, 50, 30], r = St().mulberry32(7);
    const units = []; let id = 0;
    C.forEach((c, ci) => { for (let k = 0; k < N[ci]; k++) { const u = r(); units.push({ id: id++, group: 'ALL', category: c, value: 1 + Math.floor(u * u * 4), hit: false }); } });
    return { units, groups: ['ALL'], cats: C, unitName: 'INVOICE', title: '360 INVOICES · FIVE LINES',
      caption: 'ONE MARK = ONE INVOICE · MARK AREA = AMOUNT', source: 'ILLUSTRATIVE DATA · SEEDED (MULBERRY32, SEED 7)' };
  }
  const PRESETS = { berkeley, screening, invoices };

  function resolveData(P) {
    const base = typeof P.data === 'string' ? PRESETS[P.data]() : { units: P.data || [], groups: null, cats: null, unitName: 'UNIT', title: '', caption: '', source: '' };
    const U = base.units.map((u, i) => ({ idx: i, id: u.id != null ? u.id : i, group: String(u.group != null ? u.group : 'ALL'), category: String(u.category != null ? u.category : '·'),
      value: u.value != null ? +u.value : 1, hit: !!u.hit }));
    const first = (f) => { const s = []; U.forEach((u) => { if (!s.includes(u[f])) s.push(u[f]); }); return s; };
    return { U, groups: P.groups || base.groups || first('group'), cats: P.cats || base.cats || first('category'),
      unitName: P.unitName || base.unitName, title: P.title != null ? P.title : base.title, caption: P.caption != null ? P.caption : base.caption,
      source: P.source != null ? P.source : base.source };
  }

  /* ── layouts (positions from structures.grid / structures.ring; items aligned by unit index) ────────────────── */
  const keyOf = (u, by) => (by === 'group' ? u.group : by === 'category' ? u.category : by === 'cell' ? u.group + ' · ' + u.category : 'ALL');
  function keysFor(by, D) {
    if (by === 'group') return D.groups.slice();
    if (by === 'category') return D.cats.slice();
    if (by === 'cell') { const k = []; D.groups.forEach((g) => D.cats.forEach((c) => { if (D.U.some((u) => u.group === g && u.category === c)) k.push(g + ' · ' + c); })); return k; }
    return ['ALL'];
  }
  function sorted(list, sort, D, RK) {
    const ci = (u) => D.cats.indexOf(u.category);
    const cmp = { hit: (a, b) => (b.hit - a.hit) || (RK[a.idx] - RK[b.idx]), category: (a, b) => (ci(a) - ci(b)) || (b.hit - a.hit) || (RK[a.idx] - RK[b.idx]),
      shuffle: (a, b) => RK[a.idx] - RK[b.idx], id: (a, b) => a.idx - b.idx }[sort || 'hit'];
    return list.slice().sort(cmp);
  }
  const mkItem = (u, s, size) => ({ i: u.idx, x: s.x, y: s.y, w: size, h: size, g: 0, a: 1, hl: false });
  /* a waffle block of n cells, c wide, at pitch p, top-left (x, y), from structures.grid; bottomUp fills from the base */
  function waffle(n, c, x, y, p, bottomUp) {
    const r = Math.max(1, Math.ceil(n / c)), G = St().grid(r * c, c, { x, y, w: c * p, h: r * p }, { gap: GAP }), out = [];
    for (let k = 0; k < n; k++) out.push(G.items[bottomUp ? (r - 1 - Math.floor(k / c)) * c + (k % c) : k]);
    return { slots: out, rows: r, size: G.size };
  }
  function bars(spec, D, RK, match) {          // pooled columns (by group), stacked bars (by category or cell), one stack (by null)
    const box = spec.box, keys = keysFor(spec.by, D), gap = spec.gap == null ? 48 : spec.gap, nb = keys.length;
    const mem = keys.map((k) => sorted(D.U.filter((u) => keyOf(u, spec.by) === k), spec.sort, D, RK));
    const maxN = Math.max(...mem.map((m) => m.length), 1);
    let p, c;
    if (match) { p = match.p; c = match.c; }
    else if (spec.cols) { c = spec.cols; p = Math.min(box.h / Math.ceil(maxN / c), (box.w - gap * (nb - 1)) / (nb * c)); }
    else { p = 0; for (let cc = 1; cc <= 120; cc++) { const pp = Math.min(box.h / Math.ceil(maxN / cc), (box.w - gap * (nb - 1)) / (nb * cc)); if (pp > p + 1e-9) { p = pp; c = cc; } } }
    if (spec.maxPitch) p = Math.min(p, spec.maxPitch);
    const bw = c * p, total = nb * bw + gap * (nb - 1), x0 = box.x + (box.w - total) / 2, base = box.y + box.h, items = new Array(D.U.length), labels = [], colX = {};
    let size = p * (1 - GAP);
    keys.forEach((k, j) => {
      const x = match && match.colX[k] != null ? match.colX[k] : x0 + j * (bw + gap), n = mem[j].length;
      colX[k] = x; if (!n) return;
      const wf = waffle(n, c, x, base - Math.ceil(n / c) * p, p, true); size = wf.size;
      mem[j].forEach((u, q) => (items[u.idx] = mkItem(u, wf.slots[q], wf.size)));
      if (spec.by) {
        labels.push({ text: fmt(n), x: x + bw / 2, y: base - wf.rows * p - 9, face: 'disp', size: 24, role: 'ink', align: 'center' });
        labels.push({ text: k, x: x + bw / 2, y: base + 18, face: 'mono', size: 12, role: 'muted', align: 'center' });
      } else {                                   // one stack: a label per category band, right of the stack
        D.cats.forEach((cat) => {
          const ys = mem[j].map((u, q) => (u.category === cat ? wf.slots[q].y : null)).filter((v) => v != null);
          if (ys.length) labels.push({ text: cat + '  ' + fmt(ys.length), x: x + bw + 12, y: (Math.min(...ys) + Math.max(...ys)) / 2 + 4, face: 'mono', size: 12, role: 'ink', align: 'left' });
        });
      }
    });
    return { kind: spec.by ? 'bars' : 'stack', box, p, c, size, items, labels, colX, legible: size >= 7 };
  }
  function split(spec, D, RK) {                // slabs: one column per group, one slab per category, rows aligned across groups
    const box = spec.box, gs = D.groups, cs = D.cats, gap = spec.gap == null ? 70 : spec.gap, sg = spec.slabGap == null ? 8 : spec.slabGap;
    const colW = (box.w - gap * (gs.length - 1)) / gs.length;
    const mem = gs.map((g) => cs.map((c) => sorted(D.U.filter((u) => u.group === g && u.category === c), spec.sort, D, RK)));
    let p = 1, c = Math.floor(colW);
    for (let pp = 24; pp >= 1; pp -= 0.25) {
      const cc = Math.max(1, Math.floor(colW / pp)), lanes = cs.map((_, j) => Math.max(...gs.map((_, i) => Math.ceil(mem[i][j].length / cc))));
      if (lanes.reduce((a, b) => a + b, 0) * pp + sg * (cs.length - 1) <= box.h + 1e-9) { p = pp; c = cc; break; }
    }
    const items = new Array(D.U.length), labels = [], colX = {}; let y = box.y, size = p * (1 - GAP);
    gs.forEach((g, i) => { colX[g] = box.x + i * (colW + gap) + (colW - c * p) / 2; labels.push({ text: g, x: colX[g], y: box.y - 12, face: 'mono', size: 13, role: 'ink', align: 'left' }); });
    cs.forEach((cat, j) => {
      const rows = Math.max(1, ...gs.map((_, i) => Math.ceil(mem[i][j].length / c)));
      gs.forEach((g, i) => {
        const m = mem[i][j]; if (!m.length) return;
        const wf = waffle(m.length, c, colX[g], y, p, false); size = wf.size;
        m.forEach((u, q) => (items[u.idx] = mkItem(u, wf.slots[q], wf.size)));
        labels.push({ text: fmt(m.length), x: colX[g] + c * p + 6, y: y + Math.min(rows, Math.ceil(m.length / c)) * p / 2 + 4, face: 'mono', size: 12, role: 'muted', align: 'left' });
      });
      labels.push({ text: cat, x: colX[gs[0]] - 10, y: y + rows * p / 2 + 7, face: 'disp', size: 20, role: 'ink', align: 'right' });
      y += rows * p + sg;
    });
    return { kind: 'split', box, p, c, size, items, labels, colX, legible: size >= 7 };
  }
  function grid(spec, D, RK) {
    const order = sorted(D.U, spec.sort || 'shuffle', D, RK), G = St().grid(order.length, spec.cols || 0, spec.box), items = new Array(D.U.length);
    order.forEach((u, k) => (items[u.idx] = mkItem(u, G.items[k], G.size)));
    return { kind: 'grid', box: spec.box, p: G.pitch, c: G.cols, size: G.size, items, labels: [], colX: {}, legible: G.legible };
  }
  function ring(spec, D, RK) {                 // donut sectors: structures.ring slots sorted by angle, units sorted by category
    const order = sorted(D.U, spec.sort || 'category', D, RK), R = St().ring(order.length, spec.r, { cx: spec.cx, cy: spec.cy, inner: spec.inner });
    const TAU = Math.PI * 2, ang = (m) => (((m.rot + Math.PI / 2) % TAU) + TAU) % TAU;
    const slots = R.items.slice().sort((a, b) => ang(a) - ang(b) || b.r - a.r), items = new Array(D.U.length), labels = [];
    order.forEach((u, k) => (items[u.idx] = mkItem(u, slots[k], R.size)));
    D.cats.forEach((cat) => {
      const ks = order.map((u, k) => (u.category === cat ? k : -1)).filter((k) => k >= 0); if (!ks.length) return;
      const th = -Math.PI / 2 + (ang(slots[ks[0]]) + ang(slots[ks[ks.length - 1]])) / 2, rr = spec.r + 22, cx = Math.cos(th);
      labels.push({ text: cat + '  ' + fmt(ks.length), x: spec.cx + rr * cx, y: spec.cy + rr * Math.sin(th) + 4, face: 'mono', size: 12, role: 'ink', align: cx > 0.25 ? 'left' : cx < -0.25 ? 'right' : 'center' });
    });
    return { kind: 'ring', box: R.box, p: R.pitch, c: 0, size: R.size, items, labels, colX: {}, legible: R.legible };
  }
  function layout(spec, D, RK, match) {
    if (spec.kind === 'bars') return bars(spec, D, RK, match);
    if (spec.kind === 'stack') return bars(Object.assign({}, spec, { by: null, sort: spec.sort || 'category' }), D, RK, null);
    if (spec.kind === 'split') return split(spec, D, RK);
    if (spec.kind === 'grid') return grid(spec, D, RK);
    if (spec.kind === 'ring') return ring(spec, D, RK);
    throw new Error(ID + ': unknown layout ' + spec.kind);
  }

  const matches = (u, f) => !!f && (f.group == null || u.group === f.group) && (f.category == null || u.category === f.category) && (f.hit == null || u.hit === !!f.hit);

  /* ── setup: everything that is not t ────────────────────────────────────────────────────────────────────────── */
  function setup(p, ctx, P) {
    const D = resolveData(P), U = D.U, n = U.length, rnd = St().mulberry32(ctx && ctx.seed != null ? ctx.seed : 1);
    const RK = U.map(() => rnd()), R = U.map(() => rnd());
    let LB, LA;
    if (P.from.match) { LB = layout(P.to, D, RK, null); LA = layout(P.from, D, RK, LB); }
    else { LA = layout(P.from, D, RK, null); LB = layout(P.to, D, RK, null); }
    const vmax = Math.max(...U.map((u) => u.value), 1e-9), S = Math.min(LA.size, LB.size), byV = P.areaBy === 'value';
    [LA, LB].forEach((L) => L.items.forEach((m) => {
      const s = (P.sizeMode === 'own' ? L.size : S) * (byV ? Math.sqrt(U[m.i].value / vmax) : 1); m.w = m.h = s;
    }));
    const area = LB.items.reduce((a, m) => a + m.w * m.h, 0), areaA = LA.items.reduce((a, m) => a + m.w * m.h, 0);
    const tags = (P.tags || []).map((tg, k) => {
      const c = U.filter((u) => matches(u, tg.pick || {})), u = c[Math.min(c.length - 1, (tg.pick && tg.pick.nth) || 0)];
      return u ? { idx: u.idx, role: tg.role || (k ? 'accent2' : 'accent'), label: tg.label || (D.unitName + ' #' + u.id + ' · ' + u.group + ' · ' + u.category) } : null;
    }).filter(Boolean);
    let lamp = null;
    if (P.lamp) {
      const L = P.lamp, read = U.map((u) => u.idx).sort((a, b) => (LA.items[a].y - LA.items[b].y) || (LA.items[a].x - LA.items[b].x));
      const baseRank = new Int32Array(n).fill(-1), hitRank = new Int32Array(n).fill(-1); let nb = 0, nh = 0;
      read.forEach((i) => { if (matches(U[i], L.base)) baseRank[i] = nb++; if (matches(U[i], L.hit)) hitRank[i] = nh++; });
      lamp = { baseRank, hitRank, nb, nh };
    }
    return { D, U, n, LA, LB, S, R, area, areaA, tags, lamp, legible: LA.legible && LB.legible };
  }

  /* ── pure geometry of t ─────────────────────────────────────────────────────────────────────────────────────── */
  const topts = (st, P, rankFn) => ({ stagger: P.stagger, by: rankFn, arc: P.arc || 0, ease: EASE[P.ease] || EASE.cubic });
  const uOf = (t, P) => seg(t, P.move[0], P.move[1]);
  function positions(t, st, P) {
    const u = uOf(t, P);
    if (u <= 0) return st.LA.items; if (u >= 1) return st.LB.items;
    return St().transition(st.LA, st.LB, u, topts(st, P, (m, i) => st.R[i])).items;
  }
  function posOf(i, t, st, P) {           // one unit's position at t: the same transition, restricted to one item
    const u = uOf(t, P);
    if (u <= 0) return st.LA.items[i]; if (u >= 1) return st.LB.items[i];
    return St().transition(Object.assign({}, st.LA, { items: [st.LA.items[i]] }), Object.assign({}, st.LB, { items: [st.LB.items[i]] }), u, topts(st, P, () => st.R[i])).items[0];
  }
  function lampAt(t, st, P) {
    if (!st.lamp) return null; const L = P.lamp, lm = st.lamp;
    const kb = Math.floor(seg(t, L.t0, L.t0 + L.baseDur) * lm.nb + 1e-9), kh = Math.floor(seg(t, L.hitAt, L.hitAt + L.hitDur) * lm.nh + 1e-9);
    return { kb, kh, nb: lm.nb, nh: lm.nh, baseDone: kb >= lm.nb, hitDone: kh >= lm.nh, ratio: kb >= lm.nb && kh >= lm.nh && t >= L.ratioAt };
  }
  function count(t, st, P) {
    const u = uOf(t, P), s = P.stagger || 0; let flight = 0;
    if (u > 0 && u < 1) for (let i = 0; i < st.n; i++) { const v = (u - s * st.R[i]) / (1 - s); if (v > 0 && v < 1) flight++; }
    const lm = lampAt(t, st, P);
    return { units: st.n, shown: st.n, inFlight: flight, tagged: st.tags.length, phase: u <= 0 ? 'from' : u >= 1 ? 'to' : 'move', u: +u.toFixed(4),
      lamp: lm && { base: lm.kb, baseOf: lm.nb, hit: lm.kh, hitOf: lm.nh, ratioShown: lm.ratio } };
  }
  /* congruence lint at one frame: count, unique ids, total mark area, all marks finite and inside the frame */
  function check(t, st, P) {
    const it = positions(t, st, P); let c = 0, area = 0, out = 0; const ids = new Set();
    for (const m of it) {
      if (!m || !isFinite(m.x) || !isFinite(m.y) || !isFinite(m.w) || !(m.a > 0)) continue;
      c++; ids.add(m.i); area += m.w * m.h;
      if (m.x - m.w / 2 < -0.5 || m.x + m.w / 2 > W + 0.5 || m.y - m.h / 2 < -0.5 || m.y + m.h / 2 > H + 0.5) out++;
    }
    const areaErr = Math.abs(area - st.area) / (st.area || 1);
    return { t: +t.toFixed(4), count: c, n: st.n, ids: ids.size, area: +area.toFixed(3), expected: +st.area.toFixed(3), areaErr, outOfFrame: out,
      ok: c === st.n && ids.size === st.n && areaErr < 1e-9 && out === 0 };
  }
  /* sweep: K in-between frames plus both ends; also continuity (no unit jumps more than 12 % of the longest path per sample) */
  function lint(st, P, K) {
    K = K || 48; const [a, b] = P.move, ts = [a]; for (let k = 0; k < K; k++) ts.push(a + (k + 0.5) / K * (b - a)); ts.push(b);
    let maxPath = 0; for (let i = 0; i < st.n; i++) maxPath = Math.max(maxPath, Math.hypot(st.LB.items[i].x - st.LA.items[i].x, st.LB.items[i].y - st.LA.items[i].y));
    const fails = []; let maxErr = 0, maxStep = 0, prev = null;
    ts.forEach((t) => {
      const r = check(t, st, P); maxErr = Math.max(maxErr, r.areaErr); if (!r.ok) fails.push(r);
      const it = positions(t, st, P);
      if (prev) for (let i = 0; i < st.n; i++) maxStep = Math.max(maxStep, Math.hypot(it[i].x - prev[i].x, it[i].y - prev[i].y));
      prev = it.map((m) => ({ x: m.x, y: m.y }));
    });
    const continuous = maxStep <= 0.12 * maxPath + 1e-6;
    return { frames: ts.length, count: st.n, areaFrom: +st.areaA.toFixed(3), areaTo: +st.area.toFixed(3), areaErrMax: maxErr, maxStep: +maxStep.toFixed(3), maxPath: +maxPath.toFixed(3),
      continuous, failures: fails.length, firstFailure: fails[0] || null, sizeMode: P.sizeMode || 'common', ok: !fails.length && continuous };
  }

  /* ── drawing ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const font = (tk, face, size) => { const f = tk.type[face] || tk.type.mono; return f.weight + ' ' + size + 'px "' + f.family + '", ' + (face === 'disp' ? 'sans-serif' : 'monospace'); };
  function text(ctx, tk, s, x, y, o) {
    ctx.font = font(tk, o.face || 'mono', o.size || 12); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.fillStyle = tk.color[o.role || 'ink']; ctx.fillText(s, x, y);
  }
  function drawTag(ctx, tk, tg, t, st, P) {
    const [m0, m1] = P.move, at = P.tagAt == null ? m0 - 1 : P.tagAt; if (t < at) return;
    const col = tk.color[tg.role], o = st.LA.items[tg.idx], head = posOf(tg.idx, t, st, P), s = head.w, show = seg(t, at, at + 0.4);
    ctx.save();
    if (t >= m0) {                               // ghost at the origin, then the dotted history
      const g = seg(t, m0, m0 + 0.3), gs = Math.max(s * 1.9, 9);
      ctx.globalAlpha = 0.28 * g; ctx.fillStyle = col; ctx.fillRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
      ctx.globalAlpha = 0.85 * g; ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.strokeRect(o.x - gs / 2, o.y - gs / 2, gs, gs);
      ctx.setLineDash([1.5, 4]); ctx.globalAlpha = 0.55 * g; ctx.beginPath(); ctx.moveTo(o.x, o.y);
      const tEnd = Math.min(t, m1); for (let k = 1; k <= 32; k++) { const q = posOf(tg.idx, m0 + (tEnd - m0) * k / 32, st, P); ctx.lineTo(q.x, q.y); }
      ctx.stroke(); ctx.setLineDash([]);
      const NT = 14, dt = (P.trail || 0.6) / NT; let a = head;   // comet trail: the unit's own past, fading
      for (let k = 1; k <= NT; k++) {
        const b = posOf(tg.idx, Math.max(m0, t - k * dt), st, P), f = 1 - k / (NT + 1);
        ctx.globalAlpha = 0.9 * f; ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.8, s * 0.9 * f); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); a = b;
      }
    }
    const rs = Math.max(s + 7, 11);              // head: the mark in the tag role and a ring
    ctx.globalAlpha = show; ctx.fillStyle = col; ctx.fillRect(head.x - s / 2, head.y - s / 2, s, s);
    ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.strokeRect(head.x - rs / 2, head.y - rs / 2, rs, rs);
    ctx.font = font(tk, 'mono', 12); const tw = ctx.measureText(tg.label).width;   // label pinned to the head
    let lx = head.x + rs / 2 + 14, ly = head.y - rs / 2 - 10; if (lx + tw + 8 > W - 8) lx = head.x - rs / 2 - 14 - tw; if (ly < 24) ly = head.y + rs / 2 + 22;
    ctx.globalAlpha = 0.86 * show; ctx.fillStyle = tk.color.bg; ctx.fillRect(lx - 5, ly - 13, tw + 10, 18);
    ctx.globalAlpha = show; ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(head.x, head.y); ctx.lineTo(lx < head.x ? lx + tw + 5 : lx - 5, ly - 4); ctx.stroke();
    text(ctx, tk, tg.label, lx, ly, { role: tg.role, alpha: show });
    ctx.restore();
  }
  function drawLamp(ctx, tk, lm, t, P) {
    const L = P.lamp, b = L.box, w = b.w, ch = 92, op = seg(t, L.t0 - 0.5, L.t0); if (op <= 0) return;
    const cell = (y, k, nOf, label, role, live, done) => {
      ctx.globalAlpha = op; ctx.fillStyle = tk.color.panel; ctx.fillRect(b.x, y, w, ch);
      ctx.strokeStyle = live ? tk.color[role] : tk.color.line; ctx.lineWidth = live ? (done ? 2 : 1.4) : 1; ctx.strokeRect(b.x + 0.5, y + 0.5, w - 1, ch - 1);
      text(ctx, tk, live ? fmt(k) : '—', b.x + 16, y + 56, { face: 'disp', size: 48, role: live ? role : 'muted', alpha: op });
      if (live && !done) text(ctx, tk, 'COUNTING · OF ' + fmt(nOf), b.x + w - 12, y + 22, { size: 11, role: 'muted', align: 'right', alpha: op });
      text(ctx, tk, label, b.x + 16, y + ch - 12, { size: 12, role: live ? 'ink' : 'muted', alpha: op });
    };
    const hitLive = t >= L.hitAt, baseLive = t >= L.t0;
    cell(b.y, lm.kh, lm.nh, L.hitLabel, L.hitRole || 'accent', hitLive, lm.hitDone);
    ctx.globalAlpha = op; ctx.fillStyle = tk.color.ink; ctx.fillRect(b.x, b.y + ch + 6, w, 2);
    cell(b.y + ch + 14, lm.kb, lm.nb, L.baseLabel, L.baseRole || 'ink', baseLive, lm.baseDone);
    const ro = lm.ratio ? seg(t, L.ratioAt, L.ratioAt + 0.4) * op : 0;
    const y = b.y + 2 * ch + 14 + 40;
    if (ro > 0) {
      const pct = 100 * lm.nh / lm.nb, r = Math.round(pct * 10 ** (L.digits || 0)) / 10 ** (L.digits || 0), eq = Math.abs(pct - r) < 1e-9 ? '=' : '≈';
      text(ctx, tk, fmt(lm.nh) + ' ÷ ' + fmt(lm.nb) + '  ' + eq + '  ' + r + ' %', b.x, y + 10, { face: 'disp', size: 34, role: 'ink', alpha: ro });
      text(ctx, tk, (L.hitLabel + ' ÷ ' + L.baseLabel), b.x, y + 32, { size: 11, role: 'muted', alpha: ro });
    } else if (op > 0) text(ctx, tk, 'RATIO AFTER BOTH COUNTS', b.x, y + 10, { size: 11, role: 'muted', alpha: 0.7 * op });
  }

  function draw(p, t, st, P, tk) {
    const ctx = p.drawingContext; ctx.save();
    ctx.globalAlpha = 1; ctx.fillStyle = tk.color.bg; ctx.fillRect(0, 0, W, H);
    const it = positions(t, st, P), u = uOf(t, P), lm = lampAt(t, st, P), mr = P.markRoles || {};
    const tagged = new Set(st.tags.filter(() => t >= (P.tagAt == null ? P.move[0] - 1 : P.tagAt)).map((g) => g.idx));
    const B = new Map(), put = (role, a, m) => { const k = role + '|' + a; if (!B.has(k)) B.set(k, []); B.get(k).push(m); };
    for (let i = 0; i < st.n; i++) {
      const m = it[i]; if (tagged.has(i)) continue;
      if (lm && t < P.lamp.t0 - 0.5) put('muted', 0.5, m);      // before the lamp nothing is lit: no count is given away
      else if (lm) {
        if (st.lamp.hitRank[i] >= 0 && st.lamp.hitRank[i] < lm.kh) put(P.lamp.hitRole || 'accent', 1, m);
        else if (st.lamp.baseRank[i] >= 0 && st.lamp.baseRank[i] < lm.kb) put(P.lamp.baseRole || 'ink', 0.9, m);
        else put('muted', 0.34, m);
      } else if (st.U[i].hit) put(mr.hit || 'ink', 0.92, m); else put(mr.base || 'muted', 0.45, m);
    }
    for (const [k, ms] of B) { const [role, a] = k.split('|'); ctx.globalAlpha = +a; ctx.fillStyle = tk.color[role]; for (const m of ms) ctx.fillRect(m.x - m.w / 2, m.y - m.h / 2, m.w, m.h); }
    const la = 1 - seg(u, 0, 0.25), lb = seg(u, 0.75, 1);
    if (P.labels !== false) {
      if (la > 0) st.LA.labels.forEach((l) => text(ctx, tk, l.text, l.x, l.y, Object.assign({}, l, { alpha: la })));
      if (lb > 0) st.LB.labels.forEach((l) => text(ctx, tk, l.text, l.x, l.y, Object.assign({}, l, { alpha: lb })));
    }
    if (st.D.title) text(ctx, tk, st.D.title, 40, 36, { face: 'disp', size: 22, role: 'ink' });
    if (st.D.caption) text(ctx, tk, st.D.caption, 40, 54, { size: 11, role: 'muted' });
    if (st.D.source) text(ctx, tk, st.D.source, 40, H - 14, { size: 11, role: 'muted' });
    if (lm) drawLamp(ctx, tk, lm, t, P);
    st.tags.forEach((tg) => drawTag(ctx, tk, tg, t, st, P));
    ctx.restore();
    return count(t, st, P);
  }

  const BOX1 = { x: 60, y: 100, w: 840, h: 380 };
  A.patterns[ID] = {
    id: ID, renderer: 'p2d', dur: 12,
    atlas: ['shape-morph', 'lerp', 'easing-functions', 'pure-function-of-t', 'seeded-determinism', 'derived-geometry', 'resolution-independence', 'layered-compositing'],
    params: {
      data: 'berkeley', from: { kind: 'bars', by: 'group', sort: 'hit', match: true, box: BOX1 }, to: { kind: 'split', sort: 'hit', box: BOX1, gap: 70, slabGap: 8 },
      move: [2.5, 6.5], stagger: 0.06, arc: 0, ease: 'cubic', areaBy: 'unit', sizeMode: 'common', trail: 0.6, tagAt: null, tags: [], lamp: null, labels: true,
      markRoles: { hit: 'ink', base: 'muted' }, groups: null, cats: null, title: null, caption: null, source: null, unitName: null,
    },
    variants: [
      { name: 'pooled-split', params: { tagAt: 1.0, tags: [
        { pick: { group: 'WOMEN', category: 'A', hit: true, nth: 40 }, label: 'WOMAN · DEPT A · ADMITTED' },
        { pick: { group: 'MEN', category: 'F', hit: false, nth: 120 }, label: 'MAN · DEPT F · REJECTED' }] } },
      { name: 'stack-ring', params: { data: 'invoices', areaBy: 'value', from: { kind: 'stack', sort: 'category', cols: 12, box: { x: 150, y: 80, w: 150, h: 400 } },
        to: { kind: 'ring', sort: 'category', cx: 640, cy: 285, r: 185, inner: 60 }, move: [6, 10], arc: 40, tagAt: 4.6,
        tags: [{ pick: { category: 'TRAVEL', nth: 7 }, label: 'INVOICE · TRAVEL' }] } },
      { name: 'grid-columns-lamp', params: { data: 'screening', from: { kind: 'grid', sort: 'shuffle', box: { x: 40, y: 76, w: 600, h: 420 } },
        to: { kind: 'bars', by: 'group', sort: 'hit', box: { x: 60, y: 90, w: 560, h: 390 }, gap: 60 }, move: [6.5, 10], stagger: 0.05, tagAt: 5.6,
        lamp: { base: { group: 'TESTED POSITIVE' }, hit: { group: 'TESTED POSITIVE', hit: true }, t0: 0.6, baseDur: 2.2, hitAt: 3.2, hitDur: 1.2, ratioAt: 4.8,
          baseLabel: 'TESTED POSITIVE', hitLabel: 'HAVE CANCER', baseRole: 'ink', hitRole: 'accent', digits: 0, box: { x: 690, y: 96, w: 230 } },
        tags: [{ pick: { group: 'TESTED POSITIVE', hit: true, nth: 4 }, label: 'POSITIVE · HAS CANCER', role: 'accent' }] } },
    ],
    setup, draw, count, check, lint, positions, presets: PRESETS,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = A.patterns[ID];
})(typeof window !== 'undefined' ? window : globalThis);
