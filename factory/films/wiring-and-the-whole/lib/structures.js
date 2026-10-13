/* ARSENAL.structures · the layout library for counts. Pure functions: no drawing, no Math.random/Date.
   Every layout is { kind, n, box, size, legible, items:[{i,x,y,w,h,g,a,hl,...}], ...extras }.
   x,y are the CENTRE of a mark; w,h its size; a is alpha 0..1; hl the highlight flag; g the group index.
   Units are the caller's (960 basis by default; fit() enforces a 7-unit minimum on that basis). */
(function (root) {
  'use strict';
  const A = (root.ARSENAL = root.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  A.structures = A.structures || {};

  const MIN = 7, GAP = 0.2, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const smooth = (u) => u * u * (3 - 2 * u);
  const mulberry32 = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const B = (box) => ({ x: box.x || 0, y: box.y || 0, w: box.w, h: box.h });
  const mk = (i, x, y, s, g) => ({ i, x, y, w: s, h: s, g: g || 0, a: 1, hl: false });
  const out = (kind, n, box, size, items, extra) => Object.assign({ kind, n, box, size, legible: size >= MIN - 1e-9, items }, extra);

  /* fit(box, n, opts) -> { cols, rows, pitch, size, legible, min, group }
     Picks the cols that maximise pitch for n cells in box; size = pitch*(1-gap). If size < min (7 on a
     960 basis; opts.basis scales it) legible is false and group is the count-per-mark needed to recover it. */
  function fit(box, n, opts) {
    opts = opts || {}; box = B(box);
    const gap = opts.gap == null ? GAP : opts.gap, min = (opts.min || MIN) * ((opts.basis || 960) / 960);
    let best = { cols: 1, rows: n, pitch: 0 };
    const lo = opts.cols || 1, hi = opts.cols || Math.max(1, n);
    for (let c = lo; c <= hi; c++) {
      const r = Math.ceil(n / c), p = Math.min(box.w / c, box.h / r);
      if (p > best.pitch + 1e-9) best = { cols: c, rows: r, pitch: p };
    }
    const size = Math.min(best.pitch * (1 - gap), opts.maxSize || Infinity), legible = size >= min - 1e-9;
    return { cols: best.cols, rows: best.rows, pitch: best.pitch, size, legible, min, group: legible ? 1 : Math.ceil((min / Math.max(size, 1e-6)) ** 2) };
  }

  /* grid(n, cols, box): row-major, centred in box. cols null/0 -> chosen by fit. */
  function grid(n, cols, box, opts) {
    box = B(box); const f = fit(box, n, Object.assign({}, opts, { cols: cols || undefined }));
    const c = f.cols, r = f.rows, p = f.pitch, s = f.size;
    const x0 = box.x + (box.w - c * p) / 2 + p / 2, y0 = box.y + (box.h - r * p) / 2 + p / 2, items = [];
    for (let i = 0; i < n; i++) items.push(mk(i, x0 + (i % c) * p, y0 + Math.floor(i / c) * p, s, 0));
    return out('grid', n, box, s, items, { cols: c, rows: r, pitch: p, legible: f.legible, group: f.group });
  }

  /* stack algorithm shared by columns/rows/wall: groups of marks stacked along u (length L), wrapping into
     sub-lanes across v (extent W). Returns the largest cell pitch that fits every group. */
  function bandFit(counts, L, W, gapG, gapFrac, min) {
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    let lo = 1, hi = Math.min(L, W, 60), best = null;
    for (let p = hi; p >= 1; p -= 0.25) {
      const cap = Math.max(1, Math.floor(L / p)); let need = 0;
      for (const c of counts) need += Math.max(1, Math.ceil(c / cap)) * p;
      need += gapG * Math.max(0, counts.length - 1);
      if (need <= W + 1e-9) { best = { p, cap, need }; break; }
    }
    if (!best) { const p = lo, cap = Math.max(1, Math.floor(L / p)); best = { p, cap, need: W }; }
    return best;
  }
  function bands(kind, groups, box, opts) {
    opts = opts || {}; box = B(box);
    const gs = groups.map((g, k) => {
      if (typeof g === 'number') return { n: g, label: opts.labels ? opts.labels[k] : undefined, idx: null };
      if (Array.isArray(g)) return { n: g.length, label: opts.labels ? opts.labels[k] : undefined, idx: g };
      return { n: g.n != null ? g.n : g.idx.length, label: g.label, idx: g.idx || null };
    });
    const vert = kind === 'columns', L = vert ? box.h : box.w, W = vert ? box.w : box.h;
    const gapG = opts.groupGap == null ? 14 : opts.groupGap, counts = gs.map((g) => g.n);
    const bf = bandFit(counts, L, W, gapG, GAP, MIN), p = bf.p, s = p * (1 - GAP);
    const slack = Math.max(0, W - bf.need), lead = opts.spread ? 0 : slack / 2;
    const extraGap = opts.spread && gs.length > 1 ? slack / (gs.length - 1) : 0;
    const items = [], info = []; let v = lead, next = 0;
    gs.forEach((g, k) => {
      const lanes = Math.max(1, Math.ceil(g.n / bf.cap)), v0 = v;
      for (let j = 0; j < g.n; j++) {
        const lane = Math.floor(j / bf.cap), pos = j % bf.cap, id = g.idx ? g.idx[j] : next++;
        const u = pos * p + p / 2, w = v + lane * p + p / 2;           // u along the stack, w across
        const x = vert ? box.x + w : box.x + u, y = vert ? box.y + box.h - u : box.y + w;
        items.push(mk(id, x, y, s, k));
      }
      const span = lanes * p;
      info.push({ g: k, n: g.n, label: g.label, lanes, cx: vert ? box.x + v0 + span / 2 : box.x + L / 2, cy: vert ? box.y + box.h : box.y + v0 + span / 2,
        x: vert ? box.x + v0 : box.x, y: vert ? box.y : box.y + v0, w: vert ? span : L, h: vert ? L : span });
      v += span + gapG + extraGap;
    });
    items.sort((a, b) => a.i - b.i);
    return out(kind, items.length, box, s, items, { pitch: p, cap: bf.cap, groups: info, legible: s >= MIN - 1e-9 });
  }
  /* columns(groups, box): one stack per group growing upward from the baseline; groups are counts, {n,label}
     or arrays of mark indices (identity-preserving so a transition from grid keeps each mark). */
  const columns = (groups, box, opts) => bands('columns', groups, box, opts);
  /* rows(groups, box): the transpose; one band per group, filling left to right, bands stacked downward. */
  const rows = (groups, box, opts) => bands('rows', groups, box, opts);

  /* wall(n, box, sortKey): a stacked histogram, each mark a brick, sorted by key into bins left to right.
     sortKey: array of n values or fn(i); default is a fixed bell-ish key. Marks keep their index. */
  function wall(n, box, sortKey, opts) {
    box = B(box);
    const key = Array.isArray(sortKey) ? (i) => sortKey[i] : typeof sortKey === 'function' ? sortKey
      : (i) => ((i * 0.6180339887) % 1 + (i * 0.7548776662) % 1 + (i * 0.5698402910) % 1) / 3;
    const vals = Array.from({ length: n }, (_, i) => key(i)), mn = Math.min(...vals), mx = Math.max(...vals) || 1, span = mx - mn || 1;
    let best = null;
    for (let p = Math.min(box.h, 40); p >= 1; p -= 0.25) {
      const nb = Math.max(1, Math.floor(box.w / p)), hist = new Array(nb).fill(0);
      vals.forEach((v) => { hist[Math.min(nb - 1, Math.floor((v - mn) / span * nb))]++; });
      if (Math.max(...hist) * p <= box.h + 1e-9) { best = { p, nb }; break; }
      if (p <= 1.25) best = { p: 1, nb };
    }
    const p = best.p, nb = best.nb, s = p * (1 - GAP), fill = new Array(nb).fill(0), order = vals.map((v, i) => i).sort((a, b) => vals[a] - vals[b] || a - b);
    const x0 = box.x + (box.w - nb * p) / 2 + p / 2, items = new Array(n);
    order.forEach((i) => { const b = Math.min(nb - 1, Math.floor((vals[i] - mn) / span * nb)); items[i] = mk(i, x0 + b * p, box.y + box.h - fill[b]++ * p - p / 2, s, b); });
    return out('wall', n, box, s, items, { pitch: p, bins: nb, heights: fill });
  }

  /* ring(n, r, opts): n marks on concentric rings, outer radius r, centre opts.cx/cy (default 480,270).
     One ring when it holds at legible size, else filled inward like a vinyl record. */
  function ring(n, r, opts) {
    opts = opts || {}; const cx = opts.cx == null ? 480 : opts.cx, cy = opts.cy == null ? 270 : opts.cy;
    const inner = opts.inner == null ? r * 0.12 : opts.inner;
    let best = null;
    for (let p = Math.min(r, 40); p >= 1; p -= 0.25) {
      const rs = []; for (let rr = r - p / 2; rr >= inner + p / 2 - 1e-9; rr -= p) rs.push(rr);
      const caps = rs.map((q) => Math.max(1, Math.floor(2 * Math.PI * q / p)));
      if (caps.reduce((a, b) => a + b, 0) >= n) { best = { p, rs, caps }; break; }
    }
    if (!best) { const p = 1, rs = [r - 0.5], caps = [n]; best = { p, rs, caps }; }
    const { p, rs, caps } = best, s = p * (1 - GAP), tot = caps.reduce((a, b) => a + b, 0);
    /* give each ring a share of n proportional to capacity so the disc stays even, outer rings first */
    const share = caps.map((c) => Math.round(n * c / tot)); let d = n - share.reduce((a, b) => a + b, 0); for (let k = 0; d !== 0; k = (k + 1) % share.length) { share[k] += Math.sign(d); d -= Math.sign(d); }
    const items = []; let i = 0;
    rs.forEach((q, k) => { for (let j = 0; j < share[k] && i < n; j++, i++) { const th = -Math.PI / 2 + (j / share[k]) * Math.PI * 2 + (k % 2) * Math.PI / share[k]; const m = mk(i, cx + q * Math.cos(th), cy + q * Math.sin(th), s, k); m.rot = th; m.r = q; items.push(m); } });
    return out('ring', n, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r }, s, items, { pitch: p, rings: rs.length, cx, cy, r });
  }

  /* timeline(events, box): events are numbers (times) or {t,label,...}. x by time on an axis at the box centre
     line; labels alternate above/below in the first lane that stays clear (opts.labelW, default 70 units). */
  function timeline(events, box, opts) {
    opts = opts || {}; box = B(box);
    const ev = events.map((e, i) => Object.assign({ i, t: i }, typeof e === 'number' ? { t: e } : e));
    const t0 = Math.min(...ev.map((e) => e.t)), t1 = Math.max(...ev.map((e) => e.t)), span = t1 - t0 || 1;
    const pad = opts.pad == null ? 40 : opts.pad, lw = opts.labelW || 70, laneH = opts.laneH || 30, ay = box.y + box.h / 2;
    const s = clamp(opts.size || 12, MIN, 40), maxLane = Math.max(1, Math.floor((box.h / 2 - 16) / laneH));
    const ends = { up: [], down: [] }, items = [];
    const order = ev.map((e, k) => k).sort((a, b) => ev[a].t - ev[b].t);
    let flip = 0;
    order.forEach((k) => {
      const e = ev[k], x = box.x + pad + (e.t - t0) / span * (box.w - 2 * pad); let side = flip++ % 2 ? 'down' : 'up', lane = -1;
      for (const sd of [side, side === 'up' ? 'down' : 'up']) { const L = ends[sd]; for (let l = 0; l < maxLane; l++) if (L[l] === undefined || x - lw / 2 >= L[l]) { lane = l; side = sd; break; } if (lane >= 0) break; }
      if (lane < 0) lane = 0;
      ends[side][lane] = x + lw / 2;
      const dir = side === 'up' ? -1 : 1, m = mk(e.i, x, ay, s, 0); m.t = e.t; m.label = e.label; m.side = side; m.lane = lane;
      m.stem = { x1: x, y1: ay, x2: x, y2: ay + dir * (14 + lane * laneH) }; m.ly = ay + dir * (24 + lane * laneH); items[e.i] = m;
    });
    return out('timeline', ev.length, box, s, items.filter(Boolean), { axis: { x1: box.x + pad / 2, x2: box.x + box.w - pad / 2, y: ay }, t0, t1 });
  }

  /* tree(nodes, box): nodes are parent indices (-1/null root) or {parent}. Tidy layout: children laid left to
     right, subtrees pushed apart only as far as their contours demand, parents centred over their children. */
  function tree(nodes, box, opts) {
    opts = opts || {}; box = B(box); const n = nodes.length;
    const par = nodes.map((d) => (typeof d === 'number' ? d : d == null || d.parent == null ? -1 : d.parent));
    const kids = Array.from({ length: n }, () => []); let root = 0;
    par.forEach((p, i) => { if (p < 0 || p == null) root = i; else kids[p].push(i); });
    const depth = new Array(n).fill(0), rel = new Array(n).fill(0), sep = 1;
    const place = (v, d) => {                                           // returns contours {L:[], R:[]} relative to v
      depth[v] = d; const ks = kids[v]; if (!ks.length) return { L: [0], R: [0] };
      const cs = ks.map((k) => place(k, d + 1)); const off = [0]; let accR = cs[0].R.slice();
      for (let k = 1; k < ks.length; k++) {
        let sh = -Infinity; for (let l = 0; l < Math.min(accR.length, cs[k].L.length); l++) sh = Math.max(sh, accR[l] - cs[k].L[l] + sep);
        off.push(sh); for (let l = 0; l < cs[k].R.length; l++) accR[l] = l < accR.length ? Math.max(accR[l], cs[k].R[l] + sh) : cs[k].R[l] + sh;
      }
      const mid = (off[0] + off[ks.length - 1]) / 2, L = [0], R = [0];
      ks.forEach((k, j) => { rel[k] = off[j] - mid; });
      const depthMax = Math.max(...cs.map((c) => c.L.length));
      for (let l = 0; l < depthMax; l++) { let lo = Infinity, hi = -Infinity; cs.forEach((c, j) => { if (l < c.L.length) { lo = Math.min(lo, c.L[l] + off[j] - mid); hi = Math.max(hi, c.R[l] + off[j] - mid); } }); L.push(lo); R.push(hi); }
      return { L, R };
    };
    place(root, 0);
    const absx = new Array(n).fill(0); const walk = (v, x) => { absx[v] = x; kids[v].forEach((k) => walk(k, x + rel[k])); }; walk(root, 0);
    const mn = Math.min(...absx), mx = Math.max(...absx), maxD = Math.max(...depth), cols = mx - mn + 1, lv = maxD + 1;
    const px = box.w / cols, py = box.h / lv, s = clamp(Math.min(px * 0.7, py * 0.5, opts.maxSize || 22), 1, 1e9);
    const items = [], edges = [];
    for (let i = 0; i < n; i++) { const m = mk(i, box.x + (absx[i] - mn + 0.5) * px, box.y + (depth[i] + 0.5) * py, s, depth[i]); m.depth = depth[i]; m.parent = par[i]; m.leaf = kids[i].length === 0; items.push(m); }
    for (let i = 0; i < n; i++) if (par[i] >= 0) edges.push({ from: par[i], to: i, x1: items[par[i]].x, y1: items[par[i]].y, x2: items[i].x, y2: items[i].y });
    return out('tree', n, box, s, items, { edges, root, depth: maxD });
  }

  /* scatter(n, box, seed): blue-noise (Mitchell best-candidate) so no two marks crowd; seeded, reproducible. */
  function scatter(n, box, seed, opts) {
    box = B(box); const rnd = mulberry32(seed == null ? 1 : seed), K = (opts && opts.candidates) || 8, f = fit(box, n, opts);
    const s = f.size * ((opts && opts.shrink) || 0.65), pad = s / 2, pts = [];
    for (let i = 0; i < n; i++) {
      let bx = 0, by = 0, bd = -1;
      for (let k = 0; k < (i ? K : 1); k++) {
        const x = box.x + pad + rnd() * (box.w - 2 * pad), y = box.y + pad + rnd() * (box.h - 2 * pad); let d = Infinity;
        for (let j = 0; j < i; j++) { const dx = pts[j][0] - x, dy = pts[j][1] - y, q = dx * dx + dy * dy; if (q < d) d = q; }
        if (d > bd) { bd = d; bx = x; by = y; }
      }
      pts.push([bx, by]);
    }
    return out('scatter', n, box, s, pts.map((q, i) => mk(i, q[0], q[1], s, 0)), { legible: s >= MIN - 1e-9, group: f.group });
  }

  /* transition(A, B, u, opts): interpolate by index. opts.stagger 0..1 spreads start times across opts.by
     ('index' | 'x' | 'y' | fn(item)->0..1 of the destination), opts.arc bends each path sideways (units),
     opts.ease (default smoothstep). Marks present in only one layout fade (a). Pure in u. */
  function transition(LA, LB, u, opts) {
    opts = opts || {}; const st = clamp(opts.stagger || 0, 0, 0.95), ease = opts.ease || smooth, arc = opts.arc || 0;
    const n = Math.max(LA.items.length, LB.items.length), by = opts.by || 'index', items = [];
    const rankOf = typeof by === 'function' ? by : by === 'x' ? (m) => (m.x - LB.box.x) / (LB.box.w || 1) : by === 'y' ? (m) => (m.y - LB.box.y) / (LB.box.h || 1) : (m, i) => (n > 1 ? i / (n - 1) : 0);
    const sa = LA.items, sb = LB.items;
    for (let i = 0; i < n; i++) {
      const a = sa[i], b = sb[i], from = a || b, to = b || a;
      const d = st * clamp(rankOf(to, i), 0, 1), v = clamp((u - d) / (1 - st), 0, 1), e = ease(v);
      let x = lerp(from.x, to.x, e), y = lerp(from.y, to.y, e);
      if (arc) { const dx = to.x - from.x, dy = to.y - from.y, len = Math.hypot(dx, dy) || 1, bend = Math.sin(Math.PI * e) * arc * Math.min(1, len / 200); x += -dy / len * bend; y += dx / len * bend; }
      const m = Object.assign({}, to, { i: to.i, x, y, w: lerp(from.w, to.w, e), h: lerp(from.h, to.h, e), g: e < 0.5 ? from.g : to.g, a: (a ? 1 : e) * (b ? 1 : 1 - e) * lerp(from.a, to.a, e), hl: e < 0.5 ? from.hl : to.hl });
      if (from.rot != null || to.rot != null) m.rot = lerp(from.rot || 0, to.rot || 0, e);
      items.push(m);
    }
    const k = u < 0.5 ? LA : LB;
    return { kind: 'transition', from: LA.kind, to: LB.kind, u, n, box: LB.box, size: lerp(LA.size, LB.size, ease(u)), legible: LA.legible && LB.legible, items, groups: k.groups, edges: u >= 1 ? LB.edges : undefined };
  }

  /* highlight(layout, predicate): flags items where predicate(item, i) is truthy; returns a new layout plus hits. */
  function highlight(L, pred) {
    const hits = []; const items = L.items.map((m, i) => { const h = !!pred(m, i); if (h) hits.push(m.i); return Object.assign({}, m, { hl: h }); });
    return Object.assign({}, L, { items, hits, hitCount: hits.length });
  }

  Object.assign(A.structures, { fit, grid, wall, ring, columns, rows, timeline, tree, scatter, transition, highlight, mulberry32, MIN });
  if (typeof module !== 'undefined' && module.exports) module.exports = A.structures;
})(typeof window !== 'undefined' ? window : globalThis);
